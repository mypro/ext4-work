Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*'
]);
var SJSTcolumns;
var T_PARAM_TABLE_ID='aa473745579144b383df76a4cd47a18b';
function loadSJST(){
		if(grid==undefined) return;
		var blstStore= grid.getStore();
		var tbluuid=document.getElementById("tbluuid").value;
		if(blstStore.getModifiedRecords().length>0){
			var head ={tbluuid:tbluuid};
			saveBL(head,blstStore);
		}
		document.getElementById("center1").innerHTML = "";
		var toolbar=Ext.getCmp('toolbar');
//		toolbar.down('#removeBl').setDisabled(true);
//		toolbar.down('#addBl2').setDisabled(true);
		var dataUrl = '../../../work-platform/querydata.do?uuid='+tbluuid;
		var center1=Ext.get("center1");
		window.onresize=function(){
//			BLSTgrid.setWidth(0);
//			BLSTgrid.setWidth(center1.getComputedWidth());
		};
		SJSTcolumns = [];
		SJSTcolumns.push({
    		xtype: 'rownumberer',
    		width:40,
    		align:'center'
    	},
				{header: 'uuid',dataIndex: 'uuid',width:105},
				{header : 'seq',
					dataIndex : 'seq',
					width : 105});//组装columns
		var fields = [];
		fields.push('uuid');
		fields.push({name:'seq',type:'int'});
		for (var i = 0; i < blstStore.getCount(); i++) {
			var record = blstStore.getAt(i);
			if(''!=record.get('keyword')){
				var type =record.get('type');
				var paramDefine=record.get('paramDefine');
				var typeValue= getTypeByUuid(type);
				var editorType = '';
				var renderer = null;
				if(''===paramDefine){
				
					switch(typeValue)
					{
					case 1:
						fields.push(record.get('keyword'));
						if(COLUMNTYPE_DOLLAR===type){
							//renderer=Ext.util.Format.usMoney;
							
							renderer= Ext.util.Format.numberRenderer('$000');
						}else if(COLUMNTYPE_POINT===type){
							var w=record.get('width');
							var dw=record.get('decimalWidth');
							var formatStr='';
							for(var i=0;i<w;i++){
								formatStr+='0';
							}
							formatStr+='.';
							for(var i=0;i<dw;i++){
								formatStr+='0';
							}
							renderer= Ext.util.Format.numberRenderer('0,0');
						}
						SJSTcolumns.push({
				           // xtype: 'numbercolumn',
				            header: record.get('name')?record.get('name'):record.get('keyword'), 
				            dataIndex:record.get('keyword'),
				            //format: getFormatByUuid(type)===''?null:getFormatByUuid(type),
				            renderer:renderer,
				            width: record.get('showWidth'),
				            align:getAlign(record.get('showAlign')),
				            editor: {
				                xtype: 'numberfield',
	//			                allowBlank: false,
				                minValue: 1,
				                maxValue: 150000
				            }
				        });
						
						break;
					case 2:
						fields.push(record.get('keyword'));
						SJSTcolumns.push({
				            header: record.get('name')?record.get('name'):record.get('keyword'), 
				            dataIndex:record.get('keyword'),
				            width:record.get('showWidth'),
				            align:getAlign(record.get('showAlign')),
				            editor: {
	//			                allowBlank: false,
				                minValue: 1,
				                maxValue: 150000
				            }
				        });
						
						break;
					case 3:
						fields.push({name:record.get('keyword'),type:'date'/*,dateFormat:getFormatByUuid(type)*/});
						/*renderer=function(value){
						  if(value instanceof Date){   
						        return Ext.util.Format.date(value, getFormatByUuid(type));   
						    }else{   
						        return value;   
						    }  
						};*/
						SJSTcolumns.push({
				            //xtype: 'datecolumn',
				            header: record.get('name')?record.get('name'):record.get('keyword'), 
				            dataIndex:record.get('keyword'),
				            width: record.get('showWidth'),
				            renderer:Ext.util.Format.dateRenderer(getFormatByUuid(type)),
				            align:getAlign(record.get('showAlign')),
				            editor: new Ext.form.DateField({  
				                //在编辑器里面显示的格式,这里为09-10-20的格式  
				                format: getFormatByUuid(type)
				              })
				        });
						break;
					default:
						fields.push(record.get('keyword'));
						editorType='textfield';
						break;
					}
					
				}else{
					Ext.define('params', {
				        extend: 'Ext.data.Model',
				        fields: [
				              	'uuid',//序号
				              	'seq',
				 				'defineUuid',//
				 				'defineName',//
				 				'defineKeyword',//
				 				'value',//参数值
				 				'label',//参数标签
				 				'type'//
				     ]
				    });
					var paramStore=new Ext.data.Store({
								id : 'paramStore'+paramDefine,
								xtype : 'store',
								model : 'params',
								autoLoad: false,
							    proxy: {
							        type: 'ajax',
							        url :'../../../work-platform/queryParamsByDefineUUid.do',//此时留出tbl=是为了到时候修改表用的，如果要修改某给表的设计，可以传进来然后取出已有的字段
							        reader: {
							            type: 'json'
							        }
							    }
							});
					paramStore.load({
						params:{
							tblUuid : T_PARAM_TABLE_ID,
							defineUuid:paramDefine
						}
					});
					fields.push(record.get('keyword'));
					SJSTcolumns.push({
						header: record.get('name')?record.get('name'):record.get('keyword'), 
					    dataIndex:record.get('keyword'),
						align:getAlign(record.get('showAlign')),
						width : record.get('showWidth'),
	//					renderer : function(dataIndex) {
	//						return getParamNameByUuid(paramDefine, dataIndex);
	//					},
						editor : {
							xtype : 'combo',
	//						store : Ext.create('VariableGrid.store.DataAlignStore'),
							store:paramStore,
							editable : false,
							emptyText : "请选择...",
							valueField : "value",
							displayField : "label",
							mode : 'remote',
							triggerAction : 'all',
	//						allowBlank : false,
							anchor : '95%'
						}
			        });
				}
				/*SJSTcolumns.push({
						header: record.get('name')?record.get('name'):record.get('keyword'), 
						dataIndex: record.get('keyword'),
						editor: editorType,
						align:record.get('showAlign'),
						renderer : renderer,
						paramDefine : record.get('paramDefine')
				});//组装columns
	*/				
				//fields.push(record.get('keyword'));
			}
		}
		Ext.define('tbl', {
	        extend: 'Ext.data.Model',
	        fields: fields
	    });
		SJSTstoreData = Ext.create('Ext.data.Store', {
			model: 'tbl',
			proxy: {
				type: 'ajax',
				url:dataUrl,
				reader: {
					type: 'json',
					root:'aaData'
				}
			},
			autoLoad: true
		});
		SJSTstoreData.sort({
            property: 'seq',
            direction: 'ASC'
        });
		var s=true;
		SJSTgrid = Ext.create('Ext.ux.LiveSearchGridPanel', {
			id:'dataGrid',
			store: SJSTstoreData,
			columns:SJSTcolumns,
			selType: 'checkboxmodel',
	        renderTo: 'center1',
	        width : center1.getComputedWidth(),
			frame : true,
			height : center1.getComputedHeight(),
			columnLines:true,
	        plugins: [
	  				Ext.create('Ext.grid.plugin.CellEditing', {
	  					clicksToEdit: 1,
	  					errorSummary:false
	  				})
	  			],
	        listeners: {
	            'selectionchange': function(view, records) {
	            	var flag = !records.length;
	            	var toolbar=Ext.getCmp('toolbar');
//	            	toolbar.down('#addBl2').setDisabled(flag);
//	            	toolbar.down('#removeBl').setDisabled(flag);
	                //grid.down('#removebaseId').setDisabled(flag);
	            },
	            'afterlayout':function(){
	            	if(!SJSTgrid.getStore().getCount()>0)
	            		insertNewRecord(SJSTgrid,null,null);
	            },
	            containerclick:insertNewRecord
	        }
	    });
		
		function insertNewRecord(grid,e,eOpts){
        	if(fields.length>0){
        		
            	var index =SJSTstoreData.getCount();
            	if(index>0) {
	            	if(SJSTstoreData.getAt(index-1).get(fields[2])===''){
	            		return;
	            	}
            	}
            	var seq=0;
		        if(SJSTstoreData.getCount()>=1){
		        	var s=SJSTstoreData.getAt(SJSTstoreData.getCount()-1).get('seq');
		        	var t = typeof s;
		        	if(t.toLocaleLowerCase()==='string')
		        		s=parseInt(s);
		        	seq=s+1024;
		        }
                var r = Ext.create('tbl',{seq:seq});
                var head ={tbluuid:tbluuid};
    			if(SJSTstoreData.getModifiedRecords().length>0){
    				saveSJ(head,SJSTstoreData,blstStore);
    			}else{
    				SJSTstoreData.insert(index, r);
    			}
        	}
        	
        }
		
}
