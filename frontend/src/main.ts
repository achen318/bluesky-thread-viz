import './style.css';

import * as d3 from 'd3';

// Create hierarchical layout from data
const sampleData = {
  name: 'A',
  likeCount: 120,
  children: [
    {
      name: 'B',
      likeCount: 15,
      children: [
        { name: 'C', likeCount: 0 },
        { name: 'D', likeCount: 10 }
      ]
    },
    {
      name: 'E',
      likeCount: 30,
      children: [
        { name: 'F', likeCount: 5 },
        {
          name: 'G',
          likeCount: 1000,
          children: [
            {
              name: 'H',
              likeCount: 200,
              children: [{ name: 'J', likeCount: 50 }]
            }
          ]
        }
      ]
    },
    { name: 'I', likeCount: 5 }
  ]
};

// Dimension constants
const margin = { top: 20, right: 30, bottom: 20, left: 120 };
const spaceBetweenNodes = 28;

function renderTree() {
  // Select SVG element
  const svg = d3.select('#threadViz');
  if (svg.empty()) return;

  // Create tree hierarchy layout from data and dimensions
  const root = d3.hierarchy(sampleData);
  const nodes = root.descendants();

  const svgWidth = window.innerWidth;
  const treeWidth = svgWidth - margin.left - margin.right;

  const treeHeight = nodes.length * spaceBetweenNodes;
  const svgHeight = treeHeight + margin.top + margin.bottom;

  const tree = d3.tree().size([treeHeight, treeWidth]);
  tree(root);

  // Clear previous content and resize SVG
  svg.selectAll('*').remove();
  const g = svg
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr('transform', `translate(${margin.left / 2},${margin.top})`);

  // Links
  g.append('g')
    .attr('fill', 'none')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.7)
    .attr('stroke-width', 1.5)
    .selectAll('path')
    .data(root.links())
    .join('path')
    .attr(
      'd',
      d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x)
    );

  // Nodes
  const node = g
    .append('g')
    .selectAll('g')
    .data(nodes)
    .join('g')
    .attr('transform', (d) => `translate(${d.y},${d.x})`);

  node
    .append('circle')
    .attr('fill', '#69b3a2')
    .attr('r', (d) => Math.max(4, 4 + Math.sqrt(d.data.likeCount)));
}

renderTree();
window.addEventListener('resize', renderTree);
