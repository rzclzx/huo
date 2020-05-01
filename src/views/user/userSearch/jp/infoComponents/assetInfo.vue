<style lang="less" scope>
.search-box{
    position: relative;
    width: 140px;
    heigth: 28px;
    input{
        height: 28px;
    }
    button{
        width: 60px;
        height: 28px;
        position: absolute;
        top: 0;
        right: 0;
    }
}
.title-left{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    color: #FF3E55;
    p{
        margin-right: 30px;
    }
    div{
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        margin-right: 30px;
        div{
            white-space: nowrap;
        }
    }
}
</style>
<template>
    <div>
        <Row style="margin-top: 20px">
            <Col>
                <Card class="dis-select">
                    <div slot="title" class="flex-between-center">
                        <div class="title-left">
                            <p>{{$t('现货资产')}}</p>
                            <div>
                                <div>{{$t('净资产折合')}} ({{ 'BTC' }}) : {{ totalBalance }} </div>
                            </div>
                        </div>
                        <div v-if="$store.state.user.checkPerm('user:mgt:query:asset:list')" class="flex-start-center">
                            <div style="margin-right: 10px">
                                <Input v-model="value" size="small" type="text" :placeholder="$t('输入币种')"></Input>
                            </div>
                            <Button @click="refresh" size="small" type="primary" v-if="$store.state.user.checkPerm('user:mgt:query:asset:list')">{{$t('查询')}}</Button>
                        </div>
                    </div>
                    <Table  refs="table0"
                            :no-data-text="$t('暂无数据')"
                            :data="table0Date"
                            :columns="table0Column"
                    ></Table>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
import { user } from '__util/api';
import handler from '__util/publicMethod';
export default {
    name: 'assetInfo',
    data () {
        return {
            table0Date: [],
            table0Column: [],
            value: '',
            totalBalance: 0
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
            let obj = handler.clone(user.assetList)
            obj.url += '/' + this.userId
            obj.params = {
                currency: this.value
            }
            this.$axios(obj).then(res => {
                this.table0Date = res.data.data || []
                this.totalBalance = res.data.totalBalance
            })
        }
    }
}

const column0 = (vm) => {
    return [
    {
        renderHeader: (h) => {
            return vm.$t('币种名称')
        },
        align: 'left',
        key: 'currency'
    },
    {
        renderHeader: (h) => {
            return vm.$t('可用资产')
        },
        align: 'left',
        key: 'trade'
    },
    {
        renderHeader: (h) => {
            return vm.$t('冻结资产')
        },
        align: 'left',
        key: 'frozen'
    },
    {
        renderHeader: (h) => {
            return vm.$t('冲币地址')
        },
        align: 'left',
        key: 'address'
    }
]
}
</script>
