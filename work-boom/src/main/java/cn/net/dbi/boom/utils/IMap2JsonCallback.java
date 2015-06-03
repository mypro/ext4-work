package cn.net.dbi.boom.utils;

import java.util.Map;

import net.sf.json.JSONObject;

public interface IMap2JsonCallback<T> {
	
	public JSONObject convert(Map<String, T> map);
}
