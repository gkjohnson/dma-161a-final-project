function renderSquare(setx,sety,setId){
	//variables 	
	this.x=setx; //x value of upper left corner
	this.y=sety; //y value of upper left corner

	this.id=setId //square id

	this.invalid=false; //is invalid?
	this.invalid2=false;
	
	this.highlight=false; //is highlighted?
	
	this.toDraw=new Array();
	this.numToDraw=0;
	
	//functions
	this.invalidate=renderSquareInvalidate; //sets the square to invalid and to be drawn
	this.redraw=renderSqRedraw; //clear square and rerender it
	this.drawSelf=renderSquareDrawSelf; //draw outline of self -- used to draw grid
	this.isWithin; //checks if an object is within the square. Only a few things will need to be checked
}
//invalidate the square to be redrawn
function renderSquareInvalidate(){
	this.invalid=true; //invalidate square
	this.highlight=true;

	invSq[amtInvSq]=this;
	amtInvSq++;
}

function renderSqRedraw(c){
	c.fillStyle=innerBgColor;
	c.fillRect(this.x,this.y,BLOCKSIZE,BLOCKSIZE);
	if(this.invalid){
		this.invalid=false;
		this.invalid2=true;
	}else if(this.invalid2){
		this.invalid2=false;	
	}
	//will need to redraw background that is only in this sq
}
//draws the grid of squares 
function renderSquareDrawSelf(c){
	c.lineWidth=1;
	c.strokeStyle="#000000";
	
	
	if(this.invalid||this.invalid2){
		c.strokeStyle="#ffcc00";
		c.lineWidth=1;
	}
	
	
	c.strokeRect(this.x+.5,this.y+.5,BLOCKSIZE,BLOCKSIZE);	
}

//draw all invalid squares
function drawInvalidSq(c){
	//cycle through the invalid squares and redraw whats needed. Dehighlight what's needed and set invalidate param=false; Only draw the square if invalid is set, do not rely on invalid param
	for(var i=0; i<totalSqW;i++){
		for(var j=0; j<totalSqH;j++){
			if(rendBlocks[i][j].invalid||rendBlocks[i][j].invalid2){
				rendBlocks[i][j].redraw(c);
			}
		}
	}
}

// return a block that contains the input point
function getSq(x,y){
	//check which block contains which value
	
	x=Math.floor(x/BLOCKSIZE);
	y=Math.floor(y/BLOCKSIZE);

	return rendBlocks[x][y];

}

//initialize blocks and array
function sqSetup(width,height){
	//determine how many blocks there should be in each row
	width=Math.floor(width/BLOCKSIZE);
	height=Math.floor(height/BLOCKSIZE);
	
	var sqId=0;
	
	for(var i=0; i<width; i++){
		//create an array of arrays to hold all the blocks
		rendBlocks[i]=new Array(height);
		
		for(var j=0; j<height; j++){
			//put a new renderSquare object in each spot
			rendBlocks[i][j]=new renderSquare(i*BLOCKSIZE,j*BLOCKSIZE,sqId++);
		}
	}
	totalSqW=width;
	totalSqH=height;
}

//draw renderSquare render region
function drawAllBlocks(c){
	for(var i=0;i<totalSqW;i++){
		for(var j=0;j<totalSqH; j++){
			rendBlocks[i][j].drawSelf(c);
		}
	}
	
	for(var i=0;i<totalSqW;i++){
		for(var j=0;j<totalSqH; j++){
			if(rendBlocks[i][j].invalid||rendBlocks[i][j].invalid2)rendBlocks[i][j].drawSelf(c);
		}
	}
}

function invalidateAll(){
	for(var i=0; i<totalSqW;i++){
		for(var j=0; j<totalSqH;j++){
			rendBlocks[i][j].invalidate();
		}
	}
}