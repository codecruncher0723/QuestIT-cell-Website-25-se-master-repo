"use client";

import React, { useState, useMemo } from "react";
import { EVENT_ACCESS_DATA } from "@/constants/stats-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Calendar, Layers, Clock, Info } from "lucide-react";

/**
 * Custom Tooltip for Event Access Split Chart
 */
const CustomTooltip = ({ active, payload, activeYear }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const yearLabel = EVENT_ACCESS_DATA.labels[activeYear] || activeYear;

    return (
      <div className="bg-neutral-950/95 border border-neutral-800 rounded-xl p-3.5 shadow-2xl backdrop-blur-xl min-w-[180px] text-xs transition-all duration-200">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80">
          <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: data.fill }}
            />
            {data.category}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">
            {yearLabel}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Events Count:</span>
            <span className="font-bold text-neutral-100 font-mono text-sm">
              {data.events} {data.events === 1 ? "event" : "events"}
            </span>
          </div>

          {data.isUpcoming ? (
            <div className="mt-2 pt-1.5 border-t border-neutral-800/60 flex items-center justify-between text-cyan-300 font-medium text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                1 event — Upcoming
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/40 text-[9px] font-mono font-semibold uppercase">
                2026–27
              </span>
            </div>
          ) : (
            <div className="text-[10px] text-neutral-500 pt-0.5">
              Completed Access Phase
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

/**
 * EventAccessSplit Chart Component
 */
const EventsSplitChart = () => {
  const [activeYear, setActiveYear] = useState("2026-27");
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const currentData = useMemo(() => {
    return EVENT_ACCESS_DATA.data[activeYear] || [];
  }, [activeYear]);

  const totalEvents = useMemo(() => {
    return currentData.reduce((acc, item) => acc + item.events, 0);
  }, [currentData]);

  const activeItemDetails = useMemo(() => {
    if (hoveredCategory) {
      return currentData.find((item) => item.category === hoveredCategory);
    }
    return null;
  }, [hoveredCategory, currentData]);

  // Toggle selection on tap/click for mobile friendliness
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
            <div className="p-1.5 rounded-lg bg-neutral-800/80 border border-neutral-700/50 text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-neutral-100 tracking-tight">
              Event Access Split
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>{EVENT_ACCESS_DATA.labels[activeYear]}</span>
          </p>
        </div>

        {/* Academic Year Selector Pills */}
        <div className="flex items-center gap-1 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800/80 self-stretch sm:self-auto justify-between">
          {EVENT_ACCESS_DATA.years.map((year) => {
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
                    layoutId="activeYearBgEvents"
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
            {totalEvents} Events
          </span>
        </div>

        {/* Indicator Legend Items */}
        <div className="flex items-center gap-3">
          {currentData.map((item) => {
            const isHovered = hoveredCategory === item.category;
            const isDimmed = hoveredCategory && !isHovered;

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
                  {item.events}
                </span>

                {item.isUpcoming && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 ml-0.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    UPCOMING
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 w-full min-h-[250px] pt-2 relative">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={currentData}
            margin={{ top: 25, right: 15, left: -20, bottom: 10 }}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#262626"
              vertical={false}
            />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={({ x, y, payload }) => {
                const item = currentData.find(
                  (d) => d.category === payload.value
                );
                const isUpcoming = item?.isUpcoming;
                const isHovered = hoveredCategory === payload.value;

                return (
                  <g transform={`translate(${x},${y + 12})`}>
                    <text
                      x={0}
                      y={0}
                      dy={0}
                      textAnchor="middle"
                      fill={isHovered ? item?.fill || "#f5f5f5" : "#a3a3a3"}
                      className="text-xs font-semibold transition-colors duration-200"
                    >
                      {payload.value}
                    </text>
                    {isUpcoming && (
                      <text
                        x={0}
                        y={14}
                        textAnchor="middle"
                        fill="#22D3EE"
                        className="text-[9px] font-mono font-semibold uppercase tracking-wider"
                      >
                        (Upcoming)
                      </text>
                    )}
                  </g>
                );
              }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#737373", fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255, 255, 255, 0.03)", radius: 8 }}
              content={<CustomTooltip activeYear={activeYear} />}
            />
            <Bar
              dataKey="events"
              radius={[8, 8, 0, 0]}
              maxBarSize={55}
              animationDuration={800}
            >
              {currentData.map((entry, index) => {
                const isHovered = hoveredCategory === entry.category;
                const isDimmed = hoveredCategory && !isHovered;

                return (
                  <Cell
                    key={`event-bar-cell-${index}`}
                    fill={entry.fill}
                    fillOpacity={isDimmed ? 0.35 : isHovered ? 1 : 0.85}
                    stroke={isHovered ? entry.fill : "transparent"}
                    strokeWidth={isHovered ? 2 : 0}
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
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Dynamic Hover Detail Strip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={hoveredCategory || "default-events"}
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
                  {activeItemDetails.category} Events
                </span>
                {activeItemDetails.isUpcoming && (
                  <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold">
                    UPCOMING
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 font-mono text-neutral-300">
                <span>
                  <strong className="text-neutral-100 font-bold text-sm">
                    {activeItemDetails.events}
                  </strong>{" "}
                  {activeItemDetails.events === 1 ? "event" : "events"}
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400 text-[11px]">
                  {EVENT_ACCESS_DATA.labels[activeYear]}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full text-neutral-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
                <span>Balanced event curation across technical and core domains</span>
              </span>
              {activeYear === "2026-27" && (
                <span className="text-cyan-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Hackathon 2026–27 Scheduled
                </span>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default EventsSplitChart;
