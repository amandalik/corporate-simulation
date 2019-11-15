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
	// @Ameya, store "[" + decisions.toString() + "]"

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
				var decision = update_world(canvas, grid, world, firms, houses, availableHouses, individuals, time, player_number, game_data, num_decisions);
				if (decision != null) {
					decisions.push(decision)
					num_decisions += 1;
					if (num_decisions == 5) {
						object = {"data": JSON.stringify(decisions)};
						end_game_data(object)
						decisions = []
					}
					if (num_decisions == 11) {
						object = {"data": JSON.stringify(decisions)};
						end_game_data(object)
					}
				}
				time+=10;
			} else {
				window.is_running = false;
				end_game(canvas, player_number, game_data, start)
			}
		}

	}, 10);
};
