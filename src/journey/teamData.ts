// The team behind VariOne. Names + IDs are from the graduation document's
// official roster (8 members + supervisor). Roles are best-effort from the doc's
// team-structure table (Technical lead + hardware/firmware ×2, Website & Planning,
// Documentation & Review, Marketing, Logistics) - tune any role that's off.
// Avatars use Vemo mascot moods since we don't ship member photos here.

import type { VemoMood } from "./Vemo";

export type Member = { name: string; role: string; mood: VemoMood };

export const SUPERVISOR: Member = {
  name: "Dr. Ahmed Gaber Abuabdallah",
  role: "Project Supervisor",
  mood: "supervisor",
};

export const TEAM: Member[] = [
  { name: "Ahmed Hossam", role: "Hardware & Firmware Lead", mood: "esp" },
  { name: "Amir Azzam", role: "Website & Hardware", mood: "focused" },
  { name: "Youssef Allam", role: "Website & Device Simulator", mood: "phone" },
  { name: "Mariam Hosam", role: "Marketing & Brand", mood: "video" },
  { name: "Mazen Sadek", role: "Logistics & Coordination", mood: "car" },
  { name: "Malak Mohamed", role: "Presentations", mood: "presentation" },
  { name: "Malak Wael", role: "UX/UI", mood: "uipaint" },
  { name: "Mayan Mohamed", role: "Documentation & Review", mood: "documentation" },
];
