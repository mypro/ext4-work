Ext.define('Layout.model.RelationModel', {
    extend: 'Ext.data.Model',
    fields:[
            {name: 'uuid'},
            {name: 'factor1Uuid'},
            {name: 'factor2Uuid'},
            {name: 'factor1Name'},
            {name: 'factor2Name'},
            {name: 'type', type:'number'},
            {name: 'seq'},
            {name: 'childs'}
         ],
    idProperty: 'uuid',
    
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
    },
    
    getProperties : function(){
    	if(!this.get('childs')){
    		this.set('childs', "[]");
    	}
    	if(Ext.isArray(this.get('childs'))){
    		return this.get('childs');
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
    
    getColor : function(){
    	var colorProp = this.getProperty(FACTORDEFINE_RELATION_COLOR);
    	if(colorProp){
    		var val = parseInt(colorProp.value, 16).toString(16);
    		for(var i=val.length;i<6;i++){
    			val='0'+val;
    		}
    		return '#'+val;
    	}
    	return '#FFFFFF';
    },
    
    getShape : function(){
    	var shapeProp = this.getProperty(FACTORDEFINE_RELATION_SHAPE);
    	if(shapeProp){
    		return parseInt(shapeProp.value);
    	}
    	return 1;
    }
});