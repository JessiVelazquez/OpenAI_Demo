import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import models from "./api/models.js"

export default function Home() {
  const [modelInput, setModelInput] = useState("davinci3");
  const [animalInput, setAnimalInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generateAnimal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: modelInput, animal: animalInput, type: typeInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
      setTypeInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Jessi's OpenAI API Demo</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Name Your Pet!</h3>
        <form onSubmit={onSubmit}>
        <h4>Choose your AI Model (Davinci3 is recommended):</h4>
        <div>
          {Object.keys(models).map((model) => (
            <label key={model}>
              <input
                type="radio"
                value={model}
                checked={modelInput === model}
                onChange={(e) => setModelInput(e.target.value)}
              />
              {model}
            </label>
          ))}
        </div>
        <h4>What animal is your pet? (dog, cat, sasquatch, etc)</h4>
        <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <h4>What kind of character are they? (i.e. superhero, villian, taxi driver, pizza lover...)</h4>
          <input
            type="text"
            name="type"
            placeholder="Enter a character type"
            value={typeInput}
            onChange={(e) => setTypeInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
