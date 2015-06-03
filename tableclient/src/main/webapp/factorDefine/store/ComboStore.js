Ext.require([ 'Ext.data.Store']);

Ext.define('Factor.store.ComboStore', {
    extend: 'Ext.data.Store',
    model : 'Factor.model.ComboModel',
    
	autoLoad: false
});

var paramStoreMap = {};

var createParamDefineStore = function(type){
	console.log('createParamDefineStore '+type);
	paramStoreMap['paramDefine'+type] = new Ext.data.Store(
			{
				id : 'paramDefine'+type,
				xtype : 'store',
				model : 'Factor.model.FactorModel',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					url : '../../../work-platform/paramDefineList.do?type='+type,
					actionMethods : {
						read : 'POST'
					}
				}
			});
}

var getParamDefineStore = function(type){
	if(!paramStoreMap['paramDefine'+type]){
		createParamDefineStore(type);
	}
	var store = paramStoreMap['paramDefine'+type];
	return store;
}

var createParamStore = function(defineUuid){
	var url = '../../../work-platform/paramValue.do?defineUuid='+defineUuid ;
	if("isFactor" === defineUuid){
		url += '&isFactor=true';
	}
	paramStoreMap[defineUuid] = new Ext.data.Store(
			{
				id : 'paramStore'+defineUuid,
				xtype : 'store',
				model : 'Factor.model.ComboModel',
				autoLoad : true,
				proxy : {
					type : 'ajax',
					url : url,
					actionMethods : {
						read : 'POST'
					}
				}
			});
}

var getParamStore = function(defineUuid){
	if(!paramStoreMap[defineUuid]){
		createParamStore(defineUuid);
	}
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

var PROP_TYPE_UUID_PARAM = "013791e2aca44e36ba5a6b142fb400d4";
var PROP_TYPE_UUID_FACTOR = "24d968c1e8d24cf4ae3e4a10730ae145";
var PROP_TYPE_UUID_OUTER = "3f985c73e7af40ae9190245d1305bc22";

var PROP_TYPE_DEFINE_UUID = "a7d017333fe5465bb5bf705581d44d92";
