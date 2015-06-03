Ext.define('ValueLabel.controller.ValueLabelController', {
    extend: 'Ext.app.Controller',
    stores: [
             "ParamDefineStore",
             "ParamStore"
    ],
    models: [
             "ValueLabelModel"
    ],
    
    valueLableCache : {},

    init: function() {
//    	var gridId='cmpt-valueLabel-'+LABEL_WINDOW_ID+'_paramDefineGrid';
//    	Ext.getCmp(gridId).getStore().load({
//			params:{
//				tblUuid : T_PARAM_TABLE,
//				defineName:encodeURI(DEFINENAME,'UTF-8')
//			}
//		});
    	this.control({
            'valueLabelWindow button[action=save]' : {
            	click:  this.save
            },
            'valueLabelWindow button[action=add]' : {
            	click:  this.add
            },
            'valueLabelWindow button[action=update]' : {
            	click:  this.update
            },
            'valueLabelWindow button[action=delete]' : {
            	click:  this.remove
            },
            'valueLabelWindow button[action=clear]' : {
            	click:  this.clear
            },
            'valueLabelWindow button[action=search]' : {
            	click:  this.search
            },
            "paramDefineGrid":{
            	select : this.selectParamDefineRow,
        		afterlayout: this.onPanelRendered
            },
            "paramGrid":{
            	select : this.selectParamGridRow,
            	beforerender:this.autoColumnWidth
//        		afterrender: this.onPanelRendered
            },
            'valueLabelWindow':{
//            	afterlayout: this.onPanelRendered
            }
        });
    },
    selectParamDefineRow : function(e, obj ,row){
    	if(0 == e.selected.length){
    		Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'clear').setDisabled(true);
    		return;
    	}
    	var defineUuid = e.selected.getAt(0).get('defineUuid');
    	Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'paramDefine').setValue(e.selected.getAt(0).get('defineName'));
    	// 联动参数表
    	var gridId='cmpt-valueLabel-'+LABEL_WINDOW_ID+'_parameterGrids';
    	Ext.getCmp(gridId).getStore().load({
			params:{
				tblUuid : T_PARAM_TABLE,
				defineUuid:defineUuid
			}
		});
    	Ext.getCmp(gridId).getStore().sort({
            property: 'seq',
            direction: 'ASC'
        });
    	Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'clear').setDisabled(false);
    },
    selectParamGridRow:function(e, obj ,row){
    	Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'delete').setDisabled(false);
    	Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'update').setDisabled(true);
    	Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'add').setDisabled(true);
    	if(e.selected.length>0){
        	Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'label').setValue(e.selected.getAt(0).get('label'));
        	Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'values').setValue(e.selected.getAt(0).get('value'));
    	}
    },
    save : function(btn){
    	var me = this ;
    	var prefix = this.getPrefix(btn);
    	var defineUuid='';
    	var defineName='';
    	var isNew=false;
    	var newsJson=[];
    	var updatesJson=[];
    	var deletesJson=[];
    	var selectedParam=Ext.getCmp(prefix+'parameterGrids').getSelectionModel().getSelection()[0];
    	var sm = Ext.getCmp(prefix+'paramDefineGrid').getSelectionModel();
    	var selectDefines=sm.getSelection();
    	var _txtValue = Ext.getCmp(prefix+'values').getValue();
    	var _txtLabel = Ext.getCmp(prefix+'label').getValue();
    	
    	var _btnUpdate =  Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'update');
    	var _btnAdd =  Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'add');
    	//TODO 添加提示 信息
    	/* 
    	 * 判断，如果_txtValue 或_txtLabel 不为空 并且grid 里面有选中的
    	 */
    	if((_txtLabel!=null || _txtValue!=null)&&(!_btnUpdate.disabled||!_btnAdd.disabled)){
    		Ext.Msg.confirm('值标签','最后的‘添加’或‘修改’操作未完成且将丢弃？。单击‘NO’返回对话框并操作完成。',
			function(_btn){
				if(_btn=='no'){
					return;
				}else{
					isNew=true;
			    		var pStroe =Ext.getCmp(prefix+'parameterGrids').getStore();
			        	if(pStroe.getCount()>0){
			        		var s=pStroe.getAt(0);
			        		defineName=s.get('defineName');
			        		defineUuid=s.get('defineUuid');
			        	}else{
			        		defineName='';
			        		defineUuid='';
			        	}
			        	var newrs = pStroe.getNewRecords();
			        	var updates =  pStroe.getUpdatedRecords();
			        	var deletes =  pStroe.getRemovedRecords();
			        	
			        	 if(deletes.length>0){
			        	    	for(var i=0;i<deletes.length;i++){
			        	    		var record = deletes[i];
			        	    		deletesJson.push(record.data);
			        	    	}
			         	}
			        	 if(newrs.length>0){
			        	    	for(var i=0;i<newrs.length;i++){
			        	    		var record = newrs[i];
			        	    		newsJson.push(record.data);
			        	    	}
			        		}
			        		
			        	if(updates.length>0){
			            	for(var i=0;i<updates.length;i++){
			            		var record = updates[i];
			            		updatesJson.push(record.data);
			            	}
			        	}
			        	pStroe.commitChanges();
			    	/*}*/
			        	
			        me.updateValueLabel(defineUuid);
			    	
			    	var head={tbluuid:T_PARAM_TABLE};
			    	
			    	var win = btn.up('window');
			    	
			    	if(win.callback && win.callback.save){
			    		win.callback.save.call(win, win, defineUuid,defineName,isNew, head, newsJson,updatesJson,selectedParam);
			    	}
				}
			});
    		
    	}else{
    		isNew=true;
    		var pStroe =Ext.getCmp(prefix+'parameterGrids').getStore();
        	if(pStroe.getCount()>0){
        		var s=pStroe.getAt(0);
        		defineName=s.get('defineName');
        		defineUuid=s.get('defineUuid');
        	}else{
        		defineName='';
        		defineUuid='';
        	}
        	var newrs = pStroe.getNewRecords();
        	var updates =  pStroe.getUpdatedRecords();
        	var deletes =  pStroe.getRemovedRecords();
        	
        	 if(deletes.length>0){
        	    	for(var i=0;i<deletes.length;i++){
        	    		var record = deletes[i];
        	    		deletesJson.push(record.data);
        	    	}
         	}
        	 if(newrs.length>0){
        	    	for(var i=0;i<newrs.length;i++){
        	    		var record = newrs[i];
        	    		newsJson.push(record.data);
        	    	}
        		}
        		
        	if(updates.length>0){
            	for(var i=0;i<updates.length;i++){
            		var record = updates[i];
            		updatesJson.push(record.data);
            	}
        	}
        	pStroe.commitChanges();
	    	/*}*/
	        	
	        me.updateValueLabel(defineUuid);
	    	
	    	var head={tbluuid:T_PARAM_TABLE};
	    	
	    	var win = btn.up('window');
	    	
	    	if(win.callback && win.callback.save){
	    		win.callback.save.call(win, win, defineUuid,defineName,isNew, head, newsJson,updatesJson,selectedParam);
	    	}
    	}
    	/*if(selectDefines.length>0){
    		defineUuid=selectDefines[0].get('defineUuid');
    		defineName=selectDefines[0].get('defineName');
    		isNew=false;
    	}else{*/
    		
    	
    },
    add:function(btn){
    	var prefix = this.getPrefix(btn);
    	var value = Ext.getCmp(prefix+'values').getValue();
    	var label = Ext.getCmp(prefix+'label').getValue();
    	var store = Ext.getCmp(prefix+'parameterGrids').getStore();
    	var defineUuid='';
    	var defineName= Ext.getCmp(prefix+'paramDefine').getValue();
    	if(store.getCount()>0){
    		defineUuid=store.getAt(0).get('defineUuid');
    		//TODO 所 重复处理
    		
    	}else{
    		var defineStore =Ext.getCmp(prefix+'paramDefineGrid').getStore();
    		for(var i=0;i<defineStore.getCount();i++){
    			var record=defineStore.getAt(i);
    			if(defineName===record.get('defineName')){
    				Ext.MessageBox.alert('错误', '参数组名重复');
    				return;
    			}
    		}
//    		defineName
    		defineUuid = new UUID().id;
    	}
    	var seq=0;
    	if(store.getCount()>=1){
        	seq=store.getAt(store.getCount()-1).get('seq')+1024;
        }
    	if(''===value){
    		var tempValue=0;
    		var flag=true;
    		for(var i=0;i<store.getCount();i++){
    			var record=store.getAt(i);
    			if(parseInt(record.get('value'))==='NaN'){
    				flag=false;
    				break;
    			}
    			if(parseInt(record.get('value'))>tempValue){
    				tempValue=parseInt(record.get('value'));
    			}
    		}
    		if(flag){
    			value=tempValue+1;
    		}
    		
    	}
    	//TODO 值标签 重复处理
		for(var i=0;i<store.getCount();i++){
			var record=store.getAt(i);
			if(record.get('label')==label){
				Ext.MessageBox.alert('值标签', '该组已包含"'+label+'"标签名称，请修改');
				return;
			}
		}
    	
    	var r = Ext.create('ValueLabel.model.ValueLabelModel', {
        	uuid : '',//序号
        	seq:seq,
        	defineUuid : defineUuid,
        	defineName:defineName,
        	defineKeyword:defineName,
        	value : value, 
        	label:label,
    	 	type : '2'
        });
    	store.insert(store.getCount(), r);
    	Ext.getCmp(prefix+'parameterGrids').getSelectionModel().select(store.getCount()-1,true);
    	Ext.getCmp(prefix+'add').disable();
    	Ext.getCmp(prefix+'label').setValue('');
    	Ext.getCmp(prefix+'values').setValue('');
    },
    update:function(btn){
    	var prefix = this.getPrefix(btn);
    	var sm = Ext.getCmp(prefix+'parameterGrids').getSelectionModel();
    	var  labelCha=Ext.getCmp(prefix+'label').getValue();
    	var valuesCha =Ext.getCmp(prefix+'values').getValue();
    	sm.selectionStart.set('value',valuesCha);
    	sm.selectionStart.set('label',labelCha);
    	Ext.getCmp(prefix+'label').setValue('');
    	Ext.getCmp(prefix+'values').setValue('');
    },
    remove:function(btn){
    	var prefix = this.getPrefix(btn);
    	var sm = Ext.getCmp(prefix+'parameterGrids').getSelectionModel();
    	var row =sm.getSelection();
    	Ext.Msg.confirm('系统提示','确定删除"'+row[0].get("label")+'"吗？',
	      function(con){
	        if(con=='yes'){
	        	
	        	var pStroe =Ext.getCmp(prefix+'parameterGrids').getStore();
	        	pStroe.remove(row);
	        	var deletesJson=[];
	        	var head={tbluuid:T_PARAM_TABLE};
	        	var deletes =  pStroe.getRemovedRecords();
	        	if(deletes.length>0){
			    	for(var i=0;i<deletes.length;i++){
			    		var record = deletes[i];
			    		deletesJson.push(record.data);
			    	}
	    	
	    		Ext.Ajax.request({
	    		    url: '../../../work-platform/deletedata.do',
	    		    params: {
	    		    	head: Ext.encode(head),
	    		    	delBLJson:Ext.encode([]), 
	    		    	delSJJson:Ext.encode(deletesJson)
	    		    },
	    		    success: function(response){
	    		    	var text = response.responseText;
	    		    	Ext.example.msg('提示', '{0}', text);
	    		    	Ext.getCmp(prefix+'label').setValue('');
	    		    	Ext.getCmp(prefix+'values').setValue('');
	    		    	var win = btn.up('window');
	    		    	
	    		    	if(win.callback && win.callback.deleteParam){
	    		    		win.callback.deleteParam.call(win, win,deletes[0]);
	    		    	}
	    		    },
	    		    failure : function(response) {
	    		    	Ext.example.msg('提示', '{0}',"保存失败");
	    			}
	    		});
	    	 }
	        }
	     },this);
    	 
    },
    clear:function(btn){
    	var prefix = this.getPrefix(btn);
    	Ext.getCmp(prefix+'paramDefine').setValue('');
    	Ext.getCmp(prefix+'label').setValue('');
    	Ext.getCmp(prefix+'values').setValue('');
    	var sm = Ext.getCmp(prefix+'paramDefineGrid').getSelectionModel();
    	sm.deselectAll(true);
    	Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'clear').setDisabled(true);
    	Ext.getCmp(prefix+'parameterGrids').getStore().load({
			params:{
				tblUuid : T_PARAM_TABLE,
				defineUuid:'-1'
			}
		});
    },
    search:function(btn){
    	var prefix = this.getPrefix(btn);
    	var searchDefineName= Ext.getCmp(prefix+'paramDefine').getValue();
    	Ext.getCmp(prefix+'paramDefineGrid').getStore().load({
			params:{
				tblUuid : T_PARAM_TABLE,
				defineName:encodeURI(searchDefineName,'UTF-8')
			}
		});
    },
    onPanelRendered:function(win, eOpts){
    	if(DEFINENAME==='') return;
    	Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'paramDefine').setValue(DEFINENAME);
    	var sm = Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'paramDefineGrid').getSelectionModel();
    	var stores=Ext.getCmp('cmpt-valueLabel-'+LABEL_WINDOW_ID+'_'+'paramDefineGrid').getStore();
    	for(var i=0;i<stores.getCount();i++){
    		var record=stores.getAt(i);
    		if(record.get('defineName')===DEFINENAME){
    			sm.select(record);
    		}
    	}
//    	this.selectParamDefineRow(sm,null,null);
//    	alert('afterrender');
//    	if(win.callback && win.callback.save){
//    		win.callback.onPanelRendered.call(win, win,eOpts);
//    	}
    },
    
    
    /** 获取ext所属父组件的前缀ID
     * @param parentId   
     * @returns
     */
    getPrefix : function(parentId){
    	if(typeof parentId === "object"){
    		parentId = parentId.id;
    	}
    	var prefix = parentId.substring(0,parentId.indexOf('_')+1);
    	if(!prefix){
    		prefix = 'cmpt-valuelabel-'+parentId+'_';
    	}
    	return prefix;
    },
    
    initValueLabel : function(){
    	var me = this;
    	
    	Ext.Ajax.request({
			async : true,
			url : '../../../work-platform/queryAllParams.do',
			params: {
				tblUuid : T_PARAM_TABLE
			},
			success: function(response){
				var defines = Ext.decode(response.responseText);
				me.valueLableCache = defines; 
			},
			scope : me
		});
    },
    
    updateValueLabel : function(defineUuid){
    	var me = this;
    	
    	delete me.valueLableCache[defineUuid];
    },
    
    getValueLabel : function(defineUuid, callback){
    	var me = this;
    	
    	if(me.valueLableCache[defineUuid]){
    		if(callback){
    			callback.call(me, {responseText:Ext.encode(me.valueLableCache[defineUuid])});
    		}
    		return me.valueLableCache[defineUuid];
    	}
    	
    	Ext.Ajax.request({
			async : false,
			url : '../../../work-platform/queryParamsByDefineUUid.do',
			params: {
				tblUuid : T_PARAM_TABLE,
				defineUuid:defineUuid
			},
			success: callback,
			scope : me
		});
    	return me.valueLableCache[defineUuid];
    },
    autoColumnWidth:function(view){
    	var gridcolumns = view.headerCt.getGridColumns();  
	    	view.store.on('load', function(store, records) {  
	        Ext.each(gridcolumns, function(gridcolumn, colIdx) {  
	            var dataIndex = gridcolumn.dataIndex;  
	            var maxLength = 0;  
	            Ext.each(records, function(record, rowIdx) {  
	                var tmp = record.get(dataIndex)+'';
	                console.log(tmp);
	                console.log(tmp.field);
	                if (getRealLength(tmp) > maxLength ) {  
	                    maxLength = getRealLength(tmp);  
	                }  
	                /** 若是 wrap 单元格, 换行处理, 尽量避免水平滚动条 */  
	                if (Ext.isDefined(gridcolumn.wrap)) {  
	                    var gridview = view.getView();  
	                    var row = gridview.all.elements[rowIdx];  
	                    var cell = row.cells[colIdx + 1];  
	                    var cellDiv = cell.childNodes[0];  
	                    cellDiv.style['white-space'] = 'normal';  
	                    cellDiv.style['overflow'] = 'visible';  
	                }  
	            });  
	            /** 若是标题长度大于内容长度, 取标题长度, 标题长度为中文字符 */  
	            if (gridcolumn.text.length > maxLength) {  
	                maxLength = gridcolumn.text.length;  
	                gridcolumn.woc = true;  
	            }  
	              
	            /** 隐藏, ActionColumn, wrap 列, flex列 不再计算. */  
	            /** 长度计算需要加上 22 的菜单长度. 英文默认7, 中文默认 12 */                              
	            if (!gridcolumn.hidden && !(gridcolumn instanceof Ext.grid.column.Action) && !Ext.isDefined(gridcolumn.wrap) && !Ext.isDefined(gridcolumn.flex)) {  
	                if(Ext.isDefined(gridcolumn.woc)) {  
	                    gridcolumn.minWidth = gridcolumn.width = maxLength * 7 + 22;  
	                } else {  
	                    gridcolumn.minWidth = gridcolumn.width = maxLength * 7 + 22;  
	                }  
	            };  
	        });  
	        /** 重新布局 gridpanel 组件*/  
	        view.doLayout();  
	    }); 
    }
    
});
function getRealLength(str){
	var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) {
        	realLength += 1;
        }else {
        	realLength += 2;
        }
    }
    return realLength;
}
/**
 * 生成uuid
 * @returns
 */
/* 
 *  
 * uuid.js - Version 0.3 JavaScript Class to create a UUID like identifier 
 *  
 * Copyright (C) 2006-2008, Erik Giberti (AF-Design), All rights reserved. 
 *  
 * This program is free software; you can redistribute it and/or modify it under 
 * the terms of the GNU General Public License as published by the Free Software 
 * Foundation; either version 2 of the License, or (at your option) any later 
 * version. 
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT 
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS 
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more 
 * details. 
 *  
 * You should have received a copy of the GNU General Public License along with 
 * this program; if not, write to the Free Software Foundation, Inc., 59 Temple 
 * Place, Suite 330, Boston, MA 02111-1307 USA 
 *  
 * The latest version of this file can be downloaded from 
 * http://www.af-design.com/resources/javascript_uuid.php 
 *  
 * HISTORY: 6/5/06 - Initial Release 5/22/08 - Updated code to run faster, 
 * removed randrange(min,max) in favor of a simpler rand(max) function. Reduced 
 * overhead by using getTime() method of date class (suggestion by James Hall). 
 * 9/5/08 - Fixed a bug with rand(max) and additional efficiencies pointed out 
 * by Robert Kieffer http://broofa.com/ 
 *  
 * KNOWN ISSUES: - Still no way to get MAC address in JavaScript - Research into 
 * other versions of UUID show promising possibilities (more research needed) - 
 * Documentation needs improvement 
 *  
 */  
  
// On creation of a UUID object, set it's initial value  
function UUID() {  
    this.id = this.createUUID();  
}  
  
// When asked what this Object is, lie and return it's value  
UUID.prototype.valueOf = function() {  
    return this.id;  
}  
UUID.prototype.toString = function() {  
    return this.id;  
}  
  
//  
// INSTANCE SPECIFIC METHODS  
//  
  
UUID.prototype.createUUID = function() {  
    //  
    // Loose interpretation of the specification DCE 1.1: Remote Procedure Call  
    // described at  
    // http://www.opengroup.org/onlinepubs/009629399/apdxa.htm#tagtcjh_37  
    // since JavaScript doesn't allow access to internal systems, the last 48  
    // bits  
    // of the node section is made up using a series of random numbers (6 octets  
    // long).  
    //    
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);  
    var dc = new Date();  
    var t = dc.getTime() - dg.getTime();  
    var tl = UUID.getIntegerBits(t, 0, 31);  
    var tm = UUID.getIntegerBits(t, 32, 47);  
    var thv = UUID.getIntegerBits(t, 48, 59) + '1'; // version 1, security version is 2  
    var csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7);  
    var csl = UUID.getIntegerBits(UUID.rand(4095), 0, 7);  
  
    // since detection of anything about the machine/browser is far to buggy,  
    // include some more random numbers here  
    // if NIC or an IP can be obtained reliably, that should be put in  
    // here instead.  
    var n = UUID.getIntegerBits(UUID.rand(8191), 0, 7)  
            + UUID.getIntegerBits(UUID.rand(8191), 8, 15)  
            + UUID.getIntegerBits(UUID.rand(8191), 0, 7)  
            + UUID.getIntegerBits(UUID.rand(8191), 8, 15)  
            + UUID.getIntegerBits(UUID.rand(8191), 0, 15); // this last number is two octets long  
    return tl + tm + thv + csar + csl + n;  
}  
  
//  
// GENERAL METHODS (Not instance specific)  
//  
  
// Pull out only certain bits from a very large integer, used to get the time  
// code information for the first part of a UUID. Will return zero's if there  
// aren't enough bits to shift where it needs to.  
UUID.getIntegerBits = function(val, start, end) {  
    var base16 = UUID.returnBase(val, 16);  
    var quadArray = new Array();  
    var quadString = '';  
    var i = 0;  
    for (i = 0; i < base16.length; i++) {  
        quadArray.push(base16.substring(i, i + 1));  
    }  
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {  
        if (!quadArray[i] || quadArray[i] == '')  
            quadString += '0';  
        else  
            quadString += quadArray[i];  
    }  
    return quadString;  
}  
  
// Replaced from the original function to leverage the built in methods in  
// JavaScript. Thanks to Robert Kieffer for pointing this one out  
UUID.returnBase = function(number, base) {  
    return (number).toString(base)/*.toUpperCase()*/;  
}  
  
// pick a random number within a range of numbers  
// int b rand(int a); where 0 <= b <= a  
UUID.rand = function(max) {  
    return Math.floor(Math.random() * (max + 1));  
}  
  
// end of UUID class file  