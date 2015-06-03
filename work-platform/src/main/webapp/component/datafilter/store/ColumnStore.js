Ext.define('DataFilter.store.ColumnStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.columnStore',
    
    model : 'DataFilter.model.ColumnModel',
    
	autoLoad: false,

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/queryColumns.do?base=true',
        reader: {
            type: 'json'
        }
    }
});