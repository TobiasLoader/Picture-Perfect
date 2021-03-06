
// Declare VAR'S up here
var W;
var H;

var pixelSize;
var picture;
var pictureTraits;
var avg;
var trials;
var score;
var n;

var scene;
var sampleTake;
var picSize;
var whichPic;
var finished;

var partTrials;
var partScores;
var topSampleScore;
var topSamplePos;

function setup() {
	initVar();
	whichPic = 1;
	canvas = createCanvas(W, H);
}

function draw() {
	// draw in here
	background(200,230,255);
	switch (scene){
		case 1: menu(); break;
		case 2: displayTrials(trials); break;
	} 
	if (finished && scene === 2){
		fill(200,230,255,200);
		noStroke();
		rect(0,0,W,H);
		restartArrow();
	}	
}

function initVar(){
	angleMode(DEGREES);
  W = windowWidth;
	H = windowHeight;
	
	scene = 1;
	sampleTake = 10;
	picSize = 6;
	finished = false;
	
	n = 10;
	if (W>H){
  	pixelSize = H/(((picSize+1)*n)+4);
  } else {
	  pixelSize = W/(((picSize+1)*n)+1);
  }
  switch(whichPic){
	  case 1: picture = [
											[0,0,0,0,0,0],
											[0,1,0,0,1,0],
											[0,0,0,0,0,0],
											[0,1,0,0,1,0],
											[0,1,1,1,1,0],
											[0,0,0,0,0,0],
																	]; break;
		case 2: picture = [
											[0,0,0,0,0,0],
											[0,0,0,0,0,0],
											[0,0,0,0,0,0],
											[1,1,1,1,1,1],
											[1,1,1,1,1,1],
											[1,1,1,1,1,1],
																	]; break;
		case 3: picture = [
											[1,1,1,1,1,1],
											[1,0,0,0,0,1],
											[1,0,1,1,0,1],
											[1,0,1,1,0,1],
											[1,0,0,0,0,1],
											[1,1,1,1,1,1],
																	]; break;
		default: picture = [
											[0,0,1,1,0,0],
											[0,0,1,1,0,0],
											[1,1,1,1,1,1],
											[1,1,1,1,1,1],
											[0,0,1,1,0,0],
											[0,0,1,1,0,0],
																	];
  }
  if (picSize>6){
	  for (var i=0; i<6; i+=1){
		  for (var j=6; j<picSize; j+=1){
			  picture[i].push(0);
		  }
	  }
// 	  print(picture);
	  for (var i=6; i<picSize; i+=1){
			picture.push([]);
			for (var j=0; j<picSize; j+=1){
				picture[i].push(0);
		 	}
		}
  }
  print(picture);
	pictureTraits = {white:0,black:0}
	for (var y=0; y<picSize; y+=1){
		for (var x=0; x<picSize; x+=1){
			if (picture[y][x]===1){
				pictureTraits.black += 1;
			} else {
				pictureTraits.white += 1;
			}
		}
	}
	
	avg = 0;
	
	trials = [];
	createRandPic();
	
	score = [];
	for (var i=0; i<100; i+=1){
		score.push(0);
	}
	
	partTrials = [];
	partScores = [];
	topSampleScore = [];
	topSamplePos = [];
		

}

function restartArrow(){
	stroke(255);
	strokeWeight(20);
	noFill();
	var S;
	if (W>H){
		S = H;
	} else {
		S = W;
	}
	arc(W/2,H/2,S/3,S/3,45,320);
	fill(255);
	triangle(W/2+S/6-S/96,H/2-S/24,W/2+S/12,H/2-S/12,W/2+S/6,H/2-S/8);
}

function menu(){
	drawPic(2*pixelSize,2*pixelSize,picture,2*pixelSize);
}
function displayTrials(t){
	for (var i=0; i<sampleTake; i+=1){
		drawPic((((picSize+1)*(i%n))+1)*pixelSize,((picSize+1)*floor(i/n)+1)*pixelSize,t[i],pixelSize);
	}
	for (var i=sampleTake; i<t.length; i+=1){
		drawPic((((picSize+1)*(i%n))+1)*pixelSize,((picSize+1)*floor(i/n)+1)*pixelSize+((picSize/2)*pixelSize),t[i],pixelSize);
	}
}

function randBi(){
	return round(random(0,1));
}
function createRandPic(){
	for (var i=0; i<100; i+=1){
		var newPic = [];
		for (var y=0;y<picSize;y+=1){
			newPic.push([]);
			for (var x=0;x<picSize;x+=1){
				newPic[y].push(randBi());
			}
		}
		trials.push(newPic);
	}
}

function checkScore(){
	var s;
	for (var i=0; i<100; i+=1){
		s = 0;
		for (var y=0; y<picSize; y+=1){
			for (var x=0; x<picSize; x+=1){
				if (trials[i][y][x]===picture[y][x]){
					s += 1;
				}
			}
		}
		score[i] = s;
	}
}
function flipBinary(current){
	var N = 3;
	if (current===1 && random(0,1)<pictureTraits.white/(sq(picSize)*N)){return 0;}
	else if (current===0 && random(0,1)<pictureTraits.black/(sq(picSize)*N)){return 1;}
	else {return current};
}
function eliminateTrials(){
	if (!finished){
		partScores = [];
		partTrials = [];
		topSampleScore = [];
		topSamplePos = [];

		for (var i=0; i<sampleTake; i+=1){
			topSampleScore.push(0);
			topSamplePos.push(-1);
		}
		for (var j=0; j<sampleTake; j+=1){
			for (var i=0; i<score.length; i+=1){
				if (score[i] >= topSampleScore[j]){
					topSampleScore[j] = score[i];
					topSamplePos[j] = i;
				}
			}
			score.splice(topSamplePos[j],1);
		}
		print(topSampleScore);
		print(topSamplePos);
		for (var i=0; i<sampleTake; i+=1){
			partTrials.push(trials[topSamplePos[i]]);
		}
		partScores = topSampleScore;
		print(topSamplePos)
		
		avg = 0;
		for (var i=0; i<topSampleScore.length; i+=1){
			avg += topSampleScore[i];
		}
		avg/=sampleTake;

		trials = partTrials;
		var newTrials = [];
		for (var i=0; i<sampleTake; i+=1){
			for (var j=0; j<(100/sampleTake); j+=1){
				var newPic = [];
				for (var y = 0; y<picSize; y+=1){
					newPic.push([]);
					for (var x = 0; x<picSize; x+=1){
						newPic[y].push(flipBinary(partTrials[i][y][x]));
					}
				}
				newTrials.push(newPic);
			}
		}
		for (var i=0; i<newTrials.length; i+=1){
			trials.push(newTrials[i]);
		}
	}
}

function drawPic(X,Y,pic,size) {
	stroke(10);
	strokeWeight(1);
	noStroke();
	for (var y = 0; y<pic.length; y+=1){
		for (var x = 0; x<pic[0].length; x+=1){
			if (pic[y][x]===1){
				fill(10);
			} else {
				fill(245);
			}
			rect(X+size*x,Y+size*y,size,size);
		}
	}
	stroke(0);
	line(X,Y,X+picSize*size,Y);
	line(X+picSize*size,Y,X+picSize*size,Y+picSize*size);
	line(X+picSize*size,Y+picSize*size,X,Y+picSize*size);
	line(X,Y+picSize*size,X,Y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  W = windowWidth;
  H = windowHeight;
  if (W>H){
  	pixelSize = H/(((picSize+1)*n)+4);
  } else {
	  pixelSize = W/(((picSize+1)*n)+1);
  }
}
function mouseClicked(){
	if (finished && scene === 2){
		initVar();
		whichPic += 1;
	} else {
		if (scene<2){
			scene += 1;
		} else {
			checkScore();
			eliminateTrials();
	// 		print(score);
		}
		if (avg===sq(picSize)){
			scene = 1;
			avg = 0;
			finished = true;
		}
	}
}