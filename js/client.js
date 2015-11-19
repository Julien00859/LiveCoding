var log;
var socket;

function main() {
	document.getElementById("cursor").style.borderColor = "white";
	setInterval(blinkCursor, 500);

	socket = io.connect();
	socket.emit("clientType", "client");
	socket.on("write", write);
	socket.on("erase", erase);
	socket.on("cursor", cursor);
	socket.on("setCoder", function(coder, linke){setCoder(coder, link)});
	socket.on("setProject", function(project, link){setProject(project, link)});
	socket.on("setDesc", function(desc){setDesc(desc)});
	socket.on("setFile", function(file){setFile(file)});

	log = new Julien.log();
	document.getElementById("code").style.width = "calc(100% - (2 *" + document.getElementById("line").offsetWidth + "px))";
}

function blinkCursor() {
	var cursor = document.getElementById("cursor")
	var activeLine = document.getElementById("code").getElementsByClassName("active")[0]
	if (cursor) {
		if (cursor.style.borderColor == "white") {
			cursor.style.borderColor = "black";
		} else {
			cursor.style.borderColor = "white";
		}
	}
}

function write(ypos, xpos, text) {
	var lines = document.getElementById("code").getElementsByTagName("p");
	var line = lines[ypos].textContent;

	if (text.indexOf("\n") === -1) {
		lines[ypos].textContent = line.substring(0, xpos) + text + line.substring(xpos, line.length);
	} else {
		line = line.substring(0, xpos) + text + line.substring(xpos, line.length);
		line = line.split("\n")

		lines[ypos].textContent = line[0];
		for (var n=1; n < line.length; n++) {
			var DOMCode = document.createElement("p");
			var DOMLine = document.createElement("p");
			var DOMTextCode = document.createTextNode(line[n]);
			var DOMTextLine = document.createTextNode((ypos + n).toString());
			DOMCode.appendChild(DOMTextCode);
			DOMLine.appendChild(DOMTextLine);
			document.getElementById("code").insertBefore(DOMCode, document.getElementById("code").getElementsByTagName("p")[ypos+n]);
			document.getElementById("line").insertBefore(DOMLine, document.getElementById("line").getElementsByTagName("p")[ypos+n]);
		}
	}
	document.getElementById("code").style.width = "calc(100% - (2 *" + document.getElementById("line").offsetWidth + "px))";
	for (var n=0, lines=document.getElementById("line").getElementsByTagName("p"), code=document.getElementById("code").getElementsByTagName("p"); n<lines.length; n++) {
		lines[n].innerHTML = (n+1).toString().fill("&nbsp;", (lines.length-1).toString().length);
		lines[n].style.height = code[n].offsetHeight + "px";
	}
}

function erase(ypos, xpos, length) {
	var code = document.getElementById("code").getElementsByTagName("p");
	var line = document.getElementById("line").getElementsByTagName("p");
	console.log(xpos);
	console.log(length);
	console.log(code[ypos].textContent.length)
	while(xpos + length > code[ypos].textContent.length) {
		code[ypos].textContent = code[ypos].textContent + code[ypos+1].textContent;
		code[ypos+1].parentNode.removeChild(code[ypos+1]);
		line[ypos+1].parentNode.removeChild(line[ypos+1]);
	}
	code[ypos].textContent = code[ypos].textContent.substring(0, xpos) + code[ypos].textContent.substring(xpos+length, code[ypos].textContent.length);

	for (var n=0, lines=document.getElementById("line").getElementsByTagName("p"), code=document.getElementById("code").getElementsByTagName("p"); n<code.length; n++) {
		lines[n].innerHTML = (n+1).toString().fill("&nbsp;", (lines.length-1).toString().length);
		lines[n].style.height = code[n].offsetHeight + "px";
	}
}

function eraseLine(ypos) {
	document.getElementById("code").removeChild(document.getElementById("code").getElementsByTagName("p")[ypos]);
	document.getElementById("line").removeChild(document.getElementById("line").getElementsByTagName("p")[0]);
	for (var n=0, lines=document.getElementById("line").getElementsByTagName("p"), code=document.getElementById("code").getElementsByTagName("p"); n<code.length; n++) {
		lines[n].innerHTML = (n+1).toString().fill("&nbsp;", (lines.length-1).toString().length);
		lines[n].style.height = code[n].offsetHeight + "px";
	}
}

function cursor(ypos, xpos) {
	var cursor = document.getElementById("cursor");
	if(cursor) cursor.parentNode.removeChild(document.getElementById("cursor"));
	var code = document.getElementById("code").getElementsByTagName("p");
	var line = document.getElementById("line").getElementsByTagName("p");

	for(var i = 0; i < code.length; i++) {
		if (code[i].hasAttribute("class") && code[i].className === "active") {
			code[i].className = "";
			line[i].className = "";
			break;
		}
	}

	code[ypos].innerHTML = code[ypos].textContent.substring(0, xpos) + "<span id=cursor></span>" + code[ypos].textContent.substring(xpos, code[ypos].length);
	code[ypos].setAttribute("class", "active");
	line[ypos].setAttribute("class", "active");
}

function setCoder(coder, link) {
	var coderDOM = document.getElementById("coder");
	coderDOM.setAttribute("a", link);
	coderDOM.textContent = coder;
}

function setProject(project, link) {
	var projectDOM = document.getElementById("project");
	projectDOM.setAttribute("a", link);
	projectDOM.textContent = project;
}

function setDesc(desc) {
	document.getElementById("desc").textContent = desc;
}

function setFile(file) {
	document.getElementById("file").textContent = file;
}

function show(line) {
	console.log(document.getElementById("code").getElementsByTagName("p")[line].innerHTML)
}
