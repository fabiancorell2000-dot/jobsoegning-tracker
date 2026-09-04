// Generates Fabian's CV as a docx from profile.json.
//
// Usage:
//   node build-cv.js [outFile] [targetTitle]
//
// Example (tailoring the subtitle line to a specific posting's title):
//   node build-cv.js "Fabian_Hansen_CV_Flying_Tiger.docx" "Assortment Analyst"
//
// If targetTitle is omitted, profile.defaultTargetTitle is used ("Business & Data Analyst").
// The rest of the CV content is factual and does not change per job — only the
// subtitle line is meant to be tailored, so it echoes the posting's own title
// back for a tighter keyword match. Do not invent or reword experience bullets
// per job; they come verbatim from profile.json.
const { Document, Packer } = require("docx");
const fs = require("fs");
const path = require("path");
const S = require("./style");

const profile = JSON.parse(fs.readFileSync(path.join(__dirname, "profile.json"), "utf8"));

function buildCv({ outFile, targetTitle } = {}) {
  const title = targetTitle || profile.defaultTargetTitle;
  const children = [
    S.nameHeading(profile.cvName),
    S.subtitleLine(`${title}  ·  ${profile.degreeShort}`),
    S.contactLine(
      `${profile.contact.location}   ·   ${profile.contact.phone}   ·   ${profile.contact.email}   ·   ${profile.contact.linkedin}`
    ),

    S.sectionHeading("Profile"),
    S.bodyPara(profile.profileSummary),

    S.sectionHeading("Education"),
    ...profile.education.flatMap((e) => [
      S.eduHeader(e.degree, e.org, e.dates),
      ...e.bullets.map(S.bullet),
    ]),

    S.sectionHeading("Work Experience"),
    ...profile.experience.flatMap((job) => [
      S.jobHeader(job.title, job.org, job.dates),
      S.bodyPara(job.intro, { after: 60, italics: true, color: S.MUTED }),
      ...job.bullets.map(S.bullet),
    ]),

    S.sectionHeading("Skills"),
    ...profile.skills.flatMap((g) => S.skillGroup(g.label, g.items)),

    S.sectionHeading("References"),
    S.bodyPara("Available upon request", { after: 80 }),
    ...profile.references.map((r, i) =>
      S.bodyPara(`${r.name}, ${r.title}, ${r.org}`, { after: i === profile.references.length - 1 ? undefined : 40 })
    ),
  ];

  const doc = new Document({
    numbering: S.bulletNumbering,
    styles: { default: { document: { run: { font: S.BODY_FONT, size: 21 } } } },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: S.convertInchesToTwip(0.5),
              bottom: S.convertInchesToTwip(0.5),
              left: S.convertInchesToTwip(0.8),
              right: S.convertInchesToTwip(0.8),
            },
          },
        },
        children,
      },
    ],
  });

  const out = outFile || "Fabian_Hansen_CV.docx";
  return Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(out, buffer);
    return out;
  });
}

if (require.main === module) {
  const [outFile, targetTitle] = process.argv.slice(2);
  buildCv({ outFile, targetTitle }).then((out) => console.log("done:", out));
}

module.exports = { buildCv };
