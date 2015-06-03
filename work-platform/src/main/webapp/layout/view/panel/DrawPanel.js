Ext.define('Layout.view.panel.DrawPanel',{
	extend: 'Ext.panel.Panel',
    alias : 'widget.drawPanel',
    
    ddTarget: new Ext.dd.DDTarget('drawPanel','factorDDTarget'),
    
    initComponent : function(){
    	
    	var me = this;
    	
    	me.callParent(arguments);
    }
    

});