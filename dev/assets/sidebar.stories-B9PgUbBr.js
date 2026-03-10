import{r as b,j as e}from"./iframe-B2FihN7C.js";import{c as ae}from"./index-fNaMV5Ky.js";import{c as t}from"./cn-Ia6N7uSy.js";import{B as ne}from"./button-D6iiOFoj.js";import"./input-DmP-cY_k.js";import{S as te}from"./separator-n8Cj2e87.js";import{S as re,b as ie,c as se,d as de,e as oe}from"./sheet-CMr_3zeH.js";import{S as R}from"./skeleton-1d8i2eJP.js";import{T as le,a as ce,b as ue,c as be}from"./tooltip-CdqKE2kl.js";import{c as P}from"./createLucideIcon-ClrF36kq.js";import{S as O}from"./index-Chw98AJh.js";import{H as v}from"./house-Cc5WGd88.js";import{S as H}from"./settings-BkVK3b5C.js";import{S as pe}from"./search-z3HPfl06.js";import"./preload-helper-Bg6SFuRg.js";import"./index-DfGb4vk9.js";import"./index-B5ZU9nbQ.js";import"./index-DIyHDetT.js";import"./index-cnXatIDB.js";import"./index-kqGLAE-E.js";import"./index-pkf867cR.js";import"./index-BD9OYmGd.js";import"./index-CpmBSX8d.js";import"./index-CI4XBI4Q.js";import"./index-D-cGZ4AG.js";import"./index-DM1C2U8C.js";import"./index-BQOpQKXN.js";import"./index-D9aAw9cH.js";import"./index-CdVim4P9.js";const me=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],he=P("calendar",me);const Se=[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12",key:"o97t9d"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}]],fe=P("inbox",Se);const xe=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}]],ge=P("panel-left",xe),W=768,ve=a=>{const n=window.matchMedia(`(max-width: ${W-1}px)`);return n.addEventListener("change",a),()=>n.removeEventListener("change",a)},je=()=>window.innerWidth<W,Me=()=>!1;function we(){return b.useSyncExternalStore(ve,je,Me)}const ye="sidebar_state",Ie=3600*24*7,Ne="16rem",Ce="18rem",_e="3rem",Be="b",K=b.createContext(null);function q(){const a=b.useContext(K);if(!a)throw new Error("useSidebar must be used within a SidebarProvider.");return a}function j({defaultOpen:a=!0,open:n,onOpenChange:r,className:s,style:i,children:c,...I}){const u=we(),[y,p]=b.useState(!1),[C,Z]=b.useState(a),N=n??C,_=b.useCallback(l=>{const m=typeof l=="function"?l(N):l;r?r(m):Z(m),document.cookie=`${ye}=${m}; path=/; max-age=${Ie}`},[r,N]),B=b.useCallback(()=>u?p(l=>!l):_(l=>!l),[u,_,p]);b.useEffect(()=>{const l=m=>{m.key===Be&&(m.metaKey||m.ctrlKey)&&(m.preventDefault(),B())};return window.addEventListener("keydown",l),()=>window.removeEventListener("keydown",l)},[B]);const V=N?"expanded":"collapsed",ee=b.useMemo(()=>({state:V,open:N,setOpen:_,isMobile:u,openMobile:y,setOpenMobile:p,toggleSidebar:B}),[V,N,_,u,y,p,B]);return e.jsx(K.Provider,{value:ee,children:e.jsx(le,{delayDuration:0,children:e.jsx("div",{"data-slot":"sidebar-wrapper",style:{"--sidebar-width":Ne,"--sidebar-width-icon":_e,...i},className:t("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",s),...I,children:c})})})}function g({side:a="left",variant:n="sidebar",collapsible:r="offcanvas",className:s,children:i,...c}){const{isMobile:I,state:u,openMobile:y,setOpenMobile:p}=q();return r==="none"?e.jsx("div",{"data-slot":"sidebar",className:t("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",s),...c,children:i}):I?e.jsx(re,{open:y,onOpenChange:p,...c,children:e.jsxs(ie,{"data-sidebar":"sidebar","data-slot":"sidebar","data-mobile":"true",className:"bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",style:{"--sidebar-width":Ce},side:a,children:[e.jsxs(se,{className:"sr-only",children:[e.jsx(de,{children:"Sidebar"}),e.jsx(oe,{children:"Displays the mobile sidebar."})]}),e.jsx("div",{className:"flex h-full w-full flex-col",children:i})]})}):e.jsxs("div",{className:"group peer text-sidebar-foreground","data-state":u,"data-collapsible":u==="collapsed"?r:"","data-variant":n,"data-side":a,"data-slot":"sidebar",children:[e.jsx("div",{"data-slot":"sidebar-gap",className:t("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear","group-data-[collapsible=offcanvas]:w-0","group-data-[side=right]:rotate-180",n==="floating"||n==="inset"?"group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]":"group-data-[collapsible=icon]:w-(--sidebar-width-icon)")}),e.jsx("div",{"data-slot":"sidebar-container",className:t("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",a==="left"?"left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]":"right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",n==="floating"||n==="inset"?"p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]":"group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",s),...c,children:e.jsx("div",{"data-sidebar":"sidebar","data-slot":"sidebar-inner",className:"bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",children:i})})]})}function $({className:a,onClick:n,...r}){const{toggleSidebar:s}=q();return e.jsxs(ne,{"data-sidebar":"trigger","data-slot":"sidebar-trigger",variant:"ghost",size:"icon",className:t("size-7",a),onClick:i=>{n?.(i),s()},...r,children:[e.jsx(ge,{}),e.jsx("span",{className:"sr-only",children:"Toggle Sidebar"})]})}function M({className:a,...n}){return e.jsx("main",{"data-slot":"sidebar-inset",className:t("bg-background relative flex w-full flex-1 flex-col","md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",a),...n})}function F({className:a,...n}){return e.jsx("div",{"data-slot":"sidebar-header","data-sidebar":"header",className:t("flex flex-col gap-2 p-2",a),...n})}function U({className:a,...n}){return e.jsx("div",{"data-slot":"sidebar-footer","data-sidebar":"footer",className:t("flex flex-col gap-2 p-2",a),...n})}function X({className:a,...n}){return e.jsx(te,{"data-slot":"sidebar-separator","data-sidebar":"separator",className:t("bg-sidebar-border mx-2 w-auto",a),...n})}function w({className:a,...n}){return e.jsx("div",{"data-slot":"sidebar-content","data-sidebar":"content",className:t("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",a),...n})}function h({className:a,...n}){return e.jsx("div",{"data-slot":"sidebar-group","data-sidebar":"group",className:t("relative flex w-full min-w-0 flex-col p-2",a),...n})}function S({className:a,asChild:n=!1,...r}){const s=n?O:"div";return e.jsx(s,{"data-slot":"sidebar-group-label","data-sidebar":"group-label",className:t("text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0","group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",a),...r})}function f({className:a,...n}){return e.jsx("div",{"data-slot":"sidebar-group-content","data-sidebar":"group-content",className:t("w-full text-sm",a),...n})}function x({className:a,...n}){return e.jsx("ul",{"data-slot":"sidebar-menu","data-sidebar":"menu",className:t("flex w-full min-w-0 flex-col gap-1",a),...n})}function d({className:a,...n}){return e.jsx("li",{"data-slot":"sidebar-menu-item","data-sidebar":"menu-item",className:t("group/menu-item relative",a),...n})}const Ge=ae("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[active=true]:bg-white/60 data-[active=true]:font-bold data-[active=true]:text-sidebar-primary data-[active=true]:shadow-sm data-[active=true]:ring-1 data-[active=true]:ring-black/5 dark:data-[active=true]:bg-white/5 dark:data-[active=true]:ring-white/5 data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",{variants:{variant:{default:"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",outline:"bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"},size:{default:"h-8 text-sm",sm:"h-7 text-xs",lg:"h-12 text-sm group-data-[collapsible=icon]:p-0!"}},defaultVariants:{variant:"default",size:"default"}});function o({asChild:a=!1,isActive:n=!1,variant:r="default",size:s="default",tooltip:i,className:c,...I}){const u=a?O:"button",{isMobile:y,state:p}=q(),C=e.jsx(u,{"data-slot":"sidebar-menu-button","data-sidebar":"menu-button","data-size":s,"data-active":n,className:t(Ge({variant:r,size:s}),c),...I});return i?(typeof i=="string"&&(i={children:i}),e.jsxs(ce,{children:[e.jsx(ue,{asChild:!0,children:C}),e.jsx(be,{side:"right",align:"center",hidden:p!=="collapsed"||y,...i})]})):C}function Y({className:a,...n}){return e.jsx("div",{"data-slot":"sidebar-menu-badge","data-sidebar":"menu-badge",className:t("text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none","peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground","peer-data-[size=sm]/menu-button:top-1","peer-data-[size=default]/menu-button:top-1.5","peer-data-[size=lg]/menu-button:top-2.5","group-data-[collapsible=icon]:hidden",a),...n})}function J({className:a,showIcon:n=!1,...r}){return e.jsxs("div",{"data-slot":"sidebar-menu-skeleton","data-sidebar":"menu-skeleton",className:t("flex h-8 items-center gap-2 rounded-md px-2",a),...r,children:[n&&e.jsx(R,{className:"size-4 rounded-md","data-sidebar":"menu-skeleton-icon"}),e.jsx(R,{className:"h-4 max-w-(--skeleton-width) flex-1","data-sidebar":"menu-skeleton-text",style:{"--skeleton-width":"70%"}})]})}function Q({className:a,...n}){return e.jsx("ul",{"data-slot":"sidebar-menu-sub","data-sidebar":"menu-sub",className:t("border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5","group-data-[collapsible=icon]:hidden",a),...n})}function D({className:a,...n}){return e.jsx("li",{"data-slot":"sidebar-menu-sub-item","data-sidebar":"menu-sub-item",className:t("group/menu-sub-item relative",a),...n})}function E({asChild:a=!1,size:n="md",isActive:r=!1,className:s,...i}){const c=a?O:"a";return e.jsx(c,{"data-slot":"sidebar-menu-sub-button","data-sidebar":"menu-sub-button","data-size":n,"data-active":r,className:t("text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0","data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",n==="sm"&&"text-xs",n==="md"&&"text-sm","group-data-[collapsible=icon]:hidden",s),...i})}g.__docgenInfo={description:'@param side `"left"` (default) or `"right"` edge placement.\n@param variant `"sidebar"` (default border), `"floating"` (detached with shadow), `"inset"` (nested in content).\n@param collapsible `"offcanvas"` (slides out), `"icon"` (collapses to icon strip), `"none"` (always expanded).',methods:[],displayName:"Sidebar",props:{side:{required:!1,tsType:{name:"union",raw:'"left" | "right"',elements:[{name:"literal",value:'"left"'},{name:"literal",value:'"right"'}]},description:"",defaultValue:{value:'"left"',computed:!1}},variant:{required:!1,tsType:{name:"union",raw:'"floating" | "inset" | "sidebar"',elements:[{name:"literal",value:'"floating"'},{name:"literal",value:'"inset"'},{name:"literal",value:'"sidebar"'}]},description:"",defaultValue:{value:'"sidebar"',computed:!1}},collapsible:{required:!1,tsType:{name:"union",raw:'"icon" | "none" | "offcanvas"',elements:[{name:"literal",value:'"icon"'},{name:"literal",value:'"none"'},{name:"literal",value:'"offcanvas"'}]},description:"",defaultValue:{value:'"offcanvas"',computed:!1}}}};w.__docgenInfo={description:"",methods:[],displayName:"SidebarContent"};U.__docgenInfo={description:"",methods:[],displayName:"SidebarFooter"};h.__docgenInfo={description:"",methods:[],displayName:"SidebarGroup"};f.__docgenInfo={description:"",methods:[],displayName:"SidebarGroupContent"};S.__docgenInfo={description:"",methods:[],displayName:"SidebarGroupLabel",props:{asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};F.__docgenInfo={description:"",methods:[],displayName:"SidebarHeader"};M.__docgenInfo={description:"",methods:[],displayName:"SidebarInset"};x.__docgenInfo={description:"",methods:[],displayName:"SidebarMenu"};Y.__docgenInfo={description:"",methods:[],displayName:"SidebarMenuBadge"};o.__docgenInfo={description:"@param isActive Marks the button as the current/active item (accent background + font-medium).\n@param tooltip Tooltip shown when sidebar is collapsed. String or `TooltipContent` props.\n@param asChild Merge props onto child element via Radix `Slot`.",methods:[],displayName:"SidebarMenuButton",props:{asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},isActive:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},tooltip:{required:!1,tsType:{name:"union",raw:"ComponentProps<typeof TooltipContent> | string",elements:[{name:"ComponentProps",elements:[{name:"TooltipContent"}],raw:"ComponentProps<typeof TooltipContent>"},{name:"string"}]},description:""},variant:{defaultValue:{value:'"default"',computed:!1},required:!1},size:{defaultValue:{value:'"default"',computed:!1},required:!1}}};d.__docgenInfo={description:"",methods:[],displayName:"SidebarMenuItem"};J.__docgenInfo={description:"",methods:[],displayName:"SidebarMenuSkeleton",props:{showIcon:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};Q.__docgenInfo={description:"",methods:[],displayName:"SidebarMenuSub"};E.__docgenInfo={description:'@param isActive Marks the sub-button as the current/active item.\n@param size `"md"` (default) or `"sm"` (xs text).',methods:[],displayName:"SidebarMenuSubButton",props:{asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"md" | "sm"',elements:[{name:"literal",value:'"md"'},{name:"literal",value:'"sm"'}]},description:"",defaultValue:{value:'"md"',computed:!1}},isActive:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};D.__docgenInfo={description:"",methods:[],displayName:"SidebarMenuSubItem"};j.__docgenInfo={description:"",methods:[],displayName:"SidebarProvider",props:{defaultOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},open:{required:!1,tsType:{name:"boolean"},description:""},onOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""}}};X.__docgenInfo={description:"",methods:[],displayName:"SidebarSeparator"};$.__docgenInfo={description:"",methods:[],displayName:"SidebarTrigger"};const da={title:"Components/Sidebar",component:g,decorators:[a=>e.jsx("div",{style:{height:"600px",display:"flex"},children:e.jsx(a,{})})],parameters:{docs:{description:{component:"Layout de barre latérale repliable avec fallback en sheet sur mobile, raccourci clavier (Cmd+B), tooltips, sous-menus et support de badges."}}}},ke=[{title:"Home",icon:v,url:"#"},{title:"Inbox",icon:fe,url:"#",badge:"12"},{title:"Calendar",icon:he,url:"#"},{title:"Search",icon:pe,url:"#"},{title:"Settings",icon:H,url:"#"}],G={render:()=>e.jsxs(j,{children:[e.jsxs(g,{children:[e.jsx(F,{children:e.jsx("div",{className:"px-2 py-1 text-sm font-semibold",children:"Application"})}),e.jsx(w,{children:e.jsxs(h,{children:[e.jsx(S,{children:"Navigation"}),e.jsx(f,{children:e.jsx(x,{children:ke.map(a=>e.jsxs(d,{children:[e.jsxs(o,{tooltip:a.title,children:[e.jsx(a.icon,{}),e.jsx("span",{children:a.title})]}),a.badge&&e.jsx(Y,{children:a.badge})]},a.title))})})]})}),e.jsx(U,{children:e.jsx("div",{className:"px-2 py-1 text-xs text-muted-foreground",children:"v1.0.0"})})]}),e.jsxs(M,{children:[e.jsxs("header",{className:"flex items-center gap-2 border-b p-4",children:[e.jsx($,{}),e.jsx("span",{className:"text-sm font-medium",children:"Content Area"})]}),e.jsx("div",{className:"p-4",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:"Main content goes here."})})]})]})},k={render:()=>e.jsxs(j,{children:[e.jsx(g,{children:e.jsx(w,{children:e.jsxs(h,{children:[e.jsx(S,{children:"Platform"}),e.jsx(f,{children:e.jsxs(x,{children:[e.jsx(d,{children:e.jsxs(o,{isActive:!0,children:[e.jsx(v,{}),e.jsx("span",{children:"Dashboard"})]})}),e.jsxs(d,{children:[e.jsxs(o,{children:[e.jsx(H,{}),e.jsx("span",{children:"Settings"})]}),e.jsxs(Q,{children:[e.jsx(D,{children:e.jsx(E,{isActive:!0,children:"General"})}),e.jsx(D,{children:e.jsx(E,{children:"Security"})}),e.jsx(D,{children:e.jsx(E,{children:"Notifications"})})]})]})]})})]})})}),e.jsx(M,{children:e.jsx("div",{className:"p-4",children:"Content"})})]})},T={render:()=>e.jsxs(j,{children:[e.jsx(g,{children:e.jsxs(w,{children:[e.jsxs(h,{children:[e.jsx(S,{children:"Main"}),e.jsx(f,{children:e.jsx(x,{children:e.jsx(d,{children:e.jsxs(o,{children:[e.jsx(v,{}),e.jsx("span",{children:"Home"})]})})})})]}),e.jsx(X,{}),e.jsxs(h,{children:[e.jsx(S,{children:"Other"}),e.jsx(f,{children:e.jsx(x,{children:e.jsx(d,{children:e.jsxs(o,{children:[e.jsx(H,{}),e.jsx("span",{children:"Settings"})]})})})})]})]})}),e.jsx(M,{children:e.jsx("div",{className:"p-4",children:"Content"})})]})},L={parameters:{docs:{description:{story:"Utilise des composants `SidebarMenuSkeleton` avec des placeholders d'icones pour afficher un état de chargement pendant le fetch des items du menu."}}},render:()=>e.jsxs(j,{children:[e.jsx(g,{children:e.jsx(w,{children:e.jsxs(h,{children:[e.jsx(S,{children:"Loading..."}),e.jsx(f,{children:e.jsx(x,{children:Array.from({length:5}).map((a,n)=>e.jsx(d,{children:e.jsx(J,{showIcon:!0})},n))})})]})})}),e.jsx(M,{children:e.jsx("div",{className:"p-4",children:"Loading sidebar items..."})})]})},z={parameters:{docs:{description:{story:'Définit `collapsible="none"` pour désactiver le repli -- la barre latérale reste entièrement ouverte en permanence.'}}},render:()=>e.jsxs(j,{children:[e.jsx(g,{collapsible:"none",children:e.jsx(w,{children:e.jsxs(h,{children:[e.jsx(S,{children:"Non-collapsible"}),e.jsx(f,{children:e.jsxs(x,{children:[e.jsx(d,{children:e.jsxs(o,{children:[e.jsx(v,{}),e.jsx("span",{children:"Home"})]})}),e.jsx(d,{children:e.jsxs(o,{children:[e.jsx(H,{}),e.jsx("span",{children:"Settings"})]})})]})})]})})}),e.jsx(M,{children:e.jsx("div",{className:"p-4",children:"This sidebar cannot be collapsed."})})]})},A={render:()=>e.jsxs(j,{children:[e.jsx(g,{children:e.jsx(w,{children:e.jsxs(h,{children:[e.jsx(S,{children:"Button Sizes"}),e.jsx(f,{children:e.jsxs(x,{children:[e.jsx(d,{children:e.jsxs(o,{size:"sm",children:[e.jsx(v,{}),e.jsx("span",{children:"Small"})]})}),e.jsx(d,{children:e.jsxs(o,{size:"default",children:[e.jsx(v,{}),e.jsx("span",{children:"Default"})]})}),e.jsx(d,{children:e.jsxs(o,{size:"lg",children:[e.jsx(v,{}),e.jsx("span",{children:"Large"})]})})]})})]})})}),e.jsx(M,{children:e.jsx("div",{className:"p-4",children:"Different menu button sizes."})})]})};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="px-2 py-1 text-sm font-semibold">Application</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map(item => <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 py-1 text-xs text-muted-foreground">v1.0.0</div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center gap-2 border-b p-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Content Area</span>
        </header>
        <div className="p-4">
          <p className="text-muted-foreground text-sm">Main content goes here.</p>
        </div>
      </SidebarInset>
    </SidebarProvider>
}`,...G.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Home />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton isActive>General</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>Security</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>Notifications</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4">Content</div>
      </SidebarInset>
    </SidebarProvider>
}`,...k.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Other</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4">Content</div>
      </SidebarInset>
    </SidebarProvider>
}`,...T.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Utilise des composants \`SidebarMenuSkeleton\` avec des placeholders d'icones pour afficher un état de chargement pendant le fetch des items du menu."
      }
    }
  },
  render: () => <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Loading...</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Array.from({
                length: 5
              }).map((_, i) => <SidebarMenuItem key={i}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4">Loading sidebar items...</div>
      </SidebarInset>
    </SidebarProvider>
}`,...L.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Définit \`collapsible="none"\` pour désactiver le repli -- la barre latérale reste entièrement ouverte en permanence.'
      }
    }
  },
  render: () => <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Non-collapsible</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4">This sidebar cannot be collapsed.</div>
      </SidebarInset>
    </SidebarProvider>
}`,...z.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Button Sizes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="sm">
                    <Home />
                    <span>Small</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton size="default">
                    <Home />
                    <span>Default</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg">
                    <Home />
                    <span>Large</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4">Different menu button sizes.</div>
      </SidebarInset>
    </SidebarProvider>
}`,...A.parameters?.docs?.source}}};const oa=["Default","WithSubMenu","WithSeparator","SkeletonLoading","CollapsibleNone","MenuButtonSizes"];export{z as CollapsibleNone,G as Default,A as MenuButtonSizes,L as SkeletonLoading,T as WithSeparator,k as WithSubMenu,oa as __namedExportsOrder,da as default};
