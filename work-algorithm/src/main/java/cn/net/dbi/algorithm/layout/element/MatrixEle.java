package cn.net.dbi.algorithm.layout.element;

import java.util.*;

/**
 * �����Ԫ��
 * 
 * @author Administrator
 *
 */
public class MatrixEle {
	
	private int indexI;
	
	private int indexJ;
	
	private int minDist;
	
	private int direction;
	
	private List<Relation> pathList = new ArrayList<Relation>();
	
	private List<Node> nodeSeq = new ArrayList<Node>();

	public int getDirection() {
		return direction;
	}

	public void setDirection(int direction) {
		this.direction = direction;
	}

	public List<Node> getNodeSeq() {
		return nodeSeq;
	}

	public void setNodeSeq(List<Node> nodeSeq) {
		this.nodeSeq = nodeSeq;
	}

	public int getMinDist() {
		return minDist;
	}

	public void setMinDist(int minDist) {
		this.minDist = minDist;
	}

	public List<Relation> getPathList() {
		return pathList;
	}

	public void setPathList(List<Relation> pathList) {
		this.pathList = pathList;
	}

	public int getIndexI() {
		return indexI;
	}

	public void setIndexI(int indexI) {
		this.indexI = indexI;
	}

	public int getIndexJ() {
		return indexJ;
	}

	public void setIndexJ(int indexJ) {
		this.indexJ = indexJ;
	}

	@Override
	public String toString() {
		StringBuffer buff = new StringBuffer();
		for(Iterator<Node> it=this.nodeSeq.iterator();it.hasNext();){
			buff.append(it.next().getText()).append(" ");
		}
		return indexI+"->"+indexJ+"="+minDist+" "+buff;
	}
	
	
}
