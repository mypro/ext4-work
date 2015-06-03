package cn.net.dbi.table;

import cn.net.dbi.boom.cache.CacheUtils;
import cn.net.dbi.table.model.TableInfo;

public class ConstantInfo {
	
	public final static String COLUMNTYPE_DECIMAL = "2aeb87181668438e8956b4e1d343cc54";
	public final static String COLUMNTYPE_CHAR = "0942221e69d14bfba39ac501380b3665";
	public final static String COLUMNTYPE_DATE = "d1210187951b45f798c12844b0829bec";
	public final static String COLUMNTYPE_PARAM = "63cb86078aa24e27be67c5d098b5b99d";
	
	public static final String BLANK = " ";
	public static final String COMMA = ",";
	public final static String POINT = ".";
	public static final String PARENTHESIS_LEFT = "(";
	public static final String PARENTHESIS_RIGHT = ")";
	public static final String ENTER = "\r\n";
	public static final String SEMICOLON = ";"; 
	
	public final static String CREATE_TABLE = "create table";
	public final static String ALTER_TABLE = "alter table";
	public final static String DROP_TABLE = "drop table";
	public final static String RENAME_TO = "rename to";
	
	public final static String ADD_COLUMN = "add";
	public final static String CHANGE = "change";
	public final static String DROP_COLUMN = "drop";
	
	public final static String UUID = "uuid";
	public final static String DISTINCT = "DISTINCT";
	public final static String COUNT = "count";
	public final static String MAX = "max";
	public final static String MIN = "min";
	public final static String UUID_INFO = "char(32) primary key";
	
	public final static String SEQ = "seq";
	public final static String SEQ_INFO = "integer(11)";
	public final static int SEQ_STEP = 1024;
	public final static String TABLECACHE_NAME = "tableCache";
	
	public static TableInfo getTableCache(){
		return (TableInfo)CacheUtils.getCacheInstance(ConstantInfo.TABLECACHE_NAME);
	}
}
