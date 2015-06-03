Ext.define('Factor.controller.panel.FactorPropertyGridController', {
    extend: 'Factor.controller.Base',
    stores: [
             "TableStore",
             "ColumnStore"
    ],
    views: [
            'panel.FactorProperty'
    ],
//    controllers:[
//               'window.FactorWindowController'
//    ],
    refs : [{
    	selector: '#factorProperty',  
        ref: 'factorProperty'
    }],
    init: function() {
    	this.control({
        	'factorProperty' : {
        		itemclick: this.itemclick
            }
    		
        });
    },
    itemclick:function(){
//    	alert('adsf');
    },
    openDataTypeWin:function(){
    	var dataTypewin = Ext.create('DataType.view.DataTypeWindow',{
			id : 'datatypeWindow',
			// 初始化数据
			data : {
				dataType : 'd96620a7749b477d9a23e1e36a56ab19',
				width : 8,
				decimalWidth : 2
			},
			callback : {
				// 点击保存
				save : function(win, dataTypeValue, widthValue, decimalValue){
					console.log(win+' '+dataTypeValue+' '+widthValue+' '+decimalValue);
					var store=Ext.getCmp('factorProperty').getStore();
					store.getAt(1).set('value',dataTypeValue);
					var dataType=getTypeByUuid(dataTypeValue);
					switch(dataType){
						case 1:
							store.getAt(2).set('value',widthValue);
							store.getAt(3).set('value',decimalValue);
							break;
						case 2:
							store.getAt(2).set('value',widthValue);
							store.getAt(3).set('value',0);
							break;
						case 3:
							store.getAt(2).set('value',0);
							store.getAt(3).set('value',0);
							break;
					}
					dataTypewin.close();
					var record=Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(1);
        			Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(1).set('value',record.get('value'));
        			
        			var type=format2DataType(dataTypeValue);
//					if(true){
						Ext.getCmp('triggerfield-combo').setVisible(true);
//					}else{
						switch(type){
							case 1:
								Ext.getCmp('triggerfield-numberfield').setVisible(true);
								Ext.getCmp('triggerfield-combo').setVisible(false);
								Ext.getCmp('triggerfield-textfield').setVisible(false);
								Ext.getCmp('triggerfield-datefield').setVisible(false);
								break;
							case 2:
								Ext.getCmp('triggerfield-numberfield').setVisible(false);
								Ext.getCmp('triggerfield-combo').setVisible(false);
								Ext.getCmp('triggerfield-textfield').setVisible(true);
								Ext.getCmp('triggerfield-datefield').setVisible(false);
								break;
							case 3:
								Ext.getCmp('triggerfield-numberfield').setVisible(false);
								Ext.getCmp('triggerfield-combo').setVisible(false);
								Ext.getCmp('triggerfield-textfield').setVisible(false);
								Ext.getCmp('triggerfield-datefield').setVisible(true);
								break;
							default:
								Ext.getCmp('triggerfield-combo').setVisible(true);
						}
//					}
            		Ext.getCmp('titleToolbar').callback.save();
				},
				changeRadio : function(win, field, newValue){
//					console.log(win+' '+field+' '+newValue);
				}
			}
		}).show();
    },
    openValueLabelWin:function(){
    	var store=Ext.getCmp('factorProperty').getStore();
    	var defineName=store.getAt(0).get('value');
    	var valueLabelwin = Ext.create('ValueLabel.view.ValueLabelWindow',{
			id : 'valueLabelWindow',
			data : {
				xtype:"textfield",
				defineName:defineName
			},
			 callback : {
				save : function(win, defineUuid,defineName,isNew, head, newsJson,updatesJson){
					console.log(win+' '+defineUuid+' '+head+' '+newsJson+' '+updatesJson);
					store.getAt(4).set('value',defineUuid);
					
					if(isNew){
						Ext.Ajax.request({
						    url: '../../../work-platform/updateSj.do',
						    params: {
						    	head: Ext.encode(head),
						    	sjnewsJson:Ext.encode(newsJson),
						    	sjupdatesJson:Ext.encode(updatesJson)
						    },
						    success: function(response){
						    	ValueLabel.App.getController('ValueLabelController').updateValueLabel(defineUuid);
						    	reloadParams(defineUuid);
						    	valueLabelwin.close();
						    	Ext.getCmp('triggerfield-numberfield').setVisible(false);
								Ext.getCmp('triggerfield-combo').setVisible(true);
								Ext.getCmp('triggerfield-textfield').setVisible(false);
								Ext.getCmp('triggerfield-datefield').setVisible(false);
//						    	var record=Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(1);
//			        			Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(4).set('value',record.get('value'));
			            		Ext.getCmp('titleToolbar').callback.save();
						    },
						    failure : function(response) {
						    	Ext.MessageBox.alert("提示","参数保存失败，请从新输入");
							}
						});	
					}
				},
				onPanelRendered:function( win,eOpts){
				}
			} 
		}).show();
    }
    
    
});