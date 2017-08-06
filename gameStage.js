let w; 
let h;  

const border = 250;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const PI2 = Math.PI * 2;

const mouse = { x: 0, y: 0, angle: 0 };
const gravity = 0.1;
const friction = 0.95;

const distanceBetween = (p1, p2) => Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
const angleBetween = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);
const randomBetween = (min, max) => ~~((Math.random() * (max - min + 1)) + min);

const newXInWorld =(width) => 50+Math.random() * (width-100);
const newYInWorld =(height) => 50+Math.random() * (height-100);

let camera = new Point2d(0,0);

ctx.translateOnCamera = function(x, y)
{ 	
	this.translate(x-camera.x, y-camera.y);
}

ctx.moveToOnCamera = function(x, y)
{ 	
	this.moveTo(x-camera.x, y-camera.y);
}

ctx.lineToOnCamera = function(x, y)
{ 	
	this.lineTo(x-camera.x, y-camera.y);
}

ctx.arcOnCamera = function(x, y, radius, startAngle, endAngle, antiClockwise)
{
	this.arc(x-camera.x, y-camera.y, radius, startAngle, endAngle, antiClockwise);
}

const clear = () => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const cameraMove = () => {  
	var cameraMove = 5;
	if (mouse.x < border && camera.x > 0){ 
		camera.x -= cameraMove;
	}
	
	if (mouse.x > w-border && camera.x < world.width){
		camera.x += cameraMove;
	}
	if (mouse.y < border && camera.y > 0){
		camera.y -= cameraMove;
	}
	if (mouse.y > h-border && camera.y < world.height){
		camera.y += cameraMove;
	}  
}	


const loop = () => {
	clear();

	world.draw();
	squid.loop();
	cameraMove();

	drawHUD();

	requestAnimationFrame(loop);
};

const drawHUD = () => {

	ctx.font = '18px arial';
	ctx.fillStyle = "black";
  	ctx.fillText(`Trash collected: ${squid.trashEaten.length}`, 10, 20);

}

const onResize = () => {
	w = window.innerWidth;
	h = window.innerHeight;
  
	canvas.width = w;
	canvas.height = h;
};

const screen2World = (point) => {

	return new Point2d(camera.x + point.x, camera.y + point.y);
}

const world2Screen = (point) => {

	return new Point2d(point.x-camera.x, point.y - camera.y);
}

const updateStage = () => {
	onResize();
 
	world = new World({
		width: 8000,
		height: 8000,
		obstacleAmount: 40,
		trashAmount: 40
	});

	mouse.x = 200;
	mouse.y = 200;

	world.obstacles.forEach((obstacle)=>{
                while(obstacle.circleIsColliding(mouse.x, mouse.y, 20))
                {
                    xSquid = newXInWorld(w);
                    ySquid = newYInWorld(h);

                }
            });
    squid = new Squid(150,
                    150, 
                    60, 
                    50); 

	
};

window.addEventListener('resize', onResize);
updateStage();
loop();

const onPointerMove = (e) => {
	const target = (e.touches && e.touches.length) ? e.touches[0] : e;
	const { clientX: x, clientY: y } = target;

	mouse.x = x;
	mouse.y = y;
	mouse.angle = angleBetween(squid.x, squid.y, mouse.x, mouse.y);
	 
};


canvas.addEventListener('mousemove', onPointerMove);
canvas.addEventListener('touchmove', onPointerMove);
