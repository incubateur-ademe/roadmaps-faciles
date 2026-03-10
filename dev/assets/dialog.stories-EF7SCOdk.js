import{j as e}from"./iframe-B2FihN7C.js";import{B as o}from"./button-D6iiOFoj.js";import{D as t,a as s,b as l,c as d,d as c,e as g,f as u}from"./dialog-6sDMNY2L.js";import{I as p}from"./input-DmP-cY_k.js";import{L as m}from"./label-4moIyiQR.js";import"./preload-helper-Bg6SFuRg.js";import"./index-fNaMV5Ky.js";import"./cn-Ia6N7uSy.js";import"./index-Chw98AJh.js";import"./index-B5ZU9nbQ.js";import"./createLucideIcon-ClrF36kq.js";import"./index-DIyHDetT.js";import"./index-cnXatIDB.js";import"./index-kqGLAE-E.js";import"./index-pkf867cR.js";import"./index-BD9OYmGd.js";import"./index-DfGb4vk9.js";import"./index-CpmBSX8d.js";import"./index-CI4XBI4Q.js";import"./index-D-cGZ4AG.js";import"./index-DM1C2U8C.js";const I={title:"Components/Dialog",component:t,parameters:{docs:{description:{component:"Dialogue modal avec overlay, animation d'ouverture/fermeture et bouton de fermeture configurable. Supporte un layout en-tête, corps et pied de page."}}}},n={render:()=>e.jsxs(t,{children:[e.jsx(s,{asChild:!0,children:e.jsx(o,{variant:"outline",children:"Open Dialog"})}),e.jsxs(l,{children:[e.jsxs(d,{children:[e.jsx(c,{children:"Dialog Title"}),e.jsx(g,{children:"Dialog description text."})]}),e.jsx("p",{children:"Dialog body content goes here."}),e.jsx(u,{children:e.jsx(o,{children:"Save"})})]})]})},r={render:()=>e.jsxs(t,{children:[e.jsx(s,{asChild:!0,children:e.jsx(o,{children:"Edit Profile"})}),e.jsxs(l,{children:[e.jsxs(d,{children:[e.jsx(c,{children:"Edit profile"}),e.jsx(g,{children:"Make changes to your profile here. Click save when you are done."})]}),e.jsxs("div",{className:"grid gap-4 py-4",children:[e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx(m,{htmlFor:"name",className:"text-right",children:"Name"}),e.jsx(p,{id:"name",defaultValue:"Pedro Duarte",className:"col-span-3"})]}),e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx(m,{htmlFor:"username",className:"text-right",children:"Username"}),e.jsx(p,{id:"username",defaultValue:"@peduarte",className:"col-span-3"})]})]}),e.jsx(u,{children:e.jsx(o,{type:"submit",children:"Save changes"})})]})]})},i={parameters:{docs:{description:{story:"Masque le bouton X en haut à droite via `showCloseButton={false}` sur `DialogContent`, la fermeture se fait par les actions du pied de page."}}},render:()=>e.jsxs(t,{children:[e.jsx(s,{asChild:!0,children:e.jsx(o,{variant:"outline",children:"No Close Button"})}),e.jsxs(l,{showCloseButton:!1,children:[e.jsxs(d,{children:[e.jsx(c,{children:"No Close Button"}),e.jsx(g,{children:"This dialog has no X close button."})]}),e.jsx(u,{showCloseButton:!0,children:e.jsx(o,{children:"Confirm"})})]})]})},a={parameters:{docs:{description:{story:'Ajoute un bouton "Fermer" outline dans le `DialogFooter` via la prop `showCloseButton`, à coté des actions personnalisées.'}}},render:()=>e.jsxs(t,{children:[e.jsx(s,{asChild:!0,children:e.jsx(o,{variant:"outline",children:"Footer Close"})}),e.jsxs(l,{children:[e.jsxs(d,{children:[e.jsx(c,{children:"Confirmation"}),e.jsx(g,{children:"Are you sure you want to proceed?"})]}),e.jsx(u,{showCloseButton:!0,children:e.jsx(o,{children:"Confirm"})})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description text.</DialogDescription>
        </DialogHeader>
        <p>Dialog body content goes here.</p>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you are done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Masque le bouton X en haut à droite via \`showCloseButton={false}\` sur \`DialogContent\`, la fermeture se fait par les actions du pied de page."
      }
    }
  },
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">No Close Button</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>This dialog has no X close button.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Ajoute un bouton "Fermer" outline dans le \`DialogFooter\` via la prop \`showCloseButton\`, à coté des actions personnalisées.'
      }
    }
  },
  render: () => <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Footer Close</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>Are you sure you want to proceed?</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...a.parameters?.docs?.source}}};const M=["Default","WithForm","WithoutCloseButton","WithFooterClose"];export{n as Default,a as WithFooterClose,r as WithForm,i as WithoutCloseButton,M as __namedExportsOrder,I as default};
