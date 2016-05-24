/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Bar','./InputBase','./ComboBoxBase','./Dialog','./List','./ComboBoxBaseRenderer','./MultiComboBoxRenderer','./Popover','./library','sap/ui/core/EnabledPropagator','sap/ui/core/IconPool','jquery.sap.xml'],function(q,B,I,C,D,L,a,M,P,l,E,b){"use strict";var c=C.extend("sap.m.MultiComboBox",{metadata:{library:"sap.m",properties:{selectedKeys:{type:"string[]",group:"Data",defaultValue:[]}},associations:{selectedItems:{type:"sap.ui.core.Item",multiple:true,singularName:"selectedItem"}},events:{selectionChange:{parameters:{changedItem:{type:"sap.ui.core.Item"},selected:{type:"boolean"}}},selectionFinish:{parameters:{selectedItems:{type:"sap.ui.core.Item[]"}}}}}});b.insertFontFaceStyle();E.apply(c.prototype,[true]);c.prototype.onsapend=function(e){sap.m.Tokenizer.prototype.onsapend.apply(this._oTokenizer,arguments);};c.prototype.onsaphome=function(e){sap.m.Tokenizer.prototype.onsaphome.apply(this._oTokenizer,arguments);};c.prototype.onsapdown=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();e.preventDefault();var i=this.getSelectableItems();var o=i[0];if(o&&this.isOpen()){this.getListItem(o).focus();return;}if(this._oTokenizer.getSelectedTokens().length){return;}this._oTraversalItem=this._getNextTraversalItem();if(this._oTraversalItem){this.updateDomValue(this._oTraversalItem.getText());this.selectText(0,this.getValue().length);}this._setContainerSizes();};c.prototype.onsapup=function(e){if(!this.getEnabled()||!this.getEditable()){return;}e.setMarked();e.preventDefault();if(this._oTokenizer.getSelectedTokens().length){return;}this._oTraversalItem=this._getPreviousTraversalItem();if(this._oTraversalItem){this.updateDomValue(this._oTraversalItem.getText());this.selectText(0,this.getValue().length);}this._setContainerSizes();};c.prototype.onsapenter=function(e){C.prototype.onsapenter.apply(this,arguments);if(!this.getEnabled()||!this.getEditable()){return;}if(e){e.setMarked();}var v;if(this.isOpen()){v=this._getUnselectedItems();}else{v=this._getItemsStartingText(this.getValue());}if(v.length>1){this._showWrongValueVisualEffect();}if(v.length===1){var i=v[0];var p={item:i,id:i.getId(),key:i.getKey(),fireChangeEvent:true,fireFinishEvent:true,suppressInvalidate:true,listItemUpdated:false};if(this.getValue()===""||q.sap.startsWithIgnoreCase(i.getText(),this.getValue())){if(this.getListItem(i).isSelected()){this.setValue('');}else{this.setSelection(p);}}}if(e){this.close();}};c.prototype.onsapfocusleave=function(e){C.prototype.onsapfocusleave.apply(this,arguments);var p=this.getAggregation("picker");var o=sap.ui.getCore().byId(e.relatedControlId);var f=o&&o.getFocusDomRef();if(p&&f){if(q.sap.equal(p.getFocusDomRef(),f)){this.focus();}}this._setContainerSizes();};c.prototype.onfocusin=function(e){this.addStyleClass("sapMFocus");if(e.target===this.getOpenArea()){this.focus();}if(!this.isOpen()){this.openValueStateMessage();}};c.prototype.onsapescape=function(e){C.prototype.onsapescape.apply(this,arguments);this._setContainerSizes();};c.prototype._handleItemTap=function(e){if(e.target.childElementCount===0||e.target.childElementCount===2){if(this.isOpen()&&!this._isListInSuggestMode()){this.close();}}};c.prototype._handleItemPress=function(e){if(this.isOpen()&&this._isListInSuggestMode()&&this.getPicker().oPopup.getOpenState()!==sap.ui.core.OpenState.CLOSING){this.clearFilter();var i=this._getLastSelectedItem();if(i){this.getListItem(i).focus();}}};c.prototype._handleSelectionLiveChange=function(e){var o=e.getParameter("listItem");var i=e.getParameter("selected");var n=this._getItemByListItem(o);if(o.getType()==="Inactive"){return;}if(!n){return;}var p={item:n,id:n.getId(),key:n.getKey(),fireChangeEvent:true,suppressInvalidate:true,listItemUpdated:true};if(i){this.fireChangeEvent(n.getText());this.setSelection(p);}else{this.fireChangeEvent(n.getText());this.removeSelection(p);this.setValue('');}if(this.isOpen()&&this.getPicker().oPopup.getOpenState()!==sap.ui.core.OpenState.CLOSING){o.focus();}};c.prototype.onkeydown=function(e){C.prototype.onkeydown.apply(this,arguments);if(!this.getEnabled()||!this.getEditable()){return;}if(this.getValue().length===0&&(e.ctrlKey||e.metaKey)&&(e.which===q.sap.KeyCodes.A)&&this._hasTokens()){this._oTokenizer.focus();this._oTokenizer.selectAllTokens(true);e.preventDefault();}};c.prototype.oninput=function(e){C.prototype.oninput.apply(this,arguments);var v=e.target.value;if(!this.getEnabled()||!this.getEditable()){return;}var i=this._getItemsStartingText(v);var V=!!i.length;if(!V&&v!==""){this.updateDomValue(this._sOldValue||"");if(this._iOldCursorPos){q(this.getFocusDomRef()).cursorPos(this._iOldCursorPos);}this._showWrongValueVisualEffect();return;}var d=this.getSelectableItems();if(this._sOldInput&&this._sOldInput.length>v.length){d=this.getItems();}d.forEach(function(o){var m=q.sap.startsWithIgnoreCase(o.getText(),v);if(v===""){m=true;}var f=this.getListItem(o);if(f){f.setVisible(m);}},this);this._setContainerSizes();if(!this.getValue()||!V){this.close();}else{this.open();}this._sOldInput=v;};c.prototype.onkeyup=function(e){if(!this.getEnabled()||!this.getEditable()){return;}this._sOldValue=this.getValue();this._iOldCursorPos=q(this.getFocusDomRef()).cursorPos();};c.prototype._showWrongValueVisualEffect=function(){var v=this.getValueState();if(v===sap.ui.core.ValueState.Error||v===sap.ui.core.ValueState.Success||v===sap.ui.core.ValueState.Warning){this.$().removeClass("sapMInputBase"+v);q.sap.delayedCall(300,this.$(),"addClass",["sapMInputBase"+v]);}else{this.$().addClass("sapMInputBaseError");q.sap.delayedCall(300,this.$(),"removeClass",["sapMInputBaseError"]);}};c.prototype.createPicker=function(p){var o=this.getAggregation("picker");if(o){return o;}o=this["_create"+p]();this.setAggregation("picker",o,true);var d=M.CSS_CLASS_MULTICOMBOBOX;o.setHorizontalScrolling(false).addStyleClass(a.CSS_CLASS_COMBOBOXBASE+"Picker").addStyleClass(d+"Picker").addStyleClass(d+"Picker-CTX").attachBeforeOpen(this.onBeforeOpen,this).attachAfterOpen(this.onAfterOpen,this).attachBeforeClose(this.onBeforeClose,this).attachAfterClose(this.onAfterClose,this).addEventDelegate({onBeforeRendering:this.onBeforeRenderingPicker,onAfterRendering:this.onAfterRenderingPicker},this).addContent(this.getList());return o;};c.prototype.onBeforeRendering=function(){C.prototype.onBeforeRendering.apply(this,arguments);var i=this.getItems();this._synchronizeSelectedItemAndKey(i);this._clearList();this._clearTokenizer();this._fillList(i);this.setEditable(this.getEditable());};c.prototype.onBeforeRenderingPicker=function(){var o=this["_onBeforeRendering"+this.getPickerType()];if(o){o.call(this);}};c.prototype.onAfterRenderingPicker=function(){var o=this["_onAfterRendering"+this.getPickerType()];if(o){o.call(this);}};c.prototype.onBeforeOpen=function(){var p=this["_onBeforeOpen"+this.getPickerType()];this.addStyleClass(a.CSS_CLASS_COMBOBOXBASE+"Pressed");this._resetCurrentItem();this.addContent();if(p){p.call(this);}};c.prototype.onAfterOpen=function(){this.closeValueStateMessage();};c.prototype.onBeforeClose=function(){};c.prototype.onAfterClose=function(){this.removeStyleClass(a.CSS_CLASS_COMBOBOXBASE+"Pressed");this.clearFilter();this.fireSelectionFinish({selectedItems:this.getSelectedItems()});};c.prototype._onBeforeOpenDialog=function(){};c.prototype._createDialog=function(){var d=a.CSS_CLASS_COMBOBOXBASE;var o=new D({stretchOnPhone:true,customHeader:new B({contentLeft:new sap.m.InputBase({width:"100%",editable:false}).addStyleClass(d+"Input")}).addStyleClass(d+"Bar")});o.getAggregation("customHeader").attachBrowserEvent("tap",function(){o.close();},this);return o;};c.prototype._decoratePopover=function(p){var t=this;p._setMinWidth=function(w){var o=this.getDomRef();if(o){o.style.minWidth=w;}};p.open=function(){return this.openBy(t);};};c.prototype._onAfterRenderingPopover=function(){var p=this.getPicker(),w=(this.$().outerWidth()/parseFloat(sap.m.BaseFontSize))+"rem";p._setMinWidth(w);};c.prototype._createPopover=function(){var p=new P({showHeader:false,placement:sap.m.PlacementType.Vertical,offsetX:0,offsetY:0,initialFocus:this,bounce:false});p._bShowArrow=false;this._decoratePopover(p);return p;};c.prototype.createList=function(){this._oList=new L({width:"100%",mode:sap.m.ListMode.MultiSelect,includeItemInSelection:true,rememberSelections:false}).addStyleClass(a.CSS_CLASS_COMBOBOXBASE+"List").addStyleClass(M.CSS_CLASS_MULTICOMBOBOX+"List").attachBrowserEvent("tap",this._handleItemTap,this).attachSelectionChange(this._handleSelectionLiveChange,this).attachItemPress(this._handleItemPress,this);};c.prototype.setSelection=function(o){if(o.item&&this.isItemSelected(o.item)){return;}if(!o.item){return;}this.addAssociation("selectedItems",o.item,o.suppressInvalidate);var s=this.getKeys(this.getSelectedItems());this.setProperty("selectedKeys",s,o.suppressInvalidate);if(!o.listItemUpdated&&this.getListItem(o.item)){this.getList().setSelectedItem(this.getListItem(o.item),true);}var t=new sap.m.Token({key:o.key,text:o.item.getText(),tooltip:o.item.getText()});o.item.data(a.CSS_CLASS_COMBOBOXBASE+"Token",t);this._oTokenizer.addToken(t);this.$().toggleClass("sapMMultiComboBoxHasToken",this._hasTokens());this.setValue('');if(o.fireChangeEvent){this.fireSelectionChange({changedItem:o.item,selected:true});}if(o.fireFinishEvent){if(!this.isOpen()){this.fireSelectionFinish({selectedItems:this.getSelectedItems()});}}};c.prototype.removeSelection=function(o){if(o.item&&!this.isItemSelected(o.item)){return;}if(!o.item){return;}this.removeAssociation("selectedItems",o.item,o.suppressInvalidate);var s=this.getKeys(this.getSelectedItems());this.setProperty("selectedKeys",s,o.suppressInvalidate);if(!o.listItemUpdated&&this.getListItem(o.item)){this.getList().setSelectedItem(this.getListItem(o.item),false);}if(!o.tokenUpdated){var t=this._getTokenByItem(o.item);o.item.data(a.CSS_CLASS_COMBOBOXBASE+"Token",null);this._oTokenizer.removeToken(t);}this.$().toggleClass("sapMMultiComboBoxHasToken",this._hasTokens());if(o.fireChangeEvent){this.fireSelectionChange({changedItem:o.item,selected:false});}if(o.fireFinishEvent){if(!this.isOpen()){this.fireSelectionFinish({selectedItems:this.getSelectedItems()});}}};c.prototype._synchronizeSelectedItemAndKey=function(d){if(!d.length){q.sap.log.info("Info: _synchronizeSelectedItemAndKey() the MultiComboBox control does not contain any item on ",this);return;}var s=this.getSelectedKeys()||this._aCustomerKeys;var k=this.getKeys(this.getSelectedItems());if(s.length){for(var i=0,K=null,o=null,e=null,f=s.length;i<f;i++){K=s[i];if(k.indexOf(K)>-1){if(this._aCustomerKeys.length&&(e=this._aCustomerKeys.indexOf(K))>-1){this._aCustomerKeys.splice(e,1);}continue;}o=this.getItemByKey(""+K);if(o){if(this._aCustomerKeys.length&&(e=this._aCustomerKeys.indexOf(K))>-1){this._aCustomerKeys.splice(e,1);}this.setSelection({item:o,id:o.getId(),key:o.getKey(),fireChangeEvent:false,suppressInvalidate:true,listItemUpdated:false});}}return;}};c.prototype._setContainerSizes=function(){var m=this.$();if(!m.length){return;}var d=M.DOT_CSS_CLASS_MULTICOMBOBOX;var A=this.$().find(".sapMMultiComboBoxBorder").width();if(A>0){var i=q(this.getOpenArea()).outerWidth(true);var s=m.children(d+"ShadowDiv");s.text(this.getValue());var e=s.outerWidth()+i;var $=m.find(d+"InputContainer");var f=A-e;var g;if(this._oTokenizer.getScrollWidth()>f){this._oTokenizer.setPixelWidth(f);g=(e/parseFloat(sap.m.BaseFontSize))+"rem";}else{g=((A-this._oTokenizer.getScrollWidth())/parseFloat(sap.m.BaseFontSize))+"rem";}$.find(".sapMInputBaseInner").css("width",g);}};c.prototype._getTokenByItem=function(i){return i?i.data(a.CSS_CLASS_COMBOBOXBASE+"Token"):null;};c.prototype._getSelectedItemsOf=function(d){for(var i=0,e=d.length,s=[];i<e;i++){if(this.getListItem(d[i]).isSelected()){s.push(d[i]);}}return s;};c.prototype._getLastSelectedItem=function(){var t=this._oTokenizer.getTokens();var T=t.length?t[t.length-1]:null;if(!T){return null;}return this._getItemByToken(T);};c.prototype._getOrderedSelectedItems=function(){var d=[];for(var i=0,t=this._oTokenizer.getTokens(),e=t.length;i<e;i++){d[i]=this._getItemByToken(t[i]);}return d;};c.prototype._getFocusedListItem=function(){if(!document.activeElement){return null;}var f=sap.ui.getCore().byId(document.activeElement.id);if(this.getList()&&q.sap.containsOrEquals(this.getList().getFocusDomRef(),f.getFocusDomRef())){return f;}return null;};c.prototype._getFocusedItem=function(){var o=this._getFocusedListItem();return this._getItemByListItem(o);};c.prototype._isRangeSelectionSet=function(o){var $=o.getDomRef();return $.indexOf(M.CSS_CLASS_MULTICOMBOBOX+"ItemRangeSelection")>-1?true:false;};c.prototype._hasTokens=function(){return this._oTokenizer.getTokens().length>0;};c.prototype._getCurrentItem=function(){if(!this._oCurrentItem){return this._getFocusedItem();}return this._oCurrentItem;};c.prototype._setCurrentItem=function(i){this._oCurrentItem=i;};c.prototype._resetCurrentItem=function(){this._oCurrentItem=null;};c.prototype._decorateListItem=function(o){o.addDelegate({onkeyup:function(e){var i=null;if(e.which==q.sap.KeyCodes.SPACE&&this.isOpen()&&this._isListInSuggestMode()){this.clearFilter();this.open();i=this._getLastSelectedItem();if(i){this.getListItem(i).focus();}return;}},onkeydown:function(e){var i=null,d=null;if(e.shiftKey&&e.which==q.sap.KeyCodes.ARROW_DOWN){d=this._getCurrentItem();i=this._getNextVisibleItemOf(d);}if(e.shiftKey&&e.which==q.sap.KeyCodes.ARROW_UP){d=this._getCurrentItem();i=this._getPreviousVisibleItemOf(d);}if(e.shiftKey&&e.which===q.sap.KeyCodes.SPACE){d=this._getCurrentItem();this._selectPreviousItemsOf(d);}if(i&&i!==d){if(this.getListItem(d).isSelected()){this.setSelection({item:i,id:i.getId(),key:i.getKey(),fireChangeEvent:true,suppressInvalidate:true});this._setCurrentItem(i);}else{this.removeSelection({item:i,id:i.getId(),key:i.getKey(),fireChangeEvent:true,suppressInvalidate:true});this._setCurrentItem(i);}return;}this._resetCurrentItem();if((e.ctrlKey||e.metaKey)&&e.which==q.sap.KeyCodes.A){e.setMarked();e.preventDefault();var v=this.getSelectableItems();var s=this._getSelectedItemsOf(v);if(s.length!==v.length){v.forEach(function(i){this.setSelection({item:i,id:i.getId(),key:i.getKey(),fireChangeEvent:true,suppressInvalidate:true,listItemUpdated:false});},this);}else{v.forEach(function(i){this.removeSelection({item:i,id:i.getId(),key:i.getKey(),fireChangeEvent:true,suppressInvalidate:true,listItemUpdated:false});},this);}}}},true,this);o.addEventDelegate({onsapbackspace:function(e){e.preventDefault();},onsapshow:function(e){e.setMarked();if(e.keyCode===q.sap.KeyCodes.F4){e.preventDefault();}if(this.isOpen()){this.close();return;}if(this.hasContent()){this.open();}},onsaphide:function(e){this.onsapshow(e);},onsapenter:function(e){e.setMarked();this.close();},onsaphome:function(e){e.setMarked();e.preventDefault();var v=this.getSelectableItems();var i=v[0];this.getListItem(i).focus();},onsapend:function(e){e.setMarked();e.preventDefault();var v=this.getSelectableItems();var i=v[v.length-1];this.getListItem(i).focus();},onsapup:function(e){e.setMarked();e.preventDefault();var v=this.getSelectableItems();var i=v[0];var d=q(document.activeElement).control()[0];if(d===this.getListItem(i)){this.focus();e.stopPropagation(true);}},onfocusin:function(e){this.addStyleClass(M.CSS_CLASS_MULTICOMBOBOX+"Focused");},onfocusout:function(e){this.removeStyleClass(M.CSS_CLASS_MULTICOMBOBOX+"Focused");},onsapfocusleave:function(e){var p=this.getAggregation("picker");var d=sap.ui.getCore().byId(e.relatedControlId);if(p&&d&&q.sap.equal(p.getFocusDomRef(),d.getFocusDomRef())){if(e.srcControl){e.srcControl.focus();}}}},this);if(sap.ui.Device.support.touch){o.addEventDelegate({ontouchstart:function(e){e.setMark("cancelAutoClose");}});}};c.prototype._createTokenizer=function(){var t=new sap.m.Tokenizer({tokens:[]}).attachTokenChange(this._handleTokenChange,this);t.setParent(this);t.addEventDelegate({onAfterRendering:this._onAfterRenderingTokenizer},this);this.getRenderer().placeholderToBeShown=function(r,o){return(!o._oTokenizer.getTokens().length)&&(o.getPlaceholder()?true:false);};return t;};c.prototype._handleTokenChange=function(e){var t=e.getParameter("type");var T=e.getParameter("token");var i=null;if(t!==sap.m.Tokenizer.TokenChangeType.Removed&&t!==sap.m.Tokenizer.TokenChangeType.Added){return;}if(t===sap.m.Tokenizer.TokenChangeType.Removed){i=(T&&this._getItemByToken(T));if(i&&this.isItemSelected(i)){this.removeSelection({item:i,id:i.getId(),key:i.getKey(),tokenUpdated:true,fireChangeEvent:true,fireFinishEvent:true,suppressInvalidate:true});this.focus();this.fireChangeEvent('');}}};c.prototype._onAfterRenderingTokenizer=function(){this._setContainerSizes();};c.prototype.onAfterRendering=function(){C.prototype.onAfterRendering.apply(this,arguments);var p=this.getPicker();var d=q(this.getDomRef());var o=d.find(M.DOT_CSS_CLASS_MULTICOMBOBOX+"Border");p._oOpenBy=o[0];};c.prototype.onfocusout=function(e){this.removeStyleClass("sapMFocus");C.prototype.onfocusout.apply(this,arguments);};c.prototype.onsapbackspace=function(e){if(!this.getEnabled()||!this.getEditable()){e.preventDefault();return;}if(this.getCursorPosition()>0||this.getValue().length>0){return;}sap.m.Tokenizer.prototype.onsapbackspace.apply(this._oTokenizer,arguments);e.preventDefault();};c.prototype.onsapdelete=function(e){if(!this.getEnabled()||!this.getEditable()){return;}if(this.getValue()&&!this._isCompleteTextSelected()){return;}sap.m.Tokenizer.prototype.onsapdelete.apply(this._oTokenizer,arguments);};c.prototype.onsapnext=function(e){if(e.isMarked()){return;}var f=q(document.activeElement).control()[0];if(!f){return;}if(f===this._oTokenizer||this._oTokenizer.$().find(f.$()).length>0&&this.getEditable()){this.focus();}};c.prototype.onsapprevious=function(e){if(this.getCursorPosition()===0&&!this._isCompleteTextSelected()){if(e.srcControl===this){sap.m.Tokenizer.prototype.onsapprevious.apply(this._oTokenizer,arguments);}}};c.prototype._getItemsStartingText=function(t){var i=[];this.getSelectableItems().forEach(function(o){if(q.sap.startsWithIgnoreCase(o.getText(),t)){i.push(o);}},this);return i;};c.prototype.getCursorPosition=function(){return this._$input.cursorPos();};c.prototype._isCompleteTextSelected=function(){if(!this.getValue().length){return false;}var i=this._$input[0];if(i.selectionStart!==0||i.selectionEnd!==this.getValue().length){return false;}return true;};c.prototype._selectPreviousItemsOf=function(i){var d;do{d=true;var p=this._getPreviousVisibleItemOf(i);if(p){var o=this.getListItem(p);if(o){d=this.getListItem(p).getSelected();}}this.setSelection({item:i,id:i.getId(),key:i.getKey(),fireChangeEvent:true,suppressInvalidate:true});i=p;}while(!d);};c.prototype._getNextVisibleItemOf=function(i){var d=this.getSelectableItems();var e=d.indexOf(i)+1;if(e<=0||e>d.length-1){return null;}return d[e];};c.prototype._getPreviousVisibleItemOf=function(i){var d=this.getSelectableItems();var e=d.indexOf(i)-1;if(e<0){return null;}return d[e];};c.prototype._getNextUnselectedItemOf=function(i){var d=this._getUnselectedItems();var e=d.indexOf(i)+1;if(e<=0||e>d.length-1){return null;}return d[e];};c.prototype._getPreviousUnselectedItemOf=function(i){var d=this._getUnselectedItems();var e=d.indexOf(i)-1;if(e<0){return null;}return d[e];};c.prototype._getNextTraversalItem=function(){var i=this._getItemsStartingText(this.getValue());var s=this._getUnselectedItems();if(i.indexOf(this._oTraversalItem)>-1&&this._oTraversalItem.getText()===this.getValue()){return this._getNextUnselectedItemOf(this._oTraversalItem);}if(i.length&&i[0].getText()===this.getValue()){return this._getNextUnselectedItemOf(i[0]);}return i.length?i[0]:s[0];};c.prototype._getPreviousTraversalItem=function(){var i=this._getItemsStartingText(this.getValue());if(i.indexOf(this._oTraversalItem)>-1&&this._oTraversalItem.getText()===this.getValue()){return this._getPreviousUnselectedItemOf(this._oTraversalItem);}if(i.length&&i[i.length-1].getText()===this.getValue()){return this._getPreviousUnselectedItemOf(i[i.length-1]);}if(i.length){return i[i.length-1];}else{var s=this._getUnselectedItems();if(s.length>0){return s[s.length-1];}else{return null;}}};c.prototype.findFirstEnabledItem=function(d){d=d||this.getItems();for(var i=0;i<d.length;i++){if(d[i].getEnabled()){return d[i];}}return null;};c.prototype.getVisibleItems=function(){for(var i=0,o,d=this.getItems(),v=[];i<d.length;i++){o=this.getListItem(d[i]);if(o&&o.getVisible()){v.push(d[i]);}}return v;};c.prototype.findLastEnabledItem=function(i){i=i||this.getItems();return this.findFirstEnabledItem(i.reverse());};c.prototype.setSelectedItems=function(i){this.removeAllSelectedItems();if(!i||!i.length){return this;}if(!q.isArray(i)){q.sap.log.warning('Warning: setSelectedItems() "aItems" has to be an array of sap.ui.core.Item instances or an array of valid sap.ui.core.Item Ids',this);return this;}i.forEach(function(o){if(!(o instanceof sap.ui.core.Item)&&(typeof o!=="string")){q.sap.log.warning('Warning: setSelectedItems() "aItems" has to be an array of sap.ui.core.Item instances or an array of valid sap.ui.core.Item Ids',this);return;}if(typeof o==="string"){o=sap.ui.getCore().byId(o);}this.setSelection({item:o?o:null,id:o?o.getId():"",key:o?o.getKey():"",suppressInvalidate:true});},this);return this;};c.prototype.addSelectedItem=function(i){if(!i){return this;}if(typeof i==="string"){i=sap.ui.getCore().byId(i);}this.setSelection({item:i?i:null,id:i?i.getId():"",key:i?i.getKey():"",fireChangeEvent:false,suppressInvalidate:true});return this;};c.prototype.removeSelectedItem=function(i){if(!i){return null;}if(typeof i==="string"){i=sap.ui.getCore().byId(i);}if(!this.isItemSelected(i)){return null;}this.removeSelection({item:i,id:i.getId(),key:i.getKey(),fireChangeEvent:false,suppressInvalidate:true});return i;};c.prototype.removeAllSelectedItems=function(){var i=[];var d=this.getAssociation("selectedItems",[]);d.forEach(function(o){var e=this.removeSelectedItem(o);if(e){i.push(e.getId());}},this);return i;};c.prototype.removeSelectedKeys=function(k){var i=[],d;if(!k||!k.length||!q.isArray(k)){return i;}var o;k.forEach(function(K){o=this.getItemByKey(K);if(o){this.removeSelection({item:o?o:null,id:o?o.getId():"",key:o?o.getKey():"",fireChangeEvent:false,suppressInvalidate:true});i.push(o);}if(this._aCustomerKeys.length&&(d=this._aCustomerKeys.indexOf(K))>-1){this._aCustomerKeys.splice(d,1);}},this);return i;};c.prototype.setSelectedKeys=function(k){this.removeAllSelectedItems();this._aCustomerKeys=[];this.addSelectedKeys(k);return this;};c.prototype.addSelectedKeys=function(k){k=this.validateProperty("selectedKeys",k);k.forEach(function(K){var i=this.getItemByKey(K);if(i){this.addSelectedItem(i);}else if(K!=null){this._aCustomerKeys.push(K);}},this);return this;};c.prototype.getSelectedKeys=function(){var i=this.getSelectedItems()||[],k=[];i.forEach(function(o){k.push(o.getKey());},this);if(this._aCustomerKeys.length){k=k.concat(this._aCustomerKeys);}return k;};c.prototype._getUnselectedItems=function(){return q(this.getSelectableItems()).not(this.getSelectedItems()).get();};c.prototype.getSelectedItems=function(){var i=[],d=this.getAssociation("selectedItems")||[];d.forEach(function(s){var o=sap.ui.getCore().byId(s);if(o){i.push(o);}},this);return i;};c.prototype.getSelectableItems=function(){return this.getEnabledItems(this.getVisibleItems());};c.prototype.getWidth=function(){return this.getProperty("width")||"100%";};c.prototype.setEditable=function(e){C.prototype.setEditable.apply(this,arguments);this._oTokenizer.setEditable(e);return this;};c.prototype.clearFilter=function(){this.getItems().forEach(function(i){this.getListItem(i).setVisible(i.getEnabled()&&this.getSelectable(i));},this);};c.prototype._isListInSuggestMode=function(){return this.getList().getItems().some(function(o){return!o.getVisible()&&this._getItemByListItem(o).getEnabled();},this);};c.prototype._mapItemToListItem=function(i){if(!i){return null;}var s=M.CSS_CLASS_MULTICOMBOBOX+"Item";var d=(this.isItemSelected(i))?s+"Selected":"";var o=new sap.m.StandardListItem({title:i.getText(),type:sap.m.ListType.Active,visible:i.getEnabled()}).addStyleClass(s+" "+d);o.setTooltip(i.getTooltip());i.data(a.CSS_CLASS_COMBOBOXBASE+"ListItem",o);if(d){var t=new sap.m.Token({key:i.getKey(),text:i.getText(),tooltip:i.getText()});i.data(a.CSS_CLASS_COMBOBOXBASE+"Token",t);this._oTokenizer.addToken(t);}this.setSelectable(i,i.getEnabled());this._decorateListItem(o);return o;};c.prototype._findMappedItem=function(o,d){for(var i=0,d=d||this.getItems(),e=d.length;i<e;i++){if(this.getListItem(d[i])===o){return d[i];}}return null;};c.prototype.setSelectable=function(i,s){if(this.indexOfItem(i)<0){return;}i._bSelectable=s;var o=this.getListItem(i);if(o){o.setVisible(s);}var t=this._getTokenByItem(i);if(t){t.setVisible(s);}};c.prototype.getSelectable=function(i){return i._bSelectable;};c.prototype._fillList=function(d){if(!d){return null;}if(!this._oListItemEnterEventDelegate){this._oListItemEnterEventDelegate={onsapenter:function(f){if(f.srcControl.isSelected()){f.setMarked();}}};}for(var i=0,o,e=d.length;i<e;i++){o=this._mapItemToListItem(d[i]);o.removeEventDelegate(this._oListItemEnterEventDelegate);o.addDelegate(this._oListItemEnterEventDelegate,true,this,true);this.getList().addAggregation("items",o,true);if(this.isItemSelected(d[i])){this.getList().setSelectedItem(o,true);}}};c.prototype.init=function(){I.prototype.init.apply(this,arguments);this.createList();this.bDataUpdated=false;this.setPickerType(sap.ui.Device.system.phone?"Dialog":"Popover");this._oTokenizer=this._createTokenizer();this._aCustomerKeys=[];};c.prototype.clearSelection=function(){this.removeAllSelectedItems();};c.prototype.addItem=function(i){this.addAggregation("items",i);if(i){i.attachEvent("_change",this.onItemChange,this);}if(this.getList()){this.getList().addItem(this._mapItemToListItem(i));}return this;};c.prototype.insertItem=function(i,d){this.insertAggregation("items",i,d,true);if(i){i.attachEvent("_change",this.onItemChange,this);}if(this.getList()){this.getList().insertItem(this._mapItemToListItem(i),d);}return this;};c.prototype.getEnabledItems=function(i){i=i||this.getItems();return i.filter(function(o){return o.getEnabled();});};c.prototype.getItemByKey=function(k){return this.findItem("key",k);};c.prototype.removeItem=function(i){i=this.removeAggregation("items",i);if(this.getList()){this.getList().removeItem(i&&this.getListItem(i));}this.removeSelection({item:i,id:i?i.getId():"",key:i?i.getKey():"",fireChangeEvent:false,suppressInvalidate:true,listItemUpdated:true});return i;};c.prototype.isItemSelected=function(i){return(this.getSelectedItems().indexOf(i)>-1?true:false);};c.prototype._clearList=function(){if(this.getList()){this.getList().destroyAggregation("items",true);}};c.prototype.findItem=function(p,v){var m="get"+p.charAt(0).toUpperCase()+p.slice(1);for(var i=0,d=this.getItems();i<d.length;i++){if(d[i][m]()===v){return d[i];}}return null;};c.prototype._clearTokenizer=function(){this._oTokenizer.destroyAggregation("tokens",true);};c.prototype.getList=function(){return this._oList;};c.prototype.exit=function(){C.prototype.exit.apply(this,arguments);if(this.getList()){this.getList().destroy();this._oList=null;}if(this._oTokenizer){this._oTokenizer.destroy();this._oTokenizer=null;}};c.prototype.destroyItems=function(){this.destroyAggregation("items");if(this.getList()){this.getList().destroyItems();}this._oTokenizer.destroyTokens();return this;};c.prototype.removeAllItems=function(){var i=this.removeAllAggregation("items");this.removeAllSelectedItems();if(this.getList()){this.getList().removeAllItems();}return i;};c.prototype._getItemByListItem=function(o){return this._getItemBy(o,"ListItem");};c.prototype._getItemByToken=function(t){return this._getItemBy(t,"Token");};c.prototype._getItemBy=function(d,s){s=a.CSS_CLASS_COMBOBOXBASE+s;for(var i=0,e=this.getItems(),f=e.length;i<f;i++){if(e[i].data(s)===d){return e[i];}}return null;};c.prototype.getListItem=function(i){return i?i.data(a.CSS_CLASS_COMBOBOXBASE+"ListItem"):null;};return c;},true);