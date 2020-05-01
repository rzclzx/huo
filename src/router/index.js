import Vue from 'vue';
import iView from 'iview';
import { Modal} from 'iview';
import Util from '../assets/util/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routers, otherRouter, appRouter} from './router';
import {refresh} from "../assets/util/axios";
import { getText } from '__util/i18n-setup'

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    // 切换页面时全局关闭弹出框
    Modal.remove()

    iView.LoadingBar.start();
    Util.title(router.app.$t(to.meta.title));
    if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        const userData = localStorage.getItem('userData');
        if (!Cookies.get('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'login'
            });
        } else if (Cookies.get('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
            Util.title();
            next({
                name: '用户查询'
            });
        } else if(['error-403','error-404', 'error-500', 'login'].indexOf(to.name)<0 && (!userData ||  userData === null || userData === 'null')) {
            const config = {
                title: '错误',
                content: '获取权限失败',
            };
            config.title = '';
            config.onOk = () =>{
                Cookies.remove('user')
                localStorage.removeItem('userData')
                Cookies.remove('token');
                refresh()
                window.location.href = '/';
            };
            iView.Modal.error(config)
        }else {
            const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
            if(['error-403','error-404', 'error-500', 'login'].indexOf(to.name)<0 && !curRouterObj){
                next({
                    replace: true,
                    name: 'error-403'
                });
            }
            else if (curRouterObj && curRouterObj.perm !== undefined) { // 需要判断权限的路由

                    if(Util.checkPerm(curRouterObj.perm)) {
                        Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
                    } else {
                        next({
                            replace: true,
                            name: 'error-403'
                        });
                    }
            }  else { // 没有配置权限的路由, 直接通过
                Util.toDefaultPage([...routers], to.name, router, next);
            }
        }
    }
});

router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
    // getAllText()
    // if ( process.env.TYPE === 'kr' ) alert(process.env.TYPE)
});

export let texts = {}
function getAllText () {
    let dom = document.getElementsByTagName('html')
    function domFilter (dom) {
        if (dom.tagName !== 'STYLE' && dom.tagName !== 'SCRIPT') {
            if (dom.children.length > 0) {
                for (let child of dom.children) {
                    domFilter(child)
                }
            } else {
                if (dom.innerText && !texts[dom.innerText]) {
                    texts[dom.innerText] = ""
                }
                if (dom.getAttribute('placeholder') && !texts[dom.getAttribute('placeholder')]) {
                    texts[dom.innerText] = ""
                }
            }
        }
    }
    domFilter(dom[0])
}
