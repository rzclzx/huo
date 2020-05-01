<template>
    <div>
        <Row :gutter="15" :class-name="'filter-group'">
            <Col span="3">
            <Input :placeholder="$t('币种查询')" v-model="formData.currency"/>
            </Col>
            <Col span="3">
            <Button type="primary" @click="modalShow = true">{{$t ('选择币种')}}</Button>
            </Col>
        </Row>
        <Row :gutter="15" :class-name="'filter-group'">
            <Col span="3">
            <Input placeholder="UID" @on-change="uidChange"/>
            </Col>
            <Col span="5">
            <Select :placeholder="$t('实提金额排序')" v-model="total_amount_sidx" @on-change="selectRealAmountChange" v-autoLocale>
                <Option v-for="item in total_amount" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="4">
            <Select :placeholder="$t('手续费排序')" v-model="fees_sidx" @on-change="selectFeeChange" v-autoLocale>
                <Option v-for="item in fees" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="7">
            <DatePicker v-if="showDate" format="yyyy-MM-dd HH:mm:ss"
                        type="datetimerange"
                        placement="bottom-end"
                        transfer
                        :placeholder="$t('申请时间') +'-'+ $t('起')+'--'+ $t('申请时间')+'-'+$t('止')"
                        @on-change="dateChange"
                        style="width: 100%"></DatePicker>
            <div v-else class="ivu-date-picker" style="width: 100%;">
                <div class="ivu-date-picker-rel">
                    <div class="ivu-input-wrapper ivu-input-type ivu-date-picker-editor"><!---->
                        <i class="ivu-icon ivu-icon-ios-calendar-outline ivu-input-icon ivu-input-icon-normal" _vimium-has-onclick-listener=""></i>
                        <!---->
                        <input autocomplete="off" spellcheck="false" type="text" :placeholder="$t('申请时间') +'-'+ $t('起')+'--'+ $t('申请时间')+'-'+$t('止')" class="ivu-input">
                        <!----></div>
                </div>
                <div class="ivu-select-dropdown" _vimium-has-onclick-listener="" style="display: none;">
                    <div></div>
                </div>
            </div>
            </Col>
        </Row>

        <Row :gutter="15" :class-name="'filter-group'">
            <Col span="4">
            <Button type="primary" @click="searchData">{{$t('查询')}}</Button>
            </Col>
        </Row>
        <Modal
            v-model="modalShow"
            :title="$t('选择币种')"
            @on-visible-change="visibleChange"
            :ok-text="$t('确定')"
            :cancel-text="$t('取消')"
            @on-ok="ok">
            <Row :gutter="30" type="flex" justify="start">
                <Col span="6" v-if="currencyList.length > 0 && currency !== 'KRW'" style="margin-bottom: 20px;" v-for="(currency,index) in currencyList" :key="index" >
                    <Button @click="chooseCurrency"
                            :type="(selectedCurrency == currency)?'primary':'ghost'"
                            style="min-width: 80px;"
                            :data-value="currency">
                        {{currency}}
                    </Button>
                </Col>
            </Row>
            <div slot="footer" style="border-top: 0">
                <Button type="ghost" @click="cancel()">{{ $t('取消') }}</Button>
                <Button type="primary" @click="ok()">{{ $t('确定') }}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {recharge} from '__util/api';
    export default {
        name: "trial-filter",
        methods: {
            ok() {
                this.modalShow = false;
                this.formData.currency = this.selectedCurrency;
                // this.formData.currencyText = this.selectedCurrencyText;
            },
            visibleChange(modalShow) {

                if (this.currencyList.length === 0) {
                    this.$axios(recharge.currencyList).then((res) => {
                        this.currencyList = res.data.map((item)=>{
                            item = item.toUpperCase();
                            return item
                        });
                    })
                }

            },
            cancel() {
                this.modalShow = false
            },
            chooseCurrency(e) {
                let target = e.target;
                if (target.tagName !== 'BUTTON') {
                    target = target.parentElement;
                }
                this.selectedCurrency = target.dataset.value;
            },
            uidChange(e) {
                this.formData.uid=e.target.value;
            },
            selectRealAmountChange(value) {
                this.formData.sidx='total_amount';
            },
            selectFeeChange(value) {
                this.formData.sidx='fees';
            },
            dateChange(date){
                //startTime
                this.formData.beginTime = date[0];
                this.formData.endTime = date[1];
            },
            searchData(){
                if(this.total_amount_sidx !== null){
                    this.formData.sidx = 'total_amount';
                    this.formData.order = this.total_amount_sidx;
                }else if (this.fees_sidx !== null){
                    this.formData.sidx = 'fees';
                    this.formData.order = this.fees_sidx;
                }
                this.$emit('search', this.formData);
            }
        },
        watch: {
            "$store.state.app.lang": {
                handler(val, oldVal) {
                    this.showDate = false;
                    setTimeout(()=>{
                        this.showDate= true;
                    },0)
                },
                deep: true
            },
            total_amount_sidx(newValue) {
                if(this.formData.sidx === 'total_amount'){
                    this.formData.order=newValue;
                    this.fees_sidx = null;
                }
            },
            fees_sidx(newValue){
                if(this.formData.sidx === 'fees'){
                    this.fees_sidx = newValue;
                    this.total_amount_sidx = null;
                }
            }
        },
        data() {
            return {
                modalShow: false,
                currencyList: [],
                selectedCurrency: '',
                total_amount_sidx:null,
                fees_sidx:null,
                showDate: true,
                total_amount : [
                    {
                        value: 'asc',
                        label: this.$t('实提金额正序排列')
                    },
                    {
                        value: 'desc',
                        label: this.$t('实提金额倒序排列')
                    }
                ],
                fees: [
                    {
                        value: 'asc',
                        label: this.$t('手续费正序排列')
                    },
                    {
                        value: 'desc',
                        label: this.$t('手续费倒序排列')
                    }
                ],
                formData:{
                    sidx: null,
                    order:null,
                    currency: null
                }
            }
        }
    }
</script>

<style lang="less">
    .filter-group {
        margin-bottom: 15px;
    }
</style>
