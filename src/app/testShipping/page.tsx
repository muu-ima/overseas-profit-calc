"use client";

import { useEffect } from 'react';
import { getCheapestShipping, ShippingData } from '@/lib/shipping'; 

export default function TestShipping() {
  useEffect(() => {
    const shippingData: ShippingData = {
      small_packet_air: [
        { weight: 500, price: 1690 },
        { weight: 600, price: 1870 },
        { weight: 1500, price: 3490 },
      ],
      fedex: [
        { weight: 500, price: 3100 },
        { weight: 600, price: 2600 },
        { weight: 1500, price: 3100 },
      ],
      ems: [
        { weight: 500, price: 3300 },
        { weight: 600, price: 3400 },
        { weight: 1500, price: 5500 },
      ],
    };

    const actualWeight = 600;
    const dimensions = { length: 30, width: 20, height: 10 };

    const result = getCheapestShipping(shippingData, actualWeight, dimensions);
    console.log('最安配送方法:', result);
  }, []);

  return <div>コンソールを開いて結果を確認してください</div>;
}
