Ext.define('Factor.view.panel.FactorPropertyGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.factorPropertyGrid',
    
    store : "FactorPropertyStore",
    
    initComponent : function(){
    	console.log('init factorPropertyGrid');
    	this.columns = [
    	    			Ext.create('Ext.grid.RowNumberer')
    	    			,  {
    	    				hideable : false,
    	    				hidden : true,
    	    				dataIndex : 'uuid'
    	    			}, {
    	    				hideable : false,
    	    				hidden : true,
    	    				dataIndex : 'factorUuid'
    	    			}, {
    	    				hideable : false,
    	    				header : '因子名称',
    	    				dataIndex : 'factorName',
    	    				width : 80
    	    			}, {
    	    				header : '属性类型',
    	    				dataIndex : 'type',
    	    				width : 80,
    	    				renderer : function(dataIndex){
    	    					return getParamNameByUuid('a7d017333fe5465bb5bf705581d44d92',dataIndex);
    	    				},
    	    				editor : {
    	    					xtype : 'combo',
    	    					store : getParamStore('a7d017333fe5465bb5bf705581d44d92'),
    	    					valueField : "uuid",
    	    					displayField : "name",
    	    					mode : 'remote',
    	    					triggerAction : 'all',
    	    					listeners : {
    	    						'select':Factor.App.getController("FactorPropertyController")
    	    								.selectPropertDefine
    	    					},
    	    					allowBlank : false,
    	    					editable : false
    	    				}
    	    			}, {
    	    				header : '属性名',
    	    				hideable : false,
    	    				hidden : false,
    	    				dataIndex : 'paramDefineUuid',
    	    				width : 100,
    	    				renderer : function(dataIndex) {
    	    					console.log('render paramdefine');
    	    					var name = getParamNameByUuid('paramDefine3', dataIndex);
    	    					if(!name){
    	    						name = dataIndex;
    	    					}
    	    					return name;
    	    				},
    	    				editor : {
    	    					xtype : 'combo',
    	    					store : getParamDefineStore(3),
    	    					id : 'factorPropertyDefine',
    	    					allowBlank : false,
    	    					editable : true,
    	    					valueField : "uuid",
    	    					displayField : "name",
    	    					mode : 'remote',
    	    					triggerAction : 'all',
    	    					listeners : {
    	    						'focus':Factor.App.getController("FactorPropertyController")
    	    								.beforeEditDefine,
    	    						'select':Factor.App.getController("FactorPropertyController")
    	    								.selectDefine,
    	    						'blur':Factor.App.getController("FactorPropertyController")
											.finishDefine
    	    					},
    	    					anchor : '95%'
    	    				}
    	    			}, {
    	    				hideable : false,
    	    				header : '属性值',
    	    				dataIndex : 'paramValue'
    	    			},  {
    	    				hidden : false,
    	    				header : '数据源',
    	    				editor : {
    	    					xtype : 'combo',
    	    					store :  new Ext.data.Store({
		    	    						xtype : 'store',
		    	    						model : 'Factor.model.ComboModel',
		    	    						data: [{"uuid" : "local", 
		    	    								"name" : "local"
		    	    						}]
		    	    			}),
    	    					id : 'datasourceCombo',
    	    					queryMode: 'local',
    	    					allowBlank : false,
    	    					valueField : "uuid",
    	    					displayField : "name",
    	    					triggerAction : 'all',
    	    					anchor : '95%'
    	    				},
    	    				dataIndex : 'datasource'
    	    			},  {
    	    				hidden : false,
    	    				header : '数据库',
    	    				editor : {
    	    					xtype : 'combo',
    	    					store : null,
    	    					id : 'databaseCombo',
    	    					queryMode: 'local',
    	    					allowBlank : false,
    	    					valueField : "uuid",
    	    					displayField : "name",
    	    					triggerAction : 'all',
    	    					anchor : '95%'
    	    				},
    	    				dataIndex : 'databaseName'
    	    			},  {
    	    				hidden : false,
    	    				header : '表项',
    	    				editor : {
    	    					xtype : 'combo',
    	    					store : null,
    	    					id : 'tableCombo',
    	    					queryMode: 'local',
    	    					allowBlank : false,
    	    					valueField : "uuid",
    	    					displayField : "name",
    	    					triggerAction : 'all',
    	    					anchor : '95%'
    	    				},
    	    				dataIndex : 'tableName'
    	    			},  {
    	    				hidden : false,
    	    				header : '值字段',
    	    				editor : {
    	    					xtype : 'combo',
    	    					store : null,
    	    					id : 'valueFieldCombo',
    	    					queryMode: 'local',
    	    					allowBlank : false,
    	    					valueField : "uuid",
    	    					displayField : "name",
    	    					triggerAction : 'all',
    	    					anchor : '95%'
    	    				},
    	    				dataIndex : 'valueField'
    	    			},  {
    	    				hidden : false,
    	    				header : '条件字段',
    	    				editor : {
    	    					xtype : 'combo',
    	    					store : null,
    	    					id : 'conditionFieldCombo',
    	    					queryMode: 'local',
    	    					allowBlank : false,
    	    					valueField : "uuid",
    	    					displayField : "name",
    	    					triggerAction : 'all',
    	    					anchor : '95%'
    	    				},
    	    				dataIndex : 'conditionField'
    	    			}
    	        	];
    	
    	this.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 2,
			errorSummary : false
		}) ];
    	
    	this.initComboStore();
    	
        this.callParent(arguments);
    },
    
    initComboStore : function(){
    	createParamDefineStore(3);
    }
});
