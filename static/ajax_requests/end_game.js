export default function ending_questions(data){
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/add_endgame_report?data="+ JSON.stringify(data))
	xhttp.send();
}