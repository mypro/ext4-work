package cn.net.dbi.table.operator.data.query;

import java.util.List;

public interface IConditionNode {
	
	public String toSqlString();
	
	public void setParams(List params);
}
