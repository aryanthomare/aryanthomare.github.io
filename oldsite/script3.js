
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



function gradient(){
    let blueval = Math.random() * 255;
    let blueflag = true;
    let redflag = false;
    let redval = Math.random() * 255 ;






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
    if (blueval >= 220){
    blueflag = true
    };
    if (blueval <= 110){
    blueflag = false
    };

    if (redval >= 220){
    redflag = true
    };
    if (redval <= 110){
    redflag = false
    };


    document.getElementById("Name").style.color = "rgba("+redval+","+blueval+",255,1)";
    document.getElementById("colo2").style.color = "rgba("+redval+","+blueval+",255,1)";
    document.getElementById("colo3").style.color = "rgba("+redval+","+blueval+",255,1)";
    //document.getElementById("othertitle").style.color = "rgba("+(255-redval)+","+blueval+",255,1)";
    //document.getElementById("conttitle").style.color = "rgba("+"255"+","+(255-blueval)+",255,1)";

    //document.getElementById("colo4").style.color = "rgba("+redval+","+blueval+",255,1)";
    document.getElementById("apptitle").style.color = "rgba("+redval+","+blueval+",255,1)";
    document.getElementById("cborder1").style.borderColor = "rgba("+redval+","+(255-blueval)+",255,1)";
     //document.getElementById("cborder7").style.borderColor = "rgba("+(255-redval)+","+(255-blueval)+",255,1)";

    //document.getElementById("menubar").style.background = "linear-gradient(to right, rgba(255,"+redval+","+redval+",0.5306264501160092) 0%,rgba("+blueval+","+blueval+",255,0.57122969837587005) 100%)";
    }, 100);
};


let slideIndex = 1;
let slideIndex2 = 1;

showSlides(slideIndex);
// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
	let i;
    let slides = document.getElementsByClassName("mySlides fade");

	
    if (n > slides.length) {slideIndex = 1};
    if (n < 1) {slideIndex = slides.length};
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    slides[slideIndex-1].style.display = "block";
}


function showSlides2(n) {
	let i;
    let slides2 = document.getElementsByClassName("mySlides2 fade");

	console.log("asdfasdf");
		console.log("slides2")

    if (n > slides2.length) {slideIndex2 = 1};
    if (n < 1) {slideIndex2 = slides2.length};
    for (i = 0; i < slides2.length; i++) {
			console.log("hi");

      slides2[i].style.display = "none";
    }

    slides2[slideIndex2-1].style.display = "block";
}

function plusSlides2(n) {
  showSlides2(slideIndex2 += n);
}

// Thumbnail image controls
function currentSlide2(n) {
  showSlides2(slideIndex2 = n);
}






