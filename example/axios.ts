import WRequest from 'src/index'
import axios, { AxiosRequestConfig } from 'axios'

/**
 * 基础封装示例
 */
const service = axios.create()
function request<req, res>(config: AxiosRequestConfig) {
  return (data: req) => new WRequest(() => service({
    ...config,
    data
  }) as unknown as Promise<res>)
}

/**
 * api定义示例
 */
const api = request<{ keyword: string }, { id: string, name: string }[]>({
  url: 'api/test',
  method: 'POST'
})

/**
 * 使用示例
 */
api({
  keyword: 'test'
})
  

  // 增加请求延时
  .debug.delay(1000)

  // 使请求成功
  .debug.success([{ id: '1', name: 'test' }])
  
  // 使请求失败
  .debug.fail('测试错误')

  // 二次处理结果
  .map(data => {
    return data.map(item => {
      return {
        ...item,
        newProp: 'prop'
      }
    })
  })

  // 可以抛出错误
  .validate(data => {
    if (data.length === 0) {
      return '返回的数据为空'
    }
  })

  // 成功回调
  .success(data => {
    // code 
    // 注意data的类型推导
  })
  
  // 错误回调
  .fail(error => {
    // code
    return // 错误不继续往上抛
  })
  .fail(error => {
    // code
    return error // 返回给上一个错误处理
  })

  // 结束回调
  .final(() => {
    // code
  })