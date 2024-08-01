import Link from "next/link";

export const Header = () => {
  return (
    <div className=" h-15vh  px-4 py-2 mx-2 mb-2 items-center justify-end overflow-y-hidden overflow-x-hidden">
      <div className="text-2xl font-bold">戯曲エディタ β版</div>
      <div className="ml-4 text-xs">
        このアプリは開発中です。
        <Link className="text-blue-600 cursor-pointer" href={"/Terms"}>
          免責事項
        </Link>
        をご確認ください。
      </div>
    </div>
  );
};
