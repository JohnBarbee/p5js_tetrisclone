class Block{
  constructor(x,y,id){
    this.x = x;
    this.y = y;
    this.id = id;
    this.index = 0;
    this.hasMoved = false;
    this.points = [];
    this.buildBlock();
    this.checkIfGameOver();
    this.setGridPoints(id);
  }
  
  checkIfGameOver(){
    var safe = true;
    var px,py;
    for(var i = 0; i < 4; i++){
      if(i == 3){
        px = this.x;
        py = this.y;
      } else {
        px = this.x + this.points[this.index][(i*2)];
        py = this.y + this.points[this.index][(i*2) + 1];
      }
      if(grid[px][py] != 0){
        safe = false;
      }
    }
    
    if(safe == false){
      reset();
    }
  }
  
  buildBlock(){
    switch(this.id){
      case 7:
        //7 is the T block or stairs (was 0 but conflicted with board empty state)
        this.points = [[-1,0,1,0,0,-1],
                       [0,-1,1,0,0,1],
                       [-1,0,1,0,0,1],
                       [0,1,-1,0,0,-1]];
        break;
      case 1:
        //1 is the square block
        //we still populate the entire matrix to not cause problems
        this.points = [[1,0,1,-1,0,-1],
                       [1,0,1,-1,0,-1],
                       [1,0,1,-1,0,-1],
                       [1,0,1,-1,0,-1]];
        break;
      case 2:
        //2 is the long block
        this.points = [[0,1,0,-1,0,2],
                       [2,0,1,0,-1,0],
                       [0,1,0,-1,0,2],
                       [2,0,1,0,-1,0]];
        break;
      case 3:
        //3 is the periscope block (backwards L)
        this.points = [[-1,1,0,1,0,-1],
                       [-1,-1,-1,0,1,0],
                       [1,-1,0,-1,0,1],
                       [1,1,-1,0,1,0]];
        break;
      case 4:
        //4 is the L block
        this.points = [[1,1,0,1,0,-1],
                       [-1,1,1,0,-1,0],
                       [-1,-1,0,1,0,-1],
                       [1,-1,1,0,-1,0]];
        break;
      case 5:
        //5 is the backwards S block
        this.points = [[-1,-1,0,-1,1,0],
                       [1,-1,1,0,0,1],
                       [-1,-1,0,-1,1,0],
                       [1,-1,1,0,0,1]];
        break;
      case 6:
        //6 is the S block
        this.points = [[1,-1,0,-1,-1,0],
                       [1,1,1,0,0,-1],
                       [1,-1,0,-1,-1,0],
                       [1,1,1,0,0,-1]];
        break;
    }
  }
  
  rotateBlock(){
    //need to check collision before rotate
    //get only new locations
    //don't need x,y as it is our center
    var newIndex = this.index + 1;
    if(newIndex == 4){
      newIndex = 0;
    }
    var checkloc = [];
    var add;
    for(var i = 0; i < 3; i++){
      add = true;
      for(var j = 0; j < 3; j++){
        var ax,ay,bx,by;
        ax = this.points[newIndex][(i*2)];
        ay = this.points[newIndex][(i*2) + 1];
        bx = this.points[this.index][(j*2)];
        by = this.points[this.index][(j*2) + 1];
        
        if(ax == bx && ay == by){
          add = false;
        }
      }
      if(add == true){
        checkloc.push(this.points[newIndex][(i*2)]);
        checkloc.push(this.points[newIndex][(i*2) + 1]);
      }
    }
    //check those locations for block and in bounds
    var gtg = true;
    for(var iii = 0; iii < checkloc.length / 2; iii++){
      if(this.x + checkloc[(iii*2)] < 0 || this.x + checkloc[(iii*2)] >= boardW){
        gtg = false;
      } else if(this.y + checkloc[(iii*2) + 1] < 0 || this.x + checkloc[(iii*2) + 1] >= boardH){
        gtg = false;
      } else if(grid[this.x + checkloc[(iii*2)]][this.y + checkloc[(iii*2)+1]] != 0){
        gtg = false;
      }
    }
    //rotate if clear
    if(gtg == true){
    	this.setGridPoints(0);
    	this.index = newIndex;
    	this.setGridPoints(this.id);
    }
  }
  
  moveDown(){
    if(this.checkCollision(0) == true){
      dropBlock(upNextID);
    } else {
      this.setGridPoints(0);
      this.y+=1;
      this.setGridPoints(this.id);
      this.moves++;
    }
  	
  }
  
  moveLeft(){
    //get 1 block per y coordinate at the left most x (least x)
    if(this.checkCollision(-1) != true){
      this.setGridPoints(0);
      this.x-=1;
      this.setGridPoints(this.id);
    }
  }
  
  moveRight(){
    //get 1 block per y coordinate at the right most x (most x)
    if(this.checkCollision(1) != true){
      this.setGridPoints(0);
      this.x+=1;
      this.setGridPoints(this.id);
    }
  }
  
  setGridPoints(id){
    grid[this.x][this.y] = id;
    for(var i = 0; i < 3; i += 1){
      grid[this.x + this.points[this.index][(i*2)]][this.y + this.points[this.index][(i*2) + 1]] = id;
    }
  }
  
  checkCollision(dir){
    //we are going to start passing in an int into this function
    //-1 == left
    //0 == down
    // 1 == right
    //this is going to allow us to get rid of two other functions
  	//get 1 block per x coordinate with the highest y (lowest on screen)
    var pointx, pointy;
    pointx = this.x;
    pointy = this.y;
    var tempPoints = [pointx, pointy];
    var add;
    for(var i = 0; i < 3; i += 1){
    	add = true;
      pointx = this.x + this.points[this.index][(i*2)]
      pointy = this.y + this.points[this.index][(i*2) + 1]
      for(var j = 0; j < tempPoints.length / 2; j+= 1){
        if(dir == 0){
        	if(pointx == tempPoints[(j*2)] && pointy < tempPoints[(j*2) + 1]){
        	  add = false;
        	}
        } else if(dir == -1){
          if(pointx > tempPoints[(j*2)] && pointy == tempPoints[(j*2) + 1]){
        	  add = false;
        	}
        } else if(dir == 1){
          if(pointx < tempPoints[(j*2)] && pointy == tempPoints[(j*2) + 1]){
          	add = false;
        	}
        }
      }
      var added = false;
      if(add == true){
        for(var jj = 0; jj < tempPoints.length / 2; jj+= 1){
        	if(dir == 0 && pointx == tempPoints[(jj*2)]){
          	tempPoints[jj*2] = pointx;
            tempPoints[(jj*2) + 1] = pointy;
            added = true;
        	}
          if(dir != 0 && pointy == tempPoints[(jj*2) + 1]){
            tempPoints[jj*2] = pointx;
            tempPoints[(jj*2) + 1] = pointy;
            added = true;
          }
      	}
        if(added == false){
        	tempPoints.push(pointx);
        	tempPoints.push(pointy);
        }
      }
    }
    
    pointx = pointy = 0;
    var collision = false;
    //check all temppoints one coordinate higher for open space
    for(var ii = 0; ii < tempPoints.length / 2; ii+= 1){
      if(dir == 0){
        pointx = tempPoints[(ii*2)];
        pointy = tempPoints[(ii*2) + 1] + 1;
        if(pointy >= boardH){
          collision = true;
        } else if(grid[pointx][pointy] != 0){
          collision = true;
        }
      } else if(dir == -1){
        pointx = tempPoints[(ii*2)] - 1;
      	pointy = tempPoints[(ii*2) + 1];
      	if(pointx < 0){
      		collision = true;
      	} else if(grid[pointx][pointy] != 0){
      	  collision = true;
      	}
      } else if(dir == 1){
        pointx = tempPoints[(ii*2)] + 1;
      	pointy = tempPoints[(ii*2) + 1];
      	if(pointx >= boardW){
      		collision = true;
      	} else if(grid[pointx][pointy] != 0){
      	  collision = true;
      	}
      }
    }
    
    return collision;
  }
}