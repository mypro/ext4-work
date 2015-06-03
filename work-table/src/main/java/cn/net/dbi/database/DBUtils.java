package cn.net.dbi.database;

import org.apache.commons.lang.StringUtils;

import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.boom.utils.ThreadUtils;
import cn.net.dbi.table.ConstantInfo;

public class DBUtils {
	
	public static final String TABLE_PREFIX = "_";
	
	public static String getDBName1(){
		String projectName = ThreadUtils.get("projectName");
		if(StringUtils.isBlank(projectName)){
			projectName = PropertyUtils.getValue("mysql.dbname.business");
		}
		return projectName;
	}
	
	public static String getTablePrefix(){
		StringBuffer buf = new StringBuffer();
		String project = ThreadUtils.get("project");
		if(StringUtils.isBlank(project)){
			project = PropertyUtils.getValue("mysql.dbname.business");
			buf.append(project)
				.append(ConstantInfo.POINT);
		}else{
			buf.append(PropertyUtils.getValue("mysql.dbname.project"))
				.append(ConstantInfo.POINT)
				.append(project)
				.append(TABLE_PREFIX);
		}
		return buf.toString();
	}
}
