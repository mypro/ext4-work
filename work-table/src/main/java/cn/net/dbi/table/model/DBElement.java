package cn.net.dbi.table.model;

import java.util.Date;

/**
 * 数据库元素
 * 
 * @author hanheliang
 *
 */
public class DBElement {
	
	protected String keyword;
	
	protected String name;
	
	protected Date modifyTime;


	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getModifyTime() {
		return modifyTime;
	}

	public void setModifyTime(Date modifyTime) {
		this.modifyTime = modifyTime;
	}
	
}
