Ext.define('Factor.func.DefaultDefine', {
	
	NAME_FACTOR : '\u65b0\u5efa\u56e0\u5b50',
	NAME_PROPERTY : '\u65b0\u5efa\u5c5e\u6027',
    
    // prototype relation property
	/*
	defaultRelationProp : [{
    	defineUuid : FACTORDEFINE_RELATION_COLOR,
    	name : '关系颜色',
    	value : '0x000000',
    	width : 8,
    	decimalWidth: 0,
    	dataType : 1,
    	type : 2,
    	prototype : '2',
    	valueLabelUuid :'',
    	format : COLUMNTYPE_DECIMAL
    },{
    	defineUuid : FACTORDEFINE_RELATION_SHAPE,
    	name : '关系形状',
    	value : '1',
    	width : 8,
    	decimalWidth: 0,
    	dataType : 1,
    	type : 2,
    	prototype : '2',
    	valueLabelUuid :'',
    	format : COLUMNTYPE_DECIMAL
    }],
    */
	
    defaultFactorDefine : {
    	name : this.NAME_FACTOR,
    	value : '',
    	width : 8,
    	decimalWidth: 0,
    	dataType : 2,
    	prototype : 0,
    	createLevel : '1',
    	valueLabelUuid :'',
    	format : COLUMNTYPE_CHAR
    },
    
    defaultPropDefine : {
    	defineUuid : '',
    	name : this.NAME_PROPERTY,
    	value : 0,
    	width : 8,
    	decimalWidth: 0,
    	dataType : 1,
    	prototype : '0',
    	createLevel : '2',
    	valueLabelUuid :'',
    	format : COLUMNTYPE_DECIMAL
    },
    
    init: function() {
    },
    
    createFactor : function(shape){
    	var factor = new Factor.model.CommonFactorModel();
    	
    	defaultFactorProp[1].value = shape;
    	defaultFactorProp[2].value = '30';
//    	defaultFactorProp[3].value = x;
//    	defaultFactorProp[4].value = y;
    	
    	this.defaultFactorDefine.name = SEQ.seq(this.NAME_FACTOR, function(newName){
			var s=Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().findExact('name', newName);
			return s!=-1?true:false;
		});
    	
		Ext.apply(factor.data, this.defaultFactorDefine);
		Ext.Array.each(defaultFactorProp, function(prop){
			if(prop.notNull){
				factor.addProperty(prop);
			}
    	});
		return factor;
    },
    createFactorByNewName : function(shape,name){
    	var factor = new Factor.model.CommonFactorModel();
    	
    	defaultFactorProp[1].value = shape;
    	defaultFactorProp[2].value = '30';
//    	defaultFactorProp[3].value = x;
//    	defaultFactorProp[4].value = y;
    	
    	this.defaultFactorDefine.name = name;
    	
		Ext.apply(factor.data, this.defaultFactorDefine);
		Ext.Array.each(defaultFactorProp, function(prop){
			if(prop.notNull){
				factor.addProperty(prop);
			}
    	});
		return factor;
    },
    
    createProp : function(){
    	var propertyRec = new Layout.model.CommonFactorModel();
    	
    	this.defaultPropDefine.name = this.NAME_PROPERTY+randomChar(3);
    	
    	Ext.apply(propertyRec.data, this.defaultPropDefine);
    	return propertyRec;
    },
    createRelationByUuid : function(instUuid,factor1Uuid, factor2Uuid){
    	var record = new Factor.model.RelationModel();
		
    	record.set('uuid',instUuid);
		record.set('factor1Uuid',factor1Uuid);
		record.set('factor2Uuid',factor2Uuid);
		record.set('type', RELATIONTYPE_FACTOR);
		
//		defaultRelationProp[1].value = Layout.TopTool.selectedRelationShape;
    	Ext.Array.each(defaultRelationProp, function(prop){
    		if(prop.notNull){
    			record.addProperty(prop);
    		}
    	});
    	
    	return record;
    },
    createRelation : function(factor1Uuid, factor2Uuid){
    	var record = new Layout.model.RelationModel(), 
			ES = Layout.EventSchedule,
			factor1 = ES.factorStore.findRecordByKey('uuid', factor1Uuid),
			factor2 = ES.factorStore.findRecordByKey('uuid', factor2Uuid);
		
    	
		record.set('factor1Uuid',factor1.get('uuid'));
		record.set('factor1Name',factor1.get('name'));
		record.set('factor2Uuid',factor2.get('uuid'));
		record.set('factor2Name',factor2.get('name'));
		record.set('type', RELATIONTYPE_FACTOR);
		
		defaultRelationProp[1].value = Layout.TopTool.selectedRelationShape;
    	Ext.Array.each(defaultRelationProp, function(prop){
    		if(prop.notNull){
    			record.addProperty(prop);
    		}
    	});
    	
    	return record;
    }
    
});