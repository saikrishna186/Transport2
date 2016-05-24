/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ComboBoxTextFieldRenderer','sap/ui/core/Renderer'],function(q,C,R){"use strict";var a=R.extend(C);a.CSS_CLASS_COMBOBOXBASE="sapMComboBoxBase";a.writeInnerAttributes=function(r,c){r.writeAttribute("autocomplete","off");r.writeAttribute("autocorrect","off");r.writeAttribute("autocapitalize","off");};a.writeAccessibilityState=function(r,c){C.writeAccessibilityState.apply(this,arguments);r.writeAccessibilityState(c,{role:"combobox",expanded:c.isOpen(),autocomplete:"both"});};a.addOuterClasses=function(r,c){C.addOuterClasses.apply(this,arguments);var b=a.CSS_CLASS_COMBOBOXBASE;r.addClass(b);if(!c.getEnabled()){r.addClass(b+"Disabled");}if(!c.getEditable()){r.addClass(b+"Readonly");}};a.addButtonClasses=function(r,c){C.addButtonClasses.apply(this,arguments);r.addClass(a.CSS_CLASS_COMBOBOXBASE+"Arrow");};return a;},true);
