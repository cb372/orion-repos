const express = require('express')
const request = require('request')
const app = express()

const token = process.env.GITHUB_TOKEN;
const url = 'https://api.github.com/graphql';
const query = `
  {
    search(query: "topic:orion org:ovotech", type: REPOSITORY, first: 100) {
      nodes {
        ... on Repository {
          name
          url
          description
        }
      }
    }
    organization(login: "ovotech") {
      teams(query: "orion", first: 1) {
        nodes {
          repositories(first: 100) {
            nodes {
              name
              url
              description
            }
          }
        }
      }
    }
  }`;

app.get('/repos', function (req, res) {
  console.log(url)
  request.post({
    url: url,
    json: { query: query },
    headers: { 
      'Authorization': 'bearer ' + token,
      'User-Agent': 'onion-repos'
    }
  }, function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
  })
    .pipe(res)
})

app.use(express.static('public'))

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
