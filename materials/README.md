# Ansøgningsmateriale — CV og ansøgning per jobmatch

Bruges af den daglige jobsøgnings-rutine (se `../CLAUDE.md`) til at generere et
tilpasset CV og en tilpasset ansøgning for hvert job der består alle
kvalitetskrav, klar til at Fabian selv kan sende dem.

**Grænse der aldrig må overskrides:** disse scripts producerer kun docx-filer
til Fabian. Rutinen søger, ansøger eller kontakter aldrig nogen på hans vegne.
Kun han selv sender den faktiske ansøgning.

## Setup (gør dette først i hver kørsel, containeren er frisk hver gang)

```bash
cd materials
npm install                       # installerer docx, ikke committed til repoet
```

For at kunne rendere og verificere output visuelt (stærkt anbefalet før noget
sendes til Fabian, se "Kvalitetstjek" nedenfor) skal LibreOffice Writer og
poppler-utils være installeret. De er IKKE altid præinstalleret i et frisk
miljø (kun `libreoffice-core` var der som udgangspunkt en gang, uden selve
Writer-komponenten, hvilket gav en kryptisk "source file could not be loaded"
fejl for enhver fil, ikke kun docx-filer). Tjek og installer om nødvendigt:

```bash
apt-get update && apt-get install -y libreoffice-writer poppler-utils
```

Hvis `soffice --headless --convert-to pdf ...` fejler med "source file could
not be loaded" selv for en triviel testfil, er det næsten altid denne
manglende pakke, ikke en fejl i selve docx-filen.

## CV

```js
const { buildCv } = require("./build-cv");
await buildCv({
  outFile: "Fabian_Hansen_CV_<Firma>.docx",
  targetTitle: "<jobbets egen titel, fx 'Assortment Analyst'>",
});
```

Alt indhold (uddannelse, erfaring, kompetencer, referencer) kommer fra
`profile.json` og skal IKKE omskrives eller overdrives per job, det er fakta.
Det eneste der tilpasses per job er `targetTitle`, undertitlen under navnet,
så den matcher opslagets egen titel bedre (bedre nøgleordsmatch, ikke løgn,
det er stadig det samme reelle indhold).

**Sprog (tilføjet 2026-09-05, efter Fabians feedback på Nykredit-CV'et):** CV'et
skal altid skrives på SAMME sprog som selve jobopslaget, engelsk opslag giver
engelsk CV, dansk opslag giver dansk CV. Tjek opslagets sprog før du kalder
`buildCv`, og send `lang: "da"` med når opslaget er dansk:

```js
await buildCv({
  outFile: "Fabian_Hansen_CV_<Firma>.docx",
  targetTitle: "<jobbets egen titel>",
  lang: "da", // udelad helt for engelske opslag
});
```

Med `lang: "da"` hentes profiltekst, uddannelse, erfaring, kompetencer og
sektionsoverskrifter fra `profile.da.*` i stedet for topniveau-felterne, det
er en ord-for-ord oversættelse af samme fakta, ikke nyt indhold. Kontaktinfo,
navn og referencernes navne/virksomhed ændres aldrig. Referencernes titler
(fx "VP, Payroll & People Masterdata") oversættes bevidst ikke, det er deres
faktiske officielle titel hos COWI, uanset CV-sprog. Opdaterer du fakta i de
engelske felter i `profile.json`, så husk at opdatere den tilsvarende danske
oversættelse i `profile.da` samtidig, ellers kommer de to sprogversioner ud
af trit med hinanden.

**Samme sprogregel gælder ansøgningens hilsen og afsked**, ikke kun CV'et.
`build-cover-letter.js` udleder IKKE sprog automatisk af `greeting`, så husk
selv at sende et matchende `closing` med til et engelsk opslag (fx
`closing: "Kind regards,"`), ellers falder den tilbage til dansk "Med venlig
hilsen," selvom resten af brevet er engelsk. Dette gik faktisk galt i en
tidlig Northmoore-ansøgning, fanget først ved den obligatoriske gennemlæsning,
ikke ved generering, så tjek det eksplicit hver gang du skriver et engelsk brev.

## Ansøgning

`build-cover-letter.js` er IKKE en færdig skabelon med tekst, brødteksten er
job-specifik og skal skrives forfra hver gang, se docstring i filen for et
eksempel på kaldet.

**Hilsen, i denne prioritet:**
1. Er der en navngiven kontaktperson i opslaget, brug den: `"Kære <navn>,"`
2. Er der ikke, men opslaget nævner et team, brug det: `"Kære <team>-teamet,"`
3. Er der hverken navn eller team, brug firmanavnet: `"Kære <firma>,"`

Gæt aldrig et navn der ikke står i opslaget.

**Regler for selve brødteksten (opdateret 2026-09-03, læs hele afsnittet før
du skriver en ansøgning, det er anderledes end den interne ærlighedsregel der
gælder for `foreslaaede-jobs.md`):**

- **Fakta må ikke opdigtes.** Ingen påstået erfaring, værktøjer, ansættelser
  eller tal der ikke findes i `profile.json`, uanset hvor godt det ville
  passe til opslaget. Det er en hård grænse.
- **Men det er fuldt tilladt, og opmuntret, at pynte på FREMSTILLINGEN af
  de rigtige fakta.** Selvsikkert, varmt og entusiastisk sprog om noget der
  faktisk er sandt er ikke løgn, det er god ansøgningsskrivning. Skriv som
  en der genuint er den rette til jobbet, ikke i konjunktiv eller med
  forbehold.
- **Skriv ALDRIG en svaghed eller mangel ind i en ansøgning.** Sætninger i
  stil med "jeg kender ikke til X" eller "jeg har ikke erfaring med Y" hører
  aldrig hjemme i en ansøgning, uanset hvor ærligt det er. Kræver opslaget
  noget Fabian reelt ikke har, så nævn det simpelthen ikke, og fremhæv i
  stedet en anden reel styrke der er relevant. Dette er en ren
  tone/fremstillings-regel for selve ansøgningsteksten, den ændrer intet ved
  den interne vurdering rutinen skriver til Fabian selv i
  `foreslaaede-jobs.md`, den skal fortsat være 100% ærlig om svagheder, kun
  ansøgningen der sendes til virksomheden skal udelukkende fremhæve styrker.
- **SQL specifikt, se `profile.json.skillFramingNotes.sql`.** Fabian har et
  solidt, reelt kendskab til SQL, ikke ekspert-/avanceret niveau, men langt
  fra svagt, og han lærer hurtigt. Skriv aldrig at det er begrænset eller
  overfladisk. Skriv heller ikke at han er ekspert. "Erfaring med SQL" eller
  "arbejder løbende med SQL" er den rigtige tone.
  **Vigtigt (rettet 2026-09-07, Fabians egen ordlyd):** SQL er IKKE en daglig
  kerneopgave, det er noget han bruger til at understøtte Power BI-rapportering
  og analyse, ikke en aktivitet i sig selv. Skriv derfor ALDRIG noget der lyder
  som om SQL er en central, daglig aktivitet i sig selv, fx "I query and model
  data directly in SQL..." er for stærkt/forkert. Skriv i stedet noget i
  retning af "I work with Power BI and data modelling, and I am comfortable
  querying data in SQL when supporting reporting and analysis" (eller den
  danske pendant), hvor Power BI/datamodellering er kernen og SQL er noget der
  understøtter det, ikke omvendt.
- **Vær personlig og konkret om motivation.** Match konkrete punkter fra
  opslagets krav til konkrete punkter i Fabians faktiske erfaring, ikke
  generiske floskler ("jeg er stærk til dataanalyse"). Forklar med en reel,
  specifik grund hvorfor lige DEN virksomhed og DEN rolle er interessant,
  ikke en sætning der kunne stå i enhver ansøgning til enhver virksomhed.
  Motivationen skal skinne igennem, det skal lyde som ét menneskes reelle
  interesse, ikke en genereret skabelon.
- **Tone (skærpet 2026-09-07, Fabians egen feedback: "må gerne blive lidt
  bedre... ikke så ai polished").** Ansøgningerne må gerne blive tydeligere
  "hvem er Fabian", ikke kun en korrekt opremsning af matchende kvalifikationer.
  Skriv så det lyder som Fabian selv skrev det i ét ryk, med sit eget sprog og
  sin egen rytme, ikke en poleret, symmetrisk, let genkendelig AI-kadence
  (samme sætningslængde igen og igen, for perfekt balancerede afsnit, for
  mange "which is exactly..."-konklusioner). Varier sætningslængden, lad et
  afsnit være kortere end de andre hvis det passer bedre. Han skal ALTID lyde
  som en der reelt brænder for lige netop DEN stilling og DET opslag skriver
  om, ikke en der brænder generelt for "data og commercial roller". Genlæs
  opslaget igen lige før du skriver brødteksten og lad specifikke detaljer
  derfra (ikke bare de overordnede krav) farve sproget.
- **Ingen tænkestreger (—) og ingen kolon (:) i teksten**, det er en
  eksplicit præference fra Fabian, det læses som et AI-tegn.
- **Ingen bogstavelige markdown-tegn i teksten** (`**fed**`, `*kursiv*`,
  understregninger, `#`-overskrifter og lignende). Al formatering sker via
  rigtig docx-formatering i `style.js`, aldrig som synlige symboler i selve
  ordene.
- 4 til 5 afsnit er passende længde, samme som Annalect-ansøgningen der er
  skabelonens forbillede.
- Er matchet for svagt til at skrive en ærlig, personlig og specifik
  ansøgning uden at opdigte noget, spring jobbet over i stedet for at tvinge
  en generisk tekst igennem, samme kvalitetsprincip som resten af rutinen
  ("0 forslag er et fuldt gyldigt resultat").

## Kvalitetstjek før filerne sendes (2 gennemlæsninger, hver gang, begge dokumenter)

Send aldrig en fil uden at have læst den grundigt igennem to gange først,
med to forskellige formål. Det er ikke nok at kigge på den én gang, en enkelt
gennemlæsning fanger typisk kun halvdelen af fejlene. Gør det for BÅDE CV og
ansøgning, hver gang, uden undtagelse.

**Vigtigt (skærpet 2026-09-07, efter en kørsel der kun kiggede på siderne én
gang og efterfølgende beskrev det som "to gennemlæsninger" ud fra to
forskellige vinkler på det samme kig).** De to gennemlæsninger skal være to
faktisk adskilte kald af Read-værktøjet på billederne, ikke ét kig efterfulgt
af to forskellige analyser af det samme kig i dit hoved. Første gennemlæsning
skal være helt afsluttet, inklusiv eventuelle rettelser og en ny generering,
før du starter den anden. Anden gennemlæsning skal ske på den ENDELIGE version
af filen, ikke den du kiggede på i gennemlæsning 1, hvis der er rettet noget
imellem. Gennemlæsning 1 skal desuden konkret holdes op mod selve
jobopslagets tekst, ikke kun `profile.json` isoleret, tjek at ALT i CV'et og
ansøgningen der refererer til opslaget (titel, krav, sprog, hilsen) rent
faktisk stemmer overens med hvad opslaget selv siger.

Konverter og rendér til billede først, så du rent faktisk ser det Fabian
kommer til at se, ikke bare den rå tekst:

```bash
soffice --headless --convert-to pdf --outdir . <fil>.docx
pdftoppm -jpeg -r 120 <fil>.pdf page
# læs page-1.jpg (og evt. page-2.jpg) med Read-værktøjet
```

**Gennemlæsning 1, indhold og fakta:**
- Stemmer alt overens med `profile.json`? Intet opdigtet, intet overdrevet
  ud over den tilladte fremstillingsmæssige pynt (se ansøgningsreglerne
  ovenfor).
- Er firmanavn, jobtitel og hilsen korrekte og konsekvente hele vejen
  igennem, ingen rester fra en tidligere ansøgning eller forkert firmanavn
  ét sted i teksten?
- Nævner ansøgningen nogen svaghed eller mangel? Skal fjernes, ingen
  undtagelser.
- Er motivationen konkret og specifik for lige dette job, ikke en generisk
  sætning der kunne genbruges overalt?

**Gennemlæsning 2, sprog og layout:**
- Ingen tænkestreger, kolon eller bogstavelige markdown-tegn nogen steder.
- Læs det højt for dig selv (mentalt), lyder det som noget en person selv
  har skrevet, eller som en generisk skabelon? Ret det hvis det sidste.
- Stavefejl, grammatik, dobbelte mellemrum, manglende punktum.
- Sidebrud og layout er korrekt: CV'et fylder 2 sider, med alle punkter
  under COWI samlet på side 1 (ikke et enkelt punkt der springer til side
  2). Ansøgningen fylder 1 side.

Er du i tvivl efter begge gennemlæsninger, læs den en tredje gang i stedet
for at sende noget du ikke er helt sikker på.

### Layout skal sidde 100% rigtigt, ingen undtagelser

Dette er ikke et "nice to have", det er et hårdt krav fra Fabian. Et CV hvor
et enkelt punkt fra ETHVERT job- eller uddannelsesblok (ikke kun COWI, det
skete også for Skattestyrelsen-blokken, se 2026-09-07-rettelsen nedenfor) er
sprunget alene over på næste side er ikke godkendt til afsendelse, uanset
hvor godt indholdet ellers er. Tjek dette eksplicit for HVER blok i CV'et ved
hver gennemlæsning, ikke kun COWI-blokken, antag aldrig at kun COWI er
udsat.

**Rettet 2026-09-07:** `style.js`s `bullet()` og `build-cv.js` kæder nu
`keepNext` gennem alle bullets i en blok (undtagen den sidste), ikke kun fra
header til første bullet som tidligere. Det fjerner rodårsagen til at et
enkelt punkt midt i en liste kunne strande alene på næste side, men er
stadig kun verificeret i LibreOffice-renderet, ikke i rigtig Word, se
advarslen nedenfor. Betragt det derfor som en væsentligt reduceret risiko,
ikke en garanti, og bliv ved med at tjekke det visuelt hver gang.

**Vigtigt (opdateret 2026-09-04, efter Fabians feedback på Haleon-CV'et):**
Kvalitetstjekket render til PDF via LibreOffice, men Fabian åbner selve
`.docx`-filen i rigtig Word, og de to programmer beregner linjehøjder en
anelse forskelligt. Et layout der ser korrekt ud i LibreOffice-PDF'en kan
derfor stadig splitte forkert i Word (dette skete faktisk for
Skattestyrelsen-blokken i Haleon-CV'et, uden at det var synligt ved
LibreOffice-tjekket). Løsningen der nu er indbygget i `style.js` og
`build-cv.js`: alle job-/uddannelsesheaders har `keepNext: true`, og det
samme har intro-linjen lige under headeren, så en header aldrig kan blive
efterladt alene nederst på en side mens indholdet under den skubbes til
næste side, uanset hvilket program der åbner filen. Stol derfor ikke
blindt på at LibreOffice-renderet ser korrekt ud som eneste bevis, det er
en god indikation, men ikke en garanti for hvordan Word paginerer.

**Vigtigt:** `targetTitle` er forskellig for hvert job, og en længere titel
(fx "Senior Revenue Operations and Business Intelligence Analyst" i stedet
for "Business & Data Analyst") kan fylde en ekstra linje i undertitlen og
dermed skubbe hele resten af layoutet. Antag ALDRIG at fordi det sad rigtigt
sidste gang, sidder det også rigtigt denne gang, tjek det hver eneste gang
med den fulde render-og-læs proces ovenfor.

Ser du et forkert sidebrud (et enkelt COWI-punkt alene på side 2, eller CV'et
fylder 3 sider), så ret det, generér igen, og tjek igen, indtil det er
korrekt. Send aldrig filen i mellemtiden. Ret det ved at justere disse
knapper i selve genereringskaldet eller midlertidigt i `style.js`, i denne
rækkefølge:

1. Sidemargener (`margin.top`/`margin.bottom` i `build-cv.js`), prøv 0.45in
   hvis 0.5in ikke er nok.
2. Linjeafstand (`line` i `style.js`s `bullet`/`bodyPara`), 240 er
   standard-enkelt-linje, gå ikke under uden at tjekke det stadig er
   læsbart.
3. Mellemrum før/efter sektionsoverskrifter og job-headers
   (`sectionHeading`, `jobHeader`/`eduHeader` i `style.js`).

Gå aldrig så langt ned at det ser proppet eller ulæseligt ud, "flot at
læse" er lige så vigtigt som at det passer på siderne. Er det umuligt at få
til at se godt ud på 2 sider uden at gå på kompromis med læsbarheden, sig
det til Fabian i stedet for at sende noget der enten er stramt eller har et
dårligt sidebrud.

## Filer i denne mappe

- `style.js` — delt visuel identitet (Georgia-overskrifter, Calibri-brødtekst,
  navy-accent, ingen ALL CAPS, ingen boksede overskrifter). Rør ikke ved denne
  medmindre Fabian selv beder om et nyt design, det er resultatet af flere
  runder feedback.
- `profile.json` — alle fakta om Fabian (kontakt, uddannelse, erfaring,
  kompetencer, referencer). Eneste kilde til sandhed, opdatér denne fil hvis
  Fabian giver nye fakta, ikke de enkelte genererede CV'er.
- `build-cv.js` — genererer CV som docx.
- `build-cover-letter.js` — genererer ansøgning som docx (kræver job-specifik
  brødtekst leveret af kalderen, se ovenfor).
