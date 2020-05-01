<style lang="less" scope>
.modal-content{
    margin: 30px auto;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: center;
    div{
        width: 20%;
        height: 60px;
        text-align: center;
        div{
            width: 120px;
            height: 40px;
            border: 1px solid #dddee1;
            border-radius: 4px;
            font-size: 16px;
            line-height: 40px;
            position: relative;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            cursor: pointer!important;
        }
    }
}
.current{
    background-color: #CED5E0;
    border: none!important;
}
</style>
<template>
    <div>
        <div v-if="$store.state.user.checkPerm('user:mgt:query:entrust:list')" class="flex-start-center" style="margin-top: 20px">
            <div class="input" style="margin-right: 10px">
                <Input v-model="basis" :placeholder="$t('基础货币')">
                    <Select v-model="currency" slot="prepend" style="width: 80px" :placeholder="$t('计价货币')" v-autoLocale>
                        <Option v-for="i in currencyList" :value="i">{{i}}</Option>
                    </Select>
                </Input>
            </div>
            <Button @click="refresh" type="primary" style="margin-right: 10px" v-if="$store.state.user.checkPerm('user:mgt:query:entrust:list')">{{$t('查询')}}</Button>
            <!--<Button @click="toggleModal" size="large" type="primary" style="margin-right: 30px">{{$t('选择交易对')}}</Button>!-->
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('委托记录')}}
                    </p>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table0Date"
                            :columns="table0Column"
                    ></Table>
                    <Row style="margin-top: 10px">
                        <Col span="24">
                            <div class="flex-end-center">
                                <Button @click="pre" type="primary" style="margin-right: 10px">{{$t('上一页')}}</Button>
                                <Button @click="next" type="primary">{{$t('下一页')}}</Button>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
import { operation, user } from '__util/api';
import handler from '__util/publicMethod';
export default {
    name: 'entrust',
    data () {
        return {
            table0Date: [],
            table0Column: [],
            basis: '',
            currency: '',
            currencyList: [],
            offset: 0,
            firstId: 0,
            lastId: 0
        }
    },
    props: {
        userId: String
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.table0Column = column0(this)
            this.$axios(operation.currencyList).then(res => {
                this.currencyList = res.data
            })
        },
        refresh () {
            let obj = handler.clone(user.entrust)
            obj.data = {
                symbol: this.basis + this.currency,
                userId: this.userId*1,
                offset: this.offset
            }
            this.$axios(obj).then(res => {
                this.table0Date = res.data.items || []
            })
        },
        pre () {
            this.offset = this.lastId
            this.refresh()
        },
        next () {
            this.offset = this.firstId
            this.refresh()
        }
    }
}

export const column0 = (vm) => {
    return [
    {
        renderHeader: (h) => {
            return vm.$t('订单ID')
        },
        align: 'left',
        key: 'id'
    },
    {
        renderHeader: (h) => {
            return vm.$t('交易对')
        },
        align: 'left',
        key: 'symbol'
    },
    {
        renderHeader: (h) => {
            return vm.$t('委托时间')
        },
        width: 200,
        align: 'left',
        key: 'createdAt'
    },
    {
        renderHeader: (h) => {
            return vm.$t('委托类型')
        },
        align: 'left',
        key: 'type'
    },
    {
        renderHeader: (h) => {
            return vm.$t('委托价格 (USDT)')
        },
        align: 'left',
        key: 'price'
    },
    {
        renderHeader: (h) => {
            return vm.$t('委托数量')
        },
        align: 'left',
        key: 'fieldAmount'
    },
    {
        renderHeader: (h) => {
            return vm.$t('委托总额 (USDT)')
        },
        align: 'left',
        key: 'fieldCashAmount'
    },
    {
        renderHeader: (h) => {
            return vm.$t('已处理数量')
        },
        align: 'left',
        key: 'amount'
    },
    {
        renderHeader: (h) => {
            return vm.$t('来源')
        },
        align: 'left',
        key: 'source'
    },
    {
        renderHeader: (h) => {
            return vm.$t('状态')
        },
        align: 'left',
        key: 'state'
    }
]
}
</script>
