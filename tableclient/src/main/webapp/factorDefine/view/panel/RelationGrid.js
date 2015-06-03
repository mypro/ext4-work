Ext.define('Factor.view.panel.RelationGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.relationGrid',
    
//    store : "RelationStore",
    
    initComponent : function(){
    	this.store = Ext.create('Factor.store.RelationStore');
    	this.store.load({
    		callback: Factor.App.getController("panel.RelationController").afterStoreLoad
    	});
    	this.selType= 'checkboxmodel';
    	this.tools=[{
    	    type:'up',
    	    id:'upBtn4',
    	    tooltip: '向上收缩',
    	    handler: function(event, toolEl, panel){
    	    	var grid=Factor.App.getPanelFactorControllerController().getFactorGrid();
    	    	if(!Ext.getCmp('downBtn4').isVisible()){
    	    		grid.setHeight((document.body.clientHeight-69)/2);
    	    	}else{
    	    		grid.setHeight(25);
    	    		Ext.getCmp('upBtn4').hide();
    	    	}
    	    	Ext.getCmp('downBtn4').show();
    	    }
    	},{
    	    type:'down',
    	    id:'downBtn4',
    	    tooltip: '向下收缩',
    	    handler: function(event, toolEl, panel){
    	    	var grid=Factor.App.getPanelFactorControllerController().getFactorGrid();
    	    	if(!Ext.getCmp('upBtn4').isVisible()){
    	    		grid.setHeight((document.body.clientHeight-69)/2);
    	    	}else{
    	    		grid.setHeight(document.body.clientHeight-69-55);
    	    		Ext.getCmp('downBtn4').hide();
    	    	}
    	    	Ext.getCmp('upBtn4').show();
    	    }
    	},{
    	    type:'restore',
    	    tooltip: '最小化',
    	    // hidden:true,
    	    handler: function(event, toolEl, panel){
    	    	Factor.App.getPanelRelationControllerController().getRelationGrid().setHeight((document.body.clientHeight-69)/2);
    	    	Factor.App.getPanelRelationControllerController().getRelationGrid().setWidth((document.body.clientWidth-270)/3);
    	    	Ext.getCmp('leftPanel').setWidth((document.body.clientWidth-270)/3);
    	    	Ext.getCmp('centersPanel').setWidth((document.body.clientWidth-270)/3);
    	    	Ext.getCmp('rightPanel').setWidth((document.body.clientWidth-270)/3);
    	    	Factor.App.getPanelFactorControllerController().getFactorGrid().setHeight((document.body.clientHeight-69)/2);
    	    	CurrentMaxTable=0;
    	    }
    	},
    	{
    	    type:'maximize',
    	    tooltip: '最大化',
    	    handler: function(event, toolEl, panel){
    	    	/*Factor.App.getPanelFactorControllerController().getFactorGrid().setHeight(0);
    	    	Factor.App.getPanelRelationControllerController().getRelationGrid().setHeight(document.body.clientHeight-69);
    	    	Factor.App.getPanelRelationControllerController().getRelationGrid().setWidth(document.body.clientWidth-270);
    	    	Ext.getCmp('leftPanel').setWidth(document.body.clientWidth-270);
    	    	Ext.getCmp('centersPanel').setWidth(0);
    	    	Ext.getCmp('rightPanel').setWidth(0);*/
    	    	CurrentMaxTable=4;
    	    	MaxGrid(CurrentMaxTable);
    	    }
    	}];
    	this.columns = [
			Ext.create('Ext.grid.RowNumberer')
			,  {
				hideable : false,
				hidden : true,
				dataIndex : 'uuid'
			}, {
				header : '因子一',
				hideable : false,
				hidden : false,
				dataIndex : 'factor1Uuid',
				renderer : function(dataIndex, combo, record){
					return record.get("factor1Name");
				},
				width : 120,
				filter: {
	                type: 'string'
	            }
			}, {
				header : '因子二',
				hideable : false,
				hidden : false,
				dataIndex : 'factor2Uuid',
				renderer : function(dataIndex, combo, record){
					return record.get("factor2Name");
				},
				width : 120,
				filter: {
	                type: 'string'
	            }
			}
    	];
    	
    	this.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 2,
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
