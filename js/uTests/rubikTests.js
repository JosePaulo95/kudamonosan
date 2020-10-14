function runRubikTests(context) {
  console.assert(fillingTheGridFillsTheGrid.call(context), "fillingTheGridFillsTheGrid");
  console.assert(thereIsMatch3x3IndicatesPositiveCases.call(context), "thereIsMatch3x3IndicatesPositiveCases");
  console.assert(thereIsMatch3x3IndicatesNegativeCases.call(context), "thereIsMatch3x3IndicatesNegativeCases");
  console.assert(initialFillDoesntGetMatches.call(context), "initialFillDoesntGetMatches");
  console.assert(generateGridDoesntGetTooMuch.call(context), "generateGridDoesntGetTooMuch");
  console.assert(thereIsMoveIndicatesPositiveCases.call(context), "thereIsMoveIndicatesPositiveCases");
  console.assert(thereIsMoveIndicatesNegativeCases.call(context), "thereIsMoveIndicatesNegativeCases");
  //gameplay
  console.assert(nullMoveChangesNothing.call(context), "nullMoveChangesNothing");
  console.assert(matchedCellsBehaviorIsCorrect.call(context), "matchedCellsBehaviorIsCorrect");
  //console.assert(notMatchingMovesChangesTheGrid.call(context), "notMatchingMovesChangesTheGrid");
}
function matchedCellsBehaviorIsCorrect() {
  let grid = [
  [1,2,3],
  [4,2,6],
  [7,2,9]];
  let cells = this.deriveMatchedCellsBehavior(grid, 1, null);
  let combining = cells.combining;

  if(combining.length != 2){
    return false;
  }

  let expected_1 = (cell) => cell.i == 0 && cell.j == 1;
  let expected_2 = (cell) => cell.i == 2 && cell.j == 1;
  let not_expected_1 = (cell) => cell.i == 1 && cell.j == 1;
  let not_expected_2 = (cell) => cell.i == 0 && cell.j == 0;

  console.log(combining)

  if(!(combining.some(expected_1) && combining.some(expected_2))){
    return false;
  }
  if(combining.some(not_expected_1) || combining.some(not_expected_2)){
    return false;
  }

  grid = [
  [2,2,2],
  [4,1,6],
  [7,6,9]];
  cells = this.deriveMatchedCellsBehavior(grid, null, 2);
  combining = cells.combining;

  if(combining.length != 2){
    return false;
  }
  expected_1 = (cell) => cell.i == 0 && cell.j == 0;
  expected_2 = (cell) => cell.i == 0 && cell.j == 1;
  not_expected_1 = (cell) => cell.i == 0 && cell.j == 2;
  not_expected_2 = (cell) => cell.i == 1 && cell.j == 1;

  if(!(combining.some(expected_1) && combining.some(expected_2))){
    return false;
  }
  if(combining.some(not_expected_1) || combining.some(not_expected_2)){
    return false;
  }

  return true;
}
function notMatchingMovesChangesTheGrid() {
  this.grid = [[1,2,3], [4,5,6], [7,8,9]]//this.createInitialGrid();
  this.grab(1,0);
  this.release(1,1);
  if(this.grid[1][0] != 6 || this.grid[1][1] != 4 || this.grid[1][2] != 5){
    return false;
  }
  
  this.grid = [[1,2,3], [4,5,6], [7,8,9]]//this.createInitialGrid();
  this.grab(2,2);
  this.release(1,2);
  if(this.grid[0][2] != 6 || this.grid[1][2] != 9 || this.grid[2][2] != 3){
    return false;
  }

  this.grid = [[1,2,3], [4,5,6], [7,8,9]]//this.createInitialGrid();
  this.grab(0,1);
  this.release(1,1);
  if(this.grid[0][1] != 8 || this.grid[1][1] != 2 || this.grid[2][1] != 5){
    return false;
  }

  return true;
}

function nullMoveChangesNothing() {
  this.grid = this.createInitialGrid();
  this.grid[1][1] = 2;

  this.grab(1,1);
  this.release(1,1);

  return this.grid[1][1] == 2;
}

function thereIsMoveIndicatesNegativeCases() {
  let mnp1 = [[2,1,3],
             [2,4,5],
             [1,4,7]];//<=

  let mnp2 = [[1,3,3],
             [2,3,5],
             [5,2,1]];//=>

  let mnp3 = [[5,1,8],
             [1,4,4],
             [2,2,5]];
            //v
  let mnp4 = [[1,2,1],
             [4,8,8],
             [5,6,7]];  
              //^
  let mnp5 = [[3,2,8],
             [3,1,1],//<=
             [5,6,8]];

  return  !this.thereIsMove(mnp1) &&
          !this.thereIsMove(mnp2) &&
          !this.thereIsMove(mnp3) &&
          !this.thereIsMove(mnp4) &&
          !this.thereIsMove(mnp5);
}

function thereIsMoveIndicatesPositiveCases() {
  let mp1 = [[2,1,3],
             [2,4,5],
             [1,2,7]];//<=

  let mp2 = [[1,3,3],
             [2,3,5],
             [3,2,1]];//=>

  let mp3 = [[4,1,8],
             [1,4,4],
             [2,2,5]];
            //v
  let mp4 = [[1,2,1],
             [4,1,8],
             [5,6,7]];  
              //^
  let mp5 = [[3,2,8],
             [8,1,1],//<=
             [5,6,8]];

  return  this.thereIsMove(mp1) &&
          this.thereIsMove(mp2) &&
          this.thereIsMove(mp3) &&
          this.thereIsMove(mp4) &&
          this.thereIsMove(mp5);
}

function generateGridDoesntGetTooMuch() {
  for (var i = 0; i < 10000; i++) {
    if(this.createInitialGrid(true) > 30){
      return false;
    }
  }
  return true;
}

function initialFillDoesntGetMatches() {
  for (var i = 0; i < 100; i++) {
    if(this.thereIsMatch3x3(this.createInitialGrid())){
      return false;
    }
  }
  return true;
}

function thereIsMatch3x3IndicatesNegativeCases() {
  let almost_h = [[2,2,1], [3,1,3], [1,4,4]];
  let almost_v = [[2,5,1],
                  [2,1,9],
                  [1,5,9]];
  let almost_chess = [[1,2,1],
                      [2,1,2],
                      [1,2,1]];

  return  !this.thereIsMatch3x3(almost_h) &&
          !this.thereIsMatch3x3(almost_v) &&
          !this.thereIsMatch3x3(almost_chess);
}
function thereIsMatch3x3IndicatesPositiveCases() {
  let mh1 = [[1,1,1], [2,3,4], [5,6,7]];
  let mh2 = [[2,3,4], [1,1,1], [5,6,7]];
  let mh3 = [[2,3,4], [5,6,7], [1,1,1]];

  let mv1 = [[2,1,3],
             [2,4,5],
             [2,6,7]];
  let mv2 = [[1,3,3],
             [2,3,5],
             [1,3,7]];
  let mv3 = [[2,1,4],
             [1,4,4],
             [2,2,4]];

  let double_case_1 =  [[2,1,4],
                        [4,4,4],
                        [2,2,4]];
  let double_case_2 =  [[5,1,4],
                        [5,3,4],
                        [5,2,4]];
  return  this.thereIsMatch3x3(mh1) &&
          this.thereIsMatch3x3(mh2) &&
          this.thereIsMatch3x3(mh3) && 
          this.thereIsMatch3x3(mv1) &&
          this.thereIsMatch3x3(mv2) &&
          this.thereIsMatch3x3(mv3) &&
          this.thereIsMatch3x3(double_case_1) &&
          this.thereIsMatch3x3(double_case_2);
}
function fillingTheGridFillsTheGrid(){
  this.clearGrid();
  this.grid = this.createInitialGrid();

  for (var i = 0; i < this.grid.length; i++) {
    for (var j = 0; j < this.grid[i].length; j++) {
      if(this.grid[i][j] == 0){
        return false;
      }
    }
  }

  return true;
}