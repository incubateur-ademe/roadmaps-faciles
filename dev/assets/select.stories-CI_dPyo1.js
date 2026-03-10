import{j as e}from"./iframe-BcyfjZH2.js";import{L as u}from"./label-DXEOaO3m.js";import{S as l,a as r,b as a,c,e as d,f as S,d as t,g as x}from"./select-Bh8Al9SC.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";import"./index-Ci4M2BYY.js";import"./index-BcLzogVk.js";import"./chevron-down-DI2Ln_FU.js";import"./createLucideIcon-CVwuA9hd.js";import"./check-DRbSZmQh.js";import"./index-BQlpQe1r.js";import"./index-B80VdNFB.js";import"./index-CMrQeyWO.js";import"./index-Bc7gOKRe.js";import"./index-B-jGJKC1.js";import"./index-CNFrgnUn.js";import"./index-D0tx0hrS.js";import"./index-W4PQkU0l.js";import"./index-BhsvWzXz.js";import"./index-C9LbcBlT.js";import"./index-DJ-lhrq-.js";import"./index-QjQbZVBU.js";import"./index-DgjL0iBH.js";const P={title:"Components/Select",component:l,parameters:{docs:{description:{component:"Menu déroulant de type select natif avec boutons de défilement, indicateur de sélection et options groupées. Basé sur Radix Select."}}}},n={render:()=>e.jsxs(l,{children:[e.jsx(r,{className:"w-[180px]",children:e.jsx(a,{placeholder:"Select a fruit"})}),e.jsx(c,{children:e.jsxs(d,{children:[e.jsx(S,{children:"Fruits"}),e.jsx(t,{value:"apple",children:"Apple"}),e.jsx(t,{value:"banana",children:"Banana"}),e.jsx(t,{value:"blueberry",children:"Blueberry"}),e.jsx(t,{value:"grapes",children:"Grapes"}),e.jsx(t,{value:"pineapple",children:"Pineapple"})]})})]})},s={render:()=>e.jsxs(l,{children:[e.jsx(r,{className:"w-[200px]",children:e.jsx(a,{placeholder:"Select a timezone"})}),e.jsxs(c,{children:[e.jsxs(d,{children:[e.jsx(S,{children:"North America"}),e.jsx(t,{value:"est",children:"Eastern (EST)"}),e.jsx(t,{value:"cst",children:"Central (CST)"}),e.jsx(t,{value:"pst",children:"Pacific (PST)"})]}),e.jsx(x,{}),e.jsxs(d,{children:[e.jsx(S,{children:"Europe"}),e.jsx(t,{value:"gmt",children:"GMT"}),e.jsx(t,{value:"cet",children:"Central European (CET)"}),e.jsx(t,{value:"eet",children:"Eastern European (EET)"})]})]})]})},i={parameters:{docs:{description:{story:"Utilise la variante de taille `sm` sur `SelectTrigger` pour un déclencheur plus compact de 32px de hauteur."}}},render:()=>e.jsxs(l,{children:[e.jsx(r,{size:"sm",className:"w-[180px]",children:e.jsx(a,{placeholder:"Small trigger"})}),e.jsxs(c,{children:[e.jsx(t,{value:"a",children:"Option A"}),e.jsx(t,{value:"b",children:"Option B"}),e.jsx(t,{value:"c",children:"Option C"})]})]})},o={render:()=>e.jsxs(l,{disabled:!0,children:[e.jsx(r,{className:"w-[180px]",children:e.jsx(a,{placeholder:"Disabled"})}),e.jsx(c,{children:e.jsx(t,{value:"a",children:"Option A"})})]})},m={render:()=>e.jsxs(l,{children:[e.jsx(r,{className:"w-[180px]",children:e.jsx(a,{placeholder:"Select option"})}),e.jsxs(c,{children:[e.jsx(t,{value:"a",children:"Option A"}),e.jsx(t,{value:"b",disabled:!0,children:"Option B (disabled)"}),e.jsx(t,{value:"c",children:"Option C"})]})]})},p={render:()=>e.jsxs("div",{className:"grid w-full max-w-sm gap-1.5",children:[e.jsx(u,{htmlFor:"framework",children:"Framework"}),e.jsxs(l,{children:[e.jsx(r,{id:"framework",className:"w-[180px]",children:e.jsx(a,{placeholder:"Select"})}),e.jsxs(c,{children:[e.jsx(t,{value:"next",children:"Next.js"}),e.jsx(t,{value:"remix",children:"Remix"}),e.jsx(t,{value:"astro",children:"Astro"}),e.jsx(t,{value:"nuxt",children:"Nuxt"})]})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern (EST)</SelectItem>
          <SelectItem value="cst">Central (CST)</SelectItem>
          <SelectItem value="pst">Pacific (PST)</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">GMT</SelectItem>
          <SelectItem value="cet">Central European (CET)</SelectItem>
          <SelectItem value="eet">Eastern European (EET)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Utilise la variante de taille \`sm\` sur \`SelectTrigger\` pour un déclencheur plus compact de 32px de hauteur."
      }
    }
  },
  render: () => <Select>
      <SelectTrigger size="sm" className="w-[180px]">
        <SelectValue placeholder="Small trigger" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
        <SelectItem value="c">Option C</SelectItem>
      </SelectContent>
    </Select>
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Disabled" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
      </SelectContent>
    </Select>
}`,...o.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b" disabled>
          Option B (disabled)
        </SelectItem>
        <SelectItem value="c">Option C</SelectItem>
      </SelectContent>
    </Select>
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="framework">Framework</Label>
      <Select>
        <SelectTrigger id="framework" className="w-[180px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
          <SelectItem value="astro">Astro</SelectItem>
          <SelectItem value="nuxt">Nuxt</SelectItem>
        </SelectContent>
      </Select>
    </div>
}`,...p.parameters?.docs?.source}}};const R=["Default","WithGroups","SizeSmall","Disabled","DisabledItem","WithLabel"];export{n as Default,o as Disabled,m as DisabledItem,i as SizeSmall,s as WithGroups,p as WithLabel,R as __namedExportsOrder,P as default};
