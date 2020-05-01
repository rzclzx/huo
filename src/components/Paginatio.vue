<template lang="html">
    <div class="">
        <Button @click="pageChange('prev')" :disabled="page.currPage === 1" type="primary" style="margin-right: 10px">{{$t(prevText)}}</Button>
        <Button @click="pageChange('next')" :disabled="page.isLast" type="primary">{{$t(nextText)}}</Button>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // disabled状态-上一页
            disabledPrev: true,
            // disabled状态-下一页
            disabledNext: true
        }
    },
    props: {
        // 下一页显示文案
        nextText: {
            type: String,
            default: '下一页'
        },
        // 下一页显示文案
        prevText: {
            type: String,
            default: '上一页'
        }
    },
    methods: {

    }
}
</script>

<style lang="css">
</style>
