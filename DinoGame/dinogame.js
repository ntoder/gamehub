const canvas=document.getElementById('gameCanvas')
const ctx=canvas.getContext('2d')

const container=document.getElementById('game-container')
const overlay=document.getElementById('overlay')
const startBtn=document.getElementById('start-btn')

const currentScoreEl=document.getElementById('current-score')
const highScoreEl=document.getElementById('high-score')
const finalScoreDisplay=document.getElementById('final-score-display')

const GRAVITY=0.6
const JUMP_FORCE=-11.5
const GROUND_Y=200

let INITIAL_SPEED=5
let gameSpeed=INITIAL_SPEED
let gameActive=false

let score=0
let highScore=0
let isNight=false

const dino={
x:50,
y:GROUND_Y,
width:44,
height:47,
dy:0,
grounded:true,
isDucking:false,

draw(){

ctx.fillStyle=isNight?'#ccc':'#535353'
ctx.fillRect(this.x,this.y-40,40,40)

},

update(){

if(!(this.isDucking&&this.grounded)){
this.dy+=GRAVITY
this.y+=this.dy
}

if(this.y>GROUND_Y){
this.y=GROUND_Y
this.dy=0
this.grounded=true
}

},

jump(){

if(this.grounded&&!this.isDucking){
this.dy=JUMP_FORCE
this.grounded=false
}

}
}

class Obstacle{

constructor(){

this.x=canvas.width
this.width=20
this.height=40
this.y=GROUND_Y-this.height

}

draw(){

ctx.fillStyle=isNight?'#ccc':'#535353'
ctx.fillRect(this.x,this.y,this.width,this.height)

}

update(){
this.x-=gameSpeed
}

}

let obstacles=[]

function drawBackground(){

ctx.strokeStyle=isNight?'#444':'#535353'

ctx.beginPath()
ctx.moveTo(0,GROUND_Y)
ctx.lineTo(canvas.width,GROUND_Y)
ctx.stroke()

}

function checkCollision(dino,obs){

return(

dino.x<obs.x+obs.width&&
dino.x+dino.width>obs.x&&
dino.y-dino.height<obs.y+obs.height&&
dino.y>obs.y

)

}

function gameLoop(){

if(!gameActive)return

ctx.clearRect(0,0,canvas.width,canvas.height)

score+=0.15
gameSpeed+=0.0006

drawBackground()

dino.update()
dino.draw()

if(obstacles.length===0||canvas.width-obstacles[obstacles.length-1].x>350){
obstacles.push(new Obstacle())
}

obstacles.forEach((obs,i)=>{

obs.update()
obs.draw()

if(checkCollision(dino,obs)){
gameActive=false
gameOver()
}

if(obs.x+obs.width<0)obstacles.splice(i,1)

})

currentScoreEl.innerText=Math.floor(score).toString().padStart(5,'0')
highScoreEl.innerText=Math.floor(highScore).toString().padStart(5,'0')

requestAnimationFrame(gameLoop)

}

function gameOver(){

if(score>highScore)highScore=score

document.getElementById('game-over-text').classList.remove('hidden')

finalScoreDisplay.innerText=`הניקוד שלך: ${Math.floor(score)}`

startBtn.innerText='נסה שוב'

overlay.classList.remove('hidden')

}

function start(){

score=0
gameSpeed=INITIAL_SPEED
obstacles=[]
gameActive=true

overlay.classList.add('hidden')

gameLoop()

}

window.addEventListener('keydown',e=>{

if(e.code==='Space'||e.code==='ArrowUp'){
if(!gameActive)start()
else dino.jump()
}

if(e.code==='ArrowDown')dino.isDucking=true

})

window.addEventListener('keyup',e=>{

if(e.code==='ArrowDown')dino.isDucking=false

})

startBtn.addEventListener('click',start)

function resize(){

canvas.width=container.clientWidth
canvas.height=container.clientHeight

}

window.addEventListener('resize',resize)

resize()