/*
* eIDPluginHelper
*
* Copyright (c) 2016 The Third Research Institute of The Ministry of Public Security   
*
* Version 3.7.5.154
*/

if (document.location.protocol == 'https:') {
    document.write("<script src='https://eid.cn/update/getmsg.js'></script>");
    document.write("<script src='https://eid.cn/update/jquery-1.8.2.js'></script>");
    document.write("<script src='https://eid.cn/update/eIDUI/eIDSelect/jquery.eIDSelect.js'></script>");
    document.write("<script src='https://eid.cn/update/eIDUI/eIDSelect/eIDUI-common.js'></script>");
    document.write('<link rel="stylesheet" href="https://eid.cn/update/eIDUI/eIDSelect/jquery.eIDSelect.css">');
}
else {
    document.write("<script src='http://update.cneid.net.cn/update/getmsg.js'></script>");
    document.write("<script src='http://update.cneid.net.cn/update/jquery-1.8.2.js'></script>");
    document.write("<script src='http://update.cneid.net.cn/update/eIDUI/eIDSelect/jquery.eIDSelect.js'></script>");
    document.write("<script src='http://update.cneid.net.cn/update/eIDUI/eIDSelect/eIDUI-common.js'></script>");
    document.write('<link rel="stylesheet" href="http://update.cneid.net.cn/update/eIDUI/eIDSelect/jquery.eIDSelect.css">');
}

var onPluginLoad = null;
var eID = new eIDPluginHelper();

function eIDPluginHelper() {
    //控件基准版本
    var basePlugInVersion = 154;
    //控件对象
    var eIDPluginObject = null;
    //是否插件已加载
    var isPluginLoading = false;
    var isPluginLoad1 = false;
    var isPluginLoad2 = false;
    var iseIDLoadOK = false;
    var iseIDSetDeviceDivOK = false;
    var isAttached = false;
    //函数索引
    var funcIndex = 1;
    //缓存回调函数列表
    var funcIDBindList = [];
    //是否正在检测设备拔插
    var isDetecting = false;
    //检测设备回调函数
    var onDeviceDetect = null;
    //开始检测设备回调函数
    var onBeginDeviceDetect = null;
    //终止检测设备回调函数
    var onEndDeviceDetect = null;
    //当前读卡器和银行尾号列表
    var currentReaderSerialList = [];

    //2.0
    //当前设备信息列表
    var devList = [];
    //设备显示框参数
    var divConfig;
    //设备选择框选择器加载完成事件名
    var divSelectOnloadEventName = 'divSelectLoad';
    //设备变化回调函数
    var onDevChange = null;
    //是否页面已加载
    var isUIOK = false;

    //本对象
    var self = this;

    //浏览器类型判断
    var Sys = getBrowseType();
    if (Sys.chrome) {
        var ExtensionId = "cbdjldfjcijepkcfefjfpjlekbncjchm";
        var outputDiv = document.createElement('div');
        var ExeExit = null;
        var MsgId = 0;
    }
    var message = [];
    var dwExit = false;

    function attachFunc() {
        if (!isAttached) {
            isAttached = true;
            attach(eIDPluginObject, 'GetVersionCompleted', getVersionCompleted);
            attach(eIDPluginObject, 'GetReaderListCompleted', getReaderListCompleted);
            attach(eIDPluginObject, 'DetectCardBeginCompleted', detectCardBeginCompleted);
            attach(eIDPluginObject, 'DetectCardEndCompleted', detectCardEndCompleted);
            attach(eIDPluginObject, 'DeviceInsertCompleted', deviceInsertCompleted);
            attach(eIDPluginObject, 'DeviceRemoveCompleted', deviceRemoveCompleted);
            attach(eIDPluginObject, 'HashCompleted', hashCompleted);
            attach(eIDPluginObject, 'SignCompleted', signCompleted);
            attach(eIDPluginObject, 'VerifyPinCompleted', verifyPinCompleted);
            attach(eIDPluginObject, 'SignNoInputPinCompleted', signNoInputPinCompleted);
        }
    }

    function isToUpdate(version) {
        var plugInVersion = version;

        for (var i = 0; i < 3; i++) {
            var index = version.indexOf(".");
            plugInVersion = plugInVersion.substring(index + 1, plugInVersion.length - index + 1);
        }

        if (plugInVersion < basePlugInVersion)
            return true;
        return false;
    }

    //加载控件
    function setPlugin(onFinish, onError) {

        if (isPluginLoading) {
            setTimeout(function () {
                setPlugin(onFinish, onError);
            }, 100);
            return;
        }

        if (isPluginLoad1 || isPluginLoad2) {
            onFinish();
            return;
        }
        isPluginLoading = true;

        if (!Sys.chrome) {
            onPluginLoad = onFinish;

            var objectHtml = '<object id="eIDPlugin" type="application/x-eidpluginhelper" width="0" height="0" style="visibility: visible">';
            objectHtml += '<param name="onload" value="onPluginLoad" />';
            objectHtml += '</object>';
            document.body.innerHTML += objectHtml;

            if (isInterfaceFull() == false) {
                onError();
            }
        }
        else {
            outputDiv.addEventListener('response', function () {
                var param = document.getElementById('eIDHiddenOutputDiv').innerHTML;
                var dwdata = param.substr(5, param.length - 7);
                var array = dwdata.split(";");
                ExeExit = null;
                for (var i = 0; i < array.length; i++) {
                    if (array[i].indexOf(',') != -1) {
                        array[i] = array[i].split(',');
                    }
                }

                if (array[0][0] == "eID_GetVersion") {
                    PutErrMsg4Chrome(array);
                    getVersionCompleted(array);
                } else if (array[0][0] == "eID_GetReaderList") {
                    var glist = new Array();
                    glist[2] = new Array();
                    for (k = 0; k < 5; k++) {
                        glist[2][k] = "";
                    }
                    glist[0] = array[0];
                    glist[1] = array[1];
                    var bank2 = array[2].split("=");
                    for (var i = 0; i < bank2.length - 1; i++) {
                        glist[2 + i] = bank2[i].split("+");
                        glist[2 + i][5] = array[0][1];
                    }
                    PutErrMsg4Chrome(array);

                    var GetListID = parseInt(array[0][1], 10);

                    if ((GetListID == 1) && devList.length) {
                        for (var j = 0; j < devList.length; j++) {
                            if (glist[2][0] == devList[j].readerName) {
                                return;
                            }
                        }
                    }
                    getReaderListCompleted(glist);
                } else if (array[0][0] == "eID_DetectCardBegin") {
                    PutErrMsg4Chrome(array);
                    detectCardBeginCompleted(array);
                } else if (array[0][0] == "eID_DectetInsertAndReMove") {
                    if (array[0][1] == 1) {
                        deviceInsertCompleted(array);
                    } else {
                        deviceRemoveCompleted(array);
                    }
                } else if (array[0][0] == "eID_DetectCardEnd") {
                    PutErrMsg4Chrome(array);
                    detectCardEndCompleted(array);
                } else if (array[0][0] == "eID_Hash") {
                    PutErrMsg4Chrome(array);
                    hashCompleted(array);
                } else if (array[0][0] == "eID_Sign") {
                    PutErrMsg4Chrome(array);
                    signCompleted(array);
                } else if (array[0][0] == "eID_VerifyPin") {
                    PutErrMsg4Chrome(array);
                    verifyPinCompleted(array);
                } else if (array[0][0] == "eID_SignNoInputPin") {
                    PutErrMsg4Chrome(array);
                    signNoInputPinCompleted(array);
                } else if (array[0][0] == "eID_Init") {
                    if (array[0][1] == "eID_Success") {
                        onFinish();
                        dwExit = true;
                    } else {
                        onError();
                    }
                } else if (array[0][0] == "eID_Exit") {
                }
            });

            var Initdata = "{\"BtnName\":\"eID_Init\"}";
            setTimeout(function () {
                chrome.runtime.sendMessage(ExtensionId, { data: Initdata },
                    function (response) {
                        if (response == undefined) {
                            onError();
                        }
                    });
            }, 100);
        }
    }

    //加载控件
    this.load = function (loadCallback) {

        //判断是否已加载控件
        if (typeof (loadCallback) != 'function') {
            return;
        }

        //判断是否已加载控件
        if (iseIDLoadOK) {
            loadCallback(true);
            return;
        }

        //eID.load插件加载错误
        function onPluginLoadError1() {
            isPluginLoading = false;
            isPluginLoad1 = false;
            loadCallback(false, 'http://update.cneid.net.cn/update/eIDSetup.exe');
        }

        //eID.load加载控件完成回调函数
        function onPluginLoadFinish1() {
            isPluginLoading = false;
            isPluginLoad1 = true;
            if (!Sys.chrome) {
                if (isInterfaceFull() == true) {
                    attachFunc();
                } else {
                    loadCallback(false, 'http://update.cneid.net.cn/update/eIDSetup.exe');
                }
            }
            self.getVersion(onGetVersionFinish1);
        }

        //eID.load包含的getversion回调函数
        function onGetVersionFinish1(rv, version) {
            if (rv == 0) {
                if (isToUpdate(version)) {
                    loadCallback(false, 'http://update.cneid.net.cn/update/eIDSetup.exe');
                    return;
                }
                iseIDLoadOK = true;
                loadCallback(true);
            } else {
                loadCallback(false, 'http://update.cneid.net.cn/update/eIDSetup.exe');
            }
        }

        setPlugin(onPluginLoadFinish1, onPluginLoadError1);
    }

    function getErrMsg4Chrome(rv) {
        if (message != null) {
            for (var m = 0; m < message.length; m++) {
                if (message[m][0] == rv) {
                    return msgVal = message[m][1];
                }
            }
        } else {
            return msgVal = getErrMsg(retVal);
        }
    }

    //转换返回值为中文提示信息
    this.getMessage = function (rv) {
        if (typeof (rv) != 'number') {
            return '';
        }

        if (!Sys.chrome) {
            if (null == eIDPluginObject.eID_GetMessage) {
                return getErrMsg(rv);
            }
            return eIDPluginObject.eID_GetMessage(rv);
        } else {
            return getErrMsg4Chrome(rv);
        }
    }

    //获取接口版本号
    this.getVersion = function (getVersionCallback) {
        if (typeof (getVersionCallback) != 'function') {
            return;
        }

        if (!Sys.chrome) {
            if (null == eIDPluginObject.eID_GetVersion) {
                getVersionCallback(0xE017001B);
                return;
            }
            var funcID = addFuncIDBind(getVersionCallback);
            eIDPluginObject.eID_GetVersion(funcID);
        } else {
            var funcID = addFuncIDBind(getVersionCallback);
            var param = "{\"BtnName\":\"eID_GetVersion\",\"FuncID\":" + funcIndex + "}";
            chrome.runtime.sendMessage(ExtensionId, { data: param });
        }
    }

    //开始检测设备插拔
    this.detectDeviceBegin = function (detectDeviceCallback) {
        if (typeof (detectDeviceCallback) != 'function') {
            return;
        }

        if (!isPluginLoad1) {
            detectDeviceCallback(0xE017001B);
            return;
        }

        if (!Sys.chrome) {
            if (eIDPluginObject.eID_GetReaderList == null || eIDPluginObject.eID_DetectCardBegin == null) {
                detectDeviceCallback(0xE017001B);
                return;
            }
        }

        if (isDetecting) {
            onDeviceDetect = detectDeviceCallback;
            detectDeviceCallback(0, currentReaderSerialList);
            return;
        }

        isDetecting = true;
        onBeginDeviceDetect = function (rv, readerSerialList) {
            onDeviceDetect = detectDeviceCallback;
            if (0 == rv) {
                if (!Sys.chrome) {
                    eIDPluginObject.eID_DetectCardBegin(0);
                } else {
                    var param = "{\"BtnName\":\"eID_Begin\",\"FuncID\":0}";
                    chrome.runtime.sendMessage(ExtensionId, { data: param });
                }
            }
        };

        if (!Sys.chrome) {
            eIDPluginObject.eID_GetReaderList(0);
        } else {
            var param = "{\"BtnName\":\"eID_GetList\",\"FuncID\":0}";
            chrome.runtime.sendMessage(ExtensionId, { data: param });
        }
    }

    //结束检测设备插拔
    this.detectDeviceEnd = function (detectDeviceEndCallback) {
        onEndDeviceDetect = detectDeviceEndCallback;
        if (typeof (detectDeviceEndCallback) != 'function') {
            return;
        }

        if (!isDetecting) {
            detectDeviceEndCallback(0);
            return;
        }

        if (!Sys.chrome) {
            if (null == eIDPluginObject.eID_DetectCardEnd) {
                detectDeviceEndCallback(0xE017001B);
                return;
            }
            eIDPluginObject.eID_DetectCardEnd(0);
        }
        else {
            var param = "{\"BtnName\":\"eID_End\",\"FuncID\":0}";
            chrome.runtime.sendMessage(ExtensionId, { data: param });
        }
    }

    //杂凑数据
    this.hash = function (hashCallback, reader, data, type, alg) {
        if (typeof (hashCallback) != 'function') {
            return;
        }

        if (typeof (reader) != 'string' || typeof (data) != 'string' || typeof (type) != 'number') {
            hashCallback(0xE0170005);
            return;
        }

        switch (type) {
            case undefined:
            case 1:
            case 2:
            case 3:
                break;
            default:
                hashCallback(0xE0170005);
                return;
        }

        var aAlg = alg;
        if (alg === undefined) {
            aAlg = 1;
        } else if (typeof (aAlg) != 'number') {
            hashCallback(0xE0170005);
            return;
        }

        switch (aAlg) {
            case undefined:
            case 1:
            case 2:
            case 3:
                break;
            default:
                hashCallback(0xE0170005);
                return;
        }

        if (!Sys.chrome) {
            if (eIDPluginObject.eID_Hash == null) {
                hashCallback(0xE017001B);
                return;
            }
            var funcID = addFuncIDBind(hashCallback);
            eIDPluginObject.eID_Hash(funcID, reader, data, type, aAlg);
        } else {
            var funcID = addFuncIDBind(hashCallback);
            var strtype = type.toString();
            var straAlg = aAlg.toString();
            var param = "{\"BtnName\":\"eID_Hash\",\"FuncID\":" + funcIndex + ", \"reader\":\"" + reader + "\", \"data\":\"" + data + "\", \"type\":\"" + strtype + "\",\"dwAlg\":\"" + straAlg + "\"}";
            chrome.runtime.sendMessage(ExtensionId, { data: param });
        }
    }

    //签名数据
    this.sign = function (signCallback, reader, data, type) {
        if (typeof (signCallback) != 'function') {
            return;
        }

        if (typeof (reader) != 'string' || typeof (data) != 'string' || typeof (type) != 'number') {
            signCallback(0xE0170005);
            return;
        }

        switch (type) {
            case undefined:
            case 20:
            case 21:
            case 22:
            case 23:
            case 0:
            case 1:
                break;
            default:
                signCallback(0xE0170005);
                return;
        }

        if (!Sys.chrome) {
            if (eIDPluginObject.eID_Sign == null) {
                signCallback(0xE017001B);
                return;
            }
            var funcID = addFuncIDBind(signCallback);
            eIDPluginObject.eID_Sign(funcID, reader, data, type);
        } else {
            var funcID = addFuncIDBind(signCallback);
            var strtype = type.toString();
            var param = "{\"BtnName\":\"eID_Sign\",\"FuncID\":" + funcIndex + ",\"reader\":\"" + reader + "\",\"data\":\"" + data + "\", \"type\":\"" + strtype + "\"}";
            chrome.runtime.sendMessage(ExtensionId, { data: param });
        }
    }

    //校验PIN码
    this.verifyPin = function (verifyPinCallback, reader, type, pin) {
        if (typeof (verifyPinCallback) != 'function') {
            return;
        }

        if (typeof (reader) != 'string' || typeof (type) != 'number' || typeof (pin) != 'string') {
            verifyPinCallback(0xE0170005);
            return;
        }

        if ((type != 0) && (type != 1)) {
            verifyPinCallback(0xE0170005);
            return;
        }

        if (!Sys.chrome) {
            if (eIDPluginObject.eID_VerifyPin == null) {
                verifyPinCallback(0xE017001B);
                return;
            }
            var funcID = addFuncIDBind(verifyPinCallback);
            eIDPluginObject.eID_VerifyPin(funcID, reader, type, pin);
        } else {
            var funcID = addFuncIDBind(verifyPinCallback);
            var strtype = type.toString();
            var param = "{ \"BtnName\":\"eID_VerifyPin\",\"FuncID\":" + funcIndex + ", \"reader\": \"" + reader + "\", \"type\":\"" + strtype + "\",\"strPin\":\"" + pin + "\"}";
            chrome.runtime.sendMessage(ExtensionId, { data: param });
        }
    }

    //签名数据而不校验PIN码
    this.signNoInputPin = function (signNoInputPinCallback, reader, data, type) {
        if (typeof (signNoInputPinCallback) != 'function') {
            return;
        }

        if (typeof (reader) != 'string' || typeof (data) != 'string' || typeof (type) != 'number') {
            signNoInputPinCallback(0xE0170005);
            return;
        }

        switch (type) {
            case undefined:
            case 20:
            case 21:
            case 22:
            case 23:
            case 0:
            case 1:
                break;
            default:
                signNoInputPinCallback(0xE0170005);
                return;
        }

        if (!Sys.chrome) {
            if (eIDPluginObject.eID_Sign == null) {
                signNoInputPinCallback(0xE017001B);
                return;
            }
            var funcID = addFuncIDBind(signNoInputPinCallback);
            eIDPluginObject.eID_SignNoInputPin(funcID, reader, data, type);
        } else {
            var funcID = addFuncIDBind(signNoInputPinCallback);
            var strtype = type.toString();
            var param = "{\"BtnName\":\"eID_Nopin\",\"FuncID\":" + funcIndex + ",\"reader\":\"" + reader + "\",\"data\":\"" + data + "\", \"type\":\"" + strtype + "\"}";
            chrome.runtime.sendMessage(ExtensionId, { data: param });
        }
    }

    function MessageCompleted(param) {
        var m = '0x' + rv.toString(16);
        var param = "{\"BtnName\":\"GetMessage\",\"MsgRv\":\"" + m + "\"}";
        chrome.runtime.sendMessage(ExtensionId, { data: param });
    }

    //检测更新事件处理
    function getVersionCompleted(param) {
        if (!Sys.chrome) {
            var funcID = param[0];
        } else {
            var funcID = parseInt(param[0][1], 10);
        }
        var bind = getFuncIDBind(funcID);
        var rv = parseInt(param[1], 10);
        var version = param[2];
        var func = null;
        if (bind != null) {
            func = bind.func;
        }

        if (func != null) {
            func(rv, version);
        } else {
            for (var i = 0; i < 3; i++) {
                var index = version.indexOf(".");
                version = version.substring(index + 1, version.length - index + 1);
            }

            plugInVersion = version;
            if (Sys.chrome) {
                var param = "{\"BtnName\":\"eID_GetList\",\"FuncID\":1}";
                chrome.runtime.sendMessage(ExtensionId, { data: param });
            }
            if (plugInVersion < basePlugInVersion) {
                var div = document.getElementById(divConfig.id);
                initDiv(div, divConfig, false, false, function () {
                    isUIOK = true;
                    divConfig = null;
                    callback(divConfig, 0xE017003D);
                });
                return;
            }
        }
    }

    function setCurrReaderSerialList(readerSerial) {
        if (readerSerial[1].length > 0) {
            if (readerSerial[1].indexOf('尾号') == -1) {
                readerSerial[1] = '尾号:' + readerSerial[1];
            }
        } else {
            readerSerial[1] = ' eID通用载体';
        }

        var isExist = false;
        for (var j = 0; j < currentReaderSerialList.length; j++) {
            if (readerSerial[0] == currentReaderSerialList[j][0]) {
                isExist = true;
                break;
            }
        }
        if (isExist == false) {
            currentReaderSerialList.push(readerSerial);
        }
    }

    function setDevList(bank, devChangeCallback) {
        var reader = bank[0];
        var cardno = bank[1];
        var banklogo = bank[2];
        var cardtype = bank[3];
        var bankname = bank[4];
        var jsNum = bank[5];

        if (document.location.protocol == 'https:') {
            banklogo = banklogo.replace('http', 'https');
            banklogo = banklogo.replace('update.cneid.net.cn', 'eid.cn');
        }

        var isExist = false;
        for (var j = 0; j < devList.length; j++) {
            if (reader == devList[j].readerName) {
                isExist = true;
                break;
            }
        }

        if (isExist == false) {
            addRecToDevList(divConfig, devList, reader, bankname, banklogo, cardtype, cardno, function (devList) {
                var div = document.getElementById(divConfig.id);
                refleshDivDev(div, devList);
            });
            if (devChangeCallback != null) {
                var selReader = null;
                var serailSelect = document.getElementById(divConfig.id + 'Select');
                if (-1 != serailSelect.selectedIndex)
                    selReader = serailSelect.options[serailSelect.selectedIndex].value;
                devChangeCallback(onDevChange, devList.length, selReader);
            }
        }
    }

    //开始检测设备插拔事件处理
    function getReaderListCompleted(param) {
        if (!Sys.chrome) {
            var funcID = param[0];
        } else {
            var funcID = parseInt(param[0][1], 10);
        }
        var rv = parseInt(param[1], 10);
        if (0 == funcID) {
            if (rv != 0) {
                onBeginDeviceDetect(rv);
                isDetecting = false;
                return;
            }
            currentReaderSerialList = [];

            for (var i = 2; i < param.length; i++) {
                if (param[2][0] != "") {
                    setCurrReaderSerialList(param[i]);
                }
            }

            onBeginDeviceDetect(rv);
        } else if (1 == funcID) {
            if (rv != 0) {
                callback(divConfig, rv);
                divConfig = null;
                return;
            }

            var p = param;
            //初始化div为等待插入卡的样式
            var div = document.getElementById(divConfig.id);
            initDiv(div, divConfig, true, true, function () {
                isUIOK = true;
                $('#' + divConfig.id).trigger(divSelectOnloadEventName);
                if (devList.length != p.length - 2) {
                    if (p[2][0] != "") {
                        devChangeCallback(onDevChange, p.length - 2, p[2][0]);
                    }
                }
                if (p.length > 2) {
                    if (p[2][0] != "") {
                        for (var i = 2; i < p.length; i++) {
                            setDevList(p[i], null);
                        }
                    }
                }

                if (!Sys.chrome) {
                    eIDPluginObject.eID_DetectCardBegin(1);
                }
                else {
                    var param = "{\"BtnName\":\"eID_Begin\",\"FuncID\":1}";
                    chrome.runtime.sendMessage(ExtensionId, { data: param });
                }
            });
        }
    }

    //开始检测设备插拔事件处理
    function detectCardBeginCompleted(param) {
        if (!Sys.chrome) {
            var funcID = param[0];
        } else {
            var funcID = param[0][1];
        }
        var rv = parseInt(param[1], 10);
        if (0 == funcID) {
            if (rv != 0) {
                isDetecting = false;
            }
            onDeviceDetect(rv, currentReaderSerialList);
        } else if (1 == funcID) {
            if (rv != 0) {
                callback(divConfig, rv);
                divConfig = null;
                return;
            }
            iseIDSetDeviceDivOK = true;
            callback(divConfig, rv);
        }
    }

    //结束检测设备插拔事件处理
    function detectCardEndCompleted(param) {
        if (isDetecting) {
            if (!Sys.chrome) {
                var funcID = param[0];
            } else {
                var funcID = param[0][1];
            }
            if (0 == funcID) {
                var rv = parseInt(param[1], 10);
                if (0 == rv) {
                    isDetecting = false;
                    onDeviceDetect = null;
                }
                onEndDeviceDetect(rv);
                onEndDeviceDetect = null;
            }
        }
    }

    //设备插入事件处理
    function deviceInsertCompleted(param) {
        if (!Sys.chrome) {
            var rv = parseInt(param[0], 10);
        } else {
            var rv = parseInt(param[1], 10);
        }
        if (!Sys.chrome) {
            var bank = param[1];
        } else {
            var bank = param[2];
        }
        if (divConfig != null) {
            if (rv != 0) {
                callback(divConfig, rv);
                return;
            }
            setDevList(bank, devChangeCallback);
        }
        if (onDeviceDetect != null) {
            if (!Sys.chrome) {
                if (0 == rv) {
                    setCurrReaderSerialList(param[1]);
                }
                onDeviceDetect(rv, currentReaderSerialList);
            } else {
                setCurrReaderSerialList(bank);
                onDeviceDetect(rv, currentReaderSerialList);
            }
        }
    }

    //设备拔出事件处理
    function deviceRemoveCompleted(param) {
        if (!Sys.chrome) {
            var rv = parseInt(param[0], 10);
        } else {
            var rv = parseInt(param[1], 10);
        }
        if (divConfig != null) {
            if (rv != 0) {
                callback(divConfig, rv);
                return;
            }

            if (!Sys.chrome) {
                var reader = param[1][0];
            } else {
                var reader = param[2][0];
            }
            for (var i = 0; i < devList.length; i++) {
                var cmp = devList[i].readerName;
                if (reader == cmp) {
                    devList.splice(i, 1);
                    var div = document.getElementById(divConfig.id);
                    refleshDivDev(div, devList);
                    var selReader = null;
                    var serailSelect = document.getElementById(divConfig.id + 'Select');
                    if (-1 != serailSelect.selectedIndex)
                        selReader = serailSelect.options[serailSelect.selectedIndex].value;
                    devChangeCallback(onDevChange, devList.length, selReader);
                    break;
                }
            }
        }
        if (onDeviceDetect != null) {
            if (0 == rv) {
                if (!Sys.chrome) {
                    var readerSerial = param[1];
                } else {
                    var readerSerial = param[2];
                }
                for (var i = 0; i < currentReaderSerialList.length; i++) {
                    if (readerSerial[0] == currentReaderSerialList[i][0]) {
                        currentReaderSerialList.splice(i, 1);
                        break;
                    }
                }
            }
            onDeviceDetect(rv, currentReaderSerialList);
        }
    }

    //杂凑数据完成事件处理
    function hashCompleted(param) {
        if (!Sys.chrome) {
            var funcID = param[0];
        } else {
            var funcID = param[0][1];
        }
        var bind = getFuncIDBind(funcID);
        var func = bind.func;
        var rv = parseInt(param[1], 10);
        var result = param[2];
        var idCarrier = param[3];
        if (bind.func != null) {
            var alg = param[4];
            if (rv == 0xE0170031) {
                bind = getFuncIDBind(funcID, false);
                func = bind.func;
            }
            if (func != null) {
                func(rv, result, idCarrier, alg);
            }
        } else {
            if (rv != 0) {
                callback(bind.conf, rv);
                return;
            }
            callback(bind.conf, rv, {
                hashResult: result,
                idCarrier: idCarrier,
                alg: bind.conf.alg
            });
        }
    }

    //签名数据完成事件处理
    function signCompleted(param) {
        if (!Sys.chrome) {
            var funcID = param[0];
        } else {
            var funcID = param[0][1];
        }
        var bind = getFuncIDBind(funcID);
        var func = bind.func;
        var rv = parseInt(param[1], 10);
        var result = param[2];
        var idCarrier = param[3];
        var issuer = param[4];
        var subject = param[5];
        var certSn = param[6];
        var issuerSn = param[7];
        var cert = param[8];
        var algo = param[9];
        if (func != null) {
            if (rv == 0xE0170031) {
                bind = getFuncIDBind(funcID, false);
                func = bind.func;
            }
            if (func != null) {
                func(rv, result, idCarrier, issuer, subject, certSn, issuerSn, cert, algo);
            }
        } else {
            if (rv != 0) {
                callback(bind.conf, rv);
                return;
            }
            var data = {
                signResult: result,
                idCarrier: idCarrier,
                alg: algo
            };
            if (bind.tag == 1) {
                data.issuer = issuer;
                data.subject = subject;
                data.certSn = certSn;
                data.issuerSn = issuerSn;
            } else if (bind.tag == 2) {
                data.cert = cert;
            }

            callback(bind.conf, rv, data);
        }
    }

    //校验PIN码完成事件处理
    function verifyPinCompleted(param) {
        if (!Sys.chrome) {
            var funcID = param[0];
        } else {
            var funcID = param[0][1];
        }
        var bind = getFuncIDBind(funcID);
        var func = bind.func;
        var rv = parseInt(param[1], 10);
        if (func != null) {
            if (rv == 0xE0170031) {
                bind = getFuncIDBind(funcID, false);
                func = bind.func;
            }

            if (func != null) {
                func(rv);
            }
        } else {
            if (rv != 0) {
                callback(bind.conf, rv);
                return;
            }

            var pluginObj = document.getElementById('eIDPlugin');
            var funcID = addFuncIDBind(null, bind.conf, bind.tag);
            if (!Sys.chrome) {
                pluginObj.eID_SignNoInputPin(funcID, bind.reader, bind.src, bind.alg);
            } else {
                var strtype = bind.alg.toString();
                var param = "{\"BtnName\":\"eID_Nopin\",\"FuncID\":" + funcID + ",\"reader\":\"" + bind.reader + "\",\"data\":\"" + bind.src + "\", \"type\":\"" + bind.alg + "\"}";
                chrome.runtime.sendMessage(ExtensionId, { data: param });
            }
        }
    }

    //签名数据不输入PIN码完成事件处理
    function signNoInputPinCompleted(param) {
        signCompleted(param);
    }

    //函数索引和函数和config绑定
    function funcIDBind(id, func, conf, tag, reader, src, alg) {
        this.id = id;
        this.func = func;
        this.conf = conf;
        this.tag = tag;
        this.reader = reader;
        this.src = src;
        this.alg = alg;
    }

    //添加回调函数绑定
    function addFuncIDBind(func, conf, tag, reader, src, alg) {
        funcIndex++;
        var newFuncIDBind = new funcIDBind(funcIndex, func, conf, tag, reader, src, alg);
        funcIDBindList.push(newFuncIDBind);
        return funcIndex;
    }

    //获取并移除回调函数绑定
    function getFuncIDBind(funcID, isRemove) {
        if (null == funcID) {
            return;
        }

        var index = null;
        for (var i = 0; i < funcIDBindList.length; i++) {
            if (funcIDBindList[i].id == funcID) {
                if (null == isRemove || true == isRemove) {
                    return funcIDBindList.splice(i, 1)[0];
                } else {
                    return funcIDBindList[i];
                }
            }
        }
    }

    //绑定事件
    function attach(elem, eventName, func) {
        if (elem.attachEvent != null) {
            elem.attachEvent('on' + eventName, func);
        }
        else if (elem.addEventListener != null) {
            elem.addEventListener(eventName, func, false);
        }
    }

    //设置设备选择框
    this.setDeviceDiv = function (config) {

        if (iseIDSetDeviceDivOK) {
            return;
        }

        //判断配置和参数是否有效
        if (!checkConfig(config) ||
            !checkParam(config.type, 'number', false) ||
            !checkParam(config.isScroll, 'boolean', false)) {
            callback(config, 0xE0170005);
            return;
        }

        //判断和设置type默认值
        switch (config.type) {
            case undefined:
                config.type = 1;
                break;
            case 1:
                break;
            default:
                callback(config, 0xE0170005);
                return;
        }

        //判断config.isScroll参数
        switch (config.isScroll) {
            case undefined:
                config.isScroll = false;
                break;
        }

        //获取指定id对应的div
        var div = document.getElementById(config.id);
        if (null == div) {
            callback(config, 0xE017003F);
            return;
        }

        //已存在设置的Div，若相同则成功返回；不同则报错返回
        if (divConfig != null) {
            if (divConfig.id == config.id) {
                callback(config, 0);
            } else {
                callback(config, 0xE0170029);
            }
            return;
        }

        //插件加载错误处理
        function onPluginError2() {
            isPluginLoading = false;
            isPluginLoad2 = false;
            iseIDSetDeviceDivOK = false;
            var div = document.getElementById(config.id);
            initDiv(div, config, false, false, function () {
                isUIOK = true;
                divConfig = null;
                callback(config, 0xE017003D);
            });
        }

        function pluginLoad2() {
            isPluginLoading = false;
            isPluginLoad1 = true;
            if (!Sys.chrome) {
                if (isInterfaceFull() == true) {
                    attachFunc();
                } else {
                    onPluginLoadError1();
                }
            }

            self.getVersion(onGetVersionFinish2);
        }

        function onGetVersionFinish2(rv, version) {
            if (rv == 0) {
                if (isToUpdate(version)) {
                    onPluginError2();
                    return;
                }
                onDevChange = config.onDevChange;
                if (!Sys.chrome) {
                    eIDPluginObject.eID_GetReaderList(1);
                } else {
                    var param = "{\"BtnName\":\"eID_GetList\",\"FuncID\":1}";
                    chrome.runtime.sendMessage(ExtensionId, { data: param });
                }
            } else {
                onPluginError2();
            }
            onDevChange = config.onDevChange;
        }

        setPlugin(pluginLoad2, onPluginError2);

        divConfig = config;
    }

    //设置签名认证按钮
    this.setSignButton = function (config) {
        setSign(config, 1);
    }

    //设置本地签名认证按钮
    this.setLocalSignButton = function (config) {
        setSign(config, 2);
    }

    //设置杂凑按钮
    this.setHashButton = function (config) {
        //判断配置和参数是否有效
        if (!checkConfig(config) ||
            !checkParam(config.src, 'function', true) ||
            !checkParam(config.alg, 'number', false) ||
            !checkParam(config.type, 'number', true)) {
            callback(config, 0xE0170005);
            return;
        }

        var src = config.src();
        if (!checkParam(src, 'string', true)) {
            callback(config, 0xE0170005);
            return;
        }
        //判断和设置alg默认值
        var alg;
        switch (config.alg) {
            case undefined:
            case 10:
                config.alg = 10;
                alg = 1;
                break;
            case 11:
                alg = 2;
                break;
            case 12:
                alg = 3;
                break;
            default:
                callback(config, 0xE0170007);
                return;
        }

        //获取指定id对应的按钮
        var btn = document.getElementById(config.id);
        if (btn == null) {
            callback(config, 0xE017003F);
            return;
        }

        //判断是否已设置Div
        if (null == divConfig) {
            callback(config, 0xE017003D);
            return;
        }

        //判断div元素是否有效
        var div = document.getElementById(divConfig.id);
        if (div == null) {
            callback(config, 0xE017003F);
            return;
        }

        btn.disabled = true;

        //判断select是否已创建
        var deviceSelect = document.getElementById(divConfig.id + 'Select');
        if (deviceSelect == null) {
            //绑定div创建完成select事件
            $('#' + divConfig.id).bind(divSelectOnloadEventName, function () {
                //绑定选择器选择变化事件
                $('#' + divConfig.id + 'Select').bind('eIDEventItemSelected', function () {
                    disableInvalidCardBtn(btn);
                });

                //绑定按钮点击事件
                pluginEventAttach(btn, 'click', function () {
                    //获取和判断待签名数据
                    var src = config.src();
                    if (!checkParam(src, 'string', true)) {
                        callback(config, 0xE0170005);
                        return;
                    }

                    //获取div中的选择框
                    var deviceSelect = document.getElementById(divConfig.id + 'Select');
                    if (deviceSelect == null) {
                        callback(config, 0xE0170005);
                        return;
                    }

                    //当前没有设备，则返回无法找到设备的返回码
                    if (devList.length == 0) {
                        callback(config, 0xE0170019);
                        return;
                    }

                    //获取当前选中的读卡器名
                    var reader = deviceSelect.options[deviceSelect.selectedIndex].value;
                    var funcID = addFuncIDBind(null, config);
                    if (!Sys.chrome) {
                        eIDPluginObject.eID_Hash(funcID, reader, src, config.type, alg);
                    } else {

                        var strtype = config.type.toString();
                        var strdwAlg = alg.toString();
                        var param = "{\"BtnName\":\"eID_Hash\",\"FuncID\":" + funcID + ",\"reader\":\"" + reader + "\",\"data\": \"" + src + "\", \"type\":\"" + strtype + "\",\"dwAlg\":\"" + strdwAlg + "\"}";
                        chrome.runtime.sendMessage(ExtensionId, { data: param });
                    }
                });
            });
        }
    }

    //内部设置签名函数，根据tag区分签名或本地签名
    function setSign(config, tag) {
        //判断配置和参数是否有效
        if (!checkConfig(config) ||
            !checkParam(config.src, 'function', true) ||
            !checkParam(config.alg, 'number', false)) {
            callback(config, 0xE0170005);
            return;
        }

        var src = config.src();
        if (!checkParam(src, 'string', true)) {
            callback(config, 0xE0170005);
            return;
        }

        //判断和设置alg默认值
        var alg;
        switch (config.alg) {
            case 20:
            case 22:
            case 21:
            case 23:
            case 1:
            case 0:
                alg = config.alg;
                break;
            case undefined:
                alg = 0;
                break;
            default:
                callback(config, 0xE0170007);
                return;
        }

        //获取指定id对应的按钮
        var btn = document.getElementById(config.id);
        if (btn == null) {
            callback(config, 0xE017003F);
            return;
        }

        //判断是否已设置Div
        if (divConfig == null) {
            callback(config, 0xE017003D);
            return;
        }

        //判断div元素是否有效
        var div = document.getElementById(divConfig.id);
        if (div == null) {
            callback(config, 0xE017003F);
            return;
        }

        btn.disabled = true;

        //判断select是否已创建
        var deviceSelect = document.getElementById(divConfig.id + 'Select');
        if (deviceSelect == null) {
            //绑定div创建完成select事件
            $('#' + divConfig.id).bind(divSelectOnloadEventName, function () {
                //绑定选择器选择变化事件
                $('#' + divConfig.id + 'Select').bind('eIDEventItemSelected', function () {
                    disableInvalidCardBtn(btn);
                });

                var clickFun = function () {
                    //获取和判断待签名数据
                    var src = config.src();
                    if (!checkParam(src, 'string', true)) {
                        callback(config, 0xE0170005);
                        return;
                    }

                    //获取div中的选择框
                    var deviceSelect = document.getElementById(divConfig.id + 'Select');
                    if (deviceSelect == null) {
                        callback(config, 0xE0170005);
                        return;
                    }

                    //当前没有设备，则返回无法找到设备的返回码
                    if (devList.length == 0) {
                        callback(config, 0xE0170019);
                        return;
                    }

                    //获取当前选中的读卡器名
                    if (!checkParam(config.inputPin, 'function', false)) {
                        callback(config, 0xE0170005);
                        return;
                    }

                    var reader = deviceSelect.options[deviceSelect.selectedIndex].value;
                    if (null == config.inputPin) {
                        var funcID = addFuncIDBind(null, config, tag);
                        if (!Sys.chrome) {
                            eIDPluginObject.eID_Sign(funcID, reader, src, alg);
                        } else {
                            var stralg = alg.toString();
                            var param = "{\"BtnName\":\"eID_Sign\",\"FuncID\":" + funcID + ", \"reader\":\"" + reader + "\", \"data\": \"" + src + "\", \"type\":\"" + stralg + "\"}";
                            chrome.runtime.sendMessage(ExtensionId, { data: param });
                        }
                    } else {
                        var inputPin = config.inputPin();
                        if (null == inputPin) {
                            var funcID = addFuncIDBind(null, config, tag);
                            if (!Sys.chrome) {
                                eIDPluginObject.eID_SignNoInputPin(funcID, reader, src, alg);
                            } else {
                                var stralg = alg.toString();
                                var param = "{\"BtnName\":\"eID_Nopin\",\"FuncID\":" + funcID + ",\"reader\":\"" + reader + "\",\"data\":\"" + src + "\", \"type\":\"" + stralg + "\"}";
                                chrome.runtime.sendMessage(ExtensionId, { data: param });
                            }
                        } else {
                            if (!checkParam(inputPin, 'string', true)) {
                                callback(config, 0xE0170005);
                                return;
                            }
                            var funcID = addFuncIDBind(null, config, tag, reader, src, alg);
                            if (!Sys.chrome) {
                                eIDPluginObject.eID_VerifyPin(funcID, reader, 0, inputPin);
                            } else {
                                var stralg = alg.toString();
                                var param = "{ \"BtnName\":\"eID_VerifyPin\",\"FuncID\":" + funcID + ", \"reader\": \"" + reader + "\", \"type\":\"0\" ,\"strPin\":\"" + inputPin + "\"}";
                                chrome.runtime.sendMessage(ExtensionId, { data: param });
                            }
                        }
                    }
                }
                pluginEventAttach(btn, 'click', clickFun);
            });
        }
    }

    //初始化Div控件
    function initDiv(div, config, isInstall, isRefresh, cb) {
        var conf = {};

        conf.type = config.type;
        conf.scroll = config.isScroll;
        conf.installed = isInstall;
        conf.width = '260px';
        $(div).eIDselect(conf, cb);
        if (isRefresh) {
            $(div).eIDselect('refresh');
        }
    }

    //添加一条记录到设备列表
    function addRecToDevList(config, devList, reader, bankname, banklogo, cardtype, cardno, allCallback) {
        devList.push({
            readerName: reader,
            issueBank: bankname,
            bankTailNumer: cardno,
            bankCardType: cardtype,
            logoUrl1: banklogo,
            logoUrl2: banklogo
        });
        allCallback(devList);
    }

    //更新设备div显示设备信息列表
    function refleshDivDev(obj, devList) {
        if (isUIOK == false) {
            return;
        }
        var serialSelect = $(obj).find("select").get(0);

        selectedDevice = serialSelect.value;
        while (serialSelect.options.length > 0) {
            serialSelect.remove(0);
        }
        if (devList.length != 0) {
            for (var i = 0; i < devList.length; i++) {
                var reader = devList[i].readerName;
                var item = new Option(devList[i].bankTailNumer, reader);
                $(item).attr("issueBank", devList[i].issueBank);
                var tailNum = devList[i].bankTailNumer;
                if (tailNum.length > 0) {
                    tailNum = '尾号:' + tailNum;
                }
                $(item).attr("bankTailNumer", tailNum);
                $(item).attr("bankCardType", devList[i].bankCardType);
                $(item).attr("logoUrl1", devList[i].logoUrl1);
                serialSelect.options.add(item);
                if (selectedDevice == reader) {
                    item.selected = true;
                }
            }
        }
        $(obj).eIDselect("refresh");
    }

    //绑定事件
    function pluginEventAttach(elem, eventName, func, isCustumEvt) {
        if (isCustumEvt) {
            elem.addEventListener(eventName, func, false);
        } else {
            if (elem.attachEvent != null) {
                elem.attachEvent('on' + eventName, func);
            } else if (elem.addEventListener != null) {
                elem.addEventListener(eventName, func, false);
            }
        }
    }

    //内部封装回调函数
    function callback(config, retVal, dataVal) {
        if (config != null && typeof (config) == 'object' && typeof (config.callback) == 'function') {
            //返回码中文字符串
            var msgVal = '';
            //若已加载控件则调用控件方法解析中文
            if (!Sys.chrome) {
                if (eIDPluginObject != null/* && typeof (eIDPluginObject) == 'object'*/ && eIDPluginObject.eID_GetMessage != null) {
                    msgVal = eIDPluginObject.eID_GetMessage(retVal);
                } else {
                    msgVal = getErrMsg(retVal);
                }
            } else {
                msgVal = getErrMsg4Chrome(retVal);
            }

            //构造回调返回参数
            var evt;
            if (dataVal == null) {
                evt = {
                    rv: retVal,
                    msg: msgVal
                };
            } else {
                evt = {
                    rv: retVal,
                    msg: msgVal,
                    data: dataVal
                };
            }

            //执行回调函数
            config.callback(evt);
        }
    }

    //设备变化回调函数
    function devChangeCallback(cb, num, selReader) {
        if (cb == null || typeof (cb) != 'function') {
            return;
        }

        var evt = {
            count: num,
            reader: selReader
        };

        cb(evt);
    }

    //检查输入配置是否有效
    function checkConfig(config) {
        if (config == null || typeof (config) != 'object') {
            return false;
        }
        return true;
    }

    //检查输入参数是否有效
    function checkParam(param, type, isNess) {
        if (!isNess) {
            if (param === undefined) {
                return true;
            }
        }

        if (typeof (param) != type) {
            return false;
        }

        return true;
    }

    //禁止无效eID卡的按钮点击
    function disableInvalidCardBtn(btn) {
        var deviceSelect = document.getElementById(divConfig.id + 'Select');
        if (deviceSelect.options.length == 0) {
            btn.disabled = true;
            return;
        }
        var selectContent = deviceSelect.options[deviceSelect.selectedIndex].outerHTML;
        if (selectContent.indexOf('无效eID卡') != -1) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
    }

    //判断接口是否完整
    function isInterfaceFull() {
        if (!Sys.chrome) {
            eIDPluginObject = document.getElementById('eIDPlugin');
            if (eIDPluginObject == null ||
                eIDPluginObject.eID_GetVersion == null ||
                eIDPluginObject.eID_GetMessage == null ||
                eIDPluginObject.eID_GetReaderList == null ||
                eIDPluginObject.eID_DetectCardBegin == null ||
                eIDPluginObject.eID_DetectCardEnd == null ||
                eIDPluginObject.eID_Hash == null ||
                eIDPluginObject.eID_Sign == null ||
                eIDPluginObject.eID_VerifyPin == null ||
                eIDPluginObject.eID_SignNoInputPin == null) {
                return false;
            }
        }
        return true;
    }

    //获取浏览器类型
    function getBrowseType() {
        var Sys = {};

        var ua = navigator.userAgent.toLowerCase();
        var s = ua.match(/chrome\/([\d.]+)/);
        if (s) {
            var chromeArray = s[1].split('.');
            if (chromeArray[0] >= 42) {
                Sys.chrome = s;
            }
        }
        return Sys;
    }

    if (Sys.chrome) {
        //window.onload加载chrome插件的div
        attach(window, 'load', function () {
            outputDiv = document.createElement('div');
            outputDiv.id = 'eIDHiddenOutputDiv';
            outputDiv.style.display = 'none';
            document.body.appendChild(outputDiv);
        });

        //window.onbeforeunload时发送chrome退出消息
        attach(window, 'onbeforeunload', function () {
            if (dwExit) {
                var param = "{\"BtnName\":\"eID_Exit\"}";
                chrome.runtime.sendMessage(ExtensionId, { data: param });
            }
        });

        function PutErrMsg4Chrome(array) {
            if (array[1] != 0) {
                var msgnum = 0;
                var msg = new Array(2);
                msg[0] = parseInt(array[1], 10);
                msg[1] = array[2];

                for (var i = 0; i < MsgId; i++) {
                    msgnum = parseInt(message[i][0], 10);
                    if (msg[0] == msgnum) {
                        return;
                    }
                }

                if (msg[0] != msgnum) {
                    message.push(msg);
                    MsgId++;
                    return;
                }
            }
        }

        function getErrMsg4Chrome(rv) {
            if (message != null) {
                for (var m = 0; m < message.length; m++) {
                    if (message[m][0] == rv) {
                        return msgVal = message[m][1];
                    }
                }
                return msgVal = getErrMsg(rv);
            }
        }
    }
}