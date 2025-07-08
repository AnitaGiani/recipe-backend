require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variable for MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const RecipeSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

app.get('/recipes', async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

app.post('/recipes', async (req, res) => {
  console.log('POST /recipes called with:', req.body);
  try {
    const recipe = new Recipe(req.body);
    const savedRecipe = await recipe.save();
    console.log('Saved recipe:', savedRecipe);
    res.json(savedRecipe);
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).send('Error saving recipe');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
