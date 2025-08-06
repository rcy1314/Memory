var ko=Object.defineProperty,Ro=Object.defineProperties;var Po=Object.getOwnPropertyDescriptors;var Oe=Object.getOwnPropertySymbols;var $o=Object.prototype.hasOwnProperty,To=Object.prototype.propertyIsEnumerable;var Le=(e,o,t)=>o in e?ko(e,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[o]=t,Fe=(e,o)=>{for(var t in o||(o={}))$o.call(o,t)&&Le(e,t,o[t]);if(Oe)for(var t of Oe(o))To.call(o,t)&&Le(e,t,o[t]);return e},je=(e,o)=>Ro(e,Po(o));var ce=(e,o,t)=>new Promise((l,i)=>{var n=c=>{try{u(t.next(c))}catch(h){i(h)}},s=c=>{try{u(t.throw(c))}catch(h){i(h)}},u=c=>c.done?l(c.value):Promise.resolve(c.value).then(n,s);u((t=t.apply(e,o)).next())});import{d as D,h as x,c as b,a as w,b as g,e as A,f as te,u as ue,g as Z,i as Ao,p as J,t as ne,j as z,k as me,r as E,o as Ye,l as No,m as Ho,n as Y,q as Bo,s as Mo,v as Eo,w as Oo,x as Ke,S as Xe,y as Ze,N as Je,z as W,A as re,B as Lo,C as oe,D as Pe,E as _e,F as ie,G as ge,H as Fo,V as jo,I as Ko,J as Ce,K as Vo,L as Do,M as le,O as he,P as B,Q as S,R as U,T as K,U as Qe,W as I,X as eo,Y as oo,Z as ve,_ as L,$ as ee,a0 as F,a1 as Uo,a2 as Wo,a3 as Go,a4 as qo,a5 as Yo,a6 as Ve,a7 as to,a8 as ro,a9 as Xo,aa as Zo,ab as ye,ac as we,ad as De,ae as Jo,af as pe,ag as no,ah as Ue,ai as Qo,aj as et,ak as ot,al as ze,am as tt,an as rt,ao as Se,ap as io,aq as nt,ar as it,as as We}from"./index-ON-SflwH.js";import{r as lo,a as q}from"./icon-oAdvG0qp.js";import{N as $e}from"./Icon-BJkIY_JM.js";import{C as lt,_ as Te}from"./Dropdown-xqSQiCI2.js";import{N as at}from"./Image-1TDPnt6y.js";import{N as st}from"./Tooltip-Bg3keV3f.js";import{c as be,V as ct,N as dt}from"./Tag-U0zSNQTP.js";import{u as Ie}from"./use-locale-gdUNdwpT.js";import{u as ut}from"./Popover-DLxopjSP.js";import{_ as mt}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{f as xe}from"./format-length-B-p6aW7q.js";import"./use-keyboard-DJNqtv65.js";const ht=D({name:"ChevronDownFilled",render(){return x("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},x("path",{d:"M3.20041 5.73966C3.48226 5.43613 3.95681 5.41856 4.26034 5.70041L8 9.22652L11.7397 5.70041C12.0432 5.41856 12.5177 5.43613 12.7996 5.73966C13.0815 6.0432 13.0639 6.51775 12.7603 6.7996L8.51034 10.7996C8.22258 11.0668 7.77743 11.0668 7.48967 10.7996L3.23966 6.7996C2.93613 6.51775 2.91856 6.0432 3.20041 5.73966Z",fill:"currentColor"}))}}),vt=b("breadcrumb",`
 white-space: nowrap;
 cursor: default;
 line-height: var(--n-item-line-height);
`,[w("ul",`
 list-style: none;
 padding: 0;
 margin: 0;
 `),w("a",`
 color: inherit;
 text-decoration: inherit;
 `),b("breadcrumb-item",`
 font-size: var(--n-font-size);
 transition: color .3s var(--n-bezier);
 display: inline-flex;
 align-items: center;
 `,[b("icon",`
 font-size: 18px;
 vertical-align: -.2em;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `),w("&:not(:last-child)",[A("clickable",[g("link",`
 cursor: pointer;
 `,[w("&:hover",`
 background-color: var(--n-item-color-hover);
 `),w("&:active",`
 background-color: var(--n-item-color-pressed); 
 `)])])]),g("link",`
 padding: 4px;
 border-radius: var(--n-item-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 position: relative;
 `,[w("&:hover",`
 color: var(--n-item-text-color-hover);
 `,[b("icon",`
 color: var(--n-item-text-color-hover);
 `)]),w("&:active",`
 color: var(--n-item-text-color-pressed);
 `,[b("icon",`
 color: var(--n-item-text-color-pressed);
 `)])]),g("separator",`
 margin: 0 8px;
 color: var(--n-separator-color);
 transition: color .3s var(--n-bezier);
 user-select: none;
 -webkit-user-select: none;
 `),w("&:last-child",[g("link",`
 font-weight: var(--n-font-weight-active);
 cursor: unset;
 color: var(--n-item-text-color-active);
 `,[b("icon",`
 color: var(--n-item-text-color-active);
 `)]),g("separator",`
 display: none;
 `)])])]),ao=te("n-breadcrumb"),pt=Object.assign(Object.assign({},Z.props),{separator:{type:String,default:"/"}}),ft=D({name:"Breadcrumb",props:pt,setup(e){const{mergedClsPrefixRef:o,inlineThemeDisabled:t}=ue(e),l=Z("Breadcrumb","-breadcrumb",vt,Ao,e,o);J(ao,{separatorRef:ne(e,"separator"),mergedClsPrefixRef:o});const i=z(()=>{const{common:{cubicBezierEaseInOut:s},self:{separatorColor:u,itemTextColor:c,itemTextColorHover:h,itemTextColorPressed:k,itemTextColorActive:f,fontSize:r,fontWeightActive:v,itemBorderRadius:m,itemColorHover:p,itemColorPressed:C,itemLineHeight:T}}=l.value;return{"--n-font-size":r,"--n-bezier":s,"--n-item-text-color":c,"--n-item-text-color-hover":h,"--n-item-text-color-pressed":k,"--n-item-text-color-active":f,"--n-separator-color":u,"--n-item-color-hover":p,"--n-item-color-pressed":C,"--n-item-border-radius":m,"--n-font-weight-active":v,"--n-item-line-height":T}}),n=t?me("breadcrumb",void 0,i,e):void 0;return{mergedClsPrefix:o,cssVars:t?void 0:i,themeClass:n==null?void 0:n.themeClass,onRender:n==null?void 0:n.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),x("nav",{class:[`${this.mergedClsPrefix}-breadcrumb`,this.themeClass],style:this.cssVars,"aria-label":"Breadcrumb"},x("ul",null,this.$slots))}});function gt(e=Ho?window:null){const o=()=>{const{hash:i,host:n,hostname:s,href:u,origin:c,pathname:h,port:k,protocol:f,search:r}=(e==null?void 0:e.location)||{};return{hash:i,host:n,hostname:s,href:u,origin:c,pathname:h,port:k,protocol:f,search:r}},t=E(o()),l=()=>{t.value=o()};return Ye(()=>{e&&(e.addEventListener("popstate",l),e.addEventListener("hashchange",l))}),No(()=>{e&&(e.removeEventListener("popstate",l),e.removeEventListener("hashchange",l))}),t}const bt={separator:String,href:String,clickable:{type:Boolean,default:!0},onClick:Function},xt=D({name:"BreadcrumbItem",props:bt,slots:Object,setup(e,{slots:o}){const t=Y(ao,null);if(!t)return()=>null;const{separatorRef:l,mergedClsPrefixRef:i}=t,n=gt(),s=z(()=>e.href?"a":"span"),u=z(()=>n.value.href===e.href?"location":null);return()=>{const{value:c}=i;return x("li",{class:[`${c}-breadcrumb-item`,e.clickable&&`${c}-breadcrumb-item--clickable`]},x(s.value,{class:`${c}-breadcrumb-item__link`,"aria-current":u.value,href:e.href,onClick:e.onClick},o),x("span",{class:`${c}-breadcrumb-item__separator`,"aria-hidden":"true"},Bo(o.separator,()=>{var h;return[(h=e.separator)!==null&&h!==void 0?h:l.value]})))}}});function _t(e){const{baseColor:o,textColor2:t,bodyColor:l,cardColor:i,dividerColor:n,actionColor:s,scrollbarColor:u,scrollbarColorHover:c,invertedColor:h}=e;return{textColor:t,textColorInverted:"#FFF",color:l,colorEmbedded:s,headerColor:i,headerColorInverted:h,footerColor:s,footerColorInverted:h,headerBorderColor:n,headerBorderColorInverted:h,footerBorderColor:n,footerBorderColorInverted:h,siderBorderColor:n,siderBorderColorInverted:h,siderColor:i,siderColorInverted:h,siderToggleButtonBorder:`1px solid ${n}`,siderToggleButtonColor:o,siderToggleButtonIconColor:t,siderToggleButtonIconColorInverted:t,siderToggleBarColor:Ke(l,u),siderToggleBarColorHover:Ke(l,c),__invertScrollbar:"true"}}const so=Mo({name:"Layout",common:Oo,peers:{Scrollbar:Eo},self:_t}),co=te("n-layout-sider"),uo={type:String,default:"static"},Ct=b("layout",`
 color: var(--n-text-color);
 background-color: var(--n-color);
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 flex: auto;
 overflow: hidden;
 transition:
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
`,[b("layout-scroll-container",`
 overflow-x: hidden;
 box-sizing: border-box;
 height: 100%;
 `),A("absolute-positioned",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),yt={embedded:Boolean,position:uo,nativeScrollbar:{type:Boolean,default:!0},scrollbarProps:Object,onScroll:Function,contentClass:String,contentStyle:{type:[String,Object],default:""},hasSider:Boolean,siderPlacement:{type:String,default:"left"}},mo=te("n-layout");function wt(e){return D({name:"Layout",props:Object.assign(Object.assign({},Z.props),yt),setup(o){const t=E(null),l=E(null),{mergedClsPrefixRef:i,inlineThemeDisabled:n}=ue(o),s=Z("Layout","-layout",Ct,so,o,i);function u(p,C){if(o.nativeScrollbar){const{value:T}=t;T&&(C===void 0?T.scrollTo(p):T.scrollTo(p,C))}else{const{value:T}=l;T&&T.scrollTo(p,C)}}J(mo,o);let c=0,h=0;const k=p=>{var C;const T=p.target;c=T.scrollLeft,h=T.scrollTop,(C=o.onScroll)===null||C===void 0||C.call(o,p)};Ze(()=>{if(o.nativeScrollbar){const p=t.value;p&&(p.scrollTop=h,p.scrollLeft=c)}});const f={display:"flex",flexWrap:"nowrap",width:"100%",flexDirection:"row"},r={scrollTo:u},v=z(()=>{const{common:{cubicBezierEaseInOut:p},self:C}=s.value;return{"--n-bezier":p,"--n-color":o.embedded?C.colorEmbedded:C.color,"--n-text-color":C.textColor}}),m=n?me("layout",z(()=>o.embedded?"e":""),v,o):void 0;return Object.assign({mergedClsPrefix:i,scrollableElRef:t,scrollbarInstRef:l,hasSiderStyle:f,mergedTheme:s,handleNativeElScroll:k,cssVars:n?void 0:v,themeClass:m==null?void 0:m.themeClass,onRender:m==null?void 0:m.onRender},r)},render(){var o;const{mergedClsPrefix:t,hasSider:l}=this;(o=this.onRender)===null||o===void 0||o.call(this);const i=l?this.hasSiderStyle:void 0,n=[this.themeClass,e,`${t}-layout`,`${t}-layout--${this.position}-positioned`];return x("div",{class:n,style:this.cssVars},this.nativeScrollbar?x("div",{ref:"scrollableElRef",class:[`${t}-layout-scroll-container`,this.contentClass],style:[this.contentStyle,i],onScroll:this.handleNativeElScroll},this.$slots):x(Xe,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,contentClass:this.contentClass,contentStyle:[this.contentStyle,i]}),this.$slots))}})}const zt=wt(!1),St=b("layout-sider",`
 flex-shrink: 0;
 box-sizing: border-box;
 position: relative;
 z-index: 1;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 min-width .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 transform .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 display: flex;
 justify-content: flex-end;
`,[A("bordered",[g("border",`
 content: "";
 position: absolute;
 top: 0;
 bottom: 0;
 width: 1px;
 background-color: var(--n-border-color);
 transition: background-color .3s var(--n-bezier);
 `)]),g("left-placement",[A("bordered",[g("border",`
 right: 0;
 `)])]),A("right-placement",`
 justify-content: flex-start;
 `,[A("bordered",[g("border",`
 left: 0;
 `)]),A("collapsed",[b("layout-toggle-button",[b("base-icon",`
 transform: rotate(180deg);
 `)]),b("layout-toggle-bar",[w("&:hover",[g("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),g("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])])]),b("layout-toggle-button",`
 left: 0;
 transform: translateX(-50%) translateY(-50%);
 `,[b("base-icon",`
 transform: rotate(0);
 `)]),b("layout-toggle-bar",`
 left: -28px;
 transform: rotate(180deg);
 `,[w("&:hover",[g("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),g("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})])])]),A("collapsed",[b("layout-toggle-bar",[w("&:hover",[g("top",{transform:"rotate(-12deg) scale(1.15) translateY(-2px)"}),g("bottom",{transform:"rotate(12deg) scale(1.15) translateY(2px)"})])]),b("layout-toggle-button",[b("base-icon",`
 transform: rotate(0);
 `)])]),b("layout-toggle-button",`
 transition:
 color .3s var(--n-bezier),
 right .3s var(--n-bezier),
 left .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 cursor: pointer;
 width: 24px;
 height: 24px;
 position: absolute;
 top: 50%;
 right: 0;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 18px;
 color: var(--n-toggle-button-icon-color);
 border: var(--n-toggle-button-border);
 background-color: var(--n-toggle-button-color);
 box-shadow: 0 2px 4px 0px rgba(0, 0, 0, .06);
 transform: translateX(50%) translateY(-50%);
 z-index: 1;
 `,[b("base-icon",`
 transition: transform .3s var(--n-bezier);
 transform: rotate(180deg);
 `)]),b("layout-toggle-bar",`
 cursor: pointer;
 height: 72px;
 width: 32px;
 position: absolute;
 top: calc(50% - 36px);
 right: -28px;
 `,[g("top, bottom",`
 position: absolute;
 width: 4px;
 border-radius: 2px;
 height: 38px;
 left: 14px;
 transition: 
 background-color .3s var(--n-bezier),
 transform .3s var(--n-bezier);
 `),g("bottom",`
 position: absolute;
 top: 34px;
 `),w("&:hover",[g("top",{transform:"rotate(12deg) scale(1.15) translateY(-2px)"}),g("bottom",{transform:"rotate(-12deg) scale(1.15) translateY(2px)"})]),g("top, bottom",{backgroundColor:"var(--n-toggle-bar-color)"}),w("&:hover",[g("top, bottom",{backgroundColor:"var(--n-toggle-bar-color-hover)"})])]),g("border",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 width: 1px;
 transition: background-color .3s var(--n-bezier);
 `),b("layout-sider-scroll-container",`
 flex-grow: 1;
 flex-shrink: 0;
 box-sizing: border-box;
 height: 100%;
 opacity: 0;
 transition: opacity .3s var(--n-bezier);
 max-width: 100%;
 `),A("show-content",[b("layout-sider-scroll-container",{opacity:1})]),A("absolute-positioned",`
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 `)]),It=D({props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return x("div",{onClick:this.onClick,class:`${e}-layout-toggle-bar`},x("div",{class:`${e}-layout-toggle-bar__top`}),x("div",{class:`${e}-layout-toggle-bar__bottom`}))}}),kt=D({name:"LayoutToggleButton",props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return x("div",{class:`${e}-layout-toggle-button`,onClick:this.onClick},x(Je,{clsPrefix:e},{default:()=>x(lt,null)}))}}),Rt={position:uo,bordered:Boolean,collapsedWidth:{type:Number,default:48},width:{type:[Number,String],default:272},contentClass:String,contentStyle:{type:[String,Object],default:""},collapseMode:{type:String,default:"transform"},collapsed:{type:Boolean,default:void 0},defaultCollapsed:Boolean,showCollapsedContent:{type:Boolean,default:!0},showTrigger:{type:[Boolean,String],default:!1},nativeScrollbar:{type:Boolean,default:!0},inverted:Boolean,scrollbarProps:Object,triggerClass:String,triggerStyle:[String,Object],collapsedTriggerClass:String,collapsedTriggerStyle:[String,Object],"onUpdate:collapsed":[Function,Array],onUpdateCollapsed:[Function,Array],onAfterEnter:Function,onAfterLeave:Function,onExpand:[Function,Array],onCollapse:[Function,Array],onScroll:Function},Pt=D({name:"LayoutSider",props:Object.assign(Object.assign({},Z.props),Rt),setup(e){const o=Y(mo),t=E(null),l=E(null),i=E(e.defaultCollapsed),n=Ie(ne(e,"collapsed"),i),s=z(()=>xe(n.value?e.collapsedWidth:e.width)),u=z(()=>e.collapseMode!=="transform"?{}:{minWidth:xe(e.width)}),c=z(()=>o?o.siderPlacement:"left");function h(N,P){if(e.nativeScrollbar){const{value:$}=t;$&&(P===void 0?$.scrollTo(N):$.scrollTo(N,P))}else{const{value:$}=l;$&&$.scrollTo(N,P)}}function k(){const{"onUpdate:collapsed":N,onUpdateCollapsed:P,onExpand:$,onCollapse:X}=e,{value:G}=n;P&&W(P,!G),N&&W(N,!G),i.value=!G,G?$&&W($):X&&W(X)}let f=0,r=0;const v=N=>{var P;const $=N.target;f=$.scrollLeft,r=$.scrollTop,(P=e.onScroll)===null||P===void 0||P.call(e,N)};Ze(()=>{if(e.nativeScrollbar){const N=t.value;N&&(N.scrollTop=r,N.scrollLeft=f)}}),J(co,{collapsedRef:n,collapseModeRef:ne(e,"collapseMode")});const{mergedClsPrefixRef:m,inlineThemeDisabled:p}=ue(e),C=Z("Layout","-layout-sider",St,so,e,m);function T(N){var P,$;N.propertyName==="max-width"&&(n.value?(P=e.onAfterLeave)===null||P===void 0||P.call(e):($=e.onAfterEnter)===null||$===void 0||$.call(e))}const M={scrollTo:h},j=z(()=>{const{common:{cubicBezierEaseInOut:N},self:P}=C.value,{siderToggleButtonColor:$,siderToggleButtonBorder:X,siderToggleBarColor:G,siderToggleBarColorHover:fe}=P,V={"--n-bezier":N,"--n-toggle-button-color":$,"--n-toggle-button-border":X,"--n-toggle-bar-color":G,"--n-toggle-bar-color-hover":fe};return e.inverted?(V["--n-color"]=P.siderColorInverted,V["--n-text-color"]=P.textColorInverted,V["--n-border-color"]=P.siderBorderColorInverted,V["--n-toggle-button-icon-color"]=P.siderToggleButtonIconColorInverted,V.__invertScrollbar=P.__invertScrollbar):(V["--n-color"]=P.siderColor,V["--n-text-color"]=P.textColor,V["--n-border-color"]=P.siderBorderColor,V["--n-toggle-button-icon-color"]=P.siderToggleButtonIconColor),V}),O=p?me("layout-sider",z(()=>e.inverted?"a":"b"),j,e):void 0;return Object.assign({scrollableElRef:t,scrollbarInstRef:l,mergedClsPrefix:m,mergedTheme:C,styleMaxWidth:s,mergedCollapsed:n,scrollContainerStyle:u,siderPlacement:c,handleNativeElScroll:v,handleTransitionend:T,handleTriggerClick:k,inlineThemeDisabled:p,cssVars:j,themeClass:O==null?void 0:O.themeClass,onRender:O==null?void 0:O.onRender},M)},render(){var e;const{mergedClsPrefix:o,mergedCollapsed:t,showTrigger:l}=this;return(e=this.onRender)===null||e===void 0||e.call(this),x("aside",{class:[`${o}-layout-sider`,this.themeClass,`${o}-layout-sider--${this.position}-positioned`,`${o}-layout-sider--${this.siderPlacement}-placement`,this.bordered&&`${o}-layout-sider--bordered`,t&&`${o}-layout-sider--collapsed`,(!t||this.showCollapsedContent)&&`${o}-layout-sider--show-content`],onTransitionend:this.handleTransitionend,style:[this.inlineThemeDisabled?void 0:this.cssVars,{maxWidth:this.styleMaxWidth,width:xe(this.width)}]},this.nativeScrollbar?x("div",{class:[`${o}-layout-sider-scroll-container`,this.contentClass],onScroll:this.handleNativeElScroll,style:[this.scrollContainerStyle,{overflow:"auto"},this.contentStyle],ref:"scrollableElRef"},this.$slots):x(Xe,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",style:this.scrollContainerStyle,contentStyle:this.contentStyle,contentClass:this.contentClass,theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,builtinThemeOverrides:this.inverted&&this.cssVars.__invertScrollbar==="true"?{colorHover:"rgba(255, 255, 255, .4)",color:"rgba(255, 255, 255, .3)"}:void 0}),this.$slots),l?l==="bar"?x(It,{clsPrefix:o,class:t?this.collapsedTriggerClass:this.triggerClass,style:t?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):x(kt,{clsPrefix:o,class:t?this.collapsedTriggerClass:this.triggerClass,style:t?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):null,this.bordered?x("div",{class:`${o}-layout-sider__border`}):null)}}),ae=te("n-menu"),Ae=te("n-submenu"),Ne=te("n-menu-item-group"),Ge=[w("&::before","background-color: var(--n-item-color-hover);"),g("arrow",`
 color: var(--n-arrow-color-hover);
 `),g("icon",`
 color: var(--n-item-icon-color-hover);
 `),b("menu-item-content-header",`
 color: var(--n-item-text-color-hover);
 `,[w("a",`
 color: var(--n-item-text-color-hover);
 `),g("extra",`
 color: var(--n-item-text-color-hover);
 `)])],qe=[g("icon",`
 color: var(--n-item-icon-color-hover-horizontal);
 `),b("menu-item-content-header",`
 color: var(--n-item-text-color-hover-horizontal);
 `,[w("a",`
 color: var(--n-item-text-color-hover-horizontal);
 `),g("extra",`
 color: var(--n-item-text-color-hover-horizontal);
 `)])],$t=w([b("menu",`
 background-color: var(--n-color);
 color: var(--n-item-text-color);
 overflow: hidden;
 transition: background-color .3s var(--n-bezier);
 box-sizing: border-box;
 font-size: var(--n-font-size);
 padding-bottom: 6px;
 `,[A("horizontal",`
 max-width: 100%;
 width: 100%;
 display: flex;
 overflow: hidden;
 padding-bottom: 0;
 `,[b("submenu","margin: 0;"),b("menu-item","margin: 0;"),b("menu-item-content",`
 padding: 0 20px;
 border-bottom: 2px solid #0000;
 `,[w("&::before","display: none;"),A("selected","border-bottom: 2px solid var(--n-border-color-horizontal)")]),b("menu-item-content",[A("selected",[g("icon","color: var(--n-item-icon-color-active-horizontal);"),b("menu-item-content-header",`
 color: var(--n-item-text-color-active-horizontal);
 `,[w("a","color: var(--n-item-text-color-active-horizontal);"),g("extra","color: var(--n-item-text-color-active-horizontal);")])]),A("child-active",`
 border-bottom: 2px solid var(--n-border-color-horizontal);
 `,[b("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-horizontal);
 `,[w("a",`
 color: var(--n-item-text-color-child-active-horizontal);
 `),g("extra",`
 color: var(--n-item-text-color-child-active-horizontal);
 `)]),g("icon",`
 color: var(--n-item-icon-color-child-active-horizontal);
 `)]),re("disabled",[re("selected, child-active",[w("&:focus-within",qe)]),A("selected",[Q(null,[g("icon","color: var(--n-item-icon-color-active-hover-horizontal);"),b("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover-horizontal);
 `,[w("a","color: var(--n-item-text-color-active-hover-horizontal);"),g("extra","color: var(--n-item-text-color-active-hover-horizontal);")])])]),A("child-active",[Q(null,[g("icon","color: var(--n-item-icon-color-child-active-hover-horizontal);"),b("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover-horizontal);
 `,[w("a","color: var(--n-item-text-color-child-active-hover-horizontal);"),g("extra","color: var(--n-item-text-color-child-active-hover-horizontal);")])])]),Q("border-bottom: 2px solid var(--n-border-color-horizontal);",qe)]),b("menu-item-content-header",[w("a","color: var(--n-item-text-color-horizontal);")])])]),re("responsive",[b("menu-item-content-header",`
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),A("collapsed",[b("menu-item-content",[A("selected",[w("&::before",`
 background-color: var(--n-item-color-active-collapsed) !important;
 `)]),b("menu-item-content-header","opacity: 0;"),g("arrow","opacity: 0;"),g("icon","color: var(--n-item-icon-color-collapsed);")])]),b("menu-item",`
 height: var(--n-item-height);
 margin-top: 6px;
 position: relative;
 `),b("menu-item-content",`
 box-sizing: border-box;
 line-height: 1.75;
 height: 100%;
 display: grid;
 grid-template-areas: "icon content arrow";
 grid-template-columns: auto 1fr auto;
 align-items: center;
 cursor: pointer;
 position: relative;
 padding-right: 18px;
 transition:
 background-color .3s var(--n-bezier),
 padding-left .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[w("> *","z-index: 1;"),w("&::before",`
 z-index: auto;
 content: "";
 background-color: #0000;
 position: absolute;
 left: 8px;
 right: 8px;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),A("disabled",`
 opacity: .45;
 cursor: not-allowed;
 `),A("collapsed",[g("arrow","transform: rotate(0);")]),A("selected",[w("&::before","background-color: var(--n-item-color-active);"),g("arrow","color: var(--n-arrow-color-active);"),g("icon","color: var(--n-item-icon-color-active);"),b("menu-item-content-header",`
 color: var(--n-item-text-color-active);
 `,[w("a","color: var(--n-item-text-color-active);"),g("extra","color: var(--n-item-text-color-active);")])]),A("child-active",[b("menu-item-content-header",`
 color: var(--n-item-text-color-child-active);
 `,[w("a",`
 color: var(--n-item-text-color-child-active);
 `),g("extra",`
 color: var(--n-item-text-color-child-active);
 `)]),g("arrow",`
 color: var(--n-arrow-color-child-active);
 `),g("icon",`
 color: var(--n-item-icon-color-child-active);
 `)]),re("disabled",[re("selected, child-active",[w("&:focus-within",Ge)]),A("selected",[Q(null,[g("arrow","color: var(--n-arrow-color-active-hover);"),g("icon","color: var(--n-item-icon-color-active-hover);"),b("menu-item-content-header",`
 color: var(--n-item-text-color-active-hover);
 `,[w("a","color: var(--n-item-text-color-active-hover);"),g("extra","color: var(--n-item-text-color-active-hover);")])])]),A("child-active",[Q(null,[g("arrow","color: var(--n-arrow-color-child-active-hover);"),g("icon","color: var(--n-item-icon-color-child-active-hover);"),b("menu-item-content-header",`
 color: var(--n-item-text-color-child-active-hover);
 `,[w("a","color: var(--n-item-text-color-child-active-hover);"),g("extra","color: var(--n-item-text-color-child-active-hover);")])])]),A("selected",[Q(null,[w("&::before","background-color: var(--n-item-color-active-hover);")])]),Q(null,Ge)]),g("icon",`
 grid-area: icon;
 color: var(--n-item-icon-color);
 transition:
 color .3s var(--n-bezier),
 font-size .3s var(--n-bezier),
 margin-right .3s var(--n-bezier);
 box-sizing: content-box;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 `),g("arrow",`
 grid-area: arrow;
 font-size: 16px;
 color: var(--n-arrow-color);
 transform: rotate(180deg);
 opacity: 1;
 transition:
 color .3s var(--n-bezier),
 transform 0.2s var(--n-bezier),
 opacity 0.2s var(--n-bezier);
 `),b("menu-item-content-header",`
 grid-area: content;
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 opacity: 1;
 white-space: nowrap;
 color: var(--n-item-text-color);
 `,[w("a",`
 outline: none;
 text-decoration: none;
 transition: color .3s var(--n-bezier);
 color: var(--n-item-text-color);
 `,[w("&::before",`
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),g("extra",`
 font-size: .93em;
 color: var(--n-group-text-color);
 transition: color .3s var(--n-bezier);
 `)])]),b("submenu",`
 cursor: pointer;
 position: relative;
 margin-top: 6px;
 `,[b("menu-item-content",`
 height: var(--n-item-height);
 `),b("submenu-children",`
 overflow: hidden;
 padding: 0;
 `,[Lo({duration:".2s"})])]),b("menu-item-group",[b("menu-item-group-title",`
 margin-top: 6px;
 color: var(--n-group-text-color);
 cursor: default;
 font-size: .93em;
 height: 36px;
 display: flex;
 align-items: center;
 transition:
 padding-left .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `)])]),b("menu-tooltip",[w("a",`
 color: inherit;
 text-decoration: none;
 `)]),b("menu-divider",`
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-divider-color);
 height: 1px;
 margin: 6px 18px;
 `)]);function Q(e,o){return[A("hover",e,o),w("&:hover",e,o)]}const ho=D({name:"MenuOptionContent",props:{collapsed:Boolean,disabled:Boolean,title:[String,Function],icon:Function,extra:[String,Function],showArrow:Boolean,childActive:Boolean,hover:Boolean,paddingLeft:Number,selected:Boolean,maxIconSize:{type:Number,required:!0},activeIconSize:{type:Number,required:!0},iconMarginRight:{type:Number,required:!0},clsPrefix:{type:String,required:!0},onClick:Function,tmNode:{type:Object,required:!0},isEllipsisPlaceholder:Boolean},setup(e){const{props:o}=Y(ae);return{menuProps:o,style:z(()=>{const{paddingLeft:t}=e;return{paddingLeft:t&&`${t}px`}}),iconStyle:z(()=>{const{maxIconSize:t,activeIconSize:l,iconMarginRight:i}=e;return{width:`${t}px`,height:`${t}px`,fontSize:`${l}px`,marginRight:`${i}px`}})}},render(){const{clsPrefix:e,tmNode:o,menuProps:{renderIcon:t,renderLabel:l,renderExtra:i,expandIcon:n}}=this,s=t?t(o.rawNode):oe(this.icon);return x("div",{onClick:u=>{var c;(c=this.onClick)===null||c===void 0||c.call(this,u)},role:"none",class:[`${e}-menu-item-content`,{[`${e}-menu-item-content--selected`]:this.selected,[`${e}-menu-item-content--collapsed`]:this.collapsed,[`${e}-menu-item-content--child-active`]:this.childActive,[`${e}-menu-item-content--disabled`]:this.disabled,[`${e}-menu-item-content--hover`]:this.hover}],style:this.style},s&&x("div",{class:`${e}-menu-item-content__icon`,style:this.iconStyle,role:"none"},[s]),x("div",{class:`${e}-menu-item-content-header`,role:"none"},this.isEllipsisPlaceholder?this.title:l?l(o.rawNode):oe(this.title),this.extra||i?x("span",{class:`${e}-menu-item-content-header__extra`}," ",i?i(o.rawNode):oe(this.extra)):null),this.showArrow?x(Je,{ariaHidden:!0,class:`${e}-menu-item-content__arrow`,clsPrefix:e},{default:()=>n?n(o.rawNode):x(ht,null)}):null)}}),de=8;function He(e){const o=Y(ae),{props:t,mergedCollapsedRef:l}=o,i=Y(Ae,null),n=Y(Ne,null),s=z(()=>t.mode==="horizontal"),u=z(()=>s.value?t.dropdownPlacement:"tmNodes"in e?"right-start":"right"),c=z(()=>{var r;return Math.max((r=t.collapsedIconSize)!==null&&r!==void 0?r:t.iconSize,t.iconSize)}),h=z(()=>{var r;return!s.value&&e.root&&l.value&&(r=t.collapsedIconSize)!==null&&r!==void 0?r:t.iconSize}),k=z(()=>{if(s.value)return;const{collapsedWidth:r,indent:v,rootIndent:m}=t,{root:p,isGroup:C}=e,T=m===void 0?v:m;return p?l.value?r/2-c.value/2:T:n&&typeof n.paddingLeftRef.value=="number"?v/2+n.paddingLeftRef.value:i&&typeof i.paddingLeftRef.value=="number"?(C?v/2:v)+i.paddingLeftRef.value:0}),f=z(()=>{const{collapsedWidth:r,indent:v,rootIndent:m}=t,{value:p}=c,{root:C}=e;return s.value||!C||!l.value?de:(m===void 0?v:m)+p+de-(r+p)/2});return{dropdownPlacement:u,activeIconSize:h,maxIconSize:c,paddingLeft:k,iconMarginRight:f,NMenu:o,NSubmenu:i}}const Be={internalKey:{type:[String,Number],required:!0},root:Boolean,isGroup:Boolean,level:{type:Number,required:!0},title:[String,Function],extra:[String,Function]},Tt=D({name:"MenuDivider",setup(){const e=Y(ae),{mergedClsPrefixRef:o,isHorizontalRef:t}=e;return()=>t.value?null:x("div",{class:`${o.value}-menu-divider`})}}),vo=Object.assign(Object.assign({},Be),{tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function}),At=Pe(vo),Nt=D({name:"MenuOption",props:vo,setup(e){const o=He(e),{NSubmenu:t,NMenu:l}=o,{props:i,mergedClsPrefixRef:n,mergedCollapsedRef:s}=l,u=t?t.mergedDisabledRef:{value:!1},c=z(()=>u.value||e.disabled);function h(f){const{onClick:r}=e;r&&r(f)}function k(f){c.value||(l.doSelect(e.internalKey,e.tmNode.rawNode),h(f))}return{mergedClsPrefix:n,dropdownPlacement:o.dropdownPlacement,paddingLeft:o.paddingLeft,iconMarginRight:o.iconMarginRight,maxIconSize:o.maxIconSize,activeIconSize:o.activeIconSize,mergedTheme:l.mergedThemeRef,menuProps:i,dropdownEnabled:_e(()=>e.root&&s.value&&i.mode!=="horizontal"&&!c.value),selected:_e(()=>l.mergedValueRef.value===e.internalKey),mergedDisabled:c,handleClick:k}},render(){const{mergedClsPrefix:e,mergedTheme:o,tmNode:t,menuProps:{renderLabel:l,nodeProps:i}}=this,n=i==null?void 0:i(t.rawNode);return x("div",Object.assign({},n,{role:"menuitem",class:[`${e}-menu-item`,n==null?void 0:n.class]}),x(st,{theme:o.peers.Tooltip,themeOverrides:o.peerOverrides.Tooltip,trigger:"hover",placement:this.dropdownPlacement,disabled:!this.dropdownEnabled||this.title===void 0,internalExtraClass:["menu-tooltip"]},{default:()=>l?l(t.rawNode):oe(this.title),trigger:()=>x(ho,{tmNode:t,clsPrefix:e,paddingLeft:this.paddingLeft,iconMarginRight:this.iconMarginRight,maxIconSize:this.maxIconSize,activeIconSize:this.activeIconSize,selected:this.selected,title:this.title,extra:this.extra,disabled:this.mergedDisabled,icon:this.icon,onClick:this.handleClick})}))}}),po=Object.assign(Object.assign({},Be),{tmNode:{type:Object,required:!0},tmNodes:{type:Array,required:!0}}),Ht=Pe(po),Bt=D({name:"MenuOptionGroup",props:po,setup(e){J(Ae,null);const o=He(e);J(Ne,{paddingLeftRef:o.paddingLeft});const{mergedClsPrefixRef:t,props:l}=Y(ae);return function(){const{value:i}=t,n=o.paddingLeft.value,{nodeProps:s}=l,u=s==null?void 0:s(e.tmNode.rawNode);return x("div",{class:`${i}-menu-item-group`,role:"group"},x("div",Object.assign({},u,{class:[`${i}-menu-item-group-title`,u==null?void 0:u.class],style:[(u==null?void 0:u.style)||"",n!==void 0?`padding-left: ${n}px;`:""]}),oe(e.title),e.extra?x(ie,null," ",oe(e.extra)):null),x("div",null,e.tmNodes.map(c=>Me(c,l))))}}});function ke(e){return e.type==="divider"||e.type==="render"}function Mt(e){return e.type==="divider"}function Me(e,o){const{rawNode:t}=e,{show:l}=t;if(l===!1)return null;if(ke(t))return Mt(t)?x(Tt,Object.assign({key:e.key},t.props)):null;const{labelField:i}=o,{key:n,level:s,isGroup:u}=e,c=Object.assign(Object.assign({},t),{title:t.title||t[i],extra:t.titleExtra||t.extra,key:n,internalKey:n,level:s,root:s===0,isGroup:u});return e.children?e.isGroup?x(Bt,ge(c,Ht,{tmNode:e,tmNodes:e.children,key:n})):x(Re,ge(c,Et,{key:n,rawNodes:t[o.childrenField],tmNodes:e.children,tmNode:e})):x(Nt,ge(c,At,{key:n,tmNode:e}))}const fo=Object.assign(Object.assign({},Be),{rawNodes:{type:Array,default:()=>[]},tmNodes:{type:Array,default:()=>[]},tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function,domId:String,virtualChildActive:{type:Boolean,default:void 0},isEllipsisPlaceholder:Boolean}),Et=Pe(fo),Re=D({name:"Submenu",props:fo,setup(e){const o=He(e),{NMenu:t,NSubmenu:l}=o,{props:i,mergedCollapsedRef:n,mergedThemeRef:s}=t,u=z(()=>{const{disabled:r}=e;return l!=null&&l.mergedDisabledRef.value||i.disabled?!0:r}),c=E(!1);J(Ae,{paddingLeftRef:o.paddingLeft,mergedDisabledRef:u}),J(Ne,null);function h(){const{onClick:r}=e;r&&r()}function k(){u.value||(n.value||t.toggleExpand(e.internalKey),h())}function f(r){c.value=r}return{menuProps:i,mergedTheme:s,doSelect:t.doSelect,inverted:t.invertedRef,isHorizontal:t.isHorizontalRef,mergedClsPrefix:t.mergedClsPrefixRef,maxIconSize:o.maxIconSize,activeIconSize:o.activeIconSize,iconMarginRight:o.iconMarginRight,dropdownPlacement:o.dropdownPlacement,dropdownShow:c,paddingLeft:o.paddingLeft,mergedDisabled:u,mergedValue:t.mergedValueRef,childActive:_e(()=>{var r;return(r=e.virtualChildActive)!==null&&r!==void 0?r:t.activePathRef.value.includes(e.internalKey)}),collapsed:z(()=>i.mode==="horizontal"?!1:n.value?!0:!t.mergedExpandedKeysRef.value.includes(e.internalKey)),dropdownEnabled:z(()=>!u.value&&(i.mode==="horizontal"||n.value)),handlePopoverShowChange:f,handleClick:k}},render(){var e;const{mergedClsPrefix:o,menuProps:{renderIcon:t,renderLabel:l}}=this,i=()=>{const{isHorizontal:s,paddingLeft:u,collapsed:c,mergedDisabled:h,maxIconSize:k,activeIconSize:f,title:r,childActive:v,icon:m,handleClick:p,menuProps:{nodeProps:C},dropdownShow:T,iconMarginRight:M,tmNode:j,mergedClsPrefix:O,isEllipsisPlaceholder:N,extra:P}=this,$=C==null?void 0:C(j.rawNode);return x("div",Object.assign({},$,{class:[`${O}-menu-item`,$==null?void 0:$.class],role:"menuitem"}),x(ho,{tmNode:j,paddingLeft:u,collapsed:c,disabled:h,iconMarginRight:M,maxIconSize:k,activeIconSize:f,title:r,extra:P,showArrow:!s,childActive:v,clsPrefix:O,icon:m,hover:T,onClick:p,isEllipsisPlaceholder:N}))},n=()=>x(Fo,null,{default:()=>{const{tmNodes:s,collapsed:u}=this;return u?null:x("div",{class:`${o}-submenu-children`,role:"menu"},s.map(c=>Me(c,this.menuProps)))}});return this.root?x(Te,Object.assign({size:"large",trigger:"hover"},(e=this.menuProps)===null||e===void 0?void 0:e.dropdownProps,{themeOverrides:this.mergedTheme.peerOverrides.Dropdown,theme:this.mergedTheme.peers.Dropdown,builtinThemeOverrides:{fontSizeLarge:"14px",optionIconSizeLarge:"18px"},value:this.mergedValue,disabled:!this.dropdownEnabled,placement:this.dropdownPlacement,keyField:this.menuProps.keyField,labelField:this.menuProps.labelField,childrenField:this.menuProps.childrenField,onUpdateShow:this.handlePopoverShowChange,options:this.rawNodes,onSelect:this.doSelect,inverted:this.inverted,renderIcon:t,renderLabel:l}),{default:()=>x("div",{class:`${o}-submenu`,role:"menu","aria-expanded":!this.collapsed,id:this.domId},i(),this.isHorizontal?null:n())}):x("div",{class:`${o}-submenu`,role:"menu","aria-expanded":!this.collapsed,id:this.domId},i(),n())}}),Ot=Object.assign(Object.assign({},Z.props),{options:{type:Array,default:()=>[]},collapsed:{type:Boolean,default:void 0},collapsedWidth:{type:Number,default:48},iconSize:{type:Number,default:20},collapsedIconSize:{type:Number,default:24},rootIndent:Number,indent:{type:Number,default:32},labelField:{type:String,default:"label"},keyField:{type:String,default:"key"},childrenField:{type:String,default:"children"},disabledField:{type:String,default:"disabled"},defaultExpandAll:Boolean,defaultExpandedKeys:Array,expandedKeys:Array,value:[String,Number],defaultValue:{type:[String,Number],default:null},mode:{type:String,default:"vertical"},watchProps:{type:Array,default:void 0},disabled:Boolean,show:{type:Boolean,default:!0},inverted:Boolean,"onUpdate:expandedKeys":[Function,Array],onUpdateExpandedKeys:[Function,Array],onUpdateValue:[Function,Array],"onUpdate:value":[Function,Array],expandIcon:Function,renderIcon:Function,renderLabel:Function,renderExtra:Function,dropdownProps:Object,accordion:Boolean,nodeProps:Function,dropdownPlacement:{type:String,default:"bottom"},responsive:Boolean,items:Array,onOpenNamesChange:[Function,Array],onSelect:[Function,Array],onExpandedNamesChange:[Function,Array],expandedNames:Array,defaultExpandedNames:Array}),Lt=D({name:"Menu",inheritAttrs:!1,props:Ot,setup(e){const{mergedClsPrefixRef:o,inlineThemeDisabled:t}=ue(e),l=Z("Menu","-menu",$t,Ko,e,o),i=Y(co,null),n=z(()=>{var _;const{collapsed:R}=e;if(R!==void 0)return R;if(i){const{collapseModeRef:a,collapsedRef:y}=i;if(a.value==="width")return(_=y.value)!==null&&_!==void 0?_:!1}return!1}),s=z(()=>{const{keyField:_,childrenField:R,disabledField:a}=e;return be(e.items||e.options,{getIgnored(y){return ke(y)},getChildren(y){return y[R]},getDisabled(y){return y[a]},getKey(y){var H;return(H=y[_])!==null&&H!==void 0?H:y.name}})}),u=z(()=>new Set(s.value.treeNodes.map(_=>_.key))),{watchProps:c}=e,h=E(null);c!=null&&c.includes("defaultValue")?Ce(()=>{h.value=e.defaultValue}):h.value=e.defaultValue;const k=ne(e,"value"),f=Ie(k,h),r=E([]),v=()=>{r.value=e.defaultExpandAll?s.value.getNonLeafKeys():e.defaultExpandedNames||e.defaultExpandedKeys||s.value.getPath(f.value,{includeSelf:!1}).keyPath};c!=null&&c.includes("defaultExpandedKeys")?Ce(v):v();const m=ut(e,["expandedNames","expandedKeys"]),p=Ie(m,r),C=z(()=>s.value.treeNodes),T=z(()=>s.value.getPath(f.value).keyPath);J(ae,{props:e,mergedCollapsedRef:n,mergedThemeRef:l,mergedValueRef:f,mergedExpandedKeysRef:p,activePathRef:T,mergedClsPrefixRef:o,isHorizontalRef:z(()=>e.mode==="horizontal"),invertedRef:ne(e,"inverted"),doSelect:M,toggleExpand:O});function M(_,R){const{"onUpdate:value":a,onUpdateValue:y,onSelect:H}=e;y&&W(y,_,R),a&&W(a,_,R),H&&W(H,_,R),h.value=_}function j(_){const{"onUpdate:expandedKeys":R,onUpdateExpandedKeys:a,onExpandedNamesChange:y,onOpenNamesChange:H}=e;R&&W(R,_),a&&W(a,_),y&&W(y,_),H&&W(H,_),r.value=_}function O(_){const R=Array.from(p.value),a=R.findIndex(y=>y===_);if(~a)R.splice(a,1);else{if(e.accordion&&u.value.has(_)){const y=R.findIndex(H=>u.value.has(H));y>-1&&R.splice(y,1)}R.push(_)}j(R)}const N=_=>{const R=s.value.getPath(_!=null?_:f.value,{includeSelf:!1}).keyPath;if(!R.length)return;const a=Array.from(p.value),y=new Set([...a,...R]);e.accordion&&u.value.forEach(H=>{y.has(H)&&!R.includes(H)&&y.delete(H)}),j(Array.from(y))},P=z(()=>{const{inverted:_}=e,{common:{cubicBezierEaseInOut:R},self:a}=l.value,{borderRadius:y,borderColorHorizontal:H,fontSize:zo,itemHeight:So,dividerColor:Io}=a,d={"--n-divider-color":Io,"--n-bezier":R,"--n-font-size":zo,"--n-border-color-horizontal":H,"--n-border-radius":y,"--n-item-height":So};return _?(d["--n-group-text-color"]=a.groupTextColorInverted,d["--n-color"]=a.colorInverted,d["--n-item-text-color"]=a.itemTextColorInverted,d["--n-item-text-color-hover"]=a.itemTextColorHoverInverted,d["--n-item-text-color-active"]=a.itemTextColorActiveInverted,d["--n-item-text-color-child-active"]=a.itemTextColorChildActiveInverted,d["--n-item-text-color-child-active-hover"]=a.itemTextColorChildActiveInverted,d["--n-item-text-color-active-hover"]=a.itemTextColorActiveHoverInverted,d["--n-item-icon-color"]=a.itemIconColorInverted,d["--n-item-icon-color-hover"]=a.itemIconColorHoverInverted,d["--n-item-icon-color-active"]=a.itemIconColorActiveInverted,d["--n-item-icon-color-active-hover"]=a.itemIconColorActiveHoverInverted,d["--n-item-icon-color-child-active"]=a.itemIconColorChildActiveInverted,d["--n-item-icon-color-child-active-hover"]=a.itemIconColorChildActiveHoverInverted,d["--n-item-icon-color-collapsed"]=a.itemIconColorCollapsedInverted,d["--n-item-text-color-horizontal"]=a.itemTextColorHorizontalInverted,d["--n-item-text-color-hover-horizontal"]=a.itemTextColorHoverHorizontalInverted,d["--n-item-text-color-active-horizontal"]=a.itemTextColorActiveHorizontalInverted,d["--n-item-text-color-child-active-horizontal"]=a.itemTextColorChildActiveHorizontalInverted,d["--n-item-text-color-child-active-hover-horizontal"]=a.itemTextColorChildActiveHoverHorizontalInverted,d["--n-item-text-color-active-hover-horizontal"]=a.itemTextColorActiveHoverHorizontalInverted,d["--n-item-icon-color-horizontal"]=a.itemIconColorHorizontalInverted,d["--n-item-icon-color-hover-horizontal"]=a.itemIconColorHoverHorizontalInverted,d["--n-item-icon-color-active-horizontal"]=a.itemIconColorActiveHorizontalInverted,d["--n-item-icon-color-active-hover-horizontal"]=a.itemIconColorActiveHoverHorizontalInverted,d["--n-item-icon-color-child-active-horizontal"]=a.itemIconColorChildActiveHorizontalInverted,d["--n-item-icon-color-child-active-hover-horizontal"]=a.itemIconColorChildActiveHoverHorizontalInverted,d["--n-arrow-color"]=a.arrowColorInverted,d["--n-arrow-color-hover"]=a.arrowColorHoverInverted,d["--n-arrow-color-active"]=a.arrowColorActiveInverted,d["--n-arrow-color-active-hover"]=a.arrowColorActiveHoverInverted,d["--n-arrow-color-child-active"]=a.arrowColorChildActiveInverted,d["--n-arrow-color-child-active-hover"]=a.arrowColorChildActiveHoverInverted,d["--n-item-color-hover"]=a.itemColorHoverInverted,d["--n-item-color-active"]=a.itemColorActiveInverted,d["--n-item-color-active-hover"]=a.itemColorActiveHoverInverted,d["--n-item-color-active-collapsed"]=a.itemColorActiveCollapsedInverted):(d["--n-group-text-color"]=a.groupTextColor,d["--n-color"]=a.color,d["--n-item-text-color"]=a.itemTextColor,d["--n-item-text-color-hover"]=a.itemTextColorHover,d["--n-item-text-color-active"]=a.itemTextColorActive,d["--n-item-text-color-child-active"]=a.itemTextColorChildActive,d["--n-item-text-color-child-active-hover"]=a.itemTextColorChildActiveHover,d["--n-item-text-color-active-hover"]=a.itemTextColorActiveHover,d["--n-item-icon-color"]=a.itemIconColor,d["--n-item-icon-color-hover"]=a.itemIconColorHover,d["--n-item-icon-color-active"]=a.itemIconColorActive,d["--n-item-icon-color-active-hover"]=a.itemIconColorActiveHover,d["--n-item-icon-color-child-active"]=a.itemIconColorChildActive,d["--n-item-icon-color-child-active-hover"]=a.itemIconColorChildActiveHover,d["--n-item-icon-color-collapsed"]=a.itemIconColorCollapsed,d["--n-item-text-color-horizontal"]=a.itemTextColorHorizontal,d["--n-item-text-color-hover-horizontal"]=a.itemTextColorHoverHorizontal,d["--n-item-text-color-active-horizontal"]=a.itemTextColorActiveHorizontal,d["--n-item-text-color-child-active-horizontal"]=a.itemTextColorChildActiveHorizontal,d["--n-item-text-color-child-active-hover-horizontal"]=a.itemTextColorChildActiveHoverHorizontal,d["--n-item-text-color-active-hover-horizontal"]=a.itemTextColorActiveHoverHorizontal,d["--n-item-icon-color-horizontal"]=a.itemIconColorHorizontal,d["--n-item-icon-color-hover-horizontal"]=a.itemIconColorHoverHorizontal,d["--n-item-icon-color-active-horizontal"]=a.itemIconColorActiveHorizontal,d["--n-item-icon-color-active-hover-horizontal"]=a.itemIconColorActiveHoverHorizontal,d["--n-item-icon-color-child-active-horizontal"]=a.itemIconColorChildActiveHorizontal,d["--n-item-icon-color-child-active-hover-horizontal"]=a.itemIconColorChildActiveHoverHorizontal,d["--n-arrow-color"]=a.arrowColor,d["--n-arrow-color-hover"]=a.arrowColorHover,d["--n-arrow-color-active"]=a.arrowColorActive,d["--n-arrow-color-active-hover"]=a.arrowColorActiveHover,d["--n-arrow-color-child-active"]=a.arrowColorChildActive,d["--n-arrow-color-child-active-hover"]=a.arrowColorChildActiveHover,d["--n-item-color-hover"]=a.itemColorHover,d["--n-item-color-active"]=a.itemColorActive,d["--n-item-color-active-hover"]=a.itemColorActiveHover,d["--n-item-color-active-collapsed"]=a.itemColorActiveCollapsed),d}),$=t?me("menu",z(()=>e.inverted?"a":"b"),P,e):void 0,X=Vo(),G=E(null),fe=E(null);let V=!0;const Ee=()=>{var _;V?V=!1:(_=G.value)===null||_===void 0||_.sync({showAllItemsBeforeCalculate:!0})};function go(){return document.getElementById(X)}const se=E(-1);function bo(_){se.value=e.options.length-_}function xo(_){_||(se.value=-1)}const _o=z(()=>{const _=se.value;return{children:_===-1?[]:e.options.slice(_)}}),Co=z(()=>{const{childrenField:_,disabledField:R,keyField:a}=e;return be([_o.value],{getIgnored(y){return ke(y)},getChildren(y){return y[_]},getDisabled(y){return y[R]},getKey(y){var H;return(H=y[a])!==null&&H!==void 0?H:y.name}})}),yo=z(()=>be([{}]).treeNodes[0]);function wo(){var _;if(se.value===-1)return x(Re,{root:!0,level:0,key:"__ellpisisGroupPlaceholder__",internalKey:"__ellpisisGroupPlaceholder__",title:"···",tmNode:yo.value,domId:X,isEllipsisPlaceholder:!0});const R=Co.value.treeNodes[0],a=T.value,y=!!(!((_=R.children)===null||_===void 0)&&_.some(H=>a.includes(H.key)));return x(Re,{level:0,root:!0,key:"__ellpisisGroup__",internalKey:"__ellpisisGroup__",title:"···",virtualChildActive:y,tmNode:R,domId:X,rawNodes:R.rawNode.children||[],tmNodes:R.children||[],isEllipsisPlaceholder:!0})}return{mergedClsPrefix:o,controlledExpandedKeys:m,uncontrolledExpanededKeys:r,mergedExpandedKeys:p,uncontrolledValue:h,mergedValue:f,activePath:T,tmNodes:C,mergedTheme:l,mergedCollapsed:n,cssVars:t?void 0:P,themeClass:$==null?void 0:$.themeClass,overflowRef:G,counterRef:fe,updateCounter:()=>{},onResize:Ee,onUpdateOverflow:xo,onUpdateCount:bo,renderCounter:wo,getCounter:go,onRender:$==null?void 0:$.onRender,showOption:N,deriveResponsiveState:Ee}},render(){const{mergedClsPrefix:e,mode:o,themeClass:t,onRender:l}=this;l==null||l();const i=()=>this.tmNodes.map(c=>Me(c,this.$props)),s=o==="horizontal"&&this.responsive,u=()=>x("div",Do(this.$attrs,{role:o==="horizontal"?"menubar":"menu",class:[`${e}-menu`,t,`${e}-menu--${o}`,s&&`${e}-menu--responsive`,this.mergedCollapsed&&`${e}-menu--collapsed`],style:this.cssVars}),s?x(ct,{ref:"overflowRef",onUpdateOverflow:this.onUpdateOverflow,getCounter:this.getCounter,onUpdateCount:this.onUpdateCount,updateCounter:this.updateCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:i,counter:this.renderCounter}):i());return s?x(jo,{onResize:this.onResize},{default:u}):u()}}),Ft={__name:"BreadCrumb",setup(e){const o=le(),t=he();function l(n){n!==t.path&&o.push(n)}function i(n){return n!=null&&n.customIcon?lo(n.customIcon,{size:18}):n!=null&&n.icon?q(n.icon,{size:18}):null}return(n,s)=>{const u=xt,c=ft;return S(),B(c,null,{default:U(()=>[(S(!0),K(ie,null,Qe(I(t).matched.filter(h=>{var k;return!!((k=h.meta)!=null&&k.title)}),h=>(S(),B(u,{key:h.path,onClick:k=>l(h.path)},{default:U(()=>[(S(),B(oo(i(h.meta)))),eo(" "+ve(h.meta.title),1)]),_:2},1032,["onClick"]))),128))]),_:1})}}},jt={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"};function Kt(e,o){return S(),K("svg",jt,o[0]||(o[0]=[L("path",{fill:"currentColor",d:"M11 13h10v-2H11m0-2h10V7H11M3 3v2h18V3M3 21h18v-2H3m0-7l4 4V8m4 9h10v-2H11z"},null,-1)]))}const Vt={name:"mdi-format-indent-decrease",render:Kt},Dt={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"};function Ut(e,o){return S(),K("svg",Dt,o[0]||(o[0]=[L("path",{fill:"currentColor",d:"M11 13h10v-2H11m0-2h10V7H11M3 3v2h18V3M11 17h10v-2H11M3 8v8l4-4m-4 9h18v-2H3z"},null,-1)]))}const Wt={name:"mdi-format-indent-increase",render:Ut},Gt={__name:"MenuCollapse",setup(e){const o=ee();return(t,l)=>{const i=Wt,n=Vt,s=$e;return S(),B(s,{size:"20","cursor-pointer":"",title:t.$t(I(o).collapsed?"header.label_show_menu":"header.label_collapse_menu"),onClick:I(o).switchCollapsed},{default:U(()=>[I(o).collapsed?(S(),B(i,{key:0})):(S(),B(n,{key:1}))]),_:1},8,["title","onClick"])}}},qt={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"};function Yt(e,o){return S(),K("svg",qt,o[0]||(o[0]=[L("path",{fill:"currentColor",d:"m17.27 6.73l-4.24 10.13l-1.32-3.42l-.32-.83l-.82-.32l-3.43-1.33zM21 3L3 10.53v.97l6.84 2.66L12.5 21h.96z"},null,-1)]))}const Xt={name:"mdi-navigation-variant-outline",render:Yt},Zt={__name:"Preview",setup(e){function o(){window.open("/")}return(t,l)=>{const i=Xt,n=$e;return S(),B(n,{"mr-20":"",size:"18",style:{cursor:"pointer"},title:t.$t("header.label_preview"),onClick:o},{default:U(()=>[F(i)]),_:1},8,["title"])}}},Jt={flex:"","cursor-pointer":"","items-center":""},Qt=["src"],er={__name:"UserAvatar",setup(e){const{t:o}=Uo(),t=le(),l=Wo(),i=[{label:o("header.label_profile"),key:"profile",icon:q("mdi-account-arrow-right-outline",{size:"14px"})},{label:o("header.label_logout"),key:"logout",icon:q("mdi:exit-to-app",{size:"14px"})}];function n(s){s==="profile"?t.push("/admin/profile-section/profile"):s==="logout"&&$dialog.confirm({title:o("header.label_logout_dialog_title"),type:"warning",content:o("header.text_logout_confirm"),confirm(){l.logout(),$message.success(o("header.text_logout_success"))}})}return(s,u)=>{const c=Te;return S(),B(c,{options:i,onSelect:n},{default:U(()=>[L("div",Jt,[L("img",{src:I(l).avatar,mr10:"","h-35":"","w-35":"","rounded-full":""},null,8,Qt),L("span",null,ve(I(l).name),1)])]),_:1})}}},or={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"};function tr(e,o){return S(),K("svg",or,o[0]||(o[0]=[L("path",{fill:"currentColor",d:"m3.55 19.09l1.41 1.41l1.8-1.79l-1.42-1.42M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6c0-3.32-2.69-6-6-6m8 7h3v-2h-3m-2.76 7.71l1.8 1.79l1.41-1.41l-1.79-1.8M20.45 5l-1.41-1.4l-1.8 1.79l1.42 1.42M13 1h-2v3h2M6.76 5.39L4.96 3.6L3.55 5l1.79 1.81zM1 13h3v-2H1m12 9h-2v3h2"},null,-1)]))}const rr={name:"mdi-white-balance-sunny",render:tr},nr={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"};function ir(e,o){return S(),K("svg",nr,o[0]||(o[0]=[L("path",{fill:"currentColor",d:"M2 12a10 10 0 0 0 13 9.54a10 10 0 0 1 0-19.08A10 10 0 0 0 2 12"},null,-1)]))}const lr={name:"mdi-moon-waning-crescent",render:ir},ar={__name:"ThemeMode",setup(e){const o=ee(),t=Go(),l=()=>{o.toggleDark(),qo(t)()};return(i,n)=>{const s=lr,u=rr,c=$e;return S(),B(c,{"mr-20":"","cursor-pointer":"",size:"18",title:i.$t(I(t)?"header.label_lightmode":"header.label_darkmode"),onClick:l},{default:U(()=>[I(t)?(S(),B(s,{key:0})):(S(),B(u,{key:1}))]),_:1},8,["title"])}}},sr={class:"header-container","w-full":"",flex:"","items-center":"","justify-between":""},cr={flex:"","items-center":""},dr={"ml-auto":"",flex:"","items-center":""},ur={__name:"index",setup(e){return(o,t)=>(S(),K("div",sr,[L("div",cr,[F(Gt),F(Ft,{"ml-15":"",hidden:"","sm:block":""})]),L("div",dr,[F(Zt),F(ar),F(er)])]))}},mr={__name:"SideLogo",setup(e){var n,s,u,c;const o=ee(),t=Yo(),l=Ve((n=t.metaSetting)==null?void 0:n.site_name)?(s=t.metaSetting)==null?void 0:s.site_name:"欢迎访问",i=Ve((u=t.metaSetting)==null?void 0:u.bottom_icon)?(c=t.metaSetting)==null?void 0:c.bottom_icon:"/assets/favicon.png";return(h,k)=>{const f=at,r=to("router-link");return S(),B(r,{"h-60":"","f-c-c":"",to:"/admin/"},{default:U(()=>[F(f,{width:"25.6",src:I(i),class:"icon",style:{"border-radius":"30px","margin-right":"5px"}},null,8,["src"]),ro(L("h1",{"ml-2":"","mr-8":"","max-w-150":"","flex-shrink-0":"","text-16":"","font-bold":""},ve(I(l)),513),[[Xo,!I(o).collapsed]])]),_:1})}}},hr={__name:"SideMenu",setup(e){const o=le(),t=he(),l=Zo(),i=ee(),n=z(()=>{var r;return((r=t.meta)==null?void 0:r.activeMenu)||t.name}),s=z(()=>l.menus.map(r=>h(r)).sort((r,v)=>r.order-v.order)),u=E(null);ye(t,()=>ce(this,null,function*(){var r;yield we(),(r=u.value)==null||r.showOption()}));function c(r,v){return De(v)?v:"/"+[r,v].filter(m=>!!m&&m!=="/").map(m=>m.replace(/(^\/)|(\/$)/g,"")).join("/")}function h(r,v=""){var C,T;let m={label:r.meta&&r.meta.title||r.name,key:r.name,path:c(v,r.path),icon:k(r.meta),order:((C=r.meta)==null?void 0:C.order)||0};const p=r.children?r.children.filter(M=>M.name&&!M.isHidden):[];if(!p.length)return m;if(p.length===1){const M=p[0];m=je(Fe({},m),{label:((T=M.meta)==null?void 0:T.title)||M.name,key:M.name,path:c(m.path,M.path),icon:k(M.meta)});const j=M.children?M.children.filter(O=>O.name&&!O.isHidden):[];j.length===1?m=h(j[0],m.path):j.length>1&&(m.children=j.map(O=>h(O,m.path)).sort((O,N)=>O.order-N.order))}else m.children=p.map(M=>h(M,m.path)).sort((M,j)=>M.order-j.order);return m}function k(r){return r!=null&&r.customIcon?lo(r.customIcon,{size:18}):r!=null&&r.icon?q(r.icon,{size:18}):null}function f(r,v){De(v.path)?window.open(v.path):v.path===t.path?i.reloadPage():o.push(v.path)}return(r,v)=>{const m=Lt;return S(),B(m,{ref_key:"menu",ref:u,class:"side-menu",accordion:"",indent:18,"collapsed-icon-size":22,"collapsed-width":64,options:I(s),value:I(n),"default-expanded-keys":["内容管理","系统管理"],"onUpdate:value":f},null,8,["options","value"])}}},vr={__name:"index",setup(e){return(o,t)=>(S(),K(ie,null,[F(mr),F(hr)],64))}},pr={__name:"AppMain",setup(e){const o=ee(),l=le().getRoutes(),i=z(()=>l.filter(n=>{var s;return(s=n.meta)==null?void 0:s.keepAlive}).map(n=>n.name));return(n,s)=>{const u=to("router-view");return S(),B(u,null,{default:U(({Component:c,route:h})=>[(S(),B(Jo,{include:I(i)},[I(o).reloadFlag?(S(),B(oo(c),{key:I(o).aliveKeys[h.name]||h.fullPath})):pe("",!0)],1032,["include"]))]),_:1})}}},fr={__name:"ContextMenu",props:{show:{type:Boolean,default:!1},currentPath:{type:String,default:""},x:{type:Number,default:0},y:{type:Number,default:0}},emits:["update:show"],setup(e,{emit:o}){const t=e,l=o,i=no(),n=ee(),s=z(()=>[{label:"重新加载",key:"reload",disabled:t.currentPath!==i.activeTag,icon:q("mdi:refresh",{size:"14px"})},{label:"关闭",key:"close",disabled:i.tags.length<=1,icon:q("mdi:close",{size:"14px"})},{label:"关闭其他",key:"close-other",disabled:i.tags.length<=1,icon:q("mdi:arrow-expand-horizontal",{size:"14px"})},{label:"关闭左侧",key:"close-left",disabled:i.tags.length<=1||t.currentPath===i.tags[0].path,icon:q("mdi:arrow-expand-left",{size:"14px"})},{label:"关闭右侧",key:"close-right",disabled:i.tags.length<=1||t.currentPath===i.tags[i.tags.length-1].path,icon:q("mdi:arrow-expand-right",{size:"14px"})}]),u=he(),c=new Map([["reload",()=>{var f;(f=u.meta)!=null&&f.keepAlive&&n.setAliveKeys(u.name,+new Date),n.reloadPage()}],["close",()=>{i.removeTag(t.currentPath)}],["close-other",()=>{i.removeOther(t.currentPath)}],["close-left",()=>{i.removeLeft(t.currentPath)}],["close-right",()=>{i.removeRight(t.currentPath)}]]);function h(){l("update:show",!1)}function k(f){const r=c.get(f);r&&r(),h()}return(f,r)=>{const v=Te;return S(),B(v,{show:e.show,options:I(s),x:e.x,y:e.y,placement:"bottom-start",onClickoutside:h,onSelect:k},null,8,["show","options","x","y"])}}},gr={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"};function br(e,o){return S(),K("svg",gr,o[0]||(o[0]=[L("path",{fill:"currentColor",d:"M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z"},null,-1)]))}const xr={name:"ic-baseline-keyboard-arrow-right",render:br},_r={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"};function Cr(e,o){return S(),K("svg",_r,o[0]||(o[0]=[L("path",{fill:"currentColor",d:"M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6l6 6z"},null,-1)]))}const yr={name:"ic-baseline-keyboard-arrow-left",render:Cr},wr={__name:"ScrollX",props:{showArrow:{type:Boolean,default:!0}},setup(e,{expose:o}){const t=E(0),l=E(null),i=E(null),n=E(!1),s=Ue(()=>{var v,m;const f=(v=i.value)==null?void 0:v.offsetWidth,r=(m=l.value)==null?void 0:m.offsetWidth;n.value=r>f,c(f,r)},200);function u(f){var p,C;const{wheelDelta:r}=f,v=(p=i.value)==null?void 0:p.offsetWidth,m=(C=l.value)==null?void 0:C.offsetWidth;r<0&&(v>m&&t.value<-10||v<=m&&m+t.value-v<-10)||r>0&&t.value>10||(t.value+=r,c(v,m))}const c=Ue(function(f,r){n.value?-t.value>r-f?t.value=f-r:t.value>0&&(t.value=0):t.value=0},200),h=E(null);Ye(()=>{s(),h.value=Qo(document.body,s)}),et(()=>{var f;(f=h.value)==null||f.disconnect()});function k(f,r){var p,C;const v=(p=i.value)==null?void 0:p.offsetWidth,m=(C=l.value)==null?void 0:C.offsetWidth;m<=v||(f<-t.value+150&&(t.value=-(f-150),c(v,m)),f+r>-t.value+v&&(t.value=v-(f+r),c(v,m)))}return o({handleScroll:k}),(f,r)=>{const v=yr,m=xr,p=ot("resize");return S(),K("div",{ref_key:"wrapper",ref:i,class:"wrapper",onMousewheel:Se(u,["prevent"])},[e.showArrow&&I(n)?(S(),K(ie,{key:0},[L("div",{class:"left",onClick:r[0]||(r[0]=C=>u({wheelDelta:120}))},[F(v)]),L("div",{class:"right",onClick:r[1]||(r[1]=C=>u({wheelDelta:-120}))},[F(m)])],64)):pe("",!0),ro((S(),K("div",{ref_key:"content",ref:l,class:tt(["content",{overflow:I(n)&&e.showArrow}]),style:ze({transform:`translateX(${I(t)}px)`})},[rt(f.$slots,"default",{},void 0,!0)],6)),[[p,I(s)]])],544)}}},zr=mt(wr,[["__scopeId","data-v-aa7e0d6d"]]),Sr={__name:"index",setup(e){const o=he(),t=le(),l=no(),i=E([]),n=E(null),s=io({show:!1,x:0,y:0,currentPath:""});ye(()=>o.path,()=>{var p;const{name:r,fullPath:v}=o,m=(p=o.meta)==null?void 0:p.title;l.addTag({name:r,path:v,title:m})},{immediate:!0}),ye(()=>l.activeIndex,r=>ce(this,null,function*(){var C,T;yield we();const v=(C=i.value[r])==null?void 0:C.$el;if(!v)return;const{offsetLeft:m,offsetWidth:p}=v;(T=n.value)==null||T.handleScroll(m+p,p)}),{immediate:!0});const u=r=>{l.setActiveTag(r),t.push(r)};function c(){s.show=!0}function h(){s.show=!1}function k(r,v,m){Object.assign(s,{x:r,y:v,currentPath:m})}function f(r,v){return ce(this,null,function*(){const{clientX:m,clientY:p}=r;h(),k(m,p,v.path),yield we(),c()})}return(r,v)=>{const m=dt;return S(),B(zr,{ref_key:"scrollXRef",ref:n,class:"bg-white dark:bg-dark!"},{default:U(()=>[(S(!0),K(ie,null,Qe(I(l).tags,p=>(S(),B(m,{ref_for:!0,ref_key:"tabRefs",ref:i,key:p.path,class:"mx-5 cursor-pointer rounded-4 px-15 hover:color-primary",type:I(l).activeTag===p.path?"primary":"default",closable:I(l).tags.length>1,onClick:C=>u(p.path),onClose:Se(C=>I(l).removeTag(p.path),["stop"]),onContextmenu:Se(C=>f(C,p),["prevent"])},{default:U(()=>[eo(ve(p.title),1)]),_:2},1032,["type","closable","onClick","onClose","onContextmenu"]))),128)),I(s).show?(S(),B(fr,{key:0,show:I(s).show,"onUpdate:show":v[0]||(v[0]=p=>I(s).show=p),"current-path":I(s).currentPath,x:I(s).x,y:I(s).y},null,8,["show","current-path","x","y"])):pe("",!0)]),_:1},512)}}},Ir={"flex-col":"","flex-1":"","overflow-hidden":""},kr={key:0,hidden:"","border-b":"","bc-eee":"","sm:block":"","dark:border-0":""},Rr={"flex-1":"","overflow-hidden":"","bg-hex-f5f6fb":"","dark:bg-hex-101014":""},Kr={__name:"index",setup(e){const o=ee(),l=io(nt({xl:1600,lg:1199,md:991,sm:666,xs:575})),i=l.smaller("sm"),n=l.between("sm","md"),s=l.greater("md");return Ce(()=>{i.value&&(o.setCollapsed(!0),o.setFullScreen(!1)),n.value&&(o.setCollapsed(!0),o.setFullScreen(!1)),s.value&&(o.setCollapsed(!1),o.setFullScreen(!0))}),(u,c)=>{const h=Pt,k=zt;return S(),B(k,{"has-sider":"","wh-full":""},{default:U(()=>[F(h,{bordered:"","collapse-mode":"width","collapsed-width":64,width:220,"native-scrollbar":!1,collapsed:I(o).collapsed},{default:U(()=>[F(vr)]),_:1},8,["collapsed"]),L("article",Ir,[L("header",{class:"flex items-center border-b bg-white px-15 bc-eee",dark:"bg-dark border-0",style:ze(`height: ${I(it).height}px`)},[F(ur)],4),I(We).visible?(S(),K("section",kr,[F(Sr,{style:ze({height:`${I(We).height}px`})},null,8,["style"])])):pe("",!0),L("section",Rr,[F(pr)])])]),_:1})}}};export{Kr as default};
