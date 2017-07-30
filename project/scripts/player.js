var UP=0; //moving up
var DOWN=1; //moving down
var LEFT=2; //moving left
var RIGHT=3; //moving right

var GRAV=2;


var guns=new Array();
guns['GUN']=0;
guns['MORTAR']=1;
guns['FLAME']=2;
guns['LASER']=3;
var wpnTotal=4;

var bullets=new Array(10);

function char(setX,setY){
	this.x=setX; //x position of upper left corner
	this.y=setY; //y position of upper left corner	
	this.w=100;	//draw width
	this.h=75; //draw height
	this.gunX=this.w/2;
	this.gunY=this.h/2;

	this.xVel=0; //current x velocity
	this.yVel=0; //current y velocity
	
	this.xAcc=0; //constant acceleration for when moving left or right
	this.yAcc=GRAV; //constant gravity
	
	this.jumpCount=0; //how many times he can jump
	this.canJump=0; // is allowed to jump again. included so that holding down the jump button does not waste both jumps
	
	this.onGround=false; //dictates whether the character is ont the ground
	
	this.invalid=true; //is invalid? Test to see if should be drawn -- not used atm
	
	this.flamer=new flameThrower(this.x,this.y);

	
	this.currGun=0; //determines current gun
	this.laserCooldown=0;
	this.mortarPower=0;
	
	this.MAXVEL=18; //max run velocity
	this.MINVEL=.3;
	this.RUNACC=4;
	this.JUMPVEL=19; //initial jump velocity
	this.MAXJUMP=2;
	this.DAMPENFACTOR=.2;
	this.FRICTION=1.3;
	
	
	//setup invalidating nodes
	this.invNodeW;
	this.invNodeH;
	
	this.hit=charHit; //check hit detection
	this.jump=charJump; //jump - set yvel equal to JUMPVEL to simulate a jump
	this.move=charMove; //move - check which arrows are pressed and increment vel and position
	this.render=charRender; //draw square
	this.invSq=genInvSq;
	this.nodeSetup=renderNodeSetup;
	this.fire=charFire;
	this.swapGun=charSwapGun;
	this.gunTo=charGunTo;
	this.incMortarPower=charIncMortarPower;
	this.calculate=charCalc;
	this.stopAll=charStop;
	this.stationaryTransform=charStationaryTransform;
	
	//construction
	this.nodeSetup();
}

function charJump(){
	this.yVel=-this.JUMPVEL;
	this.onGround=false;
	this.jumpCount--;
}

function charMove(){
		if(gameStop&&this.onGround){
			this.stopAll();
			return;
		}

	
	if(this.xVel||this.yVel||keyL||keyR||keyU||keyD)this.invSq();

	if(keyU&&this.jumpCount>0&&this.canJump==true){this.jump();this.canJump=false;} //jumping
	else if(!keyU){this.canJump=1;}
	
	if((!keyL&&!keyR&&this.onGround)||(keyL&&keyR)){this.xVel/=this.FRICTION;if(Math.abs(this.xVel)<this.MINVEL)this.xVel=0;} //moving
	//else if(keyL&&keyR){this.xAcc=0;}
	else if(keyL){this.xAcc=-this.RUNACC;}
	else if(keyR){this.xAcc=this.RUNACC;}

	this.yVel+=this.yAcc;
	
	
	
	if(Math.abs(this.xVel)<this.MAXVEL||(Math.abs(this.xVel)/this.xVel)!=(Math.abs(this.xAcc)/this.xAcc))
		this.xVel+=this.xAcc;
	else if(Math.abs(this.xVel+this.xAcc)>=this.MAXVEL)
		this.xVel=(this.xVel/Math.abs(this.xVel))*this.MAXVEL;
	
	
	var dirArray=new Array(4);
	dirArray=this.hit(lvl.lvlElem);


	
	if((dirArray[RIGHT])!="null"){
		this.xVel*=-this.DAMPENFACTOR;
		this.x=dirArray[RIGHT];
	} else if(dirArray[LEFT]!="null"){
		this.xVel*=-this.DAMPENFACTOR;
		this.x=dirArray[LEFT];
	} else{
		this.x+=this.xVel;

	}


	if(dirArray[DOWN]!="null"){
		if(this.yVel>GRAV){
			this.yVel*=-this.DAMPENFACTOR;
			if(!keyL&&!keyR)
				this.xVel/=this.FRICTION+1;
			this.onGround=false;}
		else {this.yVel=0;this.onGround=true;}
		this.y=dirArray[DOWN];
	} else if(dirArray[UP]!="null"){
		this.yVel=0;	
		this.y=dirArray[UP];
	} else {
		this.y+=this.yVel;	
	}
	
		
	
	this.xAcc=0;
}

function charHit(bArray){
	
	var dirArray=new Array(4); //array that lists which sides are being hit
	dirArray=["null","null","null","null"];
	//check which side is being hit and put it in the array
	for(i=0;i<bArray.length;i++){
						
		if((this.x+this.xVel)<(bArray[i].x+bArray[i].w) //hit RIGHT side of block
			&& (this.x+this.xVel+this.w)>(bArray[i].x) //hit LEFT side of block
			&& (this.y+this.yVel+this.h)>(bArray[i].y) //hit UP side of block
			&& (this.y+this.yVel)<(bArray[i].y+bArray[i].h)//hit DOWN	side of block
			){	
				if((this.y+this.h)>(bArray[i].y) //bottom of player is within top of block
				&& (this.y)<(bArray[i].y+bArray[i].h) //top of player is within bottom of block
				){
					if((this.x+this.xVel+this.w>bArray[i].x)&&this.xVel>0){
						dirArray[RIGHT]=bArray[i].x-this.w;
					} else if((this.x+this.xVel<bArray[i].x+bArray[i].w)&&this.xVel<0){
						dirArray[LEFT]=bArray[i].x+bArray[i].w;
					}
				}
		
				if((this.x+this.w)>(bArray[i].x) //right of player is within left of block
				&& (this.x)<(bArray[i].x+bArray[i].w) //left of player is within right of block
				){			
					if((this.y+this.yVel+this.h>bArray[i].y)&&this.yVel>0){
						dirArray[DOWN]=bArray[i].y-this.h;	
						this.jumpCount=this.MAXJUMP;
						this.canJump=true;
						this.onGround=true;
					} else if((this.y+this.yVel<bArray[i].y+bArray[i].h)&&this.yVel<0){
						dirArray[UP]=bArray[i].y+bArray[i].h;	
					}
				}		
			}
		}	
		if(this.x+this.w+this.xVel>canvasW)dirArray[RIGHT]=canvasW-this.w;
		if(this.x+this.xVel<1)dirArray[LEFT]=1;
		
	return dirArray;
}

function charRender(ctx){
	this.flamer.render(c);

	ctx.strokeStyle="#000000";
	ctx.fillStyle = "#FFFFFF";
	ctx.lineWidth=1;
	ctx.fillRect(Math.ceil(this.x)+.5,Math.ceil(this.y)+.5,this.w-1,this.h-1);
	ctx.strokeRect(Math.ceil(this.x)+.5,Math.ceil(this.y)+.5,this.w-1,this.h-1);
	
	c.beginPath();
	c.arc(this.x+this.gunX,this.y+this.gunY,25/2,0,2*Math.PI,false);
	c.stroke();
}

function charFire(mX,mY){
	//handle mouseclick and fire when clicked
	if(gameStop)return;

	if(this.currGun==guns["FLAME"])return;
	
	for(var i=0; i<bullets.length;i++){
		if(bullets[i]){
			if(	bullets[i].isLive) {continue;}
			else {delete bullets[i];}
		}
		
		switch(this.currGun){
			case guns['GUN']:
					bullets[i]=new gunBullet(this.x+this.gunX,this.y+this.gunY,mX,mY);
					break;
			case guns['MORTAR']: 
					bullets[i]=new mortarBullet(this.x+this.gunX,this.y+this.gunY,mX,mY,this.mortarPower);
					break;
			case guns['LASER']:
					if(this.laserCooldown>0)break;
					bullets[i]=new laserBullet(this.x+this.gunX,this.y+this.gunY,mX,mY);
					this.laserCooldown=LASER_COOLDOWN_TIME;
					break;
		}
		break;
	}
}

function charCalc(){
	
	this.move();
	
	if(this.currGun==guns["FLAME"])this.flamer.enabled=true;
	
	this.flamer.calculate(this.gunX+this.x,this.gunY+this.y,mX,mY);
	
	this.incMortarPower();
	
	if(this.laserCooldown>0)
		this.laserCooldown--;
		
	this.stationaryTransform();
}

function charSwapGun(){
	if(gameStop)return;
	
	this.currGun++;
	this.mortarPower=0;
	if(this.currGun>wpnTotal-1)this.currGun=0;
}

function charGunTo(gun){
	if(gameStop)return;

	this.currGun=gun;
}

function charIncMortarPower(){
	
	if(this.mortarPower<MAX_MORTAR_POWER&&held>0&&player.currGun==guns['MORTAR']){
		this.mortarPower+=2;
	}
	else if(held==0)this.mortarPower=0;
	
	if(player.currGun!=guns["MORTAR"]);	
}

function charStop(){
	this.xVel=0;
	this.yVel=0;
	this.xAcc=0;
}

function charStationaryTransform(){
	if(game.status==GALLERY);
}