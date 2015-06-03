Ext.define('Factor.view.panel.FactorPropertyDataGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.factorPropertyDataGrid',
    
    initComponent : function(){
    	
//    	this.store = Ext.create('Factor.store.FactorPropertyDataStore',{
//    		autoLoad: false
//    	});
    	
    	this.columns = [
    	    			Ext.create('Ext.grid.RowNumberer')
    	        	];
    	
        this.callParent(arguments);
    },
});