var DRAWING=0;
var PAINTING=1;
var DIGITAL=2;

var ICON_PER_PAGE=10;

var gIcons;

function gallery(){

	var EDGEDIST=15;
	var INNER_EDGEDIST=10;
	this.CORNER_WIDTH=15;
	
	
	this.x=EDGEDIST;// upper left corner of the gallery
	this.y=EDGEDIST;
	this.innerX=this.x+INNER_EDGEDIST*8;
	this.innerY=this.y+INNER_EDGEDIST;
	
	this.w=canvasW-EDGEDIST*2;// width and height of the gallery
	this.h=Math.ceil(3*canvasH/4)-EDGEDIST*2;
	this.innerW=this.w-this.innerX+this.x-INNER_EDGEDIST;
	this.innerH=this.h-this.innerY+this.y-INNER_EDGEDIST;
	
	
	this.on=false;
	this.opened=false;// if the gallery is opened and being interacted with

	this.trans=0;// transparency for the gallery as it opens
	this.MAXTRANS=1.01;
	this.toDisplay=ICON_PER_PAGE;// number of objects to display per gallery screen at a time
	
	this.page=0; // page number displaying
	this.pageChanged=false;
	this.PAGETIME=10;
	this.pageChangeCount=0;
	
	this.galleryType=0;// which array of gallery objects are supposed to be displayed (sketches, paintings, etc)
	
	//setup invalidating nodes
	this.invNodeW;
	this.invNodeH;
	
	
	this.buttons=new Array();
	this.buttons[0]=new button(this.x+8,this.y+8,15,15,2,"X",exitButtonAct);
	this.buttons[1]=new button(this.x+INNER_EDGEDIST,this.y+this.h-20-INNER_EDGEDIST,20,20,1,"<",prevPageButtonAct);
	this.buttons[2]=new button(this.innerX-INNER_EDGEDIST-20,this.y+this.h-20-INNER_EDGEDIST,20,20,1,">",nextPageButtonAct);
	this.buttons[3]=new button(this.x+INNER_EDGEDIST,this.y+this.h-80,20,20,1,"o",organizeButtonAct);


	
	
	//functions
	this.render=galRender;// draw the gallery background
	this.fade=galFade;// fade the gallery environment
	this.calculate=galCalc;// calculate object
	this.check=galCheck;
	this.nodeSetup=renderNodeSetup;
	this.invSq=genInvSq;
	this.openGal=galOpen;
	this.closeGal=galClose;
	this.incPage=galIncPage;
	this.decPage=galDecPage;
	this.organize=galOrganize;
	
	
	this.nodeSetup();
	
}

function galRender(c){
	var x=this.x+.5;
	var y=this.y+.5;
	var ix=this.innerX+.5;
	var iy=this.innerY+.5;
	
	var w=this.w;
	var h=this.h;
	var iw=this.innerW;
	var ih=this.innerH;
	
	var corner=this.CORNER_WIDTH;
	

	c.fillStyle="rgba(255,255,255,"+this.trans*.7+")";
	c.strokeStyle="rgba(0,0,0,"+this.trans+")";
	c.lineWidth=1;
	
	c.fillRect(ix,iy,iw,ih);
	
	c.beginPath();
	c.moveTo(ix,iy);
	c.lineTo(ix,iy+ih);
	c.lineTo(ix+iw,iy+ih);
	c.lineTo(ix+iw,iy);
	c.lineTo(ix,iy);	
	
	c.moveTo(x+corner,y);
	c.lineTo(x+w-corner,y);
	c.arc(x+w-corner,y+corner,corner,-Math.PI/2,0,false);
	c.lineTo(x+w,y+h-corner);
	c.arc(x+w-corner,y+h-corner,corner,0,Math.PI/2,false);
	c.lineTo(x+corner,y+h);
	c.arc(x+corner,y+h-corner,corner,Math.PI/2,Math.PI,false);
	c.lineTo(x,y+corner);
	c.arc(x+corner,y+corner,corner,Math.PI,3*Math.PI/2,false);

	c.closePath();
	
	c.fillStyle="rgba(255,255,255,"+this.trans+")";
	c.fill();
	c.stroke();
	
	
	c.fillStyle="rgba(255,204,0,"+this.trans+")";
	c.font="bold 10pt Arial";

	c.fillText(this.page+1,this.x+(this.innerX-this.x)/2-c.measureText(this.page).width/2,this.y+this.h-15);
	c.fillText("PAGE",this.x+10,this.y+this.h-32);

	
	//c.fillRect(this.x+.5,this.y+.5,this.w,this.h);
	//c.strokeRect(this.x+.5,this.y+.5,this.w,this.h);
	//c.strokeRect(this.innerX+.5,this.innerY+.5,this.innerW,this.innerH);
	
	for(var i=0;i<this.buttons.length;i++){
		this.buttons[i].render(c,this.trans);	
	}
	
	
	if(this.pageChanged&&this.pageChangeCount==0)return;
		
	var dispMax=(this.page+1)*this.toDisplay;
	if(dispMax>gIcons[this.galleryType].length)dispMax=gIcons[this.galleryType].length;

	for(var i=this.page*this.toDisplay;i<dispMax;i++){
		gIcons[this.galleryType][i].render(c);
	}
	
	/*for(var i=0; i<this.invNodeW.length;i++){
		for(var j=0; j<this.invNodeH.length;j++){
			c.fillStyle="#FF0000";
			c.fillRect(this.x+this.invNodeW[i]-1,this.y+this.invNodeH[j]-1,2,2);
			
		}
	}*/
}

function galOpen(){
	this.opened=true;
	this.on=true;	
}
function galClose(){
	//this.opened=false;
	this.on=false
	this.status=STANDBY;
}
function galCalc(){
	this.check();
	this.fade();
	this.invSq();
	
	
	
	if(keyL&&this.pageChangeCount==0){
		if(!this.pageChanged)this.pageChangeCount=this.PAGETIME;
		this.pageChanged=true;
		this.decPage();
	}
	else if(keyR&&this.pageChangeCount==0){
		if(!this.pageChanged)this.pageChangeCount=this.PAGETIME;
		this.pageChanged=true;	
		this.incPage();

	}else if(!keyR&&!keyL){
		this.pageChanged=false;
		this.pageChangeCount=0;	
	}
	else if(this.pageChangeCount>0)this.pageChangeCount--;
	
	if(keyU){
		this.organize();	
	}
	
	
	
	for(var i=0;i<this.buttons.length;i++){
		this.buttons[i].calculate();	
	}
	if(this.trans==0)this.opened=false;
	

	var dispMax=(this.page+1)*this.toDisplay;
	if(dispMax>gIcons[this.galleryType].length)dispMax=gIcons[this.galleryType].length;

	for(var i=this.page*this.toDisplay;i<dispMax;i++){
		
		gIcons[this.galleryType][i].calculate(this.trans);	
		
	}

	
	allIconHover(this.galleryType,this.page*this.toDisplay,dispMax);
}
function galFade(){
	if(this.trans<.3&&!this.on){
		this.trans=0;
	}
	if(this.trans<this.MAXTRANS&&this.on)this.trans+=map(0,.2,0,this.MAXTRANS,this.MAXTRANS-this.trans);
	else if(this.trans>0&&!this.on){
		this.trans-=.3;
		//output("TEST");
	}
}
function galCheck(){
	if(this.opened==true)game.status=GALLERY;
	else if(this.opened==false&&game.status==GALLERY)game.status=STANDBY;
}

function galIncPage(){
	if((this.page+1)*this.toDisplay<gIcons[this.galleryType].length){
		resetPage(this.galleryType,this.page*this.toDisplay,(this.page+1)*this.toDisplay);
		this.page++;
	} else {
		this.pageChanged=false;
	}
}

function galDecPage(){
	if(this.page>0){
		resetPage(this.galleryType,this.page*this.toDisplay,(this.page+1)*this.toDisplay);
		this.page--;
	} else {
		this.pageChanged=false;
	}
}

function galOrganize(){
	organizeAll(this.galleryType);
		
}



function button(setX,setY,setW,setH,circ,txt,action){
	
	this.x=setX;
	this.y=setY;
	
	this.w=setW;
	this.h=setH;
	
	this.RECT=0;
	this.ROUNDED=1;
	this.CIRCLE=2;
	
	this.corner=this.w/4;
	
	this.hover=false;
	
	this.text=txt;
	
	this.isCircle=circ; //determines how to draw the button
	//0=rectangle
	//1=rounded rectangle
	//2=circle
	
	
	//functions
	this.render=buttonRender;
	this.hovering=buttonHover;
	this.calculate=buttonCalc;
	this.clickButton=buttonClicked;
	this.act=action;
}

function buttonRender(c,trans){
	c.fillStyle="rgba(175,175,175,"+trans+")";

	if(this.isCircle==0){
		c.fillRect(this.x,this.y,this.w,this.h);
	}else if(this.isCircle==1){
		var x=this.x+.5;
		var y=this.y+.5;
		
		c.beginPath();
		c.moveTo(x+this.corner,y)
		c.lineTo(x+this.w-this.corner,y)
		c.arc(x+this.w-this.corner,y+this.corner,this.corner,-Math.PI/2,0,false);
		c.lineTo(x+this.w,y+this.h-this.corner);
		c.arc(x+this.w-this.corner,y+this.h-this.corner,this.corner,0,Math.PI/2,false);
		c.lineTo(x+this.corner,y+this.h);
		c.arc(x+this.corner,y+this.h-this.corner,this.corner,Math.PI/2,Math.PI,false);
		c.lineTo(x,y+this.corner);
		c.arc(x+this.corner,y+this.corner,this.corner,Math.PI,3*Math.PI/2,false);
	
		c.closePath();
		
	}else if(this.isCircle==2){
		var x=this.x+this.w/2;
		var y=this.y+this.w/2;
		
		c.beginPath();
		c.arc(x,y,this.w/2,0,2*Math.PI,false);
	}
	c.fill();
	if(this.hover){
		c.strokeStyle="rgba(255,0,0,"+trans+")";
		c.stroke();
	}

	c.fillStyle="rgba(20,20,20,"+trans+")";
	c.font="8pt Arial";

	c.fillText(this.text,this.x+this.w/4,this.y+3*this.h/4);

}

function buttonHover(pX,pY){
	if(pX>this.x
	   &&pX<this.x+this.w
	   &&pY>this.y
	   &&pY<this.y+this.h){
		
		this.hover=true;	
	}else{
		this.hover=false	
	}
}

function buttonCalc(){
	this.hovering(mX,mY);
	this.clickButton();
}

function buttonClicked(){
	if(this.hover&&clicked){
		this.act();
	}
}


function exitButtonAct(){
	gal.closeGal();
}

function nextPageButtonAct(){
	gal.incPage();
}
function prevPageButtonAct(){
	gal.decPage();	
}
function organizeButtonAct(){
	gal.organize();	
}