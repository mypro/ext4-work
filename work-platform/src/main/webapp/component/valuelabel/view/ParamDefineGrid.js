Ext.define('ValueLabel.view.ParamDefineGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.paramDefineGrid',
    
    
    initComponent : function(){
    	this.store = Ext.create('ValueLabel.store.ParamDefineStore', {
    		id : 'paramDefineStore'
        });
    	this.store.load({
			params:{
				tblUuid : T_PARAM_TABLE,
				defineName:encodeURI(DEFINENAME,'UTF-8')
			}
		});
    	this.columns = [{
					header : 'defineUuid',
					hideable : false,
					hidden : true,
					dataIndex : 'defineUuid',
					width : 60
				},
	              { header: '组名',
					dataIndex: 'defineName',
					width: 123,
					align:'center'}
				];
    	
    	this.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 2,
			errorSummary : false
		}) ];
    	
        this.callParent(arguments);
    }
});