window.tfRun = function() {
    let tabIdx = parseInt(document.
                            getElementsByClassName("tabtrue-")[0]
                            .getAttribute("id")
                            .replace("tab",""));
    let t = window.gTbData[tabIdx].text;
    let a = window.gTbData[tabIdx].action;
    let s = window.gTbData[tabIdx].start;
    let e = window.gTbData[tabIdx].end;
    let strat = window.gTbData[tabIdx].selStrat;
    let sel = window.gTbData[tabIdx].selNums;
    let rpl = window.gTbData[tabIdx].rplNums;

    function test(i) {
        if (i+window.gSelN.orderArr.length > t.length) return false;
        let testA = window.gSelN.orderArr.join(" ");
        let testB = "";
        for (var j=i; j<i+window.gSelN.orderArr.length; j++) {
            if (j>i) testB += " ";
            testB += t.charCodeAt(j);
        } // end for j
        return testA === testB;
    } // end test func

    let rplStr = [...window.gRepN.orderArr].map((n) => { return String.fromCharCode(n)}).join("");
    let tfStr = "";
    let altCnt = 0;

    for (var i=0; i<s; i++) tfStr += String.fromCharCode(t.charCodeAt(i));
    for (var i=s; i<=e; i++) {
        let n = t.charCodeAt(i);
        if        (strat == 'each' && a == 'replace' && window.gSelN.has(n)) {
            tfStr += rplStr;
        } else if (strat == 'each' && a.charAt(0)=='a' && window.gSelN.has(n)) {
            tfStr += rplStr.charAt(altCnt % rplStr.length); altCnt += 1;
        } else if (strat == 'each' &&a=='insert_before'&& window.gSelN.has(n)) {
            tfStr += (rplStr+String.fromCharCode(n));
        } else if (strat == 'each' &&a=='insert_after' && window.gSelN.has(n)) {
            tfStr += (String.fromCharCode(n)+rplStr);
        } else if (strat.charAt(0) == 's' && a == 'replace' && test(i)) {
            tfStr += rplStr;
            i+=window.gSelN.orderArr.length-1;
        } else if (strat.charAt(0) == 's' && a.charAt(0) == 'a' && test(i)) {
            tfStr += rplStr.charAt(altCnt % rplStr.length); altCnt += 1;
            i+=window.gSelN.orderArr.length-1;
        } else if (strat.charAt(0) == 's' && a == 'insert_before' && test(i)) {
            tfStr += (rplStr + String.fromCharCode(n));
        } else if (strat.charAt(0) == 's' && a == 'insert_after' && test(i)) {
            tfStr += (String.fromCharCode(n) + rplStr);
        } else tfStr += String.fromCharCode(n);
    } //end for i
    for (var i=e+1; i<t.length; i++) tfStr+=String.fromCharCode(t.charCodeAt(i));
    window.gTbData[tabIdx].text = tfStr;

    window.tbRender('tab');
}; // end transform run func
