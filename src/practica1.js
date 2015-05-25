var MemoryGame = function (gs){
	
	var cards = [];
	var msg = "Memory Game";
	var markedCard = -1;
	var intervalId;
	var sem = true;

	this.initGame = function(){

		var shuffle = function (array) {
	  		var currentIndex = array.length, temporaryValue, randomIndex ;

		  	// While there remain elements to shuffle...
			while (0 !== currentIndex) {

			    // Pick a remaining element...
			    randomIndex = Math.floor(Math.random() * currentIndex);
			    currentIndex -= 1;

			    // And swap it with the current element.
			    temporaryValue = array[currentIndex];
			    array[currentIndex] = array[randomIndex];
			    array[randomIndex] = temporaryValue;
			  }

		  		return array;
		}

		var i = 0;
		var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
		var shuffleArray = shuffle(array);

		for(c in gs.maps){
			if(c != "back"){
				var x1 = shuffleArray[i];
				var x2 = shuffleArray[i+1];
				cards[x1] = new this.Card(c);
				cards[x2] = new this.Card(c);
				i+=2;
			}
		}

		this.loop();
	};

	this.draw = function(){
		for(var i = 0; i < 16; i++){
			cards[i].draw(gs,i);
		}
		gs.drawMessage(msg);

		var fin = true;
		for(var i = 0; i < 16 && fin == true; i+=2){
			if(cards[i].state != "found"){
				fin = false;
			}
		}

		if(fin == true){
			gs.drawMessage("You Win!!");
			window.clearInterval(intervalID);
		}
	};
	this.loop = function(){
		intervalID = window.setInterval(this.draw,16);
	};
	this.onClick = function(cardId){
		if(typeof cardId !== 'object'){
			if(sem){

				var voltear = function(){ 
					cards[cardId].flip();
					cards[markedCard].flip();
					markedCard = -1;
					msg = "Try again";
					sem = true;
				}

				if(cardId != markedCard && cards[cardId].state == "down"){
					sem = false;
					cards[cardId].flip();

					if(markedCard != -1){
						if(cards[cardId].comparteTo(cards[markedCard])){
							cards[cardId].found();
							cards[markedCard].found();
							msg = "Match found!!";
							markedCard = -1;
							sem = true;
						}else{
							setTimeout(voltear, 750);
						}
					}else{
						markedCard = cardId;
						sem = true;
					}
				}
			}else{
				console.log("evento bloqueado");
			}
		}

	};



	this.Card = function(sprite){
		this.sprite = sprite;
		this.state = "down";
	};

	this.Card.prototype.flip = function(){
		if(this.state == "up"){
			this.state = "down";
		}else if (this.state == "down"){
			this.state = "up";
		}
	};

	this.Card.prototype.found = function(){
		this.state = "found";
	};

	this.Card.prototype.comparteTo = function(otherCard){
		if(this.sprite == otherCard.sprite){
			return true;
		}
		return false;
	};

	this.Card.prototype.draw = function(gs, pos){
		if(this.state == "down"){
			gs.draw("back",pos);
		}else{
			gs.draw(this.sprite,pos);
		}
	};

};