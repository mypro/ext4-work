/**
 * Add basic filtering to Ext.tree.Panel. Add as a mixin:
 *  mixins: {
 *      treeFilter: 'WMS.view.TreeFilter'
 *  }
 */
Ext.define('WMS.view.TreeFilter', {
    filterByText: function(text) {
        this.filterBy(text, 'text');
    },
    /**
     * Filter the tree on a string, hiding all nodes expect those which match and their parents.
     * @param The term to filter on.
     * @param The field to filter on (i.e. 'text').
     */
    filterBy: function(text, by) {
        this.clearFilter();
        var view = this.getView(),
            me = this,
            nodesAndParents = [];
        // Find the nodes which match the search term, expand them.
        // Then add them and their parents to nodesAndParents.
        this.getRootNode().cascadeBy(function(tree, view){
            var currNode = this;
 
            if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase().indexOf(text.toLowerCase()) > -1) {
                me.expandPath(currNode.getPath());
                while(currNode.parentNode) {
                    nodesAndParents.push(currNode.id);
                    currNode = currNode.parentNode;
                }
            }
        }, null, [me, view]);
        // Hide all of the nodes which aren't in nodesAndParents
        this.getRootNode().cascadeBy(function(tree, view){
            var uiNode = view.getNodeByRecord(this);
            if(uiNode && !Ext.Array.contains(nodesAndParents, this.id)) {
                Ext.get(uiNode).setDisplayed('none');
            }
        }, null, [me, view]);
    },
    clearFilter: function() {
        var view = this.getView();
        this.getRootNode().cascadeBy(function(tree, view){
            var uiNode = view.getNodeByRecord(this);
            if(uiNode) {
                Ext.get(uiNode).setDisplayed('table-row');
            }
        }, null, [this, view]);
    },
    filterByNoInTree:function(text, by) {
    	this.clearFilter();
        var view = this.getView(),
            me = this,
            nodesAndParents = [];
        // Find the nodes which match the search term, expand them.
        // Then add them and their parents to nodesAndParents.
        this.getRootNode().cascadeBy(function(tree, view){
            var currNode = this;
 
//            if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase()===text[0].toLowerCase()) {
//            }else if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase()===text[1].toLowerCase()) {
//            }else if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase()===text[2].toLowerCase()) {
//            }else{
            if(currNode && currNode.data[by]){
            	if(Ext.Array.contains(text,currNode.data[by])){
            	}else{
            		
            		me.expandPath(currNode.getPath());
            		while(currNode.parentNode) {
            			nodesAndParents.push(currNode.id);
            			currNode = currNode.parentNode;
            			
            		}
            	}
            }
            	
//            }
        }, null, [me, view]);
        // Hide all of the nodes which aren't in nodesAndParents
        this.getRootNode().cascadeBy(function(tree, view){
            var uiNode = view.getNodeByRecord(this);
            if(uiNode && !Ext.Array.contains(nodesAndParents, this.id)) {
                Ext.get(uiNode).setDisplayed('none');
            }
        }, null, [me, view]);
    },
    test:function(){
    	
    }
});