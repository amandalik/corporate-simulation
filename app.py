import os

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

from flask_sqlalchemy import SQLAlchemy

import datetime
import json

app = Flask(__name__)
project_dir = os.path.dirname(os.path.abspath(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = "postgres://uqwimazydusmui:5f14a17a1a37ea0042a05bea4a944546f483b5c182a72106cd4d0ea9e28473f4@ec2-174-129-226-234.compute-1.amazonaws.com:5432/df5hgfd3u2jon1"
db = SQLAlchemy(app)

class PlayerData(db.Model):
	__tablename__ = 'PLAYER_DATA'
	player=db.Column(db.Float, unique=False, nullable=False, primary_key=False)
	data=db.Column(db.String(), unique=False, nullable=False, primary_key=False)
	time=db.Column(db.String(100), unique=True, nullable=False, primary_key=True)

	def __repr__(self):
		return str(self.__dict__)

class DecisionData(db.Model):
	__tablename__ = 'DECISIONS'
	player=db.Column(db.Float, unique=False, nullable=False, primary_key=False)
	playerType=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	numShareholderSelected=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	numEmployeeSelected=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	numEnvironmentSelected=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	worldType=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	sim=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	run_id=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	decision_number=db.Column(db.Integer, unique=False, nullable=False, primary_key=False)
	choice=db.Column(db.String(10), unique=False, nullable=False, primary_key=False)
	rotation=db.Column(db.String(10), unique=False, nullable=False, primary_key=False)
	row=db.Column(db.Integer, unique=True, nullable=False, primary_key=True)


class EndQuestions(db.Model):
	__tablename__ = 'ENDGAME'
	player=db.Column(db.Float, unique=False, nullable=False, primary_key=True)
	run_id=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	playerType=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	numShareholderSelected=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	numEmployeeSelected=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	numEnvironmentSelected=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	worldType=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	sim=db.Column(db.String(100), unique=False, nullable=False, primary_key=False)
	q1=db.Column(db.String(1500), unique=False, nullable=False, primary_key=False)
	q2=db.Column(db.String(1500), unique=False, nullable=False, primary_key=False)
	q3=db.Column(db.String(1500), unique=False, nullable=False, primary_key=False)
	q4=db.Column(db.String(1500), unique=False, nullable=False, primary_key=False)
	q5=db.Column(db.String(1500), unique=False, nullable=False, primary_key=False)
	q6=db.Column(db.String(1500), unique=False, nullable=False, primary_key=False)
	q7=db.Column(db.String(1500), unique=False, nullable=False, primary_key=False)
	q8=db.Column(db.String(1500), unique=False, nullable=False, primary_key=False)
	time_taken=db.Column(db.Integer, unique=False, nullable=False, primary_key=False)

db.create_all()

@app.route("/add_endgame_report", methods=["POST"])
def add_endgame_report():
	print(request.args)
	my_data = PlayerData(
		player=request.args.get('player', type=str),
		data=request.args.get('data', type=str),
		time=str(datetime.datetime.now()).rstrip("\n")
	)
	db.session.add(my_data)
	db.session.commit()
	return "done"

@app.route("/final_questions", methods=["POST"])
def final_questions():
	print(request.args)	
	data = request.args.get("data")
	endgame = eval(data)
	temp = EndQuestions(
		player=endgame["player"],
		playerType=endgame["playerType"],
		sim=endgame["sim"],
		run_id=endgame["run_id"],
		numShareholderSelected=endgame["numShareholderSelected"],
		numEmployeeSelected=endgame["numEmployeeSelected"],
		numEnvironmentSelected=endgame["numEnvironmentSelected"],
		worldType=endgame["worldType"],
		time_taken=endgame["time_taken"],
		q1=endgame["1"],
		q2=endgame["2"],
		q3=endgame["3"],
		q4=endgame["4"],
		q5=endgame["5"],
		q6=endgame["6"],
		q7=endgame["7"],
		q8=endgame["8"]
	)
	db.session.add(temp)
	db.session.commit()
	return "done"

@app.route("/", methods=["GET", "POST"])
def start():
	data = {
		'ssd': request.args.get('ssd', default = 6, type = int),
		'emsd': request.args.get('emsd', default = 4, type = int),
		'ensd': request.args.get('ensd', default = 0, type = int),
		'u': request.args.get('u', default = "emsd", type = str),
		'w': request.args.get('w', default = "d", type = str),
		'sim': request.args.get('sim', default = "y", type = str),
		'run_id': request.args.get('run_id', default = "test", type = str)
	}
	return render_template("index.html", data=data)


if __name__ == "__main__":
	app.run(debug=True)