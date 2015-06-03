Ext.require([
    'Ext.ux.grid.FiltersFeature'
]);
Ext.define('ValueLabel.view.ParamGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.paramGrid',
    
    
    initComponent : function(){
    	this.store = Ext.create('ValueLabel.store.ParamStore', {
    		id : 'paramStore'
        });
    	this.store.sort({
            property: 'seq',
            direction: 'ASC'
        });
    	this.columns = [{
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
          { header: '值',
			dataIndex: 'value',
			width: 31,
			align:'center',
			tdCls: this.nameColumnCls,
            innerCls: this.nameColumnInnerCls,
			filter: {
                type: 'string'
            }},
          { header: '标签',
            dataIndex: 'label',
            width: 171,
            align:'center',
			tdCls: this.nameColumnCls,
            innerCls: this.nameColumnInnerCls,
			filter: {
                type: 'string'
            }}
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