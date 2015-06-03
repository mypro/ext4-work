Ext.application({
	name : 'Factor',
	appFolder : 'factor',
	controllers : [ 
	        'FactorPropertyParamController',
	        'FactorPropertyOuterController',
			'FactorPropertyController', 
			'FactorController', 
			'ComboController',
			'RelationPropertyParamController',
			'RelationPropertyController',
			'RelationController'
	],
	views : [ 
	        'panel.FactorPropertyDataGrid',
	        'panel.FactorPropertyParamGrid',
	        'panel.FactorPropertyGrid',
			'panel.FactorGrid', 
			'panel.RelationPropertyParamGrid',
			'panel.RelationPropertyGrid',
			'panel.RelationGrid' 
	],
	
	preventShake : function(name, scope){
		var current = new Date().getTime();
		var key = name+"-runtime";
		if(!scope[key]){
			scope[key] = 0;
		}
		if(current - scope[key] > 600){
			scope[key] = current;
			return true;
		}else{
			scope[key] = current;
			return false;
		}
	},

	launch : function() {
		Factor.App = this;
		Ext.create('Ext.panel.Panel', {
			id : 'main-panel',
			baseCls : 'x-plain',
			renderTo : Ext.getBody(),
			layout : {
				type : 'table',
				columns : 3
			},
			defaults : {
				frame : true,
				width : 300,
				height : 250
			},
			items : [ {
				xtype : 'factorGrid',
				id : 'factorGrid',
				frame : true,
				title : '因子',
				autoScroll: true,
				width : 200,
			}, {
				xtype : 'factorPropertyGrid',
				id : 'factorPropertyGrid',
				title : '因子属性',
				autoScroll: true,
				width : 450
			}, {
				title : '因子属性数据',
				autoScroll: true,
				hidden : false,
				xtype : 'factorPropertyParamGrid',
				id : 'factorPropertyParamGrid'
			}, {
				title : '外部数据',
				xtype : 'factorPropertyDataGrid', 
				id : 'factorPropertyDataGrid',
				hidden : false
			},{
				xtype : 'relationGrid',
				id : 'relationGrid',
				frame : true,
				title : '关系',
				autoScroll: true,
				width : 200,
			}, {
				xtype : 'relationPropertyGrid',
				id : 'relationPropertyGrid',
				title : '关系属性',
				autoScroll: true,
				width : 450
			}, {
				title : '关系属性数据',
				autoScroll: true,
				xtype : 'relationPropertyParamGrid',
				id : 'relationPropertyParamGrid'
			} ]
		});
		
		Ext.getCmp('factorPropertyDataGrid').hide();

		new Ext.KeyMap(Ext.getBody(), [{
			key : "q",
			ctrl : true,
			shift : false,
			fn : function() {
				if(!Factor.App.preventShake("save", Factor.App)){
					return ;
				}
				Factor.App.getController("FactorController").save();
				Factor.App.getController(
						"FactorPropertyParamController").save();
				Factor.App.getController(
						"FactorPropertyOuterController").save();
				Factor.App.getController("RelationController").save();
				Factor.App.getController(
						"RelationPropertyParamController").save();
			}
		} ]);

	}
});

Ext.define("Factor.controller.Base", {
	extend : "Ext.app.Controller",
	
    fnReturnFalse : function(){
    	return false;
    },

	/* store的record数据，提取出来放到数组中 */
	getDataFromRecord : function(records) {
		var data = [];
		for ( var i = 0; i < records.length; i++) {
			var record = records[i];
			data.push(record.data);
		}
		return data;
	},

	showMenu : function(e, items) {
		e.preventDefault();
		e.stopEvent();
		new Ext.menu.Menu({
			floating : true,
			items : items
		}).showAt(e.getXY());
	}
});
