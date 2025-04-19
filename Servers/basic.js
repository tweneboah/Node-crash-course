const http = require('http')
//Create a server
 const server =http.createServer((req, res)=>{
    //log request details
    console.log(`Received ${req.method} request for:${req.url}`);
    //Set status code and headers
    res.writeHead(200, {"content-type":"text/plain"})
    //send the response
    res.end('hello world, this is my first nodejs server')
    
})

//Define port
const PORT =5000
//Start the server
server.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server')
    
})