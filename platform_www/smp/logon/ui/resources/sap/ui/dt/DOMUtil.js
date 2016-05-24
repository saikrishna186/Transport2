/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/dt/ElementUtil'],function(q,E){"use strict";var D={};D.getSize=function(d){return{width:d.offsetWidth,height:d.offsetHeight};};D.getOffsetFromParent=function(p,P,s,a){var o={left:p.left,top:p.top};if(P){o.left-=(P.left-(a?a:0));o.top-=(P.top-(s?s:0));}return o;};D.getZIndex=function(d){var z;var e=q(d);if(e.length){z=e.zIndex()||e.css("z-index");}return z;};D.getOverflows=function(d){var o;var e=q(d);if(e.length){o={};o.overflowX=e.css("overflow-x");o.overflowY=e.css("overflow-y");}return o;};D.getGeometry=function(d){if(d){return{domRef:d,size:this.getSize(d),position:q(d).offset()};}};D.syncScroll=function(s,t){var $=q(t);var T=$.scrollTop();var o=$.scrollLeft();var a=q(s);var S=a.scrollTop();var b=a.scrollLeft();if(S!==T){$.scrollTop(S);}if(b!==o){$.scrollLeft(b);}};D.getDomRefForCSSSelector=function(d,c){if(!c){return false;}if(c===":sap-domref"){return d;}if(c.indexOf(":sap-domref")>-1){return document.querySelector(c.replace(":sap-domref","#"+this.getEscapedString(d.id)));}return d?d.querySelector(c):undefined;};D.getEscapedString=function(s){return s.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g,'\\$1');};D.setDraggable=function($,v){$.attr("draggable",v);};D.getComputedStyles=function(e){var c;if(typeof e.currentStyle!='undefined'){c=e.currentStyle;}else{c=document.defaultView.getComputedStyle(e);}return c;};D.copyComputedStyle=function(s,d){var S=this.getComputedStyles(s);for(var a in S){try{if(typeof a=="string"&&a!="cssText"&&!/\d/.test(a)&&a.indexOf("margin")===-1){d.style[a]=S[a];if(a=="font"){d.style.fontSize=S.fontSize;}}}catch(e){}}};D.copyComputedStylesForDOM=function(s,d){this.copyComputedStyle(s,d);for(var i=0;i<s.children.length;i++){this.copyComputedStylesForDOM(s.children[i],d.children[i]);}};D.cloneDOMAndStyles=function(n,t){var c=n.cloneNode(true);this.copyComputedStylesForDOM(n,c);var $=q(c);q(t).append($);var p=$.position();if(p.left){$.css("cssText","margin-left : "+-p.left+"px !important");}if(p.top){$.css("cssText","margin-top : "+-p.top+"px !important");}};return D;},true);
