(function(win){

var MyInterceptor = {};

MyInterceptor.openListeners = [];

MyInterceptor.oriXOpen = XMLHttpRequest.prototype.open; 
XMLHttpRequest.prototype.open = function(method,url,asncFlag,user,password) {
    for(var i=0;i<MyInterceptor.openListeners.length;i++){
    	url = MyInterceptor.openListeners[i].call(MyInterceptor, method,url,asncFlag,user,password);
    }
    console.log("interceptor ajax :"+method +" "+url);
    MyInterceptor.oriXOpen.call(this,method,url,asncFlag,user,password); 
};

win.MI = MyInterceptor;
})(window);
