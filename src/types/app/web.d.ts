export interface WebType {
  id: number
  name: string
  order: number
  isAdmin: number
}

export interface Web {
  id: number
  title: string
  description: string
  email: string
  image: string
  url: string
  rss: string
  order: number
  typeId: number
  type: WebType
  auditStatus: number
  createTime?: string
  h_captcha_response: string
}

// 后端使用 Link 和 LinkType 命名，添加类型别名
export type Link = Web
export type LinkType = WebType
