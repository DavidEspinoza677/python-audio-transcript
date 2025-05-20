from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    transcripcion = "Aquí va el texto transcrito"
    return render_template('index.html', transcripcion=transcripcion)

if __name__ == '__main__':
    app.run(debug=True)
