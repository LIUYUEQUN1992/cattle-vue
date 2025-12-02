import request from '@/utils/request'

// 查询【快乐8】彩票开奖信息列表
export function listDrawKl8(query) {
  return request({
    url: '/business/drawKl8/list',
    method: 'get',
    params: query
  })
}

// 查询【快乐8】彩票开奖信息详细
export function getDrawKl8(id) {
  return request({
    url: '/business/drawKl8/' + id,
    method: 'get'
  })
}

// 新增【快乐8】彩票开奖信息
export function addDrawKl8(data) {
  return request({
    url: '/business/drawKl8',
    method: 'post',
    data: data
  })
}

// 修改【快乐8】彩票开奖信息
export function updateDrawKl8(data) {
  return request({
    url: '/business/drawKl8',
    method: 'put',
    data: data
  })
}

// 删除【快乐8】彩票开奖信息
export function delDrawKl8(id) {
  return request({
    url: '/business/drawKl8/' + id,
    method: 'delete'
  })
}
