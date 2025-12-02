import request from '@/utils/request'

// 查询彩票活动列表
export function listEvent(query) {
  return request({
    url: '/business/event/list',
    method: 'get',
    params: query
  })
}

// 查询彩票活动详细
export function getEvent(id) {
  return request({
    url: '/business/event/' + id,
    method: 'get'
  })
}

// 新增彩票活动
export function addEvent(data) {
  return request({
    url: '/business/event',
    method: 'post',
    data: data
  })
}

// 修改彩票活动
export function updateEvent(data) {
  return request({
    url: '/business/event',
    method: 'put',
    data: data
  })
}

// 删除彩票活动
export function delEvent(id) {
  return request({
    url: '/business/event/' + id,
    method: 'delete'
  })
}
