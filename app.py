import os

from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify

from flask_sqlalchemy import SQLAlchemy

import datetime
import json
import re

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
	data = eval(request.args.get('data'))
	my_data = PlayerData(
		player=float(data['player']),
		data=data['data'],
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
	reg_b = re.compile(r"(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows ce|xda|xiino", re.I|re.M)
	reg_v = re.compile(r"1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-", re.I|re.M)
	user_agent = request.headers.get('User-Agent')
	b = reg_b.search(user_agent)
	v = reg_v.search(user_agent[0:4])
	if b or v:
		return render_template("reject.html")
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