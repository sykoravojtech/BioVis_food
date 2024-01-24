from flask import Flask, render_template
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

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/introduction')
def introduction():
    return render_template('introduction.html')

@app.route('/plotheatmap')
def plotheatmap():
    plot_data = load_plot1_data()
    return render_template('plotheatmap.html',plot_data=plot_data)

@app.route('/plotgeomaps')
def plotgeomaps():
    plot_data = load_plot1_data()
    return render_template('plotgeomaps.html',plot_data=plot_data)

@app.route('/plot/<int:plot_number>')
def plot(plot_number):
    if (plot_number) == 1:
        return render_template(f'plot{plot_number}.html')
    elif (plot_number) == 2:
        plot_data = load_plot2_data()
        return render_template(f'plot{plot_number}.html', plot_data=plot_data)
    elif(plot_number) == 3:
        return render_template(f'plot{plot_number}.html', plot_data="'../static/plot3/popularity.csv'")
    else:
        plot_data = load_data()
        return render_template(f'plot{plot_number}.html', plot_data=plot_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
