 Ext.require(['*']);
 var viewport;
    Ext.onReady(function() {

        Ext.QuickTips.init();

        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

        var treeStore = Ext.create('Ext.data.TreeStore', {
        	defaultRootId : 'dbitest',
        	proxy : {
	        	type : 'ajax',
	        	url : '../../../work-platform/tree.do',
	        	expanded: true,
	        	reader : {
	        		type : 'json'
	        	},
	        	writer : {
	        		type : 'json'
	        	}
        	},
        	autoLoad : true
        }); 


        var indexViewport = Ext.create('Ext.Viewport', {
            id: 'indexViewport',
            layout: 'border',
            items: [
                     /*Ext.create("Ext.Toolbar", {
                    	id:'toolbar',
                        region: 'north',
                        renderTo:'north',
                        height: 30, 
                        items: [{
                        	text: '保存',
                            iconCls: 'icon-save',
                            handler: onSaveClick
                        },{
                        	itemId: 'addBl',
                            text: '添加',
                            iconCls: 'icon-add ',
                            handler: onAddClick
                        },{
                        	itemId: 'addBl2',
                            text: '插入',
                            iconCls: 'icon-insert',
                            disabled: true,
                            handler: onItemInsert
                        },{
                        	itemId: 'removeBl',
                        	text: '删除',
                        	iconCls: 'icon-delete',
                        	disabled: true,
                            handler: onItemDel
                        },{
                        	itemId: 'detail',
                        	text: '因子关系明细',
                        	iconCls: 'icon-grid',
                            handler: onItemDetail
                        },{
                        	itemId: 'uploadfile',
                        	text: '导入',
                        	
                        	iconCls: 'icon-grid',
                            handler: onItemUpload
                        }]
                    }), */
                    Ext.create('Ext.tab.Panel', {
                    	id:'centerTab',
                		region: 'center',
                	    renderTo: 'center',
                	    tabPosition: 'bottom',
                	    tabBar : {
                	    	height : 28,
                	    	defaults : {
                	    		height : 28
                	    	}
                	    },
                	    width:750,
                	    items: []
                	})
                    
                	]
        });
        
        var tableUuid = getUrlParam("tableUuid");
        Ext.Ajax.request({    
    	    url: '../../../work-platform/getTable.do',    
    	    params: {    
    	    	tableUuid : tableUuid
    	    },    
    	    success: function(response){    
    	    	var table = Ext.decode(response.responseText);
    	    	initTab(table.keyword,tableUuid);
    	    }    
    	});  
		
    });
 

