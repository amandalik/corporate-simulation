import Individual from "/static/individual.js";
import Grid from "/static/grid.js";
import Location from "/static/location.js";
import Firm from "/static/firm.js";
import House from "/static/house.js";
import World from "/static/world.js";
import Instantiate from "/static/instantiate.js";
import update_world from "/static/update_world.js";
import Vector from "/static/Vector.js";
import end_game from "/static/end_game.js"
import {canvas, grid, world, instantiate, firm_1, firm_2, firm_3, firm_4, firm_5} from "/static/constants.js";
import * as tutorial from "/static/tutorial.js";
import end_game_data from "/static/ajax_requests/end_game.js"

window.is_running = true;
window.onload = () => {
	var game_data = {
		"playerType": document.getElementById("u").innerHTML, //str
		"numShareholderSelected": Number(document.getElementById("ssd").innerHTML), //int
		"numEmployeeSelected": Number(document.getElementById("emsd").innerHTML), //int
		"numEnvironmentSelected": Number(document.getElementById("ensd").innerHTML), //int
		"worldType": document.getElementById("w").innerHTML, //str
		"sim": document.getElementById("sim").innerHTML, //str
		"run_id": document.getElementById("run_id").innerHTML //str
	}

	var firms = [firm_1, firm_2, firm_3, firm_4, firm_5];
	world.state.firms = firms;

	var houses = instantiate.instantiate_houses(grid, canvas, world, firms)
	world.state.houses = houses;
	var availableHouses = houses.slice();

	var individuals = instantiate.instantiate_individuals(availableHouses, canvas, grid, world, firms)
	world.state.individuals = individuals;

	var decisions = []

	if (game_data["sim"] === 'y') {
		grid.draw();
		document.body.style.backgroundColor = 'rgb(' + 50 + ',' + 205 + ',' + 50 + ')';
	}
	else {
		document.body.style.backgroundColor = "black";
	}

	world.generateDecisions(game_data["playerType"]);

	window.is_running = false;

	var start = new Date();

	tutorial.presentTutorial(world, game_data);

	var time = 0
	var player_number = Math.random() * 1000000
	var num_decisions = 0;
	var object = {}
	setInterval(() => {
		if (window.is_running) {
			if (num_decisions < 12) {
				var decision = update_world(canvas, grid, world, firms, houses, availableHouses, individuals, time, player_number, game_data, num_decisions)
				if (decision != null) {
					if (decision.decision != 1 && decision.decision != 2) {
						console.log("this is a decision number " + decision.num_decision);
					}
					decisions.push({"decision": decision.decision, "rotation": decision.rotation})
					num_decisions += 1
				}
				time+=10;
			} else {
				decision_array = array();
				rotation_array = array();
				num_decision_array = array();
				for(var i = 0; i < 12; i++) {
					decision_array.push(decisions[i].decision)
					rotation_array.push(decisions[i].rotation)
					num_decision_array.push(i+1)
				}
				object = {
					decision: JSON.stringify(decision_array),
					player: player_number,
					playerType: game_data.playerType,
					numShareholderSelected: game_data.numShareholderSelected,
					numEmployeeSelected: game_data.numEmployeeSelected,
					numEnvironmentSelected: game_data.numEnvironmentSelected,
					worldType: game_data.worldType,
					sim: game_data.sim,
					run_id: game_data.run_id,
					num_decision: JSON.stringify(num_decision_array),
					rotation: JSON.stringify(rotation_array)
				}
				end_game_data(object)
				window.is_running = false;
				end_game(canvas, player_number, game_data, start)
			}
		}

	}, 10);
};
