"use client";import{i as e,t}from"./react.SIfiwpqq.js";import{t as n}from"./jsx-runtime.XNvk5S4D.js";var r=e(t(),1),i=n();function a({text:e,className:t=``,fontSize:n,color:a=`#F0EDE8`,speed:o=1}){let s=(0,r.useRef)(null),c=(0,r.useRef)(0),l=(0,r.useRef)(0);(0,r.useEffect)(()=>{let e=s.current;if(!e)return;let t=e.querySelector(`#lm-turbulence`),n=e.querySelector(`#lm-displacement`),r=!1,i=()=>{l.current+=.012*o;let e=l.current;if(t){let n=.012+Math.sin(e*.7)*.004,r=.018+Math.cos(e*.5)*.006;t.setAttribute(`baseFrequency`,`${n} ${r}`)}if(n){let e=r?14:6,t=parseFloat(n.getAttribute(`scale`)||`6`),i=t+(e-t)*.08;n.setAttribute(`scale`,`${i}`)}c.current=requestAnimationFrame(i)},a=e.parentElement;return a&&(a.addEventListener(`mouseenter`,()=>{r=!0}),a.addEventListener(`mouseleave`,()=>{r=!1})),i(),()=>{cancelAnimationFrame(c.current)}},[o]);let u=`liquid-metal-filter`;return(0,i.jsxs)(`span`,{className:`relative inline-block ${t}`,style:{isolation:`isolate`},children:[(0,i.jsx)(`svg`,{ref:s,className:`absolute pointer-events-none opacity-0 w-0 h-0`,"aria-hidden":`true`,children:(0,i.jsx)(`defs`,{children:(0,i.jsxs)(`filter`,{id:u,x:`-20%`,y:`-20%`,width:`140%`,height:`140%`,children:[(0,i.jsx)(`feTurbulence`,{id:`lm-turbulence`,type:`fractalNoise`,baseFrequency:`0.012 0.018`,numOctaves:`4`,seed:`7`,result:`noise`}),(0,i.jsx)(`feDisplacementMap`,{id:`lm-displacement`,in:`SourceGraphic`,in2:`noise`,scale:`6`,xChannelSelector:`R`,yChannelSelector:`G`,result:`displaced`}),(0,i.jsx)(`feComposite`,{in:`displaced`,in2:`SourceGraphic`,operator:`over`})]})})}),(0,i.jsx)(`span`,{className:`relative font-mono tracking-[0.1em] uppercase select-none ${n?``:`inherit-font-size`}`,style:{...n?{fontSize:typeof n==`number`?`${n}px`:n}:{},background:`linear-gradient(
            135deg,
            #fff 0%,
            ${a} 20%,
            #aaa 35%,
            ${a} 50%,
            #ddd 65%,
            ${a} 80%,
            #aaa 100%
          )`,backgroundSize:`300% 300%`,WebkitBackgroundClip:`text`,WebkitTextFillColor:`transparent`,backgroundClip:`text`,filter:`url(#${u})`,animation:`liquidShimmer ${3/o}s ease-in-out infinite alternate`,willChange:`filter`},children:e}),(0,i.jsx)(`style`,{children:`
        @keyframes liquidShimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `})]})}export{a as default};