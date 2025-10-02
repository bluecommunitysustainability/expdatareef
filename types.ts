// FIX: Removed erroneous circular import of 'Question' type. The type is defined within this file.

// FIX: Removed circular self-import of QuestionType.
// This file was re-created to define all the necessary types for the application.

// FIX: Centralized AppView type to be used across components.
export type AppView = 'form' | 'goals' | 'dashboard' | 'map' | 'community' | 'stakeholder';

// Enum for question types
export enum QuestionType {
  TEXT = 'text',
  EMAIL = 'email',
  TEL = 'tel',
  URL = 'url',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  BOOLEAN = 'boolean',
  FILE = 'file',
}

// Represents a single question in the questionnaire
export interface Question {
  id: string;
  section: string;
  text: string;
  type: QuestionType;
  badge?: { text: string; color: string; };
}

// Possible primitive value types for an answer
export type AnswerValue = string | number | boolean | File | null;

// Represents a complete answer, including its value, source, and origin
export interface AnswerObject {
    value: AnswerValue;
    source?: string;
    aiGenerated?: boolean;
}

// A dictionary of answers, keyed by question ID
export type Answers = Record<string, AnswerObject>;

// A dictionary of section timestamps, keyed by section name
export type SectionTimestamps = Record<string, string>;

// AI-suggested contact
export interface AiContact {
    name: string;
    description: string;
    website?: string;
}

// Data from CSV files for the Info Hub

// A metric for display in the info hub
export interface Metric {
    type: 'metric';
    name: string;
    iconUrl: string;
    relatedQuestions: string;
}

// Represents a specific target for a Sustainable Development Goal
export interface SdgTarget {
    id: string;
    description: string;
}

// A UN Sustainable Development Goal for display in the info hub
export interface SdgDetailInfo {
    id: number;
    title: string;
    tagline: string;
    description: string;
    imageUrl: string;
    color: string;
    targets: SdgTarget[];
}


// A Blue Community strategy for display in the info hub
export interface BcStrategy {
    type: 'bc';
    name: string;
    iconUrl: string;
    description: string;
}

// A GSTC criterion for display in the info hub
export interface GstcCriterionDetail {
  id: string;
  section: 'A' | 'B' | 'C' | 'D';
  sectionTitle: string;
  title: string;
  description: string;
  relatedSdgIds: number[];
}


// Union type for items that can be displayed in the info modal
export type InfoModalData = Metric | BcStrategy;


// SDG data for dashboard visualization
export interface SdgData {
    id: number;
    name: string;
    color: string;
}

// SDG mapping information for a question
export interface SdgInfo {
    sdgIds: number[];
    explanation: string;
}

// AI Settings types
export interface ApiKeys {
    gemini: string;
    openai: string;
    claude: string;
    mapbox: string;
}

// User Profile
export interface UserProfile {
  id: string; // email
  name: string;
  email: string;
  avatar?: string; // base64 data url
  apiKeys: ApiKeys;
  role: 'admin' | 'user' | 'Monitor';
  team?: string;
  allowedDestinations?: string[];
  customLogo?: string; // base64 data url for logo
  primaryColor?: string; // e.g., 'teal', 'blue'
  // FIX: Added activeModel to persist the user's AI model choice from settings.
  activeModel?: string;
  editableSections?: string[];
  fontSize?: 'sm' | 'md' | 'lg';

  // New fields from sheet
  timestamp?: string;
  country?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  title?: string;
  expertise?: string;
}

// Goals
export interface GoalObject {
    value: number | null;
    targetDate?: string;
    comments?: string;
}
export type Goals = Record<string, GoalObject>;


// Map-related types
export interface Poi {
    id: string; // Unique identifier
    name: string;
    latitude: number;
    longitude: number;
    category: 'Attraction' | 'Park' | 'Museum' | 'Beach' | 'Landmark' | 'Shopping' | 'AI Suggestion';
    description: string;
    imageUrl?: string;
    status: 'staged' | 'published';
    isAiGenerated: boolean;
}

export interface Tour {
    id: string;
    name: string;
    description: string;
    type: 'walking' | 'transit';
    poiIds: string[];
    routeGeoJson: any; // GeoJSON LineString geometry
    status: 'staged' | 'published';
}
