<template lang="html">
    <Row>
        <Radio-btn :text="radioText" :checked="radioText[0]" @change="changeSearchBtn"></Radio-btn>
        <Row style="margin-top: 20px" v-if="$store.state.user.checkPerm('statistics:getTradeFee')">
            <DatePicker v-model="searchDate" format="yyyy/MM/dd"  :transfer="true" type="date" :options="chooseDate" :placeholder="$t('一周数据 - 起  -  一周数据 - 止')" style="width: 300px"></DatePicker>
            <Button type="primary" @click="search">{{$t('查询')}}</Button>
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{nowText}} {{$t('交易手续费')}}（{{$t('折合BTC')}}）
                <span class="card-title-desc">{{$t('显示最近7天数据，日期从左到右顺序排序')}}</span>
            </p>
            <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
            <Button slot="extra" type="primary" v-if="$store.state.user.checkPerm('statistics:getTradeFeeExport')" @click.prevent="dataExport">{{$t('数据导出')}}</Button>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="infoCols" ref="tableExcel" :data="infoList" style="width: 100%;"></Table>
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
            // radiobtn 数据
            // radioText: [this.$t('USDT 盘'), this.$t('BTC 盘'), this.$t('ETH 盘')],
            // 查询时间
            searchDate: '',
            // 当天时间
            newDay: '',
            nowText: `BTC ${this.$t('盘')}`,
            // 请求时间
            queryDate: '',
            currencyPair: 'BTC',
            // 基础报表columns
            infoCols: [
                {
                    key: 'currencyPair',
                    renderHeader:() => {
                        return this.$t('新增交易')
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
        this.getColumns()
        this.getTransChargeList()
    },
    computed: {
        radioText () {
            return [`BTC ${this.$t('盘')}`, `XRP ${this.$t('盘')}`]
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
        // 导出数据
        dataExport () {
            if (this.infoList.length !== 0) {
                table2excel.transform(this.$refs.tableExcel, 'hrefToExportTable', 'Table')
            } else {
                this.$Modal.error({
                    title: '提示',
                    content: '没有数据可以导出'
                })
            }

        },
        // 查询
        search () {
            if (this.searchDate) {
                this.queryDate = this.searchDate.toLocaleString().split(' ')[0].split('/').join('-')
                this.getTransChargeList()
            } else {
               this.queryDate = this.newDay
               this.getTransChargeList()
            }
        },
        // 获取列表数据
        getTransChargeList () {
            statistics.getTransChargeList.data = {
                endDate: this.queryDate,
                currency: this.currencyPair
            }
            if (this.infoCols.length > 1) {
                this.infoCols = [{
                    title: this.$t('交易对'),
                    key: 'currencyPair'
                }]
                this.infoList = []
            }
            this.$axios(statistics.getTransChargeList).then((res) => {
                res.data.titles.map((e,i) => {
                    this.infoCols.push({
                        title: e,
                        key: i
                    })
                })
                if (res.data.list && res.data.list.length !== 0) {
                    let numArr = []
                    res.data.list.map((e) => {
                        let obj = {}
                        obj.currencyPair = e.currencyPair
                        e.list.map((ev,index) => {
                            obj[index] = ev.amount
                        })
                        numArr.push(obj)
                    })
                    this.infoList = numArr
                }
            })
        },
        // 选择搜索按钮
        changeSearchBtn (text) {
            this.nowText = text
            text = text.split(' ')[0]
            this.currencyPair = text
            this.getTransChargeList()
        }
    }
}
</script>

<style lang="less" scoped>


</style>
