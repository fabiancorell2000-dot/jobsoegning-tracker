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
- **Vær personlig og konkret om motivation.** Match konkrete punkter fra
  opslagets krav til konkrete punkter i Fabians faktiske erfaring, ikke
  generiske floskler ("jeg er stærk til dataanalyse"). Forklar med en reel,
  specifik grund hvorfor lige DEN virksomhed og DEN rolle er interessant,
  ikke en sætning der kunne stå i enhver ansøgning til enhver virksomhed.
  Motivationen skal skinne igennem, det skal lyde som ét menneskes reelle
  interesse, ikke en genereret skabelon.
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
