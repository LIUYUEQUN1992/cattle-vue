import request from '@/utils/request'

// 查询【3D】彩票开奖信息列表
export function listDrawSd(query) {
  return request({
    url: '/business/drawSd/list',
    method: 'get',
    params: query
  })
}

// 查询【3D】彩票开奖信息详细
export function getDrawSd(id) {
  return request({
    url: '/business/drawSd/' + id,
    method: 'get'
  })
}

// 新增【3D】彩票开奖信息
export function addDrawSd(data) {
  return request({
    url: '/business/drawSd',
    method: 'post',
    data: data
  })
}

// 修改【3D】彩票开奖信息
export function updateDrawSd(data) {
  return request({
    url: '/business/drawSd',
    method: 'put',
    data: data
  })
}

// 删除【3D】彩票开奖信息
export function delDrawSd(id) {
  return request({
    url: '/business/drawSd/' + id,
    method: 'delete'
  })
}
