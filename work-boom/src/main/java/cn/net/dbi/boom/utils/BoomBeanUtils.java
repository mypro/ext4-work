package cn.net.dbi.boom.utils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.DynaClass;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.StringUtils;

/**
 * 提供bean对象相关的操作
 * 
 * @author hanheliang
 *
 */
public class BoomBeanUtils {
	
	/**
	 * 执行某个对象的某个方法
	 * 
	 * @param instance
	 * @param methodName
	 * @param paramCls
	 * @param params
	 */
	public static void runMethod(Object instance, String methodName,
								Class[] paramCls, Object[] params){
		if(StringUtils.isNotBlank(methodName)
				&& null != instance){
        	try {
        		Method init =  instance.getClass().getMethod(methodName, paramCls);
        		if(null != init){
        			init.invoke(instance, params);
        		}
			}catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			} catch (NoSuchMethodException e) {
				e.printStackTrace();
			} catch (SecurityException e) {
				e.printStackTrace();
			}
        }
		
	} 
	
	/**
	 * 将properties中所有元素复制到instance中
	 * 
	 * @param instance
	 * @param properties
	 */
	public static void setProperties(Object instance, Map<String, Object> properties){
        Iterator<String> propertyIt = properties.keySet().iterator();
        while(propertyIt.hasNext()){
        	String property = propertyIt.next();
        	try {
				PropertyUtils.setProperty(instance, property, properties.get(property));
			} catch (Exception e) {
				// ignore this property !!
			}
        }
	}
	
	public static void copyProperties(Object dest, Object src){
		if(null == src || null == dest){
			return;
		}
		try {
			BeanUtils.copyProperties(dest, src);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
	}
	
	public static Map cloneMap(Map src, Class valueCls){
		Map newMap = null;
		if(src instanceof LinkedHashMap){
			newMap = new LinkedHashMap();
		} else {
			newMap = new HashMap();
		}
		if(null == src){
			return newMap;
		}
		for(Iterator keyIt=src.keySet().iterator();keyIt.hasNext();){
			String key = (String)keyIt.next();
			Object newObj = null;
			try {
				newObj = valueCls.newInstance();
			} catch (InstantiationException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			}
			BoomBeanUtils.copyProperties(newObj, src.get(key));
			newMap.put(key, newObj);
		}
		return newMap;
	}
	
	public static JSONArray map2JsonArray(Map map){
		JSONArray arr = new JSONArray();
		for(Iterator keyIt = map.keySet().iterator();keyIt.hasNext();){
			Object key = keyIt.next();
			Object o = map.get(key);
			if(o instanceof Map){
				arr.put(JSONObject.fromMap((Map)o));
			}else{
				arr.put(JSONObject.fromBean(o));
			}
		}
		return arr;
	}
	
	public static <T> JSONArray list2JsonArray(List<Map<String, T>> list){
		JSONArray ja = new JSONArray();
		for(int i=0;i<list.size();i++){
			Map<String,T> m = list.get(i);
			JSONObject jo  = JSONObject.fromMap(m);
			ja.put(jo);
		}
		return ja;
	}
	
	public static <T> JSONArray list2JsonArray(List<Map<String, T>> list, IMap2JsonCallback<T> callback){
		JSONArray ja = new JSONArray();
		for(int i=0;i<list.size();i++){
			Map<String,T> map = list.get(i);
			JSONObject jo  = callback.convert(map);
			ja.put(jo);
		}
		return ja;
	}
	
	public static List jsonArray2Beans(JSONArray ja, Class cls){
		List list = new ArrayList();
		if(null == ja){
			return list;
		}
		Iterator<JSONObject> it = ja.iterator();
		while(it.hasNext()){
			JSONObject o = it.next();
			Object bean = JSONObject.toBean(o, cls);
			list.add(bean);
		}
		return list;
	}
	
	public static List<Map<String, Object>> jsonArray2List(JSONArray ja){
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		if(null == ja){
			return list;
		}
		
		Iterator<JSONObject> it = ja.iterator();
		while(it.hasNext()){
			JSONObject o = it.next();
			Map<String, Object> map = new HashMap<String, Object>();
			
			Iterator keyIt = o.keys(); 
			while(keyIt.hasNext()){
				String key = (String)keyIt.next();
				map.put(key, o.get(key));
			}
			list.add(map);
		}
		
		return list;
	}
	
	public static Map jsonObj2Map(JSONObject obj){
		Map map = new HashMap();
		if(obj==null || obj.isNullObject()){
			return map;
		}
		Iterator<String> keyIt = obj.keys();
		while(keyIt.hasNext()){
			String key = keyIt.next();
			Object value = obj.get(key);
			map.put(key, value);
		} 
		return map;
	}
	
	public static Map str2Map(String str){
		Map map = new HashMap();
		if(StringUtils.isBlank(str)){
			return map;
		}
		JSONObject obj = JSONObject.fromBean(str);
		return jsonObj2Map(obj);
	}
	
	public static void extApply(Map<String, Object> dst, Map<String, Object> src){
		for(Iterator<String> keyIt = src.keySet().iterator();keyIt.hasNext();){
			String key = keyIt.next();
			dst.put(key, src.get(key));
		}
	}
}
