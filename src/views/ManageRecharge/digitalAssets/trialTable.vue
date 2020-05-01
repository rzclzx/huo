<template>
    <div>
        <p v-if="dataList.length === 0" style="padding: 15px 20px;">{{$t('暂无数据')}}</p>
        <SingleInfo v-on:search="searchData"  v-else :data="data" :type="type" v-for="data in dataList"  :key="data.id"/>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>

<script>
    import SingleInfo from './singleTableInfo';
    export default {
        name: "TrailTable",
        components:{
            SingleInfo
        },
        props: {
            dataList:Array,
            type: String,
        },
        methods:{
            searchData(){
                console.log('xxxtable')
                this.$emit('search');
                
            }
        },
        data() {
            return {
                spinShow: false
            }
        }
    }
</script>

<style scoped>

</style>
