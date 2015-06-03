var defaultFactorPropertyUuid="";
Ext.define('Factor.view.panel.FactorPropertyGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.factorPropertyGrid',
    
    store : "FactorPropertyStore",
    
    initComponent : function(){
    	this.selType= 'checkboxmodel';
//    	this.store.load({
//    		callback: Factor.App.getController("panel.FactorPropertyController").afterStoreLoad
//    	});
    	this.tools=[{
    	    type:'up',
    	    id:'upBtn2',
    	    tooltip: '向上收缩',
    	    handler: function(event, toolEl, panel){
    	    	var grid=Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid();
    	    	if(!Ext.getCmp('downBtn2').isVisible()){
    	    		grid.setHeight((document.body.clientHeight-69)/2);
    	    	}else{
    	    		grid.setHeight(25);
    	    		Ext.getCmp('upBtn2').hide();
    	    	}
    	    	Ext.getCmp('downBtn2').show();
    	    }
    	},{
    	    type:'down',
    	    id:'downBtn2',
    	    tooltip: '向下收缩',
    	    handler: function(event, toolEl, panel){
    	    	var grid=Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid();
    	    	if(!Ext.getCmp('upBtn2').isVisible()){
    	    		grid.setHeight((document.body.clientHeight-69)/2);
    	    	}else{
    	    		grid.setHeight(document.body.clientHeight-69-55);
    	    		Ext.getCmp('downBtn2').hide();
    	    	}
    	    	Ext.getCmp('upBtn2').show();
    	    }
    	},{
    	    type:'restore',
    	    tooltip: '最小化',
    	    // hidden:true,
    	    handler: function(event, toolEl, panel){
    	    	Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().setHeight((document.body.clientHeight-69)/2);
    	    	Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().setWidth((document.body.clientWidth-270)/3);
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
    	    	/*Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().setHeight(document.body.clientHeight-69);
    	    	Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().setWidth(document.body.clientWidth-270);
    	    	Ext.getCmp('leftPanel').setWidth(0);
    	    	Ext.getCmp('centersPanel').setWidth(document.body.clientWidth-270);
    	    	Ext.getCmp('rightPanel').setWidth(0);*/
    	    	CurrentMaxTable=2;
    	    	MaxGrid(CurrentMaxTable);
    	    }
    	}];
    	this.viewConfig = {
        		plugins: {  
                    ptype: 'gridviewdragdrop',  
                    dropGroup: 'factorDefineDDGroup'  
                },
                listeners: {  
                	beforedrop : function(node, data, overModel, dropPosition, dropHandlers){
                		dropHandlers.wait = true;
                		dropHandlers.cancelDrop();
                		var factorDefineUuid = data.records[0].get('uuid');
                		Factor.App.getController("tree.FactorTreeController").addFactorInstance(factorDefineUuid, 1);
                	}
                }  
        };
    	this.columns = [Ext.create('Ext.grid.RowNumberer')
		    	,  {
					hideable : false,
					hidden : true,
					/*summaryType: 'count',
					 summaryRenderer: function(value, summaryData, dataIndex) {
			                return value;
			            },*/
					dataIndex : 'uuid'
				}, {
					hideable : false,
					hidden : true,
					dataIndex : 'defineUuid'
				}, {
					hideable : false,
					hidden : true,
					dataIndex : 'parentUuid'
				}, {
					header : '属性名称',
					hideable : false,
					hidden : false,
					dataIndex : 'name',
					width : 120,
					filter: {
		                type: 'string'
		            }/*,
		            summaryType: 'count',
		            summaryRenderer: function(value, summaryData, dataIndex) {
		                return ((value === 0 || value > 1) ? '(共' + value + ' 条记录)' : '(1 条记录)');
		            }*/
				}, {
					header : '数据类型',
					hideable : false,
					hidden : false,
					dataIndex : 'format',
					renderer : function(dataIndex) {
	    				return getTypeNameByUuid(dataIndex);
	    			},
					width : 120
				},{
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
							'focus':Factor.App.getController("panel.FactorPropertyController")
									.beforeEdit,
							'blur':Factor.App.getController("panel.FactorPropertyController")
									.editFinish
						},
					},
					width : 120
				}/*,{
					header : '值',
					hideable : false,
					hidden : false,
					summaryType: 'count',
					 summaryRenderer: function(value, summaryData, dataIndex) {
			                return value;
			            },
					dataIndex : 'value',
					editor : {
						xtype : 'textfield',
						listeners : {
							'focus':Factor.App.getController("panel.FactorPropertyController")
									.beforeEdit,
							'blur':Factor.App.getController("panel.FactorPropertyController")
									.editFinish
						},
					},
					width : 120
				},{
					header : '值',
					hideable : false,
					hidden : false,
					dataIndex : 'value',
					summaryType: 'count',
					 summaryRenderer: function(value, summaryData, dataIndex) {
			                return value;
			            },
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
							'focus':Factor.App.getController("panel.FactorPropertyController")
									.beforeEdit,
							'blur':Factor.App.getController("panel.FactorPropertyController")
									.editFinish
						},
					},
					width : 120
				}*/];
    	
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
            },{
                groupHeaderTpl: [
                                 '<div>{name:this.formatName}</div>',
                                 {
                                     formatName: function(name) {
                                         return name==1?'因子固有属性':'因子自定义属性';
                                     }
                                 }
                             ],
                             ftype: 'grouping',
                             startCollapsed:  false
            }]
    	});
        this.callParent(arguments);
    }
});