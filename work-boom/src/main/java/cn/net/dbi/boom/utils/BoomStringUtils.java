package cn.net.dbi.boom.utils;

import org.apache.commons.lang.StringUtils;

public class BoomStringUtils {
	
	/**
	 * 连续重复字符串
	 * 
	 * @param charactor 重复字符
	 * @param times		重复次数
	 * @param split		间隔符
	 * @return
	 */
	public static String repeat(String charactor, int times, String split){
		if(times<=0){
			return "";
		}
		StringBuffer buf = new StringBuffer();
		split = StringUtils.isNotEmpty(split)?split:"";
		for(int i=0;i<times;i++){
			buf.append(charactor);
			buf.append(split);
		}
		buf.delete(buf.length()-split.length(), buf.length());
		return buf.toString();
	}
}
