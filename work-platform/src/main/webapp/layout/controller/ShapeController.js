Ext.define('Layout.controller.ShapeController', {
    extend: 'Ext.app.Controller',
    
    refs : [{
    	selector : '#westArea',
    	ref: 'westArea'
    },{
    	selector : '#northArea',
    	ref: 'northArea'
    }],
    
    defaultProp : [{
    	defineUuid : FACTORDEFINE_FACTOR_COLOR,
    	name : '因子颜色',
    	value : '0xFFFFFF',
    	width : 8,
    	decimalWidth: 0,
    	dataType : 1,
    	type : 1,
    	prototype : 1,
    	format : "1"
    },{
    	defineUuid : FACTORDEFINE_FACTOR_SHAPE,
    	name : '因子形状',
    	value : '1',
    	width : 8,
    	decimalWidth: 0,
    	dataType : 1,
    	type : 1,
    	prototype : 1,
    	format : "1"
    },{
    	defineUuid : FACTORDEFINE_FACTOR_SIZE,
    	name : '尺寸',
    	value : '30',
    	width : 8,
    	decimalWidth: 0,
    	dataType : 1,
    	type : 1,
    	prototype : 1,
    	format : "1"
    },{
    	defineUuid : FACTORDEFINE_FACTOR_X,
    	name : '横坐标',
    	value : '0',
    	width : 8,
    	decimalWidth: 0,
    	dataType : 1,
    	type : 1,
    	prototype : 1,
    	format : "1"
    },{
    	defineUuid : FACTORDEFINE_FACTOR_Y,
    	name : '纵坐标',
    	value : '0',
    	width : 8,
    	decimalWidth: 0,
    	dataType : 1,
    	type : 1,
    	prototype : 1,
    	format : "1"
    }],
    
    init: function() {
    	this.control({
    		'#shapePanel' : {
    			'afterrender': function(){
    				new Ext.dd.DragSource('circle-template',{
    	    			group:'factorDDTarget' ,
    	    			shape: 1
    	    		}).afterDragDrop = this.drapFactorFromShape;
    				new Ext.dd.DragSource('rect-template',{
    	    			group:'factorDDTarget' ,
    	    			shape: 2
    	    		}).afterDragDrop = this.drapFactorFromShape;
    			}
    		}
    	});
    },
    
    drapFactorFromShape : function(target, e){
    	var me = Layout.App.getController('ShapeController'),
			x = e.xy[0]-me.getWestArea().width,
			y = e.xy[1]-me.getNorthArea().height,
			win = Ext.getCmp('factorDefineWindow');
		
		me.defaultProp[1].value = this.shape;
		me.defaultProp[3].value = x;
		me.defaultProp[4].value = y;
    	
    	win.isEditProperty = false; 
    	win.parentType = 1;
    	win.parentUuid = '';
    	
    	var windowController = FDW.App.getController('DefineWindowController');
    	windowController.clear(win);
    	
    	win.show();
    	win.callback.save = function(factorDefineRecord, parentUuid, parentType){
    		var factor = Layout.App.getController('ShapeController')
    					.factorFromWin(factorDefineRecord, parentUuid, parentType);
    		
    		var poolController = Layout.App.getController('PoolFactorController');
    		if(poolController.factorStore.findRecordByKey('name', factor.get('name'))){
    			console.log('factor name duplicate!');
    			return;
    		}
    		poolController.factorStore.add(factor);
    		this.hide();
    	};
    },
   
    factorFromWin : function(factorDefineRecord, parentUuid, parentType){
    	var factorRec = new Layout.model.CommonFactorModel();
    	
    	Ext.apply(factorRec.data, factorDefineRecord);
    	
    	// prototype property
    	Ext.Array.each(this.defaultProp, function(prop){
    		factorRec.addProperty(prop);
    	});
    	
    	return factorRec;
    }
});