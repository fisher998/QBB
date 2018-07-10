# 签宝宝

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
## 项目结构
# api 
``` bash
# contract.js
与合同有关的各类接口，主要集中在文件文件页
# details.js
多数为首页中的接口，包含账号信息，首页信息等
# login.js
登录页面的接口
# register.js
注册页面的接口
# pay
支付页面的接口
```
# common
> 一些普通js
``` bash
# auth.js
引入js-cookie插件 用于操作cookie
# feature.js
用于在文件上传时获取文件的扩展名
# fetch.js
运用axios所做的请求拦截 目的是为每一个请求设置必要的请求头
# random.js
生成一个16位的简单随机数
# validate.js
登录注册以及绑定证书数用到的正则表达式
```
#components
> 签宝宝项目核心组件
>> ApplicationCertificate--注册成功后的软证书申请绑定页--选择我没有CA证书
>> BindCertificate--注册成功后选择我已有CA证书
>> ContractDetails--合同详情页，在文件列表中的详情按钮进入
>> Details--主要页面，包括首页，文件页，个人中心页以及验签页
>> Initial--登录注册页面以及找回密码页
>> MinePageContent--为个人中的二级路由子页面
>> Protocal--签宝宝用户协议页面
>> RegisteredSuccessfully--个人和企业用户注册成功后进入选择绑定软证书或者硬证书的页面
## ApplicationCertificate
>软证书绑定页
``` bash
# choose-the-type
选择有无eid认证，目前有eid功能暂未开放，设为禁用,选择无eid进入 
```
## BindCertificate
``` bash
# bind-certificate
绑定硬证书，即u-key
```
## ContractDetails
``` bash
# contract-details
合同详情页面
```
## Details
``` bash
# BatchSign
批量签署组件
# NewSignature
点击发起签名后，文件上传成功进入的填写合同信息页面
# NewSignatureFirst
add-signature.vue 文件合同信息填写完成点击下一步进入的添加签署坐标页面，具有发起签署的功能
# Step
步骤条组件 在new-signature和add-signature中使用
# verifyPage
验签页面 包含获取文件，开始验证，验证失败，验证成功和验证成功的信息组件
# all-message-page.vue
消息中心
# file-page
文件管理页面
# sign.vue
文件管理页面 待我签署合同的详情  首页表格中待我签署文件 点击签署是会调用sign.vue组件
# header.vue
头部导航栏
# footer.vue
页脚栏
```
## Initial
``` bash
# login
登录组件
# lost-pass
找回密码组件
# register
注册组件，包含个人注册personal-register.vue和企业注册enterprise-register.vue
```
## MinePageContent
``` bash
# contact.vue
个人中心联系人组件
# expenditure.vue
个人中心消费流水组件
# feedback.vue
个人中心意见反馈组件
# management.vue
个人中心证书管理组件
# recharge.vue
个人中心购买套餐组件
# RechageSuccessByAli.vue
当使用支付宝购买套餐支付成功时，由支付宝跳转回来的支付成功页面
# security-settings.vue
个人中心安全设置组件
stamp.vue
个人中心印章设置组件
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
