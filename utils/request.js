import store from '@/store'

// 服务器接口地址
const host = 'http://127.0.0.1:8000/api/v1/'

// 普通请求
const request = async (url, options = {}, showLoading = true) => {
    // 显示加载中
    if (showLoading) {
        uni.showLoading({title: '加载中'})
    }
    // 拼接请求地址
    options.url = host + url

    let response = await uni.request(options)
    response = response[1]

    if (showLoading) {
        // 隐藏加载中
        uni.hideLoading()
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
        return response
    }

    if (response.statusCode === 429) {
        uni.showModal({
            title: '提示',
            content: '请求太频繁，请稍后再试'
        })
    }

    if (response.statusCode === 500) {
        uni.showModal({
            title: '提示',
            content: '服务器错误，请联系管理员或重试'
        })
    }

    if(response.statusCode === 422){
        // 返回错误信息
        let errors = response.data.errors
        let key = Object.keys(errors)   // 获取键值
        errors[key[0]].forEach(function (item, index) {
            uni.showToast({
                title: item,
                duration: 2000,
                icon: "none"
            });
        });
        return
    }

    if(response.statusCode === 401){
        uni.showToast({
            title: response.data.message,
            duration: 2000,
            icon: "none"
        });
        return
    }

    uni.showModal({
        title: '提示',
        content: '服务器错误，请联系管理员或重试'
    })

}

const checkToken = async () => {
    // 从缓存中取出 Token
    const accessToken = store.getters.accessToken
    const expiredAt = store.getters.accessTokenExpiredAt

    // 如果 token 过期了，则调用刷新方法
    if (accessToken && new Date().getTime() > expiredAt) {
        try {
            return store.dispatch('refresh')
        } catch (err) {
            return store.dispatch('login')
        }
    }
}

// 普通请求
const authRequest = async (url, options = {}, showLoading = true) => {
    await checkToken()

    options.header = {
        Authorization: 'Bearer ' + store.getters.accessToken
    }

    return await request(url, options, showLoading)
}

// 上传文件
const uploadFile = async (url, options = {}, showLoading = true) => {
    // 显示加载中
    if (showLoading) {
        uni.showLoading({title: '上传中'})
    }
    // 拼接请求地址
    options.url = host + url

    checkToken()

    options.header = {
        Authorization: 'Bearer ' + store.getters.accessToken
    }

    let response = await uni.uploadFile(options)
    response = response[1]

    if (showLoading) {
        // 隐藏加载中
        uni.hideLoading()
    }

    if (response.statusCode >= 200 && response.statusCode < 300) {
        return response
    }

    if (response.statusCode === 500) {
        uni.showModal({
            title: '提示',
            content: '服务器错误，请联系管理员或重试'
        })
    }

    uni.showToast({
        title: response.data.message,
        duration: 2000,
        icon: "none"
    });
}

export {
    request,
    authRequest,
    uploadFile
}
