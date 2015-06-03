Ext.define('Factor.store.ColumnStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.columnStore',
    
    model : 'Factor.model.ColumnModel',
    
	autoLoad: false,

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/queryColumns.do?base=true',
        reader: {
            type: 'json'
        }
    }
});