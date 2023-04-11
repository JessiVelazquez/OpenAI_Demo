import { Configuration, OpenAIApi } from "openai";
import models from "./models.js"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  const type = req.body.type || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter an animal",
      }
    });
    return;
  }
  if (type.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a character type",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: models.davinci3,
      prompt: generatePrompt(animal, type),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal, type) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  const capitalizedType =
    type[0].toUpperCase() + type.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a ${capitalizedType}.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
