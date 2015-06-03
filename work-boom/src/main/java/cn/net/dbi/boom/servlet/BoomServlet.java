package cn.net.dbi.boom.servlet;

import javax.servlet.*;
import javax.servlet.http.*;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import cn.net.dbi.boom.cache.CacheManager;
import cn.net.dbi.boom.context.AppContextUtils;
import cn.net.dbi.boom.property.PropertyUtils;

/**
 * 在web容器启动时加载此servlet,以便完成相关的初始化工作：
 * 
 * spring上下文初始化
 * 缓存初始化
 * 配置文件读取
 * 等等
 * 
 * @author hanheliang
 *
 */
public class BoomServlet extends HttpServlet {

	private static final long serialVersionUID = 2144359417315704606L;

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		
		initAppContext(config);
		initCache();
		initProperty();
		initRight(); 
	}

	/**
	 * 初始化spring上下文
	 * @param config
	 */
	private void initAppContext(ServletConfig config) {
		ApplicationContext app = WebApplicationContextUtils
				.getWebApplicationContext(config.getServletContext());

		AppContextUtils.setAppContext(app);
	}
	
	/**
	 * 初始化公共缓存机制
	 */
	private void initCache(){
		CacheManager cm = (CacheManager)AppContextUtils.getAppContext().getBean("cacheManager");
		cm.init();
	}

	/**
	 * 初始化所有.property配置文件
	 */
	private void initProperty(){
		PropertyUtils.load();
	}
	
	/**
	 * 初始化权限管理机制
	 */
	private void initRight(){
		///TODO
	}
}
