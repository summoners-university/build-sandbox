export function toRadix(N,radix) {
    var HexN="", Q=Math.floor(Math.abs(N)), R;
    while (true) {
        R=Q%radix;
        // Base 61 - all but lower case 'x'
        HexN = "0123456789abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(R)
            + HexN;
        Q=(Q-R)/radix;
        if (Q==0) break;
    }
    return ((N<0) ? "-"+HexN : HexN);
}

export function reverseRadix(hash) {
    var value = 0, values = [], list = "0123456789abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var i = 0; i < hash.length; i++) {
        var val = list.indexOf(hash[i]);
        if( val > -1 )
            value += val * Math.pow(61, hash.length - 1 - i);
    }

    /*for(var i = 0; i < values.length; i++) {
     var val = list.indexOf(hash[i]);
     if( val > -1 )
     values.push(val);
     }*/

    return value;
}