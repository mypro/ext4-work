Ext.define('Layout.view.panel.DrawPanel',{
	extend: 'Ext.panel.Panel',
    alias : 'widget.drawPanel',
    
    initComponent : function(){
    	
    	var me = this;
    	
    	me.ddTarget = new Ext.dd.DDTarget(me.id,'factorDDTarget');
    	
    	me.callParent(arguments);
    }
    

});