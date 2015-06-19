var can = document.getElementById('rectangleCanvas');
var context = can.getContext('2d');

var scale = 1;
var originx = 0;
var originy = 0;

var addX = 0;
var addY = 0;
var mulX = 1;
var mulY = 1;
var screenW = 1000;
var screenH = 1000;

var pinKey = true;
var connKey = true;
var obsKey = true;

function makeTransforms(worldLeft, worldRight, worldBottom, worldTop) {
    addX = -worldLeft;
    addY = -worldBottom;
    mulX = screenW / (worldRight - worldLeft);
    mulY = screenH / (worldTop - worldBottom);
}

function hidePins(myData) {

    //clear whole canvas
    //var can = document.getElementById('rectangleCanvas');
    //var context = can.getContext('2d');
    context.clearRect(0, 0, can.width, can.height);

    //draw devices only
    for (i = 0; i < myData.shapes.objects.length; i++) {
        var x_fixed = ((myData.shapes.objects[i].x + 4000) / 8);
        var y_fixed = ((myData.shapes.objects[i].y + 4000) / 8);

        if (myData.shapes.objects[i].type === "device") {
            context.beginPath();
            context.lineWidth = "1";
            context.strokeStyle = myData.shapes.objects[i].color;
            //context.strokeStyle = "black";
            context.rect(x_fixed, y_fixed, myData.shapes.objects[i].width / 8, myData.shapes.objects[i].height / 8);

            context.stroke();
        }
    }
}


function showAll(myData) {
    if (myData.shapes.objects.length < 1)
        return;

    context.fillStyle = "#666"; //for the zoom functionality    
    context.fillRect(originx, originy, 1000 / scale, 1000 / scale); //for the zoom functionality

    makeTransforms(myData.shapes.objects[0].x, myData.shapes.objects[0].x + myData.shapes.objects[0].width, myData.shapes.objects[0].y, myData.shapes.objects[0].y + myData.shapes.objects[0].height);

    for (i = 0; i < myData.shapes.objects.length; i++) {

        if (myData.shapes.objects[i].type === "device") {
            drawDevice(myData, i);
            
        } else if (myData.shapes.objects[i].type === "obs" && obsKey === true) {
            drawObs(myData, i);
        } else if (myData.shapes.objects[i].type === "connection" && connKey === true){
            drawConn(myData, i);
        } else{
            drawPin(myData, i);
        }
    }

}

function connKey(design, index){
    context.beginPath();
    context.moveTo(toScreenX(design.shapes.objects[index].x1), toScreenY(design.shapes.objects[index].y1));
    context.lineTo(toScreenX(design.shapes.objects[index].x2), toScreenY(design.shapes.objects[index].y2));
    context.stroke();
}

function drawDevice(design, index){
    context.beginPath();
            context.lineWidth = "1";
            context.strokeStyle = design.shapes.objects[index].color;

            context.rect(toScreenX(design.shapes.objects[index].x), toScreenY(design.shapes.objects[index].y), toScreenDist(design.shapes.objects[index].width), toScreenDist(design.shapes.objects[index].height));

            context.stroke();
}

function drawObs(design, index){
    if (design.shapes.objects[i].shape === "polygon") {

                context.fillStyle = design.shapes.objects[index].color;
                context.beginPath();
                context.moveTo(toScreenX(design.shapes.objects[index].points[0].x), toScreenY(design.shapes.objects[index].points[0].y));

                for (j = 1; j < design.shapes.objects[index].points.length; j++) {
                    context.lineTo(toScreenX(design.shapes.objects[index].points[j].x), toScreenY(design.shapes.objects[index].points[j].y));
                }
                context.closePath();
                context.fill();
            }
}

function drawPin(design, index){
    if(pinKey === true){
    if (design.shapes.objects[index].shape === "circle") {

                context.beginPath();
                context.arc(toScreenX(design.shapes.objects[index].x), toScreenY(design.shapes.objects[index].y), toScreenDist(design.shapes.objects[index].radius), 0, 2 * Math.PI, false); //(x,y,radius,dc,dc,dc)
                context.fillStyle = design.shapes.objects[index].color; //fill color
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = '#000000'; //border color
                context.stroke();

            } else if (design.shapes.objects[index].shape === "polygon") {

                context.fillStyle = design.shapes.objects[index].color;
                context.beginPath();
                context.moveTo(toScreenX(design.shapes.objects[index].points[0].x), toScreenY(design.shapes.objects[index].points[0].y));

                for (j = 1; j < design.shapes.objects[index].points.length; j++) {
                    context.lineTo(toScreenX(design.shapes.objects[index].points[j].x), toScreenY(design.shapes.objects[index].points[j].y));
                }
                context.closePath();
                context.fill();


            } else {
                context.fillStyle = design.shapes.objects[index].color;
                context.fillRect(toScreenX(design.shapes.objects[index].x), toScreenY(design.shapes.objects[index].y), toScreenDist(design.shapes.objects[index].width), toScreenDist(design.shapes.objects[index].height));
            }
}
}

function setInter() {
    setInterval(showAll, 100);
}

function toScreenX(userX) {
    return (userX + addX) * mulX;
}

function toScreenY(userY) {
    return (userY + addY) * mulY;
}

function toScreenDist(userDist) {
    return userDist * mulX;
}

function toUserX(screenX) {
    return screenX / mulX - addX;
}

function toUserY(screenY) {
    return screenY / mulY - addY;
}

function toUserDist(screenDist) {
    return screenDist / mulX;
}

rectangleCanvas.onmousewheel = function(event) {
    var mousex = event.clientX - rectangleCanvas.offsetLeft;
    var mousey = event.clientY - rectangleCanvas.offsetTop;
    var wheel = event.wheelDelta / 120; //n or -n
    var zoom = Math.pow(1 + Math.abs(wheel) / 2, wheel > 0 ? 1 : -1);

    context.translate(
        originx,
        originy
    );
    context.scale(zoom, zoom);
    context.translate(-(mousex / scale + originx - mousex / (scale * zoom)), -(mousey / scale + originy - mousey / (scale * zoom)));

    originx = (mousex / scale + originx - mousex / (scale * zoom));
    originy = (mousey / scale + originy - mousey / (scale * zoom));
    scale *= zoom;
    context.clearRect(0, 0, can.width, can.height);
    dataFunction();
};

function resetZoom(){
    
}

function checkBoxes(){
    var pin_box = document.getElementById("pinCheck");
    var obs_box = document.getElementById("obsCheck");
    var conn_box = document.getElementById("connCheck");
    
    
    if(pin_box.checked === false){
        pinKey = false; 
    } else{
        pinKey = true;
    }
    if(obs_box.checked === false){
        obsKey = false;
    } else{
        obsKey = true;
    }
    if(conn_box.checked === false){
        connKey = false;
    } else{
        connKey = true;
    }
     context.clearRect(0, 0, can.width, can.height);
     dataFunction();
}