import{j as e}from"./iframe-BcyfjZH2.js";import{H as n}from"./hint--1vJMaFR.js";import{L as m}from"./label-DXEOaO3m.js";import{T as o}from"./textarea-DwIM3UVm.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";import"./circle-alert-Basel7YM.js";import"./createLucideIcon-CVwuA9hd.js";import"./index-Ci4M2BYY.js";import"./index-BcLzogVk.js";const b={title:"Components/Textarea",component:o,args:{placeholder:"Type your message here..."},parameters:{docs:{description:{component:"Zone de texte auto-dimensionnante via `field-sizing: content`. Hauteur minimum 64px, avec support de la validation et du mode sombre."}}}},a={},r={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm gap-1.5",children:[e.jsx(m,{htmlFor:"message",children:"Votre message"}),e.jsx(o,{id:"message",placeholder:"Écrivez votre message ici."}),e.jsx(n,{children:"Maximum 500 caractères."})]})},s={args:{disabled:!0,value:"Disabled textarea"}},t={args:{defaultValue:"This is some default text content that was pre-filled."}},i={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm gap-1.5",children:[e.jsx(m,{htmlFor:"bio",children:"Biographie"}),e.jsx(o,{id:"bio",defaultValue:"x","aria-invalid":!0}),e.jsx(n,{variant:"error",children:"Le texte doit contenir au moins 10 caractères."})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="message">Votre message</Label>
      <Textarea id="message" placeholder="Écrivez votre message ici." />
      <Hint>Maximum 500 caractères.</Hint>
    </div>
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    value: "Disabled textarea"
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "This is some default text content that was pre-filled."
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="bio">Biographie</Label>
      <Textarea id="bio" defaultValue="x" aria-invalid />
      <Hint variant="error">Le texte doit contenir au moins 10 caractères.</Hint>
    </div>
}`,...i.parameters?.docs?.source}}};const j=["Default","WithLabel","Disabled","WithDefaultValue","Invalid"];export{a as Default,s as Disabled,i as Invalid,t as WithDefaultValue,r as WithLabel,j as __namedExportsOrder,b as default};
