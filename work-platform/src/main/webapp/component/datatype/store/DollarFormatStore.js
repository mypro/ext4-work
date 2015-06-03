Ext.define('DataType.store.DollarFormatStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.dollarFormatStore',
    
    fields: ['abbr', 'name'],
    data : [
            {"abbr":1, "name":"$#"},
            {"abbr":2, "name":"$##"},
            {"abbr":3, "name":"$###"},
            {"abbr":4, "name":"$###.##"},
            {"abbr":5, "name":"$#,###"},
            {"abbr":6, "name":"$#,###.##"},
            {"abbr":7, "name":"$###,###"},
            {"abbr":8, "name":"$###,###.##"},
            {"abbr":9, "name":"$###,###,###.##"},
            {"abbr":10, "name":"$###,###,###,###"}
        ]
});