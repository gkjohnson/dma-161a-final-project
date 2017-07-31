function galIcon(gallery,image,category,id){
    
    this.cat=category;//lists the category that the icon belongs in - sketches, painting, or digital - also indicates the array
    this.id=id;//number in the array
    
    
    this.w=150; //width and height of the icon
    this.h=150;
    
    this.lastX;// the last x and y values
    this.lastY;
    //this.x=Math.floor((gal.innerW-this.w)*Math.random()+gal.innerX);  //current x and y value of the icon
    //this.y=Math.floor((gal.innerH-this.h)*Math.random()+gal.innerY);
    this.x=gal.innerX;
    this.y=gal.innerY;


    this.vel=0;
    this.angle=0;
    
    this.xOffset=0;
    this.yOffset=0;
    
    this.friction=.85;
    
    this.edgeX=gal.innerX;//x and y values that indicate the edge of where the icon is allowed to go
    this.edgeY=gal.innerY;
    this.edgeW=gal.innerW;//width and height values for the edge of where the icon is allowed to go
    this.edgeH=gal.innerH;
    
    this.image;//image or pointer to image that the icon will house/display
    
    this.trans=0;
    
    this.hover=false;//is the icon being hovered over
    this.drag=false;//is the icon clicked on and being dragged
    
    this.clicked=false;
    this.clickMaxCount=10;
    this.clickCount=0;
    
    var pageId=this.id-Math.floor(this.id/ICON_PER_PAGE)*ICON_PER_PAGE;
    
    var row= Math.floor(pageId/(ICON_PER_PAGE/2));
    var col= Math.ceil(pageId)-row*(ICON_PER_PAGE/2);

    
    
    
    var gapW=(this.edgeW-(ICON_PER_PAGE/2)*this.w)/(ICON_PER_PAGE/2+1);
    var gapH=(this.edgeH-2*this.w)/(2+1);

    
    
    
    this.organizing=true;
    this.orgX=this.edgeX+gapW+col*(gapW+this.w);
    this.orgY=this.edgeY+gapH+row*(gapH+this.h);
    
    if(this.id>=ICON_PER_PAGE){
        this.x=this.orgX;
        this.y=this.orgY;
    }


    this.calculate=galIconCalc;//run calculations etc for 
    this.move=galIconMove;//move the icon
    this.openImage;//open and displays the image
    this.render=galIconRender;
    this.hovering=galIconHovering;
    this.dragging=galIconDragging;
    this.organize=galIconOrganize;
    this.wasClicked=galIconWasClicked;

}

function galIconRender(c){
    c.fillStyle="rgba(255,255,255,"+this.trans+")";
    c.strokeStyle="rgba(0,0,0,"+this.trans+")";
    
    if(this.hover)c.strokeStyle="rgba(255,0,0,"+this.trans+")";

    
    c.fillRect(this.x+.5,this.y+.5,this.w,this.h);
    c.strokeRect(this.x+.5,this.y+.5,this.w,this.h);
    
    var edge=10.5;
    
    c.fillStyle="rgba(230,230,230,"+this.trans+")";
    c.fillRect(this.x+edge,this.y+edge,this.w-edge*2,this.h-edge*2);    
    
    
    c.fillStyle="rgba(0,0,0,"+this.trans+")";
    c.fillText(this.id,this.x+this.w/2-c.measureText(this.id).width/2,this.y+this.h/2+3);
    
}

function galIconMove(mouseX,mouseY){
    this.lastX=this.x;
    this.lastY=this.y;


    if(this.drag){
        this.x=mouseX-this.xOffset;
        this.y=mouseY-this.yOffset;
    } else {
        this.vel*=this.friction;
        this.x+=this.vel*Math.cos(this.angle);
        this.y+=this.vel*Math.sin(this.angle);  
    }
    
    if(this.x<this.edgeX){
        this.x=this.edgeX;
        this.angle*=-1;
        this.angle-=Math.PI;

    } else if(this.x+this.w>this.edgeX+this.edgeW){
        this.x=this.edgeX+this.edgeW-this.w;
        this.angle*=-1;
        this.angle-=Math.PI;
    }
    
    if(this.y<this.edgeY){
        this.y=this.edgeY;
        this.angle*=-1;
    } else if(this.y+this.h>this.edgeY+this.edgeH){
        this.y=this.edgeY+this.edgeH-this.h;

        this.angle*=-1;

    }
    if(this.vel<.1)this.vel=0;
        
    if(this.drag){
        this.vel=dist(this.x,this.y,this.lastX,this.lastY);
        this.angle=Math.atan2(this.y-this.lastY,this.x-this.lastX); 
        
        if(Math.abs(this.x-this.lastX)>1||Math.abs(this.y-this.lastY)>1){
            this.clickCount=0;
        }
        
        
    }
    

}

function galIconCalc(setTrans){
    //output("TEST");
    if(setTrans!=1){
        this.trans=setTrans;
    }
    
    this.move(mX,mY);

    this.dragging();
    
    this.organize();
    
    if(this.drag&&this.clickCount==0&&!this.clicked){
        this.clickCount=this.clickMaxCount;
        this.clicked=true;
    
    }
    
    if(this.clickCount>0)this.clickCount--; 
    
}
function galIconHovering(mouseX,mouseY){
    this.hover=false;
    if(mouseX>this.x
        &&mouseX<this.x+this.w
        &&mouseY>this.y
        &&mouseY<this.y+this.h
        &&!mouse1){     
            this.hover=true;
            return true;
        }
        
        return false;

}
function galIconDragging(){
    if(this.hover&&mouse1){
        this.hover=false;
        
        this.xOffset=mX-this.x;
        this.yOffset=mY-this.y;
        
        this.drag=true;
    }else if(!mouse1){
        this.drag=false
        
        if(this.clickCount>0){
            this.wasClicked();
            this.clickCount=0;
        }   
        this.clicked=false;

    }
}
function galIconWasClicked(){
    output("You clicked icon "+this.id+"!");

}


function galIconOrganize(){
    if(!this.organizing)return;
    
    if(this.drag)this.organizing=false;
        
    var speed=75;   
    
    this.y+=map(-speed,speed,-200,200,this.orgY-this.y);
    this.x+=map(-speed,speed,-200,200,this.orgX-this.x);


    if(dist(this.x,this.y,this.orgX,this.orgY)<.5){
        this.organizing=false;
        this.x=this.orgX;
        this.y=this.orgY;   
    }

}

function galIconSetup(){

    gIcons=new Array();

    gIcons[DRAWING]=new Array(45);
    gIcons[PAINTING]=new Array(1);
    gIcons[DIGITAL]=new Array(13);

    for(var i=0;i<gIcons[DRAWING].length;i++){
        gIcons[DRAWING][i]=new galIcon(gal,1,DRAWING,i);    
    }
    
    for(var i=0;i<gIcons[DIGITAL].length;i++){
        gIcons[DIGITAL][i]=new galIcon(gal,1,DIGITAL,i);    
    }
    
    for(var i=0;i<gIcons[PAINTING].length;i++){
        gIcons[PAINTING][i]=new galIcon(gal,1,PAINTING,i);  
    }
    
    
}

function allIconHover(type,from,to){    
    var iTo=to;
    var iFrom=from;
    
    if(gIcons[type].length<to)iTo=gIcons[type].length;
    if(gIcons[type].length<from)return;
    
    var set=false;

    for(var i=iTo-1;i>=iFrom;i--){
        gIcons[type][i].hover=false;
        if(!set&&gIcons[type][i].hovering(mX,mY))set=true;
    }
}

function organizeAll(type){
    for(var i=0;i<gIcons[type].length;i++){
        gIcons[type][i].organizing=true;
    }
}

function resetPage(type,from,to){
    var iTo=to;
    var iFrom=from;
    
    if(gIcons[type].length<to)iTo=gIcons[type].length;
    if(gIcons[type].length<from)return;
    
    for(var i=iTo-1;i>=iFrom;i--){
        if(!gIcons[type][i].organizing
            //||dist(gIcons[type][i].x,gIcons[type][i].y,gIcons[type][i].orgX,gIcons[type][i].orgY)>10
            )continue;
            
        gIcons[type][i].x=gIcons[type][i].orgX;
        gIcons[type][i].y=gIcons[type][i].orgY;
        gIcons[type][i].organizing=false;

    }
    
    
}