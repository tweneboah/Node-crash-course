//My first nodejs code

const username = 'Emmanuel'
const currentTime = new Date();
const hours = currentTime.getHours();

let greeting;
if(hours <12){
    greeting = 'Good morning'
}else if(hours <18){
    greeting = 'Good afternoon'
}else{
    greeting = 'Good evening'
}

console.log(`${greeting}, ${username}! Welcome to nodejs`);
