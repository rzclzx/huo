<template lang="html">
    <div>
        <Row style="margin-top: 20px">
            <Form :model="formItem" inline>
                <FormItem>
                    <DatePicker
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        placement="bottom-end"
                        transfer
                        :options="chooseDate"
                        style="width: 322px"
                        :placeholder="$t('申请时间') +'-'+ $t('起')+'--'+ $t('申请时间')+'-'+$t('止')"
                        v-model="formItem.applyDate"
                    ></DatePicker>
                </FormItem>
                <FormItem v-if="$store.state.user.checkPerm('statistic:getPropertyIncomeList')">
                    <Button type="primary" @click="search">{{$t('查询')}}</Button>
                </FormItem>
            </Form>
        </Row>
        <Card>
            <p slot="title">
                {{$t('收入统计（折合成BTC）')}}
            </p>
            <Button slot="extra" type="primary" v-if="$store.state.user.checkPerm('statistics:getPropertyIncomeList:exp')" @click.prevent="dataExport">{{$t('数据导出')}}</Button>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="columns" ref="tableExcel" :data="dataList" style="width: 100%;"></Table>
            </Row>
        </Card>
        <Modal v-model="modalInfo" width="100%" class-name="modal-clear-line">
            <p slot="header" style="text-align:center">
            </p>
            <div>
                <income-info ref="modalInfo" :listBase="listBase" @on-close="closeModal"></income-info>
            </div>
            <div slot="footer" style="border-top: 0">
            </div>
        </Modal>
    </div>
</template>

<script>
import incomeInfo from './incomeInfo'
import { statistics } from '__util/api'

export default {
    components: {
        incomeInfo
    },
    data () {
        return {
            formItem: {},
            listBase: [],
            // 设置日期不可选
            chooseDate: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now() - 86400000
                }
            },
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('时间')
                    },
                    key: 'date'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('交易手续费')
                    },
                    key: 'tradeFeeIn'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('提币手续费')
                    },
                    key: 'transferFeeIn'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    key: 'value',
                    render:  (h, params) => {
                        if ( this.$store.state.user.checkPerm('statistic:getPropertyIncomeDetail') ) {
                            return ''
                        }
                        return h('span',{
                            style: {
                                color: '#1991EB',
                                cursor: 'pointer',
                                padding: 0
                            },
                            on: {
                                click: () => {
                                    this.viewInfo(params.row)
                                }
                            }
                        },'查看详情')
                    }
                },
            ],
            dataList: [],
            modalInfo: false
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('statistic:getPropertyIncomeList') ) {
            this.getColumns()
            this.getTransformList()
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
        search () {
            if (this.formItem.applyDate && this.formItem.applyDate.length !== 0 && this.formItem.applyDate[0] !== null) {
                this.startDate = this.$moment(this.formItem.applyDate[0]).format()
                this.endDate = this.$moment(this.formItem.applyDate[1]).format()
                this.getTransformList()
            }else {
               this.endDate = this.newDay
               this.startDate = ''
               this.formItem.applyDate = []
               this.getTransformList()
            }
        },
        // 获取数据列表
        getTransformList (page) {
            statistics.getDataList.data = {
                endDate: this.endDate,
                strDate: this.startDate,
                type: 3
            }
            this.$axios(statistics.getDataList).then((res) => {
                this.dataList = res.data
            })
        },
        // 查看详情
        viewInfo (item) {
            this.modalInfo = true
            this.getDataDetail(item.date)
        },
        // 获取每天数据
        getDataDetail (date) {
            statistics.IncomeDetailList.data = {
                date: date,
            }
            this.$axios(statistics.IncomeDetailList).then((res) => {
                this.listBase = res.data
            })
        },
        closeModal () {

        }
    }
}
</script>

<style lang="css">
</style>
