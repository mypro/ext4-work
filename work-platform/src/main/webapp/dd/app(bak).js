//-------------------------------------common is here----------------------------
var MESSAGE_NUMBER=1;
Ext.define("BOOM.model.Setting", {
    fields: ["id", "key", "value"],
    extend: "Ext.data.Model",
    requires: ["Ext.data.proxy.LocalStorage"],
    proxy: {
        type: window.localStorage ? "localstorage": "memory",
        id: BOOM.data.localStorageDb + "-settings"
    }
});
Ext.define("BOOM.store.Settings", {
    extend: "Ext.data.Store",
    requires: ["BOOM.model.Setting"],
    model: "BOOM.model.Setting"
});

Ext.define("BOOM.LocalStore", {
    storeName: "",
    init: function() {
        this.localStorage = !!window.localStorage;
        this.store = Ext.create(this.storeName);
        if (this.localStorage) {
            this.cleanup();
            this.store.load();
            if (window.addEventListener) {
                window.addEventListener("storage", Ext.Function.bind(this.onStorageChange, this), false);
            } else {
                window.attachEvent("onstorage", Ext.Function.bind(this.onStorageChange, this));
            }
        }
    },
    onStorageChange: function(b) {
        b = b || window.event;
        if (b.key === this.store.getProxy().id) {
            this.store.load();
        }
    },
    syncStore: function() {
        this.localStorage && this.store.sync();
    },
    cleanup: function() {
        var f = /-settings/;
        for (var d = 0; d < window.localStorage.length; d++) {
            var e = window.localStorage.key(d);
            if (!f.test(e)) {
                window.localStorage.removeItem(e);
            }
        }
    }
});

Ext.define("BOOM.Settings", {
    extend: "BOOM.LocalStore",
    singleton: true,
    requires: "BOOM.store.Settings",
    storeName: "BOOM.store.Settings",
    defaults: {
        show: {
            "public": true,
            "protected": false,
            "private": false,
            deprecated: false,
            removed: false,
            inherited: true,
            accessor: true
        },
        comments: {
            hideRead: false
        },
        showPrivateClasses: false,
        classTreeLogic: "PackageLogic"
    },
    set: function(d, f) {
        var e = this.store.findExact("key", d);
        if (e > -1) {
            this.store.removeAt(e);
        }
        this.store.add({
            key: d,
            value: f
        });
        this.syncStore();
    },
    get: function(c) {
        var d = this.store.findExact("key", c);
        return d > -1 ? this.store.getAt(d).get("value") : this.defaults[c];
    }
});

Ext.define("BOOM.History", {
    singleton: true,
    init: function() {
        Ext.util.History.useTopWindow = false;
        Ext.util.History.init(function() {
            this.historyLoaded = true;
            this.initialNavigate();
        },
        this);
        Ext.util.History.on("change",
        function(b) {
            this.navigate(b, true);
        },
        this);
    },
    notifyTabsLoaded: function() {
        this.tabsLoaded = true;
        this.initialNavigate();
    },
    initialNavigate: function() {
        if (this.tabsLoaded && this.historyLoaded) {
            this.navigate(Ext.util.History.getToken(), true);
        }
    },
    navigate: function(e, g) {
        var f = this.parseToken(e);
        if (f.url == "#!/api") {
            Docs.App.getController("Classes").loadIndex(g)
        } else {
            if (f.type === "api") {
                Docs.App.getController("Classes").loadClass(f.url, g)
            } else {
                if (f.url === "#!/guide") {
                    BOOM.App.getController("Guides").loadIndex(g);
                } else {
                    if (f.type === "guide") {
                    	BOOM.App.getController("Guides").loadGuide(f.url, g);
                    } else {
                        if (f.url === "#!/video") {
                            Docs.App.getController("Videos").loadIndex(g)
                        } else {
                            if (f.type === "video") {
                                Docs.App.getController("Videos").loadVideo(f.url, g)
                            } else {
                                if (f.url === "#!/example") {
                                    Docs.App.getController("Examples").loadIndex()
                                } else {
                                    if (f.type === "example") {
                                        Docs.App.getController("Examples").loadExample(f.url, g)
                                    } else {
                                        if (f.url === "#!/comment") {
                                            Docs.App.getController("Comments").loadIndex()
                                        } else {
                                            if (f.url === "#!/tests") {
                                                Docs.App.getController("Tests").loadIndex()
                                            } else {
//                                                if (Docs.App.getController("Welcome").isActive()) {
//                                                    Docs.App.getController("Welcome").loadIndex(g)
//                                                } else {
                                                    if (!this.noRepeatNav) {
                                                        this.noRepeatNav = true;
                                                        var h = Ext.getCmp("BOOMtabs").staticTabs[0];
                                                        if (h) {
                                                            this.navigate(h.href, g)
                                                        }
                                                    }
//                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    parseToken: function(d) {
        var c = d && d.match(/!?(\/(api|guide|example|video|comment|tests)(\/(.*))?)/);
        return c ? {
            type: c[2],
            url: "#!" + c[1]
        }: {};
    },
    push: function(e, f) {
        e = this.cleanUrl(e);
        if (!/^#!?/.test(e)) {
            e = "#!" + e;
        }
        var d = Ext.util.History.getToken() || "";
        if ("#" + d.replace(/^%21/, "!") !== e) {
            Ext.util.History.add(e);
        }
    },
    cleanUrl: function(b) {
        return b.replace(/^[^#]*#/, "#");
    }
});


Ext.define("BOOM.Syntax", {
    singleton: true,
    highlight: function(b) {
        Ext.Array.forEach(Ext.query("pre", b.dom || b),
        function(a) {
            a = Ext.get(a);
            if (a.child("code")) {
                if (! (a.hasCls("inline-example") && a.hasCls("preview"))) {
                    a.addCls("prettyprint");
                }
            } else {
                if (!a.parent(".CodeMirror") && !a.hasCls("hierarchy")) {
                    a.addCls("notpretty");
                }
            }
        });
        prettyPrint();
    }
});
//-------------------------------------controller is here----------------------------
Ext.define("BOOM.controller.Content", {
    extend: "Ext.app.Controller",
    MIDDLE: 1,
    title: "",
    loadIndex: function(b) {
        b || BOOM.History.push(this.baseUrl);
        this.getViewport().setPageTitle(this.title);
        Ext.getCmp("BOOMtabs").activateTab(this.baseUrl);
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
        this.addEvents("showGuide");
        this.control({
            "#guidetree": {
                urlclick: function(d, c) {
                    this.handleUrlClick(d, c, this.getTree());
                },
                itemcontextmenu : function(menutree, record, items, index, e){
                	this.handleRightClick(menutree, record, items, index, e);
                }
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
    handleRightClick : function(menutree, record, items, index, e){
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
	                    	        		    	messageBox.setValue(messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、'+uuid);
	                    	  	    	    	}else{
	                    	  	    	    		var messageBox = Ext.getCmp('message');
	                    	        		    	messageBox.setValue(messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、新建['+txt+']表成功，表索引为：'+uuid);
		                    	  	    	    	record.appendChild({
		                    	  	    	    		leaf: true,
		                    	  	    	    		text: txt,
		                    	  	    	    		keyword:txt,
		                    	  	    	    		url: "#!/guide/" + uuid,
		                    	  	    	    		uuid : uuid,
		                    	  	    	    		iconCls: "icon-guide"
		                    	  	    	    	});
	                    	  	    	    	}
//	                    	  	    	    	{
//	          	                                  leaf: true,
//	          	                                  text: b.name,
//	          	                                  url: "#!/guide/" + b.uuid,
//	          	                                  uuid : b.uuid,
//	          	                                  iconCls: "icon-guide"
//	          	                              }
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
                   	 	var tblName=record.raw.text;
                   	 	var tblKeyword=record.raw.keyword;
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
                		                /*'change': function(fb, v){
                		                	saveOrno=false;
                		                }*/
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
	                    	        		    	messageBox.setValue(messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、表【'+tblName+'】修改为【'+Ext.getCmp('tablename').value+'】，'+response.responseText);
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
                                 
     	        		    	messageBox.setValue(messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、'+text);
                                 if('删除成功！'.indexOf(text)==0){
                                	 record.remove(record);
                                	 
                                	 /*Ext.getCmp('card-panel').add({
                                         autoScroll: true,
                                         xtype: "guidecontainer",
                                         id: "guide-"+uuid,
                                         cls: "iScroll"
                                     });*/
                                	 var tab=Ext.getCmp("guide-"+tbluuid);
//                                	 tab.hide();
                                	 //tab.destroy();
                                	 Ext.getCmp('card-panel').remove(tab);
                                	var tabs=Ext.getCmp("BOOMtabs");
                                	tabs.removeTab(Ext.getCmp(tabs.activeTab));
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
    handleUrlClick: function(d, f, e) {
        d = d.replace(/.*#!?/, "#!");
        if (this.opensNewWindow(f)) {
            window.open(d);
            e && e.selectUrl(this.activeUrl ? this.activeUrl: "");
        } else {
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
        h || BOOM.History.push(j);
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
        //if (this.activeUrl !== j) {
        	if(null == i){
        		Ext.getCmp('card-panel').add({
                    autoScroll: true,
                    xtype: "guidecontainer",
                    id: "guide-"+uuid,
                    cls: "iScroll"
                });
        		Ext.getCmp("card-panel").layout.setActiveItem("guide-"+uuid);
        		Ext.getCmp("guide-"+uuid).body.update(
                    	'<iframe id="mainPage-'+uuid+'" width="100%" height="95%" frameborder=0 src=../../tableclient/index.html?tableUuid='
        								+uuid+'&theme=gray></iframe>'
                    		);
        	}else{
        		Ext.getCmp("card-panel").layout.setActiveItem("guide-"+uuid);
        	}
        	
            g = true;
        //}
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


Ext.define("BOOM.controller.Tabs", {
    extend: "Ext.app.Controller",
    requires: ["BOOM.History", "BOOM.Settings"],
    refs: [{
        ref: "guideIndex",
        selector: "#guideindex"
    },{
        ref: "guideTree",
        selector: "#guidetree"
    },
    {
        ref: "BOOMtabs",
        selector: "#BOOMtabs"
    }],
    init: function() {
        this.getController("Guides").addListener({
            showGuide: function(b) {
                this.addTabFromTree("#!/guide/" + b);
            },
            scope: this
        });
        this.control({
            "[componentCls=doctabs]": {
                tabActivate: function(d, c) {
                    BOOM.History.push(d, c);
                },
                scope: this
            }
        });
    },
    onLaunch: function() {
        this.getBOOMtabs().setStaticTabs(Ext.Array.filter([this.getGuideIndex().getTab()],
        function(a) {
            return a;
        }));
        /*
        this.commentsTab = this.getCommentIndex().getTab();
        */
        var b = BOOM.Settings.get("tabs");
        if (b) {
            Ext.Array.forEach(b,
            function(a) {
                this.addTabFromTree(a, {
                    animate: true
                });
            },
            this);
        }
        
        BOOM.History.notifyTabsLoaded();
        
    },
    showCommentsTab: function() {
        var b = this.getDoctabs().getStaticTabs();
        this.getDoctabs().setStaticTabs(b.concat(this.commentsTab));
    },
    hideCommentsTab: function() {
        var b = this.getDoctabs().getStaticTabs();
        this.getDoctabs().setStaticTabs(Ext.Array.remove(b, this.commentsTab));
    },
    addTabFromTree: function(h, g) {
        var e = this.getTree(h);
        var f = e.findRecordByUrl(h);
        if (f) {
            this.addTab(f, g);
        }
    },
    addTab: function(d, c) {
        c = c || {
            animate: true,
            activate: true
        };
        this.getBOOMtabs().addTab({
            href: d.url,
            text: d.text,
            iconCls: d.iconCls
        },
        c);
    },
    getTree: function(b) {
        if (/#!?\/api/.test(b)) {
            return this.getClassTree()
        } else {
            if (/#!?\/guide/.test(b)) {
                return this.getGuideTree()
            } else {
                if (/#!?\/video/.test(b)) {
                    return this.getVideoTree()
                } else {
                    if (/#!?\/example/.test(b)) {
                        return this.getExampleTree()
                    } else {
                        return this.getClassTree()
                    }
                }
            }
        }
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
                xtype: "triggerfield",
                triggerCls: "reset",
                emptyText: "Search",
                width: 170,
                id: "search-field",
                enableKeyEvents: true,
                hideTrigger: true,
                onTriggerClick: function() {
                    this.reset();
                    this.focus();
                    this.setHideTrigger(true);
                    Ext.getCmp("search-dropdown").hide()
                }
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
        //if (Docs.Comments.isEnabled()) {
        //    this.initComments()
        //}
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
Ext.define("BOOM.view.ThumbList", {
    extend: "Ext.view.View",
    alias: "widget.thumblist",
    //requires: ["Docs.Comments"],
    cls: "thumb-list",
    itemSelector: "dl",
    urlField: "url",
    commentType: "",
    itemTpl: [],
    initComponent: function() {
        this.addEvents("urlclick");
        Ext.Array.forEach(this.data,
        function(c, d) {
            c.id = "sample-" + d
        });
        this.store = Ext.create("Ext.data.JsonStore", {
            fields: ["id", "title", "items"]
        });
        this.store.loadData(this.flattenSubgroups(this.data));
        this.tpl = new Ext.XTemplate(Ext.Array.flatten(["<div>", '<tpl for=".">', '<div><a name="{id}"></a><h2><div>{title}</div></h2>', "<dl>", '<tpl for="items">', this.itemTpl, "</tpl>", '<div style="clear:left"></div></dl></div>', "</tpl>", "</div>"]));
        this.itemTpl = undefined;
        this.data = undefined;
        this.on("viewready",
        function() {
            this.initHover();
            /*
            if (Docs.Comments.isEnabled()) {
                this.initComments();
            }
            */
        },
        this);
        this.callParent(arguments);
    },
    initHover: function() {
        this.getEl().on("mouseover",
        function(c, d) {
            Ext.get(d).addCls("over")
        },
        this, {
            delegate: "dd"
        });
        this.getEl().on("mouseout",
        function(c, d) {
            Ext.get(d).removeCls("over")
        },
        this, {
            delegate: "dd"
        })
    },
    initComments: function() {
        this.getEl().select("dd").each(function(e) {
            var d = e.getAttributeNS("ext", this.urlField).replace(/^.*\//, "");
            var f = Docs.Comments.getCount([this.commentType, d, ""]);
            if (f) {
                Ext.DomHelper.append(e.down("p"), Docs.Comments.counterHtml(f))
            }
        },
        this)
    },
    updateCommentCounts: function() {
        if (!this.getEl()) {
            return
        }
        this.getEl().select(".comment-counter-small").remove();
        this.initComments()
    },
    flattenSubgroups: function(c) {
        function d(a) {
            if (a.items) {
                return Ext.Array.map(a.items, d)
            } else {
                return a
            }
        }
        return Ext.Array.map(c,
        function(a) {
            return {
                id: a.id,
                title: a.title,
                items: Ext.Array.map(a.items,
                function(b) {
                    if (b.items) {
                        var f = Ext.apply({},
                        d(b)[0]);
                        f.title = b.title;
                        return f
                    } else {
                        return b
                    }
                })
            }
        })
    },
    onContainerClick: function(c) {
        var d = c.getTarget("h2", 3, true);
        if (d) {
            d.up("div").toggleCls("collapsed")
        }
    },
    onItemClick: function(h, j, l, i) {
        var k = i.getTarget("dd", 5, true);
        if (k && !i.getTarget("a", 2)) {
            var e = k.getAttributeNS("ext", this.urlField);
            this.fireEvent("urlclick", e)
        }
        return this.callParent(arguments)
    }
});
//-----------------------------------index view is here顶部----------------------------

Ext.define("BOOM.view.guides.Index", {
    extend: "Ext.container.Container",
    alias: "widget.guideindex",
    requires: ["BOOM.view.ThumbList"],
    mixins: ["BOOM.view.Scrolling"],
    cls: "iScroll",
    margin: "10 0 0 0",
    autoScroll: true,
    initComponent: function() {
        this.items = [{
            xtype: "container",
            html: '<h1 class="eg">Guides</h1>'
        },
        Ext.create("BOOM.view.ThumbList", {
            commentType: "guide",
            itemTpl: ['<dd ext:url="#!/guide/{name}"><div class="thumb"><img src="dd/guides/{name}/icon.png"/></div>', "<div><h4>{title}</h4><p>{description}</p></div>", "</dd>"],
            data: BOOM.data.guides
        })];
        this.callParent(arguments);
    },
    getTab: function() {
        var b = (BOOM.data.guides || []).length > 0;
        return b ? {
            cls: "guides",
            href: "#!/guide",
            tooltip: "Guides"
        }: false;
    },
    updateCommentCounts: function() {
        this.down("thumblist").updateCommentCounts();
    }
});




Ext.define("BOOM.view.BOOMTree", {
    extend: "Ext.tree.Panel",
    alias: "widget.BOOMtree",
    cls: "doc-tree iScroll",
    useArrows: true,
    rootVisible: false,
    border: false,
    bodyBorder: false,
    initComponent: function() {
        this.addEvents("urlclick");
        this.root.expanded = true;
        this.on("itemclick", this.onItemClick, this);
        this.on("beforeitemcollapse", this.handleBeforeExpandCollapse, this);
        this.on("beforeitemexpand", this.handleBeforeExpandCollapse, this);
        this.callParent();
        this.nodeTpl = new Ext.XTemplate('<a href="{url}" rel="{url}">{text}({keyword})</a>');
        this.initNodeLinks();
    },
    initNodeLinks: function() {
        this.getRootNode().cascadeBy(this.applyNodeTpl, this);
    },
    applyNodeTpl: function(b) {
        if (b.get("leaf")) {
            b.set("text", this.nodeTpl.apply({
                text: b.get("text"),
                keyword:b.raw.keyword,
                url: b.raw.url
            }));
            b.commit();
        }
    },
    onItemClick: function(h, j, k, l, i) {
        var e = j.raw ? j.raw.url: j.data.url;
        if (e) {
            this.fireEvent("urlclick", e, i);
        } else {
            if (!j.isLeaf()) {
                if (j.isExpanded()) {
                    j.collapse(false);
                } else {
                    j.expand(false);
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

Ext.define("BOOM.view.GroupTree", {
    extend: "BOOM.view.BOOMTree",
    requires: [
               'Ext.grid.plugin.CellEditing'
           ],
    alias: "widget.grouptree",
    /*viewConfig: {
    	plugins: []
    },*/
    initComponent: function() {
    	var childs = this.buildTree(this.data);
        this.root = {
            text: "Root",
            children: childs
        };
        
        /*this.columns = [
                           {
                               xtype: 'treecolumn',
                               dataIndex: 'keyword',
                               flex: 1,
                               editor: {
                                   xtype: 'textfield',
                                   selectOnFocus: true,
                                   allowOnlyWhitespace: false
                               }
                           }];*/
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
    hideCollapseTool: true,
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
    	                                  iconCls: "icon-guide",
    	                                  editor: {
    	                                      xtype: 'textfield',
    	                                      selectOnFocus: true,
    	                                      allowOnlyWhitespace: false
    	                                  }
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

Ext.define("BOOM.view.TabMenu", {
    extend: "Ext.menu.Menu",
    plain: true,
    componentCls: "tab-menu",
    initComponent: function() {
        this.addEvents("tabItemClick", "closeAllTabs");
        this.items = [{
            text: "Close other tabs",
            iconCls: "close",
            cls: "close-all",
            handler: function() {
                this.fireEvent("closeAllTabs");
            },
            scope: this
        }];
        this.callParent();
    },
    addTab: function(c, d) {
        this.insert(this.items.length - 1, {
            text: c.text,
            iconCls: c.iconCls,
            origIcon: c.iconCls,
            href: c.href,
            cls: d,
            handler: this.onTabItemClick,
            scope: this
        });
    },
    onTabItemClick: function(b) {
        this.fireEvent("tabItemClick", b);
    },
    addTabCls: function(c, d) {
        this.items.each(function(a) {
            if (a.href === c.href) {
                a.addCls(d);
            }
        });
    }
});

Ext.define("BOOM.view.Tabs", {
    extend: "Ext.container.Container",
    alias: "widget.BOOMtabs",
    id: "BOOMtabs",
    componentCls: "doctabs",
    requires: ["BOOM.History", "BOOM.view.TabMenu"],
    minTabWidth: 80,
    maxTabWidth: 160,
    animDuration: 150,
    margin:'0 0 0 185',
    tabs: [],
    tabsInBar: [],
    tabCache: {},
    staticTabs: [],
    initComponent: function() {
        this.addEvents("tabActivate", "tabClose");
        this.tpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="doctab overview {cls}{active}">', '<div class="l"></div>', '<div class="m">', '<tpl if="text">', '<a class="tabUrl ov-tab-text" href="{href}">{text}</a>', "<tpl else>", '<a class="tabUrl ov-tab" href="{href}">&nbsp;</a>', "</tpl>", "</div>", '<div class="r"></div>', "</div>", "</tpl>", '<div style="float: left; width: 8px">&nbsp;</div>', '<div class="tab-overflow"></div>');
        this.html = this.tpl.applyTemplate(this.staticTabs);
        this.tabTpl = Ext.create("Ext.XTemplate", '<div class="doctab', '{[values.active ? (" active") : ""]}', '" style="', '{[values.width ? ("width: " + values.width + "px;") : ""]}', '{[values.visible ? "" : "visibility: hidden;"]}">', '<div class="l"></div>', '<div class="m">', '<span class="icn {iconCls}">&nbsp;</span>', '<a class="tabUrl main-tab" href="{href}">{text}</a>', "</div>", '<div class="r"><a class="close" href="#">&nbsp;</a></div>', "</div>");
        this.on("afterrender", this.initListeners, this);
        this.on("resize", this.refresh, this);
        this.callParent();
    },
    initListeners: function() {
        this.el.on("mouseover",
        function(c, d) {
            Ext.get(d).addCls("ovr");
        },
        this, {
            delegate: ".close"
        });
        this.el.on("mouseout",
        function(c, d) {
            Ext.get(d).removeCls("ovr");
        },
        this, {
            delegate: ".close"
        });
        this.el.on("click",
        function(f, d) {
            var e = Ext.get(d).up(".doctab").down(".tabUrl").getAttribute("href");
            e = BOOM.History.cleanUrl(e);
            this.removeTab(e);
            this.fireEvent("tabClose", e);
        },
        this, {
            delegate: ".close",
            preventDefault: true
        });
        this.el.on("click",
        function(f, d) {
            if (Ext.fly(f.getTarget()).hasCls("close")) {
                return
            }
            var e = Ext.get(d).down(".tabUrl").getAttribute("href");
            this.fireEvent("tabActivate", e, {
                navigate: true
            });
        },
        this, {
            delegate: ".doctab"
        });
        this.el.on("contextmenu",
        function(c, d) {
            if (!Ext.get(d).hasCls("overview")) {
                this.createMenu().showBy(d);
            }
        },
        this, {
            delegate: ".doctab",
            preventDefault: true
        });
        this.el.on("click", Ext.emptyFn, this, {
            delegate: ".tabUrl",
            preventDefault: true
        });
        this.el.on("mouseleave",
        function() {
            if (this.shouldResize) {
                this.resizeTabs({
                    animate: true
                });
            }
        },
        this);
    },
    setStaticTabs: function(b) {
        this.staticTabs = b;
        this.refresh();
    },
    getStaticTabs: function(b) {
        return this.staticTabs;
    },
    addTab: function(d, c) {
        this.tabCache[d.href] = d;
        if (!this.hasTab(d.href)) {
            this.tabs.push(d.href);
            if (this.roomForNewTab()) {
                this.addTabToBar(d, c);
            }
            this.addTabToMenu(this.overflowButton.menu, d);
        }
        if (c.activate) {
            this.activateTab(d.href);
        }
        this.saveTabs();
    },
    removeTab: function(d) {
        if (!this.hasTab(d)) {
            return
        }
        this.removeFromArray(this.tabs, d);
        var e = this.removeFromArray(this.tabsInBar, d);
        var f = this.tabs[this.tabsInBar.length];
        if (f) {
            this.tabsInBar.push(f);
        }
        if (this.activeTab === d) {
            if (this.tabs.length === 0) {
                BOOM.App.getController(this.getControllerName(d)).loadIndex();
            } else {
                if (e === this.tabs.length) {
                    e -= 1;
                }
                this.activateTab(this.tabs[e]);
                this.fireEvent("tabActivate", this.tabs[e]);
            }
        }
        if (this.tabs.length >= this.maxTabsInBar()) {
            this.refresh();
        } else {
            this.removeTabFromBar(d);
        }
        this.saveTabs();
    },
    removeFromArray: function(f, d) {
        var e = Ext.Array.indexOf(f, d);
        if (e !== -1) {
            Ext.Array.erase(f, e, 1);
        }
        return e;
    },
    activateTab: function(d) {
        this.activeTab = d;
        if (!this.inTabs(d)) {
            this.swapLastTabWith(d);
        }
        Ext.Array.each(Ext.query(".doctab a.tabUrl"),
        function(a) {
            Ext.get(a).up(".doctab").removeCls(["active", "highlight"]);
        });
        var e = Ext.query('.doctab a[href="' + d + '"]')[0];
        if (e) {
            var f = Ext.get(e).up(".doctab");
            f.addCls("active");
        }
        this.highlightOverviewTab(d);
    },
    refresh: function() {
        var i = this.tpl.applyTemplate(this.staticTabs);
        var f = this.maxTabsInBar() < this.tabs.length ? this.maxTabsInBar() : this.tabs.length;
        this.tabsInBar = this.tabs.slice(0, f);
        for (var j = 0; j < f; j++) {
            var h = this.tabCache[this.tabs[j]];
            var g = Ext.apply(h, {
                visible: true,
                active: this.activeTab === h.href,
                width: this.tabWidth()
            });
            i += this.tabTpl.applyTemplate(g);
        }
        this.el.dom.innerHTML = i;
        if (this.activeTab && this.activeTab !== this.tabs[f - 1]) {
            this.activateTab(this.activeTab);
            this.fireEvent("tabActivate", this.activeTab);
        }
        this.highlightOverviewTab(this.activeTab);
        this.createOverflowButton();
        this.addToolTips();
    },
    closeAllTabs: function() {
        if (this.inTabBar(this.activeTab)) {
            this.tabs = this.tabsInBar = [this.activeTab];
        } else {
            this.tabs = this.tabsInBar = [];
        }
        this.refresh();
        this.saveTabs();
    },
    tabData: function() {
        return Ext.Array.map(this.tabs,
        function(b) {
            return this.tabCache[b];
        },
        this);
    },
    roomForNewTab: function() {
        return this.tabsInBar.length < this.maxTabsInBar();
    },
    hasTab: function(b) {
        return Ext.Array.contains(this.tabs, b);
    },
    addTabToBar: function(e, d) {
        this.tabsInBar.push(e.href);
        var f = Ext.get(this.tabTpl.append(this.el.dom, e));
        if (d.animate && !Ext.isIE) {
            f.setStyle("width", "10px");
            f.setStyle({
                visibility: "visible"
            });
            f.animate({
                to: {
                    width: this.tabWidth()
                }
            });
        } else {
            f.setStyle({
                visibility: "visible"
            });
        }
        this.resizeTabs(d);
    },
    inTabBar: function(b) {
        return Ext.Array.contains(this.tabsInBar, b);
    },
    inTabs: function(d) {
        var c = Ext.Array.pluck(this.staticTabs, "href").concat(this.tabsInBar);
        return Ext.Array.contains(c, d);
    },
    removeTabFromBar: function(d) {
        var c = this.getTabEl(d);
        c.dom.removed = true;
        if (Ext.isIE) {
            c.remove();
            this.createOverflowButton();
        } else {
            c.animate({
                to: {
                    top: 30
                },
                duration: this.animDuration
            }).animate({
                to: {
                    width: 10
                },
                duration: this.animDuration,
                listeners: {
                    afteranimate: function() {
                        c.remove();
                        this.shouldResize = true;
                        this.createOverflowButton();
                    },
                    scope: this
                }
            });
        }
    },
    swapLastTabWith: function(d) {
        var e = this.getTabEl(this.tabsInBar[this.tabsInBar.length - 1]);
        if (e) {
            var f = this.tabTpl.append(document.body, this.tabCache[d]);
            e.dom.parentNode.replaceChild(f, e.dom);
            this.tabsInBar[this.tabsInBar.length - 1] = d;
            Ext.get(f).setStyle({
                visibility: "visible",
                width: String(this.tabWidth()) + "px"
            });
        }
    },
    highlightOverviewTab: function(d) {
        var c = Ext.query(".doctab." + this.getControllerName(d).toLowerCase());
        if (c && c[0]) {
            Ext.get(c[0]).addCls("highlight");
        }
    },
    maxTabsInBar: function() {
        return Math.floor(this.tabBarWidth() / this.minTabWidth);
    },
    tabWidth: function() {
        var b = Math.floor(this.tabBarWidth() / this.tabsInBar.length) + 6;
        if (b > this.maxTabWidth) {
            return this.maxTabWidth;
        } else {
            if (b < this.minTabWidth) {
                return this.minTabWidth;
            } else {
                return b;
            }
        }
    },
    tabBarWidth: function() {
        return this.getWidth() - (this.staticTabs.length * 50) - 15;
    },
    resizeTabs: function(b) {
        this.shouldResize = false;
        Ext.Array.each(Ext.query(".doctab"),
        function(a) {
            var d = Ext.get(a);
            if (!d.dom.removed && !d.hasCls("overview")) {
                if (b && b.animate && !Ext.isIE) {
                    d.animate({
                        to: {
                            width: this.tabWidth()
                        }
                    });
                } else {
                    d.setWidth(this.tabWidth());
                }
            }
        },
        this);
    },
    getTabEl: function(c) {
        var d = Ext.query('.doctab a[href="' + c + '"]');
        if (d && d[0]) {
            return Ext.get(d[0]).up(".doctab");
        }
    },
    createOverflowButton: function() {
        if (this.overflowButton) {
            this.overflowButton.destroy();
        }
        this.overflowButton = Ext.create("Ext.button.Button", {
            baseCls: "",
            renderTo: this.getEl().down(".tab-overflow"),
            menu: this.createMenu()
        });
    },
    createMenu: function() {
        var b = new BOOM.view.TabMenu({
            listeners: {
                closeAllTabs: this.closeAllTabs,
                tabItemClick: function(a) {
                    this.fireEvent("tabActivate", a.href, {
                        navigate: true
                    });
                },
                scope: this
            }
        });
        Ext.Array.each(this.tabs,
        function(a) {
            this.addTabToMenu(b, this.tabCache[a]);
        },
        this);
        return b;
    },
    addTabToMenu: function(g, h) {
        var f = Ext.Array.indexOf(this.tabs, h.href);
        if (this.tabs.length > this.tabsInBar.length && f === this.maxTabsInBar()) {
            g.addTabCls(h, "overflow");
        }
        var e = this.inTabBar(h.href);
        g.addTab(h, e ? "": "overflow");
    },
    addToolTips: function() {
        Ext.Array.each(this.staticTabs,
        function(c) {
            var d = Ext.get(Ext.query(".doctab." + c.cls)[0]);
            if (d) {
                Ext.create("Ext.tip.ToolTip", {
                    target: d,
                    html: c.tooltip
                });
            }
        });
    },
    saveTabs: function() {
        BOOM.Settings.set("tabs", this.tabs);
    },
    getControllerName: function(b) {
        if (/#!?\/api/.test(b)) {
            return "Classes";
        } else {
            if (/#!?\/guide/.test(b)) {
                return "Guides";
            } else {
                if (/#!?\/video/.test(b)) {
                    return "Videos";
                } else {
                    if (/#!?\/example/.test(b)) {
                        return "Examples";
                    } else {
                        if (/#!?\/tests/.test(b)) {
                            return "Tests";
                        } else {
                            if (/#!?\/comment/.test(b)) {
                                return "Comments";
                            } else {
                                return "Index";
                            }
                        }
                    }
                }
            }
        }
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
            height: 50,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [{
                height: 25,
                xtype: "container",
                layout: "hbox",
                items: [{
                			xtype:'button',
                			margin:'2 2 2 5',
                			text:'新建',
                			heigth:24,
                			width:35,
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
       	                    	  	    	    	}else{
       	                    	  	    	    		var record= Ext.getCmp("guidetree");
       	                    	  	    	    		var r= record.getSelectionModel();
       	                    	  	    	    		var select=r.getSelection( );
       	                    	  	    	    		var c = record.getStore();
       	                    	  	    	    	select[0].appendChild({
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
                		},
                        {
                        	xtype:'toolbarView',
                        	id:'titleToolbar',
                        	callback : {
                    			// 点击保存
                    			save : function(toolbar,btn){
                    				var tabs= Ext.getCmp("BOOMtabs");
                    				var url = tabs.activeTab;
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
                    				var tabs= Ext.getCmp("BOOMtabs");
                    				var url = tabs.activeTab;
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
                    				var tabs= Ext.getCmp("BOOMtabs");
                    				var url = tabs.activeTab;
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
	                    		        if(SJSTstoreData.getModifiedRecords().length>0){
	                    		        	var head ={tbluuid:tbluuid};
	                    		        	saveSJ(head,SJSTstoreData,BLSTstore);
	                    		        }
                    			        plug.startEdit(position, 2);
                    		       }
                    			},
                    			remove : function(){
                    				Ext.MessageBox.confirm('确认', '你确定要删除?', function(e){
                    					   if(e=='yes'){
                    						   var delBLJson=[];
                    							var delSJJson=[];
			                    				var tabs= Ext.getCmp("BOOMtabs");
			                    				var url = tabs.activeTab;
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
			                    				    	messageBox.setValue(messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、'+text);
			                    				    	grid.getStore().reload();
			                    				    	Ext.example.msg('提示', '{0}', text);
			                    				    	
			                    				    },
			                    				    failure : function(response) {
			                    				    	var messageBox = Ext.getCmp('message');
			                    				    	messageBox.setValue(messageBox.getValue()+"\n"+(MESSAGE_NUMBER++)+'、删除失败');
			                    				    	Ext.example.msg('提示', '{0}', '删除失败');
			                    		}
			                    	});
                    					   }
                					   });
                    			},
                    			import : function(toolbar,btn){
                    				console.log(toolbar,btn);
                    				var s= btn;
                    				alert('import');
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
            },
            {
                xtype: "BOOMtabs"
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
                bodyPadding: "10 9 4 9",
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
            }, /*{
                // lazily created panel (xtype:'panel' is default)
                region: 'south',
               
                split: true,
                height: 50,
                minSize: 100,
                maxSize: 200,
                collapsible: true,
                collapsed: true,
                margins: '0 0 0 0'
            },*/{
            	xtype     : 'textareafield',
            	id		  : 'message',
                region: 'south',
                split: true,
                height: 50,
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
            controllers: ["Guides", "Tabs"],
            launch: this.launch
        });
    },
    launch: function() {
    	BOOM.App = this;
    	BOOM.Settings.init();
        Ext.create("BOOM.view.Viewport");
        BOOM.History.init();
        if (BOOM.initEventTracking) {
        	BOOM.initEventTracking();
        }
    }
});


Ext.onReady(function() {
    Ext.create("BOOM.Application");
    
});