Ext.define('Layout.controller.EventSchedule', {
    extend: 'Ext.app.Controller',
    
    isFinishLoad : false,
    
    init: function() {
    	Schedule.createTask(function(){
    		return Layout.DataServer;
    	}, function(){
    		this.initAction();
    	}, 100, this);
    },
    
    initAction : function(){
		this.defineStore();
    	this.registerEvent();
		this.loadData();
	},
    
    defineStore : function(){
    	this.factorStore = new Layout.store.CommonFactorStore({
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadFactor.do',
    	        reader: {
    	            type: 'json'
    	        }
    	    }
    	});
    	
    	this.relationStore = new Layout.store.CommonRelationStore({
    		proxy: {
    	        type: 'ajax',
    	        url : '../../../work-platform/loadRelation.do',
    	        reader: {
    	            type: 'json'
    	        }
    	    }
    	});
    },
    
    registerEvent : function(){
    	// register factor store event
		Ext.create('Layout.event.AddFactor').register(this.factorStore);
		Ext.create('Layout.event.AddLayout').register(this.factorStore);
		Ext.create('Layout.event.EditDefine').register(this.factorStore);
		Ext.create('Layout.event.LoadFactor').register(this.factorStore);
		Ext.create('Layout.event.RemoveFactor').register(this.factorStore);
		Ext.create('Layout.event.AddProperty').register(this.factorStore);
		Ext.create('Layout.event.RemoveProperty').register(this.factorStore);
		Ext.create('Layout.event.EditValue').register(this.factorStore);
		Ext.create('Layout.event.EditLayout').register(this.factorStore);
		
		// register relation event
		Ext.create('Layout.event.AddRelation').register(this.relationStore);
		Ext.create('Layout.event.RemoveRelation').register(this.relationStore);
		Ext.create('Layout.event.LoadRelation').register(this.relationStore);
		Ext.create('Layout.event.AddProperty').register(this.relationStore);
		Ext.create('Layout.event.RemoveProperty').register(this.relationStore);
		Ext.create('Layout.event.EditValue').register(this.relationStore);
		Ext.create('Layout.event.ChangeRelation').register(this.relationStore);
    },
    
    loadData : function(){
    	
    	var me = this;
    	
    	me.factorStore.load({
			scope : me,
			callback : function(records){
				
				Layout.DataServer.readLayout(function(response){
		    		var layouts = Ext.decode(response.responseText);
		    		
		    		// set layout for every factor!
		    		Layout.Layout.setFactorLayout(records, layouts);
		    		
		    		// whether autolayout or not
					var autoLayoutType = Layout.Cookie.get('layout-'+project);
					if(autoLayout && autoLayoutType){
						//Layout.DrawController.autoDraw(autoLayoutType);
					}else{
						//Layout.DrawController.layoutHistory.enqueue(me.factorStore.getPositions());
					}
					
					
					// load relation
					me.relationStore.load({
						scope : me,
						callback : function(records){
							Layout.EventSchedule.isFinishLoad = true;
						}
					});
		    	});
				
			}
		});
    },
    /*
	afterRenderPanel : function(grid){
		Layout.DrawController.initDrawPaper(grid);
		
		// register factor store event
		Ext.create('Layout.event.AddFactor').register(this.factorStore);
		Ext.create('Layout.event.EditDefine').register(this.factorStore);
		Ext.create('Layout.event.LoadFactor').register(this.factorStore);
		Ext.create('Layout.event.RemoveFactor').register(this.factorStore);
		Ext.create('Layout.event.AddProperty').register(this.factorStore);
		Ext.create('Layout.event.RemoveProperty').register(this.factorStore);
		Ext.create('Layout.event.EditValue').register(this.factorStore);
		
		// register relation event
		Ext.create('Layout.event.AddRelation').register(this.relationStore);
		Ext.create('Layout.event.RemoveRelation').register(this.relationStore);
		Ext.create('Layout.event.LoadRelation').register(this.relationStore);
		Ext.create('Layout.event.AddProperty').register(this.relationStore);
		Ext.create('Layout.event.RemoveProperty').register(this.relationStore);
		Ext.create('Layout.event.EditValue').register(this.relationStore);
		Ext.create('Layout.event.ChangeRelation').register(this.relationStore);
		
		// clear edit grid
		Ext.getCmp('editFactorGrid').selModel.selection = null;
		Ext.getCmp('editFactorGrid').getStore().removeAll();
//		Ext.getCmp('editRelationGrid').getStore().removeAll();
		
		// load factor
		this.factorStore.load({
			scope : this,
			callback : function(records){
				// fire loadFactor callback
				this.fireEvent(this.factorStore, 'loadFactor', records, null);
				
				// load relation
				this.relationStore.load({
					scope : this,
					callback : function(records){
						this.fireEvent(this.relationStore, 'loadRelation', records, null);
					}
				});
				
				// default select cell
				if(defaultSelectUuid){
					Layout.DrawController.selectCellByUuid(defaultSelectUuid);
				}
				
				// whether autolayout or not
				var autoLayoutType = Layout.Cookie.get('layout-'+project);
				if(autoLayout && autoLayoutType){
					Layout.DrawController.autoDraw(autoLayoutType);
				}else{
					Layout.DrawController.layoutHistory.enqueue(this.factorStore.getPositions());
				}
				
				// auto scale
				Layout.Layout.autoScale(Layout.DrawController.paper, records);
//				Layout.DrawController.autoScale(records);
			}
		});
		
		// load valuelabel
		ValueLabel.App.getController('ValueLabelController').initValueLabel();
	},
	*/
	fireEvent : function(store, eventName){
		contextArg = arguments[arguments.length-1],
		args = Array.prototype.slice.call(arguments, 1);
		
		if(!Ext.isObject(contextArg) || !(contextArg instanceof Layout.event.EventContext)){
			args = args.concat(Ext.create('Layout.event.EventContext'));
		}
		store.fireEventArgs(eventName, Array.prototype.slice.call(args, 1));
    },
    
});
