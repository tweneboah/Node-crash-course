const http = require('http')
//Create a server
 const server =http.createServer((req, res)=>{
    //set the content to plain
    res.setHeader('Content-Type','application/json')
   if(req.url ==='/' && req.method ==='GET'){
    res.statusCode = 200
    res.end(JSON.stringify({message:'Welcome to the API!'}))
   }else if(req.url ==='/users' && req.method ==='GET'){
    const users = [{id:1,name:'Smith', id:2, name:'Janet'}]
    res.statusCode =200;
    res.end(JSON.stringify(users))
   }else if(req.url ==='/products' && req.method ==='GET'){
    res.statusCode =200
    const products = [{id:101, name:'Laptop', price:1500,id:102,name:'Phone', price:900}]
    res.end(JSON.stringify(products))
   }
})

//Define port
const PORT =5000
//Start the server
server.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server')
})