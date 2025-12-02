import request from '@/utils/request'

// 查询【双色球】彩票开奖信息列表
export function listDrawSsq(query) {
  return request({
    url: '/business/drawSsq/list',
    method: 'get',
    params: query
  })
}

// 查询【双色球】彩票开奖信息详细
export function getDrawSsq(id) {
  return request({
    url: '/business/drawSsq/' + id,
    method: 'get'
  })
}

// 新增【双色球】彩票开奖信息
export function addDrawSsq(data) {
  return request({
    url: '/business/drawSsq',
    method: 'post',
    data: data
  })
}

// 修改【双色球】彩票开奖信息
export function updateDrawSsq(data) {
  return request({
    url: '/business/drawSsq',
    method: 'put',
    data: data
  })
}

// 删除【双色球】彩票开奖信息
export function delDrawSsq(id) {
  return request({
    url: '/business/drawSsq/' + id,
    method: 'delete'
  })
}
