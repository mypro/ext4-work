Ext.define('Layout.event.EventContext',{
	
	STOP_CALLBACK : 'stopCallback',
	
	constructor: function(config){
		
        this.context = Ext.apply({}, config);
    },
	
	set : function(key, value){
		this.context[key]=value;
		return this;
	},

	get : function(key){
		return this.context[key];
	},

	stopCallback : function(){
		this.set(this.STOP_CALLBACK, true);
	},

	isStopCallback : function(){
		return this.get(this.STOP_CALLBACK);
	},
	
	getPapers : function(){
		var papers = [],
			paper = this.get('paper');
		
		if(paper){
			papers.push(paper);
		}else{
			papers = Layout.DrawController.getPapers();
		}
		return papers;
	},
	
	eachPaper : function(fn){
		var papers = this.getPapers();
		
		Ext.Array.each(papers, function(){
			fn.apply(this, arguments);
		});
		
		return papers;
	},

	clear : function(key){
		if(key){
			this.context[key] = null;
		}else{
			this.context = {};
		}
	}
});