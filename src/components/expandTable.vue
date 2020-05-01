<template lang="html">
     <div class="expand-table">
         <div class="table-item" v-for="(row, index) in data">
             <Table
                :show-header= "index === 0 ? true : false"
                :columns="columns"
                :data="[row]"
                :no-data-text="$t('暂无数据')"
                style="width: 100%;" ></Table>
             <div class="expand-pane" v-show="row._expand">
                 <slot :row="row"></slot>
             </div>
         </div>
     </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    props: {
        columns: Array,
        data: Array,
        expand: Boolean
    },
    methods: {

    }
}
</script>

<style lang="less">
.expand-table {
    .expand-pane {
        width: 100%;
        border: 1px solid #dddee1;
        border-top: 0;
        background: #f8f8f9;
        padding: 10px;
        font-size: 13px;
    }
    .ivu-table-wrapper {
        border-top: 0;
    }
    .table-item:first-child {
        .ivu-table-wrapper {
            border-top: 1px solid #dddee1;
        }
    }
}

</style>
