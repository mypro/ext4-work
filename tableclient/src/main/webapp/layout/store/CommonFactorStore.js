Ext.define('Layout.store.CommonFactorStore', 
{
	extend: 'Ext.data.Store',
    
    model : 'Layout.model.CommonFactorModel',
    
	autoLoad: false,
	
	findRecordByKey : function(key, value){
    	var i = Ext.Array.each(this.data.items, function(record){
    		if(value === record.get(key)){
    			return false;
    		}
    	});
    	if(Ext.isNumber(i)){
    		return this.data.items[i];
    	}else{
    		return null;
    	}
    },
    
    contain : function(uuid){
    	return !!this.findRecordByKey('uuid', uuid);
    }

}


);