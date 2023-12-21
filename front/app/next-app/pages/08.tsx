import dynamic from "next/dynamic";

const Editor = dynamic(import("../components/Editor/index"), { ssr: false });

export default function Home() {
  return (
    <div className='container'>
      <Editor />
    </div>
  );
}