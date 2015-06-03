Ext.define('Layout.store.CommonFactorStore', 
{
	extend: 'Ext.data.Store',
    
    model : 'Layout.model.CommonFactorModel',
    
	autoLoad: false,
	
	getPositions : function(paper){
		var positions = [];
		
		Ext.Array.each(this.data.items, function(record){
			positions.push({
				uuid : record.get('uuid'),
				posX : record.getXY(paper).x,
				posY : record.getXY(paper).y
			});
		});
		
		return positions;
	},
	
	getDatas : function(propDefines){
		var datas = [];
		
		Ext.Array.each(this.data.items, function(record){
			var data = {}  ,
				dataChilds = [];
			data.uuid = record.get('uuid');
//			data.defineUuid = record.get('defineUuid');
			data.name = record.get('name');
			
			Ext.Array.each(record.getProperties(), function(property){
				if(propDefines && !propDefines[property.defineUuid]){
					return true;
				}
				var child = {};
//				child.uuid = property.uuid;
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
	
	findRecordByKey : function(key, value){
    	var i = Ext.Array.each(this.data.items, function(record){
    		if(value === record.get(key)){
    			return false;
    		}
    	});
    	if(Ext.isNumber(i)){
    		return this.data.items[i];
    	}else{
    		return null;
    	}
    },
    
    findRecordsByKey : function(key, value){
    	var records = [];
    	
    	Ext.Array.each(this.data.items, function(record){
    		if(value === record.get(key)){
    			this.push(record);
    		}
    	}, records);
    	
    	return records;
    },
    
    contain : function(uuid){
    	return !!this.findRecordByKey('uuid', uuid);
    },
    
    getPropertyRecords: function(uuid, filterFn){
    	var factor = this.findRecordByKey('uuid', uuid);
    	var props = factor.getProperties();
    	
    	var records = [];
    	Ext.Array.each(props, function(prop){
    		if(filterFn && !filterFn.call(this, prop)){
    			return;
    		}
    		var record = new Layout.model.CommonFactorModel();  
    		Ext.apply(record.data, prop);
    		records.push(record);
    	});
    	return records;
    },
    
    findRecordsContainProp : function(defineUuid){
    	var records = [];
    	
    	Ext.Array.each(this.data.items, function(record){
    		if(record.getProperty(defineUuid)){
    			this.push(record);
    		}
    	}, records);
    	
    	return records;
    },
    
    clone : function(props){
    	var newStore //= new Layout.store.CommonFactorStore();
    				 = Ext.create(this.$className);
    	
    	Ext.Array.each(this.data.items, function(record){
    		var newRecord = record.copy();
    		if(props){
    			var properties = record.getProperties();
    			var newProperties = [];
	    		Ext.Array.each(properties, function(property){
	    			if(Ext.Array.contains(props, property.defineUuid)){
	    				newProperties.push(property);
	    			}
	    		});
	    		newRecord.set('childs', newProperties);
    		}
    		
    		newStore.add(newRecord);
    	});
    	
    	return newStore;
    }

});