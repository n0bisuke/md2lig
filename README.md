## インストール (最初だけ)

```
npm i
```

## 起動

```
node app 
```

推奨

```
pm2 start app.js --name=md2lig
```

## 運用フロー

1. Qiitaの下書きに投稿します。 http://qiita.com/xxxxxxx みたいなURLを用意

2. 

http://hogehoge.com:3005/url?=<ここにQiitaのURL> でブラウザアクセス

例

```
http://hogehoge.com:3005/url?=http://qiita.com/xxxxxxx
```

3. 変換されたHTML情報がブラウザに表示されます。