import { request,authRequest } from '@/utils/request'

export function getSlide(data) {
    return request('slide', {
        data: data
    })
}

export function getSeckill(data) {
    return request('seckill', {
        data: data
    })
}

export function getLikeProduct(data) {
    return request('like_product', {
        data: data
    })
}
