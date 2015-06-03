Ext.define('Layout.controller.DrawTabController', {
    extend: 'Ext.app.Controller',
    
    init : function(){
    	this.control({
        	'#centerArea' : {
        		'afterrender' : this.initDrawPanel,
        		'add' : this.afterAddPanel,
        		'tabchange' : this.switchPanel
            }
        });
    },
    
    initDrawPanel : function(){
    	// init all layouttab
    	this.initPanel();
    	
    	// layout queue TODO ...
    	this.layoutHistory = new Qu.Queue(100);
    	
    	// doubleclick tbar
    	this.dblclickTop();
    },
    
    initPanel : function(){
    	var center = Ext.getCmp('centerArea');
    	
    	Layout.DataServer.readLayoutDefine(function(response){
    		var defines = Ext.decode(response.responseText);
    		Ext.Array.each(defines, function(define, i){
    			center.add({
    				xtype : 'drawPanel',
    				paperUuid : define.uuid,
    				title : define.name,
    				type : define.type,
    				center : {x:0,y:0},
    				id : 'drawPanel-'+define.uuid,
    				closable : isNaN(parseInt(define.type))
    			});
    			
    		});
    		if(defines.length > 0){
    			center.setActiveTab(0);
    		}
    	}, false, true);
    },
    
    switchPanel : function(tab, newPanel, oldPanel){
    },
    
    afterAddPanel : function(tab, panel, i){
    	var me = this;
    	
		Schedule.createTask(
			function(){
				return $('#paperTabBar').find('a').length>0;
			}, 
			(function(index){
				// closure
				return function(){
					new Ext.dd.DragSource($('#paperTabBar').find('a')[index].id,{
		    			group:'tabDDTarget',
		    			index : index
		    		}).afterDragDrop = Ext.bind(me.createNewTab, me, [Ext.getCmp('centerArea').items.items[index]]);
				};
			})(i),
		1000);
    	
    },
    
    createNewTab : function(panel){
    	var center = Ext.getCmp('centerArea'),
    		ES = Layout.EventSchedule,
    		layouts = Layout.Layout.getFactorLayout(ES.factorStore.data.items, panel.paperUuid);
    		newName = SEQ.seq(panel.title, function(newName){
    			var i = Ext.Array.each(Ext.getCmp('centerArea').items.items, function(panel){
    				if(panel.title == newName){
    					return false;
    				}
    			});
    			return Ext.isNumber(i);
    		});
    	
    	Layout.DataServer.addLayoutDefine({
    		name : newName,
    		type : null
    	}, function(response){
    		
    		var layoutDefine = Ext.decode(response.responseText);
    		// save layout
    		Ext.Array.each(layouts, function(layout){
    			layout.defineUuid = layoutDefine.uuid;
    		});
    		ES.fireEvent(ES.factorStore, 'addLayout', layouts);
    		
    		center.add({
    			xtype : 'drawPanel',
    			paperUuid : layoutDefine.uuid,
    			title : layoutDefine.name,
    			type : layoutDefine.type,
    			id : 'drawPanel-'+layoutDefine.uuid,
    			closable : true
    		});
    	});
    },
    
    dblclickTop : function(){
    	$('#paperTabBar').bind('dblclick', function(e){
    		if(e.target.tagName.toUpperCase() === 'SPAN'){
    			var $el = $(e.target),
    				left = $el.offset().left,
    				top = $el.offset().top,
    				width = $el.width();
    			
    			while($el.length>0 && 'A' != $el[0].tagName.toUpperCase()){
    				$el = $el.parent();
    			}
    			if(0 == $el.length){
    				return;
    			}
    			
    			var index = $el.index();
    			
    			var panel = Ext.getCmp('centerArea').items.items[index];
    			
    			if(!isNaN(parseInt(panel.type))){
    				return;
    			}
    			
    			var style = [];
    			
    			style.push('position:absolute');
    			style.push('z-index:99999');
    			style.push('width:'+$el.width()+'px');
    			style.push('top:'+(top+'px'));
    			style.push('left:'+(left+'px'));
    			
    			$("<input>",{
    				id : 'layoutName',  
    				type : 'text',
    				val : panel.title,
    				style : style.join(';')
    			}).bind("blur", function(evt){
    				Layout.DataServer.addLayoutDefine({
    					uuid : panel.paperUuid,
    					name : evt.target.value
    				},function(){
    					panel.setTitle(evt.target.value);
        				$(evt.target).remove();
    				});
    			}).bind('keypress',function(evt){
    	            if(13 === evt.keyCode)    
    	            {
    	            	$(evt.target).blur();
    	            }
    	        }).appendTo('body').select();
    			
    		}else{
	    		if(!Ext.getCmp('westArea').collapsed
	    				|| !Ext.getCmp('chartPanel').collapsed){
	    			Ext.getCmp('westArea').collapse();
	        		Ext.getCmp('chartPanel').collapse();
	    		}else{
	    			Ext.getCmp('westArea').expand();
	        		Ext.getCmp('chartPanel').expand();
	    		}
    		}
    	});
    },
    
    getPanel : function(paper){
    	var panels = Ext.getCmp('centerArea').items.items;
    	
    	var i = Ext.Array.each(panels, function(panel){
    		if(paper.uuid === panel.paperUuid){
    			return false;
    		}
    	});
    	if(Ext.isNumber(i)){
    		return panels[i];
    	}
    	return null;
    }
    
    
});