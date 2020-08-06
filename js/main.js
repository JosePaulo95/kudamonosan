var App = new Vue({
  el: "#app",
  data() {
    return {
      grid: [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
      ],
      grabbedCell:{
        i: null,
        j: null
      },
      is_testing: false
    }
  },
  beforeMount(){
    
  },
  mounted(){
    this.runTests(); 
    this.fill(2,2)
  },
  computed: {
  },
  methods: {
    grab(i, j){
      if(this.isFull(i,j)){
        this.grabbedCell = {i, j};
        AudioController.playSound("grab", this.is_testing);
      }else{
        AudioController.playSound("grab_nothing", this.is_testing);
      }
    },
    release(i=null,j=null){
      console.log("release"+i+"-"+j)
      if(this.isHolding()){
        if(i==null && j==null){//quer dizer q nenhuma celula recebeu o release, deve ter sido fora
          AudioController.playSound("error", this.is_testing);
        }else{
          this.clear(this.grabbedCell.i, this.grabbedCell.j);
          this.fill(i, j);

          AudioController.playSound("release", this.is_testing);
        }
      }

      this.grabbedCell = null;
    },
    isGrabbedCell(i, j){
      return this.grabbedCell != null && this.grabbedCell.i == i && this.grabbedCell.j == j;
    },
    isHolding(){
      return this.grabbedCell !== null;
    },
    isFull(i, j){
      return this.grid[i][j] !== 0;
    },
    fill(i, j){
      this.grid[i][j] = 1;
      Vue.set(this.grid, i, this.grid[i])
    },
    clear(i, j){
      this.grid[i][j] = 0;
      Vue.set(this.grid, i, this.grid[i])
    },
    clearGrid(){
      for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
          this.grid[i][j] = 0;
        }
      }
      this.grabbedCell = null;
    },
    runTests(){
      this.is_testing = true;

      console.assert(isHoldingGetsTrueInFullCells.call(this), "isHoldingGetsTrueInFullCells");
      console.assert(isHoldingGetsFalseInEmptyCells.call(this), "isHoldingGetsFalseInEmptyCells");
      console.assert(grabbedCellBecomesGrabbed.call(this), "grabbedCellBecomesGrabbed");
      console.assert(releaseCellReleasesGrabbedCell.call(this), "releaseCellReleasesGrabbedCell");
      console.assert(grabAndReleaseClearsOldGrabbed.call(this), "grabAndReleaseClearsOldGrabbed");
      this.clearGrid();

      this.is_testing = false;
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

        //this.grab(1,1);
        //this.release(2,2);

        return !this.isFull(1,1);
      }
    }
  }
});