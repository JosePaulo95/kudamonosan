var App = new Vue({
  el: "#app",
  data() {
    return {
      grid: [
        [0,0,0],
        [0,0,0],
        [0,0,0]
      ],
      grabbedCell:{
        i: null,
        j: null
      },
      is_testing: false,
      cell_to_circulate_code: 0
    }
  },
  beforeMount(){
    
  },
  mounted(){
    this.runTests(); 
    this.grid = this.createInitialGrid();

    this.animeSetPos(".cell-rubik-aux-parent", 1, -2);
    //this.fill(2,2)
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
      if(this.isHolding()){
        if(i==null && j==null){//quer dizer q nenhuma celula recebeu o release, deve ter sido fora
          AudioController.playSound("error", this.is_testing);
        }else if(i==this.grabbedCell.i && j==this.grabbedCell.j){
          AudioController.playSound("release", this.is_testing);
        }else{
          let movement_on_same_row = (i == this.grabbedCell.i);
          let diference = (this.grabbedCell.i-i)+(this.grabbedCell.j-j);
          let sense = diference==-1||diference==2?+1:-1;

          if(movement_on_same_row){
            this.moveRow(i, sense);
          }else{
            this.moveColumn(j, sense);
          }
          AudioController.playSound("release", this.is_testing);
        }
      }

      this.grabbedCell = null;
    },
    animeHorizontally(target, direction_points=[0, 1], callback=null){
      let duration = 500;

      anime({
        targets: target,
        translateX: {
          value: [direction_points[0]*103+"%", direction_points[1]*103+"%"],
          duration: duration
        },
        /*
        opacity: {
          value: [0, 1],
          duration: duration
        },
        */
        complete: function(anim) {
          anime.set(target, {
            translateX: 0,
            translateY: 0,
          });
          if(callback){
            callback.call();
          }
        }
      });
    },
    animeVertically(target, direction_points=[0, 1], callback=null){
      let duration = 500;

      anime({
        targets: target,
        translateY: {
          value: [direction_points[0]*103+"%", direction_points[1]*103+"%"],
          duration: duration
        },
        /*
        opacity: {
          value: [0, 1],
          duration: duration
        },
        */
        complete: function(anim) {
          anime.set(target, {
            translateX: 0,
            translateY: 0,
          });
          if(callback){
            callback.call();
          }
        }
      });
    },
    moveRow(index, sense){
      let cell_do_meio = '.cell-'+index+'-1';
      let cell_lateral_normal = '.cell-'+index+'-'+(1-sense);
      let cell_to_circulate = '.cell-'+index+'-'+(1+sense);
      let cell_aux_rubik = ".cell-rubik-aux";
      this.cell_to_circulate_code = this.grid[index][1+sense]

      let callbackFunc = function updateRow() {
        this.updateGridRow(index, sense);
        this.setDisplay(".cell-rubik-aux-parent", false);
      }.bind(this)

      if(!this.is_testing){        
        this.animeHorizontally(cell_lateral_normal, [0, sense]);
        this.animeHorizontally(cell_do_meio,        [0, sense]);
        this.animeHorizontally(cell_to_circulate,   [-3*sense, -2*sense], callbackFunc.bind(this));
        this.animeSetPos(cell_aux_rubik, 0, index-1);
        this.setDisplay(".cell-rubik-aux-parent", true);
        this.animeHorizontally(cell_aux_rubik,      [sense, sense*2]);
      }else{
        callbackFunc();
      }
    },
    setDisplay(target, show){
      document.getElementsByClassName('cell-rubik-aux-parent')[0].style.display = show?"block":"none";
    },
    animeSetPos(target, x, y){
      anime.set(target, {
        translateX: x*103+"%",
        translateY: y*103+"%"
      });
    },
    moveColumn(index, sense){
      let cell_do_meio = '.cell-1-'+index;
      let cell_lateral_normal = '.cell-'+(1-sense)+'-'+index;
      let cell_to_circulate = '.cell-'+(1+sense)+'-'+index;
      let cell_aux_rubik = ".cell-rubik-aux";

      this.cell_to_circulate_code = this.grid[1+sense][index]

      let callbackFunc = function updateRow() {
        this.updateGridColumn(index, sense);
        this.setDisplay(".cell-rubik-aux-parent", false);
      }.bind(this)

      if(!this.is_testing){        
        this.animeVertically(cell_lateral_normal, [0, sense]);
        this.animeVertically(cell_do_meio,        [0, sense]);
        this.animeVertically(cell_to_circulate,   [-3*sense, -2*sense], callbackFunc.bind(this));
        this.animeSetPos(cell_aux_rubik, index-1, 0);
        this.setDisplay(".cell-rubik-aux-parent", true);
        this.animeVertically(cell_aux_rubik,      [sense, sense*2]);
      }else{
        callbackFunc();
      }
    },
    updateGridRow(index, sense){
      let a = this.grid[index][0];
      let b = this.grid[index][1];
      let c = this.grid[index][2];

      if(sense>0){
        this.grid[index][0] = c;
        this.grid[index][1] = a;
        this.grid[index][2] = b;
      }else{
        this.grid[index][0] = b;
        this.grid[index][1] = c;
        this.grid[index][2] = a;
      }

      Vue.set(this.grid, index, this.grid[index])
    },
    updateGridColumn(index, sense){
      let a = this.grid[0][index];
      let b = this.grid[1][index];
      let c = this.grid[2][index];
      if(sense>0){
        this.grid[0][index] = c;
        this.grid[1][index] = a;
        this.grid[2][index] = b;
      }else{
        this.grid[0][index] = b;
        this.grid[1][index] = c;
        this.grid[2][index] = a;
      }
      Vue.set(this.grid, 0, this.grid[0])
      Vue.set(this.grid, 1, this.grid[1])
      Vue.set(this.grid, 2, this.grid[2])
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
    createInitialGrid(flag_testing_performance = false){
      let qtd_cells = this.grid.length*this.grid[0].length;
      let new_grid = [[],[],[]];
      let aux;
      let times = 0;

      do{
        times++;
        let types_stack = this.generateTypeStack(9, [15, 8, 5, 1])
        for (var i = 0; i < this.grid.length; i++) {
          for (var j = 0; j < this.grid[i].length; j++) {
            new_grid[i][j] = types_stack.pop();
          }
        }
      }while(this.thereIsMatch3x3(new_grid) || !this.thereIsMove(new_grid));

      if(flag_testing_performance){
        return times;
      }else{
        return new_grid;
      }  
    },
    generateTypeStack(desired_size, wheights) {
        let stack = [];
        let still;
        do{
          still = false;
          for (var i = 0; i < wheights.length; i++) {
            if(wheights[i]>0){
              stack.push(i+1);
              wheights[i]--;
              still = true;
            }
          }
        }while(still);

        stack.sort(function() {
          return .5 - Math.random();
        });

        return stack.slice(stack.length-1-desired_size, stack.length-1);
    },
    thereIsMatch3x3(grid){
      for (var i = 0; i < 3; i++) {
        if(grid[i][0] == grid[i][1] && grid[i][1] == grid[i][2]){
          return true;
        }
        if(grid[0][i] == grid[1][i] && grid[1][i] == grid[2][i]){
          return true;
        }
      }
      return false;
    },
    thereIsMove(grid){
      let m00 = grid[0][0];
      let m01 = grid[0][1];
      let m02 = grid[0][2];

      let m10 = grid[1][0];
      let m11 = grid[1][1];
      let m12 = grid[1][2];

      let m20 = grid[2][0];
      let m21 = grid[2][1];
      let m22 = grid[2][2];

      
      //horizontais
      return  (m01==m02 && (m01==m10 || m01==m20)) ||
              (m11==m12 && (m11==m00 || m11==m20)) ||
              (m21==m22 && (m21==m00 || m21==m10)) ||

              (m00==m02 && (m00==m11 || m00==m21)) ||
              (m10==m12 && (m10==m01 || m10==m21)) ||
              (m20==m22 && (m20==m01 || m20==m11)) ||

              (m00==m01 && (m00==m12 || m00==m22)) ||
              (m10==m11 && (m10==m02 || m10==m22)) ||
              (m20==m21 && (m20==m12 || m20==m02)) ||

              //verticais
              (m10==m20 && (m10==m01 || m10==m02)) ||
              (m11==m21 && (m11==m00 || m11==m02)) ||
              (m12==m22 && (m12==m00 || m12==m01)) ||

              (m00==m20 && (m00==m11 || m00==m12)) ||
              (m01==m21 && (m01==m10 || m01==m12)) ||
              (m02==m22 && (m02==m10 || m02==m11)) ||

              (m00==m10 && (m00==m21 || m00==m22)) ||
              (m01==m11 && (m01==m20 || m01==m22)) ||
              (m02==m12 && (m02==m21 || m02==m20));
    },
    mediaGrid3x3(grid){
      let qtd_cells = grid.length*grid[0].length;
      let sum = Number(parseInt(grid[0][0])+parseInt(grid[0][1])+parseInt(grid[0][2])+parseInt(grid[1][0])+parseInt(grid[1][1])+parseInt(grid[1][2])+parseInt(grid[2][0])+parseInt(grid[2][1])+parseInt(grid[2][2]));

      return sum/qtd_cells;
    },
    clearGrid(){
      for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
          this.grid[i][j] = 0;
        }
      }
      this.grabbedCell = null;
    },
    spriteByCode(cell){
      return SpriteManager.getSpriteSrcByCellCode(cell);
    },
    runTests(){
      this.is_testing = true;
      runGrabDropTests(this);
      runRubikTests(this);

      this.is_testing = false;
    }
  }
});