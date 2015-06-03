Ext.define('Layout.view.panel.FactorPanel',{
	extend: 'FDW.view.DefineGrid',
    alias : 'widget.factorPanel',
    
    isEditing : false ,
    
    callback:{
    	save : function(){
    		var controller = Layout.FactorController;
    		controller.saveFactor.apply(controller, arguments);
    	}
    },
    
    initComponent : function(){
    	var me = this;
    	
    	me.addEvents(
                'init'
            );
    	
    	me.callParent(arguments);
    }
    

});