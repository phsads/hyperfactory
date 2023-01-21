function random(a,b) {
	return Math.random()*(b-a)+a
}
function intRandom(a,b) {
	return floor(random(a,b+1))
}
var round = Math.round, ceil = Math.ceil, floor = Math.floor
var min = Math.min, max = Math.max
var hypot = Math.hypot
function clamp(minN,maxN,t) {
	return min(max(t,minN),maxN)
}
function seedRandom(a) { //random function
    var r=[seed],h=0
    while (h<70) {
        h++
        r[h] = ( (a**1.1+seed**0.7-7*a+21)*r[h-1] )%1
    }
    return r[70]
}
function overflowRange(minN, maxN, n) {
	var size = maxN-minN+1
	if (n>maxN) return minN+(n-maxN)%size
	else if (n<minN) return maxN+(n-minN)%size
	else return n 
}
function weighted_random(a) {
	//a = {"2":weight}
	var b,c=0,d
	for (b of a) c += b
	d = Math.random()*c
	for (b in a) {
		if (d < a[b]) return b
		d -= a[b]
	}
}
function anti_weighted_random(a) {
        for (let n in a) {
                a[n] = 1/a[n]
        }
        return weighted_random(a)
}
function cloneObj(t) {
	var clone
	if (typeof t == "object") {
		if (t.toString()[0] == "[") clone = {}
		else clone = []
		for (let k in t) {
			if (k == "canvas") continue
			if (typeof t[k] == "object") clone[k] = cloneObj(t[k])
			else clone[k] = t[k]
		}
	} else {
		clone = t 
	}
	return clone
}
function fix(a) {
	return a.toFixed(2)
}
function copyObj(a,b) {
	//a: full object, b: partial object
	if (typeof a == "object" && typeof b == "object") {
		for (let k in a) {
			b[k] = copyObj(a[k],b[k])
		}
		return b
	} else if (typeof a == "object" && typeof b !== "object") {
		return a
	} else {
		if (b == undefined) return a
		else return b
	}
}
function log(x,base) {
	return Math.log(x)/Math.log(base)
}
var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }

//mous
var mouseDown = [0, 0, 0, 0, 0, 0, 0, 0, 0]
var click = Array(9).fill(0)
var clickBuffer = Array(9).fill(0)
document.body.onmousedown=function(evt){mouseDown[evt.button]=1}
document.body.onmouseup=function(evt){mouseDown[evt.button]=0}
var mousePos = [0, 0]
function getMousePos(e) {
	var t = canvas.getBoundingClientRect()
	mousePos = [floor((e.clientX - t.left)/40),floor((e.clientY - t.top)/40)]
	mX = mousePos[0], mY = mousePos[1]
	return mousePos
}
var mX = 0,mY = 0
var body = document.getElementById("body")
body.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }