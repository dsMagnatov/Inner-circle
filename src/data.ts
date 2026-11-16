import { Project, ExpertiseItem, NavigationItem } from "./types";

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "projects", label: "Projects", scrollRatio: 0.25 },
  { id: "expertise", label: "Expertise", scrollRatio: 0.50 },
  { id: "about", label: "About", scrollRatio: 0.95 },
  { id: "contact", label: "Manifesto", scrollRatio: 3.50 },
];

export const PROJECTS_DATA: Project[] = [
  {
    title: "Neuro Flow Engine",
    category: "AI Automation",
    description: "Self-optimizing visual generation pipelines running on edge clusters.",
    tags: ["Gemini 2.5", "Temporal", "Docker"],
  },
  {
    title: "Sentinel Ledger",
    category: "DeFi Infrastructure",
    description: "Autonomous smart-contracts managing multi-chain liquidity vaults.",
    tags: ["Solidity", "Rust", "Arweave"],
  },
  {
    title: "Aura Workspace",
    category: "Spatial Workflows",
    description: "Interactive virtual spaces synchronizing teams with zero manual latency.",
    tags: ["Three.js", "WebRTC", "WebAssembly"],
  },
];

export const EXPERTISE_DATA: ExpertiseItem[] = [
  {
    title: "Workflow Synthesis",
    percentage: 96,
    description: "Orchestrating end-to-end user actions without brittle traditional API requirements.",
  },
  {
    title: "Autonomous Agents",
    percentage: 92,
    description: "Agent systems trained to make secondary optimizations on live database streams.",
  },
  {
    title: "Media Engineering",
    percentage: 88,
    description: "Low-latency content transformation and automated vector formatting pipelines.",
  },
];
