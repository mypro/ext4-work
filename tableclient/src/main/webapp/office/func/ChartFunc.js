Ext.define('Layout.func.ChartFunc',{
//	this.dataRecords='',
	 /**
     * create column
     */
    showChart_column : function (){
    	
		var selectedFactor =  Ext.getCmp('data-factor').getValue(),
		    selectedFactorProp =  Ext.getCmp('data-factorprop').getValue(),
		    newStore = new Layout.store.CommonFactorStore(),
		    factorStore = Layout.EventSchedule.factorStore,
		    chartPanel = Ext.getCmp('chartPanel'),
		    isQuery = false,
		    category=[],
		    valueFields = [];
		
		chartPanel.removeAll();
		
		if(!selectedFactor || 0 === selectedFactor.length){
			$('#chartPanel-body').html('<p>You havn`t select factor!</p>');
			return;
		}
		
		selectedFactorProp = !selectedFactorProp||Ext.isArray(selectedFactorProp)?
				selectedFactorProp: [selectedFactorProp];
		/***************start****************/
		if(selectedFactor.length ===1){
				if(selectedFactorProp.length ===0){

					var factor = factorStore.findRecordByKey('uuid', selectedFactor[0]),
						queryUuid = factor.get('queryUuid'),
						newRecord,
						dataRecords;
						if(queryUuid){
							isQuery = true;
							Layout.ChartFunc.queryData(factor.get('queryUuid'),factor.get('valueKeyword'));
							dataRecords= Ext.getCmp('dataRecords').getValue();
										Ext.Array.each(dataRecords, function(record,index){
												for(var key in record){
													if(!Ext.Array.contains(valueFields, key)){
														valueFields.push(key);
					            					}
												}
												
										        newRecord = new Layout.model.CommonFactorModel();
										        for(var key in record){
										        	newRecord.set(key, record[key]);
												}
												newRecord.set('category', factor.get('name'));
												newStore.add(newRecord);
											});
							
								
							}else{
								category.push('category');
								valueFields.push('值');
								// factor
								Ext.Array.each(selectedFactor, function(uuid){
									var factor = factorStore.findRecordByKey('uuid', uuid),
									    newRecord;
									
									
										if(!parseInt(factor.get('value'))){
											console.log('非数值类型')
											return;
										}
										
										newRecord = new Layout.model.CommonFactorModel();
										
										newRecord.set('category', factor.get('name'));
										newRecord.set('值', factor.get('value'));
										
										newStore.add(newRecord);
										
								});
							}
				}else if(selectedFactorProp.length ===1){
						
						var factor = factorStore.findRecordByKey('uuid', selectedFactor[0]),
						    property = factor.getProperty(selectedFactorProp[0]),
						    queryUuid = property.queryUuid;
						
						if(queryUuid){
							isQuery = true;
							Layout.ChartFunc.queryData(property['queryUuid'],property['valueKeyword']);
							dataRecords= Ext.getCmp('dataRecords').getValue();
							Ext.Array.each(dataRecords, function(record,index){
								for(var key in record){
									if(!Ext.Array.contains(valueFields, key)){
										valueFields.push(key);
	            					}
								}
								
						        var newRecord = new Layout.model.CommonFactorModel();
						        for(var key in record){
						        	newRecord.set(key, record[key]);
								}
								newRecord.set('category', factor.getName());
								newStore.add(newRecord);
							});
							
						}else{
							category.push('category');
							valueFields.push(property.name);
							if(!property || !parseInt(property.value)){
								console.log('非数值类型')
								return;
							}
							
							newRecord = new Layout.model.CommonFactorModel();
							
							newRecord.set('category', factor.get('name'));
							newRecord.set(property.name, property.value);
							
							newStore.add(newRecord);
							
						}
					
					
					
					
					
				}else {
					category.push('category');
					
					var factor = factorStore.findRecordByKey('uuid', selectedFactor[0]),
						newRecord = new Layout.model.CommonFactorModel();
						newRecord.set('category', factor.get('name'));
						Ext.Array.each(selectedFactorProp, function(defineUuid){
							var property = factor.getProperty(defineUuid);
							
							if(!property || !parseInt(property.value)){
		    					return;
		    				}
							
							if(!Ext.Array.contains(valueFields, property.name)){
								valueFields.push(property.name);
							}
							newRecord.set(property.name, property.value);
						});
				
						newStore.add(newRecord);
				
				}
		}else{
				if(selectedFactorProp.length ===0){
					category.push('category');
					valueFields.push('值');
					// factor
					Ext.Array.each(selectedFactor, function(uuid){
						var factor = factorStore.findRecordByKey('uuid', uuid),
						    newRecord;
						
						
							if(!parseInt(factor.get('value'))){
								return;
							}
							
							newRecord = new Layout.model.CommonFactorModel();
							
							newRecord.set('category', factor.get('name'));
							newRecord.set('值', factor.get('value'));
							
							newStore.add(newRecord);
						
						
					});
				}else if(selectedFactorProp.length ===1){
					
							category.push('category');
							
							// factor
							Ext.Array.each(selectedFactor, function(uuid){
								var factor = factorStore.findRecordByKey('uuid', uuid),
								 	property = factor.getProperty(selectedFactorProp[0]),
								    newRecord;
								
								
									if(!parseInt(factor.get('value'))){
										return;
									}
									if(!Ext.Array.contains(valueFields, property.name)){
										valueFields.push(property.name);
	            					}
									newRecord = new Layout.model.CommonFactorModel();
									
									newRecord.set('category', factor.get('name'));
									newRecord.set(property.name, property.value);
									
									newStore.add(newRecord);
								
								
							});
						
				}else {
							category.push('category');
					
							Ext.Array.each(selectedFactor, function(uuid){
							var factor = factorStore.findRecordByKey('uuid', uuid),
							    newRecord = new Layout.model.CommonFactorModel();
							
								newRecord.set('category', factor.get('name'));
								Ext.Array.each(selectedFactorProp, function(defineUuid){
									var property = factor.getProperty(defineUuid);
									
									if(!property || !parseInt(property.value)){
				    					return;
				    				}
									
									if(!Ext.Array.contains(valueFields, property.name)){
										valueFields.push(property.name);
									}
									newRecord.set(property.name, property.value);
								});
							
							newStore.add(newRecord);
						});
				}
		}
		/***************end****************/
	
		// ------------end--------------
		chartPanel.add(
		
			Ext.create('Layout.chart.Column', {
    			store       : newStore,
    			valueFields : valueFields,
    			isQuery     : isQuery,
    			category    :category
    		})
		
		);
		
	},
    /**
     * create pie
     */
    showChart_pie : function (){
    	
    	var selectedFactor =  Ext.getCmp('data-factor').getValue(),
	    	selectedFactorProp =  Ext.getCmp('data-factorprop').getValue(),
    		 newStore            = new Layout.store.CommonFactorStore(),
    		 factorStore = Layout.EventSchedule.factorStore,
    		 isQuery = false,
 		     category=[],
    		 valueFields = [],
		     chartPanel 			= Ext.getCmp('chartPanel');
			
    		chartPanel.removeAll();
			

    		
    		if(!selectedFactor || 0 === selectedFactor.length){
    			$('#chartPanel-body').html('<p>You havn`t select factor!</p>');
    			return;
    		}
    		
    		selectedFactorProp = !selectedFactorProp||Ext.isArray(selectedFactorProp)?
    				selectedFactorProp: [selectedFactorProp];
    		
    		if(selectedFactor.length>1 && selectedFactorProp &&  selectedFactorProp.length>1){
    			console.log('You selected too much factor property!');
    			
    			$('#chartPanel-body').html('<p>饼图不适合您选择的数据模型，请选择其他图形。</p>');
    			return;
    		}
    		
    		/***************start****************/
    		if(selectedFactor.length ===1){
    				if(selectedFactorProp.length ===0){
    					category.push('category');
    					valueFields.push('value');
    					// factor
    	    			Ext.Array.each(selectedFactor, function(uuid){
    	    				var factor = factorStore.findRecordByKey('uuid', uuid),
    	    				    newRecord;
    	    				    
    	    				if(!parseInt(factor.get('value'))){
    	    					return;
    	    				}
    	    				
    	    				newRecord = new Layout.model.CommonFactorModel();
    	    				newRecord.set('category', factor.get('name'));
    	    				newRecord.set('name', factor.get('name'));
    	    				newRecord.set('value', parseFloat(factor.get('value')));
    	    				
    	    				newStore.add(newRecord);
    	    			});
    						if("有查询条件"){
    							
    						}else{
    							
    						}
    				}else if(selectedFactorProp.length ===1){
    						if("有查询条件"){
    							
    						}else{
    							
    						}
    					
    				}else {
    					
    					category.push('category');
    					// one factor's  many properties
    	    			var factor = factorStore.findRecordByKey('uuid', selectedFactor[0]);
    	    			
    	    			Ext.Array.each(selectedFactorProp, function(defineUuid){
    	    				var property = factor.getProperty(defineUuid),
    	    				    newRecord;
    	    				    
    	    				if(!property || !parseInt(property.value)){
    	    					return;
    	    				}
    	    				newRecord = new Layout.model.CommonFactorModel();
    	    				if(!Ext.Array.contains(valueFields,property.name)){
    	    					valueFields.push(property.name);
    	    				}
    	    				Ext.apply(newRecord.data, property);
    	    				newRecord.set('name', property.name);
    	    				newRecord.set('category', property.name);
    	    				newRecord.set('value', parseFloat(property.value));
    	    				newStore.add(newRecord);
    	    			});
    	    			
    				}
    		}else{
    				if(selectedFactorProp.length ===0){
    					category.push('category');
    					valueFields.push('value');
    					// factor
    	    			Ext.Array.each(selectedFactor, function(uuid){
    	    				var factor = factorStore.findRecordByKey('uuid', uuid),
    	    				    newRecord;
    	    				    
    	    				if(!parseInt(factor.get('value'))){
    	    					return;
    	    				}
    	    				
    	    				newRecord = new Layout.model.CommonFactorModel();
    	    				newRecord.set('category', factor.get('name'));
    	    				newRecord.set('name', factor.get('name'));
    	    				newRecord.set('value', parseFloat(factor.get('value')));
    	    				
    	    				newStore.add(newRecord);
    	    			});
    				}else if(selectedFactorProp.length ===1){
    					// many factor's on property
    	    			var defineUuid = selectedFactorProp[0];
    	    			category.push('category');
    					
    	    			Ext.Array.each(selectedFactor, function(uuid){
    	    				var factor = factorStore.findRecordByKey('uuid', uuid),
    	    					property = factor.getProperty(defineUuid),
    	    				    newRecord;
    	    				    
    	    				if(!property || !parseInt(property.value)){
    	    					return;
    	    				}
    	    				
    	    				newRecord = new Layout.model.CommonFactorModel();
    	    				
    	    				newRecord.set('name', factor.get('name'));
    	    				newRecord.set('category', factor.get('name'));
    	    				if(!Ext.Array.contains(valueFields,property.name)){
    	    					valueFields.push(property.name);
    	    				}
    	    				
    	    				newRecord.set(property.name, parseFloat(property.value));
    	    				
    	    				newStore.add(newRecord);
    	    			});
    				}
    		}
    		/***************end****************/
    	
    		chartPanel.add(
    		
        		Ext.create('Layout.chart.Pie', {
        			store : newStore,
        			valueFields : valueFields,
        			isQuery     : isQuery,
        			category    :category
        		})
    		
    		);
    		
    	
    	Ext.getCmp('chartPanel').show();
    },
    /**
     * create line
     */
    showChart_line : function (){
    	var selectedFactor     =  Ext.getCmp('data-factor').getValue(),
    		selectedFactorProp =  Ext.getCmp('data-factorprop').getValue(),
    		dataxFactorProp    =  Ext.getCmp('datax-factorprop').getValue(),
    		datayFactorProp    =  Ext.getCmp('datay-factorprop').getValue(),
    		newStore           = new Layout.store.CommonFactorStore(),
    		factorStore = Layout.EventSchedule.factorStore,
    		valueFields = [],
    		chartPanel 			= Ext.getCmp('chartPanel');
		
			chartPanel.removeAll();
			
		
		if(!selectedFactor || 0 === selectedFactor.length){
			$('#chartPanel-body').html('<p>You havn`t select factor!</p>');
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
				    
				if(!parseInt(factor.get('value'))){
					return;
				}
				
				newRecord = new Layout.model.CommonFactorModel();
				
				newRecord.set('name', factor.get('name'));
				newRecord.set('值', parseFloat(factor.get('value')));
				
				newStore.add(newRecord);
			});
		}else if(selectedFactorProp.length === 1 && selectedFactor.length===1){
					Ext.Array.each(selectedFactor, function(uuid){
						var factor = factorStore.findRecordByKey('uuid', uuid),
							property = factor.getProperty(selectedFactorProp[0]),
							newRecord,
							dataRecords;
							if(property['queryUuid']){
								Layout.ChartFunc.queryData(property['queryUuid'],property['valueKeyword']);
								dataRecords= Ext.getCmp('dataRecords').getValue();
											Ext.Array.each(dataRecords, function(record,index){
													for(var key in record){
														if(!Ext.Array.contains(valueFields, key)){
															valueFields.push(key);
						            					}
													}
													
											        newRecord = new Layout.model.CommonFactorModel();
											        for(var key in record){
											        	newRecord.set(key, parseFloat(record[key]));
													}
													newRecord.set('name', factor.getName());
													newStore.add(newRecord);
												});
									
								}
						});
						
		
		}else if(selectedFactorProp.length >= 2 && selectedFactor.length>1){
			// many factor's property
			Ext.Array.each(selectedFactor, function(uuid){
				var factor = factorStore.findRecordByKey('uuid', uuid);
				    newRecord = new Layout.model.CommonFactorModel();
				   
				newRecord.set('name', factor.get('name'));
				Ext.Array.each(selectedFactorProp, function(defineUuid,index){
					var property;
					if(index == 0){
						 property = factor.getProperty(dataxFactorProp[0])
					}else if(index ==1){
						 property = factor.getProperty(datayFactorProp[0])
					}
					
				
					if(!property ){return;	}
					if(!Ext.Array.contains(valueFields, property.name)){
						valueFields.push(property.name);
					}
				    newRecord.set(property.name, parseFloat(property.value));
					
				});
				
			    
				
				newStore.add(newRecord);
			});
			
		}else {
			$('#chartPanel-body').html('<p>散点图不适合您选择的数据模型，请选择其他图形');

			
		}
		
		
		// ------------end--------------
		chartPanel.add(
		
			Ext.create('Layout.chart.Line', {
    			store : newStore,
    			valueFields : valueFields
    		})
		
		);
		
	
	    	Ext.getCmp('chartPanel').show();
    },
    /**
     * create radar
     */
    showChart_radar : function (){
    	var selectedFactor =  Ext.getCmp('data-factor').getValue(),
    		selectedFactorProp =  Ext.getCmp('data-factorprop').getValue(),
    		newStore            = new Layout.store.CommonFactorStore(),
    		factorStore = Layout.EventSchedule.factorStore,
    		valueFields = [],
    		chartPanel 			= Ext.getCmp('chartPanel');
		
			chartPanel.removeAll();
			

    		
    		if(!selectedFactor || 0 === selectedFactor.length){
    			$('#chartPanel-body').html('<p>You havn`t select factor!</p>');
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
    				    
    				if(!parseInt(factor.get('value'))){
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
    					
    					if(!property || !parseInt(property.value)){
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
    				    
    				if(!property || !parseInt(property.value)){
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
    		
    	
	    	Ext.getCmp('chartPanel').show();
    },
    /**
     * create stacker
     */
    showChart_stacked : function (){
    	
    	var selectedFactor =  Ext.getCmp('data-factor').getValue(),
			selectedFactorProp =  Ext.getCmp('data-factorprop').getValue(),
			newStore            = new Layout.store.CommonFactorStore(),
			factorStore = Layout.EventSchedule.factorStore,
			valueFields = [],
			chartPanel 			= Ext.getCmp('chartPanel');
		
			chartPanel.removeAll();
		
		if(!selectedFactor || 0 === selectedFactor.length){
			$('#chartPanel-body').html('<p>You havn`t select factor!</p>');
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
				    
				if(!parseInt(factor.get('value'))){
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
					
					if(!property || !parseInt(property.value)){
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
				    
				if(!property || !parseInt(property.value)){
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
		
	
	    	Ext.getCmp('chartPanel').show();
    },
    /**
     * create scatter
     */
    showChart_scatter : function (){
    	var selectedFactor =  Ext.getCmp('data-factor').getValue(),
			selectedFactorProp =  Ext.getCmp('data-factorprop').getValue(),
			dataxFactorProp    =  Ext.getCmp('datax-factorprop').getValue(),
    		datayFactorProp    =  Ext.getCmp('datay-factorprop').getValue(),
			newStore            = new Layout.store.CommonFactorStore(),
			factorStore = Layout.EventSchedule.factorStore,
			valueFields = [],
			fields = [],
			chartPanel 			= Ext.getCmp('chartPanel');
		
			chartPanel.removeAll();
		
		if(!selectedFactor || 0 === selectedFactor.length){
			$('#chartPanel-body').html('<p>You havn`t select factor!</p>');
			return;
		}
		
		selectedFactorProp = !selectedFactorProp||Ext.isArray(selectedFactorProp)?
				selectedFactorProp: [selectedFactorProp];
		selectedFactor = !selectedFactor||Ext.isArray(selectedFactor)?
				selectedFactor: [selectedFactor];
		// ------------start--------------
	 if(selectedFactorProp.length > 0 ){
			if(selectedFactorProp.length === 1 && selectedFactor.length===1){
					Ext.Array.each(selectedFactor, function(uuid){
						var factor = factorStore.findRecordByKey('uuid', uuid),
							property = factor.getProperty(selectedFactorProp[0]),
							newRecord,
							dataRecords;
							if(property['queryUuid']){
								Layout.ChartFunc.queryData(property['queryUuid'],property['valueKeyword']);
								dataRecords= Ext.getCmp('dataRecords').getValue();
											Ext.Array.each(dataRecords, function(record,index){
													for(var key in record){
														if(!Ext.Array.contains(valueFields, key)){
															valueFields.push(key);
						            					}
													}
													
											        newRecord = new Layout.model.CommonFactorModel();
											        for(var key in record){
											        	newRecord.set(key, parseFloat(record[key]));
													}
													newRecord.set('name', factor.getName());
													newStore.add(newRecord);
												});
									
								}
						});
							
						}else{
						
							// many factor's property
							Ext.Array.each(selectedFactor, function(uuid){
								var factor = factorStore.findRecordByKey('uuid', uuid);
								    newRecord = new Layout.model.CommonFactorModel();
								
								newRecord.set('name', factor.get('name'));
								Ext.Array.each(selectedFactorProp, function(defineUuid ,index){
									
									var property;
									if(index == 0){
										 property = factor.getProperty(dataxFactorProp[0])
									}else if(index ==1){
										 property = factor.getProperty(datayFactorProp[0])
									}
									
									if(!property || !parseInt(property.value)){
										return;
									}
									
									if(!Ext.Array.contains(valueFields, property.name)){
										valueFields.push(property.name);
									}
								    newRecord.set(property.name, parseFloat(property.value));
								});
								
								newStore.add(newRecord);
							});
			 	
		
					}		
		 
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
		
	
	    	Ext.getCmp('chartPanel').show();
    },
    /**
     * create bubble
     */
    showChart_bubble : function (){
    	
      	var selectedFactor =  Ext.getCmp('data-factor').getValue(),
			selectedFactorProp =  Ext.getCmp('data-factorprop').getValue(),
			dataxFactorProp    =  Ext.getCmp('datax-factorprop').getValue(),
    		datayFactorProp    =  Ext.getCmp('datay-factorprop').getValue(),
			newStore            = new Layout.store.CommonFactorStore(),
			factorStore = Layout.EventSchedule.factorStore,
			valueFields = [],
			maxRadius = -1,
			chart,
			fields = [],
			chartPanel 			= Ext.getCmp('chartPanel');
	
      		chartPanel.removeAll();

		
		if(!selectedFactor || 0 === selectedFactor.length){
			$('#chartPanel-body').html('<p>You havn`t select factor!</p>');
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
				 //取最大的半径
				 if(parseFloat(factor.get('value'))){
					 if(factor.get('value')>maxRadius) maxRadius =factor.get('value');
					 Ext.Array.each(selectedFactorProp, function(defineUuid,index){
							var property;
							if(index == 0){
								 property = factor.getProperty(dataxFactorProp[0])
							}else if(index ==1){
								 property = factor.getProperty(datayFactorProp[0])
							}
							
							
							if(!property || !parseInt(property.value)){
		    					return;
		    				}
							
							if(!Ext.Array.contains(valueFields, property.name)){
								valueFields.push(property.name);
							}
							
						    newRecord.set(property.name, parseFloat(property.value));
						   
						   
						});
						
						newStore.add(newRecord);
				 }else {
					console.log('**********The factor value must be  number!');
					 
				 }
				
				
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
	            			maxRadius : maxRadius
	            		})
	            	);
		
	
	    	Ext.getCmp('chartPanel').show();
    },
    /**
     * create pyramid
     */
    showChart_pyramid : function (){
    	
     	var selectedFactor =  Ext.getCmp('data-factor').getValue(),
			selectedFactorProp =  Ext.getCmp('data-factorprop').getValue(),
			newStore            = new Layout.store.CommonFactorStore(),
			factorStore = Layout.EventSchedule.factorStore,
			valueFields = [],
			 minRadius = 2147483648,
			 h0 = 100,
		    component ,
			chart,
			fields = [],
			chartPanel 			= Ext.getCmp('chartPanel');

			chartPanel.removeAll();
		
		if(!selectedFactor || 0 === selectedFactor.length){
			$('#chartPanel-body').html('<p>You havn`t select factor!</p>');
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
				valueFields.push({'name':factor.get('name'),'value':factor.get('value')});
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
						valueFields.push({'name':factor.get('name'),'value':property.value});
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

		
	
    	Ext.getCmp('chartPanel').show();
    },
    
    queryData : function(queryUuid,valueKeyword){
    	  Ext.Ajax.request({
  	        url: '../work-platform/loadConfig.do?base=true',
  	        params:{
  				queryUuid :queryUuid
  			},
  	        reader: {
  	            type: 'json'
  	        },
  	        async:false,
            method: 'post',
        	success: function(response, options,dataRecords) {
				var record=Ext.decode(response.responseText)[0];
				var dataTableUuid=record['tableKeyword'];
				var conditionField=record['conditionField'];
				var resultField=[];
				for(var i=0;i<record['resultField'].length;i++){
					resultField.push(record['resultField'][i]);
				}
				resultField.push(valueKeyword);
				
				  Ext.Ajax.request({
		    		  url :'../../../work-platform/loadConditionData.do?base=true&condition='+ Ext.encode({
							dataTableUuid:dataTableUuid,
							conditionField:conditionField,
							resultField:resultField
						}),
		    	        reader: {
		    	            type: 'json'
		    	        },
		    	        async:false,
		               method: 'post',
		               success: function(response, options) {
		            	 var dataRecords = Ext.decode(response.responseText);
		            	  Ext.getCmp('dataRecords').setValue(dataRecords);
		               }
		            });
				}
          });
    	  
    }

});