var fs = require('fs');
var parse = require('csv-parse').parse;
var tf = require('../../js/transform');
var cqSeq = require('../../js/charseq');

function test(n, text, t, expect) {

    let bdd_fail = ({feature, scenario, on, name}) => {};
    let bdd_pass = ({feature, scenario, on, name}) => {on();};

    let sel = t.split(' ')[2];
    if (t.split(' ').length >=
        'replaces each x,y,z with a,b,c'.split(' ').length) {
        console.log('error');
        console.error('Bad data; not testing replacements, testing removals');
        process.exit(1);
    } // end input length check

    let selSeq = new cqSeq();
    sel.split(',').forEach((ch) => {
        selSeq.add(ch.charCodeAt(0));
    });

    let act = t.substring(0, "replace".length);
    let end = text.length-1;

    let res_fail = tf(text, selSeq, new cqSeq(), 'each', act, 0, end, bdd_fail);
    let res_pass = tf(text, selSeq, new cqSeq(), 'each', act, 0, end, bdd_pass);

    /*console.warn(res_fail);
    console.warn(res_pass);
    console.warn(expect);
    console.warn(expect==res_fail,expect.length,res_pass.length,res_pass);*/

    if (res_fail != expect && res_pass == expect)
        return 'Feature 1 Scenario '+n+' - pass';
    return 'Feature 1 Scenario '+n+' - fail';
}; // end test function

var csvRows = [];
var resultStr = "";
fs.createReadStream("test/ftr_remove_all_chars/scenarios.csv")
    .pipe(parse({delimiter: ","}))
    .on('data', function(row) {
        if (row[0] != 'Scenario')
            csvRows.push(row);
    }).on('end', function() {
        csvRows.forEach((row)=>{
            let result = test(row[0],row[2],row[3],row[4]);
            console.log(result);
            resultStr += (result+" ");
        }); // end for each row
    }).on('close', function() {
        if (resultStr.indexOf('fail') > -1) {
            console.log('fail'); process.exit(1);
        } else console.log('pass');
    }); // end read stream
