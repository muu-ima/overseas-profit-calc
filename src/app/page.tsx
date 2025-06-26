"use client";

import { useEffect, useState } from "react";
import { getCheapestShipping, ShippingData } from "@/lib/shipping";
import ExchangeRate  from "./components/ExchangeRate";
import Result from "./components/Result";
import {
  calculateCategoryFee,
  convertShippingPriceToJPY,
  calculateActualCost,
  calculateGrossProfit,
  calculateProfitMargin,
} from "@/lib/profitCalc";
import { Shippori_Antique } from "next/font/google";

// ここから型定義を追加
type ShippingResult = {
  method: string;
  price: number | null;
};

type CategoryFeeType = {
  label: string;
  value: number;
  categories: string[];
};

type CalcResult = {
  shippingJPY: number,
  categoryFeeJPY: number;
  actualCost: number;
  grossProfit: number;
  profitMargin: number;
  method: string;
}

export default function Page() {
  const [shippingRates, setShippingRates] = useState<ShippingData | null>(null);
  const [costPrice, setCostPrice] = useState<number | "">("");
  const [sellingPrice, setSellingPrice] = useState<number | "">("");
  const [weight, setWeight] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({
    length: 0,
    width: 0,
    height: 0,
  });
  const [rate, setRate] = useState<number | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<CategoryFeeType[]>([]);
  const [selectedCategoryFee, setSelectedCategoryFee] = useState<number | "">(
    ""
  );
  const [result, setResult] = useState<ShippingResult | null>(null);
  const [calcResult, setCalcResult] = useState<CalcResult | null>(null);

  useEffect(() => {
    fetch("/data/shipping.json")
      .then((res) => res.json())
      .then((data) => setShippingRates(data));
  }, []);

  // 計算結果用のuseEffect
  useEffect(() => {
    if(
      sellingPrice !=="" &&
      costPrice !=="" &&
      rate !== null &&
      weight !== null &&
      result !== null &&
      result .price !== null &&
      selectedCategoryFee !==""
    ){
      //配送料JPYに換算
      const shippingJPY = convertShippingPriceToJPY(result.price, rate);

      //カテゴリ手数料JPY計算
      const categoryFeeJPY = calculateCategoryFee(
        typeof sellingPrice === "number" ? sellingPrice:0,
        typeof selectedCategoryFee === "number" ? selectedCategoryFee:0
      );

      //実費合計
      const actualCost = calculateActualCost(
        typeof costPrice === "number" ? costPrice : 0,
        shippingJPY,
        categoryFeeJPY
      );
      //粗利計算
      const grossProfit = calculateGrossProfit(
        typeof sellingPrice === "number" ? sellingPrice:0,
        actualCost
      );
      //利益率計算
      const profitMargin = calculateProfitMargin(grossProfit, 
        typeof sellingPrice === "number" ? sellingPrice : 0
      );
      
      setCalcResult({
        shippingJPY,
        categoryFeeJPY,
        actualCost,
        grossProfit,
        profitMargin,
        method: result.method,
      });
    }
  })

  useEffect(() => {
    fetch("/data/categoryFees.json")
      .then((res) => res.json())
      .then((data) => setCategoryOptions(data));
  }, []);

  useEffect(() =>{
    if (rate !== null) {
      console.log(`最新為替レート：, rate`);
    }
  },[rate]);

  useEffect(() => {
    if (shippingRates && weight !== null && weight > 0) {
      const cheapest = getCheapestShipping(shippingRates, weight, dimensions);
      setResult(cheapest);
    }
  }, [shippingRates, weight, dimensions]);

  return (
    <div className="p-4 max-w-sm mx-auto flex flex-col space-y-4">
          {/* 為替レート表示コンポーネント */}
    <ExchangeRate onRateChange={setRate} />
      <input
        type="number"
        value={costPrice}
        onChange={(e) => {
          const val = e.target.value;
          setCostPrice(val === "" ? "" : Number(val));
        }}
        placeholder="仕入れ値(円)"
        className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="number"
        value={sellingPrice}
        onChange={(e) => {
          const val = e.target.value;
          setSellingPrice(val === "" ? "" : Number(val));
        }}
        placeholder="売値(円)"
        className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="number"
        value={weight ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          setWeight(val === "" ? null : Number(val));
        }}
        placeholder="実容量(g)"
        className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="number"
        value={dimensions.length === 0 ? "" : dimensions.length}
        onChange={(e) =>
          setDimensions((prev) => ({ ...prev, length: Number(e.target.value) }))
        }
        placeholder="長さ(cm)"
        className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="number"
        value={dimensions.width === 0 ? "" : dimensions.width}
        onChange={(e) =>
          setDimensions((prev) => ({ ...prev, width: Number(e.target.value) }))
        }
        placeholder="幅(cm)"
        className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="number"
        value={dimensions.height === 0 ? "" : dimensions.height}
        onChange={(e) =>
          setDimensions((prev) => ({ ...prev, height: Number(e.target.value) }))
        }
        placeholder="高さ(cm)"
        className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <select
        value={selectedCategoryFee}
        onChange={(e) => setSelectedCategoryFee(Number(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">カテゴリを選択してください</option>
        {categoryOptions.map((cat) => (
          <option key={cat.label} value={cat.value}>
            {cat.label} ({cat.value}%)
          </option>
        ))}
      </select>

      {rate !== null && sellingPrice !== "" && (
        <Result
          priceGBP={typeof sellingPrice === "number" ? sellingPrice / rate:0}
          rate={rate}
          includeVAT={true} //または切り替え機能を後から追加
          calcResult={calcResult}
        />
      )}
    </div>
  );
}
