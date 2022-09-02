
var canvas2 = document.getElementById("mainCanvas");
var ctx2 = canvas2.getContext("2d");


function st2(){
	var circslist = [];

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

    document.getElementById("cborder2").style.borderColor = "rgba(255,"+blueval+",255,1)";
   
   
   

    //document.getElementById("cborder7").style.borderColor = "rgba("+(255-redval)+","+(255-blueval)+",255,1)";

    //document.getElementById("menubar").style.background = "linear-gradient(to right, rgba(255,"+redval+","+redval+",0.5306264501160092) 0%,rgba("+blueval+","+blueval+",255,0.57122969837587005) 100%)";
    }, 100);
};


let slideIndex = 1;
let slideIndex2 = 1;
let slideIndex3 = 1;
let slideIndex4 = 1;
let slideIndex5 = 1;
let slideIndex6 = 1;
let slideIndex7 = 1;
let slideIndex8 = 1;
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


    if (n > slides2.length) {slideIndex2 = 1};
    if (n < 1) {slideIndex2 = slides2.length};
    for (i = 0; i < slides2.length; i++) {

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


function showSlides3(n) {
	let i;
    let slides3 = document.getElementsByClassName("mySlides3 fade");


    if (n > slides3.length) {slideIndex3 = 1};
    if (n < 1) {slideIndex3 = slides3.length};
    for (i = 0; i < slides3.length; i++) {

      slides3[i].style.display = "none";
    }

    slides3[slideIndex3-1].style.display = "block";
}

function plusSlides3(n) {
  showSlides3(slideIndex3 += n);
}

// Thumbnail image controls
function currentSlide3(n) {
  showSlides3(slideIndex3 = n);
}



function showSlides4(n) {
	let i;
    let slides4 = document.getElementsByClassName("mySlides4 fade");


    if (n > slides4.length) {slideIndex4 = 1};
    if (n < 1) {slideIndex4 = slides4.length};
    for (i = 0; i < slides4.length; i++) {
			
      slides4[i].style.display = "none";
    }

    slides4[slideIndex4-1].style.display = "block";
}

function plusSlides4(n) {
  showSlides4(slideIndex4 += n);
}

// Thumbnail image controls
function currentSlide4(n) {
  showSlides4(slideIndex4 = n);
}



function showSlides5(n) {
	let i;
    let slides5 = document.getElementsByClassName("mySlides5 fade");


    if (n > slides5.length) {slideIndex5 = 1};
    if (n < 1) {slideIndex5 = slides5.length};
    for (i = 0; i < slides5.length; i++) {

      slides5[i].style.display = "none";
    }

    slides5[slideIndex5-1].style.display = "block";
}

function plusSlides5(n) {
  showSlides5(slideIndex5 += n);
}

// Thumbnail image controls
function currentSlide5(n) {
  showSlides5(slideIndex5 = n);
}




function showSlides6(n) {
	let i;
    let slides6 = document.getElementsByClassName("mySlides6 fade");


    if (n > slides6.length) {slideIndex6 = 1};
    if (n < 1) {slideIndex6 = slides6.length};
    for (i = 0; i < slides6.length; i++) {

      slides6[i].style.display = "none";
    }

    slides6[slideIndex6-1].style.display = "block";
}

function plusSlides6(n) {
  showSlides6(slideIndex6 += n);
}

// Thumbnail image controls
function currentSlide6(n) {
  showSlides6(slideIndex6 = n);
}

function showSlides7(n) {
	let i;
    let slides7 = document.getElementsByClassName("mySlides7 fade");


    if (n > slides7.length) {slideIndex7 = 1};
    if (n < 1) {slideIndex7 = slides7.length};
    for (i = 0; i < slides7.length; i++) {

      slides7[i].style.display = "none";
    }

    slides7[slideIndex7-1].style.display = "block";
}

function plusSlides7(n) {
  showSlides7(slideIndex7 += n);
}

// Thumbnail image controls
function currentSlide7(n) {
  showSlides7(slideIndex7 = n);
}

function showSlides8(n) {
	let i;
    let slides8 = document.getElementsByClassName("mySlides8 fade");


    if (n > slides8.length) {slideIndex8 = 1};
    if (n < 1) {slideIndex8 = slides8.length};
    for (i = 0; i < slides8.length; i++) {

      slides8[i].style.display = "none";
    }

    slides8[slideIndex8-1].style.display = "block";
}

function plusSlides8(n) {
  showSlides8(slideIndex8 += n);
}

// Thumbnail image controls
function currentSlide8(n) {
  showSlides8(slideIndex8 = n);
}



currentSlide(1);
currentSlide2(1);
currentSlide3(1);
currentSlide4(1);
currentSlide5(1);
currentSlide6(1);
currentSlide7(1);
currentSlide8(1);
// JavaScript Document