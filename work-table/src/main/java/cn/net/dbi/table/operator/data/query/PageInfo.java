package cn.net.dbi.table.operator.data.query;

public class PageInfo {
	
	private int start;
	
	private int number;
	
	public PageInfo(int start, int number){
		this.start = start;
		this.number = number;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}
	
	
}
