var can, ctx;
can = document.getElementById("canvas");
ctx = can.getContext("2d");
var TILE_WIDTH = 100;
var TILE_HEIGHT = 100;
var TIME = 100;
var mustCreate = true;
var isRight = 1;
var sprite = 0;
var count = 0;
var walledLeft = false;
var walledRight = false;
var floored = true;
var ceiled = false;
var current = 0;
var slimeCharge = 0;
var mod = 25;
var attack = 0;
var Sprites = {
    death: document.getElementById("death"),
    toastTail1: document.getElementById("toasttail1"),
    toastTail1LEFT: document.getElementById("toasttail1LEFT"),
    toastTail2: document.getElementById("toasttail2"),
    toastTail2LEFT: document.getElementById("toasttail2LEFT"),
    end: document.getElementById("end"),
    brick: document.getElementById("brick"),
    background: document.getElementById("background"),
    antagonist: document.getElementById("antagonist"),
    antagonist2: document.getElementById("antagonist2"),
    minion: document.getElementById("minion1"),
    minion2: document.getElementById("minion2")
    
}
var key = {
    rightCode: 68,
    leftCode: 65,
    upCode: 87,
    interactCode: 32
}
var overDoor = {
    One: true,
    Two: true,
    Three: true
}
var right = false;
var left = false;
var up = false;
var interact = false;
var XV = 0;
var YV = 0;

function getMap(num){
    switch(num){
        case 0:
            currentMap = levelMap.Overworld;
            current = 0;
            break;
        case 1:
            currentMap = levelMap.One;
            current = 1;
            break;
        case 2:
            currentMap = levelMap.Two;
            current = 2;
            break;
        case 3:
            currentMap = levelMap.Three;
            current = 3;
            break;
    }
}

document.addEventListener("keydown", function(event){
    if(event.keyCode == key.rightCode){
        right = true;
    }
    if(event.keyCode == key.leftCode){
        left = true;
    }
    if(event.keyCode == key.upCode){
        up = true;
    }
    if(event.keyCode == key.interactCode){
        interact = true;
    }
}, false);
document.addEventListener("keyup", function(event){
    if(event.keyCode === key.rightCode){
        right = false;
    }
    if(event.keyCode === key.leftCode){
        left = false;
    }
    if(event.keyCode === key.upCode){
        up = false;
    }
    if(event.keyCode === key.interactCode){
        interact = false;
    }
}, false)


function checkCollision(x1, y1, x2, y2){
    if(x1 < x2 + 80 && x2 < x1 + 80 && y1 < y2 + 80 && y2 < y1 + 80){
        return true;
    } else{
        return false;
    }
}
function checkCollisionV(x1, y1, x2, y2){
    x1 += 40;
    if(x1 < x2 + 100 && x2 < x1 + 20 && y1 < y2 + 100 && y2 < y1 + 100){
        return true;
    } else{
        return false;
    }
}
function checkCollisionH(x1, y1, x2, y2){
    y1 += 40;
    if(x1 < x2 + 100 && x2 < x1 + 100 && y1 < y2 + 100 && y2 < y1 + 20){
        return true;
    } else{
        return false;
    }
}
function checkCollisionTop(y1, y2){
    if(y1 > y2){
        return true
    }else{
        return false;
    }
}
function checkCollisionDown(y1, y2){
    if(y1 < y2){
        return true
    }else{
        return false;
    }
}
function checkCollisionLeft(x1, x2){
    if(x1 > x2){
        return true
    }else{
        return false;
    }
}
function checkCollisionRight(x1, x2){
    if(x1 < x2){
        return true
    }else{
        return false;
    }
}



var running = true;
var gameloop = function() {
    if(running){
        if(mustCreate){
            loadMap(currentMap)
            mustCreate = false;
        }
        driver()
        if(!(overDoor.One || overDoor.Two || overDoor.Three)){
            running = false;
            ctx.fillStyle="black";
            ctx.font="Arial 1000px"
            ctx.fillText("Thank You", 200, 200, 600);
            ctx.fillText("For Playing", 200, 400, 600);
            ctx.fillText("Toaster Taled", 200, 600, 600);
        }
    }
}
var driver = function(){
    Toast();
    advance();
    update();
    draw();
}
function draw(){
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.fillStyle="#FFFFFF";
    ctx.fillRect(0, 0, 1000, 1000);
    ctx.drawImage(Sprites.background, 1000, 1000);
    drawSlimeGun()
    drawPieces();
    drawMinions();
    drawToast();
}
function advance(){
    if(right && !walledRight){
        isRight = 1;
        XV = 30;
    }else if(left && !walledLeft){
        isRight = 0;
        XV = -30;
    }else{
        XV = 0;
    }
    if(up && floored){
        YV = -60;
    }else if(!floored){
        if(YV < 15){
        YV += 10;}
    }else{
        YV = 0;
    }
    
    if(ceiled){
        if(YV < 0){
            YV = 0;
        }
    }

}
function update(){
    runSlime();

    for(var i of bullets){
        i.x -= (i.xv + XV);
        i.y -= (i.yv + YV);
                if(checkCollision(400, 500, i.x, i.y)){
            mustCreate = true;   
            getMap(0);
        }
    }
    
    for(var i of minions){
        if(Math.sqrt(Math.pow((400 - i.x), 2) + Math.pow((500 - i.y), 2)) <= 300){
            i.xVelocity = (-400 + i.x)/20;
            i.yVelocity = (-500 + i.y)/20;
        };
        i.totalXV = i.xVelocity + XV;
        i.totalYV = i.yVelocity + YV;
        i.x -= i.totalXV;
        i.y -= i.totalYV;
        if(checkCollision(400, 500, i.x, i.y)){
            mustCreate = true;   
            getMap(0);
        }
    }
        floored = false;
        ceiled = false;
        walledLeft = false;
        walledRight = false;
    
    for(var i of pieces){
        i.x -= XV;
        i.y -= YV;
        if(i.type === 1){
             if(checkCollisionV(400, 500, i.x, i.y)){
                console.log("vertical")
                if(checkCollisionDown(500, i.y)){ 
                    floored = true;
                }else{
                    floored = false;
                }
                if(checkCollisionTop(500, i.y)){
                    ceiled = true;
                }else{
                    ceiled = false;
                }
            }else if((checkCollisionTop(400, i.x) && checkCollisionDown(400, i.x))){
            
            }
                console.log(floored)
            if(checkCollisionH(400, 500, i.x, i.y)){
                if(checkCollisionLeft(400, i.x)){
                    walledLeft = true;
                }else{
                    walledLeft = false;
                } 
                if(checkCollisionRight(400, i.x)){
                    walledRight = true;
                }else{
                    walledRight = false;
                }
            }else if((checkCollisionLeft(400, i.x) && checkCollisionRight(400, i.x))){
            
            }
        }else if(i.type === 5){
            if(checkCollision(400, 500, i.x, i.y)){
                mustCreate = true;
                getMap(0);
            }
        }else if(i.type === 4){
            if(checkCollision(400, 500, i.x, i.y)){
                switch(current){
                    case 0:
                        if(overDoor.One){
                            mustCreate = true;
                            getMap(1);
                            current = 1;
                        }else if(overDoor.Two){
                            mustCreate = true;
                            getMap(2);
                            current = 2;
                        }else if(overDoor.Three){
                            mustCreate = true;
                            getMap(3);
                            current = 3;
                        }
                        break;
                    case 1:
                        overDoor.One = false;
                        mustCreate = true;
                        getMap(0);
                        break;
                    case 2:
                        overDoor.Two = false;
                        mustCreate = true;
                        getMap(0);
                        break;
                    case 3:
                        overDoor.Three = false;
                        mustCreate = true;
                        getMap(0)
                        break;
                }
            }
        }
    }
}
var Toast = function(){
    count++;
    if(count >= 500/TIME){
        count = 0;
        if(sprite === 0){
            sprite = 1;
        }else {
            sprite = 0;
        }
    }
}

function drawToast() {
    var pic;
    if(isRight === 1){
        if(sprite === 0){
            pic = Sprites.toastTail1;
        }else{
            pic = Sprites.toastTail2;
        }
    }else if(sprite === 1){
        pic = Sprites.toastTail1LEFT;
    }else{
        pic = Sprites.toastTail2LEFT
    }
    ctx.drawImage(pic, 400, 500, 100, 100);
}

var minion = function(x, y){
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
}

var antagonist = function(x, y){
    this.x = x;
    this.y = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
}

var slimegun = [];
function drawSlimeGun(){
    for(var i of slimegun){
    var pic;
    if(sprite === 0){
        pic = Sprites.antagonist;
    }else{
        pic = Sprites.antagonist2;
    }
        ctx.drawImage(pic, i.x, i.y, 200, 200);
    }
        for(var i of bullets){
            ctx.drawImage(Sprites.minion, i.x, i.y, 100, 100);
        }
}
function runSlime(){
    for(var i of slimegun){
        if(Math.sqrt(Math.pow((400 - i.x), 2) + Math.pow((500 - i.y), 2)) >= 800){
        i.xVelocity = (-400 + i.x)/5;
        i.yVelocity = (-500 + i.y)/5;
    }else if(Math.sqrt(Math.pow((400 - i.x), 2) + Math.pow((500 - i.y), 2)) <= 300){
        i.xVelocity = (-400 + i.x)/30;
        i.yVelocity = (-500 + i.y)/30;
    }else if(Math.sqrt(Math.pow((400 - i.x), 2) + Math.pow((500 - i.y), 2)) >= 500){
        i.xVelocity = (-400 + i.x)/15;
        i.yVelocity = (-500 + i.y)/15;
    };
    i.x -= (i.xVelocity + XV);
    i.y -= (i.yVelocity + YV);
    slimeCharge++;
    console.log(slimeCharge);
    if(slimeCharge >= mod){
        slimeCharge = 0;
        switch(attack++){
            case 0:
                minions.push(new minion(i.x, i.y));
                break;
            case 1:
                bullets.push(new bullet(i.x, i.y, 400, 500));
                break;
            case 2:
                bullet.push(new bullets(i.x, i.y, 400, 500));
                break;
            case 3:
                bullet.push(new bullets(i.x, i.y, 200, 300));
                bullet.push(new bullets(i.x, i.y, 600, 700));
                bullet.push(new bullets(i.x, i.y, 400, 500));
                break;
            case 4:
                mod -= 5;
                break;
        }
        if(attack >= 5){
            attack = 0;
        }
    }
    }
}
var bullet = function(x, y, zx, zy){
    this.x = x;
    this.y = y;
    this.zx = zx;
    this.zy = zy;
    this.xv = -(zx - x)/10;
    this.yv = -(zy - y)/10;
}

var bullets = [];

var minions = [];
function drawMinions(){
    var pic;
    if(sprite === 0){
        pic = Sprites.minion;
    }else{
        pic = Sprites.minion2;
    }
    for(var i of minions){
        console.log("fun")
        ctx.drawImage(pic, i.x, i.y, 100, 100);
    }
}

var piece = function(x, y, type){
    this.type = type;
    this.x = x;
    this.y = y;
}

var pieces = [];

function drawPieces(){
    var pic;
    for(var i of pieces){
        if(i.type === 1){
            pic = Sprites.brick;
        }
        if(i.type === 4){
            pic = Sprites.end;
        }
        if(i.type === 5){
            pic = Sprites.death;
        }
        ctx.drawImage(pic, i.x, i.y, 100, 100);
    }
}

var levelMap = {
    Overworld:[
        
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        
        ],
    One:[
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 1, 0, 3, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1], 
[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],

        ],
    Two:[
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],

        
        ],
    Three:[
        [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
[1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
[1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],

        
        ]
}

var currentMap = levelMap.Overworld;

function loadMap(map){
    var startX = 0;
    var startY = 0;
    var initX = 400;
    var initY = 500;
    var mod = 25;
    slimegun = [];
    bullets = [];
    pieces = [];
    minions = [];
    for(var i = 0; i < map.length; i++){
        for( var j = 0; j < map[i].length - 1; j++){
            if(map[i][j] != 0 && map[i][j] != 2 && map[i][j] != 3 && map[i][j] != 6){
                pieces.push(new piece(j*TILE_WIDTH, i*TILE_HEIGHT, map[i][j]));
            }else if(map[i][j] === 3){
                minions.push(new minion(j*TILE_WIDTH, i*TILE_HEIGHT))
            }else if(map[i][j] === 6){
                slimegun.push(new minion(j*TILE_WIDTH, i*TILE_HEIGHT));
            }else if(map[i][j] === 2){
                startX = j*TILE_WIDTH;
                startY = i*TILE_HEIGHT;
            }
        }
    }
    initX = initX - startX;
    initY = initY - startY;
    for(var i of pieces){
        i.x += initX;
        i.y += initY;
    }
    for(var i of minions){
        i.x += initX;
        i.y += initY;
    }
}
setInterval(function(){
    gameloop()
}, TIME);