function main() {
    document.getElementById("curseur").style.borderColor = "cornflowerblue";
    document.getElementsByTagName("main")[0].style.backgroundColor = "rgb(40, 44, 52)";
    setInterval(blinkCursor, 500);
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

function write(text, ypos, xpos) {
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

function cursor(xpos, ypos) {
    document.getElementById("curseur").parentNode.removeChild(document.getElementById("curseur"));
    document.getElementById("current").removeAttribute("id")
    var line = document.getElementById("code").getElementsByTagName("code")[ypos];
    line.innerHTML = line.textContent.substring(0, xpos) + "<span id=curseur></span>" + line.textContent.substring(xpos, line.length);
    line.parentNode.setAttribute("id", "current");
}
