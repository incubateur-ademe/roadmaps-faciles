import{j as e}from"./iframe-B2FihN7C.js";import{A as i,a as o,b as t,c as r}from"./accordion-DYoY3A-9.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";import"./chevron-down-C45GFDLV.js";import"./createLucideIcon-ClrF36kq.js";import"./index-kqGLAE-E.js";import"./index-BMHBUb9M.js";import"./index-Chw98AJh.js";import"./index-DIyHDetT.js";import"./index-cnXatIDB.js";import"./index-DfGb4vk9.js";import"./index-DM1C2U8C.js";import"./index-pkf867cR.js";const T={title:"Components/Accordion",component:i,parameters:{docs:{description:{component:"Sections de contenu dépliables basées sur Radix. Supporte l'ouverture simple ou multiple, avec des transitions animées d'ouverture/fermeture."}}}},n={render:()=>e.jsxs(i,{type:"single",collapsible:!0,className:"w-full max-w-md",children:[e.jsxs(o,{value:"item-1",children:[e.jsx(t,{children:"Is it accessible?"}),e.jsx(r,{children:"Yes. It adheres to the WAI-ARIA design pattern."})]}),e.jsxs(o,{value:"item-2",children:[e.jsx(t,{children:"Is it styled?"}),e.jsx(r,{children:"Yes. It comes with default styles that match the design system."})]}),e.jsxs(o,{value:"item-3",children:[e.jsx(t,{children:"Is it animated?"}),e.jsx(r,{children:"Yes. It uses CSS animations for smooth open/close transitions."})]})]})},c={parameters:{docs:{description:{story:"Permet d'ouvrir plusieurs items simultanément (pas de fermeture automatique)."}}},render:()=>e.jsxs(i,{type:"multiple",className:"w-full max-w-md",children:[e.jsxs(o,{value:"item-1",children:[e.jsx(t,{children:"First item"}),e.jsx(r,{children:"Content for the first item."})]}),e.jsxs(o,{value:"item-2",children:[e.jsx(t,{children:"Second item"}),e.jsx(r,{children:"Content for the second item."})]}),e.jsxs(o,{value:"item-3",children:[e.jsx(t,{children:"Third item"}),e.jsx(r,{children:"Content for the third item."})]})]})},s={render:()=>e.jsxs(i,{type:"single",collapsible:!0,defaultValue:"item-1",className:"w-full max-w-md",children:[e.jsxs(o,{value:"item-1",children:[e.jsx(t,{children:"Open by default"}),e.jsx(r,{children:"This item is open by default."})]}),e.jsxs(o,{value:"item-2",children:[e.jsx(t,{children:"Closed by default"}),e.jsx(r,{children:"This item is closed by default."})]})]})},d={render:()=>e.jsxs(i,{type:"single",collapsible:!0,className:"w-full max-w-md",children:[e.jsxs(o,{value:"item-1",children:[e.jsx(t,{children:"Enabled item"}),e.jsx(r,{children:"This item can be toggled."})]}),e.jsxs(o,{value:"item-2",disabled:!0,children:[e.jsx(t,{children:"Disabled item"}),e.jsx(r,{children:"This item cannot be toggled."})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>Yes. It comes with default styles that match the design system.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>Yes. It uses CSS animations for smooth open/close transitions.</AccordionContent>
      </AccordionItem>
    </Accordion>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Permet d'ouvrir plusieurs items simultanément (pas de fermeture automatique)."
      }
    }
  },
  render: () => <Accordion type="multiple" className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>First item</AccordionTrigger>
        <AccordionContent>Content for the first item.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second item</AccordionTrigger>
        <AccordionContent>Content for the second item.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Third item</AccordionTrigger>
        <AccordionContent>Content for the third item.</AccordionContent>
      </AccordionItem>
    </Accordion>
}`,...c.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Accordion type="single" collapsible defaultValue="item-1" className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Open by default</AccordionTrigger>
        <AccordionContent>This item is open by default.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Closed by default</AccordionTrigger>
        <AccordionContent>This item is closed by default.</AccordionContent>
      </AccordionItem>
    </Accordion>
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>Enabled item</AccordionTrigger>
        <AccordionContent>This item can be toggled.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Disabled item</AccordionTrigger>
        <AccordionContent>This item cannot be toggled.</AccordionContent>
      </AccordionItem>
    </Accordion>
}`,...d.parameters?.docs?.source}}};const v=["Single","Multiple","DefaultOpen","Disabled"];export{s as DefaultOpen,d as Disabled,c as Multiple,n as Single,v as __namedExportsOrder,T as default};
