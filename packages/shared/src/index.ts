// ============================================================
// Sunroom — Shared Type Definitions
// ============================================================

// ----- Database Row Types -----

export interface Family {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
}

export interface AppUser {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
}

export type FamilyRole = 'admin' | 'member' | 'senior';

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: FamilyRole;
  is_trusted_caller: boolean;
  created_at: string;
}

export type DeviceStatus = 'pending' | 'active' | 'offline';

export interface Device {
  id: string;
  family_id: string;
  device_name: string;
  provision_code: string | null;
  status: DeviceStatus;
  paired_at: string | null;
  created_at: string;
}

export interface DeviceTelemetry {
  id: string;
  device_id: string;
  family_id: string;
  battery_level: number;
  wifi_strength: number;
  status: string;
  last_seen: string;
}

export type CallMode = 'regular' | 'auto_answer';
export type CallStatus = 'ringing' | 'answered' | 'declined' | 'missed' | 'ended';

export interface CallLog {
  id: string;
  family_id: string;
  caller_id: string;
  receiver_device_id: string;
  call_mode: CallMode;
  duration_seconds: number;
  status: CallStatus;
  started_at: string;
}

// ----- API / Edge Function Payloads -----

export interface CreateDailyRoomRequest {
  room_name: string;
  caller_id: string;
  call_mode: CallMode;
}

export interface CreateDailyRoomResponse {
  /** Daily.co meeting token for the participant */
  token: string;
  /** The Daily room URL to join */
  room_url: string;
  /** The room name */
  room_name: string;
}

export interface SendCallNotificationRequest {
  receiver_device_id: string;
  call_mode: CallMode;
  room_name: string;
}

export interface ProvisionDeviceRequest {
  family_id: string;
  device_name?: string;
}

export interface ActivateDeviceRequest {
  provision_code: string;
}

// ----- Quick Reply -----

export interface QuickReply {
  id: string;
  label: string;
  emoji: string;
}

export const DEFAULT_QUICK_REPLIES: QuickReply[] = [
  { id: 'yes', label: 'Yes', emoji: '✅' },
  { id: 'no', label: 'No', emoji: '❌' },
  { id: 'love_you', label: 'Love you', emoji: '❤️' },
  { id: 'call_back', label: 'Call back later', emoji: '📞' },
  { id: 'thank_you', label: 'Thank you', emoji: '🙏' },
];

// ----- Constants -----

export const AUTO_ANSWER_COUNTDOWN_SECONDS = 5;
export const REGULAR_CALL_TIMEOUT_SECONDS = 30;
export const VIDEO_TOKEN_TTL_SECONDS = 600; // 10 minutes
export const TELEMETRY_REPORT_INTERVAL_MS = 300_000; // 5 minutes
