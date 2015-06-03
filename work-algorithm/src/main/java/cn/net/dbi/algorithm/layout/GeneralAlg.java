package cn.net.dbi.algorithm.layout;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

import cn.net.dbi.algorithm.layout.element.MatrixEle;
import cn.net.dbi.algorithm.layout.element.Node;
import cn.net.dbi.algorithm.layout.element.Path;
import cn.net.dbi.algorithm.layout.element.Relation;
import cn.net.dbi.algorithm.layout.element.Ring;
import cn.net.dbi.algorithm.layout.utils.AlgUtils;

public class GeneralAlg {
	
	public static int DISTANCE_DEFAULT = 150;
	
	public static int FRAME_WIDTH = 30;
	
	public static double EXPANSION_FACTOR = 1.2;
	
	public final static int POLYGON_DIRECTION_CLOCK = 0;
	public final static int POLYGON_DIRECTION_ANTICLOCK = 1;
	
	public final static int PATH_DIRECTION_DOWN = 0;
	public final static int PATH_DIRECTION_UP = 1;
	public final static int PATH_DIRECTION_LEFT = 2;
	public final static int PATH_DIRECTION_RIGHT = 3;
	
	public static int height ;
	public static int width ;
	
	public static int NODE_RADIUS_LEN = 50;
	
	/**
	 * 计算环的外切圆直径
	 * 
	 * @param ring
	 * @return
	 */
	public static int calculateRingOuterRadius(Ring ring){
		
		int ringSize = ring.getSize();
		if(ringSize == 0){
			throw new RuntimeException("there is not node in ring !!");
		}
				
		/* 根据角度和变长，计算外切圆的直径*/
		int jiaodu = 360/ringSize;
		double zhengxuan = 1/Math.sin(Math.toRadians(jiaodu/2));	
		int radius = (int)((ring.getDistance()/2)*zhengxuan);
		
		return radius;
	}
	
	public static int calculateRingInnerRaidus(Ring ring, int outerRadius){
		int ringSize = ring.getSize();
		if(ringSize == 0){
			throw new RuntimeException("there is not node in ring !!");
		}
		int jiaodu = 360/ringSize;
		double yuxuan = Math.cos(Math.toRadians(jiaodu/2));
		
		int radius =(int)(outerRadius * yuxuan);
		
		return radius;
	}
	
	public static double calculateAngleByTan(double tanValue){
		return Math.toDegrees(Math.atan(tanValue));

	}
	
	/**
	 * 获取主线上某节点的前驱
	 * @param node
	 * @param ele
	 * @return
	 */
	public static Node findPreNode(Node node, List<Node> nodeList){
		int index = nodeList.indexOf(node);
		if(index>0){
			return nodeList.get(index-1);
		}
		return null;
	}
	
	/**
	 * 获取主线上某节点的后继
	 * @param node
	 * @param ele
	 * @return
	 */
	public static Node findNextNode(Node node, List<Node> nodeList){
		int index = nodeList.indexOf(node);
		if(index<nodeList.size()-1){
			return nodeList.get(index+1);
		}
		return null;
	}	
	
	public static Relation findRelation(Node node, Node nextNode, MatrixEle ele){
		if(nextNode == null){
			return null;
		}
		for(Iterator<Relation> it=ele.getPathList().iterator();it.hasNext();){
			Relation relation = it.next();
			if(node.equals(relation.getNode1())
					&& nextNode.equals(relation.getNode2())){
				return relation;
			}else if(node.equals(relation.getNode2())
					&& nextNode.equals(relation.getNode1())){
				return relation;
			}
		}
		return null;
	}
	
	/**
	 * 选择顺序针旋转，还是逆时针
	 * 
	 * @param nodeList
	 * @param anchorNode
	 * @return
	 */
	public static int selectDirection(List<Node> nodeList, Node anchorNode){
		
		int direction = POLYGON_DIRECTION_ANTICLOCK;
		int leftCount = 0;
		int rightCount = 0;
		for(Iterator<Node> it=nodeList.iterator();it.hasNext();){
			Node node = it.next();
			if(!node.isHasFixPostion()){
				continue;
			}
			if(node.getPosX() > anchorNode.getPosX()){
				rightCount++;
			} else if(node.getPosX() < anchorNode.getPosX()){
				leftCount++;
			} else{
				// 同一x轴下不考虑
			}
		}
		if(leftCount > rightCount){
			direction = POLYGON_DIRECTION_CLOCK;
		}
		return direction;
	}
	
	/**
	 * 环做下变形，去掉已经画好的边
	 * 
	 * @param ring
	 * @param anchorNode
	 * @param isSameDirection
	 * @return
	 */
	public static Ring changeRing(Ring ring, Node anchorNode, boolean isSameDirection){
		Node firstNode = anchorNode;
		Node secondeNode = null;
		Ring newRing = ring.getRingCopy();
		int ringSize = ring.getSize();
		while(true){
			if(isSameDirection){
				secondeNode = findNextNode(firstNode, newRing.getNodeList());
				/* 从列表末尾循环到首个元素*/
				if(null == secondeNode){
					secondeNode = newRing.getNodeList().get(0);
				}
			}else{
				secondeNode = findPreNode(firstNode, newRing.getNodeList());
				/* 从列表首位循环到末尾元素*/
				if(null == secondeNode){
					secondeNode = newRing.getNodeList().get(ringSize-1);
				}
			}
			
			if(!secondeNode.isHasFixPostion()){
				break;
			}else{
				/* 如果该节点被设置过，且上一个节点非锚点，则删除上一个节点*/
				if(!firstNode.equals(anchorNode)){
					newRing.getNodeList().remove(firstNode);
				}
				firstNode = secondeNode;
			}
		}
		
		newRing.setLastFixNode(firstNode);
		return newRing;
	}
	
	/**
	 * 在hookNode的左右4*4空间里找个确定节点最少的
	 * 
	 * @param nodeList
	 * @param hookNode
	 * @return
	 */
	public static boolean selectLeftOrRight(List<Node> nodeList, Node hookNode){
		
		if(!hookNode.isHasFixPostion()){
			throw new RuntimeException("find hook relation error!");
		}
		int leftarea_x_left = hookNode.getPosX() - DISTANCE_DEFAULT * 4;
		int leftarea_x_right = hookNode.getPosX();
		int leftarea_y_up = hookNode.getPosY() - DISTANCE_DEFAULT * 2;
		int leftarea_y_down = hookNode.getPosY() + DISTANCE_DEFAULT * 2;
		
		int rightarea_x_left = hookNode.getPosX();
		int rightarea_x_right = hookNode.getPosX() + DISTANCE_DEFAULT * 4;
		int rightarea_y_up = hookNode.getPosY() - DISTANCE_DEFAULT * 2;
		int rightarea_y_down = hookNode.getPosY() + DISTANCE_DEFAULT * 2;
		
		int leftCount = 0;
		int rightCount = 0;
		
		for(Iterator<Node> it=nodeList.iterator();it.hasNext();){
			Node node = it.next();
			if(!node.isHasFixPostion()){
				continue;
			}
			if(node.getPosX() >= leftarea_x_left
					&& node.getPosX() <= leftarea_x_right
					&& node.getPosY() >= leftarea_y_up
					&& node.getPosY() <= leftarea_y_down){
				leftCount ++ ;
			}
			if(node.getPosX() >= rightarea_x_left
					&& node.getPosX() <= rightarea_x_right
					&& node.getPosY() >= rightarea_y_up
					&& node.getPosY() <= rightarea_y_down){
				rightCount ++ ;
			}
		}
		
		return leftCount < rightCount;
	}
	
	public static int getMostRightX(List<Node> nodeList){
		int maxX = Integer.MIN_VALUE;
		for(Iterator<Node> it=nodeList.iterator();it.hasNext();){
			Node node = it.next();
			if(node.getPosX()>maxX){
				maxX = node.getPosX();
			}
		}
		return maxX;
	}
	/**
	 * 粗略计算所有节点位置
	 */
	public static Path calculateNodePosition(List<Node> nodeList, MatrixEle maxEle, Node hookNode, boolean isVertical, Path lastIslandPath, boolean IsBigIsland
										,boolean isSanZhuang){
		Node anchorNode = null;
		boolean isLeft = true;
		boolean isIsland = false;
		
		int direction = POLYGON_DIRECTION_ANTICLOCK;
		
		for(int i=0;i<maxEle.getNodeSeq().size();i++){/* 这里for循环的i没意义*/
			if(null != anchorNode){
				/* 根据前驱节点确定锚点的位置*/
				Node preNode = findPreNode(anchorNode, maxEle.getNodeSeq());
				if(isVertical){
					anchorNode.setPosX(preNode.getPosX());
					anchorNode.setPosY(preNode.getPosY()+DISTANCE_DEFAULT);
				}else{
					if(isLeft){
						anchorNode.setPosX(preNode.getPosX()-DISTANCE_DEFAULT);
						anchorNode.setPosY(preNode.getPosY());
					}else{
						anchorNode.setPosX(preNode.getPosX()+DISTANCE_DEFAULT);
						anchorNode.setPosY(preNode.getPosY());
					}
				}
			}else{
				anchorNode = maxEle.getNodeSeq().get(0);
				if(null != hookNode){
					/* 否则根据钩子位置，来确定新锚点的位置 */
					/* 确定新主线的方向*/
					if(isVertical){
						anchorNode.setPosX(hookNode.getPosX());
						anchorNode.setPosY(hookNode.getPosY()+DISTANCE_DEFAULT);
					}else{
						/* 如果是水平方向，还需要进一步确认向左还是向右*/
						/* 检查hooknode左边4*4和右边4*4的空间内，哪边已确定位置点少，就向哪边*/
						isLeft = selectLeftOrRight(nodeList, hookNode);
						if(isLeft){
							direction = POLYGON_DIRECTION_CLOCK;
							anchorNode.setPosX(hookNode.getPosX()-DISTANCE_DEFAULT);
							anchorNode.setPosY(hookNode.getPosY());
	 					}else{
							direction = POLYGON_DIRECTION_ANTICLOCK;
							anchorNode.setPosX(hookNode.getPosX()+DISTANCE_DEFAULT);
							anchorNode.setPosY(hookNode.getPosY());
						}
					}
				}else{
					/* 选择新的孤岛起点*/
					if(IsBigIsland){
						anchorNode.setPosX(getMostRightX(nodeList)+(int)(DISTANCE_DEFAULT*1.5));
						anchorNode.setPosY(lastIslandPath.getStartNode().getPosY());
					}else{
						/* 若最大距离<=2，则在上个孤岛的左上角分布*/
						if(maxEle.getMinDist() <= 2 && null != lastIslandPath
								&& null != lastIslandPath.getStartNode()){
							anchorNode.setPosX(lastIslandPath.getStartNode().getPosX()-DISTANCE_DEFAULT);
							anchorNode.setPosY(lastIslandPath.getStartNode().getPosY());
							lastIslandPath.setStartNode(null);
						}else{
							if(null == lastIslandPath){
								anchorNode.setPosX(width/2);
								anchorNode.setPosY(DISTANCE_DEFAULT/2);
							}else{
								anchorNode.setPosX(lastIslandPath.getEndNode().getPosX());
								anchorNode.setPosY(lastIslandPath.getEndNode().getPosY()+ DISTANCE_DEFAULT);
							}
							isIsland = true;
						}
					}
					isVertical = true;
					
				}
			}
			anchorNode.setAnchor(true);
			anchorNode.setHasFixPostion(true);
			anchorNode.setVertical(isVertical);
			
			/* 首先在主线上寻找是否存在环*/
			Node nextNode = findNextNode(anchorNode, maxEle.getNodeSeq());
			Relation relation = findRelation(anchorNode, nextNode, maxEle);
			if(null == relation){
				/* 说明已经是最后一个节点，退出主线搜索*/
				if(isIsland){
					Path p = new Path();
					p.setStartNode(maxEle.getNodeSeq().get(0));
					p.setEndNode(anchorNode);
					return p;
				}else{
					return null;
				}
			
			}
			List<Ring> ringList = new ArrayList<Ring>();
			AlgUtils.findSimplePath(relation.getNode1(), relation.getNode2(), ringList);
			
			/* 处理所有的环*/
			if(ringList.size()>0){
				/* 存在环情况的情况，按环的元素个数来降序排列*/
				Collections.sort(ringList, new Comparator<Ring>() {

					public int compare(Ring o1, Ring o2) {
						if(o1.getSize()>o2.getSize()){
							return -1;
						}else {
							return 1;
						}
					}
				
				});
				
				/* 主线为纵向时，多边形方向左右没准 */
				if(isVertical){
					/* 判断当前已确定的节点中，在锚点左边的多，还是右边的多，进而决定下面处理环的旋转方向*/
					direction = selectDirection(nodeList, anchorNode);
				}
				
				for(int j=0;j<ringList.size();j++){
					Ring ring = ringList.get(j);
					/* 如果环上节点都被设置过位置，不再处理*/
					if(ring.isAllFixed()){
						continue;
					}
					
					/* 为Ring各节点设置位置*/
					int ringSize = ring.getSize();
					int k = ring.indexOf(anchorNode);
					if(-1 == k){
						throw new RuntimeException("floyd计算每个最短路径轨迹时有误");
					}
					Node nodeInRing = anchorNode;
					
					/* 判断主线的顺序与环的顺序是相同还是相反*/
					boolean isSameDirection = false;
					if(((k==ringSize-1) && ring.getNodeList().get(0).equals(nextNode))
							|| ring.getNodeList().get(k+1).equals(nextNode)){
						isSameDirection = true;
					}
					
					/* 如果环上从锚点开始有一些节点被处理过，则Ring需要做一个变形*/
					Node firstNode;
					Node secondeNode;
					Ring newRing = changeRing(ring, anchorNode, isSameDirection);

					/* 以后都使用新的环结构，有可能与原环相同，也有可能不同*/
					ringSize = newRing.getSize();
					firstNode = newRing.getLastFixNode();
					
					// 倾斜角度
					double slantAngle = 0;		
					/* 此环存在倾斜的角度*/
					if(!firstNode.equals(nodeInRing)){
						
						if(firstNode.getPosY() == nodeInRing.getPosY()){
							if(firstNode.getPosX() < nodeInRing.getPosX()){
								slantAngle = 90;
							}else{
								slantAngle = 270;
							}
						}
						
						/* 勾股定理算出新的边距*/
						newRing.setDistance((int)(Math.sqrt(Math.pow(nodeInRing.getPosX()-firstNode.getPosX(), 2)
								+ Math.pow(firstNode.getPosY()-nodeInRing.getPosY(), 2))));
						
						double tanValue = ((double)(nodeInRing.getPosX()-firstNode.getPosX()))/
								((double)(firstNode.getPosY()-nodeInRing.getPosY()));
						slantAngle = Math.toDegrees(Math.atan(tanValue));
					}
					
					
					/* 获取环路外切园的圆心和半径 */
					int radius = calculateRingOuterRadius(newRing);
					int angle = (int)(360/ringSize/2 - slantAngle);
					/* 逆时针时，初始角度减180*/
					if(POLYGON_DIRECTION_ANTICLOCK == direction){
						angle = 180 - angle;
					}
					int circleHeartX = anchorNode.getPosX()  
									- (int)(radius * Math.cos(Math.toRadians(angle))) ;
							
					int circleHeartY = anchorNode.getPosY() 
									+ (int)(radius * Math.sin(Math.toRadians( angle))) ;
					
					firstNode = nodeInRing;
					while(true){
						if(isSameDirection){
							secondeNode = findNextNode(firstNode, newRing.getNodeList());
							/* 从列表末尾循环到首个元素*/
							if(null == secondeNode){
								secondeNode = newRing.getNodeList().get(0);
							}
						}else{
							secondeNode = findPreNode(firstNode, newRing.getNodeList());
							/* 从列表首位循环到末尾元素*/
							if(null == secondeNode){
								secondeNode = newRing.getNodeList().get(ringSize-1);
							}
						}
						
						firstNode = secondeNode;
						
						/* 若循环了一圈，退出循环*/
						if(secondeNode.equals(nodeInRing)){
							
							break;
						}
						
						/* 角度偏移360/ringSize度*/
						if(POLYGON_DIRECTION_ANTICLOCK == direction){
							angle = (angle + 360/ringSize)%360;
						}else{
							angle = (angle + 360 - 360/ringSize)%360;
						}
						
						/* 若该节点已设置过位置，则跳过*/
						if(secondeNode.isHasFixPostion()){
							continue;
						}
						
						/* 根据锚点坐标设置环形余下节点坐标*/
						secondeNode.setPosY(circleHeartY -
								(int)(radius *Math.sin(Math.toRadians(angle))));
						secondeNode.setPosX(circleHeartX +
								(int)(radius *Math.cos(Math.toRadians(angle))));
						secondeNode.setHasFixPostion(true);
						secondeNode.setVertical(isVertical);
					}
					
					if(isVertical){
						direction++;
						direction%=2;
					}
					
				}
				
			}else{
				
			}
			/* 设置下面的锚点*/
			Node nextAnchorNode;
			Node preAnchorNode = anchorNode;
			while(true){
				nextAnchorNode = findNextNode(preAnchorNode, maxEle.getNodeSeq());
				
				/* 主线已经遍历完毕的情况*/
				if(null == nextAnchorNode){
					if(isIsland){
						Path p = new Path();
						p.setStartNode(maxEle.getNodeSeq().get(0));
						p.setEndNode(preAnchorNode);
						return p;
					}else{
						return null;
					}
				}
				
				/* 查看下一个主线上的点是否已经设置过位置*/
				if(nextAnchorNode.isHasFixPostion()){
					
				}else{
					break;
				}
				
				preAnchorNode = nextAnchorNode;
			}
			
			/* 继续根据新锚点来搜索*/
			anchorNode = nextAnchorNode;
		}
	
		
		return null;
	}
	
	/**
	 * 调整各个节点位置，重新设置画布大小
	 * 
	 * @param nodeList
	 * @param frame
	 */
	public static void adjustPostion(List<Node> nodeList){
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
		int leftWidth = minX-FRAME_WIDTH;
		int rightShift = 0;
		if(leftWidth<0){
			rightShift = -leftWidth + FRAME_WIDTH;
		}else if(leftWidth > FRAME_WIDTH){
			rightShift = -(leftWidth-FRAME_WIDTH);
		}
		
		int upWidth = minY-FRAME_WIDTH;
		int downShift = 0;
		if(upWidth<0){
			downShift = -upWidth + FRAME_WIDTH;
		}else if(upWidth > FRAME_WIDTH){
			downShift = -(upWidth-FRAME_WIDTH);
		}
		
		if((0!=rightShift) || (0!=downShift)){
			for(Iterator<Node> it=nodeList.iterator();it.hasNext();){
				Node node = it.next();
				node.setPosX(node.getPosX()+rightShift);
				node.setPosY(node.getPosY()+downShift);
			}
		}
		
	}
	
	/**
	 * 在与nodeList中已确定位置节点中，找到还挂着其他路径(未确定位置的路径)的钩子节点
	 * 即已确定节点和未确定节点的中介线
	 * @param nodeList
	 * @param maxEle
	 * @return
	 */
	public static Relation findHook(List<Node> nodeList, List<Relation> relationList){
		
		for(Iterator<Node> it=nodeList.iterator();it.hasNext();){
			Node node = it.next();
			if(!node.isHasFixPostion()){
				continue;
			}
			for(Iterator<Node> neighbourIt = node.getNeighbourList().iterator();neighbourIt.hasNext();){
				Node neighboorNode = neighbourIt.next();
				if(!neighboorNode.isHasFixPostion()){
					Relation relation = AlgUtils.getRelationByNode(relationList, node, neighboorNode);
					return relation;
				}
			}
		}
		
		/* 自己是孤岛了*/
		return null;
	}
	
	/**
	 * 在所有未设置位置的节点中，找到node出发能到最远的一条路径
	 * @param node
	 * @return
	 */
	public static MatrixEle findMaxPath(Node node, List<List<MatrixEle>> matrix){
		List<MatrixEle> eleList = matrix.get(node.getId()-1);
		int maxDistance = -1;
		MatrixEle maxEle = null;
		
		for(Iterator<MatrixEle> it=eleList.iterator();it.hasNext();){
			MatrixEle ele = it.next();
			if(ele.getMinDist() != Integer.MAX_VALUE
					&& maxDistance < ele.getMinDist()){
				maxDistance = ele.getMinDist();
				maxEle = ele;
			}
		}
		/* 找不到，说明这条未设置分支上就node自己了*/
		if(null == maxEle){
			maxEle = matrix.get(node.getId()-1).get(node.getId()-1);
		}
		return maxEle;
	}
	
	
	public static void moveNodeAB(List<Node> nodeList, Node A, Node B, int distance){
		int areaB_x_left = B.getPosX() -   (A.getPosX()-B.getPosX()) * 2 * NODE_RADIUS_LEN / distance;
		int areaB_x_right = B.getPosX();
		int areaB_y_up = B.getPosY() - (A.getPosY() - B.getPosY()) * 2 * NODE_RADIUS_LEN / distance;
		int areaB_y_down = B.getPosY();
		if(areaB_x_left>areaB_x_right){
			int temp = areaB_x_left;
			areaB_x_left = areaB_x_right;
			areaB_x_right = temp;
		}
		if(areaB_y_up>areaB_y_down){
			int temp = areaB_y_up;
			areaB_y_up = areaB_y_down;
			areaB_y_down = temp;
		}
		
		int areaA_x_left = A.getPosX();
		int areaA_x_right = A.getPosX() + (A.getPosX()-B.getPosX()) * 2 * NODE_RADIUS_LEN / distance;
		int areaA_y_up = A.getPosY();
		int areaA_y_down = A.getPosY() + (A.getPosY()-B.getPosY()) * 2 * NODE_RADIUS_LEN / distance;
		if(areaA_x_left>areaA_x_right){
			int temp = areaA_x_left;
			areaA_x_left = areaA_x_right;
			areaA_x_right = temp;
		}
		if(areaA_y_up>areaA_y_down){
			int temp = areaA_y_up;
			areaA_y_up = areaA_y_down;
			areaA_y_down = temp;
		}
		
		int countA=0;
		int countB=0;
		
		for(Iterator<Node> it=nodeList.iterator();it.hasNext();){
			Node node = it.next();
			if(node.getPosX() >= areaA_x_left
					&& node.getPosX() <= areaA_x_right
					&& node.getPosY() >= areaA_y_up
					&& node.getPosY() <= areaA_y_down){
				countA ++ ;
			}
			if(node.getPosX() >= areaB_x_left
					&& node.getPosX() <= areaB_x_right
					&& node.getPosY() >= areaB_y_up
					&& node.getPosY() <= areaB_y_down){
				countB ++ ;
			}
		}
		
		int moveDistance = NODE_RADIUS_LEN + 5 - distance;
		
		if(countA > countB){
			/* A朝相反方向移动*/
			A.setPosX(A.getPosX()+(A.getPosX()-B.getPosX()) * moveDistance / distance);
			A.setPosY(A.getPosY()+A.getPosY() + (A.getPosY()-B.getPosY()) * moveDistance / distance);
		}else{
			/* B朝相反方向移动*/
			B.setPosX(B.getPosX()-(A.getPosX()-B.getPosX()) * moveDistance / distance);
			B.setPosY(B.getPosY()-(A.getPosY()-B.getPosY()) * moveDistance / distance);
		}
	}
	
	/**
	 * 去掉圆的覆盖
	 * 
	 * @param nodeList
	 */
	public static void deleteCover(List<Node> nodeList){
		int size = nodeList.size();
		for(int i=0;i<size;i++){
			Node nodeA = nodeList.get(i);
			for(int j=0;j<size;j++){
				Node nodeB = nodeList.get(j);
				if(nodeB.equals(nodeA)){
					continue;
				}
				int distance = (int)(Math.sqrt(Math.pow(nodeA.getPosX()-nodeB.getPosX(),2) 
						+ Math.pow(nodeA.getPosY()-nodeB.getPosY(),2)));
				if(0 != distance && distance < NODE_RADIUS_LEN + 10 ){
					moveNodeAB(nodeList, nodeA, nodeB, distance);
				}
			}
		}
	}
	
	public static boolean isSANZHUANG(List<Node> nodeList){
		
		int hasSetPostion = 0;
		
		for(Iterator<Node> it=nodeList.iterator();it.hasNext();){
			Node node = it.next();
			if(node.isHasFixPostion()){
				hasSetPostion++;
			}
		}
		
		/* 一个最大集合不足总量的1/4，认为散状分布 */
		if(hasSetPostion*4<nodeList.size()){
			return true;
		}
		
		return false;
	}
	
	
	public static int isThrough(Node node, Relation relation){
		
		int centerX = node.getPosX();
		int centerY = node.getPosY();
		
		Node A = relation.getNode1();
		Node B = relation.getNode2();
		
		double throughX ;
		double throughY ;
		
		//如果是直角.平角
		if(A.getPosY()==B.getPosY()){
			throughX = centerX;
			throughY = A.getPosY();
		}else if(A.getPosX()==B.getPosX()){
			throughX = A.getPosX();
			throughY = centerY;
		}else{
			double k =  (double)(A.getPosY()-B.getPosY()) / (double)(A.getPosX()-B.getPosX());
			throughX = (Math.pow(k, 2)*A.getPosX() + k*centerY - k*A.getPosY()+centerX)/(Math.pow(k, 2)+1);
			throughY = k*(throughX-A.getPosX()) + A.getPosY();
		}
		
		int distThrough = (int)(Math.sqrt(Math.pow(centerX-throughX, 2) + Math.pow(centerY-throughY, 2)));
		if(NODE_RADIUS_LEN/2 < distThrough){
			return Integer.MAX_VALUE;
		}
		
		if((throughX<A.getPosX() && throughX<B.getPosX()) || 
			(throughX>A.getPosX()&& throughX>B.getPosX()) ||
			(throughY>A.getPosY()&& throughY>B.getPosY()) ||
			(throughY<A.getPosY()&& throughY<B.getPosY()) ){
			return Integer.MAX_VALUE;
		}else{
			return distThrough;
		}
	}
	
	public static void calculate(List<Node> nodeList,
										   List<Relation> relationList){
			
		List<List<MatrixEle>> matrix = new ArrayList<List<MatrixEle>>();
		
		/* 初始化点间距的矩阵*/
		boolean existNode = AlgUtils.initMatrix(nodeList, relationList, matrix);
			
		if(!existNode){
			System.out.println("\r 您未输入任何节点");
			return;
		}
		
		AlgUtils.floyd(matrix, nodeList);
		
		MatrixEle maxEle = AlgUtils.randomFindMaxPath(matrix);	
			
		/* 判断是否呈现断点的点状分布 */
		//TODO
			
		boolean isVertical = true;
		int MaxDistance = maxEle.getMinDist();
			
		/* 粗略估计画布高和宽*/
		height = (int)(MaxDistance * DISTANCE_DEFAULT * EXPANSION_FACTOR);
		width = (int)(((double)nodeList.size()/MaxDistance) * DISTANCE_DEFAULT * EXPANSION_FACTOR) ;
			
		/* 粗略计算各个节点位置*/
		Node hookNode = null;	// 已确定位置中的挂节点
		Node startNode = null;	// 未确定位置中的出发点
			
		Path lastIslandPath = null;	/* 记录上一个孤岛的起点和终点 */
		boolean IsBigIsland = false; 
		boolean IsFirst = true;
		boolean isSanZhuang = false;/* 整体是否呈散状排列*/
		int i=0;
		while(true){
			Path temp = calculateNodePosition(nodeList, maxEle, hookNode, isVertical, lastIslandPath, IsBigIsland, isSanZhuang);
			MaxDistance = maxEle.getMinDist();
	
//			// 判断散状分布
//			if(IsFirst){
//				i++;
//				isSanZhuang = isSANZHUANG(nodeList);
//			}
			
			IsFirst=false;
			
			IsBigIsland = false;
			
			if(null != temp){
				lastIslandPath = temp;
			}
				
			if(!AlgUtils.initMatrix(nodeList, relationList, matrix)){
				/* 所有点位置都已经设置完毕了*/
				break;
			}
			AlgUtils.floyd(matrix, nodeList);
				
			/* 找一个已确定路径和未确定路径的中介relation*/
			Relation hookRelation = findHook(nodeList, relationList);
				
			/* 开始生成下一个孤岛了*/
			if(null == hookRelation){
				maxEle = AlgUtils.randomFindMaxPath(matrix);
				isVertical = true;
				if(maxEle.getMinDist()*3 > MaxDistance){
					IsBigIsland = true;
				}
//				MaxDistance = maxEle.getMinDist();
				hookNode = null;
			}else{
				if(hookRelation.getNode1().isHasFixPostion()){
					hookNode = hookRelation.getNode1();
					startNode = hookRelation.getNode2();
				}else{
					hookNode = hookRelation.getNode2();
					startNode = hookRelation.getNode1();
				}
	
				/* 从起点开始，找一个最长路径*/
				maxEle = findMaxPath(startNode, matrix);
	
				/*
				 *  如果挂在纵向的主线上，就用横向的;
				 *  如果挂在横向的主线上，就用纵向的;
				 */
				isVertical = !(hookNode.isVertical());
			}
			}
	
			/* 多变拉扯的点，跟随牵引力走 */
			//TODO
			
			/* 根据锚点及节点间作用关系调整分布*/
			deleteCover(nodeList);
			deleteCover(nodeList);
			
			adjustPostion(nodeList);
		
		return ;
	}
}
 

