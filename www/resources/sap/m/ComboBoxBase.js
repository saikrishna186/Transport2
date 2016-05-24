/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Bar','./ComboBoxBaseRenderer','./Dialog','./ComboBoxTextField','./SelectList','./Popover','./library','sap/ui/core/EnabledPropagator','sap/ui/core/IconPool'],function(q,B,C,D,a,S,P,l,E,I){"use strict";var b=a.extend("sap.m.ComboBoxBase",{metadata:{library:"sap.m",defaultAggregation:"items",aggregations:{items:{type:"sap.ui.core.Item",multiple:true,singularName:"item",bindable:"bindable"},picker:{type:"sap.ui.core.PopupInterface",multiple:false,visibility:"hidden"}}}});b.prototype.updateItems=function(r){this.bDataUpdated=false;this.destroyItems();this.updateAggregation("items");this.bDataUpdated=true;};b.prototype.refreshItems=function(){this.bDataUpdated=false;this.refreshAggregation("items");};b.prototype.getList=function(){if(this.bIsDestroyed){return null;}return this._oList;};b.prototype.init=function(){a.prototype.init.apply(this,arguments);this.setPickerType("Popover");this.createPicker(this.getPickerType());this.bDataUpdated=false;};b.prototype.exit=function(){a.prototype.exit.apply(this,arguments);if(this.getList()){this.getList().destroy();this._oList=null;}};b.prototype.ontouchstart=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();if(this.isOpenArea(e.target)){this.addStyleClass(C.CSS_CLASS_COMBOBOXBASE+"Pressed");}};b.prototype.ontouchend=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();if((!this.isOpen()||!this.hasContent())&&this.isOpenArea(e.target)){this.removeStyleClass(C.CSS_CLASS_COMBOBOXBASE+"Pressed");}};b.prototype.ontap=function(e){var c=C.CSS_CLASS_COMBOBOXBASE;if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();if(this.isOpenArea(e.target)){if(this.isOpen()){this.close();this.removeStyleClass(c+"Pressed");return;}if(this.hasContent()){this.open();}}if(this.isOpen()){this.addStyleClass(c+"Pressed");}};b.prototype.onsapshow=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();if(e.keyCode===q.sap.KeyCodes.F4){e.preventDefault();}if(this.isOpen()){this.close();return;}this.selectText(0,this.getValue().length);if(this.hasContent()){this.open();}};b.prototype.onsapescape=function(e){if(this.getEnabled()&&this.getEditable()&&this.isOpen()){e.setMarked();e.preventDefault();this.close();}else{a.prototype.onsapescape.apply(this,arguments);}};b.prototype.onsaphide=b.prototype.onsapshow;b.prototype.onsapfocusleave=function(e){if(!e.relatedControlId){a.prototype.onsapfocusleave.apply(this,arguments);return;}var c=sap.ui.getCore().byId(e.relatedControlId);if(c===this){return;}var p=this.getAggregation("picker"),f=c&&c.getFocusDomRef();if(p&&q.sap.containsOrEquals(p.getFocusDomRef(),f)){return;}a.prototype.onsapfocusleave.apply(this,arguments);};b.prototype.bShowLabelAsPlaceholder=sap.ui.Device.browser.msie;b.prototype.getPopupAnchorDomRef=function(){return this.getDomRef();};b.prototype.getDomRefForValueStateMessage=function(){return this.getDomRef();};b.prototype.addContent=function(p){};b.prototype.setPickerType=function(p){this._sPickerType=p;};b.prototype.getPickerType=function(){return this._sPickerType;};b.prototype.createPicker=function(){};b.prototype.getPicker=function(){if(this.bIsDestroyed){return null;}return this.createPicker(this.getPickerType());};b.prototype.hasContent=function(){return!!this.getItems().length;};b.prototype.findFirstEnabledItem=function(i){var L=this.getList();return L?L.findFirstEnabledItem(i):null;};b.prototype.findLastEnabledItem=function(i){var L=this.getList();return L?L.findLastEnabledItem(i):null;};b.prototype.open=function(){var p=this.getPicker();if(p){p.open();}return this;};b.prototype.getVisibleItems=function(){var L=this.getList();return L?L.getVisibleItems():[];};b.prototype.isItemSelected=function(){};b.prototype.getKeys=function(c){c=c||this.getItems();for(var i=0,k=[];i<c.length;i++){k[i]=c[i].getKey();}return k;};b.prototype.getSelectableItems=function(){var L=this.getList();return L?L.getSelectableItems():[];};b.prototype.getOpenArea=function(){return this.getDomRef("arrow");};b.prototype.isOpenArea=function(d){var o=this.getOpenArea();return o&&o.contains(d);};b.prototype.findItem=function(p,v){var L=this.getList();return L?L.findItem(p,v):null;};b.prototype.getItemByText=function(t){return this.findItem("text",t);};b.prototype.scrollToItem=function(i){var p=this.getPicker(),o=p.getDomRef("cont"),c=i&&i.getDomRef();if(!p||!o||!c){return;}var d=o.scrollTop,e=c.offsetTop,f=o.clientHeight,g=c.offsetHeight;if(d>e){o.scrollTop=e;}else if((e+g)>(d+f)){o.scrollTop=Math.ceil(e+g-f);}};b.prototype.clearFilter=function(){for(var i=0,c=this.getItems();i<c.length;i++){c[i].bVisible=true;}};b.prototype.onItemChange=function(){};b.prototype.clearSelection=function(){};b.prototype.getValue=function(){var d=this.getFocusDomRef();if(d){return d.value;}return this.getProperty("value");};b.prototype.addItem=function(i){this.addAggregation("items",i);if(i){i.attachEvent("_change",this.onItemChange,this);}return this;};b.prototype.insertItem=function(i,c){this.insertAggregation("items",i,c,true);if(i){i.attachEvent("_change",this.onItemChange,this);}return this;};b.prototype.getItemAt=function(i){return this.getItems()[+i]||null;};b.prototype.getFirstItem=function(){return this.getItems()[0]||null;};b.prototype.getLastItem=function(){var i=this.getItems();return i[i.length-1]||null;};b.prototype.getEnabledItems=function(i){var L=this.getList();return L?L.getEnabledItems(i):[];};b.prototype.getItemByKey=function(k){var L=this.getList();return L?L.getItemByKey(k):null;};b.prototype.isOpen=function(){var p=this.getAggregation("picker");return!!(p&&p.isOpen());};b.prototype.close=function(){var p=this.getAggregation("picker");if(p){p.close();}return this;};b.prototype.removeItem=function(i){var L=this.getList();i=L?L.removeItem(i):null;if(i){i.detachEvent("_change",this.onItemChange,this);}return i;};b.prototype.removeAllItems=function(){var L=this.getList(),c=L?L.removeAllItems():[];this.clearSelection();for(var i=0;i<c.length;i++){c[i].detachEvent("_change",this.onItemChange,this);}return c;};b.prototype.destroyItems=function(){var L=this.getList();if(L){L.destroyItems();}return this;};return b;},true);
