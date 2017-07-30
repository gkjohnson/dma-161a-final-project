//object types
var SM_ENEMY=0;
var BLOCK=1;



function genInvSq(){
	this.invalid=true;
	for(var i=0;i<this.invNodeW.length;i++){
		for(var j=0;j<this.invNodeH.length;j++){
			if(this.invNodeW[i]+this.x>0&&this.invNodeW[i]+this.x<canvasW&&this.invNodeH[j]+this.y>0&&this.invNodeH[j]+this.y<canvasH)
				getSq(this.invNodeW[i]+this.x,this.invNodeH[j]+this.y).invalidate(); //invalidate the nodes in the top, left, and middle edges of the render sqs
			
			//c.fillStyle="#ff0000";
			//c.fillRect(this.invNodeW[i]+this.x-2,this.invNodeH[j]+this.y-2,4,4);			
		}
	}
}

function resetAllElements(){
		for(var i=0;i<enemies.length;i++){
			enemies[i].respawn();
		}
		for(var i=0;i<bullets.length;i++){
			delete bullets[i];
		}		
}



//Setup and loop functions
function screenSetup(){
	c.clearRect(0,0,canvasW,canvasH);
	c.fillStyle=innerBgColor;
	c.fillRect(0,0,canvasW,canvasH);
				
	lvl.drawLevel(c);
	
	c.strokeStyle = "#000000";
	c.fillStyle = "#FFFF00";
}

function setupGameElem(){ //create the game elements/enemies and put them in the appropriate arrays
	var elemCount=0;
	var enemCount=0;
	var birdNum=15;
	
	
	for(var i=0;i<birdNum; i++){
		enemies[i]=new bird();
		enemCount++;
	}
	for(var i=0;i<clocks.length; i++){
		clocks[i]=new clock();	
	}
	
	gameElem[elemCount]=term=new terminal(canvasW-150,canvasH-175);
	elemCount++;
	gameElem[elemCount]=player;
}
function drawGameElem(c){ //draw all the game elements and enemies
	for(var i=0;i<gameElem.length;i++){//draw game Elements (player and interactive items)
		gameElem[i].render(c);
	}	
	for(var i=0; i<bullets.length;i++){ //draw bullets
		if(!bullets[i])break;

		bullets[i].render(c);
	}
	for(var i=0;i<enemies.length;i++){ //draw enemies
		enemies[i].render(c);
	}
	
	for(var i=0;i<clocks.length;i++){ //draw enemies
		clocks[i].render(c);
	}
}		
function moveGameElem(){ //calculate movements for the enemies and game elements
	for(var i=0; i<bullets.length;i++){// move bullets
		if(!bullets[i])break;
		bullets[i].calculate();
	}	
	for(var i=0;i<enemies.length;i++){ //move enemies
		enemies[i].calculate();
	}
	for(var i=0;i<gameElem.length;i++){ //move game Elements (player and interactive items)
		gameElem[i].calculate();
	}
	for(var i=0;i<clocks.length;i++){ //move game Elements (player and interactive items)
		clocks[i].calculate();
	}
}

function renderNodeSetup(){
	
	//setup invalidating nodes
	this.invNodeW=new Array(Math.ceil(this.w/(BLOCKSIZE))+1);
	this.invNodeH=new Array(Math.ceil(this.h/(BLOCKSIZE))+1);
	
	for(var i=0;i<(Math.ceil(this.w/(BLOCKSIZE)));i++){
		this.invNodeW[i]=i*BLOCKSIZE;
	}
	for(var j=0;j<(Math.ceil(this.h/(BLOCKSIZE)));j++){
		this.invNodeH[j]=j*BLOCKSIZE;
	}
	this.invNodeW[Math.ceil(this.w/(BLOCKSIZE))]=this.w;
	this.invNodeH[Math.ceil(this.h/(BLOCKSIZE))]=this.h;
}

function centerRenderNodeSetup(){
	if(this.MAXEXPLSZ)var width=this.MAXEXPLSZ;
	else if(this.MAXWIDTH)var width=this.MAXWIDTH;
	else if(this.w)var width=this.w;
	var base=-width/2;
	
	this.invNodeW=new Array(Math.ceil(width/(BLOCKSIZE))+1);
	this.invNodeH=new Array(Math.ceil(width/(BLOCKSIZE))+1);
	
	for(var i=0;i<(Math.ceil(width/(BLOCKSIZE)));i++){
		this.invNodeW[i]=base+i*BLOCKSIZE;
	}
	for(var j=0;j<(Math.ceil(width/(BLOCKSIZE)));j++){
		this.invNodeH[j]=base+j*BLOCKSIZE;
	}
	this.invNodeW[Math.ceil(width/(BLOCKSIZE))]=width/2;
	this.invNodeH[Math.ceil(width/(BLOCKSIZE))]=width/2;
}


function updateStats(g,p){
	//g is gameinfo object
	//p is player object
	
	if(!updateStats.pwrBar){
		//mortar Stats
		updateStats.pwrBar=document.getElementById('powerBar');
		updateStats.pwrCount=document.getElementById('powerCount');
		updateStats.pwrBarTable=document.getElementById('powerbarTable');
		//laser Stats
		updateStats.lsrCoolBar=document.getElementById('laserCoolBar');
		updateStats.lsrCoolCount=document.getElementById('laserCoolCount');
		updateStats.lsrCoolTable=document.getElementById('laserCoolTable');
		//game info Time
		updateStats.timeBar=document.getElementById('timeBar');
		updateStats.timeCount=document.getElementById('timeCount');
		//game info Combo
		updateStats.comboBar=document.getElementById('comboCountdownBar');
		updateStats.comboCount=document.getElementById('comboCount');
		//game info Points
		updateStats.points=document.getElementById('points');
		//game Status
		updateStats.status=document.getElementById('status');

	}
	
	//update Mortar Power Bar
	if(player.currGun==guns['MORTAR']||updateStats.pwrBar.width>0){
		updateStats.pwrBar.width=map(0,100,0,MAX_MORTAR_POWER,p.mortarPower);
		updateStats.pwrBarTable.className="";
		
		if(player.mortarPower>0){
				updateStats.pwrCount.innerHTML=pad(p.mortarPower,2);
		}else updateStats.pwrCount.innerHTML="";
	}else if(updateStats.pwrBarTable.className=="")updateStats.pwrBarTable.className="inactiveStats";

	//update Laser Cooldown Bar
	if(p.laserCooldown>0){
		updateStats.lsrCoolBar.width=map(0,100,0,LASER_COOLDOWN_TIME,p.laserCooldown);
		updateStats.lsrCoolTable.className="";
	}else if(updateStats.lsrCoolTable.className==""){
			updateStats.lsrCoolTable.className="inactiveStats";
			updateStats.lsrCoolBar.width=0;
	}

	//update Game Time
	updateStats.timeBar.width=map(0,775,0,STD_GAME_TIME,g.time);
	updateStats.timeCount.innerHTML=pad(g.time,5);
	
	//update Combo Table
	updateStats.comboBar.width=map(0,148,0,MAX_COMBO_TIMER,g.comboTimer);
	updateStats.comboCount.innerHTML=pad(g.comboCount,4);
	
	if(game.status==PLAYING){
		document.getElementById('timeTable').className="";
		document.getElementById('comboTable').className="";
	}else if(game.status==STANDBY||game.status==GAMEOVER){
		document.getElementById('timeTable').className="inactiveStats";
		document.getElementById('comboTable').className="inactiveStats";	
	}
	
	if(p.currGun==guns["GUN"])document.getElementById('weapon').innerHTML="Gun";
	else if(p.currGun==guns["MORTAR"])document.getElementById('weapon').innerHTML="Mortar";
	else if(p.currGun==guns["FLAME"])document.getElementById('weapon').innerHTML="Flamethrower";
	else if(p.currGun==guns["LASER"])document.getElementById('weapon').innerHTML="Laser";
	
	updateStats.points.innerHTML=pad(g.points,10);
	
	/*switch(game.status){
		case STANDBY:
					var status="Press 'space' to start";
					break;
		case PLAYING:
					var status="--";
					break;
		case GAMEOVER:
					var status="GAMEOVER";
					break;
	}*/
	
	//updateStats.status.innerHTML=status;
	
}

function updateVar(){
	heldInc(); //increment the mouse held time
	game.calculate();
}

var desW=1100/2;
var desH=600/2;

function setResize(setX,setY){
	//resize the canvas to the setX and setY sizes	
	desW=setX;
	desH=setY;
	
}

function resizeCanvas(){
	//resize the canvas to the setX and setY sizes	
	if(!resizeCanvas.currW){
		resizeCanvas.updating=false;
		resizeCanvas.currW=canvasW;
		resizeCanvas.currH=canvasH;
	}
	
	
	
	if(resizeCanvas.currW==desW&&resizeCanvas.currH==desH)return;

	invalidateAll();
	
	if(Math.abs(resizeCanvas.currW-desW)<1){
		resizeCanvas.currW=desW;
	}
	if(Math.abs(resizeCanvas.currH-desH)<1){
		resizeCanvas.currH=desH;
	}
	
	var scaleW=map(.5,20,desW,canvasW,resizeCanvas.currW);
	var scaleH=map(.5,20,desH,canvasH,resizeCanvas.currH);
	
	if(resizeCanvas.currW>desW){
		resizeCanvas.currW-=scaleW;
	}else if(resizeCanvas.currW<desW){
		resizeCanvas.currW+=scaleW;
	}
	
	if(resizeCanvas.currH>desH){
		resizeCanvas.currH-=scaleH;
	}else if(resizeCanvas.currH<desH){
		resizeCanvas.currH+=scaleH;
	}
	
	myCanvas.width=resizeCanvas.currW;
	myCanvas.height=resizeCanvas.currH;
	
	c.scale(resizeCanvas.currW/canvasW,resizeCanvas.currH/canvasH);
	
}


//calculation functions
function map(toMin,toMax,fMin,fMax,num){
	var to=toMax-toMin;
	var f=fMax-fMin;
	
	if(num>fMax)return toMax;
	else if(num<fMin)return toMin;
		
	return ((num-fMin)/f)*to+toMin;
}

function dist(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

function pad(num,zerosLen){
	var numStr=""+num;
	var len=zerosLen-numStr.length;
	
	for(var i=0;i<len;i++){
		numStr='0'+numStr;	
	}
	return numStr;
}