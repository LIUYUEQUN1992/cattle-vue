import request from '@/utils/request'

// 查询卡券列表
export function listCoupon(query) {
  return request({
    url: '/business/coupon/list',
    method: 'get',
    params: query
  })
}

// 查询卡券详细
export function getCoupon(id) {
  return request({
    url: '/business/coupon/' + id,
    method: 'get'
  })
}

// 新增卡券
export function addCoupon(data) {
  return request({
    url: '/business/coupon',
    method: 'post',
    data: data
  })
}

// 修改卡券
export function updateCoupon(data) {
  return request({
    url: '/business/coupon',
    method: 'put',
    data: data
  })
}

// 删除卡券
export function delCoupon(id) {
  return request({
    url: '/business/coupon/' + id,
    method: 'delete'
  })
}
