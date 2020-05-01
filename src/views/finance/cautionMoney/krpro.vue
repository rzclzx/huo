<template lang="html">
    <div class="autoQuery">
        <Card>
            <p slot="title">
                {{ $t('保证金列表') }}
            </p>
            <Button slot="extra" type="primary" @click.prevent="addModal" v-if="$store.state.user.checkPerm('fince:margin:mgtInPro:update')">{{ $t('增加币种') }}</Button>


            <Row type="flex" justify="center" align="middle" class="autoQueryList">
                <Table :columns="columns" :data="moneys" style="width: 100%;"></Table>
            </Row>
        </Card>

        <Drawer :show="modalAdd" @close="modalAdd = false" width="800px" placement="right">
            <p slot="header">{{ formTitle }}</p>
            <!-- <pre>{{currForm}}</pre> -->
            <Form :model="currForm" :label-width="150" ref="coinForm" :rules="ruleItem">

                <FormItem prop="currency" :label="$t('币种名称')">
                    <Input :disabled='!!currForm.id' v-model="currForm.currency" :placeholder="$t('')"></Input>
                </FormItem>
                <FormItem prop="priority" :label="$t('排序权重')">
                    <Input v-model.number="currForm.priority" :placeholder="$t('')"></Input>
                </FormItem>
                <FormItem prop="onceAdditionaAmount" :label="$t('单笔追加保证金额度')">
                    <Input :maxlength="20" v-model="currForm.onceAdditionaAmount" :placeholder="$t('')"></Input>
                </FormItem>
                <FormItem prop="threshold" :label="$t('最低限额')">
                    <Input v-model.number="currForm.threshold" :placeholder="$t('')"></Input>
                </FormItem>

                <!-- <FormItem prop="balance" :label="$t('追加保证金数额')">
                    <Input v-model.number="currForm.balance" :placeholder="$t('')"></Input>
                </FormItem> -->
                <FormItem prop="googleCode" :label="$t('Google双重验证')">
                    <Input v-model="currForm.googleCode" :placeholder="$t('')"></Input>
                </FormItem>


                <FormItem prop="value" style="textAlign: center;">
                    <!-- <Button type="ghost" @click="cancel" style="margin-right: 40px">{{ $t('取消') }}</Button> -->
                    <Button type="primary" @click="save">{{ $t('确定') }}</Button>
                </FormItem>
            </Form>



        </Drawer>
    </div>

</template>

<script>
import { legalTender } from '__util/api'
import {Button} from 'iview'
import Drawer from '__components/drawer.vue'
const query = {

  list:{method:'get',url:'v1/fince/caution/money/mgtInPro/list'},
  offline:{method:'post',url:'v1/fince/caution/money/mgtInPro/offline'},
  update:{method:'post',url:'v1/fince/caution/money/mgtInPro/update'},
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


                currency: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                priority: [
                    {
                        type:'number',
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                onceAdditionaAmount: [
                    {
                        type:'string',
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                threshold: [
                    {
                        type:'number',
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ],
                // balance: [
                //     {
                //         type:'number',
                //         required: true,
                //         message: this.$t('不能为空'),
                //         trigger: 'change blur'
                //     }
                // ],
                googleCode: [
                    {
                        required: true,
                        message: this.$t('不能为空'),
                        trigger: 'change blur'
                    }
                ]



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
                {
                    renderHeader: (h) => {
                        return this.$t('最低限额')
                    },
                    key: 'threshold'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('追加保证金数额')
                    },
                    key: 'onceAdditionaAmount',
                    // render:(h,params)=>this.accountType[params.row.customType]
                },
                {
                    renderHeader: (h) => {
                        return this.$t('权重')
                    },
                    key: 'priority',
                    // render:(h,params)=>this.accountType[params.row.customType]
                },

                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    key: 'state',
                    render:(h,params)=> params.row.state=='online'?this.$t('开启'):this.$t('停用')
                },


                {
                    renderHeader: (h) => {
                        return this.$t('操作')
                    },
                    width:"200px",
                    align:"center",
                    key: 'value',
                    render: (h, params) => {

                        return <div style="width:200px">
                            {this.$store.state.user.checkPerm('fince:margin:mgtInPro:update')?<Button style='color:#3399ff' type="text" size='small' onClick={()=>this.edit(params.row)}>{this.$t('修改')}</Button>:null}
                            {this.$store.state.user.checkPerm('fince:margin:mgtInPro:offline')?<Button style="margin-right:5px;" type="primary" size='small' onClick={()=>this.toggle(params.row)}> {params.row.state=='online'?this.$t('停用'):this.$t('开启')}</Button>:null}
                        </div>
                    }
                }
            ]
        }
    },
    mounted () {
        if(this.$store.state.user.checkPerm('fince:margin:mgtInPro:list')){
            this.getList()

        }

        // this.getBankName()
        // this.getAccountName()
    },

    watch:{
        modalAdd:function(val){
            if(!val){
                this.currForm = {}
            }
        }
    },
    methods: {
        async confirmSave(){

            if(Number(this.currForm.onceAdditionaAmount)!=this.currForm.onceAdditionaAmount){
                this.$Message.warning('保证金额度只能是数字')
                return
            }
            query.update.data = {...this.currForm,onceAdditionaAmount:Number(this.currForm.onceAdditionaAmount)}
            const res = await this.$axios(query.update)
            if(res.success){
                // this.$Message.success('成功')
                this.getList()
                this.modalAdd=false

            }else{
                // const obj = {

                //     'base-currency-not-open':"暂未开放，敬请期待",
                //     "base-update-error":"更新数据错误",
                //     "base-currency-error":"币种无效"

                //     // 'base-currency-error':'base-currency-not-open'
                // }
                // if(obj[res.data]){
                //     this.$Modal.error({
                //             title: this.$t('错误'),
                //             content: this.$t(obj[res.data])
                //         });
                // }
            }
        },
        save(){
            // const self = this
            this.$refs['coinForm'].validate((valid) => {
                if (valid) {

                    this.confirmSave()
                    // this.saveSub()
                } else {
                    // this.$Message.error(this.$t('表单验证不通过!'));
                }
            })


            // console.log(res)
        },
        addSuccess(){
            this.modalAdd = false
            this.getList()
        },
        addModal(){
            this.modalAdd = true
            this.formTitle = this.$t('增加币种')
            this.currForm = {}
        },

        edit(item){
            this.formTitle = this.$t('修改')
            this.modalAdd=true
            this.currForm = {...item}
        },
        toggle(item){
            let self = this
            const title = item.state=='online'?'停用':'开启'
            const state = item.state=='online'?'offline':'online'
                this.$Modal.confirm({
                    title: this.$t(title),
                    content: this.$t('是否'+title+'币种')+item.currency+'?',
                    async onOk(){

                        const obj = {...query.offline,data:{id:item.id,state}}
                        const res = await self.$axios(obj)
                        if(res.success){
                            self.$Message.success(self.$t(title+'币种成功'))
                            self.getList()
                        }

                    },
                    onCancel: () => {
                        // this.$Message.info('Clicked cancel');
                    }
                });


        },

        async getList (page) {

            let res = await this.$axios(query.list)
            // console.log(res)
            this.moneys = res.data
            // input写number无效果，且验证组件不检测，转位字符串
            this.moneys = this.moneys.map(item => {
                item.onceAdditionaAmount = item.onceAdditionaAmount.toString()
                return item
            })
            // this.banks = res.data.list

        }
    }
}


const getInput = (vm, h, params, type) => {
    return h('div', {
        style: {
            height: '50px',
            lineHeight: '50px'
        }
    }, [
        h('Input', {
            props: {
                value: params.row[type],
                disabled: !vm.$store.state.user.checkPerm('risk:management:update')
            },
            style: {
                height: '30px',
                lineHeight: '30px'
            },
            on: {
                input: (val) => {
                    params.row[type] = val
                },
                'on-blur': () => {
                    if (params.row[type] === '') {
                        params.row[type] = null
                    }
                }
            }
        })
    ])
}


const getButton = (vm, h, params, type, code) => {
    return h('Button', {
        props: {
            type: 'primary',
        },
        on: {
            click: () => {
                // let obj = handler.clone(limit.common.commonUpdate)
                // legalTender
                let obj = {...legalTender.userLimitUpdate}
                // console.log(params)
                // console.log(obj)
                console.log(code)
                let valid = false
                if(code=='day'){
                    if (validate(vm, params.row.dailyLevel1) && validate(vm, params.row.dailyLevel2) && validate(vm, params.row.dailyLevel3) && validate(vm, params.row.dailyLevel4)) {
                        valid = true
                    }
                }
                if(code=='month'){
                    if (validate(vm, params.row.monthlyLevel1) && validate(vm, params.row.monthlyLevel2) && validate(vm, params.row.monthlyLevel3) && validate(vm, params.row.monthlyLevel4)) {
                        valid = true
                    }
                }


                if (valid) {
                    obj.data = {
                        currency: params.row.currency,
                        // operator: code=='day'?0:1,
                        dailyLevel1: params.row.dailyLevel1,
                        dailyLevel2: params.row.dailyLevel2,
                        dailyLevel3: params.row.dailyLevel3,
                        dailyLevel4: params.row.dailyLevel4,
                        monthlyLevel1: params.row.monthlyLevel1,
                        monthlyLevel2: params.row.monthlyLevel2,
                        monthlyLevel3: params.row.monthlyLevel3,
                        monthlyLevel4: params.row.monthlyLevel4,
                    }

                    vm.$axios(obj).then(res => {
                        vm.$Modal.info({
                            content: vm.$t('修改成功')
                        })
                        vm.refresh()
                    }).catch(res => {
                        vm.$Modal.error({
                            content: vm.$t('errorCode.' + res)
                        })
                        vm.refresh()
                    })
                }
            }
        }
    }, vm.$t('修改'))
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
