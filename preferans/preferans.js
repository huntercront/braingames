var game;

function Game()
{
  southTextBox = document.getElementById('southTextBox');
  this.southInitial = southTextBox.value.split(',');
  westTextBox = document.getElementById('westTextBox');
  this.westInitial = westTextBox.value.split(',');
  eastTextBox = document.getElementById('eastTextBox');
  this.eastInitial = eastTextBox.value.split(',');
  trumpSelect = document.getElementById('trumpSelect');
  this.trump = trumpSelect.options[trumpSelect.selectedIndex].id;
  firstMoveSelect = document.getElementById('firstMoveSelect');
  this.movePlayer = firstMoveSelect.options[firstMoveSelect.selectedIndex].id;
  this.moveInitial = [];

  this.suits = ['S', 'C', 'D', 'H'];
  this.ranks = ['7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  this.values = [7, 8, 9, 10, 11, 12, 13, 14];
  this.playerKinds = ['S', 'W', 'E'];

  this.spriteImage = document.getElementById('spriteImage');
  this.spriteImage.numberFramesHor = 8;
  this.spriteImage.numberFramesVer = 4;

  this.canvas = document.getElementById('preferansCanvas');    
  this.ctx = this.canvas.getContext('2d');    

  this.cardWidth = 66;
  this.cardHeight = 99; 

  this.players = [];
  this.players.push(new Player(this, 'S', this.southInitial));
  this.players.push(new Player(this, 'W', this.westInitial));
  this.players.push(new Player(this, 'E', this.eastInitial));
  this.move = []

  this.movingCard = null;
  this.deltaX = 0;
  this.deltaY = 0;
  this.initialPosX = 0;
  this.initialPosY = 0;

  this.dragok = false;

  if (isTouchDevice() == false)
  {
    this.canvas.onmousedown = this.mouseDown.bind(this);
    this.canvas.onmouseup = this.mouseUp.bind(this); 
    this.canvas.onmouseout = this.mouseUp.bind(this);
  }
  else
  {
    this.canvas.addEventListener("touchstart", this.mouseDown.bind(this), false); 
    this.canvas.addEventListener("touchend", this.mouseUp.bind(this), false);
    this.canvas.addEventListener("touchcancel", this.mouseUp.bind(this), false);
  }

  this.getAvailableMoves();
  this.history = [];
  this.drawCards();
}

Game.prototype.drawCards = function()
{
  this.ctx.fillStyle = 'rgb(0, 64, 0)';
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  this.ctx.font = '50px sans-serif';
  if ((this.trump == 'S') || (this.trump == 'C'))
  {
    this.ctx.fillStyle = 'white';
  }
  else
  {
    this.ctx.fillStyle = 'white';
  }
  this.ctx.fillText(uniFromSuit(this.trump), 850, 45);  

  this.ctx.font = '30px sans-serif';
  if (this.movePlayer == 'S')
  {
    this.ctx.fillStyle = 'red';
  }
  else
  {
    this.ctx.fillStyle = 'white';
  }
  this.ctx.fillText('Юг' + ' ' + this.players[0].score, 425, 565);
 
  this.players[0].render();

  this.ctx.font = '30px sans-serif';
  if (this.movePlayer == 'W')
  {
    this.ctx.fillStyle = 'red';
  }
  else
  {
    this.ctx.fillStyle = 'white';
  }
  this.ctx.fillText('Запад' + ' ' + this.players[1].score, 200, 35);

  this.players[1].render();

  this.ctx.font = '30px sans-serif';
  if (this.movePlayer == 'E')
  {
    this.ctx.fillStyle = 'red'
  }
  else
  {
    this.ctx.fillStyle = 'white';
  }
  this.ctx.fillText('Восток' + ' ' + this.players[2].score, 650, 35);

  this.players[2].render();

  this.ctx.strokeRect(this.players[0].movePosX, this.players[0].movePosY, this.cardWidth, this.cardHeight);
  this.ctx.strokeRect(this.players[1].movePosX, this.players[1].movePosY, this.cardWidth, this.cardHeight);
  this.ctx.strokeRect(this.players[2].movePosX, this.players[2].movePosY, this.cardWidth, this.cardHeight);

  for (i = 0; i < this.move.length; i++)
  {
    this.move[i].render(this.ctx);
  }
} 

Game.prototype.mouseMove = function(e)
{
  //console.log('mouseMoveStart');

  e.preventDefault();
  if (this.dragok == true)
  {
    if (isTouchDevice() == true)
    {
      x = e.touches[0].pageX;
      y = e.touches[0].pageY;
    }
    else
    {
      x = e.pageX;
      y = e.pageY;
    }

    this.movingCard.posX = x - this.canvas.offsetLeft - this.deltaX;
    this.movingCard.posY = y - this.canvas.offsetTop - this.deltaY;
    this.drawCards();
  }

  //console.log('mouseMoveEnd');
}

Game.prototype.mouseDown = function(e)
{
  //console.log('mouseDownStart');

  e.preventDefault();

  // Блокировка повторного срабатывания, если перенос ещё не закончен.
  if (this.dragok == true)
  {
    return;
  }

  if (isTouchDevice() == true)
  {
    x = e.touches[0].pageX;
    y = e.touches[0].pageY;
  }
  else
  {
    x = e.pageX;
    y = e.pageY;
  }
   
  this.movingCard = this.findCard(x - this.canvas.offsetLeft, y - this.canvas.offsetTop);
  plAvail = this.playerKinds.indexOf(this.movePlayer);
  if (this.movingCard != null)
  {
    indexAvail = this.players[plAvail].availableMoves.indexOf(this.movingCard.name);
  }

  if ((this.movingCard != null) && (this.movingCard.player == this.movePlayer) && (indexAvail != -1))
  {
    this.initialPosX = this.movingCard.posX;
    this.initialPosY = this.movingCard.posY;

    this.deltaX = x - this.canvas.offsetLeft - this.movingCard.posX
    this.deltaY = y - this.canvas.offsetTop - this.movingCard.posY;
 
    this.movingCard.posX = x - this.canvas.offsetLeft - this.deltaX;
    this.movingCard.posY = y - this.canvas.offsetTop - this.deltaY;
    this.dragok = true;
    if (isTouchDevice() == false)
    {
      this.canvas.onmousemove = this.mouseMove.bind(this);
    }
    else
    {
      this.canvas.addEventListener("touchmove", this.mouseMove.bind(this), false);
    }
  }
  //console.log('mouseDownEnd');
}

Game.prototype.mouseUp = function(e)
{
  //console.log('mouseUpStart');

  e.preventDefault();
  this.applyMoveChanges();
  // После mouseUp не должно оставаться ситуации перетаскивания. 
  this.dragok = false; 

  //console.log('mouseUpEnd');
}

Game.prototype.applyMoveChanges = function()
{
  if (this.dragok == true)
  {
    if (isTouchDevice() == false)
    {
      this.canvas.onmousemove = null;
    }
    else
    {
      this.canvas.removeEventListener("touchmove", this.mouseMove, false);
    }
    
    if (this.checkShift(this.movingCard.posX, this.movingCard.posY, this.movingCard.player))
    {
      plAvail = this.playerKinds.indexOf(this.movePlayer);
      var player = this.players[plAvail];
      this.movingCard.posX = player.movePosX;
      this.movingCard.posY = player.movePosY;
      player.cards[this.movingCard.indexInHandI].splice(this.movingCard.indexInHandJ, 1);

      this.movingCard.player = '';
      this.move.push(this.movingCard);
      player.setPositions();
      this.nextPlayer();
    }
    else
    {
      this.movingCard.posX = this.initialPosX;
      this.movingCard.posY = this.initialPosY;
    }
    this.drawCards();
  }
}

Game.prototype.getAvailableMoves = function()
{
  for (i = 0; i < this.players.length; i++)
  {
    this.players[i].getAvailableMoves();
  }
}

Game.prototype.cmpCards = function(x, y)
{
  if (x.suit != y.suit)
  {
    if (y.suit == this.trump)
    {
      return -1;
    }
    else
    {
      return 1;
    }
  }
  else
  {
    if (x.value > y.value)
    {
      return 1;
    }
    else
    {
      return -1;
    }
  }
}

Game.prototype.cmpCardsDesc = function(x, y)
{
  return -this.cmpCards(x, y);
}


Game.prototype.nextPlayer = function()
{
  var plIndex = this.playerKinds.indexOf(this.movePlayer);
  plIndex = (plIndex + 1) % 3;
  this.movePlayer = this.playerKinds[plIndex]; 

  if (this.move.length == 3)
  {
    this.nextMove();
  }
  this.getAvailableMoves();
}

Game.prototype.nextMove = function()
{
  var plIndex = this.playerKinds.indexOf(this.movePlayer);
  var winner = '';
  // 1 = больше; -1 = меньше.
  if (this.cmpCards(this.move[0], this.move[1]) == 1)
  {
    if (this.cmpCards(this.move[0], this.move[2]) == 1)
    {
      winner = this.players[plIndex];
    }
    else
    {
      winner = this.players[(plIndex + 2) % 3];
    }
  }
  else
  {
    if (this.cmpCards(this.move[1], this.move[2]) == 1)
    {
      winner = this.players[(plIndex + 1) % 3];
    }
    else
    {
      winner = this.players[(plIndex + 2) % 3];
    }
  }
  
  winner.score += 1;
  this.movePlayer = winner.plType;

  this.history.push(this.players[plIndex].plType + ': ' + this.move[0].toHistory() + ', ' + this.move[1].toHistory() + ', ' + this.move[2].toHistory() + ' - ' + winner.plType);
  this.move = [];
}

Game.prototype.findCard = function(x, y)
{
  for (i = 0; i < this.players.length; i++)  
  {
    // Более поздние карты лежат на более ранних, их надо найти раньше.
    for (j = this.players[i].cards.length - 1; j > -1 ; j--)
    {
      for (k = this.players[i].cards[j].length - 1; k > -1 ; k--)
      {
        if ((x > this.players[i].cards[j][k].posX - 5) && (x < this.players[i].cards[j][k].posX + this.players[i].cards[j][k].gameWidth + 5) &&
          (y > this.players[i].cards[j][k].posY - 5) && (y < this.players[i].cards[j][k].posY + this.players[i].cards[j][k].gameHeight + 5))
        {
          return this.players[i].cards[j][k];
        }
      }
    }
  }
}

Game.prototype.checkShift = function(posX, posY, player)
{
  var res = false;
  var i = this.playerKinds.indexOf(player);

  if (intersect(posX, posY, this.cardWidth, this.cardHeight, this.players[i].movePosX, this.players[i].movePosY, this.cardWidth, this.cardHeight))
  {
    res = true;
  }

  return res; 
}

function Player(plGame, plType, initPosition)
{
  this.game = plGame;
  this.plType = plType; 
  if (plType == 'S')
  {
    this.movePosX = 425;
    this.movePosY = 325;

    this.startX = 50;
    this.startY = 435;
    this.betweenCards = this.game.cardWidth / 2;
    this.betweenSuitsHor = this.game.cardWidth + 25;
  } 
  else if (plType == 'W')
  {
    this.movePosX = 350;
    this.movePosY = 275;

    this.startX = 25;
    this.startY = 50;
    this.betweenCards = this.game.cardWidth / 2;
    this.betweenSuitsVer = this.game.cardHeight / 3;
  }
  else if (plType == 'E')
  {
    this.movePosX = 500;
    this.movePosY = 275;

    this.startX = 475;
    this.startY = 50;
    this.betweenCards = this.game.cardWidth / 2;
    this.betweenSuitsVer = this.game.cardHeight / 3;
  }
  
  this.score = 0;
  this.cards = [[], [], [], []];
  this.createCards(initPosition);
  this.setPositions();

  this.availableMoves = [];
}

Player.prototype.createCards = function(initPosition)
{
  for (i = 0; i < initPosition.length; i++)
  {
    var s = this.game.suits.indexOf(initPosition[i].charAt(0));
    var r = this.game.ranks.indexOf(initPosition[i].charAt(1));
    var card = new Card(this.game, s, r);
    card.player = this.plType;
    this.cards[s].push(card);
  }
  for (i = 0; i < this.game.suits.length; i++)
  {
    this.cards[i].sort(this.game.cmpCardsDesc.bind(this.game));
  }
}

Player.prototype.setPositions = function()
{
  var x = this.startX;
  var y = this.startY;

  for (i = 0; i < this.cards.length; i++)
  {
    for (j = 0; j < this.cards[i].length; j++)
    {
      this.cards[i][j].indexInHandI = i;
      this.cards[i][j].indexInHandJ = j;

      this.cards[i][j].shift(this.game.ctx, x, y);
      x = x + this.betweenCards;
    }
    
    if (this.cards[i].length != 0)
    {
      if (this.plType == 'S')
      {
        x = x + this.betweenSuitsHor;
      }
      else
      {
        x = this.startX;
        y = y + this.betweenSuitsVer;
      }
    }    
  }
}

Player.prototype.getAvailableMoves = function()
{
  if (this.game.movePlayer != this.plType)
  {
    this.availableMoves = [];
    return;
  } 

  var firstMove = this.game.move[0];

  if (firstMove != undefined) 
  {
    var i = this.game.suits.indexOf(firstMove.suit);
    if (this.cards[i].length != 0)
    {
      for (j = 0; j < this.cards[i].length; j++)
      {
        this.availableMoves.push(this.cards[i][j].name);
      }
      return;
    }    
  }

  if (firstMove != undefined) 
  {
    var i = this.game.suits.indexOf(this.game.trump);

    if ((i != -1) && (this.cards[i].length != 0))
    {
      for (j = 0; j < this.cards[i].length; j++)
      {
        this.availableMoves.push(this.cards[i][j].name);
      }
      return;
    }
  }

  for (i = 0; i < this.cards.length; i++)
  {
    for (j = 0; j < this.cards[i].length; j++)
    {
      this.availableMoves.push(this.cards[i][j].name);
    }
  }
}

Player.prototype.render = function()
{
  for (i = 0; i < this.cards.length; i++)
  {
    for (j = 0; j < this.cards[i].length; j++)
    {
      this.cards[i][j].render(this.game.ctx);
    }
  } 
}


function Card(cardGame, s, r) 
{
  // Clubs = Трефы, Крести; Spades = Пики, Винни; Hearts = Черви; Diamongs = Бубны, бубни.
  this.suit = cardGame.suits[s]; 
  this.suitNumber = s;
  this.rank = cardGame.ranks[r]; 
  this.rankNumber = r;
  this.value = cardGame.values[r]; // очки
         
  this.image = cardGame.spriteImage;
  this.spriteWidth = this.image.width / this.image.numberFramesHor;
  this.spriteHeight = this.image.height / this.image.numberFramesVer;
  this.gameWidth = cardGame.cardWidth;
  this.gameHeight = cardGame.cardHeight;

  this.name = this.toString();
  this.image.alt = this.name;
  this.image.className = 'Card';
}

Card.prototype.toString = function()
{
  return this.suit + this.rank;
}

Card.prototype.toHistory = function()
{
  return this.rank + uniFromSuit(this.suit);
}

Card.prototype.shift = function(context, posX, posY)
{
  this.context = context;
  this.posX = posX;
  this.posY = posY;
}

Card.prototype.render = function(context) 
{
  context.clearRect(this.posX, this.posY, this.gameWidth, this.gameHeight);      
       
  // img Исходное изображение.
  // sx	Абсцисса левого верхнего угла отрезаемого фрагмента изображения.
  // sy	Ордината верхнего левого угла отрезаемого фрагмента изображения.
  // sw	Ширина фрагмента изображения.
  // sh	Высота фрагмента изображения.
  // dx	Абсцисса точки вывода.
  // dy	Ордината точки вывода.
  // dw	Масштабируемая ширина.
  // dh	Масштабируемая высота.
  context.drawImage(
    this.image,
    this.rankNumber * this.spriteWidth,
    this.suitNumber * this.spriteHeight,
    this.spriteWidth,
    this.spriteHeight,
    this.posX,
    this.posY,
    this.gameWidth,
    this.gameHeight);
  context.strokeRect(this.posX, this.posY, this.gameWidth, this.gameHeight);
}


function intersect(x1, y1, w1, h1, x2, y2, w2, h2)
{
  return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
}


function uniFromSuit(suit)
{
  if (suit == 'S') {return '♠'};
  if (suit == 'C') {return '♣'}; 
  if (suit == 'D') {return '♦'};
  if (suit == 'H') {return '♥'}; 
  if (suit == '') {return '-'}; 
}

function isTouchDevice()
{
  if ('ontouchstart' in window)
  {
    return true;
  }
  else
  {
    return false;
  }
}

function loadImage()
{
  var paramsStr = window.location.search.substr(1);
  var params = paramsStr.split("&");
  var OK = true;
  for (i = 0; i < params.length; i++)
  {
    var values = params[i].split("=");
    if (values.length != 2)
    {
      OK = false;
      //alert("Неверная строка параметров"); 
    } 
    else
    {
      if (values[0] == 'south')
      {
        southTextBox = document.getElementById("southTextBox");
        southTextBox.value = values[1];
      }
      if (values[0] == 'west')
      {
        westTextBox = document.getElementById("westTextBox");
        westTextBox.value = values[1];
      }
      if (values[0] == 'east')
      {
        eastTextBox = document.getElementById("eastTextBox");
        eastTextBox.value = values[1];
      }
      if (values[0] == 'trump')
      {
        trumpSelect = document.getElementById("trumpSelect");
        if (values[1] == 'S') 
        {
          trumpSelect.value = 'Пики';
        }
        if (values[1] == 'C') 
        {
          trumpSelect.value = 'Трефы';
        }
        if (values[1] == 'D') 
        {
          trumpSelect.value = 'Бубны';
        }
        if (values[1] == 'H') 
        {
          trumpSelect.value = 'Черви';
        }
        if (values[1] == '') 
        {
          trumpSelect.value = 'Без козырей';
        }
      }
      if (values[0] == 'firstMove')
      {
        firstMoveSelect = document.getElementById("firstMoveSelect");
        if (values[1] == 'S') 
        {
          firstMoveSelect.value = 'Юг';
        }
        if (values[1] == 'W') 
        {
          firstMoveSelect.value = 'Запад';
        }
        if (values[1] == 'E') 
        {
          firstMoveSelect.value = 'Восток';
        }
      }
    }
  }
  if (OK == true)
  {
    game = new Game();
  }
  else
  {
    southTextBox = document.getElementById("southTextBox");
    southTextBox.value = 'SK,SQ,SJ,ST,S9,S8,S7,C9,C8,C7';
    westTextBox = document.getElementById("westTextBox");
    westTextBox.value = 'SA,CQ,CJ,DA,D9,D7,HA,HQ,H9,H7';
    eastTextBox = document.getElementById("eastTextBox");
    eastTextBox.value = 'CA,CK,CT,DK,DT,D8,HK,HJ,HT,H8';
    trumpSelect = document.getElementById("trumpSelect");
    trumpSelect.value = 'Пики';
    firstMoveSelect = document.getElementById("firstMoveSelect");
    firstMoveSelect.value = 'Юг';
    game = new Game();
  }
}
