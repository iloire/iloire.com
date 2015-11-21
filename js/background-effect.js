define('background-effect', function(){

  var SWARM_COLORS = ['#fff9e6','#FBFBFB', '#FFFFFF', '#FAFAFA', '#F7F7F7', "F8F8F8", "#f5f5f5", "F9F9F9"];
  var BG_COLORS = SWARM_COLORS;
  var IMG_BG_COLORS = BG_COLORS.concat(['#f5f5f5', '#f5f5f5']);

  var SEPARATOR_SIZE = 1;
  var SQUARE_SIZE = 7;
  var SWARM_PADDING = 300;
  var ITERATIONS_PER_TICK = 50;
  var INTERVAL = 100;

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

  function paintSquareInCoordinates(x, y, colors) {
    var colX = parseInt(x / (SQUARE_SIZE + SEPARATOR_SIZE));
    var colY = parseInt(y / (SQUARE_SIZE + SEPARATOR_SIZE));

    paintSquareInRowColumn(colX, colY, colors);
    return {colX: colX, colY: colY};
  }

  function tick(){
    for (var i = 0; i < ITERATIONS_PER_TICK; i++) {
      paintRandomPointAround(cursorX, cursorY, SWARM_PADDING, SWARM_COLORS);
    }

    var $img = $('#extrainfo img');
    if ($img.length) {
      var position = $img.offset();
      var width = $img.width();
      var height = $img.height();
      var margin = 40;

      for (var i = 0; i < ITERATIONS_PER_TICK; i++) {

        // left
        paintRandomPointBetween(position.left - margin, position.left, position.top + height + margin, position.top - margin, IMG_BG_COLORS);

        // right
        paintRandomPointBetween(position.left + width, position.left + width + margin, position.top + height + margin, position.top - margin, IMG_BG_COLORS);

        // top
        paintRandomPointBetween(position.left - margin, position.left + width + margin, position.top, position.top - margin, IMG_BG_COLORS);

        // bottom
        paintRandomPointBetween(position.left - margin, position.left + width + margin, position.top + height + margin, position.top + height, IMG_BG_COLORS);

      }
    }
  }

  function paintRandomPointBetween(minX, maxX, minY, maxY, colors){
    var x = getRandomInt(minX, maxX);
    var y = getRandomInt(minY, maxY);
    paintSquareInCoordinates(x, y, colors); //
  }

  function paintRandomPointAround(x, y, padding, colors){
    var angle = Math.random() * Math.PI * 2;
    var radius = getRandomInt(0, padding);
    var targetX = x + Math.cos(angle) * radius;
    var targetY = y - window.pageYOffset + Math.sin(angle) * radius;
    paintSquareInCoordinates(targetX, targetY, colors); //
  }

  function paintSquareInRowColumn(colX, colY, colors) {
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

      if (!this.canvasSupported()) {
        console.log('canvas not supported');
        return;
      }

      document.addEventListener('mousemove', function(e){
        cursorX = e.pageX;
        cursorY = e.pageY;
      });

      window.addEventListener("resize", function(e){
        resizeCanvas(canvas);
        paintBg(canvas.width, canvas.height);
      });

      resizeCanvas(canvas);

      paintBg(canvas.width, canvas.height);

      setInterval(tick, INTERVAL);
    }
  };

});