//Harmless Bird

function bird(){
	this.type=SM_ENEMY;
	this.points=10;
	this.timeAdd=50;
	this.clockOdds=18;
	
	
	this.x=Math.ceil(Math.random()*(canvasW));
	this.y=Math.ceil(Math.random()*(canvasH/3)+20);
	this.w=20;
	this.h=20;
	
	this.xVel=1+Math.random()*2;
	if(Math.random()>.5)this.xVel*=-1;
	
	this.yVel;
	
	this.invalid;
	
	this.invNodeW;
	this.invNodeH;
	
	this.baseAngle=Math.random()*2*Math.PI;
	this.waveMag=Math.random()*2+1;
	
	this.gone=false; //should test a random function if true over and over until satisfied to see if bird sould be respawned
	
	this.MAXVEL=1+Math.random()*2;
	
	//functions
	this.render=birdRender;
	this.move=birdMove;
	this.invSq=genInvSq;
	this.nodeSetup=centerRenderNodeSetup;
	this.respawn=birdRespawn;
	this.calculate=enemCalc;
	this.hit=birdHit;
	this.death=birdDeath;
	
	//construction
	this.nodeSetup();

}

function birdMove(){
	this.yVel=Math.sin(this.baseAngle+(this.x/360)*2*Math.PI)*this.waveMag*Math.random();
	this.x+=this.xVel;
	this.y+=this.yVel;
	this.invSq();
	
	if(this.x>canvasW+this.w||this.x<-this.w*2){
		this.respawn();
	}
}

function birdRender(c){
	c.strokeStyle="#000000";
	c.fillStyle="#FFFFFF";
	c.lineWidth=1;
	//c.fillRect(this.x+.5,this.y+.5,this.w-1,this.h-1);
	//c.strokeRect(this.x+.5,this.y+.5,this.w-1,this.h-1);
	c.beginPath();
	c.arc(this.x,this.y,this.w/2-.5,0,2*Math.PI,false);
	c.fill();
	c.stroke();

}

function birdRespawn(){
	this.y=Math.random()*(canvasH/3);
	this.baseAngle=Math.random()*2*Math.PI;
	this.MAXVEL=1+Math.random()*2;
	this.waveMag=Math.random()*2+1;

	var num=Math.random()-.5;

	
	if(num>0){
		this.x=-this.w;
		this.xVel=this.MAXVEL;}
	else if(num<=0){
		this.x=canvasW;
		this.xVel=-this.MAXVEL;}
}

function birdHit(wpnType,hitNum){
	this.death(wpnType,hitNum,game);
	

}

function birdDeath(wpnType,hitNum,g){
	g.addPoint(this.points,hitNum);
	g.incCombo(wpnType);
	spawnClock(this.x,this.y,this.clockOdds,this.timeAdd);
	
	this.respawn();
}

function enemCalc(){
	this.move();
}