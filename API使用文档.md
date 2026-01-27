# Memory Blog 前端 API 使用文档

## 概述

本项目已完成前后端 API 适配，所有后端接口都已封装在 `src/api/index.ts` 文件中。

## 环境配置

在 `.env` 文件中配置后端 API 地址：

```env
VITE_PROJECT_API=http://localhost:8080/api
```

## 请求工具

### 基础请求方法

```typescript
import request, { get, post, patch, del, upload } from '@/utils/request'

// 使用方式 1：通用请求方法
const result = await request<ResponseType>('GET', '/article/list', params)

// 使用方式 2：具名方法（推荐）
const result = await get<ResponseType>('/article/list', params)
const result = await post<ResponseType>('/article', data)
const result = await patch<ResponseType>('/article', data)
const result = await del<ResponseType>('/article/1')
```

### Token 自动处理

请求拦截器会自动从 `localStorage` 中获取 token 并添加到请求头：

```typescript
// 登录后保存 token
const { data } = await userLogin({ username, password })
localStorage.setItem('token', data.token)

// 后续请求会自动携带 token
const articles = await getArticleList({ page: 1, size: 10 })
```

## API 使用示例

### 1. 文章管理

#### 获取文章列表

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticleList } from '@/api'
import type { Article } from '@/types/app/article'

const articles = ref<Article[]>([])
const page = ref(1)
const size = ref(10)
const total = ref(0)

const fetchArticles = async () => {
  try {
    const { data } = await getArticleList({
      page: page.value,
      size: size.value,
      isDraft: 0, // 只获取已发布的文章
      isDel: 0, // 只获取未删除的文章
    })

    // 后端返回的分页结构
    articles.value = data.result
    total.value = data.total
  } catch (error) {
    console.error('获取文章列表失败：', error)
  }
}

onMounted(() => {
  fetchArticles()
})
</script>
```

#### 获取文章详情

```typescript
import { getArticleDetail, recordArticleView } from '@/api'

// 获取文章详情
const article = ref<Article | null>(null)

const fetchArticle = async (id: number) => {
  try {
    const { data } = await getArticleDetail(id)
    article.value = data

    // 记录浏览量
    await recordArticleView(id)
  } catch (error) {
    console.error('获取文章详情失败：', error)
  }
}
```

#### 按分类获取文章

```typescript
import { getArticlesByCategory } from '@/api'

const fetchCategoryArticles = async (cateId: number) => {
  try {
    const { data } = await getArticlesByCategory(cateId, 1, 10)
    console.log('分类文章：', data)
  } catch (error) {
    console.error('获取分类文章失败：', error)
  }
}
```

#### 获取推荐文章

```typescript
import { getHotArticles, getRandomArticles } from '@/api'

// 获取热门文章（浏览量最高）
const hotArticles = ref<Article[]>([])
const fetchHotArticles = async () => {
  const { data } = await getHotArticles(5) // 获取 5 篇
  hotArticles.value = data
}

// 获取随机文章
const randomArticles = ref<Article[]>([])
const fetchRandomArticles = async () => {
  const { data } = await getRandomArticles(5)
  randomArticles.value = data
}
```

### 2. 分类管理

#### 获取分类列表（树形结构）

```typescript
import { getCategoryList } from '@/api'
import type { Cate } from '@/types/app/cate'

const categories = ref<Cate[]>([])

const fetchCategories = async () => {
  try {
    // pattern: 'recursion' 返回树形结构，'list' 返回列表结构
    const { data } = await getCategoryList('recursion')
    categories.value = data
  } catch (error) {
    console.error('获取分类列表失败：', error)
  }
}
```

#### 获取分类文章数量统计

```typescript
import { getCategoryArticleCount } from '@/api'

const fetchCategoryStats = async () => {
  const { data } = await getCategoryArticleCount()
  console.log('分类统计：', data)
  // data: [{ name: 'Vue', count: 10 }, { name: 'React', count: 5 }]
}
```

### 3. 标签管理

```typescript
import { getTagList, getTagArticleCount } from '@/api'
import type { Tag } from '@/types/app/tag'

const tags = ref<Tag[]>([])

// 获取所有标签
const fetchTags = async () => {
  const { data } = await getTagList()
  tags.value = data
}

// 获取标签文章数量统计
const fetchTagStats = async () => {
  const { data } = await getTagArticleCount()
  console.log('标签统计：', data)
}
```

### 4. 用户管理

#### 用户登录

```typescript
import { userLogin } from '@/api'

const login = async () => {
  try {
    const { data } = await userLogin({
      username: 'admin',
      password: '123456',
    })

    // 保存 token
    localStorage.setItem('token', data.token)

    // 保存用户信息
    console.log('用户信息：', data.user)
  } catch (error) {
    console.error('登录失败：', error)
  }
}
```

#### 获取作者信息

```typescript
import { getAuthorInfo } from '@/api'
import type { User } from '@/types/app/user'

const author = ref<User | null>(null)

const fetchAuthor = async () => {
  try {
    const { data } = await getAuthorInfo()
    author.value = data
  } catch (error) {
    console.error('获取作者信息失败：', error)
  }
}
```

#### Token 验证

```typescript
import { checkToken } from '@/api'

const validateToken = async () => {
  const token = localStorage.getItem('token')
  if (!token) return false

  try {
    await checkToken(token)
    return true
  } catch (error) {
    // Token 无效，清除并跳转登录
    localStorage.removeItem('token')
    return false
  }
}
```

### 5. 评论管理

#### 获取文章评论

```typescript
import { getArticleComments, createComment } from '@/api'
import type { Comment } from '@/types/app/comment'

const comments = ref<Comment[]>([])

// 获取指定文章的评论（树形结构）
const fetchComments = async (articleId: number) => {
  try {
    const { data } = await getArticleComments(articleId, 1, 20)
    comments.value = data.result
  } catch (error) {
    console.error('获取评论失败：', error)
  }
}

// 发表评论
const submitComment = async (articleId: number) => {
  try {
    await createComment({
      articleId,
      name: '游客',
      email: 'user@example.com',
      content: '这是一条评论',
      commentId: 0, // 0 表示一级评论，非 0 表示回复某条评论
      createTime: new Date().getTime().toString(),
    })

    // 重新加载评论
    await fetchComments(articleId)
  } catch (error) {
    console.error('发表评论失败：', error)
  }
}
```

### 6. 留言管理

```typescript
import { getWallList, getWallCateList, createWall } from '@/api'

// 获取留言分类
const wallCategories = ref([])
const fetchWallCategories = async () => {
  const { data } = await getWallCateList()
  wallCategories.value = data
}

// 获取留言列表
const walls = ref([])
const fetchWalls = async () => {
  const { data } = await getWallList({
    status: 1, // 1 表示已审核通过的留言
  })
  walls.value = data
}

// 提交留言
const submitWall = async () => {
  await createWall({
    name: '访客',
    email: 'visitor@example.com',
    content: '留言内容',
    cateId: 1,
    color: '#92e6f54d',
    createTime: new Date().getTime().toString(),
  })
}
```

### 7. 轮播图

```typescript
import { getSwiperList } from '@/api'
import type { Swiper } from '@/types/app/swiper'

const swipers = ref<Swiper[]>([])

const fetchSwipers = async () => {
  const { data } = await getSwiperList()
  swipers.value = data
}
```

### 8. 友情链接

```typescript
import { getLinkList, getLinkTypeList } from '@/api'

const links = ref([])
const linkTypes = ref([])

// 获取友链列表
const fetchLinks = async () => {
  const { data } = await getLinkList({
    status: 1, // 只获取已审核的友链
  })
  links.value = data
}

// 获取友链类型
const fetchLinkTypes = async () => {
  const { data } = await getLinkTypeList()
  linkTypes.value = data
}
```

### 9. 文件上传

```typescript
import { uploadFile } from '@/api'

const handleFileUpload = async (files: FileList) => {
  try {
    const fileArray = Array.from(files)
    const { data } = await uploadFile(fileArray, 'images') // dir 参数可选

    console.log('上传成功：', data)
    // data 包含上传后的文件信息（URL、文件名等）
  } catch (error) {
    console.error('文件上传失败：', error)
  }
}

// 在模板中使用
// <input type="file" @change="(e) => handleFileUpload(e.target.files)" multiple>
```

### 10. 配置管理

```typescript
import { getWebConfigByName, getPageConfigByName } from '@/api'

// 获取网站配置
const siteConfig = ref(null)
const fetchSiteConfig = async () => {
  const { data } = await getWebConfigByName('site_info')
  siteConfig.value = data.value // value 是 JSON 对象
}

// 获取页面配置
const homeConfig = ref(null)
const fetchHomeConfig = async () => {
  const { data } = await getPageConfigByName('home_page')
  homeConfig.value = data.value
}
```

### 11. 数据统计

```typescript
import { getStatistics } from '@/api'

// 获取基础数据统计
const basicStats = ref(null)
const fetchBasicStats = async () => {
  const { data } = await getStatistics({ type: 'basic' })
  basicStats.value = data
}

// 获取趋势数据
const trendStats = ref(null)
const fetchTrendStats = async () => {
  const { data } = await getStatistics({
    type: 'overview',
    startDate: '20240101',
    endDate: '20240131',
  })
  trendStats.value = data
}
```

## Pinia Store 集成示例

```typescript
// stores/article.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getArticleList, getArticleDetail } from '@/api'
import type { Article } from '@/types/app/article'

export const useArticleStore = defineStore('article', () => {
  const articles = ref<Article[]>([])
  const currentArticle = ref<Article | null>(null)
  const loading = ref(false)

  const fetchArticles = async (params: any) => {
    loading.value = true
    try {
      const { data } = await getArticleList(params)
      articles.value = data.result
      return data
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchArticleDetail = async (id: number) => {
    loading.value = true
    try {
      const { data } = await getArticleDetail(id)
      currentArticle.value = data
      return data
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    articles,
    currentArticle,
    loading,
    fetchArticles,
    fetchArticleDetail,
  }
})
```

## 错误处理

所有 API 调用都应该使用 try-catch 进行错误处理：

```typescript
try {
  const { data } = await getArticleList({ page: 1, size: 10 })
  // 处理成功响应
} catch (error) {
  // 错误已在拦截器中打印
  // 这里可以进行额外的错误处理，如显示提示信息
  console.error('请求失败：', error)
}
```

## 类型安全

所有 API 方法都提供了完整的 TypeScript 类型支持：

```typescript
import { getArticleList } from '@/api'
import type { Article } from '@/types/app/article'

// data 会自动推断为 Paginate<Article[]> 类型
const { data } = await getArticleList({ page: 1, size: 10 })

// 享受完整的类型提示和检查
data.result.forEach((article: Article) => {
  console.log(article.title)
})
```

## 注意事项

1. **认证要求**：部分接口（如文章管理、用户管理等）需要登录后的 Token，请确保先调用登录接口
2. **分页参数**：大部分列表接口都支持分页，默认 `page=1, size=10`
3. **审核状态**：评论、留言、友链等都有审核机制，前台通常只显示 `status=1`（已审核）的内容
4. **文件上传**：文件上传使用 FormData 格式，已在 `upload` 方法中自动处理
5. **响应格式**：所有接口返回格式为 `{ code: 200, message: string, data: T }`

## 完整 API 列表

请参考 `src/api/index.ts` 文件，包含以下模块的完整接口：

- ✅ 文章管理（15+ 个接口）
- ✅ 分类管理（8 个接口）
- ✅ 标签管理（7 个接口）
- ✅ 用户管理（9 个接口）
- ✅ 评论管理（8 个接口）
- ✅ 留言管理（9 个接口）
- ✅ 说说管理（5 个接口）
- ✅ 足迹管理（4 个接口）
- ✅ 友链管理（8 个接口）
- ✅ 轮播图管理（5 个接口）
- ✅ 文件管理（6 个接口）
- ✅ 配置管理（6 个接口）
- ✅ 数据统计（1 个接口）
- ✅ 订阅管理（2 个接口）

共计 **90+ 个接口**，全部完成封装！
