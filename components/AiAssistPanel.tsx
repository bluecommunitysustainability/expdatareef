import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import type { UserProfile } from '../types';

interface ForceDirectedGraphProps {
    users: UserProfile[];
}

export const ForceDirectedGraph: React.FC<ForceDirectedGraphProps> = ({ users }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    const graphData = useMemo(() => {
        const nodes = users.map(user => ({
            id: user.email,
            name: user.name,
            role: user.role,
        }));

        const links: { source: string; target: string; value: number, sections: string[] }[] = [];
        for (let i = 0; i < users.length; i++) {
            for (let j = i + 1; j < users.length; j++) {
                const userA = users[i];
                const userB = users[j];
                
                // If either user can edit all sections, they are connected.
                const sectionsA = userA.editableSections;
                const sectionsB = userB.editableSections;

                let commonSections: string[] = [];
                if (!sectionsA || !sectionsB) {
                    // One has full access, consider them connected but maybe with a special link type or smaller value
                    commonSections = []; // For now, let's not link them if one has full access to avoid clutter, unless we have a specific design for it.
                } else {
                    const setA = new Set(sectionsA);
                    commonSections = sectionsB.filter(section => setA.has(section));
                }
                
                if (commonSections.length > 0) {
                    links.push({
                        source: userA.email,
                        target: userB.email,
                        value: commonSections.length,
                        sections: commonSections
                    });
                }
            }
        }
        return { nodes, links };
    }, [users]);


    useEffect(() => {
        if (!svgRef.current || graphData.nodes.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const { width, height } = svg.node()!.getBoundingClientRect();

        const simulation = d3.forceSimulation(graphData.nodes as any)
            .force("link", d3.forceLink(graphData.links).id((d: any) => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(graphData.links)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value));

        const node = svg.append("g")
            .selectAll("g")
            .data(graphData.nodes)
            .join("g")
            .call(drag(simulation) as any);

        node.append("circle")
            .attr("r", 15)
            .attr("fill", d => d.role === 'admin' ? '#ef4444' : '#f59e0b')
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5);
            
        node.append("text")
            .text(d => d.name)
            .attr("x", 18)
            .attr("y", 5)
            .style("fill", "#e2e8f0")
            .style("font-size", "12px");

        node.append("title")
            .text(d => `${d.name} (${d.role})`);
            
        link.append("title")
            .text(d => `Shared sections: ${d.sections.join(', ')}`);

        simulation.on("tick", () => {
            link
                .attr("x1", d => (d.source as any).x)
                .attr("y1", d => (d.source as any).y)
                .attr("x2", d => (d.target as any).x)
                .attr("y2", d => (d.target as any).y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });

        function drag(simulation: d3.Simulation<any, any>) {
          function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          }
          
          function dragged(event: any) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          }
          
          function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          }
          
          return d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended);
        }

    }, [graphData]);

    return (
        <svg ref={svgRef} width="100%" height="100%" />
    );
};
