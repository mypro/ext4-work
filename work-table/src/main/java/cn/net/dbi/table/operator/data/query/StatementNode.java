package cn.net.dbi.table.operator.data.query;

import java.util.List;

import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.table.ConstantInfo;

public class StatementNode implements IConditionNode{
	
	private String statment;
	
	private List params;
	
	private List valueList;
	
	public StatementNode(String statment){
		this.statment = statment;
	}
	
	public void setValueList(List valueList){
		this.valueList = valueList;
	}

	public String toSqlString() {
		StringBuffer buf = new StringBuffer();
		buf.append(ConstantInfo.PARENTHESIS_LEFT);
		buf.append(this.statment);
		buf.append(ConstantInfo.PARENTHESIS_RIGHT);
		if(BoomCollectionsUtils.isNotEmptyCollection(valueList)){
			this.params.addAll(valueList);
		}
		return buf.toString();
	}

	public void setParams(List params) {
		this.params = params;
	}

}
