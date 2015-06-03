(function(win){
	var SEQ = {};
	
	SEQ.seq = function(name, findName){
		var i = 1,
			newName = name+1;
		
		if(!findName){
			return newName;
		}
		while(findName(newName)){
			i++;
			newName = name+i;
		}
		
		return newName;
	};
	
	win.SEQ = SEQ;
})(window);
