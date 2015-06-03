Ext.define('Factor.store.FactorPropertyParamStore', {
    extend: 'Ext.data.Store',
    model : 'Factor.model.FactorPropertyParamModel',
	autoLoad: false,
	
	proxy: {
        type: 'ajax',
        url : '../../../work-platform/paramValue.do',
        reader: {
            type: 'json'
        }
    }
});