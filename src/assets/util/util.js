import crypto from 'crypto';
let util = {

};
util.title = function (title) {
    title = title || 'iView admin';
    window.document.title = title;
};

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    //TODO 这里临时都返回
    itAccess = itAccess? itAccess.split(',') : [];
    currentAccess = currentAccess?currentAccess.split(','):[];
    return itAccess.filter((item)=>{
        return currentAccess.indexOf(item)>-1;
    }).length > 0;
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: vm.$t('首页'),
                path: '/',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        currentPathArr = [
            {
                title: vm.$t('首页'),
                path: '',
                name: 'home_index'
            }
        ];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: vm.$t('首页'),
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: vm.$t('首页'),
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: vm.$t('首页'),
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: '',
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

// 菜单数据处理
util.toMenuData = function (data) {
    let parentArr = data.filter((item) => {return item.parentId === 0})
    let menuArr = data.filter((item) => {return item.type === 1})
    let btnArr = data.filter((item) => {return item.type === 2})
    parentArr.map((item) => {
        item.children = []
        menuArr.map((menu) => {
            menu.children = []
            btnArr.map((btn) => {
                if ( btn.menuId === menu.parentId ) {
                    menu.children.push(btn)
                }
                return btn
            })
            if ( item.menuId === menu.parentId ) {
                 item.children.push(menu)
            }
            return menu
        })
        return item
    })
    return parentArr
}

export const dateFormat = function (dateString) {
    return ''
}

// 判断小数点位数是否正确
util.floatCount = function (val, len) {
    if ( val.toString().indexOf('.') > -1 ) {
        let str = val.toString().split('.')[1]
        str = parseInt(str) === 0 ? '0' : str
        if ( str.length <= len ) return true
        else return false
    }
    return true
}


util.checkPerm =(perm) =>{
    const userData = localStorage.getItem('userData');
    let permsList = [];
    if(userData && userData !== null && userData !== 'null'){
        permsList = JSON.parse(userData).permissions;
    }
    if(!perm){
        return true
    }else if(!(perm instanceof Array)){
        perm = perm.split(',')
    }

    return perm.filter((item)=>{
        return permsList.indexOf(item)>-1;
    }).length > 0;
};

util.md5=(content)=> {
    let md5 = crypto.createHash('sha256');
    return md5.update('YzcmCZNvbXocrsz9dm8e' + content).digest('hex')
};

// 验证uid格式
util.uidValidate = (value) => {
    if ( /^\d+$/.test(value) ) {
        return true
    }
    return false
}
util.download = function(href) {
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.setAttribute('target', '_blank');
    a.click();
}
export default util;
