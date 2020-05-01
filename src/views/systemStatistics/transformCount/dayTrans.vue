<template lang="html">
    <Row>
        <Card>
            <p>{{$t('指标注释（用户量）')}}</p>
            <p>{{$t('注册人数：当天注册人数 注册&充值：当天注册且充值的人数 注册&充值&交易：当天注册充值且交易的人数')}}</p>
            <p style="margin-top: 20px">{{$t('指标注释（转化率）')}}</p>
            <p>{{$t('注册→充值：注册&充值人数/注册人数 注册→交易：注册&充值&交易人数/注册人数 充值→交易：注册&充值&交易人数/注册&充值人数')}}</p>
        </Card>
        <Radio-btn :text="radioText" :checked="radioText[0]" @change="changeSearchBtn" style="margin-top: 20px"></Radio-btn>
        <Row style="margin-top: 20px" v-if="$store.state.user.checkPerm('statistics:listConversion')">
            <DatePicker v-model="searchDate" format="yyyy/MM/dd"  :transfer="true" style="width: 300px" type="date" :options="chooseDate" :placeholder="$t('一周数据 - 起  -  一周数据 - 止')"></DatePicker>
            <Button type="primary" @click="search">{{$t('查询')}}</Button>
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{transText}}
                <span class="card-title-desc">{{$t('默认显示最近7天数据，日期从上到下顺序排序')}}</span>
            </p>
            <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
            <Button slot="extra" type="primary" v-if="$store.state.user.checkPerm('statistics:listConversionExport')" @click.prevent="dataExport">{{$t('数据导出')}}</Button>
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
            // radioText: [this.$t('整体转化'), this.$t('国内转化'), this.$t('国外转化')],
            // 查询时间
            searchDate: '',
            transText: this.$t('整体转化'),
            // 当天时间
            newDay: '',
            queryType: 0,
            // 请求时间
            queryDate: '',
            // 基础报表columns
            infoCols: [
                {
                    key: 'date',
                    renderHeader:() => {
                        return this.$t('日期')
                    }
                },
                {
                    key: 'registerNum',
                    renderHeader:() => {
                        return this.$t('注册人数')
                    }
                },
                {
                    key: 'registerIn',
                    renderHeader:() => {
                        return this.$t('注册→充值(人数)')
                    }
                },
                {
                    key: 'registerInTrade',
                    renderHeader:() => {
                        return this.$t('注册→充值→交易(人数)')
                    }
                },
                {
                    key: 'registerInPre',
                    renderHeader:() => {
                        return this.$t('注册→充值(转化率)')
                    }
                },
                {
                    key: 'registerTradePre',
                    renderHeader:() => {
                        return this.$t('注册→交易(转化率)')
                    }
                },
                {
                    key: 'inTradePre',
                    renderHeader:() => {
                        return this.$t('充值→交易(转化率)')
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
        if ( this.$store.state.user.checkPerm('statistics:listConversion') ) {
            this.getColumns()
            this.getTransformList()
        }
    },
    computed: {
        radioText () {
            return [this.$t('整体转化'), this.$t('国内转化'), this.$t('国外转化')]
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
                this.getTransformList()
            } else {
               this.queryDate = this.newDay
               this.getTransformList()
            }
        },
        // 获取数据列表
        getTransformList () {
            statistics.getTransformList.data = {
                day: 1,
                endDate: this.queryDate,
                type: this.queryType
            }
            this.$axios(statistics.getTransformList).then((res) => {
                console.log(res)
                this.infoList = res.data
            })
        },
        // 选择搜索按钮
        changeSearchBtn (text, index) {
            this.transText = text
            this.queryType = index
            this.getTransformList()
        }
    }
}
</script>

<style lang="less" scoped>


</style>
