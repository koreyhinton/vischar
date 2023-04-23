// todo: change name from OMSET,
// the behavior had to change to store more than 1 of a particular char.
window.OMSet = class {//Order Matters
    constructor() {
        this.set = new Set();
        this.orderArr = [];
    }
    has(el) { 
        return this.set.has(el);
    }
    add(el) {
        if (this.has(el)) return;
        this.orderArr.push(el);
        this.set.add(el);
    }
    _add(el) {
        //todo: set doesn't make sense for sequences, change data structure
        this.orderArr.push(el);
        if (!this.has(el)) this.set.add(el);
    }
    delete(el) {
        if (!this.has(el)) return;
        this.orderArr.splice(this.orderArr.indexOf(el), 1);
        this.set.delete(el);
    }
    order() {
        var html = "";
        for (var i=0; i<this.orderArr.length; i++) {
            var n = this.orderArr[i];
            if (i>0)html+="&nbsp;";
            let enc = "&#" + n + ";";
            if (n==13) enc = "\\r";
            if (n==10) enc = "\\n";
            html += enc;
        }
        return html;
    }
}
window.gTab = 1;
window.gDemoText = {
    "1": ()=>{return window.gDemoText1;},
    "2": ()=>{return window.gDemoText2;},
};
window.gSelN = new OMSet();
window.gRepN = new OMSet();
window.gSelSpec = "each";
function getwidth(s) {
    let max = 0;
    let j = 0;
    for (var i=0; i<s.length; i++) {
        j += 1;
        var c = s.charAt(i);
        var n = c.charCodeAt(0);

        if (n==13) { // \r
            i += 1;
            j += 1;
            max = Math.max(max, j+1);
            j = 0;
        }
        if (n == 10) { // \n
            max = Math.max(max, j+1);
            j = 0;
        }
    }
    return max;
}

function maketd(count) {
    var html = "";
    for (var i=0; i<count; i++) {
        html += "<td style='background-color:white;'>&nbsp</td>";
    }
    return html;
}

function toggleSelSpec() {
    let tabIdx = parseInt(document.
                            getElementsByClassName("tabtrue-")[0]
                            .getAttribute("id")
                            .replace("tab",""));
    if (window./*gSelSpec*/gTbData[tabIdx].selStrat == "each") {
        window./*gSelSpec*/gTbData[tabIdx].selStrat = "sequence";
    } else { window./*gSelSpec*/gTbData[tabIdx].selStrat = "each"; }
    // TODO: change vischar display for when its sequence
    return window./*gSelSpec*/gTbData[tabIdx].selStrat;
}

function color(n, greenCond=false) {
    if (greenCond) return "#03F934";
    return (n>225) ? "red" : "lightblue";
}

function select(elOrId) {
    let el = elOrId;
    if (typeof elOrId === 'string') {
        el = document.querySelector("#"+elOrId);
    } // end type check
    else { // element
        document.querySelector("#custom").click();
    } // end else el cond

    let tabIdx = parseInt(document.
                            getElementsByClassName("tabtrue-")[0]
                            .getAttribute("id")
                            .replace("tab",""));

    let cs = el.id.charAt(0)=='a' ? el.id.substring(0,3) : el.id.substring(0,2);
    //console.log(el.id);
    let set = cs=='acs' ? window.gRepN : window.gSelN;

    let n = parseInt(el.id.replace(cs, ""));
    //console.log(n);
    /*let selected = set.has(n);
    if (selected) set.delete(n);
    else */set._add(n);//console.log(cs+n+"");
    document.getElementById(cs+n+"").style.backgroundColor = color(n, true/*!selected*/);
    if (cs == 'acs') {
        document.getElementById("acs-seq").innerHTML = set.order() + ' (sequence)';
        if (typeof elOrId !== 'string') {
            window.gTbData[tabIdx].rplNums.push(n);
        } // end acs type check
        return;
    }
    if (typeof elOrId !== 'string') {
        window.gTbData[tabIdx].selNums.push(n);
    } // end cs type check

    document.getElementById("cs-any").innerHTML = set.order() + ' (<button onclick="(function(){this.innerHTML=toggleSelSpec();tbRender(\'tab\')})()">'+window./*gSelSpec*/gTbData[tabIdx].selStrat+'</button>)';
    // var els = document.getElementsByClassName("vis"+n);
    // for (var i=0; i<els.length; i++) {
    //     els[i].style.backgroundColor = color(n, true/*!selected*/);
    // }

    if (typeof elOrId !== 'string') {
        // only do a full visualization update if the user triggered a click
        window.vsUpdate();
    }
}

function buildChar(n,cs) {
    let enc = "&#"+n+";";
    if (n==13) enc = "&bsol;r";
    if (n==10) enc = "&bsol;n";
    return "<td onclick='select(this)' id='"+(cs+n)+"' style='background-color: "+color(n)+"'>" + enc +"</td>";
}

window.addEventListener('DOMContentLoaded', (e) => {
    window.chBuildAll(); //buildAllCharSet();
    window.gTbData.push({
        name: "Unicode Delete Demo",
        text: window.gDemoText[1](),
        type: "unicode -> &empty;",
        selNums: (function(){
            let a=[]; for (var i=256; i<8986; i++){a.push(i);} return a;
        })(),
        selStrat: "each",
        rplNums: [],
        action: "replace",
        start: 0,
        end: 1817
    });
    window.gTbData.push({
        name: "Sql Enquote Enlist Demo",
        text: window.gDemoText[2](),
        type: "",
        selNums: [10],
        selStrat: "sequence",
        rplNums: [39,44,10,39],
        action: "replace",
        start: 37,
        end: 80
    });
    window.gTbData.push({
        name: "Quote Demo",
        text: `"My dear Frankenstein," exclaimed he, "how glad I am to see you! How fortunate that you should be here at the very moment of my alighting!"`,
        type: "",
        selNums: [34],
        selStrat: "each",
        rplNums: [8220,8221],
        action: "alternating_char_replace",
        start: 0,
        end: 138
    });
    // console.log(window.gDemoText[window.gTab]());
    window.tbRender(window.gTbData[0].selNums, window.gTbData[0].selStrat, window.gTbData[0].rplNums, window.gTbData[0].action);


});

window.keydown = function(e) {
    e = e || window.event;
    if (e.ctrlKey && e.key == 'v') {
        navigator.clipboard
            .readText()
            .then((clipText) => {window.gPaste = clipText;document.getElementById("clen").innerHTML = window.gPaste.length+"";});
    } // end ctrl-v cond
}; // end key down func

window.createTab = function(btn) {
    btn.parentElement.close();
    let name = [...btn.parentElement.children].filter(el => el.tagName.toLowerCase() == 'input')[0].value;
    window.gTbData.push({name: name, text: window.gPaste, selNums:[],
        selStrat: "each", rplNums:[], action: "replace", start: 0,
        end: window.gPaste.length-1
    });
    let newTab = document.createElement("button");
    newTab.setAttribute('id', "tab"+(window.gTbData.length-1));
    newTab.setAttribute('class', "tabfalse-");
    newTab.setAttribute('onclick', "cssToggle(this);tbRender('tab')");
    newTab.innerHTML = name;
    document.getElementById("tabs").appendChild(newTab);
    //window.gTbData[window.gTbData.length-1].name = ;
    //console.log([...btn.parentElement.children].filter(el => el.tagName == 'input')[0]);
}; // end create tab func

window.newTab = function() {
    document.onkeydown = window.keydown;
    var dia = document.createElement("dialog");
    let svgHead = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="210" height="210" viewBox="0,0,210,210">';
    dia.innerHTML = `******** Configure New Tab ********<br/><br/>Tab Name: <input type='text' value='New Tab'><br/><br/>Content length: <a id='clen'>0</a><br/><br/>`+svgHead+`<rect rx='10' ry='10' x='0' y='0' width='200' height='200' stroke='black' fill='transparent'></rect><text x='30' y='96'>Ctrl-V to paste text</text></svg><button onclick='createTab(this)'>close</button>`;
    document.body.prepend(dia);
    dia.show();
}; // end new tab func

window.copyToClipboard = function() {
    let tabIdx = parseInt(document.
                            getElementsByClassName("tabtrue-")[0]
                            .getAttribute("id")
                            .replace("tab",""));
    navigator.clipboard.writeText(window.gTbData[tabIdx].text);
}; // end copy to clipboard func
