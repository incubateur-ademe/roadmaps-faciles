import{j as o}from"./iframe-B2FihN7C.js";import{B as e}from"./button-D6iiOFoj.js";import{a as t,b as r,c as i,T as c}from"./tooltip-CdqKE2kl.js";import"./preload-helper-Bg6SFuRg.js";import"./index-fNaMV5Ky.js";import"./cn-Ia6N7uSy.js";import"./index-Chw98AJh.js";import"./index-DIyHDetT.js";import"./index-cnXatIDB.js";import"./index-kqGLAE-E.js";import"./index-BD9OYmGd.js";import"./index-DfGb4vk9.js";import"./index-CpmBSX8d.js";import"./index-pkf867cR.js";import"./index-BQOpQKXN.js";import"./index-D9aAw9cH.js";import"./index-D-cGZ4AG.js";import"./index-DM1C2U8C.js";import"./index-CdVim4P9.js";const H={title:"Components/Tooltip",component:t,decorators:[d=>o.jsx(c,{children:o.jsx(d,{})})],parameters:{docs:{description:{component:"Infobulle au survol avec indicateur fléché et animation d'ouverture/fermeture. Nécessite un `TooltipProvider` englobant pour la configuration du délai."}}}},n={render:()=>o.jsxs(t,{children:[o.jsx(r,{asChild:!0,children:o.jsx(e,{variant:"outline",children:"Hover me"})}),o.jsx(i,{children:o.jsx("p",{children:"This is a tooltip"})})]})},s={render:()=>o.jsx("div",{className:"flex min-h-[100px] items-center justify-center",children:o.jsxs(t,{children:[o.jsx(r,{asChild:!0,children:o.jsx(e,{variant:"outline",children:"Top"})}),o.jsx(i,{side:"top",children:o.jsx("p",{children:"Tooltip on top"})})]})})},l={render:()=>o.jsxs(t,{children:[o.jsx(r,{asChild:!0,children:o.jsx(e,{variant:"outline",children:"Bottom"})}),o.jsx(i,{side:"bottom",children:o.jsx("p",{children:"Tooltip on bottom"})})]})},p={render:()=>o.jsx("div",{className:"flex justify-center",children:o.jsxs(t,{children:[o.jsx(r,{asChild:!0,children:o.jsx(e,{variant:"outline",children:"Left"})}),o.jsx(i,{side:"left",children:o.jsx("p",{children:"Tooltip on left"})})]})})},a={render:()=>o.jsxs(t,{children:[o.jsx(r,{asChild:!0,children:o.jsx(e,{variant:"outline",children:"Right"})}),o.jsx(i,{side:"right",children:o.jsx("p",{children:"Tooltip on right"})})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex min-h-[100px] items-center justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>
    </div>
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Bottom</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Tooltip on bottom</p>
      </TooltipContent>
    </Tooltip>
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex justify-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
}`,...p.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Right</Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>Tooltip on right</p>
      </TooltipContent>
    </Tooltip>
}`,...a.parameters?.docs?.source}}};const P=["Default","SideTop","SideBottom","SideLeft","SideRight"];export{n as Default,l as SideBottom,p as SideLeft,a as SideRight,s as SideTop,P as __namedExportsOrder,H as default};
