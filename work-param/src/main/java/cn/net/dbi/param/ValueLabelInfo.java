package cn.net.dbi.param;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import cn.net.dbi.boom.utils.BoomBeanUtils;
import cn.net.dbi.param.bean.Type;
import cn.net.dbi.param.bean.ValueLabel;
import cn.net.dbi.param.load.DBTypeInfoLoader;
import cn.net.dbi.param.load.DBValueLabelInfoLoader;

public class ValueLabelInfo {
	
	private Map<String, ValueLabel> valueLabels = new LinkedHashMap<String, ValueLabel>();
	
	private DBValueLabelInfoLoader loader;
	
	public void init(){
		valueLabels.clear();
		buildValueLabels(loader.loadValueLabels());
	}
	
	public void reload(){
		valueLabels.clear();
		buildValueLabels(loader.loadValueLabels());
	}
	
	public Map<String, ValueLabel> getValueLabels(){
		return (Map<String, ValueLabel>)BoomBeanUtils
					.cloneMap(this.valueLabels, ValueLabel.class);
	}
	
	public Map<String, ValueLabel> getValueLabelsByColumnUuid(String columnUuid){
		 Map<String, ValueLabel> vls = new LinkedHashMap<String, ValueLabel>();
		 
		 List<ValueLabel> vs=loader.loadValueLabels();
		 if(vs.size()>0){
			 for(Iterator<ValueLabel> it=vs.iterator();it.hasNext();){
					ValueLabel valueLabel = it.next();
					if(columnUuid.equals(valueLabel.getColumnUuid())){
						vls.put(valueLabel.getUuid(), valueLabel);
					}
				}
		 }
		return vls;
	}
	
	//---------------------------------private method follow----------------------
	private void buildValueLabels(List<ValueLabel> vs){
		for(Iterator<ValueLabel> it=vs.iterator();it.hasNext();){
			ValueLabel valueLabel = it.next();
			valueLabels.put(valueLabel.getUuid(), valueLabel);
		}
	}
	

	public void setLoader(DBValueLabelInfoLoader loader) {
		this.loader = loader;
	}
	
}
