/**
 * API 服务层
 * 封装所有后端接口调用
 */

import { get, post, patch, del, upload } from '@/utils/request'
import type { Article } from '@/types/app/article'
import type { Cate } from '@/types/app/cate'
import type { Tag } from '@/types/app/tag'
import type { Comment } from '@/types/app/comment'
import type { User } from '@/types/app/user'
import type { Wall } from '@/types/app/wall'
import type { Record as RecordType } from '@/types/app/record'
import type { Footprint } from '@/types/app/footprint'
import type { Link } from '@/types/app/web'
import type { Swiper } from '@/types/app/swiper'

// ==================== 文章相关 ====================

/**
 * 分页查询文章列表
 */
export const getArticleList = (params: {
  page?: number
  size?: number
  key?: string
  cateId?: number
  tagId?: number
  isDraft?: number
  isDel?: number
}) => {
  const { page = 1, size = 10, ...filterData } = params
  return post<Paginate<Article[]>>('/article/paging', filterData, {
    params: { page, size },
  })
}

/**
 * 获取文章详情
 */
export const getArticleDetail = (id: number, password?: string) => {
  return get<Article>(`/article/${id}`, { password })
}

/**
 * 新增文章
 */
export const createArticle = (data: Partial<Article>) => {
  return post<string>('/article', data)
}

/**
 * 编辑文章
 */
export const updateArticle = (data: Partial<Article>) => {
  return patch<string>('/article', data)
}

/**
 * 删除文章
 */
export const deleteArticle = (id: number, isDel: number = 0) => {
  return del<string>(`/article/${id}/${isDel}`)
}

/**
 * 批量删除文章
 */
export const batchDeleteArticle = (ids: number[]) => {
  return del<string>('/article/batch', ids)
}

/**
 * 获取随机文章
 */
export const getRandomArticles = (count: number = 5) => {
  return get<Article[]>('/article/random', { count })
}

/**
 * 获取热门文章
 */
export const getHotArticles = (count: number = 5) => {
  return get<Article[]>('/article/hot', { count })
}

/**
 * 获取指定分类的文章列表
 */
export const getArticlesByCategory = (cateId: number, page: number = 1, size: number = 10) => {
  return get(`/article/cate/${cateId}`, { page, size })
}

/**
 * 获取指定标签的文章列表
 */
export const getArticlesByTag = (tagId: number, page: number = 1, size: number = 10) => {
  return get(`/article/tag/${tagId}`, { page, size })
}

/**
 * 记录文章浏览量
 */
export const recordArticleView = (articleId: number) => {
  return get<string>(`/article/view/${articleId}`)
}

// ==================== 分类相关 ====================

/**
 * 获取分类列表
 */
export const getCategoryList = (pattern: 'recursion' | 'list' = 'recursion') => {
  return post<Cate[]>('/cate/list', null, { params: { pattern } })
}

/**
 * 分页查询分类列表
 */
export const getCategoryPaging = (page: number = 1, size: number = 10) => {
  return post('/cate/paging', null, { params: { page, size } })
}

/**
 * 获取分类详情
 */
export const getCategoryDetail = (id: number) => {
  return get<Cate>(`/cate/${id}`)
}

/**
 * 新增分类
 */
export const createCategory = (data: Partial<Cate>) => {
  return post<string>('/cate', data)
}

/**
 * 编辑分类
 */
export const updateCategory = (data: Partial<Cate>) => {
  return patch<string>('/cate', data)
}

/**
 * 删除分类
 */
export const deleteCategory = (id: number) => {
  return del<string>(`/cate/${id}`)
}

/**
 * 获取每个分类中的文章数量
 */
export const getCategoryArticleCount = () => {
  return get('/cate/article/count')
}

// ==================== 标签相关 ====================

/**
 * 获取标签列表
 */
export const getTagList = () => {
  return post<Tag[]>('/tag/list')
}

/**
 * 分页查询标签列表
 */
export const getTagPaging = (page: number = 1, size: number = 10) => {
  return post('/tag/paging', null, { params: { page, size } })
}

/**
 * 获取标签详情
 */
export const getTagDetail = (id: number) => {
  return get<Tag>(`/tag/${id}`)
}

/**
 * 新增标签
 */
export const createTag = (data: Partial<Tag>) => {
  return post<string>('/tag', data)
}

/**
 * 编辑标签
 */
export const updateTag = (data: Partial<Tag>) => {
  return patch<string>('/tag', data)
}

/**
 * 删除标签
 */
export const deleteTag = (id: number) => {
  return del<string>(`/tag/${id}`)
}

/**
 * 统计每个标签下的文章数量
 */
export const getTagArticleCount = () => {
  return get('/tag/article/count')
}

// ==================== 用户相关 ====================

/**
 * 用户登录
 */
export const userLogin = (data: { username: string; password: string }) => {
  return post<{ token: string; user: User }>('/user/login', data)
}

/**
 * 获取作者信息
 */
export const getAuthorInfo = () => {
  return get<User>('/user/author')
}

/**
 * 校验 Token 是否有效
 */
export const checkToken = (token: string) => {
  return get('/user/check', { token })
}

/**
 * 获取用户列表
 */
export const getUserList = (filterData?: {
  key?: string
  startDate?: string
  endDate?: string
}) => {
  return post<User[]>('/user/list', filterData)
}

/**
 * 获取用户详情
 */
export const getUserDetail = (id: number) => {
  return get<User>(`/user/${id}`)
}

/**
 * 新增用户
 */
export const createUser = (data: Partial<User>) => {
  return post<string>('/user', data)
}

/**
 * 编辑用户信息
 */
export const updateUser = (data: Partial<User>) => {
  return patch<string>('/user', data)
}

/**
 * 修改用户密码
 */
export const updateUserPassword = (data: {
  oldUsername: string
  newUsername: string
  oldPassword: string
  newPassword: string
}) => {
  return patch<string>('/user/pass', data)
}

/**
 * 删除用户
 */
export const deleteUser = (id: number) => {
  return del<string>(`/user/${id}`)
}

// ==================== 评论相关 ====================

/**
 * 获取评论列表
 */
export const getCommentList = (filterData?: {
  key?: string
  startDate?: string
  endDate?: string
  pattern?: 'list' | 'tree'
  status?: number
  content?: string
}) => {
  return post<Comment[]>('/comment/list', filterData)
}

/**
 * 分页查询评论列表
 */
export const getCommentPaging = (
  params: {
    page?: number
    size?: number
  },
  filterData?: any,
) => {
  const { page = 1, size = 10 } = params
  return post('/comment/paging', filterData, { params: { page, size } })
}

/**
 * 获取指定文章的评论
 */
export const getArticleComments = (articleId: number, page: number = 1, size: number = 10) => {
  return post(`/comment/article/${articleId}`, null, { params: { page, size } })
}

/**
 * 新增评论
 */
export const createComment = (data: Partial<Comment>) => {
  return post<string>('/comment', data)
}

/**
 * 编辑评论
 */
export const updateComment = (data: Partial<Comment>) => {
  return patch<string>('/comment', data)
}

/**
 * 删除评论
 */
export const deleteComment = (id: number) => {
  return del<string>(`/comment/${id}`)
}

/**
 * 审核评论
 */
export const auditComment = (id: number) => {
  return patch(`/comment/audit/${id}`)
}

// ==================== 留言相关 ====================

/**
 * 获取留言列表
 */
export const getWallList = (filterData?: {
  key?: string
  startDate?: string
  endDate?: string
  cateId?: number
  status?: number
}) => {
  return post<Wall[]>('/wall/list', filterData)
}

/**
 * 分页查询留言列表
 */
export const getWallPaging = (
  params: {
    page?: number
    size?: number
  },
  filterData?: any,
) => {
  const { page = 1, size = 10 } = params
  return post('/wall/paging', filterData, { params: { page, size } })
}

/**
 * 获取留言分类列表
 */
export const getWallCateList = () => {
  return get('/wall/cate')
}

/**
 * 新增留言
 */
export const createWall = (data: Partial<Wall>) => {
  return post<string>('/wall', data)
}

/**
 * 编辑留言
 */
export const updateWall = (data: Partial<Wall>) => {
  return patch<string>('/wall', data)
}

/**
 * 删除留言
 */
export const deleteWall = (id: number) => {
  return del<string>(`/wall/${id}`)
}

/**
 * 审核留言
 */
export const auditWall = (id: number) => {
  return patch(`/wall/audit/${id}`)
}

/**
 * 设置/取消精选留言
 */
export const toggleWallChoice = (id: number) => {
  return patch(`/wall/choice/${id}`)
}

// ==================== 说说相关 ====================

/**
 * 获取说说列表
 */
export const getRecordList = (filterData?: FilterData) => {
  return post<RecordType[]>('/record/list', filterData)
}

/**
 * 分页查询说说列表
 */
export const getRecordPaging = (
  params: {
    page?: number
    size?: number
  },
  filterData?: FilterData,
) => {
  const { page = 1, size = 10 } = params
  return post('/record/paging', filterData, { params: { page, size } })
}

/**
 * 新增说说
 */
export const createRecord = (data: Partial<RecordType>) => {
  return post<string>('/record', data)
}

/**
 * 编辑说说
 */
export const updateRecord = (data: Partial<RecordType>) => {
  return patch<string>('/record', data)
}

/**
 * 删除说说
 */
export const deleteRecord = (id: number) => {
  return del<string>(`/record/${id}`)
}

// ==================== 足迹相关 ====================

/**
 * 获取足迹列表
 */
export const getFootprintList = (filterData?: FilterData) => {
  return post<Footprint[]>('/footprint/list', filterData)
}

/**
 * 新增足迹
 */
export const createFootprint = (data: Partial<Footprint>) => {
  return post<string>('/footprint', data)
}

/**
 * 编辑足迹
 */
export const updateFootprint = (data: Partial<Footprint>) => {
  return patch<string>('/footprint', data)
}

/**
 * 删除足迹
 */
export const deleteFootprint = (id: number) => {
  return del<string>(`/footprint/${id}`)
}

// ==================== 网站/友链相关 ====================

/**
 * 获取网站列表
 */
export const getLinkList = (filterData?: {
  key?: string
  startDate?: string
  endDate?: string
  status?: number
}) => {
  return post<Link[]>('/link/list', filterData)
}

/**
 * 分页查询网站列表
 */
export const getLinkPaging = (
  params: {
    page?: number
    size?: number
  },
  filterData?: any,
) => {
  const { page = 1, size = 10 } = params
  return post('/link/paging', filterData, { params: { page, size } })
}

/**
 * 获取网站类型列表
 */
export const getLinkTypeList = () => {
  return get('/link/type')
}

/**
 * 新增网站
 */
export const createLink = (data: Partial<Link>) => {
  return post<string>('/link', data)
}

/**
 * 编辑网站
 */
export const updateLink = (data: Partial<Link>) => {
  return patch<string>('/link', data)
}

/**
 * 删除网站
 */
export const deleteLink = (id: number) => {
  return del<string>(`/link/${id}`)
}

/**
 * 审核网站
 */
export const auditLink = (id: number) => {
  return patch(`/link/audit/${id}`)
}

// ==================== 轮播图相关 ====================

/**
 * 获取轮播图列表
 */
export const getSwiperList = () => {
  return post<Swiper[]>('/swiper/list')
}

/**
 * 分页查询轮播图列表
 */
export const getSwiperPaging = (page: number = 1, size: number = 10) => {
  return post('/swiper/paging', null, { params: { page, size } })
}

/**
 * 新增轮播图
 */
export const createSwiper = (data: Partial<Swiper>) => {
  return post<string>('/swiper', data)
}

/**
 * 编辑轮播图
 */
export const updateSwiper = (data: Partial<Swiper>) => {
  return patch<string>('/swiper', data)
}

/**
 * 删除轮播图
 */
export const deleteSwiper = (id: number) => {
  return del<string>(`/swiper/${id}`)
}

// ==================== 文件管理相关 ====================

/**
 * 上传文件
 */
export const uploadFile = (files: File[], dir?: string) => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  if (dir) {
    formData.append('dir', dir)
  }
  return upload<any>('/file', formData)
}

/**
 * 获取文件列表
 */
export const getFileList = (dir: string, page: number = 1, size: number = 20) => {
  return get('/file/list', { dir, page, size })
}

/**
 * 获取文件信息
 */
export const getFileInfo = (filePath: string) => {
  return get('/file/info', { filePath })
}

/**
 * 删除文件
 */
export const deleteFile = (filePath: string) => {
  return del('/file', null, { params: { filePath } })
}

/**
 * 批量删除文件
 */
export const batchDeleteFile = (filePaths: string[]) => {
  return del('/file/batch', filePaths)
}

/**
 * 获取目录列表
 */
export const getDirList = () => {
  return get('/file/dir')
}

// ==================== 配置相关 ====================

/**
 * 获取网站配置列表
 */
export const getWebConfigList = () => {
  return get('/web_config/list')
}

/**
 * 根据 ID 获取网站配置
 */
export const getWebConfigById = (id: number) => {
  return get(`/web_config/${id}`)
}

/**
 * 根据名称获取网站配置
 */
export const getWebConfigByName = (name: string) => {
  return get(`/web_config/name/${name}`)
}

/**
 * 更新网站配置
 */
export const updateWebConfig = (id: number, value: Record<string, any>) => {
  return patch(`/web_config/json/${id}`, value)
}

/**
 * 获取页面配置列表
 */
export const getPageConfigList = () => {
  return get('/page_config/list')
}

/**
 * 根据名称获取页面配置
 */
export const getPageConfigByName = (name: string) => {
  return get(`/page_config/name/${name}`)
}

// ==================== 数据统计相关 ====================

/**
 * 获取网站统计数据
 */
export const getStatistics = (params: {
  type: 'basic' | 'overview' | 'new-visitor' | 'basic-overview'
  startDate?: string
  endDate?: string
}) => {
  return get('/statis', params)
}

// ==================== 订阅相关 ====================

/**
 * 获取订阅内容列表
 */
export const getRssList = () => {
  return get('/rss/list')
}

/**
 * 分页查询订阅内容
 */
export const getRssPaging = (page: number = 1, size: number = 10) => {
  return post('/rss/paging', null, { params: { page, size } })
}
