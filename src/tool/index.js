function getClassName(cl) {
    return document.getElementsByClassName(cl)
}
//输出保留两位小数
function Format(myFloat){
    return Math.round(myFloat*Math.pow(10,2))/Math.pow(10,2);
}
//输出保留六位小数
function FormatNum(myFloat,num){
    return Math.round(myFloat*Math.pow(10,num))/Math.pow(10,num);
}
//错误信息
var clock=true,timer;
function opacityMes(errorMes) {
    var mes=document.getElementsByClassName("errorMes")[0];
    if(clock){
        clock=false;
        mes.innerHTML=errorMes;
        mes.style.opacity="0.8";
        var op=mes.style.opacity*1;
        timer=setInterval(function () {
            if(op<0){
                clearInterval(timer);
                timer = null;
                clock=true;
                return
            }
            op = op - 0.02*(1.1-op);
            mes.style.opacity=op;
        },40);
    }
}



//空数据公共函数
function CheckEmpty(curObj, msg){
    var re = /[^0-9|\.]/;
    if(msg==null) msg="";
    if(curObj.value==''){
        opacityMes(msg + "不可为空");
        return true;
    }
    else if(re.test(curObj.value)){
        opacityMes(msg + "不是数字");
        return true;
    }
}

//输入为正数
function CheckElem(curObj, msg){
    if (CheckEmpty(curObj, msg)) return false;
    var re = /^([1-9]\d*((.\d+)*))|^(0\.\d*[1-9]\d*)/;
    if (!re.test(curObj.value))
    {
        opacityMes(msg + "必须为正数");
        return false;
    }
    return true;
}

//1输入为非负数
function CheckElem1(curObj, msg){
    if (CheckEmpty(curObj, msg)) return false;
    var re = /^\d+(\.\d+)?$/;
    if (!re.test(curObj.value))
    {
        opacityMes(msg + "必须为非负数");
        return false;
    }
    return true;
}
//2输入正整数
function CheckElem2(curObj, msg){
    if (CheckEmpty(curObj, msg)) return false;
    var re = /^[0-9]*[1-9][0-9]*$/;
    if (!re.test(curObj.value))
    {
        opacityMes(msg + "必须为正整数");
        return false;
    }
    return true;
}

//3输入非负整数
function CheckElem3(curObj, msg){
    if (CheckEmpty(curObj, msg)) return false;
    var re = /^[1-9]d*|0$/;
    if (!re.test(curObj.value))
    {
        opacityMes(msg + "必须为非负整数");
        return false;
    }
    return true;
}

