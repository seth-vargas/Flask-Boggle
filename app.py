from flask import Flask, redirect, render_template, session, request
from boggle import Boggle


app = Flask(__name__)
app.config['SECRET_KEY'] = "some secret"

boggle = Boggle()

@app.route('/')
def setup_game():
    if not 'times_played' in session:
        session['times_played'] = 0
        session['highscore'] = 0

    print(session['times_played'])
    return redirect('/game')

@app.route('/game')
def index():
    session['board'] = boggle.make_board()
    return render_template('board.html')


@app.route('/guess', methods=['POST'])
def take_guess():
    session['guess'] = request.json.get('guess')
    guess = boggle.check_valid_word(session['board'], session['guess'])
    return {'result': guess}


@app.route('/finished', methods=['POST'])
def end_game():
    """ Gets highscore and increments times played """
    newest_score = int(request.json.get('currentScore'))

    session['highscore'] = newest_score if newest_score > session['highscore'] else session['highscore']
    return {'highscore': session['highscore']}


@app.route('/startGame')
def start_game():
    """ Starts game for user """
    # new_boggle = Boggle()
    session['times_played'] += 1
    board = Boggle().make_board()
    return redirect('/game')
