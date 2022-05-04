var trex, trexCorrendo, trexMorreu;
var edges;
var chao, chaoIMG, chaoInvisivel;
var nuvemimagem, nuvem;
var obstaculo;
var obstaculoImg1, obstaculoImg2, obstaculoImg3,
    obstaculoImg4, obstaculoImg5, obstaculoImg6; 

var gameOver, restart;
var gameOverImg, restartImg;

var somPulo, somMorte, somCheckPoint;

var pontos = 0;   



var grupoObstaculos, grupoNuvens;
var JOGAR = 1;
var ENCERRAR = 0;
var gameState = JOGAR;

//função serva para pré carregar as imagens do jogo em variaveis
function preload(){
  trexCorrendo = loadAnimation("img/trex1.png", "img/trex2.png", "img/trex3.png" );
  trexMorreu = loadAnimation("img/trex_collided.png");
  
  chaoIMG = loadImage("img/ground2.png");
  nuvemimagem = loadImage("img/cloud.png");
  obstaculoImg1 = loadImage("img/obstacle1.png");
  obstaculoImg2 = loadImage("img/obstacle2.png");
  obstaculoImg3 = loadImage("img/obstacle3.png");
  obstaculoImg4 = loadImage("img/obstacle4.png");
  obstaculoImg5 = loadImage("img/obstacle5.png");
  obstaculoImg6 = loadImage("img/obstacle6.png");

  gameOverImg = loadImage("img/gameOver.png");
  restartImg = loadImage("img/restart.png");

  somCheckPoint = loadSound("som/checkPoint.mp3");
  somMorte = loadSound("som/die.mp3");
  somPulo = loadSound("som/jump.mp3");
}


function setup(){
  createCanvas(windowWidth, windowHeight,200);

  //referentes a sprite trex
  trex = createSprite(50,height-25,40,80);
  trex.addAnimation("correndo", trexCorrendo);
  trex.addAnimation("morrendo", trexMorreu);
  trex.scale = 0.5;
  
  //referente a sprite chão 
  chao = createSprite(300,height-15,600,10);
  chao.addImage(chaoIMG);
  chaoInvisivel = createSprite(300,height-5,600,10);
  chaoInvisivel.visible = false;

  gameOver = createSprite(width/2,50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(width/2,100);
  restart.addImage(restartImg);
  restart.scale = 0.5; 
  restart.visible = false;


  grupoObstaculos = new Group();
  grupoNuvens = new Group();

  //trex.debug = true;
  trex.setCollider("circle",0,0,30);

  
  
}


function draw(){
  background("white");

  text("Pontuação: " + pontos, width-100, 50 );
  

  if (gameState === JOGAR) {

    pontos = pontos + Math.round(frameRate()/60);

    //faz o trex pular
    if(touches.length>0 && trex.y>height-50){
      trex.velocityY = -10;
      somPulo.play();
      touches = [];
    }

    if(pontos%100===0 && pontos>0){
      somCheckPoint.play();
    }

    //resta posição do chão
    if(chao.x <0) { 
      chao.x = chao.width/2;
    }

    //faz o chão andar pra trás
    chao.velocityX = -(5 + 3* pontos/100);
    grupoObstaculos.setVelocityXEach(-(5 + 3* pontos/100));

    gerarObstaculos();
    gerarNuvens();

    if (trex.isTouching(grupoObstaculos)) {
      gameState = ENCERRAR;
      somMorte.play();
    }

  } else if(gameState === ENCERRAR){
    //faz o chao parar quando o jogo termina
    chao.velocityX = 0;
    grupoObstaculos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);
    grupoObstaculos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);
    trex.changeAnimation("morrendo", trexMorreu);

    gameOver.visible = true;
    restart.visible = true;

    if(touches.length>0){
      reset();
      touches = [];
    }
  }


  //aplica o conceito da gravidade ao trex
  trex.velocityY += 0.5;

  //trex colide com o chão
  trex.collide(chaoInvisivel);

  drawSprites();
}

function gerarNuvens() {
  if (frameCount % 60 ===0) {
    nuvem = createSprite(width,100,40,10);
    nuvem.velocityX = -5;
    nuvem.addImage(nuvemimagem);
    nuvem.scale = 0.8;
    nuvem.y = Math.round(random(height-150,height-100));

    trex.depth = nuvem.depth;
    trex.depth +=1;

    restart.depth = nuvem.depth;
    restart.depth +=1;
    
    gameOver.depth = nuvem.depth;
    gameOver.depth +=1;

    nuvem.lifetime = width/5;
  
    grupoNuvens.add(nuvem);
  }
  
}

function gerarObstaculos() {
  if (frameCount % 60 ===0) {
    obstaculo = createSprite(width,height-30,40,60);
    obstaculo.velocityX = -5;

    var aleatorio = Math.round(random(1,6));

    switch (aleatorio) {
      case 1: obstaculo.addImage(obstaculoImg1);
        break;
      case 2: obstaculo.addImage(obstaculoImg2);
        break;
      case 3: obstaculo.addImage(obstaculoImg3);
        break; 
      case 4: obstaculo.addImage(obstaculoImg4);
        break;
      case 5: obstaculo.addImage(obstaculoImg5);
        break;
      case 6: obstaculo.addImage(obstaculoImg6);
        break;  
        
      default: break;
    }

    
    obstaculo.scale = 0.5;
    obstaculo.lifetime = width/5;
    
  }
}

function reset() {
  gameState = JOGAR;
  
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("correndo")

  grupoObstaculos.destroyEach();
  grupoNuvens.destroyEach();
 
  pontos = 0;

}
