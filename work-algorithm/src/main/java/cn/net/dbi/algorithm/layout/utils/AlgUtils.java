package cn.net.dbi.algorithm.layout.utils;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Stack;

import cn.net.dbi.algorithm.layout.element.MatrixEle;
import cn.net.dbi.algorithm.layout.element.Node;
import cn.net.dbi.algorithm.layout.element.Relation;
import cn.net.dbi.algorithm.layout.element.Ring;
import cn.net.dbi.algorithm.layout.utils.AlgUtils;
import cn.net.dbi.algorithm.layout.GeneralAlg;

public class AlgUtils {
	
	public static DfsHandler searchPathDfsHandler = new DfsHandler() {
		
		public void handler(Stack stack, Object handlerParam) {
			
			List<Ring> allRingList = (List<Ring>)handlerParam;
			
			if(2 == stack.size()){
				// do nothing
			}else{
				Ring ring = new Ring();
				ring.setDistance(GeneralAlg.DISTANCE_DEFAULT);
				ring.getNodeList().addAll(stack);
				allRingList.add(ring);
				
//				for(int i=0;i<ring.getNodeList().size();i++){
//					System.out.print(((Node)ring.getNodeList().get(i)).getText()+" ");
//				}
			}
		}
	};
	
	/**
	 * @param node1
	 * @param node2
	 * @return
	 */
	public static Relation getRelationByNode(List<Relation> relationList, Node node1, Node node2){
		
		for(Iterator<Relation> it=relationList.iterator(); it.hasNext();){
			Relation temp = it.next();
			if(temp.getNode1().equals(node1) && temp.getNode2().equals(node2)){
				return temp;
			}
			if(temp.getNode1().equals(node2) && temp.getNode2().equals(node1)){
				return temp;
			}
		}

		return null;
	}
	
	public static boolean initMatrix(List<Node> nodeList,
								List<Relation> relationList,
								List<List<MatrixEle>> matrix){
		boolean existNode = false;
		int num = nodeList.size();
		matrix.clear();
		for(int i=0;i<num;i++){
			List<MatrixEle> list = new ArrayList<MatrixEle>();
			for(int j=0;j<num;j++){
				MatrixEle ele = new MatrixEle();
				ele.setIndexI(i);
				ele.setIndexJ(j);
				
				/*节点位置已经确定*/
				if(nodeList.get(i).isHasFixPostion() ||
						nodeList.get(j).isHasFixPostion()){
					ele.setMinDist(Integer.MAX_VALUE);
				}else{
					existNode = true;
					
					if(i==j){
						ele.setMinDist(0);
					}
					else{
						
						Relation relation = getRelationByNode(relationList,
																nodeList.get(i), 
			                     								nodeList.get(j));
						/* 存在直接关系的两个因子，距离为1*/
						if(null != relation){
							ele.setMinDist(1);
							ele.getPathList().add(relation);
						}else{
							ele.setMinDist(Integer.MAX_VALUE);
						}
						
					}
				}
				list.add(ele);
			}
			matrix.add(list);
		}
		
		return existNode;
	}
	
	public static void floyd(List<List<MatrixEle>> matrix, List<Node> nodeList){
		int size = matrix.size();
		for(int k=0;k<size;k++){
			for(int i=0;i<size;i++){
				for(int j=0;j<size;j++){
					
					int distanceIK = matrix.get(i).get(k).getMinDist();
					int distanceKJ = matrix.get(k).get(j).getMinDist();
					if(Integer.MAX_VALUE == distanceIK
							|| Integer.MAX_VALUE == distanceKJ){
						continue;
					}
				
					int distanceIJ = matrix.get(i).get(j).getMinDist();
					if(distanceIK + distanceKJ < distanceIJ){
						/* 存在更短的路径*/
						matrix.get(i).get(j).setMinDist(distanceIK + distanceKJ);
						
						List<Relation> pathIK = matrix.get(i).get(k).getPathList();
						List<Relation> pathKJ = matrix.get(k).get(j).getPathList();
						List<Relation> pathIJ = new ArrayList<Relation>();
						pathIJ.addAll(pathIK);
						pathIJ.addAll(pathKJ);
						matrix.get(i).get(j).setPathList(pathIJ);
						
					}
				}
			}
		}
		
		/*设置任意2个节点之间的路径*/
		for(int i=0;i<size;i++){
			for(int j=0;j<size;j++){
				
				List<Node> nodeSeq = new ArrayList<Node>();
				
				if(i==j){
					nodeSeq.add(nodeList.get(i));
				}
				
				List<Relation> pathIJ = matrix.get(i).get(j).getPathList();
				if(pathIJ.size() == 0){
				
				}else{
					Node preNode = nodeList.get(i);
					nodeSeq.add(preNode);
					
					for(int k=0;k<pathIJ.size();k++){
						Relation relation = pathIJ.get(k);
						Node node = relation.getAnotherNode(preNode);
						if(null == node){
							throw new RuntimeException("relation error");
						}
						preNode = node;
						
						nodeSeq.add(node);
					}
				}
				matrix.get(i).get(j).setNodeSeq(nodeSeq);
			}
		}
		return ;
	}
	
	public static MatrixEle randomFindMaxPath(List<List<MatrixEle>> matrix){
		int size = matrix.size();
		
		MatrixEle max = null;
		int maxDistance = -1;
		for(int i=0;i<size;i++){
			for(int j=0;j<size;j++){
				if(matrix.get(i).get(j).getMinDist()!=Integer.MAX_VALUE
						&& maxDistance < matrix.get(i).get(j).getMinDist()){
					maxDistance = matrix.get(i).get(j).getMinDist();
					max = matrix.get(i).get(j);
				}
			}
		}
		
		for(Iterator<Node> it=max.getNodeSeq().iterator();it.hasNext();){
			Node node = it.next();
			System.out.print(node.getText()+" ");
		}
		return max;
	}
	
	public static void dfs(Node node1, Node node2, Stack<Node> stack, DfsHandler handler, Object handlerParam){
		if(node1.equals(node2)){
			handler.handler(stack, handlerParam);
		}else{
			
			for(Iterator<Node> it=node1.getNeighbourList().iterator();it.hasNext();){
				Node neighbour = it.next();
				if(neighbour.isInStack()){
					continue;
				}else{
					neighbour.setInStack(true);
					stack.push(neighbour);
					dfs(neighbour, node2, stack, handler, handlerParam);
					stack.pop();
					neighbour.setInStack(false);
				}
			}
		}
	}

	/**
	 * ��������֮������м�·��
	 */
	public static void findSimplePath(Node node1, Node node2, List<Ring> allRingList){
		
		Stack<Node> stack = new Stack<Node>();
		
		/* ��������ջ*/
		stack.push(node1);
		node1.setInStack(true);
		
		/* ��ȱ�������֮��ļ�����·��*/
		AlgUtils.dfs(node1, node2, stack, searchPathDfsHandler, allRingList);
		
		/* ���뻹ԭ������������޷�����*/
		node1.setInStack(false);
	}

//	public static Relation getRelationByNode(List<Relation> relationList, Node node1, Node node2){
//		
//		for(Iterator<Relation> it=relationList.iterator(); it.hasNext();){
//			Relation temp = it.next();
//			if(temp.getNode1().equals(node1) && temp.getNode2().equals(node2)){
//				return temp;
//			}
//			if(temp.getNode1().equals(node2) && temp.getNode2().equals(node1)){
//				return temp;
//			}
//		}
//
//		return null;
//	}

}
