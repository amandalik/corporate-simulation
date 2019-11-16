import Grid from "/static/grid.js";
import Location from "/static/location.js";
import Vector from "/static/Vector.js";

export default class House {
	constructor(props) {
		this.state = {
			canvas: props.canvas,
			grid: props.grid,
			row: props.row,
			col: props.col,
			vector: new Vector(props.col*16, props.row*16),
			world: props.world,
			firm: props.firm,
			tenant: props.tenant,
			rent: props.rent,
		};
		this.state.grid.get_location(this.state.row, this.state.col).add(this);
	}

	draw() {

		if (this.img == null){
			this.img = new Image(16, 16);
			this.img.src = '/static/house.png';
		}
		const context = this.state.canvas.getContext('2d');
		context.drawImage(this.img, this.state.vector.x, this.state.vector.y);
	}
}
