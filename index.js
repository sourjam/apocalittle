// phaser code
// forked off: https://repl.it/talk/challenge/Making-a-Phaser-Game-with-HTML5-and-JavaScript/7593
const map = '1                                               @       1.'+
            '1                                     @      love       1.'+
            '1        @                       @  and  @              1.'+
            '1 2 @  the    @           @  world       i              1.'+
            '11its       end     @   the                   @    @   !1.'+
            '1                  of                      know   it  111.'+
            '1#######################################################1.';
const choicesArr = [
  'Apocalittle, do you know what happened?',
  'its the end of the world and i know it',
  'its the end of the world and i love it'
];
let currentChoice = [];
let calculatingChoice = false;
let config = {
	type: Phaser.AUTO,
    width: 1200,
    height: 300,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
    	preload: preload,
        create: create,
        update: update
    }
};
const game = new Phaser.Game(config);

function preload(){
	this.load.atlas("player", "images/spritesheet.png", "images/sprites.json");
	this.load.image("platform", "images/platform.png");
	this.load.image("spike", "images/spike.png");
	this.load.image("coin", "images/coin.png");
}

function create(){
	this.cameras.main.setBackgroundColor('#ffffff');
	this.spawnPlayer = (x, y)=>{
    this.wordup = (player, platform) => {
      if (!platform.isTinted) {
        currentChoice.push(platform.letter);
        platform.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        if (platform.finishLine && !calculatingChoice) {
          calculatingChoice = true;
          this.calculateChoice();
        }
      }
    }
    this.calculateChoice = () => {
      let scoreA = 0, scoreB = 0;
      let stringA = choicesArr[1].split('').sort().join('');
      let stringB = choicesArr[2].split('').sort().join('');
      let stringChoice = currentChoice.sort().join('');
      if (stringA.match(stringChoice)) {
        console.log('What should we do?')
      } else {
        console.log('APOCALITTLE! Did you cause this?')
      }
    }
		this.player = this.physics.add.sprite(100, y, "player", "sprite_0");
		this.player.body.setGravityY(800);
		this.physics.add.collider(this.player, this.platforms, this.wordup);
		this.cameras.main.startFollow(this.player);
    this.cameras.main.followOffset.set(-400, 0);
		this.player.score = 0;
		this.scoreText = this.add.text(0, 0, "Score: "+this.player.score, {
			fill:"#000000",
			fontSize:"20px",
			fontFamily:"Arial Black"
		}).setScrollFactor(0).setDepth(200);
	};
	this.collectCoin = (player, coin)=>{
		player.score+=10;
		coin.destroy();
		this.scoreText.setText("Score: "+ this.player.score);
	};
	this.die = ()=>{
		this.physics.pause();
		let deathText = this.add.text(0, 0, "YOU DIED", {
			color:"#d53636",
			fontFamily:"Arial Black",
			fontSize:"50px"
		}).setScrollFactor(0);
		Phaser.Display.Align.In.Center(deathText, this.add.zone(400, 250, 800, 500));
		setTimeout(()=>location.reload(), 1500);
	};
	this.platforms = this.physics.add.staticGroup();
	this.coins = this.physics.add.group();
	this.spikes = this.physics.add.group();
  this.finishLine = this.physics.add.group();
	let mapArr = map.split('.');
	let drawX = 0;
	let drawY = 0;
  let currentWord = '';
	mapArr.forEach(row=>{
		drawX = 0;
		for(let i = 0; i<row.length; i++){
			if(row.charAt(i)==='1'){
				this.platforms.create(drawX, drawY, "platform");
			}else if(row.charAt(i)==='2'){
				if(row.charAt(i+1)==='1'){
					this.spawnPlayer(drawX-4, drawY-12);
				}else if(row.charAt(i-1)==='1'){
					this.spawnPlayer(drawX+4, drawY-12);
				}else{
					this.spawnPlayer(drawX, drawY-12);
				}
			}else if(row.charAt(i)==='@'){
				this.coins.create(drawX, drawY+10, "coin");
			}else if(row.charAt(i)==='#'){
				this.spikes.create(drawX, drawY+10, "spike");
      }else if (row.charAt(i) === '!') {
        let currentPlatform = this.platforms.create(drawX, drawY, "platform");
        currentPlatform.finishLine = true;
        this.add.text(drawX - 15, drawY - 20, row.charAt(i), {
          fontfamily: 'Courier',
          fontSize: '40px',
          color: 'yellow'
        });
      }else if (row.charAt(i) !== ' ') {
        let currentPlatform = this.platforms.create(drawX, drawY, "platform");
        currentPlatform.letter = row.charAt(i)
        this.add.text(drawX - 15, drawY - 20, row.charAt(i), {
          fontfamily: 'Courier',
          fontSize: '40px',
          color: 'yellow'
        });
			}
			drawX+=40;
		}
		drawY+=40;
	});

	this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
	this.physics.add.overlap(this.player, this.spikes, this.die, null, this);
	this.anims.create({
		key:"walk",
			frames:[{key:"player", frame:"sprite_2"}, {key:"player", frame:"sprite_1"}],
			frameRate:10,
			repeat:-1
	});
	this.anims.create({
		key:"stand",
			frames:[{key:"player", frame:"sprite_0"}],
			frameRate:1
	});
	this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
	this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
	this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
}

function update(){
	if(this.key_W.isDown && this.player.body.touching.down){
		this.player.setVelocityY(-400);
	}
	if(this.key_A.isDown){
		this.player.setVelocityX(-200);
		this.player.anims.play("walk", true);
		this.player.flipX = true;
	}else if(this.key_D.isDown){
		this.player.setVelocityX(200);
		this.player.anims.play("walk", true);
		this.player.flipX = false;
	}else{
		this.player.anims.play("stand", true);
		this.player.setVelocityX(0);
	}
}
