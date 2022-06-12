import { request } from '@/utils/request'

export function getProduct(data) {
    return request('products', {
        data: data
    })
}

export function getProductInfo(id,data) {
    return request('products/' + id, {
        data: data
    })
}

export function getReview(id,data) {
    return request('products/' + id + '/review', {
        data: data
    })
}
