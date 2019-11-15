export default function final_questions(data){
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/final_questions?data="+ JSON.stringify(data))
	xhttp.send();
}