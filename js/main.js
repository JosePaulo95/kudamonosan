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
          //AudioController.playSound("release", this.is_testing);
        }else{
          let movement_on_same_row = (i == this.grabbedCell.i);
          let diference = (this.grabbedCell.i-i)+(this.grabbedCell.j-j);
          let sense = diference==-1||diference==2?+1:-1;

          if(movement_on_same_row){
            
            this.moveLine("row", i, sense);
          }else{
            
            this.moveLine("column", j, sense);
          }

          AudioController.playSound("release", this.is_testing);
        }
      }

      this.grabbedCell = null;
    },
    animeResize(target, scale_points=[1,1]){
      let duration = 2000;

      anime({
        targets: target,
        scale: {
          value: [scale_points[0], scale_points[1]],
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
            scale: 1
          });
        }
      });
    },
    animeTranslate(target, x_direction_points=[0, 0], y_direction_points=[0, 0], callback=null){
      let duration = 500;

      //console.log(y_direction_points);

      anime({
        targets: target,
        translateX: {
          value: [x_direction_points[0]*103+"%", x_direction_points[1]*103+"%"],
          duration: duration
        },
        translateY: {
          value: [y_direction_points[0]*103+"%", y_direction_points[1]*103+"%"],
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
    moveLine(direction_code, index, sense){
      if(direction_code == "row"){
        swit.default();
      }else{
        swit.invert();
      }

      let cell_do_meio = '.cell-'+swit(index, 1)+'-'+swit(index, 1);
      let cell_lateral_normal = '.cell-'+swit(index, 1-sense)+'-'+swit(index, 1-sense);
      let cell_to_circulate = '.cell-'+swit(index, 1+sense)+'-'+swit(index, 1+sense);
      let cell_aux_rubik = ".cell-rubik-aux";
      this.cell_to_circulate_code = this.grid[swit(index, 1+sense)][swit(index, 1+sense)]

      let callbackFunc = function () {
        this.updateOnGrid(direction_code, index, sense);  
        this.setDisplay(".cell-rubik-aux-parent", false);
      }.bind(this)

      if(!this.is_testing){        
        this.animeTranslate(cell_lateral_normal, swit([0, sense], [0, 0]), swit([0, sense], [0, 0]));
        this.animeTranslate(cell_do_meio,        swit([0, sense], [0, 0]), swit([0, sense], [0, 0]));
        this.animeTranslate(cell_to_circulate,   swit([-3*sense, -2*sense], [0, 0]), swit([-3*sense, -2*sense], [0, 0]), callbackFunc.bind(this));
        this.animeSetPos(cell_aux_rubik, swit(0, index-1), swit(0, index-1));
        this.setDisplay(".cell-rubik-aux-parent", false);
        this.animeTranslate(cell_aux_rubik,      swit([sense, sense*2], [0, 0]), swit([sense, sense*2], [0, 0]));
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
    updateOnGrid(direction_code, index, sense){
      if(direction_code == "column"){
        this.updateGridColumn(index, sense);  
        this.checkExecuteMatch(null, index);
      }else{
        this.updateGridRow(index, sense);    
        this.checkExecuteMatch(index, null);
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
    evoluteCell(index_row, index_col){
      //console.log("evoluindo "+index_row+" "+index_col)
      this.grid[index_row][index_col]++;
      //this.updateGridRow(index_row);
    },
    deriveMatchedCellsBehavior(grid, index_moved_row, index_moved_column){
      let matched_columns;
      let matched_rows;

      if(index_moved_row != null){
        swit.default();
      }else if(index_moved_column != null){
        swit.invert();
      }else{
        return;
      }

      let index_moved_line = swit(index_moved_row, index_moved_column);
      swit();

      matched_lines_indexes = swit(this.findMatchedColumns(grid), this.findMatchedRows(grid));
      swit();

      let combining = [];
      let evolving = [];
      matched_lines_indexes.map(function(match_index) {  
        for (var i = 0; i < 3; i++) {
          if(i != index_moved_line){
            combining.push({
              i: swit(i, match_index),
              j: swit(i, match_index),
              x: swit(0, index_moved_line-i),
              y: swit(0, index_moved_line-i)
            });
          }else{
            evolving.push({
              i: swit(i, match_index),
              j: swit(i, match_index)
            });
          }
        }
      })
      return {combining, evolving};
      //if moved row
      //checa todas as colunas com match
      //pra cada retorna o endereço das complementares
      //if moved colum
      //checa todas as rows com match
      //pra cada retorna o endereço das complementares
    },
    checkExecuteMatch(index_moved_row, index_moved_column){
      if(this.thereIsMatch3x3(this.grid)){
        let cells = this.deriveMatchedCellsBehavior(this.grid, index_moved_row, index_moved_column);
        let combining = cells.combining;
        let evolving = cells.evolving;

        console.log(evolving)

        for (var i = 0; i < combining.length; i++) {
          if(!this.is_testing){
            let target = "cell-"+combining[i].i+"-"+combining[i].j;
            document.getElementsByClassName(target)[0].parentElement.style.zIndex = 10;
            this.animeTranslate("."+target, [0, combining[i].x], [0, combining[i].y]);
          }
        }

        for (var i = 0; i < evolving.length; i++) {
          if(!this.is_testing){
            let cell_aux_rubik = ".cell-rubik-aux";
            this.animeTranslate(cell_aux_rubik, [sense, sense*2], [0, 0]);
            //this.setDisplay(".cell-rubik-aux-parent", false);
            //this.animeTranslate(cell_aux_rubik,      swit([sense, sense*2], [0, 0]), swit([sense, sense*2], [0, 0]));
            //let target = "cell-"+evolving[i].i+"-"+evolving[i].j;
            //document.getElementsByClassName(target)[0].parentElement.style.zIndex = 15;
            this.animeResize(cell_aux_rubik, [1, 1.5]);
          }
        }
      }
      
      /*
      //console.log("checando match dps de mover "+(index_moved_row!=null?"row":"column")+" "+(index_moved_row!=null?index_moved_row:index_moved_column))
      if(this.thereIsMatch3x3(this.grid)){
        //console.log("tem um match")
        let index_matched_column;
        let index_matched_row;

        if(index_moved_row != null){
          //console.log("checando matched Column")
          index_matched_column = this.findMatchedColumn(this.grid);
          //this.evoluteCell(index_moved_row, index_matched_column);
        }else if(index_moved_column != null){
          //console.log("checando matched Row")
          index_matched_row = this.findMatchedRow(this.grid);
          //this.evoluteCell(index_matched_row, index_moved_column);
        }
      }else{
        //console.log("nao tem match")
      }
      */
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
    findMatchedRows(grid){
      let indexes = [];
      for (var i = 0; i < 3; i++) {
        if(grid[i][0] == grid[i][1] && grid[i][1] == grid[i][2]){
          indexes.push(i);
        }
      }
      return indexes;
    },
    findMatchedColumns(grid){
      let indexes = [];
      for (var i = 0; i < 3; i++) {
        if(grid[0][i] == grid[1][i] && grid[1][i] == grid[2][i]){
          indexes.push(i);
        }
      }
      return indexes;
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
      runSwitcherTests();

      this.is_testing = false;
    }
  }
});