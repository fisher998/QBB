export function timeDisposal(time) {
    var myTime = new Date(time);
    var yyyy = myTime.getFullYear();
    var MM = myTime.getMonth() + 1;
    var dd = myTime.getDate();
    var HH = myTime.getHours();
    var mm = myTime.getMinutes();
    var ss = myTime.getSeconds();
    var myTimeStr = "" + yyyy + '-' + (MM > 9 ? MM : "0" + MM) + '-' + (dd > 9 ? dd : "0" + dd) + ' ' + (HH > 9 ? HH : "0" + HH) + ':' + (mm > 9 ? mm : "0" + mm) + ':' + (ss > 9 ? ss : "0" + ss);
    return myTimeStr;
}