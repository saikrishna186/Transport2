/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/EventProvider'],function(q,E){"use strict";var a={EnumMember:true,Path:true,PropertyPath:true,NavigationPropertyPath:true,AnnotationPath:true};var t={Binary:true,Bool:true,Date:true,DateTimeOffset:true,Decimal:true,Duration:true,Float:true,Guid:true,Int:true,String:true,TimeOfDay:true,LabelElementReference:true,EnumMember:true,Path:true,PropertyPath:true,NavigationPropertyPath:true,AnnotationPath:true};var m={And:true,Or:true,Eq:true,Ne:true,Gt:true,Ge:true,Lt:true,Le:true,If:true,Collection:true};var O=sap.ui.base.EventProvider.extend("sap.ui.model.odata.ODataAnnotations",{constructor:function(A,M,p){E.apply(this,arguments);this.oMetadata=M;this.oAnnotations=null;this.bLoaded=false;this.bAsync=p&&p.async;this.xPath=null;this.aAnnotationURI=A;this.error=null;this.bValidXML=true;this.oRequestHandles=[];this.oLoadEvent=null;this.oFailedEvent=null;this.xmlCompatVersion=false;if(A){this.loadXML();if(!this.bAsync){if(this.error){q.sap.log.error("OData annotations could not be loaded: "+this.error.message);}}}},metadata:{publicMethods:["parse","getAnnotationsData","attachFailed","detachAnnoationsFailed","attachLoaded","detachLoaded"]}});O.prototype.getAnnotationsData=function(){return this.oAnnotations;};O.prototype.isLoaded=function(){return this.bLoaded;};O.prototype.isFailed=function(){return this.error!==null;};O.prototype.fireLoaded=function(A){this.fireEvent("loaded",A);return this;};O.prototype.attachLoaded=function(d,f,l){this.attachEvent("loaded",d,f,l);return this;};O.prototype.detachLoaded=function(f,l){this.detachEvent("loaded",f,l);return this;};O.prototype.fireFailed=function(A){this.fireEvent("failed",A);return this;};O.prototype.attachFailed=function(d,f,l){this.attachEvent("failed",d,f,l);return this;};O.prototype.detachFailed=function(f,l){this.detachEvent("failed",f,l);return this;};O.prototype._parseAliases=function(x,A,o){var r=this.xPath.selectNodes(x,"//edmx:Reference",x);for(var i=0;i<r.length;i+=1){var b=this.xPath.nextNode(r,i);var c=this.xPath.selectNodes(x,"./edmx:Include",b);if(c&&c.length>0){var d=this.xPath.nextNode(c,0);if(d.getAttribute("Alias")){o[d.getAttribute("Alias")]=d.getAttribute("Namespace");}else{o[d.getAttribute("Namespace")]=d.getAttribute("Namespace");}}var e=this.xPath.selectNodes(x,"./edmx:IncludeAnnotations",b);if(e.length>0){for(var j=0;j<e.length;j+=1){var f=this.xPath.nextNode(e,j);if(f.getAttribute("TargetNamespace")){var s=f.getAttribute("TargetNamespace");if(!A[s]){A[s]={};}A[s][f.getAttribute("TermNamespace")]=b.getAttribute("Uri");}else{A[f.getAttribute("TermNamespace")]=b.getAttribute("Uri");}}}}};O.prototype.parse=function(x){var b={},s,S={},c,A={},d,T,e,f,M,g,h,l,n,o,p,r,u,v,w,y,z,B,C,D,F,G,H,i,I;var J={};this.xPath=this.getXPath();this.oServiceMetadata=this.oMetadata.getServiceMetadata();x=this.xPath.setNameSpace(x);s=this.xPath.selectNodes(x,"//d:Schema",x);for(i=0;i<s.length;i+=1){c=this.xPath.nextNode(s,i);S.Alias=c.getAttribute("Alias");S.Namespace=c.getAttribute("Namespace");}this._parseAliases(x,A,J);if(A){b.annotationReferences=A;}b.aliasDefinitions=J;d=this.xPath.selectNodes(x,"//d:Term",x);if(d.length>0){T={};for(I=0;I<d.length;I+=1){e=this.xPath.nextNode(d,I);f=this.replaceWithAlias(e.getAttribute("Type"),J);T["@"+S.Alias+"."+e.getAttribute("Name")]=f;}b.termDefinitions=T;}M=this.getAllPropertiesMetadata(this.oServiceMetadata);if(M.extensions){b.propertyExtensions=M.extensions;}g=this.xPath.selectNodes(x,"//d:Annotations ",x);for(I=0;I<g.length;I+=1){h=this.xPath.nextNode(g,I);if(h.hasChildNodes()===false){continue;}l=h.getAttribute("Target");n=l.split(".")[0];if(n&&J[n]){l=l.replace(new RegExp(n,""),J[n]);}o=l;p=null;var K=null;if(l.indexOf("/")>0){o=l.split("/")[0];var L=this.oServiceMetadata.dataServices&&this.oServiceMetadata.dataServices.schema&&this.oServiceMetadata.dataServices.schema.length;if(L){for(var j=this.oServiceMetadata.dataServices.schema.length-1;j>=0;j--){var N=this.oServiceMetadata.dataServices.schema[j];if(N.entityContainer){var P=o.split('.');for(var k=N.entityContainer.length-1;k>=0;k--){if(N.entityContainer[k].name===P[P.length-1]){K=l.replace(o+"/","");break;}}}}}if(!K){p=l.replace(o+"/","");}}if(p){if(!b.propertyAnnotations){b.propertyAnnotations={};}if(!b.propertyAnnotations[o]){b.propertyAnnotations[o]={};}if(!b.propertyAnnotations[o][p]){b.propertyAnnotations[o][p]={};}r=this.xPath.selectNodes(x,"./d:Annotation",h);for(var Q=0;Q<r.length;Q+=1){u=this.xPath.nextNode(r,Q);v=this.replaceWithAlias(u.getAttribute("Term"),J);var R=h.getAttribute("Qualifier")||u.getAttribute("Qualifier");if(R){v+="#"+R;}if(u.hasChildNodes()===false){b.propertyAnnotations[o][p][v]=this.enrichFromPropertyValueAttributes({},u,J);}else{b.propertyAnnotations[o][p][v]=this.getPropertyValue(x,u,J);}}}else{var U;if(K){if(!b["EntityContainer"]){b["EntityContainer"]={};}if(!b["EntityContainer"][o]){b["EntityContainer"][o]={};}U=b["EntityContainer"][o];}else{if(!b[o]){b[o]={};}U=b[o];}w=o.replace(J[n],n);r=this.xPath.selectNodes(x,"./d:Annotation",h);for(var V=0;V<r.length;V+=1){u=this.xPath.nextNode(r,V);y=h.getAttribute("Qualifier")||u.getAttribute("Qualifier");z=this.replaceWithAlias(u.getAttribute("Term"),J);if(y){z+="#"+y;}B=this.getPropertyValue(x,u,J);B=this.setEdmTypes(B,M.types,o,S);if(!K){U[z]=B;}else{if(!U[K]){U[K]={};}U[K][z]=B;}}C=this.xPath.selectNodes(x,"//d:Annotations[contains(@Target, '"+w+"')]//d:PropertyValue[contains(@Path, '/')]//@Path",x);for(i=0;i<C.length;i+=1){D=this.xPath.nextNode(C,i);F=D.value;if(b.propertyAnnotations){if(b.propertyAnnotations[o]){if(b.propertyAnnotations[o][F]){continue;}}}G=F.split('/');if(!!this.findNavProperty(o,G[0],this.oServiceMetadata)){if(!b.expand){b.expand={};}if(!b.expand[o]){b.expand[o]={};}b.expand[o][G[0]]=G[0];}}H=this.xPath.selectNodes(x,"//d:Annotations[contains(@Target, '"+w+"')]//d:Path[contains(., '/')]",x);for(i=0;i<H.length;i+=1){D=this.xPath.nextNode(H,i);F=this.xPath.getNodeText(D);if(b.propertyAnnotations&&b.propertyAnnotations[o]&&b.propertyAnnotations[o][F]){continue;}if(!b.expand){b.expand={};}if(!b.expand[o]){b.expand[o]={};}G=F.split('/');if(!!this.findNavProperty(o,G[0],this.oServiceMetadata)){if(!b.expand){b.expand={};}if(!b.expand[o]){b.expand[o]={};}b.expand[o][G[0]]=G[0];}}}}return b;};O.prototype.getXPath=function(){var x={};if(this.xmlCompatVersion){x={setNameSpace:function(o){o.setProperty("SelectionNamespaces",'xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" xmlns:d="http://docs.oasis-open.org/odata/ns/edm"');o.setProperty("SelectionLanguage","XPath");return o;},selectNodes:function(o,x,i){return i.selectNodes(x);},nextNode:function(n){return n.nextNode();},getNodeText:function(n){return n.text;}};}else{x={setNameSpace:function(o){return o;},nsResolver:function(p){var n={"edmx":"http://docs.oasis-open.org/odata/ns/edmx","d":"http://docs.oasis-open.org/odata/ns/edm"};return n[p]||null;},selectNodes:function(o,p,i){var b=o.evaluate(p,i,this.nsResolver,7,null);b.length=b.snapshotLength;return b;},nextNode:function(n,i){return n.snapshotItem(i);},getNodeText:function(n){return n.textContent;}};}return x;};O.prototype.setXML=function(x,X,o){var d={success:function(){},error:function(){}};o=q.extend({},d,o);var b=this;var c=null;if(sap.ui.Device.browser.internet_explorer){c=new ActiveXObject("Microsoft.XMLDOM");c.preserveWhiteSpace=true;if(X.indexOf(" xmlns:xml=")>-1){X=X.replace(' xmlns:xml="http://www.w3.org/XML/1998/namespace"',"").replace(" xmlns:xml='http://www.w3.org/XML/1998/namespace'","");}c.loadXML(X);this.xmlCompatVersion=true;}else if(x){c=x;}else{c=new DOMParser().parseFromString(X,'application/xml');}if(c.getElementsByTagName("parsererror").length>0||(c.parseError&&c.parseError.errorCode!==0)){o.error({xmlDoc:c});return false;}else{if(q.isEmptyObject(this.oMetadata.getServiceMetadata())){this.oMetadata.attachLoaded(function(){var A=b.parse(c);if(A){o.success({annotations:A,xmlDoc:c});}else{o.error({xmlDoc:c});}});}else{var A=this.parse(c);if(A){o.success({annotations:A,xmlDoc:c});}else{o.error({xmlDoc:c});}}return true;}};O.prototype.loadXML=function(){var b=this;if(!q.isArray(this.aAnnotationURI)){this.aAnnotationURI=[this.aAnnotationURI];}var l=this.aAnnotationURI.length;this.mLoaded={length:l};var c=function(r){return function _handleFail(j,S){if(b.oRequestHandles[r]&&b.oRequestHandles[r].bSuppressErrorHandlerCall){return;}b.oRequestHandles[r]=null;b.error={message:S,statusCode:j.statusCode,statusText:j.statusText,url:b.aAnnotationURI[r],responseText:j.responseText};if(!b.bAsync){b.oFailedEvent=q.sap.delayedCall(0,b,b.fireFailed,[b.error]);}else{b.fireFailed(b.error);}};};var C=function(r,h){return function(d,T,j){b.oRequestHandles[r]=null;b.setXML(j.responseXML,j.responseText,{success:function(D){b.mLoaded[r]=D.annotations;b.checkAllLoaded();},error:function(D){b.mLoaded[r]=false;h(j,"Malformed XML document");b.checkAllLoaded();}});};};for(var i=0;i<l;++i){this.mLoaded[i]=false;var A={url:this.aAnnotationURI[i],async:this.bAsync};var f=c(i);var s=C(i,f);this.oRequestHandles[i]=q.ajax(A).done(s).fail(f);}};O.prototype.checkAllLoaded=function(){var i;var l=this.mLoaded.length;for(i=0;i<l;++i){if(!this.mLoaded[i]){return;}}this.oAnnotations={};for(i=0;i<l;++i){q.extend(true,this.oAnnotations,this.mLoaded[i]);}this.bLoaded=true;if(this.bAsync){this.fireLoaded({annotations:this.oAnnotations});}else{this.oLoadEvent=q.sap.delayedCall(0,this,this.fireLoaded,[{annotations:this.oAnnotations}]);}};O.prototype.getAllPropertiesMetadata=function(M){var o={},P={},b={},c=false,n,e,C,d={},f={},g={},h=false,r,s,u,T,v,R={types:P};if(!M.dataServices.schema){return R;}for(var i=M.dataServices.schema.length-1;i>=0;i-=1){o=M.dataServices.schema[i];if(o.entityType){n=o.namespace;e=o.entityType;C=o.complexType;for(var j in e){d=e[j];g={};f={};if(d.hasStream&&d.hasStream==="true"){continue;}for(var k in d.property){r=d.property[k];if(r.type.substring(0,n.length)===n){for(var l in C){if(C[l].name===r.type.substring(n.length+1)){for(k in C[l].property){s=C[l].property[k];f[C[l].name+"/"+s.name]=s.type;}}}}else{u=r.name;T=r.type;for(var p in r.extensions){v=r.extensions[p];if((v.name==="display-format")&&(v.value==="Date")){T="Edm.Date";}else{h=true;if(!g[u]){g[u]={};}if(v.namespace&&!g[u][v.namespace]){g[u][v.namespace]={};}g[u][v.namespace][v.name]=v.value;}}f[u]=T;}}if(!P[n+"."+d.name]){P[n+"."+d.name]={};}P[n+"."+d.name]=f;if(h){if(!b[n+"."+d.name]){c=true;}b[n+"."+d.name]={};b[n+"."+d.name]=g;}}}}if(c){R={types:P,extensions:b};}return R;};O.prototype.setEdmTypes=function(p,P,T,s){var o,e='';for(var b in p){if(p[b]){o=p[b];if(o.Value&&o.Value.Path){e=this.getEdmType(o.Value.Path,P,T,s);if(e){p[b].EdmType=e;}continue;}if(o.Path){e=this.getEdmType(o.Path,P,T,s);if(e){p[b].EdmType=e;}continue;}if(o.Facets){p[b].Facets=this.setEdmTypes(o.Facets,P,T,s);continue;}if(o.Data){p[b].Data=this.setEdmTypes(o.Data,P,T,s);continue;}if(b==="Data"){p.Data=this.setEdmTypes(o,P,T,s);continue;}if(o.Value&&o.Value.Apply){p[b].Value.Apply.Parameters=this.setEdmTypes(o.Value.Apply.Parameters,P,T,s);continue;}if(o.Value&&o.Type&&(o.Type==="Path")){e=this.getEdmType(o.Value,P,T,s);if(e){p[b].EdmType=e;}}}}return p;};O.prototype.getEdmType=function(p,P,T,s){var i=p.indexOf("/");if(i>-1){var b=p.substr(0,i);var n=this.findNavProperty(T,b,this.oServiceMetadata);if(n){var c=this.oMetadata._getEntityTypeByNavPropertyObject(n);if(c){T=c.entityType;p=p.substr(i+1);}}}if((p.charAt(0)==="@")&&(p.indexOf(s.Alias)===1)){p=p.slice(s.Alias.length+2);}if(p.indexOf("/")>=0){if(P[p.slice(0,p.indexOf("/"))]){T=p.slice(0,p.indexOf("/"));p=p.slice(p.indexOf("/")+1);}}for(var d in P[T]){if(p===d){return P[T][d];}}};O.prototype.enrichFromPropertyValueAttributes=function(p,d,A){var k="",v="",i;var r=function(v){return this.replaceWithAlias(v,A);}.bind(this);for(i=0;i<d.attributes.length;i+=1){var s=d.attributes[i].name;if(s!=="Property"&&s!=="Term"&&s!=="Qualifier"){k=d.attributes[i].name;v=d.attributes[i].value;}if(k){if(k==="EnumMember"&&v.indexOf(" ")>-1){var V=v.split(" ");p[k]=V.map(r).join(" ");}else{p[k]=this.replaceWithAlias(v,A);}}}return p;};O.prototype.getSimpleNodeValue=function(x,d,A){var v={};var V=this.xPath.selectNodes(x,"./d:String | ./d:Path | ./d:Apply",d);for(var i=0;i<V.length;++i){var o=this.xPath.nextNode(V,i);var b;switch(o.nodeName){case"Apply":b=this.getApplyFunctions(x,o,A);break;default:b=this.xPath.getNodeText(o);break;}v[o.nodeName]=b;}return v;};O.prototype._getTextValue=function(n,A){var v="";if(n.nodeName in a){v=this.replaceWithAlias(this.xPath.getNodeText(n),A);}else{v=this.xPath.getNodeText(n);}if(n.nodeName!=="String"){v=v.trim();}return v;};O.prototype.getPropertyValue=function(x,d,A){var r,b,n,c,p,u,e,f,P={},g,h,j,k,l;var o=d.nodeName==="Collection"?[]:{};var s=this.getXPath();if(d.hasChildNodes()){r=this.xPath.selectNodes(x,"./d:Record | ./d:Collection/d:Record | ./d:Collection/d:If/d:Record",d);if(r.length){b=0;for(n=0;n<r.length;n+=1){c=this.xPath.nextNode(r,n);p=this.getPropertyValues(x,c,A);if(c.getAttribute("Type")){p["RecordType"]=this.replaceWithAlias(c.getAttribute("Type"),A);}if(b===0){if(c.nextElementSibling||(c.parentNode.nodeName==="Collection")||(c.parentNode.nodeName==="If")){o=[];o.push(p);}else{o=p;}}else{o.push(p);}b+=1;}}else{u=this.xPath.selectNodes(x,"./d:UrlRef",d);if(u.length>0){for(n=0;n<u.length;n+=1){e=this.xPath.nextNode(u,n);o["UrlRef"]=this.getSimpleNodeValue(x,e);}}else{u=this.xPath.selectNodes(x,"./d:Url",d);if(u.length>0){for(n=0;n<u.length;n+=1){e=this.xPath.nextNode(u,n);o["Url"]=this.getSimpleNodeValue(x,e);}}else{l=this.xPath.selectNodes(x,"./d:Collection/d:AnnotationPath | ./d:Collection/d:PropertyPath",d);if(l.length>0){o=[];for(n=0;n<l.length;n+=1){f=this.xPath.nextNode(l,n);P={};P[f.nodeName]=this.replaceWithAlias(s.getNodeText(f),A);o.push(P);}}else{g=this.xPath.selectNodes(x,"./d:Annotation",d);h={};for(j=0;j<g.length;j+=1){h=this.xPath.nextNode(g,j);if(h.hasChildNodes()===false){k=this.replaceWithAlias(h.getAttribute("Term"),A);o[k]=this.enrichFromPropertyValueAttributes({},h,A);}}var v=s.selectNodes(x,"./d:*",d);if(v.length>0){for(var i=0;i<v.length;i++){var w=s.nextNode(v,i);if(w.nodeName!=="Annotation"){var N=w.nodeName;var y=w.parentNode.nodeName;var V;if(N==="Apply"){V=this.getApplyFunctions(x,w,A);}else{V=this.getPropertyValue(x,w,A);}if(m[y]){if(!Array.isArray(o)){o=[];}var z={};z[N]=V;o.push(z);}else if(N==="Collection"){o=V;}else{if(o[N]){q.sap.log.warning("Annotation contained multiple "+N+" values. Only the last "+"one will be stored");}o[N]=V;}}}}else if(d.nodeName in t){o=this._getTextValue(d,A);}this.enrichFromPropertyValueAttributes(o,d,A);}}}}}else if(d.nodeName in t){o=this._getTextValue(d,A);}else{this.enrichFromPropertyValueAttributes(o,d,A);}return o;};O.prototype.getPropertyValues=function(x,p,A){var P={},i;var o=this.xPath.selectNodes(x,"./d:Annotation",p);var b=this.xPath.selectNodes(x,"./d:PropertyValue",p);if(o.length===0&&b.length===0){P=this.getPropertyValue(x,p,A);}else{for(i=0;i<o.length;i++){var c=this.xPath.nextNode(o,i);var T=this.replaceWithAlias(c.getAttribute("Term"),A);P[T]=this.getPropertyValue(x,c,A);}for(i=0;i<b.length;i++){var d=this.xPath.nextNode(b,i);var s=d.getAttribute("Property");P[s]=this.getPropertyValue(x,d,A);var e=this.xPath.selectNodes(x,"./d:Apply",d);for(var n=0;n<e.length;n+=1){var f=this.xPath.nextNode(e,n);P[s]={};P[s]['Apply']=this.getApplyFunctions(x,f,A);}}}return P;};O.prototype.getApplyFunctions=function(x,b,A){var c={},p,d=null,e=[],i;p=this.xPath.selectNodes(x,"./d:*",b);for(i=0;i<p.length;i+=1){d=this.xPath.nextNode(p,i);var P={Type:d.nodeName};if(d.nodeName==="Apply"){P.Value=this.getApplyFunctions(x,d);}else if(d.nodeName==="LabeledElement"){var v=this.getPropertyValue(x,d,A);P.Name=v.Name;delete v.Name;P.Value=v;}else if(m[d.nodeName]){P.Value=this.getPropertyValue(x,d,A);}else{P.Value=this.xPath.getNodeText(d);}e.push(P);}c['Name']=b.getAttribute('Function');c['Parameters']=e;return c;};O.prototype.findNavProperty=function(e,p,M){var o,i,n,b,j,k;for(i=M.dataServices.schema.length-1;i>=0;i-=1){o=M.dataServices.schema[i];if(o.entityType){n=o.namespace+".";b=o.entityType;for(k=b.length-1;k>=0;k-=1){if(n+b[k].name===e&&b[k].navigationProperty){for(j=0;j<b[k].navigationProperty.length;j+=1){if(b[k].navigationProperty[j].name===p){return b[k].navigationProperty[j];}}}}}}return null;};O.prototype.replaceWithAlias=function(v,A){for(var s in A){if(v.indexOf(s+".")>=0&&v.indexOf("."+s+".")<0){v=v.replace(s+".",A[s]+".");return v;}}return v;};O.prototype.destroy=function(){for(var i=0;i<this.oRequestHandles.length;++i){if(this.oRequestHandles[i]){this.oRequestHandles[i].bSuppressErrorHandlerCall=true;this.oRequestHandles[i].abort();this.oRequestHandles[i]=null;}}sap.ui.base.Object.prototype.destroy.apply(this,arguments);if(this.oLoadEvent){q.sap.clearDelayedCall(this.oLoadEvent);}if(this.oFailedEvent){q.sap.clearDelayedCall(this.oFailedEvent);}};return O;},true);