<template>
    <div class="trial-outer-container">
        <SearchFilter v-on:search="searchData" />
        <Card style="margin-top: 20px;">
            <h2 slot="title">
                {{$t('提币查询列表')}}
            </h2>
            <div style="position: relative;">
                <TrialTable
                    :dataList="dataList"
                    :type="type"
                    v-on:search="searchData" 
                />
                <Spin size="large" fix v-if="spinShow"></Spin>

                <Page show-elevator v-if="Math.ceil(dataTotal/pageSize) > 1"
                      :total="dataTotal"
                      :page-size="pageSize"
                      size="small"
                      show-total
                      @on-change="handlePageChange"
                      class="trial-pagition">
                            <slot>
                                {{ $t('共') + ' ' + dataTotal + ' ' + $t('条') }}
                            </slot>
                      </Page>
            </div>
        </Card>
    </div>
</template>

<script>
    import SearchFilter from './filter'
    import TrialTable from '../trialTable'

    import {recharge} from '__util/api';

    export default {
        name: "search-trial",
        components: {
            SearchFilter,
            TrialTable
        },
        methods: {
            handlePageChange(page) {
                this.page = page;
                this.searchData()
            },
            searchData(formData) {
                // console.log('xxx')
                // if(!formData){
                //    formData =  this.formData
                // }

                if (this.$store.state.user.checkPerm('withdraw:list')) {
                    this.formData.page = this.page;
                    if (formData) {
                        this.formData = {...formData};
                        this.formData.page = 1;
                    }
                    this.formData.limit = this.pageSize;
                    const params = this.formData;
                    if (this.formData.amountValue === null) {
                        delete params.beginRealAmount;
                        delete params.endRealAmount
                    }
                    delete params.amountValue;
                    if (this.formData.currency) {
                        params.currency = this.formData.currency.toLowerCase();
                    }
                    recharge.getSearchTrialList.params = {...params};
                    this.spinShow = true;
                    this.$axios(recharge.getSearchTrialList).then((res) => {
                        this.setTableList(res.data);
                        this.spinShow = false;
                    }).catch((res)=>{
                        this.spinShow = false;
                    })

                } else {
                    this.$Modal.error(this.$t('无权限'))
                }
            },
            setTableList(data) {
                this.dataTotal = data.total;
                this.dataList = data.list.map((item) => {
                    if (!!item.reasons) {
                        item.reasons = JSON.parse(item.reasons);
                        item.cnReason = item.reasons.cn ? item.reasons.cn : null;
                        item.enReason = item.reasons.en ? item.reasons.en : null;
                        item.code = item.reasons.code ? this.$t(`errorCode['${item.reasons.code}']`) : null;
                    }
                    return item;
                });
            }
        },
        data() {
            return {
                spinShow: false,
                type: 'other',
                dataList: [],
                formData: {},
                dataTotal: 0,
                page: 1,
                pageSize: 10
            }
        }
    }
</script>

<style scoped>
    .trial-outer-container {
        min-height: 350px;
    }
    .trial-container {
        background-color: #ffffff;
        border: 1px solid #E6EAEE;
    }
    .trial-container > h2 {
        font-weight: bold;
        font-size: 16px;
        padding: 10px 20px;
    }
    .trial-pagition {
        text-align: right;
        padding: 10px;
    }
</style>
