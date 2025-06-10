// ResumeDocument.jsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";


// Optional: Custom font registration
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helvetica.ttf", fontWeight: "normal" },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 40,
    lineHeight: 1.5,
    flexDirection: "column",
    color: "#333",
  },
  name: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily:"Helvetica",
    marginBottom: 8,
    color:"#1e3a8a"
  },
  headline: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
    marginBottom: 6,
    fontWeight:"bold"
  },
  contact: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 12,
    color:"#1e3a8a",
    fontWeight:"bold"
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 6,
    textTransform: "uppercase",
    borderBottom: "1 solid #ddd",
    paddingBottom: 3,
  },
  entryTitle: {
    fontWeight: "bold",
    marginBottom: 1,
  },
  companyName:{
    fontSize: 10,
    fontWeight:"bold",
    fontStyle: "italic",
    color:"#1e3a8a"
  },
  entrySub: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 6,
  },
  link: {
    fontSize: 10,
    color:"#1e3a8a"
  },
});

const ResumeDocument = ({ resumeData }) => {
  const { personalInfo, professionalSummary, workExperience, education, skills, projects } = resumeData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.name}>{personalInfo.name}</Text>
        <Text style={styles.headline}>
          {personalInfo.jobTitle || "Full Stack Developer"} | {skills.technical?.slice(0, 3)?.join(", ")}
        </Text>
        <Text style={styles.contact}>
          {personalInfo.email} | {personalInfo.linkedIn} | {personalInfo.location}
        </Text>

        {/* Summary */}
        {professionalSummary.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.paragraph}>{professionalSummary.summary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {workExperience?.some(w => w.jobTitle) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {workExperience.map((job, i) =>
              job.jobTitle ? (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={styles.entryTitle}>{job.jobTitle}</Text>
                  <Text style={styles.companyName}>
                   @ {job.companyName}</Text>
                  <Text style={styles.entrySub}>
                    {job.employmentType} | {job.location} | {job.startDate} - {job.currentlyWorking ? "Present" : job.endDate}
                  </Text>
                  <Text style={styles.paragraph}>{job.responsibilities}</Text>
                  {job.skillsUsed?.length > 0 && (
                    <Text style={styles.paragraph}>Skills Used: {job.skillsUsed.join(", ")}</Text>
                  )}
                </View>
              ) : null
            )}
          </View>
        )}


   {/* Skills */}
   {(skills.technical?.length || skills.soft?.length) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.technical?.length > 0 && (
              <Text style={styles.paragraph}>Technical: {skills.technical.join(", ")}</Text>
            )}
            {skills.soft?.length > 0 && (
              <Text style={styles.paragraph}>Soft: {skills.soft.join(", ")}</Text>
            )}
          </View>
        )}
        
        {/* Education */}
        {education?.some(e => e.degree) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) =>
              edu.degree ? (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={styles.entryTitle}>{edu.degree} - {edu.institution}</Text>
                  <Text style={styles.entrySub}>
                    {edu.location} | {edu.startDate} - {edu.endDate}
                  </Text>
                  {edu.cgpa && <Text style={styles.paragraph}>CGPA: {edu.cgpa}</Text>}
                </View>
              ) : null
            )}
          </View>
        )}

     

        {/* Projects */}
        {projects?.some(p => p.title) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj, i) =>
              proj.title ? (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={styles.entryTitle}>{proj.title}</Text>
                  {proj.link && (
                    <Text style={styles.link}>Link: {proj.link}</Text>
                  )}

                   {proj.techStack && (
                    <Text style={styles.paragraph}>Tech Stack: {proj.techStack}</Text>
                  )}

                  <Text style={styles.paragraph}>{proj.description}</Text>
                              
                </View>
              ) : null
            )}
          </View>
        )}


{resumeData.certifications?.some(c => c.name) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications & Licenses</Text>
            {resumeData.certifications.map((cert, i) =>
              cert.name ? (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={styles.entryTitle}>{cert.name}</Text>
                  <Text style={styles.companyName}>@ {cert.organization}</Text>
                  <Text style={styles.entrySub}>
                    Issued: {cert.issueDate}
                  </Text>
                  {cert.credentialLink && (
                    <Text style={styles.link}>Link: {cert.credentialLink}</Text>
                  )}
                </View>
              ) : null
            )}
          </View>
        )}

        {/* Languages */}
        {resumeData.languages?.some(l => l.name) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {resumeData.languages.map((lang, i) =>
              lang.name ? (
                <Text key={i} style={styles.paragraph}>
                  {lang.name} - {lang.proficiency}
                </Text>
              ) : null
            )}
          </View>
        )}

        {/* Achievements / Awards */}
        {resumeData.achievements?.some(a => a.title) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements / Awards</Text>
            {resumeData.achievements.map((a, i) =>
              a.title ? (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={styles.entryTitle}>{a.title}</Text>
                  <Text style={styles.paragraph}>{a.description}</Text>
                </View>
              ) : null
            )}
          </View>
        )}

        {/* Volunteer Work / Extracurricular */}
        {resumeData.volunteerWork?.some(v => v.role) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Volunteer Work / Extracurricular</Text>
            {resumeData.volunteerWork.map((v, i) =>
              v.role ? (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={styles.entryTitle}>{v.role}</Text>
                  <Text style={styles.companyName}>@ {v.organization}</Text>
                  <Text style={styles.entrySub}>{v.timePeriod}</Text>
                  <Text style={styles.paragraph}>{v.description}</Text>
                </View>
              ) : null
            )}
          </View>
        )}


      </Page>
    </Document>
  );
};

export default ResumeDocument;
