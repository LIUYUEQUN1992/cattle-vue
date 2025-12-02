import request from '@/utils/request'

// 查询【七乐彩】彩票开奖信息列表
export function listDrawQlc(query) {
  return request({
    url: '/business/drawQlc/list',
    method: 'get',
    params: query
  })
}

// 查询【七乐彩】彩票开奖信息详细
export function getDrawQlc(id) {
  return request({
    url: '/business/drawQlc/' + id,
    method: 'get'
  })
}

// 新增【七乐彩】彩票开奖信息
export function addDrawQlc(data) {
  return request({
    url: '/business/drawQlc',
    method: 'post',
    data: data
  })
}

// 修改【七乐彩】彩票开奖信息
export function updateDrawQlc(data) {
  return request({
    url: '/business/drawQlc',
    method: 'put',
    data: data
  })
}

// 删除【七乐彩】彩票开奖信息
export function delDrawQlc(id) {
  return request({
    url: '/business/drawQlc/' + id,
    method: 'delete'
  })
}
