export default function Home() {
    return (
      <div className="container mx-auto px-4">
        <div className="columns-2 column-gap-8" style={{ maxHeight: '600px', overflow: 'auto', overflowWrap: "normal", writingMode: 'vertical-rl' }}>
          <div>
            <p>ここに縦書きのコンテンツ1...</p>
            <p>あいうえおaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaffsfssa</p>
            <p>かきくけこ</p>
            <p>さしすせそ</p>
            <p>たちつてと</p>
            <p>なにぬねの</p>
            <p>はひふへほ</p>
            <p>まみむめも</p>
            <p>やゆよ</p>
            <p>らりるれろ</p>
            <p>わをん</p>

            {/* その他の縦書きコンテンツ */}
          </div>
          <div>
            <p>ここに縦書きのコンテンツ2...</p>
            {/* その他の縦書きコンテンツ */}
          </div>
        </div>
      </div>
    );
  }