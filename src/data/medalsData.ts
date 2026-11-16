export interface MedalData {
  id: number;
  title: string;
  desc: string;
  iconSrc?: string;
  bgColor?: string;
  strokeColor?: string;
  borderColor?: string;
}

export const MEDALS_DATA: Record<number, MedalData> = {
  1: {
    id: 1,
    title: "สมบูรณ์แบบ",
    desc: "ผ่านภารกิจ \"รังสรรค์เมืองไร้มลทิน\" โดยมีทุกค่าสถานะมากกว่า 50% ขึ้นไป",
    iconSrc: "/images/medals/Healthy.png",
    bgColor: "#fe6557",
    strokeColor: "#d7d7d7",
  },
  2: {
    id: 2,
    title: "อย่าเลยเพื่อน!",
    desc: "แนะนำเพื่อนรัก \"ทินกร\" ให้ไปในทางที่ดี",
    iconSrc: "/images/medals/Stop.png",
    bgColor: "#e4e4e4",
    strokeColor: "#c01c1c",
  },
  3: {
    id: 3,
    title: "คลังความรู้",
    desc: "เปิดอ่านคู่มือเริ่มต้นจนจบเล่ม",
    iconSrc: "/images/medals/Book.png",
    bgColor: "#F0C37B",
    strokeColor: "#474170",
  },
  4: {
    id: 4,
    title: "เหรียญที่ 4",
    desc: "ได้รับโดยการ ผ่านภารกิจที่ 4",
    iconSrc: "/images/Apple_Icon.png",
    bgColor: "#ed8936",
    strokeColor: "#7c3a0e",
  },
  5: {
    id: 5,
    title: "เหรียญที่ 5",
    desc: "ได้รับโดยการ ผ่านภารกิจที่ 5",
    iconSrc: "/images/Apple_Icon.png",
    bgColor: "#9f7aea",
    strokeColor: "#442b79",
  },
  6: {
    id: 6,
    title: "เหรียญที่ 6",
    desc: "ได้รับโดยการ ผ่านภารกิจที่ 6",
    iconSrc: "/images/Apple_Icon.png",
    bgColor: "#ed64a6",
    strokeColor: "#70244d",
  },
  7: {
    id: 7,
    title: "เหรียญที่ 7",
    desc: "ได้รับโดยการ ผ่านภารกิจที่ 7",
    iconSrc: "/images/Apple_Icon.png",
    bgColor: "#38b2ac",
    strokeColor: "#17504d",
  },
  8: {
    id: 8,
    title: "เหรียญที่ 8",
    desc: "ได้รับโดยการ ผ่านภารกิจที่ 8",
    iconSrc: "/images/Apple_Icon.png",
    bgColor: "#f56565",
    strokeColor: "#7b1d1d",
  },
  9: {
    id: 9,
    title: "เหรียญที่ 9",
    desc: "ได้รับโดยการ ผ่านภารกิจที่ 9",
    iconSrc: "/images/Apple_Icon.png",
    bgColor: "#ecc94b",
    strokeColor: "#745e12",
  },
  10: {
    id: 10,
    title: "เหรียญที่ 10",
    desc: "ได้รับโดยการ ผ่านภารกิจที่ 10",
    iconSrc: "/images/Apple_Icon.png",
    bgColor: "#667eea",
    strokeColor: "#2b3b75",
  },
  11: {
    id: 11,
    title: "เหรียญที่ 11",
    desc: "ได้รับโดยการ ผ่านภารกิจที่ 11",
    iconSrc: "/images/Apple_Icon.png",
    bgColor: "#a0aec0",
    strokeColor: "#4a5568",
  },
  12: {
    id: 12,
    title: "เหรียญที่ 12",
    desc: "ได้รับโดยการ ผ่านภารกิจที่ 12",
    iconSrc: "/images/Apple_Icon.png",
    bgColor: "#e53e3e",
    strokeColor: "#631717",
  },
  13: {
    id: 13,
    title: "เหรียญที่ 13",
    desc: "ได้รับโดยการ ผ่านภารกิจที่ 13",
    iconSrc: "/images/Apple_Icon.png",
    bgColor: "#dd6b20",
    strokeColor: "#652b08",
  },
  14: {
    id: 14,
    title: "เหรียญที่ 14",
    desc: "ได้รับโดยการ ผ่านภารกิจที่ 14",
    iconSrc: "/images/Apple_Icon.png",
    bgColor: "#319795",
    strokeColor: "#134e4a",
  },
};
