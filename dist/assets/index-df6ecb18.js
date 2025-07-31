var Ge=(e,o,i)=>new Promise((a,l)=>{var t=b=>{try{c(i.next(b))}catch(x){l(x)}},s=b=>{try{c(i.throw(b))}catch(x){l(x)}},c=b=>b.done?a(b.value):Promise.resolve(b.value).then(t,s);c((i=i.apply(e,o)).next())});import{_ as Xe}from"./TheIcon-a5071d78.js";import{d as K,h as r,c as g,a as U,e as D,u as He,du as bt,H as ut,b as te,p as rt,aD as yt,dP as Ht,dQ as ne,dR as ie,dS as se,dT as fe,dU as ae,dV as ke,dW as ve,r as T,dp as _e,dw as xe,i as E,k as wt,n as Ae,K as kt,dX as Re,dY as Ye,dZ as Je,d_ as et,da as qt,c$ as Et,d0 as jt,f as qe,d$ as Lt,t as pe,aa as Kt,aQ as dt,j as _t,d2 as Gt,d5 as Xt,av as Zt,a7 as Wt,d4 as Qt,A as he,aH as J,ab as Yt,s as Jt,v as eo,e0 as to,e1 as oo,e2 as io,q as ct,e3 as mt,e4 as ao,bT as Ze,cv as We,L as lo,z as Se,e5 as ro,P as ee,S as $e,$ as v,R as _,U as h,X as Ve,F as no,T as so,Z as Pe,a0 as uo,a4 as co,Q as Ue,ae as Me,Y as pt,ay as mo}from"./index-be94632c.js";import{N as M}from"./Input-147bc994.js";import{b as tt,V as po,d as ho,e as fo,N as vo}from"./Popover-77560cbc.js";import{_ as go,a as q,N as bo}from"./CommonPage-7e5436b1.js";import{_ as yo}from"./_plugin-vue_export-helper-c27b6911.js";import{a as xt,u as ot}from"./use-locale-5356ed31.js";import{A as ht}from"./Add-28a2437a.js";import{R as wo,N as ko}from"./InputNumber-99faf15f.js";import{A as _o}from"./ArrowDown-4efcc911.js";import{N as Be}from"./Image-501c0406.js";import{N as Qe}from"./Switch-efec31f2.js";import"./icon-08752ca2.js";import"./format-length-c9d165c6.js";import"./AppPage-98713723.js";import"./Tooltip-ed686319.js";function St(e,o,i){o/=100,i/=100;const a=o*Math.min(i,1-i)+i;return[e,a?(2-2*i/a)*100:0,a*100]}function Oe(e,o,i){o/=100,i/=100;const a=i-i*o/2,l=Math.min(a,1-a);return[e,l?(i-a)/l*100:0,a*100]}function re(e,o,i){o/=100,i/=100;let a=(l,t=(l+e/60)%6)=>i-i*o*Math.max(Math.min(t,4-t,1),0);return[a(5)*255,a(3)*255,a(1)*255]}function it(e,o,i){e/=255,o/=255,i/=255;let a=Math.max(e,o,i),l=a-Math.min(e,o,i),t=l&&(a==e?(o-i)/l:a==o?2+(i-e)/l:4+(e-o)/l);return[60*(t<0?t+6:t),a&&l/a*100,a*100]}function at(e,o,i){e/=255,o/=255,i/=255;let a=Math.max(e,o,i),l=a-Math.min(e,o,i),t=1-Math.abs(a+a-l-1),s=l&&(a==e?(o-i)/l:a==o?2+(i-e)/l:4+(e-o)/l);return[60*(s<0?s+6:s),t?l/t*100:0,(a+a-l)*50]}function lt(e,o,i){o/=100,i/=100;let a=o*Math.min(i,1-i),l=(t,s=(t+e/30)%12)=>i-a*Math.max(Math.min(s-3,9-s,1),-1);return[l(0)*255,l(8)*255,l(4)*255]}const xo=K({name:"ArrowUp",render(){return r("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},r("g",{fill:"none"},r("path",{d:"M3.13 9.163a.5.5 0 1 0 .74.674L9.5 3.67V17.5a.5.5 0 0 0 1 0V3.672l5.63 6.165a.5.5 0 0 0 .738-.674l-6.315-6.916a.746.746 0 0 0-.632-.24a.746.746 0 0 0-.476.24L3.131 9.163z",fill:"currentColor"})))}}),So=g("input-group",`
 display: inline-flex;
 width: 100%;
 flex-wrap: nowrap;
 vertical-align: bottom;
`,[U(">",[g("input",[U("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),U("&:not(:first-child)",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 margin-left: -1px!important;
 `)]),g("button",[U("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `,[D("state-border, border",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)]),U("&:not(:first-child)",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `,[D("state-border, border",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])]),U("*",[U("&:not(:last-child)",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `,[U(">",[g("input",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),g("base-selection",[g("base-selection-label",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),g("base-selection-tags",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `),D("box-shadow, border, state-border",`
 border-top-right-radius: 0!important;
 border-bottom-right-radius: 0!important;
 `)])])]),U("&:not(:first-child)",`
 margin-left: -1px!important;
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `,[U(">",[g("input",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),g("base-selection",[g("base-selection-label",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),g("base-selection-tags",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `),D("box-shadow, border, state-border",`
 border-top-left-radius: 0!important;
 border-bottom-left-radius: 0!important;
 `)])])])])])]),$o={},Uo=K({name:"InputGroup",props:$o,setup(e){const{mergedClsPrefixRef:o}=He(e);return bt("-input-group",So,o),{mergedClsPrefix:o}},render(){const{mergedClsPrefix:e}=this;return r("div",{class:`${e}-input-group`},this.$slots)}}),V="0!important",$t="-1px!important";function be(e){return te(e+"-type",[U("& +",[g("button",{},[te(e+"-type",[D("border",{borderLeftWidth:V}),D("state-border",{left:$t})])])])])}function ye(e){return te(e+"-type",[U("& +",[g("button",[te(e+"-type",[D("border",{borderTopWidth:V}),D("state-border",{top:$t})])])])])}const Co=g("button-group",`
 flex-wrap: nowrap;
 display: inline-flex;
 position: relative;
`,[ut("vertical",{flexDirection:"row"},[ut("rtl",[g("button",[U("&:first-child:not(:last-child)",`
 margin-right: ${V};
 border-top-right-radius: ${V};
 border-bottom-right-radius: ${V};
 `),U("&:last-child:not(:first-child)",`
 margin-left: ${V};
 border-top-left-radius: ${V};
 border-bottom-left-radius: ${V};
 `),U("&:not(:first-child):not(:last-child)",`
 margin-left: ${V};
 margin-right: ${V};
 border-radius: ${V};
 `),be("default"),te("ghost",[be("primary"),be("info"),be("success"),be("warning"),be("error")])])])]),te("vertical",{flexDirection:"column"},[g("button",[U("&:first-child:not(:last-child)",`
 margin-bottom: ${V};
 margin-left: ${V};
 margin-right: ${V};
 border-bottom-left-radius: ${V};
 border-bottom-right-radius: ${V};
 `),U("&:last-child:not(:first-child)",`
 margin-top: ${V};
 margin-left: ${V};
 margin-right: ${V};
 border-top-left-radius: ${V};
 border-top-right-radius: ${V};
 `),U("&:not(:first-child):not(:last-child)",`
 margin: ${V};
 border-radius: ${V};
 `),ye("default"),te("ghost",[ye("primary"),ye("info"),ye("success"),ye("warning"),ye("error")])])])]),Ro={size:{type:String,default:void 0},vertical:Boolean},Vo=K({name:"ButtonGroup",props:Ro,setup(e){const{mergedClsPrefixRef:o,mergedRtlRef:i}=He(e);return bt("-button-group",Co,o),rt(Ht,e),{rtlEnabled:yt("ButtonGroup",i,o),mergedClsPrefix:o}},render(){const{mergedClsPrefix:e}=this;return r("div",{class:[`${e}-button-group`,this.rtlEnabled&&`${e}-button-group--rtl`,this.vertical&&`${e}-button-group--vertical`],role:"group"},this.$slots)}});function Po(e,o){switch(e[0]){case"hex":return o?"#000000FF":"#000000";case"rgb":return o?"rgba(0, 0, 0, 1)":"rgb(0, 0, 0)";case"hsl":return o?"hsla(0, 0%, 0%, 1)":"hsl(0, 0%, 0%)";case"hsv":return o?"hsva(0, 0%, 0%, 1)":"hsv(0, 0%, 0%)"}return"#000000"}function Ie(e){return e===null?null:/^ *#/.test(e)?"hex":e.includes("rgb")?"rgb":e.includes("hsl")?"hsl":e.includes("hsv")?"hsv":null}function Io(e){return e=Math.round(e),e>=360?359:e<0?0:e}function Ao(e){return e=Math.round(e*100)/100,e>1?1:e<0?0:e}const Do={rgb:{hex(e){return ne(ie(e))},hsl(e){const[o,i,a,l]=ie(e);return se([...at(o,i,a),l])},hsv(e){const[o,i,a,l]=ie(e);return fe([...it(o,i,a),l])}},hex:{rgb(e){return ae(ie(e))},hsl(e){const[o,i,a,l]=ie(e);return se([...at(o,i,a),l])},hsv(e){const[o,i,a,l]=ie(e);return fe([...it(o,i,a),l])}},hsl:{hex(e){const[o,i,a,l]=ke(e);return ne([...lt(o,i,a),l])},rgb(e){const[o,i,a,l]=ke(e);return ae([...lt(o,i,a),l])},hsv(e){const[o,i,a,l]=ke(e);return fe([...St(o,i,a),l])}},hsv:{hex(e){const[o,i,a,l]=ve(e);return ne([...re(o,i,a),l])},rgb(e){const[o,i,a,l]=ve(e);return ae([...re(o,i,a),l])},hsl(e){const[o,i,a,l]=ve(e);return se([...Oe(o,i,a),l])}}};function Ut(e,o,i){return i=i||Ie(e),i?i===o?e:Do[i][o](e):null}const we="12px",zo=12,ce="6px",Mo=6,Bo="linear-gradient(90deg,red,#ff0 16.66%,#0f0 33.33%,#0ff 50%,#00f 66.66%,#f0f 83.33%,red)",Fo=K({name:"HueSlider",props:{clsPrefix:{type:String,required:!0},hue:{type:Number,required:!0},onUpdateHue:{type:Function,required:!0},onComplete:Function},setup(e){const o=T(null);function i(t){o.value&&(_e("mousemove",document,a),_e("mouseup",document,l),a(t))}function a(t){const{value:s}=o;if(!s)return;const{width:c,left:b}=s.getBoundingClientRect(),x=Io((t.clientX-b-Mo)/(c-zo)*360);e.onUpdateHue(x)}function l(){var t;xe("mousemove",document,a),xe("mouseup",document,l),(t=e.onComplete)===null||t===void 0||t.call(e)}return{railRef:o,handleMouseDown:i}},render(){const{clsPrefix:e}=this;return r("div",{class:`${e}-color-picker-slider`,style:{height:we,borderRadius:ce}},r("div",{ref:"railRef",style:{boxShadow:"inset 0 0 2px 0 rgba(0, 0, 0, .24)",boxSizing:"border-box",backgroundImage:Bo,height:we,borderRadius:ce,position:"relative"},onMousedown:this.handleMouseDown},r("div",{style:{position:"absolute",left:ce,right:ce,top:0,bottom:0}},r("div",{class:`${e}-color-picker-handle`,style:{left:`calc((${this.hue}%) / 359 * 100 - ${ce})`,borderRadius:ce,width:we,height:we}},r("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:`hsl(${this.hue}, 100%, 50%)`,borderRadius:ce,width:we,height:we}})))))}}),Ce="12px",No=12,me="6px",To=K({name:"AlphaSlider",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},alpha:{type:Number,default:0},onUpdateAlpha:{type:Function,required:!0},onComplete:Function},setup(e){const o=T(null);function i(t){!o.value||!e.rgba||(_e("mousemove",document,a),_e("mouseup",document,l),a(t))}function a(t){const{value:s}=o;if(!s)return;const{width:c,left:b}=s.getBoundingClientRect(),x=(t.clientX-b)/(c-No);e.onUpdateAlpha(Ao(x))}function l(){var t;xe("mousemove",document,a),xe("mouseup",document,l),(t=e.onComplete)===null||t===void 0||t.call(e)}return{railRef:o,railBackgroundImage:E(()=>{const{rgba:t}=e;return t?`linear-gradient(to right, rgba(${t[0]}, ${t[1]}, ${t[2]}, 0) 0%, rgba(${t[0]}, ${t[1]}, ${t[2]}, 1) 100%)`:""}),handleMouseDown:i}},render(){const{clsPrefix:e}=this;return r("div",{class:`${e}-color-picker-slider`,ref:"railRef",style:{height:Ce,borderRadius:me},onMousedown:this.handleMouseDown},r("div",{style:{borderRadius:me,position:"absolute",left:0,right:0,top:0,bottom:0,overflow:"hidden"}},r("div",{class:`${e}-color-picker-checkboard`}),r("div",{class:`${e}-color-picker-slider__image`,style:{backgroundImage:this.railBackgroundImage}})),this.rgba&&r("div",{style:{position:"absolute",left:me,right:me,top:0,bottom:0}},r("div",{class:`${e}-color-picker-handle`,style:{left:`calc(${this.alpha*100}% - ${me})`,borderRadius:me,width:Ce,height:Ce}},r("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:ae(this.rgba),borderRadius:me,width:Ce,height:Ce}}))))}}),Fe="12px",Ne="6px",Oo=K({name:"Pallete",props:{clsPrefix:{type:String,required:!0},rgba:{type:Array,default:null},displayedHue:{type:Number,required:!0},displayedSv:{type:Array,required:!0},onUpdateSV:{type:Function,required:!0},onComplete:Function},setup(e){const o=T(null);function i(t){o.value&&(_e("mousemove",document,a),_e("mouseup",document,l),a(t))}function a(t){const{value:s}=o;if(!s)return;const{width:c,height:b,left:x,bottom:B}=s.getBoundingClientRect(),S=(B-t.clientY)/b,j=(t.clientX-x)/c,Z=100*(j>1?1:j<0?0:j),z=100*(S>1?1:S<0?0:S);e.onUpdateSV(Z,z)}function l(){var t;xe("mousemove",document,a),xe("mouseup",document,l),(t=e.onComplete)===null||t===void 0||t.call(e)}return{palleteRef:o,handleColor:E(()=>{const{rgba:t}=e;return t?`rgb(${t[0]}, ${t[1]}, ${t[2]})`:""}),handleMouseDown:i}},render(){const{clsPrefix:e}=this;return r("div",{class:`${e}-color-picker-pallete`,onMousedown:this.handleMouseDown,ref:"palleteRef"},r("div",{class:`${e}-color-picker-pallete__layer`,style:{backgroundImage:`linear-gradient(90deg, white, hsl(${this.displayedHue}, 100%, 50%))`}}),r("div",{class:`${e}-color-picker-pallete__layer ${e}-color-picker-pallete__layer--shadowed`,style:{backgroundImage:"linear-gradient(180deg, rgba(0, 0, 0, 0%), rgba(0, 0, 0, 100%))"}}),this.rgba&&r("div",{class:`${e}-color-picker-handle`,style:{width:Fe,height:Fe,borderRadius:Ne,left:`calc(${this.displayedSv[0]}% - ${Ne})`,bottom:`calc(${this.displayedSv[1]}% - ${Ne})`}},r("div",{class:`${e}-color-picker-handle__fill`,style:{backgroundColor:this.handleColor,borderRadius:Ne,width:Fe,height:Fe}})))}}),nt=wt("n-color-picker");function Ho(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(parseInt(e),255)):!1}function qo(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(parseInt(e),360)):!1}function Eo(e){return/^\d{1,3}\.?\d*$/.test(e.trim())?Math.max(0,Math.min(parseInt(e),100)):!1}function jo(e){const o=e.trim();return/^#[0-9a-fA-F]+$/.test(o)?[4,5,7,9].includes(o.length):!1}function Lo(e){return/^\d{1,3}\.?\d*%$/.test(e.trim())?Math.max(0,Math.min(parseInt(e)/100,100)):!1}const Ko={paddingSmall:"0 4px"},ft=K({name:"ColorInputUnit",props:{label:{type:String,required:!0},value:{type:[Number,String],default:null},showAlpha:Boolean,onUpdateValue:{type:Function,required:!0}},setup(e){const o=T(""),{themeRef:i}=Ae(nt,null);kt(()=>{o.value=a()});function a(){const{value:s}=e;if(s===null)return"";const{label:c}=e;return c==="HEX"?s:c==="A"?`${Math.floor(s*100)}%`:String(Math.floor(s))}function l(s){o.value=s}function t(s){let c,b;switch(e.label){case"HEX":b=jo(s),b&&e.onUpdateValue(s),o.value=a();break;case"H":c=qo(s),c===!1?o.value=a():e.onUpdateValue(c);break;case"S":case"L":case"V":c=Eo(s),c===!1?o.value=a():e.onUpdateValue(c);break;case"A":c=Lo(s),c===!1?o.value=a():e.onUpdateValue(c);break;case"R":case"G":case"B":c=Ho(s),c===!1?o.value=a():e.onUpdateValue(c);break}}return{mergedTheme:i,inputValue:o,handleInputChange:t,handleInputUpdateValue:l}},render(){const{mergedTheme:e}=this;return r(M,{size:"small",placeholder:this.label,theme:e.peers.Input,themeOverrides:e.peerOverrides.Input,builtinThemeOverrides:Ko,value:this.inputValue,onUpdateValue:this.handleInputUpdateValue,onChange:this.handleInputChange,style:this.label==="A"?"flex-grow: 1.25;":""})}}),Go=K({name:"ColorInput",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},modes:{type:Array,required:!0},showAlpha:{type:Boolean,required:!0},value:{type:String,default:null},valueArr:{type:Array,default:null},onUpdateValue:{type:Function,required:!0},onUpdateMode:{type:Function,required:!0}},setup(e){return{handleUnitUpdateValue(o,i){const{showAlpha:a}=e;if(e.mode==="hex"){e.onUpdateValue((a?ne:Re)(i));return}let l;switch(e.valueArr===null?l=[0,0,0,0]:l=Array.from(e.valueArr),e.mode){case"hsv":l[o]=i,e.onUpdateValue((a?fe:et)(l));break;case"rgb":l[o]=i,e.onUpdateValue((a?ae:Je)(l));break;case"hsl":l[o]=i,e.onUpdateValue((a?se:Ye)(l));break}}}},render(){const{clsPrefix:e,modes:o}=this;return r("div",{class:`${e}-color-picker-input`},r("div",{class:`${e}-color-picker-input__mode`,onClick:this.onUpdateMode,style:{cursor:o.length===1?"":"pointer"}},this.mode.toUpperCase()+(this.showAlpha?"A":"")),r(Uo,null,{default:()=>{const{mode:i,valueArr:a,showAlpha:l}=this;if(i==="hex"){let t=null;try{t=a===null?null:(l?ne:Re)(a)}catch(s){}return r(ft,{label:"HEX",showAlpha:l,value:t,onUpdateValue:s=>{this.handleUnitUpdateValue(0,s)}})}return(i+(l?"a":"")).split("").map((t,s)=>r(ft,{label:t.toUpperCase(),value:a===null?null:a[s],onUpdateValue:c=>{this.handleUnitUpdateValue(s,c)}}))}}))}}),Xo=K({name:"ColorPickerTrigger",props:{clsPrefix:{type:String,required:!0},value:{type:String,default:null},hsla:{type:Array,default:null},disabled:Boolean,onClick:Function},setup(e){const{colorPickerSlots:o,renderLabelRef:i}=Ae(nt,null);return()=>{const{hsla:a,value:l,clsPrefix:t,onClick:s,disabled:c}=e,b=o.label||i.value;return r("div",{class:[`${t}-color-picker-trigger`,c&&`${t}-color-picker-trigger--disabled`],onClick:c?void 0:s},r("div",{class:`${t}-color-picker-trigger__fill`},r("div",{class:`${t}-color-picker-checkboard`}),r("div",{style:{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:a?se(a):""}}),l&&a?r("div",{class:`${t}-color-picker-trigger__value`,style:{color:a[2]>50||a[3]<.5?"black":"white"}},b?b(l):l):null))}}});function Zo(e,o){if(o==="hsv"){const[i,a,l,t]=ve(e);return ae([...re(i,a,l),t])}return e}function Wo(e){const o=document.createElement("canvas").getContext("2d");return o?(o.fillStyle=e,o.fillStyle):"#000000"}const Qo=K({name:"ColorPickerSwatches",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},swatches:{type:Array,required:!0},onUpdateColor:{type:Function,required:!0}},setup(e){const o=E(()=>e.swatches.map(t=>{const s=Ie(t);return{value:t,mode:s,legalValue:Zo(t,s)}}));function i(t){const{mode:s}=e;let{value:c,mode:b}=t;return b||(b="hex",/^[a-zA-Z]+$/.test(c)?c=Wo(c):(qt("color-picker",`color ${c} in swatches is invalid.`),c="#000000")),b===s?c:Ut(c,s,b)}function a(t){e.onUpdateColor(i(t))}function l(t,s){t.key==="Enter"&&a(s)}return{parsedSwatchesRef:o,handleSwatchSelect:a,handleSwatchKeyDown:l}},render(){const{clsPrefix:e}=this;return r("div",{class:`${e}-color-picker-swatches`},this.parsedSwatchesRef.map(o=>r("div",{class:`${e}-color-picker-swatch`,tabindex:0,onClick:()=>{this.handleSwatchSelect(o)},onKeydown:i=>{this.handleSwatchKeyDown(i,o)}},r("div",{class:`${e}-color-picker-swatch__fill`,style:{background:o.legalValue}}))))}}),Yo=K({name:"ColorPreview",props:{clsPrefix:{type:String,required:!0},mode:{type:String,required:!0},color:{type:String,default:null,validator:e=>{const o=Ie(e);return!!(!e||o&&o!=="hsv")}},onUpdateColor:{type:Function,required:!0}},setup(e){function o(i){var a;const l=i.target.value;(a=e.onUpdateColor)===null||a===void 0||a.call(e,Ut(l.toUpperCase(),e.mode,"hex")),i.stopPropagation()}return{handleChange:o}},render(){const{clsPrefix:e}=this;return r("div",{class:`${e}-color-picker-preview__preview`},r("span",{class:`${e}-color-picker-preview__fill`,style:{background:this.color||"#000000"}}),r("input",{class:`${e}-color-picker-preview__input`,type:"color",value:this.color,onChange:this.handleChange}))}}),Jo=U([g("color-picker",`
 display: inline-block;
 box-sizing: border-box;
 height: var(--n-height);
 font-size: var(--n-font-size);
 width: 100%;
 position: relative;
 `),g("color-picker-panel",`
 margin: 4px 0;
 width: 240px;
 font-size: var(--n-panel-font-size);
 color: var(--n-text-color);
 background-color: var(--n-color);
 transition:
 box-shadow .3s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 box-shadow: var(--n-box-shadow);
 `,[Et(),g("input",`
 text-align: center;
 `)]),g("color-picker-checkboard",`
 background: white; 
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[U("&::after",`
 background-image: linear-gradient(45deg, #DDD 25%, #0000 25%), linear-gradient(-45deg, #DDD 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #DDD 75%), linear-gradient(-45deg, #0000 75%, #DDD 75%);
 background-size: 12px 12px;
 background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
 background-repeat: repeat;
 content: "";
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `)]),g("color-picker-slider",`
 margin-bottom: 8px;
 position: relative;
 box-sizing: border-box;
 `,[D("image",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `),U("&::after",`
 content: "";
 position: absolute;
 border-radius: inherit;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 pointer-events: none;
 `)]),g("color-picker-handle",`
 z-index: 1;
 box-shadow: 0 0 2px 0 rgba(0, 0, 0, .45);
 position: absolute;
 background-color: white;
 overflow: hidden;
 `,[D("fill",`
 box-sizing: border-box;
 border: 2px solid white;
 `)]),g("color-picker-pallete",`
 height: 180px;
 position: relative;
 margin-bottom: 8px;
 cursor: crosshair;
 `,[D("layer",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 `,[te("shadowed",`
 box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, .24);
 `)])]),g("color-picker-preview",`
 display: flex;
 `,[D("sliders",`
 flex: 1 0 auto;
 `),D("preview",`
 position: relative;
 height: 30px;
 width: 30px;
 margin: 0 0 8px 6px;
 border-radius: 50%;
 box-shadow: rgba(0, 0, 0, .15) 0px 0px 0px 1px inset;
 overflow: hidden;
 `),D("fill",`
 display: block;
 width: 30px;
 height: 30px;
 `),D("input",`
 position: absolute;
 top: 0;
 left: 0;
 width: 30px;
 height: 30px;
 opacity: 0;
 z-index: 1;
 `)]),g("color-picker-input",`
 display: flex;
 align-items: center;
 `,[g("input",`
 flex-grow: 1;
 flex-basis: 0;
 `),D("mode",`
 width: 72px;
 text-align: center;
 `)]),g("color-picker-control",`
 padding: 12px;
 `),g("color-picker-action",`
 display: flex;
 margin-top: -4px;
 border-top: 1px solid var(--n-divider-color);
 padding: 8px 12px;
 justify-content: flex-end;
 `,[g("button","margin-left: 8px;")]),g("color-picker-trigger",`
 border: var(--n-border);
 height: 100%;
 box-sizing: border-box;
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 cursor: pointer;
 `,[D("value",`
 white-space: nowrap;
 position: relative;
 `),D("fill",`
 border-radius: var(--n-border-radius);
 position: absolute;
 display: flex;
 align-items: center;
 justify-content: center;
 left: 4px;
 right: 4px;
 top: 4px;
 bottom: 4px;
 `),te("disabled","cursor: not-allowed"),g("color-picker-checkboard",`
 border-radius: var(--n-border-radius);
 `,[U("&::after",`
 --n-block-size: calc((var(--n-height) - 8px) / 3);
 background-size: calc(var(--n-block-size) * 2) calc(var(--n-block-size) * 2);
 background-position: 0 0, 0 var(--n-block-size), var(--n-block-size) calc(-1 * var(--n-block-size)), calc(-1 * var(--n-block-size)) 0px; 
 `)])]),g("color-picker-swatches",`
 display: grid;
 grid-gap: 8px;
 flex-wrap: wrap;
 position: relative;
 grid-template-columns: repeat(auto-fill, 18px);
 margin-top: 10px;
 `,[g("color-picker-swatch",`
 width: 18px;
 height: 18px;
 background-image: linear-gradient(45deg, #DDD 25%, #0000 25%), linear-gradient(-45deg, #DDD 25%, #0000 25%), linear-gradient(45deg, #0000 75%, #DDD 75%), linear-gradient(-45deg, #0000 75%, #DDD 75%);
 background-size: 8px 8px;
 background-position: 0px 0, 0px 4px, 4px -4px, -4px 0px;
 background-repeat: repeat;
 `,[D("fill",`
 position: relative;
 width: 100%;
 height: 100%;
 border-radius: 3px;
 box-shadow: rgba(0, 0, 0, .15) 0px 0px 0px 1px inset;
 cursor: pointer;
 `),U("&:focus",`
 outline: none;
 `,[D("fill",[U("&::after",`
 position: absolute;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 background: inherit;
 filter: blur(2px);
 content: "";
 `)])])])])]),ei=Object.assign(Object.assign({},qe.props),{value:String,show:{type:Boolean,default:void 0},defaultShow:Boolean,defaultValue:String,modes:{type:Array,default:()=>["rgb","hex","hsl"]},placement:{type:String,default:"bottom-start"},to:tt.propTo,showAlpha:{type:Boolean,default:!0},showPreview:Boolean,swatches:Array,disabled:{type:Boolean,default:void 0},actions:{type:Array,default:null},internalActions:Array,size:String,renderLabel:Function,onComplete:Function,onConfirm:Function,"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array]}),ti=K({name:"ColorPicker",props:ei,setup(e,{slots:o}){const i=T(null);let a=null;const l=jt(e),{mergedSizeRef:t,mergedDisabledRef:s}=l,{localeRef:c}=xt("global"),{mergedClsPrefixRef:b,namespaceRef:x,inlineThemeDisabled:B}=He(e),S=qe("ColorPicker","-color-picker",Jo,Lt,e,b);rt(nt,{themeRef:S,renderLabelRef:pe(e,"renderLabel"),colorPickerSlots:o});const j=T(e.defaultShow),Z=ot(pe(e,"show"),j);function z(n){const{onUpdateShow:w,"onUpdate:show":P}=e;w&&he(w,n),P&&he(P,n),j.value=n}const{defaultValue:Q}=e,W=T(Q===void 0?Po(e.modes,e.showAlpha):Q),p=ot(pe(e,"value"),W),m=T([p.value]),I=T(0),$=E(()=>Ie(p.value)),{modes:d}=e,C=T(Ie(p.value)||d[0]||"rgb");function De(){const{modes:n}=e,{value:w}=C,P=n.findIndex(A=>A===w);~P?C.value=n[(P+1)%n.length]:C.value="rgb"}let F,u,f,k,y,H,Y,G;const le=E(()=>{const{value:n}=p;if(!n)return null;switch($.value){case"hsv":return ve(n);case"hsl":return[F,u,f,G]=ke(n),[...St(F,u,f),G];case"rgb":case"hex":return[y,H,Y,G]=ie(n),[...it(y,H,Y),G]}}),ue=E(()=>{const{value:n}=p;if(!n)return null;switch($.value){case"rgb":case"hex":return ie(n);case"hsv":return[F,u,k,G]=ve(n),[...re(F,u,k),G];case"hsl":return[F,u,f,G]=ke(n),[...lt(F,u,f),G]}}),Ee=E(()=>{const{value:n}=p;if(!n)return null;switch($.value){case"hsl":return ke(n);case"hsv":return[F,u,k,G]=ve(n),[...Oe(F,u,k),G];case"rgb":case"hex":return[y,H,Y,G]=ie(n),[...at(y,H,Y),G]}}),Ct=E(()=>{switch(C.value){case"rgb":case"hex":return ue.value;case"hsv":return le.value;case"hsl":return Ee.value}}),ze=T(0),je=T(1),Le=T([0,0]);function Rt(n,w){const{value:P}=le,A=ze.value,N=P?P[3]:1;Le.value=[n,w];const{showAlpha:R}=e;switch(C.value){case"hsv":O((R?fe:et)([A,n,w,N]),"cursor");break;case"hsl":O((R?se:Ye)([...Oe(A,n,w),N]),"cursor");break;case"rgb":O((R?ae:Je)([...re(A,n,w),N]),"cursor");break;case"hex":O((R?ne:Re)([...re(A,n,w),N]),"cursor");break}}function Vt(n){ze.value=n;const{value:w}=le;if(!w)return;const[,P,A,N]=w,{showAlpha:R}=e;switch(C.value){case"hsv":O((R?fe:et)([n,P,A,N]),"cursor");break;case"rgb":O((R?ae:Je)([...re(n,P,A),N]),"cursor");break;case"hex":O((R?ne:Re)([...re(n,P,A),N]),"cursor");break;case"hsl":O((R?se:Ye)([...Oe(n,P,A),N]),"cursor");break}}function Pt(n){switch(C.value){case"hsv":[F,u,k]=le.value,O(fe([F,u,k,n]),"cursor");break;case"rgb":[y,H,Y]=ue.value,O(ae([y,H,Y,n]),"cursor");break;case"hex":[y,H,Y]=ue.value,O(ne([y,H,Y,n]),"cursor");break;case"hsl":[F,u,f]=Ee.value,O(se([F,u,f,n]),"cursor");break}je.value=n}function O(n,w){w==="cursor"?a=n:a=null;const{nTriggerFormChange:P,nTriggerFormInput:A}=l,{onUpdateValue:N,"onUpdate:value":R}=e;N&&he(N,n),R&&he(R,n),P(),A(),W.value=n}function It(n){O(n,"input"),Yt(ge)}function ge(n=!0){const{value:w}=p;if(w){const{nTriggerFormChange:P,nTriggerFormInput:A}=l,{onComplete:N}=e;N&&N(w);const{value:R}=m,{value:X}=I;n&&(R.splice(X+1,R.length,w),I.value=X+1),P(),A()}}function At(){const{value:n}=I;n-1<0||(O(m.value[n-1],"input"),ge(!1),I.value=n-1)}function Dt(){const{value:n}=I;n<0||n+1>=m.value.length||(O(m.value[n+1],"input"),ge(!1),I.value=n+1)}function zt(){O(null,"input"),z(!1)}function Mt(){const{value:n}=p,{onConfirm:w}=e;w&&w(n),z(!1)}const Bt=E(()=>I.value>=1),Ft=E(()=>{const{value:n}=m;return n.length>1&&I.value<n.length-1});Kt(Z,n=>{n||(m.value=[p.value],I.value=0)}),kt(()=>{if(!(a&&a===p.value)){const{value:n}=le;n&&(ze.value=n[0],je.value=n[3],Le.value=[n[1],n[2]])}a=null});const Ke=E(()=>{const{value:n}=t,{common:{cubicBezierEaseInOut:w},self:{textColor:P,color:A,panelFontSize:N,boxShadow:R,border:X,borderRadius:L,dividerColor:de,[dt("height",n)]:Tt,[dt("fontSize",n)]:Ot}}=S.value;return{"--n-bezier":w,"--n-text-color":P,"--n-color":A,"--n-panel-font-size":N,"--n-font-size":Ot,"--n-box-shadow":R,"--n-border":X,"--n-border-radius":L,"--n-height":Tt,"--n-divider-color":de}}),oe=B?_t("color-picker",E(()=>t.value[0]),Ke,e):void 0;function Nt(){var n;const{value:w}=ue,{value:P}=ze,{internalActions:A,modes:N,actions:R}=e,{value:X}=S,{value:L}=b;return r("div",{class:[`${L}-color-picker-panel`,oe==null?void 0:oe.themeClass.value],onDragstart:de=>{de.preventDefault()},style:B?void 0:Ke.value},r("div",{class:`${L}-color-picker-control`},r(Oo,{clsPrefix:L,rgba:w,displayedHue:P,displayedSv:Le.value,onUpdateSV:Rt,onComplete:ge}),r("div",{class:`${L}-color-picker-preview`},r("div",{class:`${L}-color-picker-preview__sliders`},r(Fo,{clsPrefix:L,hue:P,onUpdateHue:Vt,onComplete:ge}),e.showAlpha?r(To,{clsPrefix:L,rgba:w,alpha:je.value,onUpdateAlpha:Pt,onComplete:ge}):null),e.showPreview?r(Yo,{clsPrefix:L,mode:C.value,color:ue.value&&Re(ue.value),onUpdateColor:de=>{O(de,"input")}}):null),r(Go,{clsPrefix:L,showAlpha:e.showAlpha,mode:C.value,modes:N,onUpdateMode:De,value:p.value,valueArr:Ct.value,onUpdateValue:It}),((n=e.swatches)===null||n===void 0?void 0:n.length)&&r(Qo,{clsPrefix:L,mode:C.value,swatches:e.swatches,onUpdateColor:de=>{O(de,"input")}})),R!=null&&R.length?r("div",{class:`${L}-color-picker-action`},R.includes("confirm")&&r(J,{size:"small",onClick:Mt,theme:X.peers.Button,themeOverrides:X.peerOverrides.Button},{default:()=>c.value.confirm}),R.includes("clear")&&r(J,{size:"small",onClick:zt,disabled:!p.value,theme:X.peers.Button,themeOverrides:X.peerOverrides.Button},{default:()=>c.value.clear})):null,o.action?r("div",{class:`${L}-color-picker-action`},{default:o.action}):A?r("div",{class:`${L}-color-picker-action`},A.includes("undo")&&r(J,{size:"small",onClick:At,disabled:!Bt.value,theme:X.peers.Button,themeOverrides:X.peerOverrides.Button},{default:()=>c.value.undo}),A.includes("redo")&&r(J,{size:"small",onClick:Dt,disabled:!Ft.value,theme:X.peers.Button,themeOverrides:X.peerOverrides.Button},{default:()=>c.value.redo})):null)}return{mergedClsPrefix:b,namespace:x,selfRef:i,hsla:Ee,rgba:ue,mergedShow:Z,mergedDisabled:s,isMounted:Gt(),adjustedTo:tt(e),mergedValue:p,handleTriggerClick(){z(!0)},handleClickOutside(n){var w;!((w=i.value)===null||w===void 0)&&w.contains(Xt(n))||z(!1)},renderPanel:Nt,cssVars:B?void 0:Ke,themeClass:oe==null?void 0:oe.themeClass,onRender:oe==null?void 0:oe.onRender}},render(){const{$slots:e,mergedClsPrefix:o,onRender:i}=this;return i==null||i(),r("div",{class:[this.themeClass,`${o}-color-picker`],ref:"selfRef",style:this.cssVars},r(po,null,{default:()=>[r(ho,null,{default:()=>r(Xo,{clsPrefix:o,value:this.mergedValue,hsla:this.hsla,disabled:this.mergedDisabled,onClick:this.handleTriggerClick},{label:e.label})}),r(fo,{placement:this.placement,show:this.mergedShow,containerClass:this.namespace,teleportDisabled:this.adjustedTo===tt.tdkey,to:this.adjustedTo},{default:()=>r(Zt,{name:"fade-in-scale-up-transition",appear:this.isMounted},{default:()=>this.mergedShow?Wt(this.renderPanel(),[[Qt,this.handleClickOutside,void 0,{capture:!0}]]):null})})]}))}}),oi=()=>io,ii=Jt({name:"DynamicInput",common:eo,peers:{Input:to,Button:oo},self:oi}),ai=ii,st=wt("n-dynamic-input"),li=K({name:"DynamicInputInputPreset",props:{clsPrefix:{type:String,required:!0},value:{type:String,default:""},disabled:Boolean,parentPath:String,path:String,onUpdateValue:{type:Function,required:!0}},setup(){const{mergedThemeRef:e,placeholderRef:o}=Ae(st);return{mergedTheme:e,placeholder:o}},render(){const{mergedTheme:e,placeholder:o,value:i,clsPrefix:a,onUpdateValue:l,disabled:t}=this;return r("div",{class:`${a}-dynamic-input-preset-input`},r(M,{theme:e.peers.Input,"theme-overrides":e.peerOverrides.Input,value:i,placeholder:o,onUpdateValue:l,disabled:t}))}}),ri=K({name:"DynamicInputPairPreset",props:{clsPrefix:{type:String,required:!0},value:{type:Object,default:()=>({key:"",value:""})},disabled:Boolean,parentPath:String,path:String,onUpdateValue:{type:Function,required:!0}},setup(e){const{mergedThemeRef:o,keyPlaceholderRef:i,valuePlaceholderRef:a}=Ae(st);return{mergedTheme:o,keyPlaceholder:i,valuePlaceholder:a,handleKeyInput(l){e.onUpdateValue({key:l,value:e.value.value})},handleValueInput(l){e.onUpdateValue({key:e.value.key,value:l})}}},render(){const{mergedTheme:e,keyPlaceholder:o,valuePlaceholder:i,value:a,clsPrefix:l,disabled:t}=this;return r("div",{class:`${l}-dynamic-input-preset-pair`},r(M,{theme:e.peers.Input,"theme-overrides":e.peerOverrides.Input,value:a.key,class:`${l}-dynamic-input-pair-input`,placeholder:o,onUpdateValue:this.handleKeyInput,disabled:t}),r(M,{theme:e.peers.Input,"theme-overrides":e.peerOverrides.Input,value:a.value,class:`${l}-dynamic-input-pair-input`,placeholder:i,onUpdateValue:this.handleValueInput,disabled:t}))}}),ni=g("dynamic-input",{width:"100%"},[g("dynamic-input-item",`
 margin-bottom: 10px;
 display: flex;
 flex-wrap: nowrap;
 `,[g("dynamic-input-preset-input",{flex:1,alignItems:"center"}),g("dynamic-input-preset-pair",`
 flex: 1;
 display: flex;
 align-items: center;
 `,[g("dynamic-input-pair-input",[U("&:first-child",{"margin-right":"12px"})])]),D("action",`
 align-self: flex-start;
 display: flex;
 justify-content: flex-end;
 flex-shrink: 0;
 flex-grow: 0;
 margin: var(--action-margin);
 `,[te("icon",{cursor:"pointer"})]),U("&:last-child",{marginBottom:0})]),g("form-item",`
 padding-top: 0 !important;
 margin-right: 0 !important;
 `,[g("form-item-blank",{paddingTop:"0 !important"})])]),Te=new WeakMap,si=Object.assign(Object.assign({},qe.props),{max:Number,min:{type:Number,default:0},value:Array,defaultValue:{type:Array,default:()=>[]},preset:{type:String,default:"input"},keyField:String,itemClass:String,itemStyle:[String,Object],keyPlaceholder:{type:String,default:""},valuePlaceholder:{type:String,default:""},placeholder:{type:String,default:""},disabled:Boolean,showSortButton:Boolean,createButtonProps:Object,onCreate:Function,onRemove:Function,"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],onClear:Function,onInput:[Function,Array]}),vt=K({name:"DynamicInput",props:si,setup(e,{slots:o}){const{mergedComponentPropsRef:i,mergedClsPrefixRef:a,mergedRtlRef:l,inlineThemeDisabled:t}=He(),s=Ae(ao,null),c=T(e.defaultValue),b=pe(e,"value"),x=ot(b,c),B=qe("DynamicInput","-dynamic-input",ni,ai,e,a),S=E(()=>{const{value:u}=x;if(Array.isArray(u)){const{max:f}=e;return f!==void 0&&u.length>=f}return!1}),j=E(()=>{const{value:u}=x;return Array.isArray(u)?u.length<=e.min:!0}),Z=E(()=>{var u,f;return(f=(u=i==null?void 0:i.value)===null||u===void 0?void 0:u.DynamicInput)===null||f===void 0?void 0:f.buttonSize});function z(u){const{onInput:f,"onUpdate:value":k,onUpdateValue:y}=e;f&&he(f,u),k&&he(k,u),y&&he(y,u),c.value=u}function Q(u,f){if(u==null||typeof u!="object")return f;const k=Ze(u)?We(u):u;let y=Te.get(k);return y===void 0&&Te.set(k,y=lo()),y}function W(u,f){const{value:k}=x,y=Array.from(k!=null?k:[]),H=y[u];if(y[u]=f,H&&f&&typeof H=="object"&&typeof f=="object"){const Y=Ze(H)?We(H):H,G=Ze(f)?We(f):f,le=Te.get(Y);le!==void 0&&Te.set(G,le)}z(y)}function p(){m(-1)}function m(u){const{value:f}=x,{onCreate:k}=e,y=Array.from(f!=null?f:[]);if(k)y.splice(u+1,0,k(u+1)),z(y);else if(o.default)y.splice(u+1,0,null),z(y);else switch(e.preset){case"input":y.splice(u+1,0,""),z(y);break;case"pair":y.splice(u+1,0,{key:"",value:""}),z(y);break}}function I(u){const{value:f}=x;if(!Array.isArray(f))return;const{min:k}=e;if(f.length<=k)return;const{onRemove:y}=e;y&&y(u);const H=Array.from(f);H.splice(u,1),z(H)}function $(u,f,k){if(f<0||k<0||f>=u.length||k>=u.length||f===k)return;const y=u[f];u[f]=u[k],u[k]=y}function d(u,f){const{value:k}=x;if(!Array.isArray(k))return;const y=Array.from(k);u==="up"&&$(y,f,f-1),u==="down"&&$(y,f,f+1),z(y)}rt(st,{mergedThemeRef:B,keyPlaceholderRef:pe(e,"keyPlaceholder"),valuePlaceholderRef:pe(e,"valuePlaceholder"),placeholderRef:pe(e,"placeholder")});const C=yt("DynamicInput",l,a),De=E(()=>{const{self:{actionMargin:u,actionMarginRtl:f}}=B.value;return{"--action-margin":u,"--action-margin-rtl":f}}),F=t?_t("dynamic-input",void 0,De,e):void 0;return{locale:xt("DynamicInput").localeRef,rtlEnabled:C,buttonSize:Z,mergedClsPrefix:a,NFormItem:s,uncontrolledValue:c,mergedValue:x,insertionDisabled:S,removeDisabled:j,handleCreateClick:p,ensureKey:Q,handleValueChange:W,remove:I,move:d,createItem:m,mergedTheme:B,cssVars:t?void 0:De,themeClass:F==null?void 0:F.themeClass,onRender:F==null?void 0:F.onRender}},render(){const{$slots:e,itemClass:o,buttonSize:i,mergedClsPrefix:a,mergedValue:l,locale:t,mergedTheme:s,keyField:c,itemStyle:b,preset:x,showSortButton:B,NFormItem:S,ensureKey:j,handleValueChange:Z,remove:z,createItem:Q,move:W,onRender:p,disabled:m}=this;return p==null||p(),r("div",{class:[`${a}-dynamic-input`,this.rtlEnabled&&`${a}-dynamic-input--rtl`,this.themeClass],style:this.cssVars},!Array.isArray(l)||l.length===0?r(J,Object.assign({block:!0,ghost:!0,dashed:!0,size:i},this.createButtonProps,{disabled:this.insertionDisabled||m,theme:s.peers.Button,themeOverrides:s.peerOverrides.Button,onClick:this.handleCreateClick}),{default:()=>ct(e["create-button-default"],()=>[t.create]),icon:()=>ct(e["create-button-icon"],()=>[r(Se,{clsPrefix:a},{default:()=>r(ht,null)})])}):l.map((I,$)=>r("div",{key:c?I[c]:j(I,$),"data-key":c?I[c]:j(I,$),class:[`${a}-dynamic-input-item`,o],style:b},mt(e.default,{value:l[$],index:$},()=>[x==="input"?r(li,{disabled:m,clsPrefix:a,value:l[$],parentPath:S?S.path.value:void 0,path:S!=null&&S.path.value?`${S.path.value}[${$}]`:void 0,onUpdateValue:d=>{Z($,d)}}):x==="pair"?r(ri,{disabled:m,clsPrefix:a,value:l[$],parentPath:S?S.path.value:void 0,path:S!=null&&S.path.value?`${S.path.value}[${$}]`:void 0,onUpdateValue:d=>{Z($,d)}}):null]),mt(e.action,{value:l[$],index:$,create:Q,remove:z,move:W},()=>[r("div",{class:`${a}-dynamic-input-item__action`},r(Vo,{size:i},{default:()=>[r(J,{disabled:this.removeDisabled||m,theme:s.peers.Button,themeOverrides:s.peerOverrides.Button,circle:!0,onClick:()=>{z($)}},{icon:()=>r(Se,{clsPrefix:a},{default:()=>r(wo,null)})}),r(J,{disabled:this.insertionDisabled||m,circle:!0,theme:s.peers.Button,themeOverrides:s.peerOverrides.Button,onClick:()=>{Q($)}},{icon:()=>r(Se,{clsPrefix:a},{default:()=>r(ht,null)})}),B?r(J,{disabled:$===0||m,circle:!0,theme:s.peers.Button,themeOverrides:s.peerOverrides.Button,onClick:()=>{W("up",$)}},{icon:()=>r(Se,{clsPrefix:a},{default:()=>r(xo,null)})}):null,B?r(J,{disabled:$===l.length-1||m,circle:!0,theme:s.peers.Button,themeOverrides:s.peerOverrides.Button,onClick:()=>{W("down",$)}},{icon:()=>r(Se,{clsPrefix:a},{default:()=>r(_o,null)})}):null]}))]))))}}),gt=["mdi-air-humidifier-off","mdi-chili-off","mdi-cigar-off","mdi-clock-time-eight","mdi-clock-time-eight-outline","mdi-clock-time-eleven","mdi-clock-time-eleven-outline","mdi-clock-time-five","mdi-clock-time-five-outline","mdi-clock-time-four","mdi-clock-time-four-outline","mdi-clock-time-nine","mdi-clock-time-nine-outline","mdi-clock-time-one","mdi-clock-time-one-outline","mdi-clock-time-seven","mdi-clock-time-seven-outline","mdi-clock-time-six","mdi-clock-time-six-outline","mdi-clock-time-ten","mdi-clock-time-ten-outline","mdi-clock-time-three","mdi-clock-time-three-outline","mdi-clock-time-twelve","mdi-clock-time-twelve-outline","mdi-clock-time-two","mdi-clock-time-two-outline","mdi-cog-refresh","mdi-cog-refresh-outline","mdi-cog-sync","mdi-cog-sync-outline","mdi-content-save-cog","mdi-content-save-cog-outline","mdi-cosine-wave","mdi-cube-off","mdi-cube-off-outline","mdi-dome-light","mdi-download-box","mdi-download-box-outline","mdi-download-circle","mdi-download-circle-outline","mdi-fan-alert","mdi-fan-chevron-down","mdi-fan-chevron-up","mdi-fan-minus","mdi-fan-plus","mdi-fan-remove","mdi-fan-speed-1","mdi-fan-speed-2","mdi-fan-speed-3","mdi-food-drumstick","mdi-food-drumstick-off","mdi-food-drumstick-off-outline","mdi-food-drumstick-outline","mdi-food-steak","mdi-food-steak-off","mdi-fuse-alert","mdi-fuse-off","mdi-heart-minus","mdi-heart-minus-outline","mdi-heart-off-outline","mdi-heart-plus","mdi-heart-plus-outline","mdi-heart-remove","mdi-heart-remove-outline","mdi-hours-24","mdi-incognito-circle","mdi-incognito-circle-off","mdi-lingerie","mdi-microwave-off","mdi-minus-circle-off","mdi-minus-circle-off-outline","mdi-motion-sensor-off","mdi-pail-minus","mdi-pail-minus-outline","mdi-pail-off","mdi-pail-off-outline","mdi-pail-outline","mdi-pail-plus","mdi-pail-plus-outline","mdi-pail-remove","mdi-pail-remove-outline","mdi-pine-tree-fire","mdi-power-plug-off-outline","mdi-power-plug-outline","mdi-printer-eye","mdi-printer-search","mdi-puzzle-check","mdi-puzzle-check-outline","mdi-rug","mdi-sawtooth-wave","mdi-set-square","mdi-smoking-pipe-off","mdi-spoon-sugar","mdi-square-wave","mdi-table-split-cell","mdi-ticket-percent-outline","mdi-triangle-wave","mdi-waveform","mdi-wizard-hat","mdi-ab-testing","mdi-abjad-arabic","mdi-abjad-hebrew","mdi-abugida-devanagari","mdi-abugida-thai","mdi-access-point","mdi-access-point-network","mdi-access-point-network-off","mdi-account","mdi-account-alert","mdi-account-alert-outline","mdi-account-arrow-left","mdi-account-arrow-left-outline","mdi-account-arrow-right","mdi-account-arrow-right-outline","mdi-account-box","mdi-account-box-multiple","mdi-account-box-multiple-outline","mdi-account-box-outline","mdi-account-cancel","mdi-account-cancel-outline","mdi-account-cash","mdi-account-cash-outline","mdi-account-check","mdi-account-check-outline","mdi-account-child","mdi-account-child-circle","mdi-account-child-outline","mdi-account-circle","mdi-account-circle-outline","mdi-account-clock","mdi-account-clock-outline","mdi-account-cog","mdi-account-cog-outline","mdi-account-convert","mdi-account-convert-outline","mdi-account-cowboy-hat","mdi-account-details","mdi-account-details-outline","mdi-account-edit","mdi-account-edit-outline","mdi-account-group","mdi-account-group-outline","mdi-account-hard-hat","mdi-account-heart","mdi-account-heart-outline","mdi-account-key","mdi-account-key-outline","mdi-account-lock","mdi-account-lock-outline","mdi-account-minus","mdi-account-minus-outline","mdi-account-multiple","mdi-account-multiple-check","mdi-account-multiple-check-outline","mdi-account-multiple-minus","mdi-account-multiple-minus-outline","mdi-account-multiple-outline","mdi-account-multiple-plus","mdi-account-multiple-plus-outline","mdi-account-multiple-remove","mdi-account-multiple-remove-outline","mdi-account-music","mdi-account-music-outline","mdi-account-network","mdi-account-network-outline","mdi-account-off","mdi-account-off-outline","mdi-account-outline","mdi-account-plus","mdi-account-plus-outline","mdi-account-question","mdi-account-question-outline","mdi-account-remove","mdi-account-remove-outline","mdi-account-search","mdi-account-search-outline","mdi-account-settings","mdi-account-settings-outline","mdi-account-star","mdi-account-star-outline","mdi-account-supervisor","mdi-account-supervisor-circle","mdi-account-supervisor-outline","mdi-account-switch","mdi-account-switch-outline","mdi-account-tie","mdi-account-tie-outline","mdi-account-tie-voice","mdi-account-tie-voice-off","mdi-account-tie-voice-off-outline","mdi-account-tie-voice-outline","mdi-account-voice","mdi-adjust","mdi-adobe","mdi-adobe-acrobat","mdi-air-conditioner","mdi-air-filter","mdi-air-horn","mdi-air-humidifier","mdi-air-purifier","mdi-airbag","mdi-airballoon","mdi-airballoon-outline","mdi-airplane","mdi-airplane-landing","mdi-airplane-off","mdi-airplane-takeoff","mdi-airport","mdi-alarm","mdi-alarm-bell","mdi-alarm-check","mdi-alarm-light","mdi-alarm-light-outline","mdi-alarm-multiple","mdi-alarm-note","mdi-alarm-note-off","mdi-alarm-off","mdi-alarm-plus","mdi-alarm-snooze","mdi-album","mdi-alert","mdi-alert-box","mdi-alert-box-outline","mdi-alert-circle","mdi-alert-circle-check","mdi-alert-circle-check-outline","mdi-alert-circle-outline"],ui={class:"w-full"},di=Pe("span",{class:"i-mdi:magnify text-18"},null,-1),ci=Pe("a",{class:"text-blue",target:"_blank",href:"https://icones.js.org/collection/all"}," Icones ",-1),mi={key:0,class:"h-150 w-300 overflow-y-scroll"},pi=["onClick"],hi={key:1},fi={__name:"IconPicker",props:{value:String},emits:["update:value"],setup(e,{emit:o}){const i=e,a=o,l=T(i.value),t=T(gt);function s(){t.value=gt.filter(b=>b.includes(l.value))}function c(b){l.value=b,a("update:value",l.value)}return ro(l,()=>{s(),a("update:value",l.value)},{debounce:200}),(b,x)=>(ee(),$e("div",ui,[v(h(vo),{trigger:"click",placement:"bottom-start"},{trigger:_(()=>[v(h(M),{value:l.value,"onUpdate:value":[x[0]||(x[0]=B=>l.value=B),s],placeholder:"请输入图标名称"},{prefix:_(()=>[di]),suffix:_(()=>[v(Xe,{icon:l.value,size:18},null,8,["icon"])]),_:1},8,["value"])]),footer:_(()=>[Ve(" 更多图标去 "),ci,Ve(" 查看 ")]),default:_(()=>[t.value.length?(ee(),$e("ul",mi,[(ee(!0),$e(no,null,so(t.value,(B,S)=>(ee(),$e("li",{key:S,class:"mx-5 inline-block cursor-pointer hover:text-cyan",onClick:j=>c(B)},[v(Xe,{icon:B,size:18},null,8,["icon"])],8,pi))),128))])):(ee(),$e("div",hi,[v(Xe,{icon:l.value,size:18},null,8,["icon"])]))]),_:1})]))}};const vi={class:"m-30 flex items-center"},gi={style:{display:"flex","align-items":"center",width:"100%"}},bi={style:{display:"flex","flex-direction":"column",width:"100%",gap:"10px"}},yi={__name:"index",setup(e){var S,j,Z,z,Q,W;const{t:o}=uo(),i=co(),a=T(!1),l=T(null),t=T({site_url:i.metaSetting.site_url,site_keywords:i.metaSetting.site_keywords,site_name:i.metaSetting.site_name,site_desc:i.metaSetting.site_desc,primary_color:i.metaSetting.primary_color,site_splitter:i.metaSetting.site_splitter,site_icon:i.metaSetting.site_icon,site_apple_icon:i.metaSetting.site_apple_icon,bottom_icon:i.metaSetting.bottom_icon,bottom_desc:i.metaSetting.bottom_desc,icp:i.metaSetting.icp,entries:(S=i.metaSetting.entries)!=null?S:[{name:"",icon:"",url:""}],hero_autoplay:(j=i.metaSetting.hero_autoplay)!=null?j:!0,hero_interval:(Z=i.metaSetting.hero_interval)!=null?Z:5e3,hero_show_indicators:(z=i.metaSetting.hero_show_indicators)!=null?z:!0,hero_show_controls:(Q=i.metaSetting.hero_show_controls)!=null?Q:!0,hero_images:(W=i.metaSetting.hero_images)!=null?W:[{url:"",title:"",description:""}]});function s(){return Ge(this,null,function*(){var p;a.value=!0,(p=l.value)==null||p.validate(m=>Ge(this,null,function*(){if(!m){var I=i.totalSetting;I.meta=t.value,yield mo.updateSetting(I).then(()=>{i.setMetaSetting(t.value),a.value=!1,$message.success(o("common.text.save_success"))}).catch(()=>{a.value=!1})}}))})}const c={};function b(){return{name:"",icon:"",url:""}}function x(){return{url:"",title:"",description:""}}const B="#20809F";return(p,m)=>{const I=ti,$=fi;return ee(),Ue(go,{title:p.$t("views.setting.label_meta_setting")},{default:_(()=>[Pe("div",vi,[v(h(bo),{ref_key:"infoFormRef",ref:l,"label-placement":"top","label-align":"left","label-width":"100",model:t.value,rules:c,class:"w-500"},{default:_(()=>[v(h(q),{label:p.$t("views.setting.label_site_url"),path:"site_url"},{default:_(()=>[v(h(M),{value:t.value.site_url,"onUpdate:value":m[0]||(m[0]=d=>t.value.site_url=d),type:"text",placeholder:p.$t("views.setting.placeholder_site_url"),clearable:""},null,8,["value","placeholder"])]),_:1},8,["label"]),v(h(q),{label:p.$t("views.setting.label_site_name"),path:"site_name"},{default:_(()=>[v(h(M),{value:t.value.site_name,"onUpdate:value":m[1]||(m[1]=d=>t.value.site_name=d),type:"text",placeholder:p.$t("views.setting.placeholder_site_name"),clearable:""},null,8,["value","placeholder"])]),_:1},8,["label"]),v(h(q),{label:p.$t("views.setting.label_site_splitter"),path:"site_splitter"},{default:_(()=>[v(h(M),{value:t.value.site_splitter,"onUpdate:value":m[2]||(m[2]=d=>t.value.site_splitter=d),type:"text",placeholder:p.$t("views.setting.placeholder_site_splitter"),clearable:""},null,8,["value","placeholder"])]),_:1},8,["label"]),v(h(q),{label:p.$t("views.setting.label_site_desc"),path:"site_desc"},{default:_(()=>[v(h(M),{value:t.value.site_desc,"onUpdate:value":m[3]||(m[3]=d=>t.value.site_desc=d),type:"text",placeholder:p.$t("views.setting.placeholder_site_desc"),clearable:""},null,8,["value","placeholder"])]),_:1},8,["label"]),v(h(q),{label:p.$t("views.setting.label_site_keywords"),path:"site_keywords"},{default:_(()=>[v(h(M),{value:t.value.site_keywords,"onUpdate:value":m[4]||(m[4]=d=>t.value.site_keywords=d),type:"text",placeholder:p.$t("views.setting.placeholder_site_keywords"),clearable:""},null,8,["value","placeholder"])]),_:1},8,["label"]),v(h(q),{label:p.$t("views.setting.label_site_icon"),path:"site_icon"},{default:_(()=>[v(h(M),{value:t.value.site_icon,"onUpdate:value":m[5]||(m[5]=d=>t.value.site_icon=d),type:"text",placeholder:p.$t("views.setting.placeholder_site_icon"),clearable:""},null,8,["value","placeholder"])]),_:1},8,["label"]),t.value.site_icon!=null&&t.value.site_icon!=""?(ee(),Ue(h(Be),{key:0,width:"50",src:t.value.site_icon,class:"icon"},null,8,["src"])):Me("",!0),v(h(q),{label:p.$t("views.setting.label_site_apple_icon"),path:"site_apple_icon"},{default:_(()=>[v(h(M),{value:t.value.site_apple_icon,"onUpdate:value":m[6]||(m[6]=d=>t.value.site_apple_icon=d),type:"text",placeholder:p.$t("views.setting.placeholder_site_apple_icon"),clearable:""},null,8,["value","placeholder"])]),_:1},8,["label"]),t.value.site_apple_icon!=null&&t.value.site_apple_icon!=""?(ee(),Ue(h(Be),{key:1,width:"50",src:t.value.site_apple_icon,class:"icon"},null,8,["src"])):Me("",!0),v(h(q),{label:p.$t("views.setting.label_bottom_icon"),path:"bottom_icon"},{default:_(()=>[v(h(M),{value:t.value.bottom_icon,"onUpdate:value":m[7]||(m[7]=d=>t.value.bottom_icon=d),type:"text",placeholder:p.$t("views.setting.placeholder_bottom_icon"),clearable:""},null,8,["value","placeholder"])]),_:1},8,["label"]),t.value.bottom_icon!=null&&t.value.bottom_icon!=""?(ee(),Ue(h(Be),{key:2,width:"50",src:t.value.bottom_icon,class:"icon"},null,8,["src"])):Me("",!0),v(h(q),{label:p.$t("views.setting.label_bottom_desc"),path:"bottom_desc"},{default:_(()=>[v(h(M),{value:t.value.bottom_desc,"onUpdate:value":m[8]||(m[8]=d=>t.value.bottom_desc=d),type:"text",placeholder:p.$t("views.setting.placeholder_bottom_desc"),clearable:""},null,8,["value","placeholder"])]),_:1},8,["label"]),v(h(q),{label:p.$t("views.setting.label_primary_color"),path:"primary_color"},{default:_(()=>[v(I,{value:t.value.primary_color,"onUpdate:value":m[9]||(m[9]=d=>t.value.primary_color=d),"show-alpha":!1,"default-value":h(B),class:"w-200"},null,8,["value","default-value"])]),_:1},8,["label"]),v(h(q),{label:p.$t("views.setting.label_icp"),path:"icp"},{default:_(()=>[v(h(M),{value:t.value.icp,"onUpdate:value":m[10]||(m[10]=d=>t.value.icp=d),type:"text",placeholder:p.$t("views.setting.placeholder_icp"),clearable:""},null,8,["value","placeholder"])]),_:1},8,["label"]),v(h(q),{label:p.$t("views.setting.label_entries"),path:"entries",class:"w-800"},{default:_(()=>[v(h(vt),{value:t.value.entries,"onUpdate:value":m[11]||(m[11]=d=>t.value.entries=d),"on-create":b},{"create-button-default":_(()=>[Ve(pt(h(o)("views.setting.label_create_entries")),1)]),default:_(({value:d})=>[Pe("div",gi,[v(h(M),{value:d.name,"onUpdate:value":C=>d.name=C,placeholder:p.$t("views.setting.placeholder_entry_name"),type:"text",style:{"margin-left":"5px"}},null,8,["value","onUpdate:value","placeholder"]),v($,{value:d.icon,"onUpdate:value":C=>d.icon=C,style:{"margin-left":"5px"}},null,8,["value","onUpdate:value"]),v(h(M),{value:d.url,"onUpdate:value":C=>d.url=C,placeholder:p.$t("views.setting.placeholder_entry_url"),type:"text",style:{"margin-left":"5px"}},null,8,["value","onUpdate:value","placeholder"])])]),_:1},8,["value"])]),_:1},8,["label"]),v(h(q),{label:"封面自动播放",path:"hero_autoplay"},{default:_(()=>[v(h(Qe),{value:t.value.hero_autoplay,"onUpdate:value":m[12]||(m[12]=d=>t.value.hero_autoplay=d)},null,8,["value"])]),_:1}),v(h(q),{label:"播放间隔(毫秒)",path:"hero_interval"},{default:_(()=>[v(h(ko),{value:t.value.hero_interval,"onUpdate:value":m[13]||(m[13]=d=>t.value.hero_interval=d),min:1e3,max:1e4,step:1e3},null,8,["value"])]),_:1}),v(h(q),{label:"显示指示器",path:"hero_show_indicators"},{default:_(()=>[v(h(Qe),{value:t.value.hero_show_indicators,"onUpdate:value":m[14]||(m[14]=d=>t.value.hero_show_indicators=d)},null,8,["value"])]),_:1}),v(h(q),{label:"显示控制按钮",path:"hero_show_controls"},{default:_(()=>[v(h(Qe),{value:t.value.hero_show_controls,"onUpdate:value":m[15]||(m[15]=d=>t.value.hero_show_controls=d)},null,8,["value"])]),_:1}),v(h(q),{label:"封面图片",path:"hero_images",class:"w-800"},{default:_(()=>[v(h(vt),{value:t.value.hero_images,"onUpdate:value":m[16]||(m[16]=d=>t.value.hero_images=d),"on-create":x},{"create-button-default":_(()=>[Ve(" 添加封面图片 ")]),default:_(({value:d})=>[Pe("div",bi,[v(h(M),{value:d.url,"onUpdate:value":C=>d.url=C,placeholder:"图片地址",type:"text"},null,8,["value","onUpdate:value"]),v(h(M),{value:d.title,"onUpdate:value":C=>d.title=C,placeholder:"图片标题",type:"text"},null,8,["value","onUpdate:value"]),v(h(M),{value:d.description,"onUpdate:value":C=>d.description=C,placeholder:"图片描述",type:"text"},null,8,["value","onUpdate:value"]),d.url?(ee(),Ue(h(Be),{key:0,src:d.url,width:"200",class:"icon"},null,8,["src"])):Me("",!0)])]),_:1},8,["value"])]),_:1}),v(h(J),{type:"primary",loading:a.value,onClick:s},{default:_(()=>[Ve(pt(p.$t("common.buttons.save")),1)]),_:1},8,["loading"])]),_:1},8,["model"])])]),_:1},8,["title"])}}},Fi=yo(yi,[["__scopeId","data-v-d791c601"]]);export{Fi as default};
