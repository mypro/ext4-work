Ext.define('Factor.view.panel.RelationPropertyGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.relationPropertyGrid',
    
    store : "RelationPropertyStore",
    
    initComponent : function(){
    	console.log('init relationPropertyGrid');
    	this.columns = [
    	    			Ext.create('Ext.grid.RowNumberer')
    	    			,  {
    	    				hideable : false,
    	    				hidden : true,
    	    				dataIndex : 'uuid'
    	    			}, {
    	    				hideable : false,
    	    				hidden : true,
    	    				dataIndex : 'relationUuid'
    	    			}, {
    	    				hideable : false,
    	    				header : '关系名称',
    	    				dataIndex : 'relationName'
    	    			}, {
    	    				header : '属性类型',
    	    				dataIndex : 'type',
    	    				width : 80,
    	    				renderer : function(dataIndex){
    	    					return getParamNameByUuid(PROP_TYPE_DEFINE_UUID,dataIndex);
    	    				},
    	    				editor : {
    	    					xtype : 'combo',
    	    					store : getParamStore(PROP_TYPE_DEFINE_UUID),
    	    					valueField : "uuid",
    	    					displayField : "name",
    	    					mode : 'remote',
    	    					triggerAction : 'all',
    	    					listeners : {
    	    						'select':Factor.App.getController("RelationPropertyController")
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
    	    					var name = getParamNameByUuid('paramDefine4', dataIndex);
    	    					if(!name){
    	    						name = dataIndex;
    	    					}
    	    					return name;
    	    				},
    	    				editor : {
    	    					xtype : 'combo',
    	    					store : getParamDefineStore(4),
    	    					id : 'relationPropertyDefine',
    	    					allowBlank : false,
    	    					editable : true,
    	    					valueField : "uuid",
    	    					displayField : "name",
    	    					mode : 'remote',
    	    					triggerAction : 'all',
    	    					listeners : {
    	    						'focus':Factor.App.getController("RelationPropertyController")
    	    								.beforeEditDefine,
    	    						'select':Factor.App.getController("RelationPropertyController")
    	    								.selectDefine,
    	    						'blur':Factor.App.getController("RelationPropertyController")
											.finishDefine
    	    					},
    	    					anchor : '95%'
    	    				}
    	    			}, {
    	    				hideable : false,
    	    				header : '属性值',
    	    				dataIndex : 'paramValue'
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
    	createParamDefineStore(4);
    }
});
