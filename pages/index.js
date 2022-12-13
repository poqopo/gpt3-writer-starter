import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import { useState } from "react";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    setApiOutput(await response.json());

    setIsGenerating(false);
  };

  const callMakingNFT = async (imgUrl) => {
    setIsBuilding(true);
    const response = await fetch("/api/generateNFT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imgUrl }),
    });
    setIsBuilding(false);
  };

  const onUserChangedText = (event) => setUserInput(event.target.value);

  return (
    <div className="root">
      <Head>
        <title>Demo for writing novel</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Demo for using OpenAI API</h1>
          </div>
          <div className="header-subtitle">
            <h2>
              Write down things that you want to put into your profile NFT!!
            </h2>
          </div>
        </div>
        <div>
          <textarea
            className="prompt-box"
            placeholder="start typing here"
            value={userInput}
            onChange={onUserChangedText}
          />
        </div>
        <div className="prompt-buttons">
          <a
            className={
              isGenerating ? "generate-button loading" : "generate-button"
            }
            onClick={callGenerateEndpoint}
          >
            <div className="generate">
              {isGenerating ? (
                <span className="loader"></span>
              ) : (
                <p>Generate</p>
              )}
            </div>
          </a>
        </div>
        <div className="output">
          <div className="output-header-container">
            <div className="output-header">
              <h3>Output</h3>
            </div>
          </div>
          <div className="output-content">
            {apiOutput.data?.map((i, index) => {
              return (
                <div style={{ placeContent: "center" }}>
                  <img src={i.url} />
                  <button
                    className="prompt-buttons"
                    onClick={() => callMakingNFT(i.url)}
                  >
                    Make NFT
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
