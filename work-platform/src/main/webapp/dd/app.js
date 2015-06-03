//-------------------------------------common is here----------------------------
var MESSAGE_NUMBER=1;
var SELECT_TREENODE;//记录当前选中树节点，如果搜索时树重新加载，最后选中的就是当前选中的


//-------------------------------------controller is here----------------------------
Ext.define("BOOM.controller.Content", {
    extend: "Ext.app.Controller",
    MIDDLE: 1,
    title: "",
    loadIndex: function(b) {
        b || BOOM.History.push(this.baseUrl);
        this.getViewport().setPageTitle(this.title);
//        Ext.getCmp("BOOMtabs").activateTab(this.baseUrl);
        Ext.getCmp("card-panel").layout.setActiveItem(this.getIndex());
        this.getIndex().restoreScrollState();
    },
    opensNewWindow: function(b) {
        return b.button === this.MIDDLE || b.shiftKey || b.ctrlKey;
    },
    getBaseUrl: function() {
        return document.location.href.replace(/\/?(index.html|template.html|analyze.html)?#.*/, "");
    }
});
function addTreeNode(){
	var tree=Ext.getCmp("guidetree"),
 	cellEditingPlugin = tree.cellEditingPlugin,
 	 selectionModel = tree.getSelectionModel(),
 	parentNode=Ext.getCmp('guidetree').getRootNode( ) ,
 	newList = Ext.create("BOOM.view.GroupTree", {
 					name:'',
 					uuid:'',
 					keyword:'',
 					url:'',
 					leaf:true
 	}),
    expandAndEdit = function() {
        if(parentNode.isExpanded()) {
            selectionModel.select(newList);
            this.addedNode = newList;
            cellEditingPlugin.startEdit(parentNode.childNodes.length, 0);
        }
    };
    parentNode.appendChild(newList);
    tree.getStore().sync();
    if(tree.getView().isVisible(true)) {
        expandAndEdit();
    } else {
        tree.on('expand', function onExpand() {
            expandAndEdit();
            tree.un('expand', onExpand);
        });
        tree.expand();
    }
}

Ext.define("BOOM.controller.Guides", {
    extend: "BOOM.controller.Content",
    baseUrl: "#!/guide",
    title: "Guides",
    refs: [{
        ref: "viewport",
        selector: "#viewport"
    },
    {
        ref: "index",
        selector: "#guideindex"
    },
    {
        ref: "tree",
        selector: "#guidetree"
    },
    {
        ref: "guide",
        selector: "#guide"
    }],
    cache: {},
    init: function() {
    	this.addedNode=null;
        this.addEvents("showGuide");
        this.control({
            "#guidetree": {
                urlclick: function(d, c) {
                    this.handleUrlClick(d, c, this.getTree());
                },
                itemcontextmenu : function(menutree, record, items, index, e){
                	this.handleRightClick(menutree, record, items, index, e);
                },
                itemmouseenter: this.showActions,
                itemmouseleave:this.hideActions,
                edit: this.handleCompleteEdit,
                beforeedit:this.beforeedit,
                canceledit: this.handleCancelEdit,
                deleteclick: this.handleDeleteIconClick,
                containerclick:this.containerclick
                },
            "guideindex > thumblist": {
                urlclick: function(b) {
                    this.loadGuide(b);
                }
            },
            indexcontainer: {
                afterrender: function(b) {
                    b.el.addListener("click",
                    function(d, a) {
                        this.handleUrlClick(a.href, d);
                    },
                    this, {
                        preventDefault: true,
                        delegate: ".guide"
                    });
                }
            },
            doctabs: {
                tabClose: function(b) {
                    this.getGuide().eraseScrollContext(b);
                }
            }
        });
    },
    containerclick:function(grid,e,eOpts){//双击空白处添加新节点（新建表）
    	addTreeNode();
    },
    beforeedit:function(editor,e,eOpts){
    	e.originalValue=e.originalValue.substring(0,e.originalValue.indexOf('('));
    	e.value=e.originalValue;
    },
    handleCompleteEdit: function(editor, e){//完成编辑
    	var me=this;
    	var list = e.record,
	        parent = list.parentNode,
	        cellEditingPlugin = Ext.getCmp("guidetree").cellEditingPlugin,
	        added = parent.lastChild;
    	var selectionModel = Ext.getCmp("guidetree").getSelectionModel();
    	if(e.originalValue===e.value) return;
    	if(''!=list.data.keyword){
    		if(''!=list.data.uuid){
    			Ext.Ajax.request({
            	    url: '../../../work-platform/updateTable.do',
            	    params: {
            	    	tbluuid: list.data.uuid,
            	    	tblName: list.data.name,
            	    	tblKeyword:list.data.keyword
            	    },
            	    success: function(response){
            	    	var messageBox = Ext.getCmp('message');
        		    	messageBox.setValue(/*messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+*/response.responseText);
            	    	Ext.example.msg('提示', '{0}', response.responseText);
    	               	me.loadGuide("#!/guide/"+list.data.uuid);
    	               	Ext.getCmp("guidetree").getStore().reload();
            	    },
            	    failure : function(response) {
            	    	alert("保存失败");
            		}
            	});
    		}else{
	    		Ext.Ajax.request({    
	  	    	    async : true,
	  	    	    url: '../../work-platform/addTreeNode.do',    
	  	    	    params: {    
	  	    	    	keyword : list.data.keyword
	  	    	    },    
	  	    	    success: function(response){ 
	  	    	    	var uuid = response.responseText;
	  	    	    	if('数据库中已有该表，保存失败！'===uuid){
	  	    	    		Ext.MessageBox.alert("提示",uuid);
	  	    	    		var messageBox = Ext.getCmp('message');
	        		    	messageBox.setValue(/*messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、'+*/uuid);
	        		    	 selectionModel.select(added);
	                         this.addedNode = added;
	                         cellEditingPlugin.startEdit(parent.childNodes.length-1, 0);
	  	    	    	}else{
	  	    	    		var messageBox = Ext.getCmp('message');
	        		    	messageBox.setValue(/*messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、新建表成功'*/);
	        		    	var head ={tbluuid:uuid};
	        		    	var blnewsJson=[{
	        		    			data: "",
	        		    			decimalWidth: "",
	        		    			isUnique: "",
	        		    			keyword: "defaultColumns",
	        		    			label: "",
	        		    			metric: "",
	        		    			missing: "",
	        		    			name: "",
	        		    			paramColumnLabelUuid: "",
	        		    			paramColumnUuid: "",
	        		    			paramDefine: "",
	        		    			paramDefineName: "",
	        		    			paramTableUuid: "",
	        		    			role: "",
	        		    			seq: 0,
	        		    			showAlign: "",
	        		    			showWidth: 80,
	        		    			tableUuid: "",
	        		    			type: "85806344e6354482822f28ff055bcdd0",
	        		    			uuid: "",
	        		    			width: 30
	        		    	}];//新增加的字段
	        		    	
	        		    	var blupdatesJson=[];//更新的字段
	        		    	Ext.Ajax.request({
	        				    url: '../../../work-platform/updateBl.do',
	        				    params: {
	        				    	head: Ext.encode(head),
	        				    	blnewsJson:Ext.encode(blnewsJson),
	        				    	blupdatesJson:Ext.encode(blupdatesJson)
	        				    },
	        				    success: function(response){
	        				    },
	        				    failure : function(response) {
	        					}
	        				});
	        		    	Ext.getCmp("guidetree").getStore().reload();
	  	    	    	}
	  	    	    }
	    		});
    		}
    	}
    },
    handleCancelEdit: function(editor, e) {//取消编辑
        var list = e.record,
            parent = list.parentNode,
            added = parent.lastChild;

        delete this.addedNode;
        if (added === list) {
            parent.removeChild(list);
            Ext.getCmp("guidetree").getStore().sync();
//            Ext.getCmp("guidetree").getSelectionModel().select([parent]);
        }
        
    },
    showActions: function(view, list, node, rowIndex, e) {//节点获得焦点显示删除图标
    	var keyword=view.getRecord(node).get('keyword');
    	e.preventDefault();
    	var tips=Ext.getCmp('tips');
    	if(tips){
    		tips.destroy( );
    	}
    	 new Ext.menu.Menu({  
             floating : true,
             id:'tips',
             items : [{
            	 text : keyword,  
             }
                      ]}).showAt([170,e.browserEvent.clientY-25]);
        var icons = Ext.DomQuery.select('.x-action-col-icon', node);
        if(view.getRecord(node).get('uuid') !='') {
            Ext.each(icons, function(icon){
                Ext.get(icon).removeCls('x-hidden');
            });
        }
    },
    hideActions: function(view, list, node, rowIndex, e) {//鼠标移出节点隐藏删除图标
    	var tips=Ext.getCmp('tips');
    	if(tips){
    		tips.destroy( );
    	}
        var icons = Ext.DomQuery.select('.x-action-col-icon', node);
        Ext.each(icons, function(icon){
            Ext.get(icon).addCls('x-hidden');
        });
    },
    handleDeleteIconClick: function(view, rowIndex, colIndex, column, e) {//点击删除图标
    	this.fireEvent('itemclick');
    	this.deleteList(view.getRecord(view.findTargetByEvent(e)));
    },
    deleteList: function(record) {//删除节点
    	Ext.MessageBox.confirm('Confirm', '确定要删除该表?',  function(e){
  		   if(e=='yes'){
		    	var tbluuid=record.raw ? record.raw.uuid: record.data.uuid;
			   	 Ext.Ajax.request({
			            url: '../../work-platform/deletetable.do?tbluuid='+tbluuid,
			            params: {
			            },
			            success: function(response){
			                text = response.responseText;
			                var messageBox = Ext.getCmp('message');
			                
					    	messageBox.setValue(/*messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、'+*/text);
			                if('删除成功！'.indexOf(text)==0){
			               	 record.parentNode.removeChild(record);
			               	Ext.getCmp("guidetree").getStore().sync();
			               	 var tab=Ext.getCmp("guide-"+tbluuid);
			               	 Ext.getCmp('card-panel').remove(tab);
			               	 Ext.example.msg('提示', '{0}', text);
			               	Ext.getCmp("guidetree").getStore().reload();
			                }else{
			               	 Ext.MessageBox.alert("提示",text);
			                }
			            }
			    	});
  		   }
    	});
    },
    handleNewListClick: function(component, e) {//新增节点
        this.addList(true);
    },
    handleRightClick : function(menutree, record, items, index, e){//右键菜单
    	e.preventDefault();  
        e.stopEvent();  
        if(!record.get('leaf')){
        	 new Ext.menu.Menu({  
                 floating : true,  
                 items : [{
                	 text : "新增表项",  
                     handler : function() {  
                    	 (function(){
                    	  	   Ext.MessageBox.prompt("新建表","请输入表名：",function(bu,txt){
                    	  		   if(bu=='ok'){
                    	  			 Ext.Ajax.request({    
	                    	  	    	    async : true,
	                    	  	    	    url: '../../work-platform/addTreeNode.do',    
	                    	  	    	    params: {    
	                    	  	    	    	keyword : txt
	                    	  	    	    },    
	                    	  	    	    success: function(response){ 
	                    	  	    	    	var uuid = response.responseText;
	                    	  	    	    	if('数据库中已有该表，保存失败！'===uuid){
	                    	  	    	    		Ext.MessageBox.alert("提示",uuid);
	                    	  	    	    		var messageBox = Ext.getCmp('message');
	                    	        		    	messageBox.setValue(/*messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、'+*/uuid);
	                    	  	    	    	}else{
	                    	  	    	    		var messageBox = Ext.getCmp('message');
	                    	        		    	messageBox.setValue(/*messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+*/'、新建['+txt+']表成功，表索引为：'+uuid);
		                    	  	    	    	record.appendChild({
		                    	  	    	    		leaf: true,
		                    	  	    	    		text: txt,
		                    	  	    	    		keyword:txt,
		                    	  	    	    		url: "#!/guide/" + uuid,
		                    	  	    	    		uuid : uuid,
		                    	  	    	    		iconCls: "icon-guide"
		                    	  	    	    	});
	                    	  	    	    	}
	                    	  	    	    }    
	                    	  	    	});   
                    	  		   }
                    	  	});
                    	 })();
                     }
                 }]
        	 }).showAt(e.getXY());
        }else{
        	new Ext.menu.Menu({  
                floating : true,  
                items : [{
               	 	text : "修改表名称",  
                    handler : function() {  
                    	if(Ext.getCmp('updataTableWin')!=null){
                    		Ext.getCmp('updataTableWin').close();
                    	}
                    	var r=record;
                   	 	var tbluuid=record.raw.uuid;
                   	 	var tblName=record.raw.name;
                   	 	var tblKeyword=record.raw.keyword;
                   	 	tblKeyword=tblKeyword.substring(0,tblKeyword.indexOf('('));
                   	 	//var tblname=record.raw.
                    	 var datatypeform = Ext.create('Ext.form.Panel', {
                    	        layout: 'absolute',
                    	        defaultType: 'textfield',
                    	        border: false,
                    	        items: [{
                		            fieldLabel: '表名',
                		            fieldWidth: 10,
                		            xtype: 'textfield',
                		            x: 5,
                		            y: 5,
                		            id:'keyword',
                		            name: 'keyword',
                		            anchor: '-5',  // anchor width by percentage
                		            listeners: {
                		                /*'change': function(fb, v){
                		                	saveOrno=false;
                		                }*/
                		            }
                		        },{
                		            fieldLabel: '标签',
                		            fieldWidth: 10,
                		            xtype: 'textfield',
                		            x: 5,
                		            y: 35,
                		            id:'tablename',
                		            name: 'tablename',
                		            anchor: '-5',  // anchor width by percentage
                		            listeners: {
                		            }
                		        },{
                		            xtype: 'textfield',
                		            id:'tableuuid',
                		            name: 'tableuuid',
                		            hidden:true
                		        }],
                    	        width:400,
                                height:300
                    	    });
                    	 Ext.getCmp('tableuuid').setValue(tbluuid);
                    	 Ext.getCmp('tablename').setValue(tblName);
                    	 Ext.getCmp('keyword').setValue(tblKeyword);
                    	    var win = Ext.create('Ext.window.Window', {
                    	    	id:'updataTableWin',
                    	        autoShow: true,
                    	        title: '修改表',
                    	        autoWidth: true,
                    	        autoHeight: true,
                    	        layout: 'fit',
                    	        plain:true,
                    	        items: datatypeform,
                    	        buttons: [{
	                    	            text: '确定',
	                    	            textAlign:'center',
	                    	            handler: function(){
	                    	            	Ext.Ajax.request({
	                    	            	    url: '../../../work-platform/updateTable.do',
	                    	            	    params: {
	                    	            	    	tbluuid: Ext.getCmp('tableuuid').value,
	                    	            	    	tblName: Ext.getCmp('tablename').value,
	                    	            	    	tblKeyword:Ext.getCmp('keyword').value
	                    	            	    },
	                    	            	    success: function(response){
	                    	            	    	Ext.getCmp('updataTableWin').close();
	                    	            	    	//menutree.refresh();
	                    	            	    	window.location.reload();
	                    	            	    	var messageBox = Ext.getCmp('message');
	                    	        		    	messageBox.setValue(/*messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+*/'、表【'+tblName+'】修改为【'+Ext.getCmp('tablename').value+'】，'+response.responseText);
	                    	            	    	Ext.example.msg('提示', '{0}', response.responseText);
	                    	            	    },
	                    	            	    failure : function(response) {
	                    	            	    	alert("保存失败");
	                    	            		}
	                    	            	});
	                    	            }
	                    	        },{
	                    	            text: '取消',
	                    	            handler: function(){
	                    	            	Ext.getCmp('updataTableWin').close();
	                    	            }
	                    	        }]
                    	    });
                    }
                },{
                 	 text : "删除表",  
                     handler : function() {  
                    	 var r=record;
                    	 var tbluuid=record.raw.uuid;
                    	 Ext.Ajax.request({
                             url: '../../work-platform/deletetable.do?tbluuid='+tbluuid,
                             params: {
                             	//sql:delTableSql
                             },
                             success: function(response){
                                 text = response.responseText;
                                 var messageBox = Ext.getCmp('message');
                                 
     	        		    	messageBox.setValue(/*messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、'+*/text);
                                 if('删除成功！'.indexOf(text)==0){
                                	 record.parentNode.removeChild(record);
                                	 Ext.getCmp("guidetree").getStore().sync();
                	               	 var tab=Ext.getCmp("guide-"+tbluuid);
                	               	 Ext.getCmp('card-panel').remove(tab);
                                	 Ext.example.msg('提示', '{0}', text);
                                 }else{
                                	 Ext.MessageBox.alert("提示",text);
                                 }
                             }
                     	});
                     }
                }]
       	 	}).showAt(e.getXY());
        } 
    },
    handleNewRecord:function(){
    	alert('new');
    },
    handleUpdateRecord:function(){
    	alert('handleUpdateRecord');
    },
    handleDeleteRecord:function(){
    	alert('handleDeleteRecord');
    },
    handleUrlClick: function(d, f, e) {
        d = d.replace(/.*#!?/, "#!");
        if (this.opensNewWindow(f)) {
            window.open(d);
            e && e.selectUrl(this.activeUrl ? this.activeUrl: "");
        } else {
        	SELECT_TREENODE=d;
            this.loadGuide(d);
        }
    },
    loadIndex: function() {
        Ext.getCmp("treecontainer").showTree("guidetree");
        this.callParent();
    },
    loadGuide: function(j, h) {
        Ext.getCmp("treecontainer").showTree("guidetree");
        var g = j.match(/^#!\/guide\/(.*?)(-section-[0-9]+)?$/);
        var f = g[1];
        var i = g[2];
        j = "#!/guide/" + f;
        if (this.cache[f]) {
            this.showGuide(this.cache[f], j, f, i);
        } else {
            this.cache[f] = "in-progress";
            
            this.showGuide(null , j, f, i);
            
        }
    },
    showGuide: function(i, j, uuid, h) {
        var g = false;
        if (i === "in-progress") {
            return
        }
        this.getViewport().setPageTitle("google");
//        	if(null == i){
        		Ext.getCmp('card-panel').removeAll(true);
        		Ext.getCmp('card-panel').add({
                    autoScroll: true,
                    xtype: "guidecontainer",
                    id: "guide-"+uuid,
                    cls: "iScroll"
                });
        		Ext.getCmp("card-panel").layout.setActiveItem("guide-"+uuid);
        		Ext.getCmp("guide-"+uuid).body.update(
                    	'<iframe name="iframe" id="mainPage-'+uuid+'" width="100%" height="100%" frameborder=0 src=../../tableclient/index.html?tableUuid='
        								+uuid+'&theme=classic></iframe>'
                    		);
//        	}else{
//        		Ext.getCmp("card-panel").layout.setActiveItem("guide-"+uuid);
//        	}
        	
            g = true;
        this.activeUrl = j;
        var currentGuide = Ext.getCmp("guide-"+uuid);
        this.cache[uuid] = currentGuide;
        
        currentGuide.setScrollContext(this.activeUrl);
        if (h) {
        	currentGuide.scrollToEl(uuid + h);
        } else {
        	currentGuide.restoreScrollState();
        }
        this.fireEvent("showGuide", uuid, {
            reRendered: g
        });
        this.getTree().selectUrl(j);
    }
});





//-----------------------------------view is here 搜索框----------------------------------
Ext.define("BOOM.view.search.Container", {
    extend: "Ext.container.Container",
    alias: "widget.searchcontainer",
    //requires: "Docs.view.search.Dropdown",
    initComponent: function() {
    	
        if (BOOM.data.search.length) {
            this.cls = "search";
            this.items = [{
                xtype: "textfield",
//                triggerCls: "x-form-search-trigger",
                emptyText: "Search",
                width: 170,
                id: "search-field",
//                enableKeyEvents: true,
//                hideTrigger: true,
                listeners: {
	                'change': {
	                	fn:function(e){
                        	searchTextChange();
                        	searchTreeNode();
                        },
                        buffer: 100
	                }
	            }/*,
                onTriggerClick: function(e) {
//                    this.reset();
//                    this.focus();
//                    this.setHideTrigger(true);
//                    Ext.getCmp("search-dropdown").hide()
                	var searchText=Ext.getCmp('search-field').value;
                	var treeStore = Ext.getCmp('guidetree').getStore();
                	for(var i=0;i<treeStore.tree.root.childNodes.length;i++){
                		var record=treeStore.getRootNode( ).childNodes[i];
                		if(record.data.keyword.indexOf(searchText)>0){
                			alert(record.get('keyword'));
                		}
                	}
                	
                	
                }*/
            }
            /*,
            {
                xtype: "searchdropdown"
            }
            */]
        }
        
        this.callParent();
    }
    
});
function searchTreeNode(){
//	searchTextChange();
	var me=Ext.getCmp('guidetree');
	var searchValue = Ext.getCmp('search-field').getValue();
	me.store.load({
		params:{
			likename:encodeURI(searchValue,'UTF-8')
		}
	});
	Ext.getCmp('search-field').focus();	
}
function searchTextChange(){
	if(window.frames["iframe"]==undefined) return;
	var me =null,
    count = 0;
	

	var iframe=window.frames["iframe"];
    var grid=iframe.Ext.getCmp("variablegrid");
    var activeTabId=iframe.Ext.getCmp("centerTab").getActiveTab();
    var tabId=activeTabId.id;
    if('blst'.indexOf(tabId)==0){
    	me=grid;
    }else if('sjst'.indexOf(tabId)==0){
    	var SJSTgrid=iframe.SJSTgrid;
    	me=SJSTgrid;
    }
    
    me.view.refresh();
    // reset the statusbar
    me.statusBar.setStatus({
        text: me.defaultStatusText,
        iconCls: ''
    });

    me.searchValue = getSearchValue();
    me.indexes = [];
    me.currentIndex = null;

    if (me.searchValue !== null) {
        me.searchRegExp = new RegExp(me.searchValue, 'g' + (me.caseSensitive ? '' : 'i'));
        
        
        me.store.each(function(record, idx) {
            var td = Ext.fly(me.view.getNode(idx)).down('td'),
                cell, matches, cellHTML;
            while(td) {
                cell = td.down('.x-grid-cell-inner');
                matches = cell.dom.innerHTML.match(me.tagsRe);
                cellHTML = cell.dom.innerHTML.replace(me.tagsRe, me.tagsProtect);
                
                // populate indexes array, set currentIndex, and replace wrap matched string in a span
                cellHTML = cellHTML.replace(me.searchRegExp, function(m) {
                   count += 1;
                   if (Ext.Array.indexOf(me.indexes, idx) === -1) {
                       me.indexes.push(idx);
                   }
                   if (me.currentIndex === null) {
                       me.currentIndex = idx;
                   }
                   return '<span class="' + me.matchCls + '">' + m + '</span>';
                });
                // restore protected tags
                Ext.each(matches, function(match) {
                   cellHTML = cellHTML.replace(me.tagsProtect, match); 
                });
                // update cell html
                cell.dom.innerHTML = cellHTML;
                td = td.next();
            }
        }, me);

        // results found
        if (me.currentIndex !== null) {
            me.getSelectionModel().select(me.currentIndex);
            me.statusBar.setStatus({
                text: count + ' matche(s) found.',
                iconCls: 'x-status-valid'
            });
        }
    }

    // no results found
    if (me.currentIndex === null) {
        me.getSelectionModel().deselectAll();
    }

    // force textfield focus
    Ext.getCmp('search-field').focus();	
}
function getSearchValue() {
	var me =null,
	value = Ext.getCmp('search-field').getValue();
	
	 var iframe=window.frames["iframe"];
    var grid=iframe.Ext.getCmp("variablegrid");
    var activeTabId=iframe.Ext.getCmp("centerTab").getActiveTab();
    var tabId=activeTabId.id;
    if('blst'.indexOf(tabId)==0){
    	me=grid;
    }else if('sjst'.indexOf(tabId)==0){
    	var SJSTgrid=iframe.SJSTgrid;
    	me=SJSTgrid;
    }
        
    if (value === '') {
        return null;
    }
    if (!me.regExpMode) {
        value = value.replace(me.regExpProtect, function(m) {
            return '\\' + m;
        });
    } else {
        try {
            new RegExp(value);
        } catch (error) {
            me.statusBar.setStatus({
                text: error.message,
                iconCls: 'x-status-error'
            });
            return null;
        }
        // this is stupid
        if (value === '^' || value === '$') {
            return null;
        }
    }

    return value;
}
Ext.define("BOOM.view.Scrolling", {
    onClassMixedIn: function(b) {
        Ext.Function.interceptBefore(b.prototype, "initComponent", this.prototype.initScrolling);
    },
    initScrolling: function() {
        this.scrollContext = "index";
        this.scrollState = {};
        this.on("afterrender",
        function() {
            this.getScrollEl().addListener("scroll", this.saveScrollState, this);
        },
        this);
    },
    setScrollContext: function(b) {
        this.scrollContext = b;
    },
    eraseScrollContext: function(b) {
        delete this.scrollState[b];
    },
    saveScrollState: function() {
        this.scrollState[this.scrollContext] = this.getScrollTop();
    },
    restoreScrollState: function() {
        this.setScrollTop(this.scrollState[this.scrollContext] || 0);
    },
    scrollToView: function(d, c) {
        d = Ext.get(d);
        c = c || {};
        if (d) {
            this.setScrollTop(this.getScrollTop() + d.getY() + (c.offset || 0));
            c.highlight && d.highlight();
        }
    },
    getScrollTop: function() {
        return this.getScrollEl().getScroll()["top"];
    },
    setScrollTop: function(b) {
        return this.getScrollEl().scrollTo("top", b);
    },
    scrollToTop: function() {
        this.getScrollEl().scrollTo("top");
    },
    getScrollEl: function() {
        return this.body || this.el;
    }
});

Ext.define("BOOM.view.guides.Container", {
    extend: "Ext.panel.Panel",
    alias: "widget.guidecontainer",
    componentCls: "guide-container",
    mixins: ["BOOM.view.Scrolling"],
    //requires: ["Docs.Comments", "Docs.view.comments.LargeExpander"],
    initComponent: function() {
        this.addEvents("afterload");
        this.callParent(arguments);
    },
    scrollToEl: function(b) {
        this.scrollToView(b, {
            highlight: true,
            offset: -100
        });
    },
    load: function(b) {
        this.guide = b;
        this.tpl = this.tpl || new Ext.XTemplate(BOOM.data.showPrintButton ? '<a class="print guide" href="?print=/guide/{name}" target="_blank">Print</a>': "", "{content}");
        this.update(this.tpl.apply(b));
        BOOM.Syntax.highlight(this.getEl());
        this.fireEvent("afterload");
    },
    initComments: function() {
        this.expander = new Docs.view.comments.LargeExpander({
            type: "guide",
            name: this.guide.name,
            el: this.getEl().down(".x-panel-body")
        });
    },
    updateCommentCounts: function() {
        if (!this.expander) {
            return
        }
        this.expander.getExpander().setCount(Docs.Comments.getCount(["guide", this.guide.name, ""]));
    }
});


/*=======================================标签组============================================*/



Ext.define("BOOM.view.BOOMTree", {
    extend: "Ext.tree.Panel",
    alias: "widget.BOOMtree",
    cls: "doc-tree iScroll",
    useArrows: true,
    rootVisible: true,
    border: false,
    bodyBorder: false,
    initComponent: function() {
        this.addEvents("urlclick");
        this.root.expanded = true;
        this.on("itemclick", this.onItemClick, this);
        this.on("beforeitemcollapse", this.handleBeforeExpandCollapse, this);
        this.on("beforeitemexpand", this.handleBeforeExpandCollapse, this);
        this.callParent();
        this.nodeTpl = new Ext.XTemplate('<a href="{url}" rel="{url}">{name}({keyword})</a>');
        this.initNodeLinks();
    },
    initNodeLinks: function() {
        this.getRootNode().cascadeBy(this.applyNodeTpl, this);
    },
    applyNodeTpl: function(b) {
        if (b.get("leaf")) {
            b.set("text", this.nodeTpl.apply({
                text: b.get("name"),
                keyword:b.raw.keyword,
                url: b.raw.url
            }));
            b.commit();
        }
    },
    onItemClick: function(h, record, k, l, i) {
    	if('img'===i.target.localName) return;
        var e = record.raw ? record.raw.url: record.data.url;
        if (e) {
            this.fireEvent("urlclick", e, i);
        } else {
            if (!record.isLeaf()) {
                if (record.isExpanded()) {
                	record.collapse(false);
                } else {
                	record.expand(false);
                }
            }
        }
    },
    selectUrl: function(d) {
        var c = this.findNodeByUrl(d);
        if (c) {
            c.bubble(function(a) {
                a.expand();
            });
            this.getSelectionModel().select(c);
        } else {
            this.getSelectionModel().deselectAll();
        }
    },
    findNodeByUrl: function(b) {
        return this.getRootNode().findChildBy(function(a) {
            return b === a.raw.url;
        },
        this, true);
    },
    findRecordByUrl: function(d) {
        var c = this.findNodeByUrl(d);
        return c ? c.raw: undefined;
    },
    handleBeforeExpandCollapse: function(b) {
        if (this.getView().isAnimating(b)) {
            return false;
        }
    }
});
Ext.define('BOOM.model.GroupTree', {
    extend: 'Ext.data.Model',
    requires:[
        'Ext.data.proxy.LocalStorage',
        'Ext.data.proxy.Ajax'
    ],
    fields:['name','uuid','keyword','url','leaf']
});
Ext.define('BOOM.store.BOOMTreeStore', {
    extend: 'Ext.data.TreeStore',
    alias : 'widget.BOOMTreeStore',
    
    model : 'BOOM.model.GroupTree',
    
	autoLoad: false,
    proxy: {
        type: 'ajax',
        url : '../../../work-platform/tree.do',
        reader: {
            type: 'json'
        }
    }
});

Ext.define("BOOM.view.GroupTree", {
    extend: "BOOM.view.BOOMTree",
    requires: [
               'Ext.grid.plugin.CellEditing'
           ],
    alias: "widget.grouptree",
    initComponent: function() {
        this.store = Ext.create('BOOM.store.BOOMTreeStore', {
    		id : 'boomTreeStore'
        });
        this.store.load({
			params:{
				likename:'factor'
			}
		});
//        this.rootVisible=false;
        this.root = {
                keyword: "业务库"
            };
        this.store.sort([
                         {
                             property : 'keyword',
                             direction: 'ASC'
                         }
                     ]);
        this.hideHeaders=true;
        this.columns = [{
                           xtype: 'treecolumn',
                           dataIndex: 'keyword',
                           width:10,
                           id:'tree_keyword',
                           flex: 1,
                           editor: {
                               xtype: 'textfield',
                               selectOnFocus: true,
                               allowOnlyWhitespace: false
                           }
                       },{
                           xtype: 'treecolumn',
                           dataIndex: 'name',
                           flex: 1,
                           hidden:true,
                           editor: {
                               xtype: 'textfield',
                               selectOnFocus: true,
                               allowOnlyWhitespace: false
                           }
                       },{
                           xtype: 'treecolumn',
                           dataIndex: 'uuid',
                           flex: 1,
                           hidden:true,
                           editor: {
                               xtype: 'textfield',
                               selectOnFocus: true,
                               allowOnlyWhitespace: false
                           }
                       },{
                           xtype: 'treecolumn',
                           dataIndex: 'url',
                           flex: 1,
                           hidden:true,
                           editor: {
                               xtype: 'textfield',
                               selectOnFocus: true,
                               allowOnlyWhitespace: false
                           }
                       },
                       {//删除图标，可以删除表
                           xtype: 'actioncolumn',
                           width: 20,
                           icon: 'dd/resources/images/delete.png',
                           iconCls: 'x-hidden',
                           tooltip: 'Delete',
                           handler: Ext.bind(this.handleDeleteClick, this)
                       }];
        this.addEvents(
                /**
                 * @event deleteclick
                 * Fires when the delete icon is clicked
                 * @param {Ext.grid.View} gridView
                 * @param {Number} rowIndex
                 * @param {Number} colIndex
                 * @param {Ext.grid.column.Action} column
                 * @param {EventObject} e
                 */
                'deleteclick'
        		);
        this.plugins = [this.cellEditingPlugin = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 2,
			errorSummary : false
		})];
        this.callParent();
    },
    buildTree: function(b) {
        return Ext.Array.map(b,
        function(a) {
            if (a.items) {
                return {
                    text: a.title,
                    expanded: true,
                    iconCls: "icon-pkg",
                    children: this.buildTree(a.items)
                };
            } else {
                return this.convert(a);
            }
        },
        this);
    },
    /**
     * Handles a click on a delete icon
     * @private
     * @param {Ext.tree.View} treeView
     * @param {Number} rowIndex
     * @param {Number} colIndex
     * @param {Ext.grid.column.Action} column
     * @param {EventObject} e
     */
    handleDeleteClick: function(gridView, rowIndex, colIndex, column, e) {
        // Fire a "deleteclick" event with all the same args as this handler
        this.fireEvent('deleteclick', gridView, rowIndex, colIndex, column, e);
    },
    refreshView: function() {
        // refresh the data in the view.  This will trigger the column renderers to run, making sure the task counts are up to date.
        this.getView().refresh();
    }
});


Ext.define("BOOM.view.TreeContainer", {
    extend: "Ext.panel.Panel",
    alias: "widget.treecontainer",
    //requires: ["Docs.view.cls.Tree", "Docs.view.GroupTree"],
    cls: "iScroll",
    layout: "card",
    resizable: true,
    resizeHandles: "e",
    collapsible: true,
//    hideCollapseTool: true,
    animCollapse: true,
    header: false,
    initComponent: function() {
    	var me = this;
    	Ext.Ajax.request({    
    	    async : false,
    	    url: '../../work-platform/getTreeNode.do',    
    	    params: {    
    	    },    
    	    success: function(response){    
    	        me.items = [{
    	                          xtype: "grouptree",
    	                          id: "guidetree",
    	                          data: Ext.decode(response.responseText),
    	                          convert: function(b) {
    	                        	  var s=b;
    	                        	  var s=b.keyword;
    	                              return {
    	                                  leaf: true,
    	                                  text: b.name,
    	                                  keyword:b.keyword,
    	                                  url: "#!/guide/" + b.uuid,
    	                                  uuid : b.uuid,
    	                                  iconCls: "icon-guide"
    	                              };
    	                          }
    	                      }];   
    	    }    
    	});   
        this.callParent();
    },
    showTree: function(b) {
        this.show();
        this.layout.setActiveItem(b);
    }
});

Ext.define('VariableGrid.model.VariableModel', {
    extend: 'Ext.data.Model',
    fields: [
        'uuid',//序号
        'seq',
        'tableUuid',
        'keyword',
        'name', //变量名
	 	'type',//变量类型）
		'width',//变量长度
		'decimalWidth',//小数位数
		'label',//变量标签
		'data',//变量值标签
		'missing',//缺省值
		'showWidth',//变量显示宽度
		'showAlign',//对齐方式
		'isUnique',
		'paramTableUuid',
		'paramColumnUuid',
		'paramColumnLabelUuid',
		'paramDefine',
		'paramDefineName',
		'metric',
		'role',
    ],
    idProperty: 'uuid'
});

Ext.define("BOOM.view.Viewport", {
    extend: "Ext.container.Viewport",
    requires: ["component.headtb.toolbar"],
    id: "viewport",
    layout: "border",
    defaults: {
        xtype: "container"
    },
    initComponent: function() {
    	this.items = [{
            region: "north",
            id: "north-region",
            height: 25,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                height: 30,
                minWidth:750,
                xtype: "container",
                layout: "hbox",
                cls:'headerCls',
                items: [
                        {
                        	xtype:'toolbarView',
                        	id:'titleToolbar',
                        	callback : {
                    			// 点击保存
                        		newSth:function(){
                        			addTreeNode();	
                        			/*Ext.MessageBox.prompt("新建表","请输入表名：",function(bu,txt){
                            	  		   if(bu=='ok'){
                            	  			 Ext.Ajax.request({    
        	                    	  	    	    async : true,
        	                    	  	    	    url: '../../work-platform/addTreeNode.do',    
        	                    	  	    	    params: {    
        	                    	  	    	    	keyword : txt
        	                    	  	    	    },    
        	                    	  	    	    success: function(response){ 
        	                    	  	    	    	var uuid = response.responseText;
        	                    	  	    	    	if('数据库中已有该表，保存失败！'===uuid){
        	                    	  	    	    		Ext.MessageBox.alert("提示",uuid);
        	                    	  	    	    	}else{
        	                    	  	    	    		var record= Ext.getCmp("guidetree");
        	                    	  	    	    		var root=Ext.getCmp("guidetree").root;
        	                    	  	    	    		root.appendChild({
        		                    	  	    	    		leaf: true,
        		                    	  	    	    		text: txt,
        		                    	  	    	    		keyword:txt,
        		                    	  	    	    		url: "#!/guide/" + uuid,
        		                    	  	    	    		uuid : uuid,
        		                    	  	    	    		iconCls: "icon-guide"
        		                    	  	    	    	});
        	                    	  	    	    	}
        	                    	  	    	    }    
        	                    	  	    	});   
                            	  		   }
                            	  	});*/
                        		},
                    			save : function(toolbar,btn){
                    				var url = Ext.getCmp('guidetree').selModel.selectionStart==null?SELECT_TREENODE:Ext.getCmp('guidetree').selModel.selectionStart.get('url');
                    				var g = url.match(/^#!\/guide\/(.*?)(-section-[0-9]+)?$/);
                    		        var f = g[1];
                    		        var i = g[2];
                    		        var center = Ext.getCmp("guide-"+f);
                    		        var iframe=center.body.dom;
                    		        var frame=iframe.firstChild;
                    		        var window = frame.contentWindow;
                    		        var grid=window.Ext.getCmp("variablegrid");
                    		        var BLSTstore=grid.getStore();
                    		        var activeTabId=window.Ext.getCmp("centerTab").getActiveTab();
                    		        var tabId=activeTabId.id;
                    			    var tbluuid=f;
                    			    var head ={tbluuid:tbluuid};//表名，以及是否是新建表
                    			    if('blst'.indexOf(tabId)==0){
                    			    	saveBL(head,BLSTstore);
                    			    }else if('sjst'.indexOf(tabId)==0){
                    			    	var SJSTgrid=window.SJSTgrid;
                    		        	var SJSTstoreData=SJSTgrid.getStore();
                    		        	saveSJ(head,SJSTstoreData,BLSTstore);
                    			    }
                    			},
                    			add : function(){
                    				var url = Ext.getCmp('guidetree').selModel.selectionStart==null?SELECT_TREENODE:Ext.getCmp('guidetree').selModel.selectionStart.get('url');
                    				var g = url.match(/^#!\/guide\/(.*?)(-section-[0-9]+)?$/);
                    		        var f = g[1];
                    		        var i = g[2];
                    		        
                    		        var center = Ext.getCmp("guide-"+f);
                    		        var iframe=center.body.dom;
                    		        var frame=iframe.firstChild;
                    		        var window = frame.contentWindow;
                    		        var grid=window.Ext.getCmp("variablegrid");
                    		        var activeTabId=window.Ext.getCmp("centerTab").getActiveTab();
                    		        var tabId=activeTabId.id;
                    		        if('blst'.indexOf(tabId)==0){
                    		        	var blstStore=grid.getStore();
                    		        	var index=blstStore.getCount();
                    		        	if(index>0){
                    				    	if(blstStore.getAt(index-1).get('keyword')===''){
                    				    		return;
                    				    	}
                    			    	}
	                    		        grid.getPlugin().cancelEdit();
	                    		        var keyword = 'var00'+parseInt(Math.random()*(1000-1+1)+1);
	                    		        var seq=0;
	                    		        if(blstStore.getCount()>=1){
	                    		        	seq=blstStore.getAt(blstStore.getCount()-1).get('seq')+1024;
	                    		        }
	                    		        var r = Ext.create('VariableGrid.model.VariableModel', {
	                    		        	uuid:'',//序号
	                    		        	seq:seq,
	                    		            tableUuid:'',
	                    		            keyword:keyword,
	                    		            name:'', //变量名
	                    		    	 	type:'85806344e6354482822f28ff055bcdd0',//变量类型）
	                    		    		width:30,//变量长度
	                    		    		decimalWidth:'',//小数位数
	                    		    		label:'',//变量标签
	                    		    		data:'',//变量值标签
	                    		    		missing:'',//缺省值
	                    		    		showWidth:80,//变量显示宽度
	                    		    		showAlign:'',//对齐方式
	                    		    		isUnique:'',
	                    		    		paramTableUuid:'',
	                    		    		paramColumnUuid:'',
	                    		    		paramColumnLabelUuid:'',
	                    		    		paramDefine:'',
	                    		    		paramDefineName:'',
	                    		    		metric:'',
	                    		    		role:''
	                    		        });
	                    		        blstStore.insert(index, r);
                    			        var plug = grid.getPlugin();
                    			        plug.startEdit(index, 6);
                    		        }else if('sjst'.indexOf(tabId)==0){
                    		        	var SJSTgrid=window.SJSTgrid;
                    		        	var SJSTstoreData=SJSTgrid.getStore();
                    		        	var BLSTstore=grid.getStore();
                    		     	   	SJSTgrid.getPlugin().cancelEdit();
                    			   		var fields = [];
                    			   		fields.push('uuid');
                    			   		fields.push('seq');
                    			   		var seq=0;
	                    		        if(SJSTstoreData.getCount()>=1){
	                    		        	var s=SJSTstoreData.getAt(SJSTstoreData.getCount()-1).get('seq');
	                    		        	var t = typeof s;
	                    		        	if(t.toLocaleLowerCase()==='string')
	                    		        		s=parseInt(s);
	                    		        	seq=s+1024;
	                    		        }
                    			   		var defaultColumns = '{"seq":'+seq+',';
                    			   		var s='';
                    			   		var editorType='';
                    			   		for (var i = 0; i < BLSTstore.getCount(); i++) {
                    			   			var record = BLSTstore.getAt(i);
                    			   				
                    			   			fields.push(record.get('name'));
                    			   			
                    			   			defaultColumns +='"'+record.get('name')+'":"'+record.get('missing')+'",';
                    			   		}
                    			   		if(BLSTstore.getCount()>0){
                    			   			defaultColumns=defaultColumns.substring(0, defaultColumns.length-1);
                    			   			defaultColumns+='}';
                    			   			s = Ext.decode(defaultColumns);
                    			   		}
                    			   		Ext.define('tbl', {
                    				        extend: 'Ext.data.Model',
                    				        fields: fields
                    				    });
                    			   		var r = Ext.create('tbl',s);

                    		            SJSTstoreData.insert(SJSTstoreData.getCount(), r);
                    		            var plug = SJSTgrid.getPlugin();
                    			        plug.startEdit(SJSTstoreData.getCount()-1, 2);
                    		       }
                    			},
                    			insert : function(toolbar,btn){
                    				var url = Ext.getCmp('guidetree').selModel.selectionStart==null?SELECT_TREENODE:Ext.getCmp('guidetree').selModel.selectionStart.get('url');
                    				var g = url.match(/^#!\/guide\/(.*?)(-section-[0-9]+)?$/);
                    		        var f = g[1];
                    		        var i = g[2];
                    		        var center = Ext.getCmp("guide-"+f);
                    		        var iframe=center.body.dom;
                    		        var frame=iframe.firstChild;
                    		        var window = frame.contentWindow;
                    		        var grid=window.Ext.getCmp("variablegrid");
                    		        var activeTabId=window.Ext.getCmp("centerTab").getActiveTab();
                    		        var tabId=activeTabId.id;
                    		        if('blst'.indexOf(tabId)==0){
                    		        	var blstStore=grid.getStore();
                    		        	var index=blstStore.getCount();
                    		        	grid.getPlugin().cancelEdit();
                    		        	var sm = grid.getSelectionModel();
                    		        	var s =sm.getSelection();
                    		        	var position=s[0].index; 
                    		        	var keyword = 'ins00'+parseInt(Math.random()*(1000-1+1)+1);
                    		        	var seq=0;
                    		        	if(position>=1){
                    		        		seq=(blstStore.getAt(position-1).get('seq')+blstStore.getAt(position).get('seq'))/2;
                    		        	}
                    		        	
                    		        	
	                    		        var r = Ext.create('VariableGrid.model.VariableModel', {
	                    		        	uuid:'',//序号
	                    		        	seq:seq,
	                    		            tableUuid:'',
	                    		            keyword:keyword,
	                    		            name:'', //变量名
	                    		    	 	type:'85806344e6354482822f28ff055bcdd0',//变量类型）
	                    		    		width:30,//变量长度
	                    		    		decimalWidth:'',//小数位数
	                    		    		label:'',//变量标签
	                    		    		data:'',//变量值标签
	                    		    		missing:'',//缺省值
	                    		    		showWidth:80,//变量显示宽度
	                    		    		showAlign:'',//对齐方式
	                    		    		isUnique:'',
	                    		    		paramTableUuid:'',
	                    		    		paramColumnUuid:'',
	                    		    		paramColumnLabelUuid:'',
	                    		    		paramDefine:'',
	                    		    		paramDefineName:'',
	                    		    		metric:'',
	                    		    		role:''
	                    		        });
	                    		   		blstStore.insert(position, r);
	                    		        var plug = grid.getPlugin();
	                    		        plug.startEdit(position, 2);
	                    		        var tbluuid=f;
	                    		        if(blstStore.getModifiedRecords().length>0){
	                    		        	var head ={tbluuid:tbluuid};
	                    		        	saveBL(head,blstStore);
	                    		        }
	                    		        sm.select(position);
                    		        }else if('sjst'.indexOf(tabId)==0){
                    		        	var SJSTgrid=window.SJSTgrid;
                    		        	var SJSTstoreData=SJSTgrid.getStore();
                    		        	var BLSTstore=grid.getStore();
                    		     	   	SJSTgrid.getPlugin().cancelEdit();
                    			   		var fields = [];
                    			   		fields.push('uuid');
                    			   		fields.push('seq');
                    			   		var sm = SJSTgrid.getSelectionModel();
                    		        	var s =sm.getSelection();
                    		        	var position=s[0].index; 
                    		        	var seq=0;
                    		        	if(position>=1){
                    		        		var s1=SJSTstoreData.getAt(position-1).get('seq');
	                    		        	var t = typeof s1;
	                    		        	if(t.toLocaleLowerCase()==='string')
	                    		        		s1=parseInt(s1);
	                    		        	var s2=SJSTstoreData.getAt(position).get('seq');
	                    		        	if(t.toLocaleLowerCase()==='string')
	                    		        		s2=parseInt(s2);
	                    		        	seq=s+1024;
                    		        		seq=(s1+s2)/2;
                    		        	}
                    			   		var defaultColumns = '{"seq":'+seq+',';
                    			   		var s='';
                    			   		var editorType='';
                    			   		for (var i = 0; i < BLSTstore.getCount(); i++) {
                    			   			var record = BLSTstore.getAt(i);
                    			   				
                    			   			fields.push(record.get('name'));
                    			   			
                    			   			defaultColumns +='"'+record.get('name')+'":"'+record.get('missing')+'",';
                    			   		}
                    			   		if(BLSTstore.getCount()>0){
                    			   			defaultColumns=defaultColumns.substring(0, defaultColumns.length-1);
                    			   			defaultColumns+='}';
                    			   			s = Ext.decode(defaultColumns);
                    			   		}
                    			   		Ext.define('tbl', {
                    				        extend: 'Ext.data.Model',
                    				        fields: fields
                    				    });
                    			   		var r = Ext.create('tbl',s);

                    		            SJSTstoreData.insert(position, r);
                    		            var plug = SJSTgrid.getPlugin();
                    		            var tbluuid=f;
//	                    		        if(SJSTstoreData.getModifiedRecords().length>0){
	                    		        	var head ={tbluuid:tbluuid};
	                    		        	saveSJ(head,SJSTstoreData,BLSTstore);
//	                    		        }
                    			        plug.startEdit(position, 2);
                    		       }
                    			},
                    			remove : function(){
                    				Ext.MessageBox.confirm('确认', '你确定要删除?', function(e){
                    					   if(e=='yes'){
                    						   var delBLJson=[];
                    							var delSJJson=[];
                    							var url = Ext.getCmp('guidetree').selModel.selectionStart==null?SELECT_TREENODE:Ext.getCmp('guidetree').selModel.selectionStart.get('url');
			                    				var g = url.match(/^#!\/guide\/(.*?)(-section-[0-9]+)?$/);
			                    		        var f = g[1];
			                    		        var i = g[2];
			                    		        var center = Ext.getCmp("guide-"+f);
			                    		        var iframe=center.body.dom;
			                    		        var frame=iframe.firstChild;
			                    		        var window = frame.contentWindow;
			                    		        var grid=window.Ext.getCmp("variablegrid");
			                    		        var activeTabId=window.Ext.getCmp("centerTab").getActiveTab();
			                    		        var tabId=activeTabId.id;
			                    		        var head ={tbluuid:f};//表名，以及是否是新建表
			                    		        if('blst'.indexOf(tabId)==0){
			                    		        	var blstStore=grid.getStore();
			                    		        	var sm = grid.getSelectionModel();
			                    		        	blstStore.remove(sm.getSelection());
			                    		        	if (blstStore.getCount() > 0) {
			                    		        		sm.select(0);
			                    		        	}
		                    		        		var delstores= blstStore.getRemovedRecords();
		             				   		        if(delstores.length>0){
		             				   			    	for(var i=0;i<delstores.length;i++){
		             				   			    		var record = delstores[i];
		             				   			    		if(record.get('uuid')==='') continue;
		             				   			    		delBLJson.push(record.data);
		             				   			    	}
		             				   		    	}
			                    		        }else if('sjst'.indexOf(tabId)==0){
			                    		        	var SJSTgrid=window.SJSTgrid;
			                    		        	var SJSTstoreData=SJSTgrid.getStore();
			                    		        	var sm = SJSTgrid.getSelectionModel();
			                    			        SJSTstoreData.remove(sm.getSelection());
			                    			        if (SJSTstoreData.getCount() > 0) {
			                    			            sm.select(0);
			                    			        }
		                    				        var delstores= SJSTstoreData.getRemovedRecords();
		                    				        if(delstores.length>0){
		                    					    	for(var i=0;i<delstores.length;i++){
		                    					    		var record = delstores[i];
		                    					    		delSJJson.push(record.data);
		                    					    	}
		                    				    	}
			                    		        }
			                    		        Ext.Ajax.request({
			                    				    url: '../../../work-platform/deletedata.do',
			                    				    params: {
			                    				    	head: Ext.encode(head),
			                    				    	delBLJson: Ext.encode(delBLJson),
			                    				    	delSJJson:Ext.encode(delSJJson)
			                    				    },
			                    				    success: function(response){
			                    				    	var text = response.responseText;
			                    				    	var messageBox = Ext.getCmp('message');
			                    				    	messageBox.setValue(/*messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、'+*/text);
			                    				    	grid.getStore().reload();
			                    				    	Ext.example.msg('提示', '{0}', text);
			                    				    	
			                    				    },
			                    				    failure : function(response) {
			                    				    	var messageBox = Ext.getCmp('message');
			                    				    	messageBox.setValue(/*messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+*/'、删除失败');
			                    				    	Ext.example.msg('提示', '{0}', '删除失败');
			                    		}
			                    	});
                    					   }
                					   });
                    			},
                    			import : function(toolbar,btn){
                    				onItemUpload();
                    			},
                    			exportExcel:function(toolbar,btn){
                    				var tree=Ext.getCmp('guidetree');
                    				var uuid=tree.getSelectionModel().selectionStart.get('uuid');
                    				 window.location.href = '../../work-platform/download.do?uuid='+uuid;
                    			}
                        }
                        },{
                    xtype: "container",
                    flex: 1
                },{
                    xtype: "searchcontainer",
                    id: "search-container",
                    width: 230,
                    margin: "4 0 0 0"
                }]
            }]
        },{
        	region: "center",
            layout: "border",
            minWidth: 800,
            items: [{
                region: "west",
                xtype: "treecontainer",
                id: "treecontainer",
                border: 1,
//                overflowX:'scroll',
               /* tbar:Ext.Toolbar({  
                    buttonAlign : 'center',  
                    items : [{
                    	xtype : 'textfield',
                    	emptyText : '根据表名检索数据表...',
                    	id:'filter_input',
                    	width : 172,
                    	listeners:{
                    	           'change':function(e){
                    	        	   var searchText=Ext.getCmp('filter_input').value;
	                                   	var treeStore = Ext.getCmp('guidetree').getStore();
//	                                   	treeStore.reload();
	                                   	for(var i=0;i<treeStore.tree.root.childNodes.length;i++){
	                                   		var record=treeStore.getRootNode( ).childNodes[i];
	                                   		if(record.data.keyword.indexOf(searchText)!=-1){
//	                                   			alert(record.get('keyword'));
	                                   		}else{
	                                   			treeStore.removeAt(i);
	                                   		}
	                                   		
	                                   	}
                    	           }
                    	}
                    }] 
                }), */
                bodyPadding: "10 9 4 1",
                padding: "5 5",
                width: 190
            },{
                region: "center",
                id: "center-container",
                layout: "fit",
                minWidth: 750,
                border: false,
                padding: "5 5",
                items: {
                    id: "card-panel",
                    cls: "card-panel",
                    xtype: "container",
                    layout: {
                        type: "card",
                        deferredRender: true
                    },
                    items: [
                    {
                        xtype: "container",
                        id: "failure"
                    },
                    {
                        autoScroll: true,
                        xtype: "guideindex",
                        id: "guideindex"
                    }
                    /**/,
                    {
                        autoScroll: true,
                        xtype: "guidecontainer",
                        id: "guide",
                        cls: "iScroll"
                    }]
                }
            }, {
            	xtype     : 'textareafield',
            	id		  : 'message',
                region: 'south',
                split: true,
                height: 25,
                minSize: 100,
                maxSize: 200,
                collapsible: true,
                collapsed: true
            }]
        }];
        this.callParent(arguments);
    },
    setPageTitle: function(b) {
        b = Ext.util.Format.stripTags(b);
        if (!this.origTitle) {
            this.origTitle = document.title;
        }
        document.title = b ? (b + " - " + this.origTitle) : this.origTitle;
    }
});



//-----------------------------------application is here------------------------------
Ext.define("BOOM.Application", {
    requires: ["Ext.app.Application"],
    constructor: function() {
        this.createApp();
    },
    createApp: function() {
        new Ext.app.Application({
            name: "BOOM",
            controllers: ["Guides"/*, "Tabs"*/],
            launch: this.launch
        });
    },
    launch: function() {
    	
    	BOOM.App = this;
        Ext.create("BOOM.view.Viewport");
    }
});


Ext.onReady(function() {
	
    Ext.create("BOOM.Application");
    
});