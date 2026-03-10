import{j as e}from"./iframe-B2FihN7C.js";import{C as i}from"./checkbox-B9ExHG32.js";import{I as d}from"./input-DmP-cY_k.js";import{L as o}from"./label-4moIyiQR.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";import"./check-CvL3Vtsu.js";import"./createLucideIcon-ClrF36kq.js";import"./index-Chw98AJh.js";import"./index-kqGLAE-E.js";import"./index-DIyHDetT.js";import"./index-cnXatIDB.js";import"./index-DsU45zuq.js";import"./index-D9aAw9cH.js";import"./index-DM1C2U8C.js";import"./index-DfGb4vk9.js";const I={title:"Components/Label",component:o,args:{children:"Label text"},parameters:{docs:{description:{component:"Label de formulaire accessible basé sur Radix. S'atténue automatiquement quand le champ associé est désactivé."}}}},r={},a={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm gap-1.5",children:[e.jsx(o,{htmlFor:"name",children:"Name"}),e.jsx(d,{id:"name",placeholder:"Enter your name"})]})},s={render:()=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(i,{id:"agree"}),e.jsx(o,{htmlFor:"agree",children:"I agree to the terms"})]})},t={render:()=>e.jsxs("div",{className:"group grid w-full max-w-sm gap-1.5","data-disabled":"true",children:[e.jsx(o,{htmlFor:"disabled",children:"Disabled Label"}),e.jsx(d,{id:"disabled",disabled:!0,placeholder:"Disabled"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Enter your name" />
    </div>
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
      <Checkbox id="agree" />
      <Label htmlFor="agree">I agree to the terms</Label>
    </div>
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="group grid w-full max-w-sm gap-1.5" data-disabled="true">
      <Label htmlFor="disabled">Disabled Label</Label>
      <Input id="disabled" disabled placeholder="Disabled" />
    </div>
}`,...t.parameters?.docs?.source}}};const N=["Default","WithInput","WithCheckbox","Disabled"];export{r as Default,t as Disabled,s as WithCheckbox,a as WithInput,N as __namedExportsOrder,I as default};
