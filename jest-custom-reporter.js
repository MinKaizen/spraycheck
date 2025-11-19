const { DefaultReporter } = require('@jest/reporters');

class MinimalReporter extends DefaultReporter {
  constructor(globalConfig, options) {
    super(globalConfig, options);
  }

  printTestFileFailureMessage(testPath, config, result) {
    // Override to print only essential error information without code snippets
    const failedTests = result.testResults.filter(test => test.status === 'failed');
    
    failedTests.forEach(test => {
      const testName = test.ancestorTitles.concat(test.title).join(' › ');
      
      // Extract just the error message without stack trace or code snippets
      const errorMessages = test.failureMessages
        .map(msg => {
          // Extract just the Error message line
          const match = msg.match(/Error: (.+?)(?:\n|$)/);
          return match ? match[1].trim() : msg.split('\n')[0].trim();
        })
        .filter(Boolean);

      if (errorMessages.length > 0) {
        this.log(`  ● ${testName}\n`);
        errorMessages.forEach(msg => {
          this.log(`    ${msg}\n`);
        });
        this.log('');
      }
    });
  }
}

module.exports = MinimalReporter;
