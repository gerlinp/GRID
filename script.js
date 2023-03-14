//  Game Board
const FPS = 30 // frames per second
const grid = 5 // number of rows & columns
const height = 550 // pixels
const width = height * 0.9
const cell = width / (grid + 2) // size of cells
const stroke = cell / 12 // stroke width
const dot = stroke // dot radius
const margin = height - (grid + 1) * cell //margin for score and names

// colors
const BOARD_COLOR = 'black'
const BORDER_COLOR = 'grey'
const COMP_COLOR = 'crimson'
const COMP_COLOR_LIT = 'lightpink'
const PLAYER_ONE_COLOR = 'royalblue'
const PLAYER_ONE_LIGHT = 'lightblue'
const DOT_COLOR = 'white'

//definitions
const Side = {
  bot: 0,
  left: 1,
  right: 2,
  top: 3,
}

// game canvas
let canv = document.createElement('canvas')

// add classes for CSS
canv.classList.add('game-board')
canv.classList.add('game-border')

canv.height = height
canv.width = width
document.body.appendChild(canv)
var canvRect = canv.getBoundingClientRect()

document.body.appendChild(canv)
var canvRect = canv.getBoundingClientRect()

// context
var ctx = canv.getContext('2d')
ctx.lineWidth = stroke

// game variables;
let playersTurn, squares

// start a new game
newGame()

// event handlers
canv, addEventListener('mousemove', highlightGrid)

// game loop
setInterval(loop, 1000 / FPS)

function loop() {
  drawBoard()
  drawSquares()
  drawGrid()
}

function drawBoard() {
  ctx.fillStyle = BOARD_COLOR
  ctx.strokeStyle = BORDER_COLOR
  ctx.fillRect(0, 0, width, height)
  ctx.strokeRect(stroke / 2, stroke / 2, width - stroke, height - stroke)
}

function drawDot(x, y) {
  ctx.fillStyle = DOT_COLOR
  ctx.beginPath()
  ctx.arc(x, y, dot, 0, Math.PI * 2)
  ctx.fill()
}

function drawGrid() {
  for (let i = 0; i < grid + 1; i++) {
    for (let j = 0; j < grid + 1; j++) {
      drawDot(getGridX(j), getGridY(i))
    }
  }
}

function drawLine(x0, y0, x1, y1, color) {
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
}

function drawSquares() {
  for (let row of squares) {
    for (let square of row) {
      square.drawSides()
      square.drawFill()
    }
  }
}

function getColor(player, light) {
  if (player) {
    return light ? PLAYER_ONE_LIGHT : PLAYER_ONE_COLOR
  } else {
    return light ? COMP_COLOR_LIT : COMP_COLOR
  }
}

function getGridX(col) {
  return cell * (col + 1)
}

function getGridY(row) {
  return margin + cell * row
}

function highlightGrid(/** @type {MouseEvent} */ ev) {
  if (!playersTurn) {
    return
  }

  // get mouse position relative the canvas
  let x = ev.clientX - canvRect.left
  let y = ev.clientY - canvRect.top
  // highlight the square's side
  highlightSide(x, y)
}
function highlightSide(x, y) {
  // clear previous highlighting
  for (let row of squares) {
    for (let square of row) {
      square.highlight = null
    }
  }

  let rows = squares.length
  let cols = squares[0].length
  OUTER: for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (squares[i][j].contains(x, y)) {
        let side = squares[i][j].highlightSide(x, y)
        break OUTER
      }
    }
  }
}

function newGame() {
  playersTurn = Math.random() >= 0.5

  // set up the squares
  squares = []
  for (let i = 0; i < grid; i++) {
    squares[i] = []
    for (let j = 0; j < grid; j++) {
      squares[i][j] = new Square(getGridX(j), getGridY(i), cell, cell)
    }
  }
}

function Square(x, y, w, h) {
  this.w = w
  this.h = h
  this.top = y
  this.left = x
  this.right = x + w
  this.bottom = y + h
  this.highlight = null
  this.sideTop = { owner: null, selected: false }
  this.sideLeft = { owner: null, selected: false }
  this.sideRight = { owner: null, selected: false }
  this.sideBot = { owner: null, selected: false }

  this.contains = function (x, y) {
    return x >= this.left && x < this.right >= this.top && y < this.bottom
  }

  this.drawFill = function () {
    // TODO fill
  }

  this.drawSide = function (side, color) {
    switch (side) {
      case Side.bot:
        drawLine(this.left, this.bot, this.right, this.bot, color)
        break
      case Side.left:
        drawLine(this.left, this.top, this.left, this.bot, color)
        break
      case Side.right:
        drawLine(this.right, this.top, this.right, this.bot, color)
        break
      case Side.top:
        drawLine(this.left, this.top, this.right, this.top, color)
        break
    }
  }

  this.drawSides = function () {
    // highlighting
    if (this.highlight != null) {
      this.drawSide(this.highlight, getColor(playersTurn, true))
    }
  }

  this.highlightSide = function () {
    // calculate this distances to each side
    let dBot = this.bot - y
    let dLeft = x - this.left
    let dRight = this.right - x
    let dTop = y - this.top

    // determine closest value
    let dClosest = Math.min(dBot, dLeft, dRight, dTop)

    // highlight the closest if not already selected
    if (dClosest == dBot && this.sideBot.selected) {
      this.highlight = Side.bot
    } else if (dClosest == dLeft && this.sideLeft.selected) {
      this.highlight = Side.left
    } else if (dClosest == dRight && this.sideRight.selected) {
      this.highlight = Side.right
    } else {
      this.highlight = Side.top
    }

    // return the highlighted area
    return this.highlight
  }
}
