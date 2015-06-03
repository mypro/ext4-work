package cn.net.dbi.table.model;

import java.lang.reflect.InvocationTargetException;

import org.apache.commons.beanutils.BeanUtils;

/**
 * 列模型，hibernate映射类
 * 
 * @author hanheliang
 *
 */
public class ColumnModel extends DBElement {
	
	private String uuid;
	
	private Integer seq;
	
	private String tableUuid;

	private String label;

	private String type;
	
	private Integer width;
	
	private Integer decimalWidth;
	
	private Integer isUnique;
	
	private String missing;
	
	private Integer showWidth;
	
	private String showAlign;
	
	private String paramTableUuid;
	
	private String paramColumnUuid;
	
	private String paramColumnLabelUuid;
	
	private String data;
	
	private String paramDefine;
	
	private String paramDefineName;
	
	private String metric;

	private String role;

	public String getData() {
		return data;
	}
	
	public Integer getDecimalWidth() {
		return decimalWidth;
	} 
	
	public Integer getIsUnique() {
		return isUnique;
	} 
	
	public String getLabel() {
		return label;
	}

	public String getMetric() {
		return metric;
	}

	public String getMissing() {
		return missing;
	}

	public String getParamColumnLabelUuid() {
		return paramColumnLabelUuid;
	}

	public String getParamColumnUuid() {
		return paramColumnUuid;
	} 

	public String getParamDefine() {
		return paramDefine;
	}

	public String getParamDefineName() {
		return paramDefineName;
	}

	public String getParamTableUuid() {
		return paramTableUuid;
	}

	public String getRole() {
		return role;
	}

	public Integer getSeq() {
		return seq;
	}

	
	public String getShowAlign() {
		return showAlign;
	}

	public Integer getShowWidth() {
		return showWidth;
	}

	public String getTableUuid() {
		return tableUuid;
	}

	public String getType() {
		return type;
	}

	public String getUuid() {
		return uuid;
	}

	public Integer getWidth() {
		return width;
	}

	public void setData(String data) {
		this.data = data;
	}

	public void setDecimalWidth(Integer decimalWidth) {
		this.decimalWidth = decimalWidth;
	}

	public void setIsUnique(Integer isUnique) {
		this.isUnique = isUnique;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public void setMetric(String metric) {
		this.metric = metric;
	}

	public void setMissing(String missing) {
		this.missing = missing;
	}

	public void setParamColumnLabelUuid(String paramColumnLabelUuid) {
		this.paramColumnLabelUuid = paramColumnLabelUuid;
	}

	public void setParamColumnUuid(String paramColumnUuid) {
		this.paramColumnUuid = paramColumnUuid;
	}

	public void setParamDefine(String paramDefine) {
		this.paramDefine = paramDefine;
	}

	public void setParamDefineName(String paramDefineName) {
		this.paramDefineName = paramDefineName;
	}

	public void setParamTableUuid(String paramTableUuid) {
		this.paramTableUuid = paramTableUuid;
	}


	public void setRole(String role) {
		this.role = role;
	}

	public void setSeq(Integer seq) {
		this.seq = seq;
	}

	public void setShowAlign(String showAlign) {
		this.showAlign = showAlign;
	}

	public void setShowWidth(Integer showWidth) {
		this.showWidth = showWidth;
	}

	public void setTableUuid(String tableUuid) {
		this.tableUuid = tableUuid;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}
	
	/*
	public ColumnModel getInstance(){
		ColumnModel newObj = new ColumnModel();
		try {
			BeanUtils.copyProperties(newObj, this);
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		return newObj;
	}
	*/
}
