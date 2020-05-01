<template>
    <div class="l-content">
        <Modal
            v-model="modal"
            :title="title"
            :loading="loading"
            >
            <p slot="header">
                <span>{{ $t(title) }}</span>
            </p>
            <Form ref="formItem" :model="formItem" :rules="ruleItem" :label-width="100">
                <div class="l-form">
                    <ul>
                        <li>
                            <label>{{type}}{{$t('币种')}}</label>
                            <FormItem prop="currencys">
                                <Input v-model="currencys" disabled class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{type}}{{$t('账户')}}</label>
                            <FormItem prop="dataRadio">
                                <RadioGroup v-model="dataRadio" class="l-radio" @on-change="radio">
                                    <Radio label="activitiesAccount">
                                        <span>{{$t('活动账户')}}</span>
                                    </Radio>
                                    <Radio label="returnCommissionAccount">
                                        <span>{{$t('返佣账户')}}</span>
                                    </Radio>
                                    <Radio label="marginAccount">
                                        <span>{{$t('保证金账户')}}</span>
                                    </Radio>


                                </RadioGroup>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{type}}{{$t('数额')}}</label>
                            <FormItem prop="amount">
                                <Input v-model="formItem.amount" placeholder="0" class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{$t('Google双重验证')}}</label>
                            <FormItem prop="captcha">
                                <Input v-model="formItem.captcha" placeholder="" class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{type}}{{$t('备注')}}</label>
                            <FormItem prop="comment">
                                <Input v-model="formItem.comment" placeholder="" type="textarea" class="m-input"></Input>
                            </FormItem>
                        </li>
                    </ul>
                </div>
            </Form>
            <div slot="footer" style="border-top: 0">
                <Button type="ghost" @click="cancel('formItem')">{{ $t('取消') }}</Button>
                <Button type="primary" @click="save('formItem')">{{ $t('确定') }}</Button>
            </div>
        </Modal>

        <Modal
            v-model="auditing"
            :title="$t('运营账户资金划转审核')"
            :loading="loading"
            >
            <p slot="header">
                <span>{{ $t('审核账户资金划转审核') }}</span>
            </p>
            <Form ref="formItemToExamine" :model="formItemToExamine" :rules="ruleItemToExamine" :label-width="100">
                <div class="l-form">
                    <ul>
                        <li>
                            <label>{{ $t('审核结果')}}</label>
                            <FormItem prop="toExamineRadio">
                                <RadioGroup v-model="toExamineRadio" class="l-radio" @on-change="radio">
                                    <Radio label="audit_ok">
                                        <span>{{ $t('通过')}}</span>
                                    </Radio>
                                    <Radio label="reject">
                                        <span>{{ $t('拒绝')}}</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{ $t('Google双重验证')}}</label>
                            <FormItem prop="captcha">
                                <Input v-model="formItemToExamine.captcha" placeholder="" class="m-input"></Input>
                            </FormItem>
                        </li>
                    </ul>
                </div>
            </Form>
            <div slot="footer" style="border-top: 0">
                <Button type="ghost" @click="cancel('formItemToExamine')">{{ $t('取消') }}</Button>
                <Button type="primary" @click="saveAuditing('formItemToExamine')">{{ $t('确定') }}</Button>
            </div>
        </Modal>

        <Modal
            v-model="generalAccount"
            :title="title"
            :loading="loading"
            >
            <p slot="header">
                <span>{{ $t(title) }}</span>
            </p>
            <Form ref="userFormItem" :model="userFormItem" :rules="ruleUserFormItem" :label-width="100">
                <div class="l-form">
                    <ul>
                        <li>
                            <label>{{ $t('拨款币种')}}</label>
                            <FormItem prop="currency">
                                <Input v-model="userFormItem.currency"  disabled placeholder="BTC" class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{ $t('运营账户资产')}}</label>
                            <FormItem prop="assets">
                                <Input v-model="userFormItem.assets" disabled placeholder="0" class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{ $t('拨款类型')}}</label>
                            <FormItem require prop="sourceType">
                                <Select v-model="userFormItem.sourceType" style="width:150px" :placeholder="$t('账户类型')" v-autoLocale>
                                    <Option v-for="item in selectAnAccount" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{ $t('划拨数额')}}</label>
                            <FormItem prop="amount">
                                <Input v-model="userFormItem.amount" placeholder="0" class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{ $t('Google双重验证')}}</label>
                            <FormItem prop="captcha">
                                <Input v-model="userFormItem.captcha" placeholder="" class="m-input"></Input>
                            </FormItem>
                        </li>
                        <li>
                            <label>{{ $t('拨款事由')}}</label>
                            <FormItem prop="comment">
                                <Input v-model="userFormItem.comment" placeholder="" type="textarea" class="m-input"></Input>
                            </FormItem>
                        </li>
                    </ul>
                </div>
            </Form>
            <div slot="footer" style="border-top: 0">
                <Button type="ghost" @click="cancel('userFormItem')">{{ $t('取消') }}</Button>
                <Button type="primary" @click="userSave('userFormItem')" :disabled="waitBtn">{{ $t('确定') }}</Button>
            </div>
        </Modal>

        <Tabs value="operate" @on-click="tabs" class="l-tabs">
            <TabPane :label="$t('运营账户划拨')" name="operate" v-if="$store.state.user.checkPerm('pro:fince:operation:account')">
                <div class="l-main">
                    <div class="l-search" v-if="$store.state.user.checkPerm('pro:fince:operation:accountsList')">
                        <Form ref="formItemCurr" :model="formItemCurr" :rules="ruleItemCurr">
                            <FormItem prop="currency">
                                <Input v-model="formItemCurr.currency" :placeholder="$t('搜索币种')" class="m-search" @on-keyup="keyup"></Input>
                                <Button type="primary" v-on:click="search( 'formItemCurr' )">{{ $t('查询') }}</Button>
                            </FormItem>
                        </Form>
                    </div>
                    <div class="l-table-body">
                        <h2>{{ $t('配资列表') }}</h2>

                        <Table :columns="operateTable" :data="operate" :no-data-text="$t('暂无数据')"></Table>

                    </div>
                </div>
            </TabPane>
            <TabPane :label='$t("用户账户划拨")' name="user" v-if="$store.state.user.checkPerm('pro:fince:operation:user')">
                <div class="l-main">
                    <div class="l-search" v-if="$store.state.user.checkPerm('pro:fince:operation:getTransferUser')">
                        <Select v-model="userType" style="width:150px" :placeholder='$t("用户搜索")' @on-change="userTypeEvent" v-autoLocale>
                            <Option value="uid" key="uid">UID</Option>
                            <Option value="phone" key="phone">{{ $t('电话') }}</Option>
                            <Option value="email" key="email">{{ $t('邮箱') }}</Option>
                        </Select>
                        <Input v-model="tel" :placeholder='$t("请输入")' class="m-search"></Input>
                        <Button type="primary" v-on:click="userSearch">{{ $t('查询') }}</Button>
                    </div>
                    <div class="l-table-body mb-20">
                        <h2>
                            {{ $t('用户信息') }}
                        </h2>
                        <Table :columns="userTable" :data="user" :no-data-text="$t('暂无数据')"></Table>
                    </div>

                    <div class="l-table-body">
                        <h2>
                            {{ $t('用户资产') }}
                            <Checkbox v-model="single" class="l-single" @on-change="setSingle">{{ $t('显示全部币种') }}</Checkbox>
                        </h2>
                        <Table :columns="userTable1" :data="user1" :no-data-text="$t('暂无数据')"></Table>
                    </div>
                </div>
            </TabPane>
            <TabPane :label='$t("划转审核")' name="toexamine" v-if="$store.state.user.checkPerm('pro:fince:operation:approve')">
                <div class="l-main">
                    <div class="l-search"  v-if="$store.state.user.checkPerm('pro:fince:operation:approveList')">
                        <Select v-model="targetAccount" style="width:150px" :placeholder='$t("账户类型")' @on-change="accountEvent" v-autoLocale>
                            <Option value="" key="">{{ $t('全部') }}</Option>
                            <Option v-for="item in accountListArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <Select v-model="transferType" style="width:150px" :placeholder='$t("划拨类型")' @on-change="transferEvent" v-autoLocale>
                            <Option value="" key="">{{ $t('全部') }}</Option>
                            <Option value="0" key="0">{{ $t('拨款') }}</Option>
                            <Option value="1" key="1">{{ $t('收款') }}</Option>
                        </Select>
                    </div>

                    <div class="l-table-body">
                        <h2>
                            {{ $t('用户信息') }}
                        </h2>
                        <Table :columns="toExamineTable" :data="toExamine" :no-data-text="$t('暂无数据')"></Table>
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
            <TabPane :label='$t("历史记录")' name="history" v-if="$store.state.user.checkPerm('pro:fince:operation:history')">
                <div class="l-main">
                    <div class="l-filter fix" v-if="$store.state.user.checkPerm('pro:fince:operation:accountsHistory')">
                        <h2>{{ $t('筛选条件') }}</h2>
                        <div class="l-search fix">
                            <Select v-model="currencyName" multiple  class="l-screen" :placeholder='$t("请选择币种")'  @on-change="symbolEvent" v-autoLocale>
                                <Option :value='$t("全部")'>{{ $t('全部') }}</Option>
                                <Option v-for="item in currencyList" :value="item" :key="item">{{ item.toUpperCase() }}</Option>
                            </Select>
                            <Select v-model="historyTransferType" class="l-select" :placeholder='$t("划拨类型")' v-autoLocale>
                                <Option value="" key="">{{ $t('全部') }}</Option>
                                <Option value="0" key="0">{{ $t('拨款') }}</Option>
                                <Option value="1" key="1">{{ $t('收款') }}</Option>
                            </Select>
                            <Select v-model="transferAccount" class="l-select" :placeholder='$t("划拨账户")' style="width: 140px;" v-autoLocale>
                                <Option value="" key="">{{ $t('全部') }}</Option>
                                <Option v-for="item in accountListArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                            <DatePicker type="datetimerange" :placeholder='$t("筛选时间 - 起 -- 筛选时间 - 止")' class="l-date-picker" @on-change="dateEvent"></DatePicker>
                            <Button type="primary" v-on:click="getHistoryQuery">{{ $t("查询") }}</Button>
                        </div>
                    </div>

                    <div class="l-table-body mb-20">
                        <h2>
                            {{ $t("用户信息") }}
                            <Button type="primary" class="m-export" v-on:click="exports" v-if="$store.state.user.checkPerm('pro:fince:operation:accountsHistoryExp')">{{ $t("数据导出") }}</Button>
                        </h2>
                        <Table :columns="historyListTable" :data="historyList" :no-data-text="$t('暂无数据')"></Table>
                        <div class="l-tfoot" v-if="historyTotalCount">
                            <Page show-elevator :total="historyTotalCount" :page-size="historyPageSize" :current="historyCurrPage" @on-change="historyPage" size="small" show-total>
                                <slot>
                                {{ $t('共') + ' ' + historyTotalCount + ' ' + $t('条') }}
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
    import { finance } from '__util/api';
    export default {
        data () {
            const currency = ( rule, value, callback ) => {
                if(value == ""){
                    callback();
                    return;
                }
                if ( !/^[A-Za-z0-9]+$/.test(value)) {
                    callback(new Error( this.$t('只可以输入英文跟数字') ));
                }
                else{
                    callback();
                }
            };
            const amount = ( rule, value, callback ) => {
                if ( value === '' || value <= 0 ||  !/^\d+(\.\d+)?$/.test(value)) {
                    callback(new Error( this.$t('配资数额框只可输入数字和小数点') ));
                }
                else if( value.length > 30 ){
                    callback(new Error( this.$t('不大于30个字符') ));
                }
                else{
                    callback();
                }
            };
            const userAmount = ( rule, value, callback ) => {
                if(value > this.userFormItem.assets){
                    callback(new Error( this.$t('划拨数额不能大于运营账户资产') ));
                }
                if ( value === '' || value <= 0 ||  !/^\d+(\.\d+)?$/.test(value)) {
                    callback(new Error( this.$t('配资数额框只可输入数字和小数点') ));
                }
                else if( value.length > 30 ){
                    callback(new Error( this.$t('不大于30个字符') ));
                }
                else{
                    callback();
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
            return {
                //用户信息
                single: false,
                selectAnAccount : [],
                sourceType: '',
                waitBtn: false,
                map: {},
                userTypeFinance: 0,
                userAccountId : '',
                userId : '',
                userFormItem : {
                    currency: '',
                    assets: '',
                    amount: '',
                    captcha: '',
                    comment: '',
                    sourceType: ''
                },
                ruleUserFormItem: {
                    amount   : [
                        { validator: userAmount }
                    ],
                    captcha  : [
                        { validator: captcha }
                    ],
                    comment  : [
                        { required: true, message: this.$t('备注不能为空') }
                    ],
                    sourceType: [
                        { required: true, message: this.$t('拨款类型不能为空'), trigger: 'change' }
                    ]
                },
                /** 运营账户划拨 **/
                //弹窗
                title         : this.$t('运营账户拨款'),
                type          : this.$t('拨款'),
                modal         : false,
                dataRadio     : 'activitiesAccount',
                currencys     : '',
                operationType : 0,
                accountId : {
                    activitiesAccount : 0,
                    incentive : 0,
                    returnCommissionAccount : 0
                },
                accountUserId : {
                    activitiesAccount : 0,
                    incentive : 0,
                    returnCommissionAccount : 0
                },
                datas        : {},
                formItem      : {
                    amount   : '',
                    captcha  : '',
                    comment  : '',
                },
                ruleItem : {
                    amount   : [
                        { validator: amount }
                    ],
                    captcha  : [
                        { validator: captcha }
                    ],
                    comment  : [
                        { required: true, message: this.$t('备注不能为空') }
                    ],
                },
                //列表搜索
                formItemCurr:{
                    currency : ''
                },
                ruleItemCurr : {
                    currency   : [
                        { validator: currency }
                    ]
                },
                operateTable : [
                    {
                        renderHeader: (h) => {
                             return this.$t('币种名称')
                        },
                        key   : 'currency',
                        render: (h, params) => {
                            return params.row.currency.toUpperCase();
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('活动账户')
                        },
                        key   : 'activitiesAccount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('返佣账户')
                        },
                        key   : 'returnCommissionAccount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('保证金账户')
                        },
                        key   : 'marginAccount'

                    },

                    {
                        renderHeader: (h) => {
                             return this.$t('操作')
                        },
                        key   : 'action',
                        width : 250,
                        align : 'center',
                        render: (h, params) => {
                            let bSwitch = true;
                            let sSwitch = true;
                            // disabled
                            // 配资
                            if(this.$store.state.user.checkPerm('pro:fince:operation:reduceAccounts')){
                                bSwitch = false;
                            }
                            // 减资
                            if(this.$store.state.user.checkPerm('pro:fince:operation:increaseAccounts')){
                                sSwitch = false;
                            }
                            return h('div', [
                                h('Button', {
                                    props : {
                                        type : 'primary',
                                        size : 'small',
                                        disabled : bSwitch,
                                    },
                                    style : {
                                        marginRight: '5px'
                                    },
                                    on : {
                                        click: () => {
                                            // this.formItem.amount        = '';
                                            // this.formItem.captcha       = '';
                                            // this.formItem.comment       = '';
                                            this.modal         = true;
                                            this.currencys     = params.row.currency.toUpperCase();
                                            this.type          = this.$t('拨款');
                                            this.title         = this.$t('运营账户配资');
                                            this.operationType = 0;
                                        }
                                    }
                                }, this.$t('配资') ),
                                h('Button', {
                                    props : {
                                        type: 'primary',
                                        size: 'small',
                                        disabled : sSwitch,
                                    },
                                    on : {
                                        click: () => {
                                            // this.formItem.amount        = '';
                                            // this.formItem.captcha       = '';
                                            // this.formItem.comment       = '';
                                            this.modal         = true;
                                            this.currencys     = params.row.currency.toUpperCase();
                                            this.type          = this.$t('收款');
                                            this.title         = this.$t('运营账户配资');
                                            this.operationType = 1;
                                        }
                                    }
                                }, this.$t('减资') )
                            ]);
                        }
                    }
                ],
                operate      : [],

                /** 用户账户划拨 **/
                //弹窗
                generalAccount : false,
                //列表搜索
                tel : '',
                userTable : [
                    {
                        renderHeader: (h) => {
                             return this.$t('UID')
                        },
                        key   : 'uid'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('手机')
                        },
                        key   : 'phone'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('邮箱')
                        },
                        key   : 'email'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('总资产折合（BTC）')
                        },
                        key   : 'totalBalance'
                    }
                ],
                user : [],
                userTable1 : [
                    {
                        renderHeader: (h) => {
                             return this.$t('币种名称')
                        },
                        key   : 'currency',
                        render: (h, params) => {
                            return params.row.currency.toUpperCase();
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('可用资产')
                        },
                        key   : 'trade'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('冻结资产')
                        },
                        key   : 'frozen'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('操作')
                        },
                        key   : 'action',
                        width : 150,
                        align : 'center',
                        render: (h, params) => {
                            let bSwitch = true;
                            let sSwitch = true;
                            // disabled
                            //配资
                            if(this.$store.state.user.checkPerm('pro:fince:operation:reduceToUser')){
                                bSwitch = false;
                            }
                            //减资
                            if(this.$store.state.user.checkPerm('pro:fince:operation:increaseToUser')){
                                sSwitch = false;
                            }

                            return h('div', [
                                h('Button', {
                                    props : {
                                        type : 'primary',
                                        size : 'small',
                                        disabled : bSwitch,
                                    },
                                    style : {
                                        marginRight : '5px'
                                    },
                                    on : {
                                        click: () => {
                                            this.generalAccount = true;
                                            //增加
                                            this.selectAnAccount = this.reduce;
                                            // this.sourceType = this.increase[0].value;
                                            this.userFormItem.currency = params.row.currency.toUpperCase();
                                            this.userTypeFinance = 0;
                                            this.userFormItem.assets = this.map[ params.row.currency.toUpperCase() ]
                                            
                                            this.title         = this.$t('向用户账户拨款');
                                        }
                                    }
                                }, this.$t('拨款') ),
                                h('Button', {
                                    props : {
                                        type : 'primary',
                                        size : 'small',
                                        disabled : sSwitch,
                                    },
                                    on : {
                                        click: () => {
                                            this.generalAccount = true;
                                            //用户信息
                                            this.selectAnAccount = this.increase;
                                            this.sourceType = this.increase[0].value;
                                            this.userFormItem.currency = params.row.currency.toUpperCase();
                                            this.userTypeFinance = 1;
                                            this.userFormItem.assets = params.row.trade
                                            this.title         = this.$t('向用户账户收款');
                                        }
                                    }
                                }, this.$t('收款') )
                            ]);
                        }
                    }
                ],
                user1 : [],
                user2 : [],
                user3 : [],

                /** 划转审核 **/
                //审核弹窗
                auditing       : false,
                toExamineRadio : '',
                targetAccount  : '',
                id             : '',
                formItemToExamine : {

                },
                formItemToExamine : {
                    captcha  : '',
                },
                ruleItemToExamine : {
                    captcha  : [
                        { validator: captcha }
                    ]
                },
                //列表搜索
                transferType   : '',
                toExamineTable : [
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨ID')
                        },
                        key   : 'id'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('账户类型')
                        },
                        key   : 'TargetUid',
                        render: (h, params) => {
                            let type    = params.row.targetUid;
                            let account = type ? type : params.row.targetAccount;
                            let str     = this.accountList[ this.accountMap[ account ] ];
                            return str  ? this.$t(str) : ( this.$t('用户账户') + '[' + account + ']' );
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨方向')
                        },
                        key   : 'operationType',
                        render: (h, params) => {
                            let type = params.row.operationType;
                            return type == 1 ? this.$t('收款') : this.$t('拨款');
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨类型')
                        },
                        key   : 'sourceType',
                        render: (h, params) => {
                            let type = params.row.sourceType;
                            return this.$t(this.accountType[type]);
                        }

                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('拨款币种')
                        },
                        key   : 'currency'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨金额')
                        },
                        key   : 'amount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('备注')
                        },
                        key   : 'comment'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('操作人')
                        },
                        key   : 'operationPerson'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('操作时间')
                        },
                        key   : 'createDate'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('操作')
                        },
                        key   : 'action',
                        width : 150,
                        align : 'center',
                        render: (h, params) => {
                            let sSwitch = true;
                            // disabled
                            //审核
                            if(this.$store.state.user.checkPerm('pro:fince:operation:approve')){
                                sSwitch = false;
                            }
                            return h('div', [
                                h('Button', {
                                    props : {
                                        type : 'primary',
                                        size : 'small',
                                        disabled : sSwitch,
                                    },
                                    style : {
                                        marginRight : '5px'
                                    },
                                    on : {
                                        click: () => {
                                            this.id             = params.row.id;
                                            this.transferStatus = params.row.transferStatus;

                                            this.formItemToExamine.captcha  = '';
                                            this.toExamineRadio = ''
                                            this.auditing = true;
                                        }
                                    }
                                }, this.$t('审核') )
                            ]);
                        }
                    }
                ],
                toExamine      : [],
                accountMap     : {},
                //审核分页
                totalCount     : 0,
                pageSize       : 10,
                currPage       : 1,

                /** 历史记录 **/
                //搜索
                historyTransferType : '',
                currencyName        : [],
                transferAccount     : '',
                startDate           : '',
                endDate             : '',
                currencyList        : [],
                //列表
                historyListTable    : [
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨ID')
                        },
                        key   : 'id'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('账户类型')
                        },
                        key   : 'targetUid',
                        render: (h, params) => {
                            let type    = params.row.targetUid;
                            let account = type ? type : params.row.targetAccount;
                            let str     = this.accountList[ this.accountMap[ account ] ];

                            return str  ? this.$t(str) : ( this.$t('用户账户') + '[' + account + ']' );
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨方向')
                        },
                        key   : 'operationType',
                        render: (h, params) => {

                            let type = params.row.operationType;
                            return type == 1 ? this.$t('收款') : this.$t('拨款');
                        }
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨类型')
                        },
                        key   : 'sourceType',
                        render: (h, params) => {
                            let type = params.row.sourceType;
                            return this.$t(this.accountType[type]);
                        }

                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('拨款币种')
                        },
                        key   : 'currency'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('划拨金额')
                        },
                        key   : 'amount'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('备注')
                        },
                        key   : 'comment'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('操作日志')
                        },
                        key   : 'operationLog'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('审核日志')
                        },
                        key   : 'approveLog'
                    },
                    {
                        renderHeader: (h) => {
                             return this.$t('操作')
                        },
                        key   : 'approveStatus',
                        render: (h, params) => {
                            let type = params.row.approveStatus,
                                str;

                            type == 'audit_no' && (str = this.$t('待审核') );
                            type == 'audit_ok' && (str = this.$t('已完成') );
                            type == 'reject'   && (str = this.$t('已拒绝') );

                            return str;
                        }
                    }
                ],
                historyList         : [],
                //历史分页
                historyTotalCount   : 0,
                historyPageSize     : 10,
                historyCurrPage     : 1,


                //未知
                approvePerson : '',
                phone : 'apple',
                value: '',
                auditing1: false,


                /** 公用数据 **/
                loading : true,
                //账户类型
                accountType : {
                    "unknown"                                            : "未知",
                    "system-master-account-in"                           : "系统总账户配资充值",
                    "system-master-account-out"                          : "系统总账户减资提现",
                    "asset-management-account-transfer-in"               : "资管账户转入转账",
                    "asset-management-account-transfer-out"              : "资管账户转出转账",
                    "operations-account-transfer-in"                     : "运营账户转入转账",
                    "operations-account-transfer-out"                    : "运营账户转出转账",
                    "fork-system-account-transfer-in"                    : "分叉转账账户转入转账",
                    "fork-system-account-transfer-out"                   : "分叉转账账户转出转账",
                    "margin-cash-pool-transfer-in"                       : "本金池转入转账",
                    "margin-cash-pool-transfer-out"                      : "本金池转出转账",
                    "operations-account-to-inspire-account"              : "激励账户转入转账",
                    "inspire-account-to-operations-account"              : "激励账户转出转账",
                    "inspire-account-to-user-trade"                      : "从激励账户转出",
                    "user-trade-to-inspire-account"                      : "用户转给激励账户",
                    "loan-system-account-transfer-in"                    : "本金账户转入转账",
                    "loan-system-account-transfer-out"                   : "本金账户转出转账",
                    "operations-account-user-event-in"                   : "运营账户活动策划转入",
                    "operations-account-user-event-out"                  : "运营账户活动策划转出",
                    "marketing-account-transfer-in"                      : "活动账户转出",
                    "marketing-account-transfer-out"                     : "用户转给活动账户",
                    "rebate-account-transfer-in"                         : "返佣账户转出",
                    "rebate-account-transfer-out"                        : "用户转给返佣账户",
                    "operations-account-loan-to-user-trade"              : "运营账户借出",
                    "operations-account-recycling-user-trade-principal"  : "运营账户收款",
                    "operations-account-expenditure"                     : "运营账户支出",
                    "operations-account-earning"                         : "运营账户收入",
                    "operations-account-deposit-compensate-expenditure"  : "充币业务补偿支出",
                    "operations-account-withdraw-compensate-expenditure" : "提币业务补偿支出",
                    "operations-account-deposit-compensate-earning"      : "充币业务补偿收入",
                    "operations-account-withdraw-compensate-earning"     : "提币业务补偿收入",
                    "operations-to-cash-deposit"                         : "运营账户拨款至保证金账户",
                    "cash-deposit-to-operations"                         : "运营账户从保证金账户收款",
                },
                //账户
                accountList : {
                    // "systemAccount"           : "总账户",
                    "operationsAccount"       : "运营账户",
                    "assetManagementAccount"  : "资管账户",
                    "activitiesAccount"       : "活动账户",
                    "redPackageAccount"       : "红包账户",
                    "returnCommissionAccount" : "返佣账户",
                    "forkAccount"             : "分叉账户",
                    "loanAssetAccount"        : "借贷本金账户",
                    "loanedAccount"           : "借贷已借账户",
                    "incentive"               : "激励账户",
                    "marginAccount"           : "保证金账户",
                },
                accountListArr : [
                    {   value : "activitiesAccount",
                        label : this.$t("活动账户")
                    },
                    {   value : "returnCommissionAccount",
                        label : this.$t("返佣账户")
                    },
                    {   value : "userAccount",
                        label : this.$t("用户账户")
                    },
                    {   value : "marginAccount",
                        label : this.$t("保证金账户")
                    }

                ],

                //用户搜索
                userType : "uid",
                //增加-收款
                increase: [
                    {   value : "operations-account-earning",
                        label : this.$t("运营账户收入")
                    },
                    {   value : "operations-account-recycling-user-trade-principal",
                        label : this.$t("运营账户收款")
                    },
                    {   value : "operations-account-deposit-compensate-earning",
                        label : this.$t("充币业务补偿收入")
                    },
                    {   value : "operations-account-withdraw-compensate-earning",
                        label : this.$t("提币业务补偿收入")
                    }
                ],
                //减少-拨款
                reduce: [
                    {   value : "operations-account-expenditure",
                        label : this.$t("运营账户支出")
                    },
                    {   value : "operations-account-loan-to-user-trade",
                        label : this.$t("运营账户借出")
                    },
                    {   value : "operations-account-deposit-compensate-expenditure",
                        label : this.$t("充币业务补偿支出")
                    },
                    {   value : "operations-account-withdraw-compensate-expenditure",
                        label : this.$t("提币业务补偿支出")
                    }
                ],

            }
        },
        methods: {
            // 初始化划拨表单
            initForm () {
                this.userFormItem = {
                    currency: '',
                    assets: '',
                    amount: '',
                    captcha: '',
                    comment: ''
                }
                this.$refs['userFormItem'].resetFields();
            },
            //全选
            symbolEvent (array) {
                let index    = array.indexOf(this.$t('全部'));
                let currency = this.currencyList.join();
                if( index >= 0 ){
                    this.currencyName = currency.split(',');
                }
            },
            setSingle (state){
                if(state){
                    this.user1 = this.user2.concat(this.user3);
                }
                else{
                    this.user1 = this.user2;
                }
            },
            //历史导出
            exports () {
                let request = finance.operationOperation.accountsHistoryExp

                request.params = {
                    // "transferType"  : "2",
                    "startDate"     : this.startDate,
                    "endDate"       : this.endDate,
                    "currency"      : this.currencyName.join(),
                    "accountType"   : this.transferAccount,
                    "operationType" : this.historyTransferType
                };
                this.$axios(request).then((res)=>{
                    window.open( res.data );
                })
            },
            userSave (name) {
                //用户收付款
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.setUserSave();
                    }
                    else{
                        this.loading = false;
                        setTimeout(()=>{
                            this.loading = true;
                        },0)
                    }
                })
            },
            setUserSave () {
                let request,accountId,userAccountId;

                if (this.userTypeFinance === 0) {
                    request = finance.operationOperation.reduceToUser;
                } else {
                    request = finance.operationOperation.increaseToUser;
                }

                accountId     = this.userAccountId;
                userAccountId = this.userId;
                this.waitBtn = true
                //设置GET请求数据
                request.params = { 'captcha' : this.userFormItem.captcha };

                //设置POST请求数据
                this.datas['amount']        = this.userFormItem.amount;
                this.datas['comment']       = this.userFormItem.comment;
                this.datas['currency']      = this.userFormItem.currency.toLowerCase();
                this.datas['sourceType']    = this.userFormItem.sourceType;

                this.datas['accountId']     = accountId;
                this.datas['userAccountId'] = userAccountId;
                request.data = this.datas;
                //设置收付款
                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.generalAccount = false;
                        this.waitBtn = false
                        // this.modal = false;
                        // this.$Message.info(res.message);
                        // this.getData();
                    }
                })
                .catch((error) => {
                    this.generalAccount = false;
                    this.waitBtn = false
                    // this.$Message.error( this.$t(error) );
                })
            },
            save (name) {
                //划拨账户收付款
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //资产配减资
                        this.setAccount();
                    }
                    else{
                        this.loading = false;
                        setTimeout(()=>{
                            this.loading = true;
                        },0)
                    }
                })
            },
            //审核
            saveAuditing (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.setToExamine();
                    }
                    else{
                        this.loading = false;
                        setTimeout(()=>{
                            this.loading = true;
                        },0)
                    }
                })
            },
            //设置账户切换
            radio (name) {
                this.datas['accountId']     = this.accountId[name];
                this.datas['accountUserId'] = this.accountUserId[name];
            },
            //数据MAP
            dataMap ( data ) {
                let newData = [];
                for(var i=0;i<data.length;i++){
                    newData.push({
                        'currency' : data[i].currency,
                        'activitiesAccount' : data[i].accounts.trade.activitiesAccount,
                        'incentive' : data[i].accounts.trade.incentive,
                        'returnCommissionAccount' : data[i].accounts.trade.returnCommissionAccount,
                        'marginAccount' : data[i].accounts.trade.marginAccount,
                    })
                }
                return newData;
            },
            //用户账户划拨
            userSearch () {
                //获取划拨账户信息列表
                let request = finance.operationOperation.getTransferUser;

                request.params = { 'search' : this.tel, 'type': this.userType };
                this.$axios(request).then((res)=>{
                    if(res.success){
                        if( res.data.userInfo ){
                            this.user  = [res.data.userInfo];
                            this.user[0]['totalBalance'] = res.data.assetUserInfo.totalBalance;
                            this.userFormItem.assets = res.data.assetUserInfo.totalBalance;

                            this.user1 = res.data.assetUserInfo.data;
                            this.user2 = res.data.assetUserInfo.data;
                            // this.user3 = res.data.assetUserInfo.zeroData;

                            this.map = res.data.operationAccount.map;

                            this.user3 = [];

                            res.data.currencyList.map((item) => {
                                let isAdd = true
                                for (var i = 0; i < this.user1.length; i++) {
                                    if ( this.user1[i].currency === item.toLowerCase() ) {
                                        isAdd = false
                                    }
                                }
                                if ( isAdd ) {
                                    this.user3.push({
                                        currency: item,
                                        trade: 0,
                                        frozen: 0
                                    })
                                }
                                return item
                            })

                            this.setSingle(this.single)

                            this.userAccountId = res.data.operationAccount.accountUserId;
                            this.userId        = res.data.userInfo.userId;
                        }
                        else{
                            this.user = [];
                            this.user1 = [];
                            this.user2 = [];
                            this.user3 = [];
                        }
                    }
                })
                .catch((error) => {
                    // this.$Message.error( this.$t(error) );
                })
            },
            //选项卡切换
            tabs (name) {
                switch (name) {
                    case 'operate':
                        if ( this.$store.state.user.checkPerm('pro:fince:operation:accountsList') )
                        this.getData();
                        break;
                    case 'toexamine':
                        if ( this.$store.state.user.checkPerm('pro:fince:operation:approveList') )
                        this.getToExamineData();
                        break;
                    case 'history':
                        if ( this.$store.state.user.checkPerm('pro:fince:operation:accountsHistory') ){
                            this.getHistoryData();
                            this.getCurrency();
                        }
                        break;
                }
            },
            keyup (e){
                if(e.keyCode == 13){
                    this.search('formItemCurr');
                }
            },
            search (name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //搜索
                        this.getData();
                    }
                    else{
                        this.loading = false;
                        setTimeout(()=>{
                            this.loading = true;
                        },0)
                    }
                })
            },
            //获取运营账户划拨列表
            getData (){
                let request = finance.operationOperation.accountsList;

                //币种搜索
                request.params = { 'currency' : this.formItemCurr.currency };

                this.$axios(request).then((res)=>{
                    if(res.success){
                        let data           = this.dataMap(res.data.list);
                        let accountIds     = res.data.accountIds;
                        let accountUserIds = res.data.accountUserIds;
                        this.operate       = data;

                        //设置账户状态
                        this.accountId     = accountIds;
                        this.accountUserId = accountUserIds;

                        //设置默认账户ID
                        this.datas['accountId']     = this.accountId.activitiesAccount;
                        this.datas['accountUserId'] = this.accountUserId.activitiesAccount;
                    }
                })
                .catch((error) => {
                    // this.$Message.error( this.$t(error) );
                })
            },
            //获取运营账户审核列表
            getToExamineData (){
                //划转审核
                let request = finance.operationOperation.approveList;

                request.data = {
                    limit : this.pageSize,
                    page  : this.currPage,
                    operationType : this.transferType,
                    accountType : this.targetAccount
                };
                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.toExamine  = res.data.pageUtils.list;
                        this.totalCount = res.data.pageUtils.totalCount;

                        this.accountMap = res.data.accountMap;
                    }
                })
                .catch((error) => {
                    // this.$Message.error( this.$t(error) );
                })
            },
            //获取运营历史列表
            getHistoryData (){
                //获取列表
                let request = finance.operationOperation.accountsHistory;

                //设置POST请求数据
                request.data = {
                    "page"          : this.historyCurrPage,
                    "limit"         : this.historyPageSize,
                    "startDate"     : this.startDate,
                    "endDate"       : this.endDate,
                    "currency"      : this.currencyName.join(),
                    "accountType"   : this.transferAccount,
                    "operationType" : this.historyTransferType
                };
                //获取历史记录列表
                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.historyList        = res.data.res.list;
                        this.historyTotalCount  = res.data.res.totalCount;

                        this.accountMap         = res.data.accountMap;
                    }
                    else{
                        // this.$Message.error(res.message);
                    }
                })
            },
            //获取币种
            getCurrency () {
                //获取币种
                let currencyList = finance.operationOperation.currencyList;

                //获取历史记录列表
                this.$axios(currencyList).then((res)=>{
                    if(res.success){
                        let data = res.data;
                        this.currencyList = data;
                    }
                    else{
                        // this.$Message.error(res.message);
                    }
                })
            },
            page (num){
                //审核列表分页
                this.currPage = num;
                this.getToExamineData();
            },
            historyPage (num){
                //审核列表分页
                this.historyCurrPage = num;
                this.getHistoryData();
            },
            //设置用户收付款
            setAccount (){
                let request;
                if (this.operationType === 0) {
                    request = finance.operationOperation.reduceAccounts;
                } else {
                    request = finance.operationOperation.increaseAccounts;
                }
                //设置GET请求数据
                request.params = { 'captcha' : this.formItem.captcha };

                //设置POST请求数据
                this.datas['amount']        = this.formItem.amount;
                this.datas['comment']       = this.formItem.comment;
                this.datas['currency']      = this.currencys.toLowerCase();
                this.datas['operationType'] = this.operationType;

                request.data = this.datas;

                //设置收付款
                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.modal = false;
                        this.$Message.success(res.message);
                        this.getData();
                    }
                })
                .catch((error) => {
                    // this.$Message.error( this.$t(error) );
                    this.modal = false;
                })
            },
            //运营审核
            setToExamine (){
                let request    = finance.operationOperation.approve;

                //设置POST请求数据
                request.data = {
                    googleCode     : this.formItemToExamine.captcha,
                    id             : this.id,
                    approvePerson  : this.approvePerson,
                    transferStatus : this.toExamineRadio
                };

                //设置审核
                this.$axios(request).then((res)=>{
                    if(res.success){
                        this.auditing = false;
                        this.$Message.success(res.message);
                        this.getToExamineData();
                    }
                })
                .catch((error,a) => {
                    // this.$Message.error( this.$t(error) );
                    this.auditing = false;
                })
            },
            //审核筛选划拨类型
            transferEvent () {
                this.currPage = 1;
                this.getToExamineData();
            },
            accountEvent () {
                this.currPage = 1;
                this.getToExamineData();
            },
            //搜索时间
            dateEvent (date) {
                this.startDate = date[0];
                this.endDate   = date[1];
            },
            //历史查询
            getHistoryQuery () {
                this.historyCurrPage = 1;
                this.getHistoryData();
            },
            //用户搜索条件
            userTypeEvent ( value ){
                this.userType = value;
            },
            cancel(name){
                this.modal = false;
                this.auditing = false;
                this.generalAccount = false;
                this.$refs[name].resetFields();
            }
        },
        created (){
            if ( this.$store.state.user.checkPerm('pro:fince:operation:accountsList') ) {
                //获取划拨账户信息列表
                this.getData();
            }
        },
        watch: {
            generalAccount (val) {
                if ( !val ) {
                    this.initForm()
                }
            },
            modal (val) {
                if ( !val ) {
                    this.formItem = {}
                    this.$refs['formItem'].resetFields();
                    this.dataRadio = 'activitiesAccount'
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
</style>
<style scoped>
    .l-single{
        float: right;
    }
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
    .m-search{
        width: 260px;
        height: 32px;
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
        /* overflow: hidden; */
        /* padding: 10px 0; */
    }
    .l-form .ivu-form-item-content label{
        padding-top: 0;
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
    .l-content .m-export{
        float: right;
        margin-top: 9px;
    }
    .l-content .l-filter{
        border-radius: 4px;
        border: 1px solid #E6EAEE;
        background: #fff;
        margin-bottom: 20px;
        padding: 0 0 30px 30px;
        /* overflow: hidden; */
    }
    .l-content .l-filter .l-search{
        height: auto;
        /* overflow: hidden; */
        margin-bottom: 0;
    }
    .l-content .l-filter h2{
        font-size: 16px;
        font-weight: normal;
        color: #354052;
        line-height: 50px;
        margin-top: 5px;
    }
    .l-content .l-filter .l-select{
        width: 100px;
        float: left;
        margin-right: 10px;
    }
    .l-content .l-filter .l-screen{
        width: 200px;
        float: left;
        margin-right: 10px;
    }
    .l-content .l-filter .l-date-picker{
        width: 300px;
        float: left;
        margin-right: 10px;
    }
    .l-form .l-radio label{
        text-align: left;
        width: auto;
    }
    .mb-20{
        margin-bottom: 20px;
    }
    .fix:after{
        content:'';
        display:block;
        height:0;
        clear:both;
        visibility:hidden;
        overflow:hidden;
    }
    .fix{display:block;}
</style>
