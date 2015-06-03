Ext.define('Layout.func.Select',{
	
	TYPE_FACTOR : 1,
	TYPE_RELATION :2 ,
	TYPE_FACTOR_PROP : 3,
	TYPE_RELATION_PROP : 4,
	
	constructor: function(config){
        Ext.apply(this, config);
    },
    
    items:[
           	'editFactorPropGrid',
           	'editRelationPropGrid',
           	'DrawController',
           	'baseFactorPropGrid'
           ],
	         
    init : function(){
    	Ext.Array.each(this.items, function(item, index){
    		var component = item;
    		
    		if(Ext.isString(component)){
    			component = Ext.getCmp(item);
    		}
    		if(!component){
    			component = Layout[item];
    		}
    		this.items[index] = component;
    		
    		component && component.initRowSelect && component.initRowSelect.call(component);
    	}, this);
    },
    
    cancelSelect : function(){
    	Ext.Array.each(this.items, function(component){
    		component.cancelSelect && component.cancelSelect.call(component);
    	});
    },
    
    getSelect : function(){
    	var srcArray = Layout.Select.items,
			i,
			selectRecord;
		
		i = Ext.Array.each(srcArray, function(src){
			selectRecord = src && src.getSelectRecord();
			
			if(selectRecord){
				return false;
			}
		});
		if(Ext.isNumber(i) && selectRecord[0]){
            /*
			return {
				type : selectRecord.type,
				record : selectRecord.record
			};
			*/
            return {
                type : selectRecord[0].type,
				record : selectRecord
			};
		}
		return null;
    }
});