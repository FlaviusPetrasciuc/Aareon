import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type DecisionBody = {
  submissionId: string;
  managerEmail: string;
  jobTitle: string;
  decision: "approved" | "rejected";
  feedback?: string;
};

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DecisionBody;

    if (!body.managerEmail || !body.jobTitle || !body.decision) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const isApproved = body.decision === "approved";
    const transporter = getTransporter();

    // Email to manager
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: body.managerEmail,
      subject: `Your job posting request has been ${body.decision}: ${body.jobTitle}`,
      text: `Dear manager,

Your job posting request for "${body.jobTitle}" has been ${body.decision} by the director.

${!isApproved && body.feedback ? `Feedback:\n${body.feedback}\n` : ""}
${isApproved ? "Your request will now be forwarded to the recruiter." : "Please review the feedback and resubmit if needed."}

Kind regards,
Aareon HR`,
    });

    // Email to recruiter
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.RECRUITER_EMAIL,
      subject: `Director decision on job posting: ${body.jobTitle}`,
      text: `The director has ${body.decision} the job posting request.

Job title: ${body.jobTitle}
Manager: ${body.managerEmail}
Decision: ${body.decision.toUpperCase()}
${body.feedback ? `\nFeedback: ${body.feedback}` : ""}

${isApproved ? "Please proceed with the recruitment process." : "No further action required at this time."}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Director decide error:", error);
    return NextResponse.json(
      { error: "Failed to process decision" },
      { status: 500 }
    );
  }
}