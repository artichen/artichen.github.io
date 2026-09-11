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
      "My current research and learning interests include retrieval-augmented generation, AI agents, and quant finance. I enjoy connecting mathematical ideas with practical programming and financial questions.",
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
      keywords: ["RAG", "Fine-tuning", "AI agents"],
    },
    {
      title: "Statistics & mathematical methods",
      description:
        "Probability, statistical inference, and the mathematical foundations of data-driven models.",
      keywords: ["Probability", "Inference", "Numerical methods"],
    },
    {
      title: "Quantitative finance",
      description:
        "Financial modelling, market data, and the connection between risk measurement and investment decisions.",
      keywords: ["Risk modelling", "Financial data", "Quant research"],
    },
  ],
  education: [
    {
      institution: "James Cook University, Singapore",
      qualification: "Bachelor of Commerce · Economics",
      detail:
        "Studies spanning economics, finance, statistics, and programming. Dates and verified academic results to be added.",
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
      title: "Retrieval over financial documents",
      kind: "Example project",
      summary:
        "A possible project connecting document retrieval, language models, and financial analysis.",
      tags: ["Machine learning", "RAG", "Python"],
      details:
        "Suggested evidence for a future project: a public repository, a small evaluation dataset, retrieval-quality measurements, and an explanation of limitations. This entry illustrates the portfolio format; it is not a claim of completed work.",
    },
    {
      id: "risk-analysis",
      title: "Understanding bank interest-rate risk",
      kind: "Example project",
      summary:
        "A possible case study connecting financial statements, interest-rate exposure, and quantitative analysis.",
      tags: ["Finance", "Statistics", "Python"],
      details:
        "Suggested evidence for a future case study: source statements, a reproducible notebook, clearly stated assumptions, and a concise discussion of findings. This entry is a placeholder for verified coursework or independent work.",
    },
  ],
  posts: [
    {
      id: "retrieval-evaluation",
      title: "What would make a financial RAG system useful?",
      category: "Machine learning",
      summary:
        "A starting outline for evaluating retrieval, evidence, and the quality of an answer.",
      paragraphs: [
        "A useful project begins with a specific question and a small set of documents. Before building a complex pipeline, define what a correct answer should contain and which source passages support it.",
        "Separate retrieval evaluation from answer evaluation. A fluent answer can still cite the wrong evidence. A project write-up should describe the dataset, evaluation criteria, failure cases, and next steps.",
        "This is a sample note for the website framework, not a published research result.",
      ],
    },
    {
      id: "risk-assumptions",
      title: "Start a risk model with its assumptions",
      category: "Finance & statistics",
      summary:
        "An outline for moving from a financial question to a mathematical model.",
      paragraphs: [
        "First identify the quantity to model, the observation period, and the available data. Distinguish assumptions from quantities estimated using observations.",
        "A clear write-up connects the financial question to the model, explains the meaning of the output, and identifies situations in which the assumptions may fail.",
        "This is a sample note for the website framework, not investment advice or a published research result.",
      ],
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
    path: "files/yuhan-chen-cv-sample.pdf",
    filename: "Yuhan-Chen-CV-Sample.pdf",
    isSample: true,
  },
};

// 保留 Promise 接口展示 loading/error 状态；不调用外部 API，也不制造延迟。
export async function loadSiteData(): Promise<SiteData> {
  return siteData;
}
