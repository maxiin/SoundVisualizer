var audio, video, canvas, context, audioctx, analyser, oscillator, freqArr, barHeight, source, colorSelect, canvasC, contextC, grd1, grd2;
var windowWidth, windowHeight, topDiv, vol, myTime;
var bigBars = 0;
var colorStyle = 0;
var pastIndex = 900;
var WIDTH = 1024;
var HEIGHT = 350;
var INTERVAL = 128;//256;
var SAMPLES = 2048;//4096;//1024;//512;//2048; //this is the main thing to change right now
var r = 0;
var g = 0;
var b = 255;
var x = 0;
var currVol = .3;

//1. NEED TO FIX ISSUE OF ONLY BEING ABLE TO PLAY ONE SONG BEFORE THE PROGRAM CRASHES>> FIXED
//2. RESOLVE ISSUE OF SCALING THE BARS BASED ON MAX FREQUENCY>> BECOMES NON-ISSUE IF FFT SIZE IS SAME AS INTERVAL
//3. NEED TO ADD OPTION TO CHOOSE COLOR PALETTE>> DONE
//4. NEED TO ADD VOLUME SLIDER
//5. NEED TO ORGANIZE LAYOUT AND CSS >>DONE
//6. NEED TO MAKE BACKGROUND EFFECTS >>DONE
//7. MAYBE ADD SONGS TO QUEUE? SHUFFLE FROM FOLDER?

function initialize(){
    canvas = document.getElementById("cnv1"); //drawing the canvas
    context = canvas.getContext("2d");
    audio = document.getElementById("audio");
    video = document.getElementById("video");
    audio.volume = .3;
    vol = document.getElementById("volumeSlider");
    colorSelect = document.getElementById("colorSelect");
    //audio.src = document.getElementById("audioFile");

    audioctx = new AudioContext(); //setting up audio analyzer to get frequency info
    analyser = audioctx.createAnalyser();
    analyser.fftSize = SAMPLES;
    
    oscillator = audioctx.createOscillator();
    oscillator.connect(audioctx.destination);

    source = audioctx.createMediaElementSource(video);    
    source.connect(analyser);
    source.connect(audioctx.destination);

    freqArr = new Uint8Array(analyser.frequencyBinCount);

    barHeight = HEIGHT;
    /////////////////////////////////////////////////////////////////////
    canvasC = document.getElementById("circlecnv"); 
    contextC = canvasC.getContext("2d");

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    canvasC.width = windowWidth;
    canvasC.height = windowHeight;

    var canvasTop = document.getElementById("topcnv");
    var contextTop = canvasTop.getContext("2d");

    canvasTop.width = windowWidth;
    canvasTop.height = 75;

    contextTop.fillStyle = "rgb(" + 128 + "," + 128 + "," + 128 + ")";
    contextTop.fillRect(0,0, windowWidth, 75);

    topDiv = document.getElementById("UI");
    topDiv.onmouseout = function(){myTime = setTimeout(mouseOutUI, 3000)}
    
    window.requestAnimationFrame(draw);
}

// audioFile.onchange = function(){ //plays the user's uploaded audio file when it is uploaded
//     audio = document.getElementById("audio");
//     var reader = new FileReader();
//     reader.onload = function(e){
//         audio.src = this.result;
//         audio.controls = true;
//         audio.crossOrigin = "anonymous";
//         audio.play();
//         audioctx.resume();
//     }
//     reader.readAsDataURL(this.files[0]);
//     window.requestAnimationFrame(draw);
// }

videoFile.onchange = function(){ //plays the user's uploaded audio file when it is uploaded
    video = document.getElementById("video");
    var reader = new FileReader();
    reader.onload = function(e){
        video.src = this.result;
        video.controls = true;
        video.crossOrigin = "anonymous";
        video.play();
        audioctx.resume();
    }
    reader.readAsDataURL(this.files[0]);
    window.requestAnimationFrame(draw);
}

function draw(){
    if(!audio.paused || !video.paused){
        bigBars = 0;
        x = 0;
        context.clearRect(0,0,WIDTH, HEIGHT);
        analyser.getByteFrequencyData(freqArr);
        console.log(freqArr, INTERVAL);
        for(var i = 0; i < INTERVAL; i++){
            if(/*i <= 50 &&*/ barHeight >= (240 /* currVol*/)){
                bigBars++;
            }
            //max = 900; //default placeholder
            var num = i;
            barHeight = ((freqArr[num] - 128) * 2) + 2;
            if(barHeight <= 1){
                barHeight = 2;
            }
            
            context.fillStyle = 'white';

            context.fillRect(x, HEIGHT - barHeight, (WIDTH/INTERVAL) - 1 , barHeight);
            x = x + (WIDTH/INTERVAL);
        }
    }

    if(bigBars >= 1){
        drawSides();
    }
    else{
        contextC.clearRect(0,0,windowWidth,windowHeight);
    }
    window.requestAnimationFrame(draw);
}

function mouseOverUI(){
    clearTimeout(myTime);
    UI.style.opacity = 1;
}

function mouseOutUI(){
    clearTimeout(myTime);
    UI.style.opacity = 0;
}

function changeVolume(){
    currVol = (vol.value/100);
    audio.volume = currVol;
}