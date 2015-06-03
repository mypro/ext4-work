package cn.net.dbi.algorithm.layout.element;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;


public class Ring {
	
	private int distance;
	
	/* ���һ����ȷ���Ľڵ㣬������ʱ�õ���Ϊ��¼*/
	private Node lastFixNode;
	
	List<Node> nodeList = new LinkedList<Node>();
	
	public Node getLastFixNode() {
		return lastFixNode;
	}

	public void setLastFixNode(Node lastFixNode) {
		this.lastFixNode = lastFixNode;
	}

	public int getDistance() {
		return distance;
	}

	public void setDistance(int distance) {
		this.distance = distance;
	}

	public List<Node> getNodeList() {
		return nodeList;
	}
	
	public int getSize(){
		return this.nodeList.size();
	}

	public void setNodeList(List<Node> nodeList) {
		this.nodeList = nodeList;
	}
	
	@Override
	public String toString() {
		StringBuffer buffer = new StringBuffer();
		for(Iterator<Node> it=nodeList.iterator();it.hasNext();){
			Node node = it.next();
			buffer.append(node.getText()).append("->");
		}
		return buffer.toString();
	}

	/**
	 * �Ƿ����һ����
	 * @param smallRing
	 * @return
	 */
	public boolean isContain(Ring smallRing){
		for(Iterator<Node> it=smallRing.nodeList.iterator();it.hasNext();){
			Node node = it.next();
			if(!this.nodeList.contains(node)){
				return false;
			}
		}
		return true;
	}
	
	/**
	 * �Ƿ��Ͻڵ㶼�����ù�λ��
	 * 
	 * @return
	 */
	public boolean isAllFixed(){
		for(Iterator<Node> it=this.nodeList.iterator();it.hasNext();){
			Node node = it.next();
			if(!node.isHasFixPostion()){
				return false;
			}
		}
		return true;
	}
	
	public Ring getRingCopy(){
		Ring newRing = new Ring();
		newRing.setNodeList(this.getNodeList());
		newRing.setDistance(this.getDistance());
		return newRing;
	}
	
	/**
	 * �鿴�ڵ��ڻ��е�λ��
	 * 
	 * @param node
	 * @return
	 */
	public int indexOf(Node node){
		int k;
		for(k=0;k<getSize();k++){
			Node nodeInRing = getNodeList().get(k);
			if(node.equals(nodeInRing)){
				return k;
			}
		}
		return -1;
	}
	
	/**
	 * �Ż����б?�����������
	 * @param ringList
	 * @return
	 */
	public static List<Ring> optimize(List<Ring> ringList){
		List<Ring> optimizeList = new ArrayList<Ring>();
		
		for(Iterator<Ring> srcIt=ringList.iterator();srcIt.hasNext();){
			Ring srcRing = srcIt.next();

			/* �Ƿ�srcRing�ŵ�optimizeList��ĩβ*/
			boolean isAppend = true;
			
			for(int i=0;i<optimizeList.size();i++){
				Ring ring = optimizeList.get(i);
				if(ring.getSize()>=srcRing.getSize()){
					if(ring.isContain(srcRing)){
						//���srcRing���Ż�����,���ܷŵ�optimizeList��ĩβ
						isAppend = false;
					}
				}else{
					if(srcRing.isContain(ring)){
						//���srcRing�Ż���Ŀ�������е�ring,ͬ���ܷŵ�optimizeList��ĩβ
						isAppend = false;
						optimizeList.set(i, srcRing);
					}
				}
			}
			
			/* srcRing�ŵ�optimizeList��ĩβ*/
			if(isAppend){
				optimizeList.add(srcRing);
			}
		}
		
		System.out.println("\r\r �Ż���Ļ�·����: ");
		for(int i=0;i<optimizeList.size();i++){
			Ring ring = optimizeList.get(i);
			for(int j=0;j<ring.getNodeList().size();j++){
				Node node = ring.getNodeList().get(j);
				System.out.print(node.getText()+" ");
			}
			System.out.println();
		}
		return optimizeList;
	}
	
	
}
