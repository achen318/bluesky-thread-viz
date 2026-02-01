import * as d3 from 'd3';

// Dimension constants
const margin = { top: 20, right: 30, bottom: 20, left: 120 };
const nodePadding = 10;

export function renderTree(data) {
  // Select SVG element
  const svg = d3.select('#threadViz');
  if (svg.empty()) return;

  // Create tree hierarchy layout from data and dimensions
  const root = d3.hierarchy(data);
  const nodes = root.descendants();

  const getNodeRadius = (d) => {
    const likeCount =
      typeof d.data?.likeCount === 'number' ? d.data.likeCount : 0;
    return Math.max(4, 4 + Math.sqrt(likeCount));
  };

  const svgWidth = window.innerWidth;
  const treeWidth = svgWidth - margin.left - margin.right;

  const baseVerticalUnit = 6;
  const horizontalSpacing = Math.max(250, treeWidth / (root.height + 0.5));

  const tree = d3
    .tree()
    .nodeSize([baseVerticalUnit, horizontalSpacing])
    .separation(
      (a, b) =>
        (getNodeRadius(a) + getNodeRadius(b) + nodePadding) / baseVerticalUnit
    );
  tree(root);

  const xExtent = d3.extent(nodes, (d) => d.x) as [number, number];
  const svgHeight = xExtent[1] - xExtent[0] + margin.top + margin.bottom + 20;

  const yExtent = d3.extent(nodes, (d) => d.y) as [number, number];
  const contentWidth = yExtent[1] - yExtent[0] + margin.left + margin.right;
  const finalWidth = Math.max(svgWidth, contentWidth);

  // Clear previous content and resize SVG
  svg.selectAll('*').remove();
  const g = svg
    .attr('width', finalWidth)
    .attr('height', svgHeight)
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left / 2},${margin.top - xExtent[0] + 10})`
    );

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

  node.append('circle').attr('fill', '#69b3a2').attr('r', getNodeRadius);
}
