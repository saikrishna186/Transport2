/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ComboBox','./ComboBoxRenderer','./ListBox','./TextField','./TextFieldRenderer','./library','sap/ui/core/Control','sap/ui/core/History','sap/ui/core/Renderer','jquery.sap.dom'],function(q,C,a,L,T,b,l,c,H,R){"use strict";var S=c.extend("sap.ui.commons.SearchField",{metadata:{interfaces:["sap.ui.commons.ToolbarItem"],library:"sap.ui.commons",properties:{enableListSuggest:{type:"boolean",group:"Behavior",defaultValue:true},showListExpander:{type:"boolean",group:"Behavior",defaultValue:true},enableClear:{type:"boolean",group:"Behavior",defaultValue:false},showExternalButton:{type:"boolean",group:"Behavior",defaultValue:false},enableCache:{type:"boolean",group:"Behavior",defaultValue:true},enableFilterMode:{type:"boolean",group:"Behavior",defaultValue:false},value:{type:"string",group:"Data",defaultValue:''},enabled:{type:"boolean",group:"Behavior",defaultValue:true},editable:{type:"boolean",group:"Behavior",defaultValue:true},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},maxLength:{type:"int",group:"Behavior",defaultValue:0},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:sap.ui.core.TextAlign.Begin},visibleItemCount:{type:"int",group:"Behavior",defaultValue:20},startSuggestion:{type:"int",group:"Behavior",defaultValue:3},maxSuggestionItems:{type:"int",group:"Behavior",defaultValue:10},maxHistoryItems:{type:"int",group:"Behavior",defaultValue:0}},aggregations:{searchProvider:{type:"sap.ui.core.search.SearchProvider",multiple:false}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{search:{parameters:{query:{type:"string"}}},suggest:{parameters:{value:{type:"string"}}}}}});(function(){var _=20;S.prototype.init=function(){g(this,this.getEnableListSuggest());this._oHistory=new H(this.getId());this._clearTooltipText=h("SEARCHFIELD_CLEAR_TOOLTIP");};S.prototype.exit=function(){if(this._ctrl){this._ctrl.destroy();}if(this._lb){this._lb.destroy();}if(this._btn){this._btn.destroy();}this._ctrl=null;this._lb=null;this._btn=null;this._oHistory=null;};S.prototype.onThemeChanged=function(E){if(this.getDomRef()){this.invalidate();}};S.prototype.onAfterRendering=function(){if(this.getShowExternalButton()){var B=this._btn.$().outerWidth(true);this._ctrl.$().css(sap.ui.getCore().getConfiguration().getRTL()?"left":"right",B+"px");}d(this);};S.prototype.getFocusDomRef=function(){return this._ctrl.getFocusDomRef();};S.prototype.getIdForLabel=function(){return this._ctrl.getId()+'-input';};S.prototype.onpaste=function(E){var t=this;setTimeout(function(){t._ctrl._triggerValueHelp=true;t._ctrl.onkeyup();},0);};S.prototype.oncut=S.prototype.onpaste;S.prototype.fireSearch=function(A){var v=q(this._ctrl.getInputDomRef()).val();if(!this.getEditable()||!this.getEnabled()){return this;}this.setValue(v);if(!v&&!this.getEnableFilterMode()){return this;}if(!A){A={};}if(!A.noFocus){v=this.getValue();this.focus();if(v&&(this.getMaxHistoryItems()>0)){this._oHistory.add(v);}this.fireEvent("search",{query:v});}return this;};S.prototype.hasListExpander=function(){return j()?false:this.getShowListExpander();};S.prototype.clearHistory=function(){this._oHistory.clear();};S.prototype.suggest=function(s,i){if(!this.getEnableListSuggest()||!s||!i){return;}this._ctrl.updateSuggestions(s,i);};S.prototype.setEnableListSuggest=function(E){if((this.getEnableListSuggest()&&E)||(!this.getEnableListSuggest()&&!E)){return;}g(this,E);this.setProperty("enableListSuggest",E);return this;};S.prototype.getValue=function(){return f(this,"Value");};S.prototype.setValue=function(v){var r=e(this,"Value",v,!!this.getDomRef(),true);if(this.getEnableClear()&&this.getDomRef()){this.$().toggleClass("sapUiSearchFieldVal",!!v);d(this);}return r;};S.prototype.setEnableCache=function(E){return this.setProperty("enableCache",E,true);};S.prototype.getEnabled=function(){return f(this,"Enabled");};S.prototype.setEnabled=function(E){if(this._btn){this._btn.setEnabled(E&&this.getEditable());}return e(this,"Enabled",E,false,true);};S.prototype.getEditable=function(){return f(this,"Editable");};S.prototype.setEditable=function(E){if(this._btn){this._btn.setEnabled(E&&this.getEnabled());}return e(this,"Editable",E,false,true);};S.prototype.getMaxLength=function(){return f(this,"MaxLength");};S.prototype.setMaxLength=function(m){return e(this,"MaxLength",m,false,true);};S.prototype.getTextAlign=function(){return f(this,"TextAlign");};S.prototype.setTextAlign=function(t){return e(this,"TextAlign",t,false,true);};S.prototype.getTooltip=function(){return f(this,"Tooltip");};S.prototype.setTooltip=function(t){return e(this,"Tooltip",t,true,false);};S.prototype.getVisibleItemCount=function(){return f(this,"MaxPopupItems");};S.prototype.setVisibleItemCount=function(v){return e(this,"MaxPopupItems",v,false,true);};S.prototype.setShowExternalButton=function(s){if(!this._btn){q.sap.require("sap.ui.commons.Button");var t=this;this._btn=new sap.ui.commons.Button(this.getId()+"-btn",{text:h("SEARCHFIELD_BUTTONTEXT"),enabled:this.getEditable()&&this.getEnabled(),press:function(){t.fireSearch();}});this._btn.setParent(this);}this.setProperty("showExternalButton",s);return this;};S.prototype.getAriaDescribedBy=function(){return this._ctrl.getAriaDescribedBy();};S.prototype.getAriaLabelledBy=function(){return this._ctrl.getAriaLabelledBy();};S.prototype.removeAllAriaDescribedBy=function(){return this._ctrl.removeAllAriaDescribedBy();};S.prototype.removeAllAriaLabelledBy=function(){return this._ctrl.removeAllAriaLabelledBy();};S.prototype.removeAriaDescribedBy=function(v){return this._ctrl.removeAriaDescribedBy(v);};S.prototype.removeAriaLabelledBy=function(v){return this._ctrl.removeAriaLabelledBy(v);};S.prototype.addAriaDescribedBy=function(v){this._ctrl.addAriaDescribedBy(v);return this;};S.prototype.addAriaLabelledBy=function(v){this._ctrl.addAriaLabelledBy(v);return this;};var d=function(t){var $=t.$(),i=t._ctrl.$("searchico");if($.hasClass("sapUiSearchFieldClear")&&$.hasClass("sapUiSearchFieldVal")){i.attr("title",t._clearTooltipText);}else{i.removeAttr("title");}};var e=function(t,m,v,s,u){var o=f(t,m);t._ctrl["set"+m](v);if(!s){t.invalidate();}if(u){t.updateModelProperty(m.toLowerCase(),v,o);}return t;};var f=function(t,G){return t._ctrl["get"+G]();};var g=function(t,E){if(!t._lb){t._lb=new L(t.getId()+"-lb");}var o=t._ctrl;var n=null;if(E){n=new S.CB(t.getId()+"-cb",{listBox:t._lb,maxPopupItems:_});n.addDependent(t._lb);}else{n=new S.TF(t.getId()+"-tf");}n.setParent(t);n.addEventDelegate({onAfterRendering:function(){d(t);var F=q(n.getFocusDomRef());var s=F.attr("aria-labelledby")||"";if(s){s=" "+s;}F.attr("aria-labelledby",t.getId()+"-label"+s);}});if(o){n.setValue(o.getValue());n.setEnabled(o.getEnabled());n.setEditable(o.getEditable());n.setMaxLength(o.getMaxLength());n.setTextAlign(o.getTextAlign());n.setTooltip(o.getTooltip());n.setMaxPopupItems(o.getMaxPopupItems());var A=o.getAriaDescribedBy();for(var i=0;i<A.length;i++){n.addAriaDescribedBy(A[i]);}o.removeAllAriaDescribedBy();A=o.getAriaLabelledBy();for(var i=0;i<A.length;i++){n.addAriaLabelledBy(A[i]);}o.removeAllAriaLabelledBy();o.removeAllDependents();o.destroy();}t._ctrl=n;};var h=function(K,A){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");if(r){return r.getText(K,A);}return K;};var j=function(){return sap.ui.Device.browser.mobile;};var k=function(r,o){r.write("<div");r.writeAttributeEscaped('id',o.getId()+'-searchico');r.writeAttribute('unselectable','on');if(sap.ui.getCore().getConfiguration().getAccessibility()){r.writeAttribute("role","presentation");}r.addClass("sapUiSearchFieldIco");r.writeClasses();r.write("></div>");};T.extend("sap.ui.commons.SearchField.TF",{metadata:{visibility:"hidden"},constructor:function(i,s){T.apply(this,arguments);},getInputDomRef:function(){return this.getDomRef("input");},onkeyup:function(E){S.CB.prototype.onkeyup.apply(this,arguments);},_triggerSuggest:function(s){this._sSuggest=null;if((s&&s.length>=this.getParent().getStartSuggestion())||(!s&&this.getParent().getStartSuggestion()==0)){this.getParent().fireSuggest({value:s});}},_checkChange:function(E,D){this.getParent().fireSearch({noFocus:D});},onsapfocusleave:function(E){if(this.getEditable()&&this.getEnabled()&&this.getRenderer().onblur&&E.relatedControlId!=this.getId()){this.getRenderer().onblur(this);}this._checkChange(E,true);},onclick:function(E){if(E.target===this.getDomRef("searchico")){if(this.oPopup&&this.oPopup.isOpen()){this.oPopup.close();}if(this.getEditable()&&this.getEnabled()){this.focus();}if(!this.getParent().getEnableClear()){this._checkChange(E);}else{if(!q(this.getInputDomRef()).val()||!this.getEditable()||!this.getEnabled()){return;}this.setValue("");this._triggerValueHelp=true;this.onkeyup();if(this.getParent().getEnableFilterMode()){q(this.getInputDomRef()).val("");this.getParent().fireSearch();}}}},getMaxPopupItems:function(){return this._iVisibleItemCount?this._iVisibleItemCount:_;},setMaxPopupItems:function(m){this._iVisibleItemCount=m;},renderer:{renderOuterContentBefore:k,renderOuterAttributes:function(r,o){r.addClass("sapUiSearchFieldTf");},renderInnerAttributes:function(r,o){if(!sap.ui.Device.os.ios){r.writeAttribute("type","search");}if(j()){r.writeAttribute('autocapitalize','off');r.writeAttribute('autocorrect','off');}}}});S.TF.prototype.getFocusDomRef=S.TF.prototype.getInputDomRef;C.extend("sap.ui.commons.SearchField.CB",{metadata:{visibility:"hidden"},constructor:function(i,s){C.apply(this,arguments);this._mSuggestions={};this._aSuggestValues=[];this.mobile=false;},updateSuggestions:function(s,i){this._mSuggestions[s]=i;if(this.getInputDomRef()&&q(this.getInputDomRef()).val()===s&&this._hasSuggestValue(s)){this._doUpdateList(s);}},applyFocusInfo:function(F){q(this.getInputDomRef()).val(F.sTypedChars);return this;},_getListBox:function(){return this.getParent()._lb;},_hasSuggestValue:function(s){return this._aSuggestValues.length>0&&s==this._aSuggestValues[this._aSuggestValues.length-1];},_doUpdateList:function(s,i){var E=this._updateList(s);this._aSuggestValues=[s];if((!this.oPopup||!this.oPopup.isOpen())&&!i&&!E){this._open();}else if(this.oPopup&&this.oPopup.isOpen()&&E){this._close();}if(!E&&!this._lastKeyIsDel&&s===q(this.getInputDomRef()).val()){this._doTypeAhead();}},onclick:function(E){C.prototype.onclick.apply(this,arguments);if(E.target===this.getDomRef("searchico")){if(this.oPopup&&this.oPopup.isOpen()){this.oPopup.close();}if(!this.getParent().getEnableClear()){this.getParent().fireSearch();}else if(q(this.getInputDomRef()).val()&&this.getEditable()&&this.getEnabled()){this.setValue("");this._triggerValueHelp=true;this.onkeyup();this._aSuggestValues=[];if(this.getParent().getEnableFilterMode()){q(this.getInputDomRef()).val("");this.getParent().fireSearch();}}if(this.getEditable()&&this.getEnabled()){this.focus();}}else if(q.sap.containsOrEquals(this.getDomRef("providerico"),E.target)){if(this.getEditable()&&this.getEnabled()){this.focus();}}},onkeypress:S.TF.prototype.onkeypress,onkeyup:function(E){var i=q(this.getInputDomRef());var v=i.val();this.getParent().$().toggleClass("sapUiSearchFieldVal",!!v);d(this.getParent());if(E){var K=q.sap.KeyCodes;if(E.keyCode===K.F2){var F=q(this.getFocusDomRef());var D=F.data("sap.InNavArea");if(typeof D==="boolean"){F.data("sap.InNavArea",!D);}}if(C._isHotKey(E)||E.keyCode===K.F4&&E.which===0){return;}if(v&&v==i.getSelectedText()){return;}var m=E.which||E.keyCode;if(m!==K.ESCAPE||this instanceof S.TF){this._triggerValueHelp=true;this._lastKeyIsDel=m==K.DELETE||m==K.BACKSPACE;}}if(this._triggerValueHelp){this._triggerValueHelp=false;if(this._sSuggest){q.sap.clearDelayedCall(this._sSuggest);this._sSuggest=null;}var s=q(this.getInputDomRef()).val();if((s&&s.length>=this.getParent().getStartSuggestion())||(!s&&this.getParent().getStartSuggestion()==0)){this._sSuggest=q.sap.delayedCall(200,this,"_triggerSuggest",[s]);}else if(this._doUpdateList){this._doUpdateList(s,true);}}},_triggerSuggest:function(s){this._sSuggest=null;if(!this._mSuggestions[s]||!this.getParent().getEnableCache()){this._aSuggestValues.push(s);var o=this.getParent().getSearchProvider();if(o){var i=this.getParent();o.suggest(s,function(v,m){if(i){i.suggest(v,m);}});}else{this.getParent().fireSuggest({value:s});}}else{this._doUpdateList(s);}},_updateList:function(s){var E=false;var o=this._getListBox();o.destroyAggregation("items",true);var m=function(o,v,r,t){v=v?v:[];var u=Math.min(v.length,r);if(t&&u>0){o.addItem(new sap.ui.core.SeparatorItem());}for(var i=0;i<u;i++){o.addItem(new sap.ui.core.ListItem({text:v[i]}));}return u;};var n=m(o,this.getParent()._oHistory.get(s),this.getParent().getMaxHistoryItems(),false);var p=m(o,s&&s.length>=this.getParent().getStartSuggestion()?this._mSuggestions[s]:[],this.getParent().getMaxSuggestionItems(),n>0);if(n<=0&&p==0){o.addItem(new sap.ui.core.ListItem({text:h("SEARCHFIELD_NO_ITEMS"),enabled:false}));E=true;}var I=o.getItems().length;var M=this.getMaxPopupItems();o.setVisibleItems(M<I?M:I);o.setSelectedIndex(-1);o.setMinWidth(q(this.getDomRef()).rect().width+"px");o.rerender();return E;},_prepareOpen:function(){},_open:function(){C.prototype._open.apply(this,[0]);},_rerenderListBox:function(){return this._updateList(this._aSuggestValues.length>0?this._aSuggestValues[this._aSuggestValues.length-1]:null)&&!this._forceOpen;},_checkChange:function(E,i,D){this.getParent().fireSearch({noFocus:D});},onsapfocusleave:function(E){if(E.relatedControlId===this._getListBox().getId()){this.focus();return;}this._checkChange(E,true,true);},onfocusout:function(E){if(this.getEditable()&&this.getEnabled()&&this.getRenderer().onblur){this.getRenderer().onblur(this);}this._checkChange(E,true,true);},onsapshow:function(E){if(this.getParent().hasListExpander()){C.prototype.onsapshow.apply(this,arguments);}else{E.preventDefault();E.stopImmediatePropagation();}},_handleSelect:function(o){var i=C.prototype._handleSelect.apply(this,arguments);if(i&&i.getEnabled()){this.getParent().fireSearch();}},renderer:{renderOuterContentBefore:function(r,o){if(o.getParent().hasListExpander()){a.renderOuterContentBefore.apply(this,arguments);}k.apply(this,arguments);if(o.getParent().getSearchProvider()&&o.getParent().getSearchProvider().getIcon()){r.write("<div");r.writeAttribute('id',o.getId()+'-providerico');r.writeAttribute('unselectable','on');if(sap.ui.getCore().getConfiguration().getAccessibility()){r.writeAttribute("role","presentation");}r.addClass("sapUiSearchFieldProvIco");r.writeClasses();r.write("><img");r.writeAttributeEscaped("src",o.getParent().getSearchProvider().getIcon());r.write("/></div>");}},renderOuterAttributes:function(r,o){a.renderOuterAttributes.apply(this,arguments);r.addClass("sapUiSearchFieldCb");if(o.getParent().getSearchProvider()&&o.getParent().getSearchProvider().getIcon()){r.addClass("sapUiSearchFieldCbProv");}},renderInnerAttributes:function(r,o){if(!sap.ui.Device.os.ios){r.writeAttribute("type","search");}if(j()){r.writeAttribute('autocapitalize','off');r.writeAttribute('autocorrect','off');}}}});}());return S;},true);
