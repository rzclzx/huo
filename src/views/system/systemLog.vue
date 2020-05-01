<template lang="html">
    <Row>
        <Row v-if="$store.state.user.checkPerm('sys:log:list')">
            <Input v-model="searchParams" :placeholder="$t('用户名、用户操作')" style="width: 250px"></Input>
            <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('sys:log:list')">{{$t('查询')}}</Button>
        </Row>
        <Card style="margin-top: 20px">
            <Table :columns="columns" :data="dataList" style="width: 100%;"></Table>
            <div class="page-pane">
                <Page show-elevator :total="coinPage.totalPage" :page-size="coinPage.pageSize" :current="coinPage.currPage" @on-change="getSystemLog" size="small" show-total>
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
                    key: 'id',
                    renderHeader:() => {
                        return this.$t('id')
                    }
                },
                {
                    key: 'username',
                    renderHeader:() => {
                        return this.$t('用户名')
                    }
                },
                {
                    key: 'operation',
                    renderHeader:() => {
                        return this.$t('用户操作')
                    }
                },
                {
                    key: 'method',
                    renderHeader:() => {
                        return this.$t('请求方法')
                    }
                },
                {
                    key: 'params',
                    renderHeader:() => {
                        return this.$t('请求参数')
                    }
                },
                {
                    key: 'time',
                    renderHeader:() => {
                        return this.$t('执行时长(毫秒)')
                    }
                },
                {
                    key: 'ip',
                    renderHeader:() => {
                        return this.$t('IP地址')
                    }
                },
                {
                    key: 'createDate',
                    renderHeader:() => {
                        return this.$t('创建时间')
                    }
                },
            ],
            dataList: []
        }
    },
    mounted () {
        if ( this.$store.state.user.checkPerm('sys:log:list') ) {
            this.getSystemLog()
        }
    },
    methods: {
        search () {
            if (this.searchParams) {
                this.getSystemLog()
            } else {
               this.coinPage.currPage = 1
               this.getSystemLog()
            }
        },
        // 获取基础列表
        getSystemLog (page) {
            sys.systemLog.data = {
                limit: this.coinPage.pageSize,
                page: page ? page : this.coinPage.currPage,
                key: this.searchParams
            }
            this.$axios(sys.systemLog).then((res) => {
                this.coinPage.currPage = res.data.currPage
                this.coinPage.pageSize = res.data.pageSize
                this.coinPage.totalPage = res.data.totalCount
                this.dataList = res.data.list
            })
        },
    }
}
</script>

<style lang="css">
</style>
