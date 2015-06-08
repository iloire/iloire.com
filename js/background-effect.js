define('background-effect', function(){

  var SWARM_COLORS = ['#fff9e6','#FBFBFB', '#FAFAFA', '#F7F7F7', "F8F8F8", "#f5f5f5", "F9F9F9"];
  var BG_COLORS = SWARM_COLORS;

  var SEPARATOR_SIZE = 1;
  var SQUARE_SIZE = 6;
  var SWARM_PADDING = 200;
  var ITERATIONS_PER_TICK = 50;

  var cursorX = 0;
  var cursorY = 0;

  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getRandomColor(colors) {
    return colors[getRandomInt(0, colors.length)];
  }

  function createSquare(x, y, w, h, c){
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  }

  function writeRow(y, rowWidth, w, h, color) {
    var x = 0;
    while (x < rowWidth) {
      createSquare(x, y, w, h, color || getRandomColor(BG_COLORS));
      x+=w;
      // write a separator square into the right
      createSquare(x, y, SEPARATOR_SIZE, h, '#fff');
      x+=SEPARATOR_SIZE;
    }
  }

  function tick(){
    for (var i = 0; i < ITERATIONS_PER_TICK; i++) {
      var angle = Math.random()*Math.PI*2;
      var radius = getRandomInt(0, SWARM_PADDING);
      var x = cursorX + Math.cos(angle)*radius;
      var y = cursorY + Math.sin(angle)*radius;

      // from pixels back to columns and rows
      var colX = parseInt(x / (SQUARE_SIZE + SEPARATOR_SIZE));
      var colY = parseInt(y / (SQUARE_SIZE + SEPARATOR_SIZE));

      paintSquareIn(colX, colY, SWARM_COLORS);
    }
  }

  function paintSquareIn(colX, colY, colors) {
    var x = colX * (SQUARE_SIZE + SEPARATOR_SIZE);
    var y = colY * (SQUARE_SIZE + SEPARATOR_SIZE);
    createSquare(x, y, SQUARE_SIZE, SQUARE_SIZE, getRandomColor(colors || BG_COLORS));
  }

  function paintBg(width, height) {
    var y = 0;
    while (y < height) {
      writeRow (y, width, SQUARE_SIZE, SQUARE_SIZE);
      y+=SQUARE_SIZE;
      writeRow (y, width, SQUARE_SIZE, SEPARATOR_SIZE, '#fff');
      y+=SEPARATOR_SIZE;
    }
  }

  function resizeCanvas(canvas){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  return {

    canvasSupported: function(){
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    },

    init: function(){

      document.addEventListener('mousemove', function(e){
        cursorX = e.pageX;
        cursorY = e.pageY;
      });

      window.addEventListener("resize", function(e){
        resizeCanvas(canvas);
      });

      resizeCanvas(canvas);

      paintBg(canvas.width, canvas.height);

      setInterval(tick, 20);
    }
  };

});