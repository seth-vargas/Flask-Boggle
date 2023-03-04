from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

with app.test_client() as client:
    with client.session_transaction() as sess:
        sess['board'] = Boggle().make_board()
        sess['highscore'] = 0
        sess['times_played'] = 0

        class FlaskTests(TestCase):

            # TODO -- write tests for every view function / feature!

            def test_home_route(self):
                res = client.get('/')
                self.assertEqual(res.status_code, 302)
                self.assertEqual(res.location, 'http://localhost/game')

            def test_start_game_route(self):
                res = client.get('/startGame')

            def test_game_route(self):
                res = client.get('/game')
                html = res.get_data(as_text=True)
                self.assertEqual(res.status_code, 200)
                assert sess['highscore'] == 0

            def test_finished_route(self):
                res = client.post('/finished', json={'currentScore': 23})

                assert res.status_code == 200
                assert res.get_json('highscore') == {'highscore': 23}

            def test_post_guess(self):
                res = client.post('/guess', json={'guess': 'slay'})
                html = res.get_data(as_text=True)
                response = "not on board" in html or "ok" in html or "not a word" in html

                assert res.status_code == 200
                assert response
                assert res.is_json
