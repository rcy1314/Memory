import{w as D,es as q,x as C,et as m,c as x,b as t,e as v,B as G,a as K,d as E,h as n,H as X,L as Y,aO as Z,q as J,N as Q,aX as U,aY as ee,a_ as oe,aZ as re,aE as ne,u as H,g as w,aG as te,j as T,aT as le,aS as b,k,r as ie,A as S,F as se,eu as ae}from"./index-ON-SflwH.js";function ce(o){const{lineHeight:e,borderRadius:a,fontWeightStrong:h,baseColor:l,dividerColor:i,actionColor:s,textColor1:g,textColor2:c,closeColorHover:u,closeColorPressed:p,closeIconColor:I,closeIconColorHover:z,closeIconColorPressed:d,infoColor:r,successColor:$,warningColor:y,errorColor:P,fontSize:R}=o;return Object.assign(Object.assign({},q),{fontSize:R,lineHeight:e,titleFontWeight:h,borderRadius:a,border:`1px solid ${i}`,color:s,titleTextColor:g,iconColor:c,contentTextColor:c,closeBorderRadius:a,closeColorHover:u,closeColorPressed:p,closeIconColor:I,closeIconColorHover:z,closeIconColorPressed:d,borderInfo:`1px solid ${C(l,m(r,{alpha:.25}))}`,colorInfo:C(l,m(r,{alpha:.08})),titleTextColorInfo:g,iconColorInfo:r,contentTextColorInfo:c,closeColorHoverInfo:u,closeColorPressedInfo:p,closeIconColorInfo:I,closeIconColorHoverInfo:z,closeIconColorPressedInfo:d,borderSuccess:`1px solid ${C(l,m($,{alpha:.25}))}`,colorSuccess:C(l,m($,{alpha:.08})),titleTextColorSuccess:g,iconColorSuccess:$,contentTextColorSuccess:c,closeColorHoverSuccess:u,closeColorPressedSuccess:p,closeIconColorSuccess:I,closeIconColorHoverSuccess:z,closeIconColorPressedSuccess:d,borderWarning:`1px solid ${C(l,m(y,{alpha:.33}))}`,colorWarning:C(l,m(y,{alpha:.08})),titleTextColorWarning:g,iconColorWarning:y,contentTextColorWarning:c,closeColorHoverWarning:u,closeColorPressedWarning:p,closeIconColorWarning:I,closeIconColorHoverWarning:z,closeIconColorPressedWarning:d,borderError:`1px solid ${C(l,m(P,{alpha:.25}))}`,colorError:C(l,m(P,{alpha:.08})),titleTextColorError:g,iconColorError:P,contentTextColorError:c,closeColorHoverError:u,closeColorPressedError:p,closeIconColorError:I,closeIconColorHoverError:z,closeIconColorPressedError:d})}const de={common:D,self:ce},he=x("alert",`
 line-height: var(--n-line-height);
 border-radius: var(--n-border-radius);
 position: relative;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 text-align: start;
 word-break: break-word;
`,[t("border",`
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 transition: border-color .3s var(--n-bezier);
 border: var(--n-border);
 pointer-events: none;
 `),v("closable",[x("alert-body",[t("title",`
 padding-right: 24px;
 `)])]),t("icon",{color:"var(--n-icon-color)"}),x("alert-body",{padding:"var(--n-padding)"},[t("title",{color:"var(--n-title-text-color)"}),t("content",{color:"var(--n-content-text-color)"})]),G({originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.9)"}}),t("icon",`
 position: absolute;
 left: 0;
 top: 0;
 align-items: center;
 justify-content: center;
 display: flex;
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 margin: var(--n-icon-margin);
 `),t("close",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 `),v("show-icon",[x("alert-body",{paddingLeft:"calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right))"})]),v("right-adjust",[x("alert-body",{paddingRight:"calc(var(--n-close-size) + var(--n-padding) + 2px)"})]),x("alert-body",`
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 `,[t("title",`
 transition: color .3s var(--n-bezier);
 font-size: 16px;
 line-height: 19px;
 font-weight: var(--n-title-font-weight);
 `,[K("& +",[t("content",{marginTop:"9px"})])]),t("content",{transition:"color .3s var(--n-bezier)",fontSize:"var(--n-font-size)"})]),t("icon",{transition:"color .3s var(--n-bezier)"})]),ve=Object.assign(Object.assign({},w.props),{title:String,showIcon:{type:Boolean,default:!0},type:{type:String,default:"default"},bordered:{type:Boolean,default:!0},closable:Boolean,onClose:Function,onAfterLeave:Function,onAfterHide:Function}),be=E({name:"Alert",inheritAttrs:!1,props:ve,slots:Object,setup(o){const{mergedClsPrefixRef:e,mergedBorderedRef:a,inlineThemeDisabled:h,mergedRtlRef:l}=H(o),i=w("Alert","-alert",he,de,o,e),s=te("Alert",l,e),g=T(()=>{const{common:{cubicBezierEaseInOut:d},self:r}=i.value,{fontSize:$,borderRadius:y,titleFontWeight:P,lineHeight:R,iconSize:B,iconMargin:_,iconMarginRtl:W,closeIconSize:A,closeBorderRadius:j,closeSize:L,closeMargin:O,closeMarginRtl:F,padding:N}=r,{type:f}=o,{left:M,right:V}=le(_);return{"--n-bezier":d,"--n-color":r[b("color",f)],"--n-close-icon-size":A,"--n-close-border-radius":j,"--n-close-color-hover":r[b("closeColorHover",f)],"--n-close-color-pressed":r[b("closeColorPressed",f)],"--n-close-icon-color":r[b("closeIconColor",f)],"--n-close-icon-color-hover":r[b("closeIconColorHover",f)],"--n-close-icon-color-pressed":r[b("closeIconColorPressed",f)],"--n-icon-color":r[b("iconColor",f)],"--n-border":r[b("border",f)],"--n-title-text-color":r[b("titleTextColor",f)],"--n-content-text-color":r[b("contentTextColor",f)],"--n-line-height":R,"--n-border-radius":y,"--n-font-size":$,"--n-title-font-weight":P,"--n-icon-size":B,"--n-icon-margin":_,"--n-icon-margin-rtl":W,"--n-close-size":L,"--n-close-margin":O,"--n-close-margin-rtl":F,"--n-padding":N,"--n-icon-margin-left":M,"--n-icon-margin-right":V}}),c=h?k("alert",T(()=>o.type[0]),g,o):void 0,u=ie(!0),p=()=>{const{onAfterLeave:d,onAfterHide:r}=o;d&&d(),r&&r()};return{rtlEnabled:s,mergedClsPrefix:e,mergedBordered:a,visible:u,handleCloseClick:()=>{var d;Promise.resolve((d=o.onClose)===null||d===void 0?void 0:d.call(o)).then(r=>{r!==!1&&(u.value=!1)})},handleAfterLeave:()=>{p()},mergedTheme:i,cssVars:h?void 0:g,themeClass:c==null?void 0:c.themeClass,onRender:c==null?void 0:c.onRender}},render(){var o;return(o=this.onRender)===null||o===void 0||o.call(this),n(X,{onAfterLeave:this.handleAfterLeave},{default:()=>{const{mergedClsPrefix:e,$slots:a}=this,h={class:[`${e}-alert`,this.themeClass,this.closable&&`${e}-alert--closable`,this.showIcon&&`${e}-alert--show-icon`,!this.title&&this.closable&&`${e}-alert--right-adjust`,this.rtlEnabled&&`${e}-alert--rtl`],style:this.cssVars,role:"alert"};return this.visible?n("div",Object.assign({},Y(this.$attrs,h)),this.closable&&n(Z,{clsPrefix:e,class:`${e}-alert__close`,onClick:this.handleCloseClick}),this.bordered&&n("div",{class:`${e}-alert__border`}),this.showIcon&&n("div",{class:`${e}-alert__icon`,"aria-hidden":"true"},J(a.icon,()=>[n(Q,{clsPrefix:e},{default:()=>{switch(this.type){case"success":return n(re,null);case"info":return n(oe,null);case"warning":return n(ee,null);case"error":return n(U,null);default:return null}}})])),n("div",{class:[`${e}-alert-body`,this.mergedBordered&&`${e}-alert-body--bordered`]},ne(a.header,l=>{const i=l||this.title;return i?n("div",{class:`${e}-alert-body__title`},i):null}),a.default&&n("div",{class:`${e}-alert-body__content`},a))):null}})}}),ge=x("divider",`
 position: relative;
 display: flex;
 width: 100%;
 box-sizing: border-box;
 font-size: 16px;
 color: var(--n-text-color);
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
`,[S("vertical",`
 margin-top: 24px;
 margin-bottom: 24px;
 `,[S("no-title",`
 display: flex;
 align-items: center;
 `)]),t("title",`
 display: flex;
 align-items: center;
 margin-left: 12px;
 margin-right: 12px;
 white-space: nowrap;
 font-weight: var(--n-font-weight);
 `),v("title-position-left",[t("line",[v("left",{width:"28px"})])]),v("title-position-right",[t("line",[v("right",{width:"28px"})])]),v("dashed",[t("line",`
 background-color: #0000;
 height: 0px;
 width: 100%;
 border-style: dashed;
 border-width: 1px 0 0;
 `)]),v("vertical",`
 display: inline-block;
 height: 1em;
 margin: 0 8px;
 vertical-align: middle;
 width: 1px;
 `),t("line",`
 border: none;
 transition: background-color .3s var(--n-bezier), border-color .3s var(--n-bezier);
 height: 1px;
 width: 100%;
 margin: 0;
 `),S("dashed",[t("line",{backgroundColor:"var(--n-color)"})]),v("dashed",[t("line",{borderColor:"var(--n-color)"})]),v("vertical",{backgroundColor:"var(--n-color)"})]),ue=Object.assign(Object.assign({},w.props),{titlePlacement:{type:String,default:"center"},dashed:Boolean,vertical:Boolean}),Ce=E({name:"Divider",props:ue,setup(o){const{mergedClsPrefixRef:e,inlineThemeDisabled:a}=H(o),h=w("Divider","-divider",ge,ae,o,e),l=T(()=>{const{common:{cubicBezierEaseInOut:s},self:{color:g,textColor:c,fontWeight:u}}=h.value;return{"--n-bezier":s,"--n-color":g,"--n-text-color":c,"--n-font-weight":u}}),i=a?k("divider",void 0,l,o):void 0;return{mergedClsPrefix:e,cssVars:a?void 0:l,themeClass:i==null?void 0:i.themeClass,onRender:i==null?void 0:i.onRender}},render(){var o;const{$slots:e,titlePlacement:a,vertical:h,dashed:l,cssVars:i,mergedClsPrefix:s}=this;return(o=this.onRender)===null||o===void 0||o.call(this),n("div",{role:"separator",class:[`${s}-divider`,this.themeClass,{[`${s}-divider--vertical`]:h,[`${s}-divider--no-title`]:!e.default,[`${s}-divider--dashed`]:l,[`${s}-divider--title-position-${a}`]:e.default&&a}],style:i},h?null:n("div",{class:`${s}-divider__line ${s}-divider__line--left`}),!h&&e.default?n(se,null,n("div",{class:`${s}-divider__title`},this.$slots),n("div",{class:`${s}-divider__line ${s}-divider__line--right`})):null)}});export{Ce as N,be as a};
