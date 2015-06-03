Ext.define('Layout.view.panel.DrawTab',{
	extend: 'Ext.tab.Panel',
    alias : 'widget.drawTab',
    
    tabBar : {
	 	id : 'paperTabBar',
    	defaults : {
    		height : HEIGHT_CENTERTAB
    	}
     },
     
    initComponent : function(){
    	
    	var me = this;
    	
    	me.dd = new Ext.dd.DDTarget(me.id,'tabDDTarget');
    	
    	me.callParent(arguments);
    }
    

});