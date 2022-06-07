import { request, authRequest } from '@/utils/request'

export function getAddress(data) {
    return authRequest('user_addresses')
}

export function addAddress(data) {
    return authRequest('user_addresses', {
        method: 'post',
        data: data
    })
}

export function editAddress(id,data) {
    return authRequest('user_addresses/'+id, {
        method: 'put',
        data: data
    })
}

export function getDefaultAddress(data) {
    return authRequest('user_addresses_default')
}