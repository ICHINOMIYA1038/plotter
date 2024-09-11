## このプロジェクトについて

## DBのマイグレーション
supabaseを利用している。

```
supabase migration new create_users_table
```

タイムスタンプ付きのマイグレーションファイルが生成されるので、

```
npx supabase db reset
```
でマイグレーションを行う。

これによりローカル環境のsupabaseにマイグレーションすることができる。
ローカル環境のsupabaseのGUIは以下で確認することができる。
```
http://127.0.0.1:54323/project/default
```

なお、`npx supabase db reset`は、全てのテーブルを一旦削除した上ですべてのマイグレーションファイルを実行します。 
すなわち、データベース自体を削除して再構築するコマンドになります。

そのため、もし開発中のアプリを通して投入したデータも削除されてしまいます。
もし新しく作成したマイグレーションファイルだけを実行したい場合は、以下のように`npx supabase migration up`を使用します。

また、`supabase/seed.sql`にシードデータを入れておくと、`npx supabase db reset`の際にデータが再生成される。


``` シードデータの例
insert into users
  (nickname, first_name, last_name, first_name_kana, last_name_kana, email)
values
  ('テスト名', '太郎','Supabase', 'Tarou','upabase', 'test1@example.com'),
  ('テスト名2', '太郎2','Supabase', 'Tarou2','upabase', 'test2@example.com'),
  ('テスト名3', '太3','Supabase', 'Tarou3','upabase', 'test3@example.com');
```

### リモートに反映させる
プロジェクトの結びつけ。
```
npx supabase link --project-ref xxxxxxxxxxxxxxxxx
```

パスワードを求められた場合、入力する。
環境変数に設定すれば求められなくなるはず。

```
supabase db push
```
でリモートに反映させる。

