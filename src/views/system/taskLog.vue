<template lang="html">
    <Row>
        <Row v-if="$store.state.user.checkPerm('sys:scheduleLog:list')">
            <Input v-model="searchParams" :placeholder="$t('任务ID')" style="width: 250px"></Input>
            <Button type="primary" @click="search" style="margin-right: 20px">{{$t('查询')}}</Button>
            <Button type="primary" @click="back">{{$t('返回')}}</Button>
        </Row>
        <Card style="margin-top: 20px">
            <Table :columns="columns" :data="dataList" style="width: 100%;"></Table>
            <div class="page-pane">
                <Page show-elevator :total="coinPage.totalPage" :page-size="coinPage.pageSize" :current="coinPage.currPage" @on-change="getTimeTaskLog" size="small" show-total>
                    <slot>
                        {{ $t('共') + ' ' + coinPage.totalPage + ' ' + $t('条') }}
                    </slot>
                </Page>
            </div>
        </Card>
    </Row>
</template>

<script>
import { sys } from '__util/api'

export default {
    data () {
        return {
            searchParams: '',
            // 分页参数
            coinPage: {
                currPage: 1,
                pageSize: 10,
                totalPage: 1
            },
            columns: [
                {
                    title: this.$t('日志ID'),
                    key: 'logId',
                },
                {
                    title: this.$t('任务ID'),
                    key: 'jobId',
                },
                {
                    title: this.$t('bean名称'),
                    key: 'beanName',
                },
                {
                    title: this.$t('参数'),
                    key: 'methodName',
                },
                {
                    title: this.$t('状态'),
                    key: 'status',
                },
                {
                    title: this.$t('耗时(单位：毫秒)'),
                    key: 'times',
                },
                {
                    title: this.$t('执行时间'),
                    key: 'createTime',
                },
            ],
            dataList: []
        }
    },
    mounted () {
        this.getTimeTaskLog()
    },
    methods: {
        search () {
            if (this.searchParams) {
                this.getTimeTaskLog()
            } else {
               this.coinPage.currPage = 1
               this.getTimeTaskLog()
            }
        },
        // 获取基础列表
        getTimeTaskLog (page) {
            sys.schedule.timeTaskLog.data = {
                limit: this.coinPage.pageSize,
                page: page ? page : this.coinPage.currPage,
                jobId: this.searchParams
            }
            this.$axios(sys.schedule.timeTaskLog).then((res) => {
                console.log(res)
                this.coinPage.currPage = res.data.currPage
                this.coinPage.pageSize = res.data.pageSize
                this.coinPage.totalPage = res.data.totalCount
                this.dataList = res.data.list
            })
        },
        back () {

        }
    }
}
</script>

<style lang="css">
</style>
