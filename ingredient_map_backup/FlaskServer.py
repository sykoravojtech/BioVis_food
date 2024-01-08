# CARLA LOPEZ MARTINEZ AND VOJTECH SYKORA
from flask import Flask, render_template
import numpy as np
import pandas as pd
import math
import ast
from utils import *

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/bubble_chart')
def bubble_chart():
    # Code to read bubble chart data
    bubble_data = get_bubble_chart_data()
    return render_template('bubble_chart.html', bubble_data=bubble_data)

@app.route('/bar_chart')
def bar_chart():
    # Code to generate bar chart data
    bar_data = get_bar_chart_data(150,10)
    return render_template('bar_chart.html', bar_data=bar_data)


def get_bubble_chart_data():
    # Specify the paths to your CSV files
    internet_users_file_path = 'static/internet_users.csv'
    gdp_pcap_file_path = 'static/gdp_pcap.csv'
    employment_rate_file_path = 'static/aged_15plus_employment_rate_percent.csv'

    # Create an array to store the data
    all_data = []

    # Function to process the loaded data
    def process_data(data, category):
        country = data['country']
        value_2017 = float(data['2017'])

        # Find the corresponding data entry index in all_data
        entry_index = next((i for i, entry in enumerate(all_data) if entry['country'] == country), None)

        # If the entry doesn't exist, create it
        if entry_index is None:
            new_entry = {'country': country}
            new_entry[category] = value_2017
            all_data.append(new_entry)
        else:
            # If the entry exists, update it
            all_data[entry_index][category] = value_2017

    # Function to process the loaded data and retrieve continents of each country
    def get_continents(data):
        country = data['country']
        continent = data['continent']

        # Find the corresponding data entry index in all_data
        entry_index = next((i for i, entry in enumerate(all_data) if entry['country'] == country), None)

        # If the entry doesn't exist, create it
        if entry_index is None:
            new_entry = {'country': country}
            new_entry['continent'] = continent
            all_data.append(new_entry)
        else:
            # If the entry exists, update it
            all_data[entry_index]['continent'] = continent

    # Define a function to load the data
    def load_data():
        try:
            # Load CSV files into pandas DataFrames
            internet_users_data = pd.read_csv(internet_users_file_path)
            gdp_pcap_data = pd.read_csv(gdp_pcap_file_path)
            employment_rate_data = pd.read_csv(employment_rate_file_path)

            # Process data from CSV files
            internet_users_data.apply(lambda row: process_data(row, "internet_users"), axis=1)
            gdp_pcap_data.apply(lambda row: process_data(row, "gdp_pcap"), axis=1)
            employment_rate_data.apply(lambda row: process_data(row, "employment_rate"), axis=1)

            # Load data from external URL
            external_data_url = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv"
            external_data = pd.read_csv(external_data_url)
            external_data.apply(get_continents, axis=1)

        except Exception as error:
            # Handle errors
            print('Error loading the CSV files:', error)

    # Call the load_data function
    load_data()

    # Filter out countries with missing data
    all_data = list(filter(lambda entry: 
    'internet_users' in entry 
    and 'gdp_pcap' in entry 
    and 'employment_rate' in entry
    and 'continent' in entry
    and not math.isnan(entry['gdp_pcap']), all_data))

    # Return the resulting all_data array
    # print(all_data)  # [{'country': 'Afghanistan', 'internet_users': 13.5, 'gdp_pcap': 589.0, 'employment_rate': 43.2, 'continent': 'Asia'}, ...]
    return all_data


# --------------- PROJECT CODE -----------------------

def get_bar_chart_data(M, N):
    # data_array = np.random.randint(0, 101, size=(M, N)).tolist()
    DATASET_PATH = "C:/Users/vojsy/Desktop/BioVis_food/Data/dataset.csv"
    df = pd.read_csv(DATASET_PATH)
    df = df[["cuisine_tags", "ingredients"]]
    # Apply the conversion to the 'cuisine_tags' and 'ingredients' columns
    df['cuisine_tags'] = df['cuisine_tags'].apply(str_to_list)
    df['ingredients'] = df['ingredients'].apply(str_to_list)
    # print(df)


    # Initialize the main dictionary
    cuisine_ingredient_dict = {}
    cuisine_ingredient_dict_perc = {}

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
    # print(list(cuisine_ingredient_dict.items())[0])
    cuisine_ingredient_dict = merge_garlic_with_garlic_cloves(cuisine_ingredient_dict)

    # Convert counts to percentages and sort
    for cuisine, ingredients in cuisine_ingredient_dict.items():
        total = sum(ingredients.values())
        cuisine_ingredient_dict_perc[cuisine] = {k: round((v / total) * 100, 2) for k, v in sorted(ingredients.items(), key=lambda item: item[1], reverse=True)}
    
    # print(cuisine_ingredient_dict_perc)
        
    # New dictionary for top 5 ingredients of each cuisine
    top_5_ingredients_dict = {}

    for cuisine, ingredients in cuisine_ingredient_dict_perc.items():
        # Select the top 5 ingredients
        top_5_ingredients = dict(sorted(ingredients.items(), key=lambda item: item[1], reverse=True)[:5])
        top_5_ingredients_dict[cuisine] = top_5_ingredients

    # Remove the basic ingredients like salt and water
    ignore_these = ["salt", "water", "sugar"]
    filtered_cuisine_ingredient_dict = {}
    for cuisine, ingredients in cuisine_ingredient_dict_perc.items():
        filtered_cuisine_ingredient_dict[cuisine] = {}
        for k,v in ingredients.items():
            if k not in ignore_these:
                filtered_cuisine_ingredient_dict[cuisine][k] = v
    
    # New dictionary for top 5 ingredients of each cuisine
    top_ingredients_dict = {}

    for cuisine, ingredients in filtered_cuisine_ingredient_dict.items():
        # Select the top 5 ingredients
        top_ingredients = dict(sorted(ingredients.items(), key=lambda item: item[1], reverse=True)[:5])
        top_ingredients_dict[cuisine] = top_ingredients
    
    # Get a dict of {country name: name of most popular ingredient}
    country_ingredient_map = {}
    cuisine_data = top_ingredients_dict
    for cuisine, data in cuisine_data.items():
        country = cuisine_country_map.get(cuisine)
        if country:
            top_ingredient = list(data.keys())[0]
            country_ingredient_map[country] = top_ingredient

    # Get a dict of {country name: {ingredient:perc, ingredient2:perc2, ...}}
    country_ingredient_map_top5 = {}
    cuisine_data = top_ingredients_dict
    for cuisine, ingredients in cuisine_data.items():
        country = cuisine_country_map.get(cuisine)
        if country:
            country_ingredient_map_top5[country] = ingredients

    ret = country_ingredient_map_top5
    # print("RETURNING")
    # print(ret)
    return ret


# --------- HELPERS -------------------
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

if __name__ == '__main__':
    app.run(debug=True)
