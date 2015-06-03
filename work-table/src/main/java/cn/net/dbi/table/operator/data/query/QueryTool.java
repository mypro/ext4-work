package cn.net.dbi.table.operator.data.query;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.jdbc.core.RowMapper;

import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.database.DBUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.TableRowMapper;
import cn.net.dbi.table.operator.column.ColumnType;
import cn.net.dbi.table.operator.data.ConstantDataSynax;
import cn.net.dbi.table.operator.data.OperatorTool;

/**
 * 查询工具，本类不负责管理connection
 * 
 * @author hanheliang
 *
 */
	
public class QueryTool extends OperatorTool{
	
	private List<String> resultNames;
	
	private Map<String, Object> conditions;
	
	private IConditionNode queryBranchNode;
	
	private String where;
	
	public QueryTool(TableModel tm, List<String> resultNames,
					Map<String, Object> conditions){
		super(tm);
		this.resultNames = resultNames;
		this.conditions = conditions;
		rebuildColumnInfos();
	}
	
	public QueryTool(TableModel tm, List<String> resultNames,
					IConditionNode queryBranchNode){
		super(tm);
		this.resultNames = resultNames;
		this.queryBranchNode = queryBranchNode;
		rebuildColumnInfos();
	}
	
	public QueryTool(TableModel tm, List<String> resultNames,
			 String where, Object[] params){
		super(tm);
		this.resultNames = resultNames;
		this.where = where;
		this.params.addAll(Arrays.asList(params));
		rebuildColumnInfos();
	}
	
	public List<Map<String, Object>> getResult(){
		
		assemblyQuerySql();
		
		logger.info(this.buffer.toString());
		
		return jdbcDao.getJdbcTemplate().query(this.buffer.toString(), this.params.toArray(), 
				TableRowMapper.getTableRowMapper()
		);
	}
	
	private void assemblyQuerySql(){
		assemblySelect();
		assemblyFrom();
		if(null != queryBranchNode){
			assemblyBranchNodeWhere();
			assemblyOrderBy();
		}else if(StringUtils.isNotBlank(this.where)){
			buffer.append(ConstantInfo.BLANK);
			buffer.append(ConstantDataSynax.WHERE);
			buffer.append(ConstantInfo.BLANK);
			buffer.append(this.where);
		}else {
			assemblyWhere();
			assemblyOrderBy();
		}
		
	}
	
	private void assemblySelect(){
		buffer.append(ConstantDataSynax.SELECT);
		buffer.append(ConstantInfo.BLANK);
		
		if((true
				&&(!resultNames.contains("*"))
				&& StringUtils.isNotBlank(BoomCollectionsUtils
						.containStr(resultNames, ConstantInfo.DISTINCT))
				&& StringUtils.isNotBlank(BoomCollectionsUtils
						.containStr(resultNames, ConstantInfo.COUNT))
				&& StringUtils.isNotBlank(BoomCollectionsUtils
						.containStr(resultNames, ConstantInfo.MAX))
				&& StringUtils.isNotBlank(BoomCollectionsUtils
						.containStr(resultNames, ConstantInfo.MIN)))
			|| 0 == resultNames.size()
			|| resultNames.contains("")){
			buffer.append(ConstantInfo.UUID);
			buffer.append(ConstantInfo.COMMA);
		}
		
		Iterator<String> keywordIt = resultNames.iterator();
		while(keywordIt.hasNext()){
			String keyword = keywordIt.next();
			keyword = keyword.trim();
			
			if(checkIsValidKeyword(keyword)){
				buffer.append(keyword);
				buffer.append(ConstantInfo.COMMA);
			}
		}
		buffer.deleteCharAt(buffer.length()-1);
	}
	
	private void assemblyOrderBy(){
		buffer.append(ConstantInfo.BLANK);
		buffer.append(ConstantDataSynax.ORDER);
		buffer.append(ConstantInfo.BLANK);
		buffer.append(ConstantInfo.SEQ);
	}
	private void assemblyFrom(){
		buffer.append(ConstantInfo.BLANK);
		buffer.append(ConstantDataSynax.FROM);
		buffer.append(ConstantInfo.BLANK);
		buffer.append(DBUtils.getTablePrefix());
		buffer.append(tm.getKeyword());
	}
	private void assemblyBranchNodeWhere(){
		buffer.append(ConstantInfo.BLANK);
		buffer.append(ConstantDataSynax.WHERE);
		buffer.append(ConstantInfo.BLANK);
		
		this.queryBranchNode.setParams(this.params);
		buffer.append(this.queryBranchNode.toSqlString());
	}
	
	private void assemblyWhere(){
		buffer.append(ConstantInfo.BLANK);
		buffer.append(ConstantDataSynax.WHERE);
		buffer.append(ConstantInfo.BLANK);
		buffer.append(ConstantDataSynax.ALWAYS_TRUE);
		if(null==conditions){
			return;
		}
		Iterator<String> conditionIt = conditions.keySet().iterator();
		while(conditionIt.hasNext()){
			String keyword = conditionIt.next().trim();
			Object value = conditions.get(keyword);
			
			if(checkIsValidKeyword(keyword)){
				CheckValueResult result = checkIsValidValue(keyword, value);
				if(result.isValid){
					buffer.append(ConstantInfo.BLANK);
					buffer.append(ConstantDataSynax.AND);
					buffer.append(ConstantInfo.BLANK);
					buffer.append(keyword);
					buffer.append(ConstantDataSynax.EQ);
					buffer.append(ConstantDataSynax.QUESTION_MARK);
					params.add(result.value);
				}
			}
			
		}
	}
	
	
	private boolean checkIsValidKeyword(String keyword){
		
		if(ConstantInfo.UUID.equals(keyword)){
			return true;
		}
		
		if(keyword.contains(ConstantInfo.DISTINCT+ConstantInfo.PARENTHESIS_LEFT)){
			return true;
		}
		
		if(keyword.contains(ConstantInfo.COUNT+ConstantInfo.PARENTHESIS_LEFT)){
			return true;
		}
		
		if(keyword.contains(ConstantInfo.MAX+ConstantInfo.PARENTHESIS_LEFT)){
			return true;
		}
		
		if(keyword.contains(ConstantInfo.MIN+ConstantInfo.PARENTHESIS_LEFT)){
			return true;
		}
		
		if(StringUtils.isBlank(keyword)){
			return false;
		}
		
		if(ConstantDataSynax.STAR.equals(keyword)){
			return true;
		}
		
		if(!columnInfos.keySet().contains(keyword)){
			return false;
		}
		return true;
	}
	
	/**
	 * 做校验的同时做转换
	 * 
	 * @return
	 */
	private CheckValueResult checkIsValidValue(String keyword, Object value){
		
		if(!checkIsValidKeyword(keyword)){
			/* check fail */
			return new CheckValueResult(false);
		}
		
		if(null == value){
			/* of cause is correct*/
			return new CheckValueResult(true, null);
		}
		
		if(ConstantInfo.UUID.equals(keyword)){
			return new CheckValueResult(true, value);
		}
		
		/* check value*/
		ColumnModel cm = columnInfos.get(keyword);
		ColumnType columnType = ColumnType.getColumnType(cm);
		Object convertValue = columnType.convert(value);
		if(null == convertValue){
			return new CheckValueResult(false);
		}
		
		return new CheckValueResult(true, convertValue);
	}
	

	/**
	 * 校验结果封装类
	 * 
	 * @author hanheliang
	 *
	 */
	class CheckValueResult{
		
		boolean isValid;
		Object value;
		
		CheckValueResult(boolean isValid){
			this.isValid = isValid;
		}
		
		CheckValueResult(boolean isValid,Object value){
			this.isValid = isValid;
			this.value = value;
		}
	}
	
	
}
