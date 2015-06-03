package cn.net.dbi.factor;

import cn.net.dbi.boom.cache.CacheUtils;
import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.IMapIteratorCallback;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;

public class FactorConstant {
	
	public final static String RELATION_TYPE_FACTOR = "0";
	public final static String RELATION_TYPE_FACTORPROP = "1";
	public final static String RELATION_TYPE_RELATIONPROP = "2";
	
	public static final String CONFIG_KEYWORD_TFACTOR = "keyword.factor";
	public static final String CONFIG_KEYWORD_TFACTORPROPERTY = "keyword.factor.property";
	
	public static final String CONFIG_KEYWORD_TRELATION = "keyword.relation";
	public static final String CONFIG_KEYWORD_TRELATIONPROPERTY = "keyword.relation.property";
	
	public static final String CONFIG_KEYWORD_TFACTOR_DEFINE = "keyword.factor.define";
	public static final String CONFIG_KEYWORD_TFACTOR_VALUE = "keyword.factor.value";
	public static final String CONFIG_KEYWORD_TFACTOR_TRELATION = "keyword.factor.relation";
	public static final String CONFIG_KEYWORD_TFACTOR_VALUELABEL = "keyword.factor.valuelabel";
	
	
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
	
	public static TableModel getFactorDefineTM(){
		final String tableName = PropertyUtils.getValue
				(FactorConstant.CONFIG_KEYWORD_TFACTOR_DEFINE);
		return getTableModelByName(tableName);
	}
	
	public static TableModel getFactorInstTM(){
		final String tableName = PropertyUtils.getValue
				(FactorConstant.CONFIG_KEYWORD_TFACTOR_VALUE);
		return getTableModelByName(tableName);
	}
	
	public static TableModel getFactorRelationTM(){
		final String tableName = PropertyUtils.getValue
				(FactorConstant.CONFIG_KEYWORD_TFACTOR_TRELATION);
		return getTableModelByName(tableName);
	}
	
	public static TableModel getFactorValueLabelTM(){
		final String tableName = PropertyUtils.getValue
				(FactorConstant.CONFIG_KEYWORD_TFACTOR_VALUELABEL);
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
