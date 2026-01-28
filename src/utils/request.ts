import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'

// 从环境变量中获取后端 API 地址
const BASE_URL = import.meta.env.VITE_PROJECT_API || 'http://localhost:8080/api'

// 创建 Axios 实例
const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加 Token
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token（登录功能会用到）
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器 - 统一处理响应
request.interceptors.response.use(
  (response) => {
    const res = response.data as ResponseData<any>

    // 后端返回的成功状态码是 200
    if (res.code === 200) {
      return response // 返回完整的 response 对象才符合 Axios 类型要求
    } else {
      // 处理业务错误
      console.error('业务错误：', res.message)
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  (error) => {
    console.error('请求错误：', error.message)
    return Promise.reject(error)
  },
)

// 封装通用请求方法
export default async <T>(
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<ResponseData<T>> => {
  try {
    const response = await request({
      method,
      url,
      ...(method.toUpperCase() === 'GET' ? { params: data } : { data }),
      ...config,
    })
    return response.data as ResponseData<T> // 返回 response.data
  } catch (error) {
    console.error('捕获到异常：', error)
    throw error
  }
}

// 导出常用的请求方法
// 导出常用的请求方法
export const get = <T>(url: string, params?: any, config?: AxiosRequestConfig) =>
  request
    .get<any, AxiosResponse<ResponseData<T>>>(url, { params, ...config })
    .then((res) => res.data)

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  request.post<any, AxiosResponse<ResponseData<T>>>(url, data, config).then((res) => res.data)

export const patch = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  request.patch<any, AxiosResponse<ResponseData<T>>>(url, data, config).then((res) => res.data)

export const del = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  request
    .delete<any, AxiosResponse<ResponseData<T>>>(url, { data, ...config })
    .then((res) => res.data)

// 文件上传专用方法
export const upload = async <T>(url: string, formData: FormData): Promise<ResponseData<T>> => {
  return request
    .post<any, AxiosResponse<ResponseData<T>>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
}
