var stompClient = null;



/*function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}*/

function connect() {
    var socket = new SockJS('/stompendpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        //setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/newpoint', function (greeting) {
           
            addPointToCanvas(greeting);
        });
    });
}

function addPointToCanvas(point){
    var newpoint=JSON.parse(point.body);
     //alert("nuevo punto generado:"+newpoint.x);
     
     
     
    var canvas=document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(newpoint.x,newpoint.y,3,0,2*Math.PI);
    ctx.stroke();
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendPoint() {
    //stompClient.send("/app/newpoint", {}, JSON.stringify({x:10,y:10}));
    
    stompClient.send("/topic/newpoint", {}, JSON.stringify({x:10,y:10}));
    
}

function getMousePos(canvas, evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

function init() {
            can = document.getElementById("canvas");
            ctx = can.getContext("2d");
 
            can.addEventListener("mousedown", 
                function(evt){
                    var mousePos = getMousePos(can, evt);
                    //var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
                    stompClient.send("/topic/newpoint", {}, JSON.stringify({x:mousePos.x,y:mousePos.y}));
                
                }
            , false);
            /*can.addEventListener("mousemove", mouseXY, false);
            can.addEventListener("touchstart", touchDown, false);
            can.addEventListener("touchmove", touchXY, true);
            can.addEventListener("touchend", touchUp, false);*/
 
            /*document.body.addEventListener("mouseup", mouseUp, false);
            document.body.addEventListener("touchcancel", touchUp, false);*/
        }


$(document).ready(
        function () {
            connect();
            console.info('connecting to websockets');
            init();

        }
);
