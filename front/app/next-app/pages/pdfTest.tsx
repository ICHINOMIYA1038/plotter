import Tiptap from "@/components/tiptap";
import { useEffect, useState } from "react";

export default function Home() {
    const [content, setContent] = useState("");
    const [data, setData] = useState("");

    return (
        <div className="">
            <Tiptap setContent={setContent} />
        </div>
    );
}
