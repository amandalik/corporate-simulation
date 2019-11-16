import Individual from "/static/individual.js";
import Grid from "/static/grid.js";
import Location from "/static/location.js";
import Firm from "/static/firm.js";
import House from "/static/house.js";
import World from "/static/world.js";
import Vector from "/static/Vector.js";
import Decision from "/static/decision.js";
import end_game_data from "/static/ajax_requests/end_game.js"



function drawIndividuals(individuals){
	for(let i = 0; i < individuals.length; i++){
		individuals[i].draw();
	}
}

function individual_movement(individuals, time){
	let time_this_round = time%3000;
	if(time_this_round < 1250){
		move_individuals_to_firm(individuals)
	} else if (time_this_round > 1250){
		move_individuals_to_home(individuals)
	}
	drawIndividuals(individuals)
}

function move_individuals_to_firm(individuals) {
	let delta = 10;
	for (let i = 0; i < individuals.length; i++) {
		let temp = individuals[i].vector.moveTowards(individuals[i].state.firm.state.vector, delta)
		individuals[i].vector.x = temp.x
		individuals[i].vector.y = temp.y
	}
}

function move_individuals_to_home(individuals) {
	let delta = 10;
	for (let i = 0; i < individuals.length; i++) {
		let temp = individuals[i].vector.moveTowards(individuals[i].state.house.state.vector, delta*(Math.random()))
		individuals[i].vector.x = temp.x
		individuals[i].vector.y = temp.y
	}
}

function draw(context, individuals, grid) {
	let x = 10;
	let y = 100;
	context.beginPath();
	context.arc(x, y, 16, 0, 2 * Math.PI);
	context.fillStyle = 'rgba(250,0,0,0.4)';
	x += 2;
	y += 2;
	context.fillStyle = "rgba(34,45,23,0.4)";
	grid.draw();
}


function update_individuals(individuals, income){
	let response = [0,0,0,0,0];
	for (let i = 0; i < individuals.length; i++){
		response[individuals[i].state.number] += individuals[i].update(income);
	}
	return response;
}

function update_firms(firms, purchases_per_firm, revenue){
	for(let i = 0; i < firms.length; i++){
		firms[i].update(purchases_per_firm[i], 10, 100, revenue); //10 is resource increase and 100 is expenses
	}
}

function is_decision_making(time){
	if (time != 0)
	{
		return time%6000 == 0
	}
}

function is_decision_making_no_sim(time){
	if (time != 0)
	{
		return time%2000 == 0
	}
}

function is_time_to_update_grid(time){
	return time%1500 == 0
}

function update_grid(grid, world, firms, houses, availableHouses, individuals){
	for(let i = 0; i < world.state.individuals.length; i++){
		world.state.individuals[i].update(availableHouses)
	}
	let waste_per_firm = new Array();
	for(let i = 0; i < world.state.firms.length; i++){
		waste_per_firm.push(world.state.firms[i].update())
	}
	grid.update(waste_per_firm, firms)
}

function present_decision(world, player_number, game_data, num_decisions){
	/******************** The JSON object, data, is instantiated here, but is filled out over the period of this function. ********************/
	window.is_running = false;
	let data = {
		prev_a: world.state.firms[4].state.importances.spImportance,
		prev_b: world.state.firms[4].state.importances.ewImportance,
		prev_c: world.state.firms[4].state.importances.eiImportance,
		x_1: 0,
		y_1: 0,
		z_1: 0,
		V_1: 0,
		x_2: 0,
		y_2: 0,
		z_2: 0,
		V_2: 0,
		decision: 0,
		new_a: 0,
		new_b: 0,
		new_c: 0,
		player: player_number,
		playerType: game_data.playerType,
		numShareholderSelected: game_data.numShareholderSelected,
		numEmployeeSelected: game_data.numEmployeeSelected,
		numEnvironmentSelected: game_data.numEnvironmentSelected,
		worldType: game_data.worldType,
		sim: game_data.sim,
		run_id: game_data.run_id,
		num_decision: num_decisions,
		rotation: "fixed"
	}

	let index = Math.floor(Math.random() * world.all_decisions.length)
	let decisions = world.all_decisions.splice(index, 1)[0];

	if (Math.random() >= 0.5) {
		let temp = decisions[0];
		decisions[0] = decisions[1];
		decisions[1] = temp;
		data.rotation = "reversed";
	}

	data.x_1 = decisions[0].impacts.sharePrice;
	data.y_1 = decisions[0].impacts.employeeWage;
	data.z_1 = decisions[0].impacts.environmentalImpact;
	data.V_1 = world.state.firms[4].state.importances.spImportance * decisions[0].impacts.sharePrice + world.state.firms[4].state.importances.ewImportance * decisions[0].impacts.employeeWage + world.state.firms[4].state.importances.eiImportance * decisions[0].impacts.environmentalImpact;
	data.x_2 = decisions[1].impacts.sharePrice;
	data.y_2 = decisions[1].impacts.employeeWage;
	data.z_2 = decisions[1].impacts.environmentalImpact;
	data.V_2 = world.state.firms[4].state.importances.spImportance * decisions[1].impacts.sharePrice + world.state.firms[4].state.importances.ewImportance * decisions[1].impacts.employeeWage + world.state.firms[4].state.importances.eiImportance * decisions[1].impacts.environmentalImpact;
	data.num_decision = decisions[0].num_decision;

	for (let i = 1; i < world.state.firms.length; i++) {
		world.state.firms[i].implement_decision(world.state.firms[i].makeDecision(decisions), 0.1);
	}
	var text = {
		"ssd": "Please keep in mind you that you were selected by shareholders.",
		"emsd": "Please keep in mind you that you were selected by employees.",
		"ensd": "Please keep in mind you that you were selected by environmental consultants."
	}

	let law = ""
	if (game_data["worldType"] == "a") {
		law = '"Directors shall manage the corporation in a way that balances the financial interests of its shareholders with the best interests of persons that are materially affected by the conduct of the corporation. In doing so, directors shall consider the effects of any action or inaction on the shareholders of the corporation; the employees of the corporation; and the environment. Directors shall not be required to give priority to a particular interest or factor [for example, shareholders, employees, or the environment] over any other interest or factor."'
	}
	else {
		law = '"Directors owe a fiduciary duty of loyalty and duty of care to the corporation and its shareholders. Directors must act in good faith to advance the best interests of the corporation. The corporation may undertake any lawful business by any lawful means. Directors must exercise good-faith efforts to ensure that the corporation complies with laws applicable to its operations (such as environmental, labor, and criminal laws). Directors are prohibited from using their positions to advance their own personal interests."'
	}

	Swal.fire({
	  title: 'Time for director decision ' + (num_decisions + 1).toString() + ' out of 12!',
	  html: '<div style="text-align: left; margin-top: 3vh;  margin-right: 2vw; margin-bottom: 5.5vh; margin-left: 2vw;">The two charts below show which of the three elements (shareholder benefit, employee benefit, and environmental benefit) will be favored most by each possible decision. Weigh your decision carefully and click Decision 1 or Decision 2 to continue. ' +
	  		text[game_data.playerType] + 
	  		'<br><br> <div style="font-size: 14px; margin-top: 0.5vh;">Here is a brief summary of the applicable law: ' +  law + '</div></div>' + 
	        '<div class="decisionChartsContainer" style="width: 30vw; display: inline;">' + 
	        '<button type="button" style="margin-right: 2.25vw; margin-bottom: 3vh; cursor: pointer; padding: 2vh 2vw 2vh 2vw;" id="chart1Button"><h4 style="text-align: center">Decision 1</h4>' +
	        '<div class="ct-chart" id="chart1"></div></button>' + 
	       	'<button type="button" id="chart2Button" style="cursor: pointer; padding: 2vh 2vw 2vh 2vw;"><h4 style="text-align: center">Decision 2</h4>' +
	        '<div class="ct-chart" id="chart2"></div></button></div>',
	  // background: 'rgba(255, 255, 255, 0.3)',
	  width: 1325,
	  padding: '2.5em',
	  showConfirmButton: false,
	  showCancelButton: false,
	  confirmButtonColor: '#808080',
 	  cancelButtonColor: '#808080',
 	  confirmButtonText: 'Decision 1',
 	  cancelButtonText: 'Decision 2',
	  allowOutsideClick: false,
	  allowEscapeKey: true,
	  allowEnterKey: false,
	  animation: false,
	  onBeforeOpen: () => {
	    var d = {
	    	labels: ['Shareholder Benefit', 'Employee Benefit', 'Environmental Benefit'],
	    	series: [[decisions[0].impacts.sharePrice, decisions[0].impacts.employeeWage, decisions[0].impacts.environmentalImpact]]
	    };
	    var options = {
	    	high: 1.0,
	    	width: '505px'
	    };

	    new Chartist.Bar("#chart1", d, options);

	    d = {
	    	labels: ['Shareholder Benefit', 'Employee Benefit', 'Environmental Benefit'],
	    	series: [[decisions[1].impacts.sharePrice, decisions[1].impacts.employeeWage, decisions[1].impacts.environmentalImpact]]
	    };

	    new Chartist.Bar("#chart2", d, options);

	    Swal.getContent().querySelectorAll("#chart1Button")[0].onclick = () => {
	    	window.is_running = true;
			var decisionMade = decisions[0];
			data.decision = 1;
			world.state.firms[0].updateImportance(decisionMade)
			world.state.firms[0].implement_decision(decisionMade);
			world.state.firms[4].updateImportance(decisionMade);
			data.new_a = world.state.firms[4].state.importances.spImportance;
			data.new_b = world.state.firms[4].state.importances.ewImportance;
			data.new_c = world.state.firms[4].state.importances.eiImportance;
			Swal.close()
	    }

	    Swal.getContent().querySelectorAll("#chart2Button")[0].onclick = () => {
	    	window.is_running = true;
			var decisionMade = decisions[1];
			data.decision = 2;
			world.state.firms[0].updateImportance(decisionMade)
			world.state.firms[0].implement_decision(decisionMade);
			world.state.firms[4].updateImportance(decisionMade);
			data.new_a = world.state.firms[4].state.importances.spImportance;
			data.new_b = world.state.firms[4].state.importances.ewImportance;
			data.new_c = world.state.firms[4].state.importances.eiImportance;
			Swal.close()
		}
	  }
	});
	return data
}


export default function update_world(canvas, grid, world, firms, houses, availableHouses, individuals, time, player_number, game_data, num_decisions) {
	const context = canvas.getContext("2d");
	context.clearRect(0,0, canvas.width, canvas.height);
	if(game_data.sim == 'y') {
		if(is_decision_making(time)){
			var decision = present_decision(world, player_number, game_data, num_decisions);
			draw(context, individuals, grid);
			individual_movement(individuals,time);
			return decision;
		} else if(is_time_to_update_grid(time)){
			update_grid(grid, world, firms, houses, availableHouses, individuals);
			draw(context, individuals, grid);
			individual_movement(individuals,time);
			return null;
		} else {
			draw(context, individuals, grid);
			individual_movement(individuals,time);
			return null;
		}
	} else {
		if (is_decision_making_no_sim(time)) {
			return present_decision(world, player_number, game_data, num_decisions);
		} else {
			return null;
		}
	}
}
