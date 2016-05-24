/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/base/ManagedObject"],function(q,l,M){"use strict";var N;var a=q.sap.log;var V=M.extend("sap.ui.vk.ViewStateManager",{metadata:{publicMethods:["enumerateSelection","getNodeHierarchy","getSelectionState","getVisibilityState","setSelectionState","setVisibilityState"],events:{visibilityChanged:{parameters:{visible:{type:"string[]"},hidden:{type:"string[]"}},enableEventBubbling:true},selectionChanged:{parameters:{selected:{type:"string[]"},unselected:{type:"string[]"}},enableEventBubbling:true}}},constructor:function(n){a.debug("sap.ui.vk.ViewStateManager.constructor() called.");M.apply(this);var s=n.getScene();this._nodeHierarchy=n;this._dvlSceneId=s._getDvlSceneId();this._dvl=s.getGraphicsCore()._getDvl();this._dvlClientId=s.getGraphicsCore()._getDvlClientId();this._dvl.Client.attachNodeVisibilityChanged(this._handleNodeVisibilityChanged,this);this._dvl.Client.attachNodeSelectionChanged(this._handleNodeSelectionChanged,this);this._selectedNodes=new N();this._newlyVisibleNodes=[];this._newlyHiddenNodes=[];this._visibilityTimerId=null;this._selectionTimerId=null;},destroy:function(){a.debug("sap.ui.vk.ViewStateManager.destroy() called.");if(this._selectionTimerId){q.sap.clearDelayedCall(this._selectionTimerId);this._selectionTimerId=null;}if(this._visibilityTimerId){q.sap.clearDelayedCall(this._visibilityTimerId);this._visibilityTimerId=null;}this._newlyHiddenNodes=null;this._newlyVisibleNodes=null;this._selectedNodes=null;if(this._dvl){this._dvl.Client.detachNodeSelectionChanged(this._handleNodeSelectionChanged,this);this._dvl.Client.detachNodeVisibilityChanged(this._handleNodeVisibilityChanged,this);}this._dvlClientId=null;this._dvlSceneId=null;this._dvl=null;this._scene=null;M.prototype.destroy.apply(this);},getNodeHierarchy:function(){return this._nodeHierarchy;},getVisibilityState:function(n){if(Array.isArray(n)){return n.map(function(b){return(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,b,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS).Flags&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_VISIBLE)!==0;}.bind(this));}else{var b=n;return(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,b,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS).Flags&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_VISIBLE)!==0;}},setVisibilityState:function(n,v,r){if(!Array.isArray(n)){n=[n];}var c=q.sap.unique((r?this._collectNodesRecursively(n):n)).filter(function(b){var i=(sap.ui.vk.dvl.getJSONObject(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,b,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS)).Flags&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_VISIBLE)!==0;return i!==v;}.bind(this));if(c.length>0){c.forEach(function(b){this._dvl.Scene.ChangeNodeFlags(this._dvlSceneId,b,sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_VISIBLE,v?sap.ve.dvl.DVLFLAGOPERATION.DVLFLAGOP_SET:sap.ve.dvl.DVLFLAGOPERATION.DVLFLAGOP_CLEAR);}.bind(this));this.fireVisibilityChanged({visible:v?c:[],hidden:v?[]:c});}return this;},_handleNodeVisibilityChanged:function(p){if(p.clientId===this._dvlClientId&&p.sceneId===this._dvlSceneId){this[p.visible?"_newlyVisibleNodes":"_newlyHiddenNodes"].push(p.nodeId);if(!this._visibilityTimerId){this._visibilityTimerId=q.sap.delayedCall(0,this,function(){this._visibilityTimerId=null;this.fireVisibilityChanged({visible:this._newlyVisibleNodes.splice(0,this._newlyVisibleNodes.length),hidden:this._newlyHiddenNodes.splice(0,this._newlyHiddenNodes.length)});}.bind(this));}}},enumerateSelection:function(c){this._selectedNodes.forEach(c);return this;},getSelectionState:function(n){if(Array.isArray(n)){return n.map(function(b){return(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,b,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS).Flags&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED)!==0;}.bind(this));}else{var b=n;return(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,b,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS).Flags&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED)!==0;}},setSelectionState:function(n,s,r){if(!Array.isArray(n)){n=[n];}var c=q.sap.unique((r?this._collectNodesRecursively(n):n)).filter(function(d){var i=(sap.ui.vk.dvl.getJSONObject(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,d,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS)).Flags&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED)!==0;return i!==s;}.bind(this));if(c.length>0){var b=this._selectedNodes[s?"add":"delete"].bind(this._selectedNodes);c.forEach(function(d){this._dvl.Scene.ChangeNodeFlags(this._dvlSceneId,d,sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED,s?sap.ve.dvl.DVLFLAGOPERATION.DVLFLAGOP_SET:sap.ve.dvl.DVLFLAGOPERATION.DVLFLAGOP_CLEAR);b(d);}.bind(this));this.fireSelectionChanged({selected:s?c:[],unselected:s?[]:c});}return this;},_handleNodeSelectionChanged:function(p){if(p.clientId===this._dvlClientId&&p.sceneId===this._dvlSceneId){if(!this._selectionTimerId){this._selectionTimerId=q.sap.delayedCall(0,this,function(){this._selectionTimerId=null;var c=new N(this._dvl.Scene.RetrieveSceneInfo(this._dvlSceneId,sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_SELECTED).SelectedNodes);var n=[];this._selectedNodes.forEach(function(d){if(!c.has(d)){n.push(d);}});var b=[];c.forEach(function(d){if(!this._selectedNodes.has(d)){b.push(d);}}.bind(this));this._selectedNodes=c;this.fireSelectionChanged({selected:b,unselected:n});});}}},_collectNodesRecursively:function(n){var r=[];var c=function(b){var d=typeof b==="string"?b:b.getNodeId();r.push(d);if((sap.ui.vk.dvl.getJSONObject(this._dvl.Scene.RetrieveNodeInfo(this._dvlSceneId,d,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS)).Flags&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_CLOSED)===0){this._nodeHierarchy.enumerateChildren(d,c);}}.bind(this);n.forEach(c);return r;}});N=function(b){b=b||[];if(this._builtin){if(sap.ui.Device.browser.msie){this._set=new Set();b.forEach(this._set.add.bind(this._set));}else{this._set=new Set(b);}}else{this._set=b.slice();}};N.prototype={constructor:N,_builtin:!!Set,add:function(v){if(this._builtin){this._set.add(v);}else{if(this._set.indexOf()<0){this._set.push(v);}}return this;},delete:function(v){if(this._builtin){return this._set.delete(v);}else{var i=this._set.indexOf(v);if(i>=0){this.splice(i,1);return true;}else{return false;}}},clear:function(){if(this._builtin){this._set.clear();}else{this._set.splice(0,this._set.length);}},has:function(v){if(this._builtin){return this._set.has(v);}else{return this._set.indexOf(v)>=0;}},forEach:function(c,t){this._set.forEach(c,t);}};return V;});