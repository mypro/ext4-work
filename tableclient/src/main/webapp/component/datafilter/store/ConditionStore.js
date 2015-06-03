Ext.define('DataFilter.store.ConditionStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.conditionStore',
    
    fields: ['abbr', 'name'],
    
    data : [
            {"abbr":'<', "name":"小于"},
            {"abbr":'=', "name":"等于"},
            {"abbr":'>', "name":"大于"},
            {"abbr":'!=', "name":"不等于"},
            {"abbr":'IN', "name":"包含于"},
            {"abbr":'NOT IN', "name":"不包含于"},
            {"abbr":'LIKE', "name":"匹配"},
            {"abbr":'NOT LIKE', "name":"不匹配"},
            {"abbr":'IS NULL', "name":"为空"},
            {"abbr":'IS NOT NULL', "name":"不为空"}
        ]
});