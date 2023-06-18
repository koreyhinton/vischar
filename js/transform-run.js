function tfRun() {
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

    let tfStr = tf(t, window.gSelN, window.gRepN, strat, a, s, e,
        ({feature, scenario, on, name}) => {on();});

    window.gTbData[tabIdx].text = tfStr;

    window.tbRender('tab');
}; // end transform run func

