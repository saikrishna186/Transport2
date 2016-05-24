/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./TreeBinding','sap/ui/model/FilterProcessor'],function(q,T,F){"use strict";var C=T.extend("sap.ui.model.ClientTreeBinding",{constructor:function(m,p,c,f,P){T.apply(this,arguments);if(!this.oContext){this.oContext="";}this.filterInfo={};this.filterInfo.aFilteredContexts=[];this.filterInfo.oParentContext={};if(this.aFilters){if(this.oModel._getObject(this.sPath,this.oContext)){this.filter(f);}}}});C.prototype.getRootContexts=function(s,l){if(!s){s=0;}if(!l){l=this.oModel.iSizeLimit;}var c=[];if(!this.oModel.isList(this.sPath)){var o=this.oModel.getContext(this.sPath);if(this.bDisplayRootNode){c=[o];}else{c=this.getNodeContexts(o);}}else{var t=this;q.each(this.oModel._getObject(this.sPath),function(i,O){t._saveSubContext(O,c,t.sPath+(q.sap.endsWith(t.sPath,"/")?"":"/"),i);});}return c.slice(s,s+l);};C.prototype.getNodeContexts=function(c,s,l){if(!s){s=0;}if(!l){l=this.oModel.iSizeLimit;}var a=c.getPath();if(!q.sap.endsWith(a,"/")){a=a+"/";}if(!q.sap.startsWith(a,"/")){a="/"+a;}var b=[],t=this,n=this.oModel._getObject(a),A=this.mParameters&&this.mParameters.arrayNames,d;if(A&&q.isArray(A)){q.each(A,function(i,e){d=n[e];if(d){q.each(d,function(S,o){t._saveSubContext(o,b,a,e+"/"+S);});}});}else{if(n){q.sap.each(n,function(N,o){if(q.isArray(o)){q.each(o,function(S,e){t._saveSubContext(e,b,a,N+"/"+S);});}else if(typeof o=="object"){t._saveSubContext(o,b,a,N);}});}}return b.slice(s,s+l);};C.prototype.hasChildren=function(c){return c?this.getNodeContexts(c).length>0:false;};C.prototype._saveSubContext=function(n,c,s,N){if(n&&typeof n=="object"){var o=this.oModel.getContext(s+N);if(this.aFilters&&!this.bIsFiltering){if(q.inArray(o,this.filterInfo.aFilteredContexts)!=-1){c.push(o);}}else{c.push(o);}}};C.prototype.filter=function(f){if(f&&!q.isArray(f)){f=[f];}this.filterInfo.aFilteredContexts=[];this.filterInfo.oParentContext={};if(!f||!q.isArray(f)||f.length==0){this.aFilters=null;}else{this.aFilters=f;var c=new sap.ui.model.Context(this.oModel,this.sPath);this.filterRecursive(c);}this._fireChange({reason:"filter"});this._fireFilter({filters:f});};C.prototype.filterRecursive=function(p){this.bIsFiltering=true;var c=this.getNodeContexts(p);this.bIsFiltering=false;if(c.length>0){var t=this;q.each(c,function(i,o){t.filterRecursive(o);});this.applyFilter(p);}};C.prototype.applyFilter=function(p){if(!this.aFilters){return;}var t=this,f=[];this.bIsFiltering=true;var u=this.getNodeContexts(p);this.bIsFiltering=false;f=F.apply(u,this.aFilters,function(c,P){return t.oModel.getProperty(P,c);});if(f.length>0){q.merge(this.filterInfo.aFilteredContexts,f);this.filterInfo.aFilteredContexts.push(p);this.filterInfo.oParentContext=p;}if(q.inArray(this.filterInfo.oParentContext,u)!=-1){this.filterInfo.aFilteredContexts.push(p);this.filterInfo.oParentContext=p;}};C.prototype.checkUpdate=function(f){this._fireChange();};return C;},true);
