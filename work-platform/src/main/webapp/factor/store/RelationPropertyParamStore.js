Ext.define('Factor.store.RelationPropertyParamStore', {
    extend: 'Ext.data.Store',
    model : 'Factor.model.RelationPropertyParamModel',
	autoLoad: false,
	
	proxy: {
        type: 'ajax',
        url : '../../../work-platform/paramValue.do',
        reader: {
            type: 'json'
        }
    }
});