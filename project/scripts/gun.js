var MAX_MORTAR_POWER=50;
var LASER_COOLDOWN_TIME=150;


//GUN
function gunBullet(setX,setY,destX,destY){	
	//direct - Goes straight to target -- Small, maybe slow
	this.type=guns["GUN"];
	
	this.x=setX; //starting position
	this.y=setY;
	this.angle=-Math.atan2(this.y-destY,this.x-destX)-Math.PI/2;
	
	this.enemiesHit=0;
	
	this.VEL=30;
	
	this.xVel=this.VEL*Math.sin(this.angle);
	this.yVel=this.VEL*Math.cos(this.angle);
	
	this.isLive=true;
	this.wasHit=false;
	this.invalid=false;
		
	this.WIDTH=10;
	this.MAXEXPLSZ=18;
	this.explodeSize=10;
	
	this.invNodeW;
	this.invNodeH;
	
	this.move=gunMove;	//move
	this.render=gunRender; //draw the bullet
	this.hit=gunHit; //for ever bullet
	this.invSq=genInvSq; //invalidate the appropriate render nodes
	this.nodeSetup=centerRenderNodeSetup;
	this.calculate=gunCalc;
	this.explode=gunExplode;
	this.del;
	
	this.nodeSetup();
}
function gunRender(c){
//draw gun bullet
	if(!this.isLive)return;
	if(this.wasHit)var width=this.explodeSize-1;
	else var width=this.WIDTH-.5;
	
	c.beginPath();
	c.arc(this.x,this.y,width/2,0,2*Math.PI,false);
	
	c.fillStyle="rgba(255,255,255,"+map(1,0,this.WIDTH-1,this.MAXEXPLSZ-.5,width)+")";
	c.strokeStyle="rgba(0,0,0,"+map(1,0,this.WIDTH-1,this.MAXEXPLSZ,width)+")";
	c.lineWidth=1;
	c.fill();
	c.stroke();
	
	
	/*for(var i=0; i<this.invNodeW.length;i++){
		for(var j=0; j<this.invNodeH.length;j++){
			c.fillStyle="#FF0000";
			c.fillRect(this.x+this.invNodeW[i]-1,this.y+this.invNodeH[j]-1,2,2);
			
		}
	}*/
}
function gunMove(){
//calculate the movement of the gun bullet
	if(!this.isLive)return;
	this.x+=this.xVel;
	this.y+=this.yVel;
	
	if(!(this.x>-this.WIDTH&&this.x<canvasW+this.WIDTH&&this.y>-this.WIDTH&&this.y<canvasH+this.WIDTH))this.isLive=false;
}
function gunHit(elem){
	//check if it has hit the input element elem
	
	if(!this.wasHit)var width=this.WIDTH;
	else return;
	
	if(elem.type==SM_ENEMY){
		if(this.x+width/2>elem.x-elem.w/2
		&&this.x-width/2<elem.x+elem.w/2
		&&this.y+width/2>elem.y-elem.h/2
		&&this.y-width/2<elem.y+elem.h/2){
			this.wasHit=true;
			this.enemiesHit++;
			elem.hit(this.type,this.enemiesHit);	
		}
	}
	else if(elem.type==BLOCK){
		if(this.x+width/2>elem.x
			&&this.x-width/2<elem.x+elem.w
			&&this.y+width/2>elem.y
			&&this.y-width/2<elem.y+elem.h){
				this.wasHit=true;
		}
	}
}
function gunExplode(){
	this.invSq();
	if(this.explodeSize<=this.MAXEXPLSZ)this.explodeSize+=map(10,1,0,this.MAXEXPLSZ,this.explodeSize);
	else this.isLive=false;
}







//MORTAR
function mortarBullet(setX,setY,destX,destY,pwr){
	//travels in an arc - on mousedown, display arc to target -- splash damage on hit, but hard to hit becuase of nonlinear directory
	this.type=guns["MORTAR"];

	this.x=setX; //starting x position
	this.y=setY; //starting y pos	
	
	this.angleSetup=mortarAngleSetup; //setup the angleSetup function
	
	this.enemiesHit=0;

	this.launchVel=20; // launch velocity
	if(pwr>this.launchVel)this.launchVel=pwr;
	if(this.launchVel>MAX_MORTAR_POWER)this.launchVel=MAX_MORTAR_POWER;
	
	this.angle=	this.angleSetup(destX,destY); //get angle
	
	this.xVel=this.launchVel*Math.sin(this.angle);
	this.yVel=this.launchVel*Math.cos(this.angle);
	
	this.isLive=true; //is being drawn
	this.wasHit=false;
	this.invalid=false; //needs to be redrawn?
		
	this.WIDTH=20;
	this.MAXEXPLSZ=150;
	this.explodeSize=20;
	
	this.invNodeW;
	this.invNodeH;
	
	
	this.move=mortarMove;	//move
	this.render=mortarRender; //draw the bullet
	this.hit=mortarHit; //for ever bullet
	this.invSq=genInvSq; //invalidate the appropriate render nodes
	this.nodeSetup=centerRenderNodeSetup;
	this.calculate=gunCalc;
	this.explode=mortarExplode;
	this.del;

	this.nodeSetup();
}
function mortarRender(c){
//draw the mortar bullet
	if(!this.isLive)return;
	if(this.wasHit)var width=this.explodeSize-.5;
	else var width=this.WIDTH-.5;
	
	c.fillStyle="rgba(255,255,255,"+map(1,0,this.WIDTH-1,this.MAXEXPLSZ,width)+")";
	c.strokeStyle="rgba(0,0,0,"+map(1,0,this.WIDTH-1,this.MAXEXPLSZ,width)+")";
				
	c.beginPath();
	c.arc(this.x,this.y,width/2-.5,0,2*Math.PI,false);
	c.closePath();
	c.lineWidth=1;
	c.fill();
	
	if(!this.wasHit){
		c.beginPath();
		c.arc(this.x,this.y,width/4,0,2*Math.PI,false);
		c.fillStyle="rgba(220,150,150,1)";
		c.fill();
		c.stroke();
	}
}
function mortarMove(){
//calculate the movement of the mortar shell
	if(!this.isLive)return;
	this.x+=this.xVel;
	this.yVel+=GRAV;
	this.y+=this.yVel;
	
	this.invSq();

	if(!(this.x>-this.WIDTH&&this.x<canvasW+this.WIDTH&&this.y<canvasH+this.WIDTH))this.isLive=false;
}

function mortarAngleSetup(destX,destY){
	var angle=-1*Math.atan2(this.y-destY,this.x-destX)-Math.PI/2;

	return (-1*Math.atan2(this.y-destY,this.x-destX)-Math.PI/2);
}
function mortarAngleSetupXYTarget(xf,yf){
//set up the angle in order to hit the mouse. slightly off - possible because it cuts off soem decimals
	this.launchVel=45;
	
	var veli=this.launchVel;
	var xi=player.x;
	var yi=player.y;
	
	
	var a=(GRAV*Math.pow((xf-xi),2))/(2*Math.pow(veli,2));
	var b=(xf-xi);
	var c=(yi-yf+(GRAV*Math.pow(xf-xi,2))/(2*Math.pow(veli,2)));
	output(c);

	
	if(xf-xi>0)return -1*Math.atan((-b-Math.sqrt(Math.pow(b,2)-4*a*c))/(2*a))+Math.PI/2;
	if(xf-xi<0)return -1*Math.atan((-b+Math.sqrt(Math.pow(b,2)-4*a*c))/(2*a))-Math.PI/2;
}
function mortarHit(elem){
	//change calculations so that if it's within a certain distance, it counts as hit. Will need to be different for both level blocks and enemies. Dist is required because of splash explosion

	if(!this.wasHit)
		var width=this.WIDTH;
		
	else{
		var width=this.explodeSize;
	}
	
	if(elem.type==SM_ENEMY){
		if(!this.wasHit)width+=elem.w;

		if(dist(this.x,this.y,elem.x,elem.y)<width/2){
			this.wasHit=true;
			this.enemiesHit++;
			elem.hit(this.type,this.enemiesHit);	

		}
	}else if(elem.type==BLOCK){
		if(this.x+width/2>elem.x
			&&this.x-width/2<elem.x+elem.w
			&&this.y+width/2>elem.y
			&&this.y-width/2<elem.y+elem.h){
				this.wasHit=true;
				if(elem.respawn)elem.respawn();
		}
	}
	
}
function mortarExplode(){
	this.invSq();
	if(this.explodeSize<=this.MAXEXPLSZ-1)this.explodeSize+=map(40,1,0,this.MAXEXPLSZ,this.explodeSize);
	else this.isLive=false;
}






//FLAME
function flameThrower(setX,setY){
	//spreads as it goes out and burns enemies? -- spreads, but short range(can't hit the top) -- vulnerable to a combo timer
	
	//variables
	this.x=setX;
	this.y=setY;
	
	this.angle=0;
	
	this.isLive=true;
	this.on=false;
	this.enabled=false;
	
	this.flames=new Array(50);
	for(var i=0;i<this.flames.length;i++){
		this.flames[i]=new flame(this.x, this.y, this.angle);
	}
	
	//functions
	this.newFlame=flameThrowerNewFlame;
	this.render=flameThrowerRender;
	this.calculate=flameThrowerCalc;
	this.del;
	
	
}
function flameThrowerNewFlame(){
	
	for(var i=0;i<this.flames.length;i++){
		if(this.flames[i].isLive)continue;
		
		this.flames[i].respawn(this.x,this.y,this.angle);
		return;
	}
}
function flameThrowerRender(c){

	for(var i=0;i<this.flames.length;i++){
		this.flames[i].render(c);
	}
}
function flameThrowerCalc(origX,origY,destX,destY){
	//output(this.flames.length);
	if(this.enabled){
		this.x=origX;
		this.y=origY;
		this.angle=Math.atan2(this.y-destY,this.x-destX)-Math.PI;
		if(held>0)this.on=true;
		else if(held==0)this.on=false;
		if(this.on){
			this.newFlame();
			this.newFlame();
			this.isLive=true;
		}
	}
	this.enabled=false;

	
	if(!this.isLive)return;
	
	this.isLive=false;
	
	for(var i=0;i<this.flames.length;i++){
		this.flames[i].calculate();
		if(this.flames[i].isLive&&!this.isLive)this.isLive=true;
	}
}


function flame(setX,setY,dirAngle){
	//variables
	this.type=guns["FLAME"];

	
	this.x=setX;
	this.y=setY;
	
	this.angle=dirAngle;
	this.isLive=false;
	
	this.MAXWIDTH=120;
	this.MINWIDTH=20;
	this.w=30;
	this.initVel=20+(Math.random()-.5)*5;
	this.vel=this.initVel;
	this.deAcc=.8;
	
	this.invNodeW;
	this.invNodeH;
	
	//functions
	this.render=flameRender;
	this.move=flameMove;
	this.hit=flameHit;
	this.respawn=flameRespawn;
	this.calculate=FlameCalc;
	this.nodeSetup=gunNodeSetup;
	this.invSq=genInvSq;;
	
	this.nodeSetup();
}
function flameRespawn(setX,setY,dirAngle){
	this.isLive=true;
	
	this.x=setX;
	this.y=setY;
	this.angle=dirAngle+(Math.random()-.5)*Math.PI/15;
	this.initVel=20+(Math.random()-.5)*5;
	this.vel=this.initVel;
	this.w=Math.random()*5+5;
	this.deAcc=.8;

}
function flameMove(){
	this.vel-=this.deAcc;
	this.x+=this.vel*Math.cos(this.angle);
	this.y+=this.vel*Math.sin(this.angle);
	if(Math.abs(this.vel)<this.deAcc)this.isLive=false;
}

function flameRender(c){
	if(!this.isLive)return;
	var width=this.w;
	
	
	var r=Math.ceil(map(0,255,this.initVel*1/10,this.initVel,this.vel));
	var g=Math.ceil(map(0,255,this.initVel*2/5,this.initVel,this.vel));
	var b=Math.ceil(map(0,255,this.initVel*4/5,this.initVel,this.vel));
	var t=map(0,1,1,this.initVel,this.vel);
	
	c.fillStyle="rgba("+r+","+g+","+b+","+t+")";

	c.beginPath();
	c.arc(this.x,this.y,width/2,0,2*Math.PI,false);
	c.closePath();
	c.fill();
	
}

function FlameCalc(){
	if(!this.isLive)return;
	this.invSq();
	this.w=map(this.MAXWIDTH,this.MINWIDTH,0,this.initVel,this.vel);
	for(var i=0;i<enemies.length;i++){
		this.hit(enemies[i]);
	}
	for(var i=0;i<lvl.lvlElem.length;i++){
		this.hit(lvl.lvlElem[i]);
	}

	this.move();
}
function flameHit(elem){
	var width=this.w;

	if(elem.type==SM_ENEMY){
		if(dist(this.x,this.y,elem.x,elem.y)<this.w/2)elem.hit(this.type,1);	
	}else if(elem.type==BLOCK){
			if(this.x+width/2>elem.x
			&&this.x-width/2<elem.x+elem.w
			&&this.y+width/2>elem.y
			&&this.y-width/2<elem.y+elem.h){
				this.deAcc=5;
		}
	}

}




//LASER
function laserBullet(setX,setY,destX,destY){
	//travels direct -- fast and easy to hit, but long long reload time
	this.type=guns["LASER"];
	
	this.x=setX; //starting position
	this.y=setY;
	this.angle=-Math.atan2(this.y-destY,this.x-destX)-Math.PI/2;
	
	this.enemiesHit=0;
	
	this.VEL=60;
	
	this.xVel=this.VEL*Math.sin(this.angle);
	this.yVel=this.VEL*Math.cos(this.angle);
	
	this.isLive=true;
	this.wasHit=false;
	this.invalid=false;
	
	this.LENGTH=110;
	this.WIDTH=75;
	this.EDGE=20;
	
	
	this.invNodeW;
	this.invNodeH;
	
	this.move=laserMove;	//move
	this.render=laserRender; //draw the bullet
	this.hit=laserHit; //for ever bullet
	this.invSq=genInvSq; //invalidate the appropriate render nodes
	this.nodeSetup=laserRenderNodeSetup;
	this.calculate=laserCalc;
	this.del;
	
	this.nodeSetup();
	
	
	this.sparks=new Array(40);
	
	for(var i=0;i<this.sparks.length;i++){
		this.sparks[i]=new spark(setX,setY,this.angle);
	}
		
	
	
	
}

function laserCalc(){
	if(!this.isLive)return;
	
	for(var i=0;i<lvl.lvlElem.length;i++){
		this.hit(lvl.lvlElem[i]);
	}
	for(var i=0;i<enemies.length;i++){
		this.hit(enemies[i]);
	}
	
	this.move();
	
	for(var i=0;i<this.sparks.length;i++){
		this.sparks[i].calculate();
		if(this.sparks[i].isLive)this.isLive=true;
	}
		
	
	
	this.invSq();

}

function laserRender(c){
//draw gun bullet
	if(!this.isLive)return;
	//if(this.wasHit)var width=this.explodeSize-1;
	var width=this.WIDTH-.5;
	var length=this.LENGTH-width/2
	var edge=this.EDGE;
	
	
	c.fillStyle="rgba(200,255,0,.5)";
	c.strokeStyle="rgba(200,255,0,.5)";
	c.lineWidth=width;
	
	c.beginPath();
	c.arc(this.x,this.y,width/2,-this.angle,-this.angle+Math.PI,false);
	c.closePath();
	c.fill();
	c.beginPath();
	c.moveTo(this.x,this.y);
	c.lineTo(this.x-Math.cos(-this.angle-Math.PI/2)*-length,
		this.y-Math.sin(-this.angle-Math.PI/2)*-length);
	c.closePath();
	c.stroke();
	c.beginPath();
	c.arc(this.x+length*Math.cos(-this.angle-Math.PI/2),this.y+length*Math.sin(-this.angle-Math.PI/2),width/2,-this.angle,-this.angle+Math.PI,true);
	c.closePath();
	c.fill();

	
	c.fillStyle="rgba(200,255,0,1)";
	c.strokeStyle="rgba(200,255,0,1)";
	c.lineWidth=width-edge;

	c.beginPath();
	c.arc(this.x,this.y,(width-edge)/2,0,2*Math.PI,false);
	c.closePath();
	c.fill();
	c.beginPath();
	c.moveTo(this.x,this.y);
	c.lineTo(this.x-Math.cos(-this.angle-Math.PI/2)*-length,
		this.y-Math.sin(-this.angle-Math.PI/2)*-length);
	c.closePath();
	c.stroke();
	c.beginPath();
	c.arc(this.x+length*Math.cos(-this.angle-Math.PI/2),this.y+length*Math.sin(-this.angle-Math.PI/2),(width-edge)/2,0,2*Math.PI,false);
	c.closePath();
	c.fill();
	
	for(var i=0;i<this.sparks.length;i++){
		this.sparks[i].render(c);
	}
	
	/*c.strokeStyle="rgba(200,255,0,1)";
	
	for(var i=0; i<this.invNodeW.length;i++){
		for(var j=0; j<this.invNodeH.length;j++){
			c.fillStyle="#FF0000";
			c.fillRect(this.x+this.invNodeW[i]-1,this.y+this.invNodeH[j]-1,2,2);
			
		}
	}*/
	
}

function laserRenderNodeSetup(){ //idealize this part of the code -- too many invalidating nodes
	var width=this.LENGTH*2+this.WIDTH;
	var height=this.LENGTH*2+this.WIDTH;
	var baseW=-this.LENGTH;
	var baseH=-this.LENGTH;
		
	this.invNodeW=new Array(Math.ceil(width/(BLOCKSIZE))+1);
	this.invNodeH=new Array(Math.ceil(height/(BLOCKSIZE))+1);
	
	
	for(var i=0;i<(Math.ceil(width/(BLOCKSIZE)));i++){
		this.invNodeW[i]=baseW+i*BLOCKSIZE;
	}
	for(var j=0;j<(Math.ceil(height/(BLOCKSIZE)));j++){
		this.invNodeH[j]=baseH+j*BLOCKSIZE;
	}
	//this.invNodeW[Math.ceil(width/(BLOCKSIZE))]=baseW+width;
	//this.invNodeH[Math.ceil(height/(BLOCKSIZE))]=baseH+height;
}

function laserMove(){
//calculate the movement of the gun bullet
	if(!this.isLive)return;
	this.x+=this.xVel;
	this.y+=this.yVel;
	
	if(!(this.x>-this.LENGTH&&this.x<canvasW+this.LENGTH&&this.y>-this.LENGTH&&this.y<canvasH+this.LENGTH))this.isLive=false;
}


function laserMove(){
//calculate the movement of the gun bullet
	if(!this.isLive)return;
	this.x+=this.xVel;
	this.y+=this.yVel;
	
	if(!(this.x>-this.LENGTH&&this.x<canvasW+this.LENGTH&&this.y>-this.LENGTH&&this.y<canvasH+this.LENGTH))this.isLive=false;
}

function laserHit(elem){
	//check if it has hit the input element elem
	
	if(!this.wasHit)var width=this.WIDTH;
	else return;
	
	if(elem.type==SM_ENEMY){
		if(this.x+width/2>elem.x-elem.w/2
		&&this.x-width/2<elem.x+elem.w/2
		&&this.y+width/2>elem.y-elem.h/2
		&&this.y-width/2<elem.y+elem.h/2){
			//this.wasHit=true;
			this.enemiesHit++;
			elem.hit(this.type,this.enemiesHit);	
		}
	}
	else if(elem.type==BLOCK){
	}
}



function spark(setX,setY,angle){
	this.x=setX;
	this.y=setY;
	
	this.trans=(Math.random()*.3+.7);
	this.blue=Math.ceil(Math.random()*100);
		
	this.color="rgba(200,255,"+this.blue+","+this.trans+")";
	
	
	this.vel=Math.random()*30+10;
	this.angle=-angle+Math.PI/2+(Math.random()-.5)*Math.PI/5;
	this.xVel=this.vel*Math.cos(this.angle);
	this.yVel=this.vel*Math.sin(this.angle);
	
	this.w=Math.random()*20+10;
	
	this.invNodeW;
	this.invNodeH;
	
	this.isLive=true;
	
	this.move=sparkMove;	//move
	this.render=sparkRender; //draw the bullet
	this.invSq=genInvSq; //invalidate the appropriate render nodes
	this.nodeSetup=centerRenderNodeSetup;
	this.calculate=sparkCalc;
	this.del;
	
	this.nodeSetup();
	
}
function sparkMove(){
	this.x+=this.xVel;
	this.y+=this.yVel;
	
	this.yVel+=GRAV;
}

function sparkRender(c){
	if(!this.isLive)return;
	c.beginPath();
	c.arc(this.x,this.y,this.w/2,0,2*Math.PI,false);
	
	c.fillStyle=this.color;
	
	c.fill();

	
}

function sparkCalc(){
	if(!this.isLive)return;

	this.move();
	this.invSq();
	
	this.trans-=Math.random()*.04+.02;
	this.color="rgba(200,255,"+this.blue+","+this.trans+")";

	this.w*=.95;

	
	//output(this.trans);
	
	if(this.trans<=0)this.isLive=false;
	
	if(this.x<-this.w||this.x>canvasW+this.w||this.y<-this.w||this.y>canvasH+this.w)this.isLive=false;
}




//GENERAL BULLET FUNCTIONS
function gunCalc(){
	if(!this.isLive)return;
	
	for(var i=0;i<lvl.lvlElem.length;i++){
		this.hit(lvl.lvlElem[i]);
	}
	for(var i=0;i<enemies.length;i++){
		this.hit(enemies[i]);
	}
	
	if(!this.wasHit)this.move();
	else if(this.wasHit)this.explode();
	
	this.invSq();

}


function gunNodeSetup(){
	if(this.MAXEXPLSZ)var width=this.MAXEXPLSZ;
	else if(this.MAXWIDTH)var width=this.MAXWIDTH;
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
