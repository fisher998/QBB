export function datatosignbase64 () {
    var myTime = new Date();
    var yyyy = myTime.getFullYear();
    var MM = myTime.getMonth() + 1;
    var dd = myTime.getDate();
    var HH = myTime.getHours();
    var mm = myTime.getMinutes();
    var ss = myTime.getSeconds();
    var myTimeStr = "" + yyyy + (MM > 9 ? MM : "0" + MM) + (dd > 9 ? dd : "0" + dd) + (HH > 9 ? HH : "0" + HH) + (mm > 9 ? mm : "0" + mm) + (ss > 9 ? ss : "0" + ss);
    var eidHmacText = myTimeStr + ":hello:92ECADDA8CCAB73DB7B31AE3AE969844440ABE141F1D14C8749E5C9EBF6C41C6";
    var b = new Base64();
    var datatosignbase64 = b.encode(eidHmacText);
    return datatosignbase64;
}