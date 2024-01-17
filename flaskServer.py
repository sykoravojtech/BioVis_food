from flask import Flask, render_template

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
    return render_template(f'plot{plot_number}.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
