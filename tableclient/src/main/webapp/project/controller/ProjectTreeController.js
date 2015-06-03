Ext.define('Project.controller.ProjectTreeController', {
    extend: 'Ext.app.Controller',
    stores: [
             "ProjectTreeStore"
    ],
    refs : [{  
        selector: '#projectTree',  
        ref: 'projectTree'  
    }],
    
    init: function() {
    	this.control({
        	'#projectTree' : {
        		'itemclick':function(tree, record, column, cell){
        			var projectUuid = record.get('uuid');
        			if('layoutArea'===Ext.getCmp('cenPanel').getActiveTab().id){
        				return;
        			}
        			if(window.frames[0].Factor==undefined){
    					window.frames[1].project = projectUuid;
    					window.frames[1].Factor.App.getPanelRelationControllerController().getRelationGrid().getStore().load();
    					window.frames[1].factor1Store.load();
    					window.frames[1].factor2Store.load();
    				}else{
        				window.frames[0].project = projectUuid;
        				window.frames[0].Factor.App.getPanelRelationControllerController().getRelationGrid().getStore().load();
        				window.frames[0].factor1Store.load();
    					window.frames[0].factor2Store.load();
    				}
        		},
        		'cellclick': function(tree, dom, column, cell) {
        			var projectUuid = cell.get('uuid'),
        				panel = Ext.getCmp('projectTree');
        			
        			if(0 != column){
        				return;
        			}
        			if(projectUuid === panel.selectProject){
        				return;
        			}
        			
        			panel.selectProject = projectUuid;
        			Project.Cookie.set('project', projectUuid);
//        			Ext.getCmp("layoutArea").body.update(
//                        	'<iframe width="100%" height="100%" frameborder=0 src='+Project.Cookie.get('IframeSrc')+'?project='
//            								+projectUuid+'></iframe>'
//                        		);
        			document.title = cell.get('value');
        			if('factor.html'===Project.Cookie.get('IframeSrc')){
        				if(window.frames[0].Factor==undefined){
        					window.frames[1].project = projectUuid;
        					window.frames[1].Factor.App.getTreeFactorTreeControllerController().getFactorTree().getStore().load();
        					window.frames[1].Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().load();
        					window.frames[1].Factor.App.getPanelRelationControllerController().getRelationGrid().getStore().load();
        					var factorGrid=window.frames[1].Factor.App.getPanelFactorControllerController().getFactorGrid();
        					var sm=factorGrid.getSelectionModel( );
        					sm.select(0);
        					window.frames[1].Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(0).set('value',"");
        					
        				}else{
	        				window.frames[0].project = projectUuid;
	        				window.frames[0].Factor.App.getTreeFactorTreeControllerController().getFactorTree().getStore().load();
	        				window.frames[0].Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().load();
	        				window.frames[0].Factor.App.getPanelRelationControllerController().getRelationGrid().getStore().load();
	        				var factorGrid=window.frames[0].Factor.App.getPanelFactorControllerController().getFactorGrid();
        					var sm=factorGrid.getSelectionModel( );
        					sm.select(0);
	        				window.frames[0].Factor.App.getPanelFactorPropertyGridControllerController().getFactorProperty().getStore().getAt(0).set('value',"")
        				}
        			}else{
        				Ext.getCmp("layoutArea").body.update(
                        	'<iframe id=mainFrame width="100%" height="100%" frameborder=0 src='+Project.Cookie.get('IframeSrc')+'?project='
            								+projectUuid+'></iframe>'
                        		);
        			}
        		},
        		'cellcontextmenu' : function(panel, td, cellIndex, record, tr, rowIndex, e){
        			e.preventDefault();
        			console.log(arguments);

        			new Ext.menu.Menu({  
        		        minWidth:100,  
        		        items:[{  
        		            text:"新建",  
        		            handler:Project.App.getController('ProjectTreeController').createProject
        		        },{  
        		            text:"复制",  
        		            handler:function(){
        		            	panel.copyProject = record;
        		            }  
        		        },{  
        		            text:"删除",  
        		            handler:Project.App.getController('ProjectTreeController').deleteProject
        		        }]  
        		    }).showAt(e.getXY());
        		},
        		'containercontextmenu' : function(panel, e){
        			var me = this;
        			
        			e.preventDefault();

        			new Ext.menu.Menu({  
        		        minWidth:100,  
        		        items:[{  
        		            text:"新建",  
        		            handler:Project.App.getController('ProjectTreeController').createProject
        		        },{  
        		            text:"粘贴",  
        		            handler:function(){
        		            	if(!panel.copyProject){
        		            		return;
        		            	}
        		            	
        		            	Ext.Ajax.request({
        				    		url: '../work-platform/copyProject.do',    
        				    	    params: { 
        				    	    	projectUuid : panel.copyProject.get('uuid'),
        				    	    	projectName : panel.copyProject.get('value')
        				    	    },    
        				    	    success: function(response){ 
        				    	    	Ext.getCmp('projectTree').store.load();
        				    	    }
        				    	});
        		            	
        		            }  
        		        }]  
        		    }).showAt(e.getXY());
        		},
        		'containerdblclick':this.createProject,
        		'itemmouseenter': this.showActions,
                'itemmouseleave':this.hideActions
            }
        });
    },
    btnShowTableArea:function(){
    	Ext.getCmp('cenPanel').setActiveTab(1);
    },
    btnShowLayoutArea:function(){
    	Ext.getCmp('cenPanel').setActiveTab(0);
    },
    showTableArea:function(){
    	var selectCells = window.frames[0].Layout &&
				    	window.frames[0].Layout.DrawController.getSelectCell(),
    		selectCellUuid;
    	
    	if(Ext.isArray(selectCells) && selectCells.length >0){
    		selectCellUuid = selectCells[0].id;
    	}
    	console.log('select cell : '+selectCellUuid);
    	/*if('factor.html'===Project.Cookie.get('IframeSrc')){
    		window.frames[0].Ext.getCmp('factorGrid').getStore().reload();
    		window.frames[0].Ext.getCmp('relationGrid').getStore().reload()
    	}else{
	    	Project.Cookie.set('IframeSrc', 'factor.html');
	    	Ext.getCmp("layoutArea").body.update(
	            	'<iframe id=mainFrame width="100%" height="100%" frameborder=0 src='+Project.Cookie.get('IframeSrc')+'?project='
									+Ext.getCmp('projectTree').selectProject+'&defaultSelectUuid='+selectCellUuid+'></iframe>'
	            		);
    	}*/
    	Project.Cookie.set('IframeSrc', 'factor.html');
    	if(window.frames[0].Factor==undefined){
    		if(Ext.getCmp('projectTree').selectProject!==undefined)
    		Ext.getCmp("dataArea").body.update(
            	'<iframe width="100%" height="100%" frameborder=0 src='+Project.Cookie.get('IframeSrc')+'?project='
								+Ext.getCmp('projectTree').selectProject+'&defaultSelectUuid='+selectCellUuid+'></iframe>'
            		);
    		
    	}else{
			window.frames[0].Factor.App.getPanelFactorControllerController().getFactorGrid().getStore().load();
			window.frames[0].Factor.App.getPanelRelationControllerController().getRelationGrid().getStore().load();
    	}
    	
    	
    },
    showLayoutArea:function(){
    	Project.Cookie.set('IframeSrc', 'office.html');
    	Ext.getCmp("layoutArea").body.update(
            	'<iframe id=mainFrame width="100%" height="100%" frameborder=0 src='+Project.Cookie.get('IframeSrc')+'?project='
								+Ext.getCmp('projectTree').selectProject+'&autoLayout=true&defaultSelectUuid='+window.frames[0].CurrentRecordInstUuid+'></iframe>'
            		);
    },
    showActions: function(view, list, node, rowIndex, e) {//节点获得焦点显示删除图标
    	var text=list.get('value');
    	
    	e.preventDefault();
    	var tips=Ext.getCmp('tips');
    	if(tips){
    		tips.destroy( );
    	}
    	new Ext.menu.Menu({  
            floating : true,
            id:'tips',
            items : [{
           	 text : text,
           	 id:'tips-text'
            }]}).showAt([170,e.browserEvent.clientY-25]);
        var icons = Ext.DomQuery.select('.x-action-col-icon', node);
        if(view.getRecord(node).get('uuid') !='') {
            Ext.each(icons, function(icon){
                Ext.get(icon).removeCls('x-hidden');
            });
        }
        
        this.selectRow = rowIndex;
    },
    
    hideActions: function(view, list, node, rowIndex, e) {//鼠标移出节点隐藏删除图标
        var icons = Ext.DomQuery.select('.x-action-col-icon', node);
        Ext.each(icons, function(icon){
            Ext.get(icon).addCls('x-hidden');
        });
        
        var tips=Ext.getCmp('tips');
    	if(tips){
    		tips.destroy( );
    	}
    },
    createProject:function(){
    	var me = this;
		projectName = SEQ.seq('新建项目', function(newName){
			
			return Ext.getCmp('projectTree').store.tree.root.findChildBy(function(node){
				if(newName == node.get('value')){
					return true;
				}
			});
			
		});
		
		Ext.Ajax.request({
			url: '../work-platform/saveProject.do',    
		    params: { 
		    	projectName : projectName
		    },    
		    success: function(response){ 
		    	Ext.getCmp('projectTree').store.load();
		    	Ext.getCmp('projectTree').store.fireEvent('expand');
		    }
		});
    },
    deleteProject : function(){
    	var me = Project.App.getController('ProjectTreeController'),
    		tree = Ext.getCmp('projectTree'),
    	    projectUuid = tree.getRootNode()
    							.childNodes[me.selectRow].get('uuid'),
    		projectName = tree.getRootNode()
								.childNodes[me.selectRow].get('text');
    	Ext.MessageBox.confirm('确认', '确定要删除<'+projectName+'>?', function(btn){
			if('yes'===btn){
		    	Ext.Ajax.request({
		    		url: '../work-platform/deleteProject.do',    
		    	    params: { 
		    	    	projectUuid : projectUuid
		    	    },    
		    	    success: function(response){ 
		    	    	tree.store.load();
		    	    	if(projectUuid === tree.selectProject){
		    	    		document.title = '';
		    	    		Ext.getCmp("layoutArea").body.update(
		        	    			'<iframe id=mainFrame width="100%" height="100%" frameborder=0 src=""></iframe>'
		    						);
		    	    	}
		    	    	
		    	    }
		    	});
			}
    	});
    }
    
});