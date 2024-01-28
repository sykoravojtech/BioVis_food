from flask import Flask, render_template, request
import pandas as pd
import json
from utils import get_top_n_ingredients

# Write functions to retrieve the data of each plot
def load_plot2_data():
    return pd.read_csv('./Data/cuisine_stats.csv').values.tolist()

def load_plot1_data(): # heatmap
    with open("static/plot1/cuisine_ingredient_percentages.json", 'r') as file:
        ingredient_perc_dict = json.load(file)
    
    # Remove the basic ingredients like salt and water
    # filtered_cuisine_ingredient_dict = filter_out_ingredients(ingredient_perc_dict, 
    #                                                           ignore_these=["salt", "water", "sugar"])
    
    # New dictionary for top 5 ingredients of each cuisine
    top_ingredients_dict = get_top_n_ingredients(ingredient_perc_dict, 5)
    # print(top_ingredients_dict)
    return top_ingredients_dict

def load_selection_data():
    all_cols = pd.read_csv('./Data/cuisine_stats.csv').values.tolist()
    cuisines = [row[:2] for row in all_cols]
    dictionary_cuisines = {}
    for pair in cuisines:
        elem = dictionary_cuisines.get(pair[1], [])
        elem.append(pair[0])
        dictionary_cuisines.update({pair[1]: elem})
    # print(dictionary_cuisines)
    return dictionary_cuisines

# Global variable to store selected cuisines
selected_cuisines = []
cuisines = load_selection_data()

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/')
def index():
    global cuisines
    return render_template('base.html', cuisines = cuisines)

@app.route('/introduction')
def introduction():
    # cuisines = load_selection_data()
    return render_template('introduction.html', cuisines = cuisines)

@app.route('/submit_cuisines', methods=['POST'])
def submit_cuisines():
    global selected_cuisines
    selected_cuisines = request.form.getlist('selected_cuisines')
    # print(selected_cuisines)
    return plot(request.form.get('plot_number'))

@app.route('/plotheatmap')
def plotheatmap():
    plot_data = load_plot1_data()
    return render_template('plotheatmap.html',plot_data=plot_data, selected_cuisines = selected_cuisines, cuisines = cuisines,  plot_number = 1)

@app.route('/plotgeomaps')
def plotgeomaps():
    plot_data = load_plot1_data()
    return render_template('plotgeomaps.html',plot_data=plot_data, selected_cuisines = selected_cuisines, cuisines = cuisines,  plot_number = 1)

@app.route('/plot/<int:plot_number>')
def plot(plot_number):
    global selected_cuisines
    global cuisines
    if (plot_number) == 1:
        return render_template(f'plot{plot_number}.html', selected_cuisines = selected_cuisines, cuisines = cuisines, plot_number = plot_number)
    elif (plot_number) == 2:
        plot_data = load_plot2_data()
        return render_template(f'plot{plot_number}.html', plot_data=plot_data, selected_cuisines = selected_cuisines, cuisines = cuisines, plot_number = plot_number)
    elif(plot_number) == 3:
        return render_template(f'plot{plot_number}.html', plot_data="'../static/plot3/popularity.csv'", selected_cuisines = selected_cuisines, cuisines = cuisines, plot_number = plot_number)
    else:
        return render_template(f'plot{plot_number}.html', selected_cuisines = selected_cuisines, cuisines = cuisines, plot_number = plot_number)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
