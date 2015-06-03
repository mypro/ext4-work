package cn.net.dbi.table.operator.data.query;

import java.util.Collection;
import java.util.List;

import cn.net.dbi.table.ConstantInfo;
import cn.net.dbi.table.operator.data.ConstantDataSynax;

public class LeaveNode implements IConditionNode{
	
	private String key;
	
	private Object value;
	
	private List params;
	
	private String right = ConstantDataSynax.QUESTION_MARK;
	
	private String symbol = ConstantDataSynax.EQ;
	
	public LeaveNode setRight(String right) {
		this.right = right;
		return this;
	}

	public LeaveNode setSymbol(String symbol) {
		this.symbol = symbol;
		return this;
	}

	public static LeaveNode getAlwaysTrue(){
		LeaveNode n = new LeaveNode();
		n.setKeyValue("1", "1");
		return n;
	}
	
	public static LeaveNode getAlwaysFalse(){
		LeaveNode n = new LeaveNode();
		n.setKeyValue("1", "2");
		return n;
	}
	
	public void setKeyValue(String key, Object value){
		this.key = key;
		this.value = value;
	}
	
	public void setParams(List params) {
		this.params = params;
	}
	
	public String toSqlString(){
		StringBuffer buf = new StringBuffer();
		buf.append(ConstantInfo.PARENTHESIS_LEFT);
		buf.append(key);
		buf.append(ConstantInfo.BLANK);
		buf.append(symbol);
		buf.append(ConstantInfo.BLANK);
		buf.append(right);
		if(value instanceof Collection){
			this.params.addAll((Collection)value);
		}else{
			this.params.add(value);
		}
		buf.append(ConstantInfo.PARENTHESIS_RIGHT);
		return buf.toString();
	}
}
