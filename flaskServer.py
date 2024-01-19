from flask import Flask, render_template
import pandas as pd

# Write functions to retrieve the data of each plot
def load_plot2_data():
    return pd.read_csv('./Data/cuisine_stats.csv').values.tolist()

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/introduction')
def introduction():
    return render_template('introduction.html')

@app.route('/plot/<int:plot_number>')
def plot(plot_number):
    if (plot_number) == 2:
        plot_data = load_plot2_data()
        return render_template(f'plot{plot_number}.html', plot_data=plot_data)
    else:
        plot_data = load_data()
        return render_template(f'plot{plot_number}.html', plot_data=plot_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
