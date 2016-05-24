/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./InputBase','./ComboBoxTextFieldRenderer','./library'],function(q,I,C,l){"use strict";var a=I.extend("sap.m.ComboBoxTextField",{metadata:{library:"sap.m",properties:{maxWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"}}}});a.prototype.updateValueStateClasses=function(v,o){I.prototype.updateValueStateClasses.apply(this,arguments);var V=sap.ui.core.ValueState,b=C.CSS_CLASS_COMBOBOXTEXTFIELD,d=this.$();if(o!==V.None){d.removeClass(b+"State "+b+o);}if(v!==V.None){d.addClass(b+"State "+b+v);}};return a;},true);
