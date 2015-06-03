Ext.define('Layout.controller.BaseRelationController', {
    extend: 'Ext.app.Controller',
    stores: [
             "CommonRelationStore"
    ],
    models: [
             "RelationModel"   
    ],

    init: function() {
    	this.control({
        	'#baseRelationGrid' : {
        		'viewready' : this.afterRender
            }
        });
    },
    
    afterRender : function(grid){
    	grid.initDrag(true);
    },
    
    dragRelationFromBase : function(target,e){
		var trDom = this.getEl(),
			uuid = trDom.getAttribute('data-recordid'),
			row = trDom.getAttribute('data-recordindex'),
			me = Layout.DrawController,
			x = e.xy[0]-me.getWestArea().width,
			y = e.xy[1]-me.getNorthArea().height-HEIGHT_CENTERTAB,
			dataStore = this.grid.getStore(),
			record = Ext.clone(dataStore.getAt(row)),
			ES = Layout.EventSchedule,
			isFactor1Exist,
			isFactor2Exist;
		
		
		// 判断该因子是否已加入pool
		if(ES.relationStore.contain(uuid)){
			console.log('relation has been in pool already!');
			return;
		}
		
		// 判断两个因子是否都已经存在
		isFactor1Exist = ES.factorStore.contain(record.get('factor1Uuid'));
		isFactor2Exist = ES.factorStore.contain(record.get('factor2Uuid'));
		
		if(!isFactor1Exist){
			Layout.DataServer.readFactor(record.get('factor1Uuid'), function(response){
				var factor = Ext.decode(response.responseText)[0],
					record = new Layout.model.CommonFactorModel();
				
				Ext.apply(record.data, factor);
				if(isFactor2Exist){
					record.setX(x);
					record.setY(y);
				}else{
					record.setX(x<100?0:x-100);
					record.setY(y);
				}
				
				ES.fireEvent(ES.factorStore, 'addFactor', [record],
						function(factors){
							ES.factorStore.add(factors);
						});
			}, true, true);
		}
		
		if(!isFactor2Exist){
			Layout.DataServer.readFactor(record.get('factor2Uuid'), function(response){
				var factor = Ext.decode(response.responseText)[0],
					record = new Layout.model.CommonFactorModel();  
				
				Ext.apply(record.data, factor);
				if(isFactor1Exist){
					record.setX(x);
					record.setY(y);
				}else{
					record.setX(x+100);
					record.setY(y);
				}
				
				ES.fireEvent(ES.factorStore, 'addFactor', [record],
						function(factors){
							ES.factorStore.add(factors);
						});
			}, true, true);
		}
		
		// add relation
		Layout.DataServer.readRelation(uuid, function(response){
			var relation = Ext.decode(response.responseText)[0],
				record = new Layout.model.RelationModel();  
			
			Ext.apply(record.data, relation);
			
			ES.fireEvent(ES.relationStore, 'addRelation', [record],
					function(relations){
						ES.relationStore.add(relations);
					});
//			ES.relationStore.add(record);
		}, true);
	}
    
});