var log;
var socket;

function main() {
	newLine();
	log = new Julien.log();
	socket = io.connect();
	socket.on("write", write(ypos, xpos, text));
	socket.on("erase", erase(ypos, xpos, length));
	socket.on("cursor", cursor(ypos, xpos));
	socket.on("setCoder", setCoder(coder, link));
	socket.on("setProject", setProject(project, link));
	socket.on("setDesc", setDesc(desc));
	socket.on("setFile", setFile(file));

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
	var ypos = document.getElementById("code").getElementsByTagName("p").toArray().indexOf(e.target);
	var bef = e.target.textContent;
	setTimeout(function() {
		var aft = e.target.textContent;
		for(var i = 0; i < (aft.length > bef.length ? aft.length : bef.length); i++) {
			if (bef[i] !== aft[i]) {
				// log.write("Position: " + i + " Charactère: " + e.keyCode);
			}
		}
		if (e.keyCode === 13) {
			var nextLine = activate(newLine(ypos+1));
			var br = e.target.innerHTML.split("<br>");
			if (br.length > 1) {
				// Gecko
				e.target.innerHTML = br[0];
				nextLine.innerHTML = br[1];
			} else {
				// V8
				nextLine.textContent = e.target.getElementsByTagName("div")[0].textContent;
				e.target.removeChild(e.target.getElementsByTagName("div")[0]);
			}
		}
	}, 1);
}
