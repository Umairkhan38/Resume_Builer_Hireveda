"use client";


import React from 'react'
import Navbar from '../Navbar'
import { useSearchParams } from 'next/navigation'
import { useState } from "react";
import { IoMdDownload } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { pdf } from "@react-pdf/renderer";
import ResumeDocument from '../ResumeDocument';






function ResumeForm() {

  const searchParams = useSearchParams();
  const source = searchParams.get('source') || "";

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [newTechnicalSkill, setNewTechnicalSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [usedSkill, setUsedSkill] = useState("");
  const [loading, setLoading] = useState(false);



  const handleFileChange = async (e) => {

    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return;


    setSelectedFile(file);
    simulateUpload(); 
    setLoading(true); 

  
    const reader = new FileReader();
  reader.onload = async () => {
    const arrayBuffer = reader.result;

    try {
      const res = await fetch("/api/parseResume", {
        method: "POST",
        headers: {
          "Content-Type": "application/pdf",
        },
        body: arrayBuffer,
      });

      const data = await res.json();
      if (res.ok) {
        setResumeData(data);
      } else {
        console.error("OpenAI parsing error:", data.error);
      }
    } catch (err) {
      console.error("Error uploading resume:", err);
    } finally {
      setLoading(false);
    }
  };

  reader.readAsArrayBuffer(file);
};




  
  const processFile = (file) => {
    setSelectedFile(file);
    simulateUpload();
  };




  const addUsedSkill = (index) => {
    if (!usedSkill.trim()) return; // avoid empty skills
  
    setResumeData((prev) => {
      const updatedWorkExperience = [...prev.workExperience];
      const currentSkills = updatedWorkExperience[index].skillsUsed || [];
  
      updatedWorkExperience[index] = {
        ...updatedWorkExperience[index],
        skillsUsed: [...currentSkills, usedSkill.trim()],
      };
  
      return {
        ...prev,
        workExperience: updatedWorkExperience,
      };
    });
  
    setUsedSkill(""); // clear input after adding
  };


  const removeUsedSkill = (index, skillIndex) => {
    setResumeData((prev) => {
      const updatedWorkExperience = [...prev.workExperience];
      const updatedSkills = [...updatedWorkExperience[index].skillsUsed];
      updatedSkills.splice(skillIndex, 1);
  
      updatedWorkExperience[index] = {
        ...updatedWorkExperience[index],
        skillsUsed: updatedSkills,
      };
  
      return {
        ...prev,
        workExperience: updatedWorkExperience,
      };
    });
  };
  
  

  
  const addSkill = (type) => {
    const newSkill = type === "technical" ? newTechnicalSkill : newSoftSkill;
    if (!newSkill.trim()) return;
  
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: [...prev.skills[type], newSkill.trim()],
      },
    }));
  
    // Clear input
    type === "technical" ? setNewTechnicalSkill("") : setNewSoftSkill("");
  };
  
  const removeSkill = (type, index) => {
    const updated = resumeData?.skills[type].filter((_, i) => i !== index);
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: updated,
      },
    }));
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };



  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };


  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };



  // Simulate fake upload
  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };


const [resumeData, setResumeData] = useState({
  // 1. Personal Information
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    linkedIn: "",
    portfolio: "",
    location: "", // Can be a string like "City, 
    
  },

  // 2. Professional Summary
  professionalSummary: {
    summary: "",
  },

  // 3. Work Experience (array of objects)
  workExperience: [
    {
      jobTitle: "",
      companyName: "",
      employmentType: "", // Optional: Full-time, Internship, etc.
      location: "",
      startDate: "",
      endDate: "",
      responsibilities: "",
      skillsUsed:[],
      currentlyWorking: false,
    },
  ],

  // 4. Education (array of objects)
  education: [
    {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      cgpa: "",
    },
  ],

  // 5. Skills
  skills: {
    technical: [], // array of strings
    soft: [], // array of strings (optional)
  },

  // 6. Projects (array of objects)
  projects: [
    {
      title: "",
      description: "",
      techStack: "",
      link: "",
    },
  ],

  // 7. Certifications & Licenses (array of objects)
  certifications: [
    {
      name: "",
      organization: "",
      issueDate: "",
      credentialLink: "",
    },
  ],

  // 8. Languages (array of objects)
  languages: [
    {
      name: "",
      proficiency: "", // Beginner, Intermediate, Fluent, Native
    },
  ],

  // 9. Achievements / Awards (array of objects)
  achievements: [
    {
      title: "",
      description: "",
    },
  ],

  // 10. Volunteer Work / Extracurricular (array of objects)
  volunteerWork: [
    {
      role: "",
      organization: "",
      timePeriod: "",
      description: "",
    },
  ],


});


const downloadPdf = async (e) => {
  e.preventDefault();
  const blob = await pdf(<ResumeDocument resumeData={resumeData} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Resume.pdf";
  link.click();
};


const previewPdf = async () => {
  const blob = await pdf(<ResumeDocument resumeData={resumeData} />).toBlob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank"); // opens in a new tab for preview
};



// The `handleChange` function
const handleChange = (e, index = null, section = null) => {
  const { name, value, type, checked } = e.target;

  if (index !== null) {
    // Updating an item inside an array (like projects

    setResumeData((prev) => {
      const updated = [...prev[section]];
      updated[index] = {
        ...updated[index],
        [name]: type === "checkbox" ? checked : value,
    ...(name === "currentlyWorking" && checked ? 
      {endDate: "" } : {})
};
      return { ...prev, [section]: updated };
    });
  } else if (section) {
    // Updating a field inside an object section 
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  }
};




const addItem = (section) => {
  const newItem = {
    projects: { title: "", description: "", techStack: "", link: "" },
    certifications: { name: "", organization: "", issueDate: "", credentialLink: "" },
    languages: { name: "", proficiency: "" },
    achievements: { title: "", description: "" },
    volunteerWork: { role: "", organization: "", timePeriod: "", description: "" },
  }[section];
  setResumeData((prev) => ({
    ...prev,
    [section]: [...prev[section], newItem],
  }));
};

const removeItem = (section, index) => {
  setResumeData((prev) => ({
    ...prev,
    [section]: prev[section].filter((_, i) => i !== index),
  }));
};


const handleDeleteExperience=(index)=>{

  const updatedExperience = resumeData?.workExperience.filter((elem,idx)=>index!==idx);

  setResumeData((prev)=>({
    ...prev,
    workExperience:updatedExperience
  }))

}

const handleDeleteEducation=(index)=>{

  const updatedExperience = resumeData?.education.filter((elem,idx)=>index!==idx);

  setResumeData((prev)=>({
    ...prev,
    education:updatedExperience
  }))

}


// The `addWorkExperience` function
const addWorkExperience = () => {
  setResumeData(prev => ({
    ...prev,
    workExperience: [
      ...prev.workExperience,
      {
        jobTitle: "",
        companyName: "",
        employmentType: "",
        startDate: "",
        endDate: "",
        location: "",
        responsibilities: "",
        skillsUsed: [],
      },
    ],
  }));
};



const addEducation = () => {
  setResumeData((prev) => ({
    ...prev,
    education: [
      ...prev.education,
      { degree: "", institution: "", location: "", startDate: "", endDate: "", cgpa: "" },
    ],
  }));
};


console.log("FormData is ",resumeData);



  return (
    <div>
  <Navbar />
  
  <section>
  <h2 className="text-3xl font-bold mt-5 text-center text-[#000042]">Resume Builder</h2>


  
<form className="max-w-4xl mx-auto px-6 py-8 bg-white rounded-md shadow-md">

{loading && (
  <div className="flex items-center justify-center gap-2 p-4 text-blue-600 font-medium">
    <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
    Parsing resume, please wait...
  </div>
)}

{source==="resume"?
    <div className="flex flex-col items-center mx-auto mt-3 w-full max-w-md"  onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}>

    <label
      htmlFor="dropzone-file"
      className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <svg
          className="w-8 h-8 mb-4 text-blue-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 
            5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 
            5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p className="mb-2 text-sm text-gray-600 font-semibold">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500">PDF, WORD</p>

        {selectedFile && (
          <p className="my-2 text-sm text-[#000042]">
            <span className="font-semibold">Selected File:</span> {selectedFile.name}
          </p>
        )}
      </div>

      {/* Upload progress bar */}
      {uploading && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-200 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <input
        id="dropzone-file"
        type="file"
        className="hidden"
        onChange={(e)=>handleFileChange(e)}
      />
    </label>
  </div>

:null
}


<hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

  {/* Personal Information */}
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800">Personal Information</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input required name="name" placeholder="Full Name *" value={resumeData?.personalInfo?.name} className="border border-gray-300 rounded px-4 py-2" onChange={(e)=>handleChange(e,null,"personalInfo")} />
      <input required name="email" 
      value={resumeData?.personalInfo?.email} placeholder="Email *" className="border border-gray-300 rounded px-4 py-2" onChange={(e)=>handleChange(e,null,"personalInfo")} />
      <input name="phone" value={resumeData?.personalInfo?.phone} placeholder="Phone" className="border border-gray-300 rounded px-4 py-2" onChange={(e)=>handleChange(e,null,"personalInfo")} />
      <input name="linkedIn" value={resumeData?.personalInfo?.linkedIn} placeholder="LinkedIn Profile" className="border border-gray-300 rounded px-4 py-2" onChange={(e)=>handleChange(e,null,"personalInfo")} />
      <input name="portfolio" value={resumeData?.personalInfo?.portfolio} placeholder="Portfolio URL" className="border border-gray-300 rounded px-4 py-2" onChange={(e)=>handleChange(e,null,"personalInfo")} />
      <input name="location" value={resumeData?.personalInfo?.location} placeholder="Location" className="border border-gray-300 rounded px-4 py-2" onChange={(e)=>handleChange(e,null,"personalInfo")} />
    </div>
  </div>

  {/* Professional Summary */}
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Professional Summary</h3>
    <textarea name="summary" placeholder="Write a brief summary..." value={resumeData?.professionalSummary.summary} rows="4" className="w-full border border-gray-300 rounded px-4 py-2" onChange={(e)=>handleChange(e,null,"professionalSummary")}></textarea>
  </div>


  {/* Work Experience */}
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Work Experience</h3>
    {resumeData?.workExperience.map((exp, index) => (
      <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 border border-gray-200 p-4 rounded-md">
        <input name={`jobTitle`} value={resumeData?.workExperience[index].jobTitle} placeholder="Job Title" className="border border-gray-300 rounded px-4 py-2" onChange={(e)=>handleChange(e,index,"workExperience")} />

        <input name={`companyName`} placeholder="Company Name" className="border border-gray-300 rounded px-4 py-2" value={resumeData?.workExperience[index].companyName} 
        onChange={(e)=>handleChange(e,index,"workExperience")} />


        <input name={`employmentType`} placeholder="Employment Type" className="border border-gray-300 rounded px-4 py-2"  value={resumeData?.workExperience[index].employmentType} 
            onChange={(e)=>handleChange(e,index,"workExperience")}  />

        <input name={`location`} value={resumeData?.workExperience[index].location} placeholder="Location" className="border border-gray-300 rounded px-4 py-2"   onChange={(e)=>handleChange(e,index,"workExperience")} />


        <input name={`startDate`} type="date"
        value={resumeData?.workExperience[index].startDate} 
         placeholder="Start Date" className="border border-gray-300 rounded px-4 py-2"   onChange={(e)=>handleChange(e,index,"workExperience")} />

<input
  name="endDate"
  type="date"
  placeholder="End Date"
  className="border border-gray-300 rounded px-4 py-2"
  value={resumeData?.workExperience[index].endDate}
  disabled={resumeData?.workExperience[index].currentlyWorking}
  onChange={(e) => handleChange(e, index, "workExperience")}
/>


   
<div className="flex items-center gap-2 ml-2">
  <input
    type="checkbox"
    name="currentlyWorking"
    checked={resumeData?.workExperience[index].currentlyWorking}
    onChange={(e) => handleChange(e, index, "workExperience")}
    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
  />
  <label htmlFor="currentlyWorking" className="text-sm text-gray-700">
    Currently Working
  </label>
</div>

        <textarea name={`responsibilities`} 
        value={resumeData?.workExperience[index].responsibilities}
        placeholder="Responsibilities" rows="2"  onChange={(e) => handleChange(e, index, "workExperience")}
        className="col-span-2 border border-gray-300 rounded px-4 py-2" ></textarea>



<div className="flex gap-2">
      <input
        type="text"
        value={usedSkill}
        onChange={(e) => setUsedSkill(e.target.value)}
        placeholder="Add Used skills"
        className="border px-3 py-1 rounded w-full"
      />
      <button
        type="button"
        onClick={() => addUsedSkill(index)}
        className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
      >
        Add
      </button>
    </div>
  <br />
    <div className="flex flex-wrap gap-2 mt-4">
  {resumeData?.workExperience?.[index]?.skillsUsed?.map((skill, i) => (
    <div
      key={i}
      className="flex items-center bg-gray-100 border border-gray-300 rounded px-3 py-1"
    >
      <span className="text-sm text-gray-800 mr-2">{skill}</span>
      <button
        type="button"
        onClick={() => removeUsedSkill(index, i)}
        className="bg-red-500 text-white text-xs px-2 rounded hover:bg-red-600"
      >
        X
      </button>
    </div>
  ))}


          </div>
          <br />

        <button type="button" className="bg-red-500 hover:bg-red-600 w-fit cursor-pointer text-white text-xs font-semibold px-2 py-2 rounded-s-full rounded-e-full shadow-sm"
        onClick={()=>handleDeleteExperience(index)}>

  Remove
</button>
      </div>
    ))}
    <button type="button" className="bg-green-500 text-white px-3 py-1 cursor-pointer rounded text-sm hover:bg-indigo-700 bg-indigo-600" onClick={addWorkExperience}>Add Experience</button>
  </div>



  {resumeData?.education.map((edu, index) => (
  <div key={index} className="mb-6 border border-gray-300 rounded-lg p-6 shadow-sm">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">Education {index + 1}</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="degree"
        placeholder="Degree"
        className="w-full border border-gray-300 rounded px-4 py-2"
        value={edu.degree}
        onChange={(e) => handleChange(e, index, 'education')}
      />

      <input
        type="text"
        name="institution"
        placeholder="Institution"
        className="w-full border border-gray-300 rounded px-4 py-2"
        value={edu.institution}
        onChange={(e) => handleChange(e, index, 'education')}
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        className="w-full border border-gray-300 rounded px-4 py-2"
        value={edu.location}
        onChange={(e) => handleChange(e, index, 'education')}
      />

      <input
        type="text"
        name="cgpa"
        placeholder="CGPA"
        className="w-full border border-gray-300 rounded px-4 py-2"
        value={edu.cgpa}
        onChange={(e) => handleChange(e, index, 'education')}
      />

      <input
        type="date"
        name="startDate"
        placeholder="Start Date"
        className="w-full border border-gray-300 rounded px-4 py-2"
        value={edu.startDate}
        onChange={(e) => handleChange(e, index, 'education')}
      />

      <input
        type="date"
        name="endDate"
        placeholder="End Date"
        className="w-full border border-gray-300 rounded px-4 py-2"
        value={edu.endDate}
        onChange={(e) => handleChange(e, index, 'education')}
      />
    </div>

    <button type="button" className="bg-red-500 hover:bg-red-600 w-fit cursor-pointer text-white text-xs font-semibold px-2 py-2 rounded-s-full rounded-e-full shadow-sm mt-3"
        onClick={()=>handleDeleteEducation(index)}>

  Remove
</button>
  </div>
))}


<button type="button" className="hover:bg-indigo-700 bg-indigo-600 text-white px-3 py-1 cursor-pointer rounded text-sm" onClick={addEducation}>Add Education</button>

<div className="max-w-4xl mx-auto bg-white border border-gray-300 rounded-xl shadow-md p-6 mb-10 mt-5">
  <h2 className="text-xl font-semibold mb-6 ">Skills</h2>

  {/* Technical Skills */}
  <div className="mb-6">
    <label className="block font-medium mb-2">Technical Skills</label>
    <div className="flex gap-2">
      <input
        type="text"
        value={newTechnicalSkill}
        onChange={(e) => setNewTechnicalSkill(e.target.value)}
        placeholder="Add technical skill"
        className="border px-3 py-1 rounded w-full"
      />
      <button
        type="button"
        onClick={() => addSkill("technical")}
        className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
      >
        Add
      </button>
    </div>

    <div className="flex flex-wrap gap-2 mt-4">
      {resumeData?.skills.technical.map((skill, index) => (
        <div
          key={index}
          className="flex items-center bg-gray-100 border border-gray-300 rounded px-3 py-1"
        >
          <span className="text-sm text-gray-800 mr-2">{skill}</span>
          <button
            type="button"
            onClick={() => removeSkill("technical", index)}
            className="bg-red-500 text-white text-xs px-2 rounded hover:bg-red-600"
          >
            X
          </button>
        </div>
      ))}
    </div>
  </div>

  {/* Soft Skills */}
  <div className="mb-2">
    <label className="block font-medium mb-2">Soft Skills</label>
    <div className="flex gap-2">
      <input
        type="text"
        value={newSoftSkill}
        onChange={(e) => setNewSoftSkill(e.target.value)}
        placeholder="Add soft skill"
        className="border px-3 py-1 rounded w-full"
      />
      <button
        type="button"
        onClick={() => addSkill("soft")}
        className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
      >
        Add
      </button>
    </div>

    <div className="flex flex-wrap gap-2 mt-4">
      {resumeData?.skills.soft.map((skill, index) => (
        <div
          key={index}
          className="flex items-center bg-gray-100 border border-gray-300 rounded px-3 py-1"
        >
          <span className="text-sm text-gray-800 mr-2">{skill}</span>
          <button
            type="button"
            onClick={() => removeSkill("soft", index)}
            className="bg-red-500 text-white text-xs px-2 rounded hover:bg-red-600"
          >
            X
          </button>
        </div>
      ))}
    </div>
  </div>
</div>


{/* Projects Section */}
<div className="max-w-4xl mx-auto border border-gray-300 rounded-lg p-6 mb-10 shadow-sm bg-white">
  <h2 className="text-xl font-semibold mb-4">Projects</h2>
  {resumeData?.projects.map((project, index) => (
    <div key={index} className="mb-4 border border-gray-300 p-4 rounded">
      <input type="text" placeholder="Title" value={project.title} onChange={(e) => handleChange(e, index, 'projects')} name="title" className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <textarea placeholder="Description" value={project.description} onChange={(e) => handleChange(e, index, 'projects')} name="description" className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <input type="text" placeholder="Tech Stack" value={project.techStack} onChange={(e) => handleChange(e, index, 'projects')} name="techStack" className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <input type="text" placeholder="Link" value={project.link} onChange={(e) => handleChange(e, index, 'projects')} name="link" className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <button type="button" onClick={() => removeItem("projects", index)} className="bg-red-500 text-white px-3 py-1 text-sm rounded">Remove</button>
    </div>
  ))}
  <button type="button" onClick={() => addItem("projects")} className="hover:bg-indigo-700 bg-indigo-600 text-white px-3 py-1 cursor-pointer rounded text-sm">Add Project</button>
</div>

{/* Certifications Section */}
<div className="max-w-4xl mx-auto border border-gray-300 rounded-lg p-6 mb-10 shadow-sm bg-white">
  <h2 className="text-xl font-semibold mb-4">Certifications & Licenses</h2>
  {resumeData?.certifications.map((cert, index) => (
    <div key={index} className="mb-4 border border-gray-300 p-4 rounded">
      <input type="text" placeholder="Certificate Name" name="name" value={cert.name} onChange={(e) => handleChange(e, index, 'certifications')} className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <input type="text" placeholder="Organization" name="organization" value={cert.organization} onChange={(e) => handleChange(e, index, 'certifications')} className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <input type="date" placeholder="Issue Date" name="issueDate" value={cert.issueDate} onChange={(e) => handleChange(e, index, 'certifications')} className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <input type="text" placeholder="Credential Link" name="credentialLink" value={cert.credentialLink} onChange={(e) => handleChange(e, index, 'certifications')} className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <button type="button" onClick={() => removeItem("certifications", index)} className="bg-red-500 text-white px-3 py-1 text-sm rounded">Remove</button>
    </div>
  ))}
  <button type="button" onClick={() => addItem("certifications")} className="hover:bg-indigo-700 bg-indigo-600 text-white px-3 py-1 cursor-pointer rounded text-sm">Add Certification</button>
</div>

{/* Languages Section */}
<div className="max-w-4xl mx-auto border border-gray-300 rounded-lg p-6 mb-10 shadow-sm bg-white">
  <h2 className="text-xl font-semibold mb-4">Languages</h2>
  {resumeData?.languages.map((lang, index) => (
    <div key={index} className="mb-4 border border-gray-300 p-4 rounded">
      <input type="text" placeholder="Language" name="name" value={lang.name} onChange={(e) => handleChange(e, index, 'languages')} className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <select name="proficiency" value={lang.proficiency} onChange={(e) => handleChange(e, index, 'languages')} className="w-full border border-gray-300  px-3 py-2 rounded mb-2">
        <option value="">Select Proficiency</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Fluent">Fluent</option>
        <option value="Native">Native</option>
      </select>
      <button type="button" onClick={() => removeItem("languages", index)} className="bg-red-500 text-white px-3 py-1 text-sm rounded">Remove</button>
    </div>
  ))}
  <button type="button" onClick={() => addItem("languages")} className="hover:bg-indigo-700 bg-indigo-600 text-white px-3 py-1 cursor-pointer rounded text-sm">Add Language</button>
</div>

{/* Achievements Section */}
<div className="max-w-4xl mx-auto border border-gray-300 rounded-lg p-6 mb-10 shadow-sm bg-white">
  <h2 className="text-xl font-semibold mb-4">Achievements / Awards</h2>
  {resumeData?.achievements.map((achieve, index) => (
    <div key={index} className="mb-4 border border-gray-300 p-4 rounded">
      <input type="text" placeholder="Title" name="title" value={achieve.title} onChange={(e) => handleChange(e, index, 'achievements')} className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <textarea placeholder="Description" name="description" value={achieve.description} onChange={(e) => handleChange(e, index, 'achievements')} className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <button type="button" onClick={() => removeItem("achievements", index)} className="bg-red-500 text-white px-3 py-1 text-sm rounded">Remove</button>
    </div>
  ))}
  <button type="button" onClick={() => addItem("achievements")} className="hover:bg-indigo-700 bg-indigo-600 text-white px-3 py-1 cursor-pointer rounded text-sm">Add Achievement</button>
</div>


{/* Volunteer Work Section */}
<div className="max-w-4xl mx-auto border border-gray-300 rounded-lg p-6 mb-10 shadow-sm bg-white">
  <h2 className="text-xl font-semibold mb-4">Volunteer Work / Extracurricular</h2>
  {resumeData?.volunteerWork.map((item, index) => (
    <div key={index} className="mb-4 border border-gray-300 p-4 rounded">
      <input type="text" placeholder="Role" name="role" value={item.role} onChange={(e) => handleChange(e, index, 'volunteerWork')} className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <input type="text" placeholder="Organization" name="organization" value={item.organization} onChange={(e) => handleChange(e, index, 'volunteerWork')} className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <input type="text" placeholder="Time Period" name="timePeriod" value={item.timePeriod} onChange={(e) => handleChange(e, index, 'volunteerWork')} className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <textarea placeholder="Description" name="description" value={item.description} onChange={(e) => handleChange(e, index, 'volunteerWork')} className="w-full border border-gray-300  px-3 py-2 rounded mb-2" />
      <button type="button" onClick={() => removeItem("volunteerWork", index)} className="bg-red-500 text-white px-3 py-1 text-sm rounded">Remove</button>
    </div>
  ))}
  <button type="button" onClick={() => addItem("volunteerWork")} className="hover:bg-indigo-700 bg-indigo-600 text-white px-3 py-1 cursor-pointer rounded text-sm">Add Volunteer Work</button>
</div>

<div className='flex flex-row gap-x-5 justify-center'>
  
<div className="text-center ">
  <button
    type="submit"
    className="bg-gray-500 hover:bg-gray-600 w-fit cursor-pointer text-white font-semibold py-2 px-6 rounded flex items-center gap-1 mx-auto"
    onClick={previewPdf} >
    <FaEye  className="text-lg" />
    <span>Preview</span>
  </button>
</div>

<div className="text-center ">
  <button
  onClick={(e)=>downloadPdf(e)}
    type="submit"
    className="bg-indigo-600 hover:bg-indigo-700 w-fit cursor-pointer text-white font-semibold py-2 px-6 rounded flex items-center gap-1 mx-auto"
  >
    <IoMdDownload className="text-lg" />
    <span>Download</span>
  </button>
</div>

</div>

</form>
 </section>


    </div>
  )
  

}
export default ResumeForm