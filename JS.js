
//stimulus table    
var stimtab = [];
var stimpos = 0;
var stimcnt = 0;
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        };
    }
var canvas=document.getElementById('cnv');
var ctx=canvas.getContext('2d');
var width=canvas.width;
var height=canvas.height;
var radius=height/10;
function fixCross() {
    ctx.font      = "normal 20px Times";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center"; 
    ctx.fillText("+",canvas.width/2, canvas.height/2); 
}
function displaystimulus() {
var nblue=stimtab[stimpos].nblue;
var nyell=stimtab[stimpos].nyell;
    draw(nblue,nyell);
    console.log(stimpos);
    setTimeout(function() {draw(0,0);
                          fixCross();
                          },1000);
}
function displayText(){
    //text in canvas
    draw(0,0); //clears fixation cross
    //temporary reference line
    ctx.font      = "normal 20px Times";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center", canvas.width/2 ,canvas.height/2.5; 
    ctx.fillText(stimtab[stimpos].quantifier+ " of the circles are " +stimtab[stimpos].w1+ ".",canvas.width/2, canvas.height/2);
    setTimeout(function(){draw(0,0);
                          displaystimulus();
                         },1200);
}
/*ctx.font      = "normal 20px Times";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center"; 
    ctx.fillText(stimtab[stimpos].quantifier */
var questions = ["At least seven", "At most seven", "At least thirteen", "At most thirteen"];   
function initialise() {
    for (var w=0; w<questions.length; w++) {
        for (var n=5;n<=15;n++) {
            stimtab.push({ nblue:n, nyell:(20-n), quantifier:questions[w], w1:"blue"});
            stimtab.push({ nblue:n, nyell:(20-n), quantifier:questions[w], w1:"yellow"});
            };
    };
    /*function compare() {
        console.log("compare")
        if (stimtab[stimpos].quantifier.questions[0])
            stimtab[stimpos].push({lessormore: [">= 7"]});
        else if (stimtab[stimpos].quantifier.questions[2])
            stimtab[stimpos].push({lessormore: [">= 13"]}); 
        else if (stimtab[stimpos].quantifier.questions[1])
            stimtab[stimpos].push({lessormore: ["<= 7"]});
        else 
            stimtab[stimpos].push({lessormore:["<= 13"]});    

        if (stimtab[stimpos].w1 == "blue") {
            for (var b = 0;b<lessormore.length;b++) {
              console.log(eval(stimtab[stimpos].nblue.value + stimtab[stimpos].lessormore[b]) == true) 
            };
        };
    };
    //compare(); */
    shuffle(stimtab);
    stimcnt=stimtab.length;
    stimpos=0;
    displayText();
}   
//keypress event listener     
 addEventListener("keydown", function (e) {     //change to keyup
  if (e.keyCode == 37) {
      recordResponse("true");
 }
  else if (e.keyCode == 39) {
      recordResponse("false")
  }
  else if (e.keyCode == 83) {
      initialise();
      document.getElementById("start").innerHTML = "";
  }
}, false);
// save respones
function nextstimulus() {
    stimpos++;
    if (stimpos==stimcnt) {
        changePage('p4','p5');
    }
    else
        displayText();
}
function recordResponse(a) {
    stimtab[stimpos].response = a;
    console.log("stimtab stimpos response is "+a);
    UCLSave("Kasia","test",pptID,"1",stimpos,stimtab[stimpos],report);
    nextstimulus();  
}

//recordpptID
var data = [];
var pptID = "";
function saveandcontinue() {
    if (document.getElementById("participantID").value.length < 8)
            alert("Please enter participant ID!");
        else {
        pptID = document.getElementById("participantID").value;
        changePage('p3','p4');
        };
}
function changePage(a,b) {
    document.getElementById(a).style.display="none";
    document.getElementById(b).style.display="block";
}    
// check if this ball would touch others on  list
function istouching(blist,x,y,radius) {
    for (var i=0;i<blist.length;i++) {
        var pos=blist[i];
        var d = Math.sqrt((pos.x-x)*(pos.x-x)+(pos.y-y)*(pos.y-y));
            if (d < 2 *radius) return true;
        }
        return false;
    }
// draw the desired number of balls
function draw(nblue,nyell) {
// add random balls to list
    var blist=[];
    while (blist.length<(nblue+nyell)) {
      var x=Math.random()*(width-2*radius);
      var y=Math.random()*(height-2*radius);
        if (!istouching(blist,x,y,radius))
          blist.push({ x:x, y:y });
    };
// clear the canvas
    ctx.clearRect(0,0,width,height);
//    function ballDisplay(){
// draw the yellow ones
        for (var i=0;i<nyell;i++) {
            var pos=blist.pop();
            ctx.beginPath();
            ctx.strokeStyle="yellow";
            ctx.fillStyle="yellow";
            ctx.arc(pos.x+radius,pos.y+radius,radius,0,Math.PI*2,true); 
            ctx.fill();
        };
// draw the blue ones
        for (var i=0;i<nblue;i++) {
            var pos=blist.pop();
            ctx.beginPath();
            ctx.strokeStyle="blue";
            ctx.fillStyle="blue";
            ctx.arc(pos.x+radius,pos.y+radius,radius,0,Math.PI*2,true); 
            ctx.fill();
        };
}
function showResults() {
    for (var i=0; i<stimtab.length;i++) {
        data.push(stimtab[i].response);
    };
    document.getElementById("textarea").innerHTML = (JSON.stringify(data))
}
function report(val) {
  console.log("UCLSave() returns " + val);
}
