<template>
    <div class="trial-outer-container">
        <TrialFilter :type="type" v-on:search="searchData"/>
        <Card>
            <h2 slot="title">
                {{$t('提币初审列表')}}
            </h2>
            <div style="position: relative;">
                <TrialTable
                    :dataList="dataList"
                    :type="type"
                />
                <Spin size="large" fix v-if="spinShow"></Spin>
            <Page show-elevator v-if="Math.ceil(dataTotal/pageSize) > 0"
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
    import TrialFilter from '../trailFilter'
    import TrialTable from '../trialTable'
    import {recharge} from '__util/api';
    export default {
        name: "first-trial",
        components: {
            TrialFilter,
            TrialTable
        },
        mounted(){
            if (this.$store.state.user.checkPerm('withdraw:fCheck:list')) {
                this.searchData()
            }
        },
        methods:{
            handlePageChange(page){
                this.page = page;
                this.searchData()
            },
            searchData(formData) {
                if (!this.$store.state.user.checkPerm('withdraw:fCheck:list')) {
                    this.$Message.error({content: this.$t('无权限')})
                    return
                }
                this.dataList = [];
                this.formData.page = this.page;
                if (formData) {
                    this.formData = {...formData};
                    this.formData.page = 1;
                }
                this.formData.limit = this.pageSize;
                const params = this.formData;
                if (this.formData.currency) {
                    params.currency = this.formData.currency.toLowerCase();
                }
                recharge.getFirstTrialList.params = {...params};
                this.spinShow = true;
                this.$axios(recharge.getFirstTrialList).then((res) => {
                    this.setTableList(res.data);
                    this.spinShow = false;
                }).catch((res)=>{
                    this.spinShow = false;
                })
            },
            setTableList(data) {
                this.dataTotal = data.total;
                this.dataList = data.list;
            }
        },
        data() {
            return {
                spinShow:false,
                type:'first',
                dataList:[],
                formData:{},
                dataTotal:0,
                page:1,
                pageSize: 10
            }
        }
    }
</script>

<style scoped>
    .trial-outer-container{
        min-height: 350px;
    }
    .trial-container{
        background-color: #ffffff;
        border: 1px solid #E6EAEE;
    }
    .trial-container > h2 {
        font-weight: bold;
        font-size: 16px;
        padding: 10px 20px;
    }
    .trial-pagition{
        text-align: right;
        padding: 10px;
    }
</style>
