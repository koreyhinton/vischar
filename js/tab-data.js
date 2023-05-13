window.gTbData = [
    // {
    //     name: "Demo 1",
    //     text: "With halting steps.."
    //     type: "custom",
    //        //"&ldquo; &rdquo; -> \""
    //        //"\" -> "&ldquo; &rdquo;"
    //        //"\r\n -> ',\r\n'"
    //        //"'\r\n' -> \r\n"
    //        //\n -> ',\n'
    //        //',\n -> \n
    //        //unicode -> empty
    //     selNums: [8220, 8221],
    //     selStrat: "each", //"sequence"
    //     rplNums: [34],
    //     action: "replace",
    //         //"alternating_char_replace", "insert_before", "insert_after"
    //     start: 0,
    //     end: 1818
    // },
];

window.tbClearControls = function() {
    let tabIdx = parseInt(document.
                            getElementsByClassName("tabtrue-")[0]
                            .getAttribute("id")
                            .replace("tab",""));

    let setR = window.gRepN;
    let setS = window.gSelN;
    for (var i=0; i<8986; i++) {
        if (setS.has(i)) { if (document.getElementById("cs"+i)!=null)document.getElementById("cs"+i).style.backgroundColor = color(i, false);/*"lightblue";*/ } // select("cs"+i);  }
        if (setR.has(i)) { document.getElementById("acs"+i).style.backgroundColor = color(i, false); /*"lightblue";*/ } // select("acs"+i); }
    } // end for i
    setR.empty();//setR.orderArr = [];setR.set = new Set();document.getElementById("acs-seq").innerHTML = window.gRepN.order() + ' (sequence)';//todo: change from set to different structure
    setS.empty();//setS.orderArr = [];setS.set = new Set();document.getElementById("cs-any").innerHTML = setS.order() + ' (<button onclick="this.innerHTML=toggleSelSpec()">'+window./*gSelSpec*/gTbData[tabIdx].selStrat+'</button>)';//todo: change from set to different structure
};

window.tbRenderControls = function(tabIdx) {
    document.querySelector("#start").value = window.gTbData[tabIdx].start;
    document.querySelector("#end").value = window.gTbData[tabIdx].end;

    let selNums = window.gTbData[tabIdx].selNums;
    let rplNums = window.gTbData[tabIdx].rplNums;

    //let csAnyHtml = document.querySelector("#cs-any").innerHTML;
    //let csStrEnd = csAnyHtml.indexOf("<button")-2;
    //if (csStrEnd < 0) { csStrEnd = csAnyHtml.length; }
    //let csStr = csAnyHtml.substring(0, csStrEnd).replace(/&nbsp;/g,'');
    for (var i=0; i<selNums.length; i++) {
        let n = selNums[i];
        if (document.querySelector("#cs"+n) != null) {
            select("cs"+n);
            //if (csStr.indexOf(String.fromCharCode(10)) > -1) {
            //    //select("cs"+n);
            //}//extra click for ones already selected
        } // end not null (not in curr. char set) condition
    } // end for selNums

    for (var i=0; i<rplNums.length; i++) {
        let n = rplNums[i];
        select("acs"+n)/*
        if (!window.gRepN.has(n))        select("acs"+n);
        else { window.gRepN.add(n); document.getElementById("acs-seq").innerHTML = window.gRepN.order() + ' (sequence)'; }*/
    } // end for rplNums

    let selStrat = window.gTbData[tabIdx].selStrat;
    let action = window.gTbData[tabIdx].action;

    function xMatch(sel, rpl, strat, act, orderMatters = false) {
        let selStr = sel.join(" ");
        let selStrOrd = [...sel].sort().join(" ");
        let selNumStr = selNums.join(" ");
        let selNumStrOrd = [...selNums].sort().join(" ");
        let rplStr = rpl.join(" ");
        let rplNumStr = rplNums.join(" ");
        let selMatch = (orderMatters) ? selStr === selNumStr : selStrOrd === selNumStrOrd;
        if (strat == "sequence") orderMatters = true;
        return rplNums.length == rpl.length && rplStr === rplNumStr &&
            act === action && strat === selStrat &&
            selNums.length == sel.length && selMatch;
    }; // end transform match func

    if (xMatch([8220,8221], [34], "each", "replace")) { // &ldquo; &rdquo; -> "
        window.cssToggle(document.querySelector("#ascii_quo"));
    } // end ascii quo cond
    else if (xMatch([34], [8220,8221], "each", "alternating_char_replace")) { // " -> &ldquo; &rdquo;
        window.cssToggle(document.querySelector("#unc_quo"));
    } // end unc quo cond
    else if (xMatch([13,10],[39,44,13,10,39],"sequence","replace")) { // \r\n -> ',\r\n'
        window.cssToggle(document.querySelector("#win-enq-enl"));
    } // end win enquote enlist  cond
    else if (xMatch([39,44,13,10,39],[13,10],'sequence','replace')) { // ',\r\n' -> \r\n
        window.cssToggle(document.querySelector("#win-unq-del"));
    } // end win unquote delist cond
    else if (xMatch([10],[39,44,10,39],'sequence', 'replace')) { // \n -> ',\n'
        window.cssToggle(document.querySelector("#unx-enq-enl"));
    } //end unix enquote enlist cond
    else if (xMatch([39,44,10,39],[10],'sequence','replace')) { // ',\n' -> \n
        window.cssToggle(document.querySelector("#unx-unq-del"));
    } // end unx unquote delist cond
    else if (selNums.length == 8730 &&
        rplNums.length == 0 &&
        selStrat == "each" && action == "replace"
    ) { // unicode -> &empty;
            window.cssToggle(document.querySelector("#unc-empty"));
    } //end unicode empty cond
    else { // custom
        window.cssToggle(document.querySelector("#custom"));
    } // end else transform cond

    window.cssToggle(document.querySelector("#"+window.gTbData[tabIdx].action));

}; // end tab render controls func

window.tbUpdateSeq = function() {
    let tabIdx = parseInt(document.
                            getElementsByClassName("tabtrue-")[0]
                            .getAttribute("id")
                            .replace("tab",""));
    window.gTbData[tabIdx].selNums = window.gSelN.all();
    window.gTbData[tabIdx].rplNums = window.gRepN.all();
};

window.tbRender = function(sel, selStrat, rpl, action) {
    window.tbClearControls();
    document.getElementById("vis")?.parentElement.remove();
    // var text = window.gDemoText[window.gTab]();
    // console.log(text);
    // buildCharSet(text);
    let renderControls = false;
    let tabIdx = parseInt(document.
                            getElementsByClassName("tabtrue-")[0]
                            .getAttribute("id")
                            .replace("tab",""));
    document.getElementById('selStratBtn').innerHTML=window.gTbData[tabIdx].selStrat;
    if (sel != null) {
        if (sel != 'tab') {
            window.gTbData[tabIdx].selNums = sel;
            window.gTbData[tabIdx].selStrat = selStrat;
            window.gTbData[tabIdx].rplNums = rpl;
            window.gTbData[tabIdx].action = action;
            window.gTbData[tabIdx].start = 0;
            window.gTbData[tabIdx].end = window.gTbData[tabIdx].text.length<1?0:window.gTbData[tabIdx].text.length-1;
        } // end sel not 'tab' check
        renderControls = true;//window.tbRenderControls(tabIdx);
    } // end sel not null check

    let td = gTbData[tabIdx]; // tab data
    let text = td.text;

    window.chBuild(text);

    let tdcount = getwidth(text);
    let curtdcount = 0;
    html="<table id='vis'><tbody><tr>";
    for (var i=0; i<text.length; i++) {
        var c = text.charAt(i);
        var n = c.charCodeAt(0);

        if (i > 0 && (n==10||n==13)) {
            if (n==13) { // \r
                html += buildChar(n,'ch',i);//"<td id='ch"+i+"' class='vis"+n+"' style='background-color:lightblue;'>&bsol;r</td>";
                curtdcount += 1;
                i += 1;
            }
            curtdcount += 1;
            var remtd = "";
            var rem = tdcount - curtdcount;
            html += buildChar(n,'ch',i,` colspan="${(tdcount - curtdcount)}"`); //"<td id='ch"+i+"' class='vis"+n+"' style='background-color:lightblue;' colspan='"+1+rem+"'>&bsol;n</td>";

            //if (rem > 0) remtd = maketd(rem);
            
            html += remtd + "</tr>";
            curtdcount = 0;
            continue;
        }
        curtdcount += 1;
        enc = "&#"+n+";"
        html+=buildChar(n, 'ch', i, i==text.length-1?` colspan="${(tdcount - curtdcount)}"`:'');/*if (n > 225) {
            html += "<td id='ch"+i+"' class='vis"+n+"' style='background-color:red;'>"+enc+"</td>";
        } else {
            html += "<td id='ch"+i+"' class='vis"+n+"' style='background-color:lightblue;'>"+enc+"</td>";
        }*/
    }
    html += "</tr></tbody></table>";
    var div = document.createElement("div");
    div.style.overflow="scroll";
    div.innerHTML = html;
    document.body.appendChild(div);
    if (renderControls) window.tbRenderControls(tabIdx);
    //setTimeout(window.vsUpdate, 200);
    window.vsUpdate();
}; // end tab render function

window.tbAction = function(action) {
    let tabIdx = parseInt(document.
                            getElementsByClassName("tabtrue-")[0]
                            .getAttribute("id")
                            .replace("tab",""));
    window.gTbData[tabIdx].action = action;
    window.tbRender('tab');
}; // end tab action function

window.tbDex = function() {
    let tabIdx = parseInt(document.
                            getElementsByClassName("tabtrue-")[0]
                            .getAttribute("id")
                            .replace("tab",""));
    window.gTbData[tabIdx].start = parseInt(document.getElementById("start").value);
    window.gTbData[tabIdx].end = parseInt(document.getElementById("end").value);
    window.tbRender('tab');
}; // end tab index function
