Ext.define('Factor.model.FactorPropertyModel', {
    extend: 'Ext.data.Model',
    fields:[
            {name: 'uuid'},
            {name: 'factorUuid'},
            {name: 'factorName'},
            {name: 'type'},
            {name: 'name'},
            {name: 'paramDefineUuid'},
            {name: 'paramValueUuid'},
            {name: 'paramValue'},
            {name: 'propertyFactorUuid'},
            {name: 'datasource'},
            {name: 'databaseName'},
            {name: 'tableName'},
            {name: 'valueField'},
            {name: 'conditionField'},
            {name: 'seq'}
         ],
});