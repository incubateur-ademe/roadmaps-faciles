import{j as e}from"./iframe-BcyfjZH2.js";import{B as a}from"./button-BU0rPqX-.js";import{I as l}from"./input-5Upp4kX3.js";import{L as d}from"./label-DXEOaO3m.js";import{P as s,a as o,b as i}from"./popover-CPj6Ndpp.js";import"./preload-helper-Bg6SFuRg.js";import"./index-fNaMV5Ky.js";import"./cn-Ia6N7uSy.js";import"./index-BcLzogVk.js";import"./index-Ci4M2BYY.js";import"./index-BQlpQe1r.js";import"./index-B80VdNFB.js";import"./index-Bc7gOKRe.js";import"./index-B-jGJKC1.js";import"./index-CNFrgnUn.js";import"./index-D0tx0hrS.js";import"./index-W4PQkU0l.js";import"./index-BhsvWzXz.js";import"./index-C9LbcBlT.js";import"./index-DJ-lhrq-.js";import"./index-CS8GyP0I.js";const w={title:"Components/Popover",component:s,parameters:{docs:{description:{component:"Panneau de contenu flottant ancré à un élément déclencheur. Supporte l'alignement configurable et le décalage latéral."}}}},n={render:()=>e.jsx("div",{className:"flex justify-center",children:e.jsxs(s,{children:[e.jsx(o,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Open Popover"})}),e.jsx(i,{children:e.jsxs("div",{className:"grid gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium leading-none",children:"Dimensions"}),e.jsx("p",{className:"text-muted-foreground text-sm",children:"Set the dimensions for the layer."})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsxs("div",{className:"grid grid-cols-3 items-center gap-4",children:[e.jsx(d,{htmlFor:"width",children:"Width"}),e.jsx(l,{id:"width",defaultValue:"100%",className:"col-span-2 h-8"})]}),e.jsxs("div",{className:"grid grid-cols-3 items-center gap-4",children:[e.jsx(d,{htmlFor:"height",children:"Height"}),e.jsx(l,{id:"height",defaultValue:"25px",className:"col-span-2 h-8"})]})]})]})})]})})},r={render:()=>e.jsx("div",{className:"flex justify-center",children:e.jsxs(s,{children:[e.jsx(o,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Align Start"})}),e.jsx(i,{align:"start",children:e.jsx("p",{className:"text-sm",children:"Content aligned to start."})})]})})},t={render:()=>e.jsxs(s,{children:[e.jsx(o,{asChild:!0,children:e.jsx(a,{variant:"outline",children:"Align End"})}),e.jsx(i,{align:"end",children:e.jsx("p",{className:"text-sm",children:"Content aligned to end."})})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Width</Label>
                <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">Height</Label>
                <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Align Start</Button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <p className="text-sm">Content aligned to start.</p>
        </PopoverContent>
      </Popover>
    </div>
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Align End</Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <p className="text-sm">Content aligned to end.</p>
      </PopoverContent>
    </Popover>
}`,...t.parameters?.docs?.source}}};const D=["Default","AlignStart","AlignEnd"];export{t as AlignEnd,r as AlignStart,n as Default,D as __namedExportsOrder,w as default};
