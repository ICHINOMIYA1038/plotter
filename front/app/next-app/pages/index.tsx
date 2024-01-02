import Tiptap from "@/components/tiptap";
import { useEffect, useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    const handleWheel = (e: any) => {
      if (e.deltaY === 0) return;
      window.scrollBy({ left: e.deltaY, behavior: "smooth" });
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="">
      <Tiptap setContent={setContent} />
    </div>
  );
}
