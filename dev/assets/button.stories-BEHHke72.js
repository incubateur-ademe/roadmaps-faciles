import{j as e}from"./iframe-BcyfjZH2.js";import{B as r}from"./button-BU0rPqX-.js";import{M as n}from"./mail-TrgbLg5c.js";import{C as y}from"./chevron-right-D0oU__m9.js";import{L}from"./loader-circle-B5X-uCxb.js";import"./preload-helper-Bg6SFuRg.js";import"./index-fNaMV5Ky.js";import"./cn-Ia6N7uSy.js";import"./index-BcLzogVk.js";import"./createLucideIcon-CVwuA9hd.js";const q={title:"Components/Button",component:r,args:{children:"Button"},parameters:{docs:{description:{component:"Bouton polymorphe avec 6 variantes de style, 8 options de taille (dont icone seule) et support `asChild` pour la composition d'éléments personnalisés."}}}},a={},s={args:{variant:"destructive"}},t={args:{variant:"outline"}},o={args:{variant:"secondary"}},i={args:{variant:"ghost"}},c={args:{variant:"link"}},l={args:{size:"default"}},d={args:{size:"xs",children:"Extra Small"}},u={args:{size:"sm",children:"Small"}},m={args:{size:"lg",children:"Large"}},p={parameters:{docs:{description:{story:"Bouton carré dimensionné pour ne contenir qu'une icone (36x36px). Nécessite un `aria-label` pour l'accessibilité."}}},args:{size:"icon",children:e.jsx(n,{}),"aria-label":"Send email"}},g={args:{size:"icon-xs",children:e.jsx(n,{}),"aria-label":"Send email"}},x={args:{size:"icon-sm",children:e.jsx(n,{}),"aria-label":"Send email"}},h={args:{size:"icon-lg",children:e.jsx(n,{}),"aria-label":"Send email"}},v={args:{disabled:!0}},S={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsxs(r,{children:[e.jsx(n,{})," Login with Email"]}),e.jsxs(r,{variant:"destructive",children:[e.jsx(n,{})," Delete"]}),e.jsxs(r,{variant:"outline",children:[e.jsx(n,{})," Outline"]}),e.jsxs(r,{variant:"secondary",children:[e.jsx(n,{})," Secondary"]}),e.jsxs(r,{variant:"ghost",children:[e.jsx(n,{})," Ghost"]})]})},B={parameters:{docs:{description:{story:"Icone placée après le label, couramment utilisée pour les patterns de navigation suivant/avant."}}},render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsxs(r,{children:["Next ",e.jsx(y,{})]}),e.jsxs(r,{variant:"outline",children:["Continue ",e.jsx(y,{})]})]})},z={parameters:{docs:{description:{story:"Combine l'état `disabled` avec une icone en rotation pour indiquer une action en cours."}}},render:()=>e.jsxs(r,{disabled:!0,children:[e.jsx(L,{className:"animate-spin"}),"Please wait"]})},j={parameters:{docs:{description:{story:"Utilise le `Slot` Radix pour rendre une balise ancre avec le style complet du bouton, permettant les patterns lien-en-tant-que-bouton."}}},render:()=>e.jsx(r,{asChild:!0,children:e.jsx("a",{href:"#",children:"Link as Button"})})},f={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(r,{variant:"default",children:"Default"}),e.jsx(r,{variant:"destructive",children:"Destructive"}),e.jsx(r,{variant:"outline",children:"Outline"}),e.jsx(r,{variant:"secondary",children:"Secondary"}),e.jsx(r,{variant:"ghost",children:"Ghost"}),e.jsx(r,{variant:"link",children:"Link"})]})},b={render:()=>e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(r,{size:"xs",children:"Extra Small"}),e.jsx(r,{size:"sm",children:"Small"}),e.jsx(r,{size:"default",children:"Default"}),e.jsx(r,{size:"lg",children:"Large"}),e.jsx(r,{size:"icon",children:e.jsx(n,{})}),e.jsx(r,{size:"icon-xs",children:e.jsx(n,{})}),e.jsx(r,{size:"icon-sm",children:e.jsx(n,{})}),e.jsx(r,{size:"icon-lg",children:e.jsx(n,{})})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "destructive"
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "outline"
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "secondary"
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "ghost"
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "link"
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    size: "default"
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    size: "xs",
    children: "Extra Small"
  }
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    size: "sm",
    children: "Small"
  }
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    size: "lg",
    children: "Large"
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Bouton carré dimensionné pour ne contenir qu'une icone (36x36px). Nécessite un \`aria-label\` pour l'accessibilité."
      }
    }
  },
  args: {
    size: "icon",
    children: <Mail />,
    "aria-label": "Send email"
  }
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    size: "icon-xs",
    children: <Mail />,
    "aria-label": "Send email"
  }
}`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    size: "icon-sm",
    children: <Mail />,
    "aria-label": "Send email"
  }
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    size: "icon-lg",
    children: <Mail />,
    "aria-label": "Send email"
  }
}`,...h.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...v.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Button>
        <Mail /> Login with Email
      </Button>
      <Button variant="destructive">
        <Mail /> Delete
      </Button>
      <Button variant="outline">
        <Mail /> Outline
      </Button>
      <Button variant="secondary">
        <Mail /> Secondary
      </Button>
      <Button variant="ghost">
        <Mail /> Ghost
      </Button>
    </div>
}`,...S.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Icone placée après le label, couramment utilisée pour les patterns de navigation suivant/avant."
      }
    }
  },
  render: () => <div className="flex flex-wrap gap-2">
      <Button>
        Next <ChevronRight />
      </Button>
      <Button variant="outline">
        Continue <ChevronRight />
      </Button>
    </div>
}`,...B.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Combine l'état \`disabled\` avec une icone en rotation pour indiquer une action en cours."
      }
    }
  },
  render: () => <Button disabled>
      <Loader2 className="animate-spin" />
      Please wait
    </Button>
}`,...z.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Utilise le \`Slot\` Radix pour rendre une balise ancre avec le style complet du bouton, permettant les patterns lien-en-tant-que-bouton."
      }
    }
  },
  render: () => <Button asChild>
      <a href="#">Link as Button</a>
    </Button>
}`,...j.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
}`,...f.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center gap-2">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Mail />
      </Button>
      <Button size="icon-xs">
        <Mail />
      </Button>
      <Button size="icon-sm">
        <Mail />
      </Button>
      <Button size="icon-lg">
        <Mail />
      </Button>
    </div>
}`,...b.parameters?.docs?.source}}};const A=["Default","Destructive","Outline","Secondary","Ghost","Link","SizeDefault","SizeXs","SizeSm","SizeLg","SizeIcon","SizeIconXs","SizeIconSm","SizeIconLg","Disabled","WithIcon","IconRight","Loading","AsChild","AllVariants","AllSizes"];export{b as AllSizes,f as AllVariants,j as AsChild,a as Default,s as Destructive,v as Disabled,i as Ghost,B as IconRight,c as Link,z as Loading,t as Outline,o as Secondary,l as SizeDefault,p as SizeIcon,h as SizeIconLg,x as SizeIconSm,g as SizeIconXs,m as SizeLg,u as SizeSm,d as SizeXs,S as WithIcon,A as __namedExportsOrder,q as default};
