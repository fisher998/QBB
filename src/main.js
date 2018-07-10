// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import 'babel-polyfill';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vuex from 'vuex';
import store from './store';
import axios from 'axios';
import '../static/css/index.less';
import { getToken } from './common/js/auth';

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.prototype.axios = axios;

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) {
        if (getToken()) {
            next();
        } else {
            next({
                path: '/initial',
            })
        }
    } else {
        next();
    }
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
