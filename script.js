
function drawoncanv(){
    const circs = [];
    setInterval(function(){
    var canvas = document.getElementById("mainCanvas");
    var ctx = canvas.getContext("2d");
    var topheight = ( document.getElementById("Name").clientHeight + (document.getElementById("topnav").clientHeight)/2);
    var canheight = screen.height - topheight;

    var cordx = Math.round(Math.random() * screen.width);
    var cordy = Math.round(Math.random() * canheight);
    canvas.width = screen.width;
    canvas.height = screen.height;
    console.log("HEIGHT: " + ( document.getElementById("Name").clientHeight + document.getElementById("topnav").clientHeight));

    var red = Math.round(Math.random() * 254);
    var green = Math.round(Math.random() * 254);
    var blue = Math.round(Math.random() * 254);

    ctx.fillStyle = "rgb(255,255,255)";
    const cords = [cordx,cordy]
    circs.push(cords);

    for (const cir of circs){
        ctx.beginPath();
        ctx.arc(cir[0], (cir[1] + topheight), 1, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill()
    };

    //ctx.fillRect(0, 0, 250, topheight);
}, 100);


}
function gradient(){
    let blueval = 220;
    let blueflag = true;
    let redflag = false;
    let redval = 110 ;


    setInterval(function(){

    if (blueflag == false){
    blueval += 1
    }

    if (blueflag == true){
    blueval -= 1
    }

    if (redflag == false){
    redval += 1
    }

    if (redflag == true){
    redval -= 1
    }
    if (blueval >= 220){
    blueflag = true
    }
    if (blueval <= 110){
    blueflag = false
    }

    if (redval >= 220){
    redflag = true
    }
    if (redval <= 110){
    redflag = false
    }


    document.getElementById("Name").style.color = "rgba("+redval+","+blueval+",255,1)";
    //document.getElementById("menubar").style.background = "linear-gradient(to right, rgba(255,"+redval+","+redval+",0.5306264501160092) 0%,rgba("+blueval+","+blueval+",255,0.57122969837587005) 100%)";
    }, 100);
}