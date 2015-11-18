var Julien = {
	getElem: function(id) {
		return document.getElementById(id).innerHTML;
	},

	setElem: function(id, html) {
		document.getElementById(id).innerHTML = html;
	},

	addElem: function(id, html) {
		document.getElementById(id).innerHTML += html;
	},

	addFirst: function(list, chip) {
		if (typeof(list) === "string") {
			list = document.getElementById(list);
		}
		if (typeof(chip) === "string") {
			var li = document.createElement('li');
			var text = document.createTextNode(chip);
			li.appendChild(text);
			chip = li;
		}
		if (list.getElementsByTagName("li")) {
			list.insertBefore(chip, list.firstChild);
		} else {
			addLast(list, chip);
		}
	},

	addLast: function(list, chip) {
		if (typeof(list) === "string") {
			list = document.getElementById(list);
		}
		if (typeof(chip) === "string") {
			var li = document.createElement('li');
			var text = document.createTextNode(chip);
			li.appendChild(text);
			chip = li;
		}
		list.appendChild(chip);
	},

	setCSS: function(id, property, value) {
		document.getElementById(id).style[property] = value;
	},

	setClass: function(id, className) {
		document.getElementById(id).className = className;
	},

	log: function(id){
		this.write = function(text) {
			var p = document.createElement("p");
			p.appendChild(document.createTextNode(new Date().toLocaleTimeString() + " " + text));
			this.field.appendChild(p);
			console.log(text);
		}
		this.clear = function(text) {
			var a=this.field.getElementsByTagName("p").toArray();
			for (var i=0; i<a.length; i++) {
				this.field.removeChild(a[i]);
			}
		}
		this.enable = function() {
			this.field.removeAttribute("hidden");
		}
		this.disable = function() {
			this.field.setAttribute("hidden", true);
		}

		if (typeof(id) !== "undefined") {this.id = id} else {this.id = "log"}
		if (!document.getElementById(id)) {
			this.field = document.createElement("fieldset");
			this.field.setAttribute("id", this.id);
			this.field.className = "log";
			this.field.style.fontFamily = "Courier";
			var legend = document.createElement("legend");
			legend.appendChild(document.createTextNode(this.id));
					this.field.appendChild(legend);
			document.body.appendChild(this.field);
		}
	}
}

String.prototype.format = function(map) {
	var s = this
	if (map instanceof Array) {
		map.forEach(function(value){
			s = s.replace("{}", value);
		});
		return s;
	} else if (map instanceof Object) {
		for (var key in map) {
			s = s.replaceAll(("{" + key + "}").toUnicode(), map[key]);
		}
	}
	return s
}

String.prototype.replaceAll = function(searchValue, replaceValue) {
	return this.replace(new RegExp(searchValue, "g"), replaceValue);
}

String.prototype.toUnicode = function() {
	var s = "";
	for (var i=0; i < this.length; i++) {
		s += '\\u' + this.charCodeAt(i).toString(16).fill(4, "0");
	}
	return s;
}

String.prototype.fill = function(charToFill, numberOfDigit) {
	var s = this;
	if (typeof(charToFill) === "undefined") {charToFill = " "}
	while (s.length < numberOfDigit) {
		s = charToFill + s;
	}
	return s;
}

HTMLCollection.prototype.toArray = function() {
return Array.prototype.slice.call(this);
}
