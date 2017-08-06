class Point2d
	{
		constructor(x, y)
		{
			this.x = x;
			this.y = y;
		}
		 
		
		toString()
		{
			return `[${this.x}, ${this.y}]`
		}
	}
	
	class Line2d
	{
		constructor(start, end)
		{
			this.start = start;
			this.end = end;			
		}
		
		intersectsWith(line)
		{ 
			var d = this.denominator(line);
			if (d == 0) return null;
			var a = this.start.y - line.start.y;
			var b = this.start.x - line.start.x;
			var n1 = ((line.end.x - line.start.x) * a) - ((line.end.y - line.start.y) *b);
			var n2 = ((this.end.x - this.start.x) * a) - ((this.end.y - this.start.y) *b);
			a = n1 / d;
			b = n2 / d; 
			if ((a > 0 && a < 1) && (b > 0 && b < 1))
			{
				return new Point2d(
					 this.start.x + (a * (this.end.x - this.start.x)),
					 this.start.y + (a * (this.end.y - this.start.y)),
				);
			}
		 
			return null;
		}
		
		denominator(line) 
		{
			var denominator = ((line.end.y - line.start.y) * (this.end.x - this.start.x))- 
							  ((line.end.x - line.start.x) * (this.end.y - this.start.y));
		
			return denominator;
		}
		
		toString()
		{
			return `${this.start} to ${this.end}`
		}
	} 

