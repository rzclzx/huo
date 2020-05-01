/**
 * 接口配置
 * data: put和post
 */
 // 菜单管理
export const menu = {
    // 获取菜单
    getMenus: { method: 'get', url: '/static/menu.json', data: {} }
}
export const login = {
    login: { method: 'post', url: '/v1/sys/login'},
    logout: { method: 'get', url: '/v1/sys/logout'},
    init: { method: 'post', url: '/v1/sys/user/password'},
    loginInit: { method: 'post', url: '/v1/sys/user/password/init'},
    bindGa: { method: 'get', url: '/v1/sys/toBinding'},
    checkGa: { method: 'post', url: '/v1/sys/checkBinding'}
}
// 交易所管理
export const exchange = {
    // 查询交易对状态信息
    getStatusCount: { system: 'mgt', method: 'get', url: '/v1/pro/settings/symbol/statusCount' },
    // 查询币种状态信息
    getCurrencyCount: { system: 'mgt', method: 'get', url: '/v1/pro/settings/currency/statusCount' },
    // 查询币种列表
    getCurrencyList: { system: 'mgt', method: 'get', url: '/v1/pro/settings/currency/list/{page}/{limit}' },
    // 查询币种信息
    getCurrencyInfo: { system: 'mgt', method: 'get', url: '/v1/pro/settings/currency/updateSimple/{id}', path: {} },
    // 添加币种
    addCurrency: { system: 'mgt', method: 'post', url: '/v1/pro/settings/currency/updateSimple', data: {} },
    // 查询交易对列表
    getSymbolList: { system: 'mgt', method: 'get', url: '/v1/pro/settings/symbol/list/{page}/{limit}' },
    // 添加交易对
    addSymbol: { system: 'mgt', method: 'post', url: '/v1/pro/settings/symbol/updateSimple', data: {} },
    // 查询交易对信息
    getSymbolInfo: { system: 'mgt', method: 'get', url: '/v1/pro/settings/symbol/updateSimple/{id}' },
    // 查询交易对名称
    getSymbolName: { system: 'mgt', method: 'get', url: '/v1/pro/settings/symbols/symbolName' },
    // 查询币种介绍
    getCurrencyDesc: { system: 'mgt', method: 'get', url: '/v1/pro/currency/introduction/select/list/{currency}/{langType}' },
    // 添加币种介绍
    addCurrencyDesc: { system: 'mgt', method: 'post', url: '/v1/pro/currency/introduction/select/save' },
    // 修改币种介绍
    updateCurrencyDesc: { system: 'mgt', method: 'post', url: '/v1/pro/currency/introduction/select/update' },
    // 查询交易规则
    getRule: { system: 'mgt', method: 'get', url: '/v1/pro/operate/tradeRule/list/{symbol}' },
    // 添加交易对规则
    addRule: { system: 'mgt', method: 'post', url: '/v1/pro/operate/tradeRule/update' },
    // 获取pro币种
    getProCoinList: { system: 'mgt', method: 'get', url: '/v1/pro/currency/name/list' },
    // 获取币种个数信息
    getProCoinMsg: { system: 'mgt', method: 'get', url: '/v1/pro/currency/name/statusCount' },
    // 修改币种名称
    SetProCoin: { system: 'mgt', method: 'post', url: '/v1/pro/currency/name/edit' },
    // 开启关闭币种
    controlProCoin: { system: 'mgt', method: 'post', url: '/v1/pro/currency/name/visible' }
}
//充提管理
export const recharge = {
    getCurrencyList: {method: 'get', url: '/v1/pro/settings/currency/list', data: {}},
    getFirstTrialList: {method: 'post', url: '/v1/withdraw/fCheck/list', data: {}},
    firstTrialPass: {method: 'post', url: '/v1/withdraw/fCheck/pass'},
    firstTrialRefuse: {method: 'post', url: '/v1/withdraw/fCheck/refuse'},
    firstTrialSubmit: {method: 'post', url: '/v1/withdraw/fCheck/submit'},
    getReviewTrialList: {method: 'post', url: '/v1/withdraw/rCheck/list'},
    reviewTrialPass: {method: 'post', url: '/v1/withdraw/rCheck/pass'},
    reviewTrialRefuse: {method: 'post', url: '/v1/withdraw/rCheck/refuse'},
    reviewTrialSubmit: {method: 'post', url: '/v1/withdraw/rCheck/submit'},
    getSearchTrialList: {method: 'post', url: '/v1/withdraw/list'},
    getStatusList: {method: 'get', url: '/v1/withdraw/status'},

    repealed: {method: 'post', url: '/v1/legal/withdrawls/repealed', data: {}},
    refuseAdd: {method: 'post', url: '/v1/withdraw/refuse/add', data: {}},
    refuseDel: {method: 'post', url: '/v1/withdraw/refuse/del', params:{}},
    refuseEdit: {method: 'post', url: '/v1/withdraw/refuse/edit', data: {}},
    refuseList: {method: 'post', url: '/v1/withdraw/refuse/list', data: {}},
    currencyList: {method: 'get', url: '/v1/withdraw/currency'},
    depositList: {method: 'post', url: '/v1/deposit/list'},
    getCurrency: {method: 'get', url: '/v1/deposit/currency'},
    getAllCurrency: {method: 'get', url: '/v1/fince/report/currency'}
}
// 系统管理
export const sys = {
    dept: {
        deptList: {method: 'post', url: '/v1/sys/dept/list'},
        deptSave: {method: 'post', url: '/v1/sys/dept/save'},
        deptDelete: {method: 'get', url: '/v1/sys/dept/delete'},
        deptInfo: {method: 'get', url: '/v1/sys/dept/info'},
        deptUpdate: {method: 'post', url: '/v1/sys/dept/update'},
    },
    user: {
        userList: {method: 'post', url: '/v1/sys/user/list'},
        userSave: {method: 'post', url: '/v1/sys/user/save'},
        userDelete: {method: 'get', url: '/v1/sys/user/delete'},
        userInfo: {method: 'get', url: '/v1/sys/user/info'},
        userUpdate: {method: 'post', url: '/v1/sys/user/update'},
        resetPwd: {method: 'post', url: '/v1/sys/user/resetPwd'},
        // 为了权限功能分出角色查询
        roleSelect: {method: 'get', url: '/v1/sys/user/select/role'},
        deptList: {method: 'post', url: '/v1/sys/user/list/dept'},
    },
    role: {
        roleList: {method: 'post', url: '/v1/sys/role/list'},
        roleSelect: {method: 'get', url: '/v1/sys/role/select'},
        roleSave: {method: 'post', url: '/v1/sys/role/save'},
        roleDelete: {method: 'get', url: '/v1/sys/role/delete'},
        roleInfo: {method: 'get', url: '/v1/sys/role/info'},
        roleUpdate: {method: 'post', url: '/v1/sys/role/update'},
        // 划分权限  查询菜单
        menuList: {method: 'post', url: '/v1/sys/role/list/menu'},
        // 划分权限  查询部门
        deptList: {method: 'post', url: '/v1/sys/role/list/dept'},
    },
    menu: {
        // 查询查单
        menuList: {method: 'post', url: '/v1/sys/menu/list'},
        // 添加菜单
        addMenu: {method: 'post', url: '/v1/sys/menu/save'},
        // 修改菜单
        updateMenu: {method: 'post', url: '/v1/sys/menu/update'},
        // 删除菜单
        deleteMenu: {method: 'get', url: '/v1/sys/menu/delete'},
        // 权限列表
        menuUser: {method: 'get', url: '/v1/sys/menu/user'},
    },
    schedule: {
        // 定时任务列表
        getList: { method: 'post', url: '/v1/sys/schedule/list', data:{} },
        // 暂停定时任务
        pause: { method: 'post', url: '/v1/sys/schedule/pause'},
        // 恢复定时任务
        resume: { method: 'post', url: '/v1/sys/schedule/resume'},
        // 删除定时任务
        delete: { method: 'post', url: '/v1/sys/schedule/delete'},
        // 立即执行定时任务
        run: { method: 'post', url: '/v1/sys/schedule/run' },
        // 新增定时任务
        add: { method: 'post', url: '/v1/sys/schedule/save', data:{} },
        // 修改定时任务
        update: { method: 'post', url: '/v1/sys/schedule/update', data:{} },
        // 定时任务信息
        info: { method: 'post', url: '/v1/sys/schedule/info/{jobId}'},
        // 定时任务日志
        timeTaskLog: { method: 'post', url: '/v1/sys/scheduleLog/list', data:{} }
    },
    // 系统日志
    systemLog: { method: 'post', url: '/v1/sys/log/list', data:{} },
    // 参数管理
    sysConfig: {
        // 参数列表
        configList: { method: 'post', url: '/v1/sys/config/list', data:{} },
        // 新增参数
        addConfig: { method: 'post', url: '/v1/sys/config/save', data:{} },
        // 修改参数
        updateConfig: { method: 'post', url: '/v1/sys/config/update', data:{} },
        // 删除参数
        deleteConfig: { method: 'post', url: '/v1/sys/config/delete', data:{} }
    },
    file: {
        // 查询文件列表
        getList: {method: 'post', url: '/v1/sys/oss/list'},
        // 上传文件
        upload: {method: 'post', url: '/v1/sys/oss/upload'},
        // 删除文件
        delete: {method: 'post', url: '/v1/sys/oss/delete'},
        // 保存配置文件
        saveConfig: {method: 'post', url: '/v1/sys/oss/saveConfig'},
        // 查询配置文件
        getConfig: {method: 'get', url: '/v1/sys/oss/config'},
    }
}
//财务管理
export const finance = {
    accountDetails: {
        accountsDetailList: {method: 'get', url: '/v1/pro/fince/system/accounts/detail'},
    },
    operationOperation: {
        //划拨账户信息列表
        accountsList: {method: 'get', url: '/v1/pro/fince/operation/accountsList'},
        getTransferUser: {method: 'get', url: '/v1/pro/fince/operation/getTransferUser'},
        approveList: {method: 'post', url: '/v1/pro/fince/operation/approveList'},
        accountsHistory: {method: 'post', url: '/v1/pro/fince/operation/accountsHistory'},
        transferToUser: {method: 'post', url: '/v1/pro/fince/operation/transferToUser'},
        increaseAccounts: {method: 'post', url: '/v1/pro/fince/operation/increaseAccounts'},
        reduceAccounts: {method: 'post', url: '/v1/pro/fince/operation/reduceAccounts'},
        approve: {method: 'post', url: '/v1/pro/fince/operation/approve'},
        currencyList: {method: 'get', url: '/v1/pro/settings/currencyName/list'},
        //减
        reduceToUser: {method: 'post', url: '/v1/pro/fince/operation/reduceToUser'},
        //增
        increaseToUser: {method: 'post', url: '/v1/pro/fince/operation/increaseToUser'},
        accountsHistoryExp: {method: 'get', url: '/v1/pro/fince/operation/accountsHistoryExp'}


    },
    taxDeclaration: {
        getTaxMsg: {method: 'get', url: '/v1/fince/report/tax'},
        exportTax: {method: 'get', url: '/v1/fince/report/taxExp'}
    },
    transfer: {
        operationList: {method: 'get', url: '/v1/pro/fince/system/operation/list'},
        increaseAccounts: {method: 'post', url: '/v1/pro/fince/system/operation/increaseAccounts'},
        reduceAccounts: {method: 'post', url: '/v1/pro/fince/system/operation/reduceAccounts'},
        historyList: {method: 'post', url: '/v1/pro/fince/system/operation/historyList'},
        historyListExp: {method: 'get', url: '/v1/pro/fince/system/operation/historyListExp'},
    },
    withCapital: {
        assetsList: {method: 'get', url: '/v1/pro/fince/system/assets/list'},
        //资产配减资
        assetsIncrease: {method: 'post', url: '/v1/pro/fince/system/assets/increase'},
        assetsReduce: {method: 'post', url: '/v1/pro/fince/system/assets/reduce'},
        //配资历史记录
        historyList: {method: 'post', url: '/v1/pro/fince/system/assets/historyList'},
        historyListExp: {method: 'get', url: '/v1/pro/fince/system/assets/historyListExp'},
    },
    walletAsset: {method: 'get', url: '/v1/wallet/assets/amount'},
    // 财务报表
    statements: {
        list: {method: 'get', url: '/v1/fince/report/list'},
        detail: {method: 'get', url: '/v1/fince/report/detail'}
    }
}

// 风控管理
export const limit = {
    common: {
        commonList: {method: 'get', url: '/v1/risk/management/list'},
        commonUpdate: {method: 'post', url: '/v1/risk/management/update'},
    },
    special: {
        specialList: {method: 'get', url: '/v1/risk/specialUsers/list'},
        specialInfo: {method: 'get', url: '/v1/risk/specialUsers/info'},
        specialUpdate: {method: 'post', url: '/v1/risk/specialUsers/update'}
    },
    black: {
        blackList: {method: 'post', url: '/v1/black/management/get/blacklist'},
        freezeBlack: {method: 'post', url: '/v1/black/management/update/freezeBlack'},
        thawBlack: {method: 'post', url: '/v1/black/management/update/thawBlack'},
        blackInfo: {method: 'post', url: '/v1/black/management/get/userBlackInfo'},
        // 批量操作-保存-确定
        batchComfirm: {method: 'post', url: '/v1/black/management/save'}
    }
}
// 系统统计
export const statistics = {
    // 查询报表列表
    // getProBaseList: { method: 'post', url: '/bistatis/statistics/base', data:{} },
    // getProMoreList: { method: 'post', url: '/bistatis/statistics/detail', data:{} },
    // getTransNumList: { method: 'post', url: '/bistatis/statistics/number', data:{} },
    // getTransChargeList: { method: 'post', url: '/bistatis/statistics/fee', data:{} },
    // getTransformList: { method: 'post', url: '/bistatis/statistics/conversion', data:{} },
    // getRegisterList: { method: 'post', url: '/bistatis/statistics/registerList', data:{} }
    getProBaseList: { method: 'post', url: '/v1/statistics/base', data:{} },
    getProMoreList: { method: 'post', url: '/v1/statistics/detail', data:{} },
    getTransNumList: { method: 'post', url: '/v1/statistics/number', data:{} },
    getTransChargeList: { method: 'post', url: '/v1/statistics/fee', data:{} },
    getTransformList: { method: 'post', url: '/v1/statistics/conversion', data:{} },
    getRegisterList: { method: 'post', url: '/v1/statistics/registerList', data:{} },
    getTradeInfoList: { method: 'post', url: '/v1/statistics/tradeInfoList', data:{} },
    getDataList: { method: 'post', url: '/v1/statistics/propertyByDate', data:{} },
    getDetailList: { method: 'post', url: '/v1/statistics/propertyDetail', data:{} },
    IncomeDetailList: { method: 'post', url: '/v1/statistics/propertyIncomeDetail', data:{} },
    getDepositWithDraw: { method: 'post', url: '/v1/statistics/depositWithdrawList', data:{} },

    // 资产日报-日期统计-导出
    dateCountExp: { method: 'get', url: '/v1/statistics/propertyByDate/exp', data:{} },
    // 资产日报-币种统计-导出
    currencyExp: { method: 'get', url: '/v1/statistics/propertyCurrency/exp', data:{} },
    // 资产日报-收入统计-导出
    incomeCountExp: { method: 'get', url: '/v1/statistics/propertyIncomeList/exp', data:{} },
}

//运营管理
export const operation = {
    //内容管理-banner
    getBannerList: {method: 'get', url: '/v1/content/advertisement/list'},
    getLangList: {method: 'get', url: '/v1/content/advertisement/lang/list'},
    getContentById: {method: 'get', url: '/v1/content/advertisement/get'},
    delContentById: {method: 'get', url: '/v1/content/advertisement/delById'},
    addBanner: {method: 'post', url: '/v1/content/advertisement/add'},
    editBanner: {method: 'post', url: '/v1/content/advertisement/update'},
    upload: {method: 'post', url: '/v1/content/advertisement/upload'},
    // 根据type 查询banner
    getBannerByType: {method: 'get', url: '/v1/content/advertisement/listByType'},

    //内容管理-下载管理
    getDownloadList: {method: 'get', url: '/v1/content/download/list'},
    getDownloadLangList: {method: 'get', url: '/v1/content/download/lang/list'},
    getDownloadById: {method: 'get', url: '/v1/content/download/get'},
    delDownloadById: {method: 'get', url: '/v1/content/download/delById'},
    addDownload: {method: 'post', url: '/v1/content/download/add'},
    editDownload: {method: 'post', url: '/v1/content/download/update'},

    //费率设置
    feesList: {method: 'get', url: '/v1/pro/operate/tradeFee/feesList'},
    changeFees: {method: 'post', url: '/v1/pro/operate/tradeFee/changeFees'},
    groupList: {method: 'get', url: '/v1/pro/operate/tradeFee/groupList'},
    symbolName: {method: 'get', url: '/v1/pro/settings/symbols/symbolName'},
    groupAdd: {method: 'post', url: '/v1/pro/operate/tradeFee/groupAdd'},
    groupDel: {method: 'get', url: '/v1/pro/operate/tradeFee/groupDel'},
    feeList: {method: 'get', url: '/v1/dawn/operate/withdrawFees/feesList'},
    changeFee: {method: 'post', url: '/v1/dawn/operate/withdrawFees/changeFees'},
    groupListExp: {method: 'get', url: '/v1/pro/operate/tradeFee/groupListExp'},
    // 特殊费率分组下载csv
    downCSV: {method: 'get', url: '/v1/pro/operate/tradeFee/fileExpByGroupId'},
    // 取消上传
    cancelUpload: {method: 'get', url: '/v1/pro/operate/tradeFee/cancelUpload'},
    // 导出失败文件
    expFile: {method: 'get', url: '/v1/pro/operate/tradeFee/fileExp'},


    //运营批量转账
    activityList: {method: 'get', url: '/v1/dawn/operate/activity/list'},
    // 运营批量-待审核
    approveList: {method: 'get', url: '/v1/dawn/operate/activity/approve/list'},
    activityDetail: {method: 'get', url: '/v1/dawn/operate/activity/detail'},
    // 待审核详情
    approveDetail: {method: 'get', url: '/v1/dawn/operate/activity/approve/detail'},
    approve: {method: 'post', url: '/v1/dawn/operate/activity/approve'},
    currencyList: {method: 'get', url: '/v1/pro/settings/currencyName/list'},
    activityAdd: {method: 'post', url: '/v1/dawn/operate/activity/add', headers: {'Content-Type': 'multipart/form-data'}},

    //公告管理
    getNoticeList: {method: 'get', url: '/v1/pro/content/notice/list'},
    getNoticeLangList: {method: 'get', url: '/v1/content/advertisement/lang/list'},
    getNoticeById: {method: 'get', url: '/v1/pro/content/notice/{id}'},
    delNoticeById: {method: 'get', url: '/v1/pro/content/notice/del'},
    addNotice: {method: 'post', url: '/v1/pro/content/notice/add'},
    editNotice: {method: 'post', url: '/v1/pro/content/notice/update'},
    setNoticeTop: {method: 'get', url: '/v1/pro/content/notice/setTop'},

    // 版本管理
    getVersionList: { method: 'post', url: '/v1/oper/hbterminalversion/list' },
    addVersion: { method: 'post', url: '/v1/oper/hbterminalversion/insert' },
    deleteVersion: { method: 'post', url: '/v1/oper/hbterminalversion/delete' },
    updateVersion: { method: 'post', url: '/v1/oper/hbterminalversion/update' },
    closeVersion: { method: 'post', url: '/v1/oper/hbterminalversion/offline' },
    getVersionMsg: { method: 'get', url: '/v1/oper/hbterminalversion/info/{id}' },
    // 海报管理
    posterAdd: { method: 'post', url: '/v1/content/poster/add' },
    posterDelete: { method: 'delete', url: '/v1/content/poster/delById' },
    posterGet: { method: 'get', url: '/v1/content/poster/get' },
    posterList: { method: 'get', url: '/v1/content/poster/list' },
    posterUpdate: { method: 'post', url: '/v1/content/poster/update' },
    posterUpload: { method: 'post', url: '/v1/content/poster/upload' },
};

// 用户管理
export const user = {
    remarkTypeAdd: {method: 'post', url: '/v1/user/remark/type/add'},
    remarkTypeList: {method: 'get', url: '/v1/user/remark/type'},
    remarkTypeDelete: {method: 'get', url: '/v1/user/remark/type/del'},
    assetList: {method: 'get', url: '/v1/user/asset/list'},
    search: {method: 'post', url: '/v1/user/query/general'},
    finance: {method: 'post', url: '/v1/user/finance/list'},
    entrust: {method: 'post', url: '/v1/user/entrust/trade/list'},
    trade: {method: 'post', url: '/v1/user/deal/deal/list'},
    accountauth: {method: 'get', url: '/v1/user/account/auth'},
    accountbasic: {method: 'post', url: '/v1/user/account/basic'},
    userremarkList: {method: 'get', url: '/v1/user/remark'},
    userremarkAdd: {method: 'post', url: '/v1/user/remark/add'},
    userremarkDel: {method: 'get', url: '/v1/user/remark/del'},
    userremarkShow: {method: 'post', url: '/v1/user/remark/show'},
    safetyAuth: {method: 'get', url: '/v1/user/safety/auth'},
    safetyLogin: {method: 'get', url: '/v1/user/safety/log/login'},
    safetyOperation: {method: 'get', url: '/v1/user/safety/log/operation'},
    safetySafety: {method: 'get', url: '/v1/user/safety/safety'},
    refuseReasonList: {method: 'get', url: 'v1/auth/refuse/list'},
    delRefuseReason: {method: 'post', url: 'v1/auth/refuse/del'},
    addRefuseReason: {method: 'post', url: 'v1/auth/refuse/add'},
    updataRefuseReason: {method: 'post', url: 'v1/auth/refuse/edit'},
    whiteList: {method: 'get', url: 'v1/auth/white/list'},
    removeWhite: {method: 'post', url: 'v1/auth/white/revoke'},
    passWhite: {method: 'post', url: 'v1/auth/white/pass'},
    auditList: {method: 'get', url: 'v1/audit/list'},
    auditInfo: {method: 'get', url: 'v1/audit/info/{auditId}'},
    audit:  {method: 'post', url: 'v1/audit/'},
    // 账号信息-认证信息-解除
    unbind: {method: 'get', url: 'v1/audit/unbind'},
    // 谷歌验证码
    gaCheck: {method: 'get', url: 'v1/user/safety/checkGaCode'},
    // 换绑ga
    rebindGa: {method: 'get', url: 'v1/user/safety/rebindGa'},
    // 换绑手机
    rebindPh: {method: 'get', url: 'v1/user/safety/rebindPhone'},
    // 注销邮箱
    resetEmail: {method: 'post', url: 'v1/user/account/closeAccount'},
    userSite: {method: 'get', url: 'v1/user/safety/userSite'},
    resetUserSite:  {method: 'post', url: 'v1/user/safety/resetUserSite/{uid}'}
}

// 法币管理
export const legalTender = {
    // 自动充值查询
    charge: {method: 'post', url: 'v1/legal/recharge/list'},
    // 提现初审列表
    getFirstList: {method: 'post', url: 'v1/legal/withdrawls/list'},
    // 复审列表
    getSList: {method: 'post', url: 'v1/legal/withdrawls/list'},
    // 提现查询列表
    getList: {method: 'post', url: 'v1/legal/withdrawls/list'},
    // 初审
    fCheck: {method: 'post', url: 'v1/legal/withdrawls/fCheck'},
    // 复审
    sCheck: {method: 'post', url: 'v1/legal/withdrawls/sCheck'},
    // 付款银行列表
    getPayBankList: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/infoNameAndCode'},

    chargeManage: {
        // 获取银行卡号信息
        getBankInfo: {method: 'get', url: 'v1/manuallegal/hbdepositapply/accounts'},
        // 新增申请单
        addApply: {method: 'post', url: 'v1/manuallegal/hbdepositapply/save'},
        // 充值单列表
        applyList: {method: 'post', url: 'v1/manuallegal/hbdepositapply/list'},
        // 提交匹配信息
        infoMatch: {method: 'post', url: 'v1/manuallegal/hbdepositapply/match'},
        // 查询匹配信息
        getInfoMatch: {method: 'get', url: 'v1/manuallegal/hbdepositapply/match/list/{depositid}/{bankflowid}'},
        // 恢复充值单清单
        undoApply: {method: 'get', url: 'v1/manuallegal/hbdepositapply/undo/{id}'},
        // 取消充值申请单
        cancelApply: {method: 'get', url: 'v1/manuallegal/hbdepositapply/cancel/{id}'},
        // 获取申请单详情
        getInfo: {method: 'get', url: 'v1/manuallegal/hbdepositapply/info/{id}'},
        // 根据uid 查询添加申请单的信息
        getUidInfo: {method: 'get', url: 'v1/manuallegal/hbdepositapply/query/{uid}'}
    },
    bankFlow: {
        // 银行流水列表
        flowList: {method: 'post', url: 'v1/manuallegal/hbdepositbankflow/list'},
        // 更多信息
        moreInfo: {method: 'get', url: 'v1/manuallegal/hbdepositbankflow/more/{id}'},
        // 修改流水状态
        updateStatus: {method: 'post', url: 'v1/manuallegal/hbdepositbankflow/updateState'},
        //

    },
    applyReview: {
        // 复审列表
        reviewList: {method: 'post', url: 'v1/manuallegal/hbdepositapplyreview/list'},
        // 详情
        info: {method: 'get', url: 'v1/manuallegal/hbdepositapplyreview/info/{id}'},
        // 通过
        pass: {method: 'get', url: 'v1/manuallegal/hbdepositapplyreview/accept/{id}'},
        // 拒绝
        refuse: {method: 'get', url: 'v1/manuallegal/hbdepositapplyreview/reject/{id}'},
    },
    uploadFlow: {
        // 银行列表
        bankList: {method: 'get', url: 'v1/manuallegal/hbuploadbankflow/bankAccountList'},
        // 导出excel
        except: {method: 'post', url: 'v1/manuallegal/hbuploadbankflow/execl'},
        // 查询
        list: {method: 'post', url: 'v1/manuallegal/hbuploadbankflow/query'},
        // 操作记录
        record: {method: 'post', url: 'v1/manuallegal/hbuploadbankflow/record'},
        // 保存
        save: {method: 'post', url: 'v1/manuallegal/hbuploadbankflow/save'},
        // 上传图片
        uploadImg: {method: 'post', url: 'v1/manuallegal/hbuploadbankflow/uploadImage'},
        // 上传流水单
        uploadFlow: {method: 'post', url: 'v1/manuallegal/hbdepositbankflow/uploadBankFile'},
    },


    // 提现额度设置=>用户额度触发
    userLimitList: {method: 'get', url: 'v1/legal/withdrawlegalsetting/list'},
    userLimitUpdate: {method: 'post', url: 'v1/legal/withdrawlegalsetting/update'},

    // 额度组用户
    limitSetList: {method: 'post', url: 'v1/legal/withdrawlegalgroupuser/list'},
    limitSetDelete: {method: 'post', url: 'v1/legal/withdrawlegalgroupuser/delete'},
    // userLimitUpdate: {method: 'post', url: 'v1/legal/withdrawlegalsetting/update'},


    // 提现额度组
    addUser: {method: 'post', url: 'v1/legal/withdrawlegalgroup/addUser'},
    batchUpload: {method: 'post', url: 'v1/legal/withdrawlegalgroup/batchUpload'},
    cancelUpload: {method: 'post', url: 'v1/legal/withdrawlegalgroup/cancelUpload'},
    checkuid: {method: 'post', url: 'v1/legal/withdrawlegalgroup/checkuid'},

    exportFailureUid: {method: 'post', url: 'v1/legal/withdrawlegalgroup/exportFailureUid'},
    groupsave: {method: 'post', url: 'v1/legal/withdrawlegalgroup/save'},
    groupupdate: {method: 'post', url: 'v1/legal/withdrawlegalgroup/update'},

    grouplist: {method: 'get', url: 'v1/legal/withdrawlegalgroup/list'},
    groupcount: {method: 'get', url: 'v1/legal/withdrawlegalgroup/queryGroupCount'},
    groupDelete: {method: 'post', url: 'v1/legal/withdrawlegalgroup/delete'},


    // 收款管理 银行帐号
    // POST /manuallegal/hbreceiptaccount/accountName
    bankDelete: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/delete'},
    bankUrl: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/getUrl'},
    bankInfo: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/info'},
    accountName: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/accountName'},
    bankList: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/list'},
    bankSave: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/save'},
    bankUpdate: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/update'},
    bankUpdateUseStatus: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/updateUseStatus'},
    // POST /manuallegal/hbreceiptaccount/accountName

    // 大客户


    bigAdd: {method: 'post', url: 'v1/manuallegal/hbvipcustomer/add'},
    bigAddcsv: {method: 'post', url: 'v1/manuallegal/hbvipcustomer/addcsv'},
    bigClose: {method: 'post', url: 'v1/manuallegal/hbvipcustomer/close'},
    bigComfirmAdd: {method: 'post', url: 'v1/manuallegal/hbvipcustomer/confirmAdd'},
    bigDel: {method: 'post', url: 'v1/manuallegal/hbvipcustomer/del/'},
    bigExcel: {method: 'post', url: 'v1/manuallegal/hbvipcustomer/execl'},
                                    //    /manuallegal/hbvipcustomer/execl
    bigList: {method: 'post', url: 'v1/manuallegal/hbvipcustomer/list'},
    bigOpen: {method: 'post', url: 'v1/manuallegal/hbvipcustomer/open'},

    // pro交易对
    proList: {method: 'post', url: 'v1/job/hbprosymbols/list'},
    proUpdate: {method: 'post', url: 'v1/job/hbprosymbols/update'},
    currencyList: {method: 'get', url: 'v1/job/hbprosymbols/quoteCurrencyList'},
    //获取hadax列表
    getHadaxList: { method: 'post', url: 'v1/job/hbhadaxsymbols/list' },
    //获取hadax计价货币列表
    getHadaxCurrencyList: { method: 'get', url: 'v1/job/hbhadaxsymbols/quoteCurrencyList' },
    //hadax开启
    updateHadax: { method: 'post', url: 'v1/job/hbhadaxsymbols/update' }


    // POST /legal/withdrawlegalgroupuser/lis
    // 收款管理=>银行
    // bankList: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/list'1},
    // 收款管理=>银行
    // bankList: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/list'},
    // 收款管理=>银行
    // bankList: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/list'},
    // 收款管理=>银行
    // bankList: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/list'},
    // 收款管理=>银行
    // bankList: {method: 'post', url: 'v1/manuallegal/hbreceiptaccount/list'},

}
