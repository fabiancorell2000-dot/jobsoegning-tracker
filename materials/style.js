// Shared docx styling for Fabian's CV and cover letters.
// Two fonts on purpose: Georgia for name/headings, Calibri for body.
// That pairing (plus no all-caps, no letter-spacing, no boxed headers) is what
// keeps this from reading as a generic template. Do not "simplify" it back to
// one font or all-caps headings without being asked.
const {
  Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, LevelFormat, convertInchesToTwip,
} = require("docx");

const BODY_FONT = "Calibri";
const HEAD_FONT = "Georgia";
const INK = "1A1A1A";
const MUTED = "525252";
const ACCENT = "1F3B57"; // deep slate navy, used sparingly
const RULE = "D9DCE1";

const bulletNumbering = {
  config: [
    {
      reference: "bullets",
      levels: [
        {
          level: 0,
          format: LevelFormat.BULLET,
          text: "•",
          alignment: AlignmentType.LEFT,
          style: {
            paragraph: {
              indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.18) },
            },
          },
        },
      ],
    },
  ],
};

function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 5 } },
    children: [new TextRun({ text, bold: true, color: ACCENT, size: 25, font: HEAD_FONT })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 28, line: 240 },
    children: [new TextRun({ text, size: 21, font: BODY_FONT })],
  });
}

function bodyPara(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 90, line: opts.line ?? 240 },
    alignment: opts.align,
    children: [new TextRun({ text, size: opts.size ?? 21, font: BODY_FONT, italics: opts.italics, color: opts.color ?? INK })],
  });
}

function jobHeader(title, org, dates) {
  return new Paragraph({
    spacing: { before: 130, after: 10 },
    tabStops: [{ type: "right", position: convertInchesToTwip(6.3) }],
    children: [
      new TextRun({ text: title, bold: true, size: 22, font: BODY_FONT, color: INK }),
      new TextRun({ text: `, ${org}`, bold: false, size: 22, font: BODY_FONT, color: INK }),
      new TextRun({ text: `\t${dates}`, size: 20, font: BODY_FONT, color: MUTED, italics: true }),
    ],
  });
}

// Same visual treatment as jobHeader; kept as a separate name because education
// entries and work-experience entries are conceptually different sections.
const eduHeader = jobHeader;

function skillGroup(label, items) {
  return [
    new Paragraph({
      spacing: { before: 80, after: 15 },
      children: [new TextRun({ text: label, bold: true, size: 21, font: BODY_FONT, color: INK })],
    }),
    new Paragraph({
      spacing: { after: 80, line: 240 },
      children: [new TextRun({ text: items, size: 21, font: BODY_FONT, color: MUTED })],
    }),
  ];
}

function nameHeading(name, size = 44) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 25 },
    children: [new TextRun({ text: name, bold: true, size, font: HEAD_FONT, color: ACCENT })],
  });
}

function subtitleLine(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 90 },
    children: [new TextRun({ text, size: 22, font: HEAD_FONT, italics: true, color: MUTED })],
  });
}

function contactLine(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: opts.after ?? 50 },
    border: opts.noBorder ? undefined : { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 10 } },
    children: [new TextRun({ text, size: 19, font: BODY_FONT, color: MUTED })],
  });
}

module.exports = {
  BODY_FONT, HEAD_FONT, INK, MUTED, ACCENT, RULE,
  bulletNumbering, sectionHeading, bullet, bodyPara,
  jobHeader, eduHeader, skillGroup, nameHeading, subtitleLine, contactLine,
  convertInchesToTwip,
};
