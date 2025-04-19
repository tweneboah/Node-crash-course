console.log('Command Line');

function greetUser(name){
    console.log(`Good day ${name}`);
    
}
const getUser = process.argv[2]
greetUser(getUser)
console.log(process.argv);

