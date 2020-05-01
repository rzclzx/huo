<template lang="html">
    <Row>
        <Row v-if="$store.state.user.checkPerm('statistics:listBase')">
            <DatePicker v-model="searchDate"
                        format="yyyy/MM/dd"
                        :options="chooseDate"
                        :transfer="true"
                        type="daterange"
                        :placeholder="$t('查询时间 - 起  -  查询时间 - 止')"
                        style="width: 250px"></DatePicker>
            <Button type="primary" @click="search">{{$t('查询')}}</Button>
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{$t('Pro基础报表')}}
            </p>
            <a id="hrefToExportTable" v-if="$store.state.user.checkPerm('statistics:listBaseExport')" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
            <Button slot="extra" type="primary" v-if="$store.state.user.checkPerm('statistics:listBaseExport')" @click.prevent="dataExport">{{$t('数据导出')}}</Button>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="baseCols" ref="tableExcel" :data="baseList" style="width: 100%;" :no-data-text="this.$t('暂无数据')"></Table>
            </Row>
        </Card>
    </Row>
</template>

<script>
import { statistics } from '__util/api'
import table2excel from '__libs/table2excel.js'

export default {
    data () {
        return {
            // 查询时间
            searchDate: [],
            amount: 0,
            newDay: '',
            endDate: '',
            startDate: '',
            // 设置日期不可选
            chooseDate: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now() - 86400000
                }
            },
            // 基础报表columns
            baseCols: [
                {
                    key: 'date',
                    renderHeader:() => {
                        return this.$t('日期')
                    }
                },
                {
                    key: 'registerNum',
                    renderHeader:() => {
                        return this.$t('注册')
                    }
                },
                {
                    key: 'loginNum',
                    renderHeader:() => {
                        return this.$t('登录')
                    }
                },
                {
                    key: 'autherNum',
                    renderHeader:() => {
                        return this.$t('认证')
                    }
                },
                {
                    key: 'inAmount',
                    renderHeader:() => {
                        return this.$t('总充值')
                    }
                },
                {
                    key: 'trade',
                    renderHeader:() => {
                        return this.$t('总交易')
                    }
                },
                {
                    key: 'newAmount',
                    renderHeader:() => {
                        return this.$t('新增充值')
                    }
                },
                {
                    key: 'newTrade',
                    renderHeader:() => {
                        return this.$t('新增交易')
                    }
                },
                {
                    key: 'exRegister',
                    renderHeader:() => {
                        return this.$t('海外注册')
                    }
                },
                {
                    key: 'exAmount',
                    renderHeader:() => {
                        return this.$t('海外充值')
                    }
                },
                {
                    key: 'exTrade',
                    renderHeader:() => {
                        return this.$t('海外交易')
                    }
                }
            ],
            // 币种列表
            baseList: []
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('statistics:listBase') ) {
            this.getColumns()
            this.getProBaseList()
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
            this.endDate = this.newDay
        },
        // 导出数据
        dataExport () {
            if (this.baseList.length !== 0) {
                table2excel.transform(this.$refs.tableExcel, 'hrefToExportTable', 'Table')
            } else {
                this.$Modal.error({
                    title: this.$t('提示'),
                    content: this.$t('没有数据可以导出')
                })
            }
        },
        // 获取基础列表
        getProBaseList (page) {
            statistics.getProBaseList.data = {
                strDate: this.startDate,
                endDate: this.endDate
            }
            this.$axios(statistics.getProBaseList).then((res) => {
                this.baseList = res.data
            })
        },
        // 查询
        search () {
            if (this.searchDate && this.searchDate.length !== 0 && this.searchDate[0] !== null) {
                this.startDate = this.$moment(this.searchDate[0]).format()
                this.endDate = this.$moment(this.searchDate[1]).format()
                this.getProBaseList()
            }else {
               this.endDate = this.newDay
               this.startDate = ''
               this.searchDate = []
               this.getProBaseList()
            }
        }
    }
}
</script>

<style lang="css">
</style>
