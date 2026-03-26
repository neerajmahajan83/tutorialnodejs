## tutorialnodejs
contains node js tutorial info


## Node.js is a JavaScript runtime environment , used as a backend service which is capable of interacting with the operating system. It is mostly used by top companies such as LinkedIn, Netflix, Walmart, Uber, PayPal, NASA, and many more because of its robust features and performance.

## Features of Node.js are:
-Single-threaded

-Non-Blocking, Asynchronous I/O

-Cross-platform

-Fast Execution (V8 Engine)

-Real-Time Data Handling.



## 1. How does Node.js work?
Node.js works on a single-threaded, event-driven architecture using the V8 JavaScript engine.

V8 Engine: Compiles JavaScript into fast machine code.

Event Loop: Handles asynchronous tasks (I/O, timers, requests) without blocking the main thread.

Libuv library: Provides a thread pool and handles background tasks like file system operations and networking.

Non-blocking I/O: Lets Node.js process thousands of concurrent requests efficiently without creating multiple threads



## 2. What is NPM?
NPM stands for the Node Package Manager. It is the package manager for the NodeJS environment. It is used to install, share, and manage dependencies (libraries, tools, or packages) in JavaScript applications. Below are the following key points about the NPM:

NPM uses a package.json file in NodeJS projects to track project dependencies, versions, scripts, and metadata like the project's name and version.
NPM is accessed by a command-line interface (CLI). Common commands include npm install to install packages, npm update to update them, and npm uninstall to remove them.


## 3. Why is NodeJS single-threaded?
NodeJS is single-threaded because it's based on the asynchronous, non-blocking nature of JavaScript. This design makes it simpler to develop and maintain, and it allows NodeJS to handle many concurrent requests efficiently.

## 4. If NodeJS is single-threaded, then how does it handle concurrency?

NodeJS is single-threaded, but it can handle concurrency efficiently through its event-driven, non-blocking I/O model.

While the event loop in NodeJS runs on a single thread, it doesn’t block the execution of other tasks when waiting for I/O operations, such as file reads or database queries. Instead, NodeJS delegates these I/O tasks to the system's kernel, allowing it to continue processing other requests.

Once the I/O operation is complete, the corresponding callback is added to a queue and processed by the event loop.

This non-blocking approach enables NodeJS to handle multiple concurrent tasks without waiting for each one to finish sequentially.

##  5. Why is NodeJS preferred over other backend technologies like Java and PHP?

Here are some reasons why NodeJS is preferred:

1 Fast Performance: NodeJS is known for its speed in handling I/O-heavy tasks.
2 NPM Ecosystem: Node Package Manager offers over 50,000 bundles to help developers speed up development.
3 Real-Time Applications: Perfect for data-intensive, real-time apps as it doesn't wait for APIs to return data.
4 Unified Codebase: The Same code is used for both server and client, improving synchronization.
5 Easy for JavaScript Developers: Since NodeJS is based on JavaScript, web developers can easily integrate it into their projects.


## 6. What is the difference between Synchronous and Asynchronous functions?

## Synchronous Functions                           	
-- Blocks the execution until the task completes.	  

-- Executes tasks sequentially; each task must be completed before the next one starts.	

-- Returns the result immediately after completion.	

-- Errors can be easily caught with try-catch blocks.	

-- Suitable for simple, sequential tasks with predictable execution flow.	


## Asynchronous Functions
-- Does not block the execution; allows other tasks to proceed concurrently.

-- Initiate tasks and proceed with other operations while waiting for completion. 

-- Typically returns a promise or callback or uses event handling to handle the result upon completion.

-- Error handling is more complex and often involves callbacks, promises, or async/await syntax.

-- Ideal for I/O-bound operations, network requests, and tasks requiring parallel processing.

## 7. What are the module in NodeJS?
In a NodeJS Application, a Module can be considered as a block of code that provides a simple or complex functionality that can communicate with external application. Modules can be organized in a single file or a collection of multiple files/folders. They are useful because of their reusability and ability to reduce the complexity of code into smaller pieces. Examples of modules are. http, fs, os, path, etc.


## 8. What is the purpose of the 'require' keyword in NodeJS?
The require keyword in NodeJS is used to include and import modules (external or built-in) into a NodeJS application.

## Example
const http = require('http')   //imports the HTTP module to create a server.

## 9. What is V8 engine in Node.js?
The V8 engine in Node.js is an open-source JavaScript engine developed by Google, written in C++. It is the same engine that powers Google Chrome. In Node.js, the V8 engine:

-- Compiles JavaScript to native machine code instead of interpreting it, making execution very fast.

-- Manages memory and garbagecollection, ensuring efficient use of system resources.

-- Provides the core runtime for executing JavaScript outside the browser, which Node.js then extends with additional APIs (like file system, networking, etc.).



## 10. How to handle environment variables in NodeJS?
We use process.env to handle environment variables in NodeJS. We can specify environment configurations as well as keys in the .env file. To access the variable in the application, we use the “process.env.VARIABLE_NAME” syntax.

To use it we have to install the dotenv package using the below command:

## npm install dotenv
## Use .env file with dotenv:
require('dotenv').config();
const port = process.env.PORT || 3000;


## 11. What is control flow in NodeJS?
In Node.js, control flow refers to the order in which asynchronous operations (like file reads, API calls, DB queries) are executed and how their results are handled.

Because, Node.js is non-blocking and event-driven, tasks don’t always finish in the order they start. Control flow ensures they are managed correctly.


## 12. What do you mean by event loop in NodeJS?
The event loop in NodeJS is a mechanism that allows it to handle multiple asynchronous tasks concurrently within a single thread. It continuously listens for events and executes associated callback functions.

## example
console.log("Start");

setTimeout(() => {
  console.log("Timeout callback");
}, 0);

console.log("End");

## 13. What is the order in which control flow statements get executed?
The order in which the statements are executed is as follows:

-- Execution and queue handling
-- Collection of data and storing it
-- Handling concurrency
-- Executing the next lines of code

## 14. What are the main disadvantages of NodeJS?
Here are some main disadvantages of NodeJS listed below:

-- Single-threaded nature: It may not fully utilize multi-core CPUs, limiting performance.

-- NoSQL preference: Relational databases like MySQL aren't commonly used.

-- Rapid API changes: Frequent updates can introduce instability and compatibility issues.

## 15. What is REPL in NodeJS?
REPL in NodeJS stands for Read, Evaluate, Print, and Loop. It is a computer environment similar to the shell which is useful for writing and debugging code as it executes the code in on go.

-- Read: It reads the input provided by the user (JavaScript expressions or commands).

-- Eval: It evaluates the input (executes the code).

-- Print: It prints the result of the evaluation to the console.

-- Loop: It loops back, allowing you to enter more code and get immediate results.


## 16. How to import a module in NodeJS?
We use the require module to import the External libraries in NodeJS. The result returned by require() is stored in a variable, which is used to invoke the functions using the dot notation.

You can import modules in two ways:

## CommonJS (default):
const fs = require('fs');      // Built-in module
const add = require('./math'); // Custom module

## ES Modules (modern):
import fs from 'fs';
import { add } from './math.js';

## difference between NodeJS and Angular?

Node.js	
-- Node.js is a server-side runtime environment used to execute JavaScript outside the browser.
-- It is mainly used for backend development such as APIs, servers, and database communication.	
-- Node.js runs on the server to handle client requests and responses.
-- It uses JavaScript for backend logic and server-side operations.	


Angular
	-- Angular is a front-end framework used to build dynamic and interactive user interfaces.
  -- It is mainly used for frontend development to create responsive single-page applications (SPAs).
	-- Angular runs in the browser to manage the user interface.
  -- It primarily uses TypeScript for building structured frontend applications.


## 18. What is package.json in NodeJS?
package.json in NodeJS is a metadata file that contains project-specific information such as dependencies, scripts, version, author details, and other configuration settings required for managing and building the project.

## Example:

{
    "name": "app",
    "version": "1.0.0",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "description": "",
    "dependencies": {
        "express": "^4.21.2"
    }
}


## 19. How to create the simple HTTP server in NodeJS?
You can create a simple HTTP server in NodeJS using the built-in http module:

const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});
server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000/');
});

## 20. What are the most commonly used libraries in NodeJS?
There are the two most commonly used libraries in NodeJs:

ExpressJS: ExpressJS is a minimal and flexible web application framework for building robust APIs and web apps. It simplifies routing, middleware handling, and request/response management.
Mongoose: An Object Data Modeling (ODM) library for MongoDB and NodeJS, it helps in managing data relationships, schema validation, and business logic.


## 21. What are promises in NodeJS?
A promise is an advancement of callbacks in NodeJS. In other words, a promise is a JavaScript object that is used to handle all the asynchronous data operations. While developing an application, you may encounter that you are using a lot of nested callback functions, which causes a problem of callback hell. Promises solve this problem of callback hell.\


## 22. How do you install, update, and delete a dependency?
-Install the Dependencies
-- npm install express

-NodeJS Update the Dependencies
-- npm update 

-NodeJS Delete the Dependencies
-- npm uninstall express

## 23. Which command used to import external libraries?
In NodeJS, you can import external libraries (also known as packages) using the require() function. This allows you to include modules or packages that you have installed via npm (Node Package Manager).

-- const express = require('express');


## 24. What is event-driven programming in NodeJS?
Event-driven programming is used to synchronize the occurrence of multiple events and to make the program as simple as possible. The basic components of an Event-Driven Program are:

A callback function ( called an event handler) is called when an event is triggered.
An event loop that listens for event triggers and calls the corresponding event handler for that event.

## 25. What is a buffer in NodeJS?
The Buffer class in NodeJS is used to perform operations on raw binary data. Generally, Buffer refers to the particular memory location in memory. Buffer and array have some similarities, but the difference is that array can be any type, and it can be resizable. Buffers only deal with binary data, and it can not be resizable. Each integer in a buffer represents a byte. console.log() function is used to print the Buffer instance.

## 26. What are streams in NodeJS?
In NodeJS, streams are a powerful way to handle data in chunks rather than loading the entire data into memory. Streams allow for the efficient processing of large volumes of data, especially in situations where the data size is too large to fit into memory all at once.

-- There are four types of the Streams:

# Readable Streams: These streams allow you to read data. For example, reading data from a file or receiving HTTP request data. Example:
fs.createReadStream() or http.IncomingMessage.
# Writable Streams: These streams allow you to write data. For example, writing data to a file or sending HTTP response data. Example:
 fs.createWriteStream() or http.ServerResponse.
 
# Duplex Streams: These are both readable and writable. You can both read and write data using the same stream. Example: A TCP socket.

# Transform Streams: These are a type of duplex stream where the data is transformed as it is read and written. Example: A zlib stream to compress or decompress data.

## 27. Explain the crypto module in NodeJS.
The crypto module is used for encrypting, decrypting, or hashing any type of data. This encryption and decryption basically help to secure and add a layer of authentication to the data. The main use case of the crypto module is to convert the plain readable text to an encrypted format and decrypt it when required.

## 27. Explain the crypto module in NodeJS.
The crypto module is used for encrypting, decrypting, or hashing any type of data. This encryption and decryption basically help to secure and add a layer of authentication to the data. The main use case of the crypto module is to convert the plain readable text to an encrypted format and decrypt it when required.

## 28. What is callback hell?
Callback hell is an issue caused by a nested callback. This causes the code to look like a pyramid and makes it unable to read To overcome this situation, we use promises.

## 29. Explain the use of the timers module in NodeJS.
The Timers module in NodeJS contains various functions that allow us to execute a block of code or a function after a set period. The Timers module is global, we do not need to use require() to import it. 

It has the following methods:
# 1. setTimeout() method

The setTimeout() function is used to execute a function once after a specified delay (in milliseconds).

setTimeout(callback, delay, [arg1, arg2, ...]);
callback: The function to be executed after the delay.
delay: The time in milliseconds after which the function is executed.
[arg1, arg2, ...]: Optional arguments that can be passed to the callback function.


# 2. setImmediate() method

The setImmediate() function is used to execute a callback function immediately after the current event loop cycle, i.e., after the I/O events in the NodeJS event loop have been processed. It is similar to setTimeout() with a delay of 0 milliseconds, but it differs in terms of when the function is executed.

setImmediate(callback, [arg1, arg2, ...]);
callback: The function to be executed.
[arg1, arg2, ...]: Optional arguments to pass to the callback function.

# 3. setInterval() method

The setInterval() function is used to execute a function repeatedly, with a fixed time delay between each call.

setInterval(callback, delay, [arg1, arg2, ...]);
callback: The function to be executed repeatedly.
delay: The time in milliseconds between each execution.
[arg1, arg2, ...]: Optional arguments that can be passed to the callback function.


## 30. Difference between setImmediate() and process.nextTick() methods
setImmediate()	
--**Executes callback in the check phase of the event loop**
--**Runs after I/O events**
--**Scheduled to run on the next iteration of the event loop**	
--**Lower priority than nextTick**
--**Does not block I/O operations**
--**Used when you want to run code after I/O tasks**

process.nextTick()
--**Executes callback in the next tick queue**
--**Runs before I/O events**
--**Runs immediately after the current operation completes**
--**Higher priority than setImmediate**
--**Can block I/O if overused**
--**Used for immediate execution after current function**


## 31. What are the different types of HTTP requests?
The different types of HTTP requests are mentioned below:

# GET: Retrieve data.
# POST: Create new resource.
# PUT: Update an entire resource.
# PATCH: Partially update a resource.
# DELETE: Remove a resource.


## 32. What is the difference between spawn() and fork() method?

# spawn()	
-Used to run any system command	

-Executes external programs	

-Does not create communication channel by default	

-Suitable for running large processes	

-Returns a stream for data handling	

-Used for general process execution	

# fork()
-Used specifically to create new Node.js processes

-Executes another JavaScript file

-Creates built-in communication channel (IPC)

-Suitable for Node-to-Node communication

-Returns an object with messaging support

-Used for creating child Node.js modules



## 33. Explain the use of the passport module in NodeJS
The passport module is used for adding authentication features to our website or web app. It implements authentication measure which helps to perform sign-in operations.


## 34. What is a, fork in NodeJS?
Fork is a method in NodeJS that is used to create child processes. It helps to handle the increasing workload. It creates a new instance of the engine which enables multiple processes to run the code.


## 35. What are the three methods to avoid callback hell?
The three methods to avoid callback hell are:

Using async/await()
Using promises
Using generators

36. What is a .body-parser in NodeJS?
Body-parser is the NodeJS body-parsing middleware. It is responsible for parsing the incoming request bodies in a middleware before you handle it. It is an NPM module that processes data sent in HTTP requests.


## 36. What is a .body-parser in NodeJS?
Body-parser is the NodeJS body-parsing middleware. It is responsible for parsing the incoming request bodies in a middleware before you handle it. It is an NPM module that processes data sent in HTTP requests.

## 37. What is CORS in NodeJS?
The word CORS stands for “Cross-Origin Resource Sharing”. Cross-Origin Resource Sharing is an HTTP-header based mechanism implemented by the browser which allows a server or an API to indicate any origins (different in terms of protocol, hostname, or port) other than its origin from which the unknown origin gets permission to access and load resources. The cors package available in the npm registry is used to tackle CORS errors in a NodeJS application.

## 38. Explain the tls module in NodeJS..
The tls module provides an implementation of the Transport Layer Security (TLS) and Secure Socket Layer (SSL) protocols that are built on top of OpenSSL. It helps to establish a secure connection on the network.

## 39. Can you access DOM in Node?
No, you cannot access the DOM in NodeJS because NodeJS is a server-side environment, while the DOM (Document Object Model) is a client-side concept used in browsers to interact with HTML and XML documents.

NodeJS runs on the server and does not have access to a browser's DOM, which is part of the browser's environment. The DOM allows you to manipulate the content and structure of web pages, but it is not available in NodeJS, as it operates on the backend, outside the context of a web page or browser.

## 40. How do you manage packages in your NodeJS project?
In a NodeJS project, package management is handled through npm (Node Package Manager), which is the default package manager for NodeJS, which allows you to install and manage third-party packages and create and publish your packages. 

## 41. What is the purpose of NODE_ENV?
The NODE_ENV environment variable in NodeJS is used to specify the environment in which the NodeJS application is running. It helps in distinguishing between different stages of the application's lifecycle, such as development, testing, or production, and allows you to customize the behavior of the application based on that environment.

## 42. What is a test pyramid in NodeJS?
The Test Pyramid is a strategy for structuring tests in a software project to ensure efficiency, maintainability, and good coverage. It consists of three levels:

# Unit Tests (Base): Test individual components or functions in isolation. These tests are fast and numerous. Example: Testing a single function like add(1, 2).

# Integration Tests (Middle): Test interactions between components to ensure they work together. These are slower than unit tests but cover more functionality. Example: Testing API routes to ensure they connect properly with the database.

# End-to-End Tests (Top): Test the entire application flow from the user interface to the backend. These are slow and fewer in number. Example: Simulating user login and navigating the application.



## 43. What is piping in NodeJS?
In NodeJS, piping refers to the process of passing the output of one stream directly into another stream. It allows data to flow through multiple streams without needing to store it in memory or temporarily write it to disk. This is a common pattern used in file handling, HTTP requests, and other I/O operations in NodeJS.
