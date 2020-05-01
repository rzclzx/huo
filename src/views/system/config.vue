<template lang="html">
    <Row>
        <Row>
            <Input v-model="searchParams" v-if="$store.state.user.checkPerm('sys:config:list')" :placeholder="$t('参数名')" style="width: 250px"></Input>
            <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('sys:config:list')" style="margin-right: 20px">{{$t('查询')}}</Button>
            <Button type="primary" icon="plus" v-if="$store.state.user.checkPerm('sys:config:save')" @click="add">{{$t('新增')}}</Button>
            <Button type="primary" icon="edit" @click="edit" v-if="$store.state.user.checkPerm('sys:config:update')">{{$t('修改')}}</Button>
            <Button type="primary" icon="trash-a" v-if="$store.state.user.checkPerm('sys:config:delete')" @click="del">{{$t('删除')}}</Button>
        </Row>
        <Card style="margin-top: 20px">
            <Table :columns="columns" @on-selection-change="checkedOne" :data="dataList" style="width: 100%;"></Table>
            <div class="page-pane">
                <Page show-elevator :total="coinPage.totalPage" :page-size="coinPage.pageSize" :current="coinPage.currPage" @on-change="getConfigList" size="small" show-total>
                    <slot>
                        {{ $t('共') + ' ' + coinPage.totalPage + ' ' + $t('条') }}
                    </slot>
                </Page>
            </div>
        </Card>
        <Modal v-model="modal" width="500" class-name="modal-clear-line">
            <p slot="header" style="text-align:center">
                <span>{{titleType}}{{$t('参数')}}</span>
            </p>
            <div style="text-align:center">
                <Form :model="formItem" :label-width="60">
                    <FormItem :label="$t('参数名')">
                        <Input v-model="formItem.key" placeholder=""></Input>
                    </FormItem>
                    <FormItem :label="$t('参数值')">
                        <Input v-model="formItem.value" placeholder=""></Input>
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
            titleType: '',
            checkedArr: [],
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'

                },
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'

                },
                {
                    key: 'id',
                    renderHeader:() => {
                        return this.$t('ID')
                    }
                },
                {
                    key: 'key',
                    renderHeader:() => {
                        return this.$t('参数名')
                    }
                },
                {
                    key: 'value',
                    renderHeader:() => {
                        return this.$t('参数值')
                    }
                },
                {
                    key: 'remark',
                    renderHeader:() => {
                        return this.$t('备注')
                    }
                }
            ],
            dataList: []
        }
    },
    mounted () {
        this.getConfigList()
    },
    methods: {
        search () {
            if (this.searchParams) {
                this.getConfigList()
            } else {
               this.coinPage.currPage = 1
               this.getConfigList()
            }   
        },
        add () {
            this.formItem = {}
            this.titleType = this.$t('新增')
            this.modal = true
        },
        edit () {
            if (this.checkedArr.length === 1) {
                this.formItem = this.checkedArr[0]
                this.titleType = this.$t('修改')
                this.modal = true
            } else {
                this.$Message.error({content: this.$t('请选择一条记录')})
            }
        },
        checkedOne (arr) {
            this.checkedArr = arr
        },
        del () {
            if (this.checkedArr.length > 0) {
                this.deleteConfig()
            } else {
                this.$Message.error({content: this.$t('请选择一条记录')})
            }
        },
        // 获取基础列表
        getConfigList (page) {
            sys.sysConfig.configList.data = {
                limit: this.coinPage.pageSize,
                page: page ? page : this.coinPage.currPage,
                key: this.searchParams
            }
            this.$axios(sys.sysConfig.configList).then((res) => {
                this.coinPage.currPage = res.data.currPage
                this.coinPage.pageSize = res.data.pageSize
                this.coinPage.totalPage = res.data.totalCount
                this.dataList = res.data.list
            })
        },
        addSub () {
            this.modal = false
            if (this.titleType === this.$t('新增')) {
                this.addConfig()
            } else if (this.titleType === this.$t('修改')) {
                this.updateConfig()
            }
        },
        // 新增参数
        addConfig () {
            sys.sysConfig.addConfig.data = {
                key: this.formItem.key,
                value: this.formItem.value,
                remark: this.formItem.remark
            }
            this.$axios(sys.sysConfig.addConfig).then((res) => {
                this.getConfigList()
            })
        },
        // 修改参数
        updateConfig () {
            sys.sysConfig.updateConfig.data = {
                id: this.formItem.id,
                key: this.formItem.key,
                value: this.formItem.value,
                remark: this.formItem.remark
            }
            this.$axios(sys.sysConfig.updateConfig).then((res) => {
                this.getConfigList()
            })
        },
        // 删除参数
        deleteConfig () {
            sys.sysConfig.deleteConfig.data = this.checkedArr.map((item) => {
                return item.id
            })
            this.$axios(sys.sysConfig.deleteConfig).then((res) => {
                this.getConfigList()
            })
        }
    }
}
</script>

<style lang="css">
</style>
