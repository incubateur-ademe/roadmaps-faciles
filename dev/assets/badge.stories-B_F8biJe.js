import{j as e}from"./iframe-B2FihN7C.js";import{B as r}from"./badge-BIU313XZ.js";import"./preload-helper-Bg6SFuRg.js";import"./index-fNaMV5Ky.js";import"./cn-Ia6N7uSy.js";import"./index-Chw98AJh.js";const x={title:"Components/Badge",component:r,args:{children:"Badge"},parameters:{docs:{description:{component:"Pastille de statut inline avec plusieurs variantes de couleur. Supporte `asChild` pour la composition d'éléments personnalisés."}}}},a={},s={args:{variant:"secondary"}},n={args:{variant:"destructive"}},t={args:{variant:"outline"}},o={args:{variant:"success"}},i={args:{variant:"warning"}},c={args:{variant:"ghost"}},d={args:{variant:"link"}},u={parameters:{docs:{description:{story:"Utilise le `Slot` Radix pour fusionner les styles du badge sur un élément enfant (ici une ancre), permettant un rendu polymorphe."}}},render:()=>e.jsx(r,{asChild:!0,children:e.jsx("a",{href:"#",children:"Link Badge"})})},l={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(r,{variant:"default",children:"Default"}),e.jsx(r,{variant:"secondary",children:"Secondary"}),e.jsx(r,{variant:"destructive",children:"Destructive"}),e.jsx(r,{variant:"outline",children:"Outline"}),e.jsx(r,{variant:"success",children:"Success"}),e.jsx(r,{variant:"warning",children:"Warning"}),e.jsx(r,{variant:"ghost",children:"Ghost"}),e.jsx(r,{variant:"link",children:"Link"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "secondary"
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "destructive"
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "outline"
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "success"
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "warning"
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "ghost"
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "link"
  }
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Utilise le \`Slot\` Radix pour fusionner les styles du badge sur un élément enfant (ici une ancre), permettant un rendu polymorphe."
      }
    }
  },
  render: () => <Badge asChild>
      <a href="#">Link Badge</a>
    </Badge>
}`,...u.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
}`,...l.parameters?.docs?.source}}};const S=["Default","Secondary","Destructive","Outline","Success","Warning","Ghost","Link","AsChild","AllVariants"];export{l as AllVariants,u as AsChild,a as Default,n as Destructive,c as Ghost,d as Link,t as Outline,s as Secondary,o as Success,i as Warning,S as __namedExportsOrder,x as default};
