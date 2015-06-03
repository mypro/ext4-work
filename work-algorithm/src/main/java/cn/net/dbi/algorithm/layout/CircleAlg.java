package cn.net.dbi.algorithm.layout;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.MultiHashMap;
import org.apache.commons.collections.MultiMap;

import cn.net.dbi.algorithm.layout.element.Node;
import cn.net.dbi.algorithm.layout.element.Relation;
import cn.net.dbi.algorithm.layout.utils.AngleUtils;
import cn.net.dbi.algorithm.layout.utils.NodeUtils;

public class CircleAlg {
	
	public static int DISTANCE_DEFAULT = 120;
	
	public static int PADDING = 100;
	
	public static int ANGLE_LEAF = 240;
	
	/* 随机值用于震荡*/
	public static int randomVal = 1;
	
	public static void calculate(List<Node> nodeList,
			   List<Relation> relationList){
		if(0 == nodeList.size()){
			return;
		}
		
		int center_x = 300;
		int center_y = 300;
		
		List<Node> cores = NodeUtils.findCoreFactor(nodeList);
		
		if(0 == cores.size()){
			
			calculateNoCore(nodeList, relationList);
		}else if(1 <= cores.size()){
			Node core = cores.get(0);
			core.setPosX(center_x);
			core.setPosY(center_y);
			core.setHasFixPostion(true);
			
			if(1 == nodeList.size()){
				return;
			}
			
			/* 借用树布局的位置坐标*/
			List<Node> treeNodes = NodeUtils.clone(nodeList);
			MultiHashMap childsCache = (MultiHashMap)TreeAlg.calculate(treeNodes, relationList);
			
			/**
			 * 第一圈
			 */
			/* 确认最右边节点和最左边节点*/
			List<Node> level1 = (List<Node>)childsCache.getCollection(core.getUuid());
			Node level1Right = level1.get(0);
			Node level1Left = level1.get(level1.size()-1);
			List<Node> rightNodes = new ArrayList<Node>();
			findChild(level1Right, childsCache, rightNodes);
			List<Node> leftNodes = new ArrayList<Node>();
			findChild(level1Left, childsCache, leftNodes);
			Node rightNode = NodeUtils.findRight(rightNodes);
			Node leftNode = NodeUtils.findLeft(leftNodes);
			
			/* 计算各节点所占角度*/
			double initAngle = 0;
			Map<String, Double> distances = new HashMap<String, Double>();
			int totalDistance = 0;
			for(int i=0;i<level1.size()-1;i++){
				double distance = level1.get(i).getPosX()-level1.get(i+1).getPosX();
				distances.put(level1.get(i).getUuid(), distance);
				totalDistance += distance;
			}
			distances.put(level1.get(level1.size()-1).getUuid(), 
									(double)((rightNode.getPosX()-level1Right.getPosX())
									+(level1Left.getPosX()-leftNode.getPosX())
									+TreeAlg.DISTANCE_MIN*3));
			totalDistance += distances.get(level1.get(level1.size()-1).getUuid());
			Map<String, Double> angles = new HashMap<String, Double>();
			for(int i=0;i<level1.size();i++){
				Node node = level1.get(i);
//				double angle = distances.get(node.getUuid())*360/totalDistance;
				angles.put(node.getUuid(), initAngle);
				initAngle += distances.get(node.getUuid())*360/totalDistance;
			}
			/* 计算各节点距父亲的长度*/
			Map<String, Double> lengths = new HashMap<String, Double>();
			Node root = NodeUtils.getNode(treeNodes, core.getUuid());
			for(int i=0;i<level1.size();i++){
				Node node = level1.get(i);
				double length = NodeUtils.distance(node, root);
				lengths.put(node.getUuid(), length);
			}
			
			for(Iterator<Node> it=level1.iterator();it.hasNext();){
				Node nodeCache = it.next();
				String uuid = nodeCache.getUuid();
				double length = lengths.get(uuid);
				double angle = angles.get(uuid);
				double x = core.getPosX() + length * Math.cos(Math.toRadians(angle));
				double y = core.getPosY() + length * Math.sin(Math.toRadians(angle));
				
				Node node = NodeUtils.getNode(nodeList, uuid);
				node.setPosX((int)x);
				node.setPosY((int)y);
			}
			
			/* 其他圈*/
			List<Node> previousLevel = level1;
			List<Node> currentLevel ;
			do{
				currentLevel = new ArrayList<Node>();
				for(int i=0;i<previousLevel.size();i++){
					Node previousNode = previousLevel.get(i);
					List<Node> nodes = (List<Node>)childsCache.getCollection(previousNode.getUuid());
					if(CollectionUtils.isEmpty(nodes)){
						continue ;
					}
					
					currentLevel.addAll(nodes);
					
					Node parentNode = NodeUtils.getNode(nodeList, previousNode.getUuid());
					double rootAngle = AngleUtils.calculateAngleByTan(
							core.getPosX(), core.getPosY(),
							parentNode.getPosX(), parentNode.getPosY()
						);
					for(int j=0;j<nodes.size();j++){
						Node currentNode = nodes.get(j);
						
						double angle = rootAngle + AngleUtils.calculateAngleByTan
									(previousNode.getPosX(), previousNode.getPosY(),
									currentNode.getPosX(), currentNode.getPosY())-90;
						double length = NodeUtils.distance(currentNode, previousNode);
						
						double x = parentNode.getPosX() + length * Math.cos(Math.toRadians(angle));
						double y = parentNode.getPosY() + length * Math.sin(Math.toRadians(angle));
					
						Node node = NodeUtils.getNode(nodeList, currentNode.getUuid());
						node.setPosX((int)x);
						node.setPosY((int)y);
					}
				}
				previousLevel = currentLevel;
			}while(currentLevel.size()>0);
		}
		
		// 调整整体位置
		NodeUtils.adjustPostion(nodeList, 30, 30);
	}
	
	public static void findChild(Node root, MultiHashMap childsCache, List<Node> nodes){
		nodes.add(root);
		List<Node> childs = (List<Node>)childsCache.getCollection(root.getUuid());
		if(null == childs){
			return;
		}
		for(Iterator<Node> nodeIt=childs.iterator();nodeIt.hasNext();){
			Node node = nodeIt.next();
			findChild(node, childsCache, nodes);
		}
	}
	
	public static void calculate1(List<Node> nodeList,
			   List<Relation> relationList){
		if(0 == nodeList.size()){
			return;
		}
		
		int center_x = 300;
		int center_y = 300;
		int radius = DISTANCE_DEFAULT;
		
		List<Node> cores = NodeUtils.findCoreFactor(nodeList);
		
		if(0 == cores.size()){
			
			calculateNoCore(nodeList, relationList);
		}else if(1 == cores.size()){
			cores.get(0).setPosX(center_x);
			cores.get(0).setPosY(center_y);
			cores.get(0).setHasFixPostion(true);
			
			if(1 == nodeList.size()){
				return;
			}
			
			List<List<Node>> levels = NodeUtils.fixLevelByRelation(cores, nodeList, false, null);
			levels.remove(0);
			
			// 第一圈是围绕圆心360度
			NodeUtils.rotate(center_x, center_y, radius, 0-180, 360/levels.get(0).size(), levels.get(0));
			
			// 中间的都是180度
			List<Node> previousLevel = levels.get(0);
			for(int i=1;i<levels.size()-1;i++){
				List<Node> level = levels.get(i);
				for(int j=0;j<previousLevel.size();j++){
					Node previousNode = previousLevel.get(j);
					List<Node> nodes = NodeUtils.filterNodeByRelation(previousNode, level);
					if(0 == nodes.size()){
						continue;
					}
					double rootAngle = AngleUtils.calculateAngleByTan
							(center_x, center_y, previousNode.getPosX(), previousNode.getPosY());
					double angle = ANGLE_LEAF/(nodes.size()+1);
					
					double initAngle = rootAngle-90+angle/2;
					
					NodeUtils.rotate(previousNode.getPosX(), previousNode.getPosY(), radius, 
							initAngle, angle, nodes);
					
					// 检测两个分支上出现了覆盖的情况
					
				}
				previousLevel = level;
			}
			
			// 最后一圈无关系的围绕圆心360度
			if(0 != levels.get(levels.size()-1).size()){
				NodeUtils.rotate(center_x, center_y, radius*(levels.size()-2), 90, 
						360/levels.get(levels.size()-1).size(), levels.get(levels.size()-1));
			}
		}else{
			List<List<Node>> levels = NodeUtils.fixLevelByRelation(cores, nodeList, false, null);
			
			// 第一圈是围绕圆心360度
			NodeUtils.rotate(center_x, center_y, radius/3, new Random().nextInt(360), 360/levels.get(0).size(), levels.get(0));
				
			// 中间的都是180度
			List<Node> previousLevel = levels.get(0);
			for(int i=1;i<levels.size()-1;i++){
				List<Node> level = levels.get(i);
				for(int j=0;j<previousLevel.size();j++){
					Node previousNode = previousLevel.get(j);
					List<Node> nodes = NodeUtils.filterNodeByRelation(previousNode, level);
					if(0 == nodes.size()){
						continue;
					}
					double rootAngle = AngleUtils.calculateAngleByTan
							(center_x, center_y, previousNode.getPosX(), previousNode.getPosY());
					double angle = ANGLE_LEAF/(nodes.size()+1);
					
					NodeUtils.rotate(previousNode.getPosX(), previousNode.getPosY(), radius, 
							rootAngle-90+angle/2, angle, nodes);
				}
				previousLevel = level;
			}
			
			// 最后一圈无关系的围绕圆心360度
			if(0 != levels.get(levels.size()-1).size()){
				NodeUtils.rotate(center_x, center_y, radius*(levels.size()-2), 90, 
						360/levels.get(levels.size()-1).size(), levels.get(levels.size()-1));
			}
		}
		
		// 调整整体位置
		NodeUtils.adjustPostion(nodeList, 30, 30);
	}
	
	public static void calculateNoCore(List<Node> nodeList,
			   List<Relation> relationList){
		
		if(0 == nodeList.size()){
			return;
		}else if(1 == nodeList.size()){
			nodeList.get(0).setPosX(PADDING);
			nodeList.get(0).setPosY(PADDING);
			nodeList.get(0).setHasFixPostion(true);
			return;
		}else if(2 == nodeList.size()){
			int angle = 360/nodeList.size();
			int radius = PADDING;
			int center_x = PADDING + DISTANCE_DEFAULT;
			int center_y = PADDING + DISTANCE_DEFAULT;
			NodeUtils.rotate(center_x, center_y, radius, 0-90, angle, nodeList);
			return;
		}else{
			int angle = 360/nodeList.size();
			int radius = (int)(DISTANCE_DEFAULT/Math.sin(Math.toRadians(angle/2)))/2;
			int center_x = PADDING + radius;
			int center_y = PADDING + radius;
			NodeUtils.rotate(center_x, center_y, radius, 0-90, angle, nodeList);
			return;
		}
	}
	
	
}
