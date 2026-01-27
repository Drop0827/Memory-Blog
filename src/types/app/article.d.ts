import { Cate } from './cate'
import { Tag } from './tag'

export type Status = 'default' | 'no_home' | 'hide'

export interface Config {
  id?: number
  articleId?: number
  status?: Status
  password?: string
  isEncrypt?: number
  isDel?: number
  isDraft?: number
}

export interface Article {
  id?: number
  title: string
  description?: string
  content: string
  cover?: string
  cateIds?: number[] // 后端返回的是数组
  cateList?: Cate[]
  tagIds?: number[] // 后端返回的是数组
  tagList?: Tag[]
  view?: number
  comment?: number
  config?: Config
  prev?: { id: number; title: string }
  next?: { id: number; title: string }
  createTime: string
}
