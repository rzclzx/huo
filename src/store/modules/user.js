import Cookies from 'js-cookie';
import { refresh } from '__util/axios';

const user = {
    state: {
        checkPerm (perm) {
            const userData = localStorage.getItem('userData');
            let permsList;
            if(userData){
                permsList = JSON.parse(userData).permissions;
            }
            return permsList.indexOf(perm) > -1
        }
    },
    mutations: {
        logout (state, vm) {
            Cookies.remove('user');
            localStorage.removeItem('userData')
            localStorage.removeItem('lang')
            Cookies.remove('token');
            refresh()
            // 恢复默认样式
            // let themeLink = document.querySelector('link[name="theme"]');
            // themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        }
    }
};

export default user;
