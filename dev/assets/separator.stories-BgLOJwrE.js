import{j as e}from"./iframe-B2FihN7C.js";import{S as r}from"./separator-n8Cj2e87.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";import"./index-DfGb4vk9.js";import"./index-Chw98AJh.js";const m={title:"Components/Separator",component:r,parameters:{docs:{description:{component:"Ligne de séparation visuelle, horizontale ou verticale. Décorative par défaut (masquée de l'arbre d'accessibilité)."}}}},t={render:()=>e.jsxs("div",{children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("h4",{className:"text-sm font-medium leading-none",children:"Radix Primitives"}),e.jsx("p",{className:"text-muted-foreground text-sm",children:"An open-source UI component library."})]}),e.jsx(r,{className:"my-4"}),e.jsxs("div",{className:"flex h-5 items-center gap-4 text-sm",children:[e.jsx("div",{children:"Blog"}),e.jsx(r,{orientation:"vertical"}),e.jsx("div",{children:"Docs"}),e.jsx(r,{orientation:"vertical"}),e.jsx("div",{children:"Source"})]})]})},i={render:()=>e.jsxs("div",{className:"flex h-5 items-center gap-4 text-sm",children:[e.jsx("div",{children:"Item 1"}),e.jsx(r,{orientation:"vertical"}),e.jsx("div",{children:"Item 2"}),e.jsx(r,{orientation:"vertical"}),e.jsx("div",{children:"Item 3"})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">An open-source UI component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex h-5 items-center gap-4 text-sm">
      <div>Item 1</div>
      <Separator orientation="vertical" />
      <div>Item 2</div>
      <Separator orientation="vertical" />
      <div>Item 3</div>
    </div>
}`,...i.parameters?.docs?.source}}};const l=["Horizontal","Vertical"];export{t as Horizontal,i as Vertical,l as __namedExportsOrder,m as default};
