import { useEffect, useState } from "react";
import EditorToJSON, { EditorToTextFile } from "../EditorToJson";
import { Editor } from "@tiptap/react";
import JSONToEditor from "../JSONtoEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { exportToPDF } from "../htmlToPdf";
import { faFile, faFileLines, faFilePdf, faTimes } from "@fortawesome/free-solid-svg-icons";

export const SettingSidebar = ({ editor }: any) => {
  const [projectName, setProjectName] = useState("無題のドキュメント");
  const [showFileInput, setShowFileInput] = useState(false);
  const [showFileOutput, setShowFileOutput] = useState(false);
  const [showCharacters, setShowCharacters] = useState(false);
  const [jsonContent, setJsonContent] = useState<any>(null); // JSON データを一時的に保持するための状態
  const [loadingProgress, setLoadingProgress] = useState(0);


  const handleJSONFileChange = (file) => {
    if (file) {
      const reader = new FileReader();

      reader.onloadstart = () => setLoadingProgress(0);
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentLoaded = Math.round((event.loaded / event.total) * 100);
          setLoadingProgress(percentLoaded);
        }
      };
      reader.onload = (e) => {
        if (e.target) {
          setJsonContent(JSON.parse(e.target.result));
          setLoadingProgress(100); // Complete
        }
      };
      reader.onerror = () => {
        // Handle errors here
        alert("ファイルの読み込みに失敗しました。");
        setLoadingProgress(0);
      };
      reader.readAsText(file);
    }
  };

  const handleLoadContent = () => {
    if (jsonContent) {
      JSONToEditor(editor, jsonContent);
    } else {
      alert("JSON ファイルを選択してください。");
    }
  };

  // Add states for display options if needed

  // Load project name from local storage
  useEffect(() => {
    const savedName = localStorage.getItem("projectName");
    if (savedName) {
      setProjectName(savedName);
    }
  }, []);

  // Save project name to local storage
  const handleProjectNameChange = (e: any) => {
    setProjectName(e.target.value);
    localStorage.setItem("projectName", e.target.value);
  };


  const FileInputAccordion = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      updateFile(file);
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      updateFile(file);
    };

    const updateFile = (file) => {
      if (file && file.type === 'application/json') {
        setFileName(file.name);
      } else {
        alert('JSONファイルを選択してください。');
        setFileName('');
      }
    };

    const handleDelete = () => {
      setFileName('');
    };

    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-medium text-gray-600"
        >
          ファイル入力
        </button>

        {isOpen && (
          <>
            {fileName && (
              <div className="mb-4 text-sm font-medium text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faFile} className="text-gray-600 mr-2" />
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {fileName}
                </div>
                <button onClick={handleDelete} className="ml-4">
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                </button>
              </div>
            )}
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 bg-white rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <i className="fas fa-cloud-upload-alt fa-3x text-gray-300"></i>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">クリックしてアップロード</span>
                </p>
                <p className="text-xs text-gray-500">現在、JSONファイルのみ</p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="application/json"
              />
            </label>
            {/* Display Progress Bar */}
            {loadingProgress > 0 && loadingProgress < 100 && (
              <div className="progress-bar">
                Loading: {loadingProgress}%
              </div>
            )}
            {fileName && (
              <button
                onClick={handleLoadContent}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-4 rounded-full flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faFileLines} className="mr-2" />
                JSONから入力
              </button>
            )}
          </>
        )}

      </div>
    );
  };

  const FileOutputAccordion = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-medium text-gray-600"
        >
          ファイル出力
        </button>

        {isOpen && (
          <div className="flex flex-col space-y-2 mt-2">
            <button
              onClick={() => EditorToJSON(editor)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-4 rounded-full flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faFileLines} className="mr-2" />
              JSONに出力
            </button>
            <button
              onClick={() => {
                exportToPDF(editor);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-4 rounded-full flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
              PDFに出力
            </button>
            <button
              onClick={() => {
                EditorToTextFile(editor);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 mt-4 rounded-full flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faFile} className="mr-2" />
              TEXTに出力
            </button>
          </div>
        )}
      </div>
    );
  };
  const CharactersInput = () => {
    const [characters, setCharacters] = useState([]);
    const [newCharacter, setNewCharacter] = useState({ name: "", image: "" });

    const handleAddCharacter = () => {
      setCharacters([...characters, newCharacter]);
      setNewCharacter({ name: "", image: "" }); // Reset input form
    };

    const handleDeleteCharacter = (index) => {
      const updatedCharacters = characters.filter((_, i) => i !== index);
      setCharacters(updatedCharacters);
    };

    const handleEditCharacter = (index, character) => {
      const updatedCharacters = characters.map((c, i) =>
        i === index ? character : c
      );
      setCharacters(updatedCharacters);
    };

    return (
      <div>
        {/* Add/Edit Character Form */}
        <input
          type="text"
          placeholder="人物名"
          value={newCharacter.name}
          onChange={(e) =>
            setNewCharacter({ ...newCharacter, name: e.target.value })
          }
        />
        <input
          type="file"
          onChange={(e) =>
            setNewCharacter({ ...newCharacter, image: e.target.files[0] })
          }
        />
        <button onClick={handleAddCharacter}>追加</button>

        {/* Character List */}
        {characters.map((char, index) => (
          <div key={index} className="flex items-center space-x-2">
            <img
              src={char.image}
              alt={char.name}
              className="w-10 h-10 rounded-full"
            />
            <span>{char.name}</span>
            <button
              onClick={() =>
                handleEditCharacter(index, {
                  /* new character data */
                })
              }
            >
              編集
            </button>
            <button onClick={() => handleDeleteCharacter(index)}>削除</button>
          </div>
        ))}
      </div>
    );
  };

  const DisplayOptionsAccordion = () => {
    const [isOpen, setIsOpen] = useState(false);
    // Additional state for each option

    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-medium text-gray-600"
        >
          表示オプション
        </button>

        {isOpen && (
          <div className="flex flex-col space-y-2 mt-2">
            {/* Checkboxes for each display option */}
            <label>
              <input type="checkbox" /> 登場人物を非表示にする
            </label>
            {/* ... Other options ... */}
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="flex flex-col space-y-4 bg-white shadow-lg rounded-lg border border-gray-200 p-4 mx-2 my-4">
      <div className="text-lg font-semibold text-gray-700">エディタ設定</div>
      {/* Project Name Input */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-600">
          ドキュメント名
        </label>
        <input
          type="text"
          className="p-2 border border-gray-300 rounded"
          value={projectName}
          onChange={handleProjectNameChange}
        />
      </div>
      {/* Existing Style Settings */}
      {/* ... Your existing code for style settings ... */}
      {/* File Input Accordion */}
      {/* ... Implement accordion and file inputs for JSON, WORD, PDF ... */}
      <FileInputAccordion />
      {/* File Output Accordion */}
      {/* ... Implement accordion and file outputs for JSON, PDF, TEXT ... */}
      <FileOutputAccordion />
      {/* Characters Input */}
      {/* ... Implement functionality to add characters with name, photo, summary ... */}
      <CharactersInput />
      {/* Display Options Accordion */}
      {/* ... Implement accordion with checkboxes for display options ... */}
      <DisplayOptionsAccordion />
      {/* Existing Save and Cancel Buttons */}
    </div>
  );
};

export default SettingSidebar;
