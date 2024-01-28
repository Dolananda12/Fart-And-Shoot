const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 700;
let number_of_enemies_passed=0
let gameOver=false;
let index=[];
const GRAVITY = 0.5;
let score=document.getElementById("score");
let gameSpeed=1;
let board=document.getElementById('canvas1');
let ctx=board.getContext("2d");
board.width=CANVAS_WIDTH;
board.height=CANVAS_HEIGHT;
let lastTime=0;
let collisionCanvas = document.getElementById("collision_canvas");
const collision_ctx=collisionCanvas.getContext('2d');
collision_ctx.canvas.willReadFrequently = true;
collisionCanvas.width=CANVAS_WIDTH;
collisionCanvas.height=CANVAS_HEIGHT;
let background4 = new Image();
background4.src = "./Springfield_Town_Square.png";
let background3 = new Image();
background3.src = "./Springfield_Mall.webp";
let background2 = new Image();
background2.src = "./Springfield_Elementary_School.PNG.webp";
let background1 = new Image();
background1.src = "./startingimage1.webp";
let count=0;
let displayed=0;
let points=0;
class layer{
    constructor(speedmodifier,widthof_image,heighof_image){
        this.x=0;
        this.y=0;
        this.width=widthof_image;
        this.height=heighof_image;
        this.speedmodifier=speedmodifier;
        this.speed=gameSpeed*this.speedmodifier;
    }
    update(){
        this.speed=gameSpeed*this.speedmodifier;
        if(this.x<=-this.width){
            this.x=0;
            count++;
        }    
        this.x=Math.floor(this.x-this.speed);
    }
    draw(){
        if(count==0){
        ctx.drawImage(background1,this.x,this.y,this.width,this.height);
        ctx.drawImage(background1,this.x+CANVAS_WIDTH,this.y,this.width,this.height); 
        }if(count==1){
        ctx.drawImage(background2,this.x,this.y,this.width,this.height);
        ctx.drawImage(background2,this.x+CANVAS_WIDTH,this.y,this.width,this.height); 
        }if(count==2){
        ctx.drawImage(background3,this.x,this.y,this.width,this.height);
        ctx.drawImage(background3,this.x+CANVAS_WIDTH,this.y,this.width,this.height); 
        }if(count==3){
        ctx.drawImage(background4,this.x,this.y,this.width,this.height);
        ctx.drawImage(background4,this.x+CANVAS_WIDTH,this.y,this.width,this.height);     
        count=0;    
    } 
    }
}
class Simpson{
    constructor(){
        this.spriteWidth=110;
        this.spriteHeight=187;
        this.width=this.spriteWidth/2;
        this.height=this.spriteHeight/2;
        this.frame=0;
        this.img=new Image();
        this.img.src='simpson_running.png'
        this.x=CANVAS_WIDTH/2;
        this.y=3*CANVAS_HEIGHT/4+this.spriteHeight/2;
    }
    update(){
        this.frame>4?this.frame=0:this.frame++;
    } 
    draw(){
        ctx.strokeRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.img,this.frame*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);      
    }
}
class Enemy{
    constructor(image_path,max_frame,spriteWidth,spriteHeight){
        this.spriteWidth=spriteWidth;
        this.spriteHeight=spriteHeight;
        this.image=new Image();
        this.markedForDeletion=false;
        this.image.src=image_path;
        this.maxFrame=max_frame;
        this.frame=0;
        this.timeSinceFlap=0;
        this.sizeModifier=Math.random()*0.4+0.4;
        this.width=this.spriteWidth*this.sizeModifier;
        this.height=this.spriteHeight*this.sizeModifier;
        this.flapInterval=Math.random()*50+50;
        this.x=board.width;
        this.y=Math.random()*(board.height/5)+board.height/5;
        this.directionX=Math.random()*5+3;
        this.directionY=Math.random()*5-2.5;
        this.randomColors=[Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
        this.color='rgb('+this.randomColors[0]+','+this.randomColors[1]+','+this.randomColors[2]+')';
    }
    update(deltatime){
        this.x-=this.directionX;
        this.y+=this.directionY;
        if(this.x<0-this.width)this.markedForDeletion=true;
        this.timeSinceFlap+=deltatime;
        if(this.timeSinceFlap>this.flapInterval){
            if(this.frame>this.maxFrame)this.frame=0;
            else this.frame++;
            this.timeSinceFlap=0;
        }
    } 
    draw(){
        collision_ctx.fillStyle=this.color;
        collision_ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
    }
}
let a=new layer(1,CANVAS_WIDTH,CANVAS_HEIGHT);
let simposin=new Simpson();
let enemy1=new Enemy("raven.png",4,271,194);
let enemy2=new Enemy("enemy1.png",4,293,155);
//raven,enemy1(bat),enemy2(),enemy3(),enemy4(boss)
let enemies=[];
let spawn_interval=[500,600,1000,1200,1400];
let timetoNextEnemy=[0,0,0,0,0];
function what_to_Spawn(timestamp,deltatime){
    lastTime=timestamp;
    timetoNextEnemy[0]+=deltatime;timetoNextEnemy[1]+=deltatime;timetoNextEnemy[2]+=deltatime;timetoNextEnemy[3]+=deltatime;timetoNextEnemy[4]+=deltatime;
    if(timetoNextEnemy[0]>spawn_interval[0]){
        timetoNextEnemy[0]=0;
        enemies.push(new Enemy("raven.png",4,271,194));
        enemies.sort(function(a,b){
            return a.width-b.width;
        })
    };
    if(timetoNextEnemy[1]>spawn_interval[1]){
        timetoNextEnemy[1]=0;
        enemies.push(new Enemy("enemy1.png",4,293,155));
        enemies.sort(function(a,b){
            return a.width-b.width;
        })
    };
    // if(timetoNextEnemy[2]>spawn_interval[2]){
    //     timetoNextEnemy[2]=0;
    // }
    // if(timetoNextEnemy[3]>spawn_interval[3]){
    //     timetoNextEnemy[3]=0;
    // }
    // if(timetoNextEnemy[4]>spawn_interval[4]){
    //     timetoNextEnemy[4]=0;
    // }
}
let explosions=[];
class Explosion {
    constructor(x, y, size) {
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = "boom.png";
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'fart_song.wav';
        this.timeSinceLastFrame = 0;  // Define timeSinceLastFrame
        this.frameInterval = 200;  // Define frameInterval
        this.markedForDeletion = false;  // Initialize markedForDeletion
    }

    update(deltatime) {
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            if (this.frame > 5) this.markedForDeletion = true;
            this.timeSinceLastFrame = 0;
        }
        if (this.frame == 0) this.sound.play();
        if (this.frame == 4) this.sound.pause();
    }
    draw() {
        ctx.drawImage(
            this.image,
            this.spriteWidth * this.frame,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.x, this.y,
            this.size,
            this.size
        );
    }
}
function animate(timestamp) {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    collision_ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    if(!gameOver){
    a.update();
    a.draw();
    simposin.update();
    simposin.draw();
    let deltatime=timestamp-lastTime;
    what_to_Spawn(timestamp,deltatime); 
    [...enemies,...explosions].forEach(object=>object.update(deltatime));
    [...enemies,...explosions].forEach(object=>object.draw());    
    check(simposin.x-100);
    enemies=enemies.filter(object=>!object.markedForDeletion);
    explosions=explosions.filter(object=>!object.markedForDeletion);
    }else{
        score.innerHTML="game Over!!";    
    }
}
function checkifalreadypassed(i){
    for(let j=0;j<index.length;j++){
        if(i==index[j]) return 0;
    }
    return 1;
}
function check(a){
    console.log(number_of_enemies_passed);
    for(let i=0;i<enemies.length;i++) {
    if(enemies[i].x<=CANVAS_WIDTH/2&&enemies[i].x>0&&checkifalreadypassed(i)) {
      index.push(i);
      number_of_enemies_passed++;
    }
    if(enemies[i].x<0) enemies[i].markedForDeletion=true;
    if(number_of_enemies_passed==20) gameOver=true;
    }
}
window.addEventListener('click', function (e) {
    const detectPixelColor = collision_ctx.getImageData(e.x, e.y, 1, 1);
    const pc = detectPixelColor.data;
    enemies.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
            points++;
            display_meme=0;
            score.innerHTML="score:"+points;
            object.markedForDeletion = true;
            explosions.push(new Explosion(object.x, object.y, object.width));
        }
    });
});
animate(0);
score.innerHTML="score:"+points;            