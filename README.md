# DocSync - Real-Time Collaborative Document Editing Platform

## Overview

**DocSync** is a real-time collaborative document editing platform. It allows users to create, edit, and share documents with others in a collaborative environment. The platform supports both viewers and editors, enabling real-time updates, cursor synchronization, and document sharing with access control.

## Features

- **Real-time Collaboration:** Multiple users can edit a document simultaneously, and changes are reflected in real-time.
- **Access Control:** Users can share documents with others, specifying roles like `VIEWER` and `EDITOR`.
- **Authentication:** Secure user authentication with support for token-based access control.
- **Document Management:** Users can create, update, view, and delete documents.
- **WebSocket Integration:** Live updates, including edits and cursor synchronization.
- **Responsive Frontend:** Built with React and Quill.js for rich-text editing.

## Technologies Used

- **Frontend:** React (TypeScript), React Router, Axios, Quill.js
- **Backend:** Node.js, Express.js, WebSocket (ws), Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT-based authentication
- **Real-time Communication:** WebSockets
- **DevOps:** Docker (optional), environment variables

## Prerequisites

Before you start, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Docker](https://www.docker.com/get-started) (optional, for containerized deployment)

## Environment Variables

You will need to set up environment variables in a `.env` file at the root of your project:

```bash
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database_name>?schema=public"
JWT_SECRET="<your_jwt_secret>"
PORT=3001


