export const COURSES_DATA = [
    {
      id: 1,
      title: "Ordinary Level ICT",
      description: "Complete O/L ICT syllabus coverage.",
      thumbnail: process.env.PUBLIC_URL + '/art/Namal_ict.png',
      price: "LKR 12,000",
      lessons: [
        { 
          id: 101, 
          title: "Introduction to ICT (Free Demo)", 
          isLocked: false, 
          videoId: "O6P86uwfdR0",
          duration: "10:00",
          resources: [
            { label: "Download Syllabus", url: "https://example.com/syllabus.pdf" }
          ] 
        },
        { 
          id: 102, 
          title: "Computer Systems - Hardware", 
          isLocked: true, 
          videoId: "dGcsHMXbSOA", 
          duration: "15:00",
          resources: []
        },
        { 
          id: 103, 
          title: "Computer Systems - Software", 
          isLocked: true, 
          videoId: "Ke90Tje7VS0", 
          duration: "12:00",
          resources: []
        },
        { 
          id: 104, 
          title: "Number Systems - Binary", 
          isLocked: true, 
          videoId: "O6P86uwfdR0", 
          duration: "20:00",
          resources: []
        },
        { 
          id: 105, 
          title: "Number Systems - Conversions", 
          isLocked: true, 
          videoId: "dQw4w9WgXcQ", 
          duration: "18:00",
          resources: []
        }
      ]
    },
    {
      id: 2,
      title: "Ordinary Level ICT (Group Class)",
      description: "Group Class for O/L Students.",
      thumbnail: process.env.PUBLIC_URL + '/course/class1.jpg',
      price: "LKR 15,000",
      lessons: [
        { id: 201, title: "Introduction Lesson", isLocked: false, videoId: "O6P86uwfdR0", duration: "10:00", resources: [] },
        { id: 202, title: "Hardware Basics", isLocked: true, videoId: "dGcsHMXbSOA", duration: "15:00", resources: [] },
        { id: 203, title: "Hardware Basics", isLocked: true, videoId: "dGcsHMXbSOA", duration: "15:00", resources: [] },
        { id: 204, title: "Hardware Basics", isLocked: true, videoId: "dGcsHMXbSOA", duration: "15:00", resources: [] },
        { id: 205, title: "Hardware Basics", isLocked: true, videoId: "dGcsHMXbSOA", duration: "15:00", resources: [] }


      ]
    },
    {
      id: 3,
      title: "Ordinary Level ICT - Number Systems",
      description: "Master number systems.",
      thumbnail: process.env.PUBLIC_URL + '/art/Namal_ict.png',
      price: "LKR 4,500",
      lessons: [
        { id: 301, title: "Binary Numbers", isLocked: false, videoId: "O6P86uwfdR0", duration: "08:00", resources: [] }
      ]
    },
    {
      id: 4,
      title: "UI/UX Design for Beginners",
      description: "Master Figma.",
      thumbnail: process.env.PUBLIC_URL + '/art/2027 al 2.png',
      price: "LKR 3,500",
      lessons: [
        { id: 401, title: "What is UX?", isLocked: false, videoId: "c9Wg6Cb_YlU", duration: "05:00", resources: [] }
      ]
    },
    {
      id: 5,
      title: "Ordinary Level ICT - Operating Systems",
      description: "Comprehensive guide to Operating Systems.",
      thumbnail: process.env.PUBLIC_URL + '/art/Namal_ict.png',
      price: "LKR 4,500",
      lessons: [
        { id: 501, title: "Intro to OS", isLocked: false, videoId: "VIDEO_ID_HERE", duration: "09:00", resources: [] }
      ]
    },
    {
      id: 6,
      title: "Ordinary Level ICT - Number Systems (Extra)",
      description: "Advanced number systems.",
      thumbnail: process.env.PUBLIC_URL + '/art/2027 al 2.png',
      price: "LKR 3,500",
      lessons: [
        { id: 601, title: "Intro to Numbers", isLocked: false, videoId: "VIDEO_ID_HERE", duration: "08:00", resources: [] }
      ]
    }
  ];