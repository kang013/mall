export function getUser() {
    return uni.getStorageSync('user')
}

export function setUser(user, perms) {
    return uni.setStorageSync('user', user)
}

export function getToken() {
    return uni.getStorageSync('access_token')
}

export function getTokenExpiredAt() {
    return uni.getStorageSync('access_token_expired_at')
}

export function setToken(tokenPayload) {
    const accessToken = tokenPayload.access_token
    const accessTokenExpiredAt = new Date().getTime() + tokenPayload.expires_in * 1000

    uni.setStorageSync('access_token', accessToken)
    uni.setStorageSync('access_token_expired_at', accessTokenExpiredAt)
}

export function logout() {
    return uni.clearStorage()
}
