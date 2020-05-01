<template>
    <div class="l-content">
        <Modal
            v-model="modal1"
            :title="$t('添加批量转账')"
            :loading="loading"
            >
            <Form ref="formItem" :model="formItem" :rules="ruleItem" :label-width="100">
                <div class="l-form">
                    <ul>
                        <li>
                            <label>{{$t('活动名称')}}</label>
                            <FormItem prop="activityName">
                                <Input v-model="formItem.activityName" :placeholder="$t('填写活动名称，5-30字，无特殊字符')" class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{$t('活动细则')}}</label>
                            <FormItem prop="activityDetails">
                                <Input v-model="formItem.activityDetails" :placeholder="$t('填写活动细则')" type="textarea" class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{$t('选择转出账户')}}</label>
                            <FormItem>
                                <Select v-model="transferOutUserId" class="l-select" :placeholder="$t('活动账户')" v-autoLocale>
                                    <Option value="6">{{$t('返佣账户')}}</Option>
                                    <Option value="4">{{$t('活动账户')}}</Option>
                                </Select>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{$t('转出币种')}}</label>
                            <FormItem>
                                <RadioGroup v-model="transferOutCurrency" class="l-radio">
                                    <Radio label="BTC">
                                        <span>BTC</span>
                                    </Radio>
                                    <Radio label="ETH">
                                        <span>ETH</span>
                                    </Radio>
                                    <Radio label="ETC">
                                        <span>ETC</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{$t('转账人数')}}</label>
                            <FormItem prop="transferUserCount">
                                <Input v-model="formItem.transferUserCount" :placeholder="$t('请与上传清单人数保持一致')" class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{$t('转账总额')}}</label>
                            <FormItem prop="transferCurrencyCount">
                                <Input v-model="formItem.transferCurrencyCount" :placeholder="$t('请与上传清单总金额保持一致')" class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{$t('转账清单')}}</label>
                            <FormItem prop="file">
                                <FileInput @change="changeFile" ref="fileInput"></FileInput>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{$t('到账通知形式')}}</label>
                            <FormItem>
                                <CheckboxGroup v-model="noticeType">
                                    <Checkbox label="PM">
                                        <span>{{$t('站内信')}}</span>
                                    </Checkbox>
                                    <Checkbox label="SMS">
                                        <span>{{$t('短信')}}</span>
                                    </Checkbox>
                                    <Checkbox label="EMAIL">
                                        <span>{{$t('邮件')}}</span>
                                    </Checkbox>
                                </CheckboxGroup>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{$t('到账通知模板')}}</label>
                            <FormItem prop="notificationTemplate">
                                <Input v-model="formItem.notificationTemplate" :placeholder="$t('自动以文字通知，变量金额以%s代替')" type="textarea" class="m-input"></Input>
                            </FormItem>
                        </li>
                    </ul>
                </div>
            </Form>
            <div slot="footer" style="border-top: 0">
                <Button type="ghost" @click="cancel('formItem')">{{ $t('取消') }}</Button>
                <Button type="primary" @click="ok('formItem')">{{ $t('确定') }}</Button>
            </div>
        </Modal>
        <Modal
            v-model="toExaminePop"
            :title="$t('批量转账审核')"
            :loading="loading"
            >
            <Form ref="toExamineFormItem" :model="toExamineFormItem" :rules="ruleToExamineFormItem" :label-width="100">
                <div class="l-form">
                    <ul>
                        <li>
                            <label>{{$t('审核通过')}}</label>
                            <FormItem>
                                <RadioGroup v-model="status" class="l-radio">
                                    <Radio label="reject">
                                        <span>{{$t('拒绝')}}</span>
                                    </Radio>
                                    <Radio label="audit_ok">
                                        <span>{{$t('通过')}}</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{$t('管理员GA验证码')}}</label>
                            <FormItem prop="captcha">
                                <Input v-model="toExamineFormItem.captcha" :placeholder="$t('管理员GA验证码')" class="m-input"></Input>
                            </FormItem>
                        </li>
                    </ul>
                </div>
            </Form>
            <div slot="footer" style="border-top: 0">
                <Button type="ghost" @click="toExaminePop = false">{{ $t('取消') }}</Button>
                <Button type="primary" @click="approveSave('toExamineFormItem')">{{ $t('确定') }}</Button>
            </div>
        </Modal>
        <Modal
            v-model="detailed"
            :title="$t('批量转账明细')"
            width="800"
            >
            <div class="l-pop-table">
                <h2>{{$t('转账明细')}}</h2>
                <Table :columns="transferAccountTable" :data="transferAccount"></Table>
                <h2 class="pt20">{{$t('活动清单')}}</h2>
                <Table :columns="detailedListTable" :data="detailedList"></Table>
            </div>
            <div slot="footer" style="border-top: 0">
                <Button type="ghost" @click="cancelDetail()">{{ $t('取消') }}</Button>
                <Button type="primary" @click="cancelDetail()">{{ $t('确定') }}</Button>
            </div>
        </Modal>

        <Tabs value="transferAccounts" @on-click="tabs" class="l-tabs">
            <TabPane :label="$t('运营活动批量转账')" name="transferAccounts"  v-if="$store.state.user.checkPerm('dawn:operate:activity')">
                <div class="l-main">
                    <div class="l-search" v-if="$store.state.user.checkPerm('dawn:operate:activity:list')">
                        <Select v-model="stateType" class="l-select" :placeholder="$t('活动状态')" style="width: 150px;" v-autoLocale>
                            <Option value="">{{$t('全部')}}</Option>
                            <Option v-for="item in state" :value="item.value" :key="item.value">{{ $t(item.label) }}</Option>
                        </Select>
                        <Input v-model="activityName" :placeholder="$t('活动名称')" class="l-grouping-input" @on-keyup="keyup"></Input>
                        <Button type="primary" v-on:click="batchFilter" v-if="$store.state.user.checkPerm('dawn:operate:activity:list')">{{$t('查询')}}</Button>
                    </div>
                    <div class="l-table-body">
                        <h2>
                            {{$t('活动批量转账列表')}}
                            <div class="l-operation"  v-if="$store.state.user.checkPerm('dawn:operate:activity:add')">
                                <Button type="primary" size="small" class="m-btn" v-on:click="show">{{$t('添加批量转账')}}</Button>
                            </div>
                        </h2>
                        <Table :columns="batchListTable" :data="batchList" :no-data-text="$t('暂无数据')"></Table>
                        <div class="l-tfoot" v-if="totalCount">
                            <Page show-elevator :total="totalCount" :page-size="pageSize" :current="currPage" @on-change="page" size="small" show-total>
                                <slot>
                                    {{ $t('共') + ' ' + totalCount + ' ' + $t('条') }}
                                </slot>
                            </Page>
                        </div>
                    </div>
                </div>
            </TabPane>
            <TabPane :label="$t('待审核')" name="toExamine"  v-if="$store.state.user.checkPerm('dawn:operate:activity:check')">
                <div class="l-main">
                    <div class="l-search" v-if="$store.state.user.checkPerm('dawn:operate:activity:list')">
                        <Input v-model="activityName" :placeholder="$t('活动名称')" class="l-grouping-input"  @on-keyup="keyup"></Input>
                        <Button type="primary" v-on:click="filter" v-if="$store.state.user.checkPerm('dawn:operate:activity:approve:list')">{{$t('查询')}}</Button>
                    </div>
                    <div class="l-table-body">
                        <h2>
                            {{$t('活动批量转账待审核列表')}}
                        </h2>
                        <Table :columns="toExamineTable" :data="batchList" disabled-hover></Table>
                        <div class="l-tfoot" v-if="totalCount">
                            <Page show-elevator :total="totalCount" :page-size="pageSize" :current="currPage" @on-change="page" size="small" show-total>
                                <slot>
                                    {{ $t('共') + ' ' + totalCount + ' ' + $t('条') }}
                                </slot>
                            </Page>
                        </div>
                    </div>
                </div>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import { operation } from '__util/api'
    import FileInput from '__components/fileInput'
    import Cookies from 'js-cookie'
    export default {
        components: {
            FileInput
        },
        data () {
            const activityName = ( rule, value, callback ) => {
                if ( /[\u4e00-\u9fa5a-zA-Z0-9]+/.test(value) && value.length >= 5 && value.length <= 30) {
                    callback();
                }
                else{
                    callback(new Error(this.$t('不能少于5个字')));
                }
            };
            const activityDetails = ( rule, value, callback ) => {
                if (value.length >= 5) {
                    callback();
                }
                else{
                    callback(new Error(this.$t('不能少于5个字')));
                }
            };
            const transferUserCount = ( rule, value, callback ) => {
                if ( /[0-9]+/.test(value) ) {
                    callback();
                }
                else{
                    callback(new Error(this.$t('只能为数字')));
                }
            };
            const transferCurrencyCount = ( rule, value, callback ) => {
                if ( /[0-9]+/.test(value) ) {
                    callback();
                }
                else{
                    callback(new Error(this.$t('只能为数字')));
                }
            };
            const notificationTemplate = ( rule, value, callback ) => {
                if (value && value.length >= 5) {
                    callback();
                }
                else{
                    callback(new Error(this.$t('不能少于5个字')));
                }
            };
            const captcha = ( rule, value, callback ) => {
                if ( value === '' || !/^[0-9]{6}$/.test(value) || value.length != 6 ) {
                    callback(new Error( this.$t('GA验证为6位纯数字') ));
                }
                else{
                    callback();
                }
            };
            const fileCheck =  ( rule, value, callback ) => {
                if ( !value ) {
                    callback(new Error( this.$t('请选择文件') ));
                }
                else{
                    callback();
                }
            };
            return {
                value: '',
                modal1: false,
                modal2: false,
                modal3: false,
                phone: 'apple',
                select1: this.$t('计价货币'),

                //运营批量转账列表
                activityName: '',
                stateType: '',
                id:0,
                state: [
                    {value:'audit_no',label:'待审核'},
                    {value:'audit_ok',label:'已审核'},
                    {value:'reject',label:'已拒绝'},
                    {value:'complete',label:'已转账'},
                    {value:'transfer',label:'转账中'},
                    {value:'waiting',label:'待校验'},
                    {value:'check_fail',label:'校验失败'}
                ],
                toExamineTable: [
                    {
                        renderHeader: (h) => {
                             return this.$t('申请时间')
                        },
                        key: 'applyDatetime'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('活动名称')
                        },
                        key: 'activityName'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转出账户')
                        },
                        key: 'transferOutUserId',
                        render: (h, params) => {
                            let account;
                            switch (params.row.transferOutUserId) {
                                case 4:
                                    account = this.$t('活动账户');
                                    break;
                                case 6:
                                    account = this.$t('返佣账户');
                                    break;
                                default:

                            }
                            return account;
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转出币种')
                        },
                        key: 'transferOutCurrency',
                        render: (h, params) => {
                            return params.row.transferOutCurrency.toUpperCase();
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转出总额')
                        },
                        key: 'transferCurrencyCount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转出用户数')
                        },
                        key: 'transferUserCount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('状态')
                        },
                        key: 'transferStatusDesc',
                        render: (h, params) => {
                            let dSwitch = true;
                            let color = '#BCBFC1';
                            // disabled
                            //查看明细
                            if(this.$store.state.user.checkPerm('dawn:operate:activity:approve')){
                                dSwitch = false;
                                color = '#1991EB'
                            }
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small',
                                        disabled: dSwitch
                                    },
                                    style: {
                                        marginRight: '5px',
                                        color:'#1991EB'
                                    },
                                    on: {
                                        click: () => {
                                            this.toExaminePop = true;

                                            this.auditID      = params.row.id;
                                            this.auditAdminId = params.row.auditAdminId;
                                            this.captcha      = '';
                                        }
                                    }
                                }, this.$t('待审核'))
                            ]);
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('操作')
                        },
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            let cSwitch = true;
                            // disabled
                            //查看明细
                            if(this.$store.state.user.checkPerm('dawn:operate:activity:approve:detail')){
                                cSwitch = false;
                            }
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: cSwitch
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.detailed = true;
                                            this.id = params.row.id;
                                            this.activityDetail('approve');
                                        }
                                    }
                                }, this.$t('查看明细'))
                            ]);
                        }
                    }
                ],
                batchListTable: [
                    {
                        renderHeader: (h) => {
                             return this.$t('申请时间')
                        },
                        key: 'applyDatetime'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('活动名称')
                        },
                        key: 'activityName'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转出账户')
                        },
                        key: 'transferOutUserId',
                        render: (h, params) => {
                            let account;
                            switch (params.row.transferOutUserId) {
                                case 4:
                                    account = this.$t('活动账户');
                                    break;
                                case 6:
                                    account = this.$t('返佣账户');
                                    break;
                                default:

                            }
                            return account;
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转出币种')
                        },
                        key: 'transferOutCurrency',
                        render: (h, params) => {
                            return params.row.transferOutCurrency.toUpperCase();
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转出总额')
                        },
                        key: 'transferCurrencyCount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转出用户数')
                        },
                        key: 'transferUserCount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('状态')
                        },
                        key: 'transferStatusDesc',
                        render: (h, params) => {
                            return this.$t(params.row.transferStatusDesc)
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('操作')
                        },
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            let cSwitch = true;
                            // disabled
                            //查看明细
                            if(this.$store.state.user.checkPerm('dawn:operate:activity:detail')){
                                cSwitch = false;
                            }

                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: cSwitch
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.detailed = true;
                                            this.id = params.row.id;
                                            this.activityDetail();
                                        }
                                    }
                                }, this.$t('查看明细'))
                            ]);
                        }
                    }
                ],
                batchList: [],
                transferAccountTable: [
                    {
                        renderHeader: (h) => {
                             return this.$t('申请时间')
                        },
                        key: 'applyDatetime'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('活动名称')
                        },
                        key: 'activityName'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转出账户')
                        },
                        key: 'transferOutUserId',
                        render: (h, params) => {
                            let account;
                            switch (params.row.transferOutUserId) {
                                case 4:
                                    account = this.$t('活动账户');
                                    break;
                                case 6:
                                    account = this.$t('返佣账户');
                                    break;
                                default:

                            }
                            return account;
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转出币种')
                        },
                        key: 'transferOutCurrency'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转出总额')
                        },
                        key: 'transferCurrencyCount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转出人数')
                        },
                        key: 'transferUserCount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('当前状态')
                        },
                        // key: 'transferStatusDesc',
                        render: (h, params) => {
                            return this.$t(params.row.transferStatusDesc)
                        }
                    }
                ],
                transferAccount: [],
                detailedListTable: [
                    {
                        renderHeader: (h) => {
                             return this.$t('用户UID')
                        },
                        key: 'uid'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('转账金额')
                        },
                        key: 'transferAmount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('到账时间')
                        },
                        key: 'transferDatetime'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('订单ID')
                        },
                        key: 'id'
                    }
                ],
                detailedList: [],
                formItem: {
                    activityName: '',
                    activityDetails: '',
                    transferUserCount: '',
                    transferCurrencyCount: '',
                    notificationTemplate: '',
                },
                ruleItem : {
                    activityName   : [
                        { validator: activityName }
                    ],
                    activityDetails  : [
                        { validator: activityDetails }
                    ],
                    transferUserCount  : [
                        { validator: transferUserCount }
                    ],
                    transferCurrencyCount  : [
                        { validator: transferCurrencyCount }
                    ],
                    notificationTemplate  : [
                        { validator: notificationTemplate }
                    ],
                    file : [
                        { validator: fileCheck }
                    ]
                },
                toExamineFormItem:{
                    captcha: ""
                },
                ruleToExamineFormItem:{
                    captcha   : [
                        { validator: captcha }
                    ]
                },
                noticeType: ['PM'],
                transferOutUserId: '6',
                transferOutCurrency: 'BTC',



                //分页
                totalCount   : 0,
                pageSize     : 5,
                currPage     : 1,

                //查看明细
                detailed: false,

                //待审核
                transferStatus : '',
                toExaminePop : false,
                status : 'reject',
                captcha : '',
                auditID : '',
                auditAdminId : '',
                loading: true
            }
        },
        methods: {
            initForm () {
                this.$refs['fileInput'].clear()
                this.formItem = {}
                this.$refs['formItem'].resetFields()
                this.transferOutCurrency = 'BTC'
                this.noticeType = ['PM']
            },
            ok (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        const data = new FormData();
                        // data.append('file', this.$refs.file.files[0]);
                        data.append('file', this.formItem.file);
                        let obj = operation.activityAdd;
                        obj.params = {
                            activityName: this.formItem.activityName,
                            activityDetail: this.formItem.activityDetails,
                            transferOutUserId: this.transferOutUserId,
                            transferOutCurrency: this.transferOutCurrency,
                            transferUserCount: this.formItem.transferUserCount,
                            transferCurrencyCount: this.formItem.transferCurrencyCount,
                            notificationTemplate: this.formItem.notificationTemplate,
                            noticeType: this.noticeType.join()
                        }
                        obj.data = data
                        obj.headers.token = Cookies.get('token')
                        this.$axios(obj).then((res)=>{
                            this.getData();
                            this.modal1 = false;
                        })
                        .catch((error,a) => {
                            // this.$Message.error( this.$t(error) );
                            this.modal1 = false;
                        })



                    }
                    else{
                        this.loading = false;
                        setTimeout(()=>{
                            this.loading = true;
                        },0)
                    }
                })


            },
            keyup (e){
                if(e.keyCode == 13){
                    this.getData();
                }
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            },
            cancelDetail () {
              this.detailed = false;
            },
            show () {
                this.modal1 = true;
            },
            //选项卡切换
            tabs (name) {
                this.currPage = 1;
                this.activityName = '';
                this.stateType = '';
                if( name == 'toExamine' && this.$store.state.user.checkPerm('dawn:operate:activity:approve:list') ){
                    this.stateType = 'audit_no';
                    this.getData();
                }
                else if ( this.$store.state.user.checkPerm('dawn:operate:activity:list') ) {
                    this.stateType = '';
                    this.getData();
                }
            },
            //运营批量转账列表
            getData () {
                let request   = this.stateType === 'audit_no' ? operation.approveList : operation.activityList;

                request.params = {
                    page : this.currPage,
                    pageSize : this.pageSize,
                    activityName : this.activityName,
                    transferStatus : this.stateType
                };

                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.batchList  = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }
                })
                .catch((error) => {
                    // this.$Message.error( this.$t(error) );
                })
            },
            page (num){
                this.currPage = num;
                this.getData();
            },
            //查看详情
            activityDetail (type){
                let request   = type === 'approve' ? operation.approveDetail : operation.activityDetail;
                request.params = {
                    id : this.id
                };

                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.transferAccount  = res.data.transferInfo;
                        this.detailedList     = res.data.transferDetail.list;
                    }
                })
                .catch((error) => {
                    // this.$Message.error( this.$t(error) );
                })
            },
            //审核
            approveSave (name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.toExaminePop = false;
                        let request   = operation.approve;

                        request.data = {
                            id : this.auditID,
                            status : this.status,
                            // auditAdminId : this.auditAdminId,
                            googleCode : this.toExamineFormItem.captcha
                        };

                        this.$axios(request).then((res)=>{
                            if(res.success){
                                this.getData();
                            }
                        })
                        .catch((error) => {
                            // this.$Message.error( this.$t(error) );
                        })
                    }
                    else{
                        this.loading = false;
                        setTimeout(()=>{
                            this.loading = true;
                        },0)
                    }
                })

            },
            batchFilter (){
                this.currPage = 1;
                this.getData();
            },
            filter (){
                this.stateType = 'audit_no';
                this.currPage = 1;
                this.getData();
            },
            cancel(name){
                this.modal1 = false;
                this.$refs[name].resetFields();
            },
            // 上传文件
            changeFile (file) {
                this.formItem.file = file
            }
        },
        created (){
            //运营批量转账列表
            if ( this.$store.state.user.checkPerm('dawn:operate:activity:list') ) {
                this.getData();
            }
        },
        watch: {
            modal1 (val) {
                if ( !val ) {
                    this.initForm()
                }
            }
        }
    }
</script>
<style>
    .l-content .ivu-tabs .ivu-tabs-bar{
        height:61px;
        padding: 0 20px;
        background: #fff !important;
    }
    .l-content .ivu-tabs-nav .ivu-tabs-tab{
        padding: 20px 16px;
    }
    .l-content .ivu-table-wrapper{
        position: static;
    }

    .l-content .ivu-table:before {
        background-color: #fff;
    }
    .l-content .ivu-table:after {
        background-color: #fff;
    }
    .l-form .m-input .ivu-input{
        outline:none!important;resize:none!important;
    }
    .l-content .l-search .ivu-input-group-prepend{
        background: #fff;
    }
</style>
<style scoped>
    .l-content{
        margin:-10px;
    }
    .l-content .l-main{
        margin:0 20px;
    }
    .l-content .l-search{
        height: 32px;
        margin: 5px 0 20px 0;
    }
    .l-content .l-search .l-select-input{
        width: 100px;
    }
    .l-content .l-grouping-input{
        width: 200px;
        float: left;
        margin-right: 10px;
    }
    .l-content .l-select{
        float: left;
        width: 100px;
        margin-right: 10px;
    }
    .m-search{
        width: 360px;
        height: 32px;
        float: left;
        margin-right: 10px;
    }
    .m-search-btn{
        width: 60px;
    }
    .l-table-body{
        border-radius: 4px;
        border: 1px solid #E6EAEE;
        background: #fff;
    }
    .l-table-body h2{
        height: 50px;
        padding: 0 20px;
        font-size: 16px;
        color: #354052;
        line-height: 50px;
        text-align: left;
        font-weight: normal;
        border-bottom: 1px solid #E6EAEE;
    }
    .l-table-body .ivu-table-wrapper{
        border:0;
    }
    .l-table-body .l-tfoot{
        height: 48px;
        padding: 0 20px;
        text-align: right;
        border-top: 1px solid #E6EAEE;
        position: relative;
        top: -1px;
        z-index: 10;
    }
    .l-table-body .l-tfoot .ivu-page{
        padding: 12px 0;
    }
    .l-form{

    }
    .l-form li{
        /* overflow: hidden;
        padding: 10px 0; */
    }
    .l-form .ivu-checkbox-wrapper{
        text-align: left!important;
        width: auto!important;
    }
    .l-form label{
        float: left;
        width: 100px;
        text-align: right;
        padding: 7px 10px 0 0;
    }
    .l-form .m-input{
        width: 388px;
    }
    .l-form .ivu-form-item-content label{
        padding-top: 0;
    }
    .l-content .m-export{
        float: right;
        margin-top: 9px;
    }
    .l-content .l-operation{
        float: right;
        font-size: 12px;
    }
    .l-content .l-operation .m-btn{
        margin-left: 10px;
    }
    .l-content .l-trade{
        height: 48px;
        border-top: 1px solid #E6EAEE;
        border-bottom: 1px solid #E6EAEE;
        padding: 0 18px;
        line-height: 48px;
    }
    .l-content .l-trade span{

    }
    .l-form .l-radio label{
        text-align: left;
        width: auto;
    }
    .mb-20{
        margin-bottom: 20px;
    }
    .l-pop-table{}
    .l-pop-table h2{
        font-weight: normal;
        font-size: 14px;
        color: #354052;
        padding-bottom: 20px;
    }
    .l-pop-table h2.pt20{
        padding-top: 20px;
    }
</style>
