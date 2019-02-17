Number.prototype.formatMoney = function(c = 0, d = '.', t = '.'){
    var n = this, 
    cc = isNaN(c = Math.abs(c)) ? 2 : c, 
    dd = d == undefined ? "." : d, 
    tt = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + tt : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + tt) + (cc ? dd + Math.abs(n - i).toFixed(cc).slice(2) : "");
 }