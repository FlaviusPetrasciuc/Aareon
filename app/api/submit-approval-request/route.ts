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

async function createApprovalRequestPdf(data: ApprovalRequestBody): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let page = pdfDoc.addPage();

  const { width, height } = page.getSize();
  let y = height - 50;

  const ensureSpace = (space = 70) => {
    if (y < space) {
      page = pdfDoc.addPage();
      y = height - 50;
    }
  };

  const draw = (text: string, size = 11, isBold = false) => {
    wrapText(text, size >= 14 ? 70 : 90).forEach((line) => {
      ensureSpace();

      page.drawText(line, {
        x: 50,
        y,
        size,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
      });

      y -= size + 6;
    });
  };

  const section = (title: string) => {
    y -= 10;
    draw(title, 15, true);
    y -= 2;
  };

  const field = (label: string, value: string) => {
    draw(`${label}: ${value || "-"}`, 11);
  };

  draw("Aanvraag Vacature", 22, true);
  field("Manager e-mail", data.managerEmail);

  section("Basis");
  field("Hiring manager", data.hiringManager);
  field("Team", data.team);
  field("Functie", data.functie);
  field("Datum", data.datum);

  section("Onderbouwing");
  field("Waarom nodig?", data.waaromNodig);
  field("Risico bij niet invullen", data.risicoBijNietInvullen);
  field("Prioriteit", data.prioriteit);

  section("Interne invulling");
  field("Intern mogelijk?", data.internMogelijk);
  field("Toelichting", data.interneToelichting);
  field("Overwogen opties", data.overwogenOpties);

  section("Financiele impact");
  field("Kosten indicatie", data.kostenIndicatie);
  field("Binnen budget?", data.binnenBudget);
  field("Toelichting", data.financieleToelichting);

  section("Impact");
  field("Verwachte impact (6-12m)", data.verwachteImpact);
  field("Bijdrage aan doelen", data.bijdrageAanDoelen);

  return Buffer.from(await pdfDoc.save());
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ApprovalRequestBody;

    const missingFields = requiredFields.filter((fieldName) =>
      !String(body[fieldName] || "").trim()
    );

    if (missingFields.length) {
      return NextResponse.json(
        { error: "Missing required data", missingFields },
        { status: 400 }
      );
    }

    const normalizedEmail = body.managerEmail.trim().toLowerCase();
    const recruiterEmail = process.env.RECRUITER_EMAIL;

    if (!recruiterEmail) {
      return NextResponse.json(
        { error: "Recruiter email is not configured" },
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
      subject: `Vacancy request submitted: ${body.functie}`,
      text: `The vacancy request for ${body.functie} has been submitted.

Hiring manager: ${body.hiringManager}
Team: ${body.team}
Manager email: ${normalizedEmail}

The completed approval request form is attached as a PDF.`,
      attachments: [
        {
          filename: `aanvraag-vacature-${body.functie.replace(/\s+/g, "-")}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit approval request error:", error);

    return NextResponse.json(
      { error: "Failed to submit approval request" },
      { status: 500 }
    );
  }
}