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

export function cancelOrder(id,data) {
    return authRequest('orders/' + id + '/cancel', {
        method: 'post',
        data: data
    })
}

export function deleteOrder(id,data) {
    return authRequest('orders/' + id + '/delete', {
        method: 'post',
        data: data
    })
}

export function refundOrder(id,data) {
    return authRequest('orders/' + id + '/apply_refund', {
        method: 'post',
        data: data
    })
}

export function receivedOrder(id,data) {
    return authRequest('orders/' + id + '/received', {
        method: 'post',
        data: data
    })
}

export function getReview(id,data) {
    return authRequest('orders/' + id + '/review')
}

export function sendReview(id,data) {
    return authRequest('orders/' + id + '/review', {
        method: 'post',
        data: data
    })
}

export function createSeckillOrder(data) {
    return authRequest('seckill_orders', {
        method: 'post',
        data: data
    })
}
