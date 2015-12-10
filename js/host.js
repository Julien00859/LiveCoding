var socket;

function main() {
	activate(newLine());
	socket = io.connect();
	socket.emit("clientType", "host");
}

// Crée une nouvelle ligne de code
function newLine(ypos) {
	var dLine = document.getElementById("line");
	var lines = dLine.getElementsByTagName("p");

	if (ypos === undefined) ypos = lines.length; // Si la ligne n'a pas été donnée, on ajoute la nouvelle ligne à la fin

	// Ajoute une ligne de code avec la gestion événementielle et les attributs
	var dCode = document.getElementById("code");
	var lCode = dCode.getElementsByTagName("p");
	var pCode = document.createElement("p");
	pCode.setAttribute("contenteditable", "true");
	pCode.addEventListener("focus", function(e) {
		if (e.isTrusted) {
			var ypos = document.getElementById("code").getElementsByTagName("p").toArray().indexOf(e.target)
			activate(ypos);
			socket.emit("cursor", ypos, window.getSelection().anchorOffset);
		}
	});
	pCode.addEventListener("blur", function(e) {
		if (e.isTrusted) activate(null, null);
	});
	pCode.addEventListener("keypress", keyPressed);

	// Positionne la ligne de code
	if (ypos < lCode.length) {
		dCode.insertBefore(pCode, lCode[ypos]);
	} else {
		dCode.appendChild(pCode);
	}

	// Ajoute un numéro de ligne, met à jour tous les numéros de ligne et la taille total
	dLine.appendChild(document.createElement("p"));
	updateLine();
	resetWidth();
	return ypos;
}

// Supprime une ligne de code donnée
function removeLine(ypos) {
	var dLine = document.getElementById("line");
	var lines = dLine.getElementsByTagName("p");
	var dCode = document.getElementById("code");
	var lCode = dCode.getElementsByTagName("p");
	if (ypos >= 0 && ypos < lines.length) {
		dLine.removeChild(lines[ypos]);
		dCode.removeChild(lCode[ypos]);
		updateLine(); // Met à jour les numéro de ligne et leur taille
		resetWidth(); // Met à jour la taille de la zone code
	}
}

// Active la ligne donnée et place le curseur à la position donnée
function activate(ypos, xpos) {
	var lCode = document.getElementById("code").getElementsByTagName("p");
	var lines = document.getElementById("line").getElementsByTagName("p");
	for (var i = 0; i < lines.length; i++) {
		if (i === ypos) {
			//Positionne le curseur
			if(xpos) {
				var sel = window.getSelection();
				var range = document.createRange();
				range.setStart(lCode[i].firstChild, xpos);
				range.collapse();
				sel.removeAllRanges();
				sel.addRange(range);
			}
			// Active la ligne
			lCode[i].className = "active";
			lines[i].className = "active";
			lCode[i].dispatchEvent(new Event("focus", {"bubbles":true}));

		} else if (lCode[i].className === "active" || lines[i].className === "active") {
			// Désactive la ligne
			lCode[i].removeAttribute("class");
			lines[i].removeAttribute("class");
		}
	}
	return lCode[ypos];
}

// Recalcule la longueure de la zone code en fonction de la zone ligne pour que ligne + code ~= 100%
function resetWidth() {
	document.getElementById("code").style.width = "calc(100% - " + document.getElementById("line").offsetWidth + "px - 10px)";
}

// Met à jour le numéro des lignes
function updateLine() {
	for (var i = 0, lines = document.getElementById("line").getElementsByTagName("p"); i < lines.length; i++) {
		lines[i].innerHTML = (i+1).toString().fill(" ", lines[lines.length - 1].textContent.length).replaceAll(" ", "&nbsp;");
	}
}

// Gestion de la touche qui vient d'être tapée dans la zone de texte.
function keyPressed(e) {
	var lines = document.getElementById("code").getElementsByTagName("p")
	var ypos = lines.toArray().indexOf(e.target);
	var xpos = getSelection().anchorOffset;
	// console.log("ypos: " + ypos + ", xpos: " + xpos + ", char: " + e.key + " (" + e.code + ")");
	if (e.key === "Enter") {
		activate(newLine(ypos + 1), 0);
		lines[ypos+1].textContent = lines[ypos].textContent.slice(xpos, lines[ypos].textContent.length);
		lines[ypos].textContent = lines[ypos].textContent.slice(0, xpos);
		e.preventDefault();
		socket.emit("write", ypos, xpos, "\n")

	} else if (e.code === "Backspace" || e.code === "Delete") {
		if (e.target.textContent.length) socket.emit("erase", ypos, e.keyCode === 8 ? xpos - 1 : xpos, 1);
		else if (lines.length > 1){
			socket.emit("eraseLine", ypos);
			activate(ypos-1, lines[ypos-1].textContent.length);
			document.getElementById("code").removeChild(e.target);
			document.getElementById("line").removeChild(document.getElementById("line").getElementsByTagName("p")[ypos]);
		}

	} else if (e.code === "Tab") {
		e.target.textContent = e.target.textContent.slice(0, xpos) + "    " + e.target.textContent.slice(xpos, e.target.textContent.length);
		var sel = window.getSelection();
		var range = document.createRange();
		range.setStart(e.target.firstChild, xpos+4);
		range.collapse();
		sel.removeAllRanges();
		sel.addRange(range);
		socket.emit("write", ypos, xpos, "\t")
		e.preventDefault();

	} else if (e.code.slice(0,5) == "Arrow") {
		switch (e.code.slice(5)) {
			case "Left":
				if(xpos === 0 && ypos > 0) {
					e.preventDefault;
					activate(ypos-1, lines[ypos-1].textContent.length);
					socket.emit("cursor", ypos-1, lines[ypos-1].textContent.length);
				} else if (xpos > 0) {
					socket.emit("cursor", ypos, xpos-1)
				}
				break;

			case "Right":
				if(xpos === lines[ypos].textContent.length && ypos < lines.length - 1) {
					e.preventDefault;
					activate(ypos+1, 0);
					socket.emit("cursor", ypos+1, 0);
				} else if (xpos < lines[ypos].textContent.length) {
					socket.emit("cursor", ypos, xpos+1)
				}
				break;

			case "Up":
				if (ypos > 0) {
					activate(ypos-1, xpos <= lines[ypos-1].textContent.length ? xpos : lines[ypos-1].textContent.length);
					socket.emit("cursor", ypos-1, xpos <= lines[ypos-1].textContent.length ? xpos : lines[ypos-1].textContent.length);
				}
				break;

			case "Down":
				if (ypos < lines.length - 1) {
					activate(ypos+1, xpos <= lines[ypos+1].textContent.length ? xpos : lines[ypos+1].textContent.length);
					socket.emit("cursor", ypos+1, xpos <= lines[ypos-1].textContent.length ? xpos : lines[ypos-1].textContent.length);
				}
				break;
		}

	} else { // any other key
		socket.emit("write", ypos, xpos, e.key);
		socket.emit("cursor", ypos, xpos+1);
	}
}
