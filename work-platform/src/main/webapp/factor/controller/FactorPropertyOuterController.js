Ext.define('Factor.controller.FactorPropertyOuterController', {
    extend: 'Factor.controller.Base',

    init: function() {
    	this.control({
        	'#datasourceCombo' : {
        		select : this.selectDatasource
            },
            '#databaseCombo' : {
        		select : this.selectDatabase
            },
            '#tableCombo':{
            	select : this.selectTable
            }
        });
    },
    
    show : function(){
    	Ext.getCmp("factorPropertyDataGrid").reconfigure(store, json.columModle);  
        Ext.getCmp("factorPropertyDataGrid").render(); 
    },
    
    selectTable : function(combo){
    	var table = combo.lastValue;
    	var me = Factor.App.getController("FactorPropertyOuterController");
    	me.table = table;
    	var fieldStore = new Ext.data.Store(
				{
					xtype : 'store',
					model : 'Factor.model.ComboModel',
					autoLoad : true,
					proxy : {
						type : 'ajax',
						url : '../../../work-platform/getDBField.do',
						extraParams : {
							datasource : me.datasource,
							database : me.database,
							table : me.table
						},
						actionMethods : {
							read : 'POST'
						}
					}
				});
    	
		var valueFieldCombo = Ext.getCmp('valueFieldCombo');
		if(valueFieldCombo){
			valueFieldCombo.bindStore(fieldStore, true);
		}else{
			Ext.getCmp("factorPropertyGrid").columns[10].getEditor().store = fieldStore;
		}
		
		var conditionFieldCombo = Ext.getCmp('conditionFieldCombo');
		if(conditionFieldCombo){
			conditionFieldCombo.bindStore(fieldStore, true);
		}else{
			Ext.getCmp("factorPropertyGrid").columns[11].getEditor().store = fieldStore;
		}
    },
    
    selectDatabase : function(combo){
    	var database = combo.lastValue;
    	var me = Factor.App.getController("FactorPropertyOuterController");
    	me.database = database;
    	var tableStore = new Ext.data.Store(
				{
					xtype : 'store',
					model : 'Factor.model.ComboModel',
					autoLoad : true,
					proxy : {
						type : 'ajax',
						url : '../../../work-platform/getDBTable.do',
						extraParams : {
							datasource : me.datasource,
							database : me.database
						},
						actionMethods : {
							read : 'POST'
						}
					}
				});
		var tableCombo = Ext.getCmp('tableCombo');
		if(tableCombo){
			tableCombo.bindStore(tableStore, true);
		}else{
			Ext.getCmp("factorPropertyGrid").columns[9].getEditor().store = tableStore;
		}
    },
    
	selectDatasource : function(combo){
		var datasource = combo.lastValue;
		var me = Factor.App.getController("FactorPropertyOuterController");
    	me.datasource = datasource;
		var databaseStore = new Ext.data.Store(
				{
					xtype : 'store',
					model : 'Factor.model.ComboModel',
					autoLoad : true,
					proxy : {
						type : 'ajax',
						url : '../../../work-platform/getDatabase.do',
						extraParams : {
							datasource : me.datasource
						},
						actionMethods : {
							read : 'POST'
						}
					}
				});
		var databaseCombo = Ext.getCmp('databaseCombo');
		if(databaseCombo){
			databaseCombo.bindStore(databaseStore, true);
		}else{
			Ext.getCmp("factorPropertyGrid").columns[8].getEditor().store = databaseStore;
		}
	},
	
	save : function(){
		// 若不是编辑了外部数据源，直接返回
    	var FactorPropertyController = Factor.App.getController("FactorPropertyController")
    	if(PROP_TYPE_UUID_OUTER != FactorPropertyController.selectedPropertyType){
    		return ;
    	}
    	FactorPropertyController.save();
	}
});