//  Game Board
const FPS = 30 // frames per second
const grid = 3 // number of rows & columns
const height = 550 // pixels
const width = height * 0.9
const cell = width / (grid + 2) // size of cells
const stroke = cell / 12 // stroke width
const dot = stroke // dot radius
const margin = height - (grid + 1) * cell //margin for score and names

// colors
const boardColor = 'black'
const borderColor = 'grey'
const dotColor = 'white'

// game canvas
let canv = document.createElement('canvas')
canv.height = height
canv.width = width
canv.classList.add('game-board')
canv.classList.add('game-border')

// render to site
document.body.appendChild(canv)

// context
var ctx = canv.getContext('2d')
ctx.lineWidth = stroke

// game variables;
let squares

// start a new game

// game loop
setInterval(loop, 1000 / FPS)

function loop() {
  drawBoard()
  drawGrid()
}

function drawBoard() {
  ctx.fillStyle = boardColor
  ctx.strokeStyle = borderColor
  ctx.fillRect(0, 0, width, height)
  ctx.strokeRect(stroke / 2, stroke / 2, width - stroke, height - stroke)
}

function drawDot(x, y) {
  ctx.fillStyle = dotColor
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

function drawSquares() {
  for (let row of squares) {
    for (let square of row) {
      square.drawSides()
      square.drawFill()
    }
  }
}

function getGridX(col) {
  return cell * (col + 1)
}

function getGridY(row) {
  return margin + cell * row
}

function square(x, y, w, h) {
  this.w = w
  this.h = h
  this.top = y
  this.left = x
  this.right = x + w
  this.bottom = y + h

  this.contains = function (x, y) {
    return x >= this.left && x < this.right >= this.top && y < this.bottom
  }

  this.drawFill = function () {
    // TODO fill
  }

  this.drawSide = function () {
    // highlighting
  }
}
