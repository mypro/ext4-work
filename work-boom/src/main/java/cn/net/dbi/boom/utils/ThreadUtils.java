package cn.net.dbi.boom.utils;

import net.sf.json.JSONObject;

public class ThreadUtils {
	
	public static ThreadLocal<String> requestInfoThreadLocal = new ThreadLocal<String>();
	
	public static void set(String value){
		requestInfoThreadLocal.set(value);
	}
	
	public static void set(String key, String value){
		requestInfoThreadLocal.set(get().set(key, value).toString());
	}
	
	public static String get(String key){
		JSONObject value = JSONObject.fromString(requestInfoThreadLocal.get());
		if(value.has(key)){
			return (String)value.get(key);
		}
		return null;
	}
	
	public static JSONObject get(){
		return JSONObject.fromString(requestInfoThreadLocal.get());
	}
	
}
