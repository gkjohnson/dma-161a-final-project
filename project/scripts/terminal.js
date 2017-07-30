function terminal(setX,setY,prog){
	//variables
	this.x=setX;
	this.y=setY;
	
	this.w=75;
	this.h=125;
	
	this.interacting=false;
	
	this.downNote=new notification(setX+5,setY-20,this.w-10,50);	
	this.program=prog; //object that will be opened or closed
		
	//setup invalidating nodes
	this.invNodeW;
	this.invNodeH;
	
	//functions
	this.render=termRender;
	this.calculate=termCalc;
	this.hit=termHit;
	this.nodeSetup=renderNodeSetup;
	this.invSq=genInvSq;
	this.interact=termInteract;

	this.nodeSetup();
	
}

function termRender(c){
	c.fillStyle="#FFFFFF";
	c.strokeStyle="#000000";
	
	if(this.interacting) {
		c.strokeStyle="#FF0000";
		c.lineWidth=1;
	}
	
	c.fillRect(this.x+.5,this.y+.5,this.w,this.h);
	c.strokeRect(this.x+.5,this.y+.5,this.w,this.h);
	c.strokeRect(this.x+5.5,this.y+5.5,this.w-10,this.h-75);
	c.strokeRect(this.x+10.5,this.y+60.5,this.w-20,20);
	
	this.downNote.render(c);
}

function termCalc(){
	this.hit(player);

	if(game.status==STANDBY)this.invSq();
	
	this.downNote.calculate();
	
}

function termHit(elem){
	if(elem.x+elem.w>this.x
		&&elem.x<this.x+this.w
		&&elem.y+elem.h>this.y
		&&elem.y<this.y+this.h
		&&game.status==STANDBY
		&&player.onGround){
		
		this.interacting=true;	
	}else if(this.interacting){
		this.interacting=false;	
	}
	
	if(this.interacting==true)this.downNote.active=true;
	else if(this.interacting==false)this.downNote.active=false;

}


function termInteract(elem){
	if(elem.opened==true){
		elem.closeGal();
	}
	
	if(!this.interacting)return;
	if(elem.opened==false){
		elem.openGal();
	}
}

function notification(setX,setY,setW,setH){
	this.x=setX;
	this.y=setY;
	
	this.w=setW;
	this.h=setH;
	
	this.active=false;
	
	this.t=0;
	this.yVel=0;
	this.xVel=0;
	
	this.trans=0;
	this.MAXTRANS=.9;
	
	//setup invalidating nodes
	this.invNodeW;
	this.invNodeH;

	//functions
	this.move=noteMove;
	this.fade=noteFade;
	this.render=noteRender;
	this.nodeSetup=renderNodeSetup;
	this.invSq=genInvSq;
	this.calculate=noteCalc;
	
	this.nodeSetup();

}




function noteFade(){
	if(this.active&&this.trans<this.MAXTRANS)this.trans+=map(0,.1,0,this.MAXTRANS,this.MAXTRANS-this.trans);
	else if(!this.active&&this.trans>0)this.trans-=.25;
	
	if(this.trans>this.MAXTRANS)this.trans=this.MAXTRANS;
	else if(this.trans<0)this.trans=0;
	
}

function noteRender(c){
	c.fillStyle="rgba(255,255,255,"+this.trans+")";
	c.strokeStyle="rgba(0,0,0,"+this.trans+")";
	
	c.fillRect(this.x+.5,this.y+.5,this.w,this.h);
	c.strokeRect(this.x+.5,this.y+.5,this.w,this.h);
	c.strokeRect(this.x+this.w/4+.5,this.y+3.5,2*this.w/4,this.h-6);
	
	
}

function noteCalc(){
	this.fade();
	this.move();
	
	if(game.status!=gallery)this.invSq();
}

function noteMove(){
	this.t+=.1;
	
	//this.yVel=Math.sin(this.t)*.5;
	this.y+=Math.sin(this.t)*.5;
}