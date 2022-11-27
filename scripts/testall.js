const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn

const projectRoot = path.normalize(path.join(__dirname, '..'))
const outputLog = path.join(projectRoot, '.test-failures.log')

// Start with a fresh output log on each run.
if (fs.existsSync(outputLog)) {
  fs.unlinkSync(outputLog)
}

// Run all tests, specifying the collector script.
spawn('lerna', ['run', '--no-bail', 'testci', '--loglevel', 'error', '--', '--no-warnings'], {
  stdio: 'inherit',
}).on('exit', function (code) {
  // If a failure occurred, the log file will have been created. Print it.
  if (fs.existsSync(outputLog)) {
    console.error(fs.readFileSync(outputLog, 'utf8').trim())
  }

  // Propagate the exit code.
  process.exit(code)
})
