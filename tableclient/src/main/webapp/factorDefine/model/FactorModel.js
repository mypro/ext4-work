Ext.define('Factor.model.FactorModel', {
    extend: 'Ext.data.Model',
    fields:[
            {name: 'uuid'},
            {name: 'defineUuid'},
            {name: 'name'},
            {name: 'dataType', type:'number'},
            {name: 'format'},
            {name: 'width', type:'number'},
            {name: 'decimalWidth', type:'number'},
            {name: 'value'},
            {name: 'valueLabelUuid'},
            {name: 'measure'},
            {name: 'role'},
            {name: 'queryUuid'},
            {name: 'valueKeyword'},
            {name: 'seq', type:'number'}
         ],
    idProperty: 'uuid'
});