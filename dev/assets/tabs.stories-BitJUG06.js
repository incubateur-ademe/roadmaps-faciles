import{j as e}from"./iframe-B2FihN7C.js";import{B as m}from"./button-D6iiOFoj.js";import{C as p,a as b,b as x,c as g,d as T,e as v}from"./card-BmDUaFBh.js";import{I as d}from"./input-DmP-cY_k.js";import{L as u}from"./label-4moIyiQR.js";import{T as n,a as s,b as t,c as a}from"./tabs-DmceQ_3H.js";import"./preload-helper-Bg6SFuRg.js";import"./index-fNaMV5Ky.js";import"./cn-Ia6N7uSy.js";import"./index-Chw98AJh.js";import"./index-DfGb4vk9.js";import"./index-DIyHDetT.js";import"./index-cnXatIDB.js";import"./index-kqGLAE-E.js";import"./index-CTF24ge1.js";import"./index-BMHBUb9M.js";import"./index-pkf867cR.js";import"./index-CpmBSX8d.js";import"./index-DM1C2U8C.js";const R={title:"Components/Tabs",component:n,parameters:{docs:{description:{component:"Interface à onglets avec orientation horizontale ou verticale. Trois variantes : default (pastille sur l'actif), line (indicateur souligné) et segmented (controle contenu)."}}}},r={render:()=>e.jsxs(n,{defaultValue:"account",className:"w-[400px]",children:[e.jsxs(s,{children:[e.jsx(t,{value:"account",children:"Account"}),e.jsx(t,{value:"password",children:"Password"}),e.jsx(t,{value:"notifications",children:"Notifications"})]}),e.jsx(a,{value:"account",children:e.jsxs(p,{children:[e.jsxs(b,{children:[e.jsx(x,{children:"Account"}),e.jsx(g,{children:"Make changes to your account here."})]}),e.jsx(T,{className:"space-y-2",children:e.jsxs("div",{className:"space-y-1",children:[e.jsx(u,{htmlFor:"tab-name",children:"Name"}),e.jsx(d,{id:"tab-name",defaultValue:"Pedro Duarte"})]})}),e.jsx(v,{children:e.jsx(m,{children:"Save changes"})})]})}),e.jsx(a,{value:"password",children:e.jsxs(p,{children:[e.jsxs(b,{children:[e.jsx(x,{children:"Password"}),e.jsx(g,{children:"Change your password here."})]}),e.jsxs(T,{className:"space-y-2",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(u,{htmlFor:"current",children:"Current password"}),e.jsx(d,{id:"current",type:"password"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(u,{htmlFor:"new",children:"New password"}),e.jsx(d,{id:"new",type:"password"})]})]}),e.jsx(v,{children:e.jsx(m,{children:"Save password"})})]})}),e.jsx(a,{value:"notifications",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"Notification preferences content."})})]})},i={parameters:{docs:{description:{story:'Utilise `variant="line"` sur `TabsList` pour un fond transparent avec un indicateur souligné sur l\'onglet actif.'}}},render:()=>e.jsxs(n,{defaultValue:"tab1",className:"w-[400px]",children:[e.jsxs(s,{variant:"line",children:[e.jsx(t,{value:"tab1",children:"Overview"}),e.jsx(t,{value:"tab2",children:"Analytics"}),e.jsx(t,{value:"tab3",children:"Reports"})]}),e.jsx(a,{value:"tab1",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"Overview content."})}),e.jsx(a,{value:"tab2",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"Analytics content."})}),e.jsx(a,{value:"tab3",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"Reports content."})})]})},o={parameters:{docs:{description:{story:'Passe en layout `orientation="vertical"` avec les onglets empilés à gauche et le contenu à droite.'}}},render:()=>e.jsxs(n,{defaultValue:"general",orientation:"vertical",className:"w-[400px]",children:[e.jsxs(s,{children:[e.jsx(t,{value:"general",children:"General"}),e.jsx(t,{value:"security",children:"Security"}),e.jsx(t,{value:"notifications",children:"Notifications"})]}),e.jsx(a,{value:"general",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"General settings content."})}),e.jsx(a,{value:"security",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"Security settings content."})}),e.jsx(a,{value:"notifications",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"Notification settings content."})})]})},c={parameters:{docs:{description:{story:"Combine l'orientation verticale avec la variante line, affichant une barre d'indicateur actif sur le coté gauche."}}},render:()=>e.jsxs(n,{defaultValue:"general",orientation:"vertical",className:"w-[400px]",children:[e.jsxs(s,{variant:"line",children:[e.jsx(t,{value:"general",children:"General"}),e.jsx(t,{value:"security",children:"Security"}),e.jsx(t,{value:"notifications",children:"Notifications"})]}),e.jsx(a,{value:"general",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"General settings content."})}),e.jsx(a,{value:"security",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"Security settings content."})}),e.jsx(a,{value:"notifications",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"Notification settings content."})})]})},l={render:()=>e.jsxs(n,{defaultValue:"tab1",className:"w-[400px]",children:[e.jsxs(s,{children:[e.jsx(t,{value:"tab1",children:"Active"}),e.jsx(t,{value:"tab2",disabled:!0,children:"Disabled"}),e.jsx(t,{value:"tab3",children:"Another"})]}),e.jsx(a,{value:"tab1",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"Active tab content."})}),e.jsx(a,{value:"tab3",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"Another tab content."})})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="tab-name">Name</Label>
              <Input id="tab-name" defaultValue="Pedro Duarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <p className="text-muted-foreground text-sm">Notification preferences content.</p>
      </TabsContent>
    </Tabs>
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Utilise \`variant="line"\` sur \`TabsList\` pour un fond transparent avec un indicateur souligné sur l\\'onglet actif.'
      }
    }
  },
  render: () => <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList variant="line">
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Analytics</TabsTrigger>
        <TabsTrigger value="tab3">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-muted-foreground text-sm">Overview content.</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-muted-foreground text-sm">Analytics content.</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-muted-foreground text-sm">Reports content.</p>
      </TabsContent>
    </Tabs>
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Passe en layout \`orientation="vertical"\` avec les onglets empilés à gauche et le contenu à droite.'
      }
    }
  },
  render: () => <Tabs defaultValue="general" orientation="vertical" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <p className="text-muted-foreground text-sm">General settings content.</p>
      </TabsContent>
      <TabsContent value="security">
        <p className="text-muted-foreground text-sm">Security settings content.</p>
      </TabsContent>
      <TabsContent value="notifications">
        <p className="text-muted-foreground text-sm">Notification settings content.</p>
      </TabsContent>
    </Tabs>
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Combine l'orientation verticale avec la variante line, affichant une barre d'indicateur actif sur le coté gauche."
      }
    }
  },
  render: () => <Tabs defaultValue="general" orientation="vertical" className="w-[400px]">
      <TabsList variant="line">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <p className="text-muted-foreground text-sm">General settings content.</p>
      </TabsContent>
      <TabsContent value="security">
        <p className="text-muted-foreground text-sm">Security settings content.</p>
      </TabsContent>
      <TabsContent value="notifications">
        <p className="text-muted-foreground text-sm">Notification settings content.</p>
      </TabsContent>
    </Tabs>
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Active</TabsTrigger>
        <TabsTrigger value="tab2" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="tab3">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-muted-foreground text-sm">Active tab content.</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-muted-foreground text-sm">Another tab content.</p>
      </TabsContent>
    </Tabs>
}`,...l.parameters?.docs?.source}}};const k=["Default","LineVariant","Vertical","VerticalLine","DisabledTab"];export{r as Default,l as DisabledTab,i as LineVariant,o as Vertical,c as VerticalLine,k as __namedExportsOrder,R as default};
