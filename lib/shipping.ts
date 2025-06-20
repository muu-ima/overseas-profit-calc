// /lib/shipping.ts

import { Preahvihear } from "next/font/google";

export type ShippingOption = {
    weight: number;
    price: number;
};

export type ShippingData = {
    small_packet_air: ShippingOption[];
    fedex: ShippingOption[];
    ems: ShippingOption[];
};

export function findPriceByWeight(options: ShippingOption[], weight: number): number | null {
    for (const option of options) {
        if (weight <= option.weight) return option.price;
    }
    return options.length > 0 ? options[options.length - 1].price : null;
}

/**
 * 容積重量の計算
 * @param length 長さ (cm)
 * @param width 幅 (cm)
 * @param height 高さ (cm)
 * @param divisor 係数 (通常は5000)
 */
 export function calculateDimensionalWeight(length: number, width:number, height:number, divisor:number = 5000): number {
    return (length * width * height) / divisor;
 }

 /**
  * 最も安い配送方法を取得
  * @param data 配送データ
  * @param actualWeight 実重量
  * @param dimensions 寸法(長さ、幅、高さ)
  */

 export function getCheapestShipping(
    data: ShippingData,
    actualWeight: number,
    dimensions: { length: number; width: number; height: number;},
    divisor: number = 5000
 ) {
    const dimensionalWeight = calculateDimensionalWeight(dimensions.length, dimensions.width, dimensions.height, divisor);
    const applicableWeight = Math.max(actualWeight, dimensionalWeight);

    const smallPacketPrice = findPriceByWeight(data.small_packet_air, applicableWeight);
    const fedexPrice = findPriceByWeight(data.fedex, actualWeight);
    const emsPrice = findPriceByWeight(data.ems, actualWeight);

    const prices = [
        { method: 'small_packet_air', price: smallPacketPrice},
        { method: 'fedex', price: fedexPrice},
        { method: 'ems', price: emsPrice},
    ].filter(p => p.price !== null);

    if (prices.length === 0) return null;

    return prices.reduce((prev,curr) =>
    curr.price! < prev.price!? curr:prev
  );
 }