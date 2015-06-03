Ext.define('Layout.view.panel.ChartPanel',{
	extend: 'Ext.panel.Panel',
    alias : 'widget.chartPanel',
    
    border : true,
    
    layout: 'fit',
    
    initComponent : function(){
    	var me = this;
    	
    	me.tbar=[{
            text: '导出',
            handler: function() {
            	if(0==document.getElementById('chartPanel-body').childNodes.length){
            		return;
            	}
            	
            	html2canvas(document.getElementById('chartPanel-body').childNodes[0],{
            		onrendered: function(canvas) {
						canvg(canvas, document.getElementById('chartPanel-body').childNodes[0].innerHTML);
						
						var imgData=canvas.toDataURL('png');
						imgData = imgData.replace('image/png','image/octet-stream');
						var filename = 'picture' + (new Date()).getTime() + '.png';
						
						var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
						    save_link.href = imgData;
						    save_link.download = filename;
						   
						    var event = document.createEvent('MouseEvents');
						event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
						save_link.dispatchEvent(event);
            		}
            	});
            }
    	}];
    	
    	
    	me.callParent(arguments);
    }
});