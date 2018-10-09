
// var baseUrl='http://localhost:8010/llpt/api/v1/';
// var baseUrl='http://localhost:8020/llpt/bos/v1/';
//测试环境
//var baseUrl='https://test-agent.ballpie.com/llpt/bos/v1/';
//生产环境
var baseUrl='https://llpt-bos.ballpie.com/llpt/bos/v1/';


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
        xhr.open("GET", baseUrl+options.url, true);
        xhr.send(null);
    } else if (options.type == "POST") {
        xhr.open("POST", baseUrl+options.url, true);
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.send(JSON.stringify(options.data));
    }
}