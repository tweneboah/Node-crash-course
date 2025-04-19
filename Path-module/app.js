const path = require('path')

//!Getting file name from a path
// console.log(path.basename('/users/files/test.txt'));

//!Getting the directory name
// console.log(path.dirname('/users/files/test.txt'));

// //!Getting the file extension
//  console.log(path.extname('/users/files/test.html'));



//!Join paths (works across operating systems )
// console.log(path.join('/users','files','test.txt'));

//! Getting absolute path
// console.log(path.resolve('test.txt'));

//Access special path properties
console.log(__filename);
console.log(__dirname);





