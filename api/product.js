import { request,authRequest } from '@/utils/request'

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

export function authGetProduct(id,data) {
    return authRequest('products/' + id + '/auth', {
        data: data
    })
}

export function getReview(id,data) {
    return request('products/' + id + '/review', {
        data: data
    })
}

export function favorite(id,data) {
    return authRequest('products/' + id + '/favorite', {
        method: 'post',
        data: data
    })
}

export function unFavorite(id,data) {
    return authRequest('products/' + id + '/favorite', {
        method: 'delete',
        data: data
    })
}