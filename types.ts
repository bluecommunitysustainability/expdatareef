export enum QuestionType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  FILE = 'file',
  URL = 'url',
  EMAIL = 'email',
  TEL = 'tel',
}

export interface Question {
  id: string;
  section: string;
  text: string;
  type: QuestionType;
  badge?: {
    text: string;
    color: string;
  };
}

export type AnswerValue = string | number | boolean | File | null;

export interface AnswerObject {
  value: AnswerValue;
  source?: string;
  aiGenerated?: boolean;
}

export type Answers = Record<string, AnswerObject>;

export type AppView = 'form' | 'dashboard' | 'map' | 'stakeholder' | 'goals' | 'community';

export interface AiContact {
    name: string;
    description: string;
    website?: string;
}

export type InfoModalData = Metric | BcStrategy | SdgDetailInfo | GstcCriterionDetail;

export interface Metric {
    type: 'metric';
    name: string;
    iconUrl: string;
    relatedQuestions: string;
    questionNumbers: string;
}

export interface BcStrategy {
    type: 'bc';
    name: string;
    description: string;
    iconUrl: string;
}

export interface ApiKeys {
    gemini: string;
    openai: string;
    claude: string;
    mapbox: string;
}

export interface SdgTarget {
  id: string;
  description: string;
}

export interface SdgDetailInfo {
    type?: 'sdg';
    id: number;
    title: string;
    tagline: string;
    description: string;
    imageUrl: string;
    color: string;
    targets: SdgTarget[];
}

export interface Poi {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: 'Attraction' | 'Park' | 'Museum' | 'Beach' | 'Landmark' | 'Shopping' | 'AI Suggestion';
  description: string;
  imageUrl?: string;
  status: 'published' | 'staged';
  isAiGenerated: boolean;
}

export interface Tour {
  id: string;
  name: string;
  description: string;
  type: 'walking' | 'transit';
  poiIds: string[];
  routeGeoJson: any; // GeoJSON geometry object
  status: 'published' | 'staged';
}

export interface GstcCriterionDetail {
    type?: 'gstc';
    id: string;
    section: string;
    sectionTitle: string;
    title: string;
    description: string;
    relatedSdgIds: number[];
}

export type SectionTimestamps = Record<string, string>;

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  apiKeys: ApiKeys;
  role: 'user' | 'admin' | 'Monitor';
  activeModel: 'gemini' | 'openai' | 'claude';
  fontSize: 'sm' | 'md' | 'lg';
  primaryColor?: string;
  customLogo?: string;
  team?: string; // Corresponds to destination name
  editableSections?: string[];
  // from google sheet
  timestamp?: string;
  country?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  title?: string;
  expertise?: string;
}

export interface GoalObject {
    value: number | null;
    targetDate?: string;
    comments?: string;
}

export type Goals = Record<string, GoalObject>;

export interface SdgInfo {
  sdgIds: number[];
  explanation: string;
}

export interface SdgData {
  id: number;
  name: string;
  color: string;
}

// Forum types
export type ForumCategory = 'Question for Team' | 'Resource Share' | 'Ideas Needed' | 'General Discussion';

export interface ForumReaction {
  emoji: string;
  userId: string;
}

export interface ForumComment {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
  reactions: ForumReaction[];
}

export interface ForumPost {
  id: string;
  destination: string;
  authorId: string;
  title: string;
  category: ForumCategory;
  content: string;
  imageUrl?: string;
  timestamp: string;
  comments: ForumComment[];
  reactions: ForumReaction[];
  readBy: string[]; // array of user emails
}

// Conference types
export interface ScheduledEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}
