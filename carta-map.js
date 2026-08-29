/* ============================================================================
     The map layer (ROADMAP.md Phase 12) — inline, like everything else here.

     d3-array + d3-geo are vendored verbatim from npm (ISC, Mike Bostock): the
     two modules the passport's projection actually needs — geoEquirectangular,
     geoPath, and the fit/bounds/centroid it reads off them. Full d3 is 280 KB
     for those three calls; these two are 54 KB and are the modules the rest of
     it re-exports. Nothing here fetches: the outlines come from LANDS, already
     in this file. Upgrade by re-pasting the dist files, unchanged.
     ========================================================================= */

/* d3-array 3.2.4 — https://d3js.org/d3-array — ISC */
// https://d3js.org/d3-array/ v3.2.4 Copyright 2010-2023 Mike Bostock
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((t="undefined"!=typeof globalThis?globalThis:t||self).d3=t.d3||{})}(this,(function(t){"use strict";function n(t,n){return null==t||null==n?NaN:t<n?-1:t>n?1:t>=n?0:NaN}function r(t,n){return null==t||null==n?NaN:n<t?-1:n>t?1:n>=t?0:NaN}function e(t){let e,f,i;function u(t,n,r=0,o=t.length){if(r<o){if(0!==e(n,n))return o;do{const e=r+o>>>1;f(t[e],n)<0?r=e+1:o=e}while(r<o)}return r}return 2!==t.length?(e=n,f=(r,e)=>n(t(r),e),i=(n,r)=>t(n)-r):(e=t===n||t===r?t:o,f=t,i=t),{left:u,center:function(t,n,r=0,e=t.length){const o=u(t,n,r,e-1);return o>r&&i(t[o-1],n)>-i(t[o],n)?o-1:o},right:function(t,n,r=0,o=t.length){if(r<o){if(0!==e(n,n))return o;do{const e=r+o>>>1;f(t[e],n)<=0?r=e+1:o=e}while(r<o)}return r}}}function o(){return 0}function f(t){return null===t?NaN:+t}const i=e(n),u=i.right,l=i.left,c=e(f).center;var s=u;const a=d(m),h=d((function(t){const n=m(t);return(t,r,e,o,f)=>{n(t,r,(e<<=2)+0,(o<<=2)+0,f<<=2),n(t,r,e+1,o+1,f),n(t,r,e+2,o+2,f),n(t,r,e+3,o+3,f)}}));function d(t){return function(n,r,e=r){if(!((r=+r)>=0))throw new RangeError("invalid rx");if(!((e=+e)>=0))throw new RangeError("invalid ry");let{data:o,width:f,height:i}=n;if(!((f=Math.floor(f))>=0))throw new RangeError("invalid width");if(!((i=Math.floor(void 0!==i?i:o.length/f))>=0))throw new RangeError("invalid height");if(!f||!i||!r&&!e)return n;const u=r&&t(r),l=e&&t(e),c=o.slice();return u&&l?(p(u,c,o,f,i),p(u,o,c,f,i),p(u,c,o,f,i),y(l,o,c,f,i),y(l,c,o,f,i),y(l,o,c,f,i)):u?(p(u,o,c,f,i),p(u,c,o,f,i),p(u,o,c,f,i)):l&&(y(l,o,c,f,i),y(l,c,o,f,i),y(l,o,c,f,i)),n}}function p(t,n,r,e,o){for(let f=0,i=e*o;f<i;)t(n,r,f,f+=e,1)}function y(t,n,r,e,o){for(let f=0,i=e*o;f<e;++f)t(n,r,f,f+i,e)}function m(t){const n=Math.floor(t);if(n===t)return function(t){const n=2*t+1;return(r,e,o,f,i)=>{if(!((f-=i)>=o))return;let u=t*e[o];const l=i*t;for(let t=o,n=o+l;t<n;t+=i)u+=e[Math.min(f,t)];for(let t=o,c=f;t<=c;t+=i)u+=e[Math.min(f,t+l)],r[t]=u/n,u-=e[Math.max(o,t-l)]}}(t);const r=t-n,e=2*t+1;return(t,o,f,i,u)=>{if(!((i-=u)>=f))return;let l=n*o[f];const c=u*n,s=c+u;for(let t=f,n=f+c;t<n;t+=u)l+=o[Math.min(i,t)];for(let n=f,a=i;n<=a;n+=u)l+=o[Math.min(i,n+c)],t[n]=(l+r*(o[Math.max(f,n-s)]+o[Math.min(i,n+s)]))/e,l-=o[Math.max(f,n-c)]}}function g(t,n){let r=0;if(void 0===n)for(let n of t)null!=n&&(n=+n)>=n&&++r;else{let e=-1;for(let o of t)null!=(o=n(o,++e,t))&&(o=+o)>=o&&++r}return r}function v(t){return 0|t.length}function M(t){return!(t>0)}function w(t){return"object"!=typeof t||"length"in t?t:Array.from(t)}function b(t,n){let r,e=0,o=0,f=0;if(void 0===n)for(let n of t)null!=n&&(n=+n)>=n&&(r=n-o,o+=r/++e,f+=r*(n-o));else{let i=-1;for(let u of t)null!=(u=n(u,++i,t))&&(u=+u)>=u&&(r=u-o,o+=r/++e,f+=r*(u-o))}if(e>1)return f/(e-1)}function A(t,n){const r=b(t,n);return r?Math.sqrt(r):r}function x(t,n){let r,e;if(void 0===n)for(const n of t)null!=n&&(void 0===r?n>=n&&(r=e=n):(r>n&&(r=n),e<n&&(e=n)));else{let o=-1;for(let f of t)null!=(f=n(f,++o,t))&&(void 0===r?f>=f&&(r=e=f):(r>f&&(r=f),e<f&&(e=f)))}return[r,e]}class N{constructor(){this._partials=new Float64Array(32),this._n=0}add(t){const n=this._partials;let r=0;for(let e=0;e<this._n&&e<32;e++){const o=n[e],f=t+o,i=Math.abs(t)<Math.abs(o)?t-(f-o):o-(f-t);i&&(n[r++]=i),t=f}return n[r]=t,this._n=r+1,this}valueOf(){const t=this._partials;let n,r,e,o=this._n,f=0;if(o>0){for(f=t[--o];o>0&&(n=f,r=t[--o],f=n+r,e=r-(f-n),!e););o>0&&(e<0&&t[o-1]<0||e>0&&t[o-1]>0)&&(r=2*e,n=f+r,r==n-f&&(f=n))}return f}}class InternMap extends Map{constructor(t,n=k){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:n}}),null!=t)for(const[n,r]of t)this.set(n,r)}get(t){return super.get(E(this,t))}has(t){return super.has(E(this,t))}set(t,n){return super.set(_(this,t),n)}delete(t){return super.delete(S(this,t))}}class InternSet extends Set{constructor(t,n=k){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:n}}),null!=t)for(const n of t)this.add(n)}has(t){return super.has(E(this,t))}add(t){return super.add(_(this,t))}delete(t){return super.delete(S(this,t))}}function E({_intern:t,_key:n},r){const e=n(r);return t.has(e)?t.get(e):r}function _({_intern:t,_key:n},r){const e=n(r);return t.has(e)?t.get(e):(t.set(e,r),r)}function S({_intern:t,_key:n},r){const e=n(r);return t.has(e)&&(r=t.get(e),t.delete(e)),r}function k(t){return null!==t&&"object"==typeof t?t.valueOf():t}function T(t){return t}function F(t,...n){return U(t,T,T,n)}function I(t,...n){return U(t,Array.from,T,n)}function j(t,n){for(let r=1,e=n.length;r<e;++r)t=t.flatMap((t=>t.pop().map((([n,r])=>[...t,n,r]))));return t}function q(t,n,...r){return U(t,T,n,r)}function R(t,n,...r){return U(t,Array.from,n,r)}function O(t){if(1!==t.length)throw new Error("duplicate key");return t[0]}function U(t,n,r,e){return function t(o,f){if(f>=e.length)return r(o);const i=new InternMap,u=e[f++];let l=-1;for(const t of o){const n=u(t,++l,o),r=i.get(n);r?r.push(t):i.set(n,[t])}for(const[n,r]of i)i.set(n,t(r,f));return n(i)}(t,0)}function L(t,n){return Array.from(n,(n=>t[n]))}function P(t,...n){if("function"!=typeof t[Symbol.iterator])throw new TypeError("values is not iterable");t=Array.from(t);let[r]=n;if(r&&2!==r.length||n.length>1){const e=Uint32Array.from(t,((t,n)=>n));return n.length>1?(n=n.map((n=>t.map(n))),e.sort(((t,r)=>{for(const e of n){const n=C(e[t],e[r]);if(n)return n}}))):(r=t.map(r),e.sort(((t,n)=>C(r[t],r[n])))),L(t,e)}return t.sort(z(r))}function z(t=n){if(t===n)return C;if("function"!=typeof t)throw new TypeError("compare is not a function");return(n,r)=>{const e=t(n,r);return e||0===e?e:(0===t(r,r))-(0===t(n,n))}}function C(t,n){return(null==t||!(t>=t))-(null==n||!(n>=n))||(t<n?-1:t>n?1:0)}var D=Array.prototype.slice;function G(t){return()=>t}const B=Math.sqrt(50),H=Math.sqrt(10),J=Math.sqrt(2);function K(t,n,r){const e=(n-t)/Math.max(0,r),o=Math.floor(Math.log10(e)),f=e/Math.pow(10,o),i=f>=B?10:f>=H?5:f>=J?2:1;let u,l,c;return o<0?(c=Math.pow(10,-o)/i,u=Math.round(t*c),l=Math.round(n*c),u/c<t&&++u,l/c>n&&--l,c=-c):(c=Math.pow(10,o)*i,u=Math.round(t/c),l=Math.round(n/c),u*c<t&&++u,l*c>n&&--l),l<u&&.5<=r&&r<2?K(t,n,2*r):[u,l,c]}function Q(t,n,r){if(!((r=+r)>0))return[];if((t=+t)===(n=+n))return[t];const e=n<t,[o,f,i]=e?K(n,t,r):K(t,n,r);if(!(f>=o))return[];const u=f-o+1,l=new Array(u);if(e)if(i<0)for(let t=0;t<u;++t)l[t]=(f-t)/-i;else for(let t=0;t<u;++t)l[t]=(f-t)*i;else if(i<0)for(let t=0;t<u;++t)l[t]=(o+t)/-i;else for(let t=0;t<u;++t)l[t]=(o+t)*i;return l}function V(t,n,r){return K(t=+t,n=+n,r=+r)[2]}function W(t,n,r){let e;for(;;){const o=V(t,n,r);if(o===e||0===o||!isFinite(o))return[t,n];o>0?(t=Math.floor(t/o)*o,n=Math.ceil(n/o)*o):o<0&&(t=Math.ceil(t*o)/o,n=Math.floor(n*o)/o),e=o}}function X(t){return Math.max(1,Math.ceil(Math.log(g(t))/Math.LN2)+1)}function Y(){var t=T,n=x,r=X;function e(e){Array.isArray(e)||(e=Array.from(e));var o,f,i,u=e.length,l=new Array(u);for(o=0;o<u;++o)l[o]=t(e[o],o,e);var c=n(l),a=c[0],h=c[1],d=r(l,a,h);if(!Array.isArray(d)){const t=h,r=+d;if(n===x&&([a,h]=W(a,h,r)),(d=Q(a,h,r))[0]<=a&&(i=V(a,h,r)),d[d.length-1]>=h)if(t>=h&&n===x){const t=V(a,h,r);isFinite(t)&&(t>0?h=(Math.floor(h/t)+1)*t:t<0&&(h=(Math.ceil(h*-t)+1)/-t))}else d.pop()}for(var p=d.length,y=0,m=p;d[y]<=a;)++y;for(;d[m-1]>h;)--m;(y||m<p)&&(d=d.slice(y,m),p=m-y);var g,v=new Array(p+1);for(o=0;o<=p;++o)(g=v[o]=[]).x0=o>0?d[o-1]:a,g.x1=o<p?d[o]:h;if(isFinite(i)){if(i>0)for(o=0;o<u;++o)null!=(f=l[o])&&a<=f&&f<=h&&v[Math.min(p,Math.floor((f-a)/i))].push(e[o]);else if(i<0)for(o=0;o<u;++o)if(null!=(f=l[o])&&a<=f&&f<=h){const t=Math.floor((a-f)*i);v[Math.min(p,t+(d[t]<=f))].push(e[o])}}else for(o=0;o<u;++o)null!=(f=l[o])&&a<=f&&f<=h&&v[s(d,f,0,p)].push(e[o]);return v}return e.value=function(n){return arguments.length?(t="function"==typeof n?n:G(n),e):t},e.domain=function(t){return arguments.length?(n="function"==typeof t?t:G([t[0],t[1]]),e):n},e.thresholds=function(t){return arguments.length?(r="function"==typeof t?t:G(Array.isArray(t)?D.call(t):t),e):r},e}function Z(t,n){let r;if(void 0===n)for(const n of t)null!=n&&(r<n||void 0===r&&n>=n)&&(r=n);else{let e=-1;for(let o of t)null!=(o=n(o,++e,t))&&(r<o||void 0===r&&o>=o)&&(r=o)}return r}function $(t,n){let r,e=-1,o=-1;if(void 0===n)for(const n of t)++o,null!=n&&(r<n||void 0===r&&n>=n)&&(r=n,e=o);else for(let f of t)null!=(f=n(f,++o,t))&&(r<f||void 0===r&&f>=f)&&(r=f,e=o);return e}function tt(t,n){let r;if(void 0===n)for(const n of t)null!=n&&(r>n||void 0===r&&n>=n)&&(r=n);else{let e=-1;for(let o of t)null!=(o=n(o,++e,t))&&(r>o||void 0===r&&o>=o)&&(r=o)}return r}function nt(t,n){let r,e=-1,o=-1;if(void 0===n)for(const n of t)++o,null!=n&&(r>n||void 0===r&&n>=n)&&(r=n,e=o);else for(let f of t)null!=(f=n(f,++o,t))&&(r>f||void 0===r&&f>=f)&&(r=f,e=o);return e}function rt(t,n,r=0,e=1/0,o){if(n=Math.floor(n),r=Math.floor(Math.max(0,r)),e=Math.floor(Math.min(t.length-1,e)),!(r<=n&&n<=e))return t;for(o=void 0===o?C:z(o);e>r;){if(e-r>600){const f=e-r+1,i=n-r+1,u=Math.log(f),l=.5*Math.exp(2*u/3),c=.5*Math.sqrt(u*l*(f-l)/f)*(i-f/2<0?-1:1);rt(t,n,Math.max(r,Math.floor(n-i*l/f+c)),Math.min(e,Math.floor(n+(f-i)*l/f+c)),o)}const f=t[n];let i=r,u=e;for(et(t,r,n),o(t[e],f)>0&&et(t,r,e);i<u;){for(et(t,i,u),++i,--u;o(t[i],f)<0;)++i;for(;o(t[u],f)>0;)--u}0===o(t[r],f)?et(t,r,u):(++u,et(t,u,e)),u<=n&&(r=u+1),n<=u&&(e=u-1)}return t}function et(t,n,r){const e=t[n];t[n]=t[r],t[r]=e}function ot(t,r=n){let e,o=!1;if(1===r.length){let f;for(const i of t){const t=r(i);(o?n(t,f)>0:0===n(t,t))&&(e=i,f=t,o=!0)}}else for(const n of t)(o?r(n,e)>0:0===r(n,n))&&(e=n,o=!0);return e}function ft(t,n,r){if(t=Float64Array.from(function*(t,n){if(void 0===n)for(let n of t)null!=n&&(n=+n)>=n&&(yield n);else{let r=-1;for(let e of t)null!=(e=n(e,++r,t))&&(e=+e)>=e&&(yield e)}}(t,r)),(e=t.length)&&!isNaN(n=+n)){if(n<=0||e<2)return tt(t);if(n>=1)return Z(t);var e,o=(e-1)*n,f=Math.floor(o),i=Z(rt(t,f).subarray(0,f+1));return i+(tt(t.subarray(f+1))-i)*(o-f)}}function it(t,n,r=f){if(!isNaN(n=+n)){if(e=Float64Array.from(t,((n,e)=>f(r(t[e],e,t)))),n<=0)return nt(e);if(n>=1)return $(e);var e,o=Uint32Array.from(t,((t,n)=>n)),i=e.length-1,u=Math.floor(i*n);return rt(o,u,0,i,((t,n)=>C(e[t],e[n]))),(u=ot(o.subarray(0,u+1),(t=>e[t])))>=0?u:-1}}function ut(t,n){return[t,n]}function lt(t,r=n){if(1===r.length)return nt(t,r);let e,o=-1,f=-1;for(const n of t)++f,(o<0?0===r(n,n):r(n,e)<0)&&(e=n,o=f);return o}var ct=st(Math.random);function st(t){return function(n,r=0,e=n.length){let o=e-(r=+r);for(;o;){const e=t()*o--|0,f=n[o+r];n[o+r]=n[e+r],n[e+r]=f}return n}}function at(t){if(!(o=t.length))return[];for(var n=-1,r=tt(t,ht),e=new Array(r);++n<r;)for(var o,f=-1,i=e[n]=new Array(o);++f<o;)i[f]=t[f][n];return e}function ht(t){return t.length}function dt(t){return t instanceof InternSet?t:new InternSet(t)}function pt(t,n){const r=t[Symbol.iterator](),e=new Set;for(const t of n){const n=yt(t);if(e.has(n))continue;let o,f;for(;({value:o,done:f}=r.next());){if(f)return!1;const t=yt(o);if(e.add(t),Object.is(n,t))break}}return!0}function yt(t){return null!==t&&"object"==typeof t?t.valueOf():t}t.Adder=N,t.InternMap=InternMap,t.InternSet=InternSet,t.ascending=n,t.bin=Y,t.bisect=s,t.bisectCenter=c,t.bisectLeft=l,t.bisectRight=u,t.bisector=e,t.blur=function(t,n){if(!((n=+n)>=0))throw new RangeError("invalid r");let r=t.length;if(!((r=Math.floor(r))>=0))throw new RangeError("invalid length");if(!r||!n)return t;const e=m(n),o=t.slice();return e(t,o,0,r,1),e(o,t,0,r,1),e(t,o,0,r,1),t},t.blur2=a,t.blurImage=h,t.count=g,t.cross=function(...t){const n="function"==typeof t[t.length-1]&&function(t){return n=>t(...n)}(t.pop()),r=(t=t.map(w)).map(v),e=t.length-1,o=new Array(e+1).fill(0),f=[];if(e<0||r.some(M))return f;for(;;){f.push(o.map(((n,r)=>t[r][n])));let i=e;for(;++o[i]===r[i];){if(0===i)return n?f.map(n):f;o[i--]=0}}},t.cumsum=function(t,n){var r=0,e=0;return Float64Array.from(t,void 0===n?t=>r+=+t||0:o=>r+=+n(o,e++,t)||0)},t.descending=r,t.deviation=A,t.difference=function(t,...n){t=new InternSet(t);for(const r of n)for(const n of r)t.delete(n);return t},t.disjoint=function(t,n){const r=n[Symbol.iterator](),e=new InternSet;for(const n of t){if(e.has(n))return!1;let t,o;for(;({value:t,done:o}=r.next())&&!o;){if(Object.is(n,t))return!1;e.add(t)}}return!0},t.every=function(t,n){if("function"!=typeof n)throw new TypeError("test is not a function");let r=-1;for(const e of t)if(!n(e,++r,t))return!1;return!0},t.extent=x,t.fcumsum=function(t,n){const r=new N;let e=-1;return Float64Array.from(t,void 0===n?t=>r.add(+t||0):o=>r.add(+n(o,++e,t)||0))},t.filter=function(t,n){if("function"!=typeof n)throw new TypeError("test is not a function");const r=[];let e=-1;for(const o of t)n(o,++e,t)&&r.push(o);return r},t.flatGroup=function(t,...n){return j(I(t,...n),n)},t.flatRollup=function(t,n,...r){return j(R(t,n,...r),r)},t.fsum=function(t,n){const r=new N;if(void 0===n)for(let n of t)(n=+n)&&r.add(n);else{let e=-1;for(let o of t)(o=+n(o,++e,t))&&r.add(o)}return+r},t.greatest=ot,t.greatestIndex=function(t,r=n){if(1===r.length)return $(t,r);let e,o=-1,f=-1;for(const n of t)++f,(o<0?0===r(n,n):r(n,e)>0)&&(e=n,o=f);return o},t.group=F,t.groupSort=function(t,r,e){return(2!==r.length?P(q(t,r,e),(([t,r],[e,o])=>n(r,o)||n(t,e))):P(F(t,e),(([t,e],[o,f])=>r(e,f)||n(t,o)))).map((([t])=>t))},t.groups=I,t.histogram=Y,t.index=function(t,...n){return U(t,T,O,n)},t.indexes=function(t,...n){return U(t,Array.from,O,n)},t.intersection=function(t,...n){t=new InternSet(t),n=n.map(dt);t:for(const r of t)for(const e of n)if(!e.has(r)){t.delete(r);continue t}return t},t.least=function(t,r=n){let e,o=!1;if(1===r.length){let f;for(const i of t){const t=r(i);(o?n(t,f)<0:0===n(t,t))&&(e=i,f=t,o=!0)}}else for(const n of t)(o?r(n,e)<0:0===r(n,n))&&(e=n,o=!0);return e},t.leastIndex=lt,t.map=function(t,n){if("function"!=typeof t[Symbol.iterator])throw new TypeError("values is not iterable");if("function"!=typeof n)throw new TypeError("mapper is not a function");return Array.from(t,((r,e)=>n(r,e,t)))},t.max=Z,t.maxIndex=$,t.mean=function(t,n){let r=0,e=0;if(void 0===n)for(let n of t)null!=n&&(n=+n)>=n&&(++r,e+=n);else{let o=-1;for(let f of t)null!=(f=n(f,++o,t))&&(f=+f)>=f&&(++r,e+=f)}if(r)return e/r},t.median=function(t,n){return ft(t,.5,n)},t.medianIndex=function(t,n){return it(t,.5,n)},t.merge=function(t){return Array.from(function*(t){for(const n of t)yield*n}(t))},t.min=tt,t.minIndex=nt,t.mode=function(t,n){const r=new InternMap;if(void 0===n)for(let n of t)null!=n&&n>=n&&r.set(n,(r.get(n)||0)+1);else{let e=-1;for(let o of t)null!=(o=n(o,++e,t))&&o>=o&&r.set(o,(r.get(o)||0)+1)}let e,o=0;for(const[t,n]of r)n>o&&(o=n,e=t);return e},t.nice=W,t.pairs=function(t,n=ut){const r=[];let e,o=!1;for(const f of t)o&&r.push(n(e,f)),e=f,o=!0;return r},t.permute=L,t.quantile=ft,t.quantileIndex=it,t.quantileSorted=function(t,n,r=f){if((e=t.length)&&!isNaN(n=+n)){if(n<=0||e<2)return+r(t[0],0,t);if(n>=1)return+r(t[e-1],e-1,t);var e,o=(e-1)*n,i=Math.floor(o),u=+r(t[i],i,t);return u+(+r(t[i+1],i+1,t)-u)*(o-i)}},t.quickselect=rt,t.range=function(t,n,r){t=+t,n=+n,r=(o=arguments.length)<2?(n=t,t=0,1):o<3?1:+r;for(var e=-1,o=0|Math.max(0,Math.ceil((n-t)/r)),f=new Array(o);++e<o;)f[e]=t+e*r;return f},t.rank=function(t,r=n){if("function"!=typeof t[Symbol.iterator])throw new TypeError("values is not iterable");let e=Array.from(t);const o=new Float64Array(e.length);2!==r.length&&(e=e.map(r),r=n);const f=(t,n)=>r(e[t],e[n]);let i,u;return(t=Uint32Array.from(e,((t,n)=>n))).sort(r===n?(t,n)=>C(e[t],e[n]):z(f)),t.forEach(((t,n)=>{const r=f(t,void 0===i?t:i);r>=0?((void 0===i||r>0)&&(i=t,u=n),o[t]=u):o[t]=NaN})),o},t.reduce=function(t,n,r){if("function"!=typeof n)throw new TypeError("reducer is not a function");const e=t[Symbol.iterator]();let o,f,i=-1;if(arguments.length<3){if(({done:o,value:r}=e.next()),o)return;++i}for(;({done:o,value:f}=e.next()),!o;)r=n(r,f,++i,t);return r},t.reverse=function(t){if("function"!=typeof t[Symbol.iterator])throw new TypeError("values is not iterable");return Array.from(t).reverse()},t.rollup=q,t.rollups=R,t.scan=function(t,n){const r=lt(t,n);return r<0?void 0:r},t.shuffle=ct,t.shuffler=st,t.some=function(t,n){if("function"!=typeof n)throw new TypeError("test is not a function");let r=-1;for(const e of t)if(n(e,++r,t))return!0;return!1},t.sort=P,t.subset=function(t,n){return pt(n,t)},t.sum=function(t,n){let r=0;if(void 0===n)for(let n of t)(n=+n)&&(r+=n);else{let e=-1;for(let o of t)(o=+n(o,++e,t))&&(r+=o)}return r},t.superset=pt,t.thresholdFreedmanDiaconis=function(t,n,r){const e=g(t),o=ft(t,.75)-ft(t,.25);return e&&o?Math.ceil((r-n)/(2*o*Math.pow(e,-1/3))):1},t.thresholdScott=function(t,n,r){const e=g(t),o=A(t);return e&&o?Math.ceil((r-n)*Math.cbrt(e)/(3.49*o)):1},t.thresholdSturges=X,t.tickIncrement=V,t.tickStep=function(t,n,r){r=+r;const e=(n=+n)<(t=+t),o=e?V(n,t,r):V(t,n,r);return(e?-1:1)*(o<0?1/-o:o)},t.ticks=Q,t.transpose=at,t.union=function(...t){const n=new InternSet;for(const r of t)for(const t of r)n.add(t);return n},t.variance=b,t.zip=function(){return at(arguments)}}));

/* d3-geo 3.1.1 — https://d3js.org/d3-geo — ISC */
// https://d3js.org/d3-geo/ v3.1.1 Copyright 2010-2024 Mike Bostock, 2008-2012 Charles Karney
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("d3-array")):"function"==typeof define&&define.amd?define(["exports","d3-array"],t):t((n="undefined"!=typeof globalThis?globalThis:n||self).d3=n.d3||{},n.d3)}(this,(function(n,t){"use strict";var r=1e-6,e=1e-12,i=Math.PI,o=i/2,u=i/4,a=2*i,c=180/i,l=i/180,f=Math.abs,p=Math.atan,s=Math.atan2,h=Math.cos,g=Math.ceil,d=Math.exp,v=Math.hypot,E=Math.log,y=Math.pow,S=Math.sin,m=Math.sign||function(n){return n>0?1:n<0?-1:0},M=Math.sqrt,w=Math.tan;function x(n){return n>1?0:n<-1?i:Math.acos(n)}function _(n){return n>1?o:n<-1?-o:Math.asin(n)}function N(n){return(n=S(n/2))*n}function A(){}function R(n,t){n&&P.hasOwnProperty(n.type)&&P[n.type](n,t)}var C={Feature:function(n,t){R(n.geometry,t)},FeatureCollection:function(n,t){for(var r=n.features,e=-1,i=r.length;++e<i;)R(r[e].geometry,t)}},P={Sphere:function(n,t){t.sphere()},Point:function(n,t){n=n.coordinates,t.point(n[0],n[1],n[2])},MultiPoint:function(n,t){for(var r=n.coordinates,e=-1,i=r.length;++e<i;)n=r[e],t.point(n[0],n[1],n[2])},LineString:function(n,t){$(n.coordinates,t,0)},MultiLineString:function(n,t){for(var r=n.coordinates,e=-1,i=r.length;++e<i;)$(r[e],t,0)},Polygon:function(n,t){q(n.coordinates,t)},MultiPolygon:function(n,t){for(var r=n.coordinates,e=-1,i=r.length;++e<i;)q(r[e],t)},GeometryCollection:function(n,t){for(var r=n.geometries,e=-1,i=r.length;++e<i;)R(r[e],t)}};function $(n,t,r){var e,i=-1,o=n.length-r;for(t.lineStart();++i<o;)e=n[i],t.point(e[0],e[1],e[2]);t.lineEnd()}function q(n,t){var r=-1,e=n.length;for(t.polygonStart();++r<e;)$(n[r],t,1);t.polygonEnd()}function j(n,t){n&&C.hasOwnProperty(n.type)?C[n.type](n,t):R(n,t)}var z,b,L,T,G,O,k,F,H,I,W,X,Y,B,D,U,Z=new t.Adder,J=new t.Adder,K={point:A,lineStart:A,lineEnd:A,polygonStart:function(){Z=new t.Adder,K.lineStart=Q,K.lineEnd=V},polygonEnd:function(){var n=+Z;J.add(n<0?a+n:n),this.lineStart=this.lineEnd=this.point=A},sphere:function(){J.add(a)}};function Q(){K.point=nn}function V(){tn(z,b)}function nn(n,t){K.point=tn,z=n,b=t,L=n*=l,T=h(t=(t*=l)/2+u),G=S(t)}function tn(n,t){var r=(n*=l)-L,e=r>=0?1:-1,i=e*r,o=h(t=(t*=l)/2+u),a=S(t),c=G*a,f=T*o+c*h(i),p=c*e*S(i);Z.add(s(p,f)),L=n,T=o,G=a}function rn(n){return[s(n[1],n[0]),_(n[2])]}function en(n){var t=n[0],r=n[1],e=h(r);return[e*h(t),e*S(t),S(r)]}function on(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function un(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function an(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function cn(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function ln(n){var t=M(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}var fn,pn,sn,hn,gn,dn,vn,En,yn,Sn,mn,Mn,wn,xn,_n,Nn,An={point:Rn,lineStart:Pn,lineEnd:$n,polygonStart:function(){An.point=qn,An.lineStart=jn,An.lineEnd=zn,B=new t.Adder,K.polygonStart()},polygonEnd:function(){K.polygonEnd(),An.point=Rn,An.lineStart=Pn,An.lineEnd=$n,Z<0?(O=-(F=180),k=-(H=90)):B>r?H=90:B<-r&&(k=-90),U[0]=O,U[1]=F},sphere:function(){O=-(F=180),k=-(H=90)}};function Rn(n,t){D.push(U=[O=n,F=n]),t<k&&(k=t),t>H&&(H=t)}function Cn(n,t){var r=en([n*l,t*l]);if(Y){var e=un(Y,r),i=un([e[1],-e[0],0],e);ln(i),i=rn(i);var o,u=n-I,a=u>0?1:-1,p=i[0]*c*a,s=f(u)>180;s^(a*I<p&&p<a*n)?(o=i[1]*c)>H&&(H=o):s^(a*I<(p=(p+360)%360-180)&&p<a*n)?(o=-i[1]*c)<k&&(k=o):(t<k&&(k=t),t>H&&(H=t)),s?n<I?bn(O,n)>bn(O,F)&&(F=n):bn(n,F)>bn(O,F)&&(O=n):F>=O?(n<O&&(O=n),n>F&&(F=n)):n>I?bn(O,n)>bn(O,F)&&(F=n):bn(n,F)>bn(O,F)&&(O=n)}else D.push(U=[O=n,F=n]);t<k&&(k=t),t>H&&(H=t),Y=r,I=n}function Pn(){An.point=Cn}function $n(){U[0]=O,U[1]=F,An.point=Rn,Y=null}function qn(n,t){if(Y){var r=n-I;B.add(f(r)>180?r+(r>0?360:-360):r)}else W=n,X=t;K.point(n,t),Cn(n,t)}function jn(){K.lineStart()}function zn(){qn(W,X),K.lineEnd(),f(B)>r&&(O=-(F=180)),U[0]=O,U[1]=F,Y=null}function bn(n,t){return(t-=n)<0?t+360:t}function Ln(n,t){return n[0]-t[0]}function Tn(n,t){return n[0]<=n[1]?n[0]<=t&&t<=n[1]:t<n[0]||n[1]<t}var Gn={sphere:A,point:On,lineStart:Fn,lineEnd:Wn,polygonStart:function(){Gn.lineStart=Xn,Gn.lineEnd=Yn},polygonEnd:function(){Gn.lineStart=Fn,Gn.lineEnd=Wn}};function On(n,t){n*=l;var r=h(t*=l);kn(r*h(n),r*S(n),S(t))}function kn(n,t,r){++fn,sn+=(n-sn)/fn,hn+=(t-hn)/fn,gn+=(r-gn)/fn}function Fn(){Gn.point=Hn}function Hn(n,t){n*=l;var r=h(t*=l);xn=r*h(n),_n=r*S(n),Nn=S(t),Gn.point=In,kn(xn,_n,Nn)}function In(n,t){n*=l;var r=h(t*=l),e=r*h(n),i=r*S(n),o=S(t),u=s(M((u=_n*o-Nn*i)*u+(u=Nn*e-xn*o)*u+(u=xn*i-_n*e)*u),xn*e+_n*i+Nn*o);pn+=u,dn+=u*(xn+(xn=e)),vn+=u*(_n+(_n=i)),En+=u*(Nn+(Nn=o)),kn(xn,_n,Nn)}function Wn(){Gn.point=On}function Xn(){Gn.point=Bn}function Yn(){Dn(Mn,wn),Gn.point=On}function Bn(n,t){Mn=n,wn=t,n*=l,t*=l,Gn.point=Dn;var r=h(t);xn=r*h(n),_n=r*S(n),Nn=S(t),kn(xn,_n,Nn)}function Dn(n,t){n*=l;var r=h(t*=l),e=r*h(n),i=r*S(n),o=S(t),u=_n*o-Nn*i,a=Nn*e-xn*o,c=xn*i-_n*e,f=v(u,a,c),p=_(f),s=f&&-p/f;yn.add(s*u),Sn.add(s*a),mn.add(s*c),pn+=p,dn+=p*(xn+(xn=e)),vn+=p*(_n+(_n=i)),En+=p*(Nn+(Nn=o)),kn(xn,_n,Nn)}function Un(n){return function(){return n}}function Zn(n,t){function r(r,e){return r=n(r,e),t(r[0],r[1])}return n.invert&&t.invert&&(r.invert=function(r,e){return(r=t.invert(r,e))&&n.invert(r[0],r[1])}),r}function Jn(n,t){return f(n)>i&&(n-=Math.round(n/a)*a),[n,t]}function Kn(n,t,r){return(n%=a)?t||r?Zn(Vn(n),nt(t,r)):Vn(n):t||r?nt(t,r):Jn}function Qn(n){return function(t,r){return f(t+=n)>i&&(t-=Math.round(t/a)*a),[t,r]}}function Vn(n){var t=Qn(n);return t.invert=Qn(-n),t}function nt(n,t){var r=h(n),e=S(n),i=h(t),o=S(t);function u(n,t){var u=h(t),a=h(n)*u,c=S(n)*u,l=S(t),f=l*r+a*e;return[s(c*i-f*o,a*r-l*e),_(f*i+c*o)]}return u.invert=function(n,t){var u=h(t),a=h(n)*u,c=S(n)*u,l=S(t),f=l*i-c*o;return[s(c*i+l*o,a*r+f*e),_(f*r-a*e)]},u}function tt(n){function t(t){return(t=n(t[0]*l,t[1]*l))[0]*=c,t[1]*=c,t}return n=Kn(n[0]*l,n[1]*l,n.length>2?n[2]*l:0),t.invert=function(t){return(t=n.invert(t[0]*l,t[1]*l))[0]*=c,t[1]*=c,t},t}function rt(n,t,r,e,i,o){if(r){var u=h(t),c=S(t),l=e*r;null==i?(i=t+e*a,o=t-l/2):(i=et(u,i),o=et(u,o),(e>0?i<o:i>o)&&(i+=e*a));for(var f,p=i;e>0?p>o:p<o;p-=l)f=rn([u,-c*h(p),-c*S(p)]),n.point(f[0],f[1])}}function et(n,t){(t=en(t))[0]-=n,ln(t);var e=x(-t[1]);return((-t[2]<0?-e:e)+a-r)%a}function it(){var n,t=[];return{point:function(t,r,e){n.push([t,r,e])},lineStart:function(){t.push(n=[])},lineEnd:A,rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))},result:function(){var r=t;return t=[],n=null,r}}}function ot(n,t){return f(n[0]-t[0])<r&&f(n[1]-t[1])<r}function ut(n,t,r,e){this.x=n,this.z=t,this.o=r,this.e=e,this.v=!1,this.n=this.p=null}function at(n,t,e,i,o){var u,a,c=[],l=[];if(n.forEach((function(n){if(!((t=n.length-1)<=0)){var t,e,i=n[0],a=n[t];if(ot(i,a)){if(!i[2]&&!a[2]){for(o.lineStart(),u=0;u<t;++u)o.point((i=n[u])[0],i[1]);return void o.lineEnd()}a[0]+=2*r}c.push(e=new ut(i,n,null,!0)),l.push(e.o=new ut(i,null,e,!1)),c.push(e=new ut(a,n,null,!1)),l.push(e.o=new ut(a,null,e,!0))}})),c.length){for(l.sort(t),ct(c),ct(l),u=0,a=l.length;u<a;++u)l[u].e=e=!e;for(var f,p,s=c[0];;){for(var h=s,g=!0;h.v;)if((h=h.n)===s)return;f=h.z,o.lineStart();do{if(h.v=h.o.v=!0,h.e){if(g)for(u=0,a=f.length;u<a;++u)o.point((p=f[u])[0],p[1]);else i(h.x,h.n.x,1,o);h=h.n}else{if(g)for(f=h.p.z,u=f.length-1;u>=0;--u)o.point((p=f[u])[0],p[1]);else i(h.x,h.p.x,-1,o);h=h.p}f=(h=h.o).z,g=!g}while(!h.v);o.lineEnd()}}}function ct(n){if(t=n.length){for(var t,r,e=0,i=n[0];++e<t;)i.n=r=n[e],r.p=i,i=r;i.n=r=n[0],r.p=i}}function lt(n){return f(n[0])<=i?n[0]:m(n[0])*((f(n[0])+i)%a-i)}function ft(n,c){var l=lt(c),f=c[1],p=S(f),g=[S(l),-h(l),0],d=0,v=0,E=new t.Adder;1===p?f=o+r:-1===p&&(f=-o-r);for(var y=0,m=n.length;y<m;++y)if(w=(M=n[y]).length)for(var M,w,x=M[w-1],N=lt(x),A=x[1]/2+u,R=S(A),C=h(A),P=0;P<w;++P,N=q,R=z,C=b,x=$){var $=M[P],q=lt($),j=$[1]/2+u,z=S(j),b=h(j),L=q-N,T=L>=0?1:-1,G=T*L,O=G>i,k=R*z;if(E.add(s(k*T*S(G),C*b+k*h(G))),d+=O?L+T*a:L,O^N>=l^q>=l){var F=un(en(x),en($));ln(F);var H=un(g,F);ln(H);var I=(O^L>=0?-1:1)*_(H[2]);(f>I||f===I&&(F[0]||F[1]))&&(v+=O^L>=0?1:-1)}}return(d<-r||d<r&&E<-e)^1&v}function pt(n,r,e,i){return function(o){var u,a,c,l=r(o),f=it(),p=r(f),s=!1,h={point:g,lineStart:v,lineEnd:E,polygonStart:function(){h.point=y,h.lineStart=S,h.lineEnd=m,a=[],u=[]},polygonEnd:function(){h.point=g,h.lineStart=v,h.lineEnd=E,a=t.merge(a);var n=ft(u,i);a.length?(s||(o.polygonStart(),s=!0),at(a,ht,n,e,o)):n&&(s||(o.polygonStart(),s=!0),o.lineStart(),e(null,null,1,o),o.lineEnd()),s&&(o.polygonEnd(),s=!1),a=u=null},sphere:function(){o.polygonStart(),o.lineStart(),e(null,null,1,o),o.lineEnd(),o.polygonEnd()}};function g(t,r){n(t,r)&&o.point(t,r)}function d(n,t){l.point(n,t)}function v(){h.point=d,l.lineStart()}function E(){h.point=g,l.lineEnd()}function y(n,t){c.push([n,t]),p.point(n,t)}function S(){p.lineStart(),c=[]}function m(){y(c[0][0],c[0][1]),p.lineEnd();var n,t,r,e,i=p.clean(),l=f.result(),h=l.length;if(c.pop(),u.push(c),c=null,h)if(1&i){if((t=(r=l[0]).length-1)>0){for(s||(o.polygonStart(),s=!0),o.lineStart(),n=0;n<t;++n)o.point((e=r[n])[0],e[1]);o.lineEnd()}}else h>1&&2&i&&l.push(l.pop().concat(l.shift())),a.push(l.filter(st))}return h}}function st(n){return n.length>1}function ht(n,t){return((n=n.x)[0]<0?n[1]-o-r:o-n[1])-((t=t.x)[0]<0?t[1]-o-r:o-t[1])}Jn.invert=Jn;var gt=pt((function(){return!0}),(function(n){var t,e=NaN,u=NaN,a=NaN;return{lineStart:function(){n.lineStart(),t=1},point:function(c,l){var s=c>0?i:-i,g=f(c-e);f(g-i)<r?(n.point(e,u=(u+l)/2>0?o:-o),n.point(a,u),n.lineEnd(),n.lineStart(),n.point(s,u),n.point(c,u),t=0):a!==s&&g>=i&&(f(e-a)<r&&(e-=a*r),f(c-s)<r&&(c-=s*r),u=function(n,t,e,i){var o,u,a=S(n-e);return f(a)>r?p((S(t)*(u=h(i))*S(e)-S(i)*(o=h(t))*S(n))/(o*u*a)):(t+i)/2}(e,u,c,l),n.point(a,u),n.lineEnd(),n.lineStart(),n.point(s,u),t=0),n.point(e=c,u=l),a=s},lineEnd:function(){n.lineEnd(),e=u=NaN},clean:function(){return 2-t}}}),(function(n,t,e,u){var a;if(null==n)a=e*o,u.point(-i,a),u.point(0,a),u.point(i,a),u.point(i,0),u.point(i,-a),u.point(0,-a),u.point(-i,-a),u.point(-i,0),u.point(-i,a);else if(f(n[0]-t[0])>r){var c=n[0]<t[0]?i:-i;a=e*c/2,u.point(-c,a),u.point(0,a),u.point(c,a)}else u.point(t[0],t[1])}),[-i,-o]);function dt(n){var t=h(n),e=2*l,o=t>0,u=f(t)>r;function a(n,r){return h(n)*h(r)>t}function c(n,e,o){var u=[1,0,0],a=un(en(n),en(e)),c=on(a,a),l=a[0],p=c-l*l;if(!p)return!o&&n;var s=t*c/p,h=-t*l/p,g=un(u,a),d=cn(u,s);an(d,cn(a,h));var v=g,E=on(d,v),y=on(v,v),S=E*E-y*(on(d,d)-1);if(!(S<0)){var m=M(S),w=cn(v,(-E-m)/y);if(an(w,d),w=rn(w),!o)return w;var x,_=n[0],N=e[0],A=n[1],R=e[1];N<_&&(x=_,_=N,N=x);var C=N-_,P=f(C-i)<r;if(!P&&R<A&&(x=A,A=R,R=x),P||C<r?P?A+R>0^w[1]<(f(w[0]-_)<r?A:R):A<=w[1]&&w[1]<=R:C>i^(_<=w[0]&&w[0]<=N)){var $=cn(v,(-E+m)/y);return an($,d),[w,rn($)]}}}function p(t,r){var e=o?n:i-n,u=0;return t<-e?u|=1:t>e&&(u|=2),r<-e?u|=4:r>e&&(u|=8),u}return pt(a,(function(n){var t,r,e,l,f;return{lineStart:function(){l=e=!1,f=1},point:function(s,h){var g,d=[s,h],v=a(s,h),E=o?v?0:p(s,h):v?p(s+(s<0?i:-i),h):0;if(!t&&(l=e=v)&&n.lineStart(),v!==e&&(!(g=c(t,d))||ot(t,g)||ot(d,g))&&(d[2]=1),v!==e)f=0,v?(n.lineStart(),g=c(d,t),n.point(g[0],g[1])):(g=c(t,d),n.point(g[0],g[1],2),n.lineEnd()),t=g;else if(u&&t&&o^v){var y;E&r||!(y=c(d,t,!0))||(f=0,o?(n.lineStart(),n.point(y[0][0],y[0][1]),n.point(y[1][0],y[1][1]),n.lineEnd()):(n.point(y[1][0],y[1][1]),n.lineEnd(),n.lineStart(),n.point(y[0][0],y[0][1],3)))}!v||t&&ot(t,d)||n.point(d[0],d[1]),t=d,e=v,r=E},lineEnd:function(){e&&n.lineEnd(),t=null},clean:function(){return f|(l&&e)<<1}}}),(function(t,r,i,o){rt(o,n,e,i,t,r)}),o?[0,-n]:[-i,n-i])}var vt,Et,yt,St,mt=1e9,Mt=-mt;function wt(n,e,i,o){function u(t,r){return n<=t&&t<=i&&e<=r&&r<=o}function a(t,r,u,a){var l=0,f=0;if(null==t||(l=c(t,u))!==(f=c(r,u))||p(t,r)<0^u>0)do{a.point(0===l||3===l?n:i,l>1?o:e)}while((l=(l+u+4)%4)!==f);else a.point(r[0],r[1])}function c(t,o){return f(t[0]-n)<r?o>0?0:3:f(t[0]-i)<r?o>0?2:1:f(t[1]-e)<r?o>0?1:0:o>0?3:2}function l(n,t){return p(n.x,t.x)}function p(n,t){var r=c(n,1),e=c(t,1);return r!==e?r-e:0===r?t[1]-n[1]:1===r?n[0]-t[0]:2===r?n[1]-t[1]:t[0]-n[0]}return function(r){var c,f,p,s,h,g,d,v,E,y,S,m=r,M=it(),w={point:x,lineStart:function(){w.point=_,f&&f.push(p=[]);y=!0,E=!1,d=v=NaN},lineEnd:function(){c&&(_(s,h),g&&E&&M.rejoin(),c.push(M.result()));w.point=x,E&&m.lineEnd()},polygonStart:function(){m=M,c=[],f=[],S=!0},polygonEnd:function(){var e=function(){for(var t=0,r=0,e=f.length;r<e;++r)for(var i,u,a=f[r],c=1,l=a.length,p=a[0],s=p[0],h=p[1];c<l;++c)i=s,u=h,s=(p=a[c])[0],h=p[1],u<=o?h>o&&(s-i)*(o-u)>(h-u)*(n-i)&&++t:h<=o&&(s-i)*(o-u)<(h-u)*(n-i)&&--t;return t}(),i=S&&e,u=(c=t.merge(c)).length;(i||u)&&(r.polygonStart(),i&&(r.lineStart(),a(null,null,1,r),r.lineEnd()),u&&at(c,l,e,a,r),r.polygonEnd());m=r,c=f=p=null}};function x(n,t){u(n,t)&&m.point(n,t)}function _(t,r){var a=u(t,r);if(f&&p.push([t,r]),y)s=t,h=r,g=a,y=!1,a&&(m.lineStart(),m.point(t,r));else if(a&&E)m.point(t,r);else{var c=[d=Math.max(Mt,Math.min(mt,d)),v=Math.max(Mt,Math.min(mt,v))],l=[t=Math.max(Mt,Math.min(mt,t)),r=Math.max(Mt,Math.min(mt,r))];!function(n,t,r,e,i,o){var u,a=n[0],c=n[1],l=0,f=1,p=t[0]-a,s=t[1]-c;if(u=r-a,p||!(u>0)){if(u/=p,p<0){if(u<l)return;u<f&&(f=u)}else if(p>0){if(u>f)return;u>l&&(l=u)}if(u=i-a,p||!(u<0)){if(u/=p,p<0){if(u>f)return;u>l&&(l=u)}else if(p>0){if(u<l)return;u<f&&(f=u)}if(u=e-c,s||!(u>0)){if(u/=s,s<0){if(u<l)return;u<f&&(f=u)}else if(s>0){if(u>f)return;u>l&&(l=u)}if(u=o-c,s||!(u<0)){if(u/=s,s<0){if(u>f)return;u>l&&(l=u)}else if(s>0){if(u<l)return;u<f&&(f=u)}return l>0&&(n[0]=a+l*p,n[1]=c+l*s),f<1&&(t[0]=a+f*p,t[1]=c+f*s),!0}}}}}(c,l,n,e,i,o)?a&&(m.lineStart(),m.point(t,r),S=!1):(E||(m.lineStart(),m.point(c[0],c[1])),m.point(l[0],l[1]),a||m.lineEnd(),S=!1)}d=t,v=r,E=a}return w}}var xt={sphere:A,point:A,lineStart:function(){xt.point=Nt,xt.lineEnd=_t},lineEnd:A,polygonStart:A,polygonEnd:A};function _t(){xt.point=xt.lineEnd=A}function Nt(n,t){Et=n*=l,yt=S(t*=l),St=h(t),xt.point=At}function At(n,t){n*=l;var r=S(t*=l),e=h(t),i=f(n-Et),o=h(i),u=e*S(i),a=St*r-yt*e*o,c=yt*r+St*e*o;vt.add(s(M(u*u+a*a),c)),Et=n,yt=r,St=e}function Rt(n){return vt=new t.Adder,j(n,xt),+vt}var Ct=[null,null],Pt={type:"LineString",coordinates:Ct};function $t(n,t){return Ct[0]=n,Ct[1]=t,Rt(Pt)}var qt={Feature:function(n,t){return zt(n.geometry,t)},FeatureCollection:function(n,t){for(var r=n.features,e=-1,i=r.length;++e<i;)if(zt(r[e].geometry,t))return!0;return!1}},jt={Sphere:function(){return!0},Point:function(n,t){return bt(n.coordinates,t)},MultiPoint:function(n,t){for(var r=n.coordinates,e=-1,i=r.length;++e<i;)if(bt(r[e],t))return!0;return!1},LineString:function(n,t){return Lt(n.coordinates,t)},MultiLineString:function(n,t){for(var r=n.coordinates,e=-1,i=r.length;++e<i;)if(Lt(r[e],t))return!0;return!1},Polygon:function(n,t){return Tt(n.coordinates,t)},MultiPolygon:function(n,t){for(var r=n.coordinates,e=-1,i=r.length;++e<i;)if(Tt(r[e],t))return!0;return!1},GeometryCollection:function(n,t){for(var r=n.geometries,e=-1,i=r.length;++e<i;)if(zt(r[e],t))return!0;return!1}};function zt(n,t){return!(!n||!jt.hasOwnProperty(n.type))&&jt[n.type](n,t)}function bt(n,t){return 0===$t(n,t)}function Lt(n,t){for(var r,i,o,u=0,a=n.length;u<a;u++){if(0===(i=$t(n[u],t)))return!0;if(u>0&&(o=$t(n[u],n[u-1]))>0&&r<=o&&i<=o&&(r+i-o)*(1-Math.pow((r-i)/o,2))<e*o)return!0;r=i}return!1}function Tt(n,t){return!!ft(n.map(Gt),Ot(t))}function Gt(n){return(n=n.map(Ot)).pop(),n}function Ot(n){return[n[0]*l,n[1]*l]}function kt(n,e,i){var o=t.range(n,e-r,i).concat(e);return function(n){return o.map((function(t){return[n,t]}))}}function Ft(n,e,i){var o=t.range(n,e-r,i).concat(e);return function(n){return o.map((function(t){return[t,n]}))}}function Ht(){var n,e,i,o,u,a,c,l,p,s,h,d,v=10,E=v,y=90,S=360,m=2.5;function M(){return{type:"MultiLineString",coordinates:w()}}function w(){return t.range(g(o/y)*y,i,y).map(h).concat(t.range(g(l/S)*S,c,S).map(d)).concat(t.range(g(e/v)*v,n,v).filter((function(n){return f(n%y)>r})).map(p)).concat(t.range(g(a/E)*E,u,E).filter((function(n){return f(n%S)>r})).map(s))}return M.lines=function(){return w().map((function(n){return{type:"LineString",coordinates:n}}))},M.outline=function(){return{type:"Polygon",coordinates:[h(o).concat(d(c).slice(1),h(i).reverse().slice(1),d(l).reverse().slice(1))]}},M.extent=function(n){return arguments.length?M.extentMajor(n).extentMinor(n):M.extentMinor()},M.extentMajor=function(n){return arguments.length?(o=+n[0][0],i=+n[1][0],l=+n[0][1],c=+n[1][1],o>i&&(n=o,o=i,i=n),l>c&&(n=l,l=c,c=n),M.precision(m)):[[o,l],[i,c]]},M.extentMinor=function(t){return arguments.length?(e=+t[0][0],n=+t[1][0],a=+t[0][1],u=+t[1][1],e>n&&(t=e,e=n,n=t),a>u&&(t=a,a=u,u=t),M.precision(m)):[[e,a],[n,u]]},M.step=function(n){return arguments.length?M.stepMajor(n).stepMinor(n):M.stepMinor()},M.stepMajor=function(n){return arguments.length?(y=+n[0],S=+n[1],M):[y,S]},M.stepMinor=function(n){return arguments.length?(v=+n[0],E=+n[1],M):[v,E]},M.precision=function(t){return arguments.length?(m=+t,p=kt(a,u,90),s=Ft(e,n,m),h=kt(l,c,90),d=Ft(o,i,m),M):m},M.extentMajor([[-180,-90+r],[180,90-r]]).extentMinor([[-180,-80-r],[180,80+r]])}var It,Wt,Xt,Yt,Bt=n=>n,Dt=new t.Adder,Ut=new t.Adder,Zt={point:A,lineStart:A,lineEnd:A,polygonStart:function(){Zt.lineStart=Jt,Zt.lineEnd=Vt},polygonEnd:function(){Zt.lineStart=Zt.lineEnd=Zt.point=A,Dt.add(f(Ut)),Ut=new t.Adder},result:function(){var n=Dt/2;return Dt=new t.Adder,n}};function Jt(){Zt.point=Kt}function Kt(n,t){Zt.point=Qt,It=Xt=n,Wt=Yt=t}function Qt(n,t){Ut.add(Yt*n-Xt*t),Xt=n,Yt=t}function Vt(){Qt(It,Wt)}var nr=1/0,tr=nr,rr=-nr,er=rr,ir={point:function(n,t){n<nr&&(nr=n);n>rr&&(rr=n);t<tr&&(tr=t);t>er&&(er=t)},lineStart:A,lineEnd:A,polygonStart:A,polygonEnd:A,result:function(){var n=[[nr,tr],[rr,er]];return rr=er=-(tr=nr=1/0),n}};var or,ur,ar,cr,lr=0,fr=0,pr=0,sr=0,hr=0,gr=0,dr=0,vr=0,Er=0,yr={point:Sr,lineStart:mr,lineEnd:xr,polygonStart:function(){yr.lineStart=_r,yr.lineEnd=Nr},polygonEnd:function(){yr.point=Sr,yr.lineStart=mr,yr.lineEnd=xr},result:function(){var n=Er?[dr/Er,vr/Er]:gr?[sr/gr,hr/gr]:pr?[lr/pr,fr/pr]:[NaN,NaN];return lr=fr=pr=sr=hr=gr=dr=vr=Er=0,n}};function Sr(n,t){lr+=n,fr+=t,++pr}function mr(){yr.point=Mr}function Mr(n,t){yr.point=wr,Sr(ar=n,cr=t)}function wr(n,t){var r=n-ar,e=t-cr,i=M(r*r+e*e);sr+=i*(ar+n)/2,hr+=i*(cr+t)/2,gr+=i,Sr(ar=n,cr=t)}function xr(){yr.point=Sr}function _r(){yr.point=Ar}function Nr(){Rr(or,ur)}function Ar(n,t){yr.point=Rr,Sr(or=ar=n,ur=cr=t)}function Rr(n,t){var r=n-ar,e=t-cr,i=M(r*r+e*e);sr+=i*(ar+n)/2,hr+=i*(cr+t)/2,gr+=i,dr+=(i=cr*n-ar*t)*(ar+n),vr+=i*(cr+t),Er+=3*i,Sr(ar=n,cr=t)}function Cr(n){this._context=n}Cr.prototype={_radius:4.5,pointRadius:function(n){return this._radius=n,this},polygonStart:function(){this._line=0},polygonEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){0===this._line&&this._context.closePath(),this._point=NaN},point:function(n,t){switch(this._point){case 0:this._context.moveTo(n,t),this._point=1;break;case 1:this._context.lineTo(n,t);break;default:this._context.moveTo(n+this._radius,t),this._context.arc(n,t,this._radius,0,a)}},result:A};var Pr,$r,qr,jr,zr,br=new t.Adder,Lr={point:A,lineStart:function(){Lr.point=Tr},lineEnd:function(){Pr&&Gr($r,qr),Lr.point=A},polygonStart:function(){Pr=!0},polygonEnd:function(){Pr=null},result:function(){var n=+br;return br=new t.Adder,n}};function Tr(n,t){Lr.point=Gr,$r=jr=n,qr=zr=t}function Gr(n,t){jr-=n,zr-=t,br.add(M(jr*jr+zr*zr)),jr=n,zr=t}let Or,kr,Fr,Hr;class Ir{constructor(n){this._append=null==n?Wr:function(n){const t=Math.floor(n);if(!(t>=0))throw new RangeError(`invalid digits: ${n}`);if(t>15)return Wr;if(t!==Or){const n=10**t;Or=t,kr=function(t){let r=1;this._+=t[0];for(const e=t.length;r<e;++r)this._+=Math.round(arguments[r]*n)/n+t[r]}}return kr}(n),this._radius=4.5,this._=""}pointRadius(n){return this._radius=+n,this}polygonStart(){this._line=0}polygonEnd(){this._line=NaN}lineStart(){this._point=0}lineEnd(){0===this._line&&(this._+="Z"),this._point=NaN}point(n,t){switch(this._point){case 0:this._append`M${n},${t}`,this._point=1;break;case 1:this._append`L${n},${t}`;break;default:if(this._append`M${n},${t}`,this._radius!==Fr||this._append!==kr){const n=this._radius,t=this._;this._="",this._append`m0,${n}a${n},${n} 0 1,1 0,${-2*n}a${n},${n} 0 1,1 0,${2*n}z`,Fr=n,kr=this._append,Hr=this._,this._=t}this._+=Hr}}result(){const n=this._;return this._="",n.length?n:null}}function Wr(n){let t=1;this._+=n[0];for(const r=n.length;t<r;++t)this._+=arguments[t]+n[t]}function Xr(n){return function(t){var r=new Yr;for(var e in n)r[e]=n[e];return r.stream=t,r}}function Yr(){}function Br(n,t,r){var e=n.clipExtent&&n.clipExtent();return n.scale(150).translate([0,0]),null!=e&&n.clipExtent(null),j(r,n.stream(ir)),t(ir.result()),null!=e&&n.clipExtent(e),n}function Dr(n,t,r){return Br(n,(function(r){var e=t[1][0]-t[0][0],i=t[1][1]-t[0][1],o=Math.min(e/(r[1][0]-r[0][0]),i/(r[1][1]-r[0][1])),u=+t[0][0]+(e-o*(r[1][0]+r[0][0]))/2,a=+t[0][1]+(i-o*(r[1][1]+r[0][1]))/2;n.scale(150*o).translate([u,a])}),r)}function Ur(n,t,r){return Dr(n,[[0,0],t],r)}function Zr(n,t,r){return Br(n,(function(r){var e=+t,i=e/(r[1][0]-r[0][0]),o=(e-i*(r[1][0]+r[0][0]))/2,u=-i*r[0][1];n.scale(150*i).translate([o,u])}),r)}function Jr(n,t,r){return Br(n,(function(r){var e=+t,i=e/(r[1][1]-r[0][1]),o=-i*r[0][0],u=(e-i*(r[1][1]+r[0][1]))/2;n.scale(150*i).translate([o,u])}),r)}Yr.prototype={constructor:Yr,point:function(n,t){this.stream.point(n,t)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}};var Kr=16,Qr=h(30*l);function Vr(n,t){return+t?function(n,t){function e(i,o,u,a,c,l,p,h,g,d,v,E,y,S){var m=p-i,w=h-o,x=m*m+w*w;if(x>4*t&&y--){var N=a+d,A=c+v,R=l+E,C=M(N*N+A*A+R*R),P=_(R/=C),$=f(f(R)-1)<r||f(u-g)<r?(u+g)/2:s(A,N),q=n($,P),j=q[0],z=q[1],b=j-i,L=z-o,T=w*b-m*L;(T*T/x>t||f((m*b+w*L)/x-.5)>.3||a*d+c*v+l*E<Qr)&&(e(i,o,u,a,c,l,j,z,$,N/=C,A/=C,R,y,S),S.point(j,z),e(j,z,$,N,A,R,p,h,g,d,v,E,y,S))}}return function(t){var r,i,o,u,a,c,l,f,p,s,h,g,d={point:v,lineStart:E,lineEnd:S,polygonStart:function(){t.polygonStart(),d.lineStart=m},polygonEnd:function(){t.polygonEnd(),d.lineStart=E}};function v(r,e){r=n(r,e),t.point(r[0],r[1])}function E(){f=NaN,d.point=y,t.lineStart()}function y(r,i){var o=en([r,i]),u=n(r,i);e(f,p,l,s,h,g,f=u[0],p=u[1],l=r,s=o[0],h=o[1],g=o[2],Kr,t),t.point(f,p)}function S(){d.point=v,t.lineEnd()}function m(){E(),d.point=M,d.lineEnd=w}function M(n,t){y(r=n,t),i=f,o=p,u=s,a=h,c=g,d.point=y}function w(){e(f,p,l,s,h,g,i,o,r,u,a,c,Kr,t),d.lineEnd=S,S()}return d}}(n,t):function(n){return Xr({point:function(t,r){t=n(t,r),this.stream.point(t[0],t[1])}})}(n)}var ne=Xr({point:function(n,t){this.stream.point(n*l,t*l)}});function te(n,t,r,e,i,o){if(!o)return function(n,t,r,e,i){function o(o,u){return[t+n*(o*=e),r-n*(u*=i)]}return o.invert=function(o,u){return[(o-t)/n*e,(r-u)/n*i]},o}(n,t,r,e,i);var u=h(o),a=S(o),c=u*n,l=a*n,f=u/n,p=a/n,s=(a*r-u*t)/n,g=(a*t+u*r)/n;function d(n,o){return[c*(n*=e)-l*(o*=i)+t,r-l*n-c*o]}return d.invert=function(n,t){return[e*(f*n-p*t+s),i*(g-p*n-f*t)]},d}function re(n){return ee((function(){return n}))()}function ee(n){var t,r,e,i,o,u,a,f,p,s,h=150,g=480,d=250,v=0,E=0,y=0,S=0,m=0,w=0,x=1,_=1,N=null,A=gt,R=null,C=Bt,P=.5;function $(n){return f(n[0]*l,n[1]*l)}function q(n){return(n=f.invert(n[0],n[1]))&&[n[0]*c,n[1]*c]}function j(){var n=te(h,0,0,x,_,w).apply(null,t(v,E)),e=te(h,g-n[0],d-n[1],x,_,w);return r=Kn(y,S,m),a=Zn(t,e),f=Zn(r,a),u=Vr(a,P),z()}function z(){return p=s=null,$}return $.stream=function(n){return p&&s===n?p:p=ne(function(n){return Xr({point:function(t,r){var e=n(t,r);return this.stream.point(e[0],e[1])}})}(r)(A(u(C(s=n)))))},$.preclip=function(n){return arguments.length?(A=n,N=void 0,z()):A},$.postclip=function(n){return arguments.length?(C=n,R=e=i=o=null,z()):C},$.clipAngle=function(n){return arguments.length?(A=+n?dt(N=n*l):(N=null,gt),z()):N*c},$.clipExtent=function(n){return arguments.length?(C=null==n?(R=e=i=o=null,Bt):wt(R=+n[0][0],e=+n[0][1],i=+n[1][0],o=+n[1][1]),z()):null==R?null:[[R,e],[i,o]]},$.scale=function(n){return arguments.length?(h=+n,j()):h},$.translate=function(n){return arguments.length?(g=+n[0],d=+n[1],j()):[g,d]},$.center=function(n){return arguments.length?(v=n[0]%360*l,E=n[1]%360*l,j()):[v*c,E*c]},$.rotate=function(n){return arguments.length?(y=n[0]%360*l,S=n[1]%360*l,m=n.length>2?n[2]%360*l:0,j()):[y*c,S*c,m*c]},$.angle=function(n){return arguments.length?(w=n%360*l,j()):w*c},$.reflectX=function(n){return arguments.length?(x=n?-1:1,j()):x<0},$.reflectY=function(n){return arguments.length?(_=n?-1:1,j()):_<0},$.precision=function(n){return arguments.length?(u=Vr(a,P=n*n),z()):M(P)},$.fitExtent=function(n,t){return Dr($,n,t)},$.fitSize=function(n,t){return Ur($,n,t)},$.fitWidth=function(n,t){return Zr($,n,t)},$.fitHeight=function(n,t){return Jr($,n,t)},function(){return t=n.apply(this,arguments),$.invert=t.invert&&q,j()}}function ie(n){var t=0,r=i/3,e=ee(n),o=e(t,r);return o.parallels=function(n){return arguments.length?e(t=n[0]*l,r=n[1]*l):[t*c,r*c]},o}function oe(n,t){var e=S(n),o=(e+S(t))/2;if(f(o)<r)return function(n){var t=h(n);function r(n,r){return[n*t,S(r)/t]}return r.invert=function(n,r){return[n/t,_(r*t)]},r}(n);var u=1+e*(2*o-e),a=M(u)/o;function c(n,t){var r=M(u-2*o*S(t))/o;return[r*S(n*=o),a-r*h(n)]}return c.invert=function(n,t){var r=a-t,e=s(n,f(r))*m(r);return r*o<0&&(e-=i*m(n)*m(r)),[e/o,_((u-(n*n+r*r)*o*o)/(2*o))]},c}function ue(){return ie(oe).scale(155.424).center([0,33.6442])}function ae(){return ue().parallels([29.5,45.5]).scale(1070).translate([480,250]).rotate([96,0]).center([-.6,38.7])}function ce(n){return function(t,r){var e=h(t),i=h(r),o=n(e*i);return o===1/0?[2,0]:[o*i*S(t),o*S(r)]}}function le(n){return function(t,r){var e=M(t*t+r*r),i=n(e),o=S(i),u=h(i);return[s(t*o,e*u),_(e&&r*o/e)]}}var fe=ce((function(n){return M(2/(1+n))}));fe.invert=le((function(n){return 2*_(n/2)}));var pe=ce((function(n){return(n=x(n))&&n/S(n)}));function se(n,t){return[n,E(w((o+t)/2))]}function he(n){var t,r,e,o=re(n),u=o.center,a=o.scale,c=o.translate,l=o.clipExtent,f=null;function p(){var u=i*a(),c=o(tt(o.rotate()).invert([0,0]));return l(null==f?[[c[0]-u,c[1]-u],[c[0]+u,c[1]+u]]:n===se?[[Math.max(c[0]-u,f),t],[Math.min(c[0]+u,r),e]]:[[f,Math.max(c[1]-u,t)],[r,Math.min(c[1]+u,e)]])}return o.scale=function(n){return arguments.length?(a(n),p()):a()},o.translate=function(n){return arguments.length?(c(n),p()):c()},o.center=function(n){return arguments.length?(u(n),p()):u()},o.clipExtent=function(n){return arguments.length?(null==n?f=t=r=e=null:(f=+n[0][0],t=+n[0][1],r=+n[1][0],e=+n[1][1]),p()):null==f?null:[[f,t],[r,e]]},p()}function ge(n){return w((o+n)/2)}function de(n,t){var e=h(n),u=n===t?S(n):E(e/h(t))/E(ge(t)/ge(n)),a=e*y(ge(n),u)/u;if(!u)return se;function c(n,t){a>0?t<-o+r&&(t=-o+r):t>o-r&&(t=o-r);var e=a/y(ge(t),u);return[e*S(u*n),a-e*h(u*n)]}return c.invert=function(n,t){var r=a-t,e=m(u)*M(n*n+r*r),c=s(n,f(r))*m(r);return r*u<0&&(c-=i*m(n)*m(r)),[c/u,2*p(y(a/e,1/u))-o]},c}function ve(n,t){return[n,t]}function Ee(n,t){var e=h(n),o=n===t?S(n):(e-h(t))/(t-n),u=e/o+n;if(f(o)<r)return ve;function a(n,t){var r=u-t,e=o*n;return[r*S(e),u-r*h(e)]}return a.invert=function(n,t){var r=u-t,e=s(n,f(r))*m(r);return r*o<0&&(e-=i*m(n)*m(r)),[e/o,u-m(o)*M(n*n+r*r)]},a}pe.invert=le((function(n){return n})),se.invert=function(n,t){return[n,2*p(d(t))-o]},ve.invert=ve;var ye=1.340264,Se=-.081106,me=893e-6,Me=.003796,we=M(3)/2;function xe(n,t){var r=_(we*S(t)),e=r*r,i=e*e*e;return[n*h(r)/(we*(ye+3*Se*e+i*(7*me+9*Me*e))),r*(ye+Se*e+i*(me+Me*e))]}function _e(n,t){var r=h(t),e=h(n)*r;return[r*S(n)/e,S(t)/e]}function Ne(n,t){var r=t*t,e=r*r;return[n*(.8707-.131979*r+e*(e*(.003971*r-.001529*e)-.013791)),t*(1.007226+r*(.015085+e*(.028874*r-.044475-.005916*e)))]}function Ae(n,t){return[h(t)*S(n),S(t)]}function Re(n,t){var r=h(t),e=1+h(n)*r;return[r*S(n)/e,S(t)/e]}function Ce(n,t){return[E(w((o+t)/2)),-n]}xe.invert=function(n,t){for(var r,i=t,o=i*i,u=o*o*o,a=0;a<12&&(u=(o=(i-=r=(i*(ye+Se*o+u*(me+Me*o))-t)/(ye+3*Se*o+u*(7*me+9*Me*o)))*i)*o*o,!(f(r)<e));++a);return[we*n*(ye+3*Se*o+u*(7*me+9*Me*o))/h(i),_(S(i)/we)]},_e.invert=le(p),Ne.invert=function(n,t){var e,i=t,o=25;do{var u=i*i,a=u*u;i-=e=(i*(1.007226+u*(.015085+a*(.028874*u-.044475-.005916*a)))-t)/(1.007226+u*(.045255+a*(.259866*u-.311325-.005916*11*a)))}while(f(e)>r&&--o>0);return[n/(.8707+(u=i*i)*(u*(u*u*u*(.003971-.001529*u)-.013791)-.131979)),i]},Ae.invert=le(_),Re.invert=le((function(n){return 2*p(n)})),Ce.invert=function(n,t){return[-t,2*p(d(n))-o]},n.geoAlbers=ae,n.geoAlbersUsa=function(){var n,t,e,i,o,u,a=ae(),c=ue().rotate([154,0]).center([-2,58.5]).parallels([55,65]),l=ue().rotate([157,0]).center([-3,19.9]).parallels([8,18]),f={point:function(n,t){u=[n,t]}};function p(n){var t=n[0],r=n[1];return u=null,e.point(t,r),u||(i.point(t,r),u)||(o.point(t,r),u)}function s(){return n=t=null,p}return p.invert=function(n){var t=a.scale(),r=a.translate(),e=(n[0]-r[0])/t,i=(n[1]-r[1])/t;return(i>=.12&&i<.234&&e>=-.425&&e<-.214?c:i>=.166&&i<.234&&e>=-.214&&e<-.115?l:a).invert(n)},p.stream=function(r){return n&&t===r?n:(e=[a.stream(t=r),c.stream(r),l.stream(r)],i=e.length,n={point:function(n,t){for(var r=-1;++r<i;)e[r].point(n,t)},sphere:function(){for(var n=-1;++n<i;)e[n].sphere()},lineStart:function(){for(var n=-1;++n<i;)e[n].lineStart()},lineEnd:function(){for(var n=-1;++n<i;)e[n].lineEnd()},polygonStart:function(){for(var n=-1;++n<i;)e[n].polygonStart()},polygonEnd:function(){for(var n=-1;++n<i;)e[n].polygonEnd()}});var e,i},p.precision=function(n){return arguments.length?(a.precision(n),c.precision(n),l.precision(n),s()):a.precision()},p.scale=function(n){return arguments.length?(a.scale(n),c.scale(.35*n),l.scale(n),p.translate(a.translate())):a.scale()},p.translate=function(n){if(!arguments.length)return a.translate();var t=a.scale(),u=+n[0],p=+n[1];return e=a.translate(n).clipExtent([[u-.455*t,p-.238*t],[u+.455*t,p+.238*t]]).stream(f),i=c.translate([u-.307*t,p+.201*t]).clipExtent([[u-.425*t+r,p+.12*t+r],[u-.214*t-r,p+.234*t-r]]).stream(f),o=l.translate([u-.205*t,p+.212*t]).clipExtent([[u-.214*t+r,p+.166*t+r],[u-.115*t-r,p+.234*t-r]]).stream(f),s()},p.fitExtent=function(n,t){return Dr(p,n,t)},p.fitSize=function(n,t){return Ur(p,n,t)},p.fitWidth=function(n,t){return Zr(p,n,t)},p.fitHeight=function(n,t){return Jr(p,n,t)},p.scale(1070)},n.geoArea=function(n){return J=new t.Adder,j(n,K),2*J},n.geoAzimuthalEqualArea=function(){return re(fe).scale(124.75).clipAngle(179.999)},n.geoAzimuthalEqualAreaRaw=fe,n.geoAzimuthalEquidistant=function(){return re(pe).scale(79.4188).clipAngle(179.999)},n.geoAzimuthalEquidistantRaw=pe,n.geoBounds=function(n){var t,r,e,i,o,u,a;if(H=F=-(O=k=1/0),D=[],j(n,An),r=D.length){for(D.sort(Ln),t=1,o=[e=D[0]];t<r;++t)Tn(e,(i=D[t])[0])||Tn(e,i[1])?(bn(e[0],i[1])>bn(e[0],e[1])&&(e[1]=i[1]),bn(i[0],e[1])>bn(e[0],e[1])&&(e[0]=i[0])):o.push(e=i);for(u=-1/0,t=0,e=o[r=o.length-1];t<=r;e=i,++t)i=o[t],(a=bn(e[1],i[0]))>u&&(u=a,O=i[0],F=e[1])}return D=U=null,O===1/0||k===1/0?[[NaN,NaN],[NaN,NaN]]:[[O,k],[F,H]]},n.geoCentroid=function(n){fn=pn=sn=hn=gn=dn=vn=En=0,yn=new t.Adder,Sn=new t.Adder,mn=new t.Adder,j(n,Gn);var i=+yn,o=+Sn,u=+mn,a=v(i,o,u);return a<e&&(i=dn,o=vn,u=En,pn<r&&(i=sn,o=hn,u=gn),(a=v(i,o,u))<e)?[NaN,NaN]:[s(o,i)*c,_(u/a)*c]},n.geoCircle=function(){var n,t,r=Un([0,0]),e=Un(90),i=Un(2),o={point:function(r,e){n.push(r=t(r,e)),r[0]*=c,r[1]*=c}};function u(){var u=r.apply(this,arguments),a=e.apply(this,arguments)*l,c=i.apply(this,arguments)*l;return n=[],t=Kn(-u[0]*l,-u[1]*l,0).invert,rt(o,a,c,1),u={type:"Polygon",coordinates:[n]},n=t=null,u}return u.center=function(n){return arguments.length?(r="function"==typeof n?n:Un([+n[0],+n[1]]),u):r},u.radius=function(n){return arguments.length?(e="function"==typeof n?n:Un(+n),u):e},u.precision=function(n){return arguments.length?(i="function"==typeof n?n:Un(+n),u):i},u},n.geoClipAntimeridian=gt,n.geoClipCircle=dt,n.geoClipExtent=function(){var n,t,r,e=0,i=0,o=960,u=500;return r={stream:function(r){return n&&t===r?n:n=wt(e,i,o,u)(t=r)},extent:function(a){return arguments.length?(e=+a[0][0],i=+a[0][1],o=+a[1][0],u=+a[1][1],n=t=null,r):[[e,i],[o,u]]}}},n.geoClipRectangle=wt,n.geoConicConformal=function(){return ie(de).scale(109.5).parallels([30,30])},n.geoConicConformalRaw=de,n.geoConicEqualArea=ue,n.geoConicEqualAreaRaw=oe,n.geoConicEquidistant=function(){return ie(Ee).scale(131.154).center([0,13.9389])},n.geoConicEquidistantRaw=Ee,n.geoContains=function(n,t){return(n&&qt.hasOwnProperty(n.type)?qt[n.type]:zt)(n,t)},n.geoDistance=$t,n.geoEqualEarth=function(){return re(xe).scale(177.158)},n.geoEqualEarthRaw=xe,n.geoEquirectangular=function(){return re(ve).scale(152.63)},n.geoEquirectangularRaw=ve,n.geoGnomonic=function(){return re(_e).scale(144.049).clipAngle(60)},n.geoGnomonicRaw=_e,n.geoGraticule=Ht,n.geoGraticule10=function(){return Ht()()},n.geoIdentity=function(){var n,t,r,e,i,o,u,a=1,f=0,p=0,s=1,g=1,d=0,v=null,E=1,y=1,m=Xr({point:function(n,t){var r=x([n,t]);this.stream.point(r[0],r[1])}}),M=Bt;function w(){return E=a*s,y=a*g,o=u=null,x}function x(r){var e=r[0]*E,i=r[1]*y;if(d){var o=i*n-e*t;e=e*n+i*t,i=o}return[e+f,i+p]}return x.invert=function(r){var e=r[0]-f,i=r[1]-p;if(d){var o=i*n+e*t;e=e*n-i*t,i=o}return[e/E,i/y]},x.stream=function(n){return o&&u===n?o:o=m(M(u=n))},x.postclip=function(n){return arguments.length?(M=n,v=r=e=i=null,w()):M},x.clipExtent=function(n){return arguments.length?(M=null==n?(v=r=e=i=null,Bt):wt(v=+n[0][0],r=+n[0][1],e=+n[1][0],i=+n[1][1]),w()):null==v?null:[[v,r],[e,i]]},x.scale=function(n){return arguments.length?(a=+n,w()):a},x.translate=function(n){return arguments.length?(f=+n[0],p=+n[1],w()):[f,p]},x.angle=function(r){return arguments.length?(t=S(d=r%360*l),n=h(d),w()):d*c},x.reflectX=function(n){return arguments.length?(s=n?-1:1,w()):s<0},x.reflectY=function(n){return arguments.length?(g=n?-1:1,w()):g<0},x.fitExtent=function(n,t){return Dr(x,n,t)},x.fitSize=function(n,t){return Ur(x,n,t)},x.fitWidth=function(n,t){return Zr(x,n,t)},x.fitHeight=function(n,t){return Jr(x,n,t)},x},n.geoInterpolate=function(n,t){var r=n[0]*l,e=n[1]*l,i=t[0]*l,o=t[1]*l,u=h(e),a=S(e),f=h(o),p=S(o),g=u*h(r),d=u*S(r),v=f*h(i),E=f*S(i),y=2*_(M(N(o-e)+u*f*N(i-r))),m=S(y),w=y?function(n){var t=S(n*=y)/m,r=S(y-n)/m,e=r*g+t*v,i=r*d+t*E,o=r*a+t*p;return[s(i,e)*c,s(o,M(e*e+i*i))*c]}:function(){return[r*c,e*c]};return w.distance=y,w},n.geoLength=Rt,n.geoMercator=function(){return he(se).scale(961/a)},n.geoMercatorRaw=se,n.geoNaturalEarth1=function(){return re(Ne).scale(175.295)},n.geoNaturalEarth1Raw=Ne,n.geoOrthographic=function(){return re(Ae).scale(249.5).clipAngle(90+r)},n.geoOrthographicRaw=Ae,n.geoPath=function(n,t){let r,e,i=3,o=4.5;function u(n){return n&&("function"==typeof o&&e.pointRadius(+o.apply(this,arguments)),j(n,r(e))),e.result()}return u.area=function(n){return j(n,r(Zt)),Zt.result()},u.measure=function(n){return j(n,r(Lr)),Lr.result()},u.bounds=function(n){return j(n,r(ir)),ir.result()},u.centroid=function(n){return j(n,r(yr)),yr.result()},u.projection=function(t){return arguments.length?(r=null==t?(n=null,Bt):(n=t).stream,u):n},u.context=function(n){return arguments.length?(e=null==n?(t=null,new Ir(i)):new Cr(t=n),"function"!=typeof o&&e.pointRadius(o),u):t},u.pointRadius=function(n){return arguments.length?(o="function"==typeof n?n:(e.pointRadius(+n),+n),u):o},u.digits=function(n){if(!arguments.length)return i;if(null==n)i=null;else{const t=Math.floor(n);if(!(t>=0))throw new RangeError(`invalid digits: ${n}`);i=t}return null===t&&(e=new Ir(i)),u},u.projection(n).digits(i).context(t)},n.geoProjection=re,n.geoProjectionMutator=ee,n.geoRotation=tt,n.geoStereographic=function(){return re(Re).scale(250).clipAngle(142)},n.geoStereographicRaw=Re,n.geoStream=j,n.geoTransform=function(n){return{stream:Xr(n)}},n.geoTransverseMercator=function(){var n=he(Ce),t=n.center,r=n.rotate;return n.center=function(n){return arguments.length?t([-n[1],n[0]]):[(n=t())[1],-n[0]]},n.rotate=function(n){return arguments.length?r([n[0],n[1],n.length>2?n[2]+90:90]):[(n=r())[0],n[1],n[2]-90]},r([0,0,90]).scale(159.155)},n.geoTransverseMercatorRaw=Ce}));

/* Carta map surfaces — real geometry, no freehand.
 *  <carta-belt>    the growing world (the passport frame): the LANDS outlines the
 *                  file already carries, fitted to the box. No fetch, no tile.
 *  <carta-streets> a city or a single café: Leaflet + OpenStreetMap, inked to Carta.
 *  <carta-plot>    the drawn plot — a handful of points fit to a box, offline, no tiles.
 *  <carta-city>    the city an ask lands on: the CITY_ARCS shore in this file, a
 *                  kilometre grid, the reach in rings, numbered marks. No tile.
 * All four live in light DOM so the page's own tokens (var(--ink) …) resolve.
 * Taps leave as bubbling events: carta:country-tap {name} · carta:pin-tap {id}.
 */
(() => {
  const BELT = ["hawaii","alaska","angola","argentina","australia","bangladesh","belize","bolivia","brazil","burundi","cambodia","cameroon","chile","china","colombia","republic of the congo","costa rica","côte d'ivoire","ivory coast","cuba","democratic republic of the congo","dominican republic","ecuador","el salvador","eritrea","ethiopia","ghana","guatemala","guyana","haiti","honduras","india","indonesia","jamaica","kenya","laos","madagascar","malawi","malaysia","mexico","mozambique","myanmar","nepal","nicaragua","nigeria","panama","papua new guinea","paraguay","peru","philippines","puerto rico","rwanda","south sudan","sri lanka","suriname","united republic of tanzania","tanzania","thailand","east timor","timor-leste","togo","trinidad and tobago","uganda","united states of america","venezuela","vietnam","yemen","zambia","zimbabwe"];
  const BELT_SET = new Set(BELT);
  const fold = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
  const AKA = { 'united states': 'united states of america', 'usa': 'united states of america', 'us': 'united states of america', 'drc': 'democratic republic of the congo', 'dem rep congo': 'democratic republic of the congo', 'dr congo': 'democratic republic of the congo', 'congo': 'republic of the congo', 'tanzania': 'united republic of tanzania', 'timor leste': 'east timor', 'east timor': 'east timor', 'ivory coast': "côte d'ivoire", 'cote d ivoire': "côte d'ivoire", 'burma': 'myanmar', 'cameron': 'cameroon', 'hawai': 'hawaii', 'dominican rep': 'dominican republic', 'philipines': 'philippines' };
  const key = n => { const f = fold(n); return AKA[f] || f; };

  /* the ground — the atlas the app already carries, not a fetch.
     LANDS is Natural Earth 1:110m for the same coffee-growing countries this
     component knows, decoded out of the file itself (docs/MAPPING.md), so the
     passport needs no tile, no CDN and nothing to be offline from. The keeper's
     own spelling rides along for the countries the record has tasted — the
     passport prints your words, never a lookup key. */
  const world = () => Promise.resolve(buildWorld());
  function buildWorld() {
    const names = (window.CARTA_LAND_NAMES && window.CARTA_LAND_NAMES()) || {};
    const out = [];
    Object.keys(LANDS).forEach(k => {
      const rings = landRingsRaw(k);
      if (!rings || !rings.length) return;
      const polys = rings.map(r => [r.map(p => [p.lon, p.lat])]).filter(p => p[0].length > 2);
      if (!polys.length) return;
      out.push({
        type: 'Feature',
        properties: { name: names[k] || k },
        geometry: polys.length === 1
          ? { type: 'Polygon', coordinates: polys[0] }
          : { type: 'MultiPolygon', coordinates: polys },
      });
    });
    return out;
  }

  /* the streets stay an enhancement, never a dependency (CLAUDE.md): Leaflet is
     injected at runtime the way MapLibre always was, and a surface that can't
     reach it hides itself so the drawn plot underneath simply stands. */
  const LF_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  const LF_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  let _lfP = null, _lfDown = false;
  const lfLoad = () => {
    if (window.L) return Promise.resolve();
    if (_lfP) return _lfP;
    return _lfP = new Promise((res, rej) => {
      const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = LF_CSS;
      document.head.appendChild(css);
      const s = document.createElement('script'); s.src = LF_JS;
      const to = setTimeout(() => { _lfP = null; rej(new Error('slow')); }, 8000);
      s.onload = () => { clearTimeout(to); res(); };
      s.onerror = () => { clearTimeout(to); _lfP = null; rej(new Error('unreachable')); };
      document.head.appendChild(s);
    });
  };

  const keepPos = el => { if (getComputedStyle(el).position === 'static') el.style.position = 'relative'; };

  /* React owns the elements themselves, so never touch our own child list —
     each component paints into one private host div it appends once. */
  const hostOf = el => {
    if (!el._host) { const d = document.createElement('div'); d.style.display = 'block'; d.style.height = '100%'; el.appendChild(d); el._host = d; }
    return el._host;
  };

  class Belt extends HTMLElement {
    static get observedAttributes() { return ['tasted', 'labels', 'fit', 'focus', 'lift', 'frame', 'topo', 'marks']; }
    connectedCallback() {
      this.style.display = 'block'; keepPos(this); this.paint();
      if (window.ResizeObserver && !this._ro) {
        this._ro = new ResizeObserver(() => { clearTimeout(this._rt); this._rt = setTimeout(() => this.paint(), 160); });
        this._ro.observe(this);
      }
    }
    disconnectedCallback() { if (this._ro) { this._ro.disconnect(); this._ro = null; } }
    attributeChangedCallback() { if (this.isConnected) this.paint(); }
    async paint() {
      let feats;
      try { feats = await world(); } catch (e) { return; }
      if (!this.isConnected) return;
      const host = hostOf(this);
      const d3 = window.d3;
      const tasted = new Set((this.getAttribute('tasted') || '').split(',').map(key).filter(Boolean));
      const labels = this.getAttribute('labels') !== 'off';
      const cover = this.getAttribute('fit') === 'cover';
      const focus = key(this.getAttribute('focus') || '');
      const frameTasted = this.getAttribute('frame') === 'tasted';
      const lift = this.getAttribute('lift') === 'on';
      const wantTopo = this.getAttribute('topo') === 'on';
      let marks2 = []; try { marks2 = JSON.parse(this.getAttribute('marks') || '[]'); } catch (e) { }
      const belt = feats.filter(f => BELT_SET.has(key(f.properties.name)));
      const cw = this.clientWidth || 480, ch = this.clientHeight || 0;
      /* one SVG unit = one CSS pixel, so type and hairlines are drawn at the size
         they are read at. The old fixed 1000-unit box scaled an 11px label down to
         4px on a phone — the passport's own labels were the thing you couldn't read. */
      const W = cover ? Math.max(300, Math.round(cw)) : 1000;
      const H = cover ? Math.max(220, Math.round(ch || 432)) : 470;
      const proj = d3.geoEquirectangular();
      const target = focus ? belt.filter(f => key(f.properties.name) === focus)
        : frameTasted ? belt.filter(f => tasted.has(key(f.properties.name))) : belt;
      const coll = { type: 'FeatureCollection', features: target.length ? target : belt };
      /* the growing belt is wide and a phone is not, so the tasted frame takes the
         width it has (a 20%/80% inset threw away 40% of it) and sits high in the
         box, clear of the headline the passport lays over its own bottom third. */
      if (cover) proj.fitExtent(frameTasted && target.length
        ? [[14, H * .2], [W - 14, H * .66]]
        : [[18, 26], [W - 18, H - 26]], coll); else proj.fitSize([W, H], coll);
      const path = d3.geoPath(proj);
      const ground = [], marks = [];
      const size = Math.max(11, Math.min(lift ? 13 : 12, Math.round(W / 28)));
      const hit = (a, b) => !(a.x1 + 2 < b.x0 || b.x1 + 2 < a.x0 || a.y1 + 2 < b.y0 || b.y1 + 2 < a.y0);
      const placed = [];
      const items = [];
      belt.forEach(f => {
        const d = path(f); if (!d) return;
        if (tasted.has(key(f.properties.name))) {
          const bb = path.bounds(f), c = path.centroid(f);
          items.push({ d, bb, cx: c[0], cy: c[1], k: key(f.properties.name), label: f.properties.name, area: (bb[1][0] - bb[0][0]) * (bb[1][1] - bb[0][1]) });
        } else ground.push(`<path d="${d}" style="fill:var(--ca-land-fill, var(--surface-page));fill-opacity:.6;stroke:var(--ca-land-line, var(--line-2));stroke-width:${lift ? .8 : 1};stroke-linejoin:round;pointer-events:none"></path>`);
      });
      /* the ground read for its shape: the 1,000 / 2,000 / 3,000 m contours the file
         already carries (LAND_TOPO), inked back over a country's own fill. Altitude
         is most of why a coffee tastes the way it does, so a country you have tasted
         shows where it is high. Drawn only when a view asks — at world width they are
         a smudge, which is the same refusal the printed passport already makes. */
      const contours = k => {
        const lv = wantTopo && window.landTopoRaw ? landTopoRaw(k) : null;
        if (!lv) return '';
        return lv.map((level, i) => level.map(r => {
          let d = '';
          for (const q of r) { const xy = proj([q.lon, q.lat]); if (!xy || !isFinite(xy[0])) return ''; d += (d ? 'L' : 'M') + xy[0].toFixed(1) + ' ' + xy[1].toFixed(1); }
          return d ? `<path d="${d}Z" style="fill:var(--ca-topo, var(--surface-card));fill-opacity:.07;stroke:var(--ca-topo, var(--surface-card));stroke-opacity:${(.3 + i * .18).toFixed(2)};stroke-width:${(.7 + i * .3).toFixed(2)};stroke-linejoin:round;pointer-events:none"></path>` : '';
        }).join('')).join('');
      };
      items.sort((a, b) => b.area - a.area).forEach(it => {
        const d = it.d, bb = it.bb, cx = it.cx, cy = it.cy, label = it.label;
        const tw = label.length * size * .58 + 5;   // Libre Franklin at .06em, plus the halo it paints outside itself
        const cands = [];
        if (tw < (bb[1][0] - bb[0][0]) - 6) cands.push({ x: cx, y: cy + 4, anchor: 'middle', inside: true, x0: cx - tw / 2, x1: cx + tw / 2 });
        [0, -1.3, 1.3].forEach(k => {
          const y = cy + 4 + k * size;
          cands.push({ x: bb[1][0] + 7, y, anchor: 'start', inside: false, x0: bb[1][0] + 7, x1: bb[1][0] + 7 + tw });
          cands.push({ x: bb[0][0] - 7, y, anchor: 'end', inside: false, x0: bb[0][0] - 7 - tw, x1: bb[0][0] - 7 });
        });
        let put = null;
        for (const c of cands) {
          const box = { x0: c.x0, x1: c.x1, y0: c.y - size * .8, y1: c.y + size * .3 };
          const m = size * .5;   // a label that runs off the frame is worse than no label
          if (!isFinite(box.x0) || box.x0 < m || box.x1 > W - m || box.y0 < m || box.y1 > H - m) continue;
          if (placed.some(p => hit(box, p))) continue;
          put = { c: c, box: box }; break;
        }
        if (put) placed.push(put.box);
        const lstyle = put && put.c.inside
          ? 'fill:var(--ca-mk-label, var(--ink-2));paint-order:stroke;stroke:var(--ca-mk-halo, var(--surface-card));stroke-width:4px;stroke-linejoin:round'
          : 'fill:var(--ca-mk-out, var(--ink-2));paint-order:stroke;stroke:var(--surface-card);stroke-width:3.5px;stroke-linejoin:round';
        marks.push(`<g class="mk" data-name="${label.replace(/"/g, '&quot;')}" style="cursor:pointer">
            <path d="${d}" style="fill:var(--ca-mk-fill, var(--surface-page));fill-opacity:${lift ? 1 : .9};stroke:var(--ca-mk-line, var(--ink-2));stroke-width:${lift ? 1.1 : 1.3};stroke-linejoin:round"></path>${contours(it.k)}
            ${labels && put ? `<text x="${put.c.x.toFixed(1)}" y="${put.c.y.toFixed(1)}" text-anchor="${put.c.anchor}" style="font-family:var(--sans);font-size:${size}px;letter-spacing:.06em;${lstyle};pointer-events:none">${label}</text>` : ''}
          </g>`);
      });
      /* the regions the record has actually found coffee from, standing on the
         ground they came off. A region is drawn only where the record can place
         it — the same rule the ask obeys for a café: what can't be confirmed is
         listed, never plotted. Its label is dropped, never clipped, when the
         frame has no room; the list underneath still names every one of them. */
      const rmk = marks2.filter(m => isFinite(m.lat) && isFinite(m.lon)).map(m => {
        const xy = proj([m.lon, m.lat]);
        if (!xy || !isFinite(xy[0]) || xy[0] < 0 || xy[0] > W || xy[1] < 0 || xy[1] > H) return '';
        const x = xy[0], y = xy[1], nm = String(m.label || '');
        const tw = nm.length * 11 * .58 + 5;
        const spots = [[x, y - 11, 'middle', x - tw / 2], [x + 9, y + 4, 'start', x + 9], [x - 9, y + 4, 'end', x - 9 - tw], [x, y + 18, 'middle', x - tw / 2]];
        let put = null;
        for (const sp of spots) {
          const box = { x0: sp[3], x1: sp[3] + tw, y0: sp[1] - 9, y1: sp[1] + 3 };
          if (box.x0 < 5 || box.x1 > W - 5 || box.y0 < 5 || box.y1 > H - 5) continue;
          if (placed.some(q => hit(box, q))) continue;
          placed.push(box); put = sp; break;
        }
        return `<g class="rmk" data-id="${String(m.id || '').replace(/"/g, '&quot;')}" style="cursor:pointer">
            <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.6" style="fill:var(--ca-rmk, var(--surface-card));stroke:var(--ca-mk-line, var(--ink-2));stroke-width:1.4"></circle>
            ${put ? `<text x="${put[0].toFixed(1)}" y="${put[1].toFixed(1)}" text-anchor="${put[2]}" style="font-family:var(--sans);font-size:11px;letter-spacing:.05em;fill:var(--ca-rmk, var(--surface-card));paint-order:stroke;stroke:var(--ca-mk-line, var(--ink-2));stroke-width:3px;stroke-linejoin:round;pointer-events:none">${nm.replace(/[<&]/g, '')}</text>` : ''}
          </g>`;
      }).join('');
      host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="${cover ? 'xMidYMid slice' : 'xMidYMid meet'}" style="display:block;width:100%;height:${cover ? '100%' : 'auto'}">${ground.join('')}${marks.join('')}${rmk}</svg>`;
      host.querySelectorAll('g.mk').forEach(g => g.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('carta:country-tap', { detail: { name: g.dataset.name }, bubbles: true, composed: true }));
      }));
      host.querySelectorAll('g.rmk').forEach(g => g.addEventListener('click', e => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('carta:pin-tap', { detail: { id: g.dataset.id }, bubbles: true, composed: true }));
      }));
    }
  }

  /* the drawn plot — offline, tokens only, the identity: a dot per place fit to a box */
  const pinsOf = el => {
    const from = el.getAttribute('pins-from');
    if (from) return (window.CARTA_FIX && window.CARTA_FIX[from]) || [];
    try { return JSON.parse(el.getAttribute('pins') || '[]'); } catch (e) { return []; }
  };

  class Plot extends HTMLElement {
    static get observedAttributes() { return ['pins', 'pins-from', 'dot', 'labels', 'fit']; }
    connectedCallback() {
      this.style.display = 'block'; if (this.getAttribute('fit') === 'frame') this.style.height = '100%';
      this.paint();
      /* a framed plot is measured against its own box, so it has to re-fit
         when the box moves — and on the door the box moves on every paint, as
         the plate takes whatever the leaf leaves it. The same observer
         <carta-atlas> already keeps, for the same reason. */
      if (this.getAttribute('fit') === 'frame' && window.ResizeObserver && !this._ro) {
        this._ro = new ResizeObserver(() => { clearTimeout(this._rt); this._rt = setTimeout(() => this.paint(), 120); });
        this._ro.observe(this);
      }
    }
    disconnectedCallback() { if (this._ro) { this._ro.disconnect(); this._ro = null; } }
    attributeChangedCallback() { if (this.isConnected) this.paint(); }
    paint() {
      const host = hostOf(this);
      let pins = pinsOf(this);
      pins = pins.filter(p => isFinite(p.lat) && isFinite(p.lon));
      if (!pins.length) { host.innerHTML = ''; return; }
      const r = Number(this.getAttribute('dot') || 6), labels = this.getAttribute('labels') === 'on';
      const frameFit = this.getAttribute('fit') === 'frame';
      if (frameFit) this.style.height = '100%';
      const la0 = pins.reduce((a, p) => a + p.lat, 0) / pins.length;
      const px = p => p.lon * 111.32 * Math.cos(la0 * Math.PI / 180), py = p => p.lat * 111.32;
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      pins.forEach(p => { const x = px(p), y = py(p); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
      const pad = Math.max(.6, (x1 - x0) * .18, (y1 - y0) * .18);
      x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
      /* The box, and why it is measured rather than assumed.
       *
       * A 336-unit viewBox at the data's own aspect ratio, scaled into the
       * container with `meet`, letterboxes: a portrait spread of cafés in a
       * landscape plate wastes most of the width, and the whole drawing —
       * dots, labels and all — shrinks to whatever the tighter axis allows.
       * At the door's full 416px plate that already put the names at about
       * 6px; on a phone short enough for `atlasPlateH` to give the plate half
       * of that, it put them at one. The design asks for `dot="9"` and 10px
       * names, and the only way those numbers mean anything is if one SVG
       * unit is one CSS pixel — which is what <carta-atlas> and the seal have
       * always done, and what this element alone did not.
       *
       * So a framed plot builds its box from the box it is actually in. An
       * unframed one is still laid out by its own aspect ratio, because it
       * has no height to read: it is a block in a scrolling column. */
      const P = 4;
      let W = 336, H;
      if (frameFit && this.clientWidth > 40 && this.clientHeight > 40) {
        W = Math.round(this.clientWidth); H = Math.round(this.clientHeight);
      } else {
        H = Math.max(160, Math.round((W - 2 * P) * (y1 - y0) / Math.max(.001, x1 - x0)) + 2 * P);
      }
      const s = Math.min((W - 2 * P) / Math.max(.001, x1 - x0), (H - 2 * P) / Math.max(.001, y1 - y0));
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const X = p => W / 2 + (px(p) - cx) * s, Y = p => H / 2 - (py(p) - cy) * s;
      /* Every label is placed against what is already on the plate, and a label
         that will not fit is DROPPED rather than stacked — the same rule
         <carta-atlas> keeps for a country's name, and for the same reason: a
         plot fits its points to the box, so two cafés two streets apart land
         two dots apart, and a fixed label above each of them overprints into a
         smear. The marks are registered first: a label may be dropped, a mark
         never moves for one. Four spots per name, above first, because that is
         where the label sat when there was only ever one of them. */
      const FS = 10, placed = [];
      const hit = (a, b) => !(a.x1 + 2 < b.x0 || b.x1 + 2 < a.x0 || a.y1 + 2 < b.y0 || b.y1 + 2 < a.y0);
      if (labels) pins.forEach(p => {
        const x = X(p), y = Y(p);
        placed.push({ x0: x - r - 2, x1: x + r + 2, y0: y - r - 2, y1: y + r + 2 });
      });
      const labelOf = p => {
        const name = (p.name || '').replace(/[<&]/g, '');
        if (!labels || !name) return '';
        const x = X(p), y = Y(p), tw = name.length * FS * .56 + 4;
        const spots = [[x, y - r - 6, 'middle', x - tw / 2], [x, y + r + FS + 4, 'middle', x - tw / 2],
                       [x + r + 6, y + FS * .34, 'start', x + r + 6], [x - r - 6, y + FS * .34, 'end', x - r - 6 - tw]];
        for (const sp of spots) {
          const box = { x0: sp[3], x1: sp[3] + tw, y0: sp[1] - FS * .85, y1: sp[1] + FS * .3 };
          if (box.x0 < 2 || box.x1 > W - 2 || box.y0 < 2 || box.y1 > H - 2) continue;
          if (placed.some(z => hit(box, z))) continue;
          placed.push(box);
          /* the halo the rest of the layer already paints its type with, so a
             name over a dot is read rather than fought with */
          return `<text x="${sp[0].toFixed(1)}" y="${sp[1].toFixed(1)}" text-anchor="${sp[2]}" style="font-family:var(--sans);font-size:${FS}px;letter-spacing:.04em;fill:var(--ink-3);paint-order:stroke;stroke:var(--ca-halo, var(--surface-card));stroke-width:3px;stroke-linejoin:round;pointer-events:none">${name}</text>`;
        }
        return '';
      };
      host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:${frameFit ? '100%' : 'auto'}">${pins.map(p => `
        <g data-id="${p.id || ''}" style="cursor:pointer">
          <circle cx="${X(p).toFixed(1)}" cy="${Y(p).toFixed(1)}" r="${p.dim ? (r * .72).toFixed(1) : r}" style="${p.dim
        ? 'fill:none;stroke:var(--ca-dim, var(--ink-3));stroke-width:1.2'
        : 'fill:var(--ca-dot, var(--ink));stroke:var(--surface-card);stroke-width:1.5'}"></circle>
          ${labelOf(p)}
        </g>`).join('')}</svg>`;
      host.querySelectorAll('g[data-id]').forEach(g => g.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('carta:pin-tap', { detail: { id: g.dataset.id }, bubbles: true, composed: true }));
      }));
    }
  }

  /* real streets — OpenStreetMap through Leaflet, filtered to Carta's ink.
   */
  class Streets extends HTMLElement {
    static get observedAttributes() { return ['pins', 'pins-from', 'zoom', 'theme', 'still', 'terrain', 'names']; }
    connectedCallback() {
      this.style.display = 'block'; keepPos(this); this.style.background = 'var(--surface-sunk)';
      if (!this.style.zIndex) this.style.zIndex = '0';   // contain Leaflet's own pane z-indexes
      this._mapHost = document.createElement('div');
      Object.assign(this._mapHost.style, { position: 'absolute', inset: '0' });
      this.appendChild(this._mapHost);
      if (!navigator.onLine || _lfDown) { this.fell(); return; }
      lfLoad().then(() => { if (this.isConnected) this.boot(); })
              .catch(() => { _lfDown = true; if (this.isConnected) this.fell(); });
    }
    // the drawn plot is already underneath — step aside and say so once
    fell() {
      this.style.display = 'none';
      const box = this.parentElement;
      if (!box || box.querySelector(':scope>.smap-note')) return;
      const n = document.createElement('div');
      n.className = 'smap-note';
      if (box.dataset.noteStyle) n.setAttribute('style', box.dataset.noteStyle);
      n.innerHTML = `<span>${this.getAttribute('terrain') === 'on' ? 'Terrain' : 'Streets'} unavailable — showing saved positions.</span>`
        + '<span class="text-action" onclick="render()">Retry</span>';
      box.appendChild(n);
    }
    disconnectedCallback() { if (this._mo) { this._mo.disconnect(); this._mo = null; } if (this._ro) this._ro.disconnect(); if (this._map) { try { this._map.remove(); } catch (e) { } this._map = null; } }
    attributeChangedCallback(n) { if (!this._map) return; if (n === 'theme') this.filter(); else this.marks(); }
    filter() {
      const dusk = (this.getAttribute('theme') || document.documentElement.getAttribute('data-theme')) === 'dusk';
      const pane = this._map && this._map.getPane('tilePane');
      /* streets are inverted for dusk; terrain never is — an inverted hillshade
         reads as valleys where the mountains are, which is a lie about the one
         thing this surface exists to show. It is darkened and drained instead. */
      if (pane) pane.style.filter = this.getAttribute('terrain') === 'on'
        ? (dusk ? 'grayscale(.82) brightness(.58) contrast(1.1) sepia(.45)' : 'grayscale(.78) sepia(.38) brightness(1.04) contrast(.96)')
        : dusk
          ? 'grayscale(1) invert(1) brightness(.72) contrast(1.05) sepia(.35) hue-rotate(-12deg)'
          : 'grayscale(1) sepia(.28) brightness(1.04) contrast(.92)';
    }
    boot() {
      if (!window.L) { this.fell(); return; }
      const still = this.getAttribute('still') === 'on';
      const map = this._map = window.L.map(this._mapHost, {
        zoomControl: false, attributionControl: true, dragging: !still, scrollWheelZoom: false,
        doubleClickZoom: !still, touchZoom: !still, keyboard: !still, tap: false, fadeAnimation: false,
        zoomSnap: 0, zoomDelta: .5, center: [55.6867, 12.5546], zoom: 12,
      });
      const terrain = this.getAttribute('terrain') === 'on';
      window.L.tileLayer(terrain ? 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png' : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: terrain ? '© OpenStreetMap contributors, SRTM · © OpenTopoMap (CC-BY-SA)' : '© OpenStreetMap contributors',
        maxZoom: terrain ? 17 : 19, subdomains: terrain ? 'abc' : 'a',
      }).addTo(map);
      this.filter();
      // Leaflet's own prefix is a flag emoji and a link to itself; the credit
      // that has to be there is the map's, and VOICE.md rules out the emoji.
      try { map.attributionControl.setPrefix(''); } catch (e) { }
      const at = this.querySelector('.leaflet-control-attribution');
      if (at) Object.assign(at.style, { font: '9px var(--sans)', background: 'transparent', color: 'var(--ink-3)', letterSpacing: '.02em', marginBottom: (this.getAttribute('attrib-lift') || '0') + 'px' });
      this.marks(true);
      const refit = () => { try { map.invalidateSize(); this.marks(); } catch (e) { } };
      requestAnimationFrame(refit);
      setTimeout(refit, 260);
      // the theme lives on <html data-theme>, not on this element — watch it there
      this._mo = new MutationObserver(() => this.filter());
      this._mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      if (window.ResizeObserver) {
        this._ro = new ResizeObserver(() => { clearTimeout(this._rt); this._rt = setTimeout(refit, 120); });
        this._ro.observe(this);
      }
    }
    marks(first) {
      const map = this._map; if (!map) return;
      let pins = pinsOf(this).filter(p => isFinite(p.lat) && isFinite(p.lon));
      (this._layers || []).forEach(l => map.removeLayer(l));
      const named = this.getAttribute('names') === 'on';
      this._layers = pins.map(p => {
        const been = p.score != null;
        const html = `<div style="position:relative;width:${been ? 13 : 12}px;height:${been ? 13 : 12}px;border-radius:50%;
          background:${been ? 'var(--ink)' : 'transparent'};border:${been ? '1.5px solid var(--surface-card)' : '1.5px solid var(--ink)'};
          box-shadow:0 1px 3px rgba(0,0,0,.3)">${named && p.name ? `<span style="position:absolute;left:50%;top:${been ? 15 : 14}px;transform:translateX(-50%);white-space:nowrap;
            font:600 10.5px var(--sans);letter-spacing:.04em;color:var(--ink);paint-order:stroke;
            -webkit-text-stroke:3px var(--surface-card);text-shadow:0 0 3px var(--surface-card)">${String(p.name).replace(/[<&]/g, '')}</span>` : ''}</div>`;
        const m = window.L.marker([p.lat, p.lon], {
          icon: window.L.divIcon({ html, className: '', iconSize: [been ? 14 : 12, been ? 14 : 12], iconAnchor: [been ? 7 : 6, been ? 7 : 6] }),
          keyboard: true, title: p.name || '',
        }).addTo(map);
        m.on('click', () => this.dispatchEvent(new CustomEvent('carta:pin-tap', { detail: { id: p.id }, bubbles: true, composed: true })));
        return m;
      });
      if (!pins.length) { map.setView([55.6867, 12.5546], 12); return; }
      const cap = Number(this.getAttribute('zoom') || 14.6);
      const inset = Number(this.getAttribute('inset-bottom') || 0);
      const lat = pins.reduce((a, p) => a + p.lat, 0) / pins.length, lon = pins.reduce((a, p) => a + p.lon, 0) / pins.length;
      if (pins.length === 1) { map.setView([lat, lon], cap + (this.getAttribute('zoom') ? 0 : .8), { animate: false }); if (inset) map.panBy([0, inset / 2], { animate: false }); return; }
      const size = map.getSize();
      const availW = Math.max(60, (size.x || 320) - 92), availH = Math.max(60, (size.y || 240) - 92 - inset);
      const merc = l => Math.log(Math.tan(Math.PI / 4 + (Math.max(-85, Math.min(85, l)) * Math.PI) / 360));
      const dLon = Math.max(.0008, Math.max(...pins.map(p => p.lon)) - Math.min(...pins.map(p => p.lon)));
      const dY = Math.max(.00002, merc(Math.max(...pins.map(p => p.lat))) - merc(Math.min(...pins.map(p => p.lat))));
      const zLon = Math.log2((360 / dLon) * (availW / 256));
      const zLat = Math.log2(((2 * Math.PI) / dY) * (availH / 256));
      map.setView([lat, lon], Math.max(2, Math.min(cap, Math.min(zLon, zLat))), { animate: false });
      if (inset) map.panBy([0, inset / 2], { animate: false });
    }
  }


  /* ============ <carta-atlas> — the passport drawn as a plate ============
   * A sibling to <carta-belt>, on the same LANDS outlines, the same vendored
   * equirectangular projection and the same law: a tasted country IS the mark,
   * an untasted one is a hairline invitation. It lives in this file rather than
   * in one of its own because it shares all of that — and because a sixth
   * static file means a sixth cache-busting query string to keep in step with
   * APP_VERSION, which is the v7.31.1 failure.
   *
   * What it adds is drafting, not decoration:
   *   · a graticule at 30 deg / 15 deg, so the empty ocean is ruled field
   *     rather than void — which is what made a full-bleed passport read bare;
   *   · THE BELT, stated: the band between the tropics, tinted, ruled and
   *     labelled. It is the reason the passport carries the countries it
   *     carries, and no other surface in Carta says so;
   *   · leader rules from a shape to its own name, so a label that cannot sit
   *     inside its country stays attached to it;
   *   · edge ticks at every graticule crossing, longer at the two tropics.
   *
   * Labels follow the label pattern (sans, uppercase, medium, --track-label)
   * at the --s10 floor, per the consolidation pass. <carta-belt> sets them
   * mixed-case at 11-13px; that is the older setting, left alone.
   *
   * Attributes: tasted (comma list, the keeper's own spelling), frame
   * ("tasted" | "belt"), and graticule / ticks / band / caption, each "on".
   */
  const TROPIC = 23.4363;
  const esc = s => String(s).replace(/[<&>]/g, c => ({ '<': '&lt;', '&': '&amp;', '>': '&gt;' }[c]));
  const n1 = v => (+v).toFixed(1);
  const LABEL = 'font-family:var(--sans);font-weight:500;text-transform:uppercase;letter-spacing:var(--track-label)';
  const FOOT = 'font-family:var(--sans);font-weight:500;text-transform:uppercase;letter-spacing:.14em;font-size:9px;fill:var(--ink-3)';

  /* a path context that rounds to whole pixels and drops a point landing on the
     one before it. At these sizes none of the float precision is visible, and
     without it the context tier alone is ~100 KB of path data per plate. */
  const roundCtx = () => {
    let s = '', lx = null, ly = null;
    return {
      moveTo(a, b) { lx = Math.round(a); ly = Math.round(b); s += 'M' + lx + ' ' + ly; },
      lineTo(a, b) {
        const p = Math.round(a), q = Math.round(b);
        if (p === lx && q === ly) return;
        lx = p; ly = q; s += 'L' + p + ' ' + q;
      },
      closePath() { s += 'Z'; lx = ly = null; },
      arc() { },
      toString() { return s; },
    };
  };

  /* the rest of the world, one tier back — decoded out of WORLD, in this file,
     not fetched. Built once and kept: it is the same 112 shapes on every plate.
     Because it is synchronous there is no load to subscribe to and no ordering
     trap around the paint cache; the board's version fetched it and had one. */
  let _ctx = null;
  function contextFeatures() {
    if (_ctx) return _ctx;
    const out = [];
    Object.keys(WORLD).forEach(k => {
      const rings = worldRingsRaw(k);
      if (!rings || !rings.length) return;
      const polys = rings.map(r => [r.map(p => [p.lon, p.lat])]).filter(p => p[0].length > 2);
      if (!polys.length) return;
      out.push({
        type: 'Feature', properties: { k },
        geometry: polys.length === 1
          ? { type: 'Polygon', coordinates: polys[0] }
          : { type: 'MultiPolygon', coordinates: polys },
      });
    });
    return (_ctx = out);
  }

  /* one plate costs a few hundred ms of synchronous projection, and the Atlas
     repaints on every state change while several plates may share a box. Keyed
     on everything the drawing depends on, so a box is projected once. */
  const PLATES = {};
  /* the tap, wired the same way <carta-belt> already wires it — g.mk carries
     the country's own name, and a click dispatches carta:country-tap the same
     way it always has (index.html's one listener resolves either the keeper's
     spelling or a bare LANDS key through landKey). This has to run on BOTH the
     cache-hit and cache-miss paths: host.innerHTML replaces the DOM either
     way, and a listener attached to the paint that FIRST built the cached
     string is long gone by the time a later plate reuses it. */
  function wireTaps(el, host) {
    host.querySelectorAll('g.mk').forEach(g => g.addEventListener('click', () => {
      el.dispatchEvent(new CustomEvent('carta:country-tap', { detail: { name: g.dataset.name }, bubbles: true, composed: true }));
    }));
  }

  class Atlas extends HTMLElement {
    static get observedAttributes() { return ['tasted', 'frame', 'graticule', 'ticks', 'caption', 'band']; }
    connectedCallback() {
      /* a definite height, so the SVG fills its box instead of sizing itself off
         its own viewBox — the loop that let a page zoom collapse the plate */
      this.style.display = 'block';
      this.style.height = '100%';
      keepPos(this);
      this.paint();
      if (window.ResizeObserver && !this._ro) {
        this._ro = new ResizeObserver(() => { clearTimeout(this._rt); this._rt = setTimeout(() => this.paint(), 120); });
        this._ro.observe(this);
      }
    }
    disconnectedCallback() { if (this._ro) { this._ro.disconnect(); this._ro = null; } }
    attributeChangedCallback() { this._w = null; if (this.isConnected) this.paint(); }

    paint() {
      if (!this.isConnected) return;
      /* LANDS and WORLD are declared BELOW this IIFE, so an element upgraded at
         define() time reaches them in the temporal dead zone and throws. The
         exports block at the foot of the file is the readiness signal — it runs
         last, so window.LANDS standing means the whole table layer does.
         <carta-belt> hits the same wall and only survives it by swallowing the
         throw and recovering on a later resize; this waits instead. */
      if (!window.d3 || !window.LANDS || !window.WORLD) {
        clearTimeout(this._t); this._t = setTimeout(() => this.paint(), 60); return;
      }
      const host = hostOf(this);
      const d3 = window.d3;
      /* layout pixels, never getBoundingClientRect: a rect shrinks under any
         ancestor transform, and this measurement feeds the viewBox — so a rect
         makes a height -> viewBox -> height loop that collapses the plate and
         never recovers. <carta-belt> gets this right too; keep it right. */
      const p = this.parentElement;
      const W = Math.max(300, Math.round(this.clientWidth || (p && p.clientWidth) || 393));
      const H = Math.max(180, Math.round(this.clientHeight || (p && p.clientHeight) || 480));
      const sig = this.getAttribute('tasted') || '';
      if (this._w === W && this._h === H && this._sig === sig) return;
      this._w = W; this._h = H; this._sig = sig;

      const on = (a) => (this.getAttribute(a) || 'on') !== 'off';
      const tasted = new Set(sig.split(',').map(key).filter(Boolean));
      const frameTasted = (this.getAttribute('frame') || 'tasted') === 'tasted';
      const ck = [W, H, frameTasted ? 'tasted' : 'belt', sig, this.getAttribute('graticule'),
        this.getAttribute('ticks'), this.getAttribute('band'), this.getAttribute('caption')].join('|');
      if (PLATES[ck]) { host.innerHTML = PLATES[ck]; wireTaps(this, host); return; }

      /* the belt: the growing world. BELT_SET is the growing countries alone, so
         the four the record only drinks in (LAND_OFF_BELT) fall out here without
         a second test — the passport is a record of where coffee is grown. */
      const belt = buildWorld().filter(f => BELT_SET.has(key(f.properties.name)));

      const proj = d3.geoEquirectangular();
      const target = frameTasted ? belt.filter(f => tasted.has(key(f.properties.name))) : belt;
      const coll = { type: 'FeatureCollection', features: target.length ? target : belt };
      /* where the band sits in the box. A tall plate holds the subject high,
         clear of the type laid over its lower third; a short one — a strip above
         a leaf — sits it lower, so the drawing meets the paper. */
      const tall = H > 520;
      proj.fitExtent(frameTasted && target.length
        ? (tall ? [[16, H * .22], [W - 16, H * .64]] : [[14, H * .30], [W - 14, H * .86]])
        : [[18, 26], [W - 18, H - 26]], coll);
      const path = d3.geoPath(proj);

      /* what the plate actually shows, read back off the projection */
      const inv = q => { try { return proj.invert(q); } catch (e) { return null; } };
      const tl = inv([0, 0]) || [-180, 84], br = inv([W, H]) || [180, -84];
      const lon0 = Math.max(-180, tl[0]), lon1 = Math.min(180, br[0]);
      const lat1 = Math.min(84, tl[1]), lat0 = Math.max(-84, br[1]);
      const X = (lon, lat) => proj([lon, lat])[0];
      const Y = (lon, lat) => proj([lon, lat])[1];

      /* ── the ruled field ─────────────────────────────────────────────── */
      let grat = ''; const crossX = [], crossY = [];
      const step = (lon1 - lon0) > 200 ? 30 : 15;
      for (let lon = Math.ceil(lon0 / step) * step; lon <= lon1; lon += step) {
        const x = X(lon, 0); if (!isFinite(x)) continue;
        crossX.push(x);
        grat += `<path d="M${n1(x)} 0L${n1(x)} ${H}"/>`;
      }
      for (let lat = Math.ceil(lat0 / 15) * 15; lat <= lat1; lat += 15) {
        if (lat === 0) continue;
        const y = Y(0, lat); if (!isFinite(y)) continue;
        crossY.push(y);
        grat += `<path d="M0 ${n1(y)}L${W} ${n1(y)}"/>`;
      }

      /* ── the belt: the band between the tropics ──────────────────────── */
      const yC = Y(0, TROPIC), yCap = Y(0, -TROPIC), yEq = Y(0, 0);
      let bandG = '';
      if (on('band') && isFinite(yC) && isFinite(yCap)) {
        bandG = `<rect x="0" y="${n1(yC)}" width="${W}" height="${n1(yCap - yC)}" style="fill:var(--ink);fill-opacity:.03"/>
          <path d="M0 ${n1(yEq)}L${W} ${n1(yEq)}" style="fill:none;stroke:var(--ink);stroke-opacity:.16;stroke-width:.6;stroke-dasharray:1 5"/>
          <path d="M0 ${n1(yC)}L${W} ${n1(yC)}M0 ${n1(yCap)}L${W} ${n1(yCap)}" style="fill:none;stroke:var(--ink);stroke-opacity:.3;stroke-width:.7;stroke-dasharray:4 3"/>
          <text x="${W - 14}" y="${n1(yC - 6)}" text-anchor="end" style="${LABEL};font-size:8.5px;fill:var(--ink-3)">Cancer · 23°26′ N</text>
          <text x="${W - 14}" y="${n1(yCap + 14)}" text-anchor="end" style="${LABEL};font-size:8.5px;fill:var(--ink-3)">Capricorn · 23°26′ S</text>`;
      }

      /* ── the world behind it, then the ground, then the mark ─────────── */
      const wctx = roundCtx(), wdraw = d3.geoPath(proj, wctx);
      contextFeatures().forEach(f => wdraw(f));
      const rest = `<path d="${wctx.toString()}" style="fill:var(--ink);fill-opacity:.022;stroke:var(--ink);stroke-opacity:.13;stroke-width:.5;stroke-linejoin:round;pointer-events:none"/>`;

      const items = [];
      const gctx = roundCtx(), gdraw = d3.geoPath(proj, gctx);
      belt.forEach(f => {
        if (tasted.has(key(f.properties.name))) {
          const d = path(f); if (!d) return;
          const bb = path.bounds(f), c = path.centroid(f);
          items.push({
            d, bb, cx: c[0], cy: c[1], label: f.properties.name,
            area: (bb[1][0] - bb[0][0]) * (bb[1][1] - bb[0][1]),
          });
        } else gdraw(f);
      });
      const ground = `<path d="${gctx.toString()}" style="fill:var(--ink);fill-opacity:.045;stroke:var(--ink);stroke-opacity:.22;stroke-width:.6;stroke-linejoin:round;pointer-events:none"/>`;

      /* ── the names, on the label pattern, with leaders ───────────────── */
      const size = Math.max(8.5, Math.min(10.5, W / 40));
      const wOf = s => s.length * size * .78 + 4;
      const hit = (a, b) => !(a.x1 + 3 < b.x0 || b.x1 + 3 < a.x0 || a.y1 + 3 < b.y0 || b.y1 + 3 < a.y0);
      const placed = [], marks = [];
      items.sort((a, b) => b.area - a.area).forEach(it => {
        const { d, bb, cx, cy, label } = it;
        const tw = wOf(label), cands = [];
        if (tw < (bb[1][0] - bb[0][0]) - 8 && size * 1.6 < (bb[1][1] - bb[0][1]))
          cands.push({ x: cx, y: cy + size * .35, anchor: 'middle', inside: true, x0: cx - tw / 2, x1: cx + tw / 2 });
        [0, -1.5, 1.5, -3, 3].forEach(k => {
          const y = cy + size * .35 + k * size;
          cands.push({ x: bb[1][0] + 9, y, anchor: 'start', inside: false, x0: bb[1][0] + 9, x1: bb[1][0] + 9 + tw, from: bb[1][0] });
          cands.push({ x: bb[0][0] - 9, y, anchor: 'end', inside: false, x0: bb[0][0] - 9 - tw, x1: bb[0][0] - 9, from: bb[0][0] });
        });
        let put = null;
        for (const c of cands) {
          const box = { x0: c.x0, x1: c.x1, y0: c.y - size * .85, y1: c.y + size * .3 };
          const m = size * .6;
          if (!isFinite(box.x0) || box.x0 < m || box.x1 > W - m || box.y0 < m || box.y1 > H - m) continue;
          if (placed.some(q => hit(box, q))) continue;
          put = c; placed.push(box); break;
        }
        const leader = put && !put.inside
          ? `<path d="M${n1(put.from)} ${n1(cy)}L${n1(put.anchor === 'start' ? put.x - 3 : put.x + 3)} ${n1(put.y - size * .3)}" style="fill:none;stroke:var(--ink);stroke-opacity:.4;stroke-width:.6"/>`
          : '';
        const lstyle = put && put.inside
          ? 'fill:var(--surface-card)'
          : 'fill:var(--ink);paint-order:stroke;stroke:var(--surface-card);stroke-width:3px;stroke-linejoin:round';
        marks.push(`<g class="mk" data-name="${String(label).replace(/"/g, '&quot;')}" style="cursor:pointer"><path d="${d}" style="fill:var(--ink);stroke:var(--ink);stroke-width:.8;stroke-linejoin:round"/>${leader}${put
          ? `<text x="${n1(put.x)}" y="${n1(put.y)}" text-anchor="${put.anchor}" style="${LABEL};font-size:${size.toFixed(1)}px;${lstyle}">${esc(label)}</text>` : ''}</g>`);
      });

      /* ── the drafting edge ───────────────────────────────────────────── */
      let ticks = '';
      if (on('ticks')) {
        const t = [];
        crossX.forEach(x => { t.push(`M${n1(x)} 0L${n1(x)} 6`); t.push(`M${n1(x)} ${H}L${n1(x)} ${H - 6}`); });
        crossY.forEach(y => { t.push(`M0 ${n1(y)}L6 ${n1(y)}`); t.push(`M${W} ${n1(y)}L${W - 6} ${n1(y)}`); });
        [yC, yCap].forEach(y => { if (isFinite(y)) { t.push(`M0 ${n1(y)}L10 ${n1(y)}`); t.push(`M${W} ${n1(y)}L${W - 10} ${n1(y)}`); } });
        ticks = `<path d="${t.join('')}" style="fill:none;stroke:var(--ink);stroke-opacity:.28;stroke-width:.7"/>`;
      }
      const caption = (this.getAttribute('caption') || 'on') !== 'off'
        ? `<text x="14" y="${H - 12}" style="${FOOT}">Natural Earth 1:110m · equirectangular</text>` : '';

      host.innerHTML = PLATES[ck] = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" style="display:block;width:100%;height:100%">
        ${on('graticule') ? `<g style="fill:none;stroke:var(--ink);stroke-opacity:.07;stroke-width:.5">${grat}</g>` : ''}
        ${rest}${bandG}${ground}${marks.join('')}${ticks}${caption}
      </svg>`;
      wireTaps(this, host);
    }
  }

/* ============================================================================
   <carta-city> — the city, drawn (Phase 29 · #146, folded in here).

   The surface an ask lands on. The fourth element in this file, beside the
   CITY_ARCS table it reads, on the same law: real geometry, no freehand. The coastline is CITY_ARCS out of
   carta-map.js — the same 0.005° table the seal already reads, in the file, no
   tile and nothing to be offline from. Everything else on the plate is drafting
   rather than decoration:

     · the reach — 1/3/8 km rings off the ask's own anchor, so "on foot" and
       "worth driving for" are a distance on the page rather than a chip;
     · a kilometre grid, so the ground between two cafés is measured, not empty;
     · the quarters, only where a caller hands over coordinates it actually
       has — a finding's own confirmed neighbourhood is a name, and a name
       belongs to the row rather than to invented ground;
     · numbered marks, keyed to the rows underneath. A café the record has
       stood in is filled; one the ask only found is hollow. What cannot be
       placed is listed and never plotted — the ask's own rule.

   Attributes
     at      "lat,lon" | "mean" the point the reach is measured from. "mean" is
                                the default: the mean of `marks`, computed here
                                rather than passed in, so a caller cannot slip a
                                guess in by omission. No point and no marks means
                                no anchor, and then the reach does not draw.
     at-label text              what the cross is, drawn beside it
     center  "lat,lon"          the frame's own centre (default: the anchor)
     span    km across the box  (default 26)
     coast   city key into CITY_ARCS / CITY_RINGS  (default: none)
     marks   JSON [{n,name,lat,lon,been}]
     places  JSON [{name,lat,lon}] — real coordinates only; omit and none draw
     rings   "1,3,8" km, or "off"
     grid    "on"|"off"     scale "on"|"off"     names "on"|"off" (mark names)
     mode    "plate" | "seal"
   Taps leave as carta:pin-tap {id}, the same event the rest of the layer sends.
   ========================================================================== */
  const CITY_LABEL = 'font-family:var(--sans);font-weight:500;text-transform:uppercase;letter-spacing:.16em';
  const cesc = s => String(s == null ? '' : s).replace(/[<&>]/g, c => ({ '<': '&lt;', '&': '&amp;', '>': '&gt;' }[c]));

  /* no quarter table. The 13 Los Angeles neighbourhoods that used to live here
     were coordinates nobody on the record had written — invented data, in a file
     whose whole law is real geometry. A quarter is a finding's own confirmed
     neighbourhood, so it belongs to the row and the finding's eyebrow, where it
     is already said twice. `places` stays for a caller that has real
     coordinates to hand; given none, the plate draws none.
     The city key comes from cityKey() — the app's own normaliser, ‘okina and
     diacritics and all — rather than a lowercase-and-trim that keys Līhu‘e
     as something CITY_ARCS has never heard of. */

  const num = (v, d) => { const n = parseFloat(v); return isFinite(n) ? n : d; };
  const json = (s, d) => { try { const v = JSON.parse(s); return v || d; } catch (e) { return d; } };

  let _uid = 0;

  class City extends HTMLElement {
    static get observedAttributes() {
      return ['at', 'at-label', 'center', 'span', 'coast', 'marks', 'places', 'rings', 'grid', 'scale', 'names', 'mode', 'reserve-top', 'reserve-bottom'];
    }
    connectedCallback() {
      this.style.display = 'block';
      this.style.height = '100%';
      keepPos(this);
      this.paint();
      if (window.ResizeObserver && !this._ro) {
        this._ro = new ResizeObserver(() => { clearTimeout(this._rt); this._rt = setTimeout(() => this.paint(true), 120); });
        this._ro.observe(this);
      }
    }
    disconnectedCallback() { if (this._ro) { this._ro.disconnect(); this._ro = null; } }
    attributeChangedCallback() { if (this.isConnected) this.paint(true); }

    paint(force) {
      if (!this.isConnected) return;
      /* the coast table lives in carta-map.js, which is loaded as its own
         script; wait for it rather than drawing a city with no shore. The
         rest of the plate does not depend on it, so a table that never
         arrives still leaves a ruled field with the marks standing on it. */
      if ((!window.cityArcsRaw || !window.plateGround) && !this._waited) {
        clearTimeout(this._t);
        this._t = setTimeout(() => { this._tries = (this._tries || 0) + 1; if (this._tries > 40) this._waited = true; this.paint(true); }, 60);
        return;
      }
      const p = this.parentElement;
      const W = Math.max(80, Math.round(this.clientWidth || (p && p.clientWidth) || 480));
      const H = Math.max(60, Math.round(this.clientHeight || (p && p.clientHeight) || 416));
      const sig = [W, H].concat(City.observedAttributes.map(a => this.getAttribute(a) || '')).join('|');
      if (!force && this._sig === sig) return;
      this._sig = sig;

      const seal = (this.getAttribute('mode') || 'plate') === 'seal';
      const span = num(this.getAttribute('span'), seal ? 34 : 26);
      const marks = json(this.getAttribute('marks'), []).filter(m => isFinite(m.lat) && isFinite(m.lon));

      /* ── the anchor ─────────────────────────────────────────────────────
         Every kilometre a caller prints beside this plate is counted from
         here, so where `here` comes from is the whole honesty of the figure.
         `at="mean"` — the default — is the mean of the marks: an anchor made
         of nothing but the answer's own confirmed findings, which can be
         stated without claiming to know where the reader is standing. It is
         computed HERE rather than passed in, so a caller cannot substitute a
         guess by omitting the attribute; and there is no coordinate default,
         because the one this file used to carry (downtown Los Angeles) was
         exactly such a guess, invented and then measured from.
         No point and no marks: no anchor. The reach then has no centre and
         does not draw — the grid, the scale and the marks still do. */
      const atAttr = (this.getAttribute('at') || 'mean').trim();
      let at = null;
      if (atAttr && atAttr !== 'mean') {
        const p = atAttr.split(',').map(Number);
        if (isFinite(p[0]) && isFinite(p[1])) at = { lat: p[0], lon: p[1] };
      }
      if (!at && marks.length)
        at = { lat: marks.reduce((t, m) => t + m.lat, 0) / marks.length,
               lon: marks.reduce((t, m) => t + m.lon, 0) / marks.length };

      /* the anchor and the frame are two different things: the reach is measured
         from where the ask stands, but a plate of Los Angeles that leaves the
         coast out of frame is not a plate of Los Angeles. */
      const ctA = (this.getAttribute('center') || '').split(',').map(Number);
      const mid = isFinite(ctA[0]) && isFinite(ctA[1]) ? { lat: ctA[0], lon: ctA[1] } : at;
      if (!mid) { hostOf(this).innerHTML = ''; return; }   // nothing to project against
      const coastKey = window.cityKey ? cityKey(this.getAttribute('coast') || '') : '';
      const places = seal ? [] : (json(this.getAttribute('places'), null) || []);
      const ringsAttr = this.getAttribute('rings');
      const rings = seal || ringsAttr === 'off' ? []
        : (ringsAttr || '1,3,8').split(',').map(Number).filter(v => v > 0);
      const wantGrid = !seal && this.getAttribute('grid') !== 'off';
      const wantScale = !seal && this.getAttribute('scale') !== 'off';
      const wantNames = this.getAttribute('names') === 'on';

      /* one local equirectangular, in kilometres — the same projection the
         drawn plot uses, so a plate and a seal of the same city agree. */
      const kmLon = 111.32 * Math.cos(mid.lat * Math.PI / 180), kmLat = 111.32;
      const s = W / span;
      const X = (lon) => W / 2 + (lon - mid.lon) * kmLon * s;
      const Y = (lat) => H / 2 - (lat - mid.lat) * kmLat * s;
      /* the anchor in pixels — and where there is none, the frame's own middle,
         because the grid and the sea's landward test still need a point to key
         off. Nothing is LABELLED from it: only the reach claims a centre, and
         the reach is what stops drawing. */
      const cx = at ? X(at.lon) : W / 2, cy = at ? Y(at.lat) : H / 2;
      const inBox = (x, y, m) => x >= -(m || 0) && x <= W + (m || 0) && y >= -(m || 0) && y <= H + (m || 0);

      const uid = this._uid || (this._uid = 'cc' + (++_uid));
      const L = [];   // layers, back to front

      /* ── the sea ────────────────────────────────────────────────────────
         An open coast has no inside, so the water is closed against the box
         instead of against itself: the arc, then straight out along its own
         seaward normal. The city's anchor decides which side that is — it is
         inland by definition — so nothing here is hand-placed per city. */
      let arcPts = null;
      if (coastKey && window.cityArcsRaw) {
        /* a table that is present but still initialising must postpone the
           paint, never lose it — the retry chain above is the whole recovery. */
        let arcs = [];
        try { arcs = window.cityArcsRaw(coastKey) || []; }
        catch (e) { clearTimeout(this._t); this._t = setTimeout(() => this.paint(true), 60); return; }
        /* an arc is kept when a SEGMENT of it crosses the frame, not when a
           vertex lands inside it: a shoreline simplified to half a degree can
           run clean through a city plate without putting a single point in it,
           and the corner of coast is the whole reason the plate reads as this
           city rather than any other. */
        let best = null;
        arcs.forEach(a => {
          const pts = a.map(q => ({ x: X(q.lon), y: Y(q.lat) }));
          let cross = 0;
          for (let i = 1; i < pts.length; i++) {
            const p0 = pts[i - 1], p1 = pts[i];
            if (Math.min(p0.x, p1.x) > W + 8 || Math.max(p0.x, p1.x) < -8) continue;
            if (Math.min(p0.y, p1.y) > H + 8 || Math.max(p0.y, p1.y) < -8) continue;
            cross++;
          }
          if (cross && (!best || cross > best.cross)) best = { pts, cross };
        });
        if (best) arcPts = best.pts;
      }
      if (arcPts && arcPts.length > 1) {
        const a = arcPts[0], b = arcPts[arcPts.length - 1];
        let nx = -(b.y - a.y), ny = (b.x - a.x);
        const len = Math.hypot(nx, ny) || 1; nx /= len; ny /= len;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        if ((cx - mx) * nx + (cy - my) * ny > 0) { nx = -nx; ny = -ny; }   // away from the city
        const far = (W + H) * 2;
        const line = arcPts.map((q, i) => (i ? 'L' : 'M') + n1(q.x) + ' ' + n1(q.y)).join('');
        const water = line
          + 'L' + n1(b.x + nx * far) + ' ' + n1(b.y + ny * far)
          + 'L' + n1(a.x + nx * far) + ' ' + n1(a.y + ny * far) + 'Z';
        L.push(`<clipPath id="${uid}-box"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath>`);
        L.push(`<g clip-path="url(#${uid}-box)">
          <path d="${water}" style="fill:var(--ca-sea, var(--ink));fill-opacity:${seal ? .07 : .05};stroke:none"/>
          <path d="${line}" style="fill:none;stroke:var(--ca-coast, var(--ink));stroke-opacity:${seal ? .55 : .42};stroke-width:${seal ? 1 : 1.4};stroke-linejoin:round;stroke-linecap:round"/>
        </g>`);
        this._water = { line, nx, ny, far, a, b };
      }

      /* ── the kilometre grid ────────────────────────────────────────────── */
      if (wantGrid) {
        const step = span <= 8 ? 1 : span <= 16 ? 2 : span <= 40 ? 5 : 10;
        const d = [];
        const kx = step * kmLon / kmLat;   /* a step of ground, not of degree */
        for (let k = -Math.ceil(span / step) - 2; k <= Math.ceil(span / step) + 2; k++) {
          const x = cx + k * step * s, y = cy + k * step * s;
          if (x >= 0 && x <= W) d.push(`M${n1(x)} 0L${n1(x)} ${H}`);
          if (y >= 0 && y <= H) d.push(`M0 ${n1(y)}L${W} ${n1(y)}`);
        }
        L.push(`<path d="${d.join('')}" style="fill:none;stroke:var(--ca-grid, var(--ink));stroke-opacity:.07;stroke-width:.5"/>`);
        void kx;
      }

      /* every piece of type on the plate is registered as it lands, and the
         marks and the drafting edge are registered first — a label may be
         dropped, a mark or a scale never moves for one. */
      const placed = [];
      const hit = (a, b) => !(a.x1 + 3 < b.x0 || b.x1 + 3 < a.x0 || a.y1 + 3 < b.y0 || b.y1 + 3 < a.y0);
      const R = seal ? 3.4 : 9;
      marks.forEach(m => {
        const x = X(m.lon), y = Y(m.lat);
        placed.push({ x0: x - R - 2, x1: x + R + 2, y0: y - R - 2, y1: y + R + 2 });
      });
      if (wantScale) {
        placed.push({ x0: 10, x1: 10 + (span <= 8 ? 1 : span <= 20 ? 2 : span <= 44 ? 5 : 10) * s + 12, y0: H - 40, y1: H });
        placed.push({ x0: W - 40, x1: W, y0: H - 40, y1: H });
      }
      /* the chrome the leaf lays over the plate — a header row, a headline. Type
         is never placed under it; a mark still stands where it stands. */
      const rTop = num(this.getAttribute('reserve-top'), 0);
      const rBot = num(this.getAttribute('reserve-bottom'), 0);
      if (rTop > 0) placed.push({ x0: -99, x1: W + 99, y0: -99, y1: rTop });
      if (rBot > 0) placed.push({ x0: -99, x1: W + 99, y0: H - rBot, y1: H + 99 });

      /* ── the reach ───────────────────────────────────────────────────────
         Only ever drawn from a real anchor: a ring with no centre to be
         measured from is a distance claim with nothing behind it. */
      if (rings.length && at) {
        const g = [];
        rings.forEach((km, i) => {
          const r = km * s;
          if (r < 24 || r > Math.hypot(W, H)) return;
          g.push(`<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" style="fill:none;stroke:var(--ca-ring, var(--ink));stroke-opacity:${(.2 - i * .03).toFixed(2)};stroke-width:.8;stroke-dasharray:3 4"/>`);
          for (const a of [-Math.PI / 4, -Math.PI * .75, Math.PI / 4, Math.PI * .75]) {
            const lx = cx + Math.cos(a) * r, ly = cy + Math.sin(a) * r;
            const tw = 30, box = { x0: lx + 5, x1: lx + 5 + tw, y0: ly - 12, y1: ly + 2 };
            if (box.x0 < 8 || box.x1 > W - 8 || box.y0 < 8 || box.y1 > H - 8) continue;
            if (placed.some(z => hit(box, z))) continue;
            placed.push(box);
            g.push(`<text x="${n1(lx + 6)}" y="${n1(ly - 3)}" style="${CITY_LABEL};font-size:8.5px;fill:var(--ca-ring-ink, var(--ink-3));paint-order:stroke;stroke:var(--ca-halo, var(--surface-card));stroke-width:3px;stroke-linejoin:round">${km} km</text>`);
            break;
          }
        });
        g.push(`<path d="M${n1(cx - 5)} ${n1(cy)}L${n1(cx + 5)} ${n1(cy)}M${n1(cx)} ${n1(cy - 5)}L${n1(cx)} ${n1(cy + 5)}" style="fill:none;stroke:var(--ca-ring, var(--ink));stroke-opacity:.45;stroke-width:1"/>`);
        /* what the cross IS, said on the plate. Every kilometre the caller
           prints beside this drawing is counted from this point, and a bare
           cross does not say so. Ring ink, ring size, and the same collision
           pass as everything else — dropped rather than stacked, because a
           label over a mark costs more than the label is worth. */
        const alRaw = (this.getAttribute('at-label') || '').trim();
        if (alRaw) {
          const fs = 8.5, tw = alRaw.length * fs * .72 + 4;
          const spots = [[cx - 10, cy + 3, 'end', cx - 10 - tw], [cx + 10, cy + 3, 'start', cx + 10],
                         [cx, cy - 12, 'middle', cx - tw / 2], [cx, cy + 18, 'middle', cx - tw / 2]];
          for (const sp of spots) {
            const box = { x0: sp[3], x1: sp[3] + tw, y0: sp[1] - fs * .9, y1: sp[1] + fs * .3 };
            if (box.x0 < 8 || box.x1 > W - 8 || box.y0 < 8 || box.y1 > H - 8) continue;
            if (placed.some(z => hit(box, z))) continue;
            placed.push(box);
            g.push(`<text x="${n1(sp[0])}" y="${n1(sp[1])}" text-anchor="${sp[2]}" style="${CITY_LABEL};font-size:${fs}px;fill:var(--ca-ring-ink, var(--ink-3));paint-order:stroke;stroke:var(--ca-halo, var(--surface-card));stroke-width:3px;stroke-linejoin:round">${cesc(alRaw)}</text>`);
            break;
          }
        }
        L.push(g.join(''));
      }

      if (places.length) {
        const size = Math.max(8.5, Math.min(10, W / 46));
        const pl = [];
        places.forEach(q => {
          const x = X(q.lon), y = Y(q.lat);
          if (!inBox(x, y, -6)) return;
          const tw = String(q.name).length * size * .74 + 4;
          const spots = [[x, y - 7, 'middle', x - tw / 2], [x + 8, y + size * .34, 'start', x + 8],
                         [x - 8, y + size * .34, 'end', x - 8 - tw], [x, y + size + 8, 'middle', x - tw / 2]];
          let put = null;
          for (const sp of spots) {
            const box = { x0: sp[3], x1: sp[3] + tw, y0: sp[1] - size * .85, y1: sp[1] + size * .3 };
            if (box.x0 < 6 || box.x1 > W - 6 || box.y0 < 6 || box.y1 > H - 6) continue;
            if (placed.some(z => hit(box, z))) continue;
            placed.push(box); put = sp; break;
          }
          if (!put) return;
          pl.push(`<path d="M${n1(x - 2.5)} ${n1(y)}L${n1(x + 2.5)} ${n1(y)}M${n1(x)} ${n1(y - 2.5)}L${n1(x)} ${n1(y + 2.5)}" style="fill:none;stroke:var(--ca-place, var(--ink-3));stroke-opacity:.5;stroke-width:.8"/>
            <text x="${n1(put[0])}" y="${n1(put[1])}" text-anchor="${put[2]}" style="${CITY_LABEL};font-size:${size.toFixed(1)}px;fill:var(--ca-place, var(--ink-3));paint-order:stroke;stroke:var(--ca-halo, var(--surface-card));stroke-width:3.2px;stroke-linejoin:round">${cesc(q.name)}</text>`);
        });
        L.push(pl.join(''));
      }

      const mk = [];
      marks.forEach(m => {
        const x = X(m.lon), y = Y(m.lat);
        if (!inBox(x, y, R + 4)) return;
        const been = m.been !== false;
        /* a mark's own name goes through the same placement the quarters do,
           and is dropped rather than stacked — the row underneath names it. */
        let label = '';
        if (wantNames && m.name) {
          const fs = 10.5, tw = String(m.name).length * fs * .56 + 4;
          const spots = [[x, y + R + 15, 'middle', x - tw / 2], [x, y - R - 8, 'middle', x - tw / 2],
                         [x + R + 9, y + 4, 'start', x + R + 9], [x - R - 9, y + 4, 'end', x - R - 9 - tw]];
          for (const sp of spots) {
            const box = { x0: sp[3], x1: sp[3] + tw, y0: sp[1] - fs * .85, y1: sp[1] + fs * .3 };
            if (box.x0 < 5 || box.x1 > W - 5 || box.y0 < 5 || box.y1 > H - 5) continue;
            if (placed.some(z => hit(box, z))) continue;
            placed.push(box);
            label = `<text x="${n1(sp[0])}" y="${n1(sp[1])}" text-anchor="${sp[2]}" style="font-family:var(--sans);font-weight:500;font-size:${fs}px;letter-spacing:.02em;fill:var(--ca-mark-ink, var(--ink));paint-order:stroke;stroke:var(--ca-halo, var(--surface-card));stroke-width:3.4px;stroke-linejoin:round">${cesc(m.name)}</text>`;
            break;
          }
        }
        /* the row number is a position in a list, not an identity: the list
           re-sorts and the tap then opens a different finding. A mark is a door
           only where the finding gave it an id — the others still draw, and
           simply are not tappable. */
        const mid = m.id != null && m.id !== '' ? String(m.id) : null;
        mk.push(`<g${mid ? ` data-id="${cesc(mid)}" style="cursor:pointer"` : ''}>
          <circle cx="${n1(x)}" cy="${n1(y)}" r="${R}" style="${been
            ? 'fill:var(--ca-dot, var(--ink));stroke:var(--ca-halo, var(--surface-card));stroke-width:1.6'
            : 'fill:var(--ca-halo, var(--surface-card));stroke:var(--ca-dot, var(--ink));stroke-width:1.5'}"/>
          ${!seal && m.n != null ? `<text x="${n1(x)}" y="${n1(y + 3.4)}" text-anchor="middle" style="font-family:var(--sans);font-weight:500;font-size:10px;letter-spacing:0;fill:${been ? 'var(--ca-halo, var(--surface-card))' : 'var(--ca-dot, var(--ink))'};pointer-events:none">${cesc(m.n)}</text>` : ''}
          ${label}</g>`);
      });
      L.push(mk.join(''));

      /* ── the drafting edge: a scale, a north, one line of provenance ───── */
      if (wantScale) {
        const nice = span <= 8 ? 1 : span <= 20 ? 2 : span <= 44 ? 5 : 10;
        const bw = nice * s, x0 = 16, y0 = H - 20;
        L.push(`<g>
          <path d="M${n1(x0)} ${n1(y0)}L${n1(x0 + bw)} ${n1(y0)}M${n1(x0)} ${n1(y0 - 4)}L${n1(x0)} ${n1(y0 + 4)}M${n1(x0 + bw)} ${n1(y0 - 4)}L${n1(x0 + bw)} ${n1(y0 + 4)}M${n1(x0 + bw / 2)} ${n1(y0 - 2.5)}L${n1(x0 + bw / 2)} ${n1(y0 + 2.5)}" style="fill:none;stroke:var(--ca-edge, var(--ink-3));stroke-opacity:.7;stroke-width:.9"/>
          <text x="${n1(x0)}" y="${n1(y0 + 15)}" style="${CITY_LABEL};font-size:8.5px;fill:var(--ca-edge, var(--ink-3))">${nice} km</text>
          <path d="M${n1(W - 22)} ${n1(H - 34)}L${n1(W - 22)} ${n1(H - 16)}M${n1(W - 22)} ${n1(H - 34)}L${n1(W - 25)} ${n1(H - 28)}M${n1(W - 22)} ${n1(H - 34)}L${n1(W - 19)} ${n1(H - 28)}" style="fill:none;stroke:var(--ca-edge, var(--ink-3));stroke-opacity:.7;stroke-width:.9"/>
          <text x="${n1(W - 22)}" y="${n1(H - 7)}" text-anchor="middle" style="${CITY_LABEL};font-size:8.5px;fill:var(--ca-edge, var(--ink-3))">N</text>
        </g>`);
      }

      const host = hostOf(this);
      host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice" style="display:block;width:100%;height:100%">${L.join('')}</svg>`;
      host.querySelectorAll('g[data-id]').forEach(g => g.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('carta:pin-tap', { detail: { id: g.dataset.id }, bubbles: true, composed: true }));
      }));
    }
  }

  if (!window.customElements.get('carta-belt')) customElements.define('carta-belt', Belt);
  if (!window.customElements.get('carta-atlas')) customElements.define('carta-atlas', Atlas);
  if (!window.customElements.get('carta-plot')) customElements.define('carta-plot', Plot);
  if (!window.customElements.get('carta-streets')) customElements.define('carta-streets', Streets);
  /* NOT defined here. The other three elements only read LANDS/WORLD, which they
     wait for; the city plate reads cityArcsRaw, whose caches are `let` further
     down this same file — reachable by hoisting but still in TDZ, so an upgrade
     that happens here throws on first paint instead of deferring. The class goes
     out, and the foot of the file (where the tables are exported) defines it. */
  window.CARTA_CITY = City;
})();

/* ============ the passport's ground — the world frame ============
 * LANDS is Natural Earth's 1:110m country outlines, simplified against each
 * country's own span and quantised to a twentieth of a degree, delta-encoded
 * (docs/ARCHITECTURE.md §6 — "port craft, not law"). LAND_TOPO is the same
 * ground read for its shape: contours at 1,000/2,000/3,000 m, cut from the
 * public-domain Terrarium elevation model, masked to each country's own
 * outline. Both are IN THE FILE — no tile, no fetch, nothing to be offline
 * from. Ported from classic verbatim; the lookup is not — classic keys the
 * data through normPlace (genFold's doubled-letter collapse, the resolver's
 * fuzzy licence); Carta 7 keys it through fold() alone, plus the same small
 * LAND_AKA alias table classic carries for a handful of common alternate
 * English names ("USA" and "united states of america" naming one shape).
 * That table is not the resolver come back — it aligns a typed country name
 * with ONE fixed, embedded geography file, nothing about a coffee record.
 *
 * Phase 29 · A — the belt reaches the countries the record DRINKS in. It was
 * the growing world alone, so a city in Copenhagen had no ground at all and
 * said so on every row. Denmark, Germany, Norway and Japan are +474 b on
 * 7,272, cut from the same Natural Earth 1:110m through the same simplifier
 * and the same varint (docs/ROADMAP.md Phase 29). They are ground for a seal,
 * not countries on the passport — LAND_OFF_BELT keeps them off it, since the
 * passport is a record of where coffee is grown and none of these grow any.
 *
 * Phase 29 · E — Alaska is its own key. It shipped as the USA entry's second
 * ring, and a ring 5° of longitude clear of the main shape is the same object
 * Svalbard was: it widens the frame to 7,479 km and leaves a Portland pin
 * adrift at 45% across. Contiguous, the frame is 5,074 km and the pin lands
 * on the coast the shape says it is on. The same bytes, split at the ';' —
 * and an Anchorage row now draws Alaska rather than a continent.
 *
 * Phase 29 · D — CITY_RINGS / CITY_ARCS below the belt: the same encoding at
 * ten times the resolution, keyed by city, read by the same decoder given a
 * divisor. A city with no key falls back to LANDS and nothing else changes. */
/* ==== pure ==== */
const LAND_A='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',LAND_I={};
for(let i=0;i<64;i++)LAND_I[LAND_A[i]]=i;
const LANDS={"alaska":'nwFk3CA3LuCLgCrBuCkB2C3BiCpCkCZVrB3BcLiBzBiBVkBlDE_D2BhJ2BrBJIZzEhBMgCqBMJKnEtCcTlBbxCd1C3BjI5B6HiDoBWa2BvCTzBa_BPEoBZOzBH9BcAWdSOWwBsB8BD8CcdacQlFN7BKhCmByEmBgBAFT0CApG6CWWmCAmD6B0GoB6CZ2QnB',
"angola":'sPzHsBK2DBUzBYhBoBIWFQiBaCCGUADNyBAInBBvBMPBvB0BKSDELAhCxCAB_D0B3BnCRhDGbUnFDXSZApBNDaW4CW0BkBsBEeBWfgCOYTgCTaCI',
"argentina":'hoC3lBhBpFyBhBDbYPBTlBzB7BT7DFIpCXN9CAEnBcLWMMTlClBN9BlCTLduClBNjBtBVZtB1BjBoB_B1EOP0BpBMBsBqBqBckESGXYOQb-BQIO-DYOLsCeaWoCdyDkB0D2B-BDgDqBSK0BiBkB0BJWbQgBuBBwCpC6DxBGRlB7B0DL-BqCU1B_EjE;51C5hCkBvBsDhBRTlBB3CQA4C',
"australia":'29EnoBtCdVlB1EDrCpB1BA_BiBAYaOEqBduDjCmESRNmBgBbhBsCOsCQeEdQayCuBmFoB4B8BCmBciBShBQINSMUSJGgB0B0B2BS0BpByBDHWwBqCwCSBUdOWE2DrBwBQSTnBlBRjC8FrDcOOmBSgFgBmC4B7EaQgBhBqB9EiD5BiBtCqBBGpBuCnCcxDZtElD_ENnCjCNvCxB3BaGU5BjB1DgBrBqC5BWEwBTbhBFqBgCDenCvCfQlBsCzDsBvGb;04F_yBYDP7CNKbbfEzByDgCR2BO',
"bangladesh":'6zDybAdNIChBJWBUHURWjBCEPNVPIFHZIFiBNeGYXKIOaQdUOcgBRUBCbmBDmBAYFThBRDLVWTGYMCU_B',
"belize":'tvDoWAGECIDOYIAAFIAAJHREFFlBHLHAHNLAEsC',
"bolivia":'92C1N0BBIM4Be0BIBnCsBjBsBHQNsBTYAYLKzBLAQtBsCBFXENWLKXRxBEVLJBOjBUrDLRhBRlCFItBCPfVczBKhBjBdDjBkDMmBTQFeTaasBRiBKOHOQUC-BKOjBgC',
"brazil":'1iClqBLWSSXc_DuCZDgFkEAgBTWTHOmCrBCPgC1CKHsCayCfkBCmBrCCNiD3E2BrBkBCoCzBH_BpB7CAC8BfXjBCpBYKQnB-BkBiBI4B0CoBkBBUgEXiCeCCQXEAY6COUjB8BN4C4BjBMD0BRKkCL2CgBIaeHSpBPvBkB5BkCa2BFCc4DPiC0CgB7CWFAbdhBMLoCFAnBgBa0DlBUXHVwBMoERwDtCgCNiB3CPhCrEhFX_FjCjFpBnBpDP3D9BhBnBPtDxFrG',
"burundi":'imB_CEPIJALnBrBPBBwBLSaBMWUB',
"cambodia":'ogEoPJwBaiB0BGkBFiBNSakBNIZDvBjCfSXpBBhBPhBGPUTqB',
"cameron":'kSiQQZAzBWjBzBAHRYXSFSrBZzBJFB7BSVShBSNGdBT_BU7FCGePcRGHSJGKoBUmBKAYYQAWPcOS0BWQgB0CiBeIWPQAMMC',
"chile":'_2C_VuBnCLlBkBjDiBFNpBpBRE_C1B9BjBzDexDVnCdZMrCXNN9DPHc9BNPYXRFbjEpBpBCrBqBLQzBmEL7CXFlBRArEgCZwEQmBqBe7BMmBkBOiCsBNWyCbMLxBZGuB-EP0CSCkC8FBuEYwBgB6HJ6Dee;51C5hCA3CkCBvBbxDWxE4CuEvBiBsBgCM',
"china":'qkD-0BBWaMjBkCkDaeoCuCNWSCoBwCiBKb8CjBafNvBOPuFpBqB7B0FDkFpBsFkBoDyBTcUagCL-EqC6CCEOjCoB7CLJQwBmCwBP4Ba6BoCAWVKyCc0EZkC5DmCLwBbQlBiFctClExCHEvCTBATZYPX9BPGV1BOnDpC_DpBsB8BTWjF3C2C_BsBc-BPGT3BLtClCsBViCpDAdZJiBhBP_BVDjDvEtDlClCXNO3DtBNpBVBBsBvDQTQIY3BWzEpBGtBVCDadLtBWMiBZIJkBpBFEwBmBgBCgCfiBhCCOSTYbPhBKxC3BjDQvBnBBgB1DE5IkELsBeDAUL0BpBwBhCQvB8BFoBjBEJmBsBkBmCEOY0BGyCuB;8oE4WhBMAiB2CeIPZnBhBT',
"colombia":'zzCyBFDTkBLNtCAAXYDBPdBAdQNIVT_DfWaoBdU5CBXqB5BwBJDlBWLFfGJSvBWFMQCGkBUCgBuBNKIWJmBKKHiBPUGUMBIMHWYGwBgBGuBYUYAEIgBBiCwBOBKLHLXHlBtBPzBUBObAnBUPqCBchBkCGOFR_BUvBTTYVMnB',
"congo":'iXsEBXTtBFjBEVHbFNrBnBRlBChB3B3BPGBMVANPZSbXfqBeWNcMKcEESUTkBAMSGaFgBRYSuBJIdDLWEQyBAgCTCUWmBYW0BJ',
"costa rica":'lnD-LPBARKDFFAFDPVIHIEIBIJKdMBMLIELHJJMLEFIAMGMLGQMaJKGMDGHMBKIKViBhB',
"cote d ivoire":'hK4MGEMFeAIMSCGPaKSHGNSHOKUCaJM5BRfJtBShBBPRAbIZBvBFhCZHACiBEEAQRSLCLKISDUCMGAEQDIEGOGJgBHQCOIC',
"cuba":'5mDgdiCDkBNQNmBEqCzBkBHBJcBePDJZFvDBaWPKZENMHWXBvBUzBGNIOKnBCbVPAFJTDPEuBkB-BQ',
"dem rep congo":'2kBzFKvCYXWxBvCHLXIRL3CoBVKGEpBdAfoBdEJWXLfENSrBEBMzCFCwBLQF4CxBAEOTAbHPhB9BBrB2C1DCrBJDMSgBYEOQWASR4B4BBiBSmByB2BkB4FkBiB8Bd6BJSaSDsBUeFUMkCAahBSDyBMuBrBDtBQFxB_BLtCLJLxBOhC',
"denmark":'0NymCxBnBKR1BBRWAqBSWiBCwBYBVLLELWF;8PwlCXfpBWFS6BMOT',
"dominican rep":'z5CyWAKJMKIEODWEIgBAYLKCINWABLSAUPPPRIfCHHNBFKNFPbJGBM',
"ecuador":'l-CFEdLZrBpBvBPXhBHbVPPUREPDAQKKDQWeJSNTXSIMHkBOGIYQaDQyBaoBXICKRgBFMGmBV',
"el salvador":'1vDgSMBUNCFSEOFHZXANEPIVCLKCGUOBEKC',
"eritrea":'ytBgSFQS8BEaMMeIUWYtBKlBWR4BlB4B7BULLJREdkBRMJOhBQbCJIXJXSLdtBI',
"ethiopia":'47BgKxD3DzBBjBbXALNbAPOjBPLR5BIxBiBbANOAWTGXsBRKbiBXEOWWCQ6CUKUwBYUYoCuBHMeYRYKKHcBiBPcZejBbjBEXgBCKFJPuB1BiEvBiBA',
"germany":'sM4kCCPoBJAN-BSuBNSNKTLJQPGhBQZbAxChBKbsBZbXChBfK_BFFJrCWHJhBAGeUarCSHgDYAKQKkBHOIIiBCGHcSJmB2BC',
"ghana":'A4NBLQTE7BKPHjBCTUlB9BXVNjBLjBMCQRiBKuBSgBP4CAWmCCSBMGSD',
"guatemala":'pzDmSCMEIFIUgB0BAAOFCDKdWSAAWqCADrCMAOHEGKDjBbDHEFHLJBCDTNBFTGZCRIVQ',
"guyana":'1mCsCfCLJfJDHTCXUBSJUGiBKOHSNGESHKVBZeKMASYGKINOEQgBWaNYZCTOBmBhBFjBXJCHHVSbMAGXYhB',
"haiti":'z5C0YEVDNJHKLAJZGTBXCRFVMEMiCHOIRSAQXGIK8BH',
"hawai":'niGkZOJKNdPFHJGCMFOIMBGCESF;_iG-ZDDLDLQECYJ;xlGkbQPBBRCFMKE;lnG4bAHDDNGIIKB;9jGwaBFVCEEUA',
"honduras":'9nD4SNAFDfLNIDAFJDAAHZTLIHLRAATFADHLBHMLEEQFEHCRDBGTOLCIMDGEIkBcGBIGoBDSCSIWDSEaFmBXKJ',
"india":'25DqjBHtBdGzBbnBrDdKHnCTJTgCRZVUyB8BjDKBczBUNbeThBdYJIlDrCHCdVX5BZxDjDARrCZR9GTBRdMNjBJdnBlBmBlC6EPqCjB4BjB2G5BXdGzBwBUOLQtBiBaa4CAjB2CZSsBqBwBDoD8DAciBWfUb-BUSoDDoBiBqBvBDfQTATdEMrB-CzBnB3BgE5B-FlBC8BaIEnBkBP8CGCYPMyD-BiBJcQUXNRsBF',
"indonesia":'szEmFXjBelBFRsBlBvBDL_BlBbPjDFOtBRPYvBQvBPNU7BCF2BlBuBFiBcgCiBxB-CemBLgBKyByDyCF;uiErBWxBwBbLvDrBAzCiClEwFZgCjE0E4CJ-D9DoBAiBb2BzBPfkBP;owFnDCjIjBgBlDDqBsBbsCrFqCZVJgBdUkCY5BAlCyBsCYgCRQtCqBXwCiCuEjB;25EkB8CUflBdHrEAFdkBjBgDgBDTRGzBlBiCpETLPOSiBvBDEObYCmBZLGnDZDRKGsCdcsB2DqBuByCP;0nE_HEPuCDISqCTQZsDdtBP5HoB1DkBcmBiDT;-_E2CenBBjBVEAxBbsCWuB',
"jamaica":'9gDkXaDWJGJbBLFVGXQGIaC',
"japan":'owFuuBPfGTTbxBTnCB3BtBbQAelCHvBTtBAoBdZjCZPTOKkBZMPcmBMWaoBUccwCMsBHoBmCcRyC2BYyBFsBQaqBIW3BAflBpBCnB;8zFm3BcHcSKtB7BJhBnB_BcVrBrBBFoBUgBsBCK2BMgBwBpBeN;qoF2qBENVXPMTHLXZMASWYYDQQeH',
"kenya":'gxB7F5BoBBY3E2CAqBuBoCViCTc0ByBUFAVONcAyBhB6BHMSkBQQNcAhBrBAxEYhBbPJPPBFdLPHZPN',
"laos":'omE4RjBORZhBOOSCiBfkBDoBdgBdCHNXALGpBXAkBKqBbCBYRMKQiBaCJWBFuBUGYdSlByBAOhBXLLNwBX6BxCebKbFnB',
"madagascar":'-9BxPUrBGvBMTDRHLNYHLIdDRJHBhB9C3IjCZ1BYb4CDeIcSIWkCPsBDmBUwBqCQ4BwBMUFSSFWcAYOSOP',
"malawi":'-oBxLoBFWdK1BJfKzBOCONSbCzBPHLbZYDcIUBQPKJDXUTKMkBMOHiBIgBIKJiBTS',
"malaysia":'szEmFxCGxBxDfJlBMpBXzBFZYHaeNeIIiBiCQwB6BSVIOUBEuB0B6BQCUVCP8BXDPZBGRbN;k9DiIGIiBRCTaEOQgBbSZExCOLQvBdBzC8BvBmDEeHQ',
"mexico":'tyE2oBiDG0E1B0FQmDjDiBLYgBiBC2C5CUvBqCTbnEuCvE6Bb6DeaQSkCiEWIbdvBJ3BZKNX1CDAVRAoBvBzBAT7BhC4BfKpCV1IqDvCiCJUUmBf2B_DyDBiBrBcJc_BsBjB4ChCaFPMxB6DrEmB9CyBlBRV9CuCDyBtDkCUCQgB1BoBhC4D',
"mozambique":'mrBrOeCwBJmBGQMiCOgBYUvFb3BZXxCjBnD3CDbchCGCDvChDxBRPEPKBBVfALyBIuBd0CqBuBQgBIwEjCiBfBFsB4DiBYTKEQJB_BaXMcQIB0BRcNONBJ0BKgB',
"myanmar":'k9DwZtBZbBRpBPH8B5CNjBNHkBxBUtCpBtCDeMeLYCqBPWTiDRiBnCxBtBOOyBJkBduBEQVEdgBBiBOHAeUKIoCeJqB2CBW0BceFDYOIBOWEgBhBB_BlBfDvBqBGKjBaHLhBuBVeMCPrBpB',
"nepal":'kuD8iBBREZDPfAvCOVU3BE_D6BQmBqBagBLoBZWFOReHgBR8CL',
"nicaragua":'xoD2NJHLCFILEJFZKFDhBcHOjBeEGGFQGEIGAAUSAIMMHaUAIEAGKEAGFIBIGKAOGGEOAFLEPHNDPBPEdHDBPCJHLCJGF',
"nigeria":'sD6HA6CIagBkBDMIQJYGwBQoBKIsBEoBNOPWASKwBTUAYSkBE0BNgBWIBcrBICQPHVhBdfzCVPRzBbNVQPAXXJAdjCnCTfAVaLcbahCA',
"norway":'mjBg5C-DdzBJsBZjCPfDQcxBQ9BLTdlBRrBKzBBrBUXJXBFZrCGJVnBAhCnC9B3BONNPlBAZjBC1BaTNvBhBZPXbYtCtB1BH3BUNqBL8CkBaqDiBwCqBoC4BgDsCyFwC4CSgCB-BiBoCBoCI',
"panama":'1gD6KDFIVHLLCFTLMJWKKJEFMTMRBHNPJJBDHUVPLTBFYFFLCHQbIPABJDIEQAGGGJEASQCONAHQBEEKJUCSKYIOMWBBDWBSFcX',
"papua new guinea":'owFnDwExByBpBGViCZKTlBDKbkBZapBWCBRgBHLFqBRDLZBJKrCK1BwBTkBzBQ5BXEddN_BKBkI;k9FpHpBRVA3BWEM6BBMUEVWEiBcDYYAIFBVLZVBFL',
"paraguay":'1oCnZMVD1BqBHSIaJILIzBOBQGOFAVTxCjBffFzCSmB8BFSnBQxBcfGpCiCQwBCWSiBmCMmBAkBTCN',
"peru":'r3CrFjBCzCnBLhBEVXJARLFoB9BJPcBOVkBBgBYB7BoBCkB_BLrCPTINJNShBjB_BTJpBYBQ1FsDPiBGKrE-H7BqBMSRmBMcgBaEPJJAPiBAQTWQgB-BwBQsBqBMaDeKE6BvBYpB6CCeTZnBgBV',
"philipines":'-4E4WHPObJhBXLFhBKdmBAyBVDVOJDRfUNULNXYjBFTICQMMLIFNZoBAmBQLE-BMkBYAaLMMEL;g-EwKGvBNlBNqBTTOdLRvBWJeMSZULRRCdVHMQiBwBaOReKGScCBegBRIjB;88EmPMrBfKMlBTHBcLCFYYDAQZeoBAKP;o5EwMKKEaWCFbeoBDlBnBzBXcIM',
"puerto rico":'7yCkXWBGHJJ1BBBQGGgBA',"rwanda":'gmBtBQVBXLDTCLVZCEWGECYMKIDYM',
"south sudan":'ymBsEjBaJSxBLREfuBdQJYrBmBAOvBeaMU2BeGchBKDOIeBEHoBACIUIEMQIiBXUEqB0BDYJKYCEKSBDdEdUNEhBGBAdDLVBNVYDWRGPSJYrBrCjCbAfJZKPL',
"sri lanka":'omDsJFnBRLhBJTgBF6BSgCcVSbUpB',
"suriname":'jkC8CXIRDPEDLGHDHVEXiBFYLARcIWBIYKGkBwBHEIgBEsBLVhBEbQXJhBJR',
"tanzania":'sqBlB4E1CCX6BnBRvBCXaNAJJXAfe_BOHfXpBPXCPLlBFvBKdBJ2BVenBGvCkBVyBXYHWEWFkBQCoBsBLmBMECYPWOG-DC',
"thailand":'wjE6RjBGzBFZhBKvBjBShBAGejBADrBhB9CCbaBYlCWXYDWVNPZDBUhBSFH_BuCFXHWQgCqBuCPkBDqBjByBOIOkB7B6CQISqBcCuBaSLCXcBJtCqBYkBFIOeBefEnBgBjBBhBNR',
"timor leste":'m8EjLGKiBIcCMGQFPJpCdBMDI',"togo":'kB4NFVcXATIHB7CKbfHTmBBUIkBJQD8BPUCMkBA',
"trinidad and tobago":'jtCuNYGIBBdfDHEMKBQ',
"uganda":'sqBlB9DBlBRHEAeIQEgBISOWQKMOPGEuBQMaJgBKcAYSUbWhCPbdrBApB',
"united states of america":'x5Eo9B0iBAOQSdsDTiEGsE3B-C9BQnClB5BQP2EuBHYSIsCAuC2BmEAiBS4BwC6BPA1BiBjB9DrBb1BiBb1EbmCAvCHlBnCZWUrBjBvBKeZwBApBZGcNW9CjExC7CxCC3ByB9DNjCdAVatByCIapB4B3BLzBe_DJInB5Ea5BLhDhCAvCPA5BUtC6D9BOXfhBMlDkDzFPzE2BhDF1B8BzCW3EkHFiDauDfsDgCFUlBJsC',
"venezuela":'9rCwGGLNNpCVLJjCMSJEzBiBDCHdLDPtBPHLfDVWLoBXWUUTwBCcQkBNGjCFbiBpCCTQAoBNcTCQ0BmBuBYIAJXFORBTPXOfSEIcLOBeyBSFSOMObcAaVCNuCEYReDWMCKgDChBLORgBDeRIfUAQJfVDPONhBNARJLad',
"vietnam":'uiEkNiBQqBCRYkCgBEwBHaGoBJcdc5ByCvBYMOYMNiBxBApBkCWKoCEiBWSNmBHHXUPoBJ1BhBflBJbkC9CkBXafSpCFnCvCzBxClCNaMadY',
"yemen":'ghC4XsB9CbJJfnDjBhBbdAXPjCLZX7BBLWCWZ6BICAsBQMDSMUQL4BG-BFKNSGeqBkBS0DQ',
"zambia":'umBtKwCjBURKhBPpBIhBLNLjBUJ3DhBCbdFVPDNPB3B7BnCIVQZChBHzB4BCgEyCADuCOACLsBDORgBDYMKVeDgBnBeADqBJFnBWM4CHSMYKG2BGQD',
"zimbabwe":'gnB5bVENDRGPAZSfGJaBOPEtBsBjB-BoCH4B8BQCEOWQeGEPgBCUHIJUDULAzBHZBdGLDXFDJbpBtB'};
const LAND_AKA={"burma":"myanmar","cameroon":"cameron","hawaii":"hawai","congo kinshasa":"dem rep congo","democratic republic of the congo":"dem rep congo","dominican republic":"dominican rep","dr congo":"dem rep congo","drc":"dem rep congo","east timor":"timor leste","ivory coast":"cote d ivoire","png":"papua new guinea","united states":"united states of america","us":"united states of america","usa":"united states of america"};
const LAND_TOPO={"angola":"mX7JBFFAGLBFFDEFHBDLCAICADGBENBDONJDHBBGTMHHJCPUAMDCFFJIBMHEFIKKJGLWFAFGEGBIFCBFBADOHCELJHINAPGNCPEFDNeBFABDDCJHIFJAAFOAADPABLJODADJDACFHFDNFECFDDEJFBCFDFAFCDIAGLFADIHCHPAJEDJDEDUAHFELGFLBCFEABDNGEEHIMpBDFDELFBFDCDJHFBPSNCJNBHLHDMDIFDBJIBHCDMBEGELSBADDBEBCDKBBD,2btMFGJOAcDJCFBABGBAAJDAESBGFCBPBIBCBdDCAUDCBFBEDBCHBDDMCIDBDPDEBNDGBUGAACFWBDDCFSDGDBDIBBFIDB,uc_VAGHGEGBGID,oZ_KFMEEELBD;;",
"bolivia":"9vCtbCGEDEKCFCSBFFDAOHFDEAKFGAKEACFIGGHECCFECCFAMGMBCFBCGDOGGGBCGDSBADDDGBBADGDAHLKAMBCDDAGEBCKEABIEBEECGHaDABDBEHGNGJBLKBHFKLAHICEHEAETUFCFOFCJMDAAFOLGJTQDBCHFIEERKDDGDAFHGFANOCGBCAECBMPAGKDLYGAJKECBGJIDBCGBCHCAELE,3wCjcCKGBCDGGDGIKBFEB;9wC9bCKCCCDGUIGBMLCAGFCCEIFECBKEGJCDDEYELIBCUBEGGDEGAAEFEEGDCDOBCDHFMFDBIHHFABICCIFEKKBCFECEBCCHOFAHFBKDAIAAGGBCCOACEFELBCGFEHALEHGACJCDIDBAIFGFHAOHDAGDDFGBNDSNACJFEBIECDCLCCDKBBFEDCDHGHCAGFCAGFANUDCAGFBCGFECEJSDCIIFC,nwCvXEAEIGACINBBN,_wCnbEQGFBFHD,l1CvSBMFGBFKL;lxCzbCSCGBIEELGCHHPBSASFAHHDIGCFQGACFIIDNGBGECLGCBDGDAGEGDOIIAGDGBGDDAIDIBAFJBKFIEMHKJACGDAJOGDEEGBFGJEHIBBAGJGEAIIMBBFIAAFDBJEABULGCCKGEEFIAIACELADGFBFIDBBGJAHGAGHANMBHDBGHADFEBGDABDGFDDTYHFBJFGAEIEAEECJGBEJIDOJCCEDGJFCHLKAEMACGHCBEGCDKFCBK,3wC7YECFWJMDFGFCAIX,7zChVMEBKJAGFFH",
"brazil":"73BrbmBADMOUJQPDKMMFIIHaPHDPRLFKFHCLWCMHRFIHHHFMRJBFOF,77BjUEKQIFgBGgBMINCLJITZLSBEFDLGFZADFBHUJ,7-BniBCcJIXGHDRSALNGBDKZMDUIGBANMKOR,1zBlRGaFMFKHDDUHABMNAKXCnBEDMEOL,75BzcGFgBKMOFWLCEVLDLBFMFBJPKH,v2BhYGCFOSYFGFJLiBJjBEHGCDLKP,v-BrkBCMagBBIFDTGTJGRJHSDGN,1_BzgBEONaVIHHSNLLIJQKBFMH,p6BtZccASHKJPCFJFbGDFENaN,j6B1bUAGKLKPCCKNPOP;;",
"burundi":"2kB5EGDCHEBAJ;6kBzDENFPEBEACGDa;",
"cambodia":"4hE4OCCPIEFIACD;;",
"china":"mkEkdIINGKORDHORIaDKKfGIIiBBPgBIGUbIEEaGLGIIJSaKmBPEFLFKTBFMTIAcRRNMALhBCBULGGGHKDJJEGKLGIGTUAMWgBiCuBOaMBORmBEGJGMGNIKGNsBhBUKSLWCKOILKERYfBlBWFHXKNStBBRKgBOmBDmBRFWUVgBUASMJaIaLWIpBQLHHGUUTJlBGZR_COOOSHoBINGmBGIcYNQMFmBJMQORMKKMTFkBMUMACgBIHXxBQFBTRZULRFGTOAY6BsBiBDHQHxBlBIZLfaAHIEgBGTODGIMRQIAgBVPLKSGOSOAGUZUKMPGYIGYoBGGSSABIKGZCdY4BJGMWECUUDBKQMGLMOafAMQUdMOMCUjBGSGFOGGHGSGMJUegBUFMfHNLFGZLFIFLfSCThBVDQMGXAWmBAINBCI,klEuiBgBaGJUMGQFHBMLECPNDAQMKUDLUmBcSLEWQMIFNXGLMMaBAKODLOIGHOnBEzBTJVVJGJLAANRDHXLQLDDNOHCV,ktDswBTCFUlFmBhBQFaiBOMHcM4CImEvB6BMgBQsBAfnB6BKcNPJxBA5F1B,-0Es6BTbOBGMaJSiBUGSwBOPHaQAHITAZbJGBHVJSNNF,qkEk0BFRLItBNRKzCALPfYhBAFOIOTALKmBHII,qvDk0BhBU2BFdSfIBM6EMmCL0BZ5BTtBAlBQhBBjBXTE,i4D61BdE5BkBrCatCflCIZPrFgBZHtBYiBKJK,urDy8BwBJGLgBB6BhBclBbCCVRFCLsDF,-nD26BsBBLPGLwDaJOhBK,8rE62B0CK3CdLTVFYgB,wkDq3BUC6Bd0BBtBFlCM,inD84BiBNkBKSUVK3BB;u6DufCJISSJGsBOrBOGHMMFIIMLaECLPHIDSEGOILGSGNUMAPSIOHBMOCGJUEMKKULGaSAUXESIRKZZLAWYJORbHOQMGUTiBHNFOTECaGXiBEVKFFCWeaGWGDWUHGQMFOcGVUaGTMcAJUOSZIHMMKGPUiBNHLMJFMMHOPHCNfMLPBSNI0BMLaGG1BMTUHWlBSJHcLlBDXaTB_CiB_BFlBN_EJ_BNzDzB_FzBRO_EqBGMHMrBYNW0CkB0BDPGyBMBOVAcagBFgDcgBJ6CDIENMaKmBJkBGTUQGBG3FsBlBHzBYAM,k_D6fPKQUZGGUIHEIDISJIIFaMeGXFLKHRlBOKGJfjB,4sDk9BHPaISPDHsBNGKUbyBb,41D01BgBEzBkBTAIL7BIOPgCHOL,w4DqzBUIPgBvBFWHJLgBN,skDw3ByBBMLgCJiBThFZ,-kE0rBAkBzBqBGXcLSpB,qvDk2B0CIzDUNHuBT;m7D2iBEKUXMUQdRFIPSWIBEQJMMGIVmBOHWOLEMJGGIMFIYHYEUKFMaQAKYHOWAFGOGMgBAmBpBOkBGTMBcREHJFaRAHJLYFJTIZLAQVI2CBUHAGzBQQMHISGANULIAHWSNGEXeZGGMRD9BUEK_CmBTEFPZQLHNIXP5BCxBRMJGMmBHYMIRjBAsBZATsCbGWaBUJfHeLBTvEGhCiBRYLBBKZSOQaDEOJG_BA5BTFINFIHzCVPP7BXtEhBZEFQLLNMRBAIfK_BChBoBUI5C8B,kqDi1BmBCUUITKIOFMGTGUMpFuBANwBHLJYHDHMGePnBAKP,sjDs0BSJgBGsCcmBLgBGtBUWO5BJJDQFTFLK5BJ,88C8xBiBD-CgBDISJBIQAFG2BkB",
"colombia":"v7C8LHLAHDBEPDABFGFEREFEXBDDGNXAJJDHRJFDCBFBFEDAFBBBEDABNCDGBDLEBVhBEFDDDLJLHFBJHDAGGEAKKYAMHBCGCABCCGGEEMEEAGGGCgBDKBACACGDGIIAKGKBIDIFABIRBEEBGFAFELHLGGTDFClBEJIJLHEJLRCFLRBLFBBJGBADFABDCBBPDBDGNTGFANHCFLLBDH,zgDQWWIQCACDFBEFSKEKICKIGHKSECCMIKEFECCSDGQGMMEUOMGOKIGBGMGCMOIQBCMSBKLICG,x6C0JLCEMHBAIFIBDDIFDAMGBCCBIADFBBICG,l8C6MOICKIGBKbBBGFDIZIBBF,78CoJECAGDCEGCSFBDRAJED,zgDgCCOMOEALZFB,1_C8DIeEFARDFHA,z7CiIAIGGAGCHHL,p_C8EAKOgBDZJP;x6CsJDCBDJEAOFIFHFECHIFCXIPEBGFBJDKFAFDDLNDFFHCGGAEFADDBVHFFNFDGJDFEFNXARGICDEEGACIIBBKGQGAAGEBGIAGDAEAEIHEIGCHGEAKGBQGBIEAGGAGGEBGMIEGDIHEHACMFAAGCECFGA,3gDQGOICMMCQIEKHIGHKFCIIKCDCEKDEEGCBKECKCCAEFABGBAAGSiBAGKEAIBSCIFEEIBKEKACFAEKNFBFDCQSFQFBJHGLCTGDBFGBADDDAFJrBDDDCJNAXDNFCDRPTEFNNEDNBDHDKEGFCAJJFBF,3-C0GGIFKDHFMEIAeGWDFNDIBELLDGNFDCLCBCJML,h8CmNGBAEKOACDADDBEJBHCAFEJIB,t-CsCaaDGMEBQPTBFJJFLCD,zgDuCKOBEFHBKFFGN,lgDiDGKAMDBBT,__C6DGKBIFHCJ,j_CgGGSFADHEJ;5_CoCGCAGGEIMAQIACBIEHGCEDGECBGGGCKECAIEGBIFLJHADFBADEDDFBRHTPTABEF,n7C2GKECIIKEKOICGBGFBBGHCFMFACGHIAPSXDFCFJJFPFEHFKD,j9CsEIIEDAGKKAEHCGEBIFAFVDBFLEB,9gDcGCEGGBEQHFDEAFFLBA,r-CyFGGGBCOFKEKFABPFJCL,hgDyBGQFADFAJEA,18CmGKICIBCDDFN,t7CoHQIAKDAJJBH,h8CoNCAKOVBABKJ",
"costa rica":"3nD2LFIFAGIBEFBADDGJDBEEIBCJADGLCHDFGFAQPEGIDCBFDEJGBIHGCKFIBOP,3nD-KEBACJEGD;3nD0LPEAIVECFMBEFEBGCKJ,7oDsMGCAEFBAD;",
"dem rep congo":"imBtKAKHMFYFEJCBGHIDONULDELJCDBALIFBDGFHRJFEHOBCJGBBDDDBGJAAGDAHHFCDDDGCSDJHEBACDJDAFFFHBADBCDDDVEBDFFIPJBHbTBJDBBKLGFPDACGFIHCCILDCGkBWGKBEQKFGIEbSCGFOFAERDFFABDBGBJFDDIBDCFFDANEBHDDHECEHFBDHBUEIBGCKGEHMFBDVFICGDADBEDBDDBDCDFASDNFCBZKLIBFDOCOHANDBBIDABNHACFBBHGBHHIEGBEGCHINyBBHBCBSDABHCPFA,imB6EBHHHGFLVFEIEFGDHJAFFDNHBADGFFLEAEGEACNEEOHHLCBHADDAFHRLBHIDBCHHFGHHBDHEHHABBEDFBAFEBBDGBJHCDAFEHFBAJDIJCDBNCDDEFBDGFKGIBBDGHBDGNFBBHRHAFcQCDBHJJANDGFBGFEBCGOJYjBDDAVHEDIDKBAGJDHGFWBAGGBEEHOAYJSAEEACCEQ,iiBpNAIBBJEHIFABICIOOAGCDOKAVGHDFGVDDHC,iYnJBGDBJKDDHKBADDFKFBADGLDAADKHGPAD,klBXHFBHFMCIKQDMCSYSIOQK,0jBlNDIJBCGAKDEEOBICKOM,wgBjJCGBOHADCBBGLECCDCF,qlBYFFAHDEANGB;glBxBFBDFHGFBDFDBBTFFBNICCMMgBGHEC,okB7DHOBALPIHCJDHIFDFCLEWGCEK,qlBzJICCGFMDACDFJEF,ukBTMOAGDAJJAFCD;",
"dominican rep":"p4CmXECEGBEAIJAJIRBAFWHCHID,x5C2WGDECBEJE,55CqXWBBGHBFE;74C4XGBCELCED;",
"ecuador":"5hDqBADHACFDCFDCDBDFCFHCFEBDBANJJEHDPCBDHCFDBEBBLGNFJNLAHFJIDHDDLKCCDRFDFADKCFFGF,vhD_DFEBFBQDABIGAGQAHDPEDGKAMIBAOBEHABUGGDCGSEEIABFECBGIUHQKG;xhDmBADHAMTHCAGDGJDFHHAABIBICBFEDHBHHBLHACHD1BCBEEBLCATRCFHLGDMCDFEDDBHGJDCDIDAJGAAHGDDHDKDAEFDL,hjDhGCKGGGDBIKKFCDFBCCcCACFCACIECBEGCEOBMGBGOCYBIDCKEAIDCGMCBEGMEBMDBDFBCEOEBCCDGCIEACEEA;vhDiBDDCFGDIGBDFLFEBDDAABFBCFGCCBFBFNHBEQFBANHFADDCAXDFEFCXEDHFCBRLCFHJCBQECKGGKAAIIAEEDEIODIECACHKFPBEBEIGFICGBEAKEAETIBEGBEEEAKGGDEGCBGGEBEEEBGEGAEGCBI,9iD1EOaGBGULRFDDEDFGAFT,hiDIIEAMFADDEFBF,ljD9FCKGCFCDJ,njDzEECDIFAGJ",
"el salvador":"pwDoRKACCFEHDCB;;",
"eritrea":"svB6VBHEDADGGCIERJJKHBFJKCLHIBDEFDFIFAJKCKHBBEDDJHBHEDDFELJQEED,2xBmSBQPQDBHIFSJEEIFOCGAKLMDS,ouBgSEKGCHKDDCFDHED,qvBwSJBFFFAEDMA;wxBmSBIJODBHCDSHICJDBATGBBGCCQFGHBF;",
"ethiopia":"qyBiFGKAQNATHJGHBAIDMGIALGECFGCCJEBMCOKCDGAADGCIDEIDCBEIIDGHBHHNEACOECIICDETCGEFGAKIIAPKHIADGCIBGEACHGECDAQICKBACGGJAFIGGCMICBMGFEACGBIMICPGEKCCKGJIBEFCAANSDEDCCDEBEFEJWIAIFGCWJGMDIMCQM,yuB6RBLFEDDGFBFGHFAABGHBAHHRCGHIBLDIHBBCBLJJKFFAFGDGEEDCDBJHDBOBNJBBHCDKBDJHFCIDEFJBCFBAHDBCDEAEDCJIBGICFEAPFKDALFKFFBCBIDACDFALSHFCELKFKDDBPEDBFCFDDBCAFHA,msB8GBSGECFIECMGCGSGBCEIACDLBAHCBOIGKCHNNCJFJGFAHFNIDCNMUBGDDBEOYADGFDFENFJBV,yqB6LMJADJDIAIHBNWJDDBLMNAHGHDAAJLIBDILKGCJGFHDBCFBADDB,q1B-MDDAJLBJJNCHFfFNRHDJGOuBDcCQHKDWAMIKAaDECEDKAQDM,gvB4REBICFHGFFBAJFCDIDCCIDG,suBsFEMIHGIILBFICaX,kvBoGFGHAICGQCBBV,o0ByHCAAEDAFMAHIH,uxBqEDOIKFMKAQN,k3BsJKABGJABBED;kxBmSBHDABDFCDDIHKGCDDJJFEDKBBECCCBBFCBLAEHIAFHCDDHCLLOBFNHCDIAHFMDCFBFFIHDBGHBCENMHBDIECGOQBIOFODALLJBBHRPAFICKPMBHFBBGDBBFAHBQPECEDCCKDAGECDGGACGGDCFMBFBHCBBEFHBCBATDBCDMIAFCCEBCCAFDFKAEJHCFHHBJIFADCFBCHMDGHABDABELEBHFCFDEDBDHDDGHCEGBKBDJQFEJDIBCHDFGNSNHHaDEFBFJJDVFFCBQDEKFCOKGQEEEACSQGIHEODICCGFCCGGAIECEkBHUIOBEDBFGEMFEEEFIGaGKFGGKCQBMAEFECE,8vBiHMMGDBEIAAIHICGCAGLEOCAEDBHEBCKICCIMDIKOBAKKGFInBAGEDKQJIEAIFCDIGCBGMSNJLDLHJBADHHBNJJAHDDFVHLAHGH,ysBkJGEBEMEQBEDKDSCECAGHBFDPGGESGEGAQDCDPNLJCBGFCMIFGVDJLCFBDFBHKAJDBIDDDOD,kvBwMIACEQGAKBADKICBIREHBCENMJAFHDECMHDCDDHCDJPOBAFEASIAECFHTSAAH,kzBiLIMEDQGCFEEEFBQVBXPKD,ytB8KGBCEFCCKMABGPFCN,yuBsHIGBCKGBIHDJLEF,q0B2LWACGIBHGBDRBDD,wtB2IMGJKHBCHEAAF,mvB8LKACIFBFEBACJ,4uB0JEAAGBKDLCD,ovB6GEEAOFBCP,6tBqHGIBGHFEH,itB0KECBELEKJ,owBwRIAAGVAOF;6wBiJIEEAGcNFGHBJABLAEF,2wBwOQEGBFSHCDBABKDLHBF,6xBsIGILONRJCDDSAICID,ixBuNKECEJCJGBDJFQBED,ovBkNIECEFEJAABEBCH,0xB0MEKDMAJFBGJ,2vBoQMECKHAHDCJ,2vBgKIICKLNCD",
"guatemala":"jzD4SQLoBLEFGCBDCDGGOBBCKEDGECAGGCAEFDFCFDLANGsBIKIfBAEQGLACGDCTHJEDEHEDKFC;jzD8SEAIJGDGDOEOLBMLIICAEJECHDATORB,pyDkTWAGGLAECBCFFAGHICEJEDBCHFJMF,1wDkSEAAEDBAB,xwD4SICCENBED;lyDoTCCJGBFKB",
"guyana":"hrCsGBCGAAKFHJC,lrCiHECBIDACJ,rsCsHKAHEBBAB;;",
"haiti":"15C-WJCFBDEFDEDWB;;",
"hawai":"1iG8XEAKKICAQDGLCDHJDIX;ziGgYOMDGFADDAN,piGyYEIHABDGD;ziGoYEBGGHABD",
"honduras":"3tDsREQBICGFIBBDHELBBDMJIDBCEBEHDGHAFNKFLCOCCEBDGJDDF,vtDoRGGIFGCGKFKDFDCCCHIAKDGCJBHCFBFDBCL,rsDuSCCJGAGCCFEAFHFGFOB,nsD0SECAIFAAGHFCDIBAD,jvD6RGBEGCJGAEEIJ,xrDySQGKSDALRNBED,ntD4SEABIDBBEDFID,rsDyRGAIILFFCED,vsDkSEAAGHCBBGF,zrDyRECBEJNLD,5sDkRGACMFDBH,xsD4REEHEBBGF,luDwSECAGFDCD,hsD2SKACEDEHH,zrDiTKCJGFDGD,ntDmTKCFEFBCD,xsDqTGCBGJDGD;;",
"india":"68C0pBSHEEGLKAGJQDGCELcNALGJEVKHQDGCURMBFFCFYFQNaDGKEJ,42DmhBRNDCALFHFGNNBFDEJHEHEIEABJELMMCFAPHLJOFDAHKAFF,ozD2hBKAKKQFQCQKOUFKCEMHKSKFAJOGSEYRIPDF,wgDoMGKOMTBDEHBCLKJ,iuDwhBMEEMGADFEDKE,oyD0fkBAIGHGvBCCHKF,2_C8NSMZGEPEB;y8CqqBIBELIFKCGHKIGHQCGDVFQLQGATmBVEEGJFCFLQAFJGFDFEBGGQEGFOFDFGDECGHKIGFIBCJWFKEGHECIF,ozD6hBKEAKKACGKIKBEECGHAAGGCGBEKSCQHEGFGGCOY,82DokBBJMNWMGDHDGFDFQDKCGHHDWb,29CiqBbWFKIGoBfDJJE;k9CsrBADSLSTBTGAEIMABJSPAJMFDJSHKKQbUALFOPQHEGAHGFaBGBALGDOBGEGJKEGH,mzDqiBOEYUCGOKKEKBBEICGIGHCKOK,-2DokBIPEMIBBGGCKNGCEFJFGAGFGC,m9C6pBOCHEPUDBOX",
"indonesia":"kwF5FTQlBKTOGGRG_BAFFNGIGFGvBdCPuBEgBLsCD0BZGIGD,q5D0EaVBQMAAGDOLCFSPECKRFNMJBSNCLSNCJ,q1EjEgBkBGCIFUMXMCULMPTJAGLHLGHVRMR,-_DnEGOjBiBEMZQHWJGCRWfWZYNAN,wnFpBfMRNGHGEOJYB,4vE4CODLGUaCMOAEoB,47DqCUKNWfaBjBcV;wvFlGQGAInBMBGLBRSfGZHZIZP6DPsBV;-qF_EqBADIFFfGAH",
"kenya":"mvB7DCOGDCCFUHCAKECAIEMIACQDIHBDECcIKGOLCHHNKAGGFEAEKJIEEFIAEFCBHFGEIEDGGNMAIDADGHRCHBHJBGDDHPRAMEIAIFGDBFZAUHEAMHMBOBEHABEBC,wqBKAHGBELEAAGMEIHFDJACFDBHEFFGJDH,8vBrEGILADGDFFAGFGAIB,wsB6BGEAKEEJKEFDV,-sBzCIUMEDDEHFR,wrBsDAEMGAIHIHL,qvB2CGECIJHCD,ivBiEEAEQJHCH;4tBxBMUAUFKLGBKFCADDBEHFLMNCHDBHCGIHADICGJAAIBCAGFCDMEYBGHEBFHAKPDBBPDDEFDBEAEHGBJHERIBAFGCOBEFGMGDECEDAJ,2sBtCAEGDEILQFBAFEDHF,uuBPOEEIBILGHBEDFLGH,4tBoBEEGBHKFFEF,grBiBGBKEAKDG;8tBZCEBKFEAHEDCF,yuBJIGAEHABFCD",
"laos":"ihE-ZHJCLEBDFABEAIGBJCDFCJFDENJFEHAGDDDEACCBJIACFQCDHCFDDEACCMAAGECLKIEEFIBEBGAADMFBEEI,i_DgZIIGOABGCBFCBGIBEDBBEJFAFDBHJCBCEAF,miEuYZABGQABEAGJCDMECKNGABFEDIAGEAF,yiE2YACEEJEEGBGHEAGEBAEJEJLNIBG,o_D8aECEDGEBGDDDKECGBAGACNFDE,-lEgUDDADDAEPBHIACEGDAIED,y_DgcCHGAGFADIREEBECA,uiE4XIHAFGCKBADCCBE,--DuaEBCDGEKDAMFDFE,w-D8XEKGCDECEDAFD,8hEkYCJHIEEDCCEKB,4kE4SQIJIBDHAAHED,o-DqZMOBGBABHHFCF,4jE4WJEGNGECDCA,u_D8XGEEIDEHLCD,ugE6YEEACDADDEB,4_DwaECBGBEDFEF,i-DuaAFGEEGBC,y-DwaPNMDGOGE,k_D4bGDGAAGBG,ylEgUGCAEJAEF,4iEgXGGFEBBCH,0-D6YGACGHDAB,mhEuZDGECCDBD,ggE0aEAAIDDAD;;",
"madagascar":"06B_bMMBIEBIODIGMDKGOGDEEBICEAKGEBMGGDcIWFIEUXNETHCBMFCBIDCDFCHJDBACIHABTBBBKLJUNDJEFFDAPFJCJEBGECDLDDDDKFDEBAHKJIBCFAFCDADEDDFCHDKHAEBADKJDFHCAFOBEF,06BreGCCMHIDFNGGKDCEGDCBQDGDBNYDCADFABFIBCDIHFBADIFBFILFDCHFABHDGBABLYMKDMP,68B7SGGAIIBBFEDEEAIKBAFCBGCAGBAFICEHKICJEKINCDIHDCFHAIHNFBDAPIN,08BnXCAEOAMEBEGJGICBIFDFPBBDABDCPCEGH,g9BjVECBEIEBCJAAQDFDABHCJKD,i8BpVEABKFGCGFCDFAJMH,s8BzXCGCDCEFIAN,w8BvUAGLGBFKBED,s9BrTKCAENABDGB,q6B7eCACGBIBN,44BjXKKBEHDAJ;;",
"malawi":"grBlTADMIBSEEFAHaDEDBAIHDEIDEBWBCCMNHFCQIEqBMKDgBVYEKFGAG,gsBpRIZEACCFGAE,4rBhUGCCOBCFFAL;sqBvNCEBGECHGFLKF;",
"malaysia":"ixEsFBKDBJGEIFAAHFDCJEDBFDCHHCHBNCBEC,g_DgFFIEODEEIBGEKIEBIDALRCJFHGTIF,wxE6GKGBIDCIMDEDDBHFDDFKEBN,gwE2DFDDJLBKJJBCDCDEG;;",
"mexico":"vrEsnBELGASVETGKALQVDSEKKhBGMBQIEKVAOGQEVSRFLDKFBERDHFCBDCFGEATGDEDGIEFDJCVEDCEAQECEBBPUDKHPEDDEFATKIGDCFDDCLMHKBGFFFMGAPKJGIIJLJEHICELDDKACRKAIPMEBNSbKCATIJLCFIFJGHGGBJIDFBFETXUJGLWRAFKKGFKCIPJJUPEIGFMBIKHBAIFCLBHQCKGIIBKNWEBFSNAMQCGMGHKCELFFCDIAEFKAFFAJGHKICIGBIRdBFILFLGNONDIPWRGEEFSBEHMKQDGEBHKDBFQAGGEDGGGFGEAREIMLGCHHIHaJgBGDMMGFKFHDCEGMEAIRUDFBITQGGFEJWGGBQKMDGnBIlBoBFDFEDYLLFACKDGIGAWFQGMGFGWLSHEBQToBPKCIVFJIAIIEJGAGTMLFCKMKFSQEPMEKLMMAAIKBHQNKJERJ,tyDiUASNQKGFELBJKFADHODDDJELMNHuBtBMB,txE2oBCNGLAPWFJFWfIDCEPgBCMJGJgBNG,zgEskBEJHAADGLGEAFVEJKAK,9yDyTFBPKLBJEBDkBf;39D4ZQGQJMQRDJOEGJAAGFGJDFKHHGSHaJCOSMDFMGMFEFNJYLCDHFCbNDEKKLKDDBJJHBIGKDQLHFEDMLFJKLFDCDUHEJCLNDIGGBQNQCMDGGELMFFEFRGAWLFDMGGDKGGBKKGFGECGFEEHgBROFNFMDFGPLLCWFSLIFJLcDFFKATGAAJFFFGAFQLCJIFDDFIANGLFJGLKFJDMLEIGBFLODDFMLFJQLEPDJIBAGKGAHIHFFEFKBONPJWFFFIFFJGAMLGIKPQIEDDJNBEPADGSKDANGHCcEIEBGVGGGFHLSCEFBRHJCQFCFFAPQBCKOSDKWREaELIJAHFGEPICAHgBXGCDWQADLEP,p5D6WGDAELWIcBGfIRUDCFFPCFELBDGFDPALIPPKDADJADHLHHMGGJGFHDBLGFBEFDBJCDDIVSIKLWQSFEIGNGAKRiBIQHMEEDSAGDDFIJEEFGICQN,v5D4UMCAUGCQLCQHOFHDIHHCLHMEGFKFKFFFKFHCPFAAFFFQVEQMCCLFFEF,n9D8eEIFQNMRNbDMHQCGFGKGAQP,tiEodDEBKFGDaKHSCDHGPNP,_6DuVQGBGTFLKDJQAGF,_-DkeKUJIDBELFDGJ,p_DwZICTSAGTLgBN,z4DgUUIHITHIH,1gEsaQYFELTCH;",
"mozambique":"osBzREMDIKKCGICEQJQJVFGCSBAHJJFANADIEEd,mpBxREDCECLIFAHGFGLCBECGKGBCECPID,-mBlSBHGBGGGBCFMJKEHCFMHEEEMCBC,6oBnZICDABGOCEGBGBBFIBKDC,muBnTOADEAGHCDBBFED,gpBjXKKEKDKFHCKFA;;",
"myanmar":"-5DweDFAFFNIDADDEPLANJDDHHBCBDbGABOEKCCGBIEBCHEMEAFEDCCGOBGEIKEEFQEIBPJEDJDQBHDFJIAAFBDKDGABBGFGCCEGABHFBELCACIIGDECMCCAHGECGCD,g5D-XEGKDGIBEDDBEBKFIAIEBGNAWGJECELGYGDEQEJEIHGFCDBAGECDKAKEADDIFDJCBGEBEKGBOGELGLQFPFBARHRFQDDDACGDKHPFCBBGNBPKbCJDBGHAF,u4DgiBMDJDGFSBGCBhBHJCDCFGGM2BBGFCCUEAORGEJMMHDTCNEECHBHDBEBDNEBGICFHHAFLJAD,u0D6bBJEJEEAREBCEGHCJBDSVDQHGCEEDCAEKDQBGFCBGAKIUFEBGAEIDAcCCAI,i8D0bLRINBJGBDNICCCIDLDEJEKGDGCBMCIEAWMHEJHDGEBGISDAI,47D8cFDEFBBDEDAAJEBFTHGEGDKEIJCGEBCHCOGAIKA,s2DmfIIEOQOCCDEGOFEGACGEBAGGIBVIKCGKCJI,s6DqYGKGCBCCEBCDDFBCBFHED,k5DoZDMCCCWEDDTCHBD,q5D8WGKBOFEFNEJED,47D-YCBIGAMFDDL;y5D4iBKAADCAGCBIKHEEIFBDGRECAGCDIC,26D4gBIWDOHGBBEDBFECCFBDCFDJCF,q7DiiBJJEJDBBXCDGAFDFAFR,o5D8hBJDKBGEEHAKDE;05D6iBIEBCIIEJMCEFEC",
"nepal":"skDwkBIDDDYFHEKAAENKKBIHBDOFAEEAAJOHEHQDIHIABGCACFGCAFQBGCFCACSAEKKAEDGEGFCCMDDFMEGBHDBBTCYPOAiBNAGEBKGDDGBEJICBGIAFMECGBBRUMBFNHADKAIEABECEDGA,yrDgiBHIICCFGACBJB,osD0hBGAFIDBEF;2kDmlBKAFLEACGIDKEDFHDGBOIFJGDKGBIGECDDABFGBHDDHKBEHEEIBKEDHMDFADFECEFICCFKBBGGCCFGACCDEAEEDIEAHGCQDIEABMDEDEGAFGAADGCKHGECDKACNGMGADHCFGCAHCEGBIIAFGDBHIGDGCEMGCECbIIDGICCDGCAFDJMB,ilDqkBEAACHEFBKD;8kDqlBIABFGDKGGAAFGDECAIIBAIIDAFKDDDHEHDEFHFGCGICFKCJHFADDKDKEEDGGGDFBAHOACBFFEDMCCGODAIELQAEBGGKJICAIGBCLECAFMKAHDBEBIAEDEECDGCAFGCCECACJGBBHMIIDAFUSCBBNGEGBEECDIH",
"nicaragua":"trDmQEAEMHADEJBAJGGCAGJ;;",
"nigeria":"gLqLOAGKIADEAILEEEBIJABEFADPCVGD,8OsJDDBCHAADIJHDDEFDJMBBDR;;",
"panama":"xnDgLIFQCEDEAHIAGHBFECILEAEDA,jmDyKUCNGHBDEDBCFIB;rnDmLGHCAAGHCBIHC;",
"papua new guinea":"qwFvGGAIHEEEHQCIGDFMNIFCJcDMHBBIDGHGAGEAEGEAMSDADLDQBOJKCDFGAEREBELCMGBEAAEKBEJGBBDCFBDGHAFIECPCCCFICCJIACFBFMBCHMFKAJIDMCIHADEHCFMAEGBBGDARWAEIHGCNMBOHEAQNDBHJABGGGFCBUXQFAFINCFGBKNKJAEHIDMLDDHIJBCIDCHMBJHECGJDJGHDXCBEVADGBDADDBBGHABDFG,i4FnIICBCEEEDCCAKFEFCDBBCPCBGLEXGDDMLIBEHkBN,y8FnHCBGKGDCGKEECDGJBLLCBFBAD,86F1MICBIHADKREDHCFGAEEMFEH,89FzGEABEJGDBADGCGF;6zF7HMCBICQBCJBEGDGJIHAAEHCLDCBKBEDFFFEBDDGFHGHIBBJGDOAEDCGIJ,-3FjIGCCGIAAEFEHFLIBBFBDCGGFABEDALGJBSNGCEHQBGH,y4FnLDMDGCEBGTUAMRGGLGCCBFHIHDFMAAJKFAHGFGB,w1F5HEGAISLECBEHAFIDBBGLENBONIAAH,qwFpGOHECIFCEKBIEREBCAFJCBINE,q2FhJEEAEEGECFODHADLBGDEAAL,g5F9LGGDCAGFIHAAHMHAF,80F1HGBCGNILBEHGCID,o1FnIMAIIFEDFFBDD,syFvHBGEEHILGAFSR,q2FnICGJGAFIF;-3F_HCEHGFBMH,4zFpHCEDEHBKF",
"peru":"j2ClRHALGHDVMJBbQLCHGAGECEINIJKXCBDCBFHEBNFCILIHWLKNEBDOVCDHDABEDBDKLADBARUDkBDEBDAHLMECEDEKUFECBGBBBIFIFYFEDHCJDHDADHDEBDDKDBBGDAJYDYFGDSEQDEAKLDAFJKAGDDDGABAJSPEJEREFFDDAHOBGPeFcFCFICGGBCCEGBIECAEGADKGECGDAFQDEADPEHIBDDMFCDBGFVDFFCFGFCDNCDBAFFGAKDGEKKJEEAKFKAM,3jDxFJNEJMFBTGFANGJIDAPGJHFIJEGEABNDBEFEEABAFMJCHGDALGDAJIJDBEJGDALGBKZIFAHIFBFGABJIDKXABKNGABFKJAJKJCFOPECIJENBFCBCDGDCEEJEEAF,z7CpUGCUJGMEABHCDDBKAEDDDIFYDIXEGECDNCBEABGGICFICAHKAKJCJ,tgD1HNSSCGDADDDEDFDDA,j9ClMCIDODAFFGLGD,t9C9NNMICGFIAHH;j2C1RHFDCCGDBrBaBDDGJCFAHILCJIJYHGLDABGDJDMFLBFJDGGGBCNBFHDGFFEHDDLQHEAEJKDBHMCEGFCEPYFCNQFDDHBKCIBEDBMIDGPQCaDDDCALFGJMJAAIECBECEDGFECGFEAGDCFBDEICDICGHABOFCAKBKFAEKDEAECCSJBIHGBGPQFEDDBGJCBDKLAHBBBGHCDAABMJBDEAGLCNBDFUJKFAHIJHFKNKAPIHGAEFIAJFCFBDSJNBBDYHFBEDJCBFEFAFMJCHEBEICBAJDDGHANIHDBCHIFBJKACNGBDDEJGBECAJKDDBIJDHIDAHORBFIDKAHFADOLDHGCEDDDKDFFIBEJIGGJBDGBBDGJIHICDHADMEJLKBEFIABF,n8C5TMCEFCIEDGKBEEAIRHBCFOEKKCHYNCJEDOFIEDHCBIDCFQDAFOLGL,rjD3FDBCFAFDAJKBFONCJBNECEICJMFAQGLAGJOBCGEHKBBAE,77C_PISBCDAEIFMAIFGJCIRIDJHBHMR;p2ChSNGHMFBAEFGJCHGBBFEHEDABDHMBBJCLIBGFADGDBADFEDFDABJDBBGJCGEDENHABDDGFKCGFHAEJBFFAECDKRAAEFEDAALFIEKFGWNAENUJECEHIFBBGJIDDIFADNGEEFGGEDGEEGHKBLQHEJMDBEJBBDCFIFCAKEEJGEEDCCKHCEGDKFDDCBLDADOIECGJCEIJBDIDKGGAENAIGAEFAAGFAHIGCAEJGCEJOEMJEAGHEFQBBEHCLIRIVBHKPEADFKNFAJQEENQASHAAIFFAJJKAKDCFDIDDFGHHBJEEFGBFDABGBKLEKGCBPIBGTDABKFEDDEHCLIHDBCHGBEHGBALGBEICHHJGJGEGAFHIFAJGBBLMBDDEFDDOBDDGNGACIELBDDBCFGHGGALIEANGDDBEHKEELMHFFEFMHIMARQALFGNKEAFKCGDEEFGBMILEEBDIBBHIHEAGKEDCAEIEFHJcHKHCLOCEBGECFHJMLOFEECHFDKFGL,xhDlJEGHODBBEEKDEHNDEGGBILPFBDFKAKJGEOJ,18CvQFEFMEEAGMZDA",
"philipines":"k3EoUAGECCQKIBIDCEOHGJVANFEBBBHEFFFCFEAGKBJGB,q7EwJQACKKCAEECAGLADHHAAFHFAD,y8EyIECCEFIDAEFDDED,s8EoKKEDBDGEAAGNOIb,87EwHIAAGFDHICFED,y4E0VCCDGEKDABJEH,-8EsHCKFECDBHEB,89E6IEKBKDAHNKF,k3EqWEMDGDPEB;;",
"rwanda":";-kBxDDICKDGGKAWGC,0kBpCIJHBHLMP;",
"south sudan":"8rBoHABHHBMFABLKBGEGBCD,wpB4ENOFCAHFGDBIL,uqBuFHENABHKJ,irBwHKGAELDCF;;",
"sri lanka":"2kDsISCGKFDDGJEJLGF;;",
"tanzania":"kqB1LIEafGLMIEKKAQKDEHDDCEKBKCIEIICMOEMUIEOBKESDCDFAKHGJBHEBFIBCLGCEDDJEDEEGDDBEHFBLBCQJBEGDAlBbFCPFGMOICKECBIGGDWJMKOKGELDHEJBBEFGDKGEEAKEBAKKNBDIFECAFGAGFEYECEDCIENECEIHCHGGIEBEIAQJCDGMEBKFIFSHEIAEDCKFEFBJJBGKMaCCG,ilBzFBJKACFDBCDKDBFHCGLFEBDINBDHBCJIDGCEHWJEGAICCCFGBOJWdQNKDEJIBKLPAPEEPVcDKPQFQLGFIHADDCHBDEBCFBDMZGFAF,yqBrBFDCFDACFJACFHHCFLBMDKECFLFDHJAFGDABJEHABFCBDBQDEFDJMFFCFFAAHDCDFBCDKEEFGAOIcAGDE,stB7CDJDEDHABGBBHKBJJFCCOHMAIGK,gsBpODeKGDGJJFCAGHDEJDHKJEH,qsB3NMMCKGEDEBEBHJDDFCDDDEH,uvBzFCAAMJGCGFCAFEDENEB,gwBnGGIBGHIDABJKL,2sB_EBKGQGHDNFD,qpBzCEABEHCBDIB,4tBlLCKBADDEF;mrBhMEBGKFIFADIDCDDLINABDEDICILKAEHID,yuBzDFBCFMFECAG,6nBnKCEBEHEAFIF,msBpFGGAGDEDFCJ,osBlEEEHGBDGF,ysBhEIEBOLHGJ;2uB9DGABGLAIF",
"thailand":"y6D-XBLELDHGHECDGEEAWGHAHCLECAMCEDKPM,q7DyYAFDABDAHEHECBQEBCFEADQEE,66D0VECCQDCCGAIDHHFIT,y7DsUEDALIHAOFUBBDF,m8DwXEIBCBWDCBBEFCZ,s-DoYDACFBHGECD;;",
"timor leste":"48EnLKCOKFADDDILDCL;;",
"uganda":"4oB2EEDBLOCBGEAAJEFHEBFBBAHHCCFHEFKDJHEBEHCDFCHGAIJCLJBDJPFVPNPJHDEJJ,2nBlBDIMSBIEEUCGICFMAKOKDAFGEGDGC,qlBBEAMOCJDHJHBEFNFB,-mB4CCKDADEAMGeFA,4pB4EEHHBDGCE;ulB1BAECEDIJDCJDA;",
"venezuela":"j6C-IAKJKEECBKAIEKCKIMEScICEIEAEMCACDGAEGEAEEAGGCCGJALJBCAKHABHHBDNLBfXAJFDJADBJLFBBJ,1wCiFDCCMDDLCBBLKFFBEDABJEAEEKJFBHPDADJIFCCCKICDEGKIBAFGGCLIKGA,3sCwHFBJEEHFBDEFBALJNCDGCEFGIAKEJGCCBDBEFMOCDHJEAOGALKD,xxCqGEAGIFQEIDGEIDENNGFDDEFFJIBCH,rwCuFCABCCEGABGHCCGHGDFANMF,7zCwFQIEKFIHDHGDDIFAFEBFFAD,1yCgHIEEAAIHCFHADCB,r0C8MYAECDEUCRCfHGB,zsCyFIIHIDFEHFCBF,nuCgHIGCIDCBBHCEP,jwCsMMECELEHFGF;h6C6JECEBGMEAAFOKADEGGDCIOSKGAGCEEAADCCAEGQDAHPLHDEFBDHTNABKAADdFAHHFED,p7CuMCDIICMBG;74CwKSODOHHNHCDMEBDFDCD",
"vietnam":"umE0SECCGCABNEACCCDECCHCEIDADBAAHIFAKEGDIDAFOFAFKHABEFC,ghEscMHADDBGJECDIQNBNMLKDIEAGJBAIDECAAINCEINMDACEFG,0nEsOMYGAHEBKDBADDABGFBBHIECAADTLCFKEEJED,whEgaDGIAFGHCBJFAFI,kgEocEAEFEAMJAMLI,4iEycIFBDCACIDG,okE2cBFEJCAAIBI,uhEyaEAFICGFFGH,wiEyYKBEAEINB;;",
"yemen":"-1BkVIDAFGHDFBREBEIEBFJAHHHKBAHKJJADEEPEDDHOABBDJCDDDGBBHEDBFIFECEGIBAGHCKEAEGDOIGBCDGAGEGAAEIGcGMGIACHIEEBAELCGCDGEEICQFJICCgBBCHEBGIKGFGCCEBeKIAIEEBOEBEXINABEDBAHDBXAFIFFDADGHDBCCGJJBGJFAIHHDCNXHFJBDKRICIFCHOFCAGMAKGCIKGIAEELEPDFMDCRW,-7B8TQAHIICGDEEGBAGGAEOHAADHEBDDGJFDCEEACJFJEFHFODAHLBHEDIDKACDMD,s9ByUUAKGQDAEBIFAXHLABF,oiCgVLCNAFBOFGCMB,o5B6QQECEDCNFAD,-_BmTEEBGFDEF,q_B2TIAEELCAF;-2BoRKAIGMBICBKGEBKFCFOCGGBECNOCIBGBEFDDGFACGHEHRHFEFFBMBEJKBJNKDFDIDDDCJBBDCAFDD,w4BoRMGIDIIKAEERDBGHHFCFBBH,24B2REUDCHHGFBFEB,m2B6VEdIGFOAGGC,03ByUEADQRBSN;",
"zambia":"ggBlWGCCBGCEBGGGDGACDKCCIIEGOGECEGCBEMOBEOBIGFGKADGKKMDOCDEECIBBIGEBMDALFAGLAAIOIMBIGKCEGDCCGYUEIKAEFCAAIBACAMQMkBGKEFOSAGGCCGGEEaEKMIEBBVGJDHEF,6hBjUJOFBFCLBDJBKUIMKUBKEEDEEEHIHADRAXL,spBxOHHARJLCLDBIJBDFJDCBJLBHJNAFFBH,qlBtKCBECKDDFFCHDEJJAPLLGDFCNHVBRDA,0ezVCEUSKDICCBHRGDAFFDID,-nB5RACGACEEBCECD,gnB1KBJNINFAEFCIM,qkBvKGBFTIDIGCMGK;;",
"zimbabwe":"ipBjWDGFADLBGFAIKAIBBNEFBAGPHFAIGDCGEBIHEGGGBBEECxBABDEFADHFEIHKAGLLDIFAEGLCBDHGJFGCGFDFEDFFEJABMFKNFLHHEJHANMBIHHPEALLADGNDBGHJFACBKCGDFDEDKFMAZACELGBAIFFALKbJNEIKNACIGAEELCDELA,6iBpaEBKEGBQKOFCCDECCCKEHOHGCACDCCEKACBGEDCCEFGIOGDGECFKDAHQGEBEGIEIBAGFCBEEEBKGCFGCEAIGAGEIDGLECAKIL,6oBrYFDGFFBBHEDDLII,0gB9XKEALIDUKCNHR,0iB_XDECGBEIDAHDB,4iBvWOSTFAFGF;;"};
// one decoder, given the divisor the table was quantised at: 20 for the belt's
// twentieth of a degree, 200 for the city table's two-hundredth. Everything
// else about the encoding — the alphabet, the zig-zag varint, the delta per
// point, the ';' between rings — is the same string in both tables.
function landPts(s,q){
  const pts=[],d=q||20;let i=0,x=0,y=0;
  const rd=()=>{let r=0,m=1,c;do{c=LAND_I[s[i++]];r+=(c&31)*m;m*=32}while(c&32);return (r&1)?-((r+1)/2):r/2};
  while(i<s.length){x+=rd();y+=rd();pts.push({lon:x/d,lat:y/d})}
  return pts;
}
// the divisor is passed explicitly at every call site: map() hands its index
// in as a second argument, so a bare .map(landPts) would decode ring 1 at q=1
let _landRingsCache={};
function landRingsRaw(key){
  if(key in _landRingsCache)return _landRingsCache[key];
  const enc=LANDS[key];
  return _landRingsCache[key]=enc?enc.split(';').map(r=>landPts(r,20)):null;
}
let _worldRingsCache={};
/* the same reader as landRingsRaw, against the context table */
function worldRingsRaw(key){
  if(key in _worldRingsCache)return _worldRingsCache[key];
  const enc=WORLD[key];
  return _worldRingsCache[key]=enc?enc.split(';').map(r=>landPts(r,20)):null;
}
let _landTopoCache={};
function landTopoRaw(key){
  if(key in _landTopoCache)return _landTopoCache[key];
  const enc=LAND_TOPO[key];
  return _landTopoCache[key]=enc?enc.split(';').map(lv=>lv?lv.split(',').filter(Boolean).map(r=>landPts(r,20)):[]):null;
}
/* carries its own fold, the way cityKey() came to at Phase 32 — it was calling
   index.html's global fold() from this file's top level: a sibling reaching
   back into the host that loads it for its own normaliser, resolving only
   because index.html happens to declare fold() before landKey ever runs.
   Copied rather than shared with cityKey's own normaliser, because the two
   disagree on digits: fold() keeps them and LAND_AKA/LANDS were keyed against
   that, so borrowing cityKey's digit-stripping version here would silently
   rekey any country name that carries one. */
function landKey(name){const f=String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();return LAND_AKA[f]||f}
function landAnchor(key){
  const rs=landRingsRaw(key);if(!rs||!rs.length)return null;
  const big=rs.reduce((a,r)=>r.length>a.length?r:a,rs[0]);
  return {lat:big.reduce((a,p)=>a+p.lat,0)/big.length,lon:big.reduce((a,p)=>a+p.lon,0)/big.length};
}

/* which contours a seal of this width can hold (Phase 29 · B). Under 64 px a
 * 0.05° contour is four dots, so the row keeps the outline alone; the cup's
 * own page takes the 2,000 and 3,000 m bands; a page with room takes all
 * three. Returned coarsest first — LAND_TOPO's levels run 1,000 · 2,000 ·
 * 3,000 m, so the ladder reads back off the end of it, because the highest
 * ground is the simplest shape and a seal showing one contour should show
 * the right one. One threshold, no per-surface branching. */
const SEAL_BANDS=64, SEAL_ALL=140;
function sealBands(px){const w=px||36;return w<SEAL_BANDS?[]:w<SEAL_ALL?[2,1]:[2,1,0]}

/* ============ the city table (Phase 29 · D) ============
 * Two tables, keyed by city, quantised ten times finer than the belt — 0.005°,
 * five hundred metres on the ground. They are kept apart because their ink
 * differs, and that split is the whole flag the painter reads:
 *   CITY_RINGS  closed shapes  → land fill + hairline
 *   CITY_ARCS   open coastline → hairline only, never filled, never closed
 * An open arc has no inside; filling one would invent a shore on the sea side.
 *
 * A key is adopted only when it passes both offline tests, and the second is
 * what makes the first safe: more vertices in the window than the belt has,
 * AND every point the record holds in that window still lands on land — not
 * just the city's own coordinate. An outline can gain vertices and lose the
 * shoreline the city stands on, and no byte count would show it. Honolulu is
 * the proof and is not shipped: it gains four vertices and its O‘ahu is
 * clipped north of the city's own shore, so the pin lands at sea and three of
 * four placed cafés with it. Its strings are kept in docs/ROADMAP.md Phase 29,
 * rejected, so the next source can be measured against the same failure.
 *
 * A city with no key falls back to LANDS. Nothing else in the reader changes. */
const CITY_RINGS={"lihue":'rp-B81IuBDWpBL7BtBjB_DuBQgCmDgB'};
const CITY_ARCS={"los angeles":'z6tBi-M3BmC9DgD_E6CdX9BOKoBlCyC9CRnF6BXwBvD8B'};
const CITY_Q=200;
// an ‘okina is a letter in Hawaiian, not a separator, so it comes out before
// the fold turns it into a space — otherwise Līhu‘e keys as "lihu e"
/* the fold is written out here rather than called. The map's own fold() is
   inside the elements' closure, so this — top level — was resolving against
   index.html's global instead: a sibling reaching back into the host for its
   own normaliser, which is the wrong direction and is why the model harness
   has to slice this file first. <carta-city> reads it on a cold paint, and a
   plate that keys Līhu‘e wrong draws the wrong shore in silence. */
function cityKey(name){return String(name||'').replace(/[‘’'ʻʼ`´]/g,'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim()}
let _cityRingsCache={},_cityArcsCache={};
function cityRingsRaw(city){
  const k=cityKey(city);if(k in _cityRingsCache)return _cityRingsCache[k];
  const enc=CITY_RINGS[k];
  return _cityRingsCache[k]=enc?enc.split(';').map(r=>landPts(r,CITY_Q)):null;
}
function cityArcsRaw(city){
  const k=cityKey(city);if(k in _cityArcsCache)return _cityArcsCache[k];
  const enc=CITY_ARCS[k];
  return _cityArcsCache[k]=enc?enc.split(';').map(r=>landPts(r,CITY_Q)):null;
}

/* ============ the window a plate opens into (Phase 29 · C) ============
 * A box of `span` kilometres centred on a city, in the same equirectangular
 * kilometres the seal is projected in. Everything below is one test made at
 * draw time — no city-by-city exceptions, and no shape baked at authoring. */
function cityWindow(at,span){
  const h=span/2,dLat=h/111.32,dLon=h/(111.32*Math.cos(at.lat*Math.PI/180));
  return {lat0:at.lat-dLat,lat1:at.lat+dLat,lon0:at.lon-dLon,lon1:at.lon+dLon,span,at};
}
const inWindow=(p,w)=>p.lon>=w.lon0&&p.lon<=w.lon1&&p.lat>=w.lat0&&p.lat<=w.lat1;
/* A ring the frame would cut is not ground, it is a chord. Drop it — Kaua‘i
 * closes inside a 190 km window and is an island; the coastline through Los
 * Angeles runs Mexico to Canada and is a line passing through. */
function ringsInWindow(rings,w){return (rings||[]).filter(r=>r.length>2&&r.every(p=>inWindow(p,w)))}
/* An arc is the other case: open coast, which is honest precisely because it
 * runs out of frame. It is drawn where the window holds enough of it to read
 * as a coast rather than a chord, and the disc clips the ends. */
const ARC_MIN=4;
function arcsInWindow(arcs,w){return (arcs||[]).filter(a=>a.filter(p=>inWindow(p,w)).length>=ARC_MIN)}
/* what a plate actually has to draw: the city table where the city has a key,
 * the belt underneath it where it hasn't, and neither where the window is
 * empty — at which point the plate draws the record's own points and says so. */
function plateGround(city,countryKey,at,span){
  const w=cityWindow(at,span);
  return {w,
    rings:ringsInWindow(cityRingsRaw(city)||landRingsRaw(countryKey),w),
    arcs:arcsInWindow(cityArcsRaw(city),w)};
}
/* the belt carries these for the record's own cities, not for coffee. The
 * passport is a record of where coffee is GROWN, so a country that only ever
 * appears under a café stays off it — it is ground for a seal, not a country
 * on the frame. Alaska is not here: it is drawn on the passport exactly as it
 * was when it rode inside the USA entry (Phase 29 · E moves the bytes, not
 * the picture), and only a seal reads it as its own shape. */
const LAND_OFF_BELT={denmark:1,germany:1,norway:1,japan:1};

/* ==== the world behind the belt — context, never a mark ====
 * LANDS carries the growing world and nothing else, so every other landmass
 * was simply absent and the passport read as a map with pieces missing rather
 * than as a chart of the belt. WORLD is the rest of Natural Earth 1:110m, cut
 * from the same generation, through the same simplifier and the same varint,
 * quantised to the same twentieth of a degree — 112 countries in 11.7 KB.
 *
 * IN THE FILE, like everything else here. The design board fetched this as
 * countries.geo.json; the passport asks for nothing at all, by law, and must
 * draw with the network off, so it is encoded instead.
 *
 * Outer rings only: the decoder has no notion of a hole, and behind the belt
 * at 2.2% fill a lake reads as nothing. Simplified against each country's own
 * span, so a small shape survives the frame zooming to a single tasted
 * country while Russia does not pay for detail no one will read.
 *
 * The belt's own countries are NOT in here — they are filtered out at encode
 * time, through Natural Earth's spellings mapped onto the LANDS keys, so no
 * country is ever drawn in both tiers. Two of those spellings are easy to get
 * backwards: Natural Earth says "East Timor" for timor leste and "Republic of
 * the Congo" for congo, and an alias pointing the other way silently draws
 * both of them twice. */
const WORLD={
"afghanistan":"wsCysBqBPeGIS2BSIgBiBIGOgDZcOOHMSYAckBWJEvBQL4BemCDGJjEZXROjBTPHdlBAOZXJRXCXNLvCLVVBhB3CV_BBjCWmBkBDadGP6BQWPGauC",
"albania":"4Zq0BFNGPQJAJNFBNRTFEBIVODUEaGMHIBMSUCHKEKLIDEN",
"algeria":"gPqd7H5ElDVAa5O0JC6BoEuB-BkBCe-CYIQpBkDmBWqDkB6EEmBQ2CFJ7CZVEd6BxBerDDzDPPoBjCSGyBrB",
"antarctica":"npClwCnEZZbWbtElC6EtDmB3DlM1DpIBwEvBrFTBfqDpBkP7BqG5ByK6B2IN6RmCtBsBtHHM2BqW2DoCaPqBoH4CyMPgKmC6DlBoDkBkRTkGgBqCuBgGzB8TgF0I1CoDWiGValClCXyBPrBtBsCPgFgD4EQwF0C8FIyBmBiClB2HJ8EG-DkCmE3BoJqB6H1BiDcyPOMkB-B7BkLDmE7B6GFiJxCiMrBrCtC_DdlDpCc_BuDjBxGPtCnCgMzDoNhB9hOAwMgB8O5B2SMIUrNiBeiC_EmB4HJqFoB9DoBnHMrDoBLuB4ITyGkBDsB0BIkMkBsTHmHgBiCnByOXWShDetB8BmJnB6HMiBeiFlB2ENuBckFfiJmBoCmB3B-C0BwDqF6CwG4BYL3BX;t4BxhDyBRW9B9InBxEQ8GoDsEA;x1C14CNvB1HE0DiBkB2C6BHyBjC;_mGrjDtCFlDqBiDIyCrB;v3E77CkDA9BX9CS4BG;37D95CwDV3FA9BYmEB;tqChkDXlB1HeuII",
"armenia":"w2BszB2BGKJOHHJWNLLkBRAbNAPWAGRALMHBPMdKEUFO",
"austria":"oVk8BDPVAIHVfhBBTH5CMJOnBFDHrBGRIGKBIMCULGKkBBcIgBJEIFaOEOUeNkBUgBLSCSHCT",
"azerbaijan":"m7BwzBSBIKYQUTUdUAMLhBBFfHNNJCTJBZWOULMNDvBdAcjBSMMVOIKXSKGeLWBGGTUKGMAaZ;o4B2xBMLSAAFQVbETUFOIC",
"belarus":"sdsjCmBAsBQIWiBMDSkCWqBJEJWGmBJERHLqBhBBFmBR3BLUlBhBBNJBTzBCJKPFhESfAVLRANkBYILwB",
"belgium":"kEmgCeDkBKaRWJDZJBFVhBSTDvBkBRAFOgBI",
"benin":"sD6HhBDJcC8CHIAUbYGWOEISUEWYOAeXBLKXHPELfjBHZA5C",
"bermuda":"_wCsoBABBAAEBDGAEGBAABCADAABBA",
"bhutan":"0yD2iBQLBXhBBhBEXHjBQBIceUKeJUASL",
"bosnia and herzegovina":"4Xi4BOAJRUNFTPDNJFVjBQNQPIRQHMTSISOJKISCiBHcCSJ",
"botswana":"igBlXUduBrBQDMnBgBFaR5BdjBbXpBVDLfXHhBCjBQTJHTnBdbDJOEahBsBA0DoBCAuE8CQQRYQkBKWjB",
"brunei":"4uE2FQOiBWDtBTCHNRW",
"bulgaria":"qcq3BMRQEeF6BBUKwBKcPYDTPPbOXhBGpBLATjBDbOfLdCBaTMGGDGGMQMTSDOKK",
"burkina faso":"xDiMZKTBNJRIFORIBYKSAMeiBGcMIUDQIsBoBmBQWGKHYCBTGRWZATwBHBbHLTDHRND1BELF3CAEzB",
"canada":"lxD82CApB2BgBqCxCmCgCEsB0DJ0BTZnBWpBtFV9BlC5FtC7CtCRtC8BFkBjCyMtCEpC6CzC0B2BxB0CkEsCtC6CuBqBdiDcKuEDqF3BMzCiCd6D2CgEnEPXyFjCgC3BCrBtFrC9HA7FpEyHiDkBTlBbanC2DNoBsBcrB9G9CdCBiBkCiBrDFZsC5BQ5ChDlEA5JjEGyEpH2DhEFrDUReljBPzFqCP8BpDuCUgC7G8EtCjBtE4BA4L0FfoJkBmBcgDnB2BaEdyDQ4HjB2BT3BToCHuEMqBXsBUnBQaOwCG8FtB4DGgBgB-BNBlBsCmC3CqBCsBwBc8CX4BrBjBTqCH;lsDu7CgBXqEwBkCpBFZ2Dc0E3BqCIuF5BmBjBpCT2IpCxCpCvD4BzBFFVsE7CNd3EsBqDnChGmB5EoCxDRhBMae-EGoB8CvHgDlMKfOqBS5BALqBoC0BmDKbZ;z1C8nDoIdhGXyBJjHjCjHT2BDZHgBRtF1BqCPpDXlLKmCeTciEN1DgByDoBpCkBsGIlHC_E4BsPyBwNB;1uEs7CTRwEHuBUkCzBUQbqBsCAyCzCmE3BhCDMdrESlJZvDYxBgBmGQ7GIVO-CQjEK-BuB0EQ;lmCs_BZjBkEVLdcIStBPjBtBGBmBtBhBhBe3DBsC8D8BmBLlB;t9Dq8C2DDZd8BRFjBnDL_DuByCIrBawBU;nnEo_C8CJPlBpJXuCerHC8C0B-HpB5BoB8CJ;3sDyjDwBLnGtBzCGpBQgBatEeuCqB-CC4G_B;x2Eo5CpDTxDmBwCqClBYmJDyCbzEnBxBrB;r2DsgD8DLgDvBiKE0Bf1PBTqBnFiBgDO;tqDiyCqGrC3DO_CpBjCU0B4CeD;7lFyjCmBCLrBiBfpCwBOa;v0D-6C3CbZkBWkBoGArDrB;j7D8_CeRPxBtFWBgBiFO;5-C-zC3BS2BcgBLdhB;nxEihDjBrBlHR2E4B0DG;h9D8hDtGEoBMzBY6GnB;xvCm6BiCDhBTfY;r6E08BlGyCsDJ6CnC;x3Ds2ClFMgCemDpB;ziE47CjBZ9BciDB;t_Cs7C9DN3BY2FJ;_0D49C_DBuCcyBZ;53DyhD5BH1BoBwDf",
"central african republic":"kToJgBEIKQJyBQmBeDOyBAmBUcqBuBYcpBDtBiCrBAN6C5CjCAhBNPIrBTXCLX5BK7BejBhBDbzBKtB7BFe1BmCC8BeuB",
"chad":"kSiQEUZAAaPOQ2B0BmBa2EfkBJ-BoBWgK3EC_EjBEb1BIJV7BOCW7BtBXbpBlBTxBAENlBdpDTGMRsBpBeIS0BAVkBA0BPa",
"croatia":"yXs5BIPOJPPRKbBhBIRBJHNKHRcdiBXOPkBPDFlBOVOlBMhBeKCTSAOZGLRLOCOcBIIOHQABMOEEQgBKsBVgBHQG",
"cyprus":"uqB6rBCBnBRTGJQuBCEFCCGBGEEB",
"czech republic":"mV48BRIRBfMNDVPpCoBJcyCiBKDSEULeDBLUHGKcDELeBSTLAFHJBJNfDFH",
"djibouti":"81B8PILARXHSLNTJGJBVAAMDMckBSDMK",
"egypt":"0rB8kBRtBVb_B0CoCvEgC3CHHCZ0BrB5OAAiJLgBKYFSOS2BCgDdwBYkBEcDKTKM-BLUKajC",
"equatorial guinea":"8LoBHGOuBiCBAvB5BANB",
"estonia":"seooCGYPFXODYkDQsBFqBCGHdXMjBPNhBCzBShBF",
"falkland islands":"vsC5gCwBYiBJYQgBRLN1BLROhBRTS",
"fiji":"--G1VIftBAmBgB;mgH_UdG4BYZd",
"finland":"4jBq2CFb-BZlBduBtBZhBkBdPZ6BbNT7DpCvGZVWnBMKoBTkBUYkBY2D0BDS3BSNQA-BzDuBYKsBT0BCsBJmBSUe-BMyBPPb",
"france":"wEg_BcTUEqCf6BHTZFdbBbfBTUIORKZNLKfWDDRjBVvCK5BLDZtBDtBSNHpCSPOUYIwClC-B9BQDe0BIkCJNuBmBR-CgBMgBiBIGNSAUP;-L20BLdRIJaiBeGhB",
"french guiana":"1hCkDPPRBFMJCLLPIKSCSIQPYDcWiBqBNsBhBGPXjBLd",
"french southern and antarctic lands":"m2C38BaNmBDAHJR9BBBUKa",
"gabon":"8N_EjCqCXqBCMaoCoCCAwBSEYFYEGBDPMVeEKHRtBSXGfFZLRjBATUDRbDLJObdV",
"gambia":"hVuQGSsBAIKMCQJMAOGILRHPARINHRFjBA",
"georgia":"-zB-zBGQJcVOXGNMGE8CN2BRIHYGkBHOPYJJFUTFFVCdMJF1BFnBUpBB",
"greece":"ohB-zBLXJFrBGxBJcXTFVAVWFJIXURPJsBdAVlBKMTZDQjBZAhBSV6BjBqBBKSUCOOGAKqBMWAOIeBgBMcNkBEAUUL;0d0sBWN8BAAFWEFL5BDCIxBIIQ",
"greenland":"t6BqnDmKkBsOB6HdlNd0KEiBNrBXoJeuEX5JrB8CBtC3BCrBwBZhENqCVKhBpBD0BhB5CDiBdvDFyBrBjDGqDjBQfnCHvCoBObtBTgFD5V7F3DtDQfnBnC3BBpEgBnEwD7CuE8DuD5ENOwB2DJxFsBuBmBnD0C9E4BhJBzDmB6FQlIawJ2B7CcmHwBPSqPcsHf5CoB",
"guinea":"xK0JJAJPJAHKCQPYdHDkBTgBfAJHLAJTVRfoBVMJcLGSUMBaMDOGEAOUAcJoBECNYEKLSBgBUIBejBHJANIEEDBLMLHBBNSvBRLEHDPFA",
"guinea bissau":"9S6NTQRCHMAGLIDKWGOBKGqCBANFDENFDHALHLCRT",
"hungary":"oUy6BOaHIWAEQiBNiBGEImBEqBQqBLKEWJCJXJrB1B3BFtBPfIrBWHOFA",
"iceland":"jSizCJZuBZzBf1EhBjFSmBS1CUmCIBMzCIca8BG-BZ-BWyBLiCWiCD",
"iran":"sjCwuBgCeqCE2E9BEhBZtCQFPVQ5BeFEZlBjBkBtBoBRAhBUHCR5BTNtBjFaRwBRInCZ_D2B3B8CtBGPNVUAWLAGcTexBWbmBeuBBYbMtBuCF8BcKahBqBD-BiBMLNTkBTMbiCd4BFiCU",
"iraq":"44BgtBcLCXTNJfclByBVUdFbMAAVWTxBEdlBpCEvDwC7BcvBKPyB4CoBQyBDcWKUaSGuBFOJSGatB",
"ireland":"3HqjCGbdjBlCX5BGiBqBVqB2CyBIVHVYAeH",
"israel":"0sB8oBFLNGJbMDLFAJSGAPT_BZkCMOBCKSIgBGKOAEGKCCRFF",
"italy":"wPu6B4BJDTKPfGfNDfOTmBTUhBsBfgBAIHJHgCZoBdHNVUjBGPZcPDTPBVhBPDQqBbsBlCuBdCjCsBbYLmBzBS5BZESVEJgBOMLOCMkBHWOaDKQcFSIEQYFEIoBGKN;wLwzBYbFzBRCPNNKByBJWWBUM;sT6vBNfGLHVpDoBEW2DE",
"jordan":"usBwoBGMuBPuCsBQxBHFvCToBnBNFFNdFJNRLrBGBGUgCAQGMAY",
"kazakhstan":"24C60BrD_B9BUXqCvBezDJrE0ClDXAzEpCoB_BTAoB3CoCuDaAgC9ERpDwCsByCqBXEeyCsBmGrBiHIKShCcmCqBbaSOwJ4BoCJOnB8CDBVqEoB-DxEUWyDN-EpC_BdX5BtCOdnCjDZkBjCXhBxHmBbfhCOjBX",
"kosovo":"-Zy0BBHDADOHEJMIIKEGMGCOHEFIBIFGAJPCBhBH",
"kuwait":"-7BwlBKRDJMdbAJSjBEemBaB",
"kyrgyzstan":"24C60BKSaGiCNGYWI6BPsEBsBTFJ9BTNPzBFNXrBEhCZGJJHrCFxBMrBBEWsBFOMeD0BcvBWbJdOiBaLE",
"latvia":"qaimCCeUYkBOgBdgBCIeiBG0BRiBBSHETOXjCVlBUVCFIlBDjCEtBL",
"lebanon":"4sB0pBJBDFLAOgBUeSBGPVPJT",
"lesotho":"okBlkBOLNTFLVHHLNDdeWaUQUISL",
"liberia":"zJuFJApBUjBehBWbaKMCMkBoBUGQXBPIJKAKQKABLETHRMJMBSRF1B",
"libya":"ySycbNVW_BQRafSRFnBkCQQGiDN2BSKAiB8BmBCgB2EjBShBoEtBmBeJeqBmByCBORiCLKNNRGRJXMfAxLtBAAP_J4EnBV",
"lithuania":"uc-jCDKEK7BOHiBuBMkCDmBEGHWBmBTERhBLHVrBPlBAJMTG",
"luxembourg":"yH2-BIJBRLAJEGWKC",
"macedonia":"4Zq0BEACIuBKUAULCZHBFFVAPHZDPKFQGO",
"mali":"lPoSUgBoBJsBOgFAKctB-K-BAsItFKRsBRAZsBEA7CVZBZ5CJPNxCAlBPrBnBjBDvBlCH1BZJFQZNvBCJYLAIYdkBnBRbOXDbkD",
"malta":"mS6sBABHCAGIDAB;8RitBBBBCCCCB",
"mauritania":"lPoSzB6BtBW7BFNLDUMUEmBFwCdkBIO8EAF4BKWkBCAoDiEBA8B4EhD9BAmB3KIFJb_EAFJlBDnBKTf",
"moldova":"ohBo8BKGaEeLQBSJBNOFGPOLBDGFJBXCDEHBEHLLFNJDHSEQASXYLSNKLE",
"mongolia":"2tD09B0F8BoGpBoBaPYoBqBgEfId6FJgClB2CF0EsB-CNvBlCKP8CMkCnB9CP9EpC_BMTZUb5BjB5GxBjFqBzFEpB8BtFqBAgC1DkCJc",
"montenegro":"4Yk1BBIRTCLHCJORIEGGWOKGCMFGFcLLLJD",
"morocco":"vG2sBYPiDHe7CMHHP9CXBdtBPPTnCP_BdFlCnDHLfNBRzB3BpBL3BVf5CDoB8CkBgBamCcOYqBWQkBE2CoCJyBU2BacmCiBmBiCeA",
"namibia":"uU3jBtB8BfiEFmCjByBdoCfoBBekCOYRoFEcTiDFqDaqBL7BbPS7CPAtEnBBAnI5BXpBKXcRT",
"netherlands":"yH8iCiBAINJjBJPXAGpBVKZSjBJdEWKiB8B2BQ",
"new caledonia":"ovGra0BpBNJVKdSXWbcDOQAWNgBZ",
"new zealand":"o6GltBepBAaSJGdgBNcBWOUDV5BdAJLERpB3BdPXQYiBNWrBQCOcOG4BPiBhCwCOEWVgBJKjB;o4GjzBKRcQMPNjBvBrBQTfAhBPhBhCxBdpDSHOWeyBoB4CqB6B-BGWcSIP",
"niger":"2C-OCcvBIAUbsBCUkEYCaWaA8C6BS8H6EgCPWVcOK9BgBjBZ1EzBlBP1BQNAZaAPhBrBsBfVzBOvCVvBUnBJ1Be1BLTrCdYbL",
"north korea":"qjFg1BGHPEdbCbpBbbFPLFVQFWRFJtBDNRRCDDRIPLBIVKMSIEBIKWDGVETMiBYsBWacULiBBFW-BQQYaX",
"northern cyprus":"-oB-rBCAGKcBmBMbPCHDCFDFCBBDGTBFC",
"oman":"ypCsaNZRCHJHTCfRAZPLZZAPJAPRLVEtBPrB-C4DoBawCRcCQMQASSIHEEaUASZWN2BNcjBODTrBRN;wmCsgBFHHOMOGDDP",
"pakistan":"-9CuuBeTMdiCPnBhBnDETRc9BgBThBVAbnD7DvBErBpBaRkB1C3CAZZdKrB8BhGNOuB6BUBSTIAiBnBSjBuBkCVkDG0BSCiBWWwCMOMBYqBiBNamBAIeUQNkBYSkEa",
"poland":"4S8_BPaEOZkBMKJUsEsBoBFEJiFDUFWrBAPXHiBnCFLRDlBfMRvBQvBAVJVOPDTWdCDMbEFJTICMdETM",
"portugal":"pLs0BgBQKT2BEKTRLAdHFATRBQXJbMJDLPNENPJVGTFGgBDYREJQEaQOCQKYLuB",
"qatar":"w_B-eBeKUMEMLAXHVLDLI",
"republic of serbia":"ia44BaHCRYJMIKDJHIFJJENURPLFLEFFFfBBCKQFAPIDGNIFBFLJDEEbMRMKCGUTOKSNAQQNKHQeKYAWPEN",
"romania":"sc87BSIyBDSJ2BScDyBzBDhBIRSHSGSFCJTJLELvBXEbQjCT3CIPDTYKIJELHXKBSZIDOVQgBGsB2BYK",
"russia":"2lEmgDgJrB9FhCgMrBgKSgCTSZXPyBfgCPmBqBwJNbkB0BSqLZqE1ByHAiBPFdyBJ0IGmCjBwBMfaSS-LtBA_EnDNuC_BDb9GZlElC5Ba1Gb9B_BwBZF5B1BhBQRlCTNtB5BJlCtC1BwFS2BkBsByIkEgB4BtFvCfwBnDLjDjCiBX3ENEc9BGvJX5IrF4DnBmCS8BtC1B3EjIhHxBU7BrBKuDyCIuCmEhFb_BiClCMjC6D_CalEbWfxDhDtEepHlB_BmB5FKHe_DgB_B7CnGqBjG_B9EqCxDOTV9DyEpEnBCW7CENoBnCKvJ3BRNcZlCpBiCbJRhHHlGsBxCrBDdpBYrBxCqDvC_CnCsCvDxBXrC0B7GmBhEoC-BoBXQ8BQjBU8BOMkC7FoB_BmCtCJTmB4BMtC6BEepDYjB0BEyBkC2BpBSqE-C5BcQajBeaiBtBuBmBe9BaGcuEiBmKtCiBtBtBVvIQgCdG7ByCVRkBaQgDZiBKbe-CoBqCRYcrBoCwDLWVxBbgBNmJ4CeBlBX0GcuBXuBapBWUO-JlCcU5CiBJgCiEwCqDJd3BmBnBJ3BsBX9CzCsBFqDgCXYUa1BagBoBzBgBoCaJeqBVPlBqBHRckCQ8ETnBsC8HMfUuBagR2BwEyBoDd;36GozC-DMuCjBpDVPvB3GuBNcvBJDhBA-EqGlCBX;-nCs4CtHeFWyFqDJS8GuB0JM9M5C7DtCIfuChB;yzFu_BoBlC7BMX5BmBjCdYZfPmJmBqBoBvE;s1Fu-Cfd1GHvCasCkB6HX;-8D0iDnGG1E0B-FkBqF5BJjB;r_G04CzBBAagDJrBN;uc-jC7DEgCe8BhB;ghHy4CxBKyBQAZ;wzFw7C1EG4CU-BZ;sjE8hDhHPqD6B4DpB;-_B2kDtEVtDY8HB",
"saudi arabia":"w1BuUpC-DnCoCZgDnBY9C2ETAM0BsBFuC0BnBoB4CawBJsFrDuDHKRcAQhB2BnBErBWhBYDYhCgELSbZvC3DnBzDPzChCJO1DAPMXxB",
"senegal":"7UgRReTQSGeyBOMUDSKWAuBV0B5BIvBQJCbnBDbK9CCJFNCVFFekBAgBOSHQASIHMZFPKLBHJrBA",
"sierra leone":"pOwIJCdQTWFOFeWSKUMAKIgBAUfBJGLANKCjBnBBLJL",
"slovakia":"yX89BSCWNWKUDcEmBNJJHRJDpBMNBHHTFlBDDHhBFhBOBUGIgBEAEICCIKCGIMA",
"slovenia":"oRk6BiBBUIiBCIGGAINfJDPNDCLPANIHHbCKEJQEU",
"solomon islands":"ipGpMnBCHGCQaFOHGJ;kqG_LFHdkBHYMAQfQT;8nGtKAHjCuBGE0BbKN;-kGlJHBRIPSCGoBd;0qGjNMNbCPYgBL",
"somalia":"m-BwO2BQB1BhDzGxCjDnElD9BvCXiBAyEuB6BYAkBc0BCgFyFAuCgBI",
"somaliland":"m9B6LtB5BhBAhEwBPOdoBYkBMFIRSPmDOmCYWAAtC",
"south africa":"snBxkB5BrCnDzC9BPDLhEE1DlBvBaR-BMGBgBpC6DSUYbqBJ6BYA0EiBrBGnBcEkC8BkBP6BGMgBWEYqBkBcqCe2BFezCD7BfENnBYVWEISgBAP9BlBlB",
"south korea":"ugFowBiBtBKZAtBNVjBHfPjBDFWIeRqBeGbiBEESBOSuBEGK",
"spain":"pLs0BCcPS4Bc0HNQNqCROIuBRuBECVlBZzBJrBjCQVVRJZdHbf3CCpBdhBQJYlBGDOUaLKKcPYSCI4BSMJU1BDJUfP",
"sudan":"uqB6LJkBTOA8BRCbLOhBpBzBTDhBYpBjBpCKNHlBmBdFT1BZLROEuBpBgCHmBNBW8BHKc2BkBDBwFuBAAwC6OAanEkBX9BpBXnE7BpDTJLvB",
"swaziland":"ioBthBHRVDXWAOKQEKMEUHGRCR",
"sweden":"4bkyCnBZGZrEhCd3BkCxBlBtBnBJPhCVlBxBEVftBBLmB_BmDyByBOwBZUB2BakBmBAOQNOgEgEoBAKWsCFGaYC0DtBA9BOPjCL;mYuoCVLGLhBRAaWQcA;qV4nCXvBDOciB",
"switzerland":"gMu7BCHFJSHUADPRHbGJPRBHGVNTAPINSTHCUcWAKSDKGiBAIKsBL",
"syria":"wwB4pBtCrBtBQGGBSKUWQFQRCDeKQWSCWMHsBMWHgBAuBQWBuBITZVJEbPxB3CnB",
"taiwan":"o4EweX_BRhBViBDeYoBgBeSLFX",
"tajikistan":"44CqyBNLrBGDVsBCyBLsCGKlBMEYHGnBlCEXRfLPMEiBLCEMVKPNLVXALRNIbNLGWoBHedKKSiBBgBwB0BIHRGLQC",
"the bahamas":"9gD2dJBJYNMIYMBOfAX;ngDohBFbHEAWRQAEgBR;nhDohBrBHDQuBCCJ",
"tunisia":"8L8lBRoCXQAKhBYDeaWKiBHmBIUsBQcDAViBQCHTTAROJFhBZTIVUBKRQFBf7BlBERDPRJ",
"turkey":"kuB2zB6BPwCC6CYoBTChBuBVbJG7BUfRF7BQjEbtDEBVVRNSOQ5BGZX9BDfWrBCHRbDlBWrBB1B-BUgBZSuBmB8BCSesCDwBawDMmCb;giB8yBhBVLaWeTMsCGEPkBLnCX",
"turkmenistan":"wsCysBDiBbCtBiBrCapCDbVjBHAmCfOKcZCIiBmBJkBMpBuBfJDbLagCUaJcfiCCFWkCkB2BVEdOJ6BDSpBoCtBgDlBBXdMFNhBHHf1BRHRdFpBQ",
"ukraine":"4nBkhCuCKaXHTgBBOX0BNeGYTyCLPfEjBnBBTLBRhEhBCX-BHHNhDdVIIUrBMuBUpCUBOlBDtBzBjBARIYmBuBB1BkCtBOpDbjCORHXUcaLS-BwBTkBoCMwGXQeiBC",
"united arab emirates":"wgCqeGCCLgBI4BDyCuCINGfTADZIDRHARLPBPHH3DUPoBAK",
"united kingdom":"3DqpCpBrB0CGJhBjBjBoBBoBzBaFkB7ByBHFZTLQTjBV5DJRIZRlBEbPVI8BqBkBK_BGJQqBMVWGa8BDGYZYxBIJKQSNMVTBoBTUOoBgBiBwCA;hHmkCVb1BIIWHWgBAsBX",
"uruguay":"hoC3lBaEqBfOCoCvBYbRRMVRZtBVbIVDlBQZAZWEaIIAoBUqC",
"uzbekistan":"kzC2uBCY_CmBnCuBRqB5BENKDe1BWjCjBGVtBAA0EmDYmDvBmBjB0DKwBdDnBUAIhB0BAKTQAQesCiBMDhBZeNcKwBVzBbtBCCezBHfvBhBCJReJIdVnB1BI",
"vanuatu":"8wG1SGfJGHBFKAeSL;6xGxUNFLSAKaV",
"west bank":"usBwoBAXFLRFAKMGLEKcOF",
"western sahara":"_K8hBAWGABlChECAnDjBBJVG3B7EAHNCQ6CEEOSSM4B4BqBS0BOCMgBiBEgBFOKYA"};

/* ==== /pure ==== */

/* what this file hands back to index.html — the seam Phase 19 designed:
 * the app's own passportSVG/tastedCountryMap/landKey callers read these
 * as plain globals, the same way CARTA_LAND_NAMES already goes the other way. */
window.LANDS=LANDS;
window.landPts=landPts;
window.landRingsRaw=landRingsRaw;
window.landTopoRaw=landTopoRaw;
window.landKey=landKey;
window.landAnchor=landAnchor;
window.LAND_OFF_BELT=LAND_OFF_BELT;
window.WORLD=WORLD;
window.worldRingsRaw=worldRingsRaw;
window.sealBands=sealBands;
window.cityKey=cityKey;
window.cityRingsRaw=cityRingsRaw;
window.cityArcsRaw=cityArcsRaw;
window.cityWindow=cityWindow;
window.plateGround=plateGround;
/* the fourth element, defined last and deliberately: by here CITY_ARCS, cityKey
   and the caches above are all initialised, so the first upgrade paints a shore
   rather than throwing on a table that exists but cannot yet be touched. The
   other three are defined inside the closure because they only wait on LANDS. */
if(window.CARTA_CITY&&!window.customElements.get('carta-city'))customElements.define('carta-city',window.CARTA_CITY);

// the guard index.html's boot checks (ARCHITECTURE.md §1). The map had none
// until Phase 31, though the guard's own comment already claimed every sibling
// was covered — a stale carta-map.js is exactly the failure it exists to catch.
window.MAP_VERSION='7.46.4';
