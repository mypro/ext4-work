/**
 * 
 */
package cn.net.dbi.param.bean;

/**
 * @author jiawenlong
 *
 */
public class ValueLabel {

	private String uuid;
	private String columnUuid;
	private String value;
	private String label;
	private int type;
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public String getColumnUuid() {
		return columnUuid;
	}
	public void setColumnUuid(String columnUuid) {
		this.columnUuid = columnUuid;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
}
