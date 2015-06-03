/**
 * 
 */
package cn.net.dbi.param.bean;

/**
 * @author jiawenlong
 *
 */
public class Type {

	private String uuid;
	private String description;
	private String format;
	private Integer type;
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getFormat() {
		return format;
	}
	public void setFormat(String format) {
		this.format = format;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
}
