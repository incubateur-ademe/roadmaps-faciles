import{j as e}from"./iframe-BcyfjZH2.js";import{L as o}from"./label-DXEOaO3m.js";import{R as n,a as i}from"./radio-group-O3SyvCBI.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";import"./index-Ci4M2BYY.js";import"./index-BcLzogVk.js";import"./circle-CZOXP-Lo.js";import"./createLucideIcon-CVwuA9hd.js";import"./index-BQlpQe1r.js";import"./index-B80VdNFB.js";import"./index-Bc7gOKRe.js";import"./index-B3b2TLUN.js";import"./index-CMrQeyWO.js";import"./index-W4PQkU0l.js";import"./index-CNFrgnUn.js";import"./index-C9LbcBlT.js";import"./index-QjQbZVBU.js";import"./index-CS8GyP0I.js";const F={title:"Components/RadioGroup",component:n,parameters:{docs:{description:{component:"Groupe de boutons radio accessible basé sur Radix. Affiche un indicateur circulaire plein sur l'item sélectionné."}}}},t={render:()=>e.jsxs(n,{defaultValue:"option-one",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(i,{value:"option-one",id:"option-one"}),e.jsx(o,{htmlFor:"option-one",children:"Option One"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(i,{value:"option-two",id:"option-two"}),e.jsx(o,{htmlFor:"option-two",children:"Option Two"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(i,{value:"option-three",id:"option-three"}),e.jsx(o,{htmlFor:"option-three",children:"Option Three"})]})]})},a={render:()=>e.jsxs(n,{defaultValue:"option-one",disabled:!0,children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(i,{value:"option-one",id:"d-option-one"}),e.jsx(o,{htmlFor:"d-option-one",children:"Option One"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(i,{value:"option-two",id:"d-option-two"}),e.jsx(o,{htmlFor:"d-option-two",children:"Option Two"})]})]})},r={parameters:{docs:{description:{story:"Remplace la grille verticale par défaut par `flex-row` pour des options radio horizontales inline."}}},render:()=>e.jsxs(n,{defaultValue:"a",className:"flex flex-row gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(i,{value:"a",id:"h-a"}),e.jsx(o,{htmlFor:"h-a",children:"A"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(i,{value:"b",id:"h-b"}),e.jsx(o,{htmlFor:"h-b",children:"B"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(i,{value:"c",id:"h-c"}),e.jsx(o,{htmlFor:"h-c",children:"C"})]})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <RadioGroup defaultValue="option-one">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-three" id="option-three" />
        <Label htmlFor="option-three">Option Three</Label>
      </div>
    </RadioGroup>
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <RadioGroup defaultValue="option-one" disabled>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-one" id="d-option-one" />
        <Label htmlFor="d-option-one">Option One</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-two" id="d-option-two" />
        <Label htmlFor="d-option-two">Option Two</Label>
      </div>
    </RadioGroup>
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Remplace la grille verticale par défaut par \`flex-row\` pour des options radio horizontales inline."
      }
    }
  },
  render: () => <RadioGroup defaultValue="a" className="flex flex-row gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="a" id="h-a" />
        <Label htmlFor="h-a">A</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="b" id="h-b" />
        <Label htmlFor="h-b">B</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="c" id="h-c" />
        <Label htmlFor="h-c">C</Label>
      </div>
    </RadioGroup>
}`,...r.parameters?.docs?.source}}};const O=["Default","Disabled","Horizontal"];export{t as Default,a as Disabled,r as Horizontal,O as __namedExportsOrder,F as default};
