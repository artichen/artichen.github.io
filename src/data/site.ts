export type Page = "home" | "cv" | "blog" | "miscellany";
export type Interest = {
  title: string;
  description: string;
  keywords: string[];
};
export type Project = {
  id: string;
  title: string;
  kind?: string;
  summary?: string;
  tags?: string[];
  details?: string;
  url?: string;
  report?: string;
};
export type Post = {
  id: string;
  title?: string;
  category?: string;
  summary?: string;
  paragraphs?: string[];
};
export type SiteData = {
  profile: {
    name: string;
    initials: string;
    role?: string;
    institution?: string;
    location?: string;
    bio: string[];
    photo?: string;
    photoAlt?: string;
    github?: string;
    linkedin?: string;
    email?: string;
  };
  interests: Interest[];
  education: { institution: string; qualification?: string; detail?: string }[];
  skills: { label: string; items: string[] }[];
  projects: Project[];
  posts: Post[];
 miscellany: {
  title: string;
  description: string;
  images?: {
    src: string;
    alt: string;
    caption?: string;
  }[];
}[];
  cv: { path?: string; filename: string; isSample: boolean };
  isDraft: boolean;
};

// 所有内容均为本地 mock 数据。这里是日后修改个人资料的唯一入口。
// 不填未知账号、毕业时间、论文数量或成绩，避免把占位内容当作真实资历。
export const siteData: SiteData = {
  isDraft: true,
  profile: {
    name: "Yuhan Chen",
    initials: "YC",
    role: "Commerce student · Finance",
    institution: "James Cook University, Singapore",
    location: "Singapore",
    bio: [
      "I am a commerce student with a background in mathematics and astronomy, interested in the intersection aera of machine learning, statistics, and finance.",
      "My current research and learning interests include fine-tuning of Large Language Models, AI agents, and quantitative finance. I enjoy connecting mathematical ideas with practical programming and financial questions.",
    ],
    // 将照片放入 public/images/portrait.jpg 后，填写 images/portrait.jpg。
    photo: "images/portrait.jpg",
    photoAlt: "Portrait of Yuhan Chen",
    // 填写真实完整链接后，首页与页脚会同步显示可点击的账号链接。
    github: "https://github.com/artichen",
    linkedin: "https://www.linkedin.com/in/yuhan-chen-bbb7173b0/",
    email: "",
  },
  interests: [
    {
      title: "Machine learning & AI systems",
      description:
        "Retrieval-augmented generation, model adaptation, and reliable agent workflows.",
      keywords: [ "Fine-tuning", "AI agents"],
    },
    {
      title: "Statistics & mathematical methods",
      description:
        "Probability, statistical inference, and the mathematical foundations of data-driven models.",
      keywords: [ "Inference", "Numerical methods"],
    },
    
      
    
  ],
  education: [
    {
      institution: "James Cook University, Singapore",
      qualification: "Bachelor of Commerce · Banking and Finance",
      
        
    },
  ],
  skills: [
    { label: "Programming", items: ["Python", "C / C++", "SQL"] },
    {
      label: "Data & modelling",
      items: ["NumPy", "Pandas", "TensorFlow / Keras"],
    },
    
  ],
  // 示例条目只演示展示结构；请用可验证的项目替换后再正式公开。
  projects: [
    {
      id: "financial-rag",
      title: " Hydrodynamics Simulation: Shock Tubes and Blast Waves",
      kind: "course project",
      summary:
          "Python-based simulations of one-dimensional fluid dynamics, exploring shock propagation through Sod shock-tube and blast-wave problems.",
    tags: [
      "Scientific computing",
        "Numerical methods",
          "Hydrodynamics",
    
        
  ],
  url:"https://github.com/artichen/astrodynamics",
  details:
    "An undergraduate computational physics project exploring numerical methods for one-dimensional hydrodynamics. The notebook contains implementations for Sod shock-tube and blast-wave problems . The project connects physical modelling with numerical implementation and highlights the importance of stability, boundary conditions, and realistic solutions in physics science. The original coursework is still being revisited to address implementation issues and improve reproducibility and validation.",
  
},
    {
  id: "astroparticlephysics",
  title: "Astroparticle Physics",
  kind: "Course project",
  summary: "Project report and source code.",
  details: "Report and code for my astroparticle physics project.",
  report: "files/astroparticle_project.pdf",
  url: "https://github.com/artichen/Astroparticle-Project-AMS-02-model-fitting",
},
  ],
  
    posts: [
  {
    id: "llm-temperature",
    title: "LLM temperature：from statistical physics to AI",
    summary: "still under construction",
  },
],
  
miscellany: [
  {
    title: " Chinese Cuisine",
    description:
      "",
    
    images: [
      {
        src: "images/miscellany/lognormal-notes.jpg",
        alt:  "A dish made by me",
        caption:"     Chinese Braised Beef Brisket     ",
          
      },
      {
        src: "images/miscellany/food-02.png",
        alt: "A homemade dish prepared during my studies.",
        caption: "Salt-Baked Prawns",
      },
    ],
  },
  {
    title: "Photos taken during my studies",
    description:
      "",
    images: [
      {
        src: "images/miscellany/street-01.jpg",
        alt:  "On the street in Singapore",
        caption:" A corner on the Street ",
          
      },
      {
        src: "images/miscellany/me-01.jpg",
        alt: "A photo of me in front of CBD inSingapore",
        caption: "A photo of me in front of CBD in Singapore",
      },]
  },
  
],

  cv: {
    path: "files/yuhan-chen-cv.pdf",
    filename: "Yuhan-Chen-CV.pdf",
    isSample: false,
  },
};

// 保留 Promise 接口展示 loading/error 状态；不调用外部 API，也不制造延迟。
export async function loadSiteData(): Promise<SiteData> {
  return siteData;
}
