"""
This file is for constants that can be used across multiple files
"""

# ANSI color codes
GREEN = '\033[92m'
END = '\033[0m'

# Define cuisine tags
all_cuisine_tags = [
    'angolan', 'argentine', 'australian', 'austrian', 'belgian', 'brazilian', 'cambodian', 'canadian',
    'chilean', 'chinese', 'colombian', 'costa-rican', 'cuban', 'czech', 'danish', 'ecuadorean', 'egyptian',
    'english', 'ethiopian', 'filipino', 'finnish', 'french', 'georgian', 'german', 'greek', 'guatemalan',
    'hawaiian', 'hungarian', 'indian', 'indonesian', 'iranian-persian', 'iraqi', 'irish', 'italian', 'japanese',
    'korean', 'lebanese', 'libyan', 'malaysian', 'mexican', 'mongolian', 'moroccan', 'nepalese', 'nigerian',
    'norwegian', 'pakistani', 'palestinian', 'peruvian', 'polish', 'portuguese', 'puerto-rican', 'russian',
    'scottish', 'south-african', 'spanish', 'swedish', 'swiss', 'thai', 'turkish', 'vietnamese', 'welsh',
    'british-columbian', 'european', 'middle-eastern', 'pacific-northwest', 'quebec', 'scandinavian',
    'southern-united-states', 'southwestern-united-states', 'polynesian', 'south-american',
    'african', 'american', 'asian', 'european', 'north-american'
]

cuisine_country_map = {
    'angolan': 'Angola',
    'argentine': 'Argentina',
    'australian': 'Australia',
    'austrian': 'Austria',
    'belgian': 'Belgium',
    'brazilian': 'Brazil',
    'cambodian': 'Cambodia',
    'canadian': 'Canada',
    'chilean': 'Chile',
    'chinese': 'China',
    'colombian': 'Colombia',
    'costa-rican': 'Costa Rica',
    'cuban': 'Cuba',
    'czech': 'Czech Republic',
    'danish': 'Denmark',
    'ecuadorean': 'Ecuador',
    'egyptian': 'Egypt',
    'english': 'United Kingdom',  # Alternatively, 'England'
    'ethiopian': 'Ethiopia',
    'filipino': 'Philippines',
    'finnish': 'Finland',
    'french': 'France',
    'georgian': 'Georgia',
    'german': 'Germany',
    'greek': 'Greece',
    'guatemalan': 'Guatemala',
    'hawaiian': 'United States of America',  # Hawaii is a state of the USA
    'hungarian': 'Hungary',
    'indian': 'India',
    'indonesian': 'Indonesia',
    'iranian-persian': 'Iran',
    'iraqi': 'Iraq',
    'irish': 'Ireland',
    'italian': 'Italy',
    'japanese': 'Japan',
    'korean': 'South Korea',  # Assuming South Korea
    'lebanese': 'Lebanon',
    'libyan': 'Libya',
    'malaysian': 'Malaysia',
    'mexican': 'Mexico',
    'mongolian': 'Mongolia',
    'moroccan': 'Morocco',
    'nepalese': 'Nepal',
    'nigerian': 'Nigeria',
    'norwegian': 'Norway',
    'pakistani': 'Pakistan',
    'palestinian': 'Palestine',
    'peruvian': 'Peru',
    'polish': 'Poland',
    'portuguese': 'Portugal',
    'puerto-rican': 'Puerto Rico',
    'russian': 'Russia',
    'scottish': 'United Kingdom',  # Alternatively, 'Scotland'
    'south-african': 'South Africa',
    'spanish': 'Spain',
    'swedish': 'Sweden',
    'swiss': 'Switzerland',
    'thai': 'Thailand',
    'turkish': 'Turkey',
    'vietnamese': 'Vietnam',
    'welsh': 'United Kingdom',  # Alternatively, 'Wales'
    'british-columbian': 'Canada',  # British Columbia is a province of Canada
    'pacific-northwest': 'United States of America',  # This region is in the USA
    'quebec': 'Canada',  # Quebec is a province of Canada
    'southern-united-states': 'United States of America',
    'southwestern-united-states': 'United States of America',
    'american': 'United States of America',
}

cuisine_map_keys = [
    'angolan', 'argentine', 'australian', 'austrian', 'belgian', 'brazilian', 'cambodian', 'canadian', 
    'chilean', 'chinese', 'colombian', 'costa-rican', 'cuban', 'czech', 'danish', 'ecuadorean', 
    'egyptian', 'english', 'ethiopian', 'filipino', 'finnish', 'french', 'georgian', 'german', 'greek', 
    'guatemalan', 'hawaiian', 'hungarian', 'indian', 'indonesian', 'iranian-persian', 'iraqi', 'irish', 
    'italian', 'japanese', 'korean', 'lebanese', 'libyan', 'malaysian', 'mexican', 'mongolian', 
    'moroccan', 'nepalese', 'nigerian', 'norwegian', 'pakistani', 'palestinian', 'peruvian', 'polish', 
    'portuguese', 'puerto-rican', 'russian', 'scottish', 'south-african', 'spanish', 'swedish', 
    'swiss', 'thai', 'turkish', 'vietnamese', 'welsh', 'british-columbian', 'pacific-northwest', 
    'quebec', 'southern-united-states', 'southwestern-united-states', 'american']

# Note: For tags that represent a region or continent (like 'european', 'middle-eastern'), you can either omit these
# or find a representative country, if applicable. Some of these mappings might need to be adjusted or expanded
# based on your specific project requirements.

# --------- HELPERS -------------------
import ast
import pandas as pd

# Function to safely convert string representations of lists to actual lists
def str_to_list(s):
    try:
        return ast.literal_eval(s)
    except ValueError:
        return []
# str_to_list("[1,2,3]")

def merge_garlic_with_garlic_cloves(cuisine_ingredients):
    # Iterate over each cuisine and its ingredients
    for cuisine, ingredients in cuisine_ingredients.items():
        # Check if 'garlic cloves' is an ingredient in this cuisine
        if 'garlic cloves' in ingredients:
            # If 'garlic' already exists, add the number to it
            if 'garlic' in ingredients:
                ingredients['garlic'] += ingredients['garlic cloves']
            else:
                # If 'garlic' does not exist, create it and set its number to that of 'garlic cloves'
                ingredients['garlic'] = ingredients['garlic cloves']
            # Remove 'garlic cloves' from the dictionary
            del ingredients['garlic cloves']
    return cuisine_ingredients

def get_top_n_ingredients(mydict, n_ingreds = 5):
    for cuisine, ingredients in mydict.items():
        # Select the top N ingredients
        top_n_ingredients = dict(sorted(ingredients.items(), key=lambda item: item[1], reverse=True)[:n_ingreds])
        mydict[cuisine] = top_n_ingredients
    return mydict

def filter_out_cuisines(ingredient_dict, selected_cuisines):
    filtered_dict = {}
    for cuisine, ingredients in ingredient_dict.items():
        if (selected_cuisines != []) and (cuisine in selected_cuisines):
            filtered_dict[cuisine] = ingredients
    return filtered_dict

def filter_out_ingredients(ingredient_dict, ignore_these):
    filtered_dict = {}
    for cuisine, ingredients in ingredient_dict.items():
        filtered_dict[cuisine] = {}
        for k,v in ingredients.items():
            if k not in ignore_these:
                filtered_dict[cuisine][k] = v
    return filtered_dict

def get_dict_countryName_mostPopularIngr(cuisine_data):
    # Get a dict of {country name: name of most popular ingredient}
    country_ingredient_map = {}
    for cuisine, data in cuisine_data.items():
        country = cuisine_country_map.get(cuisine)
        if country:
            top_ingredient = list(data.keys())[0]
            country_ingredient_map[country] = top_ingredient
    return country_ingredient_map

def get_dict_countryName_ingredients(top_ingredients_dict):
    # Get a dict of {country name: {ingredient:perc, ingredient2:perc2, ...}}
    country_ingredient_map_top5 = {}
    cuisine_data = top_ingredients_dict
    for cuisine, ingredients in cuisine_data.items():
        country = cuisine_country_map.get(cuisine)
        if country:
            country_ingredient_map_top5[country] = ingredients
    return country_ingredient_map_top5

def get_ingredient_counts(df):
    cuisine_ingredient_dict = {}
    # Populate the dictionary
    for _, row in df.iterrows():
        for cuisine in row['cuisine_tags']:
            if cuisine not in cuisine_ingredient_dict:
                cuisine_ingredient_dict[cuisine] = {}
            
            for ingredient in row['ingredients']:
                if ingredient in cuisine_ingredient_dict[cuisine]:
                    cuisine_ingredient_dict[cuisine][ingredient] += 1
                else:
                    cuisine_ingredient_dict[cuisine][ingredient] = 1
    return cuisine_ingredient_dict

def convert_counts_to_perc_and_sort(mydict):
    perc_dict = {}
    # Convert counts to percentages and sort
    for cuisine, ingredients in mydict.items():
        total = sum(ingredients.values())
        perc_dict[cuisine] = {k: round((v / total) * 100, 2) for k, v in sorted(ingredients.items(), key=lambda item: item[1], reverse=True)}
    return perc_dict

# Initialize the categories dictionary
categories = {
    'Dairy': [],
    'Spices_Herbs': [],
    'Proteins': [],
    'Vegetables_Fruits': [],
    'Grains_Carbs': [],
    'Sauces': [],
    'Others': []
}

# Define keywords for each category
dairy_keywords = ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'parmesan', 'cheddar', 'mozzarella']
spices_herbs_keywords = ['spice', 'herb', 'pepper', 'salt', 'cinnamon', 'garlic', 'oregano', 'basil', 'paprika', 'turmeric', 'ginger']
proteins_keywords = ['chicken', 'beef', 'pork', 'tofu', 'beans', 'lentils', 'fish', 'shrimp', 'egg', 'turkey', 'lamb']
vegetables_fruits_keywords = ['lettuce', 'tomato', 'apple', 'berry', 'potato', 'onion', 'carrot', 'peas', 'broccoli', 'cucumber', 'grape', 'banana']
grains_carbs_keywords = ['wheat', 'rice', 'bread', 'pasta', 'flour', 'oat', 'noodle', 'barley', 'corn']
sauces_keywords = ['sauce', 'ketchup', 'mayonnaise', 'dressing', 'soy sauce', 'hot sauce', 'mustard', 'fish sauce']

# Modify the categorize_ingredient function to include the new keywords
def categorize_ingredient(ingredient):
    ingredient = ingredient.lower()
    if any(dairy in ingredient for dairy in dairy_keywords):
        return 'Dairy'
    elif any(spice in ingredient for spice in spices_herbs_keywords):
        return 'Spices_Herbs'
    elif any(protein in ingredient for protein in proteins_keywords):
        return 'Proteins'
    elif any(vegfruit in ingredient for vegfruit in vegetables_fruits_keywords):
        return 'Vegetables_Fruits'
    elif any(grain in ingredient for grain in grains_carbs_keywords):
        return 'Grains_Carbs'
    elif any(sauce in ingredient for sauce in sauces_keywords):
        return 'Sauces'
    else:
        return 'Others'
