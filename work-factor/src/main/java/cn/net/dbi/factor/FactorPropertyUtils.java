package cn.net.dbi.factor;

import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.util.JSONDynaBean;

import org.apache.commons.collections.Predicate;
import org.apache.commons.lang.StringUtils;

import cn.net.dbi.boom.utils.BoomCollectionsUtils;

public class FactorPropertyUtils {
	
	public final static String DEFINE_POSITIONTYPE = "6cee8771767a4525926a0d0c22afc705";
	public final static String DEFINE_SIZE = "f726b3b3529a4ba3b0cc4de1e455d762";
	
	
	public final static String DEFAULT_SIZE = "30";
	
	public static String getLevelType(Map<String, Object> factor){
		return getPropertyValue(factor, DEFINE_POSITIONTYPE);
	}
	
	public static String getSize(Map<String, Object> factor){
		String size = getPropertyValue(factor, DEFINE_SIZE);
		return StringUtils.isBlank(size)?DEFAULT_SIZE:size; 
	}
	
	public static String getPropertyValue(Map<String, Object> factor, final String defineUuid){
		JSONDynaBean property = (JSONDynaBean)BoomCollectionsUtils.find((JSONArray)factor.get("childs"), new Predicate() {
			public boolean evaluate(Object object) {
				return defineUuid.equalsIgnoreCase((String)((JSONDynaBean)object).get("defineUuid"));
			}
		});
		
		if(null == property){
			return null;
		}
		
		return String.valueOf(property.get("value"));
	}
}
