export default function*(){
	let funds = 50;
	let bet = 1;
	let deck = [];
	let dealer = [];
	let hands = [];
	let stakes = [];
	
	while(funds > 0){
		let cmd = 0;
		while(cmd !== 1){
			const msg = "のこり：$" + (funds - bet) + "\nかけきん：$" + bet;
			cmd = yield [msg, "はじめる", "あげる", "さげる", "ぜんぶ"];
			if(cmd === 2) bet = Math.min(funds, bet + 1);
			if(cmd === 3) bet = Math.min(funds, (Math.max(1, bet - 1)));
			if(cmd === 4) bet = funds;
		}
		
		if (deck.length < 20) deck = shuffle();
		dealer = [deck.pop()];
		hands = [[deck.pop(), deck.pop()]];
		stakes = [bet];
		funds -= bet;
		
		for(let i = 0; i < hands.length; ++i){
			while(true){
				const msg = (hands.length === 1 ? "てふだ：" : "てふだその" + (i + 1) + "；") + toStr(hands[i]);
				if(weight(hands[i]) > 21){
						yield [msg + "\n21をこえてしまった！", "おおっと"];
						hands.splice(i, 1);
						stakes.splice(i, 1);
						break;
				}
					
				const ret = ["ディーラー：" + toStr(dealer) + "\n" + msg, "このまま"];
				if(weight(hands[i]) !== 21) ret.push("もう1まい");
				if(weight(hands[i]) !== 21 && funds >= bet && hands[i].length === 2) ret.push("ダブル");
				if(funds >= bet && hands[i].length === 2 && cardValue(hands[i][0]) === cardValue(hands[i][1]))
					ret.push("スプリット");
				let cmd = yield ret;
				
				if(cmd === 1) break;				
				if(cmd === 2) hands[i].push(deck.pop());
				if(cmd === 3){
					funds -= bet;
					stakes[i] += bet;
					hands[i].push(deck.pop());
					break;
				}
				if(cmd === 4){
					funds -= bet;
					stakes.splice(i + 1, 0, bet);
					hands.splice(i + 1, 0, [hands[i].pop()]);
					hands[i].push(deck.pop());
					hands[i + 1].push(deck.pop());
				}
			}
		}
		
		for(let i = 0; i < hands.length; ++i){
			while(weight(dealer) < 17) dealer.push(deck.pop());
			let msg = "ディーラー：" + toStr(dealer) + "\nてふだ：" + toStr(hands[i]);
			
			if(isBlackjack(hands[i])){
				if(isBlackjack(dealer)){
					funds += stakes[i];
					yield [msg + "\nりょうほうブラックジャックでひきわけ", "むむむ"];
				}
				else{
					funds += stakes[i] * 2.5;
					yield [msg + "\nブラックジャックで2.5ばいのはいとう！", "やったあ(n・p・)n"];
				}
				continue;
			}
			
			if(weight(hands[i]) > weight(dealer) || weight(dealer) > 21){
				funds += stakes[i] * 2;
				yield [msg + "\nかちです", "わーい"];
			}
			else if(weight(hands[i]) === weight(dealer)){
				funds += stakes[i];
				yield [msg + "\nひきわけ", "つづける"];
			}
			else {yield [msg + "\nまけ", "しくしく"];}
		}
	}
	
	return ["( ・  p  ・)←有り金全部溶かした人の顔"];
}

function toStr(hand){
	const rank = card => ["A","2","3","4","5","6","7","8","9","10","J","Q","K"][card / 4 | 0];
	const suit = card => ["♠︎","❤︎","♦︎","♣︎"][card % 4];
	const ctos = card => rank(card) + suit(card);
	
	return hand.map(ctos).reduce((a, b) => a + " " + b) + " (" + weight(hand) + ")";
}

function shuffle(){
	const deck = Array(52).fill(0).map((v, i) => i);
	for(let i = deck.length - 1; i > 0; --i){
		let j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
}

function weight(hand){
	const subtotal = hand.map(cardValue).reduce((a, b) => a + b);
	if(subtotal <= 11 && hand.map(cardValue).filter(v => v === 1).length > 0)
		return subtotal + 10;
	return subtotal;
}

function cardValue(card){
	return Math.min((card / 4 | 0) + 1, 10);
}

function isBlackjack(hand){
	return weight(hand) === 21 && hand.length === 2;
}