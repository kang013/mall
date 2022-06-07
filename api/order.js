import { request, authRequest } from '@/utils/request'

export function addOrder(data) {
    return authRequest('orders', {
        method: 'post',
        data: data
    })
}
