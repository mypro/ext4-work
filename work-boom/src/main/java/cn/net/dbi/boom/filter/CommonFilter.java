package cn.net.dbi.boom.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class CommonFilter implements Filter {

	public static HttpServletRequest getRequest() {
		if (localVal.get() == null)
			return null;
		return (HttpServletRequest) localVal.get().request;
	}

	public static HttpServletResponse getResponse() {
		return (HttpServletResponse) localVal.get().response;
	}

	public static LocalVal getLocalVal() {
		return localVal.get();
	}

	public static HttpSession getSession() {
		return (HttpSession) getRequest().getSession();
	}

	public static HttpSession getSession(boolean create) {
		return (HttpSession) getRequest().getSession(create);
	}

	public void init(FilterConfig config) throws ServletException {

	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		ServletRequest srequest = request;
		srequest.setCharacterEncoding("utf-8");
		localVal.set(new LocalVal(request, response));
		chain.doFilter(srequest, response);
	}

	public void destroy() {

	}

	private static ThreadLocal<LocalVal> localVal = new ThreadLocal<LocalVal>();

	public class LocalVal {
		LocalVal(ServletRequest request, ServletResponse response) {
			this.request = request;
			this.response = response;
		}

		ServletRequest request;
		ServletResponse response;
		public long flag;
	}
}
