function runGrabDropTests(context) {
  console.assert(isHoldingGetsTrueInFullCells.call(context), "isHoldingGetsTrueInFullCells");
  console.assert(isHoldingGetsFalseInEmptyCells.call(context), "isHoldingGetsFalseInEmptyCells");
  console.assert(grabbedCellBecomesGrabbed.call(context), "grabbedCellBecomesGrabbed");
  console.assert(releaseCellReleasesGrabbedCell.call(context), "releaseCellReleasesGrabbedCell");
  //console.assert(grabAndReleaseClearsOldGrabbed.call(context), "grabAndReleaseClearsOldGrabbed");
}

function isHoldingGetsTrueInFullCells(){
  this.clearGrid();

  this.fill(0,0);
  this.grab(0,0);

  return this.isHolding() == true;
}
function isHoldingGetsFalseInEmptyCells(){
  this.clearGrid();

  this.fill(2,1); 
  this.grab(1,2);

  return this.isHolding() == false;
}
function grabbedCellBecomesGrabbed() {
  this.clearGrid();

  this.fill(2,1); 
  this.grab(2,1);

  return this.isGrabbedCell(2,1)
}
function releaseCellReleasesGrabbedCell() {
  this.clearGrid();

  this.fill(2,1); 
  this.grab(2,1);
  this.release();

  return this.grabbedCell == null;
}
function grabAndReleaseClearsOldGrabbed() {
  this.clearGrid();
  this.fill(1,1);

  this.grab(1,1);
  this.release(2,2);

  /*
  eventFire(document.getElementById("1-1"), 'mousedown');
  eventFire(document.getElementById("1-1"), 'ondragstart');
  eventFire(document.getElementById("2-2"), 'mouseup');
  eventFire(document.getElementById("2-2"), 'ondragend');

  function eventFire(el, etype){
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }
  */

  return !this.isFull(1,1);
}