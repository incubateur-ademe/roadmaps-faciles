import{j as e}from"./iframe-B2FihN7C.js";import{T as d,f as b,a as i,b as n,c as l,d as c,e as a,g as T}from"./table-DOPh8Joy.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";const j={title:"Components/Table",component:d,parameters:{docs:{description:{component:"Tableau de données responsive avec conteneur à défilement horizontal, lignes surlignées au survol et caption/footer optionnels."}}}},m=[{invoice:"INV001",status:"Paid",method:"Credit Card",amount:"$250.00"},{invoice:"INV002",status:"Pending",method:"PayPal",amount:"$150.00"},{invoice:"INV003",status:"Unpaid",method:"Bank Transfer",amount:"$350.00"},{invoice:"INV004",status:"Paid",method:"Credit Card",amount:"$450.00"},{invoice:"INV005",status:"Paid",method:"PayPal",amount:"$550.00"}],o={render:()=>e.jsxs(d,{children:[e.jsx(b,{children:"A list of your recent invoices."}),e.jsx(i,{children:e.jsxs(n,{children:[e.jsx(l,{className:"w-[100px]",children:"Invoice"}),e.jsx(l,{children:"Status"}),e.jsx(l,{children:"Method"}),e.jsx(l,{className:"text-right",children:"Amount"})]})}),e.jsx(c,{children:m.map(s=>e.jsxs(n,{children:[e.jsx(a,{className:"font-medium",children:s.invoice}),e.jsx(a,{children:s.status}),e.jsx(a,{children:s.method}),e.jsx(a,{className:"text-right",children:s.amount})]},s.invoice))}),e.jsx(T,{children:e.jsxs(n,{children:[e.jsx(a,{colSpan:3,children:"Total"}),e.jsx(a,{className:"text-right",children:"$1,750.00"})]})})]})},r={render:()=>e.jsxs(d,{children:[e.jsx(i,{children:e.jsxs(n,{children:[e.jsx(l,{children:"Name"}),e.jsx(l,{children:"Email"}),e.jsx(l,{children:"Role"})]})}),e.jsxs(c,{children:[e.jsxs(n,{children:[e.jsx(a,{children:"Alice"}),e.jsx(a,{children:"alice@example.com"}),e.jsx(a,{children:"Admin"})]}),e.jsxs(n,{children:[e.jsx(a,{children:"Bob"}),e.jsx(a,{children:"bob@example.com"}),e.jsx(a,{children:"User"})]})]})]})},t={render:()=>e.jsxs(d,{children:[e.jsx(i,{children:e.jsxs(n,{children:[e.jsx(l,{children:"Name"}),e.jsx(l,{children:"Status"})]})}),e.jsx(c,{children:e.jsx(n,{children:e.jsx(a,{colSpan:2,className:"text-muted-foreground text-center",children:"No results."})})})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(invoice => <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right">{invoice.amount}</TableCell>
          </TableRow>)}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$1,750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice</TableCell>
          <TableCell>alice@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
      </TableBody>
    </Table>
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={2} className="text-muted-foreground text-center">
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
}`,...t.parameters?.docs?.source}}};const C=["Default","Simple","Empty"];export{o as Default,t as Empty,r as Simple,C as __namedExportsOrder,j as default};
