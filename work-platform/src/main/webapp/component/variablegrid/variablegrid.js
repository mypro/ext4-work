/*变量视图grid*/
/*数值，int*/
var COLUMNTYPE_DECIMAL = "8743c7b7607d4dadbf6f6b111af82d4a";//数值
var COLUMNTYPE_POINT = "0fbabd96ec9b4824a3c94f27fb1ee566";//点
var COLUMNTYPE_COMMA = "12324ca659d4495f8fabea0e74c9de8d";//逗号
var COLUMNTYPE_CURRENCY = "5ce3d70cca524a69ad5c36ec6b601d4e";//货币
var COLUMNTYPE_DOLLAR = "608240402aea4a3cb3fd1ab5e36c9b25";//美元
var COLUMNTYPE_SCIENTIFIC = "b648b329ab9d4b84b5b20e2d676600d3";//科学计数法
var COLUMNTYPE_LIMIT = "d96620a7749b477d9a23e1e36a56ab19";//受限数值

var VARIABLE_GRID_ID='';
var TABLE_UUID='';
Ext.define('component.variablegrid.variablegrid', {});
Ext.application({
	name : 'VariableGrid',
	appFolder : 'component/variablegrid',
	controllers : [
	               	'VariableController'    
	],
	views : [
	        		'VariableView'
	],
	launch : function() {
		VariableGrid.App = this;
		
		this.idPrefix = 'cmpt-variablegrid-'+this.id+'-';
	}
});