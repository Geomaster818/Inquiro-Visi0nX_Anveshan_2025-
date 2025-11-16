Inquiro Paper Bank - Full Project
--------------------------------

How to run locally:

1. Install dependencies:
   npm install

2. Configure MongoDB:
   - For local MongoDB, ensure mongod is running.
   - Edit .env if needed (MONGODB_URI, PORT).

3. Start server:
   npm start

4. Open in browser:
   http://localhost:3000/paperbank.html

Notes:
- Three sample PDFs were copied into public/uploads/papers/.
- Use POST /api/seed to insert DB entries for the three PDFs.
- Uploads are stored in public/uploads/papers and served at /uploads/papers/<filename>.
