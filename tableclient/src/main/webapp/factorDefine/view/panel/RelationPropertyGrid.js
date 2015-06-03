Ext.define('Factor.view.panel.RelationPropertyGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.relationPropertyGrid',
    
    store : "RelationPropertyStore",
    
    initComponent : function(){
    	this.selType= 'checkboxmodel';
    	this.tools=[{
    	    type:'up',
    	    id:'upBtn5',
    	    tooltip: '向上收缩',
    	    handler: function(event, toolEl, panel){
    	    	var grid=Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid();
    	    	if(!Ext.getCmp('downBtn5').isVisible()){
    	    		grid.setHeight((document.body.clientHeight-69)/2);
    	    	}else{
    	    		grid.setHeight(25);
    	    		Ext.getCmp('upBtn5').hide();
    	    	}
    	    	Ext.getCmp('downBtn5').show();
    	    }
    	},{
    	    type:'down',
    	    id:'downBtn5',
    	    tooltip: '向下收缩',
    	    handler: function(event, toolEl, panel){
    	    	var grid=Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid();
    	    	if(!Ext.getCmp('upBtn5').isVisible()){
    	    		grid.setHeight((document.body.clientHeight-69)/2);
    	    	}else{
    	    		grid.setHeight(document.body.clientHeight-69-55);
    	    		Ext.getCmp('downBtn5').hide();
    	    	}
    	    	Ext.getCmp('upBtn5').show();
    	    }
    	},{
    	    type:'restore',
    	    tooltip: '最小化',
    	    // hidden:true,
    	    handler: function(event, toolEl, panel){
    	    	Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().setHeight((document.body.clientHeight-69)/2);
    	    	Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().setWidth((document.body.clientWidth-270)/3);
    	    	Ext.getCmp('leftPanel').setWidth((document.body.clientWidth-270)/3);
    	    	Ext.getCmp('centersPanel').setWidth((document.body.clientWidth-270)/3);
    	    	Ext.getCmp('rightPanel').setWidth((document.body.clientWidth-270)/3);
    	    	Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().setHeight((document.body.clientHeight-69)/2);
    	    	CurrentMaxTable=0;
    	    }
    	},
    	{
    	    type:'maximize',
    	    tooltip: '最大化',
    	    handler: function(event, toolEl, panel){
    	    	/*Factor.App.getPanelFactorPropertyControllerController().getFactorPropertyGrid().setHeight(0);
    	    	Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().setHeight(document.body.clientHeight-69);
    	    	Factor.App.getPanelRelationPropertyControllerController().getRelationPropertyGrid().setWidth(document.body.clientWidth-270);
    	    	Ext.getCmp('leftPanel').setWidth(0);
    	    	Ext.getCmp('centersPanel').setWidth(document.body.clientWidth-270);
    	    	Ext.getCmp('rightPanel').setWidth(0);*/
    	    	CurrentMaxTable=6;
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
                		Factor.App.getController("tree.FactorTreeController").addFactorInstance(factorDefineUuid, 2);
                	}
                }  
        };
    	this.columns = [Ext.create('Ext.grid.RowNumberer')
		    	,  {
					hideable : false,
					hidden : true,
					dataIndex : 'uuid'/*,
		            summaryType: 'count',
		            summaryRenderer: function(value, summaryData, dataIndex) {
		                return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
		            }*/
				}, {
					hideable : false,
					hidden : true,
					dataIndex : 'defineUuid'/*,
		            summaryType: 'count',
		            summaryRenderer: function(value, summaryData, dataIndex) {
		                return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
		            }*/
				}, {
					hideable : false,
					hidden : true,
					dataIndex : 'parentUuid'/*,
		            summaryType: 'count',
		            summaryRenderer: function(value, summaryData, dataIndex) {
		                return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
		            }*/
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
							'focus':Factor.App.getController("panel.RelationPropertyController")
									.beforeEdit,
							'blur':Factor.App.getController("panel.RelationPropertyController")
									.editFinish
						},
					},
					width : 120
				},{
					header : '值',
					hideable : false,
					hidden : true,
					dataIndex : 'value',
					editor : {
						xtype : 'textfield',
						listeners : {
							'focus':Factor.App.getController("panel.RelationPropertyController")
									.beforeEdit,
							'blur':Factor.App.getController("panel.RelationPropertyController")
									.editFinish
						},
					},
					width : 120/*,
		            summaryType: 'count',
		            summaryRenderer: function(value, summaryData, dataIndex) {
		                return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
		            }*/
				},{
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
							'focus':Factor.App.getController("panel.RelationPropertyController")
									.beforeEdit,
							'blur':Factor.App.getController("panel.RelationPropertyController")
									.editFinish
						},
					},
					width : 120
				}];
    	
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
                                         return name==2?'关系固有属性':'关系自定义属性';
                                     }
                                 }
                             ],
                ftype: 'grouping'
            }]
    	});
        this.callParent(arguments);
    }
});
