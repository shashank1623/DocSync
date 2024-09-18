import express from 'express';
import cors from 'cors';
import http from 'http'; // Import http to use the same server for WebSocket
import { WebSocketServer } from 'ws'; // Import WebSocketServer from 'ws'
import { verifyToken } from './middleware/authMiddleware'; // Ensure token verification is used in WebSocket
import dashboardRouter from './routes/dashboard';
import userRouter from './routes/user';
import prisma from './routes/client';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Bhai mai user Root hu!");
});
app.use('/api/v1/user', userRouter);
app.use('/api/v1/dashboard', dashboardRouter);

// Create an HTTP server to integrate WebSocket
const server = http.createServer(app);

// Create WebSocket Server
const wss = new WebSocketServer({ server }); // Bind WebSocket to the HTTP server

// Map to store document-specific clients
const documentClients = new Map<string, WebSocket[]>();

wss.on('connection', (ws, req) => {
  const urlParts = req.url?.split('/');
  const documentId = urlParts ? urlParts[urlParts.length - 1] : null;

  if (!documentId) {
    ws.close(); // Close connection if no document ID is provided
    return;
  }

  // Extract the accessType from the query parameter (e.g., '?access=editor')
  const accessType = new URLSearchParams(req.url?.split('?')[1]).get('access');

  // Validate if the access type is correct (only 'viewer' or 'editor' are allowed)
  if (accessType !== 'viewer' && accessType !== 'editor') {
    ws.close(); // Close connection for invalid access type
    return;
  }

  // Continue with existing logic to add the client to documentClients
  if (!documentClients.has(documentId)) {
    documentClients.set(documentId, []);
  }

  const clients = documentClients.get(documentId);
  if (clients) {
    clients.push(ws);
  }

  // Send the initial count of active users
  broadcastActiveUsers(documentId);

  // Handle incoming WebSocket messages (for edits and cursors)
  ws.on('message', async (data) => {
    const message = JSON.parse(data.toString());

    if (message.type === 'edit') {
      // Only allow editors to send edit messages
      if (accessType === 'editor') {
        clients?.forEach(client => {
          if (client !== ws) {
            client.send(JSON.stringify(message));
          }
        });
      }
    } else if (message.type === 'cursor') {
      // Broadcast cursor position to all other clients
      clients?.forEach(client => {
        if (client !== ws) {
          client.send(JSON.stringify(message));
        }
      });
    }
  });

  ws.on('close', () => {
    // Remove the client from the document-specific clients
    const updatedClients = clients?.filter(client => client !== ws);
    documentClients.set(documentId, updatedClients || []);

    // Broadcast updated active users count
    broadcastActiveUsers(documentId);
  });
});

// Broadcast active users to all clients of a document
const broadcastActiveUsers = (documentId: string) => {
  const clients = documentClients.get(documentId) || [];
  clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'activeUsers',
      count: clients.length,
    }));
  });
};

// Check if the user is an editor of the document
const checkEditorRole = async (userId: string, documentId: string) => {
  const collaborator = await prisma.collaborator.findFirst({
    where: {
      userId,
      documentId,
      role: 'EDITOR',
    },
  });
  return !!collaborator; // Returns true if the user is an editor, otherwise false
};

// Start the HTTP server and WebSocket server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
