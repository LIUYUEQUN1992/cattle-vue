import request from '@/utils/request'

// 查询彩票资讯列表
export function listNews(query) {
  return request({
    url: '/business/news/list',
    method: 'get',
    params: query
  })
}

// 查询彩票资讯详细
export function getNews(id) {
  return request({
    url: '/business/news/' + id,
    method: 'get'
  })
}

// 新增彩票资讯
export function addNews(data) {
  return request({
    url: '/business/news',
    method: 'post',
    data: data
  })
}

// 修改彩票资讯
export function updateNews(data) {
  return request({
    url: '/business/news',
    method: 'put',
    data: data
  })
}

// 删除彩票资讯
export function delNews(id) {
  return request({
    url: '/business/news/' + id,
    method: 'delete'
  })
}
