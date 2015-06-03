Ext.define('Layout.view.panel.DatasetPanel',{
	extend: 'Ext.form.Panel',
    alias : 'widget.datasetPanel',
   
    id: 'simpleForm',
    layout: 'form',
    collapsible: false,
    frame: false,
    layout: 'column',
    fieldDefaults: {
        labelAlign: 'top',
        msgTarget: 'side'
    },
    width: 600,
    height : 400,
    initComponent : function(){
    	var me = this;
    	
    	    me.items = [{
    	    				xtype  : 'factorfcGrid',
    	    				id     : 'factorfcGrid',
    	    				title : '因子',
    	    				autoScroll: true,
    	    				width  : 480,
    	    				height : 300,
    	    				listeners : {
    	    					'containerclick' : Layout.SetChartController.setFactor
    	    				}
    	    			},{
    	    				xtype  : 'factorpfcGrid',
    	    				id 	   : 'x_factorpfcGrid',
    	    				title : '纵坐标（属性）',
    	    				autoScroll: true,
    	    				width  : 300,
    	    				height : 300
    	    			},{
    	    				xtype  : 'factorpfcGrid',
    	    				id     : 'y_factorpfcGrid',
    	    				title : '横坐标（属性）',
    	    				autoScroll: true,
    	    				width  : 780,
    	    				height : 200
    	    			}],
    	    me.buttons = [{
			                text: '确定',
			                handler: function() {
			                    this.up('form').getForm().isValid();
			                }
			            },{
			                text: '返回',
			                handler: function() {
			                	Ext.getCmp('panel2').hide();
		            			Ext.getCmp('panel1').show();
			                }
			            }];
    	
    	Ext.apply(me,{
    		items : me.items
    	});
    	
    	me.callParent(arguments);
    }
});