import{j as e}from"./iframe-B2FihN7C.js";import{A as r,a as s,b as t}from"./alert-B9AZh4Fh.js";import{I as d}from"./info-DUUmzHKX.js";import{C as m}from"./circle-alert-Dc398Jgd.js";import{C as p,T as u}from"./triangle-alert-LhsqI2Q8.js";import"./preload-helper-Bg6SFuRg.js";import"./index-fNaMV5Ky.js";import"./cn-Ia6N7uSy.js";import"./createLucideIcon-ClrF36kq.js";const N={title:"Components/Alert",component:r,parameters:{docs:{description:{component:"Bandeau d'alerte contextuel avec code couleur par variante (default, destructive, success, warning)."}}}},n={render:()=>e.jsxs(r,{children:[e.jsx(d,{className:"size-4"}),e.jsx(s,{children:"Default Alert"}),e.jsx(t,{children:"This is a default alert with an informational message."})]})},a={render:()=>e.jsxs(r,{variant:"destructive",children:[e.jsx(m,{className:"size-4"}),e.jsx(s,{children:"Error"}),e.jsx(t,{children:"Something went wrong. Please try again later."})]})},i={render:()=>e.jsxs(r,{variant:"success",children:[e.jsx(p,{className:"size-4"}),e.jsx(s,{children:"Success"}),e.jsx(t,{children:"Your changes have been saved successfully."})]})},l={render:()=>e.jsxs(r,{variant:"warning",children:[e.jsx(u,{className:"size-4"}),e.jsx(s,{children:"Warning"}),e.jsx(t,{children:"This action cannot be undone."})]})},c={render:()=>e.jsxs(r,{children:[e.jsx(s,{children:"No Icon"}),e.jsx(t,{children:"This alert has no icon."})]})},o={render:()=>e.jsxs(r,{children:[e.jsx(d,{className:"size-4"}),e.jsx(s,{children:"Title only alert"})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Alert>
      <Info className="size-4" />
      <AlertTitle>Default Alert</AlertTitle>
      <AlertDescription>This is a default alert with an informational message.</AlertDescription>
    </Alert>
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong. Please try again later.</AlertDescription>
    </Alert>
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <Alert variant="success">
      <CheckCircle2 className="size-4" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Your changes have been saved successfully.</AlertDescription>
    </Alert>
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Alert variant="warning">
      <TriangleAlert className="size-4" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>This action cannot be undone.</AlertDescription>
    </Alert>
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Alert>
      <AlertTitle>No Icon</AlertTitle>
      <AlertDescription>This alert has no icon.</AlertDescription>
    </Alert>
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Alert>
      <Info className="size-4" />
      <AlertTitle>Title only alert</AlertTitle>
    </Alert>
}`,...o.parameters?.docs?.source}}};const S=["Default","Destructive","Success","Warning","WithoutIcon","TitleOnly"];export{n as Default,a as Destructive,i as Success,o as TitleOnly,l as Warning,c as WithoutIcon,S as __namedExportsOrder,N as default};
