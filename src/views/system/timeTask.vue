<template lang="html">
    <Row>
        <Row>
            <Input v-model="searchParams" placeholder="$t('用户名、用户操作')" style="width: 250px" v-if="$store.state.user.checkPerm('sys:schedule:list')"></Input>
            <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('sys:schedule:list')" style="margin-right: 20px">{{$t('查询')}}</Button>
            <Button type="primary" icon="plus" v-if="$store.state.user.checkPerm('sys:schedule:save')" @click="add">{{$t('新增')}}</Button>
            <Button type="primary" icon="edit" v-if="$store.state.user.checkPerm('sys:schedule:update')" @click="edit">{{$t('修改')}}</Button>
            <Button type="primary" icon="trash-a" v-if="$store.state.user.checkPerm('sys:schedule:delete')" @click="del">{{$t('删除')}}</Button>
            <Button type="primary" icon="pause" v-if="$store.state.user.checkPerm('sys:schedule:pause')" @click="pause">{{$t('暂停')}}</Button>
            <Button type="primary" icon="play" v-if="$store.state.user.checkPerm('sys:schedule:resume')" @click="recover">{{$t('恢复')}}</Button>
            <Button type="primary" icon="happy" v-if="$store.state.user.checkPerm('sys:schedule:run')" @click="play">{{$t('立即执行')}}</Button>
            <Button type="primary" icon="ios-list" style="float: right" @click="log">{{$t('日志列表')}}</Button>
        </Row>
        <Card style="margin-top: 20px">
            <Table :columns="columns" @on-selection-change="checkedOne" :data="dataList" style="width: 100%;"></Table>
            <div class="page-pane">
                <Page show-elevator :total="coinPage.totalPage" :page-size="coinPage.pageSize" :current="coinPage.currPage" @on-change="getTimeTask" size="small" show-total>
                    <slot>
                        {{ $t('共') + ' ' + coinPage.totalPage + ' ' + $t('条') }}
                    </slot>
                </Page>
            </div>
        </Card>
        <Modal v-model="modal" width="500" class-name="modal-clear-line">
            <p slot="header" style="text-align:center">
                <span>{{titleType}}{{$t('任务')}}</span>
            </p>
            <div style="text-align:center">
                <Form :model="formItem" :label-width="80">
                    <FormItem :label="$t('bean名称')">
                        <Input v-model="formItem.beanName" placeholder=""></Input>
                    </FormItem>
                    <FormItem :label="$t('方法名称')">
                        <Input v-model="formItem.methodName" placeholder=""></Input>
                    </FormItem>
                    <FormItem :label="$t('参数')">
                        <Input v-model="formItem.params" placeholder=""></Input>
                    </FormItem>
                    <FormItem :label="$t('cron表达式')">
                        <Input v-model="formItem.cronExpression" placeholder=""></Input>
                    </FormItem>
                    <FormItem :label="$t('备注')">
                        <Input v-model="formItem.remark" placeholder=""></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" style="border-top: 0">
                <Button type="primary" @click="addSub">{{$t('确定')}}</Button>
                <Button type="ghost" @click="modal = false">{{$t('返回')}}</Button>
            </div>
        </Modal>
    </Row>
</template>

<script>
import { sys } from '__util/api'

export default {
    data () {
        return {
            formItem: {},
            modal: false,
            searchParams: '',
            // 分页参数
            coinPage: {
                currPage: 1,
                pageSize: 10,
                totalPage: 1
            },
            checkedArr: [],
            titleType: '',
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center',

                },
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'

                },
                {
                    key: 'jobId',
                    renderHeader:() => {
                        return this.$t('任务ID')
                    }
                },
                {
                    key: 'beanName',
                    renderHeader:() => {
                        return this.$t('bean名称')
                    }
                },
                {
                    key: 'methodName',
                    renderHeader:() => {
                        return this.$t('方法名称')
                    }
                },
                {
                    key: 'params',
                    renderHeader:() => {
                        return this.$t('参数')
                    }
                },
                {
                    key: 'cronExpression',
                    renderHeader:() => {
                        return this.$t('cron表达式')
                    }
                },
                {
                    key: 'remark',
                    renderHeader:() => {
                        return this.$t('备注')
                    }
                },
                {
                    key: 'status',
                    renderHeader:() => {
                        return this.$t('状态')
                    }
                }
            ],
            dataList: []
        }
    },
    mounted () {
        this.getTimeTask()
    },
    methods: {
        // 查询
        search () {
           if (this.searchParams) {
                this.getTimeTask()
            } else {
               this.coinPage.currPage = 1
               this.getTimeTask()
            }
        },
        // 新增
        add () {
            this.formItem = {}
            this.titleType = this.$t('新增')
            this.modal = true
        },
        // 修改
        edit () {
            if (this.checkedArr.length === 1) {
                this.formItem = this.checkedArr[0]
                this.titleType = this.$t('修改')
                this.modal = true
            } else {
                this.$Message.error({content: this.$t('请选择一条记录')})
            }
        },
        // 删除
        del () {
            if (this.checkedArr.length > 0) {
                this.deleteTimeTask()
            } else {
                this.$Message.error({content: this.$t('请选择一条记录')})
            }
        },
        // 暂停
        pause () {
            if (this.checkedArr.length > 0) {
                this.pauseTimeTask()
            } else {
                this.$Message.error({content: this.$t('请选择一条记录')})
            }
        },
        // 恢复
        recover () {
            if (this.checkedArr.length > 0) {
                this.resumeTimeTask()
            } else {
                this.$Message.error({content: this.$t('请选择一条记录')})
            }
        },
        // 立即执行
        play () {
            if (this.checkedArr.length > 0) {
                this.runTimeTask()
            } else {
                this.$Message.error({content: this.$t('请选择一条记录')})
            }
        },
        checkedOne (arr) {
            this.checkedArr = arr
        },
        // 获取基础列表
        getTimeTask (page) {
            sys.schedule.getList.data = {
                limit: this.coinPage.pageSize,
                page: page ? page : this.coinPage.currPage,
                beanName: this.searchParams
            }
            this.$axios(sys.schedule.getList).then((res) => {
                this.coinPage.currPage = res.data.currPage
                this.coinPage.pageSize = res.data.pageSize
                this.coinPage.totalPage = res.data.totalCount
                this.dataList = res.data.list
            })
        },
        // 新增定时任务
        addTimeTask () {
            sys.schedule.add.data = {
                beanName: this.formItem.beanName,
                cronExpression: this.formItem.cronExpression,
                jobId: this.formItem.jobId,
                methodName: this.formItem.methodName,
                params: this.formItem.params,
                remark: this.formItem.remark
            }
            this.$axios(sys.schedule.add).then((res) => {
                this.getTimeTask()
            })
        },
        // 修改定时任务
        updateTimeTask () {
            sys.schedule.update.data = {
                beanName: this.formItem.beanName,
                cronExpression: this.formItem.cronExpression,
                jobId: this.formItem.jobId,
                methodName: this.formItem.methodName,
                params: this.formItem.params,
                remark: this.formItem.remark,
                status: this.formItem.status
            }
            this.$axios(sys.schedule.update).then((res) => {
                this.getTimeTask()
            })
        },
        // 删除定时任务
        deleteTimeTask () {
            sys.schedule.delete.data = this.checkedArr.map((item) => {
                return item.jobId
            })
            this.$axios(sys.schedule.delete).then((res) => {
                this.getTimeTask()
            })
        },
        // 暂停定时任务
        pauseTimeTask () {
            sys.schedule.pause.data = this.checkedArr.map((item) => {
                return item.jobId
            })
            this.$axios(sys.schedule.pause).then((res) => {
                this.getTimeTask()
            })
        },
        // 恢复定时任务
        resumeTimeTask () {
            sys.schedule.resume.data = this.checkedArr.map((item) => {
                return item.jobId
            })
            this.$axios(sys.schedule.resume).then((res) => {
                this.getTimeTask()
            })
        },
        // 立即执行定时任务
        runTimeTask () {
            sys.schedule.run.data = this.checkedArr.map((item) => {
                return item.jobId
            })
            this.$axios(sys.schedule.run).then((res) => {
                this.getTimeTask()
            })
        },
        log () {
            this.$router.push({name: '日志列表'})
        },
        addSub () {
            this.modal = false
            if (this.titleType === this.$t('新增')) {
                this.addTimeTask()
            } else if (this.titleType === this.$t('修改')) {
                this.updateTimeTask()
            }
        }
    }
}
</script>

<style lang="css">
</style>
