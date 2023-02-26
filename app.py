from boggle import Boggle

boggle_game = Boggle()

from flask import Flask, redirect, render_template, session

app = Flask(__name__)

app.config['SECRET_KEY'] = "some secret"

@app.route('/')
def index():
    board = Boggle()
    session['board'] = board.make_board()
    return render_template('board.html', board=session['board'])


