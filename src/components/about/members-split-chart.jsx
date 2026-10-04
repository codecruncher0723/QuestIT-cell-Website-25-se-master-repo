"use client";

import React, { useState, useMemo } from "react";
import { MEMBER_SPLIT_DATA } from "@/constants/stats-data";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, TrendingUp, Sparkles, PieChart as PieIcon } from "lucide-react";

/**
 * Custom Tooltip for Member Split Chart
 */
const CustomTooltip = ({ active, payload, activeYear, totalMembers }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = ((data.members / totalMembers) * 100).toFixed(1);
    const yearLabel = MEMBER_SPLIT_DATA.labels[activeYear] || activeYear;

    return (
      <div className="bg-neutral-950/95 border border-neutral-800 rounded-xl p-3.5 shadow-2xl backdrop-blur-xl min-w-[190px] text-xs transition-all duration-200">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80">
          <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: data.fill }}
            />
            {data.category} ({data.label})
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">
            {yearLabel}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Member Count:</span>
            <span className="font-bold text-neutral-100 font-mono text-sm">
              {data.members} members
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Share of Total:</span>
            <span className="font-bold text-neutral-100 font-mono text-sm">
              {percentage}% of members
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * MembersSplitChart Component
 */
const MembersSplitChart = () => {
  const [activeYear, setActiveYear] = useState("2026-27");
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const currentData = useMemo(() => {
    return MEMBER_SPLIT_DATA.data[activeYear] || [];
  }, [activeYear]);

  const totalMembers = useMemo(() => {
    return currentData.reduce((acc, item) => acc + item.members, 0);
  }, [currentData]);

  // Find active or top hovered item details for dynamic center display
  const activeItemDetails = useMemo(() => {
    if (hoveredCategory) {
      return currentData.find((item) => item.category === hoveredCategory);
    }
    // Default to largest share when nothing hovered
    return [...currentData].sort((a, b) => b.members - a.members)[0];
  }, [hoveredCategory, currentData]);

  const activePercentage = useMemo(() => {
    if (!activeItemDetails || !totalMembers) return "0.0";
    return ((activeItemDetails.members / totalMembers) * 100).toFixed(1);
  }, [activeItemDetails, totalMembers]);

  // Calculate Year-over-Year Growth Badge
  const growthBadge = useMemo(() => {
    if (activeYear === "2025-26") return "+14.3% YoY"; // 35 -> 40
    if (activeYear === "2026-27") return "+20.0% YoY"; // 40 -> 48
    return "Base Year";
  }, [activeYear]);

  // Toggle category on tap for touch devices
  const handleCategoryClick = (category) => {
    setHoveredCategory((prev) => (prev === category ? null : category));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col h-full bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden backdrop-blur-md"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/50 text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-neutral-100 tracking-tight">
              Member Split
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>{MEMBER_SPLIT_DATA.labels[activeYear]}</span>
          </p>
        </div>

        {/* Academic Year Selector Pills */}
        <div className="flex items-center gap-1 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800/80 self-stretch sm:self-auto justify-between">
          {MEMBER_SPLIT_DATA.years.map((year) => {
            const isActive = activeYear === year;
            return (
              <button
                key={year}
                onClick={() => {
                  setActiveYear(year);
                  setHoveredCategory(null);
                }}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 ${
                  isActive
                    ? "text-neutral-950 font-semibold shadow-md"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeYearBgMembers"
                    className="absolute inset-0 bg-neutral-100 rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{year}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 my-4 px-3 py-2 bg-neutral-950/40 rounded-xl border border-neutral-800/40 text-xs">
        <div className="flex items-center gap-2 text-neutral-300 font-medium">
          <span className="text-neutral-500">Total:</span>
          <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-100 font-mono font-bold text-xs border border-neutral-700/50">
            {totalMembers} Members
          </span>
          <span className="px-1.5 py-0.2 rounded-md bg-emerald-950/80 text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/30 flex items-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5 inline" />
            {growthBadge}
          </span>
        </div>

        {/* Interactive Designation Key Pills */}
        <div className="flex items-center gap-3">
          {currentData.map((item) => {
            const isHovered = hoveredCategory === item.category;
            const isDimmed = hoveredCategory && !isHovered;
            const itemPct = ((item.members / totalMembers) * 100).toFixed(0);

            return (
              <button
                key={item.category}
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => handleCategoryClick(item.category)}
                className={`flex items-center gap-1.5 cursor-pointer transition-all duration-300 text-left ${
                  isDimmed ? "opacity-40" : "opacity-100 scale-105"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full transition-transform duration-200"
                  style={{
                    backgroundColor: item.fill,
                    boxShadow: isHovered ? `0 0 8px ${item.fill}` : "none",
                  }}
                />
                <span className="text-[11px] text-neutral-300 font-medium">
                  {item.category}:
                </span>
                <span className="font-mono text-neutral-100 font-bold text-[11px]">
                  {item.members}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  ({itemPct}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart & Distribution Bars Area */}
      <div className="flex-1 w-full min-h-[220px] pt-1 relative flex flex-col items-center justify-center gap-3">
        <ResponsiveContainer width="100%" height={210}>
          <PieChart onMouseLeave={() => setHoveredCategory(null)}>
            <Tooltip
              content={
                <CustomTooltip
                  activeYear={activeYear}
                  totalMembers={totalMembers}
                />
              }
            />
            <Pie
              data={currentData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={88}
              paddingAngle={4}
              cornerRadius={6}
              dataKey="members"
              nameKey="category"
              animationDuration={800}
            >
              {currentData.map((entry, index) => {
                const isHovered = hoveredCategory === entry.category;
                const isDimmed = hoveredCategory && !isHovered;

                return (
                  <Cell
                    key={`member-pie-cell-${index}`}
                    fill={entry.fill}
                    fillOpacity={isDimmed ? 0.35 : isHovered ? 1 : 0.85}
                    stroke={isHovered ? entry.fill : "rgba(0,0,0,0.5)"}
                    strokeWidth={isHovered ? 2 : 1}
                    onMouseEnter={() => setHoveredCategory(entry.category)}
                    onClick={() => handleCategoryClick(entry.category)}
                    style={{
                      transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                      filter: isHovered
                        ? `drop-shadow(0px 0px 14px ${entry.fill})`
                        : "none",
                      cursor: "pointer",
                    }}
                  />
                );
              })}

              {/* Dynamic Center Label */}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <g>
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy - 10}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-neutral-100 font-mono text-3xl font-extrabold tracking-tight"
                        >
                          {hoveredCategory
                            ? activeItemDetails?.members
                            : totalMembers}
                        </text>

                        <text
                          x={viewBox.cx}
                          y={viewBox.cy + 16}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-neutral-400 text-xs font-semibold"
                        >
                          {hoveredCategory
                            ? `${hoveredCategory} (${activeItemDetails?.label})`
                            : "Total Members"}
                        </text>

                        {hoveredCategory && (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy + 32}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-neutral-400 font-mono text-[10px] font-medium"
                          >
                            ({activePercentage}% of members)
                          </text>
                        )}
                      </g>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Interactive Breakdown Progress Bars */}
        <div className="w-full space-y-2 px-1">
          {currentData.map((item) => {
            const isHovered = hoveredCategory === item.category;
            const isDimmed = hoveredCategory && !isHovered;
            const pct = ((item.members / totalMembers) * 100).toFixed(1);

            return (
              <div
                key={item.category}
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => handleCategoryClick(item.category)}
                className={`group cursor-pointer transition-all duration-300 ${
                  isDimmed ? "opacity-40" : "opacity-100"
                }`}
              >
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-neutral-300 group-hover:text-neutral-100 transition-colors">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <strong className="text-neutral-200">{item.category}</strong>
                    <span className="text-neutral-500 text-[11px]">
                      ({item.label})
                    </span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-neutral-100 text-xs">
                      {item.members} members
                    </span>
                    <span className="text-neutral-400 text-[11px] min-w-[42px] text-right font-medium">
                      {pct}%
                    </span>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-neutral-950/80 rounded-full h-1.5 overflow-hidden border border-neutral-800/60 p-[1px]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: item.fill,
                      boxShadow: isHovered ? `0 0 10px ${item.fill}` : "none",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Hover Detail Strip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={hoveredCategory || "default-members"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-3 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60 flex items-center justify-between text-xs"
        >
          {activeItemDetails ? (
            <>
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: activeItemDetails.fill }}
                />
                <span className="font-semibold text-neutral-200">
                  {activeItemDetails.category} — {activeItemDetails.label}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-neutral-300">
                <span>
                  <strong className="text-neutral-100 font-bold text-sm">
                    {activeItemDetails.members}
                  </strong>{" "}
                  members
                </span>
                <span className="text-neutral-600">•</span>
                <span className="font-bold text-neutral-200">
                  {activePercentage}% of members
                </span>
                <span className="text-neutral-500 text-[11px]">
                  ({activeYear})
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full text-neutral-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400/80" />
                <span>Hover or tap designation to view distribution percentage</span>
              </span>
              <span className="text-emerald-400 font-medium font-mono text-[11px]">
                {growthBadge}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default MembersSplitChart;
