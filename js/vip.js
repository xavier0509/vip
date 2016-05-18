// document.write("<script language=javascript src='js/md5.js' charset=\"utf-8\"></script>");
var loginstatus = null;
var userInfo = null;
var deviceInfo = null;
var app = {
    canonical_uri:function(src, base_path) 
    {
        var root_page = /^[^?#]*\//.exec(location.href)[0],
        root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0],
        absolute_regex = /^\w+\:\/\//;
        // is `src` is protocol-relative (begins with // or ///), prepend protocol  
        if (/^\/\/\/?/.test(src)) 
        {  
        src = location.protocol + src; 
        }  
    // is `src` page-relative? (not an absolute URL, and not a domain-relative path, beginning with /)  
        else if (!absolute_regex.test(src) && src.charAt(0) != "/")  
        {  
            // prepend `base_path`, if any  
            src = (base_path || "") + src; 
        }
    // make sure to return `src` as absolute  
        return absolute_regex.test(src) ? src : ((src.charAt(0) == "/" ? root_domain : root_page) + src);  
    },
    
    rel_html_imgpath:function(iconurl)
    {
        console.log(app.canonical_uri(iconurl.replace(/.*\/([^\/]+\/[^\/]+)$/, '$1')));
        return app.canonical_uri(iconurl.replace(/.*\/([^\/]+\/[^\/]+)$/, '$1'));
    },

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        coocaaosapi.hasCoocaaUserLogin(function(message) {
            console.log("haslogin " + message.haslogin);
            loginstatus = message.haslogin;
            console.log("haslogin " + loginstatus);
                if (loginstatus == "false") {
                    document.getElementById('pic_info').src=app.rel_html_imgpath(__uri("../images/login.png"));
                }
                else{
                    document.getElementById('pic_info').src=app.rel_html_imgpath(__uri("../images/get.png"));
                }
            },function(error) { console.log(error);});
        //console.log("haslogin " + loginstatus);

        

        
        app.triggleButton();

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelectorAll('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        for( var i = 0 , j = receivedElement.length ; i < j ; i++ ){
            receivedElement[i].setAttribute('style', 'display:block;');
        }
      /*receivedElement.setAttribute('style', 'display:block;');*/
        document.getElementById('getimmediate').focus();
        console.log('Received Event: ' + id);
    },
    triggleButton:function(){
        cordova.require("coocaa-plugin-coocaaosapi.coocaaosapi");
        
        document.getElementById("getimmediate").addEventListener("click",experienceonclick ,false);

        // document.getElementById("gethaslogin").addEventListener("click", function (){
        //             coocaaosapi.hasCoocaaUserLogin(function(message) {
        //             console.log("haslogin " + message.haslogin);
        //             document.getElementById('hasloginid').value = JSON.stringify(message);
        //             },function(error) { console.log(error);})
        //         },false);
            
    }
};

app.initialize();

function experience(){
    console.log("success");
    navigator.app.exitApp();//退出问题！！！！！
}


function experienceonclick(){
    // var pigsrc = document.getElementById('pic_info').src;
    // console.log(pigsrc);
    console.log("status"+loginstatus);
    if(loginstatus=="false"){
        coocaaosapi.startThirdQQAccount(function(message) {console.log(message); },function(error) { console.log(error);});
        // document.getElementById('getimmediate').src="images/3.png";
        coocaaosapi.addUserChanggedListener(function(message){
            console.log(message);
            document.getElementById('pic_info').src=app.rel_html_imgpath(__uri("../images/get.png"));
            loginstatus = "true";
        });

        }

    else{
        
        coocaaosapi.getUserInfo(function(message) {
           // document.getElementById('userinfoid').innerHTML = message.open_id;
           //console.log(message);
           userInfo = message;
           qqinfo = message.external_info;
           
           qqtoken1 = JSON.parse(qqinfo);
           console.log(qqtoken1);
           if (qqtoken1!=""&&qqtoken1!=null) {
            document.getElementById('loading').style.display="block";
               qqtoken = qqtoken1[0].openId;
               console.log(qqtoken);

               coocaaosapi.getDeviceInfo(function(message) {
                deviceInfo = message;
                
                console.log(JSON.stringify(deviceInfo));
                sendHTTP1();
            // document.getElementById('systeminfoid').value = JSON.stringify(message);
                },function(error) { console.log(error);});

            }
            else{
                coocaaosapi.startThirdQQAccount(function(message) {console.log(message); },function(error) { console.log(error);});
            }
        }
        ,function(error) { console.log(error);});
    }
}

function getsuccess(){
    
    document.getElementById("getimmediate").removeEventListener("click",experienceonclick ,false);
    document.getElementById("getimmediate").addEventListener("click", experience);
}



function sendHTTP1() {

    var oldType = deviceInfo.type;
    console.log(oldType);
    var md5string = "open_id=" + userInfo.open_id +  "&mac=" + deviceInfo.mac + "&model=" + deviceInfo.model + "&schemeId=1&skyworth";
    console.log(md5string);
    var md5sign = md5(md5string);
     console.log(md5sign);
    $.ajax({
             
             type: "GET",
             async: true,//url问题
             url: "http://10.10.2.58:8089/index.html",
             // url: "http://42.121.113.121:8094/ActivityPromotion/index.html",//http://active.tc.skysrt.com正式接口
             data: {userinfo:JSON.stringify(userInfo),device:JSON.stringify(deviceInfo),qqToken:qqtoken,schemeId:"1",type:"1",sign:md5sign},
             dataType:"jsonp",
             jsonp:"callback",
             jsonpCallback: "receive",
             success: function(data){
                 //console.log("start ajax");
                //          if (data.code=="0"){
                //             getsuccess();                              
                //          }
                //          else{
                //             console.log("error");
                //          }

                      },
             error: function(){ 
                console.log("error"); 
                // getsuccess();
                // if(false){
                //     document.getElementById('info').style.display="block";
                // }
                // else{
                //     document.getElementById('failnow').style.display="block";
                // }
                
            } 
         });
}

function receive(data) {
    //alert("receive!" + data);
    console.log("receive" + data);
    console.log(data.result.code);
    if(data.result.code=="0")//成功
    {
        console.log(data.result.code);
        document.getElementById('loading').style.display="none";
        document.getElementById('pic_info').style.display="none";
        document.getElementById("getimmediate").src=app.rel_html_imgpath(__uri("../images/5.png"));
        getsuccess();
    }
    else if(data.result.code=="9"){//抱歉，您已经领取过了
        console.log(data.result.code);
        document.getElementById('loading').style.display="none";
        document.getElementById('failnow').style.display="block";
        getsuccess();
    }
    else if(data.result.code=="7"){//服务器异常，请稍后再试
        document.getElementById('loading').style.display="none";
        document.getElementById('info').style.display="block";
        getsuccess();
    }
    else if(data.result.code=="3"){//服务器异常，请稍后再试
        document.getElementById('loading').style.display="none";
        document.getElementById('failnow').style.display="block";
        getsuccess();
    }
    else if(data.result.code=="2"){//开通会员失败
        document.getElementById('loading').style.display="none";
        document.getElementById('failvip').style.display="block";
        getsuccess();
    }
}


function md5(string){
        function md5_RotateLeft(lValue, iShiftBits) {
                return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
        }
        function md5_AddUnsigned(lX,lY){
                var lX4,lY4,lX8,lY8,lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                        if (lResult & 0x40000000) {
                                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                        } else {
                                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                        }
                } else {
                        return (lResult ^ lX8 ^ lY8);
                }
        }         
        function md5_F(x,y,z){
                return (x & y) | ((~x) & z);
        }
        function md5_G(x,y,z){
                return (x & z) | (y & (~z));
        }
        function md5_H(x,y,z){
                return (x ^ y ^ z);
        }
        function md5_I(x,y,z){
                return (y ^ (x | (~z)));
        }
        function md5_FF(a,b,c,d,x,s,ac){
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        }; 
        function md5_GG(a,b,c,d,x,s,ac){
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };
        function md5_HH(a,b,c,d,x,s,ac){
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        }; 
        function md5_II(a,b,c,d,x,s,ac){
                a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
                return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };
        function md5_ConvertToWordArray(string) {
                var lWordCount;
                var lMessageLength = string.length;
                var lNumberOfWords_temp1=lMessageLength + 8;
                var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
                var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
                var lWordArray=Array(lNumberOfWords-1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while ( lByteCount < lMessageLength ) {
                        lWordCount = (lByteCount-(lByteCount % 4))/4;
                        lBytePosition = (lByteCount % 4)*8;
                        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                        lByteCount++;
                }
                lWordCount = (lByteCount-(lByteCount % 4))/4;
                lBytePosition = (lByteCount % 4)*8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
                lWordArray[lNumberOfWords-2] = lMessageLength<<3;
                lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
                return lWordArray;
        }; 
        function md5_WordToHex(lValue){
                var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
                for(lCount = 0;lCount<=3;lCount++){
                        lByte = (lValue>>>(lCount*8)) & 255;
                        WordToHexValue_temp = "0" + lByte.toString(16);
                        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
                }
                return WordToHexValue;
        };
        function md5_Utf8Encode(string){
                string = string.replace(/\r\n/g,"\n");
                var utftext = ""; 
                for (var n = 0; n < string.length; n++) {
                        var c = string.charCodeAt(n); 
                        if (c < 128) {
                                utftext += String.fromCharCode(c);
                        }else if((c > 127) && (c < 2048)) {
                                utftext += String.fromCharCode((c >> 6) | 192);
                                utftext += String.fromCharCode((c & 63) | 128);
                        } else {
                                utftext += String.fromCharCode((c >> 12) | 224);
                                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                                utftext += String.fromCharCode((c & 63) | 128);
                        } 
                } 
                return utftext;
        }; 
        var x=Array();
        var k,AA,BB,CC,DD,a,b,c,d;
        var S11=7, S12=12, S13=17, S14=22;
        var S21=5, S22=9 , S23=14, S24=20;
        var S31=4, S32=11, S33=16, S34=23;
        var S41=6, S42=10, S43=15, S44=21;
        string = md5_Utf8Encode(string);
        x = md5_ConvertToWordArray(string); 
        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476; 
        for (k=0;k<x.length;k+=16) {
                AA=a; BB=b; CC=c; DD=d;
                a=md5_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
                d=md5_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
                c=md5_FF(c,d,a,b,x[k+2], S13,0x242070DB);
                b=md5_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
                a=md5_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
                d=md5_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
                c=md5_FF(c,d,a,b,x[k+6], S13,0xA8304613);
                b=md5_FF(b,c,d,a,x[k+7], S14,0xFD469501);
                a=md5_FF(a,b,c,d,x[k+8], S11,0x698098D8);
                d=md5_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
                c=md5_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
                b=md5_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
                a=md5_FF(a,b,c,d,x[k+12],S11,0x6B901122);
                d=md5_FF(d,a,b,c,x[k+13],S12,0xFD987193);
                c=md5_FF(c,d,a,b,x[k+14],S13,0xA679438E);
                b=md5_FF(b,c,d,a,x[k+15],S14,0x49B40821);
                a=md5_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
                d=md5_GG(d,a,b,c,x[k+6], S22,0xC040B340);
                c=md5_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
                b=md5_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
                a=md5_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
                d=md5_GG(d,a,b,c,x[k+10],S22,0x2441453);
                c=md5_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
                b=md5_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
                a=md5_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
                d=md5_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
                c=md5_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
                b=md5_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
                a=md5_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
                d=md5_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
                c=md5_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
                b=md5_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
                a=md5_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
                d=md5_HH(d,a,b,c,x[k+8], S32,0x8771F681);
                c=md5_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
                b=md5_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
                a=md5_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
                d=md5_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
                c=md5_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
                b=md5_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
                a=md5_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
                d=md5_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
                c=md5_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
                b=md5_HH(b,c,d,a,x[k+6], S34,0x4881D05);
                a=md5_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
                d=md5_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
                c=md5_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
                b=md5_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
                a=md5_II(a,b,c,d,x[k+0], S41,0xF4292244);
                d=md5_II(d,a,b,c,x[k+7], S42,0x432AFF97);
                c=md5_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
                b=md5_II(b,c,d,a,x[k+5], S44,0xFC93A039);
                a=md5_II(a,b,c,d,x[k+12],S41,0x655B59C3);
                d=md5_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
                c=md5_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
                b=md5_II(b,c,d,a,x[k+1], S44,0x85845DD1);
                a=md5_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
                d=md5_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
                c=md5_II(c,d,a,b,x[k+6], S43,0xA3014314);
                b=md5_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
                a=md5_II(a,b,c,d,x[k+4], S41,0xF7537E82);
                d=md5_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
                c=md5_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
                b=md5_II(b,c,d,a,x[k+9], S44,0xEB86D391);
                a=md5_AddUnsigned(a,AA);
                b=md5_AddUnsigned(b,BB);
                c=md5_AddUnsigned(c,CC);
                d=md5_AddUnsigned(d,DD);
        }
return (md5_WordToHex(a)+md5_WordToHex(b)+md5_WordToHex(c)+md5_WordToHex(d)).toLowerCase();
}