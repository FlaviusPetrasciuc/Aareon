import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type ApprovalRequestBody = {
  managerEmail: string;
  hiringManager: string;
  team: string;
  functie: string;
  datum: string;
  waaromNodig: string;
  risicoBijNietInvullen: string;
  prioriteit: "Laag" | "Middel" | "Hoog" | "";
  internMogelijk: "Ja" | "Nee" | "";
  interneToelichting: string;
  overwogenOpties: string;
  kostenIndicatie: string;
  binnenBudget: "Ja" | "Nee" | "";
  financieleToelichting: string;
  verwachteImpact: string;
  bijdrageAanDoelen: string;
};

const requiredFields: Array<keyof ApprovalRequestBody> = [
  "managerEmail",
  "hiringManager",
  "team",
  "functie",
  "datum",
  "waaromNodig",
  "risicoBijNietInvullen",
  "prioriteit",
  "internMogelijk",
  "interneToelichting",
  "overwogenOpties",
  "kostenIndicatie",
  "binnenBudget",
  "financieleToelichting",
  "verwachteImpact",
  "bijdrageAanDoelen",
];

function wrapText(text: string, maxChars = 90): string[] {
  const words = String(text || "-").split(/\s+/);
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;

    if (next.length > maxChars) {
      if (line) lines.push(line);
      line = word;
      return;
    }

    line = next;
  });

  if (line) lines.push(line);

  return lines.length ? lines : ["-"];
}

function safeFileName(text: string) {
  return text
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

async function createApprovalRequestPdf(
  data: ApprovalRequestBody
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let page = pdfDoc.addPage();

  const { width, height } = page.getSize();
  let y = height - 50;

  const ensureSpace = (space = 80) => {
    if (y < space) {
      page = pdfDoc.addPage();
      y = height - 50;
    }
  };

  const draw = (text: string, size = 11, isBold = false, indent = 50) => {
    wrapText(text, size >= 14 ? 70 : 90).forEach((line) => {
      ensureSpace();

      page.drawText(line, {
        x: indent,
        y,
        size,
        font: isBold ? boldFont : font,
        color: rgb(0.07, 0.09, 0.16),
        maxWidth: width - 100,
      });

      y -= size + 6;
    });
  };

  const section = (title: string) => {
    y -= 16;
    draw(`${title.toUpperCase()}:`, 16, true);
    y -= 8;
  };

  const field = (label: string, value: string) => {
    y -= 6;
    draw(`${label}:`, 12, true);
    y -= 2;
    draw(value || "-", 11, false, 70);
    y -= 8;
  };

  draw("Aanvraag vacature", 22, true);
  y -= 12;

  field("Manager e-mail", data.managerEmail);

  section("Basisgegevens");
  field("Hiring manager", data.hiringManager);
  field("Team", data.team);
  field("Functie", data.functie);
  field("Datum", data.datum);

  section("Onderbouwing");
  field("Waarom is deze vacature nodig?", data.waaromNodig);
  field("Risico bij het niet invullen van de functie", data.risicoBijNietInvullen);
  field("Prioriteit", data.prioriteit);

  section("Interne invulling");
  field("Intern mogelijk?", data.internMogelijk);
  field("Toelichting interne invulling", data.interneToelichting);
  field("Overwogen opties", data.overwogenOpties);

  section("Financiële impact");
  field("Kostenindicatie", data.kostenIndicatie);
  field("Binnen budget?", data.binnenBudget);
  field("Financiële toelichting", data.financieleToelichting);

  section("Impact");
  field("Verwachte impact binnen 6-12 maanden", data.verwachteImpact);
  field("Bijdrage aan doelen", data.bijdrageAanDoelen);

  return Buffer.from(await pdfDoc.save());
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ApprovalRequestBody;

    const missingFields = requiredFields.filter(
      (fieldName) => !String(body[fieldName] || "").trim()
    );

    if (missingFields.length) {
      return NextResponse.json(
        { error: "Verplichte gegevens ontbreken.", missingFields },
        { status: 400 }
      );
    }

    const normalizedEmail = body.managerEmail.trim().toLowerCase();
    const recruiterEmail = process.env.RECRUITER_EMAIL;

    if (!recruiterEmail) {
      return NextResponse.json(
        { error: "Het e-mailadres van de recruiter is niet geconfigureerd." },
        { status: 500 }
      );
    }

    const pdfBuffer = await createApprovalRequestPdf({
      ...body,
      managerEmail: normalizedEmail,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: [normalizedEmail, recruiterEmail],
      subject: `Vacatureaanvraag ingediend: ${body.functie}`,
      text: `Beste collega,

De vacatureaanvraag voor ${body.functie} is succesvol ingediend.

Hiring manager: ${body.hiringManager}
Team: ${body.team}
Manager e-mail: ${normalizedEmail}

Het ingevulde goedkeuringsaanvraagformulier is als PDF bijgevoegd.

Met vriendelijke groet,
Aareon Recruitment Platform`,
      attachments: [
        {
          filename: `aanvraag-vacature-${safeFileName(body.functie)}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit approval request error:", error);

    return NextResponse.json(
      { error: "Het verzenden van de goedkeuringsaanvraag is mislukt." },
      { status: 500 }
    );
  }
}