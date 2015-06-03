package cn.net.dbi.boom.filter;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import cn.net.dbi.boom.utils.ThreadUtils;

public class HttpRequestInfoIntercepter implements HandlerInterceptor  {
	
	private Logger logger = Logger.getLogger(this.getClass().getName());
	
	public void afterCompletion(HttpServletRequest arg0,
			HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {
		
	}

	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1,
			Object arg2, ModelAndView arg3) throws Exception {
		
	}

	public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
			Object obj) throws Exception {
		
		Enumeration<String> e = request.getParameterNames();
		
		JSONObject param = new JSONObject();
		while(e.hasMoreElements()){
			String k = e.nextElement();
			param.put(k, request.getParameter(k));
		}
		
		logger.info("Http Request : "+param.toString());
		ThreadUtils.set(param.toString());
		
		return true;
	}

}
