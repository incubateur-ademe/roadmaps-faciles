import{j as e}from"./iframe-B2FihN7C.js";import{B as t}from"./button-D6iiOFoj.js";import{I as m}from"./input-DmP-cY_k.js";import{L as S}from"./label-4moIyiQR.js";import{S as n,a as s,b as r,c as o,d as i,e as a,f as u,g as x}from"./sheet-CMr_3zeH.js";import"./preload-helper-Bg6SFuRg.js";import"./index-fNaMV5Ky.js";import"./cn-Ia6N7uSy.js";import"./index-Chw98AJh.js";import"./index-DfGb4vk9.js";import"./index-B5ZU9nbQ.js";import"./createLucideIcon-ClrF36kq.js";import"./index-DIyHDetT.js";import"./index-cnXatIDB.js";import"./index-kqGLAE-E.js";import"./index-pkf867cR.js";import"./index-BD9OYmGd.js";import"./index-CpmBSX8d.js";import"./index-CI4XBI4Q.js";import"./index-D-cGZ4AG.js";import"./index-DM1C2U8C.js";const q={title:"Components/Sheet",component:n,parameters:{docs:{description:{component:"Panneau coulissant (drawer) depuis n'importe quel bord de l'écran. Basé sur Radix Dialog avec overlay et transitions animées."}}}},h={render:()=>e.jsxs(n,{children:[e.jsx(s,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"Open Sheet"})}),e.jsxs(r,{children:[e.jsxs(o,{children:[e.jsx(i,{children:"Edit profile"}),e.jsx(a,{children:"Make changes to your profile here. Click save when you are done."})]}),e.jsxs("div",{className:"grid gap-4 p-4",children:[e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx(S,{htmlFor:"sheet-name",className:"text-right",children:"Name"}),e.jsx(m,{id:"sheet-name",className:"col-span-3"})]}),e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx(S,{htmlFor:"sheet-username",className:"text-right",children:"Username"}),e.jsx(m,{id:"sheet-username",className:"col-span-3"})]})]}),e.jsxs(u,{children:[e.jsx(x,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"Cancel"})}),e.jsx(t,{children:"Save changes"})]})]})]})},l={render:()=>e.jsxs(n,{children:[e.jsx(s,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"Open Left"})}),e.jsx(r,{side:"left",children:e.jsxs(o,{children:[e.jsx(i,{children:"Left Sheet"}),e.jsx(a,{children:"This sheet opens from the left side."})]})})]})},d={render:()=>e.jsxs(n,{children:[e.jsx(s,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"Open Top"})}),e.jsx(r,{side:"top",children:e.jsxs(o,{children:[e.jsx(i,{children:"Top Sheet"}),e.jsx(a,{children:"This sheet opens from the top."})]})})]})},c={render:()=>e.jsxs(n,{children:[e.jsx(s,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"Open Bottom"})}),e.jsx(r,{side:"bottom",children:e.jsxs(o,{children:[e.jsx(i,{children:"Bottom Sheet"}),e.jsx(a,{children:"This sheet opens from the bottom."})]})})]})},p={parameters:{docs:{description:{story:"Masque le bouton X en haut à droite via `showCloseButton={false}`, nécessitant des actions explicites dans le pied de page pour fermer."}}},render:()=>e.jsxs(n,{children:[e.jsx(s,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"No Close Button"})}),e.jsxs(r,{showCloseButton:!1,children:[e.jsxs(o,{children:[e.jsx(i,{children:"No Close Button"}),e.jsx(a,{children:"This sheet does not show an X close button."})]}),e.jsx(u,{children:e.jsx(x,{asChild:!0,children:e.jsx(t,{children:"Done"})})})]})]})};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you are done.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 p-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sheet-name" className="text-right">
              Name
            </Label>
            <Input id="sheet-name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sheet-username" className="text-right">
              Username
            </Label>
            <Input id="sheet-username" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
}`,...h.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Left</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Left Sheet</SheetTitle>
          <SheetDescription>This sheet opens from the left side.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Top</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Top Sheet</SheetTitle>
          <SheetDescription>This sheet opens from the top.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Bottom</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Bottom Sheet</SheetTitle>
          <SheetDescription>This sheet opens from the bottom.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Masque le bouton X en haut à droite via \`showCloseButton={false}\`, nécessitant des actions explicites dans le pied de page pour fermer."
      }
    }
  },
  render: () => <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">No Close Button</Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>No Close Button</SheetTitle>
          <SheetDescription>This sheet does not show an X close button.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
}`,...p.parameters?.docs?.source}}};const R=["Default","SideLeft","SideTop","SideBottom","WithoutCloseButton"];export{h as Default,c as SideBottom,l as SideLeft,d as SideTop,p as WithoutCloseButton,R as __namedExportsOrder,q as default};
