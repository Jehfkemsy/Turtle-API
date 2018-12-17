# 🍐

## getting started

- ssh into server `@mangohacks.com`
- platform location `/var/www`

## setting up .env

Setup your env variables before anything else

## Using pm2

PM2 is an easy to use process manager

cd into the root of the service

- start `pm2 start --name pear npm -- start`
- stop `pm2 stop pear`
- delete `pm2 delete pear`

## routes

### POST `api.mangohacks.com/application`

- Example request

```
{
    "firstName": "Mike",
    "lastName": "Swift",
    "email": "foo@bar.com",
    "school": "MLH Academy",
    "major": "Computer Science",
    "levelOfStudy": "JUNIOR",
    "gender": "MALE",
    "shirtSize": "MEDIUM",
    "diet" : "Peanuts",
    "resume" : <Buffer />
}
```
