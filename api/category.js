import { request } from '@/utils/request'

export function getCategory(data) {
    return request('categories', {
        data: data
    })
}
