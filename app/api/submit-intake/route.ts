import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type Answer = {
  questionId: string;
  question: string;
  answer: string;
};

type SubmitBody = {
  managerEmail: string;
  jobTitle: string;
  answers: Answer[];
};

async function createPdfBuffer(data: SubmitBody): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();

  let page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  let y = height - 50;

  const drawText = (text: string, size = 12, isBold = false) => {
    if (y < 80) {
      page = pdfDoc.addPage();
      y = height - 50;
    }

    page.drawText(text, {
      x: 50,
      y,
      size,
      font: isBold ? boldFont : font,
      color: rgb(0, 0, 0),
      maxWidth: width - 100,
    });

    y -= size + 12;
  };

  drawText("Hiring Manager Intake Report", 20, true);
  y -= 10;

  drawText(`Job title: ${data.jobTitle}`);
  drawText(`Manager email: ${data.managerEmail}`);
  drawText(`Submitted at: ${new Date().toLocaleString()}`);

  y -= 10;

  data.answers.forEach((item, index) => {
    drawText(`${index + 1}. ${item.question}`, 14, true);
    drawText(`Answer: ${item.answer}`);
    y -= 8;
  });

  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SubmitBody;

    if (!body.managerEmail || !body.jobTitle || !body.answers?.length) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    const normalizedEmail = body.managerEmail.trim().toLowerCase();

    const isAllowedEmail =
      normalizedEmail.endsWith("@aareon.nl") ||
      normalizedEmail.endsWith("@gmail.com");

    if (!isAllowedEmail) {
      return NextResponse.json(
        { error: "Only company emails are allowed" },
        { status: 403 }
      );
    }

    const pdfBuffer = await createPdfBuffer({
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

    const fileName = `intake-${body.jobTitle.replace(/\s+/g, "-")}.pdf`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: normalizedEmail,
      subject: `Confirmation: Intake submitted for ${body.jobTitle}`,
      text: `Thank you. Your intake for ${body.jobTitle} was submitted successfully. The PDF with your questions and answers is attached.`,
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.RECRUITER_EMAIL,
      subject: `New manager intake submitted: ${body.jobTitle}`,
      text: `A manager completed the AI intake form.

Manager email: ${normalizedEmail}
Job title: ${body.jobTitle}

The PDF with questions and answers is attached.`,
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit intake error:", error);

    return NextResponse.json(
      { error: "Failed to submit intake" },
      { status: 500 }
    );
  }
}