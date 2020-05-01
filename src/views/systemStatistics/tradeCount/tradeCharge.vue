<template lang="html">
    <Row>
        <Radio-btn :text="radioText" :checked="radioText[0]" @change="changeSearchBtn"></Radio-btn>
        <Row style="margin-top: 20px">
            <DatePicker v-model="searchDate" format="yyyy/MM/dd"  :transfer="true" type="date" :options="chooseDate" placeholder="一周数据 - 起  -  一周数据 - 止" style="width: 200px"></DatePicker>
            <Button type="primary" @click="search">查询</Button>
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{nowText}} 交易手续费（折合BTC）
                <span class="card-title-desc">显示最近7天数据，日期从左到右顺序排序</span>
            </p>
            <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
            <Button slot="extra" type="primary" @click.prevent="dataExport">数据导出</Button>
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
            radioText: ['USDT 盘', 'BTC 盘', 'ETH 盘'],
            // 查询时间
            searchDate: '',
            // 当天时间
            newDay: '',
            nowText: 'USDT盘',
            // 请求时间
            queryDate: '',
            currencyPair: 'USDT',
            // 基础报表columns
            infoCols: [
                {
                    title: '交易对',
                    key: 'currencyPair'
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
    methods: {
        // 获取近7天表头
        getColumns () {
            let curDate = new Date()
            let today = curDate.getDate() - 1
            let year = curDate.getFullYear()
            let month = curDate.getMonth() + 1
            this.newDay = year + '-' + month + '-' + today
            this.queryDate = this.newDay
        },
        // 导出数据
        dataExport () {
            table2excel.transform(this.$refs.tableExcel, 'hrefToExportTable', `${this.nowText}交易手续费`)
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
                    title: '交易对',
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
            text = text.split(' ')[0]
            this.nowText = text + '盘'
            this.currencyPair = text
            this.getTransChargeList()
        }
    }
}
</script>

<style lang="less" scoped>


</style>
