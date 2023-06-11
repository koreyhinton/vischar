function tf(text, sel, rpl, strat, act, start, end, bdd) {
    let t = text;
    let a = act;
    let s = start;
    let e = end;
    let rplStr = [...rpl.all()]
        .map((n) => { return String.fromCharCode(n)})
        .join("");
    let tfStr = '';

    function test(i) {
        if (i+sel.count() > t.length) return false;
        let testA = sel.join(" ");
        let testB = "";
        for (var j=i; j<i+sel.count(); j++) {
            if (j>i) testB += " ";
            testB += t.charCodeAt(j);
        } // end for j
        return testA === testB;
    } // end test func

    let altCnt = 0;
    for (var i=0; i<s; i++) tfStr += String.fromCharCode(t.charCodeAt(i));
    for (var i=s; i<=e; i++) {
        let n = t.charCodeAt(i);
        let removeEachCond = false; bdd({feature: 1, scenario: '1-3', on: ()=> {
            removeEachCond = sel.has(n) && strat == 'each' &&
                                               a == 'replace' &&
                                     rpl.count() == 0;
        }, name: 'Remove All Chars - Remove 1+ char(s)'});
        let replaceEachCond = rpl.count() > 0 &&
            strat == 'each' && a == 'replace' && sel.has(n);
        if (removeEachCond) {}
        else if (replaceEachCond) {
            tfStr += rplStr;
        } else if (strat == 'each' && a.charAt(0)=='a' && sel.has(n)) {
            tfStr += rplStr.charAt(altCnt % rplStr.length); altCnt += 1;
        } else if (strat == 'each' &&a=='insert_before'&& sel.has(n)) {
            tfStr += (rplStr+String.fromCharCode(n));
        } else if (strat == 'each' &&a=='insert_after' && sel.has(n)) {
            tfStr += (String.fromCharCode(n)+rplStr);
        } else if (strat.charAt(0) == 's' && a == 'replace' && test(i)) {
            tfStr += rplStr;
            i+=sel.count()-1;
        } else if (strat.charAt(0) == 's' && a.charAt(0) == 'a' && test(i)) {
            tfStr += rplStr.charAt(altCnt % rplStr.length); altCnt += 1;
            i+=sel.count()-1;
        } else if (strat.charAt(0) == 's' && a == 'insert_before' && test(i)) {
            tfStr += (rplStr + String.fromCharCode(n));
        } else if (strat.charAt(0) == 's' && a == 'insert_after' && test(i)) {
            tfStr += (String.fromCharCode(n) + rplStr);
        } else tfStr += String.fromCharCode(n);
    } //end for i
    for (var i=e+1; i<t.length; i++) tfStr+=String.fromCharCode(t.charCodeAt(i));
    return tfStr;
}; // end transform func

try{if (module != null) module.exports=tf;}catch{}
