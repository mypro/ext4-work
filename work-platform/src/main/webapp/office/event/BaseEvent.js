Ext.define('Layout.event.BaseEvent',{

    logSwitch : false,
	
	constructor: function(config){
        Ext.apply(this, config);
    },

    register : function(store){
    	store.addListener(this.eventName, function(){
    		var i=0,
    			me=this,
    			argsLen=arguments.length,
    			size=me.declareCallbacks.length,
    			context = arguments[argsLen-1],
				fn = arguments[argsLen-2],
				startTime;
    		
    		// if that event is afraid of shake....
    		if(context.get('afraidShake') && 
    				!SHAKE.preventShake("callback", context.get('afraidShake'), me)){
    			return ;
    		}

//    		try {
	    		for(;i<size;i++){
	    			if(context && context.isStopCallback()){
	    				continue;
	    			}
                    
                    if(me.logSwitch){ 
                        startTime = new Date().getTime();
                    }
                    
	    			me[me.declareCallbacks[i]] && me[me.declareCallbacks[i]].apply(store, arguments);

                    if(me.logSwitch){
                        console.log(me.declareCallbacks[i]+'  '+(new Date().getTime()-startTime));
                    }
                    
                    if(fn && typeof fn === 'function'){
	    				fn.apply(context, arguments);
	    				fn = null;
	    			}
	    		}
//    		}catch(e){
//    			console.log(e.message);
//    		}
    	},this);
    },
    
    
    /**
     *  common event callback.................
     */
    updateFactorCombo : function(){
		var factorStore = Layout.EventSchedule.factorStore,
			factorPropStore = new Layout.store.CommonFactorStore(),
			comboFactor = Ext.getCmp('combo-factor'),
			comboFactorProp = Ext.getCmp('combo-factorProp');
			
		comboFactor.clearValue();
		comboFactor.bindStore(factorStore);
		
		Ext.Array.each(factorStore.data.items, function(factor){
			Ext.Array.each(factor.getProperties(), function(prop){
				if(0 !== parseInt(prop.prototype)){
					return;
				}
				if(!factorPropStore.findRecordByKey('defineUuid', prop.defineUuid)){
					var newProp = new Layout.model.CommonFactorModel();
					
					Ext.apply(newProp.data, prop);
					factorPropStore.add(newProp);
				}
			}, this);
		}, factorPropStore);
		
		comboFactorProp.clearValue();
		comboFactorProp.bindStore(factorPropStore);
		
	}
    

});