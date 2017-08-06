class Squid
{
	constructor(x, y, bodyWidth, bodyHeight)
	{
		this.velocity = 0;
		this.angle = 0;
		this.radius = bodyWidth / 2;
		this.bodyHeight = bodyHeight;
		this.bodyWidth = bodyWidth;
		this.x = x;
		this.y = y;
		this.tentacles = [];
		this.tentacleWidth = 6;
		this.numTentacles = 8;
		this.numPoints = 20;
		this.particles = [];
		this.tentacleMin = 2;
		this.tentacleMax = 10;
		this.skinColor = [255, 23, 44, 255];
		this.eyeColor = [255, 255, 255, 255];
		this.particleColor = [100,100, 255];
		this.trashEaten = [];


		let connectionX = this.x - this.radius - this.tentacleWidth;
		const incX = this.bodyWidth / (this.numTentacles - 1);

		for (let i = 0; i < this.numTentacles; i++) {
			const length = randomBetween(this.tentacleMin, this.tentacleMax);

			const tentacle = {
				length,
				connections: [],
			};

			let connectionY = this.y + this.bodyHeight;

			for (let q = 0; q < this.numPoints; q++) {
				tentacle.connections.push({
					x: connectionX,
					y: connectionY,
					oldX: connectionX,
					oldY: connectionY,
				});

				connectionY += length;
			}

			connectionX += incX;

			this.tentacles.push(tentacle);
		}
	}

	location()
	{
		return new Point2d(this.x, this.y);
	}
	
	generateParticles()
	{
		if (Math.abs(squid.velocity) > 2 && this.particles.length < 200) {
			this.tentacles.forEach((tentacle) => {
				const pos = tentacle.connections[tentacle.connections.length - 1];
				const angle = angleBetween(pos.x, pos.y, this.x, this.y);

				this.particles.push({
					x: pos.x,
					y: pos.y,
					life: 1,
					radius: 1,
					isDead: false,
					velocity: randomBetween(1, 3) * 0.5,
					angle: angle,
				});
			});
		}
	}

	loop() 
	{ 
		this.generateParticles();

		this.updateSquid();

		this.updatePoints();
		this.updateSticks();

		this.connectTentacles(); 

		this.drawParticles();

		this.drawTentacles();
		this.draw();

 	}

	draw()
	{
 		// lol vars for eyes
		const eyeXInc = Math.cos(mouse.angle) * 5;
		const eyeYInc = Math.sin(mouse.angle) * 5;

		const eyeXInc2 = Math.cos(mouse.angle) * 10;
		const eyeYInc2 = Math.sin(mouse.angle) * 10;

		ctx.save();
		
		
		ctx.translateOnCamera(this.x, this.y);
		ctx.rotate(this.angle);

		// body
		ctx.beginPath();
	
	
		ctx.fillStyle = 'rgba('+this.skinColor[0]+','+this.skinColor[1]+','+this.skinColor[2]+','+ this.skinColor[3]+')';
		ctx.lineWidth = 1;
		ctx.rect(-this.radius, 0, this.bodyWidth, this.bodyHeight);
		ctx.fill();
		ctx.closePath();

		// head
		ctx.beginPath();
		ctx.fillStyle =  'rgba('+this.skinColor[0]+','+this.skinColor[1]+','+this.skinColor[2]+','+ this.skinColor[3]+')'; 
		ctx.lineWidth = 1;
		ctx.arc(0, 0, this.radius, 0, PI2, false);
		ctx.fill();
		ctx.closePath();

		// eyes
		ctx.beginPath();
		ctx.fillStyle = 'rgba('+this.eyeColor[0]+','+this.eyeColor[1]+','+this.eyeColor[2]+','+ this.eyeColor[3]+')'; 
		ctx.arc(-15 + eyeXInc, eyeYInc, 4, 0, PI2, false);
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.fillStyle = 'rgba('+this.eyeColor[0]+','+this.eyeColor[1]+','+this.eyeColor[2]+','+ this.eyeColor[3]+')'; 
		ctx.arc(18 + eyeXInc2, eyeYInc2, 6, 0, PI2, false);
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	}

	drawParticles()
	{
		this.particles.forEach((p) => {
			p.radius *= 1.025;
			p.life *= 0.97;
			p.isDead = p.life <= 0.1;

			p.x += Math.cos(p.angle) * p.velocity;
			p.t += Math.sin(p.angle) * p.velocity;

			ctx.beginPath();
			ctx.fillStyle = `rgba(${this.particleColor[0]}, ${this.particleColor[1]}, ${this.particleColor[2]}, ${p.life})`;
			ctx.arcOnCamera(p.x, p.y, p.radius, 0, PI2, false);
			ctx.fill();
			ctx.closePath();
		});
		this.particles = this.particles.filter(p => !p.isDead);
	}

	findIntersectionAtBorder(item, line)
	{	 
		for (var i in item.edges)
		{
			var edge = item.edges[i];  
			var intersect = line.intersectsWith(edge);
			if (intersect != null)
			{ 
				return intersect;
			}
		}; 
		return null;
	}

	updatePoints()
	{
		this.tentacles.forEach((tentacle) => {
			const { connections } = tentacle;

			// update velocity and position of each point
			connections.forEach((point) => {
				const velX = point.x - point.oldX;
				const velY = point.y - point.oldY;

				point.oldX = point.x;
				point.oldY = point.y;

				point.x += velX * friction;
				point.y += velY * friction;

				point.y += gravity;
				world.getObstacles().forEach((obstacle) => {
					if (obstacle.pointIsColliding(point.x, point.y))
					{
						var pointA = new Point2d( point.oldX, point.oldY-10);
						var pointB = new Point2d( point.x, point.y);
						var intersect = this.findIntersectionAtBorder(obstacle, new Line2d(
							pointA,
							pointB)
						);
						//this.drawLineDebug(pointB, pointA);
						if (intersect)
						{  
							point.oldY, 
							point.y = intersect.y; 
							point.oldX,
							point.x = intersect.x;

						} 
					}
					
				});
			});
		});
	}

	updateSticks()
	{
		this.tentacles.forEach((tentacle) => {
			const { length, connections } = tentacle;

			// update the sticks between two points
			for (let i = 0; i < connections.length - 1; i++) {
				const from = connections[i];
				const to = connections[i + 1];

				const dx = to.x - from.x;
				const dy = to.y - from.y;

				const distance = distanceBetween(from, to);
				const difference = length - distance;
				const percent = difference / distance / 2;
				const offsetX = dx * percent;
				const offsetY = dy * percent;

				from.x -= offsetX;
				from.y -= offsetY;

				to.x += offsetX;
				to.y += offsetY;


				world.getTrash().forEach((trash) => {
					var xT = from.x + ((to.x - from.x)/2);
					var yT = from.y+((to.y - from.y)/2);

					if (trash.circleIsColliding(xT, yT, distance))
					{
						this.trashEaten.push(trash);
						world.removeTrash(trash);
					}
				});
			}
		});
	}

	updateSquid() { 

		var oldX = this.x;
		var oldY = this.y;

		//{x: this.x, y: this.y}
		var worldMousePosition =   screen2World(mouse);
		const newX = this.x + ( worldMousePosition.x - this.x) / 50;
		const velocity = this.x - newX;
		const wobble = Math.sin(velocity) *  2; 
		const newY = (this.y + (worldMousePosition.y - this.y) / 50) + wobble;
		

		this.angle = -velocity * 0.1;
		this.velocity = velocity;

		this.x = newX;
		this.y = newY;


		world.getObstacles().forEach((obstacle) => {
			if (obstacle.rectangleObstacle(this.x -this.radius, this.y , this.bodyWidth, this.bodyHeight) ||
				obstacle.circleIsColliding(this.x, this.y, this.radius))
			{
				this.y = oldY;
				this.x = oldX;
				this.velocity = 0;
			}
			
		});

		world.getTrash().forEach((trash) => {
			if (trash.rectangleObstacle(this.x -this.radius, this.y , this.bodyWidth, this.bodyHeight) ||
				trash.circleIsColliding(this.x, this.y, this.radius))
			{
				this.trashEaten.push(trash);
				world.removeTrash(trash);
			}
		});
	};
	drawLineDebug(pointA, pointB)
	{
		ctx.beginPath();
			ctx.lineWidth = "1"
			ctx.moveTo(pointA.x, pointA.y);

			ctx.lineTo(pointB.x, pointB.y);
			
			ctx.strokeStyle = "rgb(0,255, 0)";
			ctx.stroke();
			ctx.closePath();
	}

	drawTentacles()
	{
		this.tentacles.forEach((tentacle) => {
			const { connections } = tentacle;

			ctx.beginPath();
			ctx.strokeStyle = `rgba(${this.skinColor[0]},${this.skinColor[1]},${this.skinColor[2]}, ${this.skinColor[3]})`;
		
			ctx.lineWidth = this.tentacleWidth;
			ctx.lineCap = 'round';
			ctx.lineJoin ='round';
			ctx.moveToOnCamera(connections[0].x, connections[0].y);

			connections.slice(1).forEach((connector) => {
				ctx.lineToOnCamera(connector.x, connector.y);
			});

			ctx.stroke();
			ctx.closePath();
		});
	};

	connectTentacles()
	{
		let x = this.x - this.radius + (this.tentacleWidth / 2);
		let y = this.y + this.bodyHeight;
		const posInc = (this.bodyWidth - this.tentacleWidth) / (this.tentacles.length - 1);

		this.tentacles.forEach((tentacle) => {
			const connector = tentacle.connections[0];

			const angleDiff = angleBetween(this.x, this.y, x, y);
			const dx = this.x - x;
			const dy = this.y - y;
			const h = Math.sqrt((dx * dx) + (dy * dy));

			connector.x = this.x + (Math.cos(angleDiff + this.angle) * h);
			connector.y = this.y + (Math.sin(angleDiff + this.angle) * h);

			x += posInc;
		});
	}
 
}
