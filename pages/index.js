import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import axios from "axios";
import Canvas from "./Canvas";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(undefined);
  const [test, setTest] = useState(undefined);
  const [userProfile, setUserProfile] = useState(undefined);
  const [mask, setMask] = useState();
  const baseUrl = "https://poqopotest.s3.us-west-2.amazonaws.com/image/";

  useEffect(() => {
    window.ethereum.on("accountsChanged", (a) => {
      setSelectedAddress(a[0]);
    });
  }, []);

  useEffect(() => {
    setSelectedAddress(window.ethereum.selectedAddress);
  }, [test]);

  useEffect(() => {
    if (selectedAddress) {
      const response = axios
        .get(`/api/getPicture?userAddress=${selectedAddress}`)
        .then((response) => {
          response.data ? setUserProfile(baseUrl + selectedAddress) : "";
        });
    }
  }, [selectedAddress]);

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

  const callEditEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/editNFT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedAddress, userProfile, userInput, mask }),
    });

    setApiOutput(await response.json());
    setIsGenerating(false);
  };
  console.log(mask);

  const callMakingNFT = async (description, imgUrl, userAddress) => {
    setIsBuilding(true);
    const response = await fetch("/api/generateNFT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imgUrl, description, userAddress }),
    });
    setIsBuilding(false);
  };

  const onUserChangedText = (event) => setUserInput(event.target.value);

  return (
    <div className="root">
      <Head>
        <title>Demo for writing novel</title>
      </Head>
      <div onClick={() => setTest("test!")}>
        <ConnectButton />
      </div>

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
        {userProfile ? (
          <div>
            <h2 style={{ color: "white" }}>Your Current picture is </h2>
            <Canvas backgroundUrl={userProfile} setFn={setMask} />
          </div>
        ) : (
          <div />
        )}

        <div>
          <textarea
            className="prompt-box"
            placeholder="start typing here"
            value={userInput}
            onChange={onUserChangedText}
          />
        </div>
        <div className="prompt-buttons">
          {userProfile ? (
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callEditEndpoint}
            >
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>EditNFT</p>
                )}
              </div>
            </a>
          ) : (
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
          )}
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
                    onClick={() =>
                      callMakingNFT(userInput, i.url, selectedAddress)
                    }
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
