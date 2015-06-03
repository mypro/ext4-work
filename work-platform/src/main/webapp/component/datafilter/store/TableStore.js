Ext.define('DataFilter.store.TableStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.tableStore',
    
    model : 'DataFilter.model.TableModel',
    
	autoLoad: true,

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/getTables.do',
        reader: {
            type: 'json'
        }
    }
});