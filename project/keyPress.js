var held=0; //how long the mouse button has been held

function keyDown(e){
	switch(e.keyCode){
		case 38:	e.preventDefault();	//up
		case 87:	keyU=true; //W
					break;
		case 40:	e.preventDefault();//down
		case 83:	keyD=true; //S
					break;
		case 37:	e.preventDefault();//left
		case 65:	keyL=true;	//A
					break;
		case 39:	e.preventDefault();//right
		case 68:	keyR=true; //D
					break;
		case 32: 	e.preventDefault(); //space
					game.start();
					break;
	}
}

function keyUp(e){
	e.preventDefault();
	switch(e.keyCode){
		case 38:	e.preventDefault();	//up
		case 87:	keyU=false; //W
					break;
		case 40:	e.preventDefault();//down
		case 83:	keyD=false; //S
					term.interact(gal);
					break;
		case 37:	e.preventDefault();//left
		case 65:	keyL=false;	//A
					break;
		case 39:	e.preventDefault();//right
		case 68:	keyR=false; //D
					break;
		case 71:	if(keyG){keyG=false; invalidateAll();} //G
					else if(!keyG)keyG=true;
					break;
		case 80:	pauseGame(c);
					break;
		case 81:	if(game.status==PLAYING&&pause){ //Q
						game.resetStats(STANDBY);	
						game.points=0;
						game.time=0;
						pauseGame(c);
					}
		case 191:	player.swapGun(); // '/'
					break;
		case 49:	player.gunTo(guns["GUN"]);
					break;
		case 50:	player.gunTo(guns["MORTAR"]);
					break;
		case 51:	player.gunTo(guns["FLAME"]);
					break;
		case 52:	player.gunTo(guns["LASER"]);
					break;
	}
}

/////////////////////////////
/*possibly add more mouse functions that only disable
the default functions, but only add them to the canvas
element. That way, the default functionality will only
be overridden if the canvas is clicked.*/
////////////////////////////


function mouseDown(e){
	e.preventDefault();
	if(!mouse1)clicked=true;
	
	var x=e.clientX-getXOffset(myCanvas);
	var y=e.clientY-getYOffset(myCanvas);
	mX=map(0,canvasW,0,myCanvas.width,x);
	mY=map(0,canvasH,0,myCanvas.height,y);
	mouse1=true;
		myCanvas.focus();

}
function mouseUp(e){
	e.preventDefault();
	
	var x=e.clientX-getXOffset(myCanvas);
	var y=e.clientY-getYOffset(myCanvas);
	mouse1=false;
	mX=map(0,canvasW,0,myCanvas.width,x);
	mY=map(0,canvasH,0,myCanvas.height,y);
	if(!pause){
		player.fire(mX,mY);
	}
		myCanvas.focus();

}
function mouseMove(e){
	//e.preventDefault();

	var x=e.clientX-getXOffset(myCanvas);
	var y=e.clientY-getYOffset(myCanvas);
		
	mX=map(0,canvasW,0,myCanvas.width,x);
	mY=map(0,canvasH,0,myCanvas.height,y);	
	
	//getSq(x,y).invalidate();
}



function prevent(e){
	myCanvas.focus();

	e.preventDefault();
		
}


function getXOffset(ob){
	var obj=ob;
	var xOffset=0;
	
	if(obj.offsetParent){
		while(1){	

			xOffset+=obj.offsetLeft;
			if(!obj.offsetParent){
				break;
			}
			obj=obj.offsetParent;
		}
	}
	
	return xOffset-window.pageXOffset;
}

function getYOffset(ob){
	var obj=ob;
	var yOffset=0;
	
	if(obj.offsetParent){
		while(1){
			yOffset+=obj.offsetTop;
			if(!obj.offsetParent){
				break;
			}
			obj=obj.offsetParent;
		}
	}
	
	return yOffset-window.pageYOffset;
}

function heldInc(){
	if(mouse1){held++;}
	else if(!mouse1&&held>0)held=0;
}