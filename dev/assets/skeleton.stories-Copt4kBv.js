import{j as e}from"./iframe-BcyfjZH2.js";import{S as s}from"./skeleton-dp0gaGRz.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";const i={title:"Components/Skeleton",component:s,parameters:{docs:{description:{component:"Bloc placeholder pulsant pour les états de chargement. Forme et taille contrôlées via className."}}}},a={args:{className:"h-4 w-[250px]"}},r={args:{className:"size-12 rounded-full"}},l={parameters:{docs:{description:{story:"Compose plusieurs skeletons (cercle + lignes de texte) pour prévisualiser un layout typique de carte ou de profil utilisateur."}}},render:()=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{className:"size-12 rounded-full"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{className:"h-4 w-[250px]"}),e.jsx(s,{className:"h-4 w-[200px]"})]})]})},n={render:()=>e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{className:"h-4 w-full"}),e.jsx(s,{className:"h-4 w-[80%]"}),e.jsx(s,{className:"h-4 w-[60%]"})]})},o={parameters:{docs:{description:{story:"Simule un état de chargement de formulaire avec des skeletons label + input et un placeholder de bouton de soumission."}}},render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{className:"h-4 w-[100px]"}),e.jsx(s,{className:"h-9 w-full"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{className:"h-4 w-[100px]"}),e.jsx(s,{className:"h-9 w-full"})]}),e.jsx(s,{className:"h-9 w-[120px]"})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    className: "h-4 w-[250px]"
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    className: "size-12 rounded-full"
  }
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Compose plusieurs skeletons (cercle + lignes de texte) pour prévisualiser un layout typique de carte ou de profil utilisateur."
      }
    }
  },
  render: () => <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[80%]" />
      <Skeleton className="h-4 w-[60%]" />
    </div>
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Simule un état de chargement de formulaire avec des skeletons label + input et un placeholder de bouton de soumission."
      }
    }
  },
  render: () => <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="h-9 w-[120px]" />
    </div>
}`,...o.parameters?.docs?.source}}};const p=["Default","Circle","Card","TextBlock","FormSkeleton"];export{l as Card,r as Circle,a as Default,o as FormSkeleton,n as TextBlock,p as __namedExportsOrder,i as default};
