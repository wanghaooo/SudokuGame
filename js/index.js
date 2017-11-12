/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	const toolKit = __webpack_require__(1);
	const Grid = __webpack_require__(2);
	const PopupNumbers = __webpack_require__(6);
	const popupNumbers = new PopupNumbers($("#popupNumbers"));
	
	
	const grid = new Grid($("#container"));
	grid.build();
	grid.layout();
	
	grid.bindPopup(popupNumbers);
	
	$("#check").on("click",e =>{
	    if(grid.check()){
	        alert("太厉害了，填写成功了！")
	    }
	});
	$("#reset").on("click",e =>{
	    grid.reset();
	});
	$("#clear").on("click",e =>{
	    grid.clear();
	});
	
	$("#rebuild").on("click",e =>{
	    grid.rebuild();
	});
	
	
	


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	const MaxtoolKit = {
	    MaxRow(v = 0) {
	        const arry = new Array(9);
	        arry.fill(v);
	        return arry;
	    },
	
	    MakeMatrax(v = 0) {
	        return Array.from({ length: 9 }, () => this.MaxRow(v));
	    },
	
	    shuffle(array) {
	        for (var i = 0; i <= array.length - 2; i++) {
	            j = Math.floor(Math.random() * (array.length - i)) + i;
	            [array[i], array[j]] = [array[j], array[i]];
	        }
	        return array;
	    },
	    //检查是否可以填写
	    checkFillable(matrix, n, rowIndex, colIndex) {
	        const row = matrix[rowIndex];
	        const colum = this.MaxRow().map((v, index) => matrix[index][colIndex]);
	        const { boxIndex } = boxToolKit.convertToBoxIndex(rowIndex, colIndex);
	        const box = boxToolKit.getBoxCells(matrix, boxIndex);
	        for (let i = 0; i < 9; i++) {
	            if (row[i] === n || colum[i] === n || box[i] === n) {
	                return false
	            }
	        }
	        return true;
	    }
	};
	
	const boxToolKit = {
	    getBoxCells(matrix, boxIndex) {
	        const startRowIndex = Math.floor(boxIndex / 3) * 3;
	        const startColIndex = boxIndex % 3 * 3;
	        const result = [];
	        for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
	            const rowIndex = startRowIndex + Math.floor(cellIndex / 3);
	            const colIndex = startColIndex + cellIndex % 3
	            result.push(matrix[rowIndex][colIndex]);
	        }
	        return result;
	    },
	
	    convertToBoxIndex(rowIndex, colIndex) {
	        return {
	            boxIndex: Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3),
	            cellIndex: rowIndex % 3 * 3 + colIndex % 3
	        }
	    },
	    converFromBoxIndex(boxIndex, cellIndex) {
	        return {
	            rowIndex: Math.floor(boxIndex / 3) * 3 + Math.floor(cellIndex / 3),
	            colIndex: boxIndex % 3 * 3 + cellIndex % 3
	        }
	    }
	}
	
	module.exports = class toolKit {
	    static get matrix() {
	        return MaxtoolKit;
	    }
	    static get box() {
	        return boxToolKit;
	    }
	};
	


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	//生成九宫格
	//const Generator = require("../core/generater");
	const toolKit = __webpack_require__(1);
	const SudoKu = __webpack_require__(3);
	const Checker = __webpack_require__(5);
	
	class Grid {
	    constructor(container) {
	        this._$container = container;
	    }
	
	    build() {
	        //const generator = new Generator();
	        //generator.generate();
	        //const matrix = generator.matrix;
	        const sudoku = new SudoKu();
	        sudoku.make();
	        const matrix = sudoku.puzzleMatrix;
	        const rowClasses = ["row_top", "row_middle", "row_bottom"];
	        const colClasses = ["col_left", "col_center", "col_right"];
	
	        const $cells = matrix.map(rowValues => rowValues
	            .map((cellValue, colIndex) => {
	                return $("<span>")
	                    .addClass(colClasses[colIndex % 3])
	                    .addClass(cellValue ? "fixed" : "empty")
	                    .text(cellValue);
	            }));
	
	        const $divArray = $cells.map(($spanArray, rowIndex) => {
	            return $("<div>")
	                .addClass("row")
	                .addClass(rowClasses[rowIndex % 3])
	                .append($spanArray);
	        });
	
	        this._$container.append($divArray);
	    }
	
	    layout() {
	        const width = $("span:first").width();
	        $("span")
	            .height(width)
	            .css({
	                "line-height": `${width}px`,
	                "font-size": width < 32 ? `${width / 2}px` : ""
	            });
	    }
	    //将点击页面中的$cell传入到popupNumbers.popup参数中
	    bindPopup(popupNumbers) {
	        this._$container.on("click", "span", e => {
	            const $cell = $(e.target);
	            if ($cell.is(".fixed")) {
	                return;
	            }
	            popupNumbers.popup($cell);
	        })
	    }
	
	    check() {
	        //TODO数据从界面中获取
	        const $rows = this._$container.children();
	        //jQuery中map参数有区别与原生JS，第一个参数为Index，第二个才为vaulue
	        const data = $rows.map((rowIndex, div) => {
	            //div必须使用jQuery方法封装，否则只是DOM元素无法使用children方法获取子元素
	            return $(div).children()
	                .map((colIndex, span) => {
	                    return parseInt($(span).text() || 0);
	                })
	        }).toArray().map($data => $data.toArray());//此时出来的data数组不是原生JS数组而是jQuery对象数组，需要进行toArray方法转化
	
	        const checker = new Checker(data);
	
	        if (checker.check()) {
	            return true
	        }
	
	        //检查不成功，标记出错位置,利用checker.matrixMarks数组,通过each添加标记，jQuery中map与each区别在于前者返回一个新数组而each是在原有数组上修改
	        const marks = checker.matrixMarks;
	
	        this._$container.children().each((rowIndex, div) => {
	            $(div).children().each((colIndex, span) => {
	                const $span = $(span);
	                if ($span.is(".fixed") || marks[rowIndex][colIndex]) {
	                    $span.removeClass("error");
	                } else {
	                    $(span).addClass("error")
	                }
	            })
	        })
	    }
	
	    reset() {
	        this._$container.find("span:not(.fixed)")
	            .removeClass("mark1 mark2 error")
	            .addClass("empty")
	            .text(0);
	    }
	
	    clear() {
	        this._$container.find("span.error").removeClass("error mark1 mark2")
	            .addClass("empty")
	            .text(0);
	    }
	
	    rebuild() {
	        this._$container.empty();
	        this.build();
	        this.layout();
	    }
	}
	
	module.exports = Grid;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	//生成数独游戏
	const Generator = __webpack_require__(4);
	
	module.exports = class SudoKu {
	    constructor() {
	        //生成数独解决方案
	        const generator = new Generator();
	        generator.generate();
	        this.solutionMatrix = generator.matrix;
	    }
	    //生成谜盘
	    make(level = 5) {
	        this.puzzleMatrix = this.solutionMatrix.map(row => row.map(cell => Math.random() * 9 < level ? 0 : cell));
	    }
	}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	//生成数独解决方法
	const ToolKit = __webpack_require__(1);
	
	module.exports = class Generator {
	    generate() {
	        while (!this.internalgenerator()) {
	
	        }
	    }
	
	    internalgenerator() {
	        this.matrix = ToolKit.matrix.MakeMatrax();
	        this.orders = ToolKit.matrix.MakeMatrax()
	            .map(row => row.map((v, index) => index))
	            .map(row => ToolKit.matrix.shuffle(row));
	        for (let n = 1; n <= 9; n++) {
	            if (!this.fillNumeber(n)) {
	                return false
	            }
	        }
	        return true
	    }
	    fillNumeber(n) {
	        return this.fillRow(n, 0);
	    }
	    fillRow(n, rowIndex) {
	        if (rowIndex > 8) {
	            return true;
	        }
	        const row = this.matrix[rowIndex];
	        const orders = this.orders[rowIndex];
	        for (let i = 0; i < 9; i++) {
	            const colIndex = orders[i];
	            //如果这个位置已经存在非0值
	            if (row[colIndex]) {
	                continue;
	            }
	            //检查这个位置是否可以填入n
	            if (!ToolKit.matrix.checkFillable(this.matrix, n, rowIndex, colIndex)) {
	                continue;
	            }
	            row[colIndex] = n;
	            //去下一行填写n,如果无法填入，继续寻找当前行的下一行
	            if (!this.fillRow(n, rowIndex + 1)) {
	                row[colIndex] = 0;
	                continue;
	            }
	            return true;
	        }
	        return false;
	    }
	
	}
	
	


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	//检查数独方案
	const ToolKit = __webpack_require__(1);
	//单个数组检查方法
	function checkArray(array) {
	    const length = array.length;
	    var marks = new Array(length);
	    marks.fill(true);
	    for (let i = 0; i < length; i++) {
	        if (!marks[i]) {
	            continue
	        }
	        const v = array[i];
	        if (!v) {
	            marks[i] = false;
	            continue;
	        };
	        for (let j = i + 1; j < length; j++) {
	            if (v === array[j]) {
	                marks[i] = marks[j] = false;
	            }
	        }
	    }
	    return marks;
	}
	
	module.exports = class Checker {
	    constructor(matrix) {
	        this._matrix = matrix;
	        this._matrixMarks = ToolKit.matrix.MakeMatrax(true);
	    }
	
	    get matrixMarks() {
	        return this._matrixMarks;
	    }
	
	    get isSuccess() {
	        return this._success;
	    }
	
	    check() {
	        this.checkRow();
	        this.checkCol();
	        this.checkBoxes();
	
	        this._success = this._matrixMarks.every(row => row.every(mark => mark));
	        return this._success;
	    }
	
	    checkRow() {
	        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
	            var row = this._matrix[rowIndex];
	            var markRow = checkArray(row);
	            for (let colIndex = 0; colIndex < 9; colIndex++) {
	                if (!markRow[colIndex]) {
	                    this._matrixMarks[rowIndex][colIndex] = false;
	                }
	            }
	        }
	    }
	
	    checkCol() {
	        for (let colIndex = 0; colIndex < 9; colIndex++) {
	            let cols = [];
	            for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
	                cols[rowIndex] = this._matrix[rowIndex][colIndex];
	            }
	            let colsMark = checkArray(cols);
	            for (let rowIndex = 0; rowIndex < cols.length; rowIndex++) {
	                if (!colsMark[rowIndex]) {
	                    this._matrixMarks[rowIndex][colIndex] = false
	                }
	            }
	        }
	    }
	
	    checkBoxes() {
	        for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
	            const boxes = ToolKit.box.getBoxCells(this._matrix, boxIndex);
	            const Marks = checkArray(boxes);
	            for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
	                if (!Marks[cellIndex]) {
	                    const { rowIndex, colIndex } = ToolKit.box.converFromBoxIndex(boxIndex, cellIndex)
	                    this._matrixMarks[rowIndex][colIndex] = false;
	                }
	            }
	        }
	    }
	}
	
	
	
	
	
	


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	//弹出操作面板
	module.exports = class PopuNumbers {
	    constructor($panel) {
	        this._$panel = $panel.hide().removeClass("hidden");
	        this._$panel.on("click", "span", e => {
	            const $cell = this._$targetCell;
	            const $span = $(e.target);
	            if ($span.hasClass("mark1")) {
	                if ($cell.hasClass("mark1")) {
	                    $cell.removeClass("mark1")
	                } else {
	                    $cell.removeClass("mark2").addClass("mark1");
	                }
	            } else if ($span.hasClass("mark2")) {
	                if ($cell.hasClass("mark2")) {
	                    $cell.removeClass("mark2")
	                } else {
	                    $cell.removeClass("mark1").addClass("mark2");
	                }              
	            } else if ($span.hasClass("empty")) {
	                $cell.text(0).addClass("empty");
	            }
	            else {
	                $cell.removeClass("empty").text($span.text());
	            }
	            this.hide();
	            return
	        })
	    }
	
	    popup($cell) {
	        this._$targetCell = $cell;
	        const { left, top } = $cell.position();
	        this._$panel.css({
	            "left": `${left}px`,
	            "top": `${top}px`
	        }).show();
	    }
	
	    hide() {
	        this._$panel.hide();
	    }
	}

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map