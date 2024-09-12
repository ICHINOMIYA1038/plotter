// utils/saveJSONToS3.ts
export async function saveJSONToS3({ oid, content }: { oid: string; content: string }) {
    if (!oid || !content) {
      throw new Error('Both oid and content are required');
    }
  
    try {
      const response = await fetch('/api/s3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oid, content }),
      });
  
      const textResponse = await response.text(); // Read the response as text
      if(textResponse=="Data saved successfully"){
        console.log("保存に成功しました")
      }
    } catch (error) {
      console.error('Error saving data to S3:', error);
      throw error;
    }
  }


  export async function saveContentAsJSON(editor: any) {
    try {
      const content = editor.getJSON();
      localStorage.setItem("editor-json-content", JSON.stringify(content));
      return { success: true };
    } catch (error) {
      console.error("保存中にエラーが発生しました:", error);
      return { success: false, error: error };
    }
  };