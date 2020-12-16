const inquirer = require('inquirer');
const fs = require('fs');
const generateMarkdown = require('./utils/generateMarkdown.js');
const { rejects } = require('assert');

// array of questions for user
const questions = [
    {
        type: 'input',
        name: 'title',
        message: 'Please provide a project title.  (Required)',
        validate: nameInput => {
            if (nameInput) {
                return true;
            } else {
                console.log('Please provide a project title!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'description',
        message: 'Provide a description of your application.  (Required)',
        validate: descInput => {
            if (descInput) {
                return true;
            } else {
                console.log('Please enter a description!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'link',
        message: 'Please provide a link to your deployed application.  (Required)',
        validate: linkInput => {
            if (linkInput) {
                return true;
            } else {
                console.log('Please provide a link!');
                return false;
            }
        }
    },
    {
        type: 'checkbox',
        name: 'contents',
        message: 'Which sections would you like to include in your README?',
        choices: ['Installation', 'Usage', 'Screenshots', 'License', 'Contributing', 'Tests', 'Questions', 'Credits']
    },
    {
        type: 'input',
        name: 'installation',
        message: 'Please provide installation instructions.',
        when: ({ contents }) => {
            if (contents.indexOf('Installation') > -1) {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'usage',
        message: 'Please provide information for using your application.  (Required)',
        when: ({ contents }) => {
            if (contents.indexOf('Usage') > -1 ) {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'license',
        message: 'Please provide license information.',
        when: ({ contents }) => {
            if (contents.indexOf('License') > -1) {
                return true;
            } else {
                return false;
            }
        }
    }, 
    {
        type: 'input',
        name: 'contributing',
        message: 'Please enter your guidelines for contributing.',
        when: ({ contents }) => {
            if (contents.indexOf('Contributing') > -1) {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'tests',
        message: 'Please enter tests for your application.',
        when: ({ contents }) => {
            if (contents.indexOf('Tests') > -1) {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'questions',
        message: 'Please provide an email address for others to reach you with questions.',
        when: ({ contents }) => {
            if (contents.indexOf('Questions') > -1) {
                return true;
            } else {
                return false;
            }
        }
    },
];

const screenshotQues = [
    {
        type: 'input',
        name: 'screenshotLink',
        message: 'Please provide a link for your screenshot. (Required)',
        validate: screenshotLinkInput => {
            if (screenshotLinkInput) {
                return true;
            } else {
                console.log('Please provide a link for your screenshot!')
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'screenshotAlt',
        message: 'Please provide alt text for your screenshot. (Required)',
        validate: screenshotAltInput => {
            if (screenshotAltInput) {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'screenshotDesc',
        message: 'Please provide a description of your screenshot. (Optional)'
    },
    {
        type: 'confirm',
        name: 'confirmAddScreenshot',
        message: 'Would you like to add another screenshot?',
        default: false
    }
];

const creditQues = [
    {
        type: 'input',
        name: 'creditName',
        message: 'Please give your credit a name. (Required)',
        validate: creditName => {
            if (creditName) {
                return true;
            } else {
                console.log('Please enter a name for the credit!');
                return false;
            }
        }
    },
    {
        type: 'input',
        name: 'creditLink',
        message: 'Please provide a link for the credit.  (Optional)',
    },
    {
        type: 'confirm',
        name: 'confirmAddCredit',
        message: 'Would you like to add another credit?',
        default: false
    }
]

addScreenshots = readmeData => {
    
    if (!readmeData.screenshots) {
        readmeData.screenshots = [];
    }

    console.log(`
==================
Add New Screenshot
==================
    `);
    return inquirer.prompt(screenshotQues)
    .then(screenshotData => {
        readmeData.screenshots.push(screenshotData);

        if (screenshotData.confirmAddScreenshot) {
            return addScreenshots(readmeData);
        } else {
            // console.log(readmeData)
            return readmeData;
        };
    });
};

addCredits = readmeInfo => {
    
    if (!readmeInfo.credits) {
        readmeInfo.credits = [];
    }

    console.log(`
==============
Add New Credit
==============
    `);

    return inquirer.prompt(creditQues)
    .then(creditData => {
        readmeInfo.credits.push(creditData);

        if (creditData.confirmAddCredit) {
            return addCredits(readmeInfo);
        } else {
            return readmeInfo;
        }
    })
}

// function to write README file
function writeToFile(fileName, data) {
    fs.writeFile(`./dist/${fileName}`, data, err => {
        if (err) {
            reject(err);
            return;
        }

        resolve({
            ok: true,
            message: 'README created!'
        })
    })
}

// function to initialize program
function init() {
    return inquirer.prompt(questions);
}

// function call to initialize program
init()
    .then(userResponse => { 
        if (userResponse.contents.indexOf('Screenshots') > -1) {
            return addScreenshots(userResponse);
        } else {
            return userResponse;
        }
    })
    .then(response => {
        if (response.contents.indexOf('Credits') > -1) {
            return addCredits(response);
        } else {
            return response;
        }
    })
    .then(response => console.log(response))
    // .then(answers => writeToFile('README.md', answers))
    .catch(err => {
        console.log(err);
    });

// Write a conditional for filling out Table of Contents (after description)!!
 
// WHEN I enter a description, installation instructions, usage information, contribution guidelines, and test instructions
// THEN this information is added to the sections of the README entitled Description, Installation, Usage, Contributing, and Tests
// WHEN I choose a license for my application from a list of options
// THEN a badge for that license is added near the top of the README and a notice is added to the section of the README entitled License that explains which license the application is covered under
// WHEN I enter my GitHub username
// THEN this is added to the section of the README entitled Questions, with a link to my GitHub profile
// WHEN I enter my email address
// THEN this is added to the section of the README entitled Questions, with instructions on how to reach me with additional questions
// WHEN I click on the links in the Table of Contents
// THEN I am taken to the corresponding section of the README