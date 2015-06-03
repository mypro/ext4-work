Ext.define('FDW.view.DefineGrid',{
    extend: 'Ext.grid.property.Grid',
    alias : 'widget.factorDefineGrid',
    
    sortPropertyColumn:false,
    
    sortableColumns:false,
    
    initComponent : function(){
    	var me = this;
    	
    	me.addEvents(
    			'initForm',
    			'clickSave',
    			'editorBlur',
    			'editorFocus'    			
    			);
    	
    	me.source={
            "name": "",
            "format": '',
            "width": 32,
            "decimalWidth": 2,
            "valueLabelUuid": "",
            "missing": '',
            "showWidth": 80,
            "showAlign": '',
            "measure": "",
            "role": ""
        };
    	me.propertyNames= {    //该参数可以更改属性显示的名称
    		name: '名称',
    		format:'数据类型',
    		width:'宽度',
    		decimalWidth:'小数宽度',
    		valueLabelUuid:'值标签',
    		missing:'缺失',
    		showWidth:'列宽',
    		showAlign:'对齐方式',
    		measure:'度量标准',
    		role:'角色'
        };
    	me.customEditors= {    //用于自定义编辑组件，左边名称与source中的名称对应
    		name : {
    			xtype : 'textfield',
    			listeners:{
    				'focus': function(){
    					me.fireEvent('editorFocus',me,0,this);
    				},
    				'blur' : function(){
    					me.store.getAt(0).set('value', this.getValue());
    					me.fireEvent('editorBlur',me,0,this);
    				}
    			}
    		},
    		format:new Ext.grid.CellEditor({field: {
						xtype : 'triggerfield',
						triggerCls : 'x-form-my-trigger',
						id : 'type',
						editable : false,
						onTriggerClick : Ext.Function.bind(FDW.App.getController("DefineGridController").openDataTypeWin, me)
					},
					listeners:{
					}
			}),
			valueLabelUuid: {
				xtype : 'triggerfield',
				triggerCls : 'x-form-my-trigger',
				id : 'valueLabel',
				editable : false,
				onTriggerClick : Ext.Function.bind(FDW.App.getController("DefineGridController").openValueLabelWin, me)
			}
        };
    	me.customRenderers= {  //用于value(function的参数v)显示之前的格式化
    		format :function(dataIndex) {
    			return FDW.App.getController("DefineGridController").formate2DateShow(dataIndex);
    		}
        };
    	
    	me.listeners = {
        		'initForm' : FDW.App.getController('DefineGridController').initForm,
        		'clickSave' : FDW.App.getController('DefineGridController').clickSave
        	};
    	
    	me.callParent(arguments);
    }
});
