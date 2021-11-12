console.log('Hello Node!');
console.log('Goodbye');
console.log('I edited this vile file with vim');
let PI = 3.14159265359;
module.exports.area = (radius) => Math.pow(radius, 2) * PI;
module.exports.circum = (radius) => 2 * radius * PI;

