var workingLine;
var log

function main() {
  newLine();
  log = new Julien.log();
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
    activate(document.getElementById("code").getElementsByTagName("p").toArray().indexOf(e.path[0]));
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
      //lCode[i].focus();
    } else if (lCode[i].className === "active" || lines[i].className === "active") {
      lCode[i].removeAttribute("class");
      lines[i].removeAttribute("class");
    }
  }
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
  console.log(e);
  var ypos = document.getElementById("code").getElementsByTagName("p").toArray().indexOf(e.path[0]);
  if (e.keyCode === 13) {
    activate(newLine(ypos+1));

  } else {
    var bef = e.path[0].textContent;
    setTimeout(function(){
      var aft = e.path[0].textContent;
      for(var i = 0; i < (aft.length > bef.length ? aft.length : bef.length); i++) {
        if (bef[i] !== aft[i]) {
          log.write("Position: " + i + " Charactère: " + e.keyCode);
          log.write(e.path[0].innerHTML)
        }
      }
    }, 1);
  }
}
