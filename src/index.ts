type success<T> = (data: T) => void | Promise<void>
type fail = (error: string) => string | void
type final = () => void
type load = () => void
type transform<T, RT> = (data: T, action: { fail: (error: string) => Error }) => RT | Error
type validate<T> = (data: T) => void | string | Promise<string> | Promise<void> | boolean
type generator<T> = () => Promise<T>
export interface IWRequestState<T = any> {
  next(): number
  isValid(index: number): boolean

  status: {
    loading: boolean
    error: string
  }

  fire: {
    load(): void
    success(data: T): void
    fail(error: string): string
    final(): void
  }

  load(callback: () => void): void
  success(callback: (data: T) => void): void
  fail(callback: (error: string) => string | void): void
  final(callback: () => void): void
}

export default class WRequest<T> {
  private dataHandlers: Array<{
    type: 'success',
    callback: success<T>
  } | {
    type: 'transform',
    callback: transform<T, any>
  } | {
    type: 'validate',
    callback: validate<T>
  }> = []
  private promiseTransforms: Array<(generator: generator<T>, callback: (generator: generator<T>) => void) => void> = []
  private failCallback: fail[] = []
  private finalCallback: final[] = []
  private loadCallback: load[] = []
  public debug: {
    log(): WRequest<T>
    delay(time?: number): WRequest<T>
    success(data: T): WRequest<T>
    fail(error: string): WRequest<T>
  }
  private myState?: IWRequestState<T>
  constructor(private generator: generator<T>) {
    this.debug = {
      log: () => {
        this.success(console.log)
        return this
      },
      delay: (time = 1000) => {
        this.promiseTransforms.push((generator, callback) => {
          setTimeout(() => callback(generator), time)
        })
        return this
      },
      success: (data) => {
        this.promiseTransforms.push((generator, callback) => {
          callback(() => Promise.resolve(data))
        })
        return this
      },
      fail: error => {
        this.promiseTransforms.push((generator, callback) => {
          callback(() => Promise.reject(error))
        })
        return this
      }
    }
    setTimeout(() => this.query())
  }
  private async transformPromise(generator: generator<T>, callback: (generator: generator<T>) => void) { 
    for (const transform of this.promiseTransforms) {
      await new Promise(resolve => {
        transform(generator, g => {
          generator = g
          resolve()
        })
      })
    }
    callback(generator)
  }
  private query() {
    const index = this.myState?.next() ?? 0
    for (const load of this.loadCallback) {
      load()
    }
    const generator = () => this.generator()
    if (this.promiseTransforms.length) {
      this.transformPromise(generator, generator => {
        this.handle(generator(), index)
      })
    } else {
      this.handle(generator(), index)
    }
  }
  private handle(api: Promise<T>, index: number) {
    return api.then(async (data) => {
      if (this.myState?.isValid(index) === false) {
        return console.log('重复的请求')
      }
      for (const handler of this.dataHandlers) {
        if (handler.type === 'success') {
          await handler.callback(data)
        } else if (handler.type === 'transform') {
          const result = handler.callback(data, { fail: message => new Error(message) })
          if (result instanceof Error) {
            return Promise.reject(result.message)
          } else {
            data = result
          }
        } else if (handler.type === 'validate') {
          const result = await handler.callback(data)
          if (result !== undefined && result !== true) {
            return Promise.reject(
              typeof result === 'string' ? result : '返回数据错误'
            )
          }
        }
      }
    }).catch((error: any) => {
      if (this.myState?.isValid(index) === false) {
        return console.log('重复的请求')
      }
      if (typeof error === 'string' || error instanceof Error) {
        let err: string | void = typeof error === 'string' ? error : error.message
        for (const fail of this.failCallback) {
          if (err) {
            err = fail(err)
          } else {
            break
          }
        }
      } else {
        console.log('运行错误', error)
      }
    }).finally(() => {
      if (this.myState?.isValid(index) === false) {
        return console.log('重复的请求')
      }
      for (const final of this.finalCallback) {
        final()
      }
      this.destory()
    })
  }
  private destory() {
    this.dataHandlers = []
    this.failCallback = []
    this.finalCallback = []
    this.promiseTransforms = []
    this.myState = undefined
  }
  load(callback: load) {
    this.loadCallback.push(callback)
    return this
  }
  map<RT>(callback: transform<T, RT>) {
    return this.transform(callback)
  }
  transform<RT>(callback: transform<T, RT>) {
    this.dataHandlers.push({
      type: 'transform',
      callback
    })
    return this as unknown as WRequest<RT>
  }
  success(callback: success<T>) {
    this.dataHandlers.push({
      type: 'success',
      callback
    })
    return this
  }
  fail(callback: fail) {
    this.failCallback.unshift(callback)
    return this
  }
  final(callback: final) {
    this.finalCallback.push(callback)
    return this
  }
  validate(callback: validate<T>) {
    this.dataHandlers.push({
      type: 'validate',
      callback
    })
    return this
  }
  state(state: IWRequestState<T>) {
    this.myState = state
    this.load(state.fire.load)
    this.success(state.fire.success)
    this.fail(state.fire.fail)
    this.final(state.fire.final)
    return this
  }
}