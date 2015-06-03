Ext.define('Factor.view.panel.FactorGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.factorGrid',
    
    //store : "FactorStore",
    
    initComponent : function(){
    	
    	this.store = Ext.create('Factor.store.FactorStore', {
    		id : 'factorStore'
        });
    	
    	this.columns = [
			Ext.create('Ext.grid.RowNumberer')
			,  {
				hideable : false,
				hidden : true,
				dataIndex : 'uuid'
			}, {
				header : '名称',
				hideable : false,
				hidden : false,
				dataIndex : 'name',
				width : 140,
				editor : {
					xtype : 'textfield',
					listeners : {
						'blur':Factor.App.getController("FactorController")
								.editFinish
					},
					allowBlank : false
				}
			}
    	];
    	
    	this.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 2,
			errorSummary : false
		}) ];
    	
    	
        this.callParent(arguments);
    }
});
