/**
 * 点击左侧树，右侧打开相应界面
 * @param view
 * @param rcd
 */
function itemClick(view, rcd){
	document.getElementById("currentTbl").value=rcd.raw['text'];
	document.getElementById("tbluuid").value=rcd.raw['uuid'];
	document.getElementById("isSaved").value='saved';
	sjstTempStore='';
	setTabPanel();
}

function initTab(text, uuid){
	document.getElementById("currentTbl").value=text;
	document.getElementById("tbluuid").value=uuid;
	document.getElementById("isSaved").value='saved';
	sjstTempStore='';
	setTabPanel();
}

function getUrlParam(name)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) 
		return unescape(r[2]); 
	return null; 
} 


/**
 * 修改删除表，右键单击，选择操作
 * @param menutree
 * @param record
 * @param items
 * @param index
 * @param e
 */
function itemEditMenu(menutree, record, items, index, e) {  
        e.preventDefault();  
        e.stopEvent();  
        var obj = record;  

        while (!obj.parentNode.isRoot()) {  
            obj = obj.parentNode;  
        }  
        var rootId = obj.getId();  
         
        var nodemenu = new Ext.menu.Menu({  
            floating : true,  
            items : [{  
                    text : "编辑",  
                    handler : function() {  
                    	Ext.MessageBox.prompt("修改表", "请输入表名",  
                                function(btn, text) {  
                                    if (btn == "ok") {
                                    	var tbluuid=record.data.cls;
                                    	var tblname=text;
                                        record.data.text= text;
                                        document.getElementById("currentTbl").value=text;
                                        Ext.Ajax.request({
                                            url: '../../../work-platform/edittable.do?uuid='+tbluuid+'&&tblname='+tblname,
                                            params: {
                                            	//sql:delTableSql
                                            },
                                            success: function(response){
                                                text = response.responseText;
                                                if('修改成功！'.indexOf(text)==0) record.remove(record);
                                                alert(text);
                                            }
                                    	});
                                    }  
                                }, this, false, // 表示文本框为多行文本框  
                                record.data.text);  
                    }  
                }, {  
                    text : "删除",  
                    handler : function() {  
                    	var data=record.data;
                    	var tbluuid=record.data.cls;
                    	Ext.Ajax.request({
                            url: '../../../work-platform/deletetable.do?uuid='+tbluuid,
                            params: {
                            	//sql:delTableSql
                            },
                            success: function(response){
                                text = response.responseText;
                                if('删除成功！'.indexOf(text)==0) record.remove(record);
                                alert(text);
                            }
                    	});
                    	
                    }  
                }]  
        });  
        nodemenu.showAt(e.getXY());  
    
}
