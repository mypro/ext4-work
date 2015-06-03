Ext.define('Layout.controller.BaseFactorController', {
    extend: 'Ext.app.Controller',
    stores: [
             "CommonFactorStore"
    ],
    models: [
             "CommonFactorModel"   
    ],
    
    init: function() {
    	this.control({
        	'#baseFactorGrid' : {
        		'viewready' : this.afterRender
            }
        });
    },
    
    afterRender : function(grid){
    	grid.initDrag();
    },
    
    dragFactorFromBase : function(target,e){
		var trDom = this.getEl().parentNode,
			uuid = trDom.getAttribute('data-recordid'),
			row = trDom.getAttribute('data-recordindex'),
			me = Layout.DrawController,
			x = e.xy[0]-me.getWestArea().width,
			y = e.xy[1]-me.getNorthArea().height-HEIGHT_CENTERTAB,
			dataStore = this.grid.getStore(),
			record = Ext.clone(dataStore.getAt(row)),
			ES = Layout.EventSchedule;
		
		
		// 判断该因子是否已加入pool
		if(ES.factorStore.contain(uuid)){
			console.log('factor has been in pool already!');
			return;
		}
		
		// 判断是否存在同名因子
		if(ES.factorStore.findRecordByKey('name', record.get('name'))){
			console.log('factor name duplicate!');
			return;
		}
		
		Layout.DataServer.readFactor(uuid, function(response){
			var factor = Ext.decode(response.responseText)[0],
				record = new Layout.model.CommonFactorModel();
			
			Ext.apply(record.data, factor);
			record.setX(x);
			record.setY(y);
			
			ES.fireEvent(ES.factorStore, 'addFactor', [record],
					function(factors){
						ES.factorStore.add(factors);
					});
		}, true);
	}
    
});