// helper function to capitalize first letter of each word
capFirstLetters = string => {
    return string.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}

// creates table of contents
createTableOfContents = contentsArr => {

    let contentsList = ''
    contentsArr.forEach(item => {
        contentsList += `* [${item}](#${item.toLowerCase().split(' ').join('-')})
`
    })
    return contentsList;
}

populateContents = (title, section) => {
    
    let readmeContents = '';
    const sectionArr = [
        {
            h2: 'Installation',
            content: section.installation
        },
        {
            h2: 'Usage',
            content: section.usage
        },
        {
            h2: 'License',
            content: section.license
        },
        {   h2: 'Contributing',
            content: section.contributing
        },
        {
            h2: 'Tests',
            content: section.tests
        },

    ]

    if (section.link) {
        sectionArr.shift({
            h2: 'Deployed Application',
            content: `[${capFirstLetters(title)}](${section.link})`
        })
    }

    if (section.questions) {
        sectionArr.push({
            h2: 'Questions',
            content: `If you have any questions about the repo, please open an issue or contact me at ${section.questions}. You can find more of my work at [${section.github}](https://github.com/${section.github}/).`
        })
    }

    sectionArr.forEach(sectionItem => {
        if (sectionItem.content) {
            readmeContents += `## ${sectionItem.h2}
${sectionItem.content}
    
`
        }
    })

    return readmeContents;
}

// function to generate markdown for README
function generateMarkdown(data) {

    const { title, description, contents, ...section } = data;

    return `# ${capFirstLetters(title)}

## Description
${description}

## Contents
${createTableOfContents(contents)}

${populateContents(title, section)}

`;
}

module.exports = generateMarkdown;