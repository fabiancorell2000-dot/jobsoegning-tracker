# Jobsøgnings-rutine — gældende kriterier

Denne fil læses automatisk ved starten af hver kørsel og supplerer den planlagte
opgaves prompt. **Ved konflikt vinder denne fil**, da den er opdateret senest.

Sidst opdateret: 2026-09-02

---

## Ændringer besluttet 2026-09-02

Baggrund: 39 ansøgninger har givet 6-7 samtaler (~17% hitrate). Målretningen
virker, så volumen må gerne op — men uden at sænke kvalitetsbaren.

### 1. Virksomhedsstørrelse — nedre grænse fjernet
Den tidligere grænse på 100-10.000 ansatte gælder ikke længere nedad. Mindre
virksomheder og scaleups må gerne foreslås; de har færre ansøgere pr. opslag,
hvilket er en reel statistisk fordel. Øvre grænse (~10.000) bevares som blød
præference, ikke hårdt filter.

### 2. Erfaringskrav — mindre striks
Opslag der beder om "et par års erfaring" eller 2-4 års erfaring må gerne
foreslås, når det indholdsmæssige match ellers er stærkt. Dansk
rekrutteringspraksis ansætter ofte stærke dimittender på den slags opslag.

**Fortsat hårdt fravalg:** eksplicitte senior-, lead- og manager-titler, samt
opslag der reelt kræver mange års specialisterfaring.

### 3. Lokation — strammet og præciseret
Erstatter den oprindelige formulering ("Nordsjælland, Ballerup, Hillerød er fint"):

- **Maks ca. 20-30 minutter med S-tog fra Nørreport.**
- Cykelafstand til Frederiksberg er et klart plus, men ikke et krav.
- Udelukker Roskilde, Køge og Høje-Taastrup (vurderet for langt).
- **NB:** Udelukker også Hillerød (~40 min fra Nørreport), som den oprindelige
  prompt ellers tillod. Rettes kun hvis Fabian beder om det.

### 4. Graduate-programmer — kun med nær ansættelsesstart
Graduate-stillinger er attraktive, men **kun hvis ansættelsen starter inden for
ca. 1-2 måneder**. Programmer med start langt ude i fremtiden (fx "Autumn 2027")
fravælges, uanset hvor godt de ellers matcher.

### 5. Kilder — udvid ud over LinkedIn
LinkedIn alene dækker ikke det danske marked. Søg også:
- **Jobindex.dk** — det største danske jobopslagssite, mange opslag når aldrig LinkedIn
- **thehub.io** — scaleup- og startup-stillinger

Samme kvalitetskrav gælder uanset kilde: verificér ansættelsestype (fuldtid),
opslagsdato (inden for ca. 1 uge) og at opslaget er aktivt.

---

## Uændret — må ikke løsnes

- **Fuldtid er et hårdt krav.** Ingen deltid, studenterjob/studentermedhjælper
  eller praktik — uanset hvor godt kompetencematchet ellers er.
- **Ingen salgs- eller Customer Success-roller** målt på salg, retention eller
  upsell. Revenue/Sales Operations Analyst er fortsat undtagelsen: den måles på
  datakvalitet og proces, ikke salgstal.
- **Ingen roller der kræver kompetencer Fabian ikke har** — Salesforce/DealCloud
  på ekspertniveau, Lean Six Sigma-certificering, avanceret SQL/programmering.
- **Kvalitet over kvantitet.** 0 forslag er et fuldt gyldigt resultat.
- **Ærlighed i begrundelser.** Svagheder i et match skal altid nævnes eksplicit —
  særligt hvor et krav (fx SQL-dybde) reelt overstiger Fabians erfaring.
- **`soegte-jobs.md` røres aldrig af rutinen.** Kun Fabian opdaterer den manuelt.
