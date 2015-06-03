Ext.define('DataFilter.controller.DataFilterController', {
    extend: 'Ext.app.Controller',
    stores: [
             "TableStore",
             "ColumnStore",
             "ConditionStore",
             "ConditionTreeStore",
             "ConditionGridStore"
    ],
    models: [
             "ColumnModel",
             "TableModel"
    ],
    views: [
            'DataFilterForm'
    ],
    
    refs : [{  
        selector: '#dataFilterForm',  
        ref: 'dataFilterForm'  
    }],

    init: function() {
    	this.control({
    		'dataFilterForm button[action=addCondition]' : {
            	click:  this.addCondition
            },
            'dataFilterForm button[action=deleteCondition]' : {
            	click:  this.deleteCondition
            },
            'dataFilterForm button[action=saveCondition]' : {
            	click:  this.saveQuery
            },
            'dataFilterForm button[action=execCondition]' : {
            	click:  this.execQuery
            },
            'dataFilterForm':{
            	afterlayout:this.afterlayout
            }
        });
    	
    },
    afterlayout:function(){
    	
    },
    /*addCondition:function(){
    	Ext.getCmp('conditionTree').getRootNode().appendChild({
    		text:"asdf",
			name:"sdff",
			type:'1',
			children:[{text:'text',
						name:'name',
						type:'2',
						children:[],
						leaf:true}],
			leaf:false
    });
    },
    
    deleteCondition:function(){
    	alert('deleteCondition');
    },*/
    
    saveQuery:function(btn){
    	var queryUuid=Ext.getCmp('queryUuid').getValue(),
    		dsKeyword=Ext.getCmp('dsKeyword').getValue(),
    		dbKeyword=Ext.getCmp('dbKeyword').getValue(),
    		tableKeyword=Ext.getCmp('tableKeyword').getValue(),
    		valueKeyword=Ext.getCmp('valueKeyword').getValue(),
    		resultField=Ext.getCmp('resultField').getValue(),
    		conditionField=[];
    	var gridStore =Ext.getCmp('conditionGrid').getStore();
    	var bracket='';
    	var flag=0;
    	for(var i=0;i<gridStore.getCount();i++){
    		var record=gridStore.getAt(i);
    		conditionField.push(record.data);
    		bracket+=record.get('leftbracket')+record.get('rightbracket');
    	}
    	
    	for(var i=0;i<bracket.length;i++){
    		if(bracket.charAt(i)==='('){
    			flag++;
    		}else{
    			flag--;
    		}
    		if(flag<0){
    			 Ext.MessageBox.alert('提示', '查询条件括号不匹配');
    			 return;
    		}
    	}
    	if(flag!=0){
			 Ext.MessageBox.alert('提示', '查询条件括号不匹配');
			 return;
		}
    	/*var conditionTreeStore=Ext.getCmp('conditionTree').getStore();
//    	conditionField.push(conditionTreeStore.getRootNode().childNodes);
    	var treeNodes=function(parentNode){
    		var children=[]
    		for(var i=0;i<parentNode.childNodes.length;i++){
    			var record=parentNode.childNodes[i];
    			var node;
    			if(record.childNodes.length>0){
    				node={
    						text:record.get('text'),
    						name:record.get('name'),
    						type:'2',
    						children:treeNodes(record),
    						leaf:true
    				};
    			}else{
    				node={
    						text:record.get('text'),
    						name:record.get('name'),
    						type:'2',
    						children:[],
    						leaf:true
    				};
    			}
    			children.push(node);
    			
    		}
    		return children;
    	};
    	conditionField=treeNodes(conditionTreeStore.getRootNode());*/
    	var form = Ext.getCmp(FORM_ID);
    	if(form.callback && form.callback.saveQuery){
    		form.callback.saveQuery.call(form, form,queryUuid, dsKeyword, dbKeyword, tableKeyword, valueKeyword, resultField, conditionField);
    	}
    },
    
    execQuery:function(btn){
    	var queryUuid=Ext.getCmp('queryUuid').getValue(),
			dsKeyword=Ext.getCmp('dsKeyword').getValue(),
			dbKeyword=Ext.getCmp('dbKeyword').getValue(),
			tableKeyword=Ext.getCmp('tableKeyword').getValue(),
			valueKeyword=Ext.getCmp('valueKeyword').getValue(),
			resultField=Ext.getCmp('resultField').getValue(),
			conditionField=[];
		var gridStore =Ext.getCmp('conditionGrid').getStore();
		var bracket='';
		var flag=0;
		var records=Ext.getCmp('conditionGrid').getSelectionModel( ).getSelection( ); 
		Ext.Array.sort(records,function(r1,r2){return r1.get('seq')-r2.get('seq');});
		for(var i=0;i<records.length;i++){
			var record=records[i];
			conditionField.push(record.data);
			bracket+=record.get('leftbracket')+record.get('rightbracket');
		}
		
		for(var i=0;i<bracket.length;i++){
			if(bracket.charAt(i)==='('){
				flag++;
			}else{
				flag--;
			}
			if(flag<0){
				 Ext.MessageBox.alert('提示', '查询条件括号不匹配');
				 return;
			}
		}
		if(flag!=0){
			 Ext.MessageBox.alert('提示', '查询条件括号不匹配');
			 return;
		}
    	
    	var form = Ext.getCmp(FORM_ID);
    	if(form.callback && form.callback.execQuery){
    		form.callback.execQuery.call(form, form,queryUuid, dsKeyword, dbKeyword, tableKeyword, valueKeyword, resultField, conditionField);
    	}
    },
    
    addConditionRecord:function(combotbl, newvar, oldvar){
    	var gridStore =Ext.getCmp('conditionGrid').getStore();
    	var seq=0;
    	var index=gridStore.getCount();
        if(gridStore.getCount()>=1){
        	seq=gridStore.getAt(gridStore.getCount()-1).get('seq')+1024;
        }
    	var r=Ext.create('DataFilter.model.ConditionModel',{
    	'uuid':'',
        'seq':seq,
        'leftbracket':'',
        'columnKeyword':'',
        'operator':'',
        'columnValue':'',
        'rightbracket':'',
        'logical':''
    	});
    	gridStore.insert(index, r);
        var plug = Ext.getCmp('conditionGrid').getPlugin();
        plug.startEdit(index,0);
    }
    
    
});