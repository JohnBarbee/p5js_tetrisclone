var boardW = 10;
var boardH = 20;
var gridW = 15;
var font;
var lines = 0;
var grid = [];
var upNextID;
var b;
var bankSlot;
var paused = true;
var gameStarted = false;

function setup() {
  createCanvas(400, 400);
  reset();
}

function draw() {
  background(55);
  noFill();
  stroke(255);
  rect(50,50,75,75,10);
  rect(50,150,75,75,10);
  textFont("Consolas", 15);
  textAlign(CENTER);
  text('Bank',88,42);
  text('Up Next',88,142);
  text('Lines: ' + lines,88,300);
  text('Press P to pause',88,325);
  
  if(paused == false){
    for(var i = 0; i < boardW; i +=1){
      for(var j = 0; j < boardH; j +=1){
        stroke(255);
        if(grid[i][j] == 0){
          noFill();
        } else {
          fill(255);
        }
        rect(175 + (i * gridW), 50 + (j * gridW), gridW, gridW);

        //check grid and add fill to block...
      }
    }
		drawBlockUI(88,88,bankSlot);
  	drawBlockUI(88,188,upNextID);
    
    if(keyIsDown(DOWN_ARROW) && frameCount % 5 == 0){
      b.moveDown();
    } else if(frameCount % 60 == 0){
      b.moveDown();
    }
  } else {
    stroke(255);
    var bW = gridW * boardW;
    var bH = gridW * boardH;
    rect(175, 50, bW, bH);
    if(gameStart == false){
      textFont("Consolas", 10);
      text('Press P to start game', 175 + (bW/2), 50 + (bH/2));
    } else {
      textFont("Consolas", 10);
      text('Press P to unpause', 175 + (bW/2), 50 + (bH/2));
    }
  }
}

function reset(){
  paused = true;
  gameStart = false;
  bankSlot = undefined;
  for(var i = 0; i < boardW; i +=1){
    grid[i] = [];
    for(var j = 0; j < boardH; j +=1){
      grid[i][j] = 0;
  	}
  }
}

function pauseGame(){
  if(gameStart == false){
    reset();
    startGame();
  } else {
    paused = !paused;
  }
}

function startGame(){
  lines = 0;
  upNextID = floor(random(0,7));
  dropBlock(upNextID);
  gameStart = true;
  paused = false;
}

function keyPressed(){
  if(keyCode == LEFT_ARROW){
    b.moveLeft();
  } else if(keyCode == RIGHT_ARROW) {
    b.moveRight();
  } else if(keyCode == UP_ARROW) {
    b.rotateBlock();
  } else if(keyCode == 32){
    var temp = b;
    while(temp == b){
      b.moveDown();
    }
  } else if(keyCode == CONTROL){
    bankBlock();
  } else if(keyCode == 80){
    pauseGame();
  }
}

function dropBlock(blockID,fromBank = false){
  if(b!=undefined){
  	checkBlockRows();
  }
  b = new Block(4,1,blockID);
  if(fromBank == false){
  	upNextID = floor(random(1,8)); //includes 1 and excludes 8
  }
}

function checkBlockRows(){
  //multiple rows clearing at once bugs out
  //implement more expensive way
  //loop through all blocks to delete one line at a time
  var check = false;
  var index;
  for(var j = 0; j < boardH; j++){
    var full = true;
  	for(var i = 0; i < boardW; i++){
  	  if(grid[i][j] == 0){
        full = false;
      }
  	}
    if(full == true){
      index = j;
      check = true;
      lines++;
      break;
    }
  }
  
  for(var ii = 0; ii < boardW; ii++){
    for(var jj = index; jj >= 0; jj--){
    	if(jj == 0){
        grid[ii][jj] = 0;
      } else {
        grid[ii][jj] = grid[ii][jj-1];
      }
  	}
  }
  
  if(check == true){
    checkBlockRows();
  }
}

function drawBlockUI(x,y,id){
  stroke(255);
  fill(255);
  switch(id){
    case 7:
      //7 is the T block or stairs
      rect(x-8,y,gridW,gridW);
      rect(x + gridW-8,y,gridW,gridW);
      rect(x - gridW-8,y,gridW,gridW);
      rect(x-8,y - gridW,gridW,gridW);
      break;
    case 1:
      //1 is the square block
      rect(x-15,y,gridW,gridW);
      rect(x + gridW-15,y,gridW,gridW);
      rect(x + gridW-15,y-gridW,gridW,gridW);
      rect(x-15,y - gridW,gridW,gridW);
      break;
    case 2:
      //2 is the long block
      rect(x-8,y + gridW,gridW,gridW);
      rect(x-8,y,gridW,gridW);
      rect(x-8,y - (gridW*2),gridW,gridW);
      rect(x-8,y - gridW,gridW,gridW);
      break;
    case 3:
      //3 is the periscope block (backwards L)
      rect(x,y+5,gridW,gridW);
      rect(x,y-(gridW*2)+5,gridW,gridW);
      rect(x - gridW,y+5,gridW,gridW);
      rect(x,y - gridW+5,gridW,gridW);
      break;
    case 4:
      //4 is the L block
      rect(x-gridW,y+5,gridW,gridW);
      rect(x-gridW,y-(gridW*2)+5,gridW,gridW);
      rect(x,y+5,gridW,gridW);
      rect(x-gridW,y - gridW+5,gridW,gridW);
      break;
    case 5:
      //5 is the backwards S block
      rect(x-8,y,gridW,gridW);
      rect(x - gridW - 8,y-gridW,gridW,gridW);
      rect(x + gridW -8,y,gridW,gridW);
      rect(x-8,y - gridW,gridW,gridW);
      break;
    case 6:
      //6 is the S block
      rect(x-8,y,gridW,gridW);
      rect(x + gridW - 8,y-gridW,gridW,gridW);
      rect(x - gridW -8,y,gridW,gridW);
      rect(x-8,y - gridW,gridW,gridW);
      break;
  }
}

function bankBlock(){
  if(bankSlot == undefined){
    bankSlot = b.id;
    b.setGridPoints(0);
    dropBlock(upNextID);
  } else {
    var temp = bankSlot;
    bankSlot = b.id;
    b.setGridPoints(0);
    dropBlock(temp,true);
  }
}