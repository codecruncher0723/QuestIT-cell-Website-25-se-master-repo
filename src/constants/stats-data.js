/**
 * QuestIT Statistics Data Model
 * Centralized data source for Event Access Split & Member Split charts.
 * 
 * Colors:
 * - Tech / BE: Amber (#FBBF24)
 * - Non-Tech / TE: Lilac (#C4B5FD)
 * - Hackathon / SE: Cyan (#22D3EE)
 */

export const EVENT_ACCESS_DATA = {
  years: ["2024-25", "2025-26", "2026-27"],
  labels: {
    "2024-25": "AY 2024 – 2025",
    "2025-26": "AY 2025 – 2026",
    "2026-27": "AY 2026 – 2027",
  },
  colors: {
    Tech: "#FBBF24",
    "Non-Tech": "#C4B5FD",
    Hackathon: "#22D3EE",
  },
  data: {
    "2024-25": [
      { category: "Tech", events: 5, fill: "#FBBF24" },
      { category: "Non-Tech", events: 2, fill: "#C4B5FD" },
      { category: "Hackathon", events: 2, fill: "#22D3EE" },
    ],
    "2025-26": [
      { category: "Tech", events: 4, fill: "#FBBF24" },
      { category: "Non-Tech", events: 2, fill: "#C4B5FD" },
      { category: "Hackathon", events: 1, fill: "#22D3EE" },
    ],
    "2026-27": [
      { category: "Tech", events: 3, fill: "#FBBF24" },
      { category: "Non-Tech", events: 3, fill: "#C4B5FD" },
      { category: "Hackathon", events: 1, fill: "#22D3EE", isUpcoming: true },
    ],
  },
};

export const MEMBER_SPLIT_DATA = {
  years: ["2024-25", "2025-26", "2026-27"],
  labels: {
    "2024-25": "AY 2024 – 2025",
    "2025-26": "AY 2025 – 2026",
    "2026-27": "AY 2026 – 2027",
  },
  colors: {
    SE: "#22D3EE",
    TE: "#C4B5FD",
    BE: "#FBBF24",
  },
  data: {
    "2024-25": [
      { category: "SE", label: "Second Year", designation: "SE", members: 15, fill: "#22D3EE" },
      { category: "TE", label: "Third Year", designation: "TE", members: 10, fill: "#C4B5FD" },
      { category: "BE", label: "Final Year", designation: "BE", members: 10, fill: "#FBBF24" },
    ],
    "2025-26": [
      { category: "SE", label: "Second Year", designation: "SE", members: 17, fill: "#22D3EE" },
      { category: "TE", label: "Third Year", designation: "TE", members: 16, fill: "#C4B5FD" },
      { category: "BE", label: "Final Year", designation: "BE", members: 7, fill: "#FBBF24" },
    ],
    "2026-27": [
      { category: "SE", label: "Second Year", designation: "SE", members: 22, fill: "#22D3EE" },
      { category: "TE", label: "Third Year", designation: "TE", members: 19, fill: "#C4B5FD" },
      { category: "BE", label: "Final Year", designation: "BE", members: 7, fill: "#FBBF24" },
    ],
  },
};
