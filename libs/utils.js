
function getRandomColor() {
    var letters = '047'.split('');
    var color = '#';
    var c1 = '';
    var c2 = '';
    var c3 = '';
    
    var letterc1 = letters[Math.round(Math.random() * 2)];
    var letterc2 = letters[Math.round(Math.random() * 2)];
    var letterc3 = letters[Math.round(Math.random() * 2)];
    
    c1 += letterc1 + letterc1;
    c2 += letterc2 + letterc2;
    c3 += letterc3 + letterc3;
    
    color += c1 + c2 + c3;
    
    return color;
}
