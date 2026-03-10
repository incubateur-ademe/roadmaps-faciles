import{j as e}from"./iframe-BcyfjZH2.js";import{B as s}from"./button-BU0rPqX-.js";import{C as r,a as d,b as i,c as l,d as c,e as p,f as m}from"./card-CzTADVuX.js";import{I as C}from"./input-5Upp4kX3.js";import{L as u}from"./label-DXEOaO3m.js";import"./preload-helper-Bg6SFuRg.js";import"./index-fNaMV5Ky.js";import"./cn-Ia6N7uSy.js";import"./index-BcLzogVk.js";import"./index-Ci4M2BYY.js";const A={title:"Components/Card",component:r,parameters:{docs:{description:{component:"Conteneur de contenu avec en-tête structuré (titre, description, emplacement d'action), corps et pied de page."}}}},n={render:()=>e.jsxs(r,{className:"w-[350px]",children:[e.jsxs(d,{children:[e.jsx(i,{children:"Card Title"}),e.jsx(l,{children:"Card description text goes here."})]}),e.jsx(c,{children:e.jsx("p",{children:"Card content goes here."})}),e.jsx(p,{children:e.jsx(s,{children:"Action"})})]})},a={parameters:{docs:{description:{story:"Utilise l'emplacement `CardAction` pour placer un bouton en haut à droite de l'en-tête, aligné avec le titre."}}},render:()=>e.jsxs(r,{className:"w-[350px]",children:[e.jsxs(d,{children:[e.jsx(i,{children:"Notifications"}),e.jsx(l,{children:"You have 3 unread messages."}),e.jsx(m,{children:e.jsx(s,{variant:"outline",size:"sm",children:"Mark all read"})})]}),e.jsx(c,{children:e.jsx("p",{children:"Your notification content here."})})]})},t={render:()=>e.jsxs(r,{className:"w-[350px]",children:[e.jsxs(d,{children:[e.jsx(i,{children:"Create project"}),e.jsx(l,{children:"Deploy your new project in one-click."})]}),e.jsx(c,{children:e.jsx("div",{className:"grid gap-4",children:e.jsxs("div",{className:"grid gap-2",children:[e.jsx(u,{htmlFor:"name",children:"Name"}),e.jsx(C,{id:"name",placeholder:"Name of your project"})]})})}),e.jsxs(p,{className:"flex justify-between",children:[e.jsx(s,{variant:"outline",children:"Cancel"}),e.jsx(s,{children:"Deploy"})]})]})},o={render:()=>e.jsxs(r,{className:"w-[350px]",children:[e.jsx(d,{children:e.jsx(i,{children:"Simple Card"})}),e.jsx(c,{children:e.jsx("p",{children:"A card with just a title and content."})})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description text goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Utilise l'emplacement \`CardAction\` pour placer un bouton en haut à droite de l'en-tête, aligné avec le titre."
      }
    }
  },
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Mark all read
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Your notification content here.</p>
      </CardContent>
    </Card>
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Name of your project" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>A card with just a title and content.</p>
      </CardContent>
    </Card>
}`,...o.parameters?.docs?.source}}};const T=["Default","WithAction","WithForm","Simple"];export{n as Default,o as Simple,a as WithAction,t as WithForm,T as __namedExportsOrder,A as default};
