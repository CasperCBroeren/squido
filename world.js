class World
{
    
    constructor(options)
    {
        this.trash = [];
        this.obstacles = [];
        this.width = options.width;
        this.height = options.height;

        for (var i =0; i < options.obstacleAmount; i++)
        {
            var oWidth = (Math.random() * 500)+100;
            var oHeight = (Math.random() * 150)+50;
            
            var x = newXInWorld(this.width); 
            var y = newYInWorld(this.height); 
            this.obstacles.push( new RectangleObstacle(new Point2d(x, y), oWidth, oHeight));
        }
        for (var i=0; i< options.trashAmount; i++)
        { 
            var x = newXInWorld(this.width); 
            var y = newYInWorld(this.height);

            this.obstacles.forEach((obstacle)=>{
                while(obstacle.circleIsColliding(x, y, 20))
                {
                    x = newXInWorld(this.width);
                    y = newYInWorld(this.height);

                }
            });
            
            this.trash.push(new Trash(new Point2d(x, y)));
        }
    }
    

    getObstacles()
    {
        return this.obstacles;
    }

    getTrash()
    {
        return this.trash;
    }

    removeTrash(t)
    {
        this.trash.splice(this.trash.indexOf(t),1);    
    }
    
    draw()
    {
        // culling?
        this.obstacles.forEach((obstacle) => {
            ctx.save(); 
		    ctx.translateOnCamera(obstacle.location.x, obstacle.location.y);
            ctx.beginPath();
	
        
            ctx.fillStyle = 'rgb(43, 184,87)';
            ctx.lineWidth = 1;
            ctx.rect(0, 0, obstacle.width, obstacle.height);
            ctx.fill();
            ctx.closePath();


		    ctx.restore();
        });

        this.trash.forEach((t) => {
            ctx.save();
		    ctx.translateOnCamera(t.location.x, t.location.y);
            ctx.beginPath();
	
        
            ctx.fillStyle = 'rgb(55, 55,55)';
            ctx.lineWidth = 1;		
            ctx.arc(0, 0, 10, 0, PI2, false);

            ctx.fill();
            ctx.closePath();


		    ctx.restore();
        });
    }
}

class WorldObject
{
    constructor(location)
    {
        this.location = location;
    }

    pointIsColliding(x,y)
    {
        return (y > this.location.y  && y < this.location.y + this.height) &&
                (x > this.location.x   && x < this.location.x + this.width);
    }

    rectangleObstacle(x,y, width, height)
    {
        return this.pointIsColliding(x,y) || this.pointIsColliding(x,y+height) || this.pointIsColliding(x+width, y+height) || this.pointIsColliding(x+width, y);
    }

    circleIsColliding(x,y, radius)
    {
        var distX = Math.abs(x - this.location.x-this.width/2);
        var distY = Math.abs(y - this.location.y-this.height/2);

        if (distX > (this.width/2 + radius)) { return false; }
        if (distY > (this.height/2 + radius)) { return false; }

        if (distX <= (this.width/2)) { return true; } 
        if (distY <= (this.height/2)) { return true; }

        var dx=distX-this.width/2;
        var dy=distY-this.height/2;
        return (dx*dx+dy*dy<=(radius*radius));

    }
}

class Trash extends WorldObject
{
    constructor(location)
    {
        super(location);
        this.width = 40;
        this.height = 40;
    } 
}

class RectangleObstacle extends WorldObject
{
    constructor(location, width, height)
    {
        super(location); 
        this.width = width;
        this.height = height;
        this.edges = [
            new Line2d(new Point2d(this.location.x, this.location.y), new Point2d(this.location.x + width, this.location.y)),
            new Line2d(new Point2d(this.location.x+width, this.location.y), new Point2d(this.location.x+width, this.location.y+height)),
            new Line2d(new Point2d(this.location.x+width, this.location.y+height), new Point2d(this.location.x, this.location.y+height)),
            new Line2d(new Point2d(this.location.x, this.location.y+height), new Point2d(this.location.x,this.location.y)),
        ];
    }

  
}