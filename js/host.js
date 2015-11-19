var log;
var socket;

function main() {
	newLine();
	log = new Julien.log();
	socket = io.connect();
	socket.emit("clientType", "host");
}

function removeLine(ypos) {
	var dLine = document.getElementById("line");
	var lines = dLine.getElementsByTagName("p");
	var dCode = document.getElementById("code");
	var lCode = dCode.getElementsByTagName("p");
	if (ypos >= 0 && ypos < lines.length) {
		dLine.removeChild(lines[ypos]);
		dCode.removeChild(lCode[ypos]);
		updateLine();
	}
}

function newLine(ypos) {
	var dLine = document.getElementById("line");
	var lines = dLine.getElementsByTagName("p");

	if (ypos === undefined) {
		ypos = lines.length;
	}

	var pLine = document.createElement("p");
	pLine.textContent = lines.length + 1;
	dLine.appendChild(pLine);

	var dCode = document.getElementById("code");
	var lCode = dCode.getElementsByTagName("p");
	var pCode = document.createElement("p");
	pCode.setAttribute("contenteditable", "true");
	pCode.addEventListener("focus", function(e) {
		activate(document.getElementById("code").getElementsByTagName("p").toArray().indexOf(e.target));
	});
	pCode.addEventListener("blur", function() {
		activate(-1);
	});
	pCode.addEventListener("keydown", keyPressed);

	if (ypos < lCode.length) {
		dCode.insertBefore(pCode, lCode[ypos]);
	} else {
		dCode.appendChild(pCode);
	}
	updateLine();
	resetWidth();
	return ypos;
}

function activate(ypos) {
	var lCode = document.getElementById("code").getElementsByTagName("p");
	var lines = document.getElementById("line").getElementsByTagName("p");
	for (var i = 0; i < lines.length; i++) {
		if (i === ypos) {
			lCode[i].className = "active";
			lines[i].className = "active";
			lCode[i].focus();
		} else if (lCode[i].className === "active" || lines[i].className === "active") {
			lCode[i].removeAttribute("class");
			lines[i].removeAttribute("class");
		}
	}
	return lCode[ypos];
}

function resetWidth() {
	document.getElementById("code").style.width = "calc(100% - " + document.getElementById("line").offsetWidth + "px - 10px)";
}

function updateLine() {
		for (var i = 0, lines = document.getElementById("line").getElementsByTagName("p"); i < lines.length; i++) {
			lines[i].innerHTML = (i+1).toString().fill(" ", lines[lines.length - 1].textContent.length).replaceAll(" ", "&nbsp;");
		}
}

function keyPressed(e) {
	var lines = document.getElementById("code").getElementsByTagName("p")
	var ypos = lines.toArray().indexOf(e.target);
	var xpos = getSelection().anchorOffset;
	if (e.keyCode === 13 || e.keyCode === 10) { // new line
		activate(newLine(ypos + 1));
		lines[ypos+1].textContent = lines[ypos].textContent.slice(xpos);
		lines[ypos].textContent = lines[ypos].textContent.slice(-xpos);
		e.stopPropagation();
		e.preventDefault();
		socket.emit("write", ypos, xpos, "\n")
	} else if (e.keyCode === 8) { // backspace
		socket.emit("erase", ypos, xpos-1, 1)
	} else if (e.keyCode === 9) { // tabulation
		socket.emit("write", ypos, xpos, "\t")
		e.stopPropagation();
		e.preventDefault();
	} else { // any other key
		socket.emit("write", ypos, xpos, e.shiftKey ? String.fromCharCode(e.keyCode).toUpperCase() : String.fromCharCode(e.keyCode).toLowerCase());
	}
}
