var STANDBY=0; //game is not playing -- in regular mode to see gallery etc
var PLAYING=1;
var GAMEOVER=2;
var GALLERY=3;

var gameStop=false;


var STD_GAME_TIME=2000;
var MAX_COMBO_TIMER=100;

function gameInfo(){
	//info / variables
	this.time=0;
	this.comboCount=1;
	this.comboTimer=0;
	this.points=0;
	
	this.status=STANDBY;

	//functions
	this.addPoint=gameAddPoint;
	this.incCombo=gameIncCombo;
	this.resetComboTimer=gameResetComboTimer;
	this.calcTime=gameCalcTime;
	this.calculate=gameCalc;
	this.resetStats=gameResetStats;
	this.start=gameStart;
}

function gameCalcTime(){
	if(this.time>0)this.time--;
}

function gameCalc(){

	if(this.status!=PLAYING)return;
		
		
		
	this.calcTime();
	this.comboTimer--;
	if(this.comboTimer==0)this.comboCount=1;
	if(this.time==0&&this.status==PLAYING){
		this.status=GAMEOVER;
		gameOver(c);
	}
	
	
}

function gameIncCombo(wpnType){
	if(this.status!=PLAYING)return;
	
	if(wpnType!=guns["FLAME"])this.comboCount++;
	this.resetComboTimer();
}

function gameResetComboTimer(){
	if(this.status!=PLAYING)return;
	
	this.comboTimer=MAX_COMBO_TIMER;
}

function gameAddPoint(pnt,multiplier){
	if(this.status!=PLAYING)return;

	this.points+=pnt*this.comboCount*(multiplier);

	return pnt*this.comboCount*(multiplier);
}

function gameResetStats(setStatus){
	if(setStatus==PLAYING){
		this.time=STD_GAME_TIME;
		resetAllElements();
		this.points=0;

	}
	this.comboCount=1;
	this.comboTimer=0;

	this.status=setStatus;
}

function gameStart(){
	if(this.status==PLAYING||pause){
		return;
	}else if(this.status==GAMEOVER){
		this.resetStats(STANDBY);
		invalidateAll();
		return;
	}else if(this.status==STANDBY){
		this.resetStats(PLAYING);
		return;
	}
}

function pauseGame(c){
	if(game.status==GAMEOVER)return;
	if(pause){
		pause=false; //P
		invalidateAll();
	}else if(!pause){
		pause=true;
		c.fillStyle="rgba(0,0,0,.75)";
		c.fillRect(0,0,canvasW,canvasH);
		
		c.font="bold 25pt Arial";
		c.fillStyle="#FFFFFF";
		c.fillText("PAUSED",10,canvasH/8);
		
		c.font="8pt Arial, monospace";
		c.fillStyle="#FFFFFF";
		c.fillText("Press P to resume",10,canvasH/8+12);
		
		
		if(game.status==PLAYING){
			c.fillText("Press Q to quit game <-- change key because it may be accidentally hit when playing after pause ",10,canvasH/8+24);
		}	
	
		if(game.status!=GALLERY){
		var sep=12;
		var left=53;
		var right=80+left;

		var start=canvasH/3+15;
			
			
		c.fillText("W or UP :",left,start+2*sep);
		c.fillText("Jump",right,start+2*sep);

		c.fillText("A or LEFT :",left,start+3*sep);
		c.fillText("Move Left",right,start+3*sep);

		c.fillText("D or RIGHT :",left,start+4*sep);
		c.fillText("Move Right",right,start+4*sep);
		
		c.fillText("S or DOWN :",left,start+5*sep);
		c.fillText("Interact",right,start+5*sep);
		
		c.fillText("Q or / :",left,start+7*sep);
		c.fillText("Cycle Weapon",right,start+7*sep);
		
		c.fillText("1 to 4 :",left,start+8*sep);
		c.fillText("Swap directly to a weapon",right,start+8*sep);
		
			c.fillText("SPACE :",left,start+10*sep);
		c.fillText("Start a new game if not already playing one",right,start+10*sep);
		
		c.font="bold 10pt Arial";
		c.fillStyle="#FFCC00";
		c.fillText("Instructions:",left,start+1*sep);
		} else if(game.status==GALLERY){
			var sep=12;
			var left=100;
			var right=80+left;

			var start=canvasH/2+48;
			
			c.fillText("W or UP :",left,start+2*sep);
			c.fillText("Organize",right,start+2*sep);

			c.fillText("A or LEFT :",left,start+3*sep);
			c.fillText("Previous Page",right,start+3*sep);

			c.fillText("D or RIGHT :",left,start+4*sep);
			c.fillText("Next Page",right,start+4*sep);
		
			c.fillText("S or DOWN :",left,start+5*sep);
			c.fillText("Close",right,start+5*sep);
		
			c.font="bold 10pt Arial";
			c.fillStyle="#FFCC00";
			c.fillText("Gallery Instructions:",left,start+1*sep);	
		}
		
		
		canvasOutline(c,canvasW,canvasH);
		
	}
}


function gameOver(c){
		if(game.status!=GAMEOVER)return;
		
		c.fillStyle="rgba(0,0,0,.75)";
		c.fillRect(0,0,canvasW,canvasH);
		
		c.font="bold 25pt Arial";
		c.fillStyle="#FFFFFF";
		c.lineWidth=1;
		
		var startY =canvasH/2;
		var gameOverW=c.measureText("GAMEOVER").width;
		var startX =canvasW-3-gameOverW-100;

		
		c.fillText("GAMEOVER",startX,startY+10);
		
		c.font="8pt Arial";
		c.fillStyle="#FFFFFF";
		c.fillText("Press SPACE to resume",startX,startY+22);
		
		
		
		c.font="13pt Arial";
		c.fillStyle="#FFCC00";
		c.lineWidth=1;
		c.fillText(game.points,startX+gameOverW-c.measureText(game.points).width,startY-20);
		
		canvasOutline(c,canvasW,canvasH); // draw the canvas border

	
}


function calcGameStop(g){
	if(g.status==GAMEOVER||g.status==GALLERY||pause){
		gameStop=true;
	}else if(g.status==STANDBY||g.status==PLAYING){
		gameStop=false;	
	} 
}