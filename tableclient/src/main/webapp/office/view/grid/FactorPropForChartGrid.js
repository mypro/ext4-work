Ext.define('Layout.view.grid.FactorPropForChartGrid',{
	extend: 'Ext.grid.Panel',
    alias : 'widget.factorpfcGrid',
    mixins :['Layout.view.grid.CommonFactorGrid'],
    
    initComponent : function(){
    	var me = this;
    	
    	me.store = Ext.create('Layout.store.CommonFactorStore', {
    		id : 'factorpfcStore'
        });
    	
    	me.tools=[{
    	    type:'restore',
    	    tooltip: '最小化',
    	    // hidden:true,
    	    handler: function(event, toolEl, panel){
    	    	Factor.App.getPanelFactorDataControllerController().getFactorDataGrid().setHeight((document.body.clientHeight-69)/2);
    	    	Factor.App.getPanelFactorDataControllerController().getFactorDataGrid().setWidth((document.body.clientWidth-270)/3);
    	    	Ext.getCmp('leftPanel').setWidth((document.body.clientWidth-270)/3);
    	    	Ext.getCmp('centersPanel').setWidth((document.body.clientWidth-270)/3);
    	    	Ext.getCmp('rightPanel').setWidth((document.body.clientWidth-270)/3);
    	    	CurrentMaxTable=0;
    	    }
    	},
    	{
    	    type:'maximize',
    	    tooltip: '最大化',
    	    handler: function(event, toolEl, panel){
    	    	/*Factor.App.getPanelFactorDataControllerController().getFactorDataGrid().setHeight(document.body.clientHeight-69);
    	    	Factor.App.getPanelFactorDataControllerController().getFactorDataGrid().setWidth(document.body.clientWidth-270);
    	    	Ext.getCmp('leftPanel').setWidth(0);
    	    	Ext.getCmp('centersPanel').setWidth(0);
    	    	Ext.getCmp('rightPanel').setWidth(document.body.clientWidth-270);*/
    	    	CurrentMaxTable=3;
    	    	MaxGrid(CurrentMaxTable);
    	    }
    	}];
    	me.selType= 'checkboxmodel';
    	me.columns = [Ext.create('Ext.grid.RowNumberer'),{
			header : 'uuid',
			hideable : false,
			hidden : true,
			dataIndex : 'uuid',
			width : 60,
			editor : {
				xtype : 'textfield'
			}
		},{
			header : 'defineUuid',
			hideable : false,
			hidden : true,
			dataIndex : 'defineUuid',
			width : 60,
			editor : {
				xtype : 'textfield'
			}
		},
		{
			header : 'defineName',
			hideable : false,
			hidden : true,
			dataIndex : 'defineName',
			width : 60,
			editor : {
				xtype : 'textfield'
			}
		},
		{
			header : 'type',
			hideable : false,
			hidden : true,
			dataIndex : 'type',
			width : 60,
			editor : {
				xtype : 'textfield'
			}
		},
          { header: '值',dataIndex: 'value',width: 120,align:'center'},
          { header: '标签',dataIndex: 'label',width: 120,align:'center'}
         ];
    	
    	me.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			errorSummary : false
		}) ];
    	
        me.callParent(arguments);
    }
});