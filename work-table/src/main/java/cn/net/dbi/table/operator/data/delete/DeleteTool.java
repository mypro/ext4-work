package cn.net.dbi.table.operator.data.delete;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;

import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.database.DBUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.data.ConstantDataSynax;
import cn.net.dbi.table.operator.data.OperatorTool;
import cn.net.dbi.table.operator.data.query.BranchNode;
import cn.net.dbi.table.operator.data.query.IConditionNode;

public class DeleteTool extends OperatorTool{
	
	/**
	 * 所有List元素之间是“或”的关系，每个List元素的所有键值对是“and”关系（目前仅支持uuid）
	 */
	private List<Map<String, Object>> conditions;
	
	private IConditionNode queryBranchNode;
	
	public DeleteTool(TableModel tm, List<Map<String, Object>> conditions){
		super(tm);
		this.conditions = conditions;
	}
	
	public DeleteTool(TableModel tm, IConditionNode queryBranchNode){
		super(tm);
		this.queryBranchNode = queryBranchNode;
	}
	
	public void deleteRecord(){
		// 用于执行删除多个主键的情况
		if(BoomCollectionsUtils.isNotEmptyCollection(conditions)
				){
			
			assemblyDeleteSql();
			
			logger.info(this.buffer.toString());
			
			jdbcDao.getJdbcTemplate().batchUpdate(buffer.toString(), new BatchPreparedStatementSetter() {
				
				public void setValues(PreparedStatement ps, int i) throws SQLException {
					ps.setString(1, (String)conditions.get(i).get(ConstantInfo.UUID));
				}
				
				public int getBatchSize() {
					return conditions.size();
				}
			});
		// 用于支持一条delete语句，但where条件复杂
		}else if(null != queryBranchNode){
			
			assemblyDeleteSql();
			
			logger.info(this.buffer.toString());
			
			jdbcDao.getJdbcTemplate().update(this.buffer.toString(), 
											this.params.toArray());
		}
	}

	private void assemblyDeleteSql(){
		buffer.append(ConstantDataSynax.DELETE);
		buffer.append(ConstantInfo.BLANK);
		buffer.append(ConstantDataSynax.FROM);
		buffer.append(ConstantInfo.BLANK);
		buffer.append(DBUtils.getTablePrefix());
		buffer.append(tm.getKeyword());
		buffer.append(ConstantInfo.BLANK);
		buffer.append(ConstantDataSynax.WHERE);
		buffer.append(ConstantInfo.BLANK);
		assemblyWhere();
	}
	
	private void assemblyWhere(){
		if(null == queryBranchNode){
			buffer.append(ConstantInfo.UUID);
			buffer.append(ConstantDataSynax.EQ);
			buffer.append(ConstantDataSynax.QUESTION_MARK);
		}else{
			this.queryBranchNode.setParams(this.params);
			buffer.append(this.queryBranchNode.toSqlString());
		}
	}
	
	
}
