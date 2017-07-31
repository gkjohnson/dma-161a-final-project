

function level(){
    //variables
    this.lvlElem=new Array(); //all level elements (graphics and level blocks etc)
    this.lvlElemNum=0; //number of elements in the lvlElem array
    this.currLvl=0; //number of level
    
    //functions
    this.setupLevel=levelSetupLevel;
    this.drawLevel=levelDrawLvl;

    //create blocks to use when making level
    for(var i=0;i<7;i++){
        this.lvlElem[i]=new block(0,0,0,0);
        this.lvlElemNum++;
    }
}

function levelSetupLevel(){ //call appropriate lvl
    switch(this.currLvl){
    case 0: level0(this);
             currLvl=0;
             break;
    }
}

function levelDrawLvl(c){ // draw all block elements in the level
    for(var i=0;i<this.lvlElemNum;i++){

        this.lvlElem[i].render(c);
        
    }
}

function level0(lvl){ //setup level 0
    lvl.lvlElem[0].changeVal(0,canvasH-50,canvasW,50);
    lvl.lvlElem[1].changeVal(0,canvasH-350,50,300);
    lvl.lvlElem[2].changeVal(canvasW-50,canvasH-550,50,500);
    lvl.lvlElem[3].changeVal(50,canvasH-100,400,50);
    lvl.lvlElem[4].changeVal(canvasW-100,canvasH-500,50,250);
    lvl.lvlElem[5].changeVal(canvasW-250,canvasH-250,200,50);
}
function level1(lvl){ //setup level 1
}
function level2(lvl){ //setup level 2
}



//Block Class
function block(setX,setY,setW,setH){
    this.type=BLOCK;

    this.x=setX+.5; //x position of upper left corner
    this.y=setY+.5; //y posotion of upper left corner
    this.w=setW;
    this.h=setH;
    this.vis=false; //determines whether the block should be drawn or not
    
    this.changeVal=blockChangeVal;
    this.render=blockRender;
}

function blockChangeVal(setX,setY,setW,setH){
    this.x=setX+.5; //x position of upper left corner
    this.y=setY+.5; //y posotion of upper left corner
    this.w=setW;
    this.h=setH;
}

function blockRender(ctx){ //draw the block to the screen
    ctx.lineWidth=1;
    ctx.strokeStyle="#000000";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(this.x,this.y,this.w,this.h);
    ctx.strokeRect(this.x,this.y,this.w,this.h);

}