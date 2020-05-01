<template lang="html">
    <div class="autoQuery">
        <Row type="flex" >

            <Form :model="form" inline>
                <FormItem>
                    <Input class="widthInput" :placeholder="$t('请输入银行帐号')" v-model="form.bankNumber"/>
                </FormItem>
                <FormItem>
                    <Select v-model="form.bankName" clearable :placeholder="$t('开户行')" style="width: 100px" v-autoLocale>
                        <Option v-for="item in bankNames" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select v-model="form.accountName" clearable :placeholder="$t('开户名')" style="width: 100px" v-autoLocale>
                        <Option v-for="item in accountNames" :value="item" :key="item">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select v-model="form.accountStatus" clearable :placeholder="$t('账户状态')" style="width: 100px" v-autoLocale>
                        <Option v-for="(item,index) in accountStatus" :value="index" :key="item">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select v-model="form.useStatus" clearable :placeholder="$t('使用状态')" style="width: 100px" v-autoLocale>
                        <Option v-for="(item,index) in useStatus" :value="index" :key="item">{{ item }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('manuallegal:hbreceiptaccount:list')">{{$t('查询')}}</Button>
                </FormItem>
            </Form>
        </Row>
        <Card>
            <p slot="title">
                {{ $t('银行信息') }}
            </p>
            <Button slot="extra" type="primary" @click.prevent="addModal" v-if="$store.state.user.checkPerm('manuallegal:hbreceiptaccount:save')">{{ $t('新建银行账户') }}</Button>


            <Row type="flex" justify="center" align="middle" class="autoQueryList">
                <Table :columns="columns" :data="banks" style="width: 100%;"></Table>
            </Row>
            <div class="page-pane" v-if="$store.state.user.checkPerm('manuallegal:hbreceiptaccount:list')">
                <Page show-elevator :total="page.total" :page-size="page.pageSize" :current="page.currPage" @on-change="getList" size="small" show-total>
                    <slot>
                        {{ $t('共') + ' ' + page.total + ' ' + $t('条') }}
                    </slot>
                </Page>
            </div>
        </Card>

        <Drawer :show="modalAdd" @close="modalAdd = false" width="800px" placement="right">
            <p slot="header">{{ $t('银行账户') }}</p>
            <BankAccountAdd :bankinfo='editbank' :bankNames="bankNames" @cancel="modalAdd = false" @success="addSuccess"></BankAccountAdd>
            <!-- <ApplyListAdd @cancel="drawerShow = false"></ApplyListAdd> -->
        </Drawer>
    </div>

</template>

<script>
import { legalTender } from '__util/api'
import {Button} from 'iview'
import Drawer from '__components/drawer.vue'
import BankAccountAdd from './bankAccountAdd.vue'
export default {
    components:{
        Drawer,
        BankAccountAdd
    },
    bankinfo:{},
    data () {
        return {
            modalAdd:false,
            accountType:[this.$t('普通'),this.$t('大客户')],
            useStatus:[this.$t('使用中'),this.$t('暂停')],
            accountStatus:[this.$t('正常'),this.$t('停止')],
            banks:[],
            bankNames:[],
            accountNames:[],
            editbank:{},
            form:{

            },
            dateRange: [],
            page: {
                currPage: 1,
                pageSize: 10,
                total: 0
            },
            columns: [
                {
                    renderHeader: (h) => {
                        return this.$t('开户行')
                    },
                    key: 'bankName'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('开户名')
                    },
                    key: 'accountName'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('银行帐号')
                    },
                    key: 'bankNumber'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('类型')
                    },
                    key: 'customType',
                    render:(h,params)=>this.$t(this.accountType[params.row.customType])
                },
                {
                    renderHeader: (h) => {
                        return this.$t('提示信息')
                    },
                    key: 'remark'
                },
                {
                    renderHeader: (h) => {
                        return this.$t('最近操作')
                    },
                    key: 'updateTime',
                },

                {
                    renderHeader: (h) => {
                        return this.$t('账户状态')
                    },
                    key: 'accountStatus',
                    render:(h,params)=>this.$t(this.accountStatus[params.row.accountStatus])
                },
                {
                    renderHeader: (h) => {
                        return this.$t('使用状态')
                    },
                    key: 'useStatus',
                    render:(h,params)=>this.$t(this.useStatus[params.row.useStatus])
                },
                {
                    renderHeader: (h) => {
                        return this.$t('链接')
                    },
                    width:'170px',
                    key: 'url',
                    render:(h,params)=><a target="_blank" href={params.row.url}>{params.row.url}</a>
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
                            {this.$store.state.user.checkPerm('manuallegal:hbreceiptaccount:update')?<Button style='color:#3399ff' type="text" size='small' onClick={()=>this.edit(params.row)}>{this.$t('编辑')}</Button>:null}
                            {this.$store.state.user.checkPerm('manuallegal:hbreceiptaccount:updateUseStatus')?<Button style="margin-right:5px;" type="primary" size='small' onClick={()=>this.toggle(params.row)}> {params.row.useStatus===0?this.$t("暂停使用"):this.$t("恢复使用")}</Button>:null}
                            {this.$store.state.user.checkPerm('manuallegal:hbreceiptaccount:delete')?<Button type="error" size='small' onClick={()=>this.toggle(params.row,'remove')}>{this.$t('删除')}</Button>:null}
                        </div>
                    }
                }
            ]
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('manuallegal:hbreceiptaccount:list') ) {
            this.getList()
            this.getBankName()
            this.getAccountName()
        }
    },
    methods: {
        addSuccess(){
            this.modalAdd = false
            this.getList()
        },
        addModal(){
            this.modalAdd = true
            this.editbank = {}
            console.log('add Bank modal')
        },

        edit(item){
            this.modalAdd=true
            this.editbank = item
            console.log('Edit Bank modal')

        },
        toggle(item,remove){
            let self = this
            let obj = {}
            if(item.useStatus===0){
                obj.title = '暂停使用银行帐号'

            }else{
                obj.title = '恢复使用银行帐号'
            }
            if(remove){
                obj.title= '删除银行帐号'
            }
                this.$Modal.confirm({
                    title: self.$t(obj.title),
                    content: `
                    <table style="width:100%">
                        <tr style="line-height:40px">
                            <td colspan="2">
                                <span style="display:inline-block">
                                ${self.$t('确认要'+obj.title)}
                                </span>
                        </tr>
                        <tr style="line-height:40px">
                            <td>
                                <span style="display:inline-block;width:50px">

                                ${self.$t('开户行')} :
                                </span>
                            <span class="text-primary">${item.bankName}</span></td>
                            <td>
                            <span style="display:inline-block;width:50px">

                                ${self.$t('开户名')}:
                                </span>
                            <span class="text-primary">${item.accountName}</span></td>
                        </tr>
                        <tr style="line-height:40px">
                            <td colspan="2">
                             <span style="display:inline-block;width:50px">

                                ${self.$t('帐号')}:
                                </span>
                            <span class="text-primary">${item.bankNumber}</span></td>
                        </tr>
                    </table>`,
                    async onOk(){
                        if(remove){
                            const obj = {...legalTender.bankDelete,data:{id:item.id}}
                            const res = await self.$axios(obj)
                            if(res.success){
                                self.$Message.success(self.$t('删除成功'));
                                self.getList()
                            }
                        }else{
                            const status = item.useStatus===0?1:0
                            const obj = {...legalTender.bankUpdateUseStatus,data:{id:item.id,useStatus:status}}
                            const res = await self.$axios(obj)
                            if(res.success){
                                self.$Message.success(self.$t('修改成功'))
                                self.getList()
                            }
                        }

                    },
                    onCancel: () => {
                        // this.$Message.info('Clicked cancel');
                    }
                });


        },
        search () {
            this.getList()
        },
        async getAccountName(bankName=''){
            const obj = {...legalTender.accountName,data:{bankName}}
            const res = await this.$axios(obj)
            this.accountNames = res.data

        },
        async getBankName(){
            const res = await this.$axios(legalTender.bankInfo)
            this.bankNames = res.data
            console.log('info',res)
        },
        async getList (page) {
            legalTender.bankList.data = {...this.form}
            legalTender.bankList.data.page = page ? page : this.page.currPage
            legalTender.bankList.data.limit =  this.page.pageSize

            let res = await this.$axios(legalTender.bankList)
            this.banks = res.data.list
            // console.log(res)
            this.page.currPage = res.data.currPage
            this.page.pageSize = res.data.pageSize
            this.page.total = res.data.totalCount
        }
    },
    watch: {
        dateRange (val) {
            this.formItem.startTime = this.$moment(val[0]).format()
            this.formItem.endTime = this.$moment(val[1]).format()
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
