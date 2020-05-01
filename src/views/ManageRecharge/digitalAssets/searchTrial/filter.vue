<template>
    <div>
        <ul class="search-filter">
            <li>
                <Select :placeholder="$t('币种（全部）')" style="min-width: 100px;" clearable @on-change="selectCurrencyChange" v-autoLocale>
                    <Option v-for="item in currencyList" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </li>
            <li>
                <Select :placeholder="$t('状态（全部）')" style="min-width: 110px;width: 230px;" clearable @on-change="selectStatusChange" v-autoLocale>
                    <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ $t(item.label) }}</Option>
                </Select>
            </li>
            <li>
                <Input :placeholder="$t('交易ID')" @on-change="setTxHash"/>
            </li>
            <li>
                <Input :placeholder="$t('订单ID')" @on-change="setOrderId"/>
            </li>
            <li>
                <Input placeholder="UID" @on-change="setUID"/>
            </li>
            <li>
                <Input :placeholder="$t('虚拟币充值地址')" @on-change="setAddress"/>
            </li>
            <li style="clear: both;">
                <DatePicker format="yyyy-MM-dd HH:mm:ss"
                            type="datetimerange"
                            placement="bottom-start"
                            :placeholder="$t('申请时间')+'-'+$t('起')+' -- '+ $t('申请时间') + '-'+ $t('止')"
                            @on-change="dateChange"
                            style="width: 300px"></DatePicker>
            </li>
            <li>
                <Dropdown trigger="custom" :visible="dropShow">
                    <Input :placeholder="$t('实提金额')+'-'+$t('起')+' -- '+ $t('实提金额') + '-'+ $t('止')" style="width:300px" readonly v-model="amountValue" @on-focus="handleOpen"/>
                    <DropdownMenu slot="list">
                        <div style="text-align: right; padding-right: 12px;"><a style="color:#000" @click="handleClose"><Icon type="close"></Icon></a></div>
                        <p style="width: 200px; text-align: center;">
                            <InputNumber :min="0"
                                         :class="setClass"
                                         :step="0.0001"
                                         v-model="formData.beginRealAmount"></InputNumber> -
                            <InputNumber :min="0"
                                         :class="setClass"
                                         :step="0.0001"
                                         v-model="formData.endRealAmount"></InputNumber>
                        </p>
                        <div style="text-align: right;margin:10px;">
                            <Button type="primary" :disabled="formData.beginRealAmount > formData.endRealAmount" @click="selectAmount">{{$t('确定')}}</Button>
                        </div>
                    </DropdownMenu>
                </Dropdown>
            </li>
        </ul>
        <div class="submit-btn">
            <Button type="primary" @click="searchData" v-if="$store.state.user.checkPerm('withdraw:list')">{{$t('查询')}}</Button>
        </div>
    </div>
</template>

<script>
    import {recharge} from '__util/api';

    export default {
        name: "FirstTrailFilter",
        computed:{
            setClass() {
                return this.formData.beginRealAmount > this.formData.endRealAmount ? 'error': ''
            },
            setPlacement(){
                return document.body.clientWidth < 1600? 'bottom-start' : 'bottom-end'
            }
        },
        created(){
            if (this.currencyList.length === 0) {
                this.$axios(recharge.currencyList).then((res) => {
                    if(res.data){
                        this.currencyList = res.data.map((item)=>{
                            return item.toUpperCase();
                        });
                    }
                })
            }
            this.statusList = this.statusList.map((item)=>{
                return {
                    label : this.$t(`status[${item}]`),
                    value : item
                }
            })
        },
        methods: {
            ok() {
                this.formData.currency = this.selectedCurrency;
            },
            setTxHash(e){
                this.formData.txHash = e.target.value
            },
            setOrderId(e){
                this.formData.orderId = e.target.value
            },
            setUID(e){
                this.formData.uid = e.target.value
            },
            setAddress(e){
                this.formData.toAddress = e.target.value
            },
            handleOpen() {
                this.dropShow = true;
                this.amountValue = null;
                this.formData.amountValue = null;
            },
            handleClose(){
                this.dropShow = false;
            },
            selectAmount() {
                this.dropShow = false;
                this.amountValue = `${this.formData.beginRealAmount } - ${this.formData.endRealAmount}`
                this.formData.amountValue = `${this.formData.beginRealAmount } - ${this.formData.endRealAmount}`
            },
            uidChange(e) {
                this.formData.uid=e.target.value;
            },
            selectCurrencyChange(value) {
                this.formData.currency=value;
            },
            selectStatusChange(value) {
                this.formData.orderStatus=value;
            },
            dateChange(date){
                this.formData.beginTime = date[0];
                this.formData.endTime = date[1];
            },
            searchData(){
                this.$emit('search', this.formData);
            }
        },
        data() {
            return {
                dropShow: false,
                currencyList: [],
                statusList:['0','1','2','3','4','5','6','7','8','9','10','11','12'],
                // actualCashValue: '',
                // actualCashMin:0,
                // actualCashMax:0,
                amountValue:null,
                formData:{
                    currency: null,
                    amountValue:null,
                    beginRealAmount:0,
                    endRealAmount:0,
                }
            }
        }
    }
</script>

<style lang="less">
    .filter-group {
        margin-bottom: 15px;
    }
    .search-filter > li{
        float: left;
        margin-right: 15px;
        margin-bottom: 15px;
    }
    .error{
        input {
            color:#f00
        }
    }
    .submit-btn{
        clear: both;
    }
</style>
