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
        <div class="flex-start-center" style="margin-top: 20px">
            <div class="input" style="margin-right: 10px">
                <Input v-model="basis" :placeholder="$t('基础货币')">
                    <Select v-model="currency" slot="prepend" style="width: 80px" :placeholder="$t('计价货币')" v-autoLocale>
                        <Option v-for="i in currencyList" :value="i">{{i}}</Option>
                    </Select>
                </Input>
            </div>
            <Button @click="refresh" type="primary" style="margin-right: 10px" v-if="$store.state.user.checkPerm('user:mgt:query:complete:list')">{{$t('查询')}}</Button>
            <!--<Button @click="toggleModal" size="large" type="primary" style="margin-right: 30px">{{$t('选择交易对')}}</Button>!-->
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
        <!--<Modal v-model="showModal" width="800">
            <h3 class="modal-title">{{$t('选择交易对')}}</h3>
            <div class="modal-content">
                <div v-for="(i, index) in modalArr">
                    <div @click="choiceCell(index)" :class="{ current: modalCurrent === index }">{{ i }}</div>
                </div>
            </div>
        </Modal>!-->
    </div>
</template>
<script>
import { operation, user } from '__util/api';
import handler from '__util/publicMethod';
export default {
    name: 'trade',
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
    created () {
        this.init()
    },
    props: {
        userId: String
    },
    methods: {
        init () {
            this.table0Column = column0(this)
            this.$axios(operation.currencyList).then(res => {
                this.currencyList = res.data
            })
        },
        // toggleModal () {
        //     this.showModal = !this.showModal
        // },
        // choiceCell (index) {
        //     this.value = this.modalArr[index]
        //     this.modalCurrent = index
        // },
        refresh () {
            let obj = handler.clone(user.trade)
            obj.data = {
                symbol: this.currency + this.basis,
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

const column0 = (vm) => {
    return [
    {
        renderHeader: (h) => {
            return vm.$t('成交ID')
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
            return vm.$t('成交时间')
        },
        width: 200,
        align: 'left',
        key: 'createdAt'
    },
    {
        renderHeader: (h) => {
            return vm.$t('IP 成交类型')
        },
        align: 'left',
        key: 'direction'
    },
    {
        renderHeader: (h) => {
            return vm.$t('成交方向')
        },
        align: 'left',
        key: 'orderType'
    },
    {
        renderHeader: (h) => {
            return vm.$t('成交价格 (USDT)')
        },
        align: 'left',
        key: 'price'
    },
    {
        renderHeader: (h) => {
            return vm.$t('成交数量 (ETH)')
        },
        align: 'left',
        key: 'filledAmount'
    },
    {
        renderHeader: (h) => {
            return vm.$t('成交总额 (USDT)')
        },
        align: 'left',
        key: 'fieldFees'
    },
    {
        renderHeader: (h) => {
            return vm.$t('手续费')
        },
        align: 'left',
        key: 'price'
    },
    {
        renderHeader: (h) => {
            return vm.$t('对手UID')
        },
        align: 'left',
        key: 'matchUid'
    }
]
}
</script>
