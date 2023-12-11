# BioVis_food

Cooking is one of the most common and (ful)filling hobbies. Especially since the last two years
of lockdowns and restrictions, more people started experimenting in their chemical laboratories
known as kitchens. And what probably many of you know well, after a few weeks of home cooking we need to boost our inspiration, unless we want to make the same meals over and over again.

# TODO
- [ ] main preprocessing DANIEL
- [ ] formulate the questions better (type of plot, which data)
- [ ] webpage template Amal
  - [ ] layout, which questions are connected CARLA 
- [ ] visualize each question

# Dataset food.com
We took a kaggle dataset which scraped data from https://www.food.com/
Kaggle dataset: https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions

# Questions
- Which combination of ingredients are most prevalent in each cuisine?
- Graph analysis of the similarity of cuisines based on their similar ingredients.
- Which cuisine requires the most __ on average?
  - ingredients
  - steps
  - prep time
- The popularity of cuisines over time.

# Columns of preprocessing
- RAW_recipes
  - name
  - id
  - minutes
  - submitted
  - tags
    - cuisine
    - Vegan
    - Vegetarian
  - nutrition
  - n_steps
  - ingredients
  - n_ingredients
- RAW_interactions
  - for each recipe extra columns
    - all dates
    - all ratings

# Final submission
- [ ] Interactive website
- [ ] presentation
- [ ] GitHub documentation
