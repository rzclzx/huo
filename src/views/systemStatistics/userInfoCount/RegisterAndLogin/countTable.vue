<template>
    <Table :columns="columns" :data="dataList"></Table>
</template>

<script>
    const REGISTER_COLUMNS = [
        {
            title: '时间',
            key: 'createDate'
        },
        {
            title: '注册用户总数',
            key: 'uid'
        },
        {
            title: '实名认证总数',
            key: 'orderId'
        },
        {
            title: '注册/实名转化率',
            key: 'account'
        },
        {
            title: '每日注册用户数',
            key: 'currency'
        },
        {
            title: '每日实名认证数',
            key: 'amount'
        }
    ];
    const LOGIN_COLUMNS =[
        {
            title: '时间',
            key: 'createDate'
        },
        {
            title: '注册用户总数',
            key: 'uid'
        },
        {
            title: '登录用户数',
            key: 'orderId'
        }
    ]
    export default {
        name: "count-table",
        props:{
            type:Number,
            dataList:Array
        },
        watch: {
            '$props': {
                handler: function (val, oldVal) {
                    if(this.type === 1) {
                        this.columns = REGISTER_COLUMNS
                    }else {
                        this.columns = LOGIN_COLUMNS
                    }
                },
                deep: true
            }
        },
        data() {
            return {
                columns:REGISTER_COLUMNS
            }
        }
    }
</script>

<style scoped>

</style>
