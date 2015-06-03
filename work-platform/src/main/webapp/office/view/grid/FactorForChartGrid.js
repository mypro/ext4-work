Ext.define('Layout.view.grid.FactorForChartGrid',{
	extend: 'Ext.grid.Panel',
    alias : 'widget.factorfcGrid',
    mixins :['Layout.view.grid.CommonFactorGrid'],
    
    initComponent : function(){
    	var me = this;
    	
    	me.store = Ext.create('Layout.store.CommonFactorStore', {
    		id : 'factorStore'
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
		},{
			header : 'defineUuid',
			hideable : false,
			hidden : true,
			dataIndex : 'defineUuid',
			width : 60,
			editor : {
				xtype : 'textfield'
			}
		},{
			header : '名称',
			hideable : false,
			hidden : false,
			dataIndex : 'name',
			width : 60,
			editor : {
				xtype : 'textfield'
			}
		},
		{
			
			header : '数据类型',
			hideable : false,
			hidden : false,
			dataIndex : 'format',
//			renderer : function(dataIndex) {
//				return getTypeNameByUuid(dataIndex);
//			},
			width : 120
		}
         ];
    	
    	me.viewConfig = {
        		plugins: {  
                    ptype: 'gridviewdragdrop',  
                    dropGroup: 'factorDefineDDGroup'  
                } 
        };
    	
    	me.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 2,
			errorSummary : false
		}) ];
    	
        me.callParent(arguments);
    }
});