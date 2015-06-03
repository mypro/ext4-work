Ext.define('VariableGrid.model.VariableModel', {
    extend: 'Ext.data.Model',
    fields: [
        'uuid',//序号
        'seq',
        'tableUuid',
        'keyword',
        'name', //变量名
	 	'type',//变量类型）
		'width',//变量长度
		'decimalWidth',//小数位数
		'label',//变量标签
		'data',//变量值标签
		'missing',//缺省值
		'showWidth',//变量显示宽度
		'showAlign',//对齐方式
		'isUnique',
		'paramTableUuid',
		'paramColumnUuid',
		'paramColumnLabelUuid',
		'paramDefine',
		'paramDefineName',
		'metric',
		'role'
    ],
    idProperty: 'uuid'
});    