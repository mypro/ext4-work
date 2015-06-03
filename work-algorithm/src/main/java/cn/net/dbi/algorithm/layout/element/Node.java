package cn.net.dbi.algorithm.layout.element;

import java.util.ArrayList;
import java.util.List;

public class Node {
	
	public static final int COLOR_NO=0;
	public static final int COLOR_RED=1;
	public static final int COLOR_GRAY=2;
	public static final int COLOR_BLACK=3;
	
	private String uuid;
	
	private int id;
	
	private String text;
	
	private List<Node> neighbourList = new ArrayList<Node>();
	
	private boolean isInStack = false;
	
	private int posX;
	
	private int posY;
	
	private boolean isAnchor = false;
	
	private boolean HasFixPostion = false;
	
	private boolean isVertical ;
	
	private int color = COLOR_NO;
	
	private int size = 0;
	
	// 是否是核
	private boolean isCore = false;
	
	
	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public boolean isVertical() {
		return isVertical;
	}

	public void setVertical(boolean isVertical) {
		this.isVertical = isVertical;
	}

	public boolean isHasFixPostion() {
		return HasFixPostion;
	}

	public void setHasFixPostion(boolean hasFixPostion) {
		HasFixPostion = hasFixPostion;
	}

	public boolean isAnchor() {
		return isAnchor;
	}

	public void setAnchor(boolean isAnchor) {
		this.isAnchor = isAnchor;
	}

	public boolean isInStack() {
		return isInStack;
	}

	public void setInStack(boolean isInStack) {
		this.isInStack = isInStack;
	}

	public List<Node> getNeighbourList() {
		return neighbourList;
	}

	public void setNeighbourList(List<Node> neighbourList) {
		this.neighbourList = neighbourList;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getPosX() {
		return posX;
	}

	public void setPosX(int posX) {
		this.posX = posX;
	}

	public int getPosY() {
		return posY;
	}

	public void setPosY(int posY) {
		this.posY = posY;
	}

	public boolean isCore() {
		return isCore;
	}

	public void setCore(boolean isCore) {
		this.isCore = isCore;
	}

	public int getColor() {
		return color;
	}

	public void setColor(int color) {
		this.color = color;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + id;
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Node other = (Node) obj;
		if (id != other.id)
			return false;
		if (null!=text && !text.equals(other.text) )
			return false;
		return true;
	}

	@Override
	public String toString() {
		
		return text+"  id="+id+" posX="+posX+" posY="+posY;
	}
	
	
	
}
