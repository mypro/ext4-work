Ext.define('VariableGrid.store.VariableGridStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.variableStore',
    
    model : 'VariableGrid.model.VariableModel',
    
	autoLoad: false,

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/queryColumns.do',
        reader: {
            type: 'json'
        }
    }
});