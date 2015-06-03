Ext.define('DataFilter.view.ConditionView',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.conditionView',
    
    initComponent : function(){
    	var barId = this.id;
    	var idPrefix = 'cmpt-conditionGrid-'+barId+'_';
    	this.title='条件';
    	/*this.store = Ext.create('DataFilter.store.ConditionGridStore', {
    		id : 'cmpt-conditionGrid-conditionGridStore'
        });*/
    	this.sortableColumns=false;
    	this.enableColumnHide=false;
    	this.selType= 'checkboxmodel';
    	this.tbar= [
    	            { 
    	            	xtype: 'button', 
    	            	text: '删除' ,
    	            	handler : function() {
    	            		var me=Ext.getCmp('conditionGrid');
    	            		var sm=me.getSelectionModel();
    	            		if(Ext.getCmp('conditionGrid').getStore().getCount()>1&&sm.selected.items[0]==Ext.getCmp('conditionGrid').getStore().getAt(Ext.getCmp('conditionGrid').getStore().getCount()-1)){
    	            			Ext.getCmp('conditionGrid').getStore().getAt(Ext.getCmp('conditionGrid').getStore().getCount()-2).set('logical','');
    	            		}
    	            		me.getStore().remove(sm.getSelection());
    	            		if(Ext.getCmp('conditionGrid').getStore().getCount()==0){
    	            			DataFilter.App.getDataFilterControllerController().addConditionRecord();
    	            		}
    	            	}
    	            }
    	            ];
    	this.columnLines=false;
    	this.columns = [{
			header : 'uuid',
			hideable : false,
			hidden : true,
			dataIndex : 'uuid',
			width : 80,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		}, {
			header : 'seq',
			hideable : false,
			hidden : true,
			dataIndex : 'seq',
			width : 80,
			editor : {
				xtype : 'textfield',
				allowBlank : false
			}
		}, {
			header : '左括号',
			id:idPrefix+'leftbracket',
			dataIndex : 'leftbracket',
			align:'center',
			renderer : function(dataIndex) {
				return getConditionNameByUuid(LEFTBRACKET,dataIndex);
			},
			width : 50,
			editor : {
				xtype : 'combo',
				store : getConditionStore(LEFTBRACKET),
				editable : false,
				emptyText : "请选择...",
				valueField : "conditionKeyword",
				displayField : "conditionName",
				mode : 'remote',
				triggerAction : 'all',
				allowBlank : false,
				anchor : '95%'
			}
		},{
			header : '列/值',
			id:idPrefix+'columnKeyword',
			dataIndex : 'columnKeyword',
			align:'center',
			renderer : function(dataIndex) {
				return getColumnNameByValue( dataIndex);
			},
			width : 90,
			editor : {
				xtype : 'combo',
				store : columnStore,
				emptyText : "请选择...",
				valueField : "keyword",
				displayField : "name",
				mode : 'remote',
				triggerAction : 'all',
				allowBlank : false,
				anchor : '95%',
                listeners:{
					'change':function(combotbl, newvar, oldvar){
						var type='';
						if(null!=combotbl.displayTplData){
							type=combotbl.displayTplData[0].type;
						}
						Ext.getCmp('conditionGrid').getSelectionModel().selected.items[0].set('columnKeywordType',type);
					}
                }
			}
		},{
			header : '字段类型',
			id:idPrefix+'columnKeywordType',
			dataIndex : 'columnKeywordType',
			align:'center',
			hidden:true,
			width : 90
		},{
			header : '条件',
			id:idPrefix+'operator',
			dataIndex : 'operator',
			align:'center',
			width : 50,
			renderer : function(dataIndex) {
				return getConditionNameByUuid(OPERATOR,dataIndex);
			},
			editor : {
				xtype : 'combo',
				store : getConditionStore(OPERATOR),
				editable : false,
				emptyText : "请选择...",
				valueField : "conditionKeyword",
				displayField : "conditionName",
				mode : 'remote',
				triggerAction : 'all',
				allowBlank : false,
				anchor : '95%'
			}
		},{
			header : '列/值',
			id:idPrefix+'columnValue',
			dataIndex : 'columnValue',
			align:'center',
			renderer : function(dataIndex) {
				return getColumnNameByValue( dataIndex);
			},
			width : 97,
			editor : {
				xtype : 'combo',
				store : columnStore,
				emptyText : "请选择...",
				valueField : "keyword",
				displayField : "name",
				mode : 'remote',
				triggerAction : 'all',
				allowBlank : false,
				anchor : '95%',
                listeners:{
					'change':function(combotbl, newvar, oldvar){
						var type=combotbl.displayTplData[0].type;
						Ext.getCmp('conditionGrid').getSelectionModel().selected.items[0].set('columnKeywordType',type);
					}
                }
			}
		},{
			header : '右括号',
			id:idPrefix+'rightbracket',
			dataIndex : 'rightbracket',
			align:'center',
			renderer : function(dataIndex) {
				return getConditionNameByUuid(RIGHTBRACKET,dataIndex);
			},
			width : 50,
			editor : {
				xtype : 'combo',
				store : getConditionStore(RIGHTBRACKET),
				editable : false,
				emptyText : "请选择...",
				valueField : "conditionKeyword",
				displayField : "conditionName",
				mode : 'remote',
				triggerAction : 'all',
				allowBlank : false,
				anchor : '95%'
			}
		},{
			header : '与/或',
			id:idPrefix+'logical',
			dataIndex : 'logical',
			align:'center',
			renderer : function(dataIndex) {
				return getConditionNameByUuid(LOGICAL,dataIndex);
			},
			width : 50,
			editor : {
				xtype : 'combo',
				store :getConditionStore(LOGICAL),
				editable : false,
				emptyText : "请选择...",
				valueField : "conditionKeyword",
				displayField : "conditionName",
				mode : 'remote',
				triggerAction : 'all',
				allowBlank : false,
				anchor : '95%',
	            listeners:{
					'change':function(combotbl, newvar, oldvar){
						if(''===oldvar){
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
						
					}
	            }
			}
		}];
    	
    	this.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			errorSummary : false
		}) ];
    	this.listeners = {
			'beforeedit':beforeedit
		};
    	this.callParent(arguments);
    }
    
    
});
function getColumnNameByValue(keyword){
	var store=columnStore;
	if(!store){
		return "";
	}
	for ( var i = 0; i < store.getCount(); i++) {
		var data = store.getAt(i).data;
		if (data.keyword === keyword) {
			return data.name;
		}
	}
	return keyword;
}
function beforeedit(){
	/*根据类型设置小数是否可用*/
	var me=this;
	var valueColumn=null;
	for(var i=0;i<me.columns.length;i++){
		valueColumn = me.columns[i];
		if("columnValue" === valueColumn.dataIndex){
			break;
		}
	}
	var selectRecord = me.getSelectionModel().selected.items[0];
	if(undefined==selectRecord) return;
	
	var type=selectRecord.get('columnKeywordType');
	if(valueColumn){
		if(COLUMNTYPE_DATE_1===type||COLUMNTYPE_DATE_2===type||COLUMNTYPE_DATE_3===type){
			var editor = {
					xtype : 'datefield',
				};
			
			valueColumn.setEditor(editor);
		}else {
			var editor = {
					xtype : 'combo',
					store : columnStore,
					emptyText : "请选择...",
					valueField : "keyword",
					displayField : "name",
					mode : 'remote',
					triggerAction : 'all',
					allowBlank : false,
					anchor : '95%',
	                listeners:{
						'change':function(combotbl, newvar, oldvar){
							/*var type=combotbl.displayTplData[0].type;
							Ext.getCmp('conditionGrid').getSelectionModel().selected.items[0].set('columnKeywordType',type);*/
						}
	                }
				};
			
			valueColumn.setEditor(editor);
		}
	}
}
