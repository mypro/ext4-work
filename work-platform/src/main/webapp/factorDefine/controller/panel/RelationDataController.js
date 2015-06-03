Ext.define('Factor.controller.panel.RelationDataController', {
    extend: 'Factor.controller.Base',
    stores: [
             "RelationDataStore"
    ],
    models: [
             "FactorDataModel"   
    ],
    
    refs : [{
    	selector: '#relationDataGrid',  
        ref: 'relationDataGrid'
    }],

    init: function() {
    	this.control({
        	'#relationDataGrid' : {
        		containercontextmenu: this.rightClickPanel,
        		itemcontextmenu : this.rightClickItem,
        		select : this.selectRow,
        		afterrender: this.onPanelRendered,
        		beforeitemclick : this.rowClick,
        		containerdblclick:this.containerdblclick,
        		containerclick:this.containerclick
            }
        });
    },
    containerclick:function(){
//    	alert('containerclick');
    	document.getElementById('factorGrid_header').style.removeProperty('background-color');
    	document.getElementById('factorGrid_header').style.removeProperty('background-image');
    	document.getElementById('factorPropertyGrid_header').style.removeProperty('background-color');
    	document.getElementById('factorPropertyGrid_header').style.removeProperty('background-image');
    	document.getElementById('factorDataGrid_header').style.removeProperty('background-color');
    	document.getElementById('factorDataGrid_header').style.removeProperty('background-image');
    	document.getElementById('relationGrid_header').style.removeProperty('background-color');
    	document.getElementById('relationGrid_header').style.removeProperty('background-image');
    	document.getElementById('relationPropertyGrid_header').style.removeProperty('background-color');
    	document.getElementById('relationPropertyGrid_header').style.removeProperty('background-image');
    	
    	document.getElementById('relationDataGrid_header').style.setProperty('background-image','none');
    	document.getElementById('relationDataGrid_header').style.setProperty('background-color','rgb(117, 177, 218)');
    },
    
    onPanelRendered : function(){
    },
    
    rowClick : function(row, record, item, index, e){
    	this.containerclick();
    },
    
    selectRow : function(e, obj ,row){
    	// 联动因子属性表
    },
    
    rightClickPanel : function(menu, e){
	},
	
	rightClickItem : function(view, record, dom, row, e){
    },
    
	beforeEdit : function(){
	},
	
	editFinish : function(component){
	},
	containerdblclick:function(e , eOpts){
		
	},
	deleteFactor:function(){
	},
	setFactorData:function(queryUuid,valueKeyword){
		Ext.Ajax.request({ 
			url: '../work-platform/loadConfig.do?base=true',
			params:{
				queryUuid :queryUuid
			},
			success: function(response, options) {
				var record=Ext.decode(response.responseText)[0];
				var dataTableUuid=record['tableKeyword'];
				var conditionField=record['conditionField'];
				var resultField=[];
				for(var i=0;i<record['resultField'].length;i++){
					resultField.push(record['resultField'][i]);
				}
				resultField.push(valueKeyword);
				Ext.getCmp('dataFilterForm').down('#queryUuid').setValue(queryUuid);
				Ext.getCmp('dataFilterForm').down('#dsKeyword').setValue(record['dsKeyword']);
				Ext.getCmp('dataFilterForm').down('#dbKeyword').setValue(record['dbKeyword']);
				Ext.getCmp('dataFilterForm').down('#tableKeyword').setValue(record['tableKeyword']);
				Ext.getCmp('dataFilterForm').down('#valueKeyword').setValue(valueKeyword);
				Ext.getCmp('dataFilterForm').down('#resultField').setValue(record['resultField']);
				
				var columnModel= [Ext.create('Ext.grid.RowNumberer')];
				var fields=[];
				for(var i=0;i<record['resultField'].length;i++){
					var s=record['resultField'][i];
					var c={header:s,dataIndex:s,width:80};
					columnModel.push(c);
					fields.push(s);
				}
				columnModel.push({header:valueKeyword,dataIndex:valueKeyword,width:80,
					filter: {
		                type: 'string'
		            }});
				fields.push(valueKeyword);
				Ext.define('column', {
	    			extend: 'Ext.data.Model',
	    			fields: fields
	    		});
				var storeModel=Ext.create('Ext.data.Store', {
	    			id:'premeterStore',
	    			model: 'column',
	    			proxy: {
	    				type: 'ajax',
	    				url :'../../../work-platform/loadConditionData.do?condition='+ Ext.encode({
	    					dataTableUuid:dataTableUuid,
	    					conditionField:conditionField,
	    					resultField:resultField
						}),
	    				reader: {
	    					type: 'json'
	    				}
	    			},
	    			autoLoad: true
	    		});
				Factor.App.getPanelRelationDataControllerController().getRelationDataGrid().reconfigure( storeModel, columnModel);
			}
		});
	}
});