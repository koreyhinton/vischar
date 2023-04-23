//function buildAllCharSet() {
window.chBuildAll = function() {
    let tds = "";
    for (var i=0; i</*149186*/8986; i++) {//emojis start at 8986
        tds += buildChar(i, 'acs');
    }
    let acs = document.getElementById("allcharset");
    acs.innerHTML = "<table class='cs'><tbody><tr>"+tds+"</tr></tbody></table>";
};

//function buildCharSet(text) {
window.chBuild = function(text) {
    let s = new Set();
    for (var i=0; i<text.length; i++) {
        var c = text.charAt(i);
        s.add(c);
    }
    let values = [...(s.values())].sort();
    let tds = "";
    for (var i=0; i<values.length; i++) {
        let n = values[i].charCodeAt(0);

        //let className = (n>225) ? "unicode" : "ascii";
        tds += buildChar(n, 'cs');
    }
    
    let cs = document.getElementById("charset");
    cs.innerHTML = "<table class='cs'><tbody><tr>"+tds+"</tr></tbody></table>";
};
