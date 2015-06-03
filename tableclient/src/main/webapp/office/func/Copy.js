Ext.define('Layout.func.Copy',{
	
	COPY_SUFFIX : '(\u526f\u672c)',
	
	constructor: function(config){
        Ext.apply(this, config);
    },
   
    ctrlC : function(){
    	this.selectObj = Layout.Select.getSelect();
    },
    
    ctrlV : function(){
    	var record,
    		defineUuid,
    		drawController = Layout.DrawController,
    		cell, cellType,
    		ES = Layout.EventSchedule,
    		store,
    		activePaper;
    	
    	if(!this.selectObj){
    		return;
    	}
    	
    	switch(this.selectObj.type){
    	case Layout.Select.TYPE_FACTOR:
    		activePaper = Layout.DrawController.getActivePaper();
    				
            Ext.Array.each(this.selectObj.record, function(obj){
                record = obj.record;
                newRecord  = record.copyInstance();
        		newRecord.set('name', this.getFactorCopyName(record.get('name')));
        		newRecord.layout = record.layout;
        		newRecord.setXY(activePaper, 
        							record.getXY(activePaper).x+30,
        							record.getXY(activePaper).y+30);
        		Layout.DrawController.addFactor(newRecord);
            }, this);

    		break;
    	case Layout.Select.TYPE_RELATION:
    		break;
    	case Layout.Select.TYPE_FACTOR_PROP:
            var cells = drawController.getSelectCell(),
                defineUuid = this.selectObj.record[0].record.get('defineUuid');

            Ext.Array.each(cells, function(cell){
    		
        		cellType = cell.get('type');
        		if('link' !== cell.get('type')){
        			store = ES.factorStore;
        		}else{
        			store = ES.relationStore;
        		}
        		
        		// factor won`t have two same prop
        		if(store.findRecordByKey('uuid', cell.get('id')).getProperty(defineUuid)){
        			return ;
        		}
        		
        		// create new property
        		record = this.selectObj.record[0].record.copyInstance();
        		record.set('defineUuid', defineUuid);
        		
        		var fn = function(parentUuid, parentType, propertyRec){
    	    		var parent = store.findRecordByKey('uuid', parentUuid);
    	    		parent.addProperty(propertyRec.data);
    	    	};
    	    	
    	    	if('link' !== cell.get('type')){
    	    		ES.fireEvent(store, 'addProperty', cell.get('id'), RELATIONTYPE_FACTOR_PROP, 
    						record, Ext.getCmp('editFactorPropGrid'), fn);
    	    	}else{
    	    		ES.fireEvent(store, 'addProperty', cell.get('id'), RELATIONTYPE_RELATION_PROP, 
    	        			record, Ext.getCmp('editRelationPropGrid'), fn);
    	    	}
            }, this);

            break;
    	case Layout.Select.TYPE_RELATION_PROP:
    		cell = drawController.getSelectCell();
    		if(!cell){
    			return;
    		}

    		defineUuid = this.selectObj.record.get('defineUuid');
    		
    		cellType = cell.get('type');
    		if('link' !== cell.get('type')){
    			store = ES.factorStore;
    		}else{
    			store = ES.relationStore;
    		}
    		
    		// factor won`t have two same prop
    		if(store.findRecordByKey('uuid', cell.get('id')).getProperty(defineUuid)){
    			return ;
    		}
    		
    		// create new property
    		record = this.selectObj.record.copyInstance();
    		record.set('defineUuid', this.selectObj.record.get('defineUuid'));
    		
    		var fn = function(parentUuid, parentType, propertyRec){
	    		var parent = store.findRecordByKey('uuid', parentUuid);
	    		parent.addProperty(propertyRec.data);
	    	};
	    	
	    	if('link' !== cell.get('type')){
	    		ES.fireEvent(store, 'addProperty', cell.get('id'), RELATIONTYPE_FACTOR_PROP, 
						record, Ext.getCmp('editFactorPropGrid'), fn);
	    	}else{
	    		ES.fireEvent(store, 'addProperty', cell.get('id'), RELATIONTYPE_RELATION_PROP, 
	        			record, Ext.getCmp('editRelationPropGrid'), fn);
	    	}
    		break;
    	default:
    		// do nothing
    	}
    },
    
    clearPasteBoard : function(){
    	delete this.selectObj;
    },
    
    getFactorCopyName : function(name){
    	var store = Layout.EventSchedule.factorStore;
    	
    	name = name + this.COPY_SUFFIX;
    	
    	while(store.findRecordByKey('name', name)){
    		name = name + this.COPY_SUFFIX;
    	}
    	return name;
    }
});