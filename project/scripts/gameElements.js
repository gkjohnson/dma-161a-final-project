/*var UP=1; //moving up
var DOWN=2; //moving down
var LEFT=3; //moving left
var RIGHT=4; //moving right
*/




//Character Class
function char(setX,setY){
    output("TEST2");
    this.x=setX+.5; //x position of upper left corner
    this.y=setY+.5; //y position of upper left corner
    this.w=50;  //draw width
    this.h=50; //draw height
    this.xVel; //current x velocity
    this.yVel; //current y velocity

    this.xAcc; //constant acceleration for when moving left or right
    this.yAcc; //constant gravity
    
    this.MAXRUN; //max run velocity
    this.JUMPVEL; //initial jump velocity

    this.jumpCount; // 

    this.hit=charHit; //check hit detection
    
    this.jump; //jump - set yvel equal to JUMPVEL to simulate a jump
    this.move; //move - check which arrows are pressed and increment vel and position
    this.calc; //run move then hit functions
    this.render=charRender; //draw

}
function charMove(){
    
    var dirArray=new Array(4);
    dirArray=this.hit;
    
    
    if(this.dirArray[RIGHT]
    
}


function charHit(bArray,dir){
    
    //xVel+=xAcc; Xvelocity will only be increased when arrow keys are being pressed
    //yVel+=yAcc; 
    
    //x+=xVel; //move to move
    //y+=yVel; //move to move
    
    var dirArray=new Array(4); //array that lists which sides are being hit
    
    //check which side is being hit and put it in the array
    for(i=0;i<bArray.length;i++){
        if((this.x+this.xVel)<(bArray[i].x+bArray[i].w) //hit RIGHT side of block
            && (this.x+this.xVel)>(bArray[i].x) //hit LEFT side of block
            && (this.y+this.yVel)>(bArray[i].y) //hit UP side of block
            && (this.y+this.yVel)<(bArray[i].y+bArray[i].h)){ //hit DOWN    side of block
        
            if(this.xVel>0){
                dirArray[RIGHT]=bArray[i].x+this.w;
            } else if(this.xVel<0){
                dirArray[LEFT]=bArray[i].y+bArray[i].w;
            }
            
            if(this.yVel>0){
                dirArray[DOWN]=bArray[i].y+this.h;  
            } else if(this.yVel<0){
                dirArray[UP]=bArray[i].y+bArray[i].h;   
            }
        }
            
        return dirArray;
            
        
        //check for hit detection against bArray (array of blocks) and if the character is moving in the same direction as where it has hit
        //if hit, set vel=0 (or reverse and deprecate it for some bounce) and position next to the block hit in the relevant direction
        //also if hit, set acc=0 in relevant direction
    }   
}

function charRender(ctx){
    ctx.strokeStyle="#000000";
    c.fillStyle = "#FFFFFF";
    ctx.strokeRect(this.x,this.y,this.w,this.h);
    ctx.fillRect(this.x,this.y,this.w,this.h);
}