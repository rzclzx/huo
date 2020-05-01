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
        <div class="flex-start-center">
            <div class="input" style="margin-right: 10px">
                <Input v-model="basis" :placeholder="$t('计价货币')">
                    <Select v-model="currency" slot="prepend" style="width: 80px" :placeholder="$t('基础货币')" v-autoLocale>
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
                        {{$t('成交记录')}}
                    </p>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table0Date"
                            :columns="table0Column"
                    ></Table>
                    <Row style="margin-top: 10px">
                        <Col span="24">
                            <div class="flex-end-center">
                                <Button :disabled="!prevAllow" @click="pre" type="primary" style="margin-right: 10px">{{$t('上一页')}}</Button>
                                <Button :disabled="!nextAllow" @click="next" type="primary">{{$t('下一页')}}</Button>
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
            table0Cache: [],
            table0Date: [],
            table0Column: [],
            basis: '',
            currency: '',
            currencyList: [],
            direct: null,
            offset: null,
            size: 11,
            prevAllow: 0,
            nextAllow: false
        }
    },
    created () {
        this.init()
    },
    props: {
        uid: Number
    },
    methods: {
        init () {
            this.table0Column = column0(this)
            this.$axios(operation.currencyList).then(res => {
                this.currencyList = res.data
            })
            this.refresh()
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
                uid: this.uid*1,
                direct: this.direct,
                offset: this.offset,
                size: this.size
            }
            for (let i in obj.data) {
                if (!obj.data[i]) delete obj.data[i]
            }
            this.$axios(obj).then(res => {
                    this.table0Cache = res.data.items
                    this.table0Date = JSON.parse(JSON.stringify(this.table0Cache))
                    if (this.table0Date.length === 11) {
                        this.table0Date.pop()
                    }
                    if (this.direct) {
                        if (this.direct === 'next') {
                            if (this.table0Cache.length < this.size) {
                                this.nextAllow = false
                            } else {
                                this.nextAllow = true
                            }
                            this.prevAllow++
                        } else {
                            this.prevAllow--
                            this.nextAllow = true
                        }
                    } else if (this.direct === null) {
                        if (this.table0Cache.length === this.size) {
                            this.nextAllow = true
                        }
                    }
                    this.direct = ''
                    if (this.table0Cache.length === 0) {
                        this.prevAllow = 0
                        this.nextAllow = true
                    }
            })
        },
        pre () {
            this.direct = 'prev'
            this.offset = this.table0Cache[0] && this.table0Cache[0].id
            this.refresh()
        },
        next () {
            this.direct = 'next'
            this.offset = this.table0Cache[this.table0Cache.length - 1] && this.table0Cache[this.table0Cache.length - 1].id
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
            return vm.$t('userInfo["交易对"]')
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
        key: 'orderType',
        render:(h,param)=>param.row.orderType
    },
    {
        renderHeader: (h) => {
            return vm.$t('成交方向')
        },
        align: 'left',
        key: 'direction',
        render: (h, params) => {
          if (params.row.direction === 'submit-cannel') {
              return vm.$t('已取消')
          } else if (params.row.direction.indexOf('sell') != -1) {
              return vm.$t('卖出')
          } else {
              return vm.$t('买入')
          }
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('成交价格')
        },
        align: 'left',
        // key: 'price',
        render: (h, params) => {
            return (params.row.price*1).toFixed(8)
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('成交数量')
        },
        align: 'left',
        // key: 'filledAmount',
        render: (h, params) => {
            return (params.row.filledAmount*1).toFixed(8)
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('成交总额')
        },
        align: 'left',
        // key: 'filledCashAmount',
        render: (h, params) => {
            return (params.row.filledCashAmount*1).toFixed(8)
        }
    },
    {
        renderHeader: (h) => {
            return vm.$t('手续费')
        },
        align: 'left',
        // key: 'fieldFees',
        render: (h, params) => {
            return (params.row.fieldFees*1).toFixed(8)
        }
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
