function main() {
    document.getElementById("curseur").style.borderColor = "cornflowerblue";
    document.getElementsByTagName("main")[0].style.backgroundColor = "rgb(40, 44, 52)";
    setInterval(blinkCursor, 500);

    var socket = io.connect('http://Julien00859.no-ip.org:8080');
    socket.on("write", write(ypos, xpos, text));
    socket.on("erase", erase(ypos, xpos, length));
    socket.on("cursor", cursor(ypos, xpos));
    socket.on("setCoder", setCoder(coder, link));
    socket.on("setProject", setProject(project, link));
    socket.on("setDesc", setDesc(desc));
    socket.on("setFile", setFile(file));

}

function blinkCursor() {
    if (document.getElementById("curseur")) {
        if (document.getElementById("curseur").style.borderColor == "cornflowerblue") {
            document.getElementById("curseur").style.borderColor = document.getElementsByTagName("main")[0].style.backgroundColor;
        } else {
            document.getElementById("curseur").style.borderColor = "cornflowerblue";
        }
    }
}

function write(ypos, xpos, text) {
    var lines = document.getElementById("code").getElementsByTagName("code");
    var line = lines[ypos].textContent;
    if (text.indexOf("\n") == -1) {
        lines[ypos].textContent = line.substring(0, xpos) + text + line.substring(xpos, line.length);
    } else {
        var here = document.getElementById("code").getElementsByTagName("p")[ypos+1];
        line = line.substring(0, xpos) + text + line.substring(xpos, line.length);
        line = line.split("\n");
        lines[ypos].textContent = line[0];
        for (var n=1; n < line.length; n++) {
            var p = document.createElement("p");
            p.innerHTML = "<p><span class=line>" + (ypos + n) +"</span><code>" + line[n] + "</code></p>";
            document.getElementById("code").insertBefore(p, here);
        }
    }
    for (var n=ypos, lines=document.getElementById("code").getElementsByClassName("line"); n<lines.length; n++) {
        lines[n].textContent = n+1;
    }
}

function erase(ypos, xpos, length) {
    var lines = document.getElementById("code").getElementsByTagName("code")
    while(xpos + length > lines[ypos].textContent.length) {
        lines[ypos].textContent = lines[ypos].textContent + lines[ypos+1].textContent;
        lines[ypos+1].parentNode.parentNode.removeChild(lines[ypos+1].parentNode);
    }
    lines[ypos].textContent = lines[ypos].textContent.substring(0, xpos) + lines[ypos].textContent.substring(xpos+length, lines[ypos].textContent.length);
}

function cursor(xpos, ypos) {
    document.getElementById("curseur").parentNode.removeChild(document.getElementById("curseur"));
    document.getElementById("current").removeAttribute("id")
    var line = document.getElementById("code").getElementsByTagName("code")[ypos];
    line.innerHTML = line.textContent.substring(0, xpos) + "<span id=curseur></span>" + line.textContent.substring(xpos, line.length);
    line.parentNode.setAttribute("id", "current");
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
