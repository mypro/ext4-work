package cn.net.dbi.algorithm.layout.utils;

import java.util.List;

import cn.net.dbi.algorithm.layout.element.Node;

public interface IteratorLevelCallback {
	
	public void handle(Node node, List<Node> nextLevel);
}
