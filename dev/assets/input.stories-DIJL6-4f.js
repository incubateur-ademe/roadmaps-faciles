import{j as e}from"./iframe-B2FihN7C.js";import{H as s}from"./hint-i4Sq21uA.js";import{I as a}from"./input-DmP-cY_k.js";import{L as r}from"./label-4moIyiQR.js";import{M as f}from"./mail-C6AFyblO.js";import{S as v}from"./search-z3HPfl06.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";import"./circle-alert-Dc398Jgd.js";import"./createLucideIcon-ClrF36kq.js";import"./index-DfGb4vk9.js";import"./index-Chw98AJh.js";const V={title:"Components/Input",component:a,args:{placeholder:"Type something..."},parameters:{docs:{description:{component:"Champ de saisie stylisé avec support de l'upload de fichiers, anneau de focus, état de validation et gestion du mode sombre."}}}},l={},t={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm gap-1.5",children:[e.jsx(r,{htmlFor:"email",children:"Email"}),e.jsx(a,{type:"email",id:"email",placeholder:"Email"})]})},d={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm gap-1.5",children:[e.jsx(r,{htmlFor:"project",children:"Nom du projet"}),e.jsx(a,{id:"project",defaultValue:"Roadmap Q4"}),e.jsx(s,{children:"Ce champ a le focus actif."})]})},o={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm gap-1.5",children:[e.jsx(r,{htmlFor:"email-icon",children:"Email"}),e.jsxs("div",{className:"relative",children:[e.jsx(f,{className:"text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"}),e.jsx(a,{id:"email-icon",placeholder:"user@exemple.com",className:"pl-9"})]}),e.jsx(s,{children:"Champ avec icône descriptive."})]})},n={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm gap-1.5",children:[e.jsx(r,{htmlFor:"password-err",children:"Mot de passe"}),e.jsx(a,{id:"password-err",type:"password",defaultValue:"badpassword","aria-invalid":!0}),e.jsx(s,{variant:"error",children:"Format d'email invalide"})]})},c={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm gap-1.5",children:[e.jsx(r,{htmlFor:"deadline",children:"Date limite"}),e.jsx(a,{id:"deadline",disabled:!0,defaultValue:"31/12/2023"}),e.jsx(s,{children:"Modification non autorisée."})]})},m={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm gap-1.5",children:[e.jsx(r,{htmlFor:"search",children:"Recherche"}),e.jsxs("div",{className:"relative",children:[e.jsx(v,{className:"text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"}),e.jsx(a,{id:"search",type:"search",placeholder:"Rechercher...",className:"pl-9"})]})]})},p={args:{defaultValue:"Default value"}},u={args:{type:"password",placeholder:"Enter password"}},h={args:{type:"file"}},i={render:()=>e.jsxs("div",{className:"grid max-w-2xl grid-cols-2 gap-6",children:[e.jsxs("div",{className:"grid gap-1.5",children:[e.jsx(r,{htmlFor:"ff-name",children:"Nom du projet (Focus)"}),e.jsx(a,{id:"ff-name",defaultValue:"Roadmap Q4"}),e.jsx(s,{children:"Ce champ a le focus actif."})]}),e.jsxs("div",{className:"grid gap-1.5",children:[e.jsx(r,{htmlFor:"ff-email",children:"Email (Icône)"}),e.jsxs("div",{className:"relative",children:[e.jsx(f,{className:"text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"}),e.jsx(a,{id:"ff-email",placeholder:"user@exemple.com",className:"pl-9"})]}),e.jsx(s,{children:"Champ avec icône descriptive."})]}),e.jsxs("div",{className:"grid gap-1.5",children:[e.jsx(r,{htmlFor:"ff-pass",children:"Mot de passe (Erreur)"}),e.jsx(a,{id:"ff-pass",type:"password",defaultValue:"badpassword","aria-invalid":!0}),e.jsx(s,{variant:"error",children:"Format d'email invalide"})]}),e.jsxs("div",{className:"grid gap-1.5",children:[e.jsx(r,{htmlFor:"ff-date",children:"Date limite (Désactivé)"}),e.jsx(a,{id:"ff-date",disabled:!0,defaultValue:"31/12/2023"}),e.jsx(s,{children:"Modification non autorisée."})]})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:"{}",...l.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
}`,...t.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="project">Nom du projet</Label>
      <Input id="project" defaultValue="Roadmap Q4" />
      <Hint>Ce champ a le focus actif.</Hint>
    </div>
}`,...d.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="email-icon">Email</Label>
      <div className="relative">
        <MailIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input id="email-icon" placeholder="user@exemple.com" className="pl-9" />
      </div>
      <Hint>Champ avec icône descriptive.</Hint>
    </div>
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="password-err">Mot de passe</Label>
      <Input id="password-err" type="password" defaultValue="badpassword" aria-invalid />
      <Hint variant="error">Format d'email invalide</Hint>
    </div>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="deadline">Date limite</Label>
      <Input id="deadline" disabled defaultValue="31/12/2023" />
      <Hint>Modification non autorisée.</Hint>
    </div>
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="search">Recherche</Label>
      <div className="relative">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input id="search" type="search" placeholder="Rechercher..." className="pl-9" />
      </div>
    </div>
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "Default value"
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    type: "password",
    placeholder: "Enter password"
  }
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    type: "file"
  }
}`,...h.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid max-w-2xl grid-cols-2 gap-6">
      <div className="grid gap-1.5">
        <Label htmlFor="ff-name">Nom du projet (Focus)</Label>
        <Input id="ff-name" defaultValue="Roadmap Q4" />
        <Hint>Ce champ a le focus actif.</Hint>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="ff-email">Email (Icône)</Label>
        <div className="relative">
          <MailIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input id="ff-email" placeholder="user@exemple.com" className="pl-9" />
        </div>
        <Hint>Champ avec icône descriptive.</Hint>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="ff-pass">Mot de passe (Erreur)</Label>
        <Input id="ff-pass" type="password" defaultValue="badpassword" aria-invalid />
        <Hint variant="error">Format d'email invalide</Hint>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="ff-date">Date limite (Désactivé)</Label>
        <Input id="ff-date" disabled defaultValue="31/12/2023" />
        <Hint>Modification non autorisée.</Hint>
      </div>
    </div>
}`,...i.parameters?.docs?.source},description:{story:"Composition complète : label + input avec icône + select + textarea + hints. Reproduit le pattern Stitch.",...i.parameters?.docs?.description}}};const D=["Default","WithLabel","WithHint","WithIcon","Invalid","Disabled","Search","WithDefaultValue","Password","File","FormFields"];export{l as Default,c as Disabled,h as File,i as FormFields,n as Invalid,u as Password,m as Search,p as WithDefaultValue,d as WithHint,o as WithIcon,t as WithLabel,D as __namedExportsOrder,V as default};
