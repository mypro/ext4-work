Ext.define('Layout.model.CommonFactorModel', {
    extend: 'Ext.data.Model',
    mixins :['Layout.model.CommonFunction'],
    fields:[
            {name: 'uuid'},
            {name: 'defineUuid'},
            {name: 'relationUuid'},
            {name: 'instName'},
            {name: 'expression'},
            {name: 'name'},
            {name: 'label'},
            {name: 'dataType', type:'number'},
            {name: 'format'},
            {name: 'width', type:'number'},
            {name: 'decimalWidth', type:'number'},
            {name: 'value'},
            {name: 'valueLabelUuid'},
            {name: 'measure'},
            {name: 'role'},
            {name: 'queryUuid'},
            {name: 'valueKeyword'},
            {name: 'seq', type:'number'},
            {name: 'createLevel'},
            {name: 'prototype', type:'string'},
            {name: 'childs', type:'object'}
         ],
    idProperty: 'uuid',
    
    getName : function(){
    	return this.get('name');
    },
    
    setXY : function(paperUuid, x, y){
    	if(typeof paperUuid === 'object'){
    		paperUuid = paperUuid.uuid ? paperUuid.uuid : paperUuid.paperUuid;
    	}
    	
    	this.layout = this.layout || {};
    	this.layout[paperUuid] = this.layout[paperUuid] || {};
    	this.layout[paperUuid].x = x;
    	this.layout[paperUuid].y = y;
    },
    
    getXY : function(paperUuid){
    	if(typeof paperUuid === 'object'){
    		paperUuid = paperUuid.uuid ? paperUuid.uuid : paperUuid.paperUuid;
    	}
    	if(!this.layout || !this.layout[paperUuid]){
    		return {x:0,y:0};
    	}
    	return this.layout[paperUuid];
    },

    getTextColor : function(){
    	var colorProp = this.getProperty(FACTORDEFINE_FACTOR_TEXTCOLOR);
    	if(colorProp){
    		var val = parseInt(colorProp.value, 16).toString(16);
    		if(isNaN(parseInt(val, 16))){
    			return '#000000';
    		}
    		for(var i=val.length;i<6;i++){
    			val='0'+val;
    		}
    		return '#'+val;
    	}
    	return '#000000';
    },
    
    getColor : function(){
    	var colorProp = this.getProperty(FACTORDEFINE_FACTOR_COLOR);
    	if(colorProp){
    		var val = parseInt(colorProp.value, 16).toString(16);
    		if(isNaN(parseInt(val, 16))){
    			return '#FFFFFF';
    		}
    		for(var i=val.length;i<6;i++){
    			val='0'+val;
    		}
    		return '#'+val;
    	}
    	return '#FFFFFF';
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
    },
    
    copyInstance : function(){
    	var instance = new Layout.model.CommonFactorModel(),
    		properties = [];
    	
    	// define
    	Ext.Object.each(Layout.DefaultDefine.defaultFactorDefine, function(key){
    		instance.set(key, this.get(key));
    	}, this);
    	
    	// prop
    	Ext.Array.each(this.getProperties(), function(property){
    		var newProp = {};
    		
    		Ext.Object.each(defaultFactorProp[0], function(key){
    			newProp[key] = this[key];
        	}, this);
    		
    		newProp.value = this.value;
    		
    		properties.push(newProp);
    	});
    	
    	instance.set('childs', Ext.encode(properties));
    	
    	return instance;
    }
});