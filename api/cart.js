import { request, authRequest } from '@/utils/request'

export function addCart(data) {
    return authRequest('cart', {
        method: 'post',
        data: data
    })
}

export function getCart(data) {
    return authRequest('cart')
}

export function deleteCart(id,data) {
    return authRequest('cart/' + id, {
        method: 'DELETE',
        data: data
    })
}
