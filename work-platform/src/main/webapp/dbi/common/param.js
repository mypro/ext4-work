Ext.define('paramList',{
    extend: 'Ext.data.Model',
    fields: [
       {name: 'uuid'},
       {name: 'defineUuid'},
       {name: 'name'}
    ],
    idProperty: 'uuid'
});

/*数值，int*/
COLUMNTYPE_DECIMAL = "8743c7b7607d4dadbf6f6b111af82d4a";//数值
COLUMNTYPE_POINT = "0fbabd96ec9b4824a3c94f27fb1ee566";//点
COLUMNTYPE_COMMA = "12324ca659d4495f8fabea0e74c9de8d";//逗号
COLUMNTYPE_CURRENCY = "5ce3d70cca524a69ad5c36ec6b601d4e";//货币
COLUMNTYPE_DOLLAR = "608240402aea4a3cb3fd1ab5e36c9b25";//美元
COLUMNTYPE_SCIENTIFIC = "b648b329ab9d4b84b5b20e2d676600d3";//科学计数法
COLUMNTYPE_LIMIT = "d96620a7749b477d9a23e1e36a56ab19";//受限数值
/*日期，data*/
COLUMNTYPE_DATE_1 = "09bd730a6a69412aaba66c02ff17e6af";//dd/mm/yyyy
COLUMNTYPE_DATE_2 = "391c6c3a462844d38eea42a05d36ab4a";//dd-mmmm-yy
COLUMNTYPE_DATE_3 = "58de42eaa33d46e1a0a4f8e65b5db105";//dd-mmmm-yyyy
COLUMNTYPE_DATE_4 = "8b8586b943a04a8ebafd47c64195a8df";//mm/dd/yyyy
COLUMNTYPE_DATE_5 = "af20aff4f5a74798995ee718a6c75202";//dd/mm/yy
/*字符串varchar*/
COLUMNTYPE_CHAR = "85806344e6354482822f28ff055bcdd0";//字符串

Ext.define('typeList',{
    extend: 'Ext.data.Model',
    fields: [
       {name: 'uuid'},
       {name: 'description'},
       {name: 'format'},
       {name: 'type'}
    ],
    idProperty: 'uuid'
});
var typeStoreMap = {};

var createTypeStore = function(){
	typeStoreMap = new Ext.data.Store(
			{
				id : 'typeStore',
				xtype : 'store',
				model : 'typeList',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					url : '../../../work-platform/typeList.do',
					actionMethods : {
						read : 'POST'
					}
				}
			});
}
var getTypeStore = function(){
	return typeStoreMap;
}

var getTypeNameByUuid = function(uuid){
	var store = getTypeStore();
	if(!store){
		return "";
	}
	
	for ( var i = 0; i < store.totalCount; i++) {
		var data = store.getAt(i).data;
		if (data.uuid === uuid) {
			return data.description;
		}
	}
}
var getTypeByUuid = function(uuid){
	var store = getTypeStore();
	if(!store){
		return "";
	}
	
	for ( var i = 0; i < store.totalCount; i++) {
		var data = store.getAt(i).data;
		if (data.uuid === uuid) {
			return data.type;
		}
	}
}
var getFormatByUuid = function(uuid){
	var store = getTypeStore();
	if(!store){
		return "";
	}
	
	for ( var i = 0; i < store.totalCount; i++) {
		var data = store.getAt(i).data;
		if (data.uuid === uuid) {
			return data.format;
		}
	}
}
/*====================================所有下拉框的参数选择=========================================*/
var paramStoreMap = {};

var createParamStore = function(defineUuid){
	paramStoreMap[defineUuid] = new Ext.data.Store(
			{
				id : 'paramStore'+defineUuid,
				xtype : 'store',
				model : 'paramList',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					url : '../../../work-platform/paramList.do?defineUuid='+defineUuid,
					actionMethods : {
						read : 'POST'
					}
				}
			});
}

var getParamStore = function(defineUuid){
	return paramStoreMap[defineUuid];
}

var getParamNameByUuid = function(defineUuid, uuid){
	var store = getParamStore(defineUuid);
	if(!store){
		return "";
	}
	
	for ( var i = 0; i < store.totalCount; i++) {
		var data = store.getAt(i).data;
		if (data.uuid === uuid) {
			return data.name;
		}
	}
}
var defineUuid='';
var defineName='';
PARAM_DEFINE_COLUMNTYPE = "c9102ec74d1644ed8d40b443556086d2";
PARAM_DEFINE_ALIGN = "0d33d67cccb14af8b141f9d72f32473b";
PARAM_DEFINE_METRIC = "822f11328b8349e8ac5b436658eb1f20";
PARAM_DEFINE_ROLE = "3526a1af09dd4e74a31b487cba912a20";

PARAM_VALUE_COLUMNTYPE_DECIMAL = "2aeb87181668438e8956b4e1d343cc54";
PARAM_VALUE_COLUMNTYPE_CHAR = "0942221e69d14bfba39ac501380b3665";
PARAM_VALUE_COLUMNTYPE_DATE = "d1210187951b45f798c12844b0829bec";
PARAM_VALUE_COLUMNTYPE_PARAM = "63cb86078aa24e27be67c5d098b5b99d";


var getEditor = function(type){
	switch(type){
	case PARAM_VALUE_COLUMNTYPE_DECIMAL:
		return "numberfield";
	case PARAM_VALUE_COLUMNTYPE_DATE:
		return "datefield";
	case PARAM_VALUE_COLUMNTYPE_PARAM:
		
		return "paramDefine";
	default:
		return "textfield";
	}
}
var getAlign=function(align){
	if('788d44e3c2c54316a84945e003518bd0'===align){
		return 'left';
	}else if('8562f7d0157b4dddb77dc36073d007b5'===align){
		return 'center';
	}else if('b498e5a3329e41dc867bab28b382847c'===align){
		return 'rigth';
	}else{
		return 'center';
	}
}