package cn.net.dbi.boom.cache;

import java.util.*;

import cn.net.dbi.boom.utils.BoomBeanUtils;
import net.sf.cglib.proxy.Enhancer;

/**
 * 缓存管理服务
 * 
 * 通过cglib动态生成各个缓存模块的代理，重点完成读写同步。
 * 
 * @author hanheliang
 *
 */
public class CacheManager {
	
	private List<CacheProxy> cacheDefine = new ArrayList<CacheProxy>();
	
	/* hold cache instance*/
	private Map<String, Object> caches = new HashMap<String, Object>();
	private Map<String, CacheProxy> cacheProxys = new HashMap<String, CacheProxy>();
	
	public void init(){
		Iterator<CacheProxy> it = cacheDefine.iterator();
		while(it.hasNext()){
			CacheProxy proxy = it.next();
			caches.put(proxy.getCacheName(), createInstance(proxy));
			cacheProxys.put(proxy.getCacheName(), proxy);
		}
	}
	
	public CacheProxy getProxy(String cacheName){
		return cacheProxys.get(cacheName);
	}
	public Object getInstance(String cacheName){
		return caches.get(cacheName);
	}

	/**
	 * 根据proxy的定义动态生成具体的缓存模块
	 * 
	 * @param proxy
	 * @return
	 */
	private Object createInstance(CacheProxy proxy){
		Enhancer enhancer = new Enhancer();  
        enhancer.setSuperclass(proxy.getCacheImpl());  
        enhancer.setCallback(proxy);  
        Object instance = enhancer.create();
        
        // copy properties to instance
        BoomBeanUtils.setProperties(instance, proxy.getCacheProperties()); 
        
        // init
        proxy.doInit(instance);
        
        return  instance;  
		
	}

	public void setCacheDefine(List<CacheProxy> cacheDefine) {
		this.cacheDefine = cacheDefine;
	}
	
	
}
