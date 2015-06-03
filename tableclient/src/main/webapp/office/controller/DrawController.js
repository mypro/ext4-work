Ext.define('Layout.controller.DrawController', {
    extend: 'Ext.app.Controller',
    
    refs : [],
    
    init: function() {
    	this.control({
    		'drawPanel':{
    			'afterrender' : function(panel){
					Layout.DrawController.initDrawPaper(panel);
					Layout.DrawController.initDraw(panel);
					//panel.hasShow = true;
				},
				'show' : function(panel){
					if(!panel.hasShow){
						panel.hasShow = true;
						return;
					}
					Layout.Draw.refreshPaper(panel.paper);
					// autoscale
					Layout.TopTool.layoutWhole();
				},
				'beforeclose' : function(panel){
					Ext.MessageBox.confirm("", "您确定删除此布局吗？", function (btn, text) {  
		                if ("yes" == btn) {  
		                	Layout.DataServer.deleteLayoutDefine({uuid: panel.paperUuid},
		                			function(){
		                				Ext.getCmp('centerArea').remove(panel);
		                			});
		                }  
		            });
					return false;
				}
    		}
    	});
    },
    
    initDrawPaper : function(panel){
    		var paper = Layout.Draw.initPaper(panel);
    		
    		if(panel.paper){
    			panel.paper.svg.remove();
    		}
    		
    		paper.uuid = panel.paperUuid;
    		panel.paper = paper;
    		panel.graph = paper.model;
	},
	
	initDraw : function(panel){
		var ES = Layout.EventSchedule;
			
		Schedule.createTask(function(){
			return ES.isFinishLoad;
		}, function(){

			ES.fireEvent(ES.factorStore, 'loadFactor', ES.factorStore.data.items, null,Ext.create('Layout.event.EventContext',
					{paper : panel.paper}
			));
			ES.fireEvent(ES.relationStore, 'loadRelation', ES.relationStore.data.items, null,Ext.create('Layout.event.EventContext',
					{paper : panel.paper}
			));
			
			// add layout of factor who is created by sixTable
			var layouts = [];
		
			Ext.Array.each(Ext.getCmp('centerArea').items.items, function(panel){
//				if(isNaN(panel.type)){
//					return;
//				}
				
				Ext.Array.each(ES.factorStore.data.items, function(factor){
					
					if(factor.layout && factor.layout[panel.paperUuid]){
						return;
					}
					
					layout = {
							defineUuid : panel.paperUuid,
							factorUuid : factor.get('uuid'),
							x : 0,
							y : 0
					};
					
					layouts.push(layout);
				});
			});
			
			layouts.length && ES.fireEvent(ES.factorStore, 'addLayout', layouts);
			
//			// auto scale
//			if(isNaN(parseInt(panel.type)) || 0==parseInt(panel.type)){
//				Layout.Layout.autoScale(panel.paper, ES.factorStore.data.items);
//			}else{
//				Layout.DrawController.autoDraw(panel.paper, panel.type);
//			}
			
			// autoscale
			Layout.TopTool.layoutWhole();
			
			// default select cell
			if(defaultSelectUuid){
				Layout.DrawController.selectCellByUuid(defaultSelectUuid);
			}
			
		}, 100);
			
	},
	
	
	
	getActivePaper : function(){
		var activeTab = Ext.getCmp('centerArea').getActiveTab();
		
		if(activeTab){
			return activeTab.paper;
		}else{
			return null;
		}
	},
	
	getPapers : function(){
		var papers = [];
		
		Ext.Array.each(Ext.getCmp('centerArea').items.items, function(panel){
			if(panel.paper){
				papers.push(panel.paper);
			}
    	});
		
		return papers;
	},
	
	eachPanel : function(fn){
		var panels = Ext.getCmp('centerArea').items.items;
		
		Ext.Array.each(panels, function(){
			fn.apply(this, arguments);
		});
		
		return panels;
	},

	/**
	 * @param type
	 */
	autoDraw : function(paper, type){
    	var ES = Layout.EventSchedule;
    	
    	// if server can't hold, translate this function to Browser!
    	Layout.AutoDraw.requestLayout({
	    		factorStore : ES.factorStore.clone([FACTORDEFINE_FACTOR_SIZE,
		                                          	FACTORDEFINE_FACTOR_LEVELTYPE]),
		        relationStore :  ES.relationStore.clone([]),
	        	algType : type
	    	}, function(positions){
//	    		Layout.DrawController.layoutHistory.enqueue(positions);
	    		
	    		Layout.Layout.batchUpdatePosition(paper, positions);
	    		Layout.Layout.autoScale(paper, ES.factorStore.data.items);
	    	});
    	
    	Layout.Cookie.set('layout-'+project, type);
    },
    
	addFactor : function(factor){
		var ES = Layout.EventSchedule;
		
		ES.fireEvent(ES.factorStore, 'addFactor', [factor],
				function(factors){
					ES.factorStore.add(factors);
				},
				Ext.create('Layout.event.EventContext',{
					afterRefreshGrid : function(uuid){
						
						Ext.getCmp('factorPanel').fireEvent('init',
								Layout.EventSchedule.factorStore.findRecordByKey('uuid', uuid));
						
						Ext.getCmp('tab-project').expand();
						Ext.getCmp('editFactorGrid').fireEvent('clickProperty',
								uuid, Ext.getCmp('editFactorPropGrid'));
						
					}
				})
				
			);
		
	},
	
	changeFactorProp : function(parentUuid, defineUuid, newValue, oldValue, noAfraidShake){
		var ES = Layout.EventSchedule,
			poolStore = ES.factorStore,
			parent = poolStore.findRecordByKey("uuid",parentUuid),
			property = parent.getProperty(defineUuid);
		
		if(!property){
			return;
		}
		
		ES.fireEvent(ES.factorStore, 'editValue', property.uuid, defineUuid, newValue, oldValue, 
				function(uuid, defineUuid, newValue){
					this.get('parent').setProperty(defineUuid,newValue);
				},
				Ext.create('Layout.event.EventContext',{
					parent:parent
				})
		);
	},

	changeRelationProp : function(uuid, propDefineUuid, newValue, oldValue, caller){
		var ES = Layout.EventSchedule, 
			poolStore = ES.relationStore,
            element = poolStore.findRecordByKey("uuid",uuid),
            property = element.getProperty(propDefineUuid);;
        
        ES.fireEvent(poolStore, 'editValue', property.uuid, propDefineUuid, newValue, oldValue, 
				function(uuid, defineUuid, newValue){
					this.get('parent').setProperty(defineUuid, newValue);
				},
				Ext.create('Layout.event.EventContext',{parent:element})
    	);
    },
    
    selectCellByUuid : function(uuid){
        Layout.Draw.selectCellByUuid(Layout.DrawController.getActivePaper(), uuid);
    },

	getSelectCell : function(){
        return Layout.Draw.getSelectCell(Layout.DrawController.getActivePaper());
	},
	
	getSelectRecord : function(){
        return Layout.Draw.getSelectRecord(Layout.DrawController.getActivePaper());
        
	},
	
	cancelSelect : function(){
        Layout.Draw.cancelSelect(Layout.DrawController.getActivePaper());
	},
	
});