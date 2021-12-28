import generateState from "./game.js";

const tx = document.querySelector("textarea");

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

document.querySelector("#btn1").addEventListener("click", () => handleCmd(1));
document.querySelector("#btn2").addEventListener("click", () => handleCmd(2));
document.querySelector("#btn3").addEventListener("click", () => handleCmd(3));
document.querySelector("#btn4").addEventListener("click", () => handleCmd(4));

let hold = [false, false, false, false, false];

function handleKeydown(e){
	if(e.code === "Digit1"){ if(!hold[1]) handleCmd(1); hold[1] = true; }
	if(e.code === "Digit2"){ if(!hold[2]) handleCmd(2); hold[2] = true; }
	if(e.code === "Digit3"){ if(!hold[3]) handleCmd(3); hold[3] = true; }
	if(e.code === "Digit4"){ if(!hold[4]) handleCmd(4); hold[4] = true; }
}

function handleKeyup(e){
	if(e.code === "Digit1") hold[1] = false;
	if(e.code === "Digit2") hold[2] = false;
	if(e.code === "Digit3") hold[3] = false;
	if(e.code === "Digit4") hold[4] = false;
}

function print(msg){
	tx.innerHTML += msg;
	tx.scrollTop = tx.scrollHeight;
}

function println(msg){ print((tx.innerHTML === "" ? "" : "\n") + msg); }

const state = generateState();
let options = 1;
handleCmd();

function handleCmd(n){
	if(n > options) return;
	if(n) println(n);
	
	const next = state.next(n).value;
	options = next.length - 1;
	println(next[0]);
	for(let i = 1; i < next.length; ++i)
		println(i + ") " + next[i]);
	
	document.querySelector("#btn1").disabled = options < 1;
	document.querySelector("#btn2").disabled = options < 2;
	document.querySelector("#btn3").disabled = options < 3;
	document.querySelector("#btn4").disabled = options < 4;
}