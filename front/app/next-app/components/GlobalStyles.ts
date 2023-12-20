import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

    .ProseMirror {
  > * + * {

    margin-top: 0.75em;
  }

  outline: none;

  ul,
  ol {
    padding: 0 1rem;
  }

  h1 {
    font-size: 18px;
    padding: 0.5em;/*文字周りの余白*/
    color: #494949;/*文字色*/
    background: #fffaf4;/*背景色*/
    border-left: solid 5px #ffaf58;/*左線（実線 太さ 色）*/
  }

  h2 {
    font-size: 16px;
    border-bottom: solid 3px skyblue;
    position: relative;
  }
  
  h2:after {
    position: absolute;
    font-weight: bold
    content: " ";
    display: block;
    border-bottom: solid 3px #ffc778;
    bottom: -3px;
    width: 30%;
  }

h3 {
    font-size: 14px;
    font-size: 1.5em;
    color: #007ACC; /* A lighter shade for subheadings */
    margin-bottom: 0.4em;
}

h4 {
    font-size: 1.25em;
    color: #0099FF; /* Even lighter for lower-level headings */
    margin-bottom: 0.3em;
}

h5 {
    font-size: 1.1em;
    font-style: italic; /* Italic style for distinction */
    color: #00B2FF;
    margin-bottom: 0.2em;
}

h6 {
    font-size: 1em;
    text-transform: uppercase; /* Uppercase for the smallest headings */
    color: #00CCFF;
    margin-bottom: 0.2em;
}

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}
`;

export default GlobalStyles;
