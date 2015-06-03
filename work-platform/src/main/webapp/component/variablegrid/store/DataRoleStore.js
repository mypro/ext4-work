Ext.define('VariableGrid.store.DataRoleStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.dataRoleStore',
    
    fields: ['abbr', 'name'],
    
    data : [
            {"abbr":'input', "name":"输入"},
            {"abbr":'gole', "name":"目标"},
            {"abbr":'both', "name":"两者都"},
            {"abbr":'none', "name":"无"},
            {"abbr":'zone', "name":"分区"},
            {"abbr":'split', "name":"拆分"}
        ]
});