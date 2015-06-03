package cn.net.dbi.table.model;

/**
 * 表模型，hibernate映射类
 * 
 * @author hanheliang
 *
 */
public class TableModel extends DBElement {
	
	private String uuid;
	
	private String SetUuid;
	
	private Integer type;

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getSetUuid() {
		return SetUuid;
	}

	public void setSetUuid(String setUuid) {
		SetUuid = setUuid;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	
}
