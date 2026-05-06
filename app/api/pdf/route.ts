import { NextRequest, NextResponse } from "next/server";
import type { ResumeData } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { resume, html }: { resume: ResumeData; html: string } = await req.json();

    if (!html) {
      return NextResponse.json({ error: "html content is required" }, { status: 400 });
    }

    // Dynamic import of puppeteer-core to avoid build issues
    let puppeteer: typeof import("puppeteer-core");
    try {
      puppeteer = await import("puppeteer-core");
    } catch {
      return NextResponse.json(
        { error: "PDF generation requires Puppeteer. Please run: npm install puppeteer" },
        { status: 501 }
      );
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        (process.platform === "win32"
          ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
          : process.platform === "darwin"
          ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
          : "/usr/bin/google-chrome-stable"),
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0.5in", right: "0.5in", bottom: "0.5in", left: "0.5in" },
    });

    await browser.close();

    const name = resume?.contact?.name?.replace(/\s+/g, "_") ?? "resume";

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${name}_resume.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "Failed to generate PDF." }, { status: 500 });
  }
}
