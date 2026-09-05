// Generates a tailored cover letter as a docx, matching the CV's visual style.
//
// This is a MODULE, not a script with hardcoded text — the body paragraphs are
// job-specific and must be written fresh for each application (see README.md
// for the honesty rules that apply). Call buildCoverLetter() from a small
// per-job driver, e.g.:
//
//   const { buildCoverLetter } = require("./build-cover-letter");
//   buildCoverLetter({
//     company: "Flying Tiger Copenhagen",
//     roleTitle: "Assortment Analyst",
//     greeting: "Kære IMEA-teamet,",   // see README for the greeting fallback order
//     paragraphs: [
//       "Jeg søger stillingen som ... fordi ...",
//       "Hos COWI arbejder jeg med ... hvilket matcher jeres krav om ... fordi ...",
//       "..."
//     ],
//     outFile: "Fabian_Hansen_Ansogning_Flying_Tiger.docx",
//   });
//
// Language: the letter's language must match the job posting's own language
// (see README.md), and closing is NOT auto-derived from greeting, pass it
// explicitly. Danish posting: leave closing unset (defaults to "Med venlig
// hilsen,"). English posting: pass closing: "Kind regards," (or similar).
const { Document, Packer } = require("docx");
const fs = require("fs");
const path = require("path");
const S = require("./style");

const profile = JSON.parse(fs.readFileSync(path.join(__dirname, "profile.json"), "utf8"));

function buildCoverLetter({ company, roleTitle, greeting, paragraphs, outFile, closing }) {
  if (!company || !roleTitle || !greeting || !paragraphs || !paragraphs.length) {
    throw new Error("buildCoverLetter requires company, roleTitle, greeting and paragraphs");
  }

  const children = [
    S.nameHeading(profile.fullName, 40),
    S.subtitleLine(`${company}  ·  ${roleTitle}`),
    S.contactLine(
      `${profile.contact.location}   ·   ${profile.contact.phone}   ·   ${profile.contact.email}   ·   ${profile.contact.linkedin}`,
      { after: 60 }
    ),
    S.bodyPara("", { after: 220 }),

    S.bodyPara(greeting, { after: 220, size: 22, line: 280 }),
    ...paragraphs.map((p, i) =>
      S.bodyPara(p, { after: i === paragraphs.length - 1 ? 260 : 190, size: 22, line: 280 })
    ),

    S.bodyPara(closing || "Med venlig hilsen,", { after: 50, size: 22 }),
    S.bodyPara(profile.fullName, { size: 22, italics: true, color: S.ACCENT }),
  ];

  const doc = new Document({
    styles: { default: { document: { run: { font: S.BODY_FONT, size: 22 } } } },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: S.convertInchesToTwip(0.9),
              bottom: S.convertInchesToTwip(0.9),
              left: S.convertInchesToTwip(1.0),
              right: S.convertInchesToTwip(1.0),
            },
          },
        },
        children,
      },
    ],
  });

  const out = outFile || `Fabian_Hansen_Ansogning_${company.replace(/\s+/g, "_")}.docx`;
  return Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(out, buffer);
    return out;
  });
}

module.exports = { buildCoverLetter };
