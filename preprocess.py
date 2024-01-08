import pandas as pd
import ast
from utils import *

def main():
    # Read the raw recipes and interactions data
    print("Reading raw data...")
    recipes = pd.read_csv('Data/RAW_recipes.csv')
    interactions = pd.read_csv('Data/RAW_interactions.csv')
    print(GREEN + "Raw data read successfully!" + END)

    # Drop unused columns from the recipes data frame
    print("Dropping unused columns from recipes...")
    columns_to_remove = ['contributor_id', 'steps', 'description']
    df = recipes.drop(columns=columns_to_remove, inplace=False)
    print(GREEN + "Unused columns dropped successfully!" + END)

    # Group interactions by recipe_id, aggregate dates and ratings into lists and merge the aggregated data into df
    print("Merging interactions...")
    grouped_interactions = interactions.groupby('recipe_id').agg({
        'date': list,
        'rating': list,
        'user_id': 'count'
    }).reset_index()
    df = pd.merge(df, grouped_interactions, how='left', left_on='id', right_on='recipe_id')

    # Rename columns and drop redundant ones
    df.rename(columns={'user_id': 'n_ratings', 'date': 'rating_dates', 'rating': 'ratings'}, inplace=True)
    df.drop(columns=['recipe_id'], inplace=True)
    print(GREEN + "Interactions merged successfully!" + END)

    # Loop through recipes and extract tags from cuisine_tags
    print("Extracting cuisine tags...")
    df['cuisine_tags'] = df['tags'].apply(lambda x: [tag for tag in ast.literal_eval(x) if tag in all_cuisine_tags])
    print(GREEN + "Cuisine tags extracted successfully!" + END)

    # Check if 'vegan' and 'vegetarian' tags exist and create 'vegan' and 'vegetarian' columns
    print("Creating 'vegan' and 'vegetarian' columns...")
    df['vegan'] = df['tags'].apply(lambda x: 'vegan' in x)
    df['vegetarian'] = (df['tags'].apply(lambda x: 'vegetarian' in x)) | (df['vegan'])
    print(GREEN + "'Vegan' and 'Vegetarian' columns created successfully!" + END)

    # Remove rows where the 'name' column has missing values or the 'cuisine_tags' column contains an empty list
    print("Removing rows with missing 'name' values and empty 'cuisine_tags'...")
    df = df.dropna(subset=['name'])
    df = df[df['cuisine_tags'].astype(bool)]
    print(GREEN + "Rows with missing 'name' values and and empty 'cuisine_tags' removed successfully!" + END)

    # Drop the 'tags' column and rename columns for clarity
    print("Dropping 'tags' column and renaming columns for clarity...")
    df = df.drop('tags', axis=1)
    df = df.rename(columns={'submitted': 'submission_date', 'name': 'recipe_name', 'id': 'recipe_id'})
    print(GREEN + "'Tags' column dropped and columns renamed successfully!" + END)

    # Save the processed data frame to a CSV file
    print("Saving processed data to 'dataset.csv'...")
    df.to_csv('Data/dataset.csv', index=False)
    print(GREEN + "Data saved successfully!" + END)


if __name__ == "__main__":
    main()
