Ext.define('Layout.model.CommonFactorModel', {
    extend: 'Ext.data.Model',
    fields:[
            {name: 'uuid'},
            {name: 'defineUuid'},
            {name: 'relationUuid'},
            {name: 'name'},
            {name: 'label'},
            {name: 'dataType', type:'number'},
            {name: 'format', type:'number'},
            {name: 'width', type:'number'},
            {name: 'decimalWidth', type:'number'},
            {name: 'value'},
            {name: 'valueLabelUuid'},
            {name: 'measure'},
            {name: 'role'},
            {name: 'seq'},
            {name: 'createLevel'},
            {name: 'prototype'},
            {name: 'childs', type:'object'}
         ],
    idProperty: 'uuid',
    
    getName : function(){
    	return this.get('name');
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
    
    setX : function(x){
    	return this.setProperty(FACTORDEFINE_FACTOR_X, x);
    },
    
    setY : function(y){
    	return this.setProperty(FACTORDEFINE_FACTOR_Y, y);
    },
    
    getX : function(){
    	var xProp = this.getProperty(FACTORDEFINE_FACTOR_X);
    	if(xProp){
    		return parseInt(xProp.value);
    	}
    	return 0;
    },
    
    getY : function(){
    	var yProp = this.getProperty(FACTORDEFINE_FACTOR_Y);
    	if(yProp){
    		return parseInt(yProp.value);
    	}
    	return 0;
    },
    
    
    
    getColor : function(){
    	var colorProp = this.getProperty(FACTORDEFINE_FACTOR_COLOR);
    	if(colorProp){
    		var val = parseInt(colorProp.value, 16).toString(16);
    		for(var i=val.length;i<6;i++){
    			val='0'+val;
    		}
    		return '#'+val;
    	}
    	return '#000000';
    },
    
    getSize : function(){
    	var sizeProp = this.getProperty(FACTORDEFINE_FACTOR_SIZE);
    	if(sizeProp){
    		var size = parseInt(sizeProp.value);
    		if(!isNaN(size)){
    			return size;
    		}
    	}
    	return 30;
    },
    
    getShape : function(){
    	var shapeProp = this.getProperty(FACTORDEFINE_FACTOR_SHAPE);
    	if(shapeProp){
    		return parseInt(shapeProp.value);
    	}
    	return 1;
    }
});