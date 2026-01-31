export interface Rss {
  id?: number // Optional if not returned by backend, but useful for keys
  author: string
  image: string
  email: string
  type: string
  title: string
  description: string
  url: string
  createTime?: string
}
