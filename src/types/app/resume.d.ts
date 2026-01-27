export interface Resume {
  personalInfo?: {
    avatar?: string;
    name?: string;
    title?: string;
    age?: string | number;
    location?: string;
    contact?: {
      phone?: string;
      email?: string;
      github?: string;
    };
    education?: {
      school?: string;
      degree?: string;
      period?: string;
    };
  };
  advantages?: string[];
  links?: {
    github?: string;
    csdn?: string;
    blog?: string;
  };
  skills?: string[];
  workExperience?: Array<{
    company?: string;
    period?: string;
    position?: string;
    responsibilities?: string[];
  }>;
  projects?: {
    name?: string;
    period?: string;
    role?: string;
    description: string[];
    techStack?:
      | string
      | {
          frontend?: string;
          backend?: string;
          deployment?: string;
        };
    highlights?: string[];
    links?: Record<string, string>;
    repositories?: { name: string; url: string }[];
    achievements?: string | string[];
    challenges?: string[];
    responsibilities?: string[];
  }[];
  education?: {
    major?: string;
    achievements?: string[];
    school?: string;
    degree?: string;
    period?: string;
  };
}
