<template>
    <div>
      <Row type="flex" :gutter="20" style="margin-top: 20px">
          <Col>
              <Input v-model="formItem.versionNum" :placeholder="$t('版本号')"></Input>
          </Col>
          <Col>
              <Select v-model="formItem.versionSys" :placeholder="$t('系统')" style="width: 130px" v-autoLocale>
                  <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
          </Col>
          <Col>
              <Select v-model="formItem.upWay" :placeholder="$t('发版方式')" style="width: 130px" v-autoLocale>
                  <Option v-for="item in upWayList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
          </Col>
          <Col>
              <DatePicker type="daterange" v-model="searDate" format="yyyy-MM-ddTHH:mm:ssZZ" placement="bottom-end" style="width: 230px" :placeholder="$t('发版时间 起-发版时间 止')"></DatePicker>
          </Col>
          <Col>
              <Button type="primary" @click="search" v-if="$store.state.user.checkPerm('oper:hbterminalversion:list')">{{$t('查询')}}</Button>
          </Col>
      </Row>
      <Card style="margin-top: 20px">
          <p slot="title">{{ $t('版本管理') }}</p>
          <Button slot="extra" type="primary" @click="addVersion" v-if="$store.state.user.checkPerm('oper:hbterminalversion:insert')">{{ $t('添加版本') }}</Button>
          <Row type="flex" justify="center" align="middle" class="advanced-router">
              <Table :columns="infoCols" :data="infoList" style="width: 100%;" :no-data-text="this.$t('暂无数据')"></Table>
              <div class="page-pane">
                  <Page show-elevator v-if="coinPage.totalPage > 1" :total="coinPage.totalCount" :page-size="coinPage.pageSize" :current="coinPage.currPage" @on-change="getVersionList" size="small" show-total>
                      <slot>
                          {{ $t('共') + ' ' + coinPage.totalCount + ' ' + $t('条') }}
                      </slot>
                  </Page>
              </div>
          </Row>
      </Card>
      <Drawer :show="drawerShow" @close="drawerShow = false" width="800px" placement="right">
          <p slot="header">{{ dialogTitle }}</p>
          <VersionAdd  @close="addPaneClose" ref="addPane" @brash="pageBrash" :dialogtype="dialogtype"></VersionAdd>
      </Drawer>
    </div>
</template>

<script>
import Drawer from '__components/drawer.vue'
import VersionAdd from './versionAdd.vue'
import { operation } from '__util/api';

export default {
    data () {
      return {
        formItem: {},
        dialogTitle: '',
        dialogtype: '',
        // 分页参数
        coinPage: {
            currPage: 1,
            pageSize: 30,
            totalPage: 0,
            totalCount: 0
        },
        page: 1,
        systemList: [
          {
            value: 1,
            label: this.$t('Android')
          },
          {
            value: 2,
            label: this.$t('IOS')
          }
        ],
        upWayList: [
          {
            value: 1,
            label: this.$t('强制升级')
          },
          {
            value: 2,
            label: this.$t('非强制升级')
          }
        ],
        drawerShow: false,
        delId: '',
        infoCols: [
          {
              key: 'version',
              renderHeader:() => {
                  return this.$t('版本号')
              }
          },
          {
              key: 'intVersion',
              renderHeader:() => {
                  return this.$t('整型版本码')
              }
          },
          {
              key: 'minSupportVersion',
              renderHeader:() => {
                  return this.$t('最低支持整型版本码')
              }
          },
          {
              key: 'remindNum',
              renderHeader:() => {
                  return this.$t('提醒次数')
              }
          },
          {
              key: 'system',
              renderHeader:() => {
                  return this.$t('系统')
              },
              render: (h, params) => {
                  return params.row.system == 1 ? 'Android' : 'IOS';
              }
          },
          {
              key: 'updateType',
              renderHeader:() => {
                  return this.$t('发版方式')
              },
              render: (h, params) => {
                  return params.row.updateType == 1 ? this.$t('强制升级') : this.$t('非强制升级');
              }
          },
          {
              key: 'onlineTime',
              renderHeader:() => {
                  return this.$t('发版时间')
              },
              render: (h, params) => {
                  return this.$moment(params.row.onlineTime).format('YYYY-MM-DD HH:mm:ss');
              }
          },
          {
              key: 'state',
              renderHeader:() => {
                  return this.$t('状态')
              },
              render: (h, params) => {
                  return params.row.state == 1 ? this.$t('待上线') : (params.row.state == 2 ? this.$t('已上线') : this.$t('已下线'));
              }
          },
          {
              key: 'name',
              renderHeader:() => {
                  return this.$t('操作人')
              }
          },
          {
              key: 'updateTime',
              renderHeader:() => {
                  return this.$t('操作时间')
              },
              render: (h, params) => {
                  return this.$moment(params.row.updateTime).format('YYYY-MM-DD HH:mm:ss');
              }
          },
          {
              key: 'currencyPair',
              renderHeader:() => {
                  return this.$t('操作')
              },
              render: (h, params) => {
                const arr = []
                  if(this.$store.state.user.checkPerm('oper:hbterminalversion:update')){
                    arr.push(h('Button', {
                          props: {
                              type: 'primary',
                              size: 'small',
                              // disabled: !this.$store.state.user.checkPerm('trade:fee:group:add')
                          },
                          style: {
                              marginRight: '5px'
                          },
                          on: {
                              click: () => {
                                this.viewAuthModal(params.row)
                              }
                          }
                      }, params.row.state == 2 ? this.$t('查看') : this.$t('修改')))
                  }
                  if(this.$store.state.user.checkPerm('oper:hbterminalversion:delete')){
                      arr.push(h('Button', {
                          props: {
                              type: 'error',
                              size: 'small',
                              // disabled: !this.$store.state.user.checkPerm('trade:fee:group:delete')
                          },
                          on: {
                              click: () => {
                                if (params.row.state == 2) {
                                  this.offId = params.row.id
                                  this.$Modal.confirm({
                                      title: this.$t('确认'),
                                      content: this.$t('确定下线'),
                                      onOk: this.offLine
                                  })
                                } else {
                                  this.delId = params.row.id
                                  this.$Modal.confirm({
                                      title: this.$t('确认'),
                                      content: this.$t('确定删除'),
                                      onOk: this.del
                                  })
                                }
                              }
                          }
                      }, params.row.state == 2 ? this.$t('下线') : this.$t('删除')))

                  }
                  return h('div', arr);
              }
          }
        ],
        infoList: [],
        searDate: '',
        startTime: '',
        endTime: '',
        offId: ''
      }
    },
    mounted () {
      if(this.$store.state.user.checkPerm('oper:hbterminalversion:list')){
        this.getVersionList()
      }
    },
    methods: {
      // 查询
      search () {
        if (this.searDate && this.searDate.length !== 0 && this.searDate[0] !== null) {
            this.startTime = this.$moment(this.searDate[0]).format('YYYY-MM-DD HH:mm:ss')
            this.endTime = this.$moment(this.searDate[1]).format('YYYY-MM-DD HH:mm:ss')
            this.getVersionList()
        }else {
           this.startTime = ''
           this.searDate = []
           this.getVersionList()
        }
      },
      // 修改查看详细信息
      viewAuthModal (item) {
          if (item.state == 2) {
            this.dialogTitle = this.$t('查看')
            this.dialogtype = 'look'
          } else {
            this.dialogTitle = this.$t('修改版本')
            this.dialogtype = 'updata'
          }
          this.drawerShow = true
          this.$refs['addPane'].getVersionMsg(item.id, item.state)
      },
      // 下线
      offLine () {
        if (!this.offId) return
        operation.closeVersion.data = {
            id: this.offId
        }
        this.$axios(operation.closeVersion).then((res) => {
            this.$Message.success({content: this.$t('下线成功')})
            this.getVersionList()
        })
      },
      // 删除
      del () {
        if (!this.delId) return
        operation.deleteVersion.data = {
            id: this.delId
        }
        this.$axios(operation.deleteVersion).then((res) => {
            this.$Message.success({content: this.$t('删除成功')})
            this.getVersionList()
        })
      },
      // 获取基础列表
      getVersionList (page) {
        operation.getVersionList.data = {
            limit: 10,
            page: page ? page : 1,
            system: this.formItem.versionSys,
            updateType: this.formItem.upWay,
            version: this.formItem.versionNum
        }
        if (this.searDate && this.searDate.length !== 0 && this.searDate[0] !== null) {
          operation.getVersionList.data.onlineTimeStart = this.startTime
          operation.getVersionList.data.onlineTimeEnd = this.endTime
        }
        this.$axios(operation.getVersionList).then((res) => {
            this.coinPage.currPage = res.data.currPage
            this.coinPage.pageSize = res.data.pageSize
            this.coinPage.totalCount = res.data.totalCount
            this.coinPage.totalPage = res.data.totalPage
            this.infoList = res.data.list
            console.log(res);
        })
      },
      handlePageChange(page){
          this.page = page;
          this.getVersionList()
      },
      // 关闭添加框
      addPaneClose () {
        this.drawerShow = false
      },
      pageBrash () {
        this.getVersionList()
      },
      // 添加
      addVersion () {
        this.$refs['addPane'].initForm()
        this.dialogTitle = this.$t('添加版本')
        this.dialogtype = 'add'
        this.drawerShow = true
      }
    },
    components: {
        Drawer,
        VersionAdd
    }
}
</script>

<style>
</style>
