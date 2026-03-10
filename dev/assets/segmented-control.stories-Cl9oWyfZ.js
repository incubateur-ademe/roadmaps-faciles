import{r as u,j as e}from"./iframe-BcyfjZH2.js";import{S as a,a as t}from"./segmented-control-CPbExTus.js";import{c as m}from"./createLucideIcon-CVwuA9hd.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";import"./index-Bc7gOKRe.js";import"./index-Ci4M2BYY.js";import"./index-BcLzogVk.js";import"./index-B3b2TLUN.js";import"./index-BQlpQe1r.js";import"./index-B80VdNFB.js";import"./index-CMrQeyWO.js";import"./index-W4PQkU0l.js";import"./index-CNFrgnUn.js";const g=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],p=m("chart-column",g);const S=[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]],h=m("layout-grid",S);const C=[["path",{d:"M3 5h.01",key:"18ugdj"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 19h.01",key:"noohij"}],["path",{d:"M8 5h13",key:"1pao27"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 19h13",key:"m83p4d"}]],v=m("list",C),_={title:"Components/SegmentedControl",component:a,parameters:{docs:{description:{component:"Bascule exclusive entre options dans un conteneur bordé. L'item actif reçoit le fond primaire. Supporte icones et texte."}}}},s={render:function(){const[r,o]=u.useState("account");return e.jsxs(a,{value:r,onValueChange:n=>n&&o(n),children:[e.jsx(t,{value:"account",children:"Account"}),e.jsx(t,{value:"password",children:"Password"}),e.jsx(t,{value:"notifications",children:"Notifications"})]})}},i={parameters:{docs:{description:{story:"Les items peuvent inclure des icones à coté du texte pour un contexte visuel supplémentaire."}}},render:function(){const[r,o]=u.useState("grid");return e.jsxs(a,{value:r,onValueChange:n=>n&&o(n),children:[e.jsxs(t,{value:"grid",children:[e.jsx(h,{})," Grid"]}),e.jsxs(t,{value:"list",children:[e.jsx(v,{})," List"]}),e.jsxs(t,{value:"chart",children:[e.jsx(p,{})," Chart"]})]})}},l={parameters:{docs:{description:{story:"Items icone seule pour les layouts compacts. Ajouter un `aria-label` pour l'accessibilité."}}},render:function(){const[r,o]=u.useState("grid");return e.jsxs(a,{value:r,onValueChange:n=>n&&o(n),children:[e.jsx(t,{value:"grid","aria-label":"Grid view",children:e.jsx(h,{})}),e.jsx(t,{value:"list","aria-label":"List view",children:e.jsx(v,{})}),e.jsx(t,{value:"chart","aria-label":"Chart view",children:e.jsx(p,{})})]})}},c={render:function(){const[r,o]=u.useState("active");return e.jsxs(a,{value:r,onValueChange:n=>n&&o(n),children:[e.jsx(t,{value:"active",children:"Active"}),e.jsx(t,{value:"disabled",disabled:!0,children:"Disabled"}),e.jsx(t,{value:"another",children:"Another"})]})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: function DefaultStory() {
    const [value, setValue] = useState("account");
    return <SegmentedControl value={value} onValueChange={(v: string) => v && setValue(v)}>
        <SegmentedControlItem value="account">Account</SegmentedControlItem>
        <SegmentedControlItem value="password">Password</SegmentedControlItem>
        <SegmentedControlItem value="notifications">Notifications</SegmentedControlItem>
      </SegmentedControl>;
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Les items peuvent inclure des icones à coté du texte pour un contexte visuel supplémentaire."
      }
    }
  },
  render: function WithIconsStory() {
    const [value, setValue] = useState("grid");
    return <SegmentedControl value={value} onValueChange={(v: string) => v && setValue(v)}>
        <SegmentedControlItem value="grid">
          <LayoutGrid /> Grid
        </SegmentedControlItem>
        <SegmentedControlItem value="list">
          <List /> List
        </SegmentedControlItem>
        <SegmentedControlItem value="chart">
          <BarChart3 /> Chart
        </SegmentedControlItem>
      </SegmentedControl>;
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Items icone seule pour les layouts compacts. Ajouter un \`aria-label\` pour l'accessibilité."
      }
    }
  },
  render: function IconOnlyStory() {
    const [value, setValue] = useState("grid");
    return <SegmentedControl value={value} onValueChange={(v: string) => v && setValue(v)}>
        <SegmentedControlItem value="grid" aria-label="Grid view">
          <LayoutGrid />
        </SegmentedControlItem>
        <SegmentedControlItem value="list" aria-label="List view">
          <List />
        </SegmentedControlItem>
        <SegmentedControlItem value="chart" aria-label="Chart view">
          <BarChart3 />
        </SegmentedControlItem>
      </SegmentedControl>;
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: function WithDisabledStory() {
    const [value, setValue] = useState("active");
    return <SegmentedControl value={value} onValueChange={(v: string) => v && setValue(v)}>
        <SegmentedControlItem value="active">Active</SegmentedControlItem>
        <SegmentedControlItem value="disabled" disabled>
          Disabled
        </SegmentedControlItem>
        <SegmentedControlItem value="another">Another</SegmentedControlItem>
      </SegmentedControl>;
  }
}`,...c.parameters?.docs?.source}}};const G=["Default","WithIcons","IconOnly","WithDisabled"];export{s as Default,l as IconOnly,c as WithDisabled,i as WithIcons,G as __namedExportsOrder,_ as default};
