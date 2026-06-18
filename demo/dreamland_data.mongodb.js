// This script sets up a MongoDB database for a fictional maid cafe called "Dreamland Cafe". It creates a collection called "dreamland_menu" and inserts several menu items with details such as name, type, category, description, tags, price, and currency.

// Connect to the MongoDB server and switch to the "dreamland_cafe" database
use dreamland_cafe

// Create the "dreamland_menu" collection and insert sample menu items
db.dreamland_menu.insertMany([
  {
    _id: 1,
    name: "Magical Omurice",
    type: "food",
    category: "rice dish",
    description: "A fluffy omelet rice dish served with ketchup art drawn by the maid. Popular with first-time visitors who want a classic maid cafe experience.",
    tags: ["omurice", "rice", "egg", "ketchup art", "popular"],
    price: 220,
    currency: "THB"
  },
  {
    _id: 2,
    name: "Neko Neko Strawberry Parfait",
    type: "dessert",
    category: "parfait",
    description: "A cute cat-themed strawberry parfait with vanilla ice cream, whipped cream, cornflakes, strawberry sauce, and chocolate ears.",
    tags: ["dessert", "strawberry", "ice cream", "cat theme", "sweet"],
    price: 180,
    currency: "THB"
  },
  {
    _id: 3,
    name: "Moe Moe Peach Soda",
    type: "beverage",
    category: "soda",
    description: "A refreshing peach soda with sparkling water, peach syrup, jelly cubes, and a heart-shaped garnish. Recommended for guests who prefer a sweet fruity drink.",
    tags: ["drink", "peach", "soda", "fruity", "refreshing"],
    price: 120,
    currency: "THB"
  },
  {
    _id: 4,
    name: "Dreamy Matcha Latte",
    type: "beverage",
    category: "latte",
    description: "A smooth matcha latte with creamy milk and light sweetness. A good choice for guests who enjoy Japanese-style drinks with a rich green tea flavor.",
    tags: ["drink", "matcha", "latte", "green tea", "creamy"],
    price: 140,
    currency: "THB"
  },
  {
    _id: 5,
    name: "Maid's Secret Curry",
    type: "food",
    category: "curry rice",
    description: "A mild Japanese curry rice with vegetables and chicken, served with a small heart-shaped cheese topping. Suitable for guests who want a warm and filling meal.",
    tags: ["curry", "rice", "chicken", "japanese food", "filling"],
    price: 240,
    currency: "THB"
  }
])


/*
===============================
======== Sample Queries =======
===============================
*/

db.dreamland_menu.aggregate(
[
  {
    $vectorSearch: {
      index: "autoembed_index",
      query: "แก้ง่วง",
      path: "description",
      numCandidates: 100,
      limit: 10
    }
  }, 
  {
    $project: {
      _id: 0,
      name: 1,
      description: 1,
      price: 1
    }
  }
])

db.dreamland_menu.aggregate(
[
  {
    $vectorSearch: {
      index: "autoembed_index",
      query: "แก้ง่วง",
      path: "description",
      numCandidates: 100,
      limit: 10
    }
  }
])

db.dreamland_menu.aggregate(
[
  {
    $vectorSearch: {
      index: "autoembed_index",
      query: "อยากกินอะไรเย็นๆ หวานๆ น่าร้าก",
      path: "description",
      numCandidates: 100,
      limit: 10
    }
  }, 
  {
    $project: {
      _id: 0,
      name: 1,
      description: 1,
      price: 1
    }
  }
])