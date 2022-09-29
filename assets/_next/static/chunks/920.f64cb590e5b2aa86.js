"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[920],{8176:function(e,n,t){Object.defineProperty(n,"__esModule",{value:!0});var a=t(9805);Object.keys(a).forEach((function(e){"default"!==e&&"__esModule"!==e&&(e in n&&n[e]===a[e]||Object.defineProperty(n,e,{enumerable:!0,get:function(){return a[e]}}))}))},8920:function(e,n,t){Object.defineProperty(n,"__esModule",{value:!0});var a=t(1130);Object.keys(a).forEach((function(e){"default"!==e&&"__esModule"!==e&&(e in n&&n[e]===a[e]||Object.defineProperty(n,e,{enumerable:!0,get:function(){return a[e]}}))}))},9280:function(e,n,t){Object.defineProperty(n,"__esModule",{value:!0});var a=t(6751);Object.keys(a).forEach((function(e){"default"!==e&&"__esModule"!==e&&(e in n&&n[e]===a[e]||Object.defineProperty(n,e,{enumerable:!0,get:function(){return a[e]}}))}))},39:function(e,n,t){Object.defineProperty(n,"__esModule",{value:!0});var a=t(1610);Object.keys(a).forEach((function(e){"default"!==e&&"__esModule"!==e&&(e in n&&n[e]===a[e]||Object.defineProperty(n,e,{enumerable:!0,get:function(){return a[e]}}))}))},920:function(e,n,t){t.r(n),t.d(n,{default:function(){return x}});var a=t(828),r=t(943);var i=t(3375);var c=t(1566);function o(e){return function(e){if(Array.isArray(e))return(0,r.Z)(e)}(e)||(0,i.Z)(e)||(0,c.Z)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var l=t(5893),u=t(7294),d=t(7063),s=t(9280),f=t(8176),h=t(39),b=t(8920),p=t(1967),g=function(e,n){return o(new Array(n-e+1)).map((function(n,t){return t+e}))},j=function(e){var n=e.currentPage,t=void 0===n?1:n,a=e.pageCount,r=e.onPageChange,i=u.useCallback((function(){r(Math.min(t+1,a))}),[t,a]),c=u.useCallback((function(){r(Math.max(t-1,1))}),[t]),o=u.useCallback((function(e){r(e)}),[]),d=function(e,n){var t;t=n<=7?7:e>4&&e<n-3?2:4;var a=Math.round(e-t/2),r=Math.round(e+t/2);a-1!==1&&r+1!==n||(a+=1,r+=1);var i=e>t?g(Math.min(a,n-t),Math.min(r,n)):g(1,Math.min(n,t+1)),c=function(e,t){return i.length+1!==n?t:[e]};return 1!==i[0]&&(i=c(1,[1,-1]).concat(i)),i[i.length-1]<n&&(i=i.concat(c(n,[-1,n]))),i}(t,a);return(0,l.jsx)(b.Pagination,{label:"paged pagination navigation",children:(0,l.jsxs)(b.PaginationItems,{children:[(0,l.jsx)(b.PaginationArrow,{label:"Go to previous page",variant:"back",onClick:c,disabled:1===t}),(0,l.jsx)(b.PaginationNumbers,{children:d.map((function(e,n){return-1===e?(0,l.jsx)(b.PaginationEllipsis,{label:"Collapsed previous pages"},"pagination-number-".concat(n)):(0,l.jsx)(b.PaginationNumber,{label:"Go to page ".concat(e),isCurrent:t===e,onClick:function(){o(e)},children:e},"pagination-number-".concat(n))}))}),(0,l.jsx)(b.PaginationArrow,{label:"Go to next page",variant:"forward",onClick:i,disabled:t===a})]})})},m=function(e){var n=e.onClick,t=e.id,a=e.indeterminate,r=e.checked,i=e.label,c=u.createRef(),o=u.useCallback((function(){if(null!=c.current)return n(!c.current.checked)}),[n,c]),h=u.useCallback((function(e){if(null!=c.current)return 32===e.keyCode||13===e.keyCode?n(!c.current.checked):void 0}),[n,c]);return(0,l.jsx)(d.Box,{position:"absolute",top:"0",left:"0",right:"0",bottom:"0",display:"flex",justifyContent:"center",alignItems:"center",onClick:o,cursor:"pointer",children:(0,l.jsx)(d.Box,{marginLeft:"space20",children:(0,l.jsx)(f.Checkbox,{id:t,checked:r,onKeyDown:h,ref:c,indeterminate:a,children:(0,l.jsx)(s.ScreenReaderOnly,{children:i})})})})},x=function(e){u.useEffect((function(){console.log("Paginated Data Grid, data updated, data.len now: ",e.data.length)}),[e.data]);var n=(0,h.useUIDSeed)(),t=(0,a.Z)(u.useState(e.data.map((function(){return!1}))),2),r=t[0],i=t[1],c=function(n){i(n),e.handleCheckedItems&&e.handleCheckedItems(n)},s=(0,a.Z)(u.useState(1),2),b=s[0],g=s[1],x=r.every(Boolean),k=r.some(Boolean)&&!x,v=10*(b-1),C=Math.min(v+10-1,e.data.length),y=u.useCallback((function(e){g(e)}),[]);return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(f.CheckboxGroup,{name:"items",legend:"",children:(0,l.jsxs)(p.DataGrid,{"aria-label":"example grid",children:[(0,l.jsx)(p.DataGridHead,{children:(0,l.jsxs)(p.DataGridRow,{children:[(0,l.jsx)(p.DataGridHeader,{"data-testid":"first-cell",width:"55px",children:(0,l.jsx)(m,{onClick:function(e){var n=r.map((function(){return e}));c(n)},id:n("select-all"),checked:x,indeterminate:k,label:"Select all"})}),e.headers.map((function(e){return(0,l.jsx)(p.DataGridHeader,{children:e},e)}))]})}),(0,l.jsx)(p.DataGridBody,{children:e.data&&e.data.filter((function(e,n){return n>=v&&n<=C})).map((function(e,t){var a=t+v;return(0,l.jsxs)(p.DataGridRow,{selected:r[a],children:[(0,l.jsx)(p.DataGridCell,{"data-testid":"cell-".concat(a,"-0"),children:(0,l.jsx)(m,{onClick:function(e){var n=o(r);n[a]=e,c(n)},id:n("row-".concat(a,"-checkbox")),checked:r[a],label:"Select row ".concat(a)})}),e.map((function(e,n){return(0,l.jsx)(p.DataGridCell,{"data-testid":"cell-".concat(a,"-").concat(n+1),children:e},"col-".concat(n))}))]},"row-".concat(a))}))})]})}),(0,l.jsx)(d.Box,{display:"flex",justifyContent:"center",marginTop:"space70",children:(0,l.jsx)(j,{currentPage:b,pageCount:Math.ceil((e.data.length>0?e.data.length:0)/10),onPageChange:y})})]})}}}]);