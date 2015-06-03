package cn.net.dbi.boom.cache;

import cn.net.dbi.boom.context.AppContextUtils;

public class CacheUtils {
	
	public static Object getCacheInstance(String cacheName){
		return ((CacheManager)AppContextUtils.getAppContext().getBean("cacheManager"))
					.getInstance(cacheName);
	}
	
	public static void setNeedReload(String cacheName, boolean isChange){
		CacheProxy proxy = ((CacheManager)AppContextUtils.getAppContext().getBean("cacheManager"))
					.getProxy(cacheName);
		proxy.setNeedReload(true);
	}
}
