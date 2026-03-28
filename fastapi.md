##  1 FastAPI, and how does it differ from other web frameworks?
FastAPI is a modern, fast web framework for building APIs with Python 3.7+ based on standard Python type hints. It was created by Sebastian Ramirez in 2018.

## Key Differences from Other Frameworks:

# vs Flask:
FastAPI has automatic API documentation (OpenAPI/Swagger)
Built-in data validation using Pydantic
Async support by default
Type hints for better IDE support and validation

# vs Django REST Framework:
FastAPI is lighter and more focused on APIs
Better performance (one of the fastest Python frameworks)
Simpler setup for API-only applications
Built-in async support

# vs Express.js (Node.js):
Comparable performance
Automatic data validation and serialization
Built-in documentation generation


## 2. Benefits of Using FastAPI
-High Performance: Comparable to Node.js and Go

-Fast Development: Reduces development time by 200–300%

-Fewer Bugs: Reduces human-induced errors by ~40%

-Intuitive: Great editor support with autocompletion

-Easy: Designed to be easy to learn and use

-Short: Minimize code duplication

-Robust: Production-ready code with automatic documentation

-Standards-based: Based on OpenAPI and JSON Schema

-Async Support: Native async/await support


## 3. How FastAPI Handles Requests and Responses
## FastAPI uses ASGI (Asynchronous Server Gateway Interface) to handle requests asynchronously:

-Request Processing: Incoming requests are parsed and validated against type hints

-Path Operation: Routes requests to appropriate path operation functions

-Dependency Injection: Resolves dependencies before executing the handler

-Data Validation: Automatically validates request data using Pydantic models

-Response Generation: Serializes response data and generates appropriate HTTP responses

## 4. Route Definition Syntax
-from fastapi import FastAPI
app = FastAPI()
# Basic GET route
@app.get("/")
def read_root():
    return {"Hello": "World"}
# Route with path parameter
@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
# POST route with request body
@app.post("/items/")
def create_item(item: Item):
    return item


## 5. Types of Request Parameters
# Path Parameters
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}

# Query Parameters
@app.get("/items/")
def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

# Request Body
# from pydantic import BaseModel
class Item(BaseModel):
    name: str
    price: float
@app.post("/items/")
def create_item(item: Item):
    return item

# Headers
# from fastapi import Header
@app.get("/items/")
def read_items(user_agent: str = Header(None)):
    return {"User-Agent": user_agent}

# Cookies
# from fastapi import Cookie
@app.get("/items/")
def read_items(session_id: str = Cookie(None)):
    return {"session_id": session_id}


## 6. Dependency Injection in FastAPI
Dependency Injection is a design pattern where components receive their dependencies from external sources rather than creating them internally. FastAPI has a powerful dependency injection system.

# Benefits:
Code reusability
Easy testing
Separation of concerns
Automatic validation

## 7. Defining and Using Dependencies
from fastapi import Depends
# Simple dependency
def common_parameters(q: str = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}
@app.get("/items/")
def read_items(commons: dict = Depends(common_parameters)):
    return commons
# Class-based dependency
class CommonQueryParams:
    def __init__(self, q: str = None, skip: int = 0, limit: int = 100):
        self.q = q
        self.skip = skip
        self.limit = limit
@app.get("/users/")
def read_users(commons: CommonQueryParams = Depends(CommonQueryParams)):
    return commons

## 8. Middleware in FastAPI
Middleware is a function that works with every request before it’s processed by specific path operations and with every response before returning it.

# Common Use Cases:

Authentication
Logging
CORS handling
Request/Response modification
Performance monitoring


## 9. Adding Middleware
from fastapi import FastAPI, Request
import time
app = FastAPI()
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
# Using third-party middleware
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


## 10. Path Parameters vs Query Parameters
# Path Parameters
-Part of the URL path

-Required by default

-Declared in the path string with {parameter_name}

-Example: /users/{user_id} → user_id is a path parameter
# Query Parameters
-Come after ? in the URL

-Optional by default (can be made required)

-Declared as function parameters

-Example: /users?skip=0&limit=10 → skip and limit are query parameters


## 13. Pydantic in FastAPI
Pydantic is a Python library that provides data validation and settings management using Python type annotations.

Usage in FastAPI:

- Request body validation
- Response model definition
- Configuration management
- Data serialization/deserialization

from pydantic import BaseModel, validator
from typing import Optional
class User(BaseModel):
    name: str
    email: str
    age: Optional[int] = None
    
    @validator('email')
    def email_must_contain_at(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email')
        return v


## 15. Background Tasks
Background tasks allow you to run functions after returning a response, useful for operations that don’t need to complete before returning the response.
        


