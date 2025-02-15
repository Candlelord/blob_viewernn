# Decentralized Storage Visualization Tool

This project is a D3.js-based 2D visualization tool for decentralized storage, featuring a force-directed graph, real-time updates from a mock API, search functionality, tooltips, and integration with the Sui blockchain.

## Features

1. **Core Features**
   - Force-directed graph showing:
     * Blobs as large circles (size = storage size)
     * Nodes as small circles (positioned geographically or randomly)
   - Real-time updates from mock API (local JSON file) containing:
     * Blob IDs, sizes, storage nodes, creation timestamps
     * Node IDs, status (online/offline), capacity
   - Search box that:
     * Highlights found blobs with yellow border
     * Zooms to blob location
   - Tooltips showing:
     * Blob: ID, redundancy score, storage duration
     * Node: Uptime %, stored blobs count, status

2. **Technical Requirements**
   - Use D3.js v7+
   - Implement basic Walrus/Sui integration:
     * Load mock blockchain data from JSON
     * Simulate node status changes every 30s
   - Responsive design (works on mobile)
   - Error handling for invalid blob searches

3. **Additional Notes**
   - Target testnet environment (simplified data OK)
   - Prioritize clear code structure over optimization
   - Include step-by-step setup instructions
   - Use these color codes:
     * Online nodes: #4CAF50
     * Offline nodes: #F44336
     * Blobs: #2196F3

## Setup Instructions

1. Clone the repository.
2. Ensure you have a local server to serve the files (e.g., using `http-server` for Node.js).
3. Open `index.html` in your browser.
4. Modify `mock_data.json` to simulate different node and blob configurations.
5. The tool will automatically fetch the data from `mock_data.json` and update the visualization every 30 seconds.

## Sui Blockchain Integration

The project includes basic integration with the Sui blockchain using the `@mysten/sui.js` library. It tracks `BlobCertified` events and simulates node status changes.

You can further extend the blockchain integration by modifying the `trackBlobEvents` function in `script.js` to handle more complex event processing and real-time updates.

Enjoy visualizing your decentralized storage network!