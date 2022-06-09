import { request, authRequest } from '@/utils/request'

export function createOrder(data) {
    return authRequest('orders', {
        method: 'post',
        data: data
    })
}

export function getOrder(data) {
    return authRequest('orders', {
        data: data
    })
}

export function getOrderDefault(id,data) {
    return authRequest('orders/' + id)
}

export function payAlipay(id,data) {
    return authRequest('payment/'+id+'/alipay')
}
