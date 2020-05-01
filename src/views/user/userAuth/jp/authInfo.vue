<template lang="html">
    <div>
        <div v-for="item in infoData.authRecordInfoVOs">
            <div class="title-left">{{$t('认证信息')}}</div>
            <Table :columns="colsInfo" :data="[item]"></Table>
            <div class="title-left" style="margin-top: 30px">{{$t('认证资料')}}</div>
            <div class="info-pane">
                <div class="info-img"><img :src="item.authPhoto"/></div>
                <div class="info-label">{{$t('资料照片')}}</div>
            </div>
        </div>
        <div class="title-left" style="margin-top: 30px">{{$t('认证历史')}}</div>
        <Table :columns="colsHistory" :data="infoData.authHistoryVOs"></Table>
        <div v-for="item in infoData.authedInfoVOs">
            <div class="title-left" style="margin-top: 50px">{{$t('已认证信息')}}</div>
            <Table :columns="colsInfo" :data="[item]"></Table>
            <div class="title-left" style="margin-top: 30px">{{$t('认证资料')}}</div>
            <div class="info-pane">
                <div class="info-img"><img :src="item.authPhoto"/></div>
                <div class="info-label">{{$t('资料照片')}}</div>
            </div>
        </div>
       <!--  <Modal v-model="refuse" visible="refuse" width="500" class-name="vertical-center-modal">
            <p slot="header" style="text-align:center;">
                <span>{{$t('拒绝理由')}}</span>
            </p>
            <div style="text-align:center">
                <Form :model="formItem" :label-width="60">
                    <FormItem :label="$t('拒绝理由')">
                      <Select v-model="authReason" placeholder="" v-autoLocale>
                        <Option v-for="item in refuseReasonArr" :value="item.id" :key="item.id">{{ item.zhReasons }}</Option>
                      </Select>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="primary" @click="subAuth">{{$t('确定')}}</Button>
            </div>
        </Modal> -->
    </div>
</template>

<script>
import { user } from '__util/api'

export default {
    data () {
        return {
            formItem: {},
            refuse: false,
            authReason: '',
            ReasonList: [
              {
                value: 'u2',
                label: this.$t('证件不清晰')
              },
            ],
            colsInfo: [
                {
                    renderHeader: (h) => {
                        return this.$t('认证等级')
                    },
                    key: 'authLevel',
                },
                {
                    renderHeader: (h) => {
                        return this.$t('资料类型')
                    },
                    key: 'idType',
                    render: (h, params) => {
                        switch(params.row.idType) {
                            case 1:
                                return this.$t('注册完成')
                                break
                            case 2:
                                return this.$t('手机本人认证')
                                break
                            case 3:
                                return this.$t('银行卡认证')
                                break
                            case 4:
                                return this.$t('居住证明')
                                break
                        }
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('认证号码')
                    },
                    key: 'idNo',
                },
                {
                    renderHeader: (h) => {
                        return this.$t('提交时间')
                    },
                    key: 'createTime',
                },
                {
                    renderHeader: (h) => {
                        return this.$t('当前状态')
                    },
                    key: 'authStatus',
                    render: (h, params) => {
                        if ( params.row.authStatus === 1 ) return this.$t('通过')
                        if ( params.row.authStatus === 3 ) return this.$t('拒绝')
                    }
                }
            ],
            authList: [
                {name: ''}
            ],
            colsHistory: [
                {
                    renderHeader: (h) => {
                        return this.$t('认证时间')
                    },
                    key: 'applyTime',
                },
                {
                    renderHeader: (h) => {
                        return this.$t('认证等级')
                    },
                    key: 'authLevel',

                },
                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    key: 'authStatus',
                    render: (h, params) => {
                        if ( params.row.authStatus === 1 ) return this.$t('通过')
                        if ( params.row.authStatus === 3 ) return this.$t('拒绝')
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('原因')
                    },
                    key: 'reason',
                },
                {
                    renderHeader: (h) => {
                        return this.$t('审核人')
                    },
                    key: 'auditorUserName',
                }
            ],
            infoData: {},
            auditId: '',
            refuseReasonArr: []
        }
    },
    mounted () {
        // this.getReasonList()
    },
    methods: {
        initForm () {
            this.authReason = ''
        },
        submitAuth () {
            if (this.formItem.authStatus === this.$t('拒绝')) {
                this.refuse = true
            }
            if (this.formItem.authStatus === this.$t('通过')) {
                this.formItem.refuseId = ''
                this.subAuth()
            }
        },
        subAuth () {
            user.audit.data = {...this.formItem}
            if (this.formItem.authStatus === this.$t('拒绝')) {
                user.audit.data.refuseId = this.authReason
            }
            this.refuse = false
            this.$axios(user.audit).then((res) => {
                this.$Message.success({content: this.$t('操作成功')})
                this.$emit('onClose', true)
            })
        },
        // 查询审核信息
        getAuthInfo (auditId) {
            if ( !auditId ) return
            this.auditId = auditId
            user.auditInfo.path = {
                auditId: auditId
            }
            this.$axios(user.auditInfo).then((res) => {
                this.infoData = res.data
            })

        },
         // 获取基础列表
        // getReasonList (page) {
        //     user.refuseReasonList.params = {
        //         language: localStorage.getItem('lang') || 'zh-cn'
        //     }
        //     this.$axios(user.refuseReasonList).then((res) => {
        //         res.data.map((e) => {
        //           e.authLevel = `U${e.authLevel}`
        //         })
        //         this.refuseReasonArr = res.data
        //         this.authReason = this.refuseReasonArr[0].id
        //     })
        // }
    },
}
</script>

<style lang="less" scoped>
.title-left {
    text-align: left;
    margin-bottom: 10px;
}
.ivu-modal-header{
    border-bottom: 0;
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
        top: 0;
    }
}
.info-img {
    img {
        width: 100%;
        height: 100%;
    }
}
.ivu-modal-footer{
    border-top: 0;
}
.info-pane {
    width: 320px;
    .info-img {
        width: 320px;
        height: 180px;
        border: 1px solid #CED5E0;
    }
    .info-label {
        margin-top: 10px;
        text-align: center;
    }
}

</style>
