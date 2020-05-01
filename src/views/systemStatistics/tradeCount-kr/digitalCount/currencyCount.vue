<template lang="html">
    <div>
        <Row style="margin-top: 20px">
            <Form :model="formItem" inline>
                <FormItem>
                    <Button type="primary" @click="chooseCurrency">{{$t('选择币种')}}</Button>
                </FormItem>
                <FormItem>
                    <DatePicker
                        format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        placement="bottom-end"
                        :options="chooseDate"
                        transfer
                        style="width: 322px"
                        :placeholder="$t('申请时间') +'-'+ $t('起')+'--'+ $t('申请时间')+'-'+$t('止')"
                        v-model="formItem.applyDate"
                    ></DatePicker>
                </FormItem>
                <FormItem v-if="$store.state.user.checkPerm('statistics:getPropertyCurrencyName')">
                    <Button type="primary" @click="search">{{$t('查询')}}</Button>
                </FormItem>
            </Form>
        </Row>
        <Card>
            <p slot="title">
                {{showCurrency}}-{{$t('资产日报')}}
            </p>
            <Button slot="extra" type="primary" v-if="$store.state.user.checkPerm('statistics:getPropertyCurrencyName:exp')" @click.prevent="dataExport">{{$t('数据导出')}}</Button>
            <Row type="flex" justify="center" align="middle" class="advanced-router">
                <Table :columns="columns" ref="tableExcel" :data="dataList" style="width: 100%;"></Table>
            </Row>
        </Card>
        <Modal
            v-model="modalCurrency"
            :title="$t('选择币种')"
            @on-visible-change="visibleChange"
            :ok-text="$t('确定')"
            :cancel-text="$t('取消')"
            @on-ok="ok">
            <Row :gutter="30" type="flex" justify="start">
                <Col span="6" v-if="currencyList.length > 0" style="margin-bottom: 20px;" v-for="(currency,index) in currencyList" :key="index">
                    <Button @click="checkedCurrency"
                            :type="(selectedCurrency == currency)?'primary':'ghost'"
                            style="min-width: 80px;"
                            :data-value="currency">
                        {{currency}}
                    </Button>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
import { recharge,statistics } from '__util/api';

export default {
    data () {
        return {
            formItem: {},
            // 设置日期不可选
            chooseDate: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now() - 86400000
                }
            },
            showCurrency: 'BTC',
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('时间')
                    },
                    key: 'date'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('收入')
                    },
                    key: 'incomeSum'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('支出')
                    },
                    key: 'paySum'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('用户资产')
                    },
                    key: 'pocketBalanceChange'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('用户资产变动')
                    },
                    key: 'pocketBalanceSum'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('钱包余额')
                    },
                    key: 'propertyChange'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('钱包余额变动')
                    },
                    key: 'propertySum'
                }
            ],
            dataList: [],
            newDay: '',
            modalCurrency: false,
            selectedCurrency: '',
            currencyList: [],
            searchCurrency: '',
            currency: 'BTC'
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('statistics:getPropertyCurrencyName') ) {
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
        // 获取数据列表
        getTransformList () {
            statistics.getDataList.data = {
                currency: this.currency,
                endDate: this.endDate,
                strDate: this.startDate,
                type: 2
            }
            this.$axios(statistics.getDataList).then((res) => {
                this.dataList = res.data
            })
        },
        search () {
            if (this.formItem.applyDate && this.formItem.applyDate.length !== 0 && this.formItem.applyDate[0] !== '' && this.formItem.applyDate[0] !== null) {
                this.startDate = this.$moment(this.formItem.applyDate[0]).format()
                this.endDate = this.$moment(this.formItem.applyDate[1]).format()
                console.log(this.formItem.applyDate)
                if (this.selectedCurrency) {
                    this.showCurrency = this.selectedCurrency
                } else {
                    this.showCurrency = 'BTC'
                }
                this.getTransformList()
            }else {
                if (this.selectedCurrency) {
                    this.showCurrency = this.selectedCurrency
                } else {
                    this.showCurrency = 'BTC'
                }
               this.endDate = this.newDay
               this.startDate = ''
               this.formItem.applyDate = []
               this.getTransformList()
            }
        },
        // 选择币种
        chooseCurrency () {
            this.modalCurrency = true
        },
        visibleChange (modalShow) {
            if (this.currencyList.length === 0) {
                this.$axios(recharge.currencyList).then((res) => {
                    this.currencyList = res.data.map((item)=>{
                        item = item.toUpperCase();
                        return item
                    });
                })
            }
        },
        // 选中币种
        checkedCurrency (e) {
            let target = e.target;
            if (target.tagName !== 'BUTTON') {
                target = target.parentElement;
            }
            this.selectedCurrency = target.dataset.value;
        },
        ok () {
            this.currency = this.selectedCurrency;
        },
    }
}
</script>

<style lang="css">
</style>
