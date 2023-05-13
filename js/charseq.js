// cq => [c]har se[q]uence

// A cqSeq instance represents a sequence of characters whose implementation is
// independent from the UI counterpart (cqDiv).
window.cqSeq = class {
    constructor() {
        this.set = new Set();
        this.orderArr = [];
    }
    has(el) { 
        return this.set.has(el);
    }
    /*add(el) {
        if (this.has(el)) return;
        this.orderArr.push(el);
        this.set.add(el);
    }*/
    add(el) {
        this.orderArr.push(el);
        if (!this.has(el)) this.set.add(el);
    }
    /*delete(el) {
        if (!this.has(el)) return;
        this.orderArr.splice(this.orderArr.indexOf(el), 1);
        this.set.delete(el);
    }*/
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
    empty() {
        this.set = new Set();
        this.orderArr = [];
    } // end empty func
    deleteAtPos(pos) {
        let spliced = this.orderArr.splice(pos, 1);
        if (this.orderArr.indexOf(spliced[0]) == -1) {
            this.set.delete(spliced[0]);
        } // end if spliced not found
    } // end delete at position func
}; // end seq

// A cqDiv instance is a character sequence div whose implementation is
// independent from cqSeq and is considered immutable to the user,
// however it can be changed programmatically by a cqWrap instance on a user-led
// action.
window.cqDiv = class {
    constructor(div) {
        this.div = div;
    } // end constructor
    add(n) {
        let a = document.createElement('a');
        a.style.border = '1px solid black';
        let self = this;
        a.onclick = (function() {
            let delIdx = [...self.div.children].indexOf(a);
            let id = self.div.parentElement.getAttribute('id');
            if (id == 'cs-any') window.gSelN.deleteAtPos(delIdx);
            else window.gRepN.deleteAtPos(delIdx);
            window.vsUpdate();
            window.tbUpdateSeq();
        }); // end a on click
        let enc = "&#" + n + ";";
        if (n==13) enc = "\\r";
        if (n==10) enc = "\\n";
        this.div.appendChild(a);
        a.innerHTML = enc;
    } // end add func
    empty() {
        while (this.div.children.length > 0) {
            this.div.children[0].remove();
        } // end while children len > 0
    } // end empty func
    deleteAtPos(pos) {
        this.div.children[pos].remove();
    } // end delete at position func
}; // end cqDiv

// A cqWrap instance represents both a cqDiv (visual) and a cqSeq (data);
// and it adds user features such as char sequence mutation.
window.cqWrap = class {
    constructor(seq, div) { this.wrapped = [seq, div]; }
    add(n) { this.wrapped.forEach((it) => it[this.add.name](n)); }
    has(n) { return this.wrapped[0].has(n); }
    empty() { this.wrapped.forEach((it) => it[this.empty.name]()); }
    last() { return this.wrapped[0].orderArr[this.wrapped[0].orderArr.length-1]; }
    count() { return this.wrapped[0].orderArr.length; }
    join(str) { return this.wrapped[0].orderArr.join(str); }
    all() { return this.wrapped[0].orderArr; }
    deleteAtPos(pos) { this.wrapped.forEach((it) => it[this.deleteAtPos.name](pos)); }
}; // end cqWrap
