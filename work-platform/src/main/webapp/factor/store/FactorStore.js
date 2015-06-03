Ext.define('Factor.store.FactorStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.factorStore',
    
    model : 'Factor.model.FactorModel',
    
	autoLoad: true,

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/loadFactor.do',
        reader: {
            type: 'json'
        }
    }
});