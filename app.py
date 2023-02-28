from flask import Flask, redirect, render_template, session, request
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "some secret"

boggle_game = Boggle()
b = Boggle()
board = b.make_board()

@app.route('/')
def index():
    session['board'] = board
    return render_template('board.html')

@app.route('/guess', methods=['POST'])
def take_guess():
    session['guess'] = request.json.get('guess')
    guess = b.check_valid_word(board, session['guess'])
    return {'result': guess}

    # if guess == 'ok':
    #     # word exists and is valid
    #     # result = {'result': 'ok'}
    #     result = 'ok'

    # elif guess == "not-on-board":
    #     # word exists but is not on board
    #     # result = {'result': 'not on board'}
    #     result = 'not on board'
    # else:
    #     # entry is not a word
    #     # result = {'result': 'not a word'}
    #     result = 'not a word'
