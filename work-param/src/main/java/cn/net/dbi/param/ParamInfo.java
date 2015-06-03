package cn.net.dbi.param;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import cn.net.dbi.boom.utils.BoomBeanUtils;
import cn.net.dbi.param.bean.ParamDefine;
import cn.net.dbi.param.bean.ParamValue;
import cn.net.dbi.param.load.DBParamInfoLoader;

public class ParamInfo {
	
	private Map<String, ParamDefine> paramDefines = new LinkedHashMap<String, ParamDefine>();
	private Map<String, Map<String, ParamValue>> paramValues = new LinkedHashMap<String, Map<String,ParamValue>>();
	
	private DBParamInfoLoader loader;
	
	public void init(){
		paramDefines.clear();
		paramValues.clear();
		buildParamDefines(loader.loadParamDefines());
		buildParamValues(loader.loadParamValues());
	}
	
	public void reload(String defineUuid){
		paramDefines.remove(defineUuid);
		paramValues.remove(defineUuid);
		buildParamDefines(loader.loadParamDefines(defineUuid));
		buildParamValues(loader.loadParamValues(defineUuid));
	}
	
	public Map<String, ParamDefine> getDefines(){
		return (Map<String, ParamDefine>)BoomBeanUtils
					.cloneMap(this.paramDefines, ParamDefine.class);
	}
	
	public Map<String, ParamDefine> getDefinesByType(int type){
		Map<String, ParamDefine> defines = new LinkedHashMap<String, ParamDefine>();
		for(Iterator<String> keyIt=this.paramDefines.keySet().iterator();keyIt.hasNext();){
			String key = keyIt.next();
			ParamDefine pd = this.paramDefines.get(key);
			if(type == pd.getType()){
				defines.put(key, pd);
			}
		}
		return defines;
	}
	
	public Map<String, ParamValue> getValues(String defineUuid){
		return (Map<String, ParamValue>)BoomBeanUtils
				.cloneMap(this.paramValues.get(defineUuid), ParamValue.class);
	}
	
	public ParamValue getValue(String defineUuid, String valueUuid){
		ParamValue newValue = new ParamValue();
		if(null == this.paramValues.get(defineUuid)){
			return newValue;
		}
		BoomBeanUtils.copyProperties(newValue, 
				this.paramValues.get(defineUuid).get(valueUuid));
		return newValue;
	}
	
	
	//---------------------------------private method follow----------------------
	private void buildParamDefines(List<ParamDefine> defines){
		for(Iterator<ParamDefine> it=defines.iterator();it.hasNext();){
			ParamDefine define = it.next();
			paramDefines.put(define.getUuid(), define);
		}
	}
	
	private void buildParamValues(List<ParamValue> values){
		for(Iterator<ParamValue> it=values.iterator();it.hasNext();){
			ParamValue value = it.next();
			Map<String, ParamValue> valueMap = paramValues.get(value.getDefineUuid());
			if(null == valueMap){
				valueMap = new LinkedHashMap<String, ParamValue>();
				paramValues.put(value.getDefineUuid(), valueMap);
			}
			valueMap.put(value.getUuid(), value);
		}
	}

	public void setLoader(DBParamInfoLoader loader) {
		this.loader = loader;
	}
	
}
