import { useEffect, useState } from "react";

export const SettingSidebar = () => {
  const [projectName, setProjectName] = useState("");
  const [showFileInput, setShowFileInput] = useState(false);
  const [showFileOutput, setShowFileOutput] = useState(false);
  const [showCharacters, setShowCharacters] = useState(false);

  // Add states for display options if needed

  // Load project name from local storage
  useEffect(() => {
    const savedName = localStorage.getItem("projectName");
    if (savedName) {
      setProjectName(savedName);
    }
  }, []);

  // Save project name to local storage
  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
    localStorage.setItem("projectName", e.target.value);
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="text-lg font-semibold text-gray-700">エディタ設定</div>
      {/* Project Name Input */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-600">
          プロジェクト名
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
      <div className="flex justify-end space-x-2">
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded">
          キャンセル
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          保存
        </button>
      </div>
    </div>
  );
};

export default SettingSidebar;

const FileInputAccordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-medium text-gray-600"
      >
        ファイル入力
      </button>

      {isOpen && (
        <div className="flex flex-col space-y-2 mt-2">
          <label>JSON</label>
          <input type="file" accept=".json" />
          <label>WORD (作成中)</label>
          <input type="file" accept=".doc,.docx" disabled />
          <label>PDF (作成中)</label>
          <input type="file" accept=".pdf" disabled />
        </div>
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
          <button>JSON</button>
          <button>PDF</button>
          <button>TEXT</button>
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
