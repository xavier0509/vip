$(function(){

    var wid=document.body.clientWidth;
    console.log(wid);
    if (wid<1400) {
        $("#getimmediate").css("width","66%");
        $("#getimmediate").css("height","66%");
    }
 });