// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import {appRouter} from './router/router'
import {initLang} from '__util/i18n-setup'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import store from './store'
import {initAxios} from '__util/axios'
import util from '__util/util'
import moment from "moment"
import VueMomentJS from "vue-momentjs"

// import myVueEditor from 'my-vue-editor'
// Vue.use(myVueEditor, options)

Vue.config.productionTip = false

Vue.use(iView)
Vue.use(VueMomentJS, moment)
// 解决select label不及时切换语言问题
Vue.directive('autoLocale', {
    componentUpdated: function (el, binding, vnode) {
        let value = el.querySelector('.ivu-select-selected-value')
        if ( value && value.innerHTML ) {
            setTimeout(() => {
                let option = el.querySelector('.ivu-select-item-selected')
                if ( option && option.innerHTML )
                value.innerHTML = option.innerHTML
            }, 0)
        }
    }
})


// 设置请求和拦截器
initAxios()

// 初始化多语言，默认中文
initLang('zh-CN').then(i18n => {
    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        i18n,
        router,
        store: store,
        template: '<App/>',
        components: {App},
        mounted() {
            this.$store.state.vm = this
            this.currentPageName = this.$route.name;
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
            this.$store.commit('initCachepage');
            // 权限菜单过滤相关
            this.$store.commit('updateMenulist');
        },
        created() {
            let tagsList = [];
            appRouter.map((item) => {
                if (item.children.length <= 1) {
                    tagsList.push(item.children[0]);
                } else {
                    tagsList.push(...item.children);
                }
            });
            this.$store.commit('setTagsList', tagsList);
        }
    })
})
