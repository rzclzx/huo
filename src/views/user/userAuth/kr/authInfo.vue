<template lang="html">
    <div>
        <div v-for="item in infoData.authRecordInfoVOs">
            <div class="title-left">{{$t('认证信息')}}</div>
            <Table v-if="item.authLevel == 4" :columns="colsInfo" :data="[item]"></Table>
            <Table v-if="item.authLevel == 2" :columns="colsInfo2" :data="[item]"></Table>
            <div class="title-left" style="margin-top: 30px">{{$t('认证资料')}}</div>
            <div class="info-pane" v-if="item.authLevel == 4">
                <div class="info-img"><img :src="item.sysOssList[0].authPhoto"/></div>
                <div class="info-label">{{$t('资料照片')}}</div>
            </div>
            <div class="pic-box" v-if="item.authLevel == 2">
                <div class="info-pane" v-for=" it in item.sysOssList">
                    <div class="info-img"><a :href="it.authPhoto" target="_blank"><img :src="it.authPhoto"/></a></div>
                    <div class="info-label">{{it.picName}}</div>
                </div>
            </div>      
        </div>
        <div class="title-left" style="margin-top: 30px">{{$t('认证历史')}}</div>
        <Table :columns="colsHistory" :data="infoData.authHistoryVOs"></Table>
        <div class="title-left" style="margin-top: 50px">
            <span style="margin-right: 20px">{{$t('审核操作')}}</span>
            <RadioGroup v-model="formItem.authStatus" @on-change="chooseBtn">
                <Radio :label="1">{{ $t('通过') }}</Radio>
                <Radio :label="3">{{ $t('拒绝') }}</Radio>
            </RadioGroup>
        </div>
        <div style="text-align:center" v-if="refuse">
            <Form :model="formItem" :label-width="60">
                <FormItem :label="$t('拒绝理由')">
                  <Select v-model="authReason" placeholder="" v-autoLocale>
                    <Option v-for="item in refuseReasonArr" :value="item.id" :key="item.id">{{ item.localReason }}</Option>
                  </Select>
                </FormItem>
            </Form>
        </div>
        <div style="margin-top: 50px; text-align: center">
            <Button type="primary" @click="subAuth">{{$t('提交')}}</Button>
        </div>
        <div v-for="item in infoData.authedInfoVOs">
            <div class="title-left" style="margin-top: 50px">{{$t('已认证信息')}}</div>
            <Table :columns="colsInfo" :data="[item]"></Table>
            <div class="title-left" style="margin-top: 30px">{{$t('认证资料')}}</div>
            <div class="info-pane" v-if="item.authLevel == 4">
                <div class="info-img"><img :src="item.sysOssList[0].authPhoto"/></div>
                <div class="info-label">{{$t('资料照片')}}</div>
            </div>
            <div class="pic-box" v-if="item.authLevel == 2">
                <div class="info-pane" v-for=" it in item.sysOssList">
                    <div class="info-img"><a :href="it.authPhoto" target="_blank"><img :src="it.authPhoto"/></a></div>
                    <div class="info-label">{{it.picName}}</div>
                </div>
            </div>      
        </div>
        <!-- <Modal v-model="refuse" visible="refuse" width="500" class-name="vertical-center-modal">
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
                    render: (h, params) => {
                        return `U${params.row.authLevel}`
                    }
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
                        switch(params.row.authStatus) {
                            case 1:
                                return this.$t('审核通过')
                                break
                            case 2:
                                return this.$t('待审核')
                                break
                            case 3:
                                return this.$t('审核未通过')
                                break
                            case 4:
                                return this.$t('再次审核')
                                break
                        }
                    }
                }
            ],
            //20180423 U2级别时的table
            colsInfo2: [
                {
                    renderHeader: (h) => {
                        return this.$t('认证等级')
                    },
                    key: 'authLevel',
                    render: (h, params) => {
                        return `U${params.row.authLevel}`
                    }
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
                                return this.$t('护照')
                                break
                            case 3:
                                return this.$t('银行账户认证')
                                break
                            case 4:
                                return this.$t('居住证明')
                                break
                        }
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('证件号码')
                    },
                    width: 160,
                    key: 'idNo',
                },
                {
                    renderHeader: (h) => {
                        return this.$t('姓')
                    },
                    key: 'familyName',
                },
                {
                    renderHeader: (h) => {
                        return this.$t('名')
                    },
                    key: 'name',
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
                        switch(params.row.authStatus) {
                            case 1:
                                return this.$t('审核通过')
                                break
                            case 2:
                                return this.$t('待审核')
                                break
                            case 3:
                                return this.$t('审核未通过')
                                break
                            case 4:
                                return this.$t('再次审核')
                                break
                        }
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
                    render: (h, params) => {
                        return `U${params.row.authLevel}`
                    }
                },
                {
                    renderHeader: (h) => {
                        return this.$t('状态')
                    },
                    key: 'authStatus',
                    render: (h, params) => {
                      switch(params.row.authStatus) {
                          case 1:
                              return this.$t('审核通过')
                              break
                          case 2:
                              return this.$t('待审核')
                              break
                          case 3:
                              return this.$t('审核未通过')
                              break
                          case 4:
                              return this.$t('再次审核')
                              break
                      }
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
            refuseReasonArr: [],
            refuseReasonU2Arr: [],
            refuseReasonU4Arr: []
        }
    },
    mounted () {
        this.getReasonList()
    },
    methods: {
        initForm () {
            this.authReason = ''
        },
        // 提交
        // submitAuth () {
        //     // 1通过  3拒绝
        //     if (this.formItem.authStatus === 3) {
        //         this.refuse = true
        //         this.subAuth()
        //     }
        //     if (this.formItem.authStatus === 1) {
        //         this.formItem.refuseId = ''
        //         this.subAuth()
        //     }
        // },
        subAuth () {
            if (!this.formItem.authStatus) {
              this.$Message.info({content: this.$t('请先进行操作')})
              return
            }

            if(this.formItem.authStatus == 3 && !this.authReason){
                this.$Message.info({content: this.$t('请选择拒绝理由')})
                return;
            }
            

            user.audit.data = {...this.formItem}
            user.audit.data.id = this.auditId
            if (this.formItem.authStatus === 3) {
                user.audit.data.refuseId = this.authReason
            }
            this.refuse = false
            this.$axios(user.audit).then((res) => {
                this.$Message.success({content: this.$t('操作成功')})
                this.$emit('onClose', true)
            }).catch((error) => {//20180423 用户已经完成 Dannal 电话认证时的提示

                if(error == 'MGT00777'){
                    this.$emit('onClose', true)
                    //this.$Message.error({content: this.$t('用户已完成二级认证，不需要再审核护照信息')});
                    //window.location.href = window.location.href;
                }
                
            })
        },
        // 查询审核信息
        getAuthInfo (auditId) {
            if ( !auditId ) return
            this.auditId = auditId
            this.refuse = false
            this.formItem = {}
            user.auditInfo.path = {
                auditId: auditId
            }
            this.$axios(user.auditInfo).then((res) => {
                this.infoData = res.data;
                /**
                 * @if this.infoData.authRecordInfoVOs 是否成立   20180423
                 */
                if(this.infoData.authRecordInfoVOs.length){
                    if(this.infoData.authRecordInfoVOs[0].authLevel == 2){
                        this.refuseReasonArr = this.refuseReasonU2Arr;
                        let arr = this.infoData.authRecordInfoVOs[0].sysOssList;
                        let newArr = [];
                        //console.log(arr[0].picType);
                        if(arr[0].picType == 'PASSPORT'){
                            
                            arr[0].picName = this.$t('护照信息照片');
                            arr[1].picName = this.$t('手持护照照片');
                            newArr.push(arr[0]);
                            newArr.push(arr[1]);
                        }else if(arr[1].picType == 'PASSPORT'){
                            
                            arr[1].picName = this.$t('护照信息照片');
                            arr[0].picName = this.$t('手持护照照片');
                            newArr.push(arr[1]);
                            newArr.push(arr[0]);
                        }
                        this.infoData.authRecordInfoVOs[0].sysOssList = newArr;
                    }
                    (this.infoData.authRecordInfoVOs[0].authLevel == 4) && (this.refuseReasonArr = this.refuseReasonU4Arr);

                }else if(this.infoData.authedInfoVOs.length){
                    if(this.infoData.authRecordInfoVOs[0].authLevel == 2){
                        this.refuseReasonArr = this.refuseReasonU2Arr;
                        let arr = this.infoData.authedInfoVOs[0].sysOssList;
                        let newArr = []
                        if(arr[0].picType == 'PASSPORT'){
                            
                            arr[0].picName = this.$t('护照信息照片');
                            arr[1].picName = this.$t('手持护照照片');
                            newArr.push(arr[0]);
                            newArr.push(arr[1]);
                        }else if(arr[1].picType == 'PASSPORT'){
                            
                            arr[1].picName = this.$t('护照信息照片');
                            arr[0].picName = this.$t('手持护照照片');
                            newArr.push(arr[1]);
                            newArr.push(arr[0]);
                        }
                        this.infoData.authedInfoVOs[0].sysOssList = newArr;
                    }
                    (this.infoData.authedInfoVOs[0].authLevel == 4) && (this.refuseReasonArr = this.refuseReasonU4Arr);
                }

            })
        },
        // 选择按钮
        chooseBtn () {
          if (this.formItem.authStatus === 3) {
              this.refuse = true
          } else if (this.formItem.authStatus === 1) {
              this.refuse = false
              this.formItem.refuseId = ''
          }
        },
         // 获取基础列表
        getReasonList (page) {
            user.refuseReasonList.params = {
                language: localStorage.getItem('lang') || 'zh-cn'
            }
            this.$axios(user.refuseReasonList).then((res) => {
                res.data.map((e) => {
                  e.authLevel = `U${e.authLevel}`;
                  //20180423 添加U2和U4数据区分
                  (e.authLevel == 'U2') && this.refuseReasonU2Arr.push(e) ;
                  (e.authLevel == 'U4') && this.refuseReasonU4Arr.push(e) ;
                })
                //console.log(this.refuseReasonU2Arr, this.refuseReasonU4Arr)
                //this.refuseReasonArr = res.data;
                //20180420修改 无数据时报错
                this.refuseReasonArr.length && (this.authReason = this.refuseReasonArr[0].id)
            })
        }
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

.pic-box .info-pane{
    display:inline-block;
    &:first-child{
        margin-right:60px;
    }
}
.drawer-body .title-left{
    color:#495060;
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
