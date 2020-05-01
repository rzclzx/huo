<template lang="html">
    <Row>
        <Radio-btn :text="radioText" :checked="radioText[0]" @change="changeSearchBtn"></Radio-btn>
        <Row style="margin-top: 20px" v-if="$store.state.user.checkPerm('statistics:listDetail')">
            <DatePicker v-model="searchDate" format="yyyy/MM/dd"  :transfer="true" type="date" :options="chooseDate" :placeholder="$t('一周数据 - 起  -  一周数据 - 止')" style="width: 300px"></DatePicker>
            <Button type="primary" @click="search">{{$t('查询')}}</Button>
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{Text}}
                <span class="card-title-desc">{{$t('显示最近7天数据，日期从左到右顺序排序')}}</span>
            </p>
            <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
            <Button slot="extra" type="primary" v-if="$store.state.user.checkPerm('statistics:listDetailExport')" @click.prevent="dataExport">{{$t('数据导出')}}</Button>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="infoCols" ref="tableExcel" :data="infoList" style="width: 100%;" :no-data-text="this.$t('暂无数据')"></Table>
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
            // radioText: [this.$t('冲提差'), this.$t('充值量'), this.$t('提现量'), this.$t('充值人数'), this.$t('提现人数')],
            // 查询时间
            searchDate: '',
            strType: 0,
            queryDate: '',
            // 基础报表columns
            infoCols: [
                {
                    key: 'currency',
                    renderHeader:() => {
                        return this.$t('币种')
                    }
                }
            ],
            // 设置日期不可选
            chooseDate: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now() - 86400000
                }
            },
            Text: this.$t('冲提差'),
            newDay: '',
            // 币种列表
            infoList: []

        }
    },
    computed: {
        radioText () {
            return [this.$t('冲提差'), this.$t('充值量'), this.$t('提现量'), this.$t('充值人数'), this.$t('提现人数')]
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('statistics:listDetail') ) {
            this.getColumns()
            this.getProMoreList()
        }
    },
    watch: {
        "radioText": {
            handler: function (val, oldVal) {
                console.log(val)
            },
            deep: true
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
                this.getProMoreList()
            } else {
                this.queryDate = this.newDay
                this.getProMoreList()
            }
        },
        // 获取列表数据
        getProMoreList () {
            statistics.getProMoreList.data = {
                endDate: this.queryDate,
                type: this.strType
            }
            if (this.infoCols.length > 1) {
                this.infoCols = [{
                    title: this.$t('币种'),
                    key: 'currency'
                }]
                this.infoList = []
            }
            this.$axios(statistics.getProMoreList).then((res) => {
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
                        obj.currency = e.currency
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
        changeSearchBtn (text, index) {
            this.Text = text
            this.strType = index
            this.getProMoreList()
        }
    }
}
</script>

<style lang="less" scoped>


</style>
