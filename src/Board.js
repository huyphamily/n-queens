// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // initalize count
      var count = 0;

      // for every index of a row, count 1's
      for ( var i = 0; i < rowIndex.length; i++ ) {
        if ( rowIndex[i] === 1) {
          count++;
        }
      }
      if ( count > 1 ) {
        return true;
      } else {
        return false;
      }
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // get all of the rows
      var obj = this.rows();
      // initialize result
      var result = false;
      // for every row, call hasRowConflictAt
      for ( var i = 0; i < obj.length; i++) {
        if (this.hasRowConflictAt(obj[i])) {
          result = true;
        }
      }
      return result;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {

      // get every row
      var obj = this.rows();

      // initialize count
      var count = 0;

      // for every row
      for ( var i = 0; i < obj.length; i++) {
        // check index value at row
        // using [colIndex] forces check single index in each row
        if ( obj[i][colIndex] === 1) {

          // increment count if it's 1
          count++;
        }
      }
      if ( count > 1 ) {
        return true;
      } else {
        return false;
      }
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      // get every row
      var obj = this.rows();
      var result = false;
      // call hasColConflictAt for every index ( just used as a counter )
      for ( var i = 0; i < obj.length; i++) {
        if (this.hasColConflictAt(i)) {
          result = true;
        }
      }
      return result;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // get every row
      var obj = this.rows();

      // init a variable to make it easier
      var current = majorDiagonalColumnIndexAtFirstRow;
      var count = 0;
      // for every index in every row, check one row down and one index over
      for(var i = 0; i < obj.length; i++){
        // guard against last index position, 
        // current will be on ahead of our index after first iteration
        if (obj[i][current] === undefined ){
          break;
        }
        // increment count
        if ( obj[i][current] === 1) {
        count++;
        }
        current++;
      }
      if ( count > 1 ) {
        return true;
      } else {
        return false;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      // get all rows
      var obj = this.rows();
      var result = false;
      
      // use row length as an incrementer for hasMajorDiagonalConflictAt
      for ( var i = 0; i < obj.length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          result = true;
        }
      }
      return result;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var obj = this.rows();
      var current = minorDiagonalColumnIndexAtFirstRow;
      var count = 0;
      for(var i = 0; i < obj.length; i++){
        if (obj[i][current] === undefined ){
          break;
        }
        // instead of incrementing counr, decrement to find one down, one left
        if ( obj[i][current] === 1) {
        count++;
        }
        current--;
      }
      if ( count > 1 ) {
        return true;
      } else {
        return false;
      }
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var obj = this.rows();
      var result = false;

      for ( var i = 0; i < obj.length; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          result = true;
        }
      }
      return result;
    },

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
