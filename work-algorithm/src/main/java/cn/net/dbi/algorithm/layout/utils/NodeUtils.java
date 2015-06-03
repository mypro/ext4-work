package cn.net.dbi.algorithm.layout.utils;

import java.util.*;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MultiHashMap;
import org.apache.commons.collections.MultiMap;
import org.apache.commons.collections.Predicate;

import cn.net.dbi.algorithm.layout.element.Node;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.ICollectionIteratorCallback;


public class NodeUtils {
	
	public static double distance(Node node1, Node node2){
		return Math.sqrt(Math.pow(node1.getPosX()-node2.getPosX(), 2)
				+Math.pow(node1.getPosY()-node2.getPosY(), 2));
	}
	
	public static Node getNode(List<Node> nodes, String uuid){
		for(Iterator<Node> it=nodes.iterator();it.hasNext();){
			Node node = it.next();
			if(uuid.equals(node.getUuid())){
				return node;
			}
		}
		return null;
	}
	
	public static int getAverageX(List<Node> nodes){
//		int sum = 0;
//		for(Iterator<Node> it=nodes.iterator();it.hasNext();){
//			Node node = it.next();
//			sum += node.getPosX();
//		}
//		return sum/nodes.size();
		
		int left = findLeft(nodes).getPosX();
		int right = findRight(nodes).getPosX();
		return (left+right)/2;
	}
	
	public static int getAverageY(List<Node> nodes){
		int sum = 0;
		for(Iterator<Node> it=nodes.iterator();it.hasNext();){
			Node node = it.next();
			sum += node.getPosY();
		}
		return sum/nodes.size();
	}
	
	public static Node findLeft(List<Node> nodes){
		Node node = null;
		for(Iterator<Node> it=nodes.iterator();it.hasNext();){
			Node temp = it.next();
			if(null==node || temp.getPosX()<node.getPosX()){
				node = temp;
			}
		}
		return node;
	}
	public static Node findRight(List<Node> nodes){
		Node node = null;
		for(Iterator<Node> it=nodes.iterator();it.hasNext();){
			Node temp = it.next();
			if(null==node || temp.getPosX()>node.getPosX()){
				node = temp;
			}
		}
		return node;
	}
	public static Node findTop(List<Node> nodes){
		Node node = null;
		for(Iterator<Node> it=nodes.iterator();it.hasNext();){
			Node temp = it.next();
			if(null==node || temp.getPosY()<node.getPosY()){
				node = temp;
			}
		}
		return node;
	}
	public static Node findBottom(List<Node> nodes){
		Node node = null;
		for(Iterator<Node> it=nodes.iterator();it.hasNext();){
			Node temp = it.next();
			if(null==node || temp.getPosY()>node.getPosY()){
				node = temp;
			}
		}
		return node;
	}
	
	public static void moveLeft(List<Node> nodes, int distance){
		for(Iterator<Node> it=nodes.iterator();it.hasNext();){
			Node temp = it.next();
			temp.setPosX(temp.getPosX()-distance);
		}
	}
	
	public static void moveRight(List<Node> nodes, int distance){
		for(Iterator<Node> it=nodes.iterator();it.hasNext();){
			Node temp = it.next();
			temp.setPosX(temp.getPosX()+distance);
		}
	}
	
	public static void moveTop(List<Node> nodes, int distance){
		for(Iterator<Node> it=nodes.iterator();it.hasNext();){
			Node temp = it.next();
			temp.setPosY(temp.getPosY()-distance);
		}
	}
	
	public static void moveBottom(List<Node> nodes, int distance){
		for(Iterator<Node> it=nodes.iterator();it.hasNext();){
			Node temp = it.next();
			temp.setPosY(temp.getPosY()+distance);
		}
	}
	
	
	public static List<Node> clone(List<Node> nodes){
		List<Node> newList = new ArrayList<Node>();
		
		Map<String, Node> nodeCache = new HashMap<String, Node>();
		for(Iterator<Node> it=nodes.iterator();it.hasNext();){
			Node node = it.next();
			Node cloneNode = null;
			try {
				cloneNode = (Node)BeanUtils.cloneBean(node);
			} catch (Exception e) {
				e.printStackTrace();
			}
			newList.add(cloneNode);
			nodeCache.put(cloneNode.getUuid(), cloneNode);
		}
		
		for(Iterator<Node> it=newList.iterator();it.hasNext();){
			Node node = it.next();
			int neighbourSize = node.getNeighbourList().size();
			for(int i=0;i<neighbourSize;i++){
				String uuid = node.getNeighbourList().get(i).getUuid();
				node.getNeighbourList().set(i, nodeCache.get(uuid));
			}
		}
		
		return newList;
	}
	/**
	 * 找出所有核心节点
	 * 
	 * @param nodes
	 * @return
	 */
	public static List<Node> findCoreFactor(List<Node> nodes){
		List<Node> cores = new ArrayList<Node>();
		
		cores.addAll(nodes);
		
		CollectionUtils.filter(cores, new Predicate() {
			
			public boolean evaluate(Object object) {
				return ((Node)object).isCore();
			}
		});
		
		// try find the cores by myself
		if(0 == cores.size()){
			MultiMap bag = new MultiHashMap();
			for(Iterator<Node> nodeIt=nodes.iterator();nodeIt.hasNext();){
				Node node = nodeIt.next();
				int neighbourNumber = node.getNeighbourList().size();
				bag.put(neighbourNumber, node);
			}
			int max = 0;
			for(Iterator<Integer> numberIt = bag.keySet().iterator();numberIt.hasNext();){
				Integer number = numberIt.next();
				if(number > max){
					max = number;
				}
			}
			if(max>2){
				return (List<Node>)bag.get(max);
			}
		}
		
		return cores;
	}
	
	/**
	 * 在allNodes中， 找出所有与node有关系的节点
	 * @param node
	 * @param allNodes
	 * @return
	 */
	public static List<Node> filterNodeByRelation(final Node node, List<Node> allNodes){
		List<Node> nodes = new ArrayList<Node>();
		nodes.addAll(allNodes);
		CollectionUtils.filter(nodes, new Predicate() {
			public boolean evaluate(Object object) {
				return ((Node)object).getNeighbourList().contains(node);
			}
		});
		return nodes;
	}
	
	/**
	 * 根据关系来划分级别
	 * @param nodes
	 * @return
	 */
	public static List<List<Node>> fixLevelByRelation(List<Node> levelOne, List<Node> nodes, boolean random, IteratorLevelCallback callback){
		List<List<Node>> levels = new ArrayList<List<Node>>();
		
		List<Node> currentLevel = levelOne;
		
		// 先放第一层
		BoomCollectionsUtils.each(currentLevel, new ICollectionIteratorCallback() {
			public boolean fn(Object o) {
				((Node)o).setColor(Node.COLOR_RED);
				return true;
			}
		});
		if(null != callback){
			callback.handle(null, currentLevel);
		}
		if(random){
			BoomCollectionsUtils.randomSeq(currentLevel);
		}
		levels.add(currentLevel);
		
		// 循环找到所有与第一层有直接间接关系的节点
		while(true){
			List<Node> nextLevel = new ArrayList<Node>();
			for(Iterator<Node> nodeIt=currentLevel.iterator();nodeIt.hasNext();){
				Node node = nodeIt.next();
				List<Node> neighbours = new ArrayList<Node>();
				neighbours.addAll(node.getNeighbourList());
				
				CollectionUtils.filter(neighbours, new Predicate() {
					public boolean evaluate(Object object) {
						return Node.COLOR_NO == ((Node)object).getColor();
					}
				});
				BoomCollectionsUtils.each(neighbours, new ICollectionIteratorCallback() {
					public boolean fn(Object o) {
						((Node)o).setColor(Node.COLOR_RED);
						return true;
					}
				});
				if(null != callback){
					callback.handle(node, neighbours);
				}
				nextLevel.addAll(neighbours);
			}
			if(0 == nextLevel.size()){
				break;
			}
			if(random){
				BoomCollectionsUtils.randomSeq(nextLevel);
			}
			levels.add(nextLevel);
			currentLevel = nextLevel;
		}
		
		// 最后一层，无关系的因子
		List<Node> lastLevel = new ArrayList<Node>();
		lastLevel.addAll(nodes);
		CollectionUtils.filter(lastLevel, new Predicate() {
			public boolean evaluate(Object object) {
				return Node.COLOR_NO == ((Node)object).getColor();
			}
		});
		if(random){
			BoomCollectionsUtils.randomSeq(lastLevel);
		}
		levels.add(lastLevel);
		
		return levels;
	}
	
	public static void horizon(int center_x, int center_y, int height, 
			int padding, List<Node> nodeList){
		int size = nodeList.size();
		int totalWidth = (size-1)*padding;
		int right = center_x + totalWidth/2;
		for(int i=0;i<size;i++){
			Node node = nodeList.get(i);
			node.setPosX(right-i*padding);
			node.setPosY(center_y+height);
		}
	}
	
	public static void horizon(int center_x, int center_y, int radius,
			 double startAngle, double angle, List<Node> nodeList){
		int edge = nodeList.size();
		double bias = startAngle;		
		
		for(int i=0;i<edge;i++){
			int x = center_x
					+ (int)(radius / Math.tan(Math.toRadians(bias)));
			int y = center_y
					+ radius;
			nodeList.get(i).setPosX(x);
			nodeList.get(i).setPosY(y);
			nodeList.get(i).setHasFixPostion(true);
			bias+=angle;
		}
	}
	
	/**
	 * 旋转布局
	 * 
	 * @param center_x 		圆心X
	 * @param center_y		圆心Y
	 * @param radius		直径
	 * @param startAngle	开始角度
	 * @param endAngle		结束角度
	 * @param nodeList
	 */
	public static void rotate(int center_x, int center_y, int radius,
							 double startAngle, double angle, List<Node> nodeList){
		int edge = nodeList.size();
		double bias = startAngle+180-(180-angle)/2;		
		int edgeLen = (int)(radius * Math.sin(Math.toRadians(angle/2))) * 2;
		
		nodeList.get(0).setPosX(center_x+(int)(radius*Math.cos(Math.toRadians(startAngle))));
		nodeList.get(0).setPosY(center_y+(int)(radius*Math.sin(Math.toRadians(startAngle))));
		
		for(int i=1;i<edge;i++){
			int x = nodeList.get(i-1).getPosX() 
					+ (int)(edgeLen * Math.cos(Math.toRadians(bias)));
			int y = nodeList.get(i-1).getPosY() 
					+ (int)(edgeLen * Math.sin(Math.toRadians(bias)));
			nodeList.get(i).setPosX(x);
			nodeList.get(i).setPosY(y);
			nodeList.get(i).setHasFixPostion(true);
			bias+=angle;
		}
	}
	
	/**
	 * 调整各个节点位置
	 * 
	 * @param nodeList
	 * @param frame
	 */
	public static void adjustPostion(List<Node> nodeList, int paddingLeft, int paddingTop){
		int minX = Integer.MAX_VALUE;
		int maxX = Integer.MIN_VALUE;
		int minY = Integer.MAX_VALUE;
		int maxY = Integer.MIN_VALUE;
		
		for(Iterator<Node> it=nodeList.iterator();it.hasNext();){
			Node node = it.next();
			if(node.getPosX()<minX){
				minX = node.getPosX();
			}
			if(node.getPosX()>maxX){
				maxX = node.getPosX();
			}
			if(node.getPosY()<minY){
				minY = node.getPosY();
			}
			if(node.getPosY()>maxY){
				maxY = node.getPosY();
			}
		}
		
		int rightShift = 0;
		if(minX<0){
			rightShift = paddingLeft-minX;
		}else if(minX>paddingLeft){
			rightShift = paddingLeft-minX;
		}
		
		
		int downShift = 0;
		if(minY<0){
			downShift = paddingTop-minY;
		}else if(minY > paddingTop){
			downShift = paddingTop-minY;
		}
		
		if((0!=rightShift) || (0!=downShift)){
			for(Iterator<Node> it=nodeList.iterator();it.hasNext();){
				Node node = it.next();
				node.setPosX(node.getPosX()+rightShift);
				node.setPosY(node.getPosY()+downShift);
			}
		}
		
	}
}
