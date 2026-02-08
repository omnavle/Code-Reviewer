import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function greet(name) {
  return "Hello, " + name + "!";
}`);
  const [review, setReview] = useState("");

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      setReview(response.data || "✅ Code reviewed successfully!");
    } catch (error) {
      setReview("⚠️ Unable to connect to backend. Please start the server.");
    }
  }

  return (
    <>
      <div className="navbar">
        <h1>💡 AI Code Reviewer</h1>
        <button onClick={reviewCode}>⚡ Review My Code</button>
      </div>

      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={16}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 15,
                color: "#f5f5f5",
                backgroundColor: "transparent",
                minHeight: "100%",
              }}
            />
          </div>
        </div>

        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review || "🧠 Your AI review will appear here..."}
          </Markdown>
        </div>
      </main>
    </>
  );
}

export default App;
