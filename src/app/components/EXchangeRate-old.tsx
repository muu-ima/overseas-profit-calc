'use client';
import { useEffect, useState } from "react";

export default function ExchageRate() {
    const [rate, setRate] = useState<number | null>(null);


useEffect(() => {
    fetch('https://enyukari.capoo.jp/profit-calc/exchangeRate.json')
    .then(res => res.json())
    .then(data => setRate(data.rate))
    .catch(err => console.error('為替取得エラー', err));
}, []);//第二引数に空配列を入れて一度だけ実行

return(
    <div className="p-4 border rounded">
        <h2 className="text-xl font-bold">現在の為替レート</h2>
        <p>
             GBP → JPY :{rate !==null ? `${rate}円`: '取得中...'}
        </p>
    </div>
 );
}