import {
  faBook,
  faBookmark,
  faComment,
  faHeading,
  faParagraph,
  faPen,
  faUser,
  faVolumeUp,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";

// タイプ名と対応する日本語をマッピングするオブジェクト
export const typeToJapanese: any = {
  characters: "登場人物",
  paragraph: "標準",
  "heading-1": "タイトル",
  "heading-2": "シーン",
  "heading-3": "ト書き",
  "heading-4": "作者名",
  "heading-5": "登場人物",
  serif: "セリフ",
  speaker: "話者",
  speechContent: "発言内容",
  // 他のタイプに対する日本語も追加
};

export const typeToIcon = {
  characters: faPerson,
  paragraph: faParagraph,
  "heading-1": faHeading,
  "heading-2": faPen,
  "heading-3": faBookmark,
  "heading-4": faUser,
  serif: faComment,
  speaker: faVolumeUp,
  speechContent: faComment,
  // 他のタイプに対するアイコンも追加
};
