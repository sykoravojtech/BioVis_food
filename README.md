<div align="center">    
 
# food.com analysis
## Visualization of Biological Data Project 
</div>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#description">Description</a></li>
    <li><a href="#goal-of-the-project">Goal of the Project</a></li>
    <li><a href="#dataset">Dataset</a></li>
    <li><a href="#columns-of-preprocessing">Columns of Preprocessing</a></li>
    <li><a href="#how-to-run">How to run </a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## Description
Cooking is one of the most common and (ful)filling hobbies. Especially since the last two years
of lockdowns and restrictions, more people started experimenting in their chemical laboratories
known as kitchens. And what probably many of you know well, after a few weeks of home cooking we need to boost our inspiration, unless we want to make the same meals over and over again.

## Goal of the Project
Since this dataset included various different data each team member focused on one topic. We explored what are the most popular ingredients in each cuisine and the percentage of recipes they are used in shown on a map corresponding to the cuisines' country. We wanted to see which combination of ingredients most prevalent around the world so we used a heatmap to explore that question. We explored the ratio of vegan to vegetarian to regular recipes. We compared the use of each nutrient in cuisines and the average amount of calories. We explored the popularity of cuisines over the years.
      
# Dataset
We took a kaggle dataset which scraped data from https://www.food.com/
Kaggle dataset: https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions
  
# Columns of Preprocessing
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

## How to run    
```bash
# clone project   
git clone https://github.com/sykoravojtech/BioVis_food
```
```bash
# install dependencies in your environment
pip install flask, pandas
```
```bash
# either run 'run.cmd' or directly the flashServer.py
python flaskServer.py
# open the link to the website which will be given to you in the console
```

## License
Distributed under the MIT License. See `LICENSE` for more information.