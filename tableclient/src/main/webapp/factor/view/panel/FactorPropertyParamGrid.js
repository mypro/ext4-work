Ext.define('Factor.view.panel.FactorPropertyParamGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.factorPropertyParamGrid',
    
    initComponent : function(){
    	
    	this.store = Ext.create('Factor.store.FactorPropertyParamStore',{
    		autoLoad: false
    	});
    	
    	this.columns = [
    	    			Ext.create('Ext.grid.RowNumberer')
    	    			,  {
    	    				hideable : false,
    	    				hidden : true,
    	    				dataIndex : 'uuid'
    	    			}, {
    	    				hideable : false,
    	    				hidden : true,
    	    				dataIndex : 'seq'
    	    			}, {
    	    				hideable : false,
    	    				hidden : true,
    	    				dataIndex : 'defineUuid'
    	    			}, {
    	    				header : '参数值',
    	    				hideable : false,
    	    				hidden : false,
    	    				dataIndex : 'name',
    	    				width : 100,
    	    				editor : {
    	    					xtype : 'textfield',
    	    					allowBlank : false,
    	    					listeners : {
    	    						'blur':Factor.App.getController("FactorPropertyParamController")
											.editFinish
    	    					},
    	    					editable : true
    	    				}
    	    			}
    	        	];
    	
    	
    	this.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 2,
			errorSummary : false
		}) ];
    	
        this.callParent(arguments);
    },
});