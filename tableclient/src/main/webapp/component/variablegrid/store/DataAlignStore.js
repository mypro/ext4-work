Ext.define('VariableGrid.store.DataAlignStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.dataAlignStore',
    
    fields: ['abbr', 'name'],
    
    data : [
            {"abbr":'left', "name":"左对齐"},
            {"abbr":'rigth', "name":"右对齐"},
            {"abbr":'center', "name":"中对齐"}
        ]
});