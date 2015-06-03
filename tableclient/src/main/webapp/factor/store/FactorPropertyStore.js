Ext.define('Factor.store.FactorPropertyStore', {
    extend: 'Ext.data.Store',
    model : 'Factor.model.FactorPropertyModel',
	autoLoad: false,
	
	proxy: {
        type: 'ajax',
        url : '../../../work-platform/loadFactorProperty.do',
        reader: {
            type: 'json'
        }
    }
});