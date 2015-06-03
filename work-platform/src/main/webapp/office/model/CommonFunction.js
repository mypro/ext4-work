Ext.define('Layout.model.CommonFunction',{
	
	getProperties : function(){
    	if(!this.get('childs')){
    		this.set('childs', "[]");
    	}
    	if(Ext.isArray(this.get('childs'))){
    		this.set('childs', Ext.encode(this.get('childs')));
    	}
    	return Ext.decode(this.get('childs'));
    },
    
    getProperty : function(define){
    	var props = this.getProperties();
    	var i = Ext.Array.each(props, function(prop){
    		if(define === prop.defineUuid){
    			return false;
    		}
    	});
    	if(Ext.isNumber(i)){
    		return props[i];
    	}
    	return null;
    },
    
    addProperty : function(obj){
    	var prop = Ext.apply({},obj);
    	
    	var props = this.getProperties();
    	props.push(prop);
    	this.set('childs', Ext.encode(props));
    },
    
    removeProperty : function(uuid){
    	var props = this.getProperties(),
    		i;
    	
    	i = Ext.Array.each(props, function(prop){
    		if(uuid === prop.uuid){
    			return false;
    		}
    	});
    	if(Ext.isNumber(i)){
    		props.splice(i, 1);
    		this.set('childs', Ext.encode(props));
    	}
    	return null;
    },
    
    setPropertyDefine : function(propDefine){
    	var props = this.getProperties();
    	
    	var i = Ext.Array.each(props, function(prop){
    		if(propDefine.defineUuid === prop.defineUuid){
    			return false;
    		}
    	});
    	if(Ext.isNumber(i)){
    		Ext.apply(props[i], propDefine);
    		this.set('childs', Ext.encode(props));
    		return props[i];
    	}
    	return null;
    },
    
    setProperty : function(define, value){
    	var props = this.getProperties();
    	var i = Ext.Array.each(props, function(prop){
    		if(define === prop.defineUuid){
    			return false;
    		}
    	});
    	if(Ext.isNumber(i)){
    		props[i].value = value;
    		this.set('childs', Ext.encode(props));
    		return props[i];
    	}
    	return null;
    }
    
});