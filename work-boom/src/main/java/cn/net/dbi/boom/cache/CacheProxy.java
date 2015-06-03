package cn.net.dbi.boom.cache;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import cn.net.dbi.boom.utils.BoomBeanUtils;
import net.sf.cglib.proxy.MethodProxy;

public class CacheProxy implements net.sf.cglib.proxy.MethodInterceptor {
	
	private ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
	
	private String cacheName;
	
	private Class cacheImpl;
	
	private String initMethod;
	
	private List<String> writeMethod = new ArrayList<String>();
	
	private List<String> readMethod = new ArrayList<String>();
	
	private Map<String, Object> cacheProperties = new HashMap<String, Object>();
	
	/**
	 * 是否需要重新加载的标记。注意使用此变量时注意同步操作。
	 */
	private boolean isNeedReload = false;

	/**
	 * 本方法重点完成工作：
	 * 
	 * 1. 判断缓存模块的调用函数是属于读函数，还是写函数，进而决定锁的使用
	 * 2. 当缓存被通知需要重新加载时，自动调用init函数
	 * 
	 * @see net.sf.cglib.proxy.MethodInterceptor#intercept(java.lang.Object, java.lang.reflect.Method, java.lang.Object[], net.sf.cglib.proxy.MethodProxy)
	 */
	public Object intercept(Object obj, Method method, Object[] args,
							MethodProxy proxy) throws Throwable {
		
		boolean isWriteMethod = writeMethod.contains(method.getName())
							|| initMethod.equals(method.getName());
		
		// refresh cache, no need lock
		if((!isWriteMethod)){
			synchronized (this)
			{
				if(isNeedReload){ 
					this.doInit(obj);
					isNeedReload = false;
				}
			}
		}
		
		if(isWriteMethod){
			rwLock.writeLock().lock();
		}else{ 
			rwLock.readLock().lock();
		}
		
		Object result = null;
		
		try{
			result = proxy.invokeSuper(obj, args);
		}finally{
			// release lock always
			if(isWriteMethod){
				rwLock.writeLock().unlock();
			}else{
				rwLock.readLock().unlock();
			}
		}
		
		return result;
	}
	
	/**
	 * 执行缓存模块的初始化函数
	 * 
	 * @param instance
	 */
	public void doInit(Object instance){
		BoomBeanUtils.runMethod(instance, this.getInitMethod(), null, null);
	}

	public String getCacheName() {
		return cacheName;
	}

	public void setCacheName(String cacheName) {
		this.cacheName = cacheName;
	}

	public ReentrantReadWriteLock getRwLock() {
		return rwLock;
	}

	public void setRwLock(ReentrantReadWriteLock rwLock) {
		this.rwLock = rwLock;
	}

	public Class getCacheImpl() {
		return cacheImpl;
	}

	public void setCacheImpl(Class cacheImpl) {
		this.cacheImpl = cacheImpl;
	}

	public List<String> getWriteMethod() {
		return writeMethod;
	}

	public void setWriteMethod(List<String> writeMethod) {
		this.writeMethod = writeMethod;
	}

	public List<String> getReadMethod() {
		return readMethod;
	}
	

	public void setReadMethod(List<String> readMethod) {
		this.readMethod = readMethod;
	}


	public Map<String, Object> getCacheProperties() {
		return cacheProperties;
	}


	public void setCacheProperties(Map<String, Object> cacheProperties) {
		this.cacheProperties = cacheProperties;
	}

	public String getInitMethod() {
		return initMethod;
	}

	public void setInitMethod(String initMethod) {
		this.initMethod = initMethod;
	}
	
	public void setNeedReload(boolean isNeedReload) {
		synchronized (this) {
			this.isNeedReload = isNeedReload;
		} 
	}
}
