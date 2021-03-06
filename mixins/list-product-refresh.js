export default {
    data() {
        return{
            page: 1,
            // 数据
            resourceData: [],
            // 有没有更多数据
            noMoreData: false,
            // 是否在加载中
            isLoading: false,
            loadingType: 'more',
            properties:[],
            onProperties: [],
            blProperties: true,
        }
    },
    async onPullDownRefresh() {
        this.page = 1
        this.noMoreData = false
        this.loadingType = 'loading'
        await this.loadData(true)
        uni.stopPullDownRefresh()
    },
    async onReachBottom () {
        // 如果没有更多内容，直接返回
        if (this.noMoreData || this.isLoading) {
            this.loadingType = 'nomore'
            return
        }

        this.isLoading = true
        this.page += 1

        await this.loadData()

        this.isLoading = false
    },
    methods: {
        async loadData(reset = false) {
            const dataResponse = await this.fetchData()

            // 商品属性
            this.properties = dataResponse.data.properties

            if(this.blProperties){
                // 固定数据
                this.onProperties = this.properties
                this.blProperties = false
            }
            //console.log(this.onProperties)

            this.resourceData = reset ? dataResponse.data.products.data : this.resourceData.concat(dataResponse.data.products.data)

            const pagination = dataResponse.data.products

            // 根据分页设置是否还有更多数据
            if (pagination.current_page === pagination.last_page) {
                this.noMoreData = true
                this.loadingType = 'nomore'
            }


        }
    }
}
