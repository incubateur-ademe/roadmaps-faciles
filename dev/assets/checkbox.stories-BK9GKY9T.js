import{j as e}from"./iframe-BcyfjZH2.js";import{C as c}from"./checkbox-HZGXkFcw.js";import{L as i}from"./label-DXEOaO3m.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";import"./check-DRbSZmQh.js";import"./createLucideIcon-CVwuA9hd.js";import"./index-BcLzogVk.js";import"./index-Bc7gOKRe.js";import"./index-BQlpQe1r.js";import"./index-B80VdNFB.js";import"./index-QjQbZVBU.js";import"./index-C9LbcBlT.js";import"./index-CS8GyP0I.js";import"./index-Ci4M2BYY.js";const D={title:"Components/Checkbox",component:c,parameters:{docs:{description:{component:"Case à cocher accessible avec indicateur visuel. Basée sur Radix, supporte l'état indéterminé."}}}},r={},s={args:{defaultChecked:!0}},a={args:{disabled:!0}},t={args:{disabled:!0,defaultChecked:!0}},o={render:()=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(c,{id:"terms"}),e.jsx(i,{htmlFor:"terms",children:"Accept terms and conditions"})]})},d={render:()=>e.jsxs("div",{className:"group flex items-center gap-2","data-disabled":"true",children:[e.jsx(c,{id:"terms-disabled",disabled:!0}),e.jsx(i,{htmlFor:"terms-disabled",children:"Accept terms and conditions"})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: true
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultChecked: true
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="group flex items-center gap-2" data-disabled="true">
      <Checkbox id="terms-disabled" disabled />
      <Label htmlFor="terms-disabled">Accept terms and conditions</Label>
    </div>
}`,...d.parameters?.docs?.source}}};const S=["Default","Checked","Disabled","DisabledChecked","WithLabel","WithLabelDisabled"];export{s as Checked,r as Default,a as Disabled,t as DisabledChecked,o as WithLabel,d as WithLabelDisabled,S as __namedExportsOrder,D as default};
