package cn.net.dbi.table.operator.data.query;

import java.util.List;

import cn.net.dbi.table.ConstantInfo;

public class BranchNode implements IConditionNode {
	
	private IConditionNode leftNode;
	
	private IConditionNode rightNode;
	
	private String relationSymbol;
	
	private List params;
	
	public BranchNode(String relationSymbol){
		this.relationSymbol = relationSymbol;
	}
	
	public void setLeftChild(IConditionNode node){
		this.leftNode = node;
	}
	
	public void setRightChild(IConditionNode node){
		this.rightNode = node;
	}
	
	public void setParams(List params) {
		this.params = params;
	}

	public String toSqlString(){
		StringBuffer buf = new StringBuffer();
		
		buf.append(ConstantInfo.PARENTHESIS_LEFT);
		this.leftNode.setParams(this.params);
		buf.append(this.leftNode.toSqlString());
		buf.append(this.relationSymbol);
		this.rightNode.setParams(this.params);
		buf.append(this.rightNode.toSqlString());
		buf.append(ConstantInfo.PARENTHESIS_RIGHT);
		return buf.toString();
	}
}
