// axios({
//     method: "get",  // http method
//     url: "https://jsonplaceholder.typicode.com/todos/1",
//     headers: {}, // packet header
//     data: {},    // packet body
// })
//     .then((res)=>{
//         console.log(res);
//     })
//     .catch((err)=>{
//         console.log(err);
//     });

async function dummy(){
    try{
        const res = await axios({
            method: "get",
            url: "https://jsonplaceholder.typicode.com/todos/1",
            headers: {},
            data: {},
        });

        console.log(res);
    } catch(err){
        console.error(err);	
}};

dummy();
