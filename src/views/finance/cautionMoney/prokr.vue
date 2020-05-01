<template lang="html">
    <div class="autoQuery">
        <Card>
            <p slot="title">
                {{ $t('保证金列表') }}
            </p>


            <Row type="flex" justify="center" align="middle" class="autoQueryList">
                <Table :columns="columns" :data="moneys" style="width: 100%;"></Table>
            </Row>
        </Card>

    </div>

</template>

<script>
import { legalTender } from '__util/api'
import {Button} from 'iview'
import Drawer from '__components/drawer.vue'
const query = {

  list:{method:'get',url:'v1/fince/margin/proInMgt/list'},
}
// import BankAccountAdd from './bankAccountAdd.vue'
export default {
    components:{
        Drawer,
        // BankAccountAdd1
    },
    bankinfo:{},
    data () {
        return {

            formTitle:'',
            moneys:[],
            modalAdd:false,
            currForm:{},
            ruleItem: {
                accountName: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                bankCode: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                // bankName: [
                //     {
                //         required: true,
                //         message: this.$t('不能为空'),
                //         trigger: 'change blur'
                //     }
                // ],

                remark: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],

                
            },

            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('币种名称')
                    },
                    key: 'currency'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('保证金余额')
                    },
                    key: 'balance'
                },
                // {
                //     renderHeader: (h) => {
                //         return this.$t('最低限额')
                //     },
                //     key: 'threshold'
                // },
                // {
                //     renderHeader: (h) => {
                //         return this.$t('追加保证金数额')
                //     },
                //     key: 'customType',
                // },
            

            ]
        }
    },
    mounted () {
        if(this.$store.state.user.checkPerm('fince:margin:proInMgt:list')){
            this.getList()
        }        

    },


    methods: {


        async getList (page) {

            let res = await this.$axios(query.list)
            // console.log(123,res)
            this.moneys = res.data||[]
            // this.banks = res.data.list

        }
    }
}


</script>

<style lang="less">
.autoQuery {
    .table-info {
        background-color: #ffffff;
        border: 1px solid #dddee1;
        border-top: none;
        padding: 15px 18px;
        width: 100%;
        padding-top: 15px;
        text-align: left;
    }
    .autoQueryList {
        & .ivu-table-wrapper {
            border-top: 0;
        }
        &:first-child {
            & .ivu-table-wrapper {
                border-top: 1px solid #dddee1;
            }
        }
    }
    th.widthcol{
        min-width: 150px;
    }

}










</style>
