import{j as e}from"./iframe-B2FihN7C.js";import{A as f,b as g}from"./avatar-Dozkvjk2.js";import{B as c}from"./badge-BIU313XZ.js";import{C as l,d as o}from"./card-BmDUaFBh.js";import{T as m,a as n,b as s,c as t,d as a,e as i,f as b,g as N,S as v,C as A}from"./timeline-DjVKim7l.js";import{M as S}from"./message-square-DvqItLIR.js";import{C as I}from"./check-CvL3Vtsu.js";import{c as V}from"./createLucideIcon-ClrF36kq.js";import{C as w}from"./circle-alert-Dc398Jgd.js";import"./preload-helper-Bg6SFuRg.js";import"./cn-Ia6N7uSy.js";import"./index-kqGLAE-E.js";import"./index-CpmBSX8d.js";import"./index-cnXatIDB.js";import"./index-DfGb4vk9.js";import"./index-Chw98AJh.js";import"./index-fNaMV5Ky.js";const L=[["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",key:"emmmcr"}],["path",{d:"M7 10v12",key:"1qc93n"}]],k=V("thumbs-up",L),X={title:"Components/Timeline",component:m,parameters:{docs:{description:{component:"Timeline verticale pour afficher une séquence d'événements. Compound component : `Timeline` > `TimelineItem` > `TimelineSeparator` (dot + connecteur) + `TimelineContent`."}}}},d={render:()=>e.jsxs(m,{className:"max-w-md",children:[e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{}),e.jsx(a,{})]}),e.jsxs(i,{children:[e.jsx("p",{className:"text-sm font-medium",children:"Idée soumise"}),e.jsx("p",{className:"text-muted-foreground text-xs",children:"Il y a 3 jours"})]})]}),e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{}),e.jsx(a,{})]}),e.jsxs(i,{children:[e.jsx("p",{className:"text-sm font-medium",children:"En cours d'étude"}),e.jsx("p",{className:"text-muted-foreground text-xs",children:"Il y a 2 jours"})]})]}),e.jsxs(n,{children:[e.jsx(s,{children:e.jsx(t,{})}),e.jsxs(i,{children:[e.jsx("p",{className:"text-sm font-medium",children:"Planifié"}),e.jsx("p",{className:"text-muted-foreground text-xs",children:"Aujourd'hui"})]})]})]})},x={name:"Playground",parameters:{docs:{description:{story:"Story interactive — utilise les controls Storybook pour configurer les props des sous-composants (dot variant/size, connector variant, sub-connector indent)."}}},argTypes:{dotVariant:{control:"select",options:["default","outline","success","warning","destructive","muted"],description:"TimelineDot variant",table:{category:"TimelineDot"}},dotSize:{control:"select",options:["sm","default","lg","icon"],description:"TimelineDot size",table:{category:"TimelineDot"}},connectorVariant:{control:"select",options:["connected","spaced"],description:"TimelineConnector variant",table:{category:"TimelineConnector"}},subIndent:{control:"select",options:["sm","default","lg"],description:"TimelineSubConnector indent",table:{category:"TimelineSubConnector"}}},args:{dotVariant:"default",dotSize:"icon",connectorVariant:"connected",subIndent:"default"},render:D=>{const{dotVariant:C,dotSize:r,connectorVariant:z,subIndent:y}=D;return e.jsxs(m,{className:"max-w-xl",children:[e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{variant:C,size:r,children:r==="icon"&&e.jsx(S,{className:"size-4"})}),e.jsx(a,{variant:z})]}),e.jsxs(i,{children:[e.jsx("p",{className:"text-muted-foreground text-xs",children:"il y a 10 minutes"}),e.jsx(l,{className:"mt-1.5",children:e.jsxs(o,{className:"p-4",children:[e.jsx("p",{className:"text-sm font-medium",children:"Commentaire principal"}),e.jsx("p",{className:"mt-1 text-sm",children:"Avec du contenu détaillé et des réponses."})]})}),e.jsxs(b,{indent:y,children:[e.jsx(N,{children:e.jsx(l,{children:e.jsxs(o,{className:"p-3",children:[e.jsx("p",{className:"text-sm font-medium",children:"Première réponse"}),e.jsx("p",{className:"mt-1 text-sm",children:"Bonne idée !"})]})})}),e.jsx(N,{children:e.jsx(l,{children:e.jsxs(o,{className:"p-3",children:[e.jsx("p",{className:"text-sm font-medium",children:"Deuxième réponse"}),e.jsx("p",{className:"mt-1 text-sm",children:"Merci, noté pour la v2."})]})})})]})]})]}),e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{variant:C,size:r,children:r==="icon"&&e.jsx(I,{className:"size-4"})}),e.jsx(a,{variant:z})]}),e.jsxs(i,{children:[e.jsx("p",{className:"text-muted-foreground text-xs",children:"il y a 2 heures"}),e.jsx("p",{className:"text-sm font-medium",children:"Événement simple"})]})]}),e.jsxs(n,{children:[e.jsx(s,{children:e.jsx(t,{variant:C,size:r,children:r==="icon"&&e.jsx(v,{className:"size-4"})})}),e.jsxs(i,{children:[e.jsx("p",{className:"text-muted-foreground text-xs",children:"il y a 3 jours"}),e.jsx("p",{className:"text-sm font-medium",children:"Dernier événement"})]})]})]})}},p={name:"Dot Variants",render:()=>e.jsxs(m,{className:"max-w-md",children:[e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{variant:"success"}),e.jsx(a,{})]}),e.jsx(i,{children:e.jsx("p",{className:"text-sm font-medium",children:"Terminé"})})]}),e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{variant:"warning"}),e.jsx(a,{})]}),e.jsx(i,{children:e.jsx("p",{className:"text-sm font-medium",children:"En attente"})})]}),e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{variant:"destructive"}),e.jsx(a,{})]}),e.jsx(i,{children:e.jsx("p",{className:"text-sm font-medium",children:"Rejeté"})})]}),e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{variant:"outline"}),e.jsx(a,{})]}),e.jsx(i,{children:e.jsx("p",{className:"text-sm font-medium",children:"Brouillon"})})]}),e.jsxs(n,{children:[e.jsx(s,{children:e.jsx(t,{variant:"muted"})}),e.jsx(i,{children:e.jsx("p",{className:"text-sm font-medium",children:"Archivé"})})]})]})},u={name:"With Icons",render:()=>e.jsxs(m,{className:"max-w-md",children:[e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{variant:"success",size:"icon",children:e.jsx(I,{className:"size-4"})}),e.jsx(a,{})]}),e.jsxs(i,{children:[e.jsx("p",{className:"text-sm font-medium",children:"Déployé en production"}),e.jsx("p",{className:"text-muted-foreground text-xs",children:"Il y a 1 heure"})]})]}),e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{variant:"default",size:"icon",children:e.jsx(S,{className:"size-4"})}),e.jsx(a,{})]}),e.jsxs(i,{children:[e.jsx("p",{className:"text-sm font-medium",children:"Nouveau commentaire"}),e.jsx("p",{className:"text-muted-foreground text-xs",children:"Il y a 3 heures"})]})]}),e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{variant:"warning",size:"icon",children:e.jsx(w,{className:"size-4"})}),e.jsx(a,{})]}),e.jsxs(i,{children:[e.jsx("p",{className:"text-sm font-medium",children:"Signalé pour modération"}),e.jsx("p",{className:"text-muted-foreground text-xs",children:"Hier"})]})]}),e.jsxs(n,{children:[e.jsx(s,{children:e.jsx(t,{variant:"outline",size:"icon",children:e.jsx(A,{className:"size-4"})})}),e.jsxs(i,{children:[e.jsx("p",{className:"text-sm font-medium",children:"Idée soumise"}),e.jsx("p",{className:"text-muted-foreground text-xs",children:"Il y a 3 jours"})]})]})]})},T={name:"Post Activity (Real-World)",parameters:{docs:{description:{story:"Exemple réaliste simulant l'historique d'activité d'un post : commentaires avec replies, changements de statut avec badge, votes agrégés, et création du post."}}},render:()=>e.jsxs(m,{className:"max-w-xl",children:[e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{variant:"default",size:"icon",children:e.jsx(S,{className:"size-4"})}),e.jsx(a,{})]}),e.jsxs(i,{children:[e.jsx("p",{className:"text-muted-foreground text-xs",children:"il y a 10 minutes"}),e.jsx(l,{className:"mt-1.5",children:e.jsxs(o,{className:"p-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(f,{className:"size-8",children:e.jsx(g,{children:"LS"})}),e.jsx("span",{className:"text-sm font-medium",children:"Lilian Saget-Lethias"}),e.jsx(c,{variant:"destructive",className:"text-[10px]",children:"Propriétaire"}),e.jsx(c,{variant:"secondary",className:"text-[10px]",children:"Auteur"})]}),e.jsx("p",{className:"mt-2 text-sm",children:"Commentaire principal avec du contenu détaillé."}),e.jsxs("div",{className:"text-muted-foreground mt-2 flex items-center gap-3 text-xs",children:[e.jsx("span",{children:"04/03/2026 20:33"}),e.jsx("span",{children:"2 réponse(s)"})]})]})}),e.jsxs(b,{children:[e.jsx(N,{children:e.jsx(l,{children:e.jsxs(o,{className:"p-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(f,{className:"size-7",children:e.jsx(g,{className:"text-xs",children:"ML"})}),e.jsx("span",{className:"text-sm font-medium",children:"Marie Leroy"})]}),e.jsx("p",{className:"mt-1.5 text-sm",children:"Bonne idée ! +1 pour le filtre par date."})]})})}),e.jsx(N,{children:e.jsx(l,{children:e.jsxs(o,{className:"p-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(f,{className:"size-7",children:e.jsx(g,{className:"text-xs",children:"LS"})}),e.jsx("span",{className:"text-sm font-medium",children:"Lilian Saget-Lethias"}),e.jsx(c,{variant:"secondary",className:"text-[10px]",children:"Auteur"})]}),e.jsx("p",{className:"mt-1.5 text-sm",children:"Merci, je note ça pour la v2 !"})]})})})]})]})]}),e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{variant:"success",size:"icon",children:e.jsx(I,{className:"size-4"})}),e.jsx(a,{})]}),e.jsxs(i,{children:[e.jsx("p",{className:"text-muted-foreground text-xs",children:"il y a 2 heures"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("p",{className:"text-sm font-semibold",children:"Statut changé"}),e.jsx(c,{variant:"success",children:"Terminé"})]}),e.jsx("p",{className:"text-muted-foreground text-xs",children:"par Admin"})]})]}),e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{variant:"muted",size:"icon",children:e.jsx(k,{className:"size-4"})}),e.jsx(a,{})]}),e.jsxs(i,{children:[e.jsx("p",{className:"text-muted-foreground text-xs",children:"il y a 1 jour"}),e.jsxs("p",{className:"text-sm",children:[e.jsx("span",{className:"font-semibold",children:"3"})," personnes ont voté"]})]})]}),e.jsxs(n,{children:[e.jsx(s,{children:e.jsx(t,{variant:"outline",size:"icon",children:e.jsx(v,{className:"size-4"})})}),e.jsxs(i,{children:[e.jsx("p",{className:"text-muted-foreground text-xs",children:"il y a 3 jours"}),e.jsx("p",{className:"text-sm font-medium",children:"Jean a créé le post"})]})]})]})},j={name:"Dot Sizes",render:()=>e.jsxs(m,{className:"max-w-md",children:[e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{size:"sm"}),e.jsx(a,{})]}),e.jsx(i,{children:e.jsx("p",{className:"text-sm",children:"Small (8px)"})})]}),e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{size:"default"}),e.jsx(a,{})]}),e.jsx(i,{children:e.jsx("p",{className:"text-sm",children:"Default (12px)"})})]}),e.jsxs(n,{children:[e.jsxs(s,{children:[e.jsx(t,{size:"lg"}),e.jsx(a,{})]}),e.jsx(i,{children:e.jsx("p",{className:"text-sm",children:"Large (16px)"})})]}),e.jsxs(n,{children:[e.jsx(s,{children:e.jsx(t,{size:"icon",children:e.jsx(v,{className:"size-4"})})}),e.jsx(i,{children:e.jsx("p",{className:"text-sm",children:"Icon (32px)"})})]})]})},h={name:"Compact (Small Dots)",parameters:{docs:{description:{story:"Version compacte avec des petits dots, idéale pour les changelog ou les logs simples."}}},render:()=>e.jsxs(m,{className:"max-w-sm",children:[e.jsxs(n,{className:"pb-4",children:[e.jsxs(s,{children:[e.jsx(t,{size:"sm",variant:"success"}),e.jsx(a,{})]}),e.jsx(i,{className:"pt-0",children:e.jsx("p",{className:"text-xs font-medium",children:"v2.4.0 déployé"})})]}),e.jsxs(n,{className:"pb-4",children:[e.jsxs(s,{children:[e.jsx(t,{size:"sm"}),e.jsx(a,{})]}),e.jsx(i,{className:"pt-0",children:e.jsx("p",{className:"text-xs font-medium",children:"Fix pagination board"})})]}),e.jsxs(n,{className:"pb-4",children:[e.jsxs(s,{children:[e.jsx(t,{size:"sm"}),e.jsx(a,{})]}),e.jsx(i,{className:"pt-0",children:e.jsx("p",{className:"text-xs font-medium",children:"Migration Prisma 7"})})]}),e.jsxs(n,{className:"pb-4",children:[e.jsx(s,{children:e.jsx(t,{size:"sm",variant:"muted"})}),e.jsx(i,{className:"pt-0",children:e.jsx("p",{className:"text-muted-foreground text-xs",children:"3 commits précédents..."})})]})]})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Timeline className="max-w-md">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm font-medium">Idée soumise</p>
          <p className="text-muted-foreground text-xs">Il y a 3 jours</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm font-medium">En cours d'étude</p>
          <p className="text-muted-foreground text-xs">Il y a 2 jours</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm font-medium">Planifié</p>
          <p className="text-muted-foreground text-xs">Aujourd'hui</p>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
}`,...d.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Playground",
  parameters: {
    docs: {
      description: {
        story: "Story interactive — utilise les controls Storybook pour configurer les props des sous-composants (dot variant/size, connector variant, sub-connector indent)."
      }
    }
  },
  argTypes: {
    // @ts-expect-error -- Custom args, not real Timeline props
    dotVariant: {
      control: "select",
      options: ["default", "outline", "success", "warning", "destructive", "muted"],
      description: "TimelineDot variant",
      table: {
        category: "TimelineDot"
      }
    },
    dotSize: {
      control: "select",
      options: ["sm", "default", "lg", "icon"],
      description: "TimelineDot size",
      table: {
        category: "TimelineDot"
      }
    },
    connectorVariant: {
      control: "select",
      options: ["connected", "spaced"],
      description: "TimelineConnector variant",
      table: {
        category: "TimelineConnector"
      }
    },
    subIndent: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "TimelineSubConnector indent",
      table: {
        category: "TimelineSubConnector"
      }
    }
  },
  args: {
    // @ts-expect-error -- Custom args
    dotVariant: "default",
    dotSize: "icon",
    connectorVariant: "connected",
    subIndent: "default"
  },
  render: args => {
    const {
      dotVariant,
      dotSize,
      connectorVariant,
      subIndent
    } = args as unknown as {
      dotVariant: "default" | "destructive" | "muted" | "outline" | "success" | "warning";
      dotSize: "default" | "icon" | "lg" | "sm";
      connectorVariant: "connected" | "spaced";
      subIndent: "default" | "lg" | "sm";
    };
    return <Timeline className="max-w-xl">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant={dotVariant} size={dotSize}>
              {dotSize === "icon" && <MessageSquareIcon className="size-4" />}
            </TimelineDot>
            <TimelineConnector variant={connectorVariant} />
          </TimelineSeparator>
          <TimelineContent>
            <p className="text-muted-foreground text-xs">il y a 10 minutes</p>
            <Card className="mt-1.5">
              <CardContent className="p-4">
                <p className="text-sm font-medium">Commentaire principal</p>
                <p className="mt-1 text-sm">Avec du contenu détaillé et des réponses.</p>
              </CardContent>
            </Card>
            <TimelineSubConnector indent={subIndent}>
              <TimelineSubItem>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">Première réponse</p>
                    <p className="mt-1 text-sm">Bonne idée !</p>
                  </CardContent>
                </Card>
              </TimelineSubItem>
              <TimelineSubItem>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium">Deuxième réponse</p>
                    <p className="mt-1 text-sm">Merci, noté pour la v2.</p>
                  </CardContent>
                </Card>
              </TimelineSubItem>
            </TimelineSubConnector>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant={dotVariant} size={dotSize}>
              {dotSize === "icon" && <CheckIcon className="size-4" />}
            </TimelineDot>
            <TimelineConnector variant={connectorVariant} />
          </TimelineSeparator>
          <TimelineContent>
            <p className="text-muted-foreground text-xs">il y a 2 heures</p>
            <p className="text-sm font-medium">Événement simple</p>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot variant={dotVariant} size={dotSize}>
              {dotSize === "icon" && <StarIcon className="size-4" />}
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <p className="text-muted-foreground text-xs">il y a 3 jours</p>
            <p className="text-sm font-medium">Dernier événement</p>
          </TimelineContent>
        </TimelineItem>
      </Timeline>;
  }
}`,...x.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: "Dot Variants",
  render: () => <Timeline className="max-w-md">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="success" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm font-medium">Terminé</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="warning" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm font-medium">En attente</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="destructive" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm font-medium">Rejeté</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outline" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm font-medium">Brouillon</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="muted" />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm font-medium">Archivé</p>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: "With Icons",
  render: () => <Timeline className="max-w-md">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="success" size="icon">
            <CheckIcon className="size-4" />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm font-medium">Déployé en production</p>
          <p className="text-muted-foreground text-xs">Il y a 1 heure</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="default" size="icon">
            <MessageSquareIcon className="size-4" />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm font-medium">Nouveau commentaire</p>
          <p className="text-muted-foreground text-xs">Il y a 3 heures</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="warning" size="icon">
            <CircleAlertIcon className="size-4" />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm font-medium">Signalé pour modération</p>
          <p className="text-muted-foreground text-xs">Hier</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outline" size="icon">
            <CircleDotIcon className="size-4" />
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm font-medium">Idée soumise</p>
          <p className="text-muted-foreground text-xs">Il y a 3 jours</p>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
}`,...u.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Post Activity (Real-World)",
  parameters: {
    docs: {
      description: {
        story: "Exemple réaliste simulant l'historique d'activité d'un post : commentaires avec replies, changements de statut avec badge, votes agrégés, et création du post."
      }
    }
  },
  render: () => <Timeline className="max-w-xl">
      {/* Comment with reply thread — sub-connector for nesting */}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="default" size="icon">
            <MessageSquareIcon className="size-4" />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-muted-foreground text-xs">il y a 10 minutes</p>
          <Card className="mt-1.5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarFallback>LS</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Lilian Saget-Lethias</span>
                <Badge variant="destructive" className="text-[10px]">
                  Propriétaire
                </Badge>
                <Badge variant="secondary" className="text-[10px]">
                  Auteur
                </Badge>
              </div>
              <p className="mt-2 text-sm">Commentaire principal avec du contenu détaillé.</p>
              <div className="text-muted-foreground mt-2 flex items-center gap-3 text-xs">
                <span>04/03/2026 20:33</span>
                <span>2 réponse(s)</span>
              </div>
            </CardContent>
          </Card>
          {/* Replies with sub-connector — L-hook on last item */}
          <TimelineSubConnector>
            <TimelineSubItem>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs">ML</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Marie Leroy</span>
                  </div>
                  <p className="mt-1.5 text-sm">Bonne idée ! +1 pour le filtre par date.</p>
                </CardContent>
              </Card>
            </TimelineSubItem>
            <TimelineSubItem>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs">LS</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Lilian Saget-Lethias</span>
                    <Badge variant="secondary" className="text-[10px]">
                      Auteur
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-sm">Merci, je note ça pour la v2 !</p>
                </CardContent>
              </Card>
            </TimelineSubItem>
          </TimelineSubConnector>
        </TimelineContent>
      </TimelineItem>

      {/* Status change */}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="success" size="icon">
            <CheckIcon className="size-4" />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-muted-foreground text-xs">il y a 2 heures</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">Statut changé</p>
            <Badge variant="success">Terminé</Badge>
          </div>
          <p className="text-muted-foreground text-xs">par Admin</p>
        </TimelineContent>
      </TimelineItem>

      {/* Aggregate votes */}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="muted" size="icon">
            <ThumbsUpIcon className="size-4" />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-muted-foreground text-xs">il y a 1 jour</p>
          <p className="text-sm">
            <span className="font-semibold">3</span> personnes ont voté
          </p>
        </TimelineContent>
      </TimelineItem>

      {/* Post created */}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot variant="outline" size="icon">
            <StarIcon className="size-4" />
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-muted-foreground text-xs">il y a 3 jours</p>
          <p className="text-sm font-medium">Jean a créé le post</p>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
}`,...T.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  name: "Dot Sizes",
  render: () => <Timeline className="max-w-md">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot size="sm" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm">Small (8px)</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot size="default" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm">Default (12px)</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot size="lg" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm">Large (16px)</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot size="icon">
            <StarIcon className="size-4" />
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent>
          <p className="text-sm">Icon (32px)</p>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
}`,...j.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Compact (Small Dots)",
  parameters: {
    docs: {
      description: {
        story: "Version compacte avec des petits dots, idéale pour les changelog ou les logs simples."
      }
    }
  },
  render: () => <Timeline className="max-w-sm">
      <TimelineItem className="pb-4">
        <TimelineSeparator>
          <TimelineDot size="sm" variant="success" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent className="pt-0">
          <p className="text-xs font-medium">v2.4.0 déployé</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem className="pb-4">
        <TimelineSeparator>
          <TimelineDot size="sm" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent className="pt-0">
          <p className="text-xs font-medium">Fix pagination board</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem className="pb-4">
        <TimelineSeparator>
          <TimelineDot size="sm" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent className="pt-0">
          <p className="text-xs font-medium">Migration Prisma 7</p>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem className="pb-4">
        <TimelineSeparator>
          <TimelineDot size="sm" variant="muted" />
        </TimelineSeparator>
        <TimelineContent className="pt-0">
          <p className="text-muted-foreground text-xs">3 commits précédents...</p>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
}`,...h.parameters?.docs?.source}}};const Y=["Default","Playground","WithVariants","WithIcons","PostActivity","Sizes","Compact"];export{h as Compact,d as Default,x as Playground,T as PostActivity,j as Sizes,u as WithIcons,p as WithVariants,Y as __namedExportsOrder,X as default};
