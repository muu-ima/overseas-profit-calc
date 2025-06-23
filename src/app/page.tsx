"use client";

import { useEffect, useState } from "react";
import { getCheapestShipping, ShippingData } from "@/lib/shipping";

// 👇 ここに型定義を追加
type ShippingResult = {
  method: string;
  price: number | null;
};

export default function Page() {
  const [shippingRates, setShippingRates] = useState<ShippingData | null>(null);
  const [costPrice, setCostPrice] = useState<number | "">("");
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [dimensions, setDimensions] = useState({
    length: 0,
    width: 0,
    height: 0,
  });
  const [result, setResult] = useState<ShippingResult | null>(null);

  useEffect(() => {
    fetch("/data/shipping.json")
      .then((res) => res.json())
      .then((data) => setShippingRates(data));
  }, []);

  useEffect(() => {
    if (shippingRates && weight > 0) {
      const cheapest = getCheapestShipping(shippingRates, weight, dimensions);
      setResult(cheapest);
    }
  }, [shippingRates, weight, dimensions]);

  return (
    <div>
      <input
        type="number"
        value={costPrice}
        onChange={(e) => {
          const val = e.target.value;
          setCostPrice(val === "" ? "" : Number(val));
        }}
        placeholder="仕入れ値(円)"
      />
      <input
        type="number"
        value={sellingPrice}
        onChange={(e) => setSellingPrice(Number(e.target.value))}
        placeholder="売値(円)"
      />
      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value))}
        placeholder="重量(g)"
      />
    </div>
  );
}
