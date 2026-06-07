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
  jobDescription?: string;
  approvalPdf?: {
    fileName: string;
    contentType: string;
    base64: string;
  };
};

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

async function createIntakePdfBuffer(data: SubmitBody): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();

  let page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  let y = height - 50;

  const drawText = (text: string, size = 12, isBold = false) => {
    wrapText(text, size >= 14 ? 70 : 90).forEach((line) => {
      if (y < 80) {
        page = pdfDoc.addPage();
        y = height - 50;
      }

      page.drawText(line, {
        x: 50,
        y,
        size,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
      });

      y -= size + 8;
    });
  };

  drawText("Hiring Manager Intake Report", 20, true);
  y -= 10;

  drawText(`Job title: ${data.jobTitle}`);
  drawText(`Manager email: ${data.managerEmail}`);
  drawText(`Submitted at: ${new Date().toLocaleString()}`);

  y -= 10;

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

  if (uniqueAnswers.length > 0) {
    drawText("Intake answers", 18, true);
    y -= 6;

    uniqueAnswers.forEach((item, index) => {
      drawText(`${index + 1}. ${item.question}`, 14, true);
      drawText(`Answer: ${item.answer}`);
      y -= 8;
    });
  }

  if (data.jobDescription?.trim()) {
    y -= 10;
    drawText("AI-generated job description", 18, true);
    y -= 8;
    drawText(data.jobDescription.trim());
  }

  return Buffer.from(await pdfDoc.save());
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SubmitBody;

    if (!body.managerEmail || !body.jobTitle) {
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

    const recruiterEmail = process.env.RECRUITER_EMAIL;

    if (!recruiterEmail) {
      return NextResponse.json(
        { error: "Recruiter email is not configured" },
        { status: 500 }
      );
    }

    const intakePdfBuffer = await createIntakePdfBuffer({
      ...body,
      managerEmail: normalizedEmail,
    });

    const approvalPdfBuffer = body.approvalPdf?.base64
      ? Buffer.from(body.approvalPdf.base64, "base64")
      : null;

    const safeJobTitle = safeFileName(body.jobTitle);

    const attachments = [
      {
        filename: `intake-${safeJobTitle}.pdf`,
        content: intakePdfBuffer,
        contentType: "application/pdf",
      },
      ...(approvalPdfBuffer
        ? [
            {
              filename: body.approvalPdf?.fileName || "director-approval.pdf",
              content: approvalPdfBuffer,
              contentType: body.approvalPdf?.contentType || "application/pdf",
            },
          ]
        : []),
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

    const attachedText = `Attached:
- Intake PDF with questions, answers, and AI-generated job description
${approvalPdfBuffer ? "- Approval PDF" : "- Approval PDF was not attached"}`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: normalizedEmail,
      subject: `Confirmation: Intake submitted for ${body.jobTitle}`,
      text: `Thank you. Your intake for ${body.jobTitle} was submitted successfully.

${attachedText}`,
      attachments,
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: recruiterEmail,
      subject: `New manager intake submitted: ${body.jobTitle}`,
      text: `A manager completed the AI intake form.

Manager email: ${normalizedEmail}
Job title: ${body.jobTitle}

${attachedText}`,
      attachments,
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