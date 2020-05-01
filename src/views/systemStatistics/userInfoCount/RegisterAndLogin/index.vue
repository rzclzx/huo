<template>
    <div class="trial-outer-container">
        <SearchFilter v-on:search="searchData"/>
        <Card style="margin-top: 20px;">
            <h2 slot="title">
                {{tableName}}
            </h2>
            <CountTable
                :dataList="dataList"
                :type="type"
            />
            <Page show-elevator v-if="Math.floor(dataTotal/pageSize) > 1"
                  :total="dataTotal"
                  :page-size="pageSize"
                  size="small"
                  show-total
                  @on-change="handlePageChange"
                  class="trial-pagition"></Page>
        </Card>
    </div>
</template>

<script>
    import SearchFilter from './filter'
    import CountTable from './countTable'

    import {recharge} from '__util/api';
    export default {
        name: "register-and-login",
        components: {
            SearchFilter,
            CountTable
        },
        methods: {
            handlePageChange(page){
                this.page = page;
                this.searchData()
            },
            formatTableName(){
                switch(this.type){
                    case 1 :
                        this.tableName = '注册/认证统计';
                        break;
                    case 2 :
                        this.tableName = '每日注册登录';
                        break;
                }
            },
            searchData(formData) {
                this.formData = {...formData};

                this.formData.page = this.page;
                this.formData.limit = this.pageSize;
                const params = this.formData;
                this.type = this.formData.type;
                this.formatTableName();

                // recharge.getSearchTrialList.params = {...params};
               /* this.$axios(recharge.getSearchTrialList).then((res) => {
                    this.setTableList(res.data);
                })*/
            },
            setTableList(data) {
                this.dataTotal = data.total;
                this.dataList = data.list;
            }
        },
        data() {
            return {
                type:1,
                tableName:'注册/认证统计',
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
