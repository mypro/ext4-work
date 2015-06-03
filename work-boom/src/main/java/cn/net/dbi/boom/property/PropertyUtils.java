package cn.net.dbi.boom.property;

import java.io.*;
import java.util.*;

public class PropertyUtils {
	
	private static final String PATH_PROPERTY = "/conf/";
	
	private static Properties prop;
	
	public static void load(){
		prop = new Properties();
		InputStream in = PropertyUtils.class.getResourceAsStream(PATH_PROPERTY+"config.properties");
		try {
			prop.load(in);
		} catch (IOException e) {
			e.printStackTrace();
		}
	} 
	
	public static String getValue(String key){
		return prop.getProperty(key);
	}
}
