package cn.net.dbi.project;

import cn.net.dbi.boom.cache.CacheUtils;
import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.IMapIteratorCallback;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;

public class ProjectConstant {
	
	/**
	 * 根据表名，找到表模型
	 * @param tableName
	 * @return
	 */
	public static TableModel getTableModelByName(final String tableName){
		
		TableInfo ti = (TableInfo)CacheUtils.getCacheInstance("tableCache");
		
		/* final tablemodel */
		TableModel tm = (TableModel)BoomCollectionsUtils.iterMap(ti.getTables(), new IMapIteratorCallback<String, TableModel>() {
			public Object iteratorCallback(String key, TableModel value) {
				return value;
			}
			public boolean stopIterator(String key, TableModel value) {
				return value.getKeyword().equalsIgnoreCase(tableName);
			}
		});
		
		return tm;
	}
	
	public static TableModel getProjectTM(){
		final String tableName = PropertyUtils.getValue
				("keyword.project");
		return getTableModelByName(tableName);
	}
	
	public static TableModel getFactorDefineTM(){
		final String tableName = PropertyUtils.getValue
				("keyword.factor.define");
		return getTableModelByName(tableName);
	}
	
	public static TableModel getFactorInstTM(){
		final String tableName = PropertyUtils.getValue
				("keyword.factor.value");
		return getTableModelByName(tableName);
	}
	
	public static TableModel getFactorRelationTM(){
		final String tableName = PropertyUtils.getValue
				("keyword.factor.relation");
		return getTableModelByName(tableName);
	}
	
	public static TableModel getFactorValueLabelTM(){
		final String tableName = PropertyUtils.getValue
				("keyword.factor.valuelabel");
		return getTableModelByName(tableName);
	}
	
	public static TableModel getFactorLayoutDefine(){
		final String tableName = PropertyUtils.getValue
				("keyword.factor.layoutdefine");
		return getTableModelByName(tableName);
	}
	
	public static TableModel getFactorLayout(){
		final String tableName = PropertyUtils.getValue
				("keyword.factor.layout");
		return getTableModelByName(tableName);
	}
}
