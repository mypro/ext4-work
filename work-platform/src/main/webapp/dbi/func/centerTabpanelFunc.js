//生成包含变量视图和数据视图的tabpanel
function setTabPanel(){
	var tblname=document.getElementById("currentTbl").value;
	var issaved=document.getElementById("isSaved").value;
	var tbluuid=document.getElementById("tbluuid").value;
	var url = '../../../work-platform/queryColumns.do?uuid='+tbluuid;
	var tabpanel=Ext.getCmp('centerTab');//获得tabPanel
	tabpanel.removeAll(true);//移除tabPanel中原有的tab
	document.getElementById("center").innerHTML = '<div id="center2" style="width:100%;height:100%" class="x-hide-display"></div><div id="center1" style="width:100%;height:100%" class="x-hide-display"></div>';
	tabpanel.add({
    	id:'blst',
        contentEl: 'center2',
        title: '变量视图',
        heigth:900,
        autoScroll: true,
        listeners: {
            activate: loadBLST
        }
    },{
    	id:'sjst',
        contentEl: 'center1',
        title: '数据视图',
        //closable: true,
        autoScroll: true,
        listeners: {
            activate: loadSJST
        }
    });
	BLSTstore=Ext.create('Ext.data.Store', {
		// destroy the store if the grid is destroyed
		//autoDestroy: true,
		id:'baseStore',
		model: 'Basetbl',
		proxy: {
			type: 'ajax',
			url:url,//此时留出tbl=是为了到时候修改表用的，如果要修改某给表的设计，可以传进来然后取出已有的字段
			reader: {
				type: 'json',
				root:'aaData'
			}
		},
		autoLoad: true
	});
	tabpanel.setActiveTab(1);
	tabpanel.setActiveTab('blst');
}

