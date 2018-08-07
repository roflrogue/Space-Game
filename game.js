alert("This game is a work in progress... \n\nThanks for visiting!");
//encapsulating function
(function () {
	//jQuery function
	$(document).ready(function(){
		//declare variable game
		var game = {};
		//stars
		game.stars = [];
		//canvas dimentions
		game.width = 400;
		game.height = 500;
		//declare context for both canvases		
		game.contextBG = document.getElementById("backgroundCanvas").getContext("2d");
		game.contextPlayer = document.getElementById("playerCanvas").getContext("2d");
        game.contextEnemies = document.getElementById("enemyCanvas").getContext("2d");
        game.contextShot = document.getElementById("shotCanvas").getContext("2d");
		//images
		game.images = [];
        //enemies
        game.enemies = [];
		game.loadedImages = 0;
		game.requiredImages = 0;
        //game AI
        game.enemyTimer = 300;
        //shot timer
        game.fullShotTimer = 15;
        game.shotTimer = game.fullShotTimer;
		//player var
		game.player = {
			width: 50,
			height: 50,
			x: game.width / 2 - 25,
			y: game.height - 100,
			speed: 3,
			rendered: false,
            hp: 3
		};
        //
        game.shots = [];
        game.enemyShot = [];
		//keylisteners
		game.keys = [];
        //score
        game.score = 0;
		//add listener
		$(document).keydown(function(e){
			game.keys[e.keyCode ? e.keyCode : e.which] = true;
		});
		$(document).keyup(function(e){
			delete game.keys[e.keyCode ? e.keyCode : e.which];
		});
        function addBullet(){
            game.shots.push({
                x:game.player.x + (game.player.width * .4),
                y:game.player.y - 30,
                height:30,
                width:10,
                image:2
            });
        }
        function enemyFire(){
            console.log("enemy shot fired");
            game.enemies[i].shotTimer = 15;
            pushShot();
        }
        function pushShot(){
            game.enemyShot.push({
                x:game.enemies[i].x + (game.enemies[i].width * .4),
                y:game.enemies.y - 30,
                height:30,
                widht:10,
                image:2
            });
            console.log("shot added to array");
        }
		//initiate game
		function init(){
			//initial stars
			for(i = 0; i < 600; i++){
				game.stars.push({
					x: Math.floor(Math.random() * game.width),
					y: Math.floor(Math.random() * game.height),
					size: Math.random() * 5
				});    
			}
			gameLoop();
		}
		//add stars to array
		function addStar(num){
			for(i = 0; i < num; i++){
				game.stars.push({
					x: Math.floor(Math.random() * game.width),
					y: -1,
					size: Math.random() * 5
				});
				
			}
		}
        function spawnEnemy(){
            if(game.enemyTimer <= 0){
                game.enemies.push({
                            x: Math.floor(Math.random() * (game.width - 50)),
                            y: -50,
                            width: 50,
                            height: 50,
                            image: 1,
                            dead: false,
                            deadTime: 20,
                            shotTimer: 0
                        });
                game.enemyTimer = 300;
            }
            game.enemyTimer--;
        }
		//update canvas
		function update(){
			//console.log("update works");
			addStar(1);
            game.count++;
            if(game.shotTimer>0){
                game.shotTimer--;
            }
			for(i = 0; i < game.stars.length; i++){
				if(game.stars[i].y <= -5){
					game.stars.splice(i,1);	
				}
				game.stars[i].y+=.5;	
			}
            spawnEnemy();
			/*
		up - 38
		down - 40
		left - 37
		right - 39
		
		space - 32
		
		w - 87
		s - 83
		a - 65
		d - 68
		
		z - 90
		x - 88
		*/
			//move up
			if(game.keys[38] || game.keys[87]){
				if(game.player.y >= 0){
					game.player.y-=game.player.speed;
					game.player.rendered = false;
				}
			}
			//down
			if(game.keys[40] || game.keys[83]){
				if(game.player.y <= game.height - game.player.height){
					game.player.y+=game.player.speed;
					game.player.rendered = false;
				}
			}
			//left
			if(game.keys[37] || game.keys[65]){
				if(game.player.x >= 0){
					game.player.x-=game.player.speed;
					game.player.rendered = false;
				}
			}
			//right
			if(game.keys[39] || game.keys[68]){
				if(game.player.x <= game.width - game.player.width){
					game.player.x+=game.player.speed;
					game.player.rendered = false;
				}	
			}
            if(game.keys[32] && game.shotTimer <= 0){
                console.log("Fire Shot");
                addBullet();
                game.shotTimer = game.fullShotTimer;
            }
            
            
            for(i in game.shots){
                game.shots[i].y-=4;
                if(game.shots[i].y <= - (game.shots[i].height + 5)){
                    game.shots.splice(i,1);
                }
            }
            for(i in game.enemies){
                game.enemies[i].y++;
                if(game.enemies[i].y > (game.height + 100)){
                    //console.log("enemy off screen");
                    game.enemies.splice(i,1);
                    //console.log("enemy Spliced")
                }    
            }
            for(i in game.enemies){
                if(game.enemies[i].shotTimer == 0 && game.enemies[i].x == game.player.x && game.player.y > game.enemies[i].y){
                    enemyFire();    
                }
            }
            for(i in game.enemies){
                if(game.enemies[i].shotTimer > 0){
                    game.enemies[i].shotTimer--;
                }
            }    
            for(m in game.enemies){
                for(s in game.shots){
                    if(collision(game.enemies[m], game.shots[s])){
                        game.enemies[m].dead = true;
                        game.enemies[m].image = 3;
                        game.contextShot.clearRect(game.shots[i].x-10,game.shots[i].y-10,game.shots[i].width+20,game.shots[i].height+20);
                        game.shots.splice(s,1);
                        game.score += 100;
                    }
                }
            }
            for(i in game.enemies){
                if(game.enemies[i].dead){
                    game.enemies[i].deadTime--;
                }
                if(game.enemies[i].dead && game.enemies[i].deadTime <=0){
                    game.contextEnemies.clearRect(game.enemies[i].x-10, game.enemies[i].y-10, game.enemies[i].width+20, game.enemies[i].height+20)
                    game.enemies.splice(i,1);
                }
            }
        }
		//render canvas
		function render(){
			game.contextBG.clearRect(0,0,game.width,game.height);
            game.contextBG.fillText(game.score,game.width/2-100,game.height-30);
			game.contextBG.fillStyle = "white";
			for(i = 0; i < game.stars.length; i++){
				var star = game.stars[i];
				game.contextBG.fillRect(star.x, star.y, star.size, star.size);
			}
			if(!game.player.rendered){
				//console.log("rendering");
game.contextPlayer.clearRect(game.player.x-(game.player.width/2),game.player.y-(game.player.height/2),game.player.width+50,game.player.height+50);
            game.contextPlayer.drawImage(game.images[0],game.player.x,game.player.y,game.player.width,game.player.height);
			game.player.rendered = true;
			}
            for(i in game.enemies){
                var enemy = game.enemies[i];
                game.contextEnemies.clearRect(enemy.x-5,enemy.y-5,enemy.width+10,enemy.height+10);
                game.contextEnemies.drawImage(game.images[enemy.image],enemy.x, enemy.y, enemy.width,enemy.height);
            }
            for(i in game.shots){
                game.contextShot.clearRect(game.shots[i].x-2,game.shots[i].y+2,game.shots[i].width+4, game.shots[i].height+2);
                game.contextShot.drawImage(game.images[game.shots[i].image],game.shots[i].x,game.shots[i].y,game.shots[i].width,game.shots[i].height);
            }
            
		}
		//end render function
		//game loop
		function gameLoop(){
			requestAnimFrame(function(){
				gameLoop();
			});
			update();
			render();
		}
		//pass and load all images
		function initImages(paths){
			game.requiredImages = paths.length;
			for(i=0; i < game.requiredImages; i++){
				var img = new Image;
				img.src = paths[i];
				game.images[i] = img;
				game.images[i].onload = function(){
					game.loadedImages++;
				}
			}
		}
        function collision(first, second){
            return !(first.x > second.x + second.width  ||
                     first.x + first.width < second.x   ||
                     first.y > second.y + second.height ||
                     first.y + first.height < second.y  );
        }
		//chech for images
		function checkImages(){
			if(game.loadedImages >= game.requiredImages){
				init();
			}
			else{
				setTimeout(function(){
					checkImages();
				},1);
			}
		}
		//loading please wait msg
		game.contextBG.font = "bold 50 monaco";
		game.contextBG.fillStyle = "white";
		game.contextBG.fillText("loading...",game.width/2-100,game.height/2-30);
        
		//load images
		initImages(["playerShip1_blue.png", "enemyRed1.png", "laserBlue01.png","dead.png"]);
		//chech images
		checkImages();
	});
	
})();
//request animation frame for each browser
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
	  	  window.oRequestAnimationFrame      ||
	      window.msRequestAnimationFrame     ||
	  
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();