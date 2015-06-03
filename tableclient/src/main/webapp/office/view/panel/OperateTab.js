Ext.define('Layout.view.panel.OperateTab',{
	extend: 'Ext.panel.Panel',
    alias : 'widget.operateTab',
    
    tabBar : {
	 	id : 'chartTabBar',
    	defaults : {
    		height : HEIGHT_CENTERTAB
    	}
     },
    initComponent : function(){
    	var me = this;
    	
    	  me.buttons = [{
              text: '确定',
              handler: function() {
            	  var tabpanel = Ext.getCmp('eastpanel');
            	  tabpanel.setActiveTab('selchartPanel');
              }
          },{
              text: '重置',
              handler: function() {
            	  var panel = Ext.getCmp('operateTab');
            	  if(panel.paper){
          			panel.paper.svg.remove();
          			}
            	  Layout.Operate.initPaper(panel); 
            	  	dataFactor      = Ext.getCmp('data-factor'),
      				dataFactorprop  = Ext.getCmp('data-factorprop'),
      				dataxFactorprop = Ext.getCmp('datax-factorprop'),
      				datayFactorprop  = Ext.getCmp('datay-factorprop');
            	  	dataFactor.clearValue();
            	  	dataFactorprop.clearValue();
            	  	dataxFactorprop.clearValue();
            	  	datayFactorprop.clearValue();
            	  	dataFactor.getStore().removeAll();
            	  	dataFactorprop.getStore().removeAll();
            	  	dataxFactorprop.getStore().removeAll();
            	  	datayFactorprop.getStore().removeAll();
              }
          }];
    	me.callParent(arguments);
    }
});