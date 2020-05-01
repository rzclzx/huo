<template>
    <div class="registerLogin_wrap">
        <Radio-btn :text="radioText" :checked="radioText[0]"/>
        <Row>
            <DatePicker format="yyyy-MM-dd HH:mm:ss"
                        v-model="searDate"
                        type="datetimerange"
                        :placeholder="$t('申请时间-起 -- 申请时间-止')"
                        :options="chooseDate"
                        style="width: 300px"
                        ></DatePicker>
            <Button type="primary" size="large" @click="searchData" v-if="$store.state.user.checkPerm('statistics:getRegLogin:list')">{{$t('查询')}}</Button>
        </Row>
        <Card style="margin-top: 20px;">
            <h2 slot="title">
                {{ $t('注册/认证统计') }}
            </h2>
            <Table :columns="columns" :data="dataList" :no-data-text="this.$t('暂无数据')"></Table>
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
        </Card>
    </div>
</template>

<script>
import {statistics} from '__util/api'
import RadioBtn from '__components/radioBtn'

    export default {
        name: "register-and-login",
        data() {
            return {
                searDate: '',
                // radioText: [ this.$t('注册/认证统计')],
                type:1,
                // 分页参数
                coinPage: {
                    currPage: 1,
                    pageSize: 30,
                    totalPage: 0,
                    totalCount: 0
                },
                // 设置日期不可选
                chooseDate: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now() - 86400000
                    }
                },
                tableName: this.$t('注册/认证统计'),
                dataList:[],
                formData:{},
                dataTotal:0,
                newDay: '',
                page:1,
                pageSize: 30,
                columns:[
                    {
                        key: 'date',
                        renderHeader:() => {
                            return this.$t('时间')
                        }
                    },
                    {
                        key: 'registerTotal',
                        renderHeader:() => {
                            return this.$t('注册用户总数')
                        }
                    },
                    {
                        key: 'authTotal',
                        renderHeader:() => {
                            return this.$t('实名认证总数')
                        }
                    },
                    {
                        key: 'conversionRate',
                        renderHeader:() => {
                            return this.$t('注册/实名转化率')
                        }
                    },
                    {
                        key: 'registerNum',
                        renderHeader:() => {
                            return this.$t('每日注册用户数')
                        }
                    },
                    {
                        key: 'authNum',
                        renderHeader:() => {
                            return this.$t('每日实名认证数')
                        }
                    },
                    {
                        key: 'loginNum',
                        renderHeader:() => {
                            return this.$t('每日登录数')
                        }
                    }
                ]
            }
        },
        mounted () {
            if ( this.$store.state.user.checkPerm('statistics:getRegLogin:list') ) {
                this.getColumns()
                this.getRegisterList()
            }
        },
        computed: {
            radioText () {
                return [ this.$t('注册/认证统计')]
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
                this.formData.endTime = this.newDay
            },
            dateChange(date){
                this.formData.startTime = date[0];
                this.formData.endTime = date[1];
            },
            handlePageChange(page){
                this.page = page;
                this.searchData()
            },
            // 查询
            searchData() {
                if (this.searDate && this.searDate.length !== 0 && this.searDate[0] !== null) {
                    this.formData.startTime = this.$moment(this.searDate[0]).format()
                    this.formData.endTime = this.$moment(this.searDate[1]).format()
                    this.getRegisterList()
                }else {
                   this.formData.endTime = this.newDay
                   this.formData.startTime = ''
                   this.searDate = []
                   this.getRegisterList()
                }
            },
            getRegisterList () {
                statistics.getRegisterList.data = {
                    endDate: this.formData.endTime,
                    page: this.coinPage.currPage,
                    limit: this.coinPage.pageSize,
                    strDate: this.formData.startTime
                }
                this.$axios(statistics.getRegisterList).then((res) => {
                    this.coinPage.currPage = res.data.currPage
                    this.coinPage.pageSize = res.data.pageSize
                    this.coinPage.totalCount = res.data.totalCount
                    this.coinPage.totalPage = res.data.totalPage
                    this.dataList = res.data.list
                })
            }
        },
        components:{
            RadioBtn
        },
    }
</script>

<style lang="less">
.registerLogin_wrap{
    min-height: 400px;
    .ivu-row{
        margin-top: 20px;
    }
}
</style>
