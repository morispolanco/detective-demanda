
export interface StrengthAnalysis {
  strength: string;
  problemSolved: string;
  example: string;
}

export interface BuyerPersona {
  name: string;
  role: string;
  demographics: {
    age: string;
    location: string;
  };
  professionalBackground: string;
  goals: string[];
  challenges: string[];
  techStack: string[];
  digitalChannels: string[];
}

export interface ListeningGuide {
  monitoringKeywords: string[];
  surveyTemplate: {
    title: string;
    questions: string[];
  };
  interviewQuestions: string[];
}

export interface PilotOffer {
  offerTitle: string;
  outcome: string;
  pricingModel: string;
}

export interface ScalingStrategy {
  seo: {
    blogPosts: { title: string; keywords: string; }[];
  };
  ads: {
    platform: string;
    audience: string;
    copy: string;
  };
  influencers: {
    profile: string;
    idea: string;
  };
}

export interface AppData {
  strengths: StrengthAnalysis[];
  personas: BuyerPersona[];
  listeningGuides: Record<string, ListeningGuide>;
  pilotOffers: Record<string, PilotOffer[]>;
  scalingStrategies: Record<string, ScalingStrategy>;
}

export type LoadingStep = 'strengths' | 'personas' | 'listening' | 'pilot' | 'scaling' | null;
