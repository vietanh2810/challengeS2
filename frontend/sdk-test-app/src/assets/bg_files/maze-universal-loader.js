"use strict";(()=>{var c=s=>(t,e={})=>{let r=s.createElement("script");r.src=e.version?`${t}?t=${e.version}`:t,r.async=e.async||!1,r.defer=e.defer||!1,s.getElementsByTagName("head")[0].appendChild(r)},p=s=>(t,e={})=>{let r=s.createElement("link");r.href=e.version?`${t}?t=${e.version}`:t,r.rel=e.rel||"preload",r.as=e.as||"script",s.getElementsByTagName("head")[0].appendChild(r)};var l="https://snippet.maze.co",u="https://snippet.maze.co/lwt";var g="maze-connected-check-request",f="maze-connected-check-response",E="maze-beacon-signal",m=!1;function d(s,t){m=!0;let e=s.sessionStorage.getItem("maze-us")||"";c(t)(n.lwt,{version:e}),p(t)(n.lwtCommon,{version:e})}function z(s,t){s.addEventListener("message",e=>{!e.source||!e.origin||(e.data===g&&e.source.postMessage({type:f,body:{apiKey:s.mazeUniversalSnippetApiKey}},e.origin),e.data===E&&!m&&d(s,t))},{passive:!0})}var n={lwt:`${l}/lwtScaffold.js`,lwtCommon:`${u}/maze-lwt-ui-common.js`,contextual:`${l}/contextualScaffold.js`};function C(s){var a;let t=new URL(s.location.href),e=!!s.opener,r=!!((a=s.sessionStorage)!=null&&a.getItem("maze:lwt-start")),o=t.searchParams.has("lwt");return e&&(r||o)}var T=s=>{let t=[],e=[];return C(s)?(m=!0,t.push(n.lwt),e.push(n.lwtCommon)):t.push(n.contextual),{mazeScripts:t,mazePreLoadScripts:e}};function h(s){let t=s.sessionStorage.getItem("maze-us")||"";if(t)return t;t=`${new Date().getTime()}`;try{s.sessionStorage.setItem("maze-us",t)}catch(e){}return t}function S(s,t){let e=h(s),{mazeScripts:r,mazePreLoadScripts:o}=T(s);r.forEach(function(i){c(t)(i,{version:e,async:!0})}),o.forEach(function(i){p(t)(i,{version:e})}),s.opener&&z(s,t)}S(window,document);})();
