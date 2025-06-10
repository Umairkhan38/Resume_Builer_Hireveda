import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = await pdfParse(buffer);
    const resumeText = parsed.text;

    const schema = `{
        "personalInfo": {
          "name": "",
          "email": "",
          "phone": "",
          "linkedIn": "",
          "portfolio": "",
          "location": ""
        },
        "professionalSummary": {
          "summary": ""
        },
        "workExperience": [
          {
            "jobTitle": "",
            "companyName": "",
            "employmentType": "",
            "location": "",
            "startDate": "",
            "endDate": "",
            "responsibilities": "",
            "skillsUsed": [],
            "currentlyWorking": false
          }
        ],
        "education": [
          {
            "degree": "",
            "institution": "",
            "location": "",
            "startDate": "",
            "endDate": "",
            "cgpa": ""
          }
        ],
        "skills": {
          "technical": [],
          "soft": []
        },
        "projects": [
          {
            "title": "",
            "description": "",
            "techStack": "",
            "link": ""
          }
        ],
        "certifications": [
          {
            "name": "",
            "organization": "",
            "issueDate": "",
            "credentialLink": ""
          }
        ],
        "languages": [
          {
            "name": "",
            "proficiency": ""
          }
        ],
        "achievements": [
          {
            "title": "",
            "description": ""
          }
        ],
        "volunteerWork": [
          {
            "role": "",
            "organization": "",
            "timePeriod": "",
            "description": ""
          }
        ]
      }`;



const prompt = `Extract the resume below and strictly return only a JSON object following exactly this schema if provided content in file doesn't match any of these section exclude them:
${schema}

DO NOT include markdown, explanations, or any text outside the JSON.

Resume:
"""${resumeText}"""`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const raw = response.choices[0]?.message?.content;

    let structured;
    try {
      structured = JSON.parse(raw);
    } catch (parseErr) {
      console.error("Failed to parse OpenAI response as JSON:");
      console.error("Raw Response:", raw);
      throw parseErr;
    }

    return NextResponse.json(structured);
  } catch (err) {
    console.error("Resume parsing failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
