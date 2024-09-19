import express from 'express';
import cors from 'cors';
import http from 'http'; // Import http to use the same server for WebSocket
import { WebSocketServer } from 'ws'; // Import WebSocketServer from 'ws'
import { verifyToken } from './middleware/authMiddleware'; // Use the token verification method
import dashboardRouter from './routes/dashboard';
import userRouter from './routes/user';
import prisma from './routes/client';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface JwtPayload {
  id: string;
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Bhai mai user Root hu!");
});
app.use('/api/v1/user', userRouter);
app.use('/api/v1/dashboard', dashboardRouter); // Route for dashboard, including document sharing

// Create an HTTP server to integrate WebSocket
const server = http.createServer(app);

// // Create WebSocket Server
// const wss = new WebSocketServer({ server }); // Bind WebSocket to the HTTP server

// // Map to store document-specific clients
// const documentClients = new Map<string, WebSocket[]>();

// wss.on('connection', async (ws, req) => {
//   ws.on('error',console.error);

//   // Check the URL for document ID and access type
//   const urlParts = req.url?.split('/') || [];
//   const documentId = urlParts[5]; // Index 5 contains the document ID

//   if (!documentId) {
//     console.log("Document ID was not found.");
//     ws.close(); // Close connection if no document ID is provided
//     return;
//   }

//   // Extract the query parameters
//   const query = req.url?.split('?')[1];
//   const queryParams = new URLSearchParams(query);
//   const token = queryParams.get('token');
//   const accessType = queryParams.get('access');


//   if (!token) {
//     console.log("Token was not provided.");
//     ws.close(); // Close connection if no token is provided
//     return;
//   }

//   try {
//     const user = jwt.verify(token, JWT_SECRET) as JwtPayload;

//     if (!user) {
//       ws.close(); // Close connection if token is invalid
//       return;
//     }

//     // Validate access type
//     if (accessType !== 'viewer' && accessType !== 'editor') {
//       ws.close(); // Close connection for invalid access type
//       return;
//     }

//     // Check if user has the right access (editor or viewer)
//     const hasEditorAccess = await checkEditorRole(user.id, documentId);
//     if (accessType === 'editor' && !hasEditorAccess) {
//       ws.close(); // Close connection if user is not an editor but trying to edit
//       return;
//     }

//     // Proceed to add the client to the document's clients list
//     if (!documentClients.has(documentId)) {
//       documentClients.set(documentId, []);
//     }

//     const clients = documentClients.get(documentId);
//     clients?.push(ws);

//     // Send the initial count of active users
//     broadcastActiveUsers(documentId);

//     // Handle incoming WebSocket messages
//     ws.on('message', async (data) => {
//       const message = JSON.parse(data.toString());

//       if (message.type === 'edit' && accessType === 'editor') {
//         // Only allow editors to send edit messages
//         clients?.forEach(client => {
//           if (client !== ws) {
//             client.send(JSON.stringify(message));
//           }
//         });
//       } else if (message.type === 'cursor') {
//         // Broadcast cursor position to all other clients
//         clients?.forEach(client => {
//           if (client !== ws) {
//             client.send(JSON.stringify(message));
//           }
//         });
//       }
//     });

//     // Remove the client when they disconnect
//     ws.on('close', () => {
//       const updatedClients = clients?.filter(client => client !== ws);
//       documentClients.set(documentId, updatedClients || []);
//       broadcastActiveUsers(documentId);
//     });

//   } catch (error) {
//     console.log("Error during token verification:", error);
//     ws.close(); // Close connection if token verification fails
//   }
// });


// // Broadcast active users to all clients of a document
// const broadcastActiveUsers = (documentId: string) => {
//   const clients = documentClients.get(documentId) || [];
//   clients.forEach(client => {
//     client.send(JSON.stringify({
//       type: 'activeUsers',
//       count: clients.length,
//     }));
//   });
// };

// // Check if the user is an editor of the document
// const checkEditorRole = async (userId: string, documentId: string) => {
//   const collaborator = await prisma.collaborator.findFirst({
//     where: {
//       userId,
//       documentId,
//       role: 'EDITOR',
//     },
//   });
//   return !!collaborator; // Returns true if the user is an editor, otherwise false
// };

// Start the HTTP server and WebSocket server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
