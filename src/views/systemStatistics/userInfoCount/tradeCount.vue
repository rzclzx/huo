<template lang="html">
    <Row>
        <Radio-btn :text="radioText" :checked="radioText[0]" @change="changeSearchBtn" style="margin-top: 20px"></Radio-btn>
        <Row style="margin-top: 20px">
            <DatePicker v-model="searchDate" format="yyyy/MM/dd"  :transfer="true" type="daterange" :options="chooseDate" :placeholder="$t('一周数据 - 起  -  一周数据 - 止')" style="width: 300px"></DatePicker>
            <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('statistics:getTradeInfo:list')">{{$t('查询')}}</Button>
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{$t('BTC交易量')}}
            </p>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="infoCols" ref="tableExcel" :data="infoList" style="width: 100%;" :no-data-text="this.$t('暂无数据')"></Table>
                <Page show-elevator v-if="coinPage.totalPage > 1"
                      :total="coinPage.totalPage"
                      :page-size="coinPage.pageSize"
                      :current="coinPage.currPage"
                      size="small"
                      show-total
                      @on-change="handlePageChange"
                      class="trial-pagition">
                        <slot>
                            {{ $t('共') + ' ' + coinPage.totalPage + ' ' + $t('条') }}
                        </slot>
                      </Page>
            </Row>
        </Card>
    </Row>
</template>

<script>
import { statistics } from '__util/api'
import RadioBtn from '__components/radioBtn'
import table2excel from '__libs/table2excel.js'

export default {
    components: {
        RadioBtn
    },
    data () {
        return {
            // 查询时间
            searchDate: '',
            transText: this.$t('BTC交易量'),
            // 当天时间
            newDay: '',
            queryType: 0,
            // 请求时间
            queryDate: '',
            currencyArr: ['BTC', 'XRP'],
            currency: 'BTC',
            // 分页参数
            coinPage: {
                currPage: 1,
                pageSize: 30,
                totalPage: 1,
                totalCount: 0
            },
            // 基础报表columns
            infoCols: [
                {
                    key: 'currencyPair',
                    renderHeader:() => {
                        return this.$t('交易对')
                    }
                },
                {
                    key: 'allAmount',
                    renderHeader:() => {
                        return this.$t('交易总量')
                    }
                },
                {
                    key: 'inAmount',
                    renderHeader:() => {
                        return this.$t('买入数量')
                    }
                },
                {
                    key: 'outAmount',
                    renderHeader:() => {
                        return this.$t('卖出数量')
                    }
                },
                {
                    key: 'date',
                    renderHeader:() => {
                        return this.$t('交易时间')
                    }
                }
            ],
            // 设置日期不可选
            chooseDate: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now() - 86400000
                }
            },
            // 币种列表
            infoList: []

        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('statistics:getTradeInfo:list') ) {
            this.getColumns()
            this.getTradeInfoList()
        }
    },
    computed: {
        radioText () {
            return [this.$t('BTC交易量'), this.$t('XRP交易量')]
        }
    },
    methods: {
        // 获取近7天表头
        getColumns () {
            let curDate = new Date() - 86400000
            curDate = new Date(curDate)
            let today = curDate.getDate()
            let year = curDate.getFullYear()
            let month = curDate.getMonth() + 1
            this.newDay = year + '-' + month + '-' + today
            this.queryDate = this.newDay
        },
        // 查询
        search () {
            if (this.searchDate && this.searchDate.length !== 0 && this.searchDate[0] !== null) {
                this.startTime = this.$moment(this.searchDate[0]).format()
                this.endTime = this.$moment(this.searchDate[1]).format()
                this.getTradeInfoList()
            }else {
               this.endTime = this.newDay
               this.startTime = ''
               this.searchDate = []
               this.getTradeInfoList()
            }
        },
        // 获取数据列表
        getTradeInfoList (page) {
            statistics.getTradeInfoList.data = {
                page: page ? page : this.coinPage.currPage,
                limit: this.coinPage.pageSize,
                currency: this.currency,
                endDate: this.queryDate,
                strDate: this.startTime,
                type: this.queryType
            }
            this.$axios(statistics.getTradeInfoList).then((res) => {
                this.coinPage.currPage = res.data.currPage
                this.coinPage.pageSize = res.data.pageSize
                this.coinPage.totalPage = res.data.totalPage
                this.coinPage.totalCount = res.data.totalCount
                this.infoList = res.data.list
            })
        },
        // 选择搜索按钮
        changeSearchBtn (text, index) {
            this.currency = this.currencyArr[index]
            this.transText = this.$t(text)
            this.getTradeInfoList()
        }
    }
}
</script>

<style lang="less" scoped>


</style>
