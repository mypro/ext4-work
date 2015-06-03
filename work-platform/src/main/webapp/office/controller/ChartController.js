Ext.define('Layout.controller.ChartController', {
    extend: 'Ext.app.Controller',
  
    refs : [{  
        selector: '#combo-factor',  
        ref: 'comboFactor'  
    },{  
        selector: '#combo-factorProp',  
        ref: 'comboFactorProp'  
    },{
    	selector : '#chartPanel',
    	ref: 'chartPanel'
    }], 
    
    init: function() {
    	this.control({
    		'#eastpanel' : {
	    		'afterrender' : function(){
	    			$('#eastpanel_header_hd').bind('dblclick', function(){
	    				var p = Ext.getCmp('eastpanel');
	    				var d = Ext.getCmp('eastpanel');
	    				
	    				//原来修改宽度的事件改成双击展开
	    				if(p){
	    					p.collapse(Ext.Component.DIRECTION_RIGHT,true);
	    				}
	    				
	    			});
	    		}
	    	},
            '#chart-pie' : {
            	click : function(e){
            		Ext.getCmp('chartBtn').setText(e.text);
            		
            		var selectedFactor = this.getComboFactor().getValue(),
            		    selectedFactorProp = this.getComboFactorProp().getValue(),
            		    newStore = new Layout.store.CommonFactorStore(),
            		    factorStore = Layout.EventSchedule.factorStore,
            		    chartPanel = this.getChartPanel();
            		
            		chartPanel.removeAll();
            		
            		if(!selectedFactor || 0 === selectedFactor.length){
            			console.log('You havn`t select factor!');
            			return;
            		}
            		
            		selectedFactorProp = !selectedFactorProp||Ext.isArray(selectedFactorProp)?
            				selectedFactorProp: [selectedFactorProp];
            		
            		if(selectedFactor.length>1 && selectedFactorProp &&  selectedFactorProp.length>1){
            			console.log('You selected too much factor property!');
            			
            			$('#chartPanel-body').html('<p>饼图不适合您选择的数据模型，请选择其他图形。</p>');
            			return;
            		}
            		
            		// ------------start--------------
            		if(!selectedFactorProp || 0 === selectedFactorProp.length){
            			// factor
            			Ext.Array.each(selectedFactor, function(uuid){
            				var factor = factorStore.findRecordByKey('uuid', uuid),
            				    newRecord;
            				    
            				if(1!==parseInt(factor.get('dataType'))){
            					return;
            				}
            				
            				newRecord = new Layout.model.CommonFactorModel();
            				newRecord.set('name', factor.get('name'));
            				newRecord.set('value', parseFloat(factor.get('value')));
            				
            				newStore.add(newRecord);
            			});
            		}else if(1 === selectedFactorProp.length){
            			// many factor's on property
            			var defineUuid = selectedFactorProp[0];
            			
            			Ext.Array.each(selectedFactor, function(uuid){
            				var factor = factorStore.findRecordByKey('uuid', uuid),
            					property = factor.getProperty(defineUuid),
            				    newRecord;
            				    
            				if(!property || 1!==parseInt(property.dataType)){
            					return;
            				}
            				
            				newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', property.name);
            				newRecord.set('value', parseFloat(property.value));
            				
            				newStore.add(newRecord);
            			});
            		}else {
            			// one factor's  many properties
            			var factor = factorStore.findRecordByKey('uuid', selectedFactor[0]);
            			
            			Ext.Array.each(selectedFactorProp, function(defineUuid){
            				var property = factor.getProperty(defineUuid),
            				    newRecord;
            				    
            				if(!property || 1!==parseInt(property.dataType)){
            					return;
            				}
            				
            				newRecord = new Layout.model.CommonFactorModel();
            				
            				Ext.apply(newRecord.data, property);
            				newRecord.set('name', newRecord.get('name'));
            				newStore.add(newRecord);
            			});
            			
            		}
            		
            		
            		// ------------end--------------
            	
            		chartPanel.add(
            		
	            		Ext.create('Layout.chart.Pie', {
	            			store : newStore
	            		})
            		
            		);
            		
            	}
            },
            '#chart-column' : {
            	click : function(e){
            		Ext.getCmp('chartBtn').setText(e.text);
            		var selectedFactor = this.getComboFactor().getValue(),
            		    selectedFactorProp = this.getComboFactorProp().getValue(),
            		    newStore = new Layout.store.CommonFactorStore(),
            		    factorStore = Layout.EventSchedule.factorStore,
            		    chartPanel = this.getChartPanel(),
            		    valueFields = [];
            		
            		chartPanel.removeAll();
            		
            		if(!selectedFactor || 0 === selectedFactor.length){
            			console.log('You havn`t select factor!');
            			return;
            		}
            		
            		selectedFactorProp = !selectedFactorProp||Ext.isArray(selectedFactorProp)?
            				selectedFactorProp: [selectedFactorProp];
            		
            		// ------------start--------------
            		if(!selectedFactorProp || 0 === selectedFactorProp.length){
            			valueFields.push('值');
            			// factor
            			Ext.Array.each(selectedFactor, function(uuid){
            				var factor = factorStore.findRecordByKey('uuid', uuid),
            				    newRecord;
            				    
            				if(1!==parseInt(factor.get('dataType'))){
            					return;
            				}
            				
            				newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', factor.get('name'));
            				newRecord.set('值', factor.get('value'));
            				
            				newStore.add(newRecord);
            			});
            		}else if(selectedFactorProp.length > 0 && selectedFactor.length>1){
            			// many factor's property
            			Ext.Array.each(selectedFactor, function(uuid){
            				var factor = factorStore.findRecordByKey('uuid', uuid),
            				    newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', factor.get('name'));
            				Ext.Array.each(selectedFactorProp, function(defineUuid){
            					var property = factor.getProperty(defineUuid);
            					
            					if(!property || 1!==parseInt(property.dataType)){
                					return;
                				}
            					
            					if(!Ext.Array.contains(valueFields, property.name)){
            						valueFields.push(property.name);
            					}
            					newRecord.set(property.name, property.value);
            				});
            				
            				newStore.add(newRecord);
            			});
            			
            		}else {
            			valueFields.push('值');
            			// one factor's  many properties
            			var factor = factorStore.findRecordByKey('uuid', selectedFactor[0]);
            			
            			Ext.Array.each(selectedFactorProp, function(defineUuid){
            				var property = factor.getProperty(defineUuid),
            				    newRecord;
            				    
            				if(!property || 1!==parseInt(property.dataType)){
            					return;
            				}
            				
            				newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', property.name);
            				newRecord.set('值', property.value);
            				
            				newStore.add(newRecord);
            			});
            			
            		}
            		
            		
            		// ------------end--------------
            		chartPanel.add(
            		
            			Ext.create('Layout.chart.Column', {
	            			store : newStore,
	            			valueFields : valueFields
	            		})
            		
            		);
            		
            	}
            }
            ,
            '#chart-radar' : {
            	click : function(e){
            		Ext.getCmp('chartBtn').setText(e.text);
            		var selectedFactor = this.getComboFactor().getValue(),
            		    selectedFactorProp = this.getComboFactorProp().getValue(),
            		    newStore = new Layout.store.CommonFactorStore(),
            		    factorStore = Layout.EventSchedule.factorStore,
            		    chartPanel = this.getChartPanel(),
            		    valueFields = [];
            		
            		chartPanel.removeAll();
            		
            		if(!selectedFactor || 0 === selectedFactor.length){
            			console.log('You havn`t select factor!');
            			return;
            		}
            		
            		selectedFactorProp = !selectedFactorProp||Ext.isArray(selectedFactorProp)?
            				selectedFactorProp: [selectedFactorProp];
            		
            		// ------------start--------------
            		if(!selectedFactorProp || 0 === selectedFactorProp.length){
            			valueFields.push('值');
            			// factor
            			Ext.Array.each(selectedFactor, function(uuid){
            				var factor = factorStore.findRecordByKey('uuid', uuid),
            				    newRecord;
            				    
            				if(1!==parseInt(factor.get('dataType'))){
            					return;
            				}
            				
            				newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', factor.get('name'));
            				newRecord.set('值', factor.get('value'));
            				
            				newStore.add(newRecord);
            			});
            		}else if(selectedFactorProp.length > 0 && selectedFactor.length>1){
            			// many factor's property
            			Ext.Array.each(selectedFactor, function(uuid){
            				var factor = factorStore.findRecordByKey('uuid', uuid),
            				    newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', factor.get('name'));
            				Ext.Array.each(selectedFactorProp, function(defineUuid){
            					var property = factor.getProperty(defineUuid);
            					
            					if(!property || 1!==parseInt(property.dataType)){
                					return;
                				}
            					
            					if(!Ext.Array.contains(valueFields, property.name)){
            						valueFields.push(property.name);
            					}
            					newRecord.set(property.name, property.value);
            				});
            				
            				newStore.add(newRecord);
            			});
            			
            		}else {
            			valueFields.push('值');
            			// one factor's  many properties
            			var factor = factorStore.findRecordByKey('uuid', selectedFactor[0]);
            			
            			Ext.Array.each(selectedFactorProp, function(defineUuid){
            				var property = factor.getProperty(defineUuid),
            				    newRecord;
            				    
            				if(!property || 1!==parseInt(property.dataType)){
            					return;
            				}
            				
            				newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', property.name);
            				newRecord.set('值', property.value);
            				
            				newStore.add(newRecord);
            			});
            			
            		}
            		
            		
            		// ------------end--------------
            		chartPanel.add(
            		
            			Ext.create('Layout.chart.Radar', {
	            			store : newStore,
	            			valueFields : valueFields
	            		})
            		
            		);
            		
            	}
            }
            ,
            '#chart-line' : {
            	click : function(e){
            		Ext.getCmp('chartBtn').setText(e.text);
            		var selectedFactor = this.getComboFactor().getValue(),
            		    selectedFactorProp = this.getComboFactorProp().getValue(),
            		    newStore = new Layout.store.CommonFactorStore(),
            		    factorStore = Layout.EventSchedule.factorStore,
            		    chartPanel = this.getChartPanel(),
            		    valueFields = [];
            		
            		chartPanel.removeAll();
            		
            		if(!selectedFactor || 0 === selectedFactor.length){
            			console.log('You havn`t select factor!');
            			return;
            		}
            		
            		selectedFactorProp = !selectedFactorProp||Ext.isArray(selectedFactorProp)?
            				selectedFactorProp: [selectedFactorProp];
            		
            		// ------------start--------------
            		if(!selectedFactorProp || 0 === selectedFactorProp.length){
            			valueFields.push('值');
            			// factor
            			Ext.Array.each(selectedFactor, function(uuid){
            				var factor = factorStore.findRecordByKey('uuid', uuid),
            				    newRecord;
            				    
            				if(1!==parseInt(factor.get('dataType'))){
            					return;
            				}
            				
            				newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', factor.get('name'));
            				newRecord.set('值', parseFloat(factor.get('value')));
            				
            				newStore.add(newRecord);
            			});
            		}else if(selectedFactorProp.length > 1 && selectedFactor.length>1){
            			// many factor's property
            			
            			Ext.Array.each(selectedFactorProp, function(defineUuid){
        				    var newRecord = new Layout.model.CommonFactorModel();
            				
            				Ext.Array.each(selectedFactor, function(uuid){
            					var factor = factorStore.findRecordByKey('uuid', uuid),
            						property = factor.getProperty(defineUuid);
            					
            					if(!property || 1!==parseInt(property.dataType)){
                					return;
                				}
            					
            					if(!Ext.Array.contains(valueFields, factor.get('name'))){
            						valueFields.push(factor.get('name'));
            					}
            					
            					newRecord.set('name', property.name);
            					newRecord.set(factor.get('name'), parseFloat(property.value));
            				});
            				newStore.add(newRecord);
            			});
            			
            		}else {
            			// one factor's  many properties
            			Ext.Array.each(selectedFactor, function(uuid){
            				var factor = factorStore.findRecordByKey('uuid', uuid),
            					property = factor.getProperty(selectedFactorProp[0]),
            				    newRecord;
            				    
            				if(!property || 1!==parseInt(property.dataType)){
            					return;
            				}
            				
            				if(!Ext.Array.contains(valueFields, property.name)){
        						valueFields.push(property.name);
        					}
            				
            				newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', factor.get('name'));
            				newRecord.set(property.name, parseFloat(property.value));
            				
            				newStore.add(newRecord);
            			});
            			
            		}
            		
            		
            		// ------------end--------------
            		chartPanel.add(
            		
            			Ext.create('Layout.chart.Line', {
	            			store : newStore,
	            			valueFields : valueFields
	            		})
            		
            		);
            		
            	}
            },
            /********************************************************************/
            /********************************************************************/
            /********************************************************************/
            '#chart-stackeBar' : {
            	click : function(e){
            		Ext.getCmp('chartBtn').setText(e.text);
            		var selectedFactor = this.getComboFactor().getValue(),
            		    selectedFactorProp = this.getComboFactorProp().getValue(),
            		    newStore = new Layout.store.CommonFactorStore(),
            		    factorStore = Layout.EventSchedule.factorStore,
            		    chartPanel = this.getChartPanel(),
            		  
            		    valueFields = [];
            		
            		chartPanel.removeAll();
            		
            		if(!selectedFactor || 0 === selectedFactor.length){
            			console.log('You havn`t select factor!');
            			return;
            		}
            		
            		selectedFactorProp = !selectedFactorProp||Ext.isArray(selectedFactorProp)?
            				selectedFactorProp: [selectedFactorProp];
            		
            		// ------------start--------------
            		if(!selectedFactorProp || 0 === selectedFactorProp.length){
            			valueFields.push('值');
            			// factor
            			Ext.Array.each(selectedFactor, function(uuid){
            				var factor = factorStore.findRecordByKey('uuid', uuid),
            				    newRecord;
            				    
            				if(1!==parseInt(factor.get('dataType'))){
            					return;
            				}
            				
            				newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', factor.get('name'));
            				newRecord.set('值', factor.get('value'));
            				
            				newStore.add(newRecord);
            			});
            		}else if(selectedFactorProp.length > 0 && selectedFactor.length>1){
            			// many factor's property
            			Ext.Array.each(selectedFactor, function(uuid){
            				var factor = factorStore.findRecordByKey('uuid', uuid),
            				    newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', factor.get('name'));
            				Ext.Array.each(selectedFactorProp, function(defineUuid){
            					var property = factor.getProperty(defineUuid);
            					
            					if(!property || 1!==parseInt(property.dataType)){
                					return;
                				}
            					
            					if(!Ext.Array.contains(valueFields, property.name)){
            						valueFields.push(property.name);
            					}
            					newRecord.set(property.name, property.value);
            				});
            				
            				newStore.add(newRecord);
            			});
            			
            		}else {
            			valueFields.push('值');
            			// one factor's  many properties
            			var factor = factorStore.findRecordByKey('uuid', selectedFactor[0]);
            			
            			Ext.Array.each(selectedFactorProp, function(defineUuid){
            				var property = factor.getProperty(defineUuid),
            				    newRecord;
            				    
            				if(!property || 1!==parseInt(property.dataType)){
            					return;
            				}
            				
            				newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', property.name);
            				newRecord.set('值', property.value);
            				
            				newStore.add(newRecord);
            			   
            			});
            			
            		}
            		
            		
            		// ------------end--------------
            		chartPanel.add(
            		
            			Ext.create('Layout.chart.StackedBar', {
	            			store : newStore,
	            			valueFields : valueFields
	            		})
            		
            		);
            		
            	}
            },
            '#chart-scatter' : {
            	click : function(e){
            		Ext.getCmp('chartBtn').setText(e.text);
            		var selectedFactor = this.getComboFactor().getValue(),
            		    selectedFactorProp = this.getComboFactorProp().getValue(),
            		    newStore = new Layout.store.CommonFactorStore(),
            		    factorStore = Layout.EventSchedule.factorStore,
            		    chartPanel = this.getChartPanel(),
            		    fields = [];
            		    valueFields = [];
            	
            		chartPanel.removeAll();
            		
            		if(!selectedFactor || 0 === selectedFactor.length){
            			console.log('You havn`t select factor!');
            			return;
            		}
            		
            		selectedFactorProp = !selectedFactorProp||Ext.isArray(selectedFactorProp)?
            				selectedFactorProp: [selectedFactorProp];
            		selectedFactor = !selectedFactor||Ext.isArray(selectedFactor)?
            				selectedFactor: [selectedFactor];
            		// ------------start--------------
            	 if(selectedFactorProp.length > 0 && selectedFactor.length>1){
            			// many factor's property
            			Ext.Array.each(selectedFactor, function(uuid){
            				var factor = factorStore.findRecordByKey('uuid', uuid);
            				    newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', factor.get('name'));
            				Ext.Array.each(selectedFactorProp, function(defineUuid){
            					var property = factor.getProperty(defineUuid);
            					
            					if(!property || 1!==parseInt(property.dataType)){
                					return;
                				}
            					
            					if(!Ext.Array.contains(valueFields, property.name)){
            						valueFields.push(property.name);
            					}
            				    newRecord.set(property.name, parseFloat(property.value));
            				});
            				
            				newStore.add(newRecord);
            			});
            			
            		}else{
            			console.log('Your data doesn\'t match this chart !');
            			$('#chartPanel-body').html('<p>散点图不适合您选择的数据模型，请选择其他图形。</p>');
            			return;
            		}
            		
            	
            		// ------------end--------------
            		chartPanel.add(
            		
            			Ext.create('Layout.chart.Scatter', {
	            			store : newStore,
	            			valueFields : valueFields
	            		})
            		
            				
            		);
            		
            	}
            },
            '#chart-bubble' : {
            	click : function(e){
            		Ext.getCmp('chartBtn').setText(e.text);
            		var selectedFactor = this.getComboFactor().getValue(),
            		    selectedFactorProp = this.getComboFactorProp().getValue(),
            		    newStore = new Layout.store.CommonFactorStore(),
            		    factorStore = Layout.EventSchedule.factorStore,
            		    chartPanel = this.getChartPanel(),
            		    valueFields = [],
            		     //假设 最小半径的初始值int类型最大值
            		    minRadius = 2147483648,
            			chart;
            		
            		
            	
            			//circleprop ={};
            		
            		chartPanel.removeAll();
            		
            		if(!selectedFactor || 0 === selectedFactor.length){
            			console.log('You havn`t select factor!');
            			return;
            		}
            		
            		selectedFactorProp = !selectedFactorProp||Ext.isArray(selectedFactorProp)?
            				selectedFactorProp: [selectedFactorProp];
            		selectedFactor = !selectedFactor||Ext.isArray(selectedFactor)?
            				selectedFactor: [selectedFactor];
            		// ------------start--------------
            	 if(selectedFactorProp.length > 0 && selectedFactor.length>1){
            			// many factor's property
            			Ext.Array.each(selectedFactor, function(uuid,index){
            				var factor = factorStore.findRecordByKey('uuid', uuid);
            				    newRecord = new Layout.model.CommonFactorModel();
            				
            				 newRecord.set('name', factor.get('name')+"  "+factor.get('value'));
            				 newRecord.set('radius', factor.get('value'));
            				 //取最小的半径
            				 if(factor.get('value')<minRadius) minRadius =factor.get('value');
            				Ext.Array.each(selectedFactorProp, function(defineUuid){
            					var property = factor.getProperty(defineUuid);
            					
            					if(!property || 1!==parseInt(property.dataType)){
                					return;
                				}
            					
            					if(!Ext.Array.contains(valueFields, property.name)){
            						valueFields.push(property.name);
            					}
            					
            				    newRecord.set(property.name, parseFloat(property.value));
            				   
            				   
            				});
            				
            				newStore.add(newRecord);
            				
            			});
            			
            		}else{
            			console.log('Your data doesn\'t match this chart !');
            			$('#chartPanel-body').html('<p>气泡图不适合您选择的数据模型，请选择其他图形。</p>');
            			return;
            		}
            		
            		
            		// ------------end--------------

            	 	
            	   chartPanel.add(	Ext.create('Layout.chart.Bubble', {
				              			store : newStore,
				            			valueFields : valueFields,
				            			minRadius : minRadius
				            		})
				            	);
            		
            	}
            },
            /**************金子塔图****************/
            '#chart-pyramid' : {
            	click : function(e){
            		Ext.getCmp('chartBtn').setText(e.text);
            		var selectedFactor = this.getComboFactor().getValue(),
            		    selectedFactorProp = this.getComboFactorProp().getValue(),
            		    newStore = new Layout.store.CommonFactorStore(),
            		    factorStore = Layout.EventSchedule.factorStore,
            		    chartPanel = this.getChartPanel(),
            		    valueFields = [],
            		    h0 = 100;
            		    component ;
            		
            
            		
            		chartPanel.removeAll();
            		
            		if(!selectedFactor || 0 === selectedFactor.length){
            			console.log('You havn`t select factor!');
            			return;
            		}
            		
            		selectedFactorProp = !selectedFactorProp||Ext.isArray(selectedFactorProp)?
            				selectedFactorProp: [selectedFactorProp];
            		selectedFactor = !selectedFactor||Ext.isArray(selectedFactor)?
            				selectedFactor: [selectedFactor];
            		// ------------start--------------
            		
            		if(!selectedFactorProp || 0 === selectedFactorProp.length){
            			// factor 
            			Ext.Array.each(selectedFactor, function(uuid){
            				var factor = factorStore.findRecordByKey('uuid', uuid),
            				    newRecord;
            				
            				newRecord = new Layout.model.CommonFactorModel();
            				newRecord.set('name', factor.get('name'));
            				newRecord.set('值', factor.get('value'));
            				
            				newStore.add(newRecord);
            			});
            		}else if(1 === selectedFactorProp.length &&  selectedFactor.length > 1){
            			// one factor's property
            			Ext.Array.each(selectedFactor, function(uuid,index){
            				var factor = factorStore.findRecordByKey('uuid', uuid);
            				    newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', factor.get('name'));
            				
            				var defineUuid = selectedFactorProp[0];
            				var property = factor.getProperty(defineUuid);
            					
            					if(!property){
                					return;
                				}
            					
            					if(!Ext.Array.contains(valueFields, property.name)){
            						valueFields.push({'name':factor.get('name'),'value':property.name});
            					}
            					
            				    newRecord.set(property.name, parseFloat(property.value));
            				   
            				
            				newStore.add(newRecord);
            				
            			});
            			
            		}else if(selectedFactorProp.length > 1 && 1 === selectedFactor.length){
            			// many factor's property
            			Ext.Array.each(selectedFactor, function(uuid,index){
            				var factor = factorStore.findRecordByKey('uuid', uuid);
            				    newRecord = new Layout.model.CommonFactorModel();
            				
            				newRecord.set('name', factor.get('name'));
            				Ext.Array.each(selectedFactorProp, function(defineUuid){
            					var property = factor.getProperty(defineUuid);
            					
            					if(!property ){
                					return;
                				}
            					
            					if(!Ext.Array.contains(valueFields, property.name)){
            						valueFields.push({'name':property.name,'value':property.value});
            					}
            					
            				    newRecord.set(property.name, parseFloat(property.value));
            				   
            				});
            				
            				newStore.add(newRecord);
            			});
            		}else {
            			console.log('Your data doesn\'t match this chart !');
            			$('#chartPanel-body').html('<p>金字塔图不适合您选择的数据模型，请选择其他图形。</p>');
            			return;
            			
            		}
            		
            		
            		// ------------end--------------

//            		
            	  h0 = parseFloat(500/(valueFields.length));
	            	var drawComponent =  Ext.create('Layout.chart.Pyramid', {
	             			store : newStore,
	          			valueFields : valueFields,
	          			h0 :h0
	          		})
	            	 
            	   chartPanel.add(drawComponent);

            		
            	}
            },
            
            /******************************************选取数据集**************************************/ 
            '#selectdata' : {
            	click : function(e){
				            	 
            		var win ;
            		if(win) {
            			win.show();
            		}else {
            			win = 	Ext.create('Ext.window.Window', {
                		    title: 'Hello',
                		    height: 600,
                		    width: 500,
                		    layout:'fit',
                		    items: {
                		    		xtype: 'datasetPanel'
                		    		}
                		});
            			win.show();
            		}

            	}
            }
            
    	});
    },
    
    showChartPie : function (){

		  var   factorStore = Ext.getCmp('data-factor').getStore(),
		  		chartPanel = this.getChartPanel();
		
				chartPanel.removeAll();
		
		
		
		// ------------start--------------
				// factor
				Ext.Array.each(factorStore, function(uuid){
					var factor = factorStore.findRecordByKey('uuid', uuid),
					    newRecord;
					    
					if(1!==parseInt(factor.get('dataType'))){
						return;
					}
					
					newRecord = new Layout.model.CommonFactorModel();
					newRecord.set('name', factor.get('name'));
					newRecord.set('value', parseFloat(factor.get('value')));
					
					newStore.add(newRecord);
				});
		
		
		// ------------end--------------
	
		chartPanel.add(
		
    		Ext.create('Layout.chart.Pie', {
    			store : newStore
    		})
		
		);
		
	
    	
    }
});