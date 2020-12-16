// creates table of contents
populateContents = contentsArr => {

    let contentsList = ''
    contentsArr.forEach(item => {
        contentsList += `* [${item}](#${item.toLowerCase().split(' ').join('-')})
`
    })
    return contentsList;
}


// function to generate markdown for README
function generateMarkdown(data) {

    const { title, description, contents, screenshots, credits, ...section } = data;

    return `# ${data.title}

## Description
${description}

## Contents
${populateContents(contents)}


`;
}

module.exports = generateMarkdown;