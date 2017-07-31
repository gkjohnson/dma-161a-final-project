var clocks=new Array(3);

function clock(){
    this.x=50;
    this.y=50;
    
    this.w=40;
    this.h=40;
    this.drawWidth=21;
    
    this.yVel=3;
    this.xVel=0;

    this.isLive=false;
    
    this.time=10;
    
    this.angle=0;

    //setup invalidating nodes
    this.invNodeW;
    this.invNodeH;
    

    this.render=clockRender;
    this.move=clockMove;
    this.set=clockSet;
    this.calculate=clockCalc;
    this.nodeSetup=centerRenderNodeSetup;
    this.invSq=genInvSq; //invalidate the appropriate render nodes
    this.hit=clockHit;
    this.collected=clockCollected;
    this.nodeSetup();

}

function clockMove(){
    if(!this.isLive)return;
    this.x+=this.xVel;
    this.y+=this.yVel;
}

function clockCalc(){
    this.move();
    
    this.angle+=Math.PI/25;
    
    if(this.angle==Math.PI*2)this.angle=0;
    
    if(this.y-this.w/2>canvasH)this.isLive=false;
    
    this.hit(player);
    
    
    this.invSq();
}

function clockSet(x,y,time){
    this.x=x;
    this.y=y;
    this.time=time
    this.isLive=true;
}

function clockRender(c){
    if(!this.isLive)return;

    c.fillStyle="#FFCC00";
    c.strokeStyle="#000000";
    
    c.beginPath();
    c.arc(this.x,this.y-this.drawWidth/2+2,this.drawWidth/5,0,Math.PI*2,false);
    c.fill();
    c.stroke();
    
    c.beginPath();
    c.arc(this.x,this.y,this.drawWidth/2,0,Math.PI*2,false);
    c.fill();
    c.stroke();
    
    c.fillStyle="#FFFFFF";
    c.beginPath();
    c.arc(this.x,this.y,(this.drawWidth-5)/2,0,Math.PI*2,false);
    c.fill();
    c.stroke();
    
    
    
    c.beginPath();
    c.moveTo(this.x,this.y);
    c.lineTo(this.x+(this.drawWidth/2-3)*Math.cos(this.angle),this.y+(this.drawWidth/2-3)*Math.sin(this.angle));
    
    c.stroke();
    
    c.beginPath();
    c.moveTo(this.x,this.y);
    c.lineTo(this.x+(this.drawWidth/2-6)*Math.cos(this.angle/2),this.y+(this.drawWidth/2-6)*Math.sin(this.angle/2));
    
    c.stroke();
}

function clockHit(p){
    if(!this.isLive)return;

    if(this.x>p.x
        &&this.x<p.x+p.w
        &&this.y>p.y
        &&this.y<p.y+p.h){
        
        this.collected(game);
        
    }
}


function clockCollected(g){
    g.time+=this.time;
    this.isLive=false;
}




function spawnClock(x,y,odds,time){
    if(game.status!=PLAYING)return;
    
    if(Math.ceil(Math.random()*odds)!=1)return;

    for(var i=0;i<clocks.length;i++){
        if(!clocks[i].isLive){
            clocks[i].set(x,y,time);
            return;
        }
    }
}


