package cn.net.dbi.algorithm.layout.element;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

//import com.hhl.Constant;

public class Relation {
	
	private int node1Id;
	
	private int node2Id;
	
	private Node node1;
	
	private Node node2;
	
	private boolean isArrow1;
	
	private boolean isArrow2;
	
	private String lable1;
	
	private String lable2;
	
	private List<String> lableList = new ArrayList<String>();
	

	/* ���ڹ�ȱ���*/
	private int color = 0;
	
	//-----------------���������û���ʾ---------------
	
	private int showColor;

	private int width=2;
	
	private int fontColor;
	
	private int fontBlod=2;
	
	//-----------------------------------------------
	
	private String uuid;
	
	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getLable1() {
		return lable1;
	}

	public void setLable1(String lable1) {
		this.lable1 = lable1;
	}

	public String getLable2() {
		return lable2;
	}

	public void setLable2(String lable2) {
		this.lable2 = lable2;
	}

	public String getLable(){
		StringBuffer buf = new StringBuffer();
		boolean isFirst = true;
		if(lable1!=null && !"".equals(lable1)){
			if(isFirst){
				isFirst = false;
			}else{
				buf.append(";");
			}
			buf.append(lable1);
		}
		if(lable2!=null && !"".equals(lable2)){
			if(isFirst){
				isFirst = false;
			}else{
				buf.append(";");
			}
			buf.append(lable2);
		}
		
		for(Iterator<String> it=this.lableList.iterator();it.hasNext();){
			String s = it.next();
			if("".equals(s)||(null==s)){
				continue;
			}
			if(isFirst){
				isFirst = false;
			}else{
				buf.append(";");
			}
			buf.append(s);
		}
		return buf.toString();
	}
	
	public int getFontColor() {
		return fontColor;
	}

	public void setFontColor(int fontColor) {
		this.fontColor = fontColor;
	}

	public int getFontBlod() {
		return fontBlod;
	}

	public void setFontBlod(int fontBlod) {
		this.fontBlod = fontBlod;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public int getShowColor() {
		return showColor;
	}

	public void setShowColor(int showColor) {
		this.showColor = showColor;
	}

	public int getColor() {
		return color;
	}

	public void setColor(int color) {
		this.color = color;
	}

	public int getNode1Id() {
		return node1Id;
	}

	public void setNode1Id(int node1Id) {
		this.node1Id = node1Id;
	}

	public int getNode2Id() {
		return node2Id;
	}

	public void setNode2Id(int node2Id) {
		this.node2Id = node2Id;
	}

//	public List<String> getLableList() {
//		return lableList;
//	}

	public void setLableList(List<String> lableList) {
		this.lableList = lableList;
	}

	public boolean isArrow1() {
		return isArrow1;
	}

	public void setArrow1(boolean isArrow1) {
		this.isArrow1 = isArrow1;
	}

	public boolean isArrow2() {
		return isArrow2;
	}

	public void setArrow2(boolean isArrow2) {
		this.isArrow2 = isArrow2;
	}
	
	public Node getNode1() {
		return node1;
	}

	public void setNode1(Node node1) {
		this.node1 = node1;
	}

	public Node getNode2() {
		return node2;
	}

	public void setNode2(Node node2) {
		this.node2 = node2;
	}
	
	public Node getAnotherNode(Node node){
		if(node1.equals(node) && !node2.equals(node)){
			return node2;
		}else if(!node1.equals(node) && node2.equals(node)){
			return node1;
		}else{
			return null;
		}
		
	}

	@Override
	public String toString() {
		return node1.getText() + " -- " + node2.getText();
	}
	
	
}
