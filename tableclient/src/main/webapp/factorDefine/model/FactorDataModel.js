Ext.define('Factor.model.FactorDataModel', {
    extend: 'Ext.data.Model',
    fields: [
          	'uuid',//序号
          	'seq',
				'defineUuid',//
				'defineName',//
				'defineKeyword',//
				'value',//参数值
				'label',//参数标签
				'type'//
				],
    idProperty: 'uuid'
});