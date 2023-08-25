
//function drawoncanv(){
//    const circs = [];
//
//    var canvas = document.getElementById("mainCanvas");
//    var ctx = canvas.getContext("2d");
//
//
//
//    //var topheight = ( document.getElementById("Name").clientHeight + (document.getElementById("topnav").clientHeight)/2);
//    var topheight = 0
//    this.h1Test = document.querySelectorAll('.Name')[0];
//
//    var canheight = screen.height - topheight;
//    for (let i = 0; i/(screen.width*canheight) < 0.00015; i++){
//        var cordx = Math.round(Math.random() * screen.width);
//        var cordy = Math.round(Math.random() * screen.height);
//        canvas.width = screen.width;
//        canvas.height = screen.height;
//       // console.log("HEIGHT: " + ( document.getElementById("Name").clientHeight + document.getElementById("topnav").clientHeight));
//
//        ctx.fillStyle = "rgb(255,255,255)";
//        const cords = [cordx,cordy];
//        circs.push(cords);
//    };
//    for (const cir of circs){
//        ctx.beginPath();
//        ctx.arc(cir[0], (cir[1] + topheight), 1, 0, 2 * Math.PI);
//
//        ctx.stroke();
//        ctx.fill();
//    };
//
//    //ctx.fillRect(0, 0, 250, topheight);
//};

//function drawc2(){
//	
//	const circslist = [];
//	var canvas2 = document.getElementById("mainCanvas");
//    var ctx2 = canvas2.getContext("2d");
//	//var topheight = ( document.getElementById("Name").clientHeight + (document.getElementById("topnav").clientHeight)/2);
//	var topheight = 0;
//    var canheight = screen.height - topheight;
//    for (let i = 0; i<100; i++){
//        var cordx = Math.round(Math.random() * screen.width);
//        var cordy = Math.round(Math.random() * screen.height);
//        canvas2.width = screen.width;
//        canvas2.height = screen.height;
//		ctx2.fillStyle = "rgb(255,255,255)";
//
//		const cords = [cordx,cordy];
//		circslist.push(cords);
//		
//	};
//	var dist = 0.1
//	setInterval(function(){
//	
//		
//		ctx2.clearRect(0,0,canvas2.width,canvas2.height);
//		console.log(circslist)
//		
//	for (const cir of circslist){
//		if (cir[0] + dist > canvas2.width){
//			
//			
//			cir[0] = 0;
//		}else{
//			cir[0] += dist;
//
//		};
//		
//		
//        ctx2.beginPath();
//        ctx2.arc(cir[0], (cir[1] + topheight), 1, 0, 2 * Math.PI);
//
//        ctx2.stroke();
//        ctx2.fill();		
//		
//		
//		
//		
//		
//	};
//	}, 10);
//
//	};
//	
//	
//
//	
//
//
//function makestars(){
//	const circslist = [];
//
//		var topheight = 0;
//    var canheight = screen.height - topheight;
//    for (let i = 0; i/(screen.width*canheight) < 0.00015; i++){
//        var cordx = Math.round(Math.random() * screen.width);
//        var cordy = Math.round(Math.random() * screen.height);
//        canvas2.width = screen.width;
//        canvas2.height = screen.height;
//		ctx2.fillStyle = "rgb(255,255,255)";
//
//		const cords = [cordx,cordy];
//		circslist.push(cords);
//		
//	};
//	
//	
//	
//	
//	
//	
//	
//	
//	return circslist;
//}
//
//
////const circslist = makestars();
////window.requestAnimationFrame(drawcanv)
//
//function drawcanv(timestamp){
//	var dist = 0.1
//	
//		
//		ctx2.clearRect(0,0,canvas2.width,canvas2.height);
//		console.log(circslist)
//		
//	for (var i = 0; i < circslist.length; i++){
//		if (circslist[i][0] + dist > canvas2.width){
//			
//			
//			circslist[i][0] = 0;
//		}else{
//			circslist[i][0] += dist;
//
//		};
//		
//		
//        ctx2.beginPath();
//        ctx2.arc((circslist[i][0], circslist[i][1] ), 1, 0, 2 * Math.PI);
//
//        ctx2.stroke();
//        ctx2.fill();		
//};
//
//	window.requestAnimationFrame(drawcanv)
//
//};

var canvas2 = document.getElementById("mainCanvas");
var ctx2 = canvas2.getContext("2d");



function st2(){
	const circslist = [];

		var topheight = 0;
    var canheight = screen.height - topheight;
    for (let i = 0; i/(screen.width*canheight) < 0.00015; i++){
        var cordx = Math.round(Math.random() * screen.width);
        var cordy = Math.round(Math.random() * screen.height);
        canvas2.width = screen.width;
        canvas2.height = screen.height;
		ctx2.fillStyle = "rgb(255,255,255)";

		const cords = {xcord:cordx,ycord:cordy};
		circslist.push(cords);
		
	};
	
	
	
	
	
	
	
	
	return circslist;
};
	
	
	



const cr = st2();
var dist = 0.25;

window.requestAnimationFrame(dc2);





function drawem(){
	ctx2.clearRect(0,0,canvas2.width,canvas2.height);

	for (var i = 0; i < cr.length; i++) {
		ctx2.beginPath();
        ctx2.arc(Math.round(cr[i].xcord), cr[i].ycord , 1, 0, 2 * Math.PI);
		
        ctx2.stroke();
        ctx2.fill();
		ctx2.closePath();
		if (cr[i].xcord + dist > canvas2.width){
			
		
			cr[i].xcord = 0;
		}else{
			cr[i].xcord += dist;

		};
		
	};


	
	
};

function dc2(timestamp){
		//console.log(cr);
	//cr = cr.map(num => [num[0] += 1,num[1]])
	
	
	drawem();
	
	
		window.requestAnimationFrame(dc2)

};





















function scrll1(){
    var elmnt = document.getElementById("proj");
    var rect = elmnt.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);
    window.scrollTo({
  top: rect.top,
  left: 0,
  behavior: 'smooth'
});
};
function scrll2(){
    var elmnt = document.getElementById("conttitle");
    var rect = elmnt.getBoundingClientRect();
    console.log(rect.top, rect.right, rect.bottom, rect.left);
    window.scrollTo({
  top: rect.top,
  left: 0,
  behavior: 'smooth'
});
};

function changepage1(){
    window.location.href = 'simulations.html';


};

function changepage2(){
    window.location.href = 'index.html';
};
function changepage3(){
    window.location.href = 'mobileapps.html';
};
function changepage4(){
    window.location.href = 'art.html';
};
function changepage5(){
    window.location.href = 'wip.html';
};
function changepage6(){
    window.location.href = 'wip.html';
};

function redc(c){
	
	return  96 * Math.sin((c* Math.PI) / 180.0) + 96;
	
};


function bluec(c){
	
	return 30 * Math.cos((c* Math.PI) / 180.0) + 207;
	 
};


function gradient(){
    let blueval = Math.random() * 255;
    let blueflag = true;
    let redflag = false;
    let redval = Math.random() * 255 ;

	let counter = 0;
	let inter = 45;



    setInterval(function(){


    if (blueflag == false){
    blueval += 1
    };

    if (blueflag == true){
    blueval -= 1
    };

    if (redflag == false){
    redval += 1
    };

    if (redflag == true){
    redval -= 1
    };
    if (blueval >= 252){
    blueflag = true
    };
    if (blueval <= 237){
    blueflag = false
    };

    if (redval >= 195){
    redflag = true
    };
    if (redval <= 177){
    redflag = false
    };
	counter +=1;
	

    document.getElementById("Name").style.color = "rgba("+redval+","+blueval+",255,1)";
    document.getElementById("wc").style.color = "rgba("+redval+","+blueval+",255,1)";
    document.getElementById("colo2").style.color = "rgba("+redval+","+blueval+",255,1)";
    document.getElementById("colo3").style.color = "rgba("+redval+","+blueval+",255,1)";
    //document.getElementById("othertitle").style.color = "rgba("+(255-redval)+","+blueval+",255,1)";
    //document.getElementById("conttitle").style.color = "rgba("+"255"+","+(255-blueval)+",255,1)";

    //document.getElementById("colo4").style.color = "rgba("+redval+","+blueval+",255,1)";
    document.getElementById("projtitle").style.color = "rgba("+redval+","+blueval+",255,1)";
   
		
		
		document.getElementById("cborder1").style.background = "rgba("+redc(counter)+","+bluec(counter)+",255,1)";
    document.getElementById("cborder2").style.background = "rgba("+redc(counter + inter)+","+bluec(counter + inter)+",255,1)";
    document.getElementById("cborder3").style.background = "rgba("+redc(counter+2*inter)+","+bluec(counter+2*inter)+",255,1)";
    document.getElementById("cborder4").style.background = "rgba("+redc(counter+3*inter)+","+bluec(counter+3*inter)+",255,1)";
   
    document.getElementById("cborder6").style.background = "rgba("+redc(counter+5*inter)+","+bluec(counter + 5*inter)+",255,1)";
   
		
	 //document.getElementById("cborder7").style.borderColor = "rgba("+(255-redval)+","+(255-blueval)+",255,1)";

    //document.getElementById("menubar").style.background = "linear-gradient(to right, rgba(255,"+redval+","+redval+",0.5306264501160092) 0%,rgba("+blueval+","+blueval+",255,0.57122969837587005) 100%)";
    }, 100);
};
