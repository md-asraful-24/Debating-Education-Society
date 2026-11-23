export type Role = 'super_admin' | 'admin' | 'moderator' | 'member';

export type UserStatus = 'active' | 'kicked' | 'banned';

export type PanelRole = 'chairperson' | 'vice_chairperson' | 'panel_member' | 'debater' | 'audience';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  isVerified: boolean;
  status: UserStatus;
  teamId?: string | null; // e.g. 'team-a', 'team-b'
  panelRole?: PanelRole | null;
  avatar?: string;
  createdAt: string;
}

export interface OTPRecord {
  email: string;
  otp: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}

export type Language = 'bn' | 'en';

export interface LocalizedString {
  bn: string;
  en: string;
}

export interface SliderImage {
  id: string;
  url: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  showOverlay: boolean; // admin toggle to show/hide title/overlay text on subsequent slides
  durationSeconds?: number; // auto-sets to 15 seconds (15s)
  order: number;
  isActive: boolean;
}

export interface DebateTeamMember {
  userId: string;
  name: string;
  email: string;
}

export interface DebateJudge {
  userId: string;
  name: string;
  email: string;
  role: 'chairperson' | 'vice_chairperson' | 'panel_member';
}

export interface DebateTeam {
  name: string;
  members: DebateTeamMember[];
}

export interface WinningTeamMember {
  name: string;
  role: string; // e.g. "Prime Minister / প্রধানমন্ত্রী", "Deputy / উপনেতা", "Member / সদস্য"
}

export interface DebateResult {
  winnerTeam: 'teamA' | 'teamB' | 'draw' | string;
  winningTeamName?: string; // custom manual or selected winning team name
  winningMembers?: WinningTeamMember[]; // 3 members with specific roles/positions
  bestDebater?: string;
  scoreA: number;
  scoreB: number;
  publishedAt: string;
  judgeRemarks?: LocalizedString;
}

export interface Debate {
  id: string;
  topic: LocalizedString;
  category?: LocalizedString;
  scheduledAt: string; // ISO string
  durationMinutes: number;
  meetLink: string;
  unlockMinutesBefore: number; // typically 5 to 7 mins
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  teamA: DebateTeam;
  teamB: DebateTeam;
  judges: DebateJudge[];
  result?: DebateResult | null;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  channelId: string; // 'general' or debateId or debateId_teamA or debateId_panel
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: Role;
  panelRole?: PanelRole | null;
  message: string;
  timestamp: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: LocalizedString;
  email?: string;
  phone?: string;
  order: number;
}

export interface DebateResource {
  id: string;
  title: LocalizedString;
  url: string;
  description: LocalizedString;
}

export type ThemeName = 'emerald' | 'crimson' | 'blue' | 'midnight' | 'sunset';

export interface SiteSettings {
  siteName: LocalizedString;
  logoUrl?: string;
  theme: ThemeName;
  officialGmail: string;
  phone: string;
  address: LocalizedString;
  facebookUrl: string;
  aboutContent: LocalizedString;
  termsOfService: LocalizedString;
  conductRules: LocalizedString;
  leadership: LeadershipMember[];
  debateResources: DebateResource[];
}

export interface EducationItem {
  id: string;
  qualification: string;
  group: string;
  institutionName: string;
  gpa: string;
  passingYear: string;
}

export interface CVData {
  photoUrl?: string;
  name: string;
  contactNo: string;
  email: string;
  presentAddress: string;
  permanentAddress: string;
  careerObjective: string;
  personalAttributes: string[];
  education: EducationItem[];
  interestsAndHobbies: string[];
  languageProficiency: string[];
  personalDetails: {
    name: string;
    fathersName: string;
    mothersName: string;
    dateOfBirth: string;
    nationality: string;
    nidNo: string;
    religion: string;
    maritalStatus: string;
    sex: string;
    height: string;
    weight: string;
    bloodGroup: string;
  };
  declarationText: string;
  signatureName: string;
}
