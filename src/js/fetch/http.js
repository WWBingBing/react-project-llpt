import 'whatwg-fetch'
import 'es6-promise'
import { Base64 } from 'js-base64';

import  md5  from "blueimp-md5"
//  "proxy": "https://llpt-bos.ballpie.com",
let baseUrl='/llpt/bos/v1/';
let NODE_ENV=process.env.NODE_ENV;
let Az="llptappv1:da0584db6e";
//if(NODE_ENV=="development"||NODE_ENV=="test"){
//  Az="id1234:secret123"
//}

const http=(url)=>{
    return fetch(baseUrl+url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization":`Basic ${Base64.encode(Az)}`
        },
        body:{}
    })
};







export const loginPost=(url)=>{
    return http(url).then(function(response) {
        return response.json();
    }).then((data)=>{
        return data
    }).catch(()=>{
        throw '服务器返回参数错误'
    })
};


const refresh=()=>{
    let {refresh_token}=JSON.parse(sessionStorage.getItem("info"));
    return http("oauth/token?grant_type=refresh_token&refresh_token="+refresh_token).then(function(response) {
        return response.json();
    }).then((data)=>{
        return data;
    }).catch(()=>{
        throw '更新失败'
    })
};



export const post=(url, paramsObj,methods="POST")=>{
    let {Authorization,jti}=JSON.parse(sessionStorage.getItem("info"));
    let _t=new Date().getTime(),_n=Math.floor(Math.random()*100000);
    let _jti=jti.replace(/-/g,"").substring(0,18);
    let sign=md5(""+_t+_n+_jti);
    return new Promise((resolve, reject)=> {
        let urlSign= url.indexOf("?")!=-1 ? url+`${'&_t='+_t+'&_n='+_n+"&_s="+sign}` :url+`${'?_t='+_t+'&_n='+_n+"&_s="+sign}`;
        fetch(baseUrl+urlSign, {
            method: methods,
            credentials: 'include',
            headers: {
                "Content-Type": 'application/json',
                "Authorization":Authorization
            },
            body: methods=="POST" ? JSON.stringify(paramsObj) : {}
        }).then(function(response) {
            return response.json();
        }).then((data)=>{
            if(data.status==401){
                return refresh().then((dataRef)=>{
                    if(dataRef.access_token){
                        dataRef.Authorization=dataRef.token_type+" "+dataRef.access_token;
                        sessionStorage.setItem("info",JSON.stringify(dataRef));
                    }else if(dataRef.status==401){
                        sessionStorage.clear();
                        window.location.href="#/login"
                    }
                }).then(()=>{
                    return post(url, paramsObj).then((data)=>{
                        resolve(data)
                    }).catch(()=>{
                        reject('服务器错误')
                    })
                });
            }else{
                resolve(data)
            }
        }).catch(()=>{
            reject('服务器错误')
        })
    })
};



