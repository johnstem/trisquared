(function(){

	
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	
	// make game objects and variables
	var animation_timer = 0;
	var player_timer = 0;
	var level = 0;
	var p1 = {};
	var sprites = [];
	var msprites = [];
	var gamestarted = false;
	
	// $('#myCanvas').click(function(){alert(sprites.length);});
	
	var gameworld = {
	
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	
	var camera = {
	
		x: 0,
		y: 0,
		// change this to match the size of canvas
		width: 1000,
		height: 600,
		
		// multiple conditions for camera square probably unecessary, just give the world
		// extra margins to avoid scrolling to the end of the world
		leftbound: function(){
		
			if(camera.x <= 0){
				return 0;
			}
			else if(this.x+this.width >= gameworld.width){
				return (gameworld.width-this.width/2);
			}
			else{
				return (this.x+this.width/4);
			}
		},
		
		rightbound: function(){
			if(camera.x <= 0){
				return this.width/2;
			}
			else if(this.x+this.width >= gameworld.width){
				return gameworld.width;
			}
			else{
				return (this.x + 3*this.width/4);
			}
		},
		topbound: function(){return (this.y + this.height/4);},
		bottombound: function(){return (this.y + 3*this.height/4);}
	
	};
	
	
	// get assets
	var square11 = new Image();
	square11.src = "blue11.png";
	var square13 = new Image();
	square13.src = "blue13.png";
	var square21 = new Image();
	square21.src = "orange11.png";
	var square23 = new Image();
	square23.src = "orange13.png";
	var square31 = new Image();
	square31.src = "red11.png";
	var square33 = new Image();
	square33.src = "red13.png";
	
	var playerpic1 = new Image();
	playerpic1.src = "player1.png";
	var playerpic2 = new Image();
	playerpic2.src = "player2.png";

	/*
	var backimage = new Image();
	backimage.src = "";
	*/
	
	var music0 = new Audio("DST-3rdBallad.mp3");
	music0.addEventListener('ended', function(){
	
		music0.play();
	
	},false);
	
	var music2 = new Audio("DST-DasElectron.mp3");
	music2.addEventListener('ended', function(){
	
		music2.play();
	
	},false);
	
	var music3 = new Audio("DST-AngryMod.mp3");
	music3.addEventListener('ended', function(){
	
		music3.play();
	
	},false);
	
	var jump1 = new Audio("Jump17.wav");
	var jump2 = new Audio("Jump16.wav");
	var explosion_sound = new Audio("explosion1.wav");
	
	var explosion =  new Audio();
	
	// set the tile pictures
	var blue = square11;
	var orange = square21;
	var red = square31;
	
	// set the background picture
	
	// set the sound file in playmusic function
	
	
	// constructor function for terrain rectangles
	function rectangle(x,y,w,h,num,type){
		this.x = x;
		this.y = y;
		this.xstart = x;
		this.ystart = y;
		
		this.width = w;
		this.height = h;
		this.number = num;
		this.on = false;
		this.type = type;
		this.max = false;
		this.min = true;
		
		this.minisquare = [];
		this.exploded = false;
		this.explodetimer = true;
		
		this.xcenter = function(){return (this.x+this.width/2);};
		this.ycenter = function(){return (this.y+this.height/2);};
		
		this.halfheight = function(){return(this.height/2);};
		this.halfwidth = function(){return(this.width/2);};
	
		this.populate = function(){
			var across = this.width/10;
			var down = this.height/10;
			var x = 0;
			var y = 0;
			for(var i = 0; i < down; i++){
			
				for(var j = 0; j < across; j++){
				
					newsquare = {};
					newsquare.x = this.x + j*10;
					newsquare.y = this.y + i*10;
					newsquare.vx = 0;
					newsquare.vy = 0;
					this.minisquare.push(newsquare);
				
				}
				
			}
		
		} // end of populate function
		
		this.movesquares = function(vx,vy){
			for(var n = 0; n < this.minisquare.length; n++){
				this.minisquare[n].x += vx;
				this.minisquare[n].y += vy;
			}
		}
		
	}// end of rectangle object
	
	
	function setlevel(){
	
	sprites = [];
	msprites = [];
	
	player_timer = 0;
	animation_timer = 0;
	p1.alive = true;
	p1.victory = false;
	p1.x = 0;
	p1.y = 0;
	p1.width = 50;
	p1.height = 50;
	
	p1.xcenter = function(){return (this.x+this.width/2);};
	p1.ycenter = function(){return (this.y+this.height/2);};
		
	p1.halfheight = function(){return(this.height/2);};
	p1.halfwidth = function(){return(this.width/2);};
		
	p1.vx = 0;
	p1.vy = 0;
	p1.ax = 0;
	p1.ay = 0.2;
	p1.ground = false;
	p1.jreset = false;
	p1.jumpcount = 0;
	p1.jumpheld = false;
	p1.spaceheld = false;
	p1.morph = false;
	p1.stuck = 'none'
	// variables for impact sides
	p1.l = false;
	p1.r = false;
	p1.b = false;
	p1.t = false;
	p1.current_rect = '';
	
	
	// level generation and setup
	
	if(level == 2){
	// first level
	gameworld.width = 5000;
	gameworld.height = 2500;
	
	camera.x = 100;
	camera.y = 1200;
	p1.x = 575;
	p1.y = 1550;
	
	
	var r1 = new rectangle(525,  1600, 150, 50,  1, 1);
	r1.populate();
	var r2 = new rectangle(760,  1600, 150, 50,  2, 1);
	r2.populate();
	var r3 = new rectangle(1060, 1600, 150, 50,  3, 1);
	r3.populate();
	var r4 = new rectangle(1410, 1400, 50,  150, 4, 1);
	r4.populate();
	var r5 = new rectangle(1660, 1600, 150, 50,  5, 1);
	r5.populate();
	var r6 = new rectangle(1860, 1400, 50,  150, 6, 2);
	r6.populate();
	var r7 = new rectangle(1960, 1600, 100, 50,  7, 1);
	r7.populate();
	var r8 = new rectangle(2080, 1520, 40,  80,  8, 3);
	r8.populate();
	var r9 = new rectangle(2140, 1600, 100, 50,  9, 1);
	r9.populate();
	var r10 = new rectangle(2340, 1350, 40, 150,  10, 2);
	r10.populate();
	var r11 = new rectangle(2420, 1350, 50, 150,  11, 1);
	r11.populate();
	var r12 = new rectangle(2550, 1350, 50, 100,  12, 3);
	r12.populate();
	var r13 = new rectangle(2680, 1350, 400, 50,  13, 1);
	r13.populate();
	var r14 = new rectangle(2930, 1200, 40, 150,  14, 3);
	r14.populate();
	var r15 = new rectangle(2830, 1050, 40, 150,  15, 1);
	r15.populate();
	var r16 = new rectangle(2980, 1230, 100, 40,  16, 2);
	r16.populate();
	var r17 = new rectangle(2980, 1190, 100, 40,  17, 3);
	r17.populate();
	var r18 = new rectangle(3280, 1230, 40, 100,  18, 1);
	r18.populate();
	var r19 = new rectangle(3570, 1030, 40, 100,  19, 1);
	r19.populate();
	var r20 = new rectangle(3280, 830, 40, 100,  20, 1);
	r20.populate();
	var r21 = new rectangle(3420, 1030, 50, 100, 21, 3);
	r21.populate();
	var r22 = new rectangle(2870, 630, 300, 50, 22, 1);
	r22.populate();
	var r23 = new rectangle(2710, 430, 60, 200, 23, 2);
	r23.populate();
	var r24 = new rectangle(2630, 470, 60, 100, 24, 2);
	r24.populate();
	var r25 = new rectangle(2550, 430, 60, 200, 25, 2);
	r25.populate();
	var r26 = new rectangle(2630, 580, 60, 50, 26, 3);
	r26.populate();
	var r27 = new rectangle(2310, 530, 40, 100, 27, 3);
	r27.populate();
	var r28 = new rectangle(2070, 530, 40, 100, 28, 3);
	r28.populate();
	var r29 = new rectangle(1870, 430, 100, 50, 29, 4);
	r29.populate();
	
	sprites.push(r1);
	sprites.push(r2);
	sprites.push(r3);
	sprites.push(r4);
	sprites.push(r5);
	sprites.push(r6);
	sprites.push(r7);
	sprites.push(r8);
	sprites.push(r9);
	sprites.push(r10);
	sprites.push(r11);
	sprites.push(r12);
	msprites.push(r12);
	sprites.push(r13);
	sprites.push(r14);
	sprites.push(r15);
	sprites.push(r16);
	sprites.push(r17);
	msprites.push(r17);
	sprites.push(r18);
	sprites.push(r19);
	sprites.push(r20);
	sprites.push(r21);
	msprites.push(r21);
	sprites.push(r22);
	msprites.push(r22);
	sprites.push(r23);
	sprites.push(r24);
	sprites.push(r25);
	sprites.push(r26);
	sprites.push(r27);
	msprites.push(r27);
	sprites.push(r28);
	msprites.push(r28);
	sprites.push(r29);
	}
	else if(level == 3){
	//second level
	
	gameworld.height = 5000;
	gameworld.width = 1500;
	camera.x = 750-500;
	camera.y = 9000-600-4200;
	p1.x = (750-25);
	p1.y = (9000-150-50-4200);
	//
	var r1 =  new rectangle(675,  8850-4200, 150, 40,  1,  1);
	r1.populate();
	var r2 =  new rectangle(710,  8770-4200, 80,  20,  2,  1);
	r2.populate();
	var r3 =  new rectangle(710,  8710-4200, 80,  40,  3,  2);
	r3.populate();
	var r4 =  new rectangle(650,  8770-4200, 60,  20,  4,  3);
	r4.populate();
	var r5 =  new rectangle(790,  8770-4200, 60,  20,  5,  3);
	r5.populate();
	var r6 =  new rectangle(730,  8470-4200, 40,  100, 6,  1);
	r6.populate();
	var r7 =  new rectangle(1030, 8270-4200, 40,  100, 7,  1);
	r7.populate();
	var r8 =  new rectangle(930,  8170-4200, 40,  100, 8,  2);
	r8.populate();
	var r9 =  new rectangle(730,  8120-4200, 40,  100, 9,  1);
	r9.populate();
	var r10 = new rectangle(830,  8120-4200, 40,  100, 10, 3);
	r10.populate();
	var r11 = new rectangle(630,  8120-4200, 40,  100, 11, 3);
	r11.populate();
	var r12 = new rectangle(530,  8120-4200, 40,  150, 12, 2);
	r12.populate();
	var r13 = new rectangle(430,  7900-4200, 40,  150, 13, 1);
	r13.populate();
	var r14 = new rectangle(730,  7700-4200, 40,  100, 14, 1);
	r14.populate();
	var r15 = new rectangle(740,  7400-4200, 20,  200, 15, 1);
	r15.populate();
	var r18 = new rectangle(740,  7300-4200, 20,  100, 18, 3);
	r18.populate();
	var r16 = new rectangle(780,  7300-4200, 50,  100, 16, 3);
	r16.populate();
	var r17 = new rectangle(670,  7000-4200, 50,  100, 17, 3);
	r17.populate();
	var r19 = new rectangle(780,  6700-4200, 50,  100, 19, 3);
	r19.populate();
	var r20 = new rectangle(780,  6400-4200, 50,  150, 20, 2);
	r20.populate();
	var r21 = new rectangle(670,  6400-4200, 50,  150, 22, 2);
	r21.populate();
	var r22 = new rectangle(670,  6100-4200, 50,  150, 22, 3);
	r22.populate();
	var r23 = new rectangle(780,  6100-4200, 50,  150, 23, 2);
	r23.populate();
	var r24 = new rectangle(670,  5800-4200, 50,  150, 24, 2);
	r24.populate();
	var r25 = new rectangle(780,  5800-4200, 50,  150, 25, 3);
	r25.populate();
	var r26 = new rectangle(670,  5500-4200, 50,  150, 26, 1);
	r26.populate();
	var r27 = new rectangle(780,  5500-4200, 50,  150, 27, 1);
	r27.populate();
	var r28 = new rectangle(700,  5200-4200, 100, 50,  28, 4); 
	
	
	sprites.push(r1);
	sprites.push(r2)
	sprites.push(r3);
	sprites.push(r4);
	sprites.push(r5);
	sprites.push(r6);
	sprites.push(r7);
	sprites.push(r8);
	sprites.push(r9);
	sprites.push(r10);
	msprites.push(r10);
	sprites.push(r11);
	msprites.push(r11);
	sprites.push(r12);
	sprites.push(r13);
	sprites.push(r14);
	sprites.push(r15);
	msprites.push(r15);
	sprites.push(r16);
	sprites.push(r17);
	sprites.push(r18);
	msprites.push(r18);
	sprites.push(r19);
	sprites.push(r20);
	sprites.push(r21);
	sprites.push(r22);
	sprites.push(r23);
	sprites.push(r24);
	sprites.push(r25);
	sprites.push(r26);
	sprites.push(r27);
	sprites.push(r28);
	
	} // end of first level
	
	} // end of set level function
	
	
	function togglescreens(){
		
		if(level == 0){
			
			$('#container').append(
				'<div id = "floating">'
				+'<div id = "title">'
				+	'<p class = "menup">TriSquared</p>'
				+'</div>'
				+'<div id = "play">'
				+	'<p class = "menup">Play</p>'
				+'</div>'
				+'<div id = "howtoplay">'
				+	'<p class = "menup">How to Play</p>'
				+'</div>'
				+'<div id = "credits">'
				+	'<p class = "menup">Credits</p>'
				+'</div>'
				+'</div>'
				);
			//$('#title').click(function(){alert('clicked1');});
			$('#play').click(function(){
				level = 2;
				$('#floating').remove();
				togglescreens();
			});
			$('#howtoplay').click(function(){
				level = 1;
				$('#floating').remove();
				togglescreens();
				
			});
			$('#credits').click(function(){
				level = 5;
				$('#floating').remove();
				togglescreens();
				
			});
			playmusic();
		}
		else if(level == 1){
			$('#container').append(
				'<div id = "floating">'
				+'<p class = menup><br><br>How to play</p>'
				+'<p class = dtext>'
				+'Use the <i>left/right arrow keys</i> to move.<br>'
				+'Jump once with the <i>up arrow key</i>. <br>'
				+'Press the <i>up arrow key</i> again for a second, higher jump.<br><br>'
				+'Jump on blue blocks (you can also stick to them)<br>' 
				+'Avoid red blocks, destroy the yellow blocks<br>'
				+'Press <i>spacebar</i> while airborne to destroy yellow blocks.<br><br>'
				+'Navigate the level to find the green block<br><br>'
				+'</p>'
				+'<p class = menup>Click to Return</p>'
				+'</div>'
			);
			$('#floating').click(function(){
				level = 0;
				$('#floating').remove();
				togglescreens();
			});
			
		}
		
		else if(level == 2){
			$('#container').append(
				'<div id = "floating">'
				+'<p class = menup><br><br>Proving Grounds<br><br></p>'
				+'<p class = dtext><br><br>Do you have what it takes?<br><br></p>'
				+'<p class = menup><br><br><br><br><br>Click to continue</p>'
				+'</div>'
			);
			$('#floating').click(function(){
				
				$('#floating').remove();
				startgame();
				
			});
		}
		
		else if(level == 3){
			$('#container').append(
				'<div id = "floating">'
				+'<p class = menup><br><br>The Climb<br><br></p>'
				+'<p class = dtext><br><br>Many Make the Climb<br><br>'
				+'Few Succeed'
				+'</p>'
				+'<p class = menup><br><br><br><br><br><br><br>Click to continue</p>'
				+'</div>'
			);
			$('#floating').click(function(){
				$('#floating').remove();
				startgame();
			});
		}
		else if(level == 4){
			$('#container').append(
				'<div id = "floating">'
				+'<p class = menup>Congratulations!</p><br><br>'
				+'<p class = menup>You did it!</p><br>'
				+'<p class = menup>You are the champion</p><br><br>'
				+'<p class = menup>Click to return to main menu</p>'
				+'</div>'
			);
			$('#floating').click(function(){
				level = 2;
				setlevel();
				level = 0;
				music3.pause();
				$('#floating').remove();
				togglescreens();
			});
		}
		else if(level == 5){
			$('#container').append(
				'<div id = "floating">'
				+'<p class = menup>Art</p>'
				+'<p class = dtext>Samantha Stemler</p>'
				+'<p class = menup>Music</p>'
				+'<p class = dtext>DST(Nightrider)</p>'
				+'<p class = dtext>http://www.nosoapradio.us/</p><br>'
				+'<p class = menup>Click to return</p>'
				+'</div>'
			);
			$('#floating').click(function(){
				level = 0;
				$('#floating').remove();
				togglescreens();
			});
		}
		else{
		}
		
	}
	
	function victory(){
	
		if(!p1.victory){
			if(level == 2){
				level = 3;
				togglescreens();
			}
			else if(level == 3){
				level = 4;
				togglescreens();
			}
			else{
			}
		}
		p1.victory = true;
	
	}
	
	function startgame(){
	
		setlevel();
		playmusic();
		if(!gamestarted){
			playgame();
			gamestarted = true;
		}
	}
	
	
	
	function playmusic(){
	
		if(level == 0){
			music0.play();
			//music0.addEventListener('ended', repeat(music0), false);
		}
		else if(level == 2){
			music0.pause();
			music2.play();
			//music2.addEventListener('ended', repeat(music2), false);
		}
		else if(level == 3){
			music2.pause();
			music3.play();
			//music3.addEventListener('ended', repeat(music3), false);
		}
		
		else if(level == 4){
			music3.pause();
		}
		
	}
	
	
	// stops animation after set amount of time
	//var animate = true;
	//setTimeout(function(){animate = false;},10000);
	
	function playgame(){
		
		//if(animate){
		update();
		draw();
		requestAnimationFrame(playgame);
		//}
	}
	
	// could make an asset load finish function here before calling togglescreens to start the game
	
	// start the game
	togglescreens();
	//startgame();
	
	
	// movement handlers
	var moveUp = false;
	var moveDown = false;
	var moveLeft = false;
	var moveRight = false;
	var spaceDown = false;
	
	var LEFT = 37;
	var UP = 38;
	var RIGHT = 39;
	var DOWN = 40;
	var SPACE = 32;
	
	window.addEventListener('keydown', keydownhandle);
	window.addEventListener('keyup', keyuphandle);
	
	
	
	function keydownhandle(e){
		
		switch (e.keyCode){
		
			case LEFT:
				moveLeft = true;
				break;
			case UP:
				moveUp = true;
				break;
			case RIGHT:
				moveRight = true;
				break;
			case DOWN:
				moveDown = true;
				break;
			case SPACE:
				spaceDown = true;
				break;
			default:
		
		}
	}
	
	function keyuphandle(e){
		
		switch (e.keyCode){
		
			case LEFT:
				moveLeft = false;
				break;
			case UP:
				moveUp = false;
				p1.jreset = true;
				// jreset works with ground to reset the jump count, together the player can
				// only start jumping again after he/she hits the ground.
				p1.jumpheld = false;
				break;
			case RIGHT:
				moveRight = false;
				break;
			case DOWN:
				moveDown = false;
				break;
			case SPACE:
				spaceDown = false;
				p1.spaceheld = false;
				break;
			default:
		}		
	}
	
	
	
	
	// game logic functions
	
	function setExplosion(r){
		for(var n = 0; n < r.minisquare.length; n++){
				r.minisquare[n].vx = (r.minisquare[n].x - r.xcenter())/2;
				r.minisquare[n].vy = (r.minisquare[n].y - r.ycenter())/2;
			}
		explosion_sound.play();
	}
	
	function explode(r){
		for(var k = 0; k < r.minisquare.length; k++){
					r.minisquare[k].x += r.minisquare[k].vx;
					r.minisquare[k].y += r.minisquare[k].vy;
			}
	}
	
	
	
	function rectcollision(p, r){
	
	
		var xdist = p.xcenter() - r.xcenter();
		var ydist = p.ycenter() - r.ycenter();
		
		var wid = p.halfwidth() + r.halfwidth();
		var hei = p.halfheight() + r.halfheight();
		
		var xoverlap = wid - Math.abs(xdist);
		var yoverlap = hei - Math.abs(ydist);
		
		if((Math.abs(xdist) < (wid+0.5)) && (Math.abs(ydist) < (hei+0.5))){
			// a collision occurred
			
			// need the extra margins to keep ground turned on.
			// Otherwise once the player is pushed off by overlap the else condition triggers setting
			//ground to false.
			if(r.type == 3){
				p.alive = false;
				setTimeout(setlevel,1000);
			}
			
			else if(r.type == 2){
				if(p.morph){
				
					if(!r.exploded){
						r.exploded = true;
						setExplosion(r);
						setTimeout(function(){
							ind = sprites.indexOf(r);
							sprites.splice(ind,1);
							},1000);
					}
					
				}
				else{
					if(!r.exploded){
						p.alive = false;
						setTimeout(setlevel,1000);
					}
				}	
			}
			else if(r.type == 1 && p.morph){
				
				if(!r.exploded){
					r.exploded = true;
					setExplosion(r);
					setTimeout(function(){
						ind = sprites.indexOf(r);
						sprites.splice(ind,1);
						},1000);
				}
				
			}
			
			// type 1 rectangle without morph. These are the main platforms
			else if((r.type == 1 && !p.morph)){
			
				// can't stick to or stand on rectangles that were exploded
				if(!r.exploded){
			
					// prevents moving rectangles from pushing player through other rectangles
					if(p.stuck == 'none'){
						p.current_rect = r.number;
					}
					
					if(xoverlap > yoverlap){
						// either the top or bottom was hit
						if(ydist <= (0)){
							//bottom of p was hit, top of r was hit
							// p is 'standing' on the platform
							
							p.y -= yoverlap;
							p.ground = true;
							p.b = true;
							
						}
						else if((ydist) > 0){
							// top of p was hit, bottom of r was hit
							p.y += yoverlap + 0.5;
							// extra 0.5 is needed to push player out of margins, otherwise
							// player sticks to the top
							p.vy = 0;
							p.t = true;
						}
					}
					else if(xoverlap < yoverlap){
						// either the left or right was hit
						
						p.jumpcount = 0;
						
						
						if(xdist > 0){
							// left of p was hit, right of r was hit
							
							if(p.current_rect != r.number){
							
								p.current_rect = r.number;
							}	
							
							p.stuck = 'left';
							p.vx = 0;
							p.l = true;
							
							//p.x += xoverlap;
							
						}
						else if(xdist < 0){
							// right of p was hit, left of r was hit
							
							if(p.current_rect != r.number){
							
								p.current_rect = r.number;
							}
							
							p.stuck = 'right';
							p.vx = 0;
							p.r = true;
							
							
							//p.x -= xoverlap;
						}
					}
				} // end of explosion check
			} // end of type 1 collision
			
			//victory block
			
			else if(r.type == 4){
				victory();
			}
			
			else{
			}
			
		} // end of collision logic
		// no collision for this block
		else{
			// need some way to set ground to false once the square moves off the block.
			// same with stuck variables
			// can't just set ground to false if no collision since the last block in the loop 
			// will always set ground to false. Need to use the current rectangle or loop through all
			// rectangles and only disable ground if there is no collision happening anywhere.
			if(p1.current_rect == r.number && p.t){
				p1.current_rect = '';
				p.t = false;
			}
			if(p1.current_rect == r.number && p.b){
				p1.current_rect = '';
				p.ground = false;
				p.b = false;
			}
			if(p1.current_rect == r.number && p.l){
				p1.current_rect = '';
				p.l = false;
			}
			if(p1.current_rect == r.number && p.r){
				p1.current_rect = '';
				p.r = false;
			}
			
		} // end of no collision logic
	
	} // end of rectcollision function
	
	function moverect(vx,vy,r,minx,maxx,miny,maxy,q){
		// rectangles start with min turned on
		// for up/down give maxx, minx dimensions of entire level
		// for left/right give maxy, miny dimensions of entire level
		
		// use q for 'elevator' blocks
		// r turns movement on when block q is hit
		var xvel = 0;
		var yvel = 0;
		if(q != 'none'){
			if((p1.stuck != 'none'||p1.ground) && p1.current_rect == q.number){
				r.on = true;
			}
		}
		else{
			r.on = true;
		}
		
		if(r.on){
		
			if(r.min){
				xvel = vx;
				yvel = -vy;
			}
			if(r.max){
				xvel = -vx;
				yvel = vy;
			}
			r.x += xvel;
			r.y += yvel;
			r.movesquares(xvel,yvel);
			
			if(r.x > maxx || r.y < maxy){
				r.max = true;
				r.min = false;
			}
			if(r.x < minx || r.y > miny){
				r.max = false;
				r.min = true;
			}
			
			if(p1.stuck != 'none' && p1.current_rect == r.number){
				p1.x += xvel;
				p1.y += yvel;
				camera.x += xvel;
				camera.y += yvel;
			}
			else if(p1.ground && p1.current_rect == r.number && p1.stuck == 'none'){
				p1.x += xvel;
				p1.y += yvel;
				camera.x += xvel;
				camera.y += yvel;
			}
		}
	}
	
	// game logic loop function
	function update(){
	
		if(p1.morph){
			player_timer += 1;
		}
		animation_timer += 0.02;
		if(Math.floor(animation_timer)%2 == 0){
			blue = square11;
			orange = square21;
			red = square31;
		}
		else if(Math.floor(animation_timer)%2 == 1){
			blue = square13;
			orange = square23;
			red = square33;
		}
		else{
		}
	
		for(var i = 0; i<sprites.length; i++){
			rectcollision(p1,sprites[i]);
			if(sprites[i].exploded){
				explode(sprites[i]);
			}
		}
		// checks for bottom of screen which is being treated as 'ground'
		/*
		if(p1.y+p1.height >= c.height){
			p1.y = c.height-p1.height;
			p1.ground = true;	
		}
		*/
		// handles the velocity if the player is on ground or stuck, also resets jump counter
		if(p1.ground){
			p1.vy = -p1.ay;
			if(p1.jreset == true){
				p1.jumpcount = 0;
			}
		}
		
		if(level == 3){
		moverect(0,0.8,msprites[0],0,1500,8270-4200,8120-4200, 'none');
		moverect(0,1.5,msprites[1],0,1500,8150-4200,7800-4200, 'none');
		moverect(0,0.6,msprites[2],0,1500,7400-4200,5500-4200, msprites[2]);
		moverect(0,0.6,msprites[3],0,1500,7300-4200,5400-4200, msprites[2]);
		}
		else if(level == 2){
		
		moverect(0,0.8,msprites[0],0,gameworld.width,1400,1200,'none');
		moverect(1,0,msprites[1],2980,3200,gameworld.height,0,'none');
		moverect(0,1.5,msprites[2],0,gameworld.width,1230,830,'none');
		moverect(0.6,0,msprites[3],1970, 2870, gameworld.height, 0, msprites[3]);
		moverect(0,2.5,msprites[4],0,gameworld.width,530,330,'none');
		moverect(0,2.5,msprites[5],0,gameworld.width,530,330,'none');
		}
		else{
		}
		
		// handles player movement, this happens after velocity changes as a result
		// of ground. Therefore jumping and moving will take precedence instead of being caught
		// by the ground condition first. (nature of 'if' statements)
		
		if(moveLeft){
			p1.vx = -2;
			if(p1.stuck == 'right'){
				p1.stuck = 'none';
				p1.r = false;
				p1.current_rect = '';
				p1.x -= 5;
			}
			
		}
		if(moveRight){
			p1.vx = 2;
			if(p1.stuck == 'left'){
				p1.stuck = 'none';
				p1.l = false;
				p1.current_rect = '';
				p1.x += 5;
			}
		}
		if(!moveLeft && !moveRight){
			p1.vx = 0;
		}
		
		// cheat mode
		/*
		if(moveUp){
			p1.vy = -5;
			
		}
		*/
		if(moveUp && !p1.jumpheld && p1.stuck == 'none'){
			
			p1.jumpheld = true;
			p1.ground = false;
			p1.jreset = false;
			
			
			if(p1.jumpcount == 0){
				p1.vy = -5;	
				p1.jumpcount = 1;
				jump1.play();
			}
			
			else if(p1.jumpcount == 1){
				p1.jumpcount = 2;
				p1.vy = -8;	
				jump2.play();
			}
			else{
			}		
		}
		// morphs player
		if(spaceDown && !p1.spaceheld && p1.stuck == 'none' && !p1.ground){
			p1.spaceheld = true;
			
			if(!p1.morph){
				p1.morph = true;		
			}
			else{
				p1.morph = false;
			}
		}
		// lets player stick to blocks
		if(p1.stuck == 'left' || p1.stuck == 'right'){
			p1.vx = 0;
			p1.vy = -p1.ay;
		}
		
		if(!p1.alive){
			p1.vy = 0;
			p1.vx = 0;
		}
		
		// vertical gravity physics and movement for player and camera
		if(p1.alive){
			p1.vy += p1.ay;
			p1.y += p1.vy;
			camera.y += p1.vy;
			
			// horizontal player movement
			p1.x += p1.vx;
			camera.x += p1.vx;
		}
		
		
		
		/*
		// horizontal camera movement
		if(p1.x < camera.leftbound()){
			if(camera.leftbound() == (gameworld.width-camera.width/2)){
				camera.x -= 0.1;
			}
			else{
				camera.x += p1.vx;
			}
		}
		
		if(p1.x+50 > camera.rightbound()){
			if(camera.rightbound() == camera.width/2){
				camera.x += 0.1;
			}
			else{
				camera.x += p1.vx;
			}
		}
		*/
		// Unused vertical camera movement conditions
		/*
		if(p1.y < camera.topbound()){
			camera.y += p1.vy;
		}
		if(p1.y+50 > camera.bottombound()){
			camera.y += p1.vy;
		}
		*/
		
		// player horizontal boundary conditions
		if(p1.x+50 > gameworld.width){
			p1.x = gameworld.width-50;
			
		}
		if(p1.x < 0){
			p1.x = 0;
			
		}
		
		// camera horizontal boundary conditions
		if((camera.x + camera.width) > (gameworld.width)){
			camera.x = gameworld.width-camera.width;
		}
		if(camera.x < 0){
			camera.x = 0;
		}
		// camera vertical boundary conditions
		if(camera.y+camera.height > gameworld.height){
			camera.y = gameworld.height-camera.height;
		}
		if(camera.y < 0){
			camera.y = 0;
		}
		
		// player death if 'squished' by blocks
		if(p1.l && p1.r){
			//p1.alive = false;
			setlevel();
		}
		if(p1.t && p1.b){
			//p1.alive = false;
			setlevel();
		}
		
		// player death for falling off screen
		if(p1.y > gameworld.height){
			setTimeout(setlevel,1000);
		}
	}
	
	// draw loop function 
	function draw(){
	
		ctx.clearRect(0,0,c.width,c.height);
		
		ctx.save();
		// keep canvas centered on the camera
		ctx.translate(-camera.x,-camera.y);
		
		// draw the background
		/*
		ctx.drawImage(
		backimage,
		0,0,750,500,
		0,0,gameworld.width,gameworld.height
		);
		*/
		// draw the player
		if(p1.alive){
			if(p1.morph != true){
				ctx.drawImage(
					playerpic1,
					0,0,190,190,
					p1.x, p1.y, 50, 50
					);
			}
			else{
				ctx.save();
				// triangle spinning logic
				ctx.translate(p1.x+25,p1.y+25);
				ctx.rotate(20*(Math.PI/180)*(player_timer));
				ctx.drawImage(
					playerpic2,
					0,0,190,190,
					-25, -25, 50, 50
					);
				
				ctx.restore();
				// end of triangle spinning logic
			}
		}
		// draws minisqures inside each rectangle, rectangles themselves are not draw
		// the bounding rectangles are used for game logic.
		for(var i = 0;i < sprites.length; i++){
			if(sprites[i].type == 1){
				ctx.fillStyle = 'blue';
				
				//ctx.strokeRect(sprites[i].x, sprites[i].y, sprites[i].width, sprites[i].height);
					for(var m =0; m < sprites[i].minisquare.length; m++){
						
						ctx.drawImage(
						blue,
						0,0,190,190,
						sprites[i].minisquare[m].x, sprites[i].minisquare[m].y, 10, 10
						);
					}
			}
			else if(sprites[i].type == 2){
				//ctx.fillRect(sprites[i].x, sprites[i].y, sprites[i].width, sprites[i].height);
				for(var m =0; m < sprites[i].minisquare.length; m++){
					
					ctx.drawImage(
						orange,
						0,0,190,190,
						sprites[i].minisquare[m].x, sprites[i].minisquare[m].y, 10, 10
						);
				}
				
			}
			else if(sprites[i].type == 3){
				//ctx.fillRect(sprites[i].x, sprites[i].y, sprites[i].width, sprites[i].height);
				for(var m =0; m < sprites[i].minisquare.length; m++){
					
					ctx.drawImage(
						red,
						0,0,190,190,
						sprites[i].minisquare[m].x, sprites[i].minisquare[m].y, 10, 10
						);
				}	
			
			}
			else if(sprites[i].type == 4){
				ctx.fillStyle = 'green';
				ctx.fillRect(sprites[i].x, sprites[i].y, sprites[i].width, sprites[i].height);
			}
			else{
			}
		}
		ctx.restore();
	}
	
}()) // executes the game module function