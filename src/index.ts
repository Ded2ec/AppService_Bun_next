import { Elysia } from "elysia";





const app = new Elysia()
.get("/", () => "Hello Elysia")
.get("/hello", () => "Hello Users")



// get path params
.get("/hello/:name/:age", ({ params }) =>  {
  const name = params.name
  const age = params.age
  return `Hello  ${name} and you are ${age} years old`
})


.get("customer/:id",({params}) => {
  const customers = [
    {
      id: 1,
      name: "John",
      age: 30,
      email: "john@example.com"
    },
    {
      id: 2,
      name: "Jane",
      age: 25,
      email: "jane@example.com"
    },
    {
      id: 3,
      name: "Doe",
      age: 35,
      email: "doe@example.com"
    }
  ]
  const customer = customers.find((customer) => customer.id === parseInt(params.id))
  if(!customer) {
    return "Customer not found"
  }
  return customer
})

// example query params http://localhost:3000/customer?name=John&age=30
.get("/customer", ({ query }) => {
  const name = query.name
  const age = query.age
  return `Query:  ${name} ${age} `
})

 .get("/customers/status", () => {
    return new Response("Hello World",{ status: 500 })
  })

// example post http://localhost:3000/customers/create
  .post("/customers/create", ({body}: { body: { name: string, age: number }}) => {
    return `Post:  ${body.name} ${body.age} `

})

 // example put http://localhost:3000/customers/update/1?name=John&age=30
  .put("/customers/update/:id", ({params, body}: {params: {id: number}, 
    body: {name: string, age: number}}) => {
    return `Put:  ${params.id} ${body.name} ${body.age} `
  })

  // example delete http://localhost:3000/customers/delete/1
  .delete("/customers/delete/:id", ({params}: {params: {id: number}}) => {
    return `Delete:  ${params.id} `
  })


// upload file
.post("/uploads-file", ({body}: {body: {file: File}}) => {
  const file = body.file
  Bun.write('uploads/' + file.name, file );
  return {message: "File uploaded successfully"}
})


// // upload file
// .post("/uploads-file", async ({body}: {body: any}) => {
//   console.log('Received body:', body);
  
//   if (!body || !body.file) {
//     return new Response('No file uploaded', { status: 400 })
//   }

//   try {
//     await Bun.write('uploads/' + body.file.name, body.file)
//     return {message: "File uploaded successfully"}
//   } catch (error: any) {
//     return new Response('Error uploading file: ' + error.message, { status: 500 })
//   }
// })
.listen(3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
