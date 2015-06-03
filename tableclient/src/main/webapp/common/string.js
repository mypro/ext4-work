var Str = {};

Str.lengthOf = function(str){
	var str=str.replace(/[^\x00-\xff]/g, 'xx');
	return str.length;
};