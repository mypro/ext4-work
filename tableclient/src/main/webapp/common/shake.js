(function(win){

var SHAKE = {};
SHAKE.preventShake = function(name, time, scope){
	var current = new Date().getTime();
	var key = name+"-runtime";
	if(!scope[key]){
		scope[key] = 0;
	}
	time = time || 500;
	if(current - scope[key] > time){
		scope[key] = current;
		return true;
	}else{
		return false;
	}
};
win.SHAKE = SHAKE;
})(window);
