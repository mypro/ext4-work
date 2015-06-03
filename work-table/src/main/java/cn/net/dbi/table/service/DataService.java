package cn.net.dbi.table.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import cn.net.dbi.boom.jdbc.CommonJdbcDao;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.BoomStringUtils;
import cn.net.dbi.boom.utils.NumberUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.data.ConstantDataSynax;
import cn.net.dbi.table.operator.data.insert.InsertTool;
import cn.net.dbi.table.operator.data.delete.DeleteTool;
import cn.net.dbi.table.operator.data.query.BranchNode;
import cn.net.dbi.table.operator.data.query.IConditionNode;
import cn.net.dbi.table.operator.data.query.LeaveNode;
import cn.net.dbi.table.operator.data.query.QueryTool;
import cn.net.dbi.table.operator.data.query.StatementNode;
import cn.net.dbi.table.operator.data.query.UpdateTool;

public class DataService {
	
	private CommonJdbcDao jdbcDao;

	public void setJdbcDao(CommonJdbcDao jdbcDao) {
		this.jdbcDao = jdbcDao;
	}
	
	public CommonJdbcDao getJdbcDao(){
		return this.jdbcDao;
	}
	
	public void delete(TableModel tm, IConditionNode queryNode){
		
		DeleteTool tool = new DeleteTool(tm, queryNode);
		
		tool.setJdbcDao(jdbcDao);
		
		tool.deleteRecord();
	}

	public void delete(TableModel tm, List<Map<String, Object>> uuids){
		
		DeleteTool tool = new DeleteTool(tm, uuids);
		
		tool.setJdbcDao(jdbcDao);
		
		tool.deleteRecord();
	}
	
	
	public void deleteByUuid(TableModel tm, String uuid){
		
		Map<String, Object> condition = new HashMap<String, Object>();
		
		condition.put("uuid", uuid);
		
		List<Map<String, Object>> uuids = new ArrayList<Map<String,Object>>();
		uuids.add(condition);
		
		delete(tm, uuids);
	}
	
	public List<Map<String, Object>> queryByBranch(TableModel tm, List<String> resultNames, 
											IConditionNode queryNode){
	
		QueryTool tool = new QueryTool(tm, resultNames, queryNode);
		
		tool.setJdbcDao(jdbcDao);
		
		List<Map<String, Object>> results = tool.getResult();
		return results;
	}
	
	public List<Map<String, Object>> query(TableModel tm, List<String> resultNames, 
							Map<String, Object> conditions){
		
		QueryTool tool = new QueryTool(tm, resultNames, conditions);
		
		tool.setJdbcDao(jdbcDao);
		
		List<Map<String, Object>> results = tool.getResult();
		return results;
	}
	
	public List<Map<String, Object>> query(TableModel tm, List<String> resultNames, String where, Object[] params){
		QueryTool tool = new QueryTool(tm, resultNames, where, params);
		
		tool.setJdbcDao(jdbcDao);
		
		List<Map<String, Object>> results = tool.getResult();
		return results;
	}
	
	public Map<String, Object> queryByUuid(TableModel tm, List<String> resultNames, String uuid){

		Map<String, Object> conditions = new HashMap<String, Object>();
		conditions.put("uuid", uuid);
		
		QueryTool tool = new QueryTool(tm, resultNames, conditions);
		
		tool.setJdbcDao(jdbcDao);
		
		List<Map<String, Object>> results = tool.getResult();
		
		if(results.size()>0){
			return results.get(0);
		}
		return null;
	}
	
	public int queryForCount(TableModel tm, 
			Map<String, Object> conditions){
		String[] selectFields = new String[]{"count(uuid)"};
		
		QueryTool tool = new QueryTool(tm, Arrays.asList(selectFields), conditions);
		
		tool.setJdbcDao(jdbcDao);
		
		List<Map<String, Object>> results = tool.getResult();
		if(results.size()>0){
			return Integer.parseInt((String)results.get(0).get("count(uuid)"));
		}
		return 0;
	}
	
	public int queryForSpecial(TableModel tm, String special,
			Map<String, Object> conditions){
		String[] selectFields = new String[]{special};
		
		QueryTool tool = new QueryTool(tm, Arrays.asList(selectFields), conditions);
		
		tool.setJdbcDao(jdbcDao);
		
		List<Map<String, Object>> results = tool.getResult();
		if(results.size()>0){
			return NumberUtils.tryGetInt(results.get(0).get(special));
		}
		return 0;
	}
	
	/**
	 * 用于纵向组合两表的数据
	 * 
	 * @param tm
	 * @param records
	 * @param pkField
	 */
	public void extendData(TableModel tm, List<Map<String, Object>> records, String pkField){
		if(!BoomCollectionsUtils.isNotEmptyCollection(records)){
			return ;
		}
		
		// 联查主表
		StatementNode statement = new StatementNode("uuid in ("+
									BoomStringUtils.repeat("?", records.size(), ",")
																				+")");
		statement.setValueList(BoomCollectionsUtils.getOneColumnData(records, pkField));
		List<Map<String, Object>> results = this.queryByBranch(
				tm, Arrays.asList(new String[]{"*"}), statement);
		
		// 主表和子表信息合并
		BoomCollectionsUtils.mergeRecordColumn(records, results, pkField, "uuid");
	}
	
	/**
	 * 用于纵向组合两表的单条数据
	 * @param tm
	 * @param record
	 * @param pkField
	 * @return
	 */
	public Map<String, Object> extendData(TableModel tm, Map<String, Object> record, String pkField){
		List<Map<String, Object>> records = new ArrayList<Map<String,Object>>();
		records.add(record);
		extendData(tm, records, pkField);
		return records.get(0);
	}
	
	/**
	 * 
	 * @param tm
	 * @param values
	 * @return 返回新插入数据的主键
	 */
	public List<String> insert(TableModel tm, List<Map<String, Object>> values){
		
		int maxSeq = this.queryForSpecial(tm, 
				ConstantInfo.MAX+ConstantInfo.PARENTHESIS_LEFT+ConstantInfo.SEQ+ConstantInfo.PARENTHESIS_RIGHT, null);
		for(Iterator<Map<String, Object>> recordIt = values.iterator();recordIt.hasNext();){
			Map<String, Object> record = recordIt.next();
			if(0 == NumberUtils.tryGetInt(record.get(ConstantInfo.SEQ))){
				maxSeq += ConstantInfo.SEQ_STEP;
				record.put(ConstantInfo.SEQ, maxSeq);
			}
		}
		
		InsertTool tool = new InsertTool(tm, values);
		
		tool.setJdbcDao(jdbcDao);
		
		return tool.insertDatas();
	}
	
	/**
	 * @param tm
	 * @param value
	 * @return 返回新插入数据的主键
	 */
	public String insert(TableModel tm, Map<String, Object> value){
		
		List<Map<String, Object>> values = new ArrayList<Map<String,Object>>();
		values.add(value);
		
//		int maxSeq = this.queryForSpecial(tm, 
//				ConstantInfo.MAX+ConstantInfo.PARENTHESIS_LEFT+ConstantInfo.SEQ+ConstantInfo.PARENTHESIS_RIGHT, null);
//		for(Iterator<Map<String, Object>> recordIt = values.iterator();recordIt.hasNext();){
//			Map<String, Object> record = recordIt.next();
//			if(0 == NumberUtils.tryGetInt(record.get(ConstantInfo.SEQ))){
//				maxSeq += ConstantInfo.SEQ_STEP;
//				record.put(ConstantInfo.SEQ, maxSeq);
//			}
//		}
//		
//		InsertTool tool = new InsertTool(tm, values);
//		
//		tool.setJdbcDao(jdbcDao);
		
		List<String> uuids = this.insert(tm, values);
		return uuids.size()>0?uuids.get(0):null;
	}
	
	/**
	 * 根据主键批量更新
	 * @param tm
	 * @param values
	 */
	public void update(TableModel tm, List<Map<String, Object>> values){

		UpdateTool tool = new UpdateTool(tm, values);
		
		tool.setJdbcDao(jdbcDao);
		
		tool.updateDatas();
	}
	
	/**
	 * 复杂条件的更新
	 * @param tm
	 * @param keyValue
	 * @param queryNode
	 */
	public void update(TableModel tm, Map<String, Object> keyValue, IConditionNode queryNode){
		
		UpdateTool tool = new UpdateTool(tm, keyValue, queryNode);
		
		tool.setJdbcDao(jdbcDao);
		
		tool.updateDatas();
	}
	
	public void updateByUuids(TableModel tm, Map<String, Object> keyValue, List<String> uuids){
		LeaveNode queryNode = new LeaveNode();
		queryNode.setSymbol(ConstantDataSynax.IN)
				.setRight("("+BoomStringUtils.repeat("?", uuids.size(), ",")+")");
		queryNode.setKeyValue("uuid", uuids);
		
		this.update(tm, keyValue, queryNode);
	}
	
	public void updateByUuid(TableModel tm, Map<String, Object> keyValue, String uuid){
		
		LeaveNode queryNode = new LeaveNode();
		queryNode.setKeyValue("uuid", uuid);
		
		this.update(tm, keyValue, queryNode);
		
//		UpdateTool tool = new UpdateTool(tm, keyValue, queryNode);
//		
//		tool.setJdbcDao(jdbcDao);
//		
//		tool.updateDatas();
	}
}
