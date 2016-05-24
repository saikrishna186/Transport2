/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var P={};P.render=function(r,c){var C;r.write("<div");r.writeControlData(c);C=this.generateRootClasses(c);C.forEach(function(s,i){r.addClass(s);});r.writeClasses();var t=c.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t);}r.writeAttribute("tabindex","-1");r.writeAccessibilityState(c,{role:"dialog"});if(c.getShowHeader()&&c._getAnyHeader()){r.writeAccessibilityState(c,{labelledby:c._getAnyHeader().getId()});}r.write(">");this.renderContent(r,c);r.write("</div>");};P.isButtonFooter=function(f){if(f instanceof sap.m.Bar){var c=f.getContentLeft(),C=f.getContentRight(),a=f.getContentMiddle(),l=(!c||c.length===0),r=(!C||C.length===0),m=false;if(a&&a.length===2){if((a[0]instanceof sap.m.Button)&&(a[1]instanceof sap.m.Button)){m=true;}}return l&&r&&m;}else{return false;}};P.renderContent=function(r,c){var h,I=c.getId(),i=0,a=c.getContent(),f=c.getFooter(),s=c.getSubHeader(),C=c.getContentWidth(),b=c.getContentHeight(),F="sapMPopoverFooter ";if(c.getShowHeader()){h=c._getAnyHeader();}if(sap.ui.Device.system.desktop){r.write("<span class='sapMPopoverHiddenFocusable' id='"+c.getId()+"-firstfe' tabindex='0'></span>");}if(h){if(h.applyTagAndContextClassFor){h.applyTagAndContextClassFor("header");}h.addStyleClass("sapMPopoverHeader");r.renderControl(h);}if(s){if(s.applyTagAndContextClassFor){s.applyTagAndContextClassFor("subheader");}s.addStyleClass("sapMPopoverSubHeader");r.renderControl(s);}r.write("<div");r.writeAttribute("id",I+"-cont");if(C){r.addStyle("width",C);}if(b){r.addStyle("height",b);}r.writeStyles();r.addClass("sapMPopoverCont");r.writeClasses();r.write(">");r.write("<div id='"+c.getId()+"-scroll"+"' class='sapMPopoverScroll "+"'>");for(i=0;i<a.length;i++){r.renderControl(a[i]);}r.write("</div>");r.write("</div>");if(f){if(f.applyTagAndContextClassFor){f.applyTagAndContextClassFor("footer");f.addStyleClass("sapMTBNoBorders");}if(this.isButtonFooter(f)){F+="sapMPopoverSpecialFooter";}r.renderControl(f.addStyleClass(F));}r.write("<span");r.writeAttribute("id",I+"-arrow");r.addClass("sapMPopoverArr");r.writeClasses();r.write("></span>");if(sap.ui.Device.system.desktop){r.write("<span class='sapMPopoverHiddenFocusable' id='"+c.getId()+"-lastfe' tabindex='0'></span>");}};P.generateRootClasses=function(c){var C=["sapMPopover"],s=c.getSubHeader(),f=c.getFooter(),v=c.getVerticalScrolling()&&!c._forceDisableScrolling,h=c.getHorizontalScrolling()&&!c._forceDisableScrolling,H;if(c.getShowHeader()){H=c._getAnyHeader();}if(H){C.push("sapMPopoverWithBar");}else{C.push("sapMPopoverWithoutBar");}if(s){C.push("sapMPopoverWithSubHeader");}else{C.push("sapMPopoverWithoutSubHeader");}if(c._hasSingleNavContent()){C.push("sapMPopoverNav");}if(c._hasSinglePageContent()){C.push("sapMPopoverPage");}if(f){C.push("sapMPopoverWithFooter");}else{C.push("sapMPopoverWithoutFooter");}if(c.getPlacement()===sap.m.PlacementType.Top){C.push("sapMPopoverPlacedTop");}if(!v){C.push("sapMPopoverVerScrollDisabled");}if(!h){C.push("sapMPopoverHorScrollDisabled");}C.push("sapMPopup-CTX");if(sap.m._bSizeCompact){C.push("sapUiSizeCompact");}return C.concat(c.aCustomStyleClasses);};P.rerenderContentOnly=function(c){var p=c.$(),o=c.getDomRef(),C,r;if(!o){return;}p.removeClass();C=this.generateRootClasses(c);p.addClass(C.join(" "));r=sap.ui.getCore().createRenderManager();this.renderContent(r,c);r.flush(o,true);r.destroy();c._onOrientationChange();};return P;},true);
