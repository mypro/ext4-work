package cn.net.dbi.table.operator.data.insert;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;

import org.apache.commons.lang.StringUtils;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;

import cn.net.dbi.boom.jdbc.CommonJdbcDao;
import cn.net.dbi.boom.property.PropertyUtils;
import cn.net.dbi.boom.utils.BoomStringUtils;
import cn.net.dbi.boom.utils.NumberUtils;
import cn.net.dbi.boom.utils.PKUtils;
import cn.net.dbi.database.DBUtils;
import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.model.ColumnModel;
import cn.net.dbi.table.model.TableInfo;
import cn.net.dbi.table.model.TableModel;
import cn.net.dbi.table.operator.column.ColumnType;
import cn.net.dbi.table.operator.column.type.DecimalType;
import cn.net.dbi.table.operator.data.ConstantDataSynax;
import cn.net.dbi.table.operator.data.OperatorTool;

/**
 * 插入工具
 * @author jiawenlong
 *
 */
public class InsertTool  extends OperatorTool{

	/**
	 * 运行所需connection
	 */
	private CommonJdbcDao jdbcDao ; 
	
	private List<Map<String, Object>> values;
	
	public InsertTool(TableModel tm,List<Map<String, Object>> values){
		super(tm);
		this.values = values;
	}
	public List<String> insertDatas(){
		
		assemblyInsertSql();
		
		logger.info(this.buffer.toString());
		
		final List<String> uuids = PKUtils.getUUIDs(values.size());
		
		this.jdbcDao.getJdbcTemplate().batchUpdate(buffer.toString(), new BatchPreparedStatementSetter() {
			
			public void setValues(PreparedStatement ps, int i) throws SQLException {
				Map<String, Object> value = values.get(i);
				int j=1;
				/*
				 * 若传入了uuid，优先使用传入的
				 */
				String uuidInValue = (String)value.get(ConstantInfo.UUID);
				if(StringUtils.isBlank(uuidInValue)){
					uuidInValue =  uuids.get(i);
					value.put(ConstantInfo.UUID, uuidInValue);
				}else{
					uuids.set(i, uuidInValue);
				}
				ps.setString(j++, uuidInValue);
				/*
				 * 循环设置每个字段
				 */
				for(Iterator it = columns.keySet().iterator();it.hasNext();){
					Object key = it.next();
					ColumnModel cm = columns.get(key);
					Object val = value.get(cm.getKeyword());
					
					ColumnType ct = ColumnType.getColumnType(cm);
					ct.setPreparedStatement(ps, j, val);
					j++;
				}
				ColumnType t= new DecimalType();
				Object seq= value.get(ConstantInfo.SEQ);
				t.setPreparedStatement(ps, j, seq);
				j++;
//				ps.setInt(j++, NumberUtils.getInt((Integer)seq));
			}
			
			public int getBatchSize() {
				return values.size();
			}
		});
		
		return uuids;
	}
	private void assemblyInsertSql(){
		assemblyInsert();
		assemblyField();
	}
	private void assemblyInsert(){
		buffer.append(ConstantDataSynax.INSERT);
		buffer.append(ConstantInfo.BLANK);
		buffer.append(ConstantDataSynax.INTO);
		buffer.append(ConstantInfo.BLANK);
		buffer.append(DBUtils.getTablePrefix());
		buffer.append(tm.getKeyword());
	}
	
	private void assemblyField(){
		buffer.append(ConstantInfo.PARENTHESIS_LEFT);
		buffer.append(ConstantInfo.UUID);
		for(Iterator it = columns.keySet().iterator();it.hasNext();){
			Object key = it.next();
			ColumnModel cm = columns.get(key);
			buffer.append(ConstantInfo.COMMA);
			buffer.append(cm.getKeyword());
		}
		buffer.append(ConstantInfo.COMMA);
		buffer.append(ConstantInfo.SEQ);
		buffer.append(ConstantInfo.PARENTHESIS_RIGHT);
		
		buffer.append(ConstantInfo.BLANK);
		buffer.append(ConstantDataSynax.VALUES);
		buffer.append(ConstantInfo.PARENTHESIS_LEFT);
		buffer.append(BoomStringUtils.repeat(
					ConstantDataSynax.QUESTION_MARK, columns.size()+2, ConstantInfo.COMMA));
		buffer.append(ConstantInfo.PARENTHESIS_RIGHT);
	}
	
	public void setJdbcDao(CommonJdbcDao jdbcDao) {
		this.jdbcDao = jdbcDao;
	}
}
