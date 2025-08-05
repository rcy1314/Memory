import{r as k,j as F,E as te,p as $e,d as X,n as Ne,h as a,V as De,L as Yt,aJ as Zt,o as pe,c5 as Jt,c8 as Qt,t as W,aU as Be,d7 as se,ew as Pe,ab as ie,aj as Je,c as S,b as I,a as U,N as Qe,u as He,g as le,dp as en,aS as J,k as We,C as oe,aw as tn,e as D,A as Le,d9 as nn,aE as Ve,dr as on,S as ln,q as rn,aG as et,ex as an,aT as de,ac as tt,ey as sn,F as dn,dn as cn,J as un}from"./index-CWFJs7gC.js";import{c as Oe,a as fn,b as hn,i as Ae,f as vn,N as bn}from"./Popover-R3LBGIk-.js";import{a as pn,h as je,N as Me,V as Ke}from"./Tag-YM-0hAL5.js";import{a as gn}from"./use-locale-EYmsExNA.js";import{a as mn}from"./Input-lGLiS13x.js";function qe(e){return e&-e}class nt{constructor(t,n){this.l=t,this.min=n;const o=new Array(t+1);for(let d=0;d<t+1;++d)o[d]=0;this.ft=o}add(t,n){if(n===0)return;const{l:o,ft:d}=this;for(t+=1;t<=o;)d[t]+=n,t+=qe(t)}get(t){return this.sum(t+1)-this.sum(t)}sum(t){if(t===void 0&&(t=this.l),t<=0)return 0;const{ft:n,min:o,l:d}=this;if(t>d)throw new Error("[FinweckTree.sum]: `i` is larger than length.");let c=t*o;for(;t>0;)c+=n[t],t-=qe(t);return c}getBound(t){let n=0,o=this.l;for(;o>n;){const d=Math.floor((n+o)/2),c=this.sum(d);if(c>t){o=d;continue}else if(c<t){if(n===d)return this.sum(n+1)<=t?n+1:d;n=d}else return d}return n}}let ve;function wn(){return typeof document=="undefined"?!1:(ve===void 0&&("matchMedia"in window?ve=window.matchMedia("(pointer:coarse)").matches:ve=!1),ve)}let _e;function Ge(){return typeof document=="undefined"?1:(_e===void 0&&(_e="chrome"in window?window.devicePixelRatio:1),_e)}const ot="VVirtualListXScroll";function xn({columnsRef:e,renderColRef:t,renderItemWithColsRef:n}){const o=k(0),d=k(0),c=F(()=>{const p=e.value;if(p.length===0)return null;const b=new nt(p.length,0);return p.forEach((m,x)=>{b.add(x,m.width)}),b}),f=te(()=>{const p=c.value;return p!==null?Math.max(p.getBound(d.value)-1,0):0}),l=p=>{const b=c.value;return b!==null?b.sum(p):0},g=te(()=>{const p=c.value;return p!==null?Math.min(p.getBound(d.value+o.value)+1,e.value.length-1):0});return $e(ot,{startIndexRef:f,endIndexRef:g,columnsRef:e,renderColRef:t,renderItemWithColsRef:n,getLeft:l}),{listWidthRef:o,scrollLeftRef:d}}const Ue=X({name:"VirtualListRow",props:{index:{type:Number,required:!0},item:{type:Object,required:!0}},setup(){const{startIndexRef:e,endIndexRef:t,columnsRef:n,getLeft:o,renderColRef:d,renderItemWithColsRef:c}=Ne(ot);return{startIndex:e,endIndex:t,columns:n,renderCol:d,renderItemWithCols:c,getLeft:o}},render(){const{startIndex:e,endIndex:t,columns:n,renderCol:o,renderItemWithCols:d,getLeft:c,item:f}=this;if(d!=null)return d({itemIndex:this.index,startColIndex:e,endColIndex:t,allColumns:n,item:f,getLeft:c});if(o!=null){const l=[];for(let g=e;g<=t;++g){const p=n[g];l.push(o({column:p,left:c(g),item:f}))}return l}return null}}),yn=Oe(".v-vl",{maxHeight:"inherit",height:"100%",overflow:"auto",minWidth:"1px"},[Oe("&:not(.v-vl--show-scrollbar)",{scrollbarWidth:"none"},[Oe("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb",{width:0,height:0,display:"none"})])]),Cn=X({name:"VirtualList",inheritAttrs:!1,props:{showScrollbar:{type:Boolean,default:!0},columns:{type:Array,default:()=>[]},renderCol:Function,renderItemWithCols:Function,items:{type:Array,default:()=>[]},itemSize:{type:Number,required:!0},itemResizable:Boolean,itemsStyle:[String,Object],visibleItemsTag:{type:[String,Object],default:"div"},visibleItemsProps:Object,ignoreItemResize:Boolean,onScroll:Function,onWheel:Function,onResize:Function,defaultScrollKey:[Number,String],defaultScrollIndex:Number,keyField:{type:String,default:"key"},paddingTop:{type:[Number,String],default:0},paddingBottom:{type:[Number,String],default:0}},setup(e){const t=Zt();yn.mount({id:"vueuc/virtual-list",head:!0,anchorMetaName:fn,ssr:t}),pe(()=>{const{defaultScrollIndex:s,defaultScrollKey:v}=e;s!=null?L({index:s}):v!=null&&L({key:v})});let n=!1,o=!1;Jt(()=>{if(n=!1,!o){o=!0;return}L({top:y.value,left:f.value})}),Qt(()=>{n=!0,o||(o=!0)});const d=te(()=>{if(e.renderCol==null&&e.renderItemWithCols==null||e.columns.length===0)return;let s=0;return e.columns.forEach(v=>{s+=v.width}),s}),c=F(()=>{const s=new Map,{keyField:v}=e;return e.items.forEach((z,_)=>{s.set(z[v],_)}),s}),{scrollLeftRef:f,listWidthRef:l}=xn({columnsRef:W(e,"columns"),renderColRef:W(e,"renderCol"),renderItemWithColsRef:W(e,"renderItemWithCols")}),g=k(null),p=k(void 0),b=new Map,m=F(()=>{const{items:s,itemSize:v,keyField:z}=e,_=new nt(s.length,v);return s.forEach(($,B)=>{const M=$[z],P=b.get(M);P!==void 0&&_.add(B,P)}),_}),x=k(0),y=k(0),w=te(()=>Math.max(m.value.getBound(y.value-Be(e.paddingTop))-1,0)),O=F(()=>{const{value:s}=p;if(s===void 0)return[];const{items:v,itemSize:z}=e,_=w.value,$=Math.min(_+Math.ceil(s/z+1),v.length-1),B=[];for(let M=_;M<=$;++M)B.push(v[M]);return B}),L=(s,v)=>{if(typeof s=="number"){A(s,v,"auto");return}const{left:z,top:_,index:$,key:B,position:M,behavior:P,debounce:H=!0}=s;if(z!==void 0||_!==void 0)A(z,_,P);else if($!==void 0)E($,P,H);else if(B!==void 0){const r=c.value.get(B);r!==void 0&&E(r,P,H)}else M==="bottom"?A(0,Number.MAX_SAFE_INTEGER,P):M==="top"&&A(0,0,P)};let C,R=null;function E(s,v,z){const{value:_}=m,$=_.sum(s)+Be(e.paddingTop);if(!z)g.value.scrollTo({left:0,top:$,behavior:v});else{C=s,R!==null&&window.clearTimeout(R),R=window.setTimeout(()=>{C=void 0,R=null},16);const{scrollTop:B,offsetHeight:M}=g.value;if($>B){const P=_.get(s);$+P<=B+M||g.value.scrollTo({left:0,top:$+P-M,behavior:v})}else g.value.scrollTo({left:0,top:$,behavior:v})}}function A(s,v,z){g.value.scrollTo({left:s,top:v,behavior:z})}function K(s,v){var z,_,$;if(n||e.ignoreItemResize||Z(v.target))return;const{value:B}=m,M=c.value.get(s),P=B.get(M),H=($=(_=(z=v.borderBoxSize)===null||z===void 0?void 0:z[0])===null||_===void 0?void 0:_.blockSize)!==null&&$!==void 0?$:v.contentRect.height;if(H===P)return;H-e.itemSize===0?b.delete(s):b.set(s,H-e.itemSize);const u=H-P;if(u===0)return;B.add(M,u);const T=g.value;if(T!=null){if(C===void 0){const j=B.sum(M);T.scrollTop>j&&T.scrollBy(0,u)}else if(M<C)T.scrollBy(0,u);else if(M===C){const j=B.sum(M);H+j>T.scrollTop+T.offsetHeight&&T.scrollBy(0,u)}Y()}x.value++}const V=!wn();let q=!1;function Q(s){var v;(v=e.onScroll)===null||v===void 0||v.call(e,s),(!V||!q)&&Y()}function ee(s){var v;if((v=e.onWheel)===null||v===void 0||v.call(e,s),V){const z=g.value;if(z!=null){if(s.deltaX===0&&(z.scrollTop===0&&s.deltaY<=0||z.scrollTop+z.offsetHeight>=z.scrollHeight&&s.deltaY>=0))return;s.preventDefault(),z.scrollTop+=s.deltaY/Ge(),z.scrollLeft+=s.deltaX/Ge(),Y(),q=!0,hn(()=>{q=!1})}}}function ne(s){if(n||Z(s.target))return;if(e.renderCol==null&&e.renderItemWithCols==null){if(s.contentRect.height===p.value)return}else if(s.contentRect.height===p.value&&s.contentRect.width===l.value)return;p.value=s.contentRect.height,l.value=s.contentRect.width;const{onResize:v}=e;v!==void 0&&v(s)}function Y(){const{value:s}=g;s!=null&&(y.value=s.scrollTop,f.value=s.scrollLeft)}function Z(s){let v=s;for(;v!==null;){if(v.style.display==="none")return!0;v=v.parentElement}return!1}return{listHeight:p,listStyle:{overflow:"auto"},keyToIndex:c,itemsStyle:F(()=>{const{itemResizable:s}=e,v=se(m.value.sum());return x.value,[e.itemsStyle,{boxSizing:"content-box",width:se(d.value),height:s?"":v,minHeight:s?v:"",paddingTop:se(e.paddingTop),paddingBottom:se(e.paddingBottom)}]}),visibleItemsStyle:F(()=>(x.value,{transform:`translateY(${se(m.value.sum(w.value))})`})),viewportItems:O,listElRef:g,itemsElRef:k(null),scrollTo:L,handleListResize:ne,handleListScroll:Q,handleListWheel:ee,handleItemResize:K}},render(){const{itemResizable:e,keyField:t,keyToIndex:n,visibleItemsTag:o}=this;return a(De,{onResize:this.handleListResize},{default:()=>{var d,c;return a("div",Yt(this.$attrs,{class:["v-vl",this.showScrollbar&&"v-vl--show-scrollbar"],onScroll:this.handleListScroll,onWheel:this.handleListWheel,ref:"listElRef"}),[this.items.length!==0?a("div",{ref:"itemsElRef",class:"v-vl-items",style:this.itemsStyle},[a(o,Object.assign({class:"v-vl-visible-items",style:this.visibleItemsStyle},this.visibleItemsProps),{default:()=>{const{renderCol:f,renderItemWithCols:l}=this;return this.viewportItems.map(g=>{const p=g[t],b=n.get(p),m=f!=null?a(Ue,{index:b,item:g}):void 0,x=l!=null?a(Ue,{index:b,item:g}):void 0,y=this.$slots.default({item:g,renderedCols:m,renderedItemWithCols:x,index:b})[0];return e?a(De,{key:p,onResize:w=>this.handleItemResize(p,w)},{default:()=>y}):(y.key=p,y)})}})]):(c=(d=this.$slots).empty)===null||c===void 0?void 0:c.call(d)])}})}});function it(e,t){t&&(pe(()=>{const{value:n}=e;n&&Pe.registerHandler(n,t)}),ie(e,(n,o)=>{o&&Pe.unregisterHandler(o)},{deep:!1}),Je(()=>{const{value:n}=e;n&&Pe.unregisterHandler(n)}))}function Xe(e){switch(typeof e){case"string":return e||void 0;case"number":return String(e);default:return}}function Ee(e){const t=e.filter(n=>n!==void 0);if(t.length!==0)return t.length===1?t[0]:n=>{e.forEach(o=>{o&&o(n)})}}const Rn=X({name:"Checkmark",render(){return a("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16"},a("g",{fill:"none"},a("path",{d:"M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z",fill:"currentColor"})))}}),Sn=X({name:"Empty",render(){return a("svg",{viewBox:"0 0 28 28",fill:"none",xmlns:"http://www.w3.org/2000/svg"},a("path",{d:"M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z",fill:"currentColor"}),a("path",{d:"M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z",fill:"currentColor"}))}}),zn=X({props:{onFocus:Function,onBlur:Function},setup(e){return()=>a("div",{style:"width: 0; height: 0",tabindex:0,onFocus:e.onFocus,onBlur:e.onBlur})}}),In=S("empty",`
 display: flex;
 flex-direction: column;
 align-items: center;
 font-size: var(--n-font-size);
`,[I("icon",`
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 line-height: var(--n-icon-size);
 color: var(--n-icon-color);
 transition:
 color .3s var(--n-bezier);
 `,[U("+",[I("description",`
 margin-top: 8px;
 `)])]),I("description",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 `),I("extra",`
 text-align: center;
 transition: color .3s var(--n-bezier);
 margin-top: 12px;
 color: var(--n-extra-text-color);
 `)]),Tn=Object.assign(Object.assign({},le.props),{description:String,showDescription:{type:Boolean,default:!0},showIcon:{type:Boolean,default:!0},size:{type:String,default:"medium"},renderIcon:Function}),kn=X({name:"Empty",props:Tn,slots:Object,setup(e){const{mergedClsPrefixRef:t,inlineThemeDisabled:n,mergedComponentPropsRef:o}=He(e),d=le("Empty","-empty",In,en,e,t),{localeRef:c}=gn("Empty"),f=F(()=>{var b,m,x;return(b=e.description)!==null&&b!==void 0?b:(x=(m=o==null?void 0:o.value)===null||m===void 0?void 0:m.Empty)===null||x===void 0?void 0:x.description}),l=F(()=>{var b,m;return((m=(b=o==null?void 0:o.value)===null||b===void 0?void 0:b.Empty)===null||m===void 0?void 0:m.renderIcon)||(()=>a(Sn,null))}),g=F(()=>{const{size:b}=e,{common:{cubicBezierEaseInOut:m},self:{[J("iconSize",b)]:x,[J("fontSize",b)]:y,textColor:w,iconColor:O,extraTextColor:L}}=d.value;return{"--n-icon-size":x,"--n-font-size":y,"--n-bezier":m,"--n-text-color":w,"--n-icon-color":O,"--n-extra-text-color":L}}),p=n?We("empty",F(()=>{let b="";const{size:m}=e;return b+=m[0],b}),g,e):void 0;return{mergedClsPrefix:t,mergedRenderIcon:l,localizedDescription:F(()=>f.value||c.value.description),cssVars:n?void 0:g,themeClass:p==null?void 0:p.themeClass,onRender:p==null?void 0:p.onRender}},render(){const{$slots:e,mergedClsPrefix:t,onRender:n}=this;return n==null||n(),a("div",{class:[`${t}-empty`,this.themeClass],style:this.cssVars},this.showIcon?a("div",{class:`${t}-empty__icon`},e.icon?e.icon():a(Qe,{clsPrefix:t},{default:this.mergedRenderIcon})):null,this.showDescription?a("div",{class:`${t}-empty__description`},e.default?e.default():this.localizedDescription):null,e.extra?a("div",{class:`${t}-empty__extra`},e.extra()):null)}}),Ye=X({name:"NBaseSelectGroupHeader",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(){const{renderLabelRef:e,renderOptionRef:t,labelFieldRef:n,nodePropsRef:o}=Ne(Ae);return{labelField:n,nodeProps:o,renderLabel:e,renderOption:t}},render(){const{clsPrefix:e,renderLabel:t,renderOption:n,nodeProps:o,tmNode:{rawNode:d}}=this,c=o==null?void 0:o(d),f=t?t(d,!1):oe(d[this.labelField],d,!1),l=a("div",Object.assign({},c,{class:[`${e}-base-select-group-header`,c==null?void 0:c.class]}),f);return d.render?d.render({node:l,option:d}):n?n({node:l,option:d,selected:!1}):l}});function Fn(e,t){return a(tn,{name:"fade-in-scale-up-transition"},{default:()=>e?a(Qe,{clsPrefix:t,class:`${t}-base-select-option__check`},{default:()=>a(Rn)}):null})}const Ze=X({name:"NBaseSelectOption",props:{clsPrefix:{type:String,required:!0},tmNode:{type:Object,required:!0}},setup(e){const{valueRef:t,pendingTmNodeRef:n,multipleRef:o,valueSetRef:d,renderLabelRef:c,renderOptionRef:f,labelFieldRef:l,valueFieldRef:g,showCheckmarkRef:p,nodePropsRef:b,handleOptionClick:m,handleOptionMouseEnter:x}=Ne(Ae),y=te(()=>{const{value:C}=n;return C?e.tmNode.key===C.key:!1});function w(C){const{tmNode:R}=e;R.disabled||m(C,R)}function O(C){const{tmNode:R}=e;R.disabled||x(C,R)}function L(C){const{tmNode:R}=e,{value:E}=y;R.disabled||E||x(C,R)}return{multiple:o,isGrouped:te(()=>{const{tmNode:C}=e,{parent:R}=C;return R&&R.rawNode.type==="group"}),showCheckmark:p,nodeProps:b,isPending:y,isSelected:te(()=>{const{value:C}=t,{value:R}=o;if(C===null)return!1;const E=e.tmNode.rawNode[g.value];if(R){const{value:A}=d;return A.has(E)}else return C===E}),labelField:l,renderLabel:c,renderOption:f,handleMouseMove:L,handleMouseEnter:O,handleClick:w}},render(){const{clsPrefix:e,tmNode:{rawNode:t},isSelected:n,isPending:o,isGrouped:d,showCheckmark:c,nodeProps:f,renderOption:l,renderLabel:g,handleClick:p,handleMouseEnter:b,handleMouseMove:m}=this,x=Fn(n,e),y=g?[g(t,n),c&&x]:[oe(t[this.labelField],t,n),c&&x],w=f==null?void 0:f(t),O=a("div",Object.assign({},w,{class:[`${e}-base-select-option`,t.class,w==null?void 0:w.class,{[`${e}-base-select-option--disabled`]:t.disabled,[`${e}-base-select-option--selected`]:n,[`${e}-base-select-option--grouped`]:d,[`${e}-base-select-option--pending`]:o,[`${e}-base-select-option--show-checkmark`]:c}],style:[(w==null?void 0:w.style)||"",t.style||""],onClick:Ee([p,w==null?void 0:w.onClick]),onMouseenter:Ee([b,w==null?void 0:w.onMouseenter]),onMousemove:Ee([m,w==null?void 0:w.onMousemove])}),a("div",{class:`${e}-base-select-option__content`},y));return t.render?t.render({node:O,option:t,selected:n}):l?l({node:O,option:t,selected:n}):O}}),Pn=S("base-select-menu",`
 line-height: 1.5;
 outline: none;
 z-index: 0;
 position: relative;
 border-radius: var(--n-border-radius);
 transition:
 background-color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-color);
`,[S("scrollbar",`
 max-height: var(--n-height);
 `),S("virtual-list",`
 max-height: var(--n-height);
 `),S("base-select-option",`
 min-height: var(--n-option-height);
 font-size: var(--n-option-font-size);
 display: flex;
 align-items: center;
 `,[I("content",`
 z-index: 1;
 white-space: nowrap;
 text-overflow: ellipsis;
 overflow: hidden;
 `)]),S("base-select-group-header",`
 min-height: var(--n-option-height);
 font-size: .93em;
 display: flex;
 align-items: center;
 `),S("base-select-menu-option-wrapper",`
 position: relative;
 width: 100%;
 `),I("loading, empty",`
 display: flex;
 padding: 12px 32px;
 flex: 1;
 justify-content: center;
 `),I("loading",`
 color: var(--n-loading-color);
 font-size: var(--n-loading-size);
 `),I("header",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-bottom: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),I("action",`
 padding: 8px var(--n-option-padding-left);
 font-size: var(--n-option-font-size);
 transition: 
 color .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 border-top: 1px solid var(--n-action-divider-color);
 color: var(--n-action-text-color);
 `),S("base-select-group-header",`
 position: relative;
 cursor: default;
 padding: var(--n-option-padding);
 color: var(--n-group-header-text-color);
 `),S("base-select-option",`
 cursor: pointer;
 position: relative;
 padding: var(--n-option-padding);
 transition:
 color .3s var(--n-bezier),
 opacity .3s var(--n-bezier);
 box-sizing: border-box;
 color: var(--n-option-text-color);
 opacity: 1;
 `,[D("show-checkmark",`
 padding-right: calc(var(--n-option-padding-right) + 20px);
 `),U("&::before",`
 content: "";
 position: absolute;
 left: 4px;
 right: 4px;
 top: 0;
 bottom: 0;
 border-radius: var(--n-border-radius);
 transition: background-color .3s var(--n-bezier);
 `),U("&:active",`
 color: var(--n-option-text-color-pressed);
 `),D("grouped",`
 padding-left: calc(var(--n-option-padding-left) * 1.5);
 `),D("pending",[U("&::before",`
 background-color: var(--n-option-color-pending);
 `)]),D("selected",`
 color: var(--n-option-text-color-active);
 `,[U("&::before",`
 background-color: var(--n-option-color-active);
 `),D("pending",[U("&::before",`
 background-color: var(--n-option-color-active-pending);
 `)])]),D("disabled",`
 cursor: not-allowed;
 `,[Le("selected",`
 color: var(--n-option-text-color-disabled);
 `),D("selected",`
 opacity: var(--n-option-opacity-disabled);
 `)]),I("check",`
 font-size: 16px;
 position: absolute;
 right: calc(var(--n-option-padding-right) - 4px);
 top: calc(50% - 7px);
 color: var(--n-option-check-color);
 transition: color .3s var(--n-bezier);
 `,[nn({enterScale:"0.5"})])])]),Ln=X({name:"InternalSelectMenu",props:Object.assign(Object.assign({},le.props),{clsPrefix:{type:String,required:!0},scrollable:{type:Boolean,default:!0},treeMate:{type:Object,required:!0},multiple:Boolean,size:{type:String,default:"medium"},value:{type:[String,Number,Array],default:null},autoPending:Boolean,virtualScroll:{type:Boolean,default:!0},show:{type:Boolean,default:!0},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},loading:Boolean,focusable:Boolean,renderLabel:Function,renderOption:Function,nodeProps:Function,showCheckmark:{type:Boolean,default:!0},onMousedown:Function,onScroll:Function,onFocus:Function,onBlur:Function,onKeyup:Function,onKeydown:Function,onTabOut:Function,onMouseenter:Function,onMouseleave:Function,onResize:Function,resetMenuOnOptionsChange:{type:Boolean,default:!0},inlineThemeDisabled:Boolean,onToggle:Function}),setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:n}=He(e),o=et("InternalSelectMenu",n,t),d=le("InternalSelectMenu","-internal-select-menu",Pn,an,e,W(e,"clsPrefix")),c=k(null),f=k(null),l=k(null),g=F(()=>e.treeMate.getFlattenedNodes()),p=F(()=>pn(g.value)),b=k(null);function m(){const{treeMate:r}=e;let u=null;const{value:T}=e;T===null?u=r.getFirstAvailableNode():(e.multiple?u=r.getNode((T||[])[(T||[]).length-1]):u=r.getNode(T),(!u||u.disabled)&&(u=r.getFirstAvailableNode())),v(u||null)}function x(){const{value:r}=b;r&&!e.treeMate.getNode(r.key)&&(b.value=null)}let y;ie(()=>e.show,r=>{r?y=ie(()=>e.treeMate,()=>{e.resetMenuOnOptionsChange?(e.autoPending?m():x(),tt(z)):x()},{immediate:!0}):y==null||y()},{immediate:!0}),Je(()=>{y==null||y()});const w=F(()=>Be(d.value.self[J("optionHeight",e.size)])),O=F(()=>de(d.value.self[J("padding",e.size)])),L=F(()=>e.multiple&&Array.isArray(e.value)?new Set(e.value):new Set),C=F(()=>{const r=g.value;return r&&r.length===0});function R(r){const{onToggle:u}=e;u&&u(r)}function E(r){const{onScroll:u}=e;u&&u(r)}function A(r){var u;(u=l.value)===null||u===void 0||u.sync(),E(r)}function K(){var r;(r=l.value)===null||r===void 0||r.sync()}function V(){const{value:r}=b;return r||null}function q(r,u){u.disabled||v(u,!1)}function Q(r,u){u.disabled||R(u)}function ee(r){var u;je(r,"action")||(u=e.onKeyup)===null||u===void 0||u.call(e,r)}function ne(r){var u;je(r,"action")||(u=e.onKeydown)===null||u===void 0||u.call(e,r)}function Y(r){var u;(u=e.onMousedown)===null||u===void 0||u.call(e,r),!e.focusable&&r.preventDefault()}function Z(){const{value:r}=b;r&&v(r.getNext({loop:!0}),!0)}function s(){const{value:r}=b;r&&v(r.getPrev({loop:!0}),!0)}function v(r,u=!1){b.value=r,u&&z()}function z(){var r,u;const T=b.value;if(!T)return;const j=p.value(T.key);j!==null&&(e.virtualScroll?(r=f.value)===null||r===void 0||r.scrollTo({index:j}):(u=l.value)===null||u===void 0||u.scrollTo({index:j,elSize:w.value}))}function _(r){var u,T;!((u=c.value)===null||u===void 0)&&u.contains(r.target)&&((T=e.onFocus)===null||T===void 0||T.call(e,r))}function $(r){var u,T;!((u=c.value)===null||u===void 0)&&u.contains(r.relatedTarget)||(T=e.onBlur)===null||T===void 0||T.call(e,r)}$e(Ae,{handleOptionMouseEnter:q,handleOptionClick:Q,valueSetRef:L,pendingTmNodeRef:b,nodePropsRef:W(e,"nodeProps"),showCheckmarkRef:W(e,"showCheckmark"),multipleRef:W(e,"multiple"),valueRef:W(e,"value"),renderLabelRef:W(e,"renderLabel"),renderOptionRef:W(e,"renderOption"),labelFieldRef:W(e,"labelField"),valueFieldRef:W(e,"valueField")}),$e(vn,c),pe(()=>{const{value:r}=l;r&&r.sync()});const B=F(()=>{const{size:r}=e,{common:{cubicBezierEaseInOut:u},self:{height:T,borderRadius:j,color:ge,groupHeaderTextColor:me,actionDividerColor:we,optionTextColorPressed:xe,optionTextColor:ye,optionTextColorDisabled:Ce,optionTextColorActive:Re,optionOpacityDisabled:Se,optionCheckColor:ze,actionTextColor:Ie,optionColorPending:re,optionColorActive:ae,loadingColor:Te,loadingSize:ke,optionColorActivePending:Fe,[J("optionFontSize",r)]:ce,[J("optionHeight",r)]:ue,[J("optionPadding",r)]:G}}=d.value;return{"--n-height":T,"--n-action-divider-color":we,"--n-action-text-color":Ie,"--n-bezier":u,"--n-border-radius":j,"--n-color":ge,"--n-option-font-size":ce,"--n-group-header-text-color":me,"--n-option-check-color":ze,"--n-option-color-pending":re,"--n-option-color-active":ae,"--n-option-color-active-pending":Fe,"--n-option-height":ue,"--n-option-opacity-disabled":Se,"--n-option-text-color":ye,"--n-option-text-color-active":Re,"--n-option-text-color-disabled":Ce,"--n-option-text-color-pressed":xe,"--n-option-padding":G,"--n-option-padding-left":de(G,"left"),"--n-option-padding-right":de(G,"right"),"--n-loading-color":Te,"--n-loading-size":ke}}),{inlineThemeDisabled:M}=e,P=M?We("internal-select-menu",F(()=>e.size[0]),B,e):void 0,H={selfRef:c,next:Z,prev:s,getPendingTmNode:V};return it(c,e.onResize),Object.assign({mergedTheme:d,mergedClsPrefix:t,rtlEnabled:o,virtualListRef:f,scrollbarRef:l,itemSize:w,padding:O,flattenedNodes:g,empty:C,virtualListContainer(){const{value:r}=f;return r==null?void 0:r.listElRef},virtualListContent(){const{value:r}=f;return r==null?void 0:r.itemsElRef},doScroll:E,handleFocusin:_,handleFocusout:$,handleKeyUp:ee,handleKeyDown:ne,handleMouseDown:Y,handleVirtualListResize:K,handleVirtualListScroll:A,cssVars:M?void 0:B,themeClass:P==null?void 0:P.themeClass,onRender:P==null?void 0:P.onRender},H)},render(){const{$slots:e,virtualScroll:t,clsPrefix:n,mergedTheme:o,themeClass:d,onRender:c}=this;return c==null||c(),a("div",{ref:"selfRef",tabindex:this.focusable?0:-1,class:[`${n}-base-select-menu`,this.rtlEnabled&&`${n}-base-select-menu--rtl`,d,this.multiple&&`${n}-base-select-menu--multiple`],style:this.cssVars,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onKeyup:this.handleKeyUp,onKeydown:this.handleKeyDown,onMousedown:this.handleMouseDown,onMouseenter:this.onMouseenter,onMouseleave:this.onMouseleave},Ve(e.header,f=>f&&a("div",{class:`${n}-base-select-menu__header`,"data-header":!0,key:"header"},f)),this.loading?a("div",{class:`${n}-base-select-menu__loading`},a(on,{clsPrefix:n,strokeWidth:20})):this.empty?a("div",{class:`${n}-base-select-menu__empty`,"data-empty":!0},rn(e.empty,()=>[a(kn,{theme:o.peers.Empty,themeOverrides:o.peerOverrides.Empty,size:this.size})])):a(ln,{ref:"scrollbarRef",theme:o.peers.Scrollbar,themeOverrides:o.peerOverrides.Scrollbar,scrollable:this.scrollable,container:t?this.virtualListContainer:void 0,content:t?this.virtualListContent:void 0,onScroll:t?void 0:this.doScroll},{default:()=>t?a(Cn,{ref:"virtualListRef",class:`${n}-virtual-list`,items:this.flattenedNodes,itemSize:this.itemSize,showScrollbar:!1,paddingTop:this.padding.top,paddingBottom:this.padding.bottom,onResize:this.handleVirtualListResize,onScroll:this.handleVirtualListScroll,itemResizable:!0},{default:({item:f})=>f.isGroup?a(Ye,{key:f.key,clsPrefix:n,tmNode:f}):f.ignored?null:a(Ze,{clsPrefix:n,key:f.key,tmNode:f})}):a("div",{class:`${n}-base-select-menu-option-wrapper`,style:{paddingTop:this.padding.top,paddingBottom:this.padding.bottom}},this.flattenedNodes.map(f=>f.isGroup?a(Ye,{key:f.key,clsPrefix:n,tmNode:f}):a(Ze,{clsPrefix:n,key:f.key,tmNode:f})))}),Ve(e.action,f=>f&&[a("div",{class:`${n}-base-select-menu__action`,"data-action":!0,key:"action"},f),a(zn,{onFocus:this.onTabOut,key:"focus-detector"})]))}}),On=U([S("base-selection",`
 --n-padding-single: var(--n-padding-single-top) var(--n-padding-single-right) var(--n-padding-single-bottom) var(--n-padding-single-left);
 --n-padding-multiple: var(--n-padding-multiple-top) var(--n-padding-multiple-right) var(--n-padding-multiple-bottom) var(--n-padding-multiple-left);
 position: relative;
 z-index: auto;
 box-shadow: none;
 width: 100%;
 max-width: 100%;
 display: inline-block;
 vertical-align: bottom;
 border-radius: var(--n-border-radius);
 min-height: var(--n-height);
 line-height: 1.5;
 font-size: var(--n-font-size);
 `,[S("base-loading",`
 color: var(--n-loading-color);
 `),S("base-selection-tags","min-height: var(--n-height);"),I("border, state-border",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 pointer-events: none;
 border: var(--n-border);
 border-radius: inherit;
 transition:
 box-shadow .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `),I("state-border",`
 z-index: 1;
 border-color: #0000;
 `),S("base-suffix",`
 cursor: pointer;
 position: absolute;
 top: 50%;
 transform: translateY(-50%);
 right: 10px;
 `,[I("arrow",`
 font-size: var(--n-arrow-size);
 color: var(--n-arrow-color);
 transition: color .3s var(--n-bezier);
 `)]),S("base-selection-overlay",`
 display: flex;
 align-items: center;
 white-space: nowrap;
 pointer-events: none;
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 padding: var(--n-padding-single);
 transition: color .3s var(--n-bezier);
 `,[I("wrapper",`
 flex-basis: 0;
 flex-grow: 1;
 overflow: hidden;
 text-overflow: ellipsis;
 `)]),S("base-selection-placeholder",`
 color: var(--n-placeholder-color);
 `,[I("inner",`
 max-width: 100%;
 overflow: hidden;
 `)]),S("base-selection-tags",`
 cursor: pointer;
 outline: none;
 box-sizing: border-box;
 position: relative;
 z-index: auto;
 display: flex;
 padding: var(--n-padding-multiple);
 flex-wrap: wrap;
 align-items: center;
 width: 100%;
 vertical-align: bottom;
 background-color: var(--n-color);
 border-radius: inherit;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `),S("base-selection-label",`
 height: var(--n-height);
 display: inline-flex;
 width: 100%;
 vertical-align: bottom;
 cursor: pointer;
 outline: none;
 z-index: auto;
 box-sizing: border-box;
 position: relative;
 transition:
 color .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: inherit;
 background-color: var(--n-color);
 align-items: center;
 `,[S("base-selection-input",`
 font-size: inherit;
 line-height: inherit;
 outline: none;
 cursor: pointer;
 box-sizing: border-box;
 border:none;
 width: 100%;
 padding: var(--n-padding-single);
 background-color: #0000;
 color: var(--n-text-color);
 transition: color .3s var(--n-bezier);
 caret-color: var(--n-caret-color);
 `,[I("content",`
 text-overflow: ellipsis;
 overflow: hidden;
 white-space: nowrap; 
 `)]),I("render-label",`
 color: var(--n-text-color);
 `)]),Le("disabled",[U("&:hover",[I("state-border",`
 box-shadow: var(--n-box-shadow-hover);
 border: var(--n-border-hover);
 `)]),D("focus",[I("state-border",`
 box-shadow: var(--n-box-shadow-focus);
 border: var(--n-border-focus);
 `)]),D("active",[I("state-border",`
 box-shadow: var(--n-box-shadow-active);
 border: var(--n-border-active);
 `),S("base-selection-label","background-color: var(--n-color-active);"),S("base-selection-tags","background-color: var(--n-color-active);")])]),D("disabled","cursor: not-allowed;",[I("arrow",`
 color: var(--n-arrow-color-disabled);
 `),S("base-selection-label",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `,[S("base-selection-input",`
 cursor: not-allowed;
 color: var(--n-text-color-disabled);
 `),I("render-label",`
 color: var(--n-text-color-disabled);
 `)]),S("base-selection-tags",`
 cursor: not-allowed;
 background-color: var(--n-color-disabled);
 `),S("base-selection-placeholder",`
 cursor: not-allowed;
 color: var(--n-placeholder-color-disabled);
 `)]),S("base-selection-input-tag",`
 height: calc(var(--n-height) - 6px);
 line-height: calc(var(--n-height) - 6px);
 outline: none;
 display: none;
 position: relative;
 margin-bottom: 3px;
 max-width: 100%;
 vertical-align: bottom;
 `,[I("input",`
 font-size: inherit;
 font-family: inherit;
 min-width: 1px;
 padding: 0;
 background-color: #0000;
 outline: none;
 border: none;
 max-width: 100%;
 overflow: hidden;
 width: 1em;
 line-height: inherit;
 cursor: pointer;
 color: var(--n-text-color);
 caret-color: var(--n-caret-color);
 `),I("mirror",`
 position: absolute;
 left: 0;
 top: 0;
 white-space: pre;
 visibility: hidden;
 user-select: none;
 -webkit-user-select: none;
 opacity: 0;
 `)]),["warning","error"].map(e=>D(`${e}-status`,[I("state-border",`border: var(--n-border-${e});`),Le("disabled",[U("&:hover",[I("state-border",`
 box-shadow: var(--n-box-shadow-hover-${e});
 border: var(--n-border-hover-${e});
 `)]),D("active",[I("state-border",`
 box-shadow: var(--n-box-shadow-active-${e});
 border: var(--n-border-active-${e});
 `),S("base-selection-label",`background-color: var(--n-color-active-${e});`),S("base-selection-tags",`background-color: var(--n-color-active-${e});`)]),D("focus",[I("state-border",`
 box-shadow: var(--n-box-shadow-focus-${e});
 border: var(--n-border-focus-${e});
 `)])])]))]),S("base-selection-popover",`
 margin-bottom: -3px;
 display: flex;
 flex-wrap: wrap;
 margin-right: -8px;
 `),S("base-selection-tag-wrapper",`
 max-width: 100%;
 display: inline-flex;
 padding: 0 7px 3px 0;
 `,[U("&:last-child","padding-right: 0;"),S("tag",`
 font-size: 14px;
 max-width: 100%;
 `,[I("content",`
 line-height: 1.25;
 text-overflow: ellipsis;
 overflow: hidden;
 `)])])]),Nn=X({name:"InternalSelection",props:Object.assign(Object.assign({},le.props),{clsPrefix:{type:String,required:!0},bordered:{type:Boolean,default:void 0},active:Boolean,pattern:{type:String,default:""},placeholder:String,selectedOption:{type:Object,default:null},selectedOptions:{type:Array,default:null},labelField:{type:String,default:"label"},valueField:{type:String,default:"value"},multiple:Boolean,filterable:Boolean,clearable:Boolean,disabled:Boolean,size:{type:String,default:"medium"},loading:Boolean,autofocus:Boolean,showArrow:{type:Boolean,default:!0},inputProps:Object,focused:Boolean,renderTag:Function,onKeydown:Function,onClick:Function,onBlur:Function,onFocus:Function,onDeleteOption:Function,maxTagCount:[String,Number],ellipsisTagPopoverProps:Object,onClear:Function,onPatternInput:Function,onPatternFocus:Function,onPatternBlur:Function,renderLabel:Function,status:String,inlineThemeDisabled:Boolean,ignoreComposition:{type:Boolean,default:!0},onResize:Function}),setup(e){const{mergedClsPrefixRef:t,mergedRtlRef:n}=He(e),o=et("InternalSelection",n,t),d=k(null),c=k(null),f=k(null),l=k(null),g=k(null),p=k(null),b=k(null),m=k(null),x=k(null),y=k(null),w=k(!1),O=k(!1),L=k(!1),C=le("InternalSelection","-internal-selection",On,cn,e,W(e,"clsPrefix")),R=F(()=>e.clearable&&!e.disabled&&(L.value||e.active)),E=F(()=>e.selectedOption?e.renderTag?e.renderTag({option:e.selectedOption,handleClose:()=>{}}):e.renderLabel?e.renderLabel(e.selectedOption,!0):oe(e.selectedOption[e.labelField],e.selectedOption,!0):e.placeholder),A=F(()=>{const i=e.selectedOption;if(i)return i[e.labelField]}),K=F(()=>e.multiple?!!(Array.isArray(e.selectedOptions)&&e.selectedOptions.length):e.selectedOption!==null);function V(){var i;const{value:h}=d;if(h){const{value:N}=c;N&&(N.style.width=`${h.offsetWidth}px`,e.maxTagCount!=="responsive"&&((i=x.value)===null||i===void 0||i.sync({showAllItemsBeforeCalculate:!1})))}}function q(){const{value:i}=y;i&&(i.style.display="none")}function Q(){const{value:i}=y;i&&(i.style.display="inline-block")}ie(W(e,"active"),i=>{i||q()}),ie(W(e,"pattern"),()=>{e.multiple&&tt(V)});function ee(i){const{onFocus:h}=e;h&&h(i)}function ne(i){const{onBlur:h}=e;h&&h(i)}function Y(i){const{onDeleteOption:h}=e;h&&h(i)}function Z(i){const{onClear:h}=e;h&&h(i)}function s(i){const{onPatternInput:h}=e;h&&h(i)}function v(i){var h;(!i.relatedTarget||!(!((h=f.value)===null||h===void 0)&&h.contains(i.relatedTarget)))&&ee(i)}function z(i){var h;!((h=f.value)===null||h===void 0)&&h.contains(i.relatedTarget)||ne(i)}function _(i){Z(i)}function $(){L.value=!0}function B(){L.value=!1}function M(i){!e.active||!e.filterable||i.target!==c.value&&i.preventDefault()}function P(i){Y(i)}const H=k(!1);function r(i){if(i.key==="Backspace"&&!H.value&&!e.pattern.length){const{selectedOptions:h}=e;h!=null&&h.length&&P(h[h.length-1])}}let u=null;function T(i){const{value:h}=d;if(h){const N=i.target.value;h.textContent=N,V()}e.ignoreComposition&&H.value?u=i:s(i)}function j(){H.value=!0}function ge(){H.value=!1,e.ignoreComposition&&s(u),u=null}function me(i){var h;O.value=!0,(h=e.onPatternFocus)===null||h===void 0||h.call(e,i)}function we(i){var h;O.value=!1,(h=e.onPatternBlur)===null||h===void 0||h.call(e,i)}function xe(){var i,h;if(e.filterable)O.value=!1,(i=p.value)===null||i===void 0||i.blur(),(h=c.value)===null||h===void 0||h.blur();else if(e.multiple){const{value:N}=l;N==null||N.blur()}else{const{value:N}=g;N==null||N.blur()}}function ye(){var i,h,N;e.filterable?(O.value=!1,(i=p.value)===null||i===void 0||i.focus()):e.multiple?(h=l.value)===null||h===void 0||h.focus():(N=g.value)===null||N===void 0||N.focus()}function Ce(){const{value:i}=c;i&&(Q(),i.focus())}function Re(){const{value:i}=c;i&&i.blur()}function Se(i){const{value:h}=b;h&&h.setTextContent(`+${i}`)}function ze(){const{value:i}=m;return i}function Ie(){return c.value}let re=null;function ae(){re!==null&&window.clearTimeout(re)}function Te(){e.active||(ae(),re=window.setTimeout(()=>{K.value&&(w.value=!0)},100))}function ke(){ae()}function Fe(i){i||(ae(),w.value=!1)}ie(K,i=>{i||(w.value=!1)}),pe(()=>{un(()=>{const i=p.value;i&&(e.disabled?i.removeAttribute("tabindex"):i.tabIndex=O.value?-1:0)})}),it(f,e.onResize);const{inlineThemeDisabled:ce}=e,ue=F(()=>{const{size:i}=e,{common:{cubicBezierEaseInOut:h},self:{fontWeight:N,borderRadius:rt,color:at,placeholderColor:st,textColor:dt,paddingSingle:ct,paddingMultiple:ut,caretColor:ft,colorDisabled:ht,textColorDisabled:vt,placeholderColorDisabled:bt,colorActive:pt,boxShadowFocus:gt,boxShadowActive:mt,boxShadowHover:wt,border:xt,borderFocus:yt,borderHover:Ct,borderActive:Rt,arrowColor:St,arrowColorDisabled:zt,loadingColor:It,colorActiveWarning:Tt,boxShadowFocusWarning:kt,boxShadowActiveWarning:Ft,boxShadowHoverWarning:Pt,borderWarning:Ot,borderFocusWarning:Mt,borderHoverWarning:_t,borderActiveWarning:Et,colorActiveError:$t,boxShadowFocusError:Bt,boxShadowActiveError:Lt,boxShadowHoverError:Nt,borderError:Ht,borderFocusError:Wt,borderHoverError:At,borderActiveError:Dt,clearColor:Vt,clearColorHover:jt,clearColorPressed:Kt,clearSize:qt,arrowSize:Gt,[J("height",i)]:Ut,[J("fontSize",i)]:Xt}}=C.value,fe=de(ct),he=de(ut);return{"--n-bezier":h,"--n-border":xt,"--n-border-active":Rt,"--n-border-focus":yt,"--n-border-hover":Ct,"--n-border-radius":rt,"--n-box-shadow-active":mt,"--n-box-shadow-focus":gt,"--n-box-shadow-hover":wt,"--n-caret-color":ft,"--n-color":at,"--n-color-active":pt,"--n-color-disabled":ht,"--n-font-size":Xt,"--n-height":Ut,"--n-padding-single-top":fe.top,"--n-padding-multiple-top":he.top,"--n-padding-single-right":fe.right,"--n-padding-multiple-right":he.right,"--n-padding-single-left":fe.left,"--n-padding-multiple-left":he.left,"--n-padding-single-bottom":fe.bottom,"--n-padding-multiple-bottom":he.bottom,"--n-placeholder-color":st,"--n-placeholder-color-disabled":bt,"--n-text-color":dt,"--n-text-color-disabled":vt,"--n-arrow-color":St,"--n-arrow-color-disabled":zt,"--n-loading-color":It,"--n-color-active-warning":Tt,"--n-box-shadow-focus-warning":kt,"--n-box-shadow-active-warning":Ft,"--n-box-shadow-hover-warning":Pt,"--n-border-warning":Ot,"--n-border-focus-warning":Mt,"--n-border-hover-warning":_t,"--n-border-active-warning":Et,"--n-color-active-error":$t,"--n-box-shadow-focus-error":Bt,"--n-box-shadow-active-error":Lt,"--n-box-shadow-hover-error":Nt,"--n-border-error":Ht,"--n-border-focus-error":Wt,"--n-border-hover-error":At,"--n-border-active-error":Dt,"--n-clear-size":qt,"--n-clear-color":Vt,"--n-clear-color-hover":jt,"--n-clear-color-pressed":Kt,"--n-arrow-size":Gt,"--n-font-weight":N}}),G=ce?We("internal-selection",F(()=>e.size[0]),ue,e):void 0;return{mergedTheme:C,mergedClearable:R,mergedClsPrefix:t,rtlEnabled:o,patternInputFocused:O,filterablePlaceholder:E,label:A,selected:K,showTagsPanel:w,isComposing:H,counterRef:b,counterWrapperRef:m,patternInputMirrorRef:d,patternInputRef:c,selfRef:f,multipleElRef:l,singleElRef:g,patternInputWrapperRef:p,overflowRef:x,inputTagElRef:y,handleMouseDown:M,handleFocusin:v,handleClear:_,handleMouseEnter:$,handleMouseLeave:B,handleDeleteOption:P,handlePatternKeyDown:r,handlePatternInputInput:T,handlePatternInputBlur:we,handlePatternInputFocus:me,handleMouseEnterCounter:Te,handleMouseLeaveCounter:ke,handleFocusout:z,handleCompositionEnd:ge,handleCompositionStart:j,onPopoverUpdateShow:Fe,focus:ye,focusInput:Ce,blur:xe,blurInput:Re,updateCounter:Se,getCounter:ze,getTail:Ie,renderLabel:e.renderLabel,cssVars:ce?void 0:ue,themeClass:G==null?void 0:G.themeClass,onRender:G==null?void 0:G.onRender}},render(){const{status:e,multiple:t,size:n,disabled:o,filterable:d,maxTagCount:c,bordered:f,clsPrefix:l,ellipsisTagPopoverProps:g,onRender:p,renderTag:b,renderLabel:m}=this;p==null||p();const x=c==="responsive",y=typeof c=="number",w=x||y,O=a(sn,null,{default:()=>a(mn,{clsPrefix:l,loading:this.loading,showArrow:this.showArrow,showClear:this.mergedClearable&&this.selected,onClear:this.handleClear},{default:()=>{var C,R;return(R=(C=this.$slots).arrow)===null||R===void 0?void 0:R.call(C)}})});let L;if(t){const{labelField:C}=this,R=s=>a("div",{class:`${l}-base-selection-tag-wrapper`,key:s.value},b?b({option:s,handleClose:()=>{this.handleDeleteOption(s)}}):a(Me,{size:n,closable:!s.disabled,disabled:o,onClose:()=>{this.handleDeleteOption(s)},internalCloseIsButtonTag:!1,internalCloseFocusable:!1},{default:()=>m?m(s,!0):oe(s[C],s,!0)})),E=()=>(y?this.selectedOptions.slice(0,c):this.selectedOptions).map(R),A=d?a("div",{class:`${l}-base-selection-input-tag`,ref:"inputTagElRef",key:"__input-tag__"},a("input",Object.assign({},this.inputProps,{ref:"patternInputRef",tabindex:-1,disabled:o,value:this.pattern,autofocus:this.autofocus,class:`${l}-base-selection-input-tag__input`,onBlur:this.handlePatternInputBlur,onFocus:this.handlePatternInputFocus,onKeydown:this.handlePatternKeyDown,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),a("span",{ref:"patternInputMirrorRef",class:`${l}-base-selection-input-tag__mirror`},this.pattern)):null,K=x?()=>a("div",{class:`${l}-base-selection-tag-wrapper`,ref:"counterWrapperRef"},a(Me,{size:n,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,onMouseleave:this.handleMouseLeaveCounter,disabled:o})):void 0;let V;if(y){const s=this.selectedOptions.length-c;s>0&&(V=a("div",{class:`${l}-base-selection-tag-wrapper`,key:"__counter__"},a(Me,{size:n,ref:"counterRef",onMouseenter:this.handleMouseEnterCounter,disabled:o},{default:()=>`+${s}`})))}const q=x?d?a(Ke,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,getTail:this.getTail,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:E,counter:K,tail:()=>A}):a(Ke,{ref:"overflowRef",updateCounter:this.updateCounter,getCounter:this.getCounter,style:{width:"100%",display:"flex",overflow:"hidden"}},{default:E,counter:K}):y&&V?E().concat(V):E(),Q=w?()=>a("div",{class:`${l}-base-selection-popover`},x?E():this.selectedOptions.map(R)):void 0,ee=w?Object.assign({show:this.showTagsPanel,trigger:"hover",overlap:!0,placement:"top",width:"trigger",onUpdateShow:this.onPopoverUpdateShow,theme:this.mergedTheme.peers.Popover,themeOverrides:this.mergedTheme.peerOverrides.Popover},g):null,Y=(this.selected?!1:this.active?!this.pattern&&!this.isComposing:!0)?a("div",{class:`${l}-base-selection-placeholder ${l}-base-selection-overlay`},a("div",{class:`${l}-base-selection-placeholder__inner`},this.placeholder)):null,Z=d?a("div",{ref:"patternInputWrapperRef",class:`${l}-base-selection-tags`},q,x?null:A,O):a("div",{ref:"multipleElRef",class:`${l}-base-selection-tags`,tabindex:o?void 0:0},q,O);L=a(dn,null,w?a(bn,Object.assign({},ee,{scrollable:!0,style:"max-height: calc(var(--v-target-height) * 6.6);"}),{trigger:()=>Z,default:Q}):Z,Y)}else if(d){const C=this.pattern||this.isComposing,R=this.active?!C:!this.selected,E=this.active?!1:this.selected;L=a("div",{ref:"patternInputWrapperRef",class:`${l}-base-selection-label`,title:this.patternInputFocused?void 0:Xe(this.label)},a("input",Object.assign({},this.inputProps,{ref:"patternInputRef",class:`${l}-base-selection-input`,value:this.active?this.pattern:"",placeholder:"",readonly:o,disabled:o,tabindex:-1,autofocus:this.autofocus,onFocus:this.handlePatternInputFocus,onBlur:this.handlePatternInputBlur,onInput:this.handlePatternInputInput,onCompositionstart:this.handleCompositionStart,onCompositionend:this.handleCompositionEnd})),E?a("div",{class:`${l}-base-selection-label__render-label ${l}-base-selection-overlay`,key:"input"},a("div",{class:`${l}-base-selection-overlay__wrapper`},b?b({option:this.selectedOption,handleClose:()=>{}}):m?m(this.selectedOption,!0):oe(this.label,this.selectedOption,!0))):null,R?a("div",{class:`${l}-base-selection-placeholder ${l}-base-selection-overlay`,key:"placeholder"},a("div",{class:`${l}-base-selection-overlay__wrapper`},this.filterablePlaceholder)):null,O)}else L=a("div",{ref:"singleElRef",class:`${l}-base-selection-label`,tabindex:this.disabled?void 0:0},this.label!==void 0?a("div",{class:`${l}-base-selection-input`,title:Xe(this.label),key:"input"},a("div",{class:`${l}-base-selection-input__content`},b?b({option:this.selectedOption,handleClose:()=>{}}):m?m(this.selectedOption,!0):oe(this.label,this.selectedOption,!0))):a("div",{class:`${l}-base-selection-placeholder ${l}-base-selection-overlay`,key:"placeholder"},a("div",{class:`${l}-base-selection-placeholder__inner`},this.placeholder)),O);return a("div",{ref:"selfRef",class:[`${l}-base-selection`,this.rtlEnabled&&`${l}-base-selection--rtl`,this.themeClass,e&&`${l}-base-selection--${e}-status`,{[`${l}-base-selection--active`]:this.active,[`${l}-base-selection--selected`]:this.selected||this.active&&this.pattern,[`${l}-base-selection--disabled`]:this.disabled,[`${l}-base-selection--multiple`]:this.multiple,[`${l}-base-selection--focus`]:this.focused}],style:this.cssVars,onClick:this.onClick,onMouseenter:this.handleMouseEnter,onMouseleave:this.handleMouseLeave,onKeydown:this.onKeydown,onFocusin:this.handleFocusin,onFocusout:this.handleFocusout,onMousedown:this.handleMouseDown},L,f?a("div",{class:`${l}-base-selection__border`}):null,f?a("div",{class:`${l}-base-selection__state-border`}):null)}});function be(e){return e.type==="group"}function lt(e){return e.type==="ignored"}function Hn(e,t){try{return!!(1+t.toString().toLowerCase().indexOf(e.trim().toLowerCase()))}catch(n){return!1}}function Wn(e,t){return{getIsGroup:be,getIgnored:lt,getKey(o){return be(o)?o.name||o.key||"key-required":o[e]},getChildren(o){return o[t]}}}function An(e,t,n,o){if(!t)return e;function d(c){if(!Array.isArray(c))return[];const f=[];for(const l of c)if(be(l)){const g=d(l[o]);g.length&&f.push(Object.assign({},l,{[o]:g}))}else{if(lt(l))continue;t(n,l)&&f.push(l)}return f}return d(e)}function Dn(e,t,n){const o=new Map;return e.forEach(d=>{be(d)?d[n].forEach(c=>{o.set(c[t],c)}):o.set(d[t],d)}),o}export{zn as F,Ln as N,Cn as V,kn as a,Nn as b,Wn as c,Dn as d,An as f,Ee as m,Hn as p,it as u};
