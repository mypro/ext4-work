package cn.net.dbi.algorithm.layout;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MultiHashMap;
import org.apache.commons.collections.MultiMap;

import cn.net.dbi.algorithm.layout.element.Node;
import cn.net.dbi.algorithm.layout.element.Relation;
import cn.net.dbi.algorithm.layout.utils.AngleUtils;
import cn.net.dbi.algorithm.layout.utils.IteratorLevelCallback;
import cn.net.dbi.algorithm.layout.utils.NodeUtils;
import cn.net.dbi.boom.utils.BoomCollectionsUtils;
import cn.net.dbi.boom.utils.ICollectionIteratorCallback;

public class TreeAlg {
	
	public static int DISTANCE_DEFAULT = 120;
	
	public static int PADDING = 100;
	
	public static int ANGLE_LEAF = 180;
	
	public static int DISTANCE_MIN = DISTANCE_DEFAULT;
	
	private int distance_min;
	
	public MultiMap handle(List<Node> nodeList,
			   List<Relation> relationList){
		// find max node
		int maxSize = 0;
		for(Iterator<Node> it = nodeList.iterator();it.hasNext();){
			Node node = it.next();
			if(node.getSize()>maxSize){
				maxSize = node.getSize();
			}
		}
		
		this.distance_min = maxSize*4;
		
		/* 确定根节点*/
		Node root = fixRootNode(nodeList);
		
		/* 确定各个层级的树节点*/
		MultiMap childsCache = new MultiHashMap();
		List<List<Node>> levels = fixEveryLevel(root, nodeList, childsCache);
		
		/* 层层布局 */
		int root_x = 300;
		int root_y = 50;
		root.setPosX(root_x);
		root.setPosY(root_y);
		List<Node> previousLevel = levels.get(0);
		for(int i=1;i<levels.size()-1;i++){
			List<Node> level = levels.get(i);
			int left = Integer.MAX_VALUE/2;
			int right = Integer.MIN_VALUE/2; 
			
			for(int j=0;j<previousLevel.size();j++){
				Node previousNode = previousLevel.get(j);
				List<Node> nodes = NodeUtils.filterNodeByRelation(previousNode, level);
				if(0 == nodes.size()){
					continue;
				}
				
				/* 树的直接叶节点转圈分布*/
				NodeUtils.horizon(previousNode.getPosX(), previousNode.getPosY(), this.distance_min,
						this.distance_min, nodes);
				
				/* 防止树的两个分支重合 */
				right = NodeUtils.findRight(nodes).getPosX();
				if(left-right<this.distance_min){
					/* 当前分支所有叶节点右移动 */
					NodeUtils.moveLeft(nodes, this.distance_min+right-left);
				}
				left = NodeUtils.findLeft(nodes).getPosX();
			}
			previousLevel = level;
		}
		
		// 从树的叶子层向根遍历，逐个更新父节点的横坐标位置
		for(int i=levels.size()-3;i>=0;i--){
			List<Node> level = levels.get(i);
			
			for(int j=0;j<level.size();j++){
				Node node = level.get(j);
				List<Node> childs = (List<Node>)childsCache.get(node.getUuid());
				if(CollectionUtils.isEmpty(childs)){
					continue;
				}
				int originalX = node.getPosX();
				node.setPosX(NodeUtils.getAverageX(childs));
				int leftShiftX = originalX-node.getPosX();
				
				// 左侧的同级别因子随之移动
				for(int k=j+1;k<level.size();k++){
					level.get(k).setPosX(
							level.get(k).getPosX()-leftShiftX);
				}
			}
		}
	
		// 最后一圈无关系的围绕圆心360度
		if(0 != levels.get(levels.size()-1).size()){
			BoomCollectionsUtils.randomSeq(levels.get(levels.size()-1));
			NodeUtils.rotate(root_x, root_y, this.distance_min*(levels.size()-2), 90, 
					360/levels.get(levels.size()-1).size(), levels.get(levels.size()-1));
		}
		
		// 调整整体位置
		NodeUtils.adjustPostion(nodeList, 30, 30);
		
		return childsCache;
	}
	
	public static MultiMap calculate(List<Node> nodeList,
			   List<Relation> relationList){
		if(0 == nodeList.size()){
			return null;
		}
		
		return new TreeAlg().handle(nodeList, relationList);
//		
//		/* 确定根节点*/
//		Node root = fixRootNode(nodeList);
//		
//		/* 确定各个层级的树节点*/
//		MultiMap childsCache = new MultiHashMap();
//		List<List<Node>> levels = fixEveryLevel(root, nodeList, childsCache);
//		
//		/* 层层布局 */
//		int root_x = 300;
//		int root_y = 50;
//		root.setPosX(root_x);
//		root.setPosY(root_y);
//		List<Node> previousLevel = levels.get(0);
//		for(int i=1;i<levels.size()-1;i++){
//			List<Node> level = levels.get(i);
//			int left = Integer.MAX_VALUE/2;
//			int right = Integer.MIN_VALUE/2; 
//			
//			for(int j=0;j<previousLevel.size();j++){
//				Node previousNode = previousLevel.get(j);
//				List<Node> nodes = NodeUtils.filterNodeByRelation(previousNode, level);
//				if(0 == nodes.size()){
//					continue;
//				}
//				
//				/* 树的直接叶节点转圈分布*/
////				double angle = ANGLE_LEAF/(nodes.size()+1);
////				NodeUtils.horizon(previousNode.getPosX(), previousNode.getPosY(), DISTANCE_DEFAULT, 
////						angle, angle, nodes);
//				NodeUtils.horizon(previousNode.getPosX(), previousNode.getPosY(), DISTANCE_DEFAULT,
//						DISTANCE_MIN, nodes);
//				
//				/* 防止树的两个分支重合 */
//				right = NodeUtils.findRight(nodes).getPosX();
//				if(left-right<DISTANCE_MIN){
//					/* 当前分支所有叶节点右移动 */
//					NodeUtils.moveLeft(nodes, DISTANCE_MIN+right-left);
//				}
//				left = NodeUtils.findLeft(nodes).getPosX();
//			}
//			previousLevel = level;
//		}
//		
//		// 从树的叶子层向根遍历，逐个更新父节点的横坐标位置
//		for(int i=levels.size()-3;i>=0;i--){
//			List<Node> level = levels.get(i);
//			
//			for(int j=0;j<level.size();j++){
//				Node node = level.get(j);
//				List<Node> childs = (List<Node>)childsCache.get(node.getUuid());
//				if(CollectionUtils.isEmpty(childs)){
//					continue;
//				}
//				int originalX = node.getPosX();
//				node.setPosX(NodeUtils.getAverageX(childs));
//				int leftShiftX = originalX-node.getPosX();
//				
//				// 左侧的同级别因子随之移动
//				for(int k=j+1;k<level.size();k++){
//					level.get(k).setPosX(
//							level.get(k).getPosX()-leftShiftX);
//				}
//			}
//		}
//	
//		// 最后一圈无关系的围绕圆心360度
//		if(0 != levels.get(levels.size()-1).size()){
//			BoomCollectionsUtils.randomSeq(levels.get(levels.size()-1));
//			NodeUtils.rotate(root_x, root_y, DISTANCE_DEFAULT*(levels.size()-2), 90, 
//					360/levels.get(levels.size()-1).size(), levels.get(levels.size()-1));
//		}
//		
//		// 调整整体位置
//		NodeUtils.adjustPostion(nodeList, 30, 30);
//		
//		return childsCache;
	}
	
	private static List<List<Node>> fixEveryLevel(Node root, List<Node> nodeList,final MultiMap childs){
		List<Node> levelOne = new ArrayList<Node>();
		levelOne.add(root);
		
		return NodeUtils.fixLevelByRelation(levelOne, nodeList, false, new IteratorLevelCallback() {
			public void handle(Node parent, List<Node> nextLevel) {
				if(null == parent){
					return;
				}
				for(Iterator<Node> nodeIt=nextLevel.iterator();nodeIt.hasNext();){
					childs.put(parent.getUuid(), nodeIt.next());
				}

				
			}
		});
	}
	
	public static Node fixRootNode(List<Node> nodeList){
		List<Node> cores = NodeUtils.findCoreFactor(nodeList);
		if(0 == cores.size()){
			return nodeList.get(0);
		}else {
			return cores.get(0);
		}
	}
}
