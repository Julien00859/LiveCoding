function main() {
    document.getElementById("curseur").style.borderColor = "cornflowerblue";
    document.getElementsByTagName("main")[0].style.backgroundColor = "rgb(40, 44, 52)";
    setInterval(cursor, 500);
}

function cursor() {
    if (document.getElementById("curseur").style.borderColor == "cornflowerblue") {
        document.getElementById("curseur").style.borderColor = document.getElementsByTagName("main")[0].style.backgroundColor;
    } else {
        document.getElementById("curseur").style.borderColor = "cornflowerblue";
    }
}
