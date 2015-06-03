//显示参数组名
Ext.define('ValueLabel.store.ParamDefineStore', {
    extend: 'Ext.data.Store',
    alias : 'widget.paramDefineStore',
    
    model : 'ValueLabel.model.ValueLabelModel',
    
	autoLoad: false,

    proxy: {
        type: 'ajax',
        url : '../../../work-platform/queryParamsByDefineName.do',
        reader: {
            type: 'json'
        }
    }
});
