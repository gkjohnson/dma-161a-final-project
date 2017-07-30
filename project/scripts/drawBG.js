

function canvasOutline(c,w,h){
	
	
	if(!canvasOutline.s){
	canvasOutline.s=20; // size of the rounded corners
	canvasOutline.e=0; // distance from edge
	}
	
	//canvasOutline.s--;
	//canvasOutline.e--;
	
	
	var size=canvasOutline.s; // size of the rounded corners
	var edgeDist=canvasOutline.e+.5; // distance from edge
	
	//draw rounded path
	c.beginPath();
	c.moveTo(size+edgeDist, edgeDist);
	c.lineTo(w-size-edgeDist, edgeDist);
	c.arc(w-size-edgeDist,size+edgeDist,size,-Math.PI/2,0,false);	
	c.lineTo(w-edgeDist, h-size-edgeDist);
	c.arc(w-size-edgeDist,h-size-edgeDist,size,0,Math.PI/2,false);	
	c.lineTo(size+edgeDist, h-edgeDist);
	c.arc(size+edgeDist,h-size-edgeDist,size,Math.PI/2,Math.PI,false);	
	c.lineTo(edgeDist, edgeDist+size);
	c.arc(size+edgeDist,size+edgeDist,size,Math.PI,3*Math.PI/2,false);	
	
	//c.fillStyle='#222e2a';
	c.strokeStyle=edgeColor;
	c.lineWidth=10;
	//c.fill();
	c.stroke();
	
	c.lineTo(0,0);
	c.lineTo(0,h);
	c.lineTo(w,h);
	c.lineTo(w,0);
	c.lineTo(0,0);
	c.closePath();
	
	//c.shadowBlur    =1;
	//c.shadowColor   = 'rgba(0, 0, 0, .6)';
	
	c.fillStyle=outColor;
	
	c.fill();
	//c.shadowColor   = 'rgba(0, 0, 0, 0)';

}