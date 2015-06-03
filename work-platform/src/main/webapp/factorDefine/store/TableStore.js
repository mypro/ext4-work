Ext.define('Factor.store.TableStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.tableStore',
    
    model : 'Factor.model.TableModel',
    
	autoLoad: true,

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/getTables.do',
        reader: {
            type: 'json'
        }
    }
});