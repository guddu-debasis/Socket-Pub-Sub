# Scaled Real-Time Chat with Socket.io & NATS

A lightweight, scalable real-time chat application demonstrating horizontal scaling of Node.js Socket.io servers using a NATS message broker adapter.

## Architecture

When running multiple instances of this Node.js server behind a load balancer, standard Socket.io setups will fail to sync clients connected to different server instances. By introducing **NATS** as a pub/sub backbone via `@mickl/socket.io-nats-adapter`, all events (`io.emit`) are seamlessly synchronized across all active server nodes.

```
Client 1 ──> [ Server Instance (Port 3000) ] ──┐
                                               ├──> [ NATS Message Broker (Port 4222) ]
Client 2 ──> [ Server Instance (Port 4000) ] ──┘
```

---

## Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v18+ recommended, with ES Modules enabled)
- **NATS Server** running locally or via Docker

---

## Getting Started

### 1. Start NATS Server
Run a local NATS instance using Docker:
```bash
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats:latest
```

### 2. Clone and Install Dependencies
Initialize your project and install the required packages:
```bash
npm init -y
npm install express socket.io nats @mickl/socket.io-nats-adapter
```
*(Ensure your `package.json` contains `"type": "module"` to support ES imports).*

### 3. Create Project Structure
Create your server file (`server.js`) and your client interface (`index.html`) in the root directory.

---

## Running the Application

To test horizontal scaling, you can spin up multiple server instances on different ports using environment variables:

**Terminal 1 (Instance 1):**
```bash
PORT=3000 node server.js
```

**Terminal 2 (Instance 2):**
```bash
PORT=4000 node server.js
```

Open your browser and navigate to `http://localhost:3000` in one tab and `http://localhost:4000` in another. Messages sent from either port will broadcast to all connected clients across the cluster!