//参数值标签model
Ext.define('ValueLabel.model.ValueLabelModel', {
    extend: 'Ext.data.Model',
    fields: [
             	'uuid',//序号
             	{name:'seq', type: 'int'},
				'defineUuid',//
				'defineName',//
				'defineKeyword',//
				'value',//参数值
				'label',//参数标签
				'type'//
    ]
});