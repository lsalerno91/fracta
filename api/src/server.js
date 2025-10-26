import app from "./app.js";

const PORT = process.env.PORT || 5000;

// Start the Express.js server
app.listen(PORT, () => {
  console.log(`🚀 Server Express listening on port ${PORT}`);
});
