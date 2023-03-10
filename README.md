# Session over JWT by NestJS

This repositories implementation was inspired by  this idea.

https://zenn.dev/ritou/articles/4a5d6597a5f250

JWT is inappropriate for manage session because of JWT is just a authentication interface format.

But JWT can set issuer, expire limit, and any other information for payload. So client can refer these data without API call. And also JWT can detect token alteration.

So, including session ID for JWT format access token, it may has possibility for strong security authentication.

I tried this idea. I call this architecture **Session over JWT**.

For more details, please refer this notebook.

https://gist.github.com/Akagire/ddb0eec6157d1a4ae4717ad1c2779ecd

### System Architecture

Orchestration: Docker compose
Application: NestJS
Session Store: MongoDB

### How to wake up

Just do following command in current directory.

```sh
docker compose up --build
```

### How to try it

#### Login

```sh
curl -X POST http://localhost:3000/login \
  -d '{"username":"root","password":"password"}' \
  -H 'Content-type: application/json'

# => {"access_token":"eyJ..."}
```

#### Call authentication required API

```sh
#without authentication
curl -X GET http://localhost:3000/member \
  -H 'Content-type: application/json' \
# => {"statusCode":401,"message":"Unauthorized"}

curl -X GET http://localhost:3000/member \
  -H 'Content-type: application/json' \
  -H 'Authorization: Bearer eyJ...'
# => Hello World!
```

### Logout
```sh
curl -X POST http://localhost:3000/logout \
  -H 'Content-type: application/json' \
  -H 'Authorization: Bearer eyJ...'
# => success logout
```

### Force Logout

```sh
# create access token
curl -X POST http://localhost:3000/login \
  -d '{"username":"root","password":"password"}' \
  -H 'Content-type: application/json'
# => {"access_token":"eyJ..."}

# force logout
mongosh mongodb://localhost:27017/local
local > db.sessions.deleteMany({})
# => { acknowledged: true, deletedCount: XXX }
local > .exit

# check logged out
curl -X GET http://localhost:3000/member \
  -H 'Content-type: application/json' \
  -H 'Authorization: Bearer eyJ...'
# => {"statusCode":401,"message":"Unauthorized"}
```
