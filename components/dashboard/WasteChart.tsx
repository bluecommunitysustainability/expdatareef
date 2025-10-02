import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import type { Answers } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { availableThemes } from '../../constants/teamColors';

interface WasteSankeyChartProps {
  answers: Answers;
}

export const WasteSankeyChart: React.FC<WasteSankeyChartProps> = ({ answers }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useTheme();

  const themeColorHex = useMemo(() => {
    return availableThemes.find(t => t.value === theme.name)?.hex || '#14b8a6';
  }, [theme.name]);

  const data = useMemo(() => {
    const produced = (answers['q73a']?.value as number) || 0;
    const recycled = (answers['q74a']?.value as number) || 0;
    const landfill = (answers['q75a']?.value as number) || 0;
    
    if (produced === 0 && recycled === 0 && landfill === 0) return null;
    
    const unaccounted = Math.max(0, produced - (recycled + landfill));

    const nodes = [
      { name: "Produced" },
      { name: "Recycled" },
      { name: "Landfill" },
    ];

    const links = [
      { source: 0, target: 1, value: recycled },
      { source: 0, target: 2, value: landfill },
    ];
    
    if(unaccounted > 0) {
        nodes.push({ name: "Unaccounted" });
        links.push({ source: 0, target: 3, value: unaccounted });
    }

    return { nodes, links };
  }, [answers]);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { width, height } = svg.node()!.getBoundingClientRect();
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    
    const sankeyLayout = sankey()
      .nodeWidth(15)
      .nodePadding(20)
      .extent([[1, 1], [chartWidth - 1, chartHeight - 5]]);

    const { nodes, links } = sankeyLayout(data);

    // Links
    g.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
      .selectAll("g")
      .data(links)
      .join("g")
      .style("mix-blend-mode", "multiply")
      .append("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke", d => d.target.index === 1 ? themeColorHex : d.target.index === 2 ? "#a0aec0" : "#f56565")
        .attr("stroke-width", d => Math.max(1, d.width!));

    // Nodes
    const node = g.append("g")
      .selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    node.append("rect")
      .attr("height", d => d.y1! - d.y0!)
      .attr("width", sankeyLayout.nodeWidth())
      .style("fill", d => d.index === 1 ? themeColorHex : (d.index === 0 ? "#718096" : "#a0aec0"))
      .style("stroke", "#000");

    // Node labels
    g.append("g")
      .style("font", "10px sans-serif")
      .selectAll("text")
      .data(nodes)
      .join("text")
        .attr("x", d => d.x0! < chartWidth / 2 ? d.x1! + 6 : d.x0! - 6)
        .attr("y", d => (d.y1! + d.y0!) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0! < chartWidth / 2 ? "start" : "end")
        .attr("fill", "#e2e8f0")
        .text(d => d.name)
      .append("tspan")
        .attr("fill-opacity", 0.7)
        .text(d => ` ${d.value?.toLocaleString()} t`);

  }, [data, themeColorHex]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-800/25 rounded-lg">
        <p className="text-gray-400">Not enough data for Waste Flow chart.</p>
      </div>
    );
  }

  return <svg ref={svgRef} style={{ width: '100%', height: 300 }} />;
};