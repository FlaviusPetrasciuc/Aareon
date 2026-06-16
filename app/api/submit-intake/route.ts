import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";

type Answer = {
  questionId: string;
  question: string;
  answer: string;
};

type SubmitBody = {
  managerEmail: string;
  jobTitle: string;
  answers: Answer[];
  jobDescription?: string;
  approvalPdf?: {
    fileName: string;
    contentType: string;
    base64: string;
  };
};

function safeFileName(text: string) {
  return text
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function translateQuestion(question: string) {
  const translations: Record<string, string> = {
    "Job title": "Functietitel",
    Location: "Locatie",
    Department: "Afdeling",
    "Work mode": "Werkvorm",
    "Employment type": "Dienstverband",
    Education: "Opleidingsniveau",
    "Salary range": "Salarisindicatie",
    "Work equipment": "Werkmiddelen",
    "Must-haves": "Must-haves",
    "Nice-to-haves": "Nice-to-haves",
    "Shouldn't have": "Niet gewenst",
    "Additional details": "Aanvullende details",
  };

  return translations[question] || question;
}

function translateJobText(text: string) {
  return text
    .replaceAll("Responsibilities:", "Verantwoordelijkheden")
    .replaceAll("Requirements:", "Vereisten")
    .replaceAll("What we offer:", "Wat wij bieden")
    .replaceAll("Responsibilities", "Verantwoordelijkheden")
    .replaceAll("Requirements", "Vereisten")
    .replaceAll("What we offer", "Wat wij bieden");
}

function wrapTextByWidth(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const paragraphs = String(text || "-").split("\n");
  const lines: string[] = [];

  paragraphs.forEach((paragraph) => {
    const words = paragraph.trim().split(/\s+/);
    let line = "";

    words.forEach((word) => {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        line = testLine;
      } else {
        if (line) lines.push(line);
        line = word;
      }
    });

    if (line) lines.push(line);
  });

  return lines.length ? lines : ["-"];
}

async function createIntakePdfBuffer(data: SubmitBody): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();

  let page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();

  const marginX = 50;
  const topMargin = 50;
  const bottomMargin = 60;

  let y = height - topMargin;

  const addPageIfNeeded = (neededSpace = 40) => {
    if (y - neededSpace < bottomMargin) {
      page = pdfDoc.addPage();
      y = height - topMargin;
    }
  };

  const drawText = (
    text: string,
    size = 12,
    isBold = false,
    indent = marginX
  ) => {
    const selectedFont = isBold ? boldFont : font;
    const maxWidth = width - indent - marginX;
    const lines = wrapTextByWidth(text, selectedFont, size, maxWidth);

    lines.forEach((line) => {
      addPageIfNeeded(size + 14);

      page.drawText(line, {
        x: indent,
        y,
        size,
        font: selectedFont,
        color: rgb(0.07, 0.09, 0.16),
      });

      y -= size + 8;
    });
  };

  const drawMainTitle = (title: string) => {
    addPageIfNeeded(80);
    drawText(title, 24, true);
    y -= 18;
  };

  const drawSectionTitle = (title: string) => {
    addPageIfNeeded(80);
    y -= 12;
    drawText(`${title.toUpperCase()}:`, 18, true);
    y -= 10;
  };

  const drawField = (title: string, value: string) => {
    addPageIfNeeded(100);
    y -= 6;
    drawText(`${title}:`, 14, true);
    y -= 2;
    drawText(value || "-", 12, false, 70);
    y -= 12;
  };

  const drawParagraph = (text: string) => {
    drawText(text || "-", 12, false, marginX);
    y -= 8;
  };

  const uniqueAnswers = (data.answers || []).filter(
    (item, index, array) =>
      index ===
      array.findIndex(
        (other) =>
          other.questionId === item.questionId &&
          other.question === item.question &&
          other.answer === item.answer
      )
  );

  drawMainTitle("Vacatureaanvraag");

  drawField("Functietitel", data.jobTitle);
  drawField("Manager e-mail", data.managerEmail);
  drawField("Ingediend op", new Date().toLocaleString("nl-NL"));

  drawSectionTitle("Vacaturegegevens");

  if (uniqueAnswers.length > 0) {
    uniqueAnswers.forEach((item) => {
      drawField(translateQuestion(item.question), item.answer);
    });
  } else {
    drawParagraph("Geen intake-antwoorden beschikbaar.");
  }

  if (data.jobDescription?.trim()) {
    drawSectionTitle("Vacaturetekst");

    const description = translateJobText(data.jobDescription.trim());

    const mainSections = [
      "Over de functie",
      "Over het bedrijf",
      "Verantwoordelijkheden",
      "Vereisten",
      "Wat wij bieden",
    ];

    const subSections = ["Must-haves", "Nice-to-haves", "Niet gewenst"];

    const allSections = [...mainSections, ...subSections];

    let formattedDescription = description;

    allSections.forEach((title) => {
      formattedDescription = formattedDescription.replaceAll(
        `${title}:`,
        `\n${title}\n`
      );

      formattedDescription = formattedDescription.replaceAll(
        title,
        `\n${title}\n`
      );
    });

    formattedDescription = formattedDescription
      .replaceAll(":\n:", ":")
      .replaceAll("\n:\n", "\n")
      .replaceAll("::", ":");

    formattedDescription
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && line !== ":" && line !== "::" && line !== "-")
      .forEach((line) => {
        const cleanLine = line.replace(/:$/, "");

        const isMainSection = mainSections.includes(cleanLine);
        const isSubSection = subSections.includes(cleanLine);

        if (isMainSection) {
          drawSectionTitle(cleanLine);
          return;
        }

        if (isSubSection) {
          addPageIfNeeded(70);
          y -= 8;
          drawText(`${cleanLine}:`, 14, true);
          y -= 6;
          return;
        }

        drawParagraph(line);
      });
  }

  return Buffer.from(await pdfDoc.save());
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SubmitBody;

    if (!body.managerEmail || !body.jobTitle) {
      return NextResponse.json(
        { error: "Verplichte gegevens ontbreken." },
        { status: 400 }
      );
    }

    if (!body.approvalPdf?.base64) {
      return NextResponse.json(
        { error: "Het goedkeuringsdocument is verplicht." },
        { status: 400 }
      );
    }

    const normalizedEmail = body.managerEmail.trim().toLowerCase();

    const isAllowedEmail =
      normalizedEmail.endsWith("@aareon.nl") ||
      normalizedEmail.endsWith("@gmail.com");

    if (!isAllowedEmail) {
      return NextResponse.json(
        { error: "Alleen bedrijfs-e-mailadressen zijn toegestaan." },
        { status: 403 }
      );
    }

    const recruiterEmail = process.env.RECRUITER_EMAIL;

    if (!recruiterEmail) {
      return NextResponse.json(
        { error: "Het e-mailadres van de recruiter is niet geconfigureerd." },
        { status: 500 }
      );
    }

    const intakePdfBuffer = await createIntakePdfBuffer({
      ...body,
      managerEmail: normalizedEmail,
    });

    const approvalPdfBuffer = Buffer.from(body.approvalPdf.base64, "base64");

    const safeJobTitle = safeFileName(body.jobTitle);

    const attachments = [
      {
        filename: `vacatureaanvraag-${safeJobTitle}.pdf`,
        content: intakePdfBuffer,
        contentType: "application/pdf",
      },
      {
        filename: body.approvalPdf.fileName || "goedkeuringsdocument.pdf",
        content: approvalPdfBuffer,
        contentType: body.approvalPdf.contentType || "application/pdf",
      },
    ];

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const attachedText = `Bijgevoegd:
- Vacatureaanvraag PDF met intakevragen, antwoorden en AI-gegenereerde vacaturetekst
- Goedkeuringsdocument van de directie`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: normalizedEmail,
      subject: `Bevestiging: vacatureaanvraag ingediend voor ${body.jobTitle}`,
      text: `Beste collega,

Uw vacatureaanvraag voor ${body.jobTitle} is succesvol ingediend.

De recruiter heeft de aanvraag ontvangen en zal deze beoordelen. Daarna wordt de aanvraag verder verwerkt volgens het goedkeuringsproces.

${attachedText}

Met vriendelijke groet,
Aareon Recruitment Platform`,
      attachments,
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: recruiterEmail,
      subject: `Nieuwe vacatureaanvraag ingediend: ${body.jobTitle}`,
      text: `Beste recruiter,

Er is een nieuwe vacatureaanvraag ingediend via het Aareon AI Recruitment Platform.

Manager e-mail: ${normalizedEmail}
Functietitel: ${body.jobTitle}

${attachedText}

Controleer de bijlagen voor de volledige vacatureaanvraag en het goedkeuringsdocument.

Met vriendelijke groet,
Aareon Recruitment Platform`,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit intake error:", error);

    return NextResponse.json(
      { error: "Het verzenden van de vacatureaanvraag is mislukt." },
      { status: 500 }
    );
  }
}