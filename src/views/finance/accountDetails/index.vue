<template>
    <div class="l-content">
        <div class="l-search" v-if="$store.state.user.checkPerm('pro:fince:system:accounts:detail')" >
            <Form ref="formItem" :model="formItem" :rules="ruleItem">
                <FormItem prop="currency">
                    <Input v-model="formItem.currency" :placeholder="$t('搜索币种')" class="m-search" @on-keyup="keyup"></Input>
                    <Button type="primary" v-on:click="search( 'formItem' )">{{ $t('查询') }}</Button>
                </FormItem>
            </Form>
        </div>
        <div class="l-table-body">
            <table>
                <caption>{{ $t('账户明细') }}</caption>
                <thead>
                    <tr>
                        <th>{{ $t('币种名称') }}</th>
                        <th>{{ $t('资产类型') }}</th>
                        <th>{{ $t('总账户') }}</th>
                        <th>{{ $t('运营账户') }}</th>
                        <th>{{ $t('资管账户') }}</th>
                        <th>{{ $t('活动账户') }}</th>
                        <th>{{ $t('返佣账户') }}</th>
                        <th>{{ $t('分叉账户') }}</th>
                        <th>{{ $t('保证金账户') }}</th>
                    </tr>
                </thead>
                <tbody v-for="param in list">
                    <tr>
                        <td  rowspan="2">{{ param.currency.toUpperCase() }}</td>
                        <td>{{ $t('可用') }}</td>
                        <td>{{ param.accounts.trade.systemAccount >= 0 ? param.accounts.trade.systemAccount : '--' }}</td>
                        <td>{{ param.accounts.trade.operationsAccount >= 0 ? param.accounts.trade.operationsAccount : '--' }}</td>
                        <td>{{ param.accounts.trade.assetManagementAccount >= 0 ? param.accounts.trade.assetManagementAccount : '--' }}</td>
                        <td>{{ param.accounts.trade.activitiesAccount >= 0 ? param.accounts.trade.activitiesAccount : '--' }}</td>
                        <td>{{ param.accounts.trade.returnCommissionAccount >= 0 ? param.accounts.trade.returnCommissionAccount : '--' }}</td>
                        <td>{{ param.accounts.trade.forkAccount >= 0 ? param.accounts.trade.forkAccount : '--' }}</td>
                        <td>{{ param.accounts.trade.marginAccount >= 0 ? param.accounts.trade.marginAccount : '--' }}</td>
                    </tr>
                    <tr>
                        <td>{{ $t('冻结') }}</td>
                        <td>{{ param.accounts.frozen.systemAccount >= 0 ? param.accounts.frozen.systemAccount : '--' }}</td>
                        <td>{{ param.accounts.frozen.operationsAccount >= 0 ? param.accounts.frozen.operationsAccount : '--' }}</td>
                        <td>{{ param.accounts.frozen.assetManagementAccount >= 0 ? param.accounts.frozen.assetManagementAccount : '--' }}</td>
                        <td>{{ param.accounts.frozen.activitiesAccount >= 0 ? param.accounts.frozen.activitiesAccount : '--' }}</td>
                        <td>{{ param.accounts.frozen.returnCommissionAccount >= 0 ? param.accounts.frozen.returnCommissionAccount : '--' }}</td>
                        <td>{{ param.accounts.frozen.forkAccount >= 0 ? param.accounts.frozen.forkAccount : '--' }}</td>
                        <td>{{ param.accounts.frozen.marginAccount >= 0 ? param.accounts.frozen.marginAccount : '--' }}</td>
                    </tr>
                </tbody>
                <tbody v-if="list.length === 0">
                  <tr>
                    <td rowspan="2" colspan="9" style="text-align:center;">{{ $t('暂无数据') }}</td>
                  </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { finance } from '__util/api';
    export default {
        data () {
            const currency = ( rule, value, callback ) => {
                if(value == ""){
                    callback();
                    return;
                }
                if ( !/^[A-Za-z0-9]+$/.test(value)) {
                    callback(new Error( this.$t('只可以输入英文跟数字') ) );
                }
                else{
                    callback();
                }
            };
            return {
                formItem: {
                    currency : ''
                },
                ruleItem : {
                    currency   : [
                        { validator: currency }
                    ]
                },
                list : []
            }
        },
        methods : {
            keyup (e){
                if(e.keyCode == 13){
                    this.search('formItem');
                }
            },
            search (name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //搜索
                        this.getData();
                    }
                    else{
                        this.loading = false;
                        setTimeout(()=>{
                            this.loading = true;
                        },0)
                    }
                })
            },
            getData (){
                let request = finance.accountDetails.accountsDetailList;
                request.params = { 'currency' : this.formItem.currency };
                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.list = res.data;
                    }
                })
                .catch((error,a) => {
                    this.popCapital = false;
                })
            }
        },
        created (){
            this.getData();
        }
    }
</script>

<style scoped>
    .l-content{
        margin: 0 10px;
    }
    .l-content .l-search{
        height: 32px;
        margin: 20px 0 20px 0;
    }
    .m-search{
        width: 260px;
        height: 32px;
    }
    .m-search-btn{
        width: 60px;
    }
    .l-table-body{
        border-radius: 4px;
        border: 1px solid #E6EAEE;
        background: #fff;
    }
    .l-table-body table{
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
    }
    .l-table-body table caption{
        height: 50px;
        padding: 0 20px;
        font-size: 16px;
        color: #354052;
        line-height: 50px;
        text-align: left;
    }
    .l-table-body table thead{
        background: #F5F8FA;
        border-top: 1px solid #E6EAEE;
        border-bottom: 1px solid #E6EAEE;
    }
    .l-table-body table thead th{
        font-weight: normal;
        height: 36px;
        color: #7F8FA4;
        text-align: left;
        padding: 0 20px;
    }
    .l-table-body table tbody td:first-child{
        border-left: 0;
    }
    .l-table-body table tbody td{
        border-bottom: 1px solid #E6EAEE;
        border-left: 1px solid #E6EAEE;
        height: 50px;
        padding: 0 20px;
    }
    .l-table-body table tfoot td{
        height: 50px;
        padding: 0 20px;
        text-align: right;
    }
</style>
