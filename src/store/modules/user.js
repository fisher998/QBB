import { adminLogin, logOut, task } from '../../api/login';
import { getToken, setToken, removeToken } from '../../common/js/auth';
import { register, verficationMobileCode, enterpriseInformation, enterprisePassword } from '../../api/register';
import { getAccountInformation } from '../../api/details'
const user = {
    state: {
        name: '', // 账号姓名
        account_type: '', // 账号类型 个人 企业
        ca: '', // CA公司 113 GDCA
        area_code: '', // 手机区号 默认86
        mobile: '', // 账号手机
        email: '', // 账号邮箱
        id_card: '', // 账号身份证号码
        create_at: '', // 注册时间
        auth_token: getToken(),
        ukey: '',
        user_sn: '',
        ca_no: '', // 证书编号
        company_no: ''
    },
    mutations: {
        SET_AUTH_TOKEN: (state, auth_token) => {
            state.auth_token = auth_token;
        },
        // SET_ADMIN_ID: (state, admin_id) => {
        //     state.admin_id = admin_id;
        // },
        SET_AREA_CODE: (state, area_code) => {
            state.area_code = area_code;
        },
        SET_MOBILE: (state, mobile) => {
            state.mobile = mobile;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_EMAIL: (state, email) => {
            state.email = email;
        },
        SET_ID_CARD: (state, id_card) => {
            state.id_card = id_card;
        },
        SET_UKEY: (state, ukey) => {
            state.ukey = ukey;
        },
        SET_CREATE_AT: (state, create_at) => {
            state.create_at = create_at;
        },
        SET_ACCOUNT_TYPE: (state, account_type) => {
            state.account_type = account_type;
        },
        SET_CA: (state, ca) => {
            state.ca = ca;
        },
        SET_USER_SN: (state, user_sn) => {
            state.user_sn = user_sn;
        },
        SET_CA_NO: (state, ca_no) => {
            state.ca_no = ca_no;
        },
        SET_COMPANY_NO: (state, company_no) => {
            state.company_no = company_no;
        }
    },
    actions: {
        // 登录
        adminLogin ({ commit }, user_info) {
            return new Promise((resolve, reject) => {
                adminLogin(user_info.mobile, user_info.password, user_info.area_code).then(res => {
                    // console.log(res.data.data['auth-token']);
                    console.log(res)
                    if (res.data.error === 0) {
                        // 对返回的结果储存到cookies
                        const data = res.data.data;
                        setToken(data['auth-token']);
                        commit('SET_AUTH_TOKEN', data['auth-token']);
                        resolve(res);
                    } else {
                        resolve(res);
                    }
                }).catch(error => {
                    reject(error);
                });
            });
        },
        // 退出登录
        adminLoginOut ({ commit }) {
            return new Promise((resolve, reject) => {
                logOut().then(res => {
                    commit('SET_AUTH_TOKEN', ''); // 将token设置成空
                    removeToken() // 移除cookie中的token
                    localStorage.clear();
                    resolve(res.data.error);
                }).catch(error => {
                    reject(error);
                })
            })
        },
        // 注册
        register ({ commit }, user_info) {
            return new Promise((resolve, reject) => {
                register(user_info.personalTel, user_info.noteCode, user_info.checkPass).then(res => {
                    setToken(res.data.data['auth-token']);
                    commit('SET_AUTH_TOKEN', res.data.data['auth-token']);
                    resolve(res);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        // 发送验证码
        verficationMobileCode ({ commit }, enterprise_info) {
            return new Promise((resolve, reject) => {
                verficationMobileCode(enterprise_info.enterpriseTel, enterprise_info.noteCode).then(res => {
                    if (res.data.error === 0) {
                        commit('SET_UKEY', res.data.data);
                        resolve(res);
                    } else {
                        resolve(res);
                    }
                }).catch(error => {
                    reject(error);
                })
            });
        },
        // 发送企业信息
        enterpriseInformation ({ commit }, enterprise_info) {
            return new Promise((resolve, reject) => {
                enterpriseInformation(enterprise_info.ukey, enterprise_info.enterpriseName, enterprise_info.creditCode, enterprise_info.principal, enterprise_info.IDCardNo).then(res => {
                    if (res.data.error === 0) {
                        commit('SET_UKEY', res.data.data);
                        resolve(0);
                    } else {
                        resolve(res.data.error);
                    }
                }).catch(error => {
                    reject(error);
                });
            })
        },
        // 发送密码
        enterprisePassword({ commit }, enterprise_info) {
            return new Promise((resolve, reject) => {
                enterprisePassword(enterprise_info.ukey, enterprise_info.checkPass).then(res => {
                    console.log('调用成功时返回结果')
                    console.log(res)
                    if (res.data.error === 0) {
                        console.log(res.data.data['auth-token']);
                        setToken(res.data.data['auth-token'])
                        commit('SET_AUTH_TOKEN', res.data.data['auth-token']);
                        resolve(res);
                    } else {
                        resolve(res);
                    }
                }).catch(error => {
                    console.log('调用失败时返回结果')
                    reject(error);
                });
            })
        },
        // 获取账号信息
        getAccountInformation ({ commit }) {
            return new Promise((resolve, reject) => {
                getAccountInformation().then(res => {
                    if (res.data.error === 0) {
                        console.log(res)
                        let data = res.data.data;
                        commit('SET_NAME', data.name);
                        commit('SET_MOBILE', data.account);
                        commit('SET_EMAIL', data.email);
                        commit('SET_ID_CARD', data.id_card);
                        commit('SET_CREATE_AT', data.create_at);
                        commit('SET_ACCOUNT_TYPE', data.account_type);
                        commit('SET_CA', data.ca);
                        commit('SET_USER_SN', data.user_sn);
                        commit('SET_CA_NO', data.ca_no);
                        commit('SET_COMPANY_NO', data.company_no)
                        resolve(res);
                    } else {
                        resolve(res);
                    }
                }).catch(error => {
                    reject(error)
                });
            });
        }
    }
}
export default user;
