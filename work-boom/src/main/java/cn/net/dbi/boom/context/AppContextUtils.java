package cn.net.dbi.boom.context;

import org.springframework.context.ApplicationContext;

/**
 * spring上下文的管理，目的是对其他模块提供统一的获取上下文的静态方法
 * 
 * @author hanheliang
 *
 */
public class AppContextUtils {
	
	private static ApplicationContext context = null;
	
	public static ApplicationContext getAppContext(){
		if(null == context){
			throw new RuntimeException("AppContext is null");
		}
		return context;
	}
	
	public static void setAppContext(ApplicationContext appContext){
		context = appContext;
	}
}
