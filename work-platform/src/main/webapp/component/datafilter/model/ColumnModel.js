Ext.define('DataFilter.model.ColumnModel',{
    extend: 'Ext.data.Model',
    fields: [
       {name: 'uuid'},
       {name: 'name'},
       {name: 'keyword'},
       {name: 'tableUuid'},
       {name: 'paramColumnUuid'},
       {name: 'paramColumnLabelUuid'},
       {name: 'showWidth'},
       {name: 'width'},
       {name: 'paramTableUuid'},
       {name: 'data'},
       {name: 'type'},
       {name: 'paramDefine'},
       {name: 'seq'}
    ],
    idProperty: 'uuid'
});