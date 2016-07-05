document.write("<script language=javascript src='js/md5.js' charset=\"utf-8\"></script>");
var loginstatus = null;
var userInfo = null;
var deviceInfo = null;
var app = {
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
                    document.getElementById('getimmediate').src="images/2.png";
                }
                else{
                    document.getElementById('getimmediate').src="images/3.png";
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
    coocaaosapi.hasCoocaaUserLogin(function(message) {
            console.log("haslogin " + message.haslogin);
            loginstatus = message.haslogin;
            console.log("haslogin " + loginstatus);
                if (loginstatus == "false") {
                    coocaaosapi.startThirdQQAccount(function(message) {console.log(message); },function(error) { console.log(error);});
                    // document.getElementById('getimmediate').src="images/3.png";
                    coocaaosapi.addUserChanggedListener(function(message){
                        console.log(message);
                        document.getElementById('getimmediate').src="images/3.png";
                    });
                }

                else{
document.getElementById('loading').style.display="block";
        coocaaosapi.getUserInfo(function(message) {
           // document.getElementById('userinfoid').innerHTML = message.open_id;
           //console.log(message);
           userInfo = message;
           qqinfo = message.external_info;
           
           qqtoken1 = JSON.parse(qqinfo);
           qqtoken = qqtoken1[0].openId;
           console.log(qqtoken);

           coocaaosapi.getDeviceInfo(function(message) {
            deviceInfo = message;
            
            console.log(JSON.stringify(deviceInfo));

 


            sendHTTP1();



        // document.getElementById('systeminfoid').value = JSON.stringify(message);
            },function(error) { console.log(error);});


        },function(error) { console.log(error);});
                        }
            },function(error) { console.log(error);});


















//     var pigsrc = document.getElementById('getimmediate').src;
//     console.log(pigsrc);
//     console.log("status"+loginstatus);
//     if(pigsrc == "http://beta.webapp.skysrt.com/games/vip/images/2.png"){
//         coocaaosapi.startThirdQQAccount(function(message) {console.log(message); },function(error) { console.log(error);});
//         // document.getElementById('getimmediate').src="images/3.png";
//         coocaaosapi.addUserChanggedListener(function(message){
//             console.log(message);
//             document.getElementById('getimmediate').src="images/3.png";
//         });

//         }

//     else{
//         document.getElementById('loading').style.display="block";
//         coocaaosapi.getUserInfo(function(message) {
//            // document.getElementById('userinfoid').innerHTML = message.open_id;
//            //console.log(message);
//            userInfo = message;
//            qqinfo = message.external_info;
           
//            qqtoken1 = JSON.parse(qqinfo);
//            qqtoken = qqtoken1[0].openId;
//            console.log(qqtoken);

//            coocaaosapi.getDeviceInfo(function(message) {
//             deviceInfo = message;
            
//             console.log(JSON.stringify(deviceInfo));

 


//             sendHTTP1();



//         // document.getElementById('systeminfoid').value = JSON.stringify(message);
//             },function(error) { console.log(error);});


//         },function(error) { console.log(error);});
//     }
// }

function getsuccess(){
    
    document.getElementById("getimmediate").removeEventListener("click",experienceonclick ,false);
    document.getElementById("getimmediate").addEventListener("click", experience);
}



function sendHTTP1() {

    var md5string = "open_id=" + userInfo.open_id + "&chip=" + deviceInfo.type + "&mac=" + deviceInfo.mac + "&model=" + deviceInfo.model + "&schemeId=1&skyworth";
    console.log(md5string);
    var md5sign = md5(md5string);
     console.log(md5sign);
    $.ajax({
             
             type: "GET",
             async: true,//url问题
             url: "http://10.10.2.58:8089/index.html",
             data: {userinfo:JSON.stringify(userInfo),device:JSON.stringify(deviceInfo),qqToken:qqtoken,schemeId:"1",sign:md5sign},
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
    if(data.result.code=="0")
    {
        console.log(data.result.code);
        document.getElementById('loading').style.display="none";
        document.getElementById("getimmediate").src="images/5.png";
        getsuccess();
    }
    else if(data.result.code=="9"){
        console.log(data.result.code);
        document.getElementById('loading').style.display="none";
        document.getElementById('info').style.display="block";
        getsuccess();
    }
    else if(data.result.code=="7"){
        document.getElementById('loading').style.display="none";
        document.getElementById('failnow').style.display="block";
        getsuccess();
    }
    else if(data.result.code=="3"){
        document.getElementById('loading').style.display="none";
        document.getElementById('failnow').style.display="block";
        getsuccess();
    }
    else if(data.result.code=="2"){
        document.getElementById('loading').style.display="none";
        document.getElementById('failvip').style.display="block";
        getsuccess();
    }
}
