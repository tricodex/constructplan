/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { Card } from "./card";
import * as d3 from "d3";

interface TimelinePhase {
  name: string;
  start_date: string;
  end_date: string;
  completion_percentage: number;
}

export interface TimelineChartProps {
  data: TimelinePhase[];
}


export const TimelineChart = ({ data }: TimelineChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 100 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = data.length * 50;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const timeExtent = d3.extent([
      ...data.map(d => new Date(d.start_date)),
      ...data.map(d => new Date(d.end_date)),
    ]) as [Date, Date];

    const xScale = d3.scaleTime()
      .domain(timeExtent)
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, height])
      .padding(0.2);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

    // Add bars
    const bars = svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar");

    // Background bars
    bars.append("rect")
      .attr("x", (d: { start_date: string | number | Date; }) => xScale(new Date(d.start_date)))
      .attr("y", (d: { name: any; }) => yScale(d.name) || 0)
      .attr("width", (d: { end_date: string | number | Date; start_date: string | number | Date; }) => xScale(new Date(d.end_date)) - xScale(new Date(d.start_date)))
      .attr("height", yScale.bandwidth())
      .attr("fill", "#f3f4f6");

    // Progress bars
    bars.append("rect")
      .attr("x", (d: { start_date: string | number | Date; }) => xScale(new Date(d.start_date)))
      .attr("y", (d: { name: any; }) => yScale(d.name) || 0)
      .attr("width", (d: { end_date: string | number | Date; start_date: string | number | Date; completion_percentage: number; }) => (xScale(new Date(d.end_date)) - xScale(new Date(d.start_date))) * (d.completion_percentage / 100))
      .attr("height", yScale.bandwidth())
      .attr("fill", "#3b82f6")
      .attr("opacity", 0.8);

    // Add percentage labels
    bars.append("text")
      .attr("x", (d: { start_date: string | number | Date; }) => xScale(new Date(d.start_date)) + 5)
      .attr("y", (d: { name: any; }) => (yScale(d.name) || 0) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text((d: { completion_percentage: any; }) => `${d.completion_percentage}%`)
      .attr("fill", "white")
      .attr("font-size", "12px");
  }, [data]);

  return (
    <Card className="p-4">
      <svg ref={svgRef} className="w-full" />
    </Card>
  );
};
