function ajax(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    //创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.withCredentials = true;

    //接收 - 第三步
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML);
            } else {
                options.fail && options.fail(status);
            }
        }
    }
    //连接 和 发送 - 第二步
        if (options.type == "GET") {
            xhr.open("GET", options.url, true);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhr.send(JSON.stringify(options.data));
        }

}
var Height=document.body.offsetHeight,pageHeight=document.getElementsByClassName("page")[0]
    ,contentHeight=document.getElementsByClassName("page-content")[0];
pageHeight.style.height=Height+"px";
contentHeight.style.height=Height-50+"px";

// var url="http://localhost:8010/llpt/api/v1/";
var url="https://llpt-bos.ballpie.com/llpt/bos/v1/";
var joinWork=document.getElementsByClassName('submit')[0],joinStatus=0,item={},
    backMes=document.getElementsByClassName('header-price')[0],
    statusObj={
        0:"报名参加 ",
        1:"报名中",
        2:"已报名",
    };
//var base='http://localhost:8888/llptweb/src/h5Web/one.html?eyJ0YXNrU2hvcnROYW1lIjoiaDVKb2JDZW50ZXIxIiwidXNlcklkIjoxNTc1fQ==';
function loadStatus() {
    ajax({
        url:url+'task/userConfig?userId='+item.userId+'&taskShortName='+item.taskShortName,
        type: "POST",
        dataType: "json",
        success:function (response) {
            let {status,data}=JSON.parse(response);
            if(status==0){
                // backMes.innerHTML=JSON.stringify(data);
                joinStatus=data.taskStaus;
                joinWork.innerHTML=statusObj[joinStatus];
                if(joinStatus!=0){
                    joinWork.classList.add("complete");
                }
            }
        }
    })
}
var base =window.location.href.split("?")[1];
try{
    if(base){
        base = base.replace('!', '/').replace('*', '+');
        item = JSON.parse(Base64.decode(base));
        this.loadStatus();
    }
}catch(err) {
    console.log(err)
}
function submitBtn(){
    if(joinStatus==0){
        ajax({
            url:url+'task/complete?userId='+item.userId+'&taskShortName='+item.taskShortName,
            type: "POST",
            dataType: "json",
            success:function (response) {
                let {status}=JSON.parse(response);
                if(status==0){
                    loadStatus();
                }
            }
        })
    }
}