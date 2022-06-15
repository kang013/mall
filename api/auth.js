import { request } from '@/utils/request'

export function login(data) {
    return request('authorizations', {
        method: 'post',
        data: data
    })
}

export function refresh(token) {
    return request('authorizations/current', {
        method: 'put',
        header: {
            'Authorization': 'Bearer ' + token
        }
    })
}

export function logout(token) {
    return request('authorizations/current', {
        method: 'delete',
        header: {
            'Authorization': 'Bearer ' + token
        }
    })
}

export function captchas(data){
    return request('captchas', {
        method: 'post',
        data: data
    })
}

export function register(data){
    return request('users', {
        method: 'post',
        data: data
    })
}

export function verificationCodes(data){
    return request('verificationCodes', {
        method: 'post',
        data: data
    })
}
