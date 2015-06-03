Ext.define('DataFilter.store.ConditionGridStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.conditionGridStore',
    
    model : 'DataFilter.model.ConditionModel',
    
	autoLoad: false,

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/loadCondition.do',
        reader: {
            type: 'json'
        }
    }
});