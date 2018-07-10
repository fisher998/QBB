const telReg = /^1[34578]\d{9}$/;

const passwordReg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]{6,}$/;
// const passwordReg = /^\d+$/;

const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

const graphReg = /^\d{4}$/;

const IDCardNoReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

const creditCodeReg = /^[A-Z0-9]{18}$/;
export {
    telReg,
    passwordReg,
    emailReg,
    graphReg,
    creditCodeReg,
    IDCardNoReg
};
