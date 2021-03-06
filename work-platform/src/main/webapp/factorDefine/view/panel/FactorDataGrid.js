Ext.define('Factor.view.panel.FactorDataGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.factorDataGrid',
    
    store : "FactorDataStore",
    
    initComponent : function(){
    	this.tools=[{
    	    type:'up',
    	    id:'upBtn3',
    	    tooltip: '向上收缩',
    	    handler: function(event, toolEl, panel){
    	    	var grid=Factor.App.getPanelFactorDataControllerController().getFactorDataGrid();
    	    	if(!Ext.getCmp('downBtn3').isVisible()){
    	    		grid.setHeight((document.body.clientHeight-69)/2);
    	    	}else{
    	    		grid.setHeight(25);
    	    		Ext.getCmp('upBtn3').hide();
    	    	}
    	    	Ext.getCmp('downBtn3').show();
    	    }
    	},{
    	    type:'down',
    	    id:'downBtn3',
    	    tooltip: '向下收缩',
    	    handler: function(event, toolEl, panel){
    	    	var grid=Factor.App.getPanelFactorDataControllerController().getFactorDataGrid();
    	    	if(!Ext.getCmp('upBtn3').isVisible()){
    	    		grid.setHeight((document.body.clientHeight-69)/2);
    	    	}else{
    	    		grid.setHeight(document.body.clientHeight-69-55);
    	    		Ext.getCmp('downBtn3').hide();
    	    	}
    	    	Ext.getCmp('upBtn3').show();
    	    }
    	},{
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
    	this.selType= 'checkboxmodel';
    	this.columns = [Ext.create('Ext.grid.RowNumberer'),{
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
          { header: '值',dataIndex: 'value',width: 120,align:'center',
				filter: {
	                type: 'string'
	            }},
          { header: '标签',dataIndex: 'label',width: 120,align:'center',
				filter: {
	                type: 'string'
	            }}
         ];
    	
    	this.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			errorSummary : false
		}) ];
    	Ext.apply(this, { 
    		store : this.store,
    		columns : this.columns,
    		features: [{  
                ftype: 'filters',  
                encode: false, 
                local: true
            }]
    	});
        this.callParent(arguments);
    }
});