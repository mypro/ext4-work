Ext.define('Factor.model.FactorPropertyModel', {
    extend: 'Ext.data.Model',
    fields:[
            {name: 'uuid'},
            {name: 'factor2Uuid'},
            {name: 'defineUuid'},
            {name: 'name'},
            {name: 'dataType', type:'number'},
            {name: 'format'},
            {name: 'width', type:'number'},
            {name: 'decimalWidth', type:'number'},
            {name: 'valueLabelUuid'},
            {name: 'value'},
            {name: 'measure'},
            {name: 'role'},
            {name: 'dataSourceUuid'},
            {name: 'dataBaseUuid'},
            {name: 'dataTableUuid'},
            {name: 'dataColumnUuid'},
            {name: 'queryUuid'},
            {name: 'valueKeyword'},
            {name: 'prototype'},
            {name: 'seq',type:'number'}
         ]
});