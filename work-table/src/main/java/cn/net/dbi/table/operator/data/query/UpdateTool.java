/**
 * 
 */
package cn.net.dbi.table.operator.data.query;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import cn.net.dbi.boom.jdbc.CommonJdbcDao;
import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.PKUtils;
import cn.net.dbi.database.DBUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.column.ColumnType;
import cn.net.dbi.table.operator.data.ConstantDataSynax;
import cn.net.dbi.table.operator.data.OperatorTool;

/**
 * @author jiawenlong
 *
 */
public class UpdateTool extends OperatorTool{

	/**
	 * 运行所需connection
	 */
	private CommonJdbcDao jdbcDao ; 
	
	private List<Map<String, Object>> values;
	
	private Map<String, Object> keyValue;
	
	private IConditionNode conditionNode;
	
	public UpdateTool(TableModel tm,List<Map<String, Object>> values){
		super(tm);
		this.values = values;
	}
	
	public UpdateTool(TableModel tm, Map<String, Object> keyValue,IConditionNode conditionNode){
		super(tm);
		this.keyValue = keyValue;
		this.conditionNode = conditionNode;
	}
	
	public String updateDatas(){
		
		assemblySql();
		
		logger.info(this.buffer.toString());
		
		if(null == conditionNode){
				
			jdbcDao.getJdbcTemplate().batchUpdate(buffer.toString(),new BatchPreparedStatementSetter(){
	
				public void setValues(PreparedStatement ps, int i)
						throws SQLException {
					Map<String, Object> value = values.get(i);
					int j=1;
//					for(Iterator it = columns.keySet().iterator();it.hasNext();){
//						Object key = it.next();
//						ColumnModel cm = columns.get(key);
//						Object val = value.get(cm.getKeyword());
//						
//						ColumnType ct = ColumnType.getColumnType(cm);
//						ct.setPreparedStatement(ps, j, val);
//						j++;
//					}
					for(Iterator<String> it = values.get(0).keySet().iterator();it.hasNext();){
						String key = it.next();
						if((!columnInfos.keySet().contains(key))
								|| ConstantInfo.UUID.equals(key)){
							continue;
						}
						ColumnModel cm = columnInfos.get(key);
						Object val = value.get(cm.getKeyword());
						
						ColumnType ct = ColumnType.getColumnType(cm);
						ct.setPreparedStatement(ps, j, val);
						j++;
					}
					ps.setString(j, (String)value.get(ConstantInfo.UUID));
				}
	
				public int getBatchSize() {
					return values.size();
				}
			});
		}else{
			jdbcDao.getJdbcTemplate().update(buffer.toString(), this.params.toArray());
		}
		return "";
	}
	
	public void assemblySql(){
		buffer.append(ConstantDataSynax.UPDATE);
		buffer.append(ConstantInfo.BLANK);
		buffer.append(DBUtils.getTablePrefix());
		buffer.append(tm.getKeyword());
		buffer.append(ConstantInfo.BLANK);
		
		assemblySet();
		
		buffer.append(ConstantInfo.BLANK);
		buffer.append(ConstantDataSynax.WHERE);
		buffer.append(ConstantInfo.BLANK);
		
		assemblyWhere();
	}
	
	private void assemblySet(){
		if(null == conditionNode){
			buffer.append(ConstantDataSynax.SET);
			buffer.append(ConstantInfo.BLANK);
			
//			for(Iterator it = columns.keySet().iterator();it.hasNext();){
//				Object key = it.next();
//				ColumnModel cm = columns.get(key);
//				buffer.append(cm.getKeyword());
//				buffer.append(ConstantDataSynax.EQ);
//				buffer.append(ConstantDataSynax.QUESTION_MARK);
//				buffer.append(ConstantInfo.COMMA);
//			}
			//这里报数组越界。有values为空的情况
//			if (values.size()>0) {
				for(Iterator<String> it = values.get(0).keySet().iterator();it.hasNext();){
					String key = it.next();
					if((!this.columnInfos.keySet().contains(key))
							|| ConstantInfo.UUID.equals(key)){
						continue;
					}
					buffer.append(key);
					buffer.append(ConstantDataSynax.EQ);
					buffer.append(ConstantDataSynax.QUESTION_MARK);
					buffer.append(ConstantInfo.COMMA);
				}
				
				buffer.deleteCharAt(buffer.length()-1);
//			}else{
//				System.out.println("values 为空########################");
//			}
		}else{
			buffer.append(ConstantDataSynax.SET);
			buffer.append(ConstantInfo.BLANK);
			
			for(Iterator<String> it = keyValue.keySet().iterator();it.hasNext();){
				String key = it.next();
				if((!this.columnInfos.keySet().contains(key))
						|| ConstantInfo.UUID.equals(key)){
					continue;
				}
				buffer.append(key);
				buffer.append(ConstantDataSynax.EQ);
				buffer.append(ConstantDataSynax.QUESTION_MARK);
				buffer.append(ConstantInfo.COMMA);
				this.params.add(keyValue.get(key));
			}
			buffer.deleteCharAt(buffer.length()-1);
		}
	}
	
	private void assemblyWhere(){
		if(null == conditionNode){
			buffer.append(ConstantInfo.UUID);
			buffer.append(ConstantDataSynax.EQ);
			buffer.append(ConstantDataSynax.QUESTION_MARK);
		}else{
			this.conditionNode.setParams(this.params);
			buffer.append(this.conditionNode.toSqlString());
		}
	}
	
	
	public void setJdbcDao(CommonJdbcDao jdbcDao) {
		this.jdbcDao = jdbcDao;
	}
}
