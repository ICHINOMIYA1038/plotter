import { useState } from "react";

const BubbleMenuButton = () => {
  return (
<div class="fixed bottom-10 right-10">
  <button class="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600">
    <!-- メインボタンのアイコン -->
  </button>

  <!-- メニュー項目 -->
  <div class="mt-3 space-y-2">
    <button class="flex items-center justify-center w-10 h-10 bg-white text-gray-600 rounded-full shadow">
      <!-- アイコン1 -->
    </button>
    <button class="flex items-center justify-center w-10 h-10 bg-white text-gray-600 rounded-full shadow">
      <!-- アイコン2 -->
    </button>
    <!-- 他のメニュー項目 -->
  </div>
</div>
  );
};

export default Editor;
