Ext.define('DataType.store.DateFormatStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.dateFormatStore',
    
    fields: ['abbr', 'name'],
    
    data : [
            {"abbr":COLUMNTYPE_DATE_1, "name":"d/m/y"},
            {"abbr":COLUMNTYPE_DATE_2, "name":"d-m-y"},
            {"abbr":COLUMNTYPE_DATE_3, "name":"Y-m-d H:i:s"}/*,
            {"abbr":COLUMNTYPE_DATE_4, "name":"mm/dd/yy"},
            {"abbr":COLUMNTYPE_DATE_5, "name":"dd/mm/yyyy"}*/
        ]
});