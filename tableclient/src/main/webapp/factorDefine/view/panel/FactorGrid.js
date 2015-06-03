Ext.define('Factor.view.panel.FactorGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.factorGrid',
    
    //store : "FactorStore",
    
    initComponent : function(){
    	
    	this.store = Ext.create('Factor.store.FactorStore');
    	this.store.load({
    		callback: Factor.App.getController("panel.FactorController").afterStoreLoad
    	});
    	this.tools=[/*{
    	    type:'left',
    	    tooltip: '向左收缩',
    	    handler: function(event, toolEl, panel){
    	    	
    	    }
    	},{
    	    type:'right',
    	    tooltip: '向右收缩',
    	    handler: function(event, toolEl, panel){
    	    	
    	    }
    	},*/{
    	    type:'up',
    	    id:'upBtn1',
    	    tooltip: '向上收缩',
    	    handler: function(event, toolEl, panel){
    	    	var grid=Factor.App.getPanelFactorControllerController().getFactorGrid();
    	    	if(!Ext.getCmp('downBtn1').isVisible()){
    	    		grid.setHeight((document.body.clientHeight-69)/2);
    	    	}else{
    	    		grid.setHeight(25);
    	    		Ext.getCmp('upBtn1').hide();
    	    	}
    	    	Ext.getCmp('downBtn1').show();
    	    }
    	},{
    	    type:'down',
    	    id:'downBtn1',
    	    tooltip: '向下收缩',
    	    handler: function(event, toolEl, panel){
    	    	var grid=Factor.App.getPanelFactorControllerController().getFactorGrid();
    	    	if(!Ext.getCmp('upBtn1').isVisible()){
    	    		grid.setHeight((document.body.clientHeight-69)/2);
    	    	}else{
    	    		grid.setHeight(document.body.clientHeight-69-55);
    	    		Ext.getCmp('downBtn1').hide();
    	    	}
    	    	Ext.getCmp('upBtn1').show();
    	    }
    	},{
    	    type:'restore',
    	    tooltip: '最小化',
    	    // hidden:true,
    	    handler: function(event, toolEl, panel){
    	    	Factor.App.getPanelFactorControllerController().getFactorGrid().setHeight((document.body.clientHeight-69)/2);
    	    	Factor.App.getPanelFactorControllerController().getFactorGrid().setWidth((document.body.clientWidth-270)/3);
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
    	    	/*Factor.App.getPanelFactorControllerController().getFactorGrid().setHeight(document.body.clientHeight-69);
    	    	Factor.App.getPanelFactorControllerController().getFactorGrid().setWidth('100%');
    	    	Ext.getCmp('leftPanel').setWidth(document.body.clientWidth-270);
    	    	Ext.getCmp('centersPanel').setWidth(0);
    	    	Ext.getCmp('rightPanel').setWidth(0);*/
    	    	CurrentMaxTable=1;
    	    	MaxGrid(CurrentMaxTable);
    	    }
    	}];
    	this.selType= 'checkboxmodel';
    	this.columns = [Ext.create('Ext.grid.RowNumberer')
		    	,  {
					hideable : false,
					hidden : true,
					dataIndex : 'uuid'
				},{
					hideable : false,
					hidden : true,
					dataIndex : 'defineUuid'
				}, {
					header : '名称',
					hideable : false,
					hidden : false,
					dataIndex : 'name',
					width : 120,
					tdCls: this.nameColumnCls,
		            innerCls: this.nameColumnInnerCls,
					filter: {
		                type: 'string'
		            }
				}, {
					header : '数据类型',
					hideable : false,
					hidden : false,
					dataIndex : 'format',
					renderer : function(dataIndex) {
	    				return getTypeNameByUuid(dataIndex);
	    			},
					width : 120
				},
				{
					header : '值',
					hideable : false,
					hidden : true,
					dataIndex : 'value',
					renderer : function(number){
						return number;
					},
					editor : {
						xtype : 'numberfield',
						listeners : {
							'focus':Factor.App.getController("panel.FactorController")
									.beforeEdit,
							'blur':Factor.App.getController("panel.FactorController")
									.editFinish
						}
					},
					width : 120
				},
				{
					header : '值',
					hideable : false,
					hidden : true,
					dataIndex : 'value',
					id : 'textEditor',
					editor : {
						xtype : 'textfield',
						listeners : {
							'focus':Factor.App.getController("panel.FactorController")
									.beforeEdit,
							'blur':Factor.App.getController("panel.FactorController")
									.editFinish
						}
					},
					width : 120
				}
				,{
					header : '值',
					hideable : false,
					hidden : true,
					dataIndex : 'value',
					renderer : function(dataIndex){
						if(dataIndex && dataIndex.format){
							return dataIndex.format('yyyy-MM-dd');
						}
						return dataIndex;
					},
					editor : {
						xtype : 'datefield',
						format: 'Y-m-d',
						listeners : {
							'focus':Factor.App.getController("panel.FactorController")
									.beforeEdit,
							'blur':Factor.App.getController("panel.FactorController")
									.editFinish
						}
					},
					width : 120
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