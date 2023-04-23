window.vsUpdate = function() {
    console.log('vsUpdate', console.trace());
    let tabIdx = parseInt(document.
                            getElementsByClassName("tabtrue-")[0]
                            .getAttribute("id")
                            .replace("tab",""));

    let t = window.gTbData[tabIdx].text;
    let s = window.gTbData[tabIdx].start;
    let e = window.gTbData[tabIdx].end;
    let strat = window.gTbData[tabIdx].selStrat;

    function style(i, n, seqOverrideVal = true) {
        let el = document.getElementById("ch"+i);
        let isSelected = (window.gSelN.has(n) && seqOverrideVal);
        let isInRange = (i>=s && i<=e);
        el.style.backgroundColor = (isSelected && isInRange) ? 'lightgreen' : 'lightblue';
        if (!isSelected && n>225) el.style.backgroundColor = 'red';
    }; // end style function

    function nString(str, i, length) {
        let s = "";
        for (var j=i; j<i+length; j++) {
            if (s.length > 0) s+=" ";
            s += str.substring(j,j+1).charCodeAt(0);
        } // end for j
        return s;
    }; // end n string func

    for (var i=0; i<t.length; i++) {
        
        let n = t.charCodeAt(i);
        if (strat == 'each') style(i, n);
        else { // sequence
            if (window.gSelN.orderArr[window.gSelN.orderArr.length-1] == n) {
                console.log(n, window.gSelN.orderArr[window.gSelN.orderArr.length-1]);
                console.log(window.gSelN.orderArr.join(" ") == nString(t, i-window.gSelN.orderArr.length+1, window.gSelN.orderArr.length), window.gSelN.orderArr.join(" "), '==', nString(t, i-window.gSelN.orderArr.length+1, window.gSelN.orderArr.length));
                let idx1 = i-window.gSelN.orderArr.length+1;
                if (idx1 >=0 && window.gSelN.orderArr.join(" ") == nString(t, idx1, window.gSelN.orderArr.length)) {
                    for (var j=i-window.gSelN.orderArr.length; j<=i; j++) {
                        style(j, t.charCodeAt(j), true);
                    } // end for j
                } // end if order arr
                else style(i, n, false);
            } else style(i, n, false);
        } // end else sequence cond
    } // end for text

    // for (var i=0; i<els.length; i++) {
    //     els[i].style.backgroundColor = color(n, true/*!selected*/);
    // }

    
}; // end visualization update function
