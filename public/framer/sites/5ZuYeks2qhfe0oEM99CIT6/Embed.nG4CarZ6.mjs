import{t as e}from"./rolldown-runtime.V3gPc3Ui.mjs";import{B as t,I as n,M as r,P as i,R as a,T as o,k as s,l as c,s as l}from"./react.CLAAYyxD.mjs";import{S as u,r as d,v as f,z as p}from"./framer.Bmp5mwVR.mjs";var m,h,g=e((()=>{p(),m={position:`relative`,width:`100%`,height:`100%`,display:`flex`,justifyContent:`center`,alignItems:`center`},h={...m,borderRadius:6,background:`rgba(136, 85, 255, 0.3)`,color:`#85F`,border:`1px dashed #85F`,flexDirection:`column`},d.EventHandler,d.EventHandler,d.EventHandler,d.Number,d.Boolean,d.String,d.Enum})),_=e((()=>{p(),o()})),v=e((()=>{o()})),y=e((()=>{p()})),b=e((()=>{p()})),x=e((()=>{o()})),S=e((()=>{p()})),C=e((()=>{a(),o()})),w=e((()=>{o(),b()})),T=e((()=>{o(),p(),b(),v()})),E=e((()=>{p(),o(),g()}));function D(){return r(()=>f.current()===f.canvas,[])}var O=e((()=>{o(),p()})),k=e((()=>{o()})),A=e((()=>{o(),p(),d.FusedNumber,d.FusedNumber})),j=e((()=>{g(),_(),v(),y(),b(),x(),S(),C(),w(),T(),E(),O(),k(),A()})),M=e((()=>{j()}));function N({type:e,url:t,html:n,style:r={}}){return e===`url`&&t?c(F,{url:t,style:r}):e===`html`&&n?c(L,{html:n,style:r}):c(P,{style:r})}function P({style:e}){return c(`div`,{style:{minHeight:W(e),...h,overflow:`hidden`,...e},children:c(`div`,{style:q,children:`To embed a website or widget, add it to the properties\xA0panel.`})})}function F({url:e,style:t}){let r=!t.height;/[a-z]+:\/\//.test(e)||(e=`https://`+e);let a=D(),[o,s]=n(a?void 0:!1);return i(()=>{if(!a)return;let t=!0;s(void 0);async function n(){let n=await fetch(`https://api.framer.com/functions/check-iframe-url?url=`+encodeURIComponent(e));if(n.status==200){let{isBlocked:e}=await n.json();t&&s(e)}else{let e=await n.text();console.error(e),s(Error(`This site can’t be reached.`))}}return n().catch(e=>{console.error(e),s(e)}),()=>{t=!1}},[e]),a&&r?c(U,{message:`URL embeds do not support auto height.`,style:t}):e.startsWith(`https://`)?o===void 0?c(H,{}):o instanceof Error?c(U,{message:o.message,style:t}):o===!0?c(U,{message:`Can’t embed ${e} due to its content security policy.`,style:t}):c(`iframe`,{src:e,style:{...G,...t},loading:`lazy`,fetchPriority:a?`low`:`auto`,referrerPolicy:`no-referrer`,sandbox:I(a)}):c(U,{message:`Unsupported protocol.`,style:t})}function I(e){let t=[`allow-same-origin`,`allow-scripts`];return e||t.push(`allow-downloads`,`allow-forms`,`allow-modals`,`allow-orientation-lock`,`allow-pointer-lock`,`allow-popups`,`allow-popups-to-escape-sandbox`,`allow-presentation`,`allow-storage-access-by-user-activation`,`allow-top-navigation-by-user-activation`),t.join(` `)}function L({html:e,...t}){if(e.includes(`<\/script>`)){let n=e.includes(`</spline-viewer>`),r=e.includes(`<!-- framer-direct-embed -->`);return c(n||r?z:R,{html:e,...t})}return c(B,{html:e,...t})}function R({html:e,style:r}){let a=s(),[o,l]=n(0);i(()=>{let e=a.current?.contentWindow;function n(t){if(t.source!==e)return;let n=t.data;if(typeof n!=`object`||!n)return;let r=n.embedHeight;typeof r==`number`&&l(r)}return t.addEventListener(`message`,n),e?.postMessage(`getEmbedHeight`,`*`),()=>{t.removeEventListener(`message`,n)}},[]);let u=`
<html>
    <head>
        <style>
            html, body {
                margin: 0;
                padding: 0;
            }

            body {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }

            :root {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            * {
                box-sizing: border-box;
                -webkit-font-smoothing: inherit;
            }

            h1, h2, h3, h4, h5, h6, p, figure {
                margin: 0;
            }

            body, input, textarea, select, button {
                font-size: 12px;
                font-family: sans-serif;
            }
        </style>
    </head>
    <body>
        ${e}
        <script type="module">
            let height = 0

            function sendEmbedHeight() {
                window.parent.postMessage({
                    embedHeight: height
                }, "*")
            }

            const observer = new ResizeObserver((entries) => {
                if (entries.length !== 1) return
                const entry = entries[0]
                if (entry.target !== document.body) return

                height = entry.contentRect.height
                sendEmbedHeight()
            })

            observer.observe(document.body)

            window.addEventListener("message", (event) => {
                if (event.source !== window.parent) return
                if (event.data !== "getEmbedHeight") return
                sendEmbedHeight()
            })
        <\/script>
    <body>
</html>
`,d={...G,...r};return r.height||(d.height=o+`px`),c(`iframe`,{ref:a,style:d,srcDoc:u})}function z({html:e,style:t}){let n=s();return i(()=>{let t=n.current;if(t)return t.innerHTML=e,V(t),()=>{t.innerHTML=``}},[e]),c(`div`,{ref:n,style:{...K,...t}})}function B({html:e,style:t}){return c(`div`,{style:{...K,...t},dangerouslySetInnerHTML:{__html:e}})}function V(e){if(e instanceof Element&&e.tagName===`SCRIPT`){let t=document.createElement(`script`);t.text=e.innerHTML;for(let{name:n,value:r}of e.attributes)t.setAttribute(n,r);e.parentElement.replaceChild(t,e)}else for(let t of e.childNodes)V(t)}function H(){return c(`div`,{className:`framerInternalUI-componentPlaceholder`,style:{...m,overflow:`hidden`},children:c(`div`,{style:q,children:`Loading…`})})}function U({message:e,style:t}){return c(`div`,{className:`framerInternalUI-errorPlaceholder`,style:{minHeight:W(t),...m,overflow:`hidden`,...t},children:c(`div`,{style:q,children:e})})}function W(e){if(!e.height)return 200}var G,K,q,J=e((()=>{a(),l(),o(),p(),M(),u(N,{type:{type:d.Enum,defaultValue:`url`,displaySegmentedControl:!0,options:[`url`,`html`],optionTitles:[`URL`,`HTML`]},url:{title:`URL`,type:d.String,description:`Some websites don’t support embedding.`,hidden(e){return e.type!==`url`}},html:{title:`HTML`,type:d.String,displayTextArea:!0,hidden(e){return e.type!==`html`}}}),G={width:`100%`,height:`100%`,border:`none`},K={width:`100%`,height:`100%`,display:`flex`,flexDirection:`column`,justifyContent:`center`,alignItems:`center`},q={textAlign:`center`,minWidth:140}}));export{J as n,N as t};
//# sourceMappingURL=Embed.nG4CarZ6.mjs.map