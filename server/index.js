let express = require('express')
let app = express();
let fs = require('fs')
let path = require('path')
app.use(express.static('static'));
app.listen(80);

const test_path = path.join(__dirname, '..', 'client', 'event-sys-gui', 'test-results.json')

app.get('/tests', (req, res) => {
  let data = fs.readFileSync(test_path);
  data = JSON.parse(data);

  let results = [];

  for(var test of data.testResults) {
    for(var result of test.testResults) {
      results.push({
        name: result.title,
        success: result.status === 'passed'
      })
    }
  }

  res.send(results)
})