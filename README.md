![Pear](https://github.com/hackfiu/pear/blob/master/assets/banner.jpg?raw=true)

## Start scripts

- `yarn do:start`: rebuild service and start a PM2 process
- `yarn do:restart`: rebuild service and restart an existing PM2 process
- `yarn do:stop`: stop a PM2 process
- `yarn do:delete`: delete a PM2 process

## Setting up .env

Setup your env variables before anything else

## Using the email templates

- The email templates are housed in the following [pen](https://codepen.io/dashboard/)

Heres the breakdown:

- Code as if you were using regular HTML & CSS.
- Once you're happy with the template, you need to make it compatible with emails.
- Mailchimp gives us a tool we can use to inline/reorganize or HTML & CSS to look pretty on email clients.

Visit this link for mail [inliner](https://templates.mailchimp.com/resources/inline-css/)

_Example inliner code_

```html
<style>
  <!-- Paste CSS from Codepen here -->
</style>

<!-- Paste HTML from Codepen here -->
<!-- No <html></html> tags needed -->
```

Once you pass it through the inliner, you can now use it as a template.

## routes

### POST `/application`

- Example request

```json
{
  "firstName": "Mike",
  "lastName": "Swift",
  "email": "foo@bar.com",
  "school": "MLH Academy",
  "major": "Computer Science",
  "levelOfStudy": "JUNIOR",
  "gender": "MALE",
  "shirtSize": "MEDIUM",
  "diet": "Peanuts",
  "resume": <Buffer />
}
```

### POST `/mentor`

- Example request

```json
{
  "firstName": "Mike",
  "lastName": "Swift",
  "email": "foo@bar.com",
  "skills": "I can code with no shoes on."
}
```

### POST `/volunteer`

- Example request

```json
{
  "firstName": "Mike",
  "lastName": "Swift",
  "email": "foo@bar.com"
}
```

### POST `/workshop`

- Example request

```json
{
  "firstName": "Mike",
  "lastName": "Swift",
  "title": "Intro to JS.",
  "Description": "I will show people how to use JS."
}
```

### GET `/cabinet/YOUR_ROUTE_HERE`

This route is used to fetch any info

- Example request

- Route: api.mangohacks.com/cabinet/confirmed
- Authorization : "Bearer eyJhbGciOiJIUzI1Nixxxxxxxx"

returns

```json
  "data": [
        {
          "diet": "N/A",
          "mlh": "AGREE",
          "timestamp": "2019-01-26T23:20:39.137Z",
          "confirmation": false,
          "_id": "xxx",
          "firstName": "David",
          "lastName": "Castaneda",
          "email": "email@fiu.edu",
          "school": "Florida International University",
          "major": "Computer Science",
          "levelOfStudy": "JUNIOR",
          "resume": "https://drive.google.com/",
          "gender": "MALE",
          "shirtSize": "MEDIUM",
          "__v": 0
      },
  ]
```


Possible routes:
- confirmed
- unconfirmed
- females
- males

