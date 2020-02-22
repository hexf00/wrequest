import { IWRequestState } from "."
import SCallback from "./scallback"

export default class WRequestState<T = any> implements IWRequestState<T> {
  private index = 0
  private cache?: Promise<T>
  private destoryCallback: Array<() => void> = []
  private callback: {
    load: SCallback
    success: SCallback<(data: T) => void>
    fail: SCallback<(error: string) => void>
    final: SCallback
  } = {
      load: new SCallback,
      success: new SCallback,
      fail: new SCallback,
      final: new SCallback
    }
  next() {
    return this.index = this.index + 1
  }
  isValid(index: number) {
    return this.index === index
  }
  getCache() {
    return this.cache
  }
  status: {
    loading: boolean
    error: string
  } = {
      loading: false,
      error: ''
    }
  fire: {
    load(): void
    success(data: T): void
    fail(error: string): string
    final(): void
  }
  load(callback: () => void) {
    this.destoryCallback.push(
      this.callback.load.bind(callback)
    )
  }
  success(callback: (data: T) => void) {
    this.destoryCallback.push(
      this.callback.success.bind(callback)
    )
  }
  fail(callback: (error: string) => string | void) {
    this.destoryCallback.push(
      this.callback.fail.bind(callback)
    )
  }
  final(callback: () => void) {
    this.destoryCallback.push(
      this.callback.final.bind(callback)
    )
  }
  constructor() {
    this.load(() => {
      this.status.loading = true
      this.status.error = ''
    })
    this.fail(error => {
      this.status.loading = false
      this.status.error = error
      return error
    })
    this.success(() => {
      this.status.loading = false
      this.status.error = ''
    })

    this.fire = {
      load: () => this.callback.load.fire(),
      success: (data) => this.callback.success.fire(data),
      fail: (error) => {
        this.callback.fail.fire(error)
        return error
      },
      final: () => this.callback.final.fire()
    }
  }
  destory() {
    this.destoryCallback.forEach(callback => callback())
    this.callback.load.destory()
    this.callback.success.destory()
    this.callback.fail.destory()
    this.callback.final.destory()
  }
}