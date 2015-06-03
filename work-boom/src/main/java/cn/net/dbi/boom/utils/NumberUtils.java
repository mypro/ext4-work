package cn.net.dbi.boom.utils;

import org.apache.commons.lang.StringUtils;

public class NumberUtils {
	
	public static int getInt(Integer obj){
		return (null == obj)?0:obj.intValue();
	}
	
	public static long getLong(Long obj){
		return (null == obj)?0L:obj.longValue();
	}
	
	public static short getShort(Short obj){
		return (null == obj)?0:obj.shortValue();
	}
	
	public static float getFloat(Float obj){
		return (null == obj)?0:obj.floatValue();
	}
	
	public static double getDouble(Double obj){
		return (null == obj)?0:obj.doubleValue();
	}

	public static int tryGetInt(Object o){
		if(o instanceof String){
			if(StringUtils.isBlank((String)o) 
					||"null".equalsIgnoreCase((String)o)){
				return 0;
			}
			return (int)Double.parseDouble((String)o);
		}
		if(o instanceof Number){
			return ((Number) o).intValue();
		}
		return 0;
	}
}
