Ext.define('Factor.view.panel.RelationGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.relationGrid',
    
    initComponent : function(){
    	
    	this.store = Ext.create('Factor.store.RelationStore', {
    		id : 'relationStore'
        });
    	
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
				width : 70,
				renderer : function(dataIndex, combo, record){
					return record.get("factor1Name");
				},
				editor : {
					xtype : 'combo',
					store : getParamStore('isFactor'),
					id : 'factor1Editor',
					valueField : "uuid",
					displayField : "name",
					mode : 'remote',
					triggerAction : 'all',
					listeners : {
						'select':Factor.App.getController("RelationController")
								.selectFactor
					},
					allowBlank : false,
					editable : false
				}
			}, {
				header : '因子二',
				hideable : false,
				hidden : false,
				dataIndex : 'factor2Uuid',
				width : 70,
				renderer : function(dataIndex, combo, record){
					return record.get("factor2Name");
				},
				editor : {
					xtype : 'combo',
					store : getParamStore('isFactor'),
					id : 'factor2Editor',
					valueField : "uuid",
					displayField : "name",
					mode : 'remote',
					triggerAction : 'all',
					listeners : {
						'select':Factor.App.getController("RelationController")
								.selectFactor
					},
					allowBlank : false,
					editable : false
				}
			}
    	];
    	
    	this.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 2,
			errorSummary : false
		}) ];
    	
    	
        this.callParent(arguments);
    }
});
