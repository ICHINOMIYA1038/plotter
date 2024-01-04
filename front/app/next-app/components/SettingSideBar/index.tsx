import { useEffect, useState } from "react";
import EditorToJSON, { EditorToTextFile } from "../EditorToJson";
import { Editor } from "@tiptap/react";
import JSONToEditor from "../JSONtoEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { exportToPDF } from "../htmlToPdf";
import {
  faFile,
  faFileLines,
  faFilePdf,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { set } from "react-hook-form";

export const SettingSidebar = ({ editor }: any) => {
  const [projectName, setProjectName] = useState("無題のドキュメント");
  const [fileName, setFileName] = useState("");
  const [jsonContent, setJsonContent] = useState<any>(null); // JSON データを一時的に保持するための状態
  const [fileAcordionisOpen, setFileAcordionIsOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleLoadContent = () => {
    if (jsonContent) {
      if (editor) {
        editor.commands.setContent(jsonContent);
      }
    } else {
      alert("JSON ファイルを選択してください。");
    }
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileChange(event.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file: any) => {
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      alert('ファイルサイズは5MB以下である必要があります。');
      return;
    }
    if (file.type !== "application/json") {
      alert('JSONファイル以外は対応していません。');
      return;
    }
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target == null) {
          return;
        }
        const content: any = JSON.parse(e.target.result as string);
        setJsonContent(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
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
    const [isFileSelected, setIsFileSelected] = useState(false);

    const handleDelete = () => {
      setFileName("");
      setJsonContent(null);
    };

    return (
      <div>
        <button
          onClick={() => setFileAcordionIsOpen(!fileAcordionisOpen)}
          className="text-sm font-medium text-gray-600"
        >
          ファイル入力
        </button>

        {true && (
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
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              htmlFor="file-upload"
              className={`${isDragOver ? "border-blue-600" : "border-gray-300"
                } flex flex-col items-center justify-center w-full h-32 bg-white rounded-lg border-2  border-dashed cursor-pointer hover:bg-gray-50`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <i className="fas fa-cloud-upload-alt fa-3x text-gray-300"></i>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">
                    クリックしてアップロード
                  </span>
                </p>
                <p className="text-xs text-gray-500">現在、JSONファイルのみ</p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                accept="application/json"
              />
            </label>
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

        {true && (
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
    const [characters, setCharacters] = useState<any>([]);
    const [newCharacter, setNewCharacter] = useState({ name: "", image: "" });

    const handleAddCharacter = () => {
      setCharacters([...characters, newCharacter]);
      setNewCharacter({ name: "", image: "" }); // Reset input form
    };

    const handleDeleteCharacter = (index: any) => {
      const updatedCharacters: any = characters.filter(
        (_: any, i: any) => i !== index
      );
      setCharacters(updatedCharacters);
    };

    const handleEditCharacter = (index: any, character: any) => {
      const updatedCharacters: any = characters.map((c: any, i: any) =>
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
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                setNewCharacter({
                  ...newCharacter,
                  image: reader.result as string,
                });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <button onClick={handleAddCharacter}>追加</button>

        {/* Character List */}
        {characters.map((char: any, index: any) => (
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

        {true && (
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
      {false && <CharactersInput />}
      {/* Display Options Accordion */}
      {/* ... Implement accordion with checkboxes for display options ... */}
      {false && <DisplayOptionsAccordion />}
      {/* Existing Save and Cancel Buttons */}
    </div>
  );
};

export default SettingSidebar;
