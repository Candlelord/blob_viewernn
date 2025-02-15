import { JsonRpcProvider } from '@mysten/sui.js';

const width = window.innerWidth;
const height = window.innerHeight * 0.8;
const color = d3.scaleOrdinal(d3.schemeCategory10);

const svg = d3.select('#visualization')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

let nodes = [];
let links = [];

d3.json('mock_data.json').then(data => {
    nodes = data.nodes;
    links = data.links;

    update();

    setInterval(() => {
        simulateNodeStatusChanges();
        update();
    }, 30000);
});

function update() {
    const link = svg.selectAll('.link')
        .data(links)
        .enter().append('line')
        .attr('class', 'link');

    const node = svg.selectAll('.node')
        .data(nodes)
        .enter().append('circle')
        .attr('class', d => `node ${d.status}`)
        .attr('r', d => d.type === 'blob' ? d.size : 5)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    node.append('title')
        .text(d => d.type === 'blob' ? `Blob ID: ${d.id}\nRedundancy: ${d.redundancy}\nStorage Duration: ${d.duration}` : `Node ID: ${d.id}\nUptime: ${d.uptime}%\nStored Blobs: ${d.blobCount}\nStatus: ${d.status}`);

    simulation
        .nodes(nodes)
        .on('tick', ticked);

    simulation.force('link')
        .links(links);

    function ticked() {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

document.getElementById('search-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('search-input').value;
    const foundNode = nodes.find(node => node.id === searchTerm);
    if (foundNode) {
        d3.selectAll('circle')
            .style('stroke', d => d.id === searchTerm ? 'yellow' : 'none')
            .style('stroke-width', d => d.id === searchTerm ? '3px' : '1.5px');
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(width / 2 - foundNode.x, height / 2 - foundNode.y).scale(2));
    } else {
        alert('Blob not found');
    }
});

const zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on('zoom', (event) => {
        svg.attr('transform', event.transform);
    });

svg.call(zoom);

const provider = new JsonRpcProvider('https://rpc.testnet.sui.io/');

async function trackBlobEvents() {
    const events = await provider.getEvents({
        query: { MoveEventType: 'BlobCertified' }
    });

    events.forEach(event => {
        console.log('New BlobCertified event:', event);
    });
}

trackBlobEvents();

function simulateNodeStatusChanges() {
    nodes.forEach(node => {
        if (node.type === 'node') {
            node.status = Math.random() > 0.5 ? 'online' : 'offline';
        }
    });
}