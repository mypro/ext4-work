package cn.net.dbi.param;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import cn.net.dbi.boom.utils.BoomBeanUtils;
import cn.net.dbi.param.bean.ParamDefine;
import cn.net.dbi.param.bean.ParamValue;
import cn.net.dbi.param.bean.Type;
import cn.net.dbi.param.load.DBParamInfoLoader;
import cn.net.dbi.param.load.DBTypeInfoLoader;

public class TypeInfo {
	
	private Map<String, Type> types = new LinkedHashMap<String, Type>();
	
	private DBTypeInfoLoader loader;
	
	public void init(){
		types.clear();
		buildTypes(loader.loadTypes());
	}
	
	public void reload(){
		types.clear();
		buildTypes(loader.loadTypes());
	}
	
	public Map<String, Type> getTypes(){
		return (Map<String, Type>)BoomBeanUtils
					.cloneMap(this.types, Type.class);
	}
	
	
	//---------------------------------private method follow----------------------
	private void buildTypes(List<Type> ts){
		for(Iterator<Type> it=ts.iterator();it.hasNext();){
			Type type = it.next();
			types.put(type.getUuid(), type);
		}
	}
	

	public void setLoader(DBTypeInfoLoader loader) {
		this.loader = loader;
	}
	
}
