/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObject','sap/ui/base/Object','./Control','./IntervalTrigger','./RenderManager','./UIArea','./PopupSupport','jquery.sap.script'],function(q,M,B,C,I,R,U,P){"use strict";var a=M.extend("sap.ui.core.Popup",{constructor:function(c,m,s,A){M.apply(this);P.apply(this);this._popupUID=q.sap.uid();this.bOpen=false;this.eOpenState=sap.ui.core.OpenState.CLOSED;this._mFocusEvents={};this._mFocusEvents["sap.ui.core.Popup.addFocusableContent-"+this._popupUID]=this._addFocusableArea;this._mFocusEvents["sap.ui.core.Popup.removeFocusableContent-"+this._popupUID]=this._removeFocusableArea;this._mFocusEvents["sap.ui.core.Popup.closePopup-"+this._popupUID]=this._closePopup;this._mFocusEvents["sap.ui.core.Popup.onFocusEvent-"+this._popupUID]=this.onFocusEvent;this._mFocusEvents["sap.ui.core.Popup.increaseZIndex-"+this._popupUID]=this._increaseMyZIndex;if(c){this.setContent(c);}this._oDefaultPosition={my:a.Dock.CenterCenter,at:a.Dock.CenterCenter,of:document,offset:"0 0",collision:"flip"};this._oPosition=q.extend({},this._oDefaultPosition);this._bModal=!!m;this._oPreviousFocus=null;this._sInitialFocusId=null;this._bShadow=typeof(s)==="boolean"?s:true;this._bAutoClose=!!A;this._animations={open:null,close:null};this._durations={open:"fast",close:"fast"};this._iZIndex=-1;this._oBlindLayer=null;this.setNavigationMode();if(this.touchEnabled){this._fAutoCloseHandler=function(e){if(e.isMarked("delayedMouseEvent")||e.isMarked("cancelAutoClose")){return;}if(this.eOpenState===sap.ui.core.OpenState.CLOSING||this.eOpenState===sap.ui.core.OpenState.CLOSED){return;}var d=e.target,p=this._$().get(0),b=q.sap.containsOrEquals(p,d);if(!b){var f=this.getChildPopups();for(var i=0,l=f.length;i<l;i++){var D=q.sap.domById(f[i]);if(q.sap.containsOrEquals(D,d)){b=true;break;}}}if(!b){this.close();}};}this._F6NavigationHandler=function(e){var S={},b=this._sF6NavMode,d;if(b=="DOCK"){if(this._bModal){b="NONE";}else if(this._oLastPosition&&this._oLastPosition.of){d=this._getOfDom(this._oLastPosition.of);if(!d||d===document){d=null;b="NONE";}}}switch(b){case"SCOPE":S.scope=this._$()[0];break;case"DOCK":S.target=d;var D=q(d).parents("[data-sap-ui-popup]");S.scope=D.length?D[0]:null;break;default:S.skip=true;}q.sap.handleF6GroupNavigation(e,S);};},metadata:{library:"sap.ui.core",publicMethods:["open","close","setContent","getContent","setPosition","setShadow","setModal","getModal","setAutoClose","setAutoCloseAreas","isOpen","getAutoClose","getOpenState","setAnimations","setDurations","attachOpened","attachClosed","detachOpened","detachClosed"],associations:{"childPopups":{type:"sap.ui.core.Popup",multiple:true,visibility:"hidden"}},events:{"opened":{},"closed":{}}}});a._activateBlindLayer=true;a.blStack=[];a.Dock={BeginTop:"begin top",BeginCenter:"begin center",BeginBottom:"begin bottom",LeftTop:"left top",LeftCenter:"left center",LeftBottom:"left bottom",CenterTop:"center top",CenterCenter:"center center",CenterBottom:"center bottom",RightTop:"right top",RightCenter:"right center",RightBottom:"right bottom",EndTop:"end top",EndCenter:"end center",EndBottom:"end bottom"};a.prototype.touchEnabled=sap.ui.Device.support.touch||q.sap.simulateMobileOnDesktop;a.prototype.restoreFocus=!sap.ui.Device.support.touch&&!q.sap.simulateMobileOnDesktop;B.extend("sap.ui.core.Popup.Layer",{constructor:function(){var d=this.getDomString();this._$Ref=q(d).appendTo(sap.ui.getCore().getStaticAreaRef());}});a.Layer.prototype.init=function(o,z){this._$Ref.css({"visibility":"visible","z-index":z});this.update(o,z);this._$Ref.insertAfter(o).show();};a.Layer.prototype.update=function(o,z){var b=o.rect();this._$Ref.css({"left":b.left,"top":b.top});if(o.css("right")!="auto"&&o.css("right")!="inherit"){this._$Ref.css({"right":o.css("right"),"width":"auto"});}else{this._$Ref.css({"width":b.width,"right":"auto"});}if(o.css("bottom")!="auto"&&o.css("bottom")!="inherit"){this._$Ref.css({"bottom":o.css("bottom"),"height":"auto"});}else{this._$Ref.css({"height":b.height,"bottom":"auto"});}if(typeof(z)==="number"){this._$Ref.css("z-index",z);}};a.Layer.prototype.reset=function(){this._$Ref.hide().css("visibility","hidden").appendTo(sap.ui.getCore().getStaticAreaRef());};a.Layer.prototype.getDomString=function(){q.sap.log.error("sap.ui.core.Popup.Layer: getDomString function must be overwritten!");return"";};a.Layer.extend("sap.ui.core.Popup.BlindLayer",{constructor:function(){a.Layer.apply(this);}});a.BlindLayer.prototype.getDomString=function(){return"<div class=\"sapUiBliLy\" id=\"sap-ui-blindlayer-"+q.sap.uid()+"\"><iframe scrolling=\"no\" src=\"javascript:''\"	tabIndex=\"-1\"></iframe></div>";};a.prototype.oBlindLayerPool=new sap.ui.base.ObjectPool(a.BlindLayer);a.Layer.extend("sap.ui.core.Popup.ShieldLayer",{constructor:function(){a.Layer.apply(this);}});a.ShieldLayer.prototype.getDomString=function(){return"<div class=\"sapUiPopupShield\" id=\"sap-ui-shieldlayer-"+q.sap.uid()+"\"></div>";};a.prototype.oShieldLayerPool=new sap.ui.base.ObjectPool(a.ShieldLayer);(function(){var l=0;a.getLastZIndex=function(){return l;};a.prototype.getLastZIndex=function(){return a.getLastZIndex();};a.getNextZIndex=function(){l+=10;return l;};a.prototype.getNextZIndex=function(){return a.getNextZIndex();};}());var r=function(o,b){var p=3;var l=Math.abs(o.left-b.left);var t=Math.abs(o.top-b.top);var w=Math.abs(o.width-b.width);var h=Math.abs(o.height-b.height);if(l>p||t>p||w>p||h>p){return false;}return true;};a.prototype.open=function(d,m,b,o,c,f,g){if(this.eOpenState!=sap.ui.core.OpenState.CLOSED){return;}this.eOpenState=sap.ui.core.OpenState.OPENING;var s;try{s=sap.ui.getCore().getStaticAreaRef();s=sap.ui.getCore().getUIArea(s);}catch(e){q.sap.log.error(e);throw new Error("Popup cannot be opened because static UIArea cannot be determined.");}this._bContentAddedToStatic=false;if(this.oContent instanceof C&&!this.oContent.getParent()){s.addContent(this.oContent,true);this._bContentAddedToStatic=true;}if(this.oContent.getUIArea){var A=this.oContent.getUIArea();if(A===null){q.sap.log.warning("The Popup content is NOT connected with an UIArea and may not work properly!");}else if(a._bEnableUIAreaCheck&&A.getRootNode().id!==s.getRootNode().id){q.sap.log.warning("The Popup content is NOT connected with the static-UIArea and may not work properly!");}}if(typeof(d)=="string"){g=f;f=c;c=o;o=b;b=m;m=d;d=-1;}if(d===undefined){d=-1;}if(this.restoreFocus){this._oPreviousFocus=a.getCurrentFocusInfo();}if(this.isInPopup(o)||this.isInPopup(this._oPosition.of)){var p=this.getParentPopupId(o)||this.getParentPopupId(this._oPosition.of);var h="";var i=this.getContent();if(i instanceof sap.ui.core.Element){h=i.getId();}else if(typeof i==="object"){h=i.id;}this.addChildToPopup(p,h);this.addChildToPopup(p,this._popupUID);}var $=this._$(true);var j="fast";if((d===0)||(d>0)){j=d;}else if((this._durations.open===0)||(this._durations.open>0)){j=this._durations.open;}var _;if(m||b||o||c||f){_=this._createPosition(m,b,o,c,f);this._oPosition=_;}else{_=this._oPosition;}if(!_.of){_.of=this._oPosition.of||document;}this._iZIndex=this._iZIndex===this.getLastZIndex()?this._iZIndex:this.getNextZIndex();var S=sap.ui.getCore().getStaticAreaRef();$.css({"position":"absolute","visibility":"hidden"});if(!($[0].parentNode==S)){$.appendTo(S);}$.css("z-index",this._iZIndex);q.sap.log.debug("position popup content "+$.attr("id")+" at "+(window.JSON?JSON.stringify(_.at):String(_.at)));this._applyPosition(_);if(g!==undefined){this.setFollowOf(g);}var t=this;if(q.sap.isMouseEventDelayed){if(this._oTopShieldLayer){q.sap.clearDelayedCall(this._iTopShieldRemoveTimer);this._iTopShieldRemoveTimer=null;}else{this._oTopShieldLayer=this.oShieldLayerPool.borrowObject($,this._iZIndex+1);}this._iTopShieldRemoveTimer=q.sap.delayedCall(500,this,function(){this.oShieldLayerPool.returnObject(this._oTopShieldLayer);this._oTopShieldLayer=null;this._iTopShieldRemoveTimer=null;});}var O=function(){t.bOpen=true;$.css("display","block");if(t._bModal||t._bAutoClose||t._sInitialFocusId){var k=null;if(t._sInitialFocusId){var l=sap.ui.getCore().byId(t._sInitialFocusId);if(l){k=l.getFocusDomRef();}k=k||q.sap.domById(t._sInitialFocusId);}q.sap.focus(k||$.firstFocusableDomRef());var n=t._getOfDom(t._oLastPosition.of);var u=q(n).rect();if(t._oLastOfRect&&u&&!r(t._oLastOfRect,u)){t._applyPosition(t._oLastPosition);}}t.eOpenState=sap.ui.core.OpenState.OPEN;if(t.getFollowOf()){a.DockTrigger.addListener(a.checkDocking,t);}t._updateBlindLayer();if(!!sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version===9){q.sap.delayedCall(0,t,function(){t.fireOpened();});}else{t.fireOpened();}};$.toggleClass("sapUiShd",this._bShadow).hide().css("visibility","visible");if(j==0){O.apply();}else if(this._animations.open){this._animations.open.call(null,$,j,O);}else{$.fadeIn(j,O);}if(!!sap.ui.Device.browser.internet_explorer&&!sap.ui.Device.os.windows_phone&&a._activateBlindLayer){this._oBlindLayer=this.oBlindLayerPool.borrowObject($,this._iZIndex-1);}if(this._bModal){this._showBlockLayer();}if(this.oContent instanceof sap.ui.core.Element){this.oContent.addDelegate(this);}this.bOpen=true;if(this._bModal||this._bAutoClose){this._addFocusEventListeners();}this._$(false,true).on("keydown",q.proxy(this._F6NavigationHandler,this));if(this.touchEnabled&&!this._bModal&&this._bAutoClose){q(document).on("touchstart mousedown",q.proxy(this._fAutoCloseHandler,this));}if(this._oBlindLayer){this._resizeListenerId=sap.ui.core.ResizeHandler.register(this._$().get(0),q.proxy(this.onresize,this));}};a.prototype.onFocusEvent=function(b){var e=q.event.fix(b);if(arguments.length>1&&arguments[1]==="sap.ui.core.Popup.onFocusEvent-"+this._popupUID){e=q.event.fix(arguments[2]);}var t=(e.type=="focus"||e.type=="activate")?"focus":"blur";var c=false;if(t=="focus"){var d=this._$().get(0);if(d){c=q.sap.containsOrEquals(d,e.target);var f=this.getChildPopups();if(!c){for(var i=0,l=f.length;i<l;i++){var o=q.sap.domById(f[i]);if(o){c=q.sap.containsOrEquals(o,e.target);if(c){break;}}}}q.sap.log.debug("focus event on "+e.target.id+", contains: "+c);if(this._bModal&&!c){var T=(a.getLastZIndex()==this._iZIndex);if(T){if(!sap.ui.Device.support.touch||q(e.target).is(":input")){var D=this.oLastBlurredElement?this.oLastBlurredElement:d;q.sap.focus(D);}}}else if(this._bAutoClose&&c&&this._sTimeoutId){q.sap.clearDelayedCall(this._sTimeoutId);this._sTimeoutId=null;}}}else if(t=="blur"){q.sap.log.debug("blur event on "+e.target.id);if(this._bModal){this.oLastBlurredElement=e.target;}else if(this._bAutoClose){if(!this.touchEnabled&&!this._sTimeoutId){if(e.target===document.activeElement){return;}var g=typeof this._durations.close==="string"?0:this._durations.close;this._sTimeoutId=q.sap.delayedCall(g,this,function(){this.close(g,"autocloseBlur");var O=this._oLastPosition&&this._oLastPosition.of;if(O){var p=this.getParentPopupId(O);if(p){var E="sap.ui.core.Popup.onFocusEvent-"+p;sap.ui.getCore().getEventBus().publish("sap.ui",E,e);}}});}}}};a.prototype.setInitialFocusId=function(i){this._sInitialFocusId=i;};a.prototype.close=function(d){if(a._autoCloseDebug){return;}if(this._sTimeoutId){q.sap.clearDelayedCall(this._sTimeoutId);this._sTimeoutId=null;if(arguments.length>1){var A=arguments[1];if(typeof(A)=="string"&&A=="autocloseBlur"&&this._isFocusInsidePopup()){return;}}}if(this.eOpenState==sap.ui.core.OpenState.CLOSED||this.eOpenState==sap.ui.core.OpenState.CLOSING){return;}var i="fast";if((d===0)||(d>0)){i=d;}else if((this._durations.close===0)||(this._durations.close>0)){i=this._durations.close;}if(i===0&&this.eOpenState==sap.ui.core.OpenState.OPENING){return;}this.eOpenState=sap.ui.core.OpenState.CLOSING;if(this.getFollowOf()){a.DockTrigger.removeListener(a.checkDocking,this);}if(this.oContent&&this._bContentAddedToStatic){sap.ui.getCore().getEventBus().publish("sap.ui","__beforePopupClose",{domNode:this._$().get(0)});var s=sap.ui.getCore().getStaticAreaRef();s=sap.ui.getCore().getUIArea(s);s.removeContent(s.indexOfContent(this.oContent),true);}this._bContentAddedToStatic=false;this._sTimeoutId=null;if(this.fEventHandler){this._removeFocusEventListeners();}this._$(false,true).off("keydown",this._F6NavigationHandler);if(this.touchEnabled){if(!this._bModal&&this._bAutoClose){q(document).off("touchstart mousedown",this._fAutoCloseHandler);}}if(this.oContent instanceof sap.ui.core.Element){this.oContent.removeDelegate(this);}var $=this._$();if(this._bEventBusEventsRegistered){this._unregisterEventBusEvents();}if(this._oBlindLayer){this.oBlindLayerPool.returnObject(this._oBlindLayer);}this._oBlindLayer=null;var t=this;if(q.sap.isMouseEventDelayed){if(this._oBottomShieldLayer){q.sap.clearDelayedCall(this._iBottomShieldRemoveTimer);this._iBottomShieldRemoveTimer=null;}else{this._oBottomShieldLayer=this.oShieldLayerPool.borrowObject($,this._iZIndex-3);}this._iBottomShieldRemoveTimer=q.sap.delayedCall(500,this,function(){this.oShieldLayerPool.returnObject(this._oBottomShieldLayer);this._oBottomShieldLayer=null;this._iBottomShieldRemoveTimer=null;});}if(this.isInPopup(this._oLastPosition.of)){var p=this.getParentPopupId(this._oLastPosition.of);var c="";var o=this.getContent();if(o instanceof sap.ui.core.Element){c=o.getId();}else if(typeof o==="object"){c=o.id;}this.removeChildFromPopup(p,c);this.removeChildFromPopup(p,this._popupUID);}var f=function(){q($).hide().css({"visibility":"hidden","left":"0px","top":"0px","right":""});$=t._$(false,true);if($.length){q($).hide().css({"visibility":"hidden","left":"0px","top":"0px","right":""});}if(t.restoreFocus){if(t._bModal){a.applyFocusInfo(t._oPreviousFocus);t._oPreviousFocus=null;t.oLastBlurredElement=null;}}t.bOpen=false;t.eOpenState=sap.ui.core.OpenState.CLOSED;t.fireClosed();var b=t.getChildPopups();for(var j=0,l=b.length;j<l;j++){t.closePopup(b[j]);}};if(i==0){f.apply();}else if(this._animations.close){this._animations.close.call(null,$,i,f);}else{$.fadeOut(i,f);}if(this._bModal){this._hideBlockLayer();}if(this._resizeListenerId){sap.ui.core.ResizeHandler.deregister(this._resizeListenerId);this._resizeListenerId=null;}};a.getCurrentFocusInfo=function(){var _=null;var f=sap.ui.getCore().getCurrentFocusedControlId();if(f){var F=sap.ui.getCore().byId(f);_={'sFocusId':f,'oFocusInfo':F?F.getFocusInfo():{}};}else{try{var e=document.activeElement;if(e){_={'sFocusId':e.id,'oFocusedElement':e,'oFocusInfo':{}};}}catch(b){_=null;}}if(_){_.popup=this;}return _;};a.applyFocusInfo=function(p){if(p){var f=sap.ui.getCore().byId(p.sFocusId);if(f){f.applyFocusInfo(p.oFocusInfo);}else{var e=q.sap.domById(p.sFocusId)||p.oFocusedElement;q.sap.focus(e);}}};a.prototype.setContent=function(c){this.oContent=c;return this;};a.prototype.getContent=function(){return this.oContent;};a.prototype.setPosition=function(m,b,o,c,d){this._oPosition=this._createPosition(m,b,o,c,d);if(this.eOpenState!=sap.ui.core.OpenState.CLOSED){this._applyPosition(this._oPosition);this._oBlindLayer&&this._oBlindLayer.update(this._$());}return this;};a.prototype._createPosition=function(m,b,o,c,d){var n=false;if(m&&(m.indexOf("+")>=0||m.indexOf("-")>=0)){n=true;if(c&&c!="0 0"){q.sap.log.warning("offset used in my and in offset, the offset value will be ignored","sap.ui.core.Popup","setPosition");}c=null;}var p=q.extend({},this._oDefaultPosition,{"my":m||this._oDefaultPosition.my,"at":b||this._oDefaultPosition.at,"of":o,"offset":c,"collision":d});if(!q.ui.version){if(a._bNewOffset==null){a._bNewOffset=true;if(!(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version==8&&q.sap.Version(q().jquery).compareTo("1.8.1")<0)){var D=q(document.createElement("div"));D.position({of:window,using:function(f,g){a._bNewOffset=(g!==undefined);}});}}}var e=[];var O=[];if(a._bNewOffset||q.sap.Version(q.ui.version).compareTo("1.8.23")>0){if(c&&c!="0 0"){e=p.my.split(" ");O=c.split(" ");var s=[parseInt(O[0],10)<0?"":"+",parseInt(O[1],10)<0?"":"+"];p.my=e[0]+s[0]+O[0]+" "+e[1]+s[1]+O[1];p.offset=null;}}else if(n){e=p.my.split(" ");O=["",""];var i=e[0].indexOf("+");if(i<0){i=e[0].indexOf("-");}if(i>=0){O[0]=e[0].slice(i);e[0]=e[0].slice(0,i);}i=e[1].indexOf("+");if(i<0){i=e[1].indexOf("-");}if(i>=0){O[1]=e[1].slice(i);e[1]=e[1].slice(0,i);}p.my=e[0]+" "+e[1];p.offset=O[0]+" "+O[1];}return p;};a.prototype._getPositionOffset=function(){var o=[];if(this._oPosition.my&&(this._oPosition.my.indexOf("+")>=0||this._oPosition.my.indexOf("-")>=0)){var m=this._oPosition.my.split(" ");var i=m[0].indexOf("+");if(i<0){i=m[0].indexOf("-");}if(i>=0){o[0]=m[0].slice(i);}i=m[1].indexOf("+");if(i<0){i=m[1].indexOf("-");}if(i>=0){o[1]=m[1].slice(i);}}else if(this._oPosition.offset){o=this._oPosition.offset.split(" ");}return o;};a.prototype._applyPosition=function(p){var b=sap.ui.getCore().getConfiguration().getRTL();var $=this._$();var A=p.at;if(typeof(A)==="string"){$.css("display","block").position(this._resolveReference(this._convertPositionRTL(p,b)));this._fixPositioning(p,b);}else if(sap.ui.core.CSSSize.isValid(A.left)&&sap.ui.core.CSSSize.isValid(A.top)){$.css({"left":A.left,"top":A.top});}else if(sap.ui.core.CSSSize.isValid(A.right)&&sap.ui.core.CSSSize.isValid(A.top)){$.css({"right":A.right,"top":A.top});}else if(typeof(A.left)==="number"&&typeof(A.top)==="number"){var d=$[0];if(d&&d.style.right){var w=$.outerWidth();$.css({"right":(document.documentElement.clientWidth-(A.left+w))+"px","top":A.top+"px"});}else{$.css({"left":A.left+"px","top":A.top+"px"});}}this._oLastPosition=p;this._oLastOfRect=this._calcOfRect(p.of);};a.prototype._calcOfRect=function(o){var O=this._getOfDom(o);if(O){return q(O).rect();}return null;};a.prototype._getOfDom=function(o){if(o instanceof q.Event){return null;}var O;if(typeof(o)==="string"){O=q.sap.byId(o);}else if(o instanceof q){O=o;}else{O=q(o instanceof sap.ui.core.Element?o.getDomRef():o);}return O[0];};a.prototype._convertPositionRTL=function(p,b){var f=q.extend({},p);if(b){var n=false;if(f.my&&(f.my.indexOf("+")>=0||f.my.indexOf("-")>=0)){n=true;}if((f.offset||n)&&((f.my.indexOf("begin")>-1)||(f.my.indexOf("end")>-1))&&((f.at.indexOf("begin")>-1)||(f.at.indexOf("end")>-1))){if(n){var m=f.my.split(" ");if(m.length==2){f.my="";if(m[0]){if(m[0].indexOf("begin")>-1||m[0].indexOf("end")>-1){if(m[0].indexOf("+")>-1){m[0]=m[0].replace("+","-");}else if(m[0].indexOf("-")>-1){m[0]=m[0].replace("-","+");}}f.my=m[0];}if(m[1]){if(m[1].indexOf("begin")>-1||m[1].indexOf("end")>-1){if(m[1].indexOf("+")>-1){m[1]=m[1].replace("+","-");}else if(m[1].indexOf("-")>-1){m[1]=m[1].replace("-","+");}}if(m[0]){f.my=f.my+" ";}f.my=f.my+m[1];}}}else{f.offset=this._mirrorOffset(f.offset);}}f.my=f.my.replace("begin","right").replace("end","left");f.at=f.at.replace("begin","right").replace("end","left");}else{f.my=f.my.replace("end","right").replace("begin","left");f.at=f.at.replace("end","right").replace("begin","left");}return f;};a.prototype._mirrorOffset=function(o){var O=q.trim(o).split(/\s/);var p=parseInt(O[0],10);return(-p)+" "+O[O.length-1];};a.prototype._fixPositioning=function(p,b){var m=p.my;var $=this._$();var c=0;if(typeof(m)==="string"){if(b&&((m.indexOf("right")>-1)||(m.indexOf("begin")>-1)||(m.indexOf("center")>-1))){$=this._$();c=q(window).width()-$.outerWidth()-$.offset().left;$.css({"right":c+"px","left":""});}else if((m.indexOf("right")>-1)||(m.indexOf("end")>-1)){$=this._$();c=q(window).width()-$.outerWidth()-$.offset().left;$.css({"right":c+"px","left":""});}}};a.prototype._resolveReference=function(p){var o=p;if(p.of instanceof sap.ui.core.Element){o=q.extend({},p,{of:p.of.getDomRef()});}return o;};a.prototype.setShadow=function(s){this._bShadow=s;if(this.eOpenState!=sap.ui.core.OpenState.CLOSED){this._$().toggleClass("sapUiShd",s);}return this;};a.prototype.setModal=function(m,s){var o=this._bModal;this._bModal=m;this._sModalCSSClass=s;if(this.isOpen()){if(o!==m){if(m){this._showBlockLayer();}else{this._hideBlockLayer();}if(this.touchEnabled&&this._bAutoClose){if(!m){q(document).on("touchstart mousedown",q.proxy(this._fAutoCloseHandler,this));}else{q(document).off("touchstart mousedown",this._fAutoCloseHandler);}}}}return this;};a.prototype.getModal=function(){return this._bModal;};a.prototype.setNavigationMode=function(m){if(m!="NONE"&&m!="DOCK"&&m!="SCOPE"){this._sF6NavMode="NONE";}this._sF6NavMode=m;};a.prototype.setAutoClose=function(A){if(this.touchEnabled&&this.isOpen()&&this._bAutoClose!==A){if(!this._bModal){if(A){q(document).on("touchstart mousedown",q.proxy(this._fAutoCloseHandler,this));}else{q(document).off("touchstart mousedown",this._fAutoCloseHandler);}}}this._bAutoClose=A;return this;};a.prototype.setAutoCloseAreas=function(A){for(var i=0,l=A.length;i<l;i++){var s="";if(A[i]instanceof sap.ui.core.Element){s=A[i].getId();}else if(typeof A[i]==="object"){s=A[i].id;}else if(typeof A[i]==="string"){s=A[i];}if(q.inArray(s,this.getChildPopups())===-1){this.addChildPopup(s);}}return this;};a.prototype.setAnimations=function(o,c){if(o&&(typeof(o)=="function")){this._animations.open=o;}if(c&&(typeof(c)=="function")){this._animations.close=c;}return this;};a.prototype.setDurations=function(o,c){if((o>0)||(o===0)){this._durations.open=o;}if((c>0)||(c===0)){this._durations.close=c;}return this;};a.CLOSE_ON_SCROLL="close_Popup_if_of_is_moved";a.prototype._fnCloseOnScroll=function(e){this.close();};a.prototype.setFollowOf=function(f){a.DockTrigger.removeListener(a.checkDocking,this);var u=false;this._bFollowOf=true;this._followOfHandler=null;if(typeof(f)==="function"){this._followOfHandler=f;u=true;}else if(typeof(f)==="boolean"){u=f;}else if(f===a.CLOSE_ON_SCROLL){this._followOfHandler=this._fnCloseOnScroll;u=true;}else{this._bFollowOf=false;if(f!==null){q.sap.log.error("Trying to set an invalid type to 'followOf: "+f);}}if(u&&this._oLastPosition){this._oLastOfRect=this._calcOfRect(this._oLastPosition.of);}if(this._bFollowOf&&this.getOpenState()===sap.ui.core.OpenState.OPEN){a.DockTrigger.addListener(a.checkDocking,this);}};a.prototype.getAutoClose=function(){return this._bAutoClose;};a.prototype.getFollowOf=function(){if(this._bFollowOf){return typeof(this._followOfHandler)==="function"?this._followOfHandler:true;}return false;};a.prototype.isOpen=function(){return this.bOpen;};a.prototype.getOpenState=function(){return this.eOpenState;};a.prototype.destroy=function(){if(this._resizeListenerId){sap.ui.core.ResizeHandler.deregister(this._resizeListenerId);this._resizeListenerId=null;}this.close();this.oContent=null;if(this._bFollowOf){this.setFollowOf(null);}if(this._bEventBusEventsRegistered){this._unregisterEventBusEvents();}};a.prototype.exit=function(){delete this._mFocusEvents;};a.prototype._addFocusEventListeners=function(c,e,E){if(!this.fEventHandler){this.fEventHandler=q.proxy(this.onFocusEvent,this);}var p=this._$();var b=this.getChildPopups();var d={};var i=0,l=0;if(document.addEventListener&&!sap.ui.Device.browser.internet_explorer){document.addEventListener("focus",this.fEventHandler,true);p.get(0).addEventListener("blur",this.fEventHandler,true);for(i=0,l=b.length;i<l;i++){d=q.sap.domById(b[i]);if(d){d.addEventListener("blur",this.fEventHandler,true);}}}else{q(document).bind("activate."+this._popupUID,this.fEventHandler);p.bind("deactivate."+this._popupUID,this.fEventHandler);for(i=0,l=b.length;i<l;i++){d=q.sap.domById(b[i]);if(d){q(d).bind("deactivate."+this._popupUID,this.fEventHandler);}}}};a.prototype._removeFocusEventListeners=function(c,e,E){var p=this._$(false,true);if(!p.length){return;}var b=this.getChildPopups();var d={};var i=0,l=0;if(document.removeEventListener&&!sap.ui.Device.browser.internet_explorer){document.removeEventListener("focus",this.fEventHandler,true);p.get(0).removeEventListener("blur",this.fEventHandler,true);for(i=0,l=b.length;i<l;i++){d=q.sap.domById(b[i]);if(d){d.removeEventListener("blur",this.fEventHandler,true);}this.closePopup(b[i]);}}else{q(document).unbind("activate."+this._popupUID,this.fEventHandler);p.unbind("deactivate."+this._popupUID,this.fEventHandler);for(i=0,l=b.length;i<l;i++){d=q.sap.domById(b[i]);if(d){q(d).unbind("deactivate."+this._popupUID,this.fEventHandler);}}}this.fEventHandler=null;};a.prototype._registerEventBusEvents=function(c,e,E){var t=this;q.each(t._mFocusEvents,function(s,l){sap.ui.getCore().getEventBus().subscribe("sap.ui",s,l,t);});this._bEventBusEventsRegistered=true;};a.prototype._unregisterEventBusEvents=function(c,e,E){var t=this;q.each(t._mFocusEvents,function(s,l){sap.ui.getCore().getEventBus().unsubscribe("sap.ui",s,l,t);});delete this._bEventBusEventsRegistered;};a.prototype._addFocusableArea=function(c,e,E){if(q.inArray(E.id,this.getChildPopups())===-1){this.addChildPopup(E.id);}};a.prototype._removeFocusableArea=function(c,e,E){this.removeChildPopup(E.id);};a.prototype._closePopup=function(c,e,E){this.close(typeof this._durations.close==="string"?0:this._durations.close);};a.prototype._setIdentity=function($){if(typeof $==="object"){$.attr("data-sap-ui-popup",this._popupUID);}else{q.sap.log.warning("Incorrect DomRef-type for 'setIdentity': "+$,this);return;}if(!this._bEventBusEventsRegistered){this._registerEventBusEvents();}};a.prototype._$=function(f,g){var c;if(this.oContent instanceof C){c=this.oContent.$();if(f||(c.length===0&&!g)){q.sap.log.info("Rendering of popup content: "+this.oContent.getId());if(c.length>0){R.preserveContent(c[0],true,false);}sap.ui.getCore().getRenderManager().render(this.oContent,sap.ui.getCore().getStaticAreaRef());c=this.oContent.$();}}else if(this.oContent instanceof sap.ui.core.Element){c=this.oContent.$();}else{c=q(this.oContent);}this._setIdentity(c);return c;};a.prototype._showBlockLayer=function(){var b=q("#sap-ui-blocklayer-popup"),c="sapUiBLy"+(this._sModalCSSClass?" "+this._sModalCSSClass:"");if(b.length===0){b=q('<div id="sap-ui-blocklayer-popup" tabindex="0" class="'+c+'"></div>');b.appendTo(sap.ui.getCore().getStaticAreaRef());}else{b.removeClass().addClass(c);}a.blStack.push(this._iZIndex-2);b.css({"z-index":this._iZIndex-2,"visibility":"visible"}).show();q("html").addClass("sapUiBLyBack");};a.prototype._hideBlockLayer=function(){a.blStack.pop();if(a.blStack.length>0){q("#sap-ui-blocklayer-popup").css({"z-index":a.blStack[a.blStack.length-1],"visibility":"visible"}).show();}else{q("#sap-ui-blocklayer-popup").css("visibility","hidden").hide();q("html").removeClass("sapUiBLyBack");}};a.prototype._isFocusInsidePopup=function(){var d=this._$(false).get(0);if(d&&q.sap.containsOrEquals(d,document.activeElement)){return true;}return false;};a.DockTrigger=new I(200);a.checkDocking=function(){if(this.getOpenState()===sap.ui.core.OpenState.OPEN){var c=this._getOfDom(this._oLastPosition.of),o=q(c).rect();if(!o){this.close();return;}else if(o.left===0&&o.top===0&&o.height===0&&o.height===0&&this._oLastPosition.of.id){this._oLastPosition.of=q.sap.domById(this._oLastPosition.of.id);c=this._getOfDom(this._oLastPosition.of);o=q(c).rect();if(!o){this.close();return;}}if(!q.sap.containsOrEquals(document.documentElement,c)){if(c.id&&c.id!==""){var n=q.sap.domById(c.id);var N=q(n).rect();if(N&&!r(o,N)){o=N;delete this._oLastPosition.of;this._oLastPosition.of=n;}}}if(this._oLastOfRect){if(!r(this._oLastOfRect,o)){if(this._followOfHandler){var l=q.extend(true,{},this._oLastPosition),L=q.extend(true,{},this._oLastOfRect);this._followOfHandler({lastPosition:l,lastOfRect:L,currentOfRect:o});}else{this._applyPosition(this._oLastPosition);}}}}};a.prototype.ontouchstart=function(e){this.onmousedown(e,true);this._bMousedownCalled=true;};a.prototype.onmousedown=function(e,s){if(this._bMousedownCalled&&!s){this._bMousedownCalled=false;return;}if(this._iZIndex===this.getLastZIndex()||this.getModal()){return;}this._increaseMyZIndex("","mousedown",e);};a.prototype._increaseMyZIndex=function(c,e,E){var p=this.getParentPopup(this._oLastPosition.of);if(E&&E.type==="mousedown"||E&&E.isFromParentPopup||p.length===0){this._iZIndex=this.getNextZIndex();var $=this._$(false,true);$.css("z-index",this._iZIndex);if(this._oBlindLayer){this._oBlindLayer.update($,this._iZIndex-1);}if(E&&!E.type||E&&E.type!="mousedown"||e==="mousedown"){var b=this.getChildPopups();for(var i=0,l=b.length;i<l;i++){this.increaseZIndex(b[i],true);}}}else if(p.length>0){var s=q(p.get(0)).attr("data-sap-ui-popup");this.increaseZIndex(s,false);}};a.prototype.onAfterRendering=function(e){var $=this.getContent().$();$.toggleClass("sapUiShd",this._bShadow);$.css("position","absolute");this._setIdentity($);var b=$[0];var l=b.style.left;var c=b.style.right;var t=b.style.top;var d=b.style.bottom;if(!(l&&l!="auto"||c&&c!="auto"||t&&t!="auto"||d&&d!="auto")){q.sap.log.debug("reposition popup content "+$.attr("id")+" at "+(window.JSON?JSON.stringify(this._oLastPosition.at):String(this._oLastPosition.at)));this._applyPosition(this._oLastPosition);}$.show().css({"visibility":"visible","z-index":this._iZIndex});if(this._oBlindLayer){this._resizeListenerId=sap.ui.core.ResizeHandler.register(this._$().get(0),q.proxy(this.onresize,this));}if(this.isOpen()&&(this.getModal()||this.getAutoClose())){this._addFocusEventListeners();}this._$(false,true).on("keydown",q.proxy(this._F6NavigationHandler,this));};a.prototype.onBeforeRendering=function(e){if(this._resizeListenerId){sap.ui.core.ResizeHandler.deregister(this._resizeListenerId);this._resizeListenerId=null;}if(this.isOpen()&&(this.getModal()||this.getAutoClose())){this._removeFocusEventListeners();}this._$(false,true).off("keydown",this._F6NavigationHandler);};a.prototype.onresize=function(e){if(this.eOpenState!=sap.ui.core.OpenState.CLOSED&&this._oBlindLayer){var t=this;setTimeout(function(){t._updateBlindLayer();},0);}};a.prototype._updateBlindLayer=function(){if(this.eOpenState!=sap.ui.core.OpenState.CLOSED&&this._oBlindLayer){this._oBlindLayer.update(this._$());}};return a;},true);
