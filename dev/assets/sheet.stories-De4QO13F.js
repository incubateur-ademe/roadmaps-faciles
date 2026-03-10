import{j as e}from"./iframe-BcyfjZH2.js";import{B as t}from"./button-BU0rPqX-.js";import{I as m}from"./input-5Upp4kX3.js";import{L as S}from"./label-DXEOaO3m.js";import{S as n,a as s,b as r,c as o,d as i,e as a,f as u,g as x}from"./sheet-BQ_3wH5K.js";import"./preload-helper-Bg6SFuRg.js";import"./index-fNaMV5Ky.js";import"./cn-Ia6N7uSy.js";import"./index-BcLzogVk.js";import"./index-Ci4M2BYY.js";import"./index-COxr2gjt.js";import"./createLucideIcon-CVwuA9hd.js";import"./index-BQlpQe1r.js";import"./index-B80VdNFB.js";import"./index-Bc7gOKRe.js";import"./index-W4PQkU0l.js";import"./index-B-jGJKC1.js";import"./index-CNFrgnUn.js";import"./index-D0tx0hrS.js";import"./index-DJ-lhrq-.js";import"./index-CS8GyP0I.js";const q={title:"Components/Sheet",component:n,parameters:{docs:{description:{component:"Panneau coulissant (drawer) depuis n'importe quel bord de l'écran. Basé sur Radix Dialog avec overlay et transitions animées."}}}},h={render:()=>e.jsxs(n,{children:[e.jsx(s,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"Open Sheet"})}),e.jsxs(r,{children:[e.jsxs(o,{children:[e.jsx(i,{children:"Edit profile"}),e.jsx(a,{children:"Make changes to your profile here. Click save when you are done."})]}),e.jsxs("div",{className:"grid gap-4 p-4",children:[e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx(S,{htmlFor:"sheet-name",className:"text-right",children:"Name"}),e.jsx(m,{id:"sheet-name",className:"col-span-3"})]}),e.jsxs("div",{className:"grid grid-cols-4 items-center gap-4",children:[e.jsx(S,{htmlFor:"sheet-username",className:"text-right",children:"Username"}),e.jsx(m,{id:"sheet-username",className:"col-span-3"})]})]}),e.jsxs(u,{children:[e.jsx(x,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"Cancel"})}),e.jsx(t,{children:"Save changes"})]})]})]})},l={render:()=>e.jsxs(n,{children:[e.jsx(s,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"Open Left"})}),e.jsx(r,{side:"left",children:e.jsxs(o,{children:[e.jsx(i,{children:"Left Sheet"}),e.jsx(a,{children:"This sheet opens from the left side."})]})})]})},d={render:()=>e.jsxs(n,{children:[e.jsx(s,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"Open Top"})}),e.jsx(r,{side:"top",children:e.jsxs(o,{children:[e.jsx(i,{children:"Top Sheet"}),e.jsx(a,{children:"This sheet opens from the top."})]})})]})},c={render:()=>e.jsxs(n,{children:[e.jsx(s,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"Open Bottom"})}),e.jsx(r,{side:"bottom",children:e.jsxs(o,{children:[e.jsx(i,{children:"Bottom Sheet"}),e.jsx(a,{children:"This sheet opens from the bottom."})]})})]})},p={parameters:{docs:{description:{story:"Masque le bouton X en haut à droite via `showCloseButton={false}`, nécessitant des actions explicites dans le pied de page pour fermer."}}},render:()=>e.jsxs(n,{children:[e.jsx(s,{asChild:!0,children:e.jsx(t,{variant:"outline",children:"No Close Button"})}),e.jsxs(r,{showCloseButton:!1,children:[e.jsxs(o,{children:[e.jsx(i,{children:"No Close Button"}),e.jsx(a,{children:"This sheet does not show an X close button."})]}),e.jsx(u,{children:e.jsx(x,{asChild:!0,children:e.jsx(t,{children:"Done"})})})]})]})};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
