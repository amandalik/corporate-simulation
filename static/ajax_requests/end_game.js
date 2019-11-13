export default function ending_questions(data){
	/*$.post("/add_endgame_report", data, function(data,status){
		console.log(status);
	});*/
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "/add_endgame_report?data="+ JSON.stringify(data))
	xhttp.send();
	
    /*$.ajax({
        url: "/add_endgame_report",
        type: "POST",
        data: data,
        contentType: "application/json"
    });*/
}