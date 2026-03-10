import{j as r}from"./iframe-BcyfjZH2.js";import{B as i,a as c,b as e,c as s,d as a,e as t,f as u}from"./breadcrumb-BZ6i-F80.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";import"./chevron-right-D0oU__m9.js";import"./createLucideIcon-CVwuA9hd.js";import"./ellipsis-DnQ8vgqO.js";import"./index-BcLzogVk.js";const L={title:"Components/Breadcrumb",component:i,parameters:{docs:{description:{component:"Fil d'Ariane de navigation avec séparateurs chevron automatiques, ellipse de débordement et composition de liens via `asChild`."}}}},d={render:()=>r.jsx(i,{children:r.jsxs(c,{children:[r.jsx(e,{children:r.jsx(s,{href:"#",children:"Home"})}),r.jsx(a,{}),r.jsx(e,{children:r.jsx(s,{href:"#",children:"Components"})}),r.jsx(a,{}),r.jsx(e,{children:r.jsx(t,{children:"Breadcrumb"})})]})})},n={parameters:{docs:{description:{story:"Réduit les items intermédiaires du fil d'Ariane en un indicateur d'ellipse pour les chemins de navigation longs."}}},render:()=>r.jsx(i,{children:r.jsxs(c,{children:[r.jsx(e,{children:r.jsx(s,{href:"#",children:"Home"})}),r.jsx(a,{}),r.jsx(e,{children:r.jsx(u,{})}),r.jsx(a,{}),r.jsx(e,{children:r.jsx(s,{href:"#",children:"Category"})}),r.jsx(a,{}),r.jsx(e,{children:r.jsx(t,{children:"Current Page"})})]})})},m={parameters:{docs:{description:{story:"Utilise `asChild` sur `BreadcrumbLink` pour fusionner les styles sur un élément personnalisé (ex. `Link` de Next.js)."}}},render:()=>r.jsx(i,{children:r.jsxs(c,{children:[r.jsx(e,{children:r.jsx(s,{asChild:!0,children:r.jsx("a",{href:"#",children:"Home (asChild)"})})}),r.jsx(a,{}),r.jsx(e,{children:r.jsx(t,{children:"Current"})})]})})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
}`,...d.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Réduit les items intermédiaires du fil d'Ariane en un indicateur d'ellipse pour les chemins de navigation longs."
      }
    }
  },
  render: () => <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Category</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Current Page</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
}`,...n.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Utilise \`asChild\` sur \`BreadcrumbLink\` pour fusionner les styles sur un élément personnalisé (ex. \`Link\` de Next.js)."
      }
    }
  },
  render: () => <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="#">Home (asChild)</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Current</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
}`,...m.parameters?.docs?.source}}};const f=["Default","WithEllipsis","AsChild"];export{m as AsChild,d as Default,n as WithEllipsis,f as __namedExportsOrder,L as default};
