import{j as a}from"./iframe-BcyfjZH2.js";import{A as r,b as e,a as p,c as m,d as v,e as u}from"./avatar-DjYc_dEJ.js";import{C as A}from"./check-DRbSZmQh.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";import"./index-Bc7gOKRe.js";import"./index-CNFrgnUn.js";import"./index-B80VdNFB.js";import"./index-Ci4M2BYY.js";import"./index-BcLzogVk.js";import"./createLucideIcon-CVwuA9hd.js";const G={title:"Components/Avatar",component:r,parameters:{docs:{description:{component:"Avatar utilisateur avec image, initiales en fallback, badge de statut optionnel et empilement en groupe. Disponible en tailles sm, default et lg."}}}},s={render:()=>a.jsxs(r,{children:[a.jsx(p,{src:"https://github.com/shadcn.png",alt:"@shadcn"}),a.jsx(e,{children:"CN"})]})},t={render:()=>a.jsxs(r,{children:[a.jsx(p,{src:"/broken-image.jpg",alt:"Broken"}),a.jsx(e,{children:"AB"})]})},n={render:()=>a.jsx(r,{size:"default",children:a.jsx(e,{children:"MD"})})},c={render:()=>a.jsx(r,{size:"sm",children:a.jsx(e,{children:"SM"})})},l={render:()=>a.jsx(r,{size:"lg",children:a.jsx(e,{children:"LG"})})},i={parameters:{docs:{description:{story:"Superpose un petit badge circulaire (ex. icone de validation) en bas à droite de l'avatar."}}},render:()=>a.jsxs(r,{size:"lg",children:[a.jsx(e,{children:"AB"}),a.jsx(u,{children:a.jsx(A,{})})]})},o={parameters:{docs:{description:{story:"Empile plusieurs avatars avec un espacement négatif et un indicateur de compteur pour le surplus."}}},render:()=>a.jsxs(m,{children:[a.jsx(r,{children:a.jsx(e,{children:"A"})}),a.jsx(r,{children:a.jsx(e,{children:"B"})}),a.jsx(r,{children:a.jsx(e,{children:"C"})}),a.jsx(v,{children:"+5"})]})},d={render:()=>a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(r,{size:"sm",children:a.jsx(e,{children:"SM"})}),a.jsx(r,{size:"default",children:a.jsx(e,{children:"MD"})}),a.jsx(r,{size:"lg",children:a.jsx(e,{children:"LG"})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar>
      <AvatarImage src="/broken-image.jpg" alt="Broken" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar size="default">
      <AvatarFallback>MD</AvatarFallback>
    </Avatar>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar size="sm">
      <AvatarFallback>SM</AvatarFallback>
    </Avatar>
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Avatar size="lg">
      <AvatarFallback>LG</AvatarFallback>
    </Avatar>
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Superpose un petit badge circulaire (ex. icone de validation) en bas à droite de l'avatar."
      }
    }
  },
  render: () => <Avatar size="lg">
      <AvatarFallback>AB</AvatarFallback>
      <AvatarBadge>
        <Check />
      </AvatarBadge>
    </Avatar>
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Empile plusieurs avatars avec un espacement négatif et un indicateur de compteur pour le surplus."
      }
    }
  },
  render: () => <AvatarGroup>
      <Avatar>
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>B</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>C</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
}`,...d.parameters?.docs?.source}}};const C=["WithImage","Fallback","SizeDefault","SizeSmall","SizeLarge","WithBadge","Group","AllSizes"];export{d as AllSizes,t as Fallback,o as Group,n as SizeDefault,l as SizeLarge,c as SizeSmall,i as WithBadge,s as WithImage,C as __namedExportsOrder,G as default};
