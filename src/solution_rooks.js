window.countNRooksSolutions = function(n) {
  var solutionCount = 0; //fixme

  var board = new Board({n:n});

  // use inner function
  // It self contains recursin inside of an interface
  // it can also be refactored and reused in all solutions
  var findSolution= function (board, cols, row){

    // establish base case
    if ( row === cols ) {
      solutionCount++;
      return;
    }

    for ( var i = 0; i < cols; i++ ) {
      board.toggPiece(row, i);

      // if no fonflicts, call findSolution again
      if ( !board.hasAnyRooksConflicts() ) {

        // increment recursive call to only look at next row.
        // skip rest of spaces in this row
        findSolution(board, cols, row + 1);
      }
      // if there is a conflict remove piece
      boad.toggPiece(row, i);
    }

  }

  findSolution(board, n, 0)
;
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};