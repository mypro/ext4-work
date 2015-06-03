package cn.net.dbi.boom.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.log4j.Logger;

import cn.net.dbi.boom.utils.BoomBeanUtils;

public class BaseController {
	
	protected Logger logger = Logger.getLogger(this.getClass().getName());
	
	protected void out2site(String outStr,HttpServletResponse rep){
		PrintWriter out=null;
		try {
			rep.setContentType("text/html;charset=utf-8");
			out = rep.getWriter();
			out.write(outStr);
			if(outStr.length()>2000){
				outStr = outStr.substring(0,2000);
			}
			logger.info("http response : "+outStr);
		} catch (IOException e) {
			e.printStackTrace();
		}
		out.close(); 
	}
	
	protected void out2site(List<Map<String, Object>> records,HttpServletResponse rep){
		JSONArray ja = BoomBeanUtils.list2JsonArray(records);
		PrintWriter out=null;
		try {
			rep.setContentType("text/html;charset=utf-8");
			out = rep.getWriter();
			String responseText = ja.toString();
			out.write(responseText);
			if(responseText.length()>2000){
				responseText = responseText.substring(0,2000);
			}
			logger.info("Http Response : "+responseText);
		} catch (IOException e) {
			e.printStackTrace();
		}
		out.close(); 
	}
	
}
