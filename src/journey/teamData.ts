// The team behind VariOne. Names + IDs are from the graduation document's
// official roster (8 members + supervisor). Roles are best-effort from the doc's
// team-structure table (Technical lead + hardware/firmware ×2, Website & Planning,
// Documentation & Review, Marketing, Logistics) — tune any role that's off.
// Avatars use Vemo mascot moods since we don't ship member photos here.

import type { VemoMood } from "./Vemo";

export type Member = { name: string; role: string; mood: VemoMood };

export const SUPERVISOR: Member = {
  name: "Dr. Ahmed Gaber Abuabdallah",
  role: "Project Supervisor",
  mood: "happy",
};

export const TEAM: Member[] = [
  { name: "Ahmed Hossam", role: "Hardware & Firmware Lead", mood: "focused" },
  { name: "Amir Azzam", role: "Website & Planning", mood: "thinking" },
  { name: "Youssef Allam", role: "Website & Device Simulator", mood: "excited" },
  { name: "Mariam Hosam", role: "Documentation & Review", mood: "curious" },
  { name: "Mazen Sadek", role: "Firmware & Hardware", mood: "surprised" },
  { name: "Malak Mohamed", role: "Marketing & Brand", mood: "celebrating" },
  { name: "Malak Wael", role: "Marketing & Promotion", mood: "happy" },
  { name: "Mayan Mohamed", role: "Logistics & Coordination", mood: "curious" },
];
