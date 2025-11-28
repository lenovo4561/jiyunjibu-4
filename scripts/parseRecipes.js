const fs = require('fs')
const path = require('path')
const mammoth = require('mammoth')

const sourcePath = path.join(__dirname, '../src/assets/20 道热门家常菜.docx')
const destPath = path.join(__dirname, '../src/helper/recipesData.js')

mammoth
  .extractRawText({ path: sourcePath })
  .then(result => {
    const text = result.value
    const recipes = parseText(text)
    const jsContent = `export default ${JSON.stringify(recipes, null, 2)}`

    fs.writeFileSync(destPath, jsContent)
    console.log(`Successfully converted recipes to ${destPath}`)
  })
  .catch(err => {
    console.error(err)
  })

function parseText(text) {
  const lines = text.split(/\r?\n/)
  const recipes = []
  let currentRecipe = null
  let section = '' // 'ingredients' or 'steps'

  const titleRegex = /^(\d+)\.\s+(.+)/
  const ingredientsRegex = /^食材：/
  const stepsRegex = /^步骤：/

  for (let line of lines) {
    line = line.trim()
    if (!line) continue

    const titleMatch = line.match(titleRegex)
    if (titleMatch) {
      if (currentRecipe) {
        recipes.push(currentRecipe)
      }
      currentRecipe = {
        id: parseInt(titleMatch[1]),
        title: titleMatch[2].trim(),
        ingredients: '',
        steps: ''
      }
      section = ''
      continue
    }

    if (ingredientsRegex.test(line)) {
      section = 'ingredients'
      if (currentRecipe) {
        currentRecipe.ingredients = line.replace(ingredientsRegex, '').trim()
      }
      continue
    }

    if (stepsRegex.test(line)) {
      section = 'steps'
      continue
    }

    if (currentRecipe) {
      if (section === 'ingredients') {
        // Should not happen usually as ingredients are typically on one line or immediately following
        currentRecipe.ingredients += ' ' + line
      } else if (section === 'steps') {
        // Clean up step text if it contains numbered prefixes like "1. " inside the step block if needed,
        // or just append. The doc text had empty lines between steps.
        if (currentRecipe.steps) {
          currentRecipe.steps += '\n' + line
        } else {
          currentRecipe.steps = line
        }
      }
    }
  }

  if (currentRecipe) {
    recipes.push(currentRecipe)
  }

  return recipes
}
