import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            name: 'Initial',
            path: '/initial',
            component: resolve => require(['@/components/Initial/initial'], resolve),
            children: [
                {
                    path: '/initial',
                    redirect: '/initial/login'
                },
                {
                    name: 'Login',
                    path: 'login',
                    component: resolve => require(['@/components/Initial/login/login'], resolve),
                },
                {
                    name: 'Register',
                    path: 'register',
                    component: resolve => require(['@/components/Initial/register/register'], resolve),
                },
                {
                    name: 'LostPass',
                    path: 'lost-pass',
                    component: resolve => require(['@/components/Initial/lost-pass/lost-pass'], resolve),
                }
            ]
        },
        {
            name: 'Protocal',
            path: '/protocal',
            component: resolve => require(['@/components/Protocal/protocal'], resolve)
        },
        {
            name: 'RegisteredSuccessfully',
            path: '/registered-successfully',
            component: resolve => require(['@/components/RegisteredSuccessfully/registered-successfully'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            name: 'ApplicationCertificate',
            path: '/application-certificate',
            component: resolve => require(['@/components/ApplicationCertificate/application-certificate'], resolve),
            meta: {
                requireAuth: true
            },
            children: [
                {
                    name: 'ChooseTheType',
                    path: 'choose-the-type',
                    component: resolve => require(['@/components/ApplicationCertificate/choose-the-type'], resolve),
                    meta: {
                        requireAuth: true
                    }
                },
                {
                    name: 'EidAttestation',
                    path: 'eid-attestation',
                    component: resolve => require(['@/components/ApplicationCertificate/eid-attestation'], resolve),
                    meta: {
                        requireAuth: true
                    }
                }
            ]
        },
        {
            name: 'CertificateByFace',
            path: '/certificate-by-face',
            component: resolve => require(['@/components/ApplicationCertificate/certificate-by-face'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            name: 'BindCertificate',
            path: '/bind-certificate',
            component: resolve => require(['@/components/BindCertificate/bind-certificate'], resolve),
            meta: {
                requireAuth: true
            },
            children: [
                {
                    name: 'bind',
                    path: 'bind',
                    component: resolve => require(['@/components/BindCertificate/ContentPage/bind'], resolve),
                    meta: {
                        requireAuth: true
                    }
                },
                {
                    name: 'bindSuccess',
                    path: 'bind-success',
                    component: resolve => require(['@/components/BindCertificate/ContentPage/bindSuccess'], resolve),
                    meta: {
                        requireAuth: true
                    }
                }
            ]
        },
        {
            path: '/',
            redirect: '/details',
            meta: {
                requireAuth: true
            }
        },
        {
            name: 'details',
            path: '/details',
            component: resolve => require(['@/components/details/details'], resolve),
            // meta: {
            //     requireAuth: true
            // },
            children: [
                {
                    path: '/details',
                    redirect: '/details/home-page',
                    meta: {
                        requireAuth: true
                    }
                },
                {
                    name: 'HomePage',
                    path: 'home-page',
                    component: resolve => require(['@/components/details/home-page'], resolve),
                    meta: {
                        requireAuth: true
                    }
                },
                {
                    name: 'FilePage',
                    path: 'file-page',
                    component: resolve => require(['@/components/details/file-page'], resolve),
                    meta: {
                        requireAuth: true
                    }
                },
                {
                    name: 'AllMessagePage',
                    path: 'all-message-page',
                    component: resolve => require(['@/components/details/all-message-page'], resolve),
                    meta: {
                        requireAuth: true
                    }
                },
                {
                    name: 'MinePage',
                    path: 'mine-page',
                    component: resolve => require(['@/components/details/mine-page'], resolve),
                    meta: {
                        requireAuth: true
                    },
                    children: [
                        {
                            path: '/details/mine-page',
                            redirect: '/details/mine-page/management',
                            meta: {
                                requireAuth: true
                            }
                        },
                        {
                            name: 'Management',
                            path: 'management',
                            component: resolve => require(['@/components/MinePageContent/management'], resolve),
                            meta: {
                                requireAuth: true
                            }
                        },
                        {
                            name: 'Recharge',
                            path: 'recharge',
                            component: resolve => require(['@/components/MinePageContent/recharge'], resolve),
                            meta: {
                                requireAuth: true
                            }
                        },
                        {
                            name: 'Expenditure',
                            path: 'expenditure',
                            component: resolve => require(['@/components/MinePageContent/expenditure'], resolve),
                            meta: {
                                requireAuth: true
                            }
                        },
                        {
                            name: 'Stamp',
                            path: 'stamp',
                            component: resolve => require(['@/components/MinePageContent/stamp'], resolve),
                            meta: {
                                requireAuth: true
                            }
                        },
                        {
                            name: 'SecuritySettings',
                            path: 'security-settings',
                            component: resolve => require(['@/components/MinePageContent/security-settings'], resolve),
                            meta: {
                                requireAuth: true
                            }
                        },
                        {
                            name: 'Contact',
                            path: 'contact',
                            component: resolve => require(['@/components/MinePageContent/contact'], resolve),
                            meta: {
                                requireAuth: true
                            }
                        },
                        {
                            name: 'Feedback',
                            path: 'feedback',
                            component: resolve => require(['@/components/minePageContent/feedback'], resolve),
                            meta: {
                                requireAuth: true
                            }
                        },
                    ]
                },
                {
                    name: 'VerifyPage',
                    path: 'verify-page',
                    component: resolve => require(['@/components/details/verify-page'], resolve),
                    // meta: {
                    //     requireAuth: true
                    // }
                }
            ]
        },
        {
            name: 'NewSignature',
            path: '/new-signature',
            component: resolve => require(['@/components/details/NewSignature/new-signature'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            name: 'add-signature',
            path: '/add-signature',
            component: resolve => require(['@/components/details/NewSignatureFirst/add-signature'], resolve),
            meta: {
                requireAuth: true
            }
        },
        {
            name: 'Contractdetails',
            path: '/contract-details',
            component: resolve => require(['@/components/Contractdetails/contract-details'], resolve),
            meta: {
                requireAuth: true
            }
        }
    ]
});