import { request } from '@/utils/request'

export function getProduct(data) {
    return request('products', {
        data: data
    })
}
