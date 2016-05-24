/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/Device','sap/ui/Global','sap/ui/base/DataType','sap/ui/base/EventProvider','./Component','./Configuration','./Control','./Element','./ElementMetadata','./FocusHandler','./RenderManager','./ResizeHandler','./ThemeCheck','./UIArea','./tmpl/Template','./message/MessageManager','jquery.sap.act','jquery.sap.dom','jquery.sap.events','jquery.sap.mobile','jquery.sap.properties','jquery.sap.resources','jquery.sap.script'],function(q,D,G,a,E,C,c,d,e,g,F,R,h,T,U,k,M){"use strict";var L={};var n=E.extend("sap.ui.core.Core",{constructor:function(){if(sap.ui.getCore&&sap.ui.getCore()){return sap.ui.getCore();}var t=this,l=q.sap.log,f="sap.ui.core.Core";E.apply(this);this.bBooted=false;this.bInitialized=false;this.bDomReady=false;this.aPlugins=[];this.mLibraries={};this.mResourceBundles={};this.mUIAreas={};this.oModels={};this.oEventBus=null;this.mElements={};this.mObjects={"component":{},"template":{}};this.oRootComponent=null;this.aInitListeners=[];this.bInitLegacyLib=false;l.info("Creating Core",null,f);this.oConfiguration=new c(this);var o=this.oConfiguration["frameOptionsConfig"]||{};o.mode=this.oConfiguration.getFrameOptions();o.whitelistService=this.oConfiguration.getWhitelistService();this.oFrameOptions=new q.sap.FrameOptions(o);if(this.oConfiguration["bindingSyntax"]==="complex"){sap.ui.base.ManagedObject.bindingParser=sap.ui.base.BindingParser.complexParser;}if(this.oConfiguration["xx-designMode"]==true){sap.ui.base.BindingParser._keepBindingStrings=true;}g.prototype.register=function(Z){t.registerElementClass(Z);};e.prototype.register=function(){t.registerElement(this);};e.prototype.deregister=function(){t.deregisterElement(this);};e._updateFocusInfo=function(Z){if(t.oFocusHandler){t.oFocusHandler.updateControlFocusInfo(Z);}};C.prototype.register=function(){t.registerObject(this);};C.prototype.deregister=function(){var Z=this.sId;for(var _ in t.mElements){var a1=t.mElements[_];if(a1._sapui_candidateForDestroy&&a1._sOwnerId===Z&&!a1.getParent()){q.sap.log.debug("destroying dangling template "+a1+" when destroying the owner component");a1.destroy();}}t.deregisterObject(this);};k.prototype.register=function(){t.registerObject(this);};k.prototype.deregister=function(){t.deregisterObject(this);};var m=this.oConfiguration.modules;if(this.oConfiguration.getDebug()){m.unshift("sap.ui.debug.DebugEnv");}var i=q.inArray("sap.ui.core.library",m);if(i!=0){if(i>0){m.splice(i,1);}m.unshift("sap.ui.core.library");}if(this.oConfiguration["xx-lesssupport"]&&q.inArray("sap.ui.core.plugin.LessSupport",m)==-1){l.info("Including LessSupport into declared modules");m.push("sap.ui.core.plugin.LessSupport");}var p=this.oConfiguration.preload;if(window["sap-ui-debug"]){p="";}if(p==="auto"){p=(window["sap-ui-optimized"]&&!this.oConfiguration['xx-loadAllMode'])?"sync":"";}this.oConfiguration.preload=p;l.info("Declared modules: "+m,f);var j=window["sap-ui-config"];if(this.oConfiguration.themeRoot){j=j||{};j.themeroots=j.themeroots||{};j.themeroots[this.oConfiguration.getTheme()]=this.oConfiguration.themeRoot;}if(j){if(j.themeroots){for(var s in j.themeroots){var u=j.themeroots[s];if(typeof u==="string"){this.setThemeRoot(s,u);}else{for(var v in u){if(v.length>0){this.setThemeRoot(s,[v],u[v]);}else{this.setThemeRoot(s,u[v]);}}}}}}this.sTheme=this.oConfiguration.getTheme();q(document.documentElement).addClass("sapUiTheme-"+this.sTheme);l.info("Declared theme "+this.sTheme,null,f);if(this.oConfiguration.getRTL()){q(document.documentElement).attr("dir","rtl");l.info("RTL mode activated",null,f);}var $=q("html");var b=D.browser;var w=b.name;if(w===b.BROWSER.CHROME){q.browser.safari=false;q.browser.chrome=true;}else if(w===b.BROWSER.SAFARI){q.browser.safari=true;q.browser.chrome=false;if(b.mobile){w="m"+w;}}if(w){q.browser.fVersion=b.version;q.browser.mobile=b.mobile;w=w+Math.floor(b.version);$.attr("data-sap-ui-browser",w);l.debug("Browser-Id: "+w,null,f);}$.attr("data-sap-ui-os",D.os.name+D.os.versionStr);var x=null;switch(D.os.name){case D.os.OS.IOS:x="sap-ios";break;case D.os.OS.ANDROID:x="sap-android";break;case D.os.OS.BLACKBERRY:x="sap-bb";break;case D.os.OS.WINDOWS_PHONE:x="sap-winphone";break;}if(x){$.addClass(x);}var y=function(){var Z=this.oConfiguration.getLocale();if(Z){$.attr("lang",Z.toString());}else{$.removeAttr("lang");}};y.call(this);this.attachLocalizationChanged(y,this);if(this.oConfiguration.getWeinreId()){l.info("Starting WEINRE Remote Web Inspector");var W="<script src=\"";W+=this.oConfiguration.getWeinreServer();W+="/target/target-script-min.js#";W+=q.sap.encodeURL(this.oConfiguration.getWeinreId());W+="\"></script>";document.write(W);}sap.ui.getCore=q.sap.getter(this.getInterface());this.oRenderManager=new R();var z=q.sap.syncPoint("UI5 Document Ready",function(Z,_){t.handleLoad();});var A=z.startTask("document.ready");var B=z.startTask("preload and boot");q(function(){l.trace("document is ready");z.finishTask(A);});var H=q.sap.syncPoint("UI5 Core Preloads and Bootstrap Script",function(Z,_){l.trace("Core loaded: open="+Z+", failures="+_);t._boot();z.finishTask(B);});if(this.oConfiguration["versionedLibCss"]){var V=H.startTask("load version info");var I=function(Z){if(Z){l.trace("Loaded \"sap-ui-version.json\".");}else{l.error("Could not load \"sap-ui-version.json\".");}H.finishTask(V);};var J=p==="async";var K=sap.ui.getVersionInfo({async:J,failOnError:false});if(K instanceof Promise){K.then(I,function(Z){l.error("Unexpected error when loading \"sap-ui-version.json\": "+Z);H.finishTask(V);});}else{I(K);}}var N=this.oConfiguration["xx-bootTask"];if(N){var O=H.startTask("custom boot task");N(function(Z){H.finishTask(O,typeof Z==="undefined"||Z===true);});}var P=new q.sap.Version(this.oConfiguration.getCompatibilityVersion("flexBoxPolyfill"));if(P.compareTo("1.16")>=0){q.support.useFlexBoxPolyfill=false;}else if(!q.support.flexBoxLayout&&!q.support.newFlexBoxLayout&&!q.support.ie10FlexBoxLayout){q.support.useFlexBoxPolyfill=true;}else{q.support.useFlexBoxPolyfill=false;}var Q=H.startTask("bootstrap script");this.boot=function(){if(this.bBooted){return;}this.bBooted=true;H.finishTask(Q);};if(p==="sync"||p==="async"){var X=p!=="sync";q.each(m,function(i,Z){if(Z.match(/\.library$/)){q.sap.preloadModules(Z+"-preload",X,H);}});}var Y=this.oConfiguration.getAppCacheBuster();if(Y&&Y.length>0){q.sap.require("sap.ui.core.AppCacheBuster");sap.ui.core.AppCacheBuster.boot(H);}},metadata:{publicMethods:["boot","isInitialized","isThemeApplied","attachInitEvent","attachInit","getRenderManager","createRenderManager","getConfiguration","setRoot","createUIArea","getUIArea","getUIDirty","getElementById","getCurrentFocusedControlId","getControl","getComponent","getTemplate","lock","unlock","isLocked","attachEvent","detachEvent","applyChanges","getEventBus","applyTheme","setThemeRoot","attachThemeChanged","detachThemeChanged","getStaticAreaRef","registerPlugin","unregisterPlugin","getLibraryResourceBundle","byId","getLoadedLibraries","loadLibrary","loadLibraries","initLibrary","includeLibraryTheme","setModel","getModel","hasModel","isMobile","attachControlEvent","detachControlEvent","attachIntervalTimer","detachIntervalTimer","attachParseError","detachParseError","fireParseError","attachValidationError","detachValidationError","fireValidationError","attachFormatError","detachFormatError","fireFormatError","attachValidationSuccess","detachValidationSuccess","fireValidationSuccess","attachLocalizationChanged","detachLocalizationChanged","attachLibraryChanged","detachLibraryChanged","isStaticAreaRef","createComponent","getRootComponent","getApplication","setMessageManager","getMessageManager"]}});n.M_EVENTS={ControlEvent:"ControlEvent",UIUpdated:"UIUpdated",ThemeChanged:"ThemeChanged",LocalizationChanged:"localizationChanged",LibraryChanged:"libraryChanged",ValidationError:"validationError",ParseError:"parseError",FormatError:"formatError",ValidationSuccess:"validationSuccess"};var S="sap-ui-static";n.prototype._boot=function(){this.lock();var b=this.oConfiguration['preloadLibCss'];if(b.length>0){var A=b[0].slice(0,1)==="!";if(A){b[0]=b[0].slice(1);}if(b[0]==="*"){b.splice(0,1);var p=0;q.each(this.oConfiguration.modules,function(i,f){var m=f.match(/^(.*)\.library$/);if(m){b.splice(p,0,m[1]);}});}if(!A){this.includeLibraryTheme("sap-ui-merged",undefined,"?l="+b.join(","));}}var t=this;q.each(this.oConfiguration.modules,function(i,f){var m=f.match(/^(.*)\.library$/);if(m){t.loadLibrary(m[1]);}else{q.sap.require(f);}});this.unlock();};n.prototype.applyTheme=function(t,s){t=this.oConfiguration._normalizeTheme(t,s);if(s){this.setThemeRoot(t,s);}if(t&&this.sTheme!=t){var b=this.sTheme;this._updateThemeUrls(t);this.sTheme=t;this.oConfiguration._setTheme(t);q(document.documentElement).removeClass("sapUiTheme-"+b).addClass("sapUiTheme-"+t);if(this.oThemeCheck){this.oThemeCheck.fireThemeChangedEvent(false,true);}}};n.prototype._updateThemeUrls=function(t){var b=this,s=this.oConfiguration.getRTL()?"-RTL":"";q("link[id^=sap-ui-theme-]").each(function(){var l=this.id.slice(13),f=this.href.slice(this.href.lastIndexOf("/")+1),i="library",H,p,$=q(this);if((p=l.indexOf("-["))>0){i+=l.slice(p+2,-1);l=l.slice(0,p);}if(f===(i+".css")||f===(i+"-RTL.css")){f=i+s+".css";}if($.attr("sap-ui-css-count")){$.remove();}H=b._getThemePath(l,t)+f;if(H!=this.href){this.href=H;$.removeAttr("sap-ui-ready");}});};n.prototype._getThemePath=function(l,t){if(this._mThemeRoots){var p=this._mThemeRoots[t+" "+l]||this._mThemeRoots[t];if(p){p=p+l.replace(/\./g,"/")+"/themes/"+t+"/";q.sap.registerModulePath(l+".themes."+t,p);return p;}}return q.sap.getModulePath(l+".themes."+t,"/");};n.prototype.setThemeRoot=function(t,l,s){if(!this._mThemeRoots){this._mThemeRoots={};}if(s===undefined){s=l;l=undefined;}s=s+(s.slice(-1)=="/"?"":"/");if(l){for(var i=0;i<l.length;i++){var b=l[i];this._mThemeRoots[t+" "+b]=s;}}else{this._mThemeRoots[t]=s;}return this;};n.prototype.init=function(){if(this.bInitialized){return;}var b=q.sap.log,j="sap.ui.core.Core.init()";this.boot();b.info("Initializing",null,j);this.oFocusHandler=new F(document.body,this);this.oRenderManager._setFocusHandler(this.oFocusHandler);this.oResizeHandler=new h(this);this.oThemeCheck=new T(this);b.info("Initialized",null,j);this.bInitialized=true;b.info("Starting Plugins",null,j);this.startPlugins();b.info("Plugins started",null,j);var o=this.oConfiguration;if(o.areas){for(var i=0,l=o.areas.length;i<l;i++){this.createUIArea(o.areas[i]);}o.areas=undefined;}this.oThemeCheck.fireThemeChangedEvent(true);if(o.onInit){if(typeof o.onInit==="function"){o.onInit();}else{q.sap.globalEval(o.onInit);}o.onInit=undefined;}var s=o.getRootComponent();if(s){b.info("Loading Root Component: "+s,null,j);var m=sap.ui.component({name:s});this.oRootComponent=m;var p=o["xx-rootComponentNode"];if(p&&m instanceof sap.ui.core.UIComponent){var t=q.sap.domById(p);if(t){b.info("Creating ComponentContainer for Root Component: "+s,null,j);var u=new sap.ui.core.ComponentContainer({component:m,propagateModel:true});u.placeAt(t);}}}else{var A=o.getApplication();if(A){b.warning("The configuration 'application' is deprecated. Please use the configuration 'component' instead! Please migrate from sap.ui.app.Application to sap.ui.core.Component.");b.info("Loading Application: "+A,null,j);q.sap.require(A);var v=q.sap.getObject(A);var w=new v();}}var $=q("body");if(o.getAccessibility()&&o.getAutoAriaBodyRole()&&!$.attr("role")){$.attr("role","application");}var x=this.aInitListeners;this.aInitListeners=undefined;if(x&&x.length>0){b.info("Fire Loaded Event",null,j);q.each(x,function(i,f){f();});}this.renderPendingUIUpdates();};n.prototype.handleLoad=function(){this.bDomReady=true;var w=this.isLocked();if(!w){this.lock();}this.init();if(!w){this.unlock();}};n.prototype.isInitialized=function(){return this.bInitialized;};n.prototype.isThemeApplied=function(){return T.themeLoaded;};n.prototype.attachInitEvent=function(f){if(this.aInitListeners){this.aInitListeners.push(f);}};n.prototype.attachInit=function(f){if(this.aInitListeners){this.aInitListeners.push(f);}else{f();}};n.prototype.lock=function(){this.bLocked=true;};n.prototype.unlock=function(){this.bLocked=false;};n.prototype.isLocked=function(){return this.bLocked;};n.prototype.getConfiguration=function(){return this.oConfiguration;};n.prototype.getRenderManager=function(){return this.createRenderManager();};n.prototype.createRenderManager=function(){var o=new R();o._setFocusHandler(this.oFocusHandler);return o.getInterface();};n.prototype.getCurrentFocusedControlId=function(){if(!this.isInitialized()){throw new Error("Core must be initialized");}return this.oFocusHandler.getCurrentFocusedControlId();};n.prototype.loadLibrary=function(l,u){if(!L[l]){var m=l+".library",A;if(u){q.sap.registerModulePath(l,u);}if(this.oConfiguration['xx-loadAllMode']&&!q.sap.isDeclared(m)){A=m+"-all";q.sap.log.debug("load all-in-one file "+A);q.sap.require(A);}else if(this.oConfiguration.preload==='sync'||this.oConfiguration.preload==='async'){q.sap.preloadModules(m+"-preload",false);}q.sap.require(m);if(!L[l]){q.sap.log.warning("library "+l+" didn't initialize itself");this.initLibrary(l);}if(this.oThemeCheck&&this.isInitialized()){this.oThemeCheck.fireThemeChangedEvent(true);}}return this.mLibraries[l];};n.prototype.loadLibraries=function(l,o){o=q.extend({async:true},o);var t=this,p=this.oConfiguration.preload==='sync'||this.oConfiguration.preload==='async',A=o.async;function b(s){if(p){q.each(l,function(i,j){q.sap.preloadModules(j+".library-preload",!!s,s);});}}function f(){q.each(l,function(i,s){q.sap.require(s+".library");});if(t.oThemeCheck&&t.isInitialized()){t.oThemeCheck.fireThemeChangedEvent(true);}}if(A&&p){return new Promise(function(i,j){var s=q.sap.syncPoint("Load Libraries",function(O,u){if(!u){f();i();}else{j();}});var m=s.startTask("load libraries");b(s);s.finishTask(m);});}else{b(null);f();}};n.prototype.createComponent=function(v,u,i,s){if(typeof v==="string"){v={name:v,url:u};if(typeof i==="object"){v.settings=i;}else{v.id=i;v.settings=s;}}return sap.ui.component(v);};n.prototype.getRootComponent=function(){return this.oRootComponent;};n.prototype.initLibrary=function(l){var b=typeof l==="string",o=b?{name:l}:l,s=o.name,f=q.sap.log,m="sap.ui.core.Core.initLibrary()";if(b){f.warning("[Deprecated] library "+s+" uses old fashioned initLibrary() call (rebuild with newest generator)");}if(!s||L[s]){return;}f.debug("Analyzing Library "+s,null,m);L[s]=true;function p(j,I){var K,V;for(K in I){V=I[K];if(V!==undefined){if(q.isArray(j[K])){if(j[K].length===0){j[K]=V;}else{j[K]=q.sap.unique(j[K].concat(V));}}else if(j[K]===undefined){j[K]=V;}else{q.sap.log.warning("library info setting ignored: "+K+"="+V);}}}return j;}q.sap.getObject(s,0);this.mLibraries[s]=o=p(this.mLibraries[s]||{name:s,dependencies:[],types:[],interfaces:[],controls:[],elements:[]},o);function t(){var P=q.sap.properties({url:sap.ui.resource(s,"library.properties")});o.version=P.getProperty(s+"[version]");var w=P.getProperty(s+"[dependencies]");f.debug("Required Libraries: "+w,null,m);o.dependencies=(w&&w.split(/[,;| ]/))||[];var K=P.getKeys(),x=/(.+)\.(type|interface|control|element)$/,y;for(var j=0;j<K.length;j++){var z=P.getProperty(K[j]);if((y=z.match(x))!==null){o[y[2]+"s"].push(K[j]);}}}if(b){t();}for(var i=0;i<o.dependencies.length;i++){var u=o.dependencies[i];f.debug("resolve Dependencies to "+u,null,m);if(!L[u]){f.warning("Dependency from "+s+" to "+u+" has not been resolved by library itself",null,m);this.loadLibrary(u);}}a.registerInterfaceTypes(o.interfaces);for(var i=0;i<o.types.length;i++){if(!/^(any|boolean|float|int|string|object|void)$/.test(o.types[i])){q.sap.declare(o.types[i]);}}var v=o.controls.concat(o.elements);for(var i=0;i<v.length;i++){sap.ui.lazyRequire(v[i],"new extend getMetadata");}if(!o.noLibraryCSS&&q.inArray(s,this.oConfiguration['preloadLibCss'])<0){var Q=this._getLibraryCssQueryParams(o);this.includeLibraryTheme(s,undefined,Q);}o.sName=o.name;o.aControls=o.controls;if(!q.sap.isDeclared(s+".library")){f.warning("Library Module "+s+".library"+" not loaded automatically",null,m);q.sap.require(s+".library");}this.fireLibraryChanged({name:s,stereotype:"library",operation:"add",metadata:o});};n.prototype.includeLibraryTheme=function(l,v,Q){if((l!="sap.ui.legacy")&&(l!="sap.ui.classic")){if(!v){v="";}var s=(this.oConfiguration.getRTL()?"-RTL":"");var b,f=l+(v.length>0?"-["+v+"]":v);if(l&&l.indexOf(":")==-1){b="library"+v+s;}else{b=l.substring(l.indexOf(":")+1)+v;l=l.substring(0,l.indexOf(":"));}var i=this._getThemePath(l,this.sTheme)+b+".css"+(Q?Q:"");q.sap.log.info("Including "+i+" -  sap.ui.core.Core.includeLibraryTheme()");q.sap.includeStyleSheet(i,"sap-ui-theme-"+f);if(sap.ui.core.theming&&sap.ui.core.theming.Parameters){sap.ui.core.theming.Parameters._addLibraryTheme(f,i);}}};n.prototype._getLibraryCssQueryParams=function(l){var Q;if(this.oConfiguration["versionedLibCss"]&&l){Q="?version="+l.version;if(sap.ui.versioninfo){Q+="&sap-ui-dist-version="+sap.ui.versioninfo.version;}}return Q;};n.prototype.getLoadedLibraries=function(){return q.extend({},this.mLibraries);};n.prototype.getLibraryResourceBundle=function(l,s){l=l||"sap.ui.core";s=s||this.getConfiguration().getLanguage();var K=l+"/"+s;if(!this.mResourceBundles[K]){var u=sap.ui.resource(l,'messagebundle.properties');this.mResourceBundles[K]=q.sap.resources({url:u,locale:s});}return this.mResourceBundles[K];};n.prototype.setRoot=function(o,b){if(b){b.placeAt(o,"only");}};n.prototype.createUIArea=function(o){var t=this;if(!o){throw new Error("oDomRef must not be null");}if(typeof(o)==="string"){var i=o;if(i==S){o=this.getStaticAreaRef();}else{o=q.sap.domById(o);if(!o){throw new Error("DOM element with ID '"+i+"' not found in page, but application tries to insert content.");}}}if(!o.id||o.id.length==0){o.id=q.sap.uid();}var I=o.id;if(!this.mUIAreas[I]){this.mUIAreas[I]=new U(this,o);q.each(this.oModels,function(N,m){t.mUIAreas[I].oPropagatedProperties.oModels[N]=m;});this.mUIAreas[I].propagateProperties(true);}else{this.mUIAreas[I].setRootNode(o);}return this.mUIAreas[I];};n.prototype.getUIArea=function(o){var i="";if(typeof(o)=="string"){i=o;}else{i=o.id;}if(i){return this.mUIAreas[i];}return null;};var r=U._oRenderLog;n.prototype.addInvalidatedUIArea=function(u){if(!this._sRerenderTimer){r.debug("Registering timer for delayed re-rendering");this._sRerenderTimer=q.sap.delayedCall(0,this,"renderPendingUIUpdates");}};n.MAX_RENDERING_ITERATIONS=20;n.prototype.renderPendingUIUpdates=function(){r.debug("Render pending UI updates: start");q.sap.measure.start("renderPendingUIUpdates","Render pending UI updates in all UIAreas");var u=false,l=n.MAX_RENDERING_ITERATIONS>0,i=0;this._bRendering=true;do{if(l){i++;if(i>n.MAX_RENDERING_ITERATIONS){this._bRendering=false;throw new Error("Rendering has been re-started too many times ("+i+"). Add URL parameter sap-ui-xx-debugRendering=true for a detailed analysis.");}if(i>1){r.debug("Render pending UI updates: iteration "+i);}}if(this._sRerenderTimer){q.sap.clearDelayedCall(this._sRerenderTimer);this._sRerenderTimer=undefined;}var m=this.mUIAreas;for(var I in m){u=m[I].rerender()||u;}}while(l&&this._sRerenderTimer);this._bRendering=false;if(u){this.fireUIUpdated();}r.debug("Render pending UI updates: finished");q.sap.measure.end("renderPendingUIUpdates");};n.prototype.getUIDirty=function(){return!!(this._sRerenderTimer||this._bRendering);};n.prototype.attachUIUpdated=function(f,l){this.attachEvent(n.M_EVENTS.UIUpdated,f,l);};n.prototype.detachUIUpdated=function(f,l){this.detachEvent(n.M_EVENTS.UIUpdated,f,l);};n.prototype.fireUIUpdated=function(p){this.fireEvent(n.M_EVENTS.UIUpdated,p);};n.prototype.attachThemeChanged=function(f,l){this.attachEvent(n.M_EVENTS.ThemeChanged,f,l);};n.prototype.detachThemeChanged=function(f,l){this.detachEvent(n.M_EVENTS.ThemeChanged,f,l);};n.prototype.fireThemeChanged=function(p){q.sap.scrollbarSize(true);if(sap.ui.core.theming&&sap.ui.core.theming.Parameters){sap.ui.core.theming.Parameters.reset(true);}var s=n.M_EVENTS.ThemeChanged;var o=q.Event(s);o.theme=p?p.theme:null;q.each(this.mElements,function(i,b){b._handleEvent(o);});q.sap.act.refresh();this.fireEvent(s,p);};n.prototype.attachLocalizationChanged=function(f,l){this.attachEvent(n.M_EVENTS.LocalizationChanged,f,l);};n.prototype.detachLocalizationChanged=function(f,l){this.detachEvent(n.M_EVENTS.LocalizationChanged,f,l);};n.prototype.fireLocalizationChanged=function(m){var s=n.M_EVENTS.LocalizationChanged,b=q.Event(s,{changes:m}),A=sap.ui.base.ManagedObject._handleLocalizationChange,f=[];q.each(m,function(j,v){f.push(j);});q.sap.log.info("localization settings changed: "+f.join(","),null,"sap.ui.core.Core");q.each(this.oModels,function(N,o){if(o&&o._handleLocalizationChange){o._handleLocalizationChange();}});function i(p){q.each(this.mUIAreas,function(){A.call(this,p);});q.each(this.mObjects["component"],function(){A.call(this,p);});q.each(this.mElements,function(){A.call(this,p);});}i.call(this,1);i.call(this,2);if(m.rtl!=undefined){q(document.documentElement).attr("dir",m.rtl?"rtl":"ltr");this._updateThemeUrls(this.sTheme);q.each(this.mUIAreas,function(){this.invalidate();});q.sap.log.info("RTL mode "+m.rtl?"activated":"deactivated");}q.each(this.mElements,function(I,o){this._handleEvent(b);});this.fireEvent(s,{changes:m});};n.prototype.attachLibraryChanged=function(f,l){this.attachEvent(n.M_EVENTS.LibraryChanged,f,l);};n.prototype.detachLibraryChanged=function(f,l){this.detachEvent(n.M_EVENTS.LibraryChanged,f,l);};n.prototype.fireLibraryChanged=function(p){this.fireEvent(n.M_EVENTS.LibraryChanged,p);};n.prototype.applyChanges=function(){this.renderPendingUIUpdates();};n.prototype.registerElementClass=function(m){var N=m.getName(),l=m.getLibraryName()||"",o=this.mLibraries[l],s=d.prototype.isPrototypeOf(m.getClass().prototype)?'controls':'elements';if(!o){q.sap.getObject(l,0);o=this.mLibraries[l]={name:l,dependencies:[],types:[],interfaces:[],controls:[],elements:[]};}if(q.inArray(N,o[s])<0){o[s].push(N);q.sap.log.debug("Class "+m.getName()+" registered for library "+m.getLibraryName());this.fireLibraryChanged({name:m.getName(),stereotype:m.getStereotype(),operation:"add",metadata:m});}};n.prototype.registerElement=function(o){var b=this.byId(o.getId());if(b&&b!==o){if(b._sapui_candidateForDestroy){q.sap.log.debug("destroying dangling template "+b+" when creating new object with same ID");b.destroy();b=null;}}if(b&&b!==o){if(this.oConfiguration.getNoDuplicateIds()){q.sap.log.error("adding element with duplicate id '"+o.getId()+"'");throw new Error("Error: adding element with duplicate id '"+o.getId()+"'");}else{q.sap.log.warning("adding element with duplicate id '"+o.getId()+"'");}}this.mElements[o.getId()]=o;};n.prototype.deregisterElement=function(o){delete this.mElements[o.getId()];};n.prototype.registerObject=function(o){var i=o.getId(),t=o.getMetadata().getStereotype(),b=this.getObject(t,i);if(b&&b!==o){q.sap.log.error("adding object \""+t+"\" with duplicate id '"+i+"'");throw new Error("Error: adding object \""+t+"\" with duplicate id '"+i+"'");}this.mObjects[t][i]=o;};n.prototype.deregisterObject=function(o){var i=o.getId(),t=o.getMetadata().getStereotype();delete this.mObjects[t][i];};n.prototype.byId=function(i){return i==null?undefined:this.mElements[i];};n.prototype.getControl=n.prototype.byId;n.prototype.getElementById=n.prototype.byId;n.prototype.getObject=function(t,i){return i==null?undefined:this.mObjects[t]&&this.mObjects[t][i];};n.prototype.getComponent=function(i){return this.getObject("component",i);};n.prototype.getTemplate=function(i){return this.getObject("template",i);};n.prototype.getStaticAreaRef=function(){var s=q.sap.domById(S);if(!s){if(!this.bDomReady){throw new Error("DOM is not ready yet. Static UIArea cannot be created.");}var A={id:S};if(q("body").attr("role")!="application"){A.role="application";}var l=this.getConfiguration().getRTL()?"right":"left";s=q("<DIV/>",A).css({"height":"0","width":"0","overflow":"hidden","float":l}).prependTo(document.body)[0];this.createUIArea(s).bInitial=false;}return s;};n.prototype.isStaticAreaRef=function(o){return o&&(o.id===S);};n._I_INTERVAL=200;h.prototype.I_INTERVAL=n._I_INTERVAL;n.prototype.attachIntervalTimer=function(f,l){if(!this.oTimedTrigger){q.sap.require("sap.ui.core.IntervalTrigger");this.oTimedTrigger=new sap.ui.core.IntervalTrigger(n._I_INTERVAL);}this.oTimedTrigger.addListener(f,l);};n.prototype.detachIntervalTimer=function(f,l){if(this.oTimedTrigger){this.oTimedTrigger.removeListener(f,l);}};n.prototype.attachControlEvent=function(f,l){this.attachEvent(n.M_EVENTS.ControlEvent,f,l);};n.prototype.detachControlEvent=function(f,l){this.detachEvent(n.M_EVENTS.ControlEvent,f,l);};n.prototype.fireControlEvent=function(p){this.fireEvent(n.M_EVENTS.ControlEvent,p);};n.prototype._handleControlEvent=function(o,u){var b=q.Event(o.type);q.extend(b,o);b.originalEvent=undefined;this.fireControlEvent({"browserEvent":b,"uiArea":u});};n.prototype.getApplication=function(){return sap.ui.getApplication&&sap.ui.getApplication();};n.prototype.registerPlugin=function(p){if(!p){return;}for(var i=0,l=this.aPlugins.length;i<l;i++){if(this.aPlugins[i]===p){return;}}this.aPlugins.push(p);if(this.bInitialized&&p&&p.startPlugin){p.startPlugin(this);}};n.prototype.unregisterPlugin=function(p){if(!p){return;}var P=-1;for(var i=this.aPlugins.length;i--;i>=0){if(this.aPlugins[i]===p){P=i;break;}}if(P==-1){return;}if(this.bInitialized&&p&&p.stopPlugin){p.stopPlugin(this);}this.aPlugins.splice(P,1);};n.prototype.startPlugins=function(){for(var i=0,l=this.aPlugins.length;i<l;i++){var p=this.aPlugins[i];if(p&&p.startPlugin){p.startPlugin(this,true);}}};n.prototype.stopPlugins=function(){for(var i=0,l=this.aPlugins.length;i<l;i++){var p=this.aPlugins[i];if(p&&p.stopPlugin){p.stopPlugin(this);}}};n.prototype.setModel=function(m,N){if(!m&&this.oModels[N]){delete this.oModels[N];q.each(this.mUIAreas,function(i,u){delete u.oPropagatedProperties.oModels[N];u.propagateProperties(N);});}else if(m&&m!==this.oModels[N]){this.oModels[N]=m;q.each(this.mUIAreas,function(i,u){u.oPropagatedProperties.oModels[N]=m;u.propagateProperties(N);});}return this;};n.prototype.setMessageManager=function(m){this.oMessageManager=m;};n.prototype.getMessageManager=function(){if(!this.oMessageManager){this.oMessageManager=new M();}return this.oMessageManager;};n.prototype.getModel=function(N){return this.oModels[N];};n.prototype.hasModel=function(){return!q.isEmptyObject(this.oModels);};n.prototype.getEventBus=function(){if(!this.oEventBus){q.sap.require("sap.ui.core.EventBus");this.oEventBus=new sap.ui.core.EventBus();}return this.oEventBus;};n.prototype.attachValidationError=function(o,f,l){if(typeof(o)==="function"){l=f;f=o;o=undefined;}this.attachEvent(n.M_EVENTS.ValidationError,o,f,l);return this;};n.prototype.detachValidationError=function(f,l){this.detachEvent(n.M_EVENTS.ValidationError,f,l);return this;};n.prototype.attachParseError=function(o,f,l){if(typeof(o)==="function"){l=f;f=o;o=undefined;}this.attachEvent(n.M_EVENTS.ParseError,o,f,l);return this;};n.prototype.detachParseError=function(f,l){this.detachEvent(n.M_EVENTS.ParseError,f,l);return this;};n.prototype.attachFormatError=function(o,f,l){if(typeof(o)==="function"){l=f;f=o;o=undefined;}this.attachEvent(n.M_EVENTS.FormatError,o,f,l);return this;};n.prototype.detachFormatError=function(f,l){this.detachEvent(n.M_EVENTS.FormatError,f,l);return this;};n.prototype.attachValidationSuccess=function(o,f,l){if(typeof(o)==="function"){l=f;f=o;o=undefined;}this.attachEvent(n.M_EVENTS.ValidationSuccess,o,f,l);return this;};n.prototype.detachValidationSuccess=function(f,l){this.detachEvent(n.M_EVENTS.ValidationSuccess,f,l);return this;};n.prototype.fireParseError=function(A){this.fireEvent(n.M_EVENTS.ParseError,A);return this;};n.prototype.fireValidationError=function(A){this.fireEvent(n.M_EVENTS.ValidationError,A);return this;};n.prototype.fireFormatError=function(A){this.fireEvent(n.M_EVENTS.FormatError,A);return this;};n.prototype.fireValidationSuccess=function(A){this.fireEvent(n.M_EVENTS.ValidationSuccess,A);return this;};n.prototype.isMobile=function(){return D.browser.mobile;};sap.ui.setRoot=function(o,b){sap.ui.getCore().setRoot(o,b);};return new n().getInterface();},false);
