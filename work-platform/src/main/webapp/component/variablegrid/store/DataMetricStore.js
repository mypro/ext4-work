Ext.define('VariableGrid.store.DataMetricStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.dataMetricStore',
    
    fields: ['abbr', 'name'],
    
    data : [
            {"abbr":'num', "name":"序号"},
            {"abbr":'nominal', "name":"名义"}
        ]
});