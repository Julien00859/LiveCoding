var log
function main() {
    document.getElementById("cursor").style.borderColor = "white";
    setInterval(blinkCursor, 500);

    /*var socket = io.connect('http://Julien00859.no-ip.org:8080');
    socket.on("write", write(ypos, xpos, text));
    socket.on("erase", erase(ypos, xpos, length));
    socket.on("cursor", cursor(ypos, xpos));
    socket.on("setCoder", setCoder(coder, link));
    socket.on("setProject", setProject(project, link));
    socket.on("setDesc", setDesc(desc));
    socket.on("setFile", setFile(file));
    */
    log = new Julien.log();
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
    if (text.indexOf("\n") == -1) {
        lines[ypos].textContent = line.substring(0, xpos) + text + line.substring(xpos, line.length);
    } else {
        line = line.substring(0, xpos) + text + line.substring(xpos, line.length);
        line = line.split("\n");
        lines[ypos].textContent = line[0];
        for (var n=1; n < line.length; n++) {
            var DOMCode = document.createElement("p");
            var DOMLine = document.createElement("p");
            var DOMTextCode = document.createTextNode(line[n] ? line[n] : " "); // Attention ! C'est un &nbsp; !!!
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

        if (code[n].textContent.length > 1 && code[n].textContent[0] === " "){
            code[n].textContent = code[n].textContent.slice(1, code[n].textContent.length)
        } else if (code[n].textContent.length > 1 && code[n].textContent[code[n].textContent.length-1] === " ") {
            code[n].textContent = code[n].textContent.slice(0, code[n].textContent.length-1)
        }
    }
}

function erase(ypos, xpos, length) {
    var code = document.getElementById("code").getElementsByTagName("p");
    var line = document.getElementById("line").getElementsByTagName("p");
    while(xpos + length > code[ypos].textContent.length) {
        code[ypos].textContent = code[ypos].textContent + code[ypos+1].textContent;
        code[ypos+1].parentNode.removeChild(code[ypos+1]);
        code[ypos+1].parentNode.removeChild(line[ypos+1]);
    }
    code[ypos].textContent = code[ypos].textContent.substring(0, xpos) + code[ypos].textContent.substring(xpos+length, code[ypos].textContent.length);
    if(!code[ypos].textContent) {
        code[ypos].innerHTML = "&nbsp;"
    }


    for (var n=0, lines=document.getElementById("line").getElementsByTagName("p"), code=document.getElementById("code").getElementsByTagName("p"); n<code.length; n++) {
        lines[n].innerHTML = (n+1).toString().fill("&nbsp;", (lines.length-1).toString().length);
        lines[n].style.height = code[n].offsetHeight + "px";
        if (code[n].textContent.length > 1 && code[n].textContent[0] === " "){
            code[n].textContent = code[n].textContent.slice(1, code[n].textContent.length)
        } else if (code[n].textContent.length > 1 && code[n].textContent[code[n].textContent.length-1] === " ") {
            code[n].textContent = code[n].textContent.slice(0, code[n].textContent.length-1)
        }
    }
}

function cursor(ypos, xpos) {
    document.getElementById("cursor").parentNode.removeChild(document.getElementById("cursor"));
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
