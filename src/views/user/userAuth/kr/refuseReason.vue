<template>
    <div class="refuseReason_wrap">
        <Card style="margin-top: 20px">
            <p slot="title">
                {{$t('拒绝理由列表')}}
            </p>
            <Button type="primary" slot="extra" @click="showModal" v-if="$store.state.user.checkPerm('auth:refuse:add')">{{$t('添加理由')}}</Button>
            <Row>
                <Table :columns="refuseTitleArr" :data="refuseReasonArr" :no-data-text="this.$t('暂无数据')"></Table>
            </Row>
        </Card>
        <Modal v-model="modal" width="500" class-name="modal-clear-line">
            <p slot="header" style="text-align:center">
                <span>{{ addRefuseTitle }}</span>
            </p>
            <div style="text-align:center">
                <Form :model="formItem" :label-width="60">

                    <FormItem :label="$t('认证级别')">
                      <Select v-model="formItem.authLevel" placeholder="" v-autoLocale>
                        <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem :label="$t('拒绝理由')">
                        <Tabs size="small">
                            <TabPane :label="$t('本地语言')">
                                <Input v-model="formItem.textareaLoc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
                            </TabPane>
                            <TabPane :label="$t('中文')">
                                <Input v-model="formItem.textareaZH" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
                            </TabPane>
                            <TabPane :label="$t('英文')">
                                <Input v-model="formItem.textareaEN" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder=""></Input>
                            </TabPane>
                        </Tabs>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" style="border-top: 0">
                <Button type="primary" @click="changeRefuse">{{$t('新增')}}</Button>
                <Button type="ghost" @click="modal = false">{{$t('取消')}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { user } from '__util/api'

export default {
  name: 'search',
  data () {
    return {
      modal: false,
      formItem: {
        authLevel: '4'
      },
      msg: '',
      authLevel: '',
      modifyId: '',
      addRefuseTitle: '',
      refuseTitleArr: [
        {
          key: 'authLevel',
          renderHeader:() => {
            return this.$t('认证类型')
          },
          render: (h, params) => {
            return `U${params.row.authLevel}`
          }
        },
        {
          key: 'localReason',
          renderHeader:() => {
            return this.$t('本地拒绝理由')
          }
        },
        {
          key: 'zhReason',
          renderHeader:() => {
            return this.$t('中文拒绝理由')
          }
        },
        {
          key: 'enReason',
          renderHeader:() => {
            return this.$t('英文拒绝理由')
          }
        },
        {
          key: 'userName',
          renderHeader:() => {
            return this.$t('添加人')
          }
        },
        {
          key: 'action',
          renderHeader:() => {
              return this.$t('userAuth["操作"]')
          },
          width: 150,
          align: 'center',
          width: '200px',
          render: (h, params) => {
              return h('div', [
                  h('Button', {
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
                              if (this.$store.state.user.checkPerm('auth:refuse:edit')) {
                                  this.modal = true
                                  this.addRefuseTitle = this.$t('修改拒绝理由')
                                  this.formItem.authLevel = params.row.authLevel
                                  this.formItem.textareaZH = params.row.zhReason
                                  this.formItem.textareaEN = params.row.enReason
                                  this.formItem.textareaLoc = params.row.localReason
                                  this.modifyId  = params.row.id
                              } else {
                                  this.$Message.error(this.$t('没有权限'));
                                  return
                              }
                          }
                      }
                  }, this.$t('编辑')),
                  h('Button', {
                      props: {
                          type: 'error',
                          size: 'small',
                          // disabled: !this.$store.state.user.checkPerm('trade:fee:group:delete')
                      },
                      on: {
                          click: () => {
                              if (this.$store.state.user.checkPerm('auth:refuse:del')) {
                                  this.modifyId  = params.row.id
                                  this.$Modal.confirm({
                                      title: this.$t('确认'),
                                      okText: this.$t('删除'),
                                      content: this.$t('确定删除'),
                                      onOk: this.del
                                  })
                              } else {
                                  this.$Message.error(this.$t('没有权限'));
                                  return
                              }
                          }
                      }
                  }, this.$t('删除'))
              ]);
          }
        }
      ],
      levelList: [
        {
          value: '4',
          label: 'U4'
        },
        {//20180420添加 U2选项
          value: '2',
          label: 'U2'
        }
      ],
      refuseReasonArr: []
    }
  },
  mounted () {
      this.getReasonList()
  },
  created() {
      document.getElementsByTagName('body')['0'].className = 'l-del';
  },
  methods: {
    showModal () {
        this.formItem = {
            authLevel: '4'
        }
        this.addRefuseTitle = this.$t('添加拒绝理由')
        this.modal = true
    },
    // 删除
    del () {
      user.delRefuseReason.params = {
          id: this.modifyId
      }
      this.$axios(user.delRefuseReason).then((res) => {
          this.getReasonList()
          this.$Message.success(this.$t('删除成功'))
      })
    },
    // 获取基础列表
    getReasonList (page) {
        this.$axios(user.refuseReasonList).then((res) => {
          //res.data.forEach((v,i) => {
            // if(v.authLevel == 4){
            //   this.refuseReasonArr.push(v);
            // }
            //console.log(v,i);
          //});
          this.refuseReasonArr = res.data
        })
    },
    // 确认添加修改
    changeRefuse () {
        if (this.addRefuseTitle === this.$t('添加拒绝理由')) {
            this.addRefuse()
        } else if (this.addRefuseTitle === this.$t('修改拒绝理由')) {
            this.updataRefuse()
        }
    },
    // 修改理由
    updataRefuse () {
        user.updataRefuseReason.data = {
            id: this.modifyId,
            zhReason: this.formItem.textareaZH,
            enReason: this.formItem.textareaEN,
            localReason: this.formItem.textareaLoc,
            authLevel: this.formItem.authLevel
        }
        this.$axios(user.updataRefuseReason).then((res) => {
            this.modal = false
            this.getReasonList()
            this.$Message.success(this.$t('修改成功'))
        })
    },
    // 添加理由
    addRefuse () {
        user.addRefuseReason.data = {
            zhReason: this.formItem.textareaZH,
            enReason: this.formItem.textareaEN,
            localReason: this.formItem.textareaLoc,
            authLevel: this.formItem.authLevel
        }
        this.$axios(user.addRefuseReason).then((res) => {
            this.modal = false
            this.getReasonList()
            this.$Message.success(this.$t('添加成功'))
        })
    }
  },
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
</style>
