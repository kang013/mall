import { request, authRequest } from '@/utils/request'

export function getAddress(data) {
    return authRequest('user_addresses')
}
