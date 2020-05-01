<style lang="less" scope>
@import '../../../../../assets/style/layout.less';
@import '../../../../../assets/style/public.less';
.modal-content{
    margin: 30px auto;
    .flex-wrap-start-center;
    div{
        width: 20%;
        height: 60px;
        text-align: center;
        div{
            width: 120px;
            height: 40px;
            .border-gray-1;
            border-radius: 4px;
            font-size: 16px;
            line-height: 40px;
            .center;
            .pointer;
        }
    }
}
.current{
    .gray-current;
}
</style>
<template>
    <div>
        <div v-if="$store.state.user.checkPerm('user:mgt:query:fince:list')" class="flex-start-center" style="margin-top: 20px">
            <div style="width: 260px;margin-right: 10px">
                <Input v-model="currency" :placeholder="$t('币种查询')"></Input>
            </div>
            <Select v-model="type" style="width: 140px;margin-right: 10px" :placeholder="$t('请选择')" v-autoLocale>
                <Option :value="''">{{$t('全部')}}</Option>
                <Option :value="'withdraw'">{{$t('法币提现')}}</Option>
                <Option :value="'withdraw'">{{$t('法币充值')}}</Option>
                <Option :value="'withdraw'">{{$t('数字货币提现')}}</Option>
                <Option :value="'deposit'">{{$t('数字货币充值')}}</Option>
                <Option :value="'transfer_in'">{{$t('平台转入')}}</Option>
                <Option :value="'transfer_out'">{{$t('平台转出')}}</Option>
                <Option :value="'assign'">{{$t('资金划转')}}</Option>
                <Option :value="'fork_transfer'">{{$t('分叉币转换')}}</Option>
            </Select>
            <Button @click="refresh" type="primary" style="margin-right: 10px" v-if="$store.state.user.checkPerm('user:mgt:query:fince:list')">{{$t('查询')}}</Button>
        </div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <p slot="title">
                        {{$t('财务记录')}}
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
import { user } from '__util/api';
import handler from '__util/publicMethod';
export default {
    name: 'finance',
    data () {
        return {
            table0Date: [],
            table0Column: [],
            type: '',
            currency: '',
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
        },
        refresh () {
            let obj = handler.clone(user.finance)
            obj.data = {
                currency: this.currency,
                type: this.type,
                userId: this.userId*1,
                offset: this.offset
            }
            this.$axios(obj).then(res => {
                this.table0Date = res.data.items || []
                this.firstId = res.data.firstId
                this.lastId = res.data.lastId
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

const column0 = (vm) => {
    return [
    {
        renderHeader: (h) => {
            return vm.$t('币种')
        },
        align: 'left',
        key: 'currency'
    },
    {
        renderHeader: (h) => {
            return vm.$t('类型')
        },
        align: 'left',
        key: 'type'
    },
    {
        renderHeader: (h) => {
            return vm.$t('时间')
        },
        width: 200,
        align: 'left',
        key: 'prepaidTime'
    },
    {
        renderHeader: (h) => {
            return vm.$t('订单ID')
        },
        align: 'left',
        key: 'id'
    },
    {
        renderHeader: (h) => {
            return vm.$t('交易ID')
        },
        align: 'left',
        key: 'orderId'
    },
    {
        renderHeader: (h) => {
            return vm.$t('对方账号／地址')
        },
        width: 350,
        align: 'left',
        key: 'address'
    },
    {
        renderHeader: (h) => {
            return vm.$t('渠道')
        },
        align: 'left',
        key: 'channel'
    },
    {
        renderHeader: (h) => {
            return vm.$t('数量')
        },
        align: 'left',
        key: 'amount'
    },
    {
        renderHeader: (h) => {
            return vm.$t('手续费')
        },
        align: 'left',
        key: 'withdrawFee'
    },
    {
        renderHeader: (h) => {
            return vm.$t('状态')
        },
        align: 'left',
        key: 'status'
    }
]
}
</script>
