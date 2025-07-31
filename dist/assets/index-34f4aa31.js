var ko=Object.defineProperty,Ro=Object.defineProperties;var $o=Object.getOwnPropertyDescriptors;var Ee=Object.getOwnPropertySymbols;var Po=Object.prototype.hasOwnProperty,To=Object.prototype.propertyIsEnumerable;var Oe=(e,t,o)=>t in e?ko(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,Fe=(e,t)=>{for(var o in t||(t={}))Po.call(t,o)&&Oe(e,o,t[o]);if(Ee)for(var o of Ee(t))To.call(t,o)&&Oe(e,o,t[o]);return e},je=(e,t)=>Ro(e,$o(t));var se=(e,t,o)=>new Promise((l,i)=>{var n=s=>{try{u(o.next(s))}catch(m){i(m)}},c=s=>{try{u(o.throw(s))}catch(m){i(m)}},u=s=>s.done?l(s.value):Promise.resolve(s.value).then(n,c);u((o=o.apply(e,t)).next())});import{d as D,h as x,c as b,a as w,b as A,e as g,u as ue,f as Z,g as Ao,p as J,t as ne,i as z,j as he,k as te,r as L,o as Ye,l as No,m as Bo,n as Y,q as Ho,s as Mo,v as Lo,w as Eo,x as Ke,y as Xe,N as Ze,z as Je,A as W,B as oe,F as ie,C as _e,D as Oo,E as ge,G as $e,H as re,I as Fo,J as jo,K as Ce,L as Ko,V as Vo,M as le,O as me,P as S,Q as H,R as U,S as K,T as Qe,U as I,W as eo,X as oo,Y as ve,Z as O,_ as ee,$ as F,a0 as Do,a1 as Uo,a2 as Wo,a3 as Go,a4 as qo,a5 as Ve,a6 as to,a7 as ro,a8 as Yo,a9 as Xo,aa as ye,ab as we,ac as De,ad as Zo,ae as pe,af as no,ag as Jo,ah as Qo,ai as et,aj as ot,ak as ze,al as tt,am as Se,an as Ue,ao as io,ap as rt,aq as nt,ar as We}from"./index-be94632c.js";import{r as lo,a as q,N as Pe}from"./icon-08752ca2.js";import{C as it,_ as Te}from"./Dropdown-8c0bb244.js";import{N as lt}from"./Image-501c0406.js";import{N as at}from"./Tooltip-ed686319.js";import{c as be,V as ct,_ as st}from"./Tag-ec2fced6.js";import{u as Ie}from"./use-locale-5356ed31.js";import{u as dt}from"./Popover-77560cbc.js";import{_ as ut}from"./_plugin-vue_export-helper-c27b6911.js";import{f as xe}from"./format-length-c9d165c6.js";const ht=D({name:"ChevronDownFilled",render(){return x("svg",{viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg"},x("path",{d:"M3.20041 5.73966C3.48226 5.43613 3.95681 5.41856 4.26034 5.70041L8 9.22652L11.7397 5.70041C12.0432 5.41856 12.5177 5.43613 12.7996 5.73966C13.0815 6.0432 13.0639 6.51775 12.7603 6.7996L8.51034 10.7996C8.22258 11.0668 7.77743 11.0668 7.48967 10.7996L3.23966 6.7996C2.93613 6.51775 2.91856 6.0432 3.20041 5.73966Z",fill:"currentColor"}))}}),mt=b("breadcrumb",`
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
 `)])])]),ao=te("n-breadcrumb"),vt=Object.assign(Object.assign({},Z.props),{separator:{type:String,default:"/"}}),pt=D({name:"Breadcrumb",props:vt,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:o}=ue(e),l=Z("Breadcrumb","-breadcrumb",mt,Ao,e,t);J(ao,{separatorRef:ne(e,"separator"),mergedClsPrefixRef:t});const i=z(()=>{const{common:{cubicBezierEaseInOut:c},self:{separatorColor:u,itemTextColor:s,itemTextColorHover:m,itemTextColorPressed:k,itemTextColorActive:f,fontSize:r,fontWeightActive:v,itemBorderRadius:h,itemColorHover:p,itemColorPressed:C,itemLineHeight:T}}=l.value;return{"--n-font-size":r,"--n-bezier":c,"--n-item-text-color":s,"--n-item-text-color-hover":m,"--n-item-text-color-pressed":k,"--n-item-text-color-active":f,"--n-separator-color":u,"--n-item-color-hover":p,"--n-item-color-pressed":C,"--n-item-border-radius":h,"--n-font-weight-active":v,"--n-item-line-height":T}}),n=o?he("breadcrumb",void 0,i,e):void 0;return{mergedClsPrefix:t,cssVars:o?void 0:i,themeClass:n==null?void 0:n.themeClass,onRender:n==null?void 0:n.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),x("nav",{class:[`${this.mergedClsPrefix}-breadcrumb`,this.themeClass],style:this.cssVars,"aria-label":"Breadcrumb"},x("ul",null,this.$slots))}}),ft=(e=Bo?window:null)=>{const t=()=>{const{hash:i,host:n,hostname:c,href:u,origin:s,pathname:m,port:k,protocol:f,search:r}=(e==null?void 0:e.location)||{};return{hash:i,host:n,hostname:c,href:u,origin:s,pathname:m,port:k,protocol:f,search:r}},o=()=>{l.value=t()},l=L(t());return Ye(()=>{e&&(e.addEventListener("popstate",o),e.addEventListener("hashchange",o))}),No(()=>{e&&(e.removeEventListener("popstate",o),e.removeEventListener("hashchange",o))}),l},gt={separator:String,href:String,clickable:{type:Boolean,default:!0},onClick:Function},bt=D({name:"BreadcrumbItem",props:gt,setup(e,{slots:t}){const o=Y(ao,null);if(!o)return()=>null;const{separatorRef:l,mergedClsPrefixRef:i}=o,n=ft(),c=z(()=>e.href?"a":"span"),u=z(()=>n.value.href===e.href?"location":null);return()=>{const{value:s}=i;return x("li",{class:[`${s}-breadcrumb-item`,e.clickable&&`${s}-breadcrumb-item--clickable`]},x(c.value,{class:`${s}-breadcrumb-item__link`,"aria-current":u.value,href:e.href,onClick:e.onClick},t),x("span",{class:`${s}-breadcrumb-item__separator`,"aria-hidden":"true"},Ho(t.separator,()=>{var m;return[(m=e.separator)!==null&&m!==void 0?m:l.value]})))}}}),xt=e=>{const{baseColor:t,textColor2:o,bodyColor:l,cardColor:i,dividerColor:n,actionColor:c,scrollbarColor:u,scrollbarColorHover:s,invertedColor:m}=e;return{textColor:o,textColorInverted:"#FFF",color:l,colorEmbedded:c,headerColor:i,headerColorInverted:m,footerColor:c,footerColorInverted:m,headerBorderColor:n,headerBorderColorInverted:m,footerBorderColor:n,footerBorderColorInverted:m,siderBorderColor:n,siderBorderColorInverted:m,siderColor:i,siderColorInverted:m,siderToggleButtonBorder:`1px solid ${n}`,siderToggleButtonColor:t,siderToggleButtonIconColor:o,siderToggleButtonIconColorInverted:o,siderToggleBarColor:Ke(l,u),siderToggleBarColorHover:Ke(l,s),__invertScrollbar:"true"}},_t=Mo({name:"Layout",common:Lo,peers:{Scrollbar:Eo},self:xt}),co=_t,so=te("n-layout-sider"),uo={type:String,default:"static"},Ct=b("layout",`
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
 `)]),yt={embedded:Boolean,position:uo,nativeScrollbar:{type:Boolean,default:!0},scrollbarProps:Object,onScroll:Function,contentClass:String,contentStyle:{type:[String,Object],default:""},hasSider:Boolean,siderPlacement:{type:String,default:"left"}},ho=te("n-layout");function wt(e){return D({name:e?"LayoutContent":"Layout",props:Object.assign(Object.assign({},Z.props),yt),setup(t){const o=L(null),l=L(null),{mergedClsPrefixRef:i,inlineThemeDisabled:n}=ue(t),c=Z("Layout","-layout",Ct,co,t,i);function u(p,C){if(t.nativeScrollbar){const{value:T}=o;T&&(C===void 0?T.scrollTo(p):T.scrollTo(p,C))}else{const{value:T}=l;T&&T.scrollTo(p,C)}}J(ho,t);let s=0,m=0;const k=p=>{var C;const T=p.target;s=T.scrollLeft,m=T.scrollTop,(C=t.onScroll)===null||C===void 0||C.call(t,p)};Xe(()=>{if(t.nativeScrollbar){const p=o.value;p&&(p.scrollTop=m,p.scrollLeft=s)}});const f={display:"flex",flexWrap:"nowrap",width:"100%",flexDirection:"row"},r={scrollTo:u},v=z(()=>{const{common:{cubicBezierEaseInOut:p},self:C}=c.value;return{"--n-bezier":p,"--n-color":t.embedded?C.colorEmbedded:C.color,"--n-text-color":C.textColor}}),h=n?he("layout",z(()=>t.embedded?"e":""),v,t):void 0;return Object.assign({mergedClsPrefix:i,scrollableElRef:o,scrollbarInstRef:l,hasSiderStyle:f,mergedTheme:c,handleNativeElScroll:k,cssVars:n?void 0:v,themeClass:h==null?void 0:h.themeClass,onRender:h==null?void 0:h.onRender},r)},render(){var t;const{mergedClsPrefix:o,hasSider:l}=this;(t=this.onRender)===null||t===void 0||t.call(this);const i=l?this.hasSiderStyle:void 0,n=[this.themeClass,e&&`${o}-layout-content`,`${o}-layout`,`${o}-layout--${this.position}-positioned`];return x("div",{class:n,style:this.cssVars},this.nativeScrollbar?x("div",{ref:"scrollableElRef",class:[`${o}-layout-scroll-container`,this.contentClass],style:[this.contentStyle,i],onScroll:this.handleNativeElScroll},this.$slots):x(Ze,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,contentClass:this.contentClass,contentStyle:[this.contentStyle,i]}),this.$slots))}})}const zt=wt(!1),St=b("layout-sider",`
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
 `)]),It=D({name:"LayoutToggleButton",props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return x("div",{class:`${e}-layout-toggle-button`,onClick:this.onClick},x(Je,{clsPrefix:e},{default:()=>x(it,null)}))}}),kt=D({props:{clsPrefix:{type:String,required:!0},onClick:Function},render(){const{clsPrefix:e}=this;return x("div",{onClick:this.onClick,class:`${e}-layout-toggle-bar`},x("div",{class:`${e}-layout-toggle-bar__top`}),x("div",{class:`${e}-layout-toggle-bar__bottom`}))}}),Rt={position:uo,bordered:Boolean,collapsedWidth:{type:Number,default:48},width:{type:[Number,String],default:272},contentClass:String,contentStyle:{type:[String,Object],default:""},collapseMode:{type:String,default:"transform"},collapsed:{type:Boolean,default:void 0},defaultCollapsed:Boolean,showCollapsedContent:{type:Boolean,default:!0},showTrigger:{type:[Boolean,String],default:!1},nativeScrollbar:{type:Boolean,default:!0},inverted:Boolean,scrollbarProps:Object,triggerClass:String,triggerStyle:[String,Object],collapsedTriggerClass:String,collapsedTriggerStyle:[String,Object],"onUpdate:collapsed":[Function,Array],onUpdateCollapsed:[Function,Array],onAfterEnter:Function,onAfterLeave:Function,onExpand:[Function,Array],onCollapse:[Function,Array],onScroll:Function},$t=D({name:"LayoutSider",props:Object.assign(Object.assign({},Z.props),Rt),setup(e){const t=Y(ho),o=L(null),l=L(null),i=z(()=>xe(s.value?e.collapsedWidth:e.width)),n=z(()=>e.collapseMode!=="transform"?{}:{minWidth:xe(e.width)}),c=z(()=>t?t.siderPlacement:"left"),u=L(e.defaultCollapsed),s=Ie(ne(e,"collapsed"),u);function m(N,$){if(e.nativeScrollbar){const{value:P}=o;P&&($===void 0?P.scrollTo(N):P.scrollTo(N,$))}else{const{value:P}=l;P&&P.scrollTo(N,$)}}function k(){const{"onUpdate:collapsed":N,onUpdateCollapsed:$,onExpand:P,onCollapse:X}=e,{value:G}=s;$&&W($,!G),N&&W(N,!G),u.value=!G,G?P&&W(P):X&&W(X)}let f=0,r=0;const v=N=>{var $;const P=N.target;f=P.scrollLeft,r=P.scrollTop,($=e.onScroll)===null||$===void 0||$.call(e,N)};Xe(()=>{if(e.nativeScrollbar){const N=o.value;N&&(N.scrollTop=r,N.scrollLeft=f)}}),J(so,{collapsedRef:s,collapseModeRef:ne(e,"collapseMode")});const{mergedClsPrefixRef:h,inlineThemeDisabled:p}=ue(e),C=Z("Layout","-layout-sider",St,co,e,h);function T(N){var $,P;N.propertyName==="max-width"&&(s.value?($=e.onAfterLeave)===null||$===void 0||$.call(e):(P=e.onAfterEnter)===null||P===void 0||P.call(e))}const M={scrollTo:m},j=z(()=>{const{common:{cubicBezierEaseInOut:N},self:$}=C.value,{siderToggleButtonColor:P,siderToggleButtonBorder:X,siderToggleBarColor:G,siderToggleBarColorHover:fe}=$,V={"--n-bezier":N,"--n-toggle-button-color":P,"--n-toggle-button-border":X,"--n-toggle-bar-color":G,"--n-toggle-bar-color-hover":fe};return e.inverted?(V["--n-color"]=$.siderColorInverted,V["--n-text-color"]=$.textColorInverted,V["--n-border-color"]=$.siderBorderColorInverted,V["--n-toggle-button-icon-color"]=$.siderToggleButtonIconColorInverted,V.__invertScrollbar=$.__invertScrollbar):(V["--n-color"]=$.siderColor,V["--n-text-color"]=$.textColor,V["--n-border-color"]=$.siderBorderColor,V["--n-toggle-button-icon-color"]=$.siderToggleButtonIconColor),V}),E=p?he("layout-sider",z(()=>e.inverted?"a":"b"),j,e):void 0;return Object.assign({scrollableElRef:o,scrollbarInstRef:l,mergedClsPrefix:h,mergedTheme:C,styleMaxWidth:i,mergedCollapsed:s,scrollContainerStyle:n,siderPlacement:c,handleNativeElScroll:v,handleTransitionend:T,handleTriggerClick:k,inlineThemeDisabled:p,cssVars:j,themeClass:E==null?void 0:E.themeClass,onRender:E==null?void 0:E.onRender},M)},render(){var e;const{mergedClsPrefix:t,mergedCollapsed:o,showTrigger:l}=this;return(e=this.onRender)===null||e===void 0||e.call(this),x("aside",{class:[`${t}-layout-sider`,this.themeClass,`${t}-layout-sider--${this.position}-positioned`,`${t}-layout-sider--${this.siderPlacement}-placement`,this.bordered&&`${t}-layout-sider--bordered`,o&&`${t}-layout-sider--collapsed`,(!o||this.showCollapsedContent)&&`${t}-layout-sider--show-content`],onTransitionend:this.handleTransitionend,style:[this.inlineThemeDisabled?void 0:this.cssVars,{maxWidth:this.styleMaxWidth,width:xe(this.width)}]},this.nativeScrollbar?x("div",{class:[`${t}-layout-sider-scroll-container`,this.contentClass],onScroll:this.handleNativeElScroll,style:[this.scrollContainerStyle,{overflow:"auto"},this.contentStyle],ref:"scrollableElRef"},this.$slots):x(Ze,Object.assign({},this.scrollbarProps,{onScroll:this.onScroll,ref:"scrollbarInstRef",style:this.scrollContainerStyle,contentStyle:this.contentStyle,contentClass:this.contentClass,theme:this.mergedTheme.peers.Scrollbar,themeOverrides:this.mergedTheme.peerOverrides.Scrollbar,builtinThemeOverrides:this.inverted&&this.cssVars.__invertScrollbar==="true"?{colorHover:"rgba(255, 255, 255, .4)",color:"rgba(255, 255, 255, .3)"}:void 0}),this.$slots),l?l==="bar"?x(kt,{clsPrefix:t,class:o?this.collapsedTriggerClass:this.triggerClass,style:o?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):x(It,{clsPrefix:t,class:o?this.collapsedTriggerClass:this.triggerClass,style:o?this.collapsedTriggerStyle:this.triggerStyle,onClick:this.handleTriggerClick}):null,this.bordered?x("div",{class:`${t}-layout-sider__border`}):null)}}),ae=te("n-menu"),Ae=te("n-submenu"),Ne=te("n-menu-item-group"),de=8;function Be(e){const t=Y(ae),{props:o,mergedCollapsedRef:l}=t,i=Y(Ae,null),n=Y(Ne,null),c=z(()=>o.mode==="horizontal"),u=z(()=>c.value?o.dropdownPlacement:"tmNodes"in e?"right-start":"right"),s=z(()=>{var r;return Math.max((r=o.collapsedIconSize)!==null&&r!==void 0?r:o.iconSize,o.iconSize)}),m=z(()=>{var r;return!c.value&&e.root&&l.value&&(r=o.collapsedIconSize)!==null&&r!==void 0?r:o.iconSize}),k=z(()=>{if(c.value||c.value)return;const{collapsedWidth:r,indent:v,rootIndent:h}=o,{root:p,isGroup:C}=e,T=h===void 0?v:h;return p?l.value?r/2-s.value/2:T:n&&typeof n.paddingLeftRef.value=="number"?v/2+n.paddingLeftRef.value:i&&typeof i.paddingLeftRef.value=="number"?(C?v/2:v)+i.paddingLeftRef.value:0}),f=z(()=>{const{collapsedWidth:r,indent:v,rootIndent:h}=o,{value:p}=s,{root:C}=e;return c.value||!C||!l.value?de:(h===void 0?v:h)+p+de-(r+p)/2});return{dropdownPlacement:u,activeIconSize:m,maxIconSize:s,paddingLeft:k,iconMarginRight:f,NMenu:t,NSubmenu:i}}const He={internalKey:{type:[String,Number],required:!0},root:Boolean,isGroup:Boolean,level:{type:Number,required:!0},title:[String,Function],extra:[String,Function]},mo=Object.assign(Object.assign({},He),{tmNode:{type:Object,required:!0},tmNodes:{type:Array,required:!0}}),Pt=D({name:"MenuOptionGroup",props:mo,setup(e){J(Ae,null);const t=Be(e);J(Ne,{paddingLeftRef:t.paddingLeft});const{mergedClsPrefixRef:o,props:l}=Y(ae);return function(){const{value:i}=o,n=t.paddingLeft.value,{nodeProps:c}=l,u=c==null?void 0:c(e.tmNode.rawNode);return x("div",{class:`${i}-menu-item-group`,role:"group"},x("div",Object.assign({},u,{class:[`${i}-menu-item-group-title`,u==null?void 0:u.class],style:[(u==null?void 0:u.style)||"",n!==void 0?`padding-left: ${n}px;`:""]}),oe(e.title),e.extra?x(ie,null," ",oe(e.extra)):null),x("div",null,e.tmNodes.map(s=>Me(s,l))))}}}),vo=D({name:"MenuOptionContent",props:{collapsed:Boolean,disabled:Boolean,title:[String,Function],icon:Function,extra:[String,Function],showArrow:Boolean,childActive:Boolean,hover:Boolean,paddingLeft:Number,selected:Boolean,maxIconSize:{type:Number,required:!0},activeIconSize:{type:Number,required:!0},iconMarginRight:{type:Number,required:!0},clsPrefix:{type:String,required:!0},onClick:Function,tmNode:{type:Object,required:!0},isEllipsisPlaceholder:Boolean},setup(e){const{props:t}=Y(ae);return{menuProps:t,style:z(()=>{const{paddingLeft:o}=e;return{paddingLeft:o&&`${o}px`}}),iconStyle:z(()=>{const{maxIconSize:o,activeIconSize:l,iconMarginRight:i}=e;return{width:`${o}px`,height:`${o}px`,fontSize:`${l}px`,marginRight:`${i}px`}})}},render(){const{clsPrefix:e,tmNode:t,menuProps:{renderIcon:o,renderLabel:l,renderExtra:i,expandIcon:n}}=this,c=o?o(t.rawNode):oe(this.icon);return x("div",{onClick:u=>{var s;(s=this.onClick)===null||s===void 0||s.call(this,u)},role:"none",class:[`${e}-menu-item-content`,{[`${e}-menu-item-content--selected`]:this.selected,[`${e}-menu-item-content--collapsed`]:this.collapsed,[`${e}-menu-item-content--child-active`]:this.childActive,[`${e}-menu-item-content--disabled`]:this.disabled,[`${e}-menu-item-content--hover`]:this.hover}],style:this.style},c&&x("div",{class:`${e}-menu-item-content__icon`,style:this.iconStyle,role:"none"},[c]),x("div",{class:`${e}-menu-item-content-header`,role:"none"},this.isEllipsisPlaceholder?this.title:l?l(t.rawNode):oe(this.title),this.extra||i?x("span",{class:`${e}-menu-item-content-header__extra`}," ",i?i(t.rawNode):oe(this.extra)):null),this.showArrow?x(Je,{ariaHidden:!0,class:`${e}-menu-item-content__arrow`,clsPrefix:e},{default:()=>n?n(t.rawNode):x(ht,null)}):null)}}),po=Object.assign(Object.assign({},He),{rawNodes:{type:Array,default:()=>[]},tmNodes:{type:Array,default:()=>[]},tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function,domId:String,virtualChildActive:{type:Boolean,default:void 0},isEllipsisPlaceholder:Boolean}),ke=D({name:"Submenu",props:po,setup(e){const t=Be(e),{NMenu:o,NSubmenu:l}=t,{props:i,mergedCollapsedRef:n,mergedThemeRef:c}=o,u=z(()=>{const{disabled:r}=e;return l!=null&&l.mergedDisabledRef.value||i.disabled?!0:r}),s=L(!1);J(Ae,{paddingLeftRef:t.paddingLeft,mergedDisabledRef:u}),J(Ne,null);function m(){const{onClick:r}=e;r&&r()}function k(){u.value||(n.value||o.toggleExpand(e.internalKey),m())}function f(r){s.value=r}return{menuProps:i,mergedTheme:c,doSelect:o.doSelect,inverted:o.invertedRef,isHorizontal:o.isHorizontalRef,mergedClsPrefix:o.mergedClsPrefixRef,maxIconSize:t.maxIconSize,activeIconSize:t.activeIconSize,iconMarginRight:t.iconMarginRight,dropdownPlacement:t.dropdownPlacement,dropdownShow:s,paddingLeft:t.paddingLeft,mergedDisabled:u,mergedValue:o.mergedValueRef,childActive:_e(()=>{var r;return(r=e.virtualChildActive)!==null&&r!==void 0?r:o.activePathRef.value.includes(e.internalKey)}),collapsed:z(()=>i.mode==="horizontal"?!1:n.value?!0:!o.mergedExpandedKeysRef.value.includes(e.internalKey)),dropdownEnabled:z(()=>!u.value&&(i.mode==="horizontal"||n.value)),handlePopoverShowChange:f,handleClick:k}},render(){var e;const{mergedClsPrefix:t,menuProps:{renderIcon:o,renderLabel:l}}=this,i=()=>{const{isHorizontal:c,paddingLeft:u,collapsed:s,mergedDisabled:m,maxIconSize:k,activeIconSize:f,title:r,childActive:v,icon:h,handleClick:p,menuProps:{nodeProps:C},dropdownShow:T,iconMarginRight:M,tmNode:j,mergedClsPrefix:E,isEllipsisPlaceholder:N,extra:$}=this,P=C==null?void 0:C(j.rawNode);return x("div",Object.assign({},P,{class:[`${E}-menu-item`,P==null?void 0:P.class],role:"menuitem"}),x(vo,{tmNode:j,paddingLeft:u,collapsed:s,disabled:m,iconMarginRight:M,maxIconSize:k,activeIconSize:f,title:r,extra:$,showArrow:!c,childActive:v,clsPrefix:E,icon:h,hover:T,onClick:p,isEllipsisPlaceholder:N}))},n=()=>x(Oo,null,{default:()=>{const{tmNodes:c,collapsed:u}=this;return u?null:x("div",{class:`${t}-submenu-children`,role:"menu"},c.map(s=>Me(s,this.menuProps)))}});return this.root?x(Te,Object.assign({size:"large",trigger:"hover"},(e=this.menuProps)===null||e===void 0?void 0:e.dropdownProps,{themeOverrides:this.mergedTheme.peerOverrides.Dropdown,theme:this.mergedTheme.peers.Dropdown,builtinThemeOverrides:{fontSizeLarge:"14px",optionIconSizeLarge:"18px"},value:this.mergedValue,disabled:!this.dropdownEnabled,placement:this.dropdownPlacement,keyField:this.menuProps.keyField,labelField:this.menuProps.labelField,childrenField:this.menuProps.childrenField,onUpdateShow:this.handlePopoverShowChange,options:this.rawNodes,onSelect:this.doSelect,inverted:this.inverted,renderIcon:o,renderLabel:l}),{default:()=>x("div",{class:`${t}-submenu`,role:"menuitem","aria-expanded":!this.collapsed,id:this.domId},i(),this.isHorizontal?null:n())}):x("div",{class:`${t}-submenu`,role:"menuitem","aria-expanded":!this.collapsed,id:this.domId},i(),n())}}),fo=Object.assign(Object.assign({},He),{tmNode:{type:Object,required:!0},disabled:Boolean,icon:Function,onClick:Function}),Tt=D({name:"MenuOption",props:fo,setup(e){const t=Be(e),{NSubmenu:o,NMenu:l}=t,{props:i,mergedClsPrefixRef:n,mergedCollapsedRef:c}=l,u=o?o.mergedDisabledRef:{value:!1},s=z(()=>u.value||e.disabled);function m(f){const{onClick:r}=e;r&&r(f)}function k(f){s.value||(l.doSelect(e.internalKey,e.tmNode.rawNode),m(f))}return{mergedClsPrefix:n,dropdownPlacement:t.dropdownPlacement,paddingLeft:t.paddingLeft,iconMarginRight:t.iconMarginRight,maxIconSize:t.maxIconSize,activeIconSize:t.activeIconSize,mergedTheme:l.mergedThemeRef,menuProps:i,dropdownEnabled:_e(()=>e.root&&c.value&&i.mode!=="horizontal"&&!s.value),selected:_e(()=>l.mergedValueRef.value===e.internalKey),mergedDisabled:s,handleClick:k}},render(){const{mergedClsPrefix:e,mergedTheme:t,tmNode:o,menuProps:{renderLabel:l,nodeProps:i}}=this,n=i==null?void 0:i(o.rawNode);return x("div",Object.assign({},n,{role:"menuitem",class:[`${e}-menu-item`,n==null?void 0:n.class]}),x(at,{theme:t.peers.Tooltip,themeOverrides:t.peerOverrides.Tooltip,trigger:"hover",placement:this.dropdownPlacement,disabled:!this.dropdownEnabled||this.title===void 0,internalExtraClass:["menu-tooltip"]},{default:()=>l?l(o.rawNode):oe(this.title),trigger:()=>x(vo,{tmNode:o,clsPrefix:e,paddingLeft:this.paddingLeft,iconMarginRight:this.iconMarginRight,maxIconSize:this.maxIconSize,activeIconSize:this.activeIconSize,selected:this.selected,title:this.title,extra:this.extra,disabled:this.mergedDisabled,icon:this.icon,onClick:this.handleClick})}))}}),At=D({name:"MenuDivider",setup(){const e=Y(ae),{mergedClsPrefixRef:t,isHorizontalRef:o}=e;return()=>o.value?null:x("div",{class:`${t.value}-menu-divider`})}}),Nt=$e(mo),Bt=$e(fo),Ht=$e(po);function Re(e){return e.type==="divider"||e.type==="render"}function Mt(e){return e.type==="divider"}function Me(e,t){const{rawNode:o}=e,{show:l}=o;if(l===!1)return null;if(Re(o))return Mt(o)?x(At,Object.assign({key:e.key},o.props)):null;const{labelField:i}=t,{key:n,level:c,isGroup:u}=e,s=Object.assign(Object.assign({},o),{title:o.title||o[i],extra:o.titleExtra||o.extra,key:n,internalKey:n,level:c,root:c===0,isGroup:u});return e.children?e.isGroup?x(Pt,ge(s,Nt,{tmNode:e,tmNodes:e.children,key:n})):x(ke,ge(s,Ht,{key:n,rawNodes:o[t.childrenField],tmNodes:e.children,tmNode:e})):x(Tt,ge(s,Bt,{key:n,tmNode:e}))}const Ge=[w("&::before","background-color: var(--n-item-color-hover);"),g("arrow",`
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
 `)])],Lt=w([b("menu",`
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
 `,[Fo({duration:".2s"})])]),b("menu-item-group",[b("menu-item-group-title",`
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
 `)]);function Q(e,t){return[A("hover",e,t),w("&:hover",e,t)]}const Et=Object.assign(Object.assign({},Z.props),{options:{type:Array,default:()=>[]},collapsed:{type:Boolean,default:void 0},collapsedWidth:{type:Number,default:48},iconSize:{type:Number,default:20},collapsedIconSize:{type:Number,default:24},rootIndent:Number,indent:{type:Number,default:32},labelField:{type:String,default:"label"},keyField:{type:String,default:"key"},childrenField:{type:String,default:"children"},disabledField:{type:String,default:"disabled"},defaultExpandAll:Boolean,defaultExpandedKeys:Array,expandedKeys:Array,value:[String,Number],defaultValue:{type:[String,Number],default:null},mode:{type:String,default:"vertical"},watchProps:{type:Array,default:void 0},disabled:Boolean,show:{type:Boolean,default:!0},inverted:Boolean,"onUpdate:expandedKeys":[Function,Array],onUpdateExpandedKeys:[Function,Array],onUpdateValue:[Function,Array],"onUpdate:value":[Function,Array],expandIcon:Function,renderIcon:Function,renderLabel:Function,renderExtra:Function,dropdownProps:Object,accordion:Boolean,nodeProps:Function,dropdownPlacement:{type:String,default:"bottom"},responsive:Boolean,items:Array,onOpenNamesChange:[Function,Array],onSelect:[Function,Array],onExpandedNamesChange:[Function,Array],expandedNames:Array,defaultExpandedNames:Array}),Ot=D({name:"Menu",props:Et,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:o}=ue(e),l=Z("Menu","-menu",Lt,jo,e,t),i=Y(so,null),n=z(()=>{var _;const{collapsed:R}=e;if(R!==void 0)return R;if(i){const{collapseModeRef:a,collapsedRef:y}=i;if(a.value==="width")return(_=y.value)!==null&&_!==void 0?_:!1}return!1}),c=z(()=>{const{keyField:_,childrenField:R,disabledField:a}=e;return be(e.items||e.options,{getIgnored(y){return Re(y)},getChildren(y){return y[R]},getDisabled(y){return y[a]},getKey(y){var B;return(B=y[_])!==null&&B!==void 0?B:y.name}})}),u=z(()=>new Set(c.value.treeNodes.map(_=>_.key))),{watchProps:s}=e,m=L(null);s!=null&&s.includes("defaultValue")?Ce(()=>{m.value=e.defaultValue}):m.value=e.defaultValue;const k=ne(e,"value"),f=Ie(k,m),r=L([]),v=()=>{r.value=e.defaultExpandAll?c.value.getNonLeafKeys():e.defaultExpandedNames||e.defaultExpandedKeys||c.value.getPath(f.value,{includeSelf:!1}).keyPath};s!=null&&s.includes("defaultExpandedKeys")?Ce(v):v();const h=dt(e,["expandedNames","expandedKeys"]),p=Ie(h,r),C=z(()=>c.value.treeNodes),T=z(()=>c.value.getPath(f.value).keyPath);J(ae,{props:e,mergedCollapsedRef:n,mergedThemeRef:l,mergedValueRef:f,mergedExpandedKeysRef:p,activePathRef:T,mergedClsPrefixRef:t,isHorizontalRef:z(()=>e.mode==="horizontal"),invertedRef:ne(e,"inverted"),doSelect:M,toggleExpand:E});function M(_,R){const{"onUpdate:value":a,onUpdateValue:y,onSelect:B}=e;y&&W(y,_,R),a&&W(a,_,R),B&&W(B,_,R),m.value=_}function j(_){const{"onUpdate:expandedKeys":R,onUpdateExpandedKeys:a,onExpandedNamesChange:y,onOpenNamesChange:B}=e;R&&W(R,_),a&&W(a,_),y&&W(y,_),B&&W(B,_),r.value=_}function E(_){const R=Array.from(p.value),a=R.findIndex(y=>y===_);if(~a)R.splice(a,1);else{if(e.accordion&&u.value.has(_)){const y=R.findIndex(B=>u.value.has(B));y>-1&&R.splice(y,1)}R.push(_)}j(R)}const N=_=>{const R=c.value.getPath(_!=null?_:f.value,{includeSelf:!1}).keyPath;if(!R.length)return;const a=Array.from(p.value),y=new Set([...a,...R]);e.accordion&&u.value.forEach(B=>{y.has(B)&&!R.includes(B)&&y.delete(B)}),j(Array.from(y))},$=z(()=>{const{inverted:_}=e,{common:{cubicBezierEaseInOut:R},self:a}=l.value,{borderRadius:y,borderColorHorizontal:B,fontSize:zo,itemHeight:So,dividerColor:Io}=a,d={"--n-divider-color":Io,"--n-bezier":R,"--n-font-size":zo,"--n-border-color-horizontal":B,"--n-border-radius":y,"--n-item-height":So};return _?(d["--n-group-text-color"]=a.groupTextColorInverted,d["--n-color"]=a.colorInverted,d["--n-item-text-color"]=a.itemTextColorInverted,d["--n-item-text-color-hover"]=a.itemTextColorHoverInverted,d["--n-item-text-color-active"]=a.itemTextColorActiveInverted,d["--n-item-text-color-child-active"]=a.itemTextColorChildActiveInverted,d["--n-item-text-color-child-active-hover"]=a.itemTextColorChildActiveInverted,d["--n-item-text-color-active-hover"]=a.itemTextColorActiveHoverInverted,d["--n-item-icon-color"]=a.itemIconColorInverted,d["--n-item-icon-color-hover"]=a.itemIconColorHoverInverted,d["--n-item-icon-color-active"]=a.itemIconColorActiveInverted,d["--n-item-icon-color-active-hover"]=a.itemIconColorActiveHoverInverted,d["--n-item-icon-color-child-active"]=a.itemIconColorChildActiveInverted,d["--n-item-icon-color-child-active-hover"]=a.itemIconColorChildActiveHoverInverted,d["--n-item-icon-color-collapsed"]=a.itemIconColorCollapsedInverted,d["--n-item-text-color-horizontal"]=a.itemTextColorHorizontalInverted,d["--n-item-text-color-hover-horizontal"]=a.itemTextColorHoverHorizontalInverted,d["--n-item-text-color-active-horizontal"]=a.itemTextColorActiveHorizontalInverted,d["--n-item-text-color-child-active-horizontal"]=a.itemTextColorChildActiveHorizontalInverted,d["--n-item-text-color-child-active-hover-horizontal"]=a.itemTextColorChildActiveHoverHorizontalInverted,d["--n-item-text-color-active-hover-horizontal"]=a.itemTextColorActiveHoverHorizontalInverted,d["--n-item-icon-color-horizontal"]=a.itemIconColorHorizontalInverted,d["--n-item-icon-color-hover-horizontal"]=a.itemIconColorHoverHorizontalInverted,d["--n-item-icon-color-active-horizontal"]=a.itemIconColorActiveHorizontalInverted,d["--n-item-icon-color-active-hover-horizontal"]=a.itemIconColorActiveHoverHorizontalInverted,d["--n-item-icon-color-child-active-horizontal"]=a.itemIconColorChildActiveHorizontalInverted,d["--n-item-icon-color-child-active-hover-horizontal"]=a.itemIconColorChildActiveHoverHorizontalInverted,d["--n-arrow-color"]=a.arrowColorInverted,d["--n-arrow-color-hover"]=a.arrowColorHoverInverted,d["--n-arrow-color-active"]=a.arrowColorActiveInverted,d["--n-arrow-color-active-hover"]=a.arrowColorActiveHoverInverted,d["--n-arrow-color-child-active"]=a.arrowColorChildActiveInverted,d["--n-arrow-color-child-active-hover"]=a.arrowColorChildActiveHoverInverted,d["--n-item-color-hover"]=a.itemColorHoverInverted,d["--n-item-color-active"]=a.itemColorActiveInverted,d["--n-item-color-active-hover"]=a.itemColorActiveHoverInverted,d["--n-item-color-active-collapsed"]=a.itemColorActiveCollapsedInverted):(d["--n-group-text-color"]=a.groupTextColor,d["--n-color"]=a.color,d["--n-item-text-color"]=a.itemTextColor,d["--n-item-text-color-hover"]=a.itemTextColorHover,d["--n-item-text-color-active"]=a.itemTextColorActive,d["--n-item-text-color-child-active"]=a.itemTextColorChildActive,d["--n-item-text-color-child-active-hover"]=a.itemTextColorChildActiveHover,d["--n-item-text-color-active-hover"]=a.itemTextColorActiveHover,d["--n-item-icon-color"]=a.itemIconColor,d["--n-item-icon-color-hover"]=a.itemIconColorHover,d["--n-item-icon-color-active"]=a.itemIconColorActive,d["--n-item-icon-color-active-hover"]=a.itemIconColorActiveHover,d["--n-item-icon-color-child-active"]=a.itemIconColorChildActive,d["--n-item-icon-color-child-active-hover"]=a.itemIconColorChildActiveHover,d["--n-item-icon-color-collapsed"]=a.itemIconColorCollapsed,d["--n-item-text-color-horizontal"]=a.itemTextColorHorizontal,d["--n-item-text-color-hover-horizontal"]=a.itemTextColorHoverHorizontal,d["--n-item-text-color-active-horizontal"]=a.itemTextColorActiveHorizontal,d["--n-item-text-color-child-active-horizontal"]=a.itemTextColorChildActiveHorizontal,d["--n-item-text-color-child-active-hover-horizontal"]=a.itemTextColorChildActiveHoverHorizontal,d["--n-item-text-color-active-hover-horizontal"]=a.itemTextColorActiveHoverHorizontal,d["--n-item-icon-color-horizontal"]=a.itemIconColorHorizontal,d["--n-item-icon-color-hover-horizontal"]=a.itemIconColorHoverHorizontal,d["--n-item-icon-color-active-horizontal"]=a.itemIconColorActiveHorizontal,d["--n-item-icon-color-active-hover-horizontal"]=a.itemIconColorActiveHoverHorizontal,d["--n-item-icon-color-child-active-horizontal"]=a.itemIconColorChildActiveHorizontal,d["--n-item-icon-color-child-active-hover-horizontal"]=a.itemIconColorChildActiveHoverHorizontal,d["--n-arrow-color"]=a.arrowColor,d["--n-arrow-color-hover"]=a.arrowColorHover,d["--n-arrow-color-active"]=a.arrowColorActive,d["--n-arrow-color-active-hover"]=a.arrowColorActiveHover,d["--n-arrow-color-child-active"]=a.arrowColorChildActive,d["--n-arrow-color-child-active-hover"]=a.arrowColorChildActiveHover,d["--n-item-color-hover"]=a.itemColorHover,d["--n-item-color-active"]=a.itemColorActive,d["--n-item-color-active-hover"]=a.itemColorActiveHover,d["--n-item-color-active-collapsed"]=a.itemColorActiveCollapsed),d}),P=o?he("menu",z(()=>e.inverted?"a":"b"),$,e):void 0,X=Ko(),G=L(null),fe=L(null);let V=!0;const Le=()=>{var _;V?V=!1:(_=G.value)===null||_===void 0||_.sync({showAllItemsBeforeCalculate:!0})};function go(){return document.getElementById(X)}const ce=L(-1);function bo(_){ce.value=e.options.length-_}function xo(_){_||(ce.value=-1)}const _o=z(()=>{const _=ce.value;return{children:_===-1?[]:e.options.slice(_)}}),Co=z(()=>{const{childrenField:_,disabledField:R,keyField:a}=e;return be([_o.value],{getIgnored(y){return Re(y)},getChildren(y){return y[_]},getDisabled(y){return y[R]},getKey(y){var B;return(B=y[a])!==null&&B!==void 0?B:y.name}})}),yo=z(()=>be([{}]).treeNodes[0]);function wo(){var _;if(ce.value===-1)return x(ke,{root:!0,level:0,key:"__ellpisisGroupPlaceholder__",internalKey:"__ellpisisGroupPlaceholder__",title:"···",tmNode:yo.value,domId:X,isEllipsisPlaceholder:!0});const R=Co.value.treeNodes[0],a=T.value,y=!!(!((_=R.children)===null||_===void 0)&&_.some(B=>a.includes(B.key)));return x(ke,{level:0,root:!0,key:"__ellpisisGroup__",internalKey:"__ellpisisGroup__",title:"···",virtualChildActive:y,tmNode:R,domId:X,rawNodes:R.rawNode.children||[],tmNodes:R.children||[],isEllipsisPlaceholder:!0})}return{mergedClsPrefix:t,controlledExpandedKeys:h,uncontrolledExpanededKeys:r,mergedExpandedKeys:p,uncontrolledValue:m,mergedValue:f,activePath:T,tmNodes:C,mergedTheme:l,mergedCollapsed:n,cssVars:o?void 0:$,themeClass:P==null?void 0:P.themeClass,overflowRef:G,counterRef:fe,updateCounter:()=>{},onResize:Le,onUpdateOverflow:xo,onUpdateCount:bo,renderCounter:wo,getCounter:go,onRender:P==null?void 0:P.onRender,showOption:N,deriveResponsiveState:Le}},render(){const{mergedClsPrefix:e,mode:t,themeClass:o,onRender:l}=this;l==null||l();const i=()=>this.tmNodes.map(s=>Me(s,this.$props)),c=t==="horizontal"&&this.responsive,u=()=>x("div",{role:t==="horizontal"?"menubar":"menu",class:[`${e}-menu`,o,`${e}-menu--${t}`,c&&`${e}-menu--responsive`,this.mergedCollapsed&&`${e}-menu--collapsed`],style:this.cssVars},c?x(ct,{ref:"overflowRef",onUpdateOverflow:this.onUpdateOverflow,getCounter:this.getCounter,onUpdateCount:this.onUpdateCount,updateCounter:this.updateCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:i,counter:this.renderCounter}):i());return c?x(Vo,{onResize:this.onResize},{default:u}):u()}}),Ft={__name:"BreadCrumb",setup(e){const t=le(),o=me();function l(n){n!==o.path&&t.push(n)}function i(n){return n!=null&&n.customIcon?lo(n.customIcon,{size:18}):n!=null&&n.icon?q(n.icon,{size:18}):null}return(n,c)=>{const u=bt,s=pt;return S(),H(s,null,{default:U(()=>[(S(!0),K(ie,null,Qe(I(o).matched.filter(m=>{var k;return!!((k=m.meta)!=null&&k.title)}),m=>(S(),H(u,{key:m.path,onClick:k=>l(m.path)},{default:U(()=>[(S(),H(eo(i(m.meta)))),oo(" "+ve(m.meta.title),1)]),_:2},1032,["onClick"]))),128))]),_:1})}}},jt={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"},Kt=O("path",{fill:"currentColor",d:"M11 13h10v-2H11m0-2h10V7H11M3 3v2h18V3M3 21h18v-2H3m0-7l4 4V8m4 9h10v-2H11z"},null,-1),Vt=[Kt];function Dt(e,t){return S(),K("svg",jt,[...Vt])}const Ut={name:"mdi-format-indent-decrease",render:Dt},Wt={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"},Gt=O("path",{fill:"currentColor",d:"M11 13h10v-2H11m0-2h10V7H11M3 3v2h18V3M11 17h10v-2H11M3 8v8l4-4m-4 9h18v-2H3z"},null,-1),qt=[Gt];function Yt(e,t){return S(),K("svg",Wt,[...qt])}const Xt={name:"mdi-format-indent-increase",render:Yt},Zt={__name:"MenuCollapse",setup(e){const t=ee();return(o,l)=>{const i=Xt,n=Ut,c=Pe;return S(),H(c,{size:"20","cursor-pointer":"",onClick:I(t).switchCollapsed,title:o.$t(I(t).collapsed?"header.label_show_menu":"header.label_collapse_menu")},{default:U(()=>[I(t).collapsed?(S(),H(i,{key:0})):(S(),H(n,{key:1}))]),_:1},8,["onClick","title"])}}},Jt={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"},Qt=O("path",{fill:"currentColor",d:"m17.27 6.73l-4.24 10.13l-1.32-3.42l-.32-.83l-.82-.32l-3.43-1.33zM21 3L3 10.53v.97l6.84 2.66L12.5 21h.96z"},null,-1),er=[Qt];function or(e,t){return S(),K("svg",Jt,[...er])}const tr={name:"mdi-navigation-variant-outline",render:or},rr={__name:"Preview",setup(e){function t(){window.open("/")}return(o,l)=>{const i=tr,n=Pe;return S(),H(n,{"mr-20":"",size:"18",style:{cursor:"pointer"},onClick:t,title:o.$t("header.label_preview")},{default:U(()=>[F(i)]),_:1},8,["title"])}}},nr={flex:"","cursor-pointer":"","items-center":""},ir=["src"],lr={__name:"UserAvatar",setup(e){const{t}=Do(),o=le(),l=Uo(),i=[{label:t("header.label_profile"),key:"profile",icon:q("mdi-account-arrow-right-outline",{size:"14px"})},{label:t("header.label_logout"),key:"logout",icon:q("mdi:exit-to-app",{size:"14px"})}];function n(c){c==="profile"?o.push("/admin/profile"):c==="logout"&&$dialog.confirm({title:t("header.label_logout_dialog_title"),type:"warning",content:t("header.text_logout_confirm"),confirm(){l.logout(),$message.success(t("header.text_logout_success"))}})}return(c,u)=>{const s=Te;return S(),H(s,{options:i,onSelect:n},{default:U(()=>[O("div",nr,[O("img",{src:I(l).avatar,mr10:"","h-35":"","w-35":"","rounded-full":""},null,8,ir),O("span",null,ve(I(l).name),1)])]),_:1})}}},ar={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"},cr=O("path",{fill:"currentColor",d:"m3.55 19.09l1.41 1.41l1.8-1.79l-1.42-1.42M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6c0-3.32-2.69-6-6-6m8 7h3v-2h-3m-2.76 7.71l1.8 1.79l1.41-1.41l-1.79-1.8M20.45 5l-1.41-1.4l-1.8 1.79l1.42 1.42M13 1h-2v3h2M6.76 5.39L4.96 3.6L3.55 5l1.79 1.81zM1 13h3v-2H1m12 9h-2v3h2"},null,-1),sr=[cr];function dr(e,t){return S(),K("svg",ar,[...sr])}const ur={name:"mdi-white-balance-sunny",render:dr},hr={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"},mr=O("path",{fill:"currentColor",d:"M2 12a10 10 0 0 0 13 9.54a10 10 0 0 1 0-19.08A10 10 0 0 0 2 12"},null,-1),vr=[mr];function pr(e,t){return S(),K("svg",hr,[...vr])}const fr={name:"mdi-moon-waning-crescent",render:pr},gr={__name:"ThemeMode",setup(e){const t=ee(),o=Wo(),l=()=>{t.toggleDark(),Go(o)()};return(i,n)=>{const c=fr,u=ur,s=Pe;return S(),H(s,{"mr-20":"","cursor-pointer":"",size:"18",onClick:l,title:i.$t(I(o)?"header.label_lightmode":"header.label_darkmode")},{default:U(()=>[I(o)?(S(),H(c,{key:0})):(S(),H(u,{key:1}))]),_:1},8,["title"])}}},br={class:"header-container",flex:"","items-center":"","justify-between":"","w-full":""},xr={flex:"","items-center":""},_r={"ml-auto":"",flex:"","items-center":""},Cr={__name:"index",setup(e){return(t,o)=>(S(),K("div",br,[O("div",xr,[F(Zt),F(Ft,{"ml-15":"",hidden:"","sm:block":""})]),O("div",_r,[F(rr),F(gr),F(lr)])]))}},yr={__name:"SideLogo",setup(e){var n,c,u,s;const t=ee(),o=qo(),l=Ve((n=o.metaSetting)==null?void 0:n.site_name)?(c=o.metaSetting)==null?void 0:c.site_name:"时光",i=Ve((u=o.metaSetting)==null?void 0:u.bottom_icon)?(s=o.metaSetting)==null?void 0:s.bottom_icon:"/assets/favicon.svg";return(m,k)=>{const f=lt,r=to("router-link");return S(),H(r,{"h-60":"","f-c-c":"",to:"/admin/"},{default:U(()=>[F(f,{width:"25.6",src:I(i),class:"icon",style:{"border-radius":"30px","margin-right":"5px"}},null,8,["src"]),ro(O("h1",{"ml-2":"","mr-8":"","max-w-150":"","flex-shrink-0":"","text-16":"","font-bold":""},ve(I(l)),513),[[Yo,!I(t).collapsed]])]),_:1})}}},wr={__name:"SideMenu",setup(e){const t=le(),o=me(),l=Xo(),i=ee(),n=z(()=>{var r;return((r=o.meta)==null?void 0:r.activeMenu)||o.name}),c=z(()=>l.menus.map(r=>m(r)).sort((r,v)=>r.order-v.order)),u=L(null);ye(o,()=>se(this,null,function*(){var r;yield we(),(r=u.value)==null||r.showOption()}));function s(r,v){return De(v)?v:"/"+[r,v].filter(h=>!!h&&h!=="/").map(h=>h.replace(/(^\/)|(\/$)/g,"")).join("/")}function m(r,v=""){var C,T;let h={label:r.meta&&r.meta.title||r.name,key:r.name,path:s(v,r.path),icon:k(r.meta),order:((C=r.meta)==null?void 0:C.order)||0};const p=r.children?r.children.filter(M=>M.name&&!M.isHidden):[];if(!p.length)return h;if(p.length===1){const M=p[0];h=je(Fe({},h),{label:((T=M.meta)==null?void 0:T.title)||M.name,key:M.name,path:s(h.path,M.path),icon:k(M.meta)});const j=M.children?M.children.filter(E=>E.name&&!E.isHidden):[];j.length===1?h=m(j[0],h.path):j.length>1&&(h.children=j.map(E=>m(E,h.path)).sort((E,N)=>E.order-N.order))}else h.children=p.map(M=>m(M,h.path)).sort((M,j)=>M.order-j.order);return h}function k(r){return r!=null&&r.customIcon?lo(r.customIcon,{size:18}):r!=null&&r.icon?q(r.icon,{size:18}):null}function f(r,v){De(v.path)?window.open(v.path):v.path===o.path?i.reloadPage():t.push(v.path)}return(r,v)=>{const h=Ot;return S(),H(h,{ref_key:"menu",ref:u,class:"side-menu",accordion:"",indent:18,"collapsed-icon-size":22,"collapsed-width":64,options:I(c),value:I(n),"onUpdate:value":f,"default-expanded-keys":["内容管理","系统管理"]},null,8,["options","value"])}}},zr={__name:"index",setup(e){return(t,o)=>(S(),K(ie,null,[F(yr),F(wr)],64))}},Sr={__name:"AppMain",setup(e){const t=ee(),l=le().getRoutes(),i=z(()=>l.filter(n=>{var c;return(c=n.meta)==null?void 0:c.keepAlive}).map(n=>n.name));return(n,c)=>{const u=to("router-view");return S(),H(u,null,{default:U(({Component:s,route:m})=>[(S(),H(Zo,{include:I(i)},[I(t).reloadFlag?(S(),H(eo(s),{key:I(t).aliveKeys[m.name]||m.fullPath})):pe("",!0)],1032,["include"]))]),_:1})}}},Ir={__name:"ContextMenu",props:{show:{type:Boolean,default:!1},currentPath:{type:String,default:""},x:{type:Number,default:0},y:{type:Number,default:0}},emits:["update:show"],setup(e,{emit:t}){const o=e,l=t,i=no(),n=ee(),c=z(()=>[{label:"重新加载",key:"reload",disabled:o.currentPath!==i.activeTag,icon:q("mdi:refresh",{size:"14px"})},{label:"关闭",key:"close",disabled:i.tags.length<=1,icon:q("mdi:close",{size:"14px"})},{label:"关闭其他",key:"close-other",disabled:i.tags.length<=1,icon:q("mdi:arrow-expand-horizontal",{size:"14px"})},{label:"关闭左侧",key:"close-left",disabled:i.tags.length<=1||o.currentPath===i.tags[0].path,icon:q("mdi:arrow-expand-left",{size:"14px"})},{label:"关闭右侧",key:"close-right",disabled:i.tags.length<=1||o.currentPath===i.tags[i.tags.length-1].path,icon:q("mdi:arrow-expand-right",{size:"14px"})}]),u=me(),s=new Map([["reload",()=>{var f;(f=u.meta)!=null&&f.keepAlive&&n.setAliveKeys(u.name,+new Date),n.reloadPage()}],["close",()=>{i.removeTag(o.currentPath)}],["close-other",()=>{i.removeOther(o.currentPath)}],["close-left",()=>{i.removeLeft(o.currentPath)}],["close-right",()=>{i.removeRight(o.currentPath)}]]);function m(){l("update:show",!1)}function k(f){const r=s.get(f);r&&r(),m()}return(f,r)=>{const v=Te;return S(),H(v,{show:e.show,options:I(c),x:e.x,y:e.y,placement:"bottom-start",onClickoutside:m,onSelect:k},null,8,["show","options","x","y"])}}},kr={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"},Rr=O("path",{fill:"currentColor",d:"M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6z"},null,-1),$r=[Rr];function Pr(e,t){return S(),K("svg",kr,[...$r])}const Tr={name:"ic-baseline-keyboard-arrow-right",render:Pr},Ar={class:"inline-block",viewBox:"0 0 24 24",width:"1em",height:"1em"},Nr=O("path",{fill:"currentColor",d:"M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6l6 6z"},null,-1),Br=[Nr];function Hr(e,t){return S(),K("svg",Ar,[...Br])}const Mr={name:"ic-baseline-keyboard-arrow-left",render:Hr},Lr={__name:"ScrollX",props:{showArrow:{type:Boolean,default:!0}},setup(e,{expose:t}){const o=L(0),l=L(null),i=L(null),n=L(!1),c=Ue(()=>{var v,h;const f=(v=i.value)==null?void 0:v.offsetWidth,r=(h=l.value)==null?void 0:h.offsetWidth;n.value=r>f,s(f,r)},200);function u(f){var p,C;const{wheelDelta:r}=f,v=(p=i.value)==null?void 0:p.offsetWidth,h=(C=l.value)==null?void 0:C.offsetWidth;r<0&&(v>h&&o.value<-10||v<=h&&h+o.value-v<-10)||r>0&&o.value>10||(o.value+=r,s(v,h))}const s=Ue(function(f,r){n.value?-o.value>r-f?o.value=f-r:o.value>0&&(o.value=0):o.value=0},200),m=L(null);Ye(()=>{c(),m.value=Jo(document.body,c)}),Qo(()=>{var f;(f=m.value)==null||f.disconnect()});function k(f,r){var p,C;const v=(p=i.value)==null?void 0:p.offsetWidth,h=(C=l.value)==null?void 0:C.offsetWidth;h<=v||(f<-o.value+150&&(o.value=-(f-150),s(v,h)),f+r>-o.value+v&&(o.value=v-(f+r),s(v,h)))}return t({handleScroll:k}),(f,r)=>{const v=Mr,h=Tr,p=et("resize");return S(),K("div",{ref_key:"wrapper",ref:i,class:"wrapper",onMousewheel:Se(u,["prevent"])},[e.showArrow&&I(n)?(S(),K(ie,{key:0},[O("div",{class:"left",onClick:r[0]||(r[0]=C=>u({wheelDelta:120}))},[F(v)]),O("div",{class:"right",onClick:r[1]||(r[1]=C=>u({wheelDelta:-120}))},[F(h)])],64)):pe("",!0),ro((S(),K("div",{ref_key:"content",ref:l,class:ot(["content",{overflow:I(n)&&e.showArrow}]),style:ze({transform:`translateX(${I(o)}px)`})},[tt(f.$slots,"default",{},void 0,!0)],6)),[[p,I(c)]])],544)}}},Er=ut(Lr,[["__scopeId","data-v-4a1a8c03"]]),Or={__name:"index",setup(e){const t=me(),o=le(),l=no(),i=L([]),n=L(null),c=io({show:!1,x:0,y:0,currentPath:""});ye(()=>t.path,()=>{var p;const{name:r,fullPath:v}=t,h=(p=t.meta)==null?void 0:p.title;l.addTag({name:r,path:v,title:h})},{immediate:!0}),ye(()=>l.activeIndex,r=>se(this,null,function*(){var C,T;yield we();const v=(C=i.value[r])==null?void 0:C.$el;if(!v)return;const{offsetLeft:h,offsetWidth:p}=v;(T=n.value)==null||T.handleScroll(h+p,p)}),{immediate:!0});const u=r=>{l.setActiveTag(r),o.push(r)};function s(){c.show=!0}function m(){c.show=!1}function k(r,v,h){Object.assign(c,{x:r,y:v,currentPath:h})}function f(r,v){return se(this,null,function*(){const{clientX:h,clientY:p}=r;m(),k(h,p,v.path),yield we(),s()})}return(r,v)=>{const h=st;return S(),H(Er,{ref_key:"scrollXRef",ref:n,class:"bg-white dark:bg-dark!"},{default:U(()=>[(S(!0),K(ie,null,Qe(I(l).tags,p=>(S(),H(h,{ref_for:!0,ref_key:"tabRefs",ref:i,key:p.path,class:"mx-5 cursor-pointer rounded-4 px-15 hover:color-primary",type:I(l).activeTag===p.path?"primary":"default",closable:I(l).tags.length>1,onClick:C=>u(p.path),onClose:Se(C=>I(l).removeTag(p.path),["stop"]),onContextmenu:Se(C=>f(C,p),["prevent"])},{default:U(()=>[oo(ve(p.title),1)]),_:2},1032,["type","closable","onClick","onClose","onContextmenu"]))),128)),I(c).show?(S(),H(Ir,{key:0,show:I(c).show,"onUpdate:show":v[0]||(v[0]=p=>I(c).show=p),"current-path":I(c).currentPath,x:I(c).x,y:I(c).y},null,8,["show","current-path","x","y"])):pe("",!0)]),_:1},512)}}},Fr={"flex-col":"","flex-1":"","overflow-hidden":""},jr={key:0,hidden:"","border-b":"","bc-eee":"","sm:block":"","dark:border-0":""},Kr={"flex-1":"","overflow-hidden":"","bg-hex-f5f6fb":"","dark:bg-hex-101014":""},en={__name:"index",setup(e){const t=ee(),l=io(rt({xl:1600,lg:1199,md:991,sm:666,xs:575})),i=l.smaller("sm"),n=l.between("sm","md"),c=l.greater("md");return Ce(()=>{i.value&&(t.setCollapsed(!0),t.setFullScreen(!1)),n.value&&(t.setCollapsed(!0),t.setFullScreen(!1)),c.value&&(t.setCollapsed(!1),t.setFullScreen(!0))}),(u,s)=>{const m=$t,k=zt;return S(),H(k,{"has-sider":"","wh-full":""},{default:U(()=>[F(m,{bordered:"","collapse-mode":"width","collapsed-width":64,width:220,"native-scrollbar":!1,collapsed:I(t).collapsed},{default:U(()=>[F(zr)]),_:1},8,["collapsed"]),O("article",Fr,[O("header",{class:"flex items-center border-b bg-white px-15 bc-eee",dark:"bg-dark border-0",style:ze(`height: ${I(nt).height}px`)},[F(Cr)],4),I(We).visible?(S(),K("section",jr,[F(Or,{style:ze({height:`${I(We).height}px`})},null,8,["style"])])):pe("",!0),O("section",Kr,[F(Sr)])])]),_:1})}}};export{en as default};
