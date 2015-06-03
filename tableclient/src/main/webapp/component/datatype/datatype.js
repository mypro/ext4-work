Ext.define('component.datatype.datatype', {});

/*数值，int*/
var COLUMNTYPE_DECIMAL = "8743c7b7607d4dadbf6f6b111af82d4a";//数值
var COLUMNTYPE_POINT = "0fbabd96ec9b4824a3c94f27fb1ee566";//点
var COLUMNTYPE_COMMA = "12324ca659d4495f8fabea0e74c9de8d";//逗号
var COLUMNTYPE_CURRENCY = "5ce3d70cca524a69ad5c36ec6b601d4e";//货币
var COLUMNTYPE_DOLLAR = "608240402aea4a3cb3fd1ab5e36c9b25";//美元
var COLUMNTYPE_SCIENTIFIC = "b648b329ab9d4b84b5b20e2d676600d3";//科学计数法
var COLUMNTYPE_LIMIT = "d96620a7749b477d9a23e1e36a56ab19";//受限数值
/*日期，data*/
var COLUMNTYPE_DATE_1 = "09bd730a6a69412aaba66c02ff17e6af";//dd/mm/yyyy
var COLUMNTYPE_DATE_2 = "391c6c3a462844d38eea42a05d36ab4a";//dd-mmmm-yy
var COLUMNTYPE_DATE_3 = "58de42eaa33d46e1a0a4f8e65b5db105";//dd-mmmm-yyyy
var COLUMNTYPE_DATE_4 = "8b8586b943a04a8ebafd47c64195a8df";//mm/dd/yyyy
var COLUMNTYPE_DATE_5 = "af20aff4f5a74798995ee718a6c75202";//dd/mm/yy
/*字符串varchar*/
var COLUMNTYPE_CHAR = "85806344e6354482822f28ff055bcdd0";//字符串



Ext.application({
	name : 'DataType',
	appFolder : 'component/datatype',
	controllers : [
	               	'DataTypeController'    
	],
	views : [
	         		'DataTypeRadio',
	        		'DataTypeWindow'
	],
	launch : function() {
		DataType.App = this;
		
		this.idPrefix = 'cmpt-datatype-'+this.id+'-';
	}
});
