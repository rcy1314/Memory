var Et=Object.defineProperty,kt=Object.defineProperties;var At=Object.getOwnPropertyDescriptors;var Ee=Object.getOwnPropertySymbols;var jt=Object.prototype.hasOwnProperty,It=Object.prototype.propertyIsEnumerable;var ke=(e,r,n)=>r in e?Et(e,r,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[r]=n,be=(e,r)=>{for(var n in r||(r={}))jt.call(r,n)&&ke(e,n,r[n]);if(Ee)for(var n of Ee(r))It.call(r,n)&&ke(e,n,r[n]);return e},pe=(e,r)=>kt(e,At(r));var J=(e,r,n)=>new Promise((g,i)=>{var _=m=>{try{h(n.next(m))}catch(x){i(x)}},f=m=>{try{h(n.throw(m))}catch(x){i(x)}},h=m=>m.done?g(m.value):Promise.resolve(m.value).then(_,f);h((n=n.apply(e,r)).next())});import{d as le,h as v,r as W,aJ as Ft,aK as Ot,aL as ie,aM as Nt,f as Ht,n as Xe,aN as Mt,L as Dt,C as Ut,F as Vt,N as qt,aO as Xt,j as se,aP as Gt,c as o,e as c,a as T,b as E,A as Kt,aQ as ue,aE as Ae,V as ve,u as Yt,g as Ge,aR as Jt,ab as ge,o as Qt,p as Zt,t as H,J as ea,aS as M,aT as re,k as ta,aU as aa,a8 as ra,av as oa,aV as na,ac as he,a9 as sa,z as oe,a5 as ia,a1 as la,a2 as da,P as me,R as I,Q as xe,a0 as z,W as C,_ as ca,af as je,az as ne,aH as ye,X as we,Z as Ie}from"./index-ON-SflwH.js";import{_ as fa}from"./CommonPage-Dj5qqsUj.js";import{_ as ba}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{A as pa}from"./Add-CAjrcp6O.js";import{c as Fe,a as ua,u as Oe,o as va}from"./Popover-DLxopjSP.js";import{u as ga}from"./use-locale-gdUNdwpT.js";import{N as Ne,a as Q}from"./FormItem-CFjxQbHB.js";import{N as Z}from"./Input-Ck59uIzx.js";import{N as ha}from"./Upload-CpsjnSDw.js";import{N as ma}from"./Image-1TDPnt6y.js";import"./AppPage-wwO3nDER.js";import"./format-length-B-p6aW7q.js";import"./Tooltip-Bg3keV3f.js";const xa=Fe(".v-x-scroll",{overflow:"auto",scrollbarWidth:"none"},[Fe("&::-webkit-scrollbar",{width:0,height:0})]),ya=le({name:"XScroll",props:{disabled:Boolean,onScroll:Function},setup(){const e=W(null);function r(i){!(i.currentTarget.offsetWidth<i.currentTarget.scrollWidth)||i.deltaY===0||(i.currentTarget.scrollLeft+=i.deltaY+i.deltaX,i.preventDefault())}const n=Ft();return xa.mount({id:"vueuc/x-scroll",head:!0,anchorMetaName:ua,ssr:n}),Object.assign({selfRef:e,handleWheel:r},{scrollTo(...i){var _;(_=e.value)===null||_===void 0||_.scrollTo(...i)}})},render(){return v("div",{ref:"selfRef",onScroll:this.onScroll,onWheel:this.disabled?void 0:this.handleWheel,class:"v-x-scroll"},this.$slots)}});var wa=/\s/;function _a(e){for(var r=e.length;r--&&wa.test(e.charAt(r)););return r}var Sa=/^\s+/;function Ca(e){return e&&e.slice(0,_a(e)+1).replace(Sa,"")}var He=NaN,$a=/^[-+]0x[0-9a-f]+$/i,Ra=/^0b[01]+$/i,Ta=/^0o[0-7]+$/i,za=parseInt;function Me(e){if(typeof e=="number")return e;if(Ot(e))return He;if(ie(e)){var r=typeof e.valueOf=="function"?e.valueOf():e;e=ie(r)?r+"":r}if(typeof e!="string")return e===0?e:+e;e=Ca(e);var n=Ra.test(e);return n||Ta.test(e)?za(e.slice(2),n?2:8):$a.test(e)?He:+e}var _e=function(){return Nt.Date.now()},Pa="Expected a function",Wa=Math.max,La=Math.min;function Ba(e,r,n){var g,i,_,f,h,m,x=0,b=!1,k=!1,A=!0;if(typeof e!="function")throw new TypeError(Pa);r=Me(r)||0,ie(n)&&(b=!!n.leading,k="maxWait"in n,_=k?Wa(Me(n.maxWait)||0,r):_,A="trailing"in n?!!n.trailing:A);function S(u){var P=g,D=i;return g=i=void 0,x=u,f=e.apply(D,P),f}function L(u){return x=u,h=setTimeout(d,r),b?S(u):f}function $(u){var P=u-m,D=u-x,U=r-P;return k?La(U,_-D):U}function B(u){var P=u-m,D=u-x;return m===void 0||P>=r||P<0||k&&D>=_}function d(){var u=_e();if(B(u))return l(u);h=setTimeout(d,$(u))}function l(u){return h=void 0,A&&g?S(u):(g=i=void 0,f)}function j(){h!==void 0&&clearTimeout(h),x=0,g=m=i=h=void 0}function y(){return h===void 0?f:l(_e())}function w(){var u=_e(),P=B(u);if(g=arguments,i=this,m=u,P){if(h===void 0)return L(m);if(k)return clearTimeout(h),h=setTimeout(d,r),S(m)}return h===void 0&&(h=setTimeout(d,r)),f}return w.cancel=j,w.flush=y,w}var Ea="Expected a function";function Se(e,r,n){var g=!0,i=!0;if(typeof e!="function")throw new TypeError(Ea);return ie(n)&&(g="leading"in n?!!n.leading:g,i="trailing"in n?!!n.trailing:i),Ba(e,r,{leading:g,maxWait:r,trailing:i})}const Re=Ht("n-tabs"),Ke={tab:[String,Number,Object,Function],name:{type:[String,Number],required:!0},disabled:Boolean,displayDirective:{type:String,default:"if"},closable:{type:Boolean,default:void 0},tabProps:Object,label:[String,Number,Object,Function]},De=le({__TAB_PANE__:!0,name:"TabPane",alias:["TabPanel"],props:Ke,slots:Object,setup(e){const r=Xe(Re,null);return r||Mt("tab-pane","`n-tab-pane` must be placed inside `n-tabs`."),{style:r.paneStyleRef,class:r.paneClassRef,mergedClsPrefix:r.mergedClsPrefixRef}},render(){return v("div",{class:[`${this.mergedClsPrefix}-tab-pane`,this.class],style:this.style},this.$slots)}}),ka=Object.assign({internalLeftPadded:Boolean,internalAddable:Boolean,internalCreatedByPane:Boolean},Gt(Ke,["displayDirective"])),$e=le({__TAB__:!0,inheritAttrs:!1,name:"Tab",props:ka,setup(e){const{mergedClsPrefixRef:r,valueRef:n,typeRef:g,closableRef:i,tabStyleRef:_,addTabStyleRef:f,tabClassRef:h,addTabClassRef:m,tabChangeIdRef:x,onBeforeLeaveRef:b,triggerRef:k,handleAdd:A,activateTab:S,handleClose:L}=Xe(Re);return{trigger:k,mergedClosable:se(()=>{if(e.internalAddable)return!1;const{closable:$}=e;return $===void 0?i.value:$}),style:_,addStyle:f,tabClass:h,addTabClass:m,clsPrefix:r,value:n,type:g,handleClose($){$.stopPropagation(),!e.disabled&&L(e.name)},activateTab(){if(e.disabled)return;if(e.internalAddable){A();return}const{name:$}=e,B=++x.id;if($!==n.value){const{value:d}=b;d?Promise.resolve(d(e.name,n.value)).then(l=>{l&&x.id===B&&S($)}):S($)}}}},render(){const{internalAddable:e,clsPrefix:r,name:n,disabled:g,label:i,tab:_,value:f,mergedClosable:h,trigger:m,$slots:{default:x}}=this,b=i!=null?i:_;return v("div",{class:`${r}-tabs-tab-wrapper`},this.internalLeftPadded?v("div",{class:`${r}-tabs-tab-pad`}):null,v("div",Object.assign({key:n,"data-name":n,"data-disabled":g?!0:void 0},Dt({class:[`${r}-tabs-tab`,f===n&&`${r}-tabs-tab--active`,g&&`${r}-tabs-tab--disabled`,h&&`${r}-tabs-tab--closable`,e&&`${r}-tabs-tab--addable`,e?this.addTabClass:this.tabClass],onClick:m==="click"?this.activateTab:void 0,onMouseenter:m==="hover"?this.activateTab:void 0,style:e?this.addStyle:this.style},this.internalCreatedByPane?this.tabProps||{}:this.$attrs)),v("span",{class:`${r}-tabs-tab__label`},e?v(Vt,null,v("div",{class:`${r}-tabs-tab__height-placeholder`}," "),v(qt,{clsPrefix:r},{default:()=>v(pa,null)})):x?x():typeof b=="object"?b:Ut(b!=null?b:n)),h&&this.type==="card"?v(Xt,{clsPrefix:r,class:`${r}-tabs-tab__close`,onClick:this.handleClose,disabled:g}):null))}}),Aa=o("tabs",`
 box-sizing: border-box;
 width: 100%;
 display: flex;
 flex-direction: column;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
`,[c("segment-type",[o("tabs-rail",[T("&.transition-disabled",[o("tabs-capsule",`
 transition: none;
 `)])])]),c("top",[o("tab-pane",`
 padding: var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left);
 `)]),c("left",[o("tab-pane",`
 padding: var(--n-pane-padding-right) var(--n-pane-padding-bottom) var(--n-pane-padding-left) var(--n-pane-padding-top);
 `)]),c("left, right",`
 flex-direction: row;
 `,[o("tabs-bar",`
 width: 2px;
 right: 0;
 transition:
 top .2s var(--n-bezier),
 max-height .2s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),o("tabs-tab",`
 padding: var(--n-tab-padding-vertical); 
 `)]),c("right",`
 flex-direction: row-reverse;
 `,[o("tab-pane",`
 padding: var(--n-pane-padding-left) var(--n-pane-padding-top) var(--n-pane-padding-right) var(--n-pane-padding-bottom);
 `),o("tabs-bar",`
 left: 0;
 `)]),c("bottom",`
 flex-direction: column-reverse;
 justify-content: flex-end;
 `,[o("tab-pane",`
 padding: var(--n-pane-padding-bottom) var(--n-pane-padding-right) var(--n-pane-padding-top) var(--n-pane-padding-left);
 `),o("tabs-bar",`
 top: 0;
 `)]),o("tabs-rail",`
 position: relative;
 padding: 3px;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 background-color: var(--n-color-segment);
 transition: background-color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `,[o("tabs-capsule",`
 border-radius: var(--n-tab-border-radius);
 position: absolute;
 pointer-events: none;
 background-color: var(--n-tab-color-segment);
 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .08);
 transition: transform 0.3s var(--n-bezier);
 `),o("tabs-tab-wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[o("tabs-tab",`
 overflow: hidden;
 border-radius: var(--n-tab-border-radius);
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `,[c("active",`
 font-weight: var(--n-font-weight-strong);
 color: var(--n-tab-text-color-active);
 `),T("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])])]),c("flex",[o("tabs-nav",`
 width: 100%;
 position: relative;
 `,[o("tabs-wrapper",`
 width: 100%;
 `,[o("tabs-tab",`
 margin-right: 0;
 `)])])]),o("tabs-nav",`
 box-sizing: border-box;
 line-height: 1.5;
 display: flex;
 transition: border-color .3s var(--n-bezier);
 `,[E("prefix, suffix",`
 display: flex;
 align-items: center;
 `),E("prefix","padding-right: 16px;"),E("suffix","padding-left: 16px;")]),c("top, bottom",[o("tabs-nav-scroll-wrapper",[T("&::before",`
 top: 0;
 bottom: 0;
 left: 0;
 width: 20px;
 `),T("&::after",`
 top: 0;
 bottom: 0;
 right: 0;
 width: 20px;
 `),c("shadow-start",[T("&::before",`
 box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, .12);
 `)]),c("shadow-end",[T("&::after",`
 box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, .12);
 `)])])]),c("left, right",[o("tabs-nav-scroll-content",`
 flex-direction: column;
 `),o("tabs-nav-scroll-wrapper",[T("&::before",`
 top: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),T("&::after",`
 bottom: 0;
 left: 0;
 right: 0;
 height: 20px;
 `),c("shadow-start",[T("&::before",`
 box-shadow: inset 0 10px 8px -8px rgba(0, 0, 0, .12);
 `)]),c("shadow-end",[T("&::after",`
 box-shadow: inset 0 -10px 8px -8px rgba(0, 0, 0, .12);
 `)])])]),o("tabs-nav-scroll-wrapper",`
 flex: 1;
 position: relative;
 overflow: hidden;
 `,[o("tabs-nav-y-scroll",`
 height: 100%;
 width: 100%;
 overflow-y: auto; 
 scrollbar-width: none;
 `,[T("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",`
 width: 0;
 height: 0;
 display: none;
 `)]),T("&::before, &::after",`
 transition: box-shadow .3s var(--n-bezier);
 pointer-events: none;
 content: "";
 position: absolute;
 z-index: 1;
 `)]),o("tabs-nav-scroll-content",`
 display: flex;
 position: relative;
 min-width: 100%;
 min-height: 100%;
 width: fit-content;
 box-sizing: border-box;
 `),o("tabs-wrapper",`
 display: inline-flex;
 flex-wrap: nowrap;
 position: relative;
 `),o("tabs-tab-wrapper",`
 display: flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 flex-grow: 0;
 `),o("tabs-tab",`
 cursor: pointer;
 white-space: nowrap;
 flex-wrap: nowrap;
 display: inline-flex;
 align-items: center;
 color: var(--n-tab-text-color);
 font-size: var(--n-tab-font-size);
 background-clip: padding-box;
 padding: var(--n-tab-padding);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[c("disabled",{cursor:"not-allowed"}),E("close",`
 margin-left: 6px;
 transition:
 background-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 `),E("label",`
 display: flex;
 align-items: center;
 z-index: 1;
 `)]),o("tabs-bar",`
 position: absolute;
 bottom: 0;
 height: 2px;
 border-radius: 1px;
 background-color: var(--n-bar-color);
 transition:
 left .2s var(--n-bezier),
 max-width .2s var(--n-bezier),
 opacity .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `,[T("&.transition-disabled",`
 transition: none;
 `),c("disabled",`
 background-color: var(--n-tab-text-color-disabled)
 `)]),o("tabs-pane-wrapper",`
 position: relative;
 overflow: hidden;
 transition: max-height .2s var(--n-bezier);
 `),o("tab-pane",`
 color: var(--n-pane-text-color);
 width: 100%;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .2s var(--n-bezier);
 left: 0;
 right: 0;
 top: 0;
 `,[T("&.next-transition-leave-active, &.prev-transition-leave-active, &.next-transition-enter-active, &.prev-transition-enter-active",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 transform .2s var(--n-bezier),
 opacity .2s var(--n-bezier);
 `),T("&.next-transition-leave-active, &.prev-transition-leave-active",`
 position: absolute;
 `),T("&.next-transition-enter-from, &.prev-transition-leave-to",`
 transform: translateX(32px);
 opacity: 0;
 `),T("&.next-transition-leave-to, &.prev-transition-enter-from",`
 transform: translateX(-32px);
 opacity: 0;
 `),T("&.next-transition-leave-from, &.next-transition-enter-to, &.prev-transition-leave-from, &.prev-transition-enter-to",`
 transform: translateX(0);
 opacity: 1;
 `)]),o("tabs-tab-pad",`
 box-sizing: border-box;
 width: var(--n-tab-gap);
 flex-grow: 0;
 flex-shrink: 0;
 `),c("line-type, bar-type",[o("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 box-sizing: border-box;
 vertical-align: bottom;
 `,[T("&:hover",{color:"var(--n-tab-text-color-hover)"}),c("active",`
 color: var(--n-tab-text-color-active);
 font-weight: var(--n-tab-font-weight-active);
 `),c("disabled",{color:"var(--n-tab-text-color-disabled)"})])]),o("tabs-nav",[c("line-type",[c("top",[E("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),o("tabs-nav-scroll-content",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),o("tabs-bar",`
 bottom: -1px;
 `)]),c("left",[E("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),o("tabs-nav-scroll-content",`
 border-right: 1px solid var(--n-tab-border-color);
 `),o("tabs-bar",`
 right: -1px;
 `)]),c("right",[E("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),o("tabs-nav-scroll-content",`
 border-left: 1px solid var(--n-tab-border-color);
 `),o("tabs-bar",`
 left: -1px;
 `)]),c("bottom",[E("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),o("tabs-nav-scroll-content",`
 border-top: 1px solid var(--n-tab-border-color);
 `),o("tabs-bar",`
 top: -1px;
 `)]),E("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),o("tabs-nav-scroll-content",`
 transition: border-color .3s var(--n-bezier);
 `),o("tabs-bar",`
 border-radius: 0;
 `)]),c("card-type",[E("prefix, suffix",`
 transition: border-color .3s var(--n-bezier);
 `),o("tabs-pad",`
 flex-grow: 1;
 transition: border-color .3s var(--n-bezier);
 `),o("tabs-tab-pad",`
 transition: border-color .3s var(--n-bezier);
 `),o("tabs-tab",`
 font-weight: var(--n-tab-font-weight);
 border: 1px solid var(--n-tab-border-color);
 background-color: var(--n-tab-color);
 box-sizing: border-box;
 position: relative;
 vertical-align: bottom;
 display: flex;
 justify-content: space-between;
 font-size: var(--n-tab-font-size);
 color: var(--n-tab-text-color);
 `,[c("addable",`
 padding-left: 8px;
 padding-right: 8px;
 font-size: 16px;
 justify-content: center;
 `,[E("height-placeholder",`
 width: 0;
 font-size: var(--n-tab-font-size);
 `),Kt("disabled",[T("&:hover",`
 color: var(--n-tab-text-color-hover);
 `)])]),c("closable","padding-right: 8px;"),c("active",`
 background-color: #0000;
 font-weight: var(--n-tab-font-weight-active);
 color: var(--n-tab-text-color-active);
 `),c("disabled","color: var(--n-tab-text-color-disabled);")])]),c("left, right",`
 flex-direction: column; 
 `,[E("prefix, suffix",`
 padding: var(--n-tab-padding-vertical);
 `),o("tabs-wrapper",`
 flex-direction: column;
 `),o("tabs-tab-wrapper",`
 flex-direction: column;
 `,[o("tabs-tab-pad",`
 height: var(--n-tab-gap-vertical);
 width: 100%;
 `)])]),c("top",[c("card-type",[o("tabs-scroll-padding","border-bottom: 1px solid var(--n-tab-border-color);"),E("prefix, suffix",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),o("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-top-right-radius: var(--n-tab-border-radius);
 `,[c("active",`
 border-bottom: 1px solid #0000;
 `)]),o("tabs-tab-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `),o("tabs-pad",`
 border-bottom: 1px solid var(--n-tab-border-color);
 `)])]),c("left",[c("card-type",[o("tabs-scroll-padding","border-right: 1px solid var(--n-tab-border-color);"),E("prefix, suffix",`
 border-right: 1px solid var(--n-tab-border-color);
 `),o("tabs-tab",`
 border-top-left-radius: var(--n-tab-border-radius);
 border-bottom-left-radius: var(--n-tab-border-radius);
 `,[c("active",`
 border-right: 1px solid #0000;
 `)]),o("tabs-tab-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `),o("tabs-pad",`
 border-right: 1px solid var(--n-tab-border-color);
 `)])]),c("right",[c("card-type",[o("tabs-scroll-padding","border-left: 1px solid var(--n-tab-border-color);"),E("prefix, suffix",`
 border-left: 1px solid var(--n-tab-border-color);
 `),o("tabs-tab",`
 border-top-right-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[c("active",`
 border-left: 1px solid #0000;
 `)]),o("tabs-tab-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `),o("tabs-pad",`
 border-left: 1px solid var(--n-tab-border-color);
 `)])]),c("bottom",[c("card-type",[o("tabs-scroll-padding","border-top: 1px solid var(--n-tab-border-color);"),E("prefix, suffix",`
 border-top: 1px solid var(--n-tab-border-color);
 `),o("tabs-tab",`
 border-bottom-left-radius: var(--n-tab-border-radius);
 border-bottom-right-radius: var(--n-tab-border-radius);
 `,[c("active",`
 border-top: 1px solid #0000;
 `)]),o("tabs-tab-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `),o("tabs-pad",`
 border-top: 1px solid var(--n-tab-border-color);
 `)])])])]),ja=Object.assign(Object.assign({},Ge.props),{value:[String,Number],defaultValue:[String,Number],trigger:{type:String,default:"click"},type:{type:String,default:"bar"},closable:Boolean,justifyContent:String,size:{type:String,default:"medium"},placement:{type:String,default:"top"},tabStyle:[String,Object],tabClass:String,addTabStyle:[String,Object],addTabClass:String,barWidth:Number,paneClass:String,paneStyle:[String,Object],paneWrapperClass:String,paneWrapperStyle:[String,Object],addable:[Boolean,Object],tabsPadding:{type:Number,default:0},animated:Boolean,onBeforeLeave:Function,onAdd:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClose:[Function,Array],labelSize:String,activeName:[String,Number],onActiveNameChange:[Function,Array]}),Ia=le({name:"Tabs",props:ja,slots:Object,setup(e,{slots:r}){var n,g,i,_;const{mergedClsPrefixRef:f,inlineThemeDisabled:h}=Yt(e),m=Ge("Tabs","-tabs",Aa,Jt,e,f),x=W(null),b=W(null),k=W(null),A=W(null),S=W(null),L=W(null),$=W(!0),B=W(!0),d=Oe(e,["labelSize","size"]),l=Oe(e,["activeName","value"]),j=W((g=(n=l.value)!==null&&n!==void 0?n:e.defaultValue)!==null&&g!==void 0?g:r.default?(_=(i=ue(r.default())[0])===null||i===void 0?void 0:i.props)===null||_===void 0?void 0:_.name:null),y=ga(l,j),w={id:0},u=se(()=>{if(!(!e.justifyContent||e.type==="card"))return{display:"flex",justifyContent:e.justifyContent}});ge(y,()=>{w.id=0,q(),Te()});function P(){var t;const{value:a}=y;return a===null?null:(t=x.value)===null||t===void 0?void 0:t.querySelector(`[data-name="${a}"]`)}function D(t){if(e.type==="card")return;const{value:a}=b;if(!a)return;const s=a.style.opacity==="0";if(t){const p=`${f.value}-tabs-bar--disabled`,{barWidth:R,placement:O}=e;if(t.dataset.disabled==="true"?a.classList.add(p):a.classList.remove(p),["top","bottom"].includes(O)){if(F(["top","maxHeight","height"]),typeof R=="number"&&t.offsetWidth>=R){const N=Math.floor((t.offsetWidth-R)/2)+t.offsetLeft;a.style.left=`${N}px`,a.style.maxWidth=`${R}px`}else a.style.left=`${t.offsetLeft}px`,a.style.maxWidth=`${t.offsetWidth}px`;a.style.width="8192px",s&&(a.style.transition="none"),a.offsetWidth,s&&(a.style.transition="",a.style.opacity="1")}else{if(F(["left","maxWidth","width"]),typeof R=="number"&&t.offsetHeight>=R){const N=Math.floor((t.offsetHeight-R)/2)+t.offsetTop;a.style.top=`${N}px`,a.style.maxHeight=`${R}px`}else a.style.top=`${t.offsetTop}px`,a.style.maxHeight=`${t.offsetHeight}px`;a.style.height="8192px",s&&(a.style.transition="none"),a.offsetHeight,s&&(a.style.transition="",a.style.opacity="1")}}}function U(){if(e.type==="card")return;const{value:t}=b;t&&(t.style.opacity="0")}function F(t){const{value:a}=b;if(a)for(const s of t)a.style[s]=""}function q(){if(e.type==="card")return;const t=P();t?D(t):U()}function Te(){var t;const a=(t=S.value)===null||t===void 0?void 0:t.$el;if(!a)return;const s=P();if(!s)return;const{scrollLeft:p,offsetWidth:R}=a,{offsetLeft:O,offsetWidth:N}=s;p>O?a.scrollTo({top:0,left:O,behavior:"smooth"}):O+N>p+R&&a.scrollTo({top:0,left:O+N-R,behavior:"smooth"})}const te=W(null);let de=0,V=null;function Ye(t){const a=te.value;if(a){de=t.getBoundingClientRect().height;const s=`${de}px`,p=()=>{a.style.height=s,a.style.maxHeight=s};V?(p(),V(),V=null):V=p}}function Je(t){const a=te.value;if(a){const s=t.getBoundingClientRect().height,p=()=>{document.body.offsetHeight,a.style.maxHeight=`${s}px`,a.style.height=`${Math.max(de,s)}px`};V?(V(),V=null,p()):V=p}}function Qe(){const t=te.value;if(t){t.style.maxHeight="",t.style.height="";const{paneWrapperStyle:a}=e;if(typeof a=="string")t.style.cssText=a;else if(a){const{maxHeight:s,height:p}=a;s!==void 0&&(t.style.maxHeight=s),p!==void 0&&(t.style.height=p)}}}const ze={value:[]},Pe=W("next");function Ze(t){const a=y.value;let s="next";for(const p of ze.value){if(p===a)break;if(p===t){s="prev";break}}Pe.value=s,et(t)}function et(t){const{onActiveNameChange:a,onUpdateValue:s,"onUpdate:value":p}=e;a&&oe(a,t),s&&oe(s,t),p&&oe(p,t),j.value=t}function tt(t){const{onClose:a}=e;a&&oe(a,t)}function We(){const{value:t}=b;if(!t)return;const a="transition-disabled";t.classList.add(a),q(),t.classList.remove(a)}const X=W(null);function ce({transitionDisabled:t}){const a=x.value;if(!a)return;t&&a.classList.add("transition-disabled");const s=P();s&&X.value&&(X.value.style.width=`${s.offsetWidth}px`,X.value.style.height=`${s.offsetHeight}px`,X.value.style.transform=`translateX(${s.offsetLeft-aa(getComputedStyle(a).paddingLeft)}px)`,t&&X.value.offsetWidth),t&&a.classList.remove("transition-disabled")}ge([y],()=>{e.type==="segment"&&he(()=>{ce({transitionDisabled:!1})})}),Qt(()=>{e.type==="segment"&&ce({transitionDisabled:!0})});let Le=0;function at(t){var a;if(t.contentRect.width===0&&t.contentRect.height===0||Le===t.contentRect.width)return;Le=t.contentRect.width;const{type:s}=e;if((s==="line"||s==="bar")&&We(),s!=="segment"){const{placement:p}=e;fe((p==="top"||p==="bottom"?(a=S.value)===null||a===void 0?void 0:a.$el:L.value)||null)}}const rt=Se(at,64);ge([()=>e.justifyContent,()=>e.size],()=>{he(()=>{const{type:t}=e;(t==="line"||t==="bar")&&We()})});const G=W(!1);function ot(t){var a;const{target:s,contentRect:{width:p,height:R}}=t,O=s.parentElement.parentElement.offsetWidth,N=s.parentElement.parentElement.offsetHeight,{placement:Y}=e;if(!G.value)Y==="top"||Y==="bottom"?O<p&&(G.value=!0):N<R&&(G.value=!0);else{const{value:ee}=A;if(!ee)return;Y==="top"||Y==="bottom"?O-p>ee.$el.offsetWidth&&(G.value=!1):N-R>ee.$el.offsetHeight&&(G.value=!1)}fe(((a=S.value)===null||a===void 0?void 0:a.$el)||null)}const nt=Se(ot,64);function st(){const{onAdd:t}=e;t&&t(),he(()=>{const a=P(),{value:s}=S;!a||!s||s.scrollTo({left:a.offsetLeft,top:0,behavior:"smooth"})})}function fe(t){if(!t)return;const{placement:a}=e;if(a==="top"||a==="bottom"){const{scrollLeft:s,scrollWidth:p,offsetWidth:R}=t;$.value=s<=0,B.value=s+R>=p}else{const{scrollTop:s,scrollHeight:p,offsetHeight:R}=t;$.value=s<=0,B.value=s+R>=p}}const it=Se(t=>{fe(t.target)},64);Zt(Re,{triggerRef:H(e,"trigger"),tabStyleRef:H(e,"tabStyle"),tabClassRef:H(e,"tabClass"),addTabStyleRef:H(e,"addTabStyle"),addTabClassRef:H(e,"addTabClass"),paneClassRef:H(e,"paneClass"),paneStyleRef:H(e,"paneStyle"),mergedClsPrefixRef:f,typeRef:H(e,"type"),closableRef:H(e,"closable"),valueRef:y,tabChangeIdRef:w,onBeforeLeaveRef:H(e,"onBeforeLeave"),activateTab:Ze,handleClose:tt,handleAdd:st}),va(()=>{q(),Te()}),ea(()=>{const{value:t}=k;if(!t)return;const{value:a}=f,s=`${a}-tabs-nav-scroll-wrapper--shadow-start`,p=`${a}-tabs-nav-scroll-wrapper--shadow-end`;$.value?t.classList.remove(s):t.classList.add(s),B.value?t.classList.remove(p):t.classList.add(p)});const lt={syncBarPosition:()=>{q()}},dt=()=>{ce({transitionDisabled:!0})},Be=se(()=>{const{value:t}=d,{type:a}=e,s={card:"Card",bar:"Bar",line:"Line",segment:"Segment"}[a],p=`${t}${s}`,{self:{barColor:R,closeIconColor:O,closeIconColorHover:N,closeIconColorPressed:Y,tabColor:ee,tabBorderColor:ct,paneTextColor:ft,tabFontWeight:bt,tabBorderRadius:pt,tabFontWeightActive:ut,colorSegment:vt,fontWeightStrong:gt,tabColorSegment:ht,closeSize:mt,closeIconSize:xt,closeColorHover:yt,closeColorPressed:wt,closeBorderRadius:_t,[M("panePadding",t)]:ae,[M("tabPadding",p)]:St,[M("tabPaddingVertical",p)]:Ct,[M("tabGap",p)]:$t,[M("tabGap",`${p}Vertical`)]:Rt,[M("tabTextColor",a)]:Tt,[M("tabTextColorActive",a)]:zt,[M("tabTextColorHover",a)]:Pt,[M("tabTextColorDisabled",a)]:Wt,[M("tabFontSize",t)]:Lt},common:{cubicBezierEaseInOut:Bt}}=m.value;return{"--n-bezier":Bt,"--n-color-segment":vt,"--n-bar-color":R,"--n-tab-font-size":Lt,"--n-tab-text-color":Tt,"--n-tab-text-color-active":zt,"--n-tab-text-color-disabled":Wt,"--n-tab-text-color-hover":Pt,"--n-pane-text-color":ft,"--n-tab-border-color":ct,"--n-tab-border-radius":pt,"--n-close-size":mt,"--n-close-icon-size":xt,"--n-close-color-hover":yt,"--n-close-color-pressed":wt,"--n-close-border-radius":_t,"--n-close-icon-color":O,"--n-close-icon-color-hover":N,"--n-close-icon-color-pressed":Y,"--n-tab-color":ee,"--n-tab-font-weight":bt,"--n-tab-font-weight-active":ut,"--n-tab-padding":St,"--n-tab-padding-vertical":Ct,"--n-tab-gap":$t,"--n-tab-gap-vertical":Rt,"--n-pane-padding-left":re(ae,"left"),"--n-pane-padding-right":re(ae,"right"),"--n-pane-padding-top":re(ae,"top"),"--n-pane-padding-bottom":re(ae,"bottom"),"--n-font-weight-strong":gt,"--n-tab-color-segment":ht}}),K=h?ta("tabs",se(()=>`${d.value[0]}${e.type[0]}`),Be,e):void 0;return Object.assign({mergedClsPrefix:f,mergedValue:y,renderedNames:new Set,segmentCapsuleElRef:X,tabsPaneWrapperRef:te,tabsElRef:x,barElRef:b,addTabInstRef:A,xScrollInstRef:S,scrollWrapperElRef:k,addTabFixed:G,tabWrapperStyle:u,handleNavResize:rt,mergedSize:d,handleScroll:it,handleTabsResize:nt,cssVars:h?void 0:Be,themeClass:K==null?void 0:K.themeClass,animationDirection:Pe,renderNameListRef:ze,yScrollElRef:L,handleSegmentResize:dt,onAnimationBeforeLeave:Ye,onAnimationEnter:Je,onAnimationAfterEnter:Qe,onRender:K==null?void 0:K.onRender},lt)},render(){const{mergedClsPrefix:e,type:r,placement:n,addTabFixed:g,addable:i,mergedSize:_,renderNameListRef:f,onRender:h,paneWrapperClass:m,paneWrapperStyle:x,$slots:{default:b,prefix:k,suffix:A}}=this;h==null||h();const S=b?ue(b()).filter(w=>w.type.__TAB_PANE__===!0):[],L=b?ue(b()).filter(w=>w.type.__TAB__===!0):[],$=!L.length,B=r==="card",d=r==="segment",l=!B&&!d&&this.justifyContent;f.value=[];const j=()=>{const w=v("div",{style:this.tabWrapperStyle,class:`${e}-tabs-wrapper`},l?null:v("div",{class:`${e}-tabs-scroll-padding`,style:n==="top"||n==="bottom"?{width:`${this.tabsPadding}px`}:{height:`${this.tabsPadding}px`}}),$?S.map((u,P)=>(f.value.push(u.props.name),Ce(v($e,Object.assign({},u.props,{internalCreatedByPane:!0,internalLeftPadded:P!==0&&(!l||l==="center"||l==="start"||l==="end")}),u.children?{default:u.children.tab}:void 0)))):L.map((u,P)=>(f.value.push(u.props.name),Ce(P!==0&&!l?qe(u):u))),!g&&i&&B?Ve(i,($?S.length:L.length)!==0):null,l?null:v("div",{class:`${e}-tabs-scroll-padding`,style:{width:`${this.tabsPadding}px`}}));return v("div",{ref:"tabsElRef",class:`${e}-tabs-nav-scroll-content`},B&&i?v(ve,{onResize:this.handleTabsResize},{default:()=>w}):w,B?v("div",{class:`${e}-tabs-pad`}):null,B?null:v("div",{ref:"barElRef",class:`${e}-tabs-bar`}))},y=d?"top":n;return v("div",{class:[`${e}-tabs`,this.themeClass,`${e}-tabs--${r}-type`,`${e}-tabs--${_}-size`,l&&`${e}-tabs--flex`,`${e}-tabs--${y}`],style:this.cssVars},v("div",{class:[`${e}-tabs-nav--${r}-type`,`${e}-tabs-nav--${y}`,`${e}-tabs-nav`]},Ae(k,w=>w&&v("div",{class:`${e}-tabs-nav__prefix`},w)),d?v(ve,{onResize:this.handleSegmentResize},{default:()=>v("div",{class:`${e}-tabs-rail`,ref:"tabsElRef"},v("div",{class:`${e}-tabs-capsule`,ref:"segmentCapsuleElRef"},v("div",{class:`${e}-tabs-wrapper`},v("div",{class:`${e}-tabs-tab`}))),$?S.map((w,u)=>(f.value.push(w.props.name),v($e,Object.assign({},w.props,{internalCreatedByPane:!0,internalLeftPadded:u!==0}),w.children?{default:w.children.tab}:void 0))):L.map((w,u)=>(f.value.push(w.props.name),u===0?w:qe(w))))}):v(ve,{onResize:this.handleNavResize},{default:()=>v("div",{class:`${e}-tabs-nav-scroll-wrapper`,ref:"scrollWrapperElRef"},["top","bottom"].includes(y)?v(ya,{ref:"xScrollInstRef",onScroll:this.handleScroll},{default:j}):v("div",{class:`${e}-tabs-nav-y-scroll`,onScroll:this.handleScroll,ref:"yScrollElRef"},j()))}),g&&i&&B?Ve(i,!0):null,Ae(A,w=>w&&v("div",{class:`${e}-tabs-nav__suffix`},w))),$&&(this.animated&&(y==="top"||y==="bottom")?v("div",{ref:"tabsPaneWrapperRef",style:x,class:[`${e}-tabs-pane-wrapper`,m]},Ue(S,this.mergedValue,this.renderedNames,this.onAnimationBeforeLeave,this.onAnimationEnter,this.onAnimationAfterEnter,this.animationDirection)):Ue(S,this.mergedValue,this.renderedNames)))}});function Ue(e,r,n,g,i,_,f){const h=[];return e.forEach(m=>{const{name:x,displayDirective:b,"display-directive":k}=m.props,A=L=>b===L||k===L,S=r===x;if(m.key!==void 0&&(m.key=x),S||A("show")||A("show:lazy")&&n.has(x)){n.has(x)||n.add(x);const L=!A("if");h.push(L?ra(m,[[sa,S]]):m)}}),f?v(oa,{name:`${f}-transition`,onBeforeLeave:g,onEnter:i,onAfterEnter:_},{default:()=>h}):h}function Ve(e,r){return v($e,{ref:"addTabInstRef",key:"__addable",name:"__addable",internalCreatedByPane:!0,internalAddable:!0,internalLeftPadded:r,disabled:typeof e=="object"&&e.disabled})}function qe(e){const r=na(e);return r.props?r.props.internalLeftPadded=!0:r.props={internalLeftPadded:!0},r}function Ce(e){return Array.isArray(e.dynamicProps)?e.dynamicProps.includes("internalLeftPadded")||e.dynamicProps.push("internalLeftPadded"):e.dynamicProps=["internalLeftPadded"],e}const Fa={class:"m-30 flex items-center"},Oa={__name:"index",setup(e){const r=ia(),{t:n}=la(),g=da(),i=W(!1),_=W(null),f=W({avatar:g.avatar,username:g.name,email:g.email});function h(){return J(this,null,function*(){var d;i.value=!0,(d=_.value)==null||d.validate(l=>J(this,null,function*(){l||(yield ne.updateUser(pe(be({},f.value),{id:g.userId})).then(()=>{g.setUserInfo(f.value),i.value=!1,$message.success(n("common.text.save_success"))}).catch(()=>{i.value=!1}))}))})}const m={username:[{required:!0,message:n("views.profile.message_username_required"),trigger:["input","blur","change"]}]},x=W(null),b=W({old_password:"",new_password:"",confirm_password:""});function k(){return J(this,null,function*(){var d;i.value=!0,(d=x.value)==null||d.validate(l=>J(this,null,function*(){if(!l){const j=pe(be({},b.value),{id:g.userId});yield ne.updatePassword(j).then(y=>{$message.success(y.msg),b.value={old_password:"",new_password:"",confirm_password:""},i.value=!1}).catch(()=>{i.value=!1})}}))})}const A={old_password:[{required:!0,message:n("views.profile.message_old_password_required"),trigger:["input","blur","change"]}],new_password:[{required:!0,message:n("views.profile.message_new_password_required"),trigger:["input","blur","change"]}],confirm_password:[{required:!0,message:n("views.profile.message_password_confirmation_required"),trigger:["input","blur"]},{validator:S,message:n("views.profile.message_password_confirmation_diff"),trigger:"input"},{validator:L,message:n("views.profile.message_password_confirmation_diff"),trigger:["blur","password-input"]}]};function S(d,l){return!!b.value.new_password&&b.value.new_password.startsWith(l)&&b.value.new_password.length>=l.length}function L(d,l){return l===b.value.new_password}function $(d){return J(this,null,function*(){var j;var l=["image/avif","image/vnd.microsoft.icon","image/jpeg","image/tiff","image/bmp","image/svg+xml","image/webp","image/png"];return l.indexOf((j=d.file.file)==null?void 0:j.type)==-1?($message.error("只能上传图片文件，请重新上传"),!1):!0})}const B=({file:d,data:l,headers:j,withCredentials:y,action:w,onFinish:u,onError:P,onProgress:D})=>{const U=new FormData;l&&Object.keys(l).forEach(F=>{U.append(F,l[F])}),U.append("file",d.file),ne.uploadImage(U,j,F=>{var q=Math.round(F.loaded*100/F.total);D({percent:Math.ceil(q)}),$message.loading(n("views.content.label_uploading")+` ${Math.ceil(q)}%`)}).then(F=>{$message.success(F.msg),f.value.avatar=F.data,u()}).catch(F=>{P()})};return(d,l)=>{const j=ha;return xe(),me(fa,{"show-header":!1},{default:I(()=>[z(C(Ia),{type:"line",animated:""},{default:I(()=>[z(C(De),{name:"website",tab:d.$t("views.profile.label_modify_information")},{default:I(()=>[ca("div",Fa,[z(C(Ne),{ref_key:"infoFormRef",ref:_,"label-placement":"top","label-align":"left","label-width":"100",model:f.value,rules:m,class:"w-500"},{default:I(()=>[z(C(Q),{label:d.$t("views.profile.label_avatar"),path:"avatar"},{default:I(()=>[z(C(Z),{value:f.value.avatar,"onUpdate:value":l[0]||(l[0]=y=>f.value.avatar=y),type:"text",placeholder:d.$t("views.profile.placeholder_avatar")},null,8,["value","placeholder"])]),_:1},8,["label"]),C(r).storageSetting.enable_storage?(xe(),me(j,{key:0,action:C(ne).uploadApi,"custom-request":B,class:"upload-button",accept:".tif,.jpg,.jpeg,.ico,.tiff,.gif,.svg,.jfif,.webp,.png,.bmp,.jpeg,.avif","show-file-list":!1,onBeforeUpload:$},{default:I(()=>[z(C(ye),null,{default:I(()=>l[6]||(l[6]=[we("上传图片")])),_:1})]),_:1},8,["action"])):je("",!0),f.value.avatar!=null&&f.value.avatar!=""?(xe(),me(C(ma),{key:1,id:"preview-avatar",width:"100",src:f.value.avatar},null,8,["src"])):je("",!0),z(C(Q),{label:d.$t("views.profile.label_username"),path:"username"},{default:I(()=>[z(C(Z),{value:f.value.username,"onUpdate:value":l[1]||(l[1]=y=>f.value.username=y),type:"text",placeholder:d.$t("views.profile.placeholder_username")},null,8,["value","placeholder"])]),_:1},8,["label"]),z(C(Q),{label:d.$t("views.profile.label_email"),path:"email"},{default:I(()=>[z(C(Z),{value:f.value.email,"onUpdate:value":l[2]||(l[2]=y=>f.value.email=y),type:"text",placeholder:d.$t("views.profile.placeholder_email")},null,8,["value","placeholder"])]),_:1},8,["label"]),z(C(ye),{type:"primary",loading:i.value,onClick:h},{default:I(()=>[we(Ie(d.$t("common.buttons.save")),1)]),_:1},8,["loading"])]),_:1},8,["model"])])]),_:1},8,["tab"]),z(C(De),{name:"contact",tab:d.$t("views.profile.label_change_password")},{default:I(()=>[z(C(Ne),{ref_key:"passwordFormRef",ref:x,"label-placement":"top","label-align":"left",model:b.value,"label-width":"200",rules:A,class:"m-30 w-500"},{default:I(()=>[z(C(Q),{label:d.$t("views.profile.label_old_password"),path:"old_password"},{default:I(()=>[z(C(Z),{value:b.value.old_password,"onUpdate:value":l[3]||(l[3]=y=>b.value.old_password=y),type:"password","show-password-on":"mousedown",placeholder:d.$t("views.profile.placeholder_old_password")},null,8,["value","placeholder"])]),_:1},8,["label"]),z(C(Q),{label:d.$t("views.profile.label_new_password"),path:"new_password"},{default:I(()=>[z(C(Z),{value:b.value.new_password,"onUpdate:value":l[4]||(l[4]=y=>b.value.new_password=y),disabled:!b.value.old_password,type:"password","show-password-on":"mousedown",placeholder:d.$t("views.profile.placeholder_new_password")},null,8,["value","disabled","placeholder"])]),_:1},8,["label"]),z(C(Q),{label:d.$t("views.profile.label_confirm_password"),path:"confirm_password"},{default:I(()=>[z(C(Z),{value:b.value.confirm_password,"onUpdate:value":l[5]||(l[5]=y=>b.value.confirm_password=y),disabled:!b.value.new_password,type:"password","show-password-on":"mousedown",placeholder:d.$t("views.profile.placeholder_confirm_password")},null,8,["value","disabled","placeholder"])]),_:1},8,["label"]),z(C(ye),{type:"primary",loading:i.value,onClick:k},{default:I(()=>[we(Ie(d.$t("common.buttons.save")),1)]),_:1},8,["loading"])]),_:1},8,["model"])]),_:1},8,["tab"])]),_:1})]),_:1})}}},er=ba(Oa,[["__scopeId","data-v-d1f88b1c"]]);export{er as default};
