Ext.define('Layout.store.CommonRelationStore', 
{
	extend: 'Layout.store.CommonFactorStore',
    
    model : 'Layout.model.RelationModel',
    
	autoLoad: false,
	
	getDatas : function(propDefines){
		var datas = [];
		
		Ext.Array.each(this.data.items, function(record){
			var data = {}  ,
				dataChilds = [];
			data.uuid = record.get('uuid');
			data.factor1Uuid = record.get('factor1Uuid');
			data.factor2Uuid = record.get('factor2Uuid');
			
			Ext.Array.each(record.getProperties(), function(property){
				if(propDefines && !propDefines[property.defineUuid]){
					return true;
				}
				var child = {};
				child.uuid = property.uuid;
				child.defineUuid = property.defineUuid;
				child.value = property.value;
				dataChilds.push(child);
			});
			data.childs = dataChilds;
			
//			datas.push(record.data);
			datas.push(data);
		});
		
		return datas;
	},

	findRelation : function(factor1Uuid, factor2Uuid){
		var relations, i;
		
		if(factor1Uuid == factor2Uuid){
			return null;
		}
		
		relations = this.findRecordsByKey('factor1Uuid', factor1Uuid);
		relations = relations.concat(this.findRecordsByKey('factor2Uuid', factor1Uuid));
		
		if(!factor2Uuid){
			return relations;
		}
		
		i = Ext.Array.each(relations, function(relation){
			if(factor2Uuid == relation.get('factor1Uuid')
					|| factor2Uuid == relation.get('factor2Uuid')){
				return false;
			}
		});
		if(Ext.isNumber(i)){
			return relations[i];
		}
		
		return null;
	},
});