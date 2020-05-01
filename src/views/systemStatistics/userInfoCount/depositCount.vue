<template lang="html">
    <Row>
        <Radio-btn :text="radioText" :checked="radioText[0]" @change="changeSearchBtn" style="margin-top: 20px"></Radio-btn>
        <Row style="margin-top: 20px">
            <Select v-model="buyArrVal" style="width: 150px" :placeholder="$t('选择币种')" v-autoLocale>
                <Option v-for="item in buyArr" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <DatePicker format="yyyy-MM-dd HH:mm:ss"
                        v-model="searDate"
                        type="datetimerange"
                        :placeholder="$t('申请时间-起 -- 申请时间-止')"
                        :options="chooseDate"
                        style="width: 300px"></DatePicker>
            <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('statistics:getWithdrawDeposit:list')">{{$t('查询')}}</Button>
        </Row>
        <Card style="margin-top: 20px">
            <p slot="title">
                {{ $t('充币统计') }}
            </p>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="infoCols" ref="tableExcel" :data="infoList" style="width: 100%;" :no-data-text="this.$t('暂无数据')"></Table>
            </Row>
        </Card>
    </Row>
</template>

<script>
import { recharge, statistics } from '__util/api'
import RadioBtn from '__components/radioBtn'
import table2excel from '__libs/table2excel.js'

export default {
    components: {
        RadioBtn
    },
    data () {
        return {
            // 查询时间
            searDate: '',
            startTime: '',
            endTime: '',
            searchDate: '',
            buyArrVal: '',
            transText: this.$t('充币统计'),
            // 当天时间
            newDay: '',
            queryType: 1,
            // 请求时间
            queryDate: '',
            buyArr: [],
            // 基础报表columns
            infoCols: [
                {
                    key: 'date',
                    renderHeader:() => {
                        return this.$t('时间')
                    }
                },
                {
                    key: 'currency',
                    renderHeader:() => {
                        return this.$t('币种')
                    }
                },
                {
                    key: 'amount',
                    renderHeader:() => {
                        return this.$t('总量')
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
        if ( this.$store.state.user.checkPerm('statistics:getWithdrawDeposit:list') ) {
            this.getColumns()
            this.getCurrencyList()
            this.getDepositWithDraw()
        }
    },
    computed: {
        radioText () {
            return [this.$t('充币统计'), this.$t('提币统计')]
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
            this.endTime = this.newDay
        },
        getCurrencyList () {
            this.$axios(recharge.currencyList).then((res) => {
                this.currencyList = res.data.map((item)=>{
                    item = item.toUpperCase();
                    this.buyArr.push(item);
                });
            })
        },
        // 查询
        search () {
          if (this.searDate && this.searDate.length !== 0 && this.searDate[0] !== null) {
              this.startTime = this.$moment(this.searDate[0]).format()
              this.endTime = this.$moment(this.searDate[1]).format()
              this.getDepositWithDraw()
          }else {
             this.endTime = this.newDay
             this.startTime = ''
             this.searDate = []
             this.getDepositWithDraw()
          }
        },
        // 获取数据列表
        getDepositWithDraw () {
            statistics.getDepositWithDraw.data = {
                strDate: this.startTime,
                endDate: this.endTime,
                type: this.queryType,
                currency: this.buyArrVal
            }
            this.$axios(statistics.getDepositWithDraw).then((res) => {
                this.infoList = res.data
            })
        },
        // 选择搜索按钮
        changeSearchBtn (text, index) {
            this.transText = text
            this.queryType = (index + 1)
            this.getDepositWithDraw()
        }
    }
}
</script>

<style lang="less" scoped>


</style>
