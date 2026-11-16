export interface MissionLevelData {
  id: number;
  header: string;
  image: string;
  desc: string;
  highlightText?: string;
  bannerImage?: string;
  imageClassName?: string;
}

export const MISSIONS_DATA: MissionLevelData[] = [
  {
    id: 0,
    header: "คู่มือเริ่มต้น: รู้ทันสารเสพติด",
    image: "/images/Level_Book.png",
    desc: "อ่านเนื้อหาเกี่ยวกับพิษภัยของบุหรี่และบุหรี่ไฟฟ้าเพื่อเตรียมความพร้อมสำหรับภารกิจต่อไป",
    highlightText: "สามารถกลับมาอ่านซ้ำได้นะ!",
    bannerImage: "/images/Banner_Purple.svg",
    imageClassName: "object-cover object-center scale-110",
  },
  {
    id: 1,
    header: "การกิจที่ 1: ยังไม่มีชื่อ",
    image: "/images/Level_Book.png",
    desc: "อ่านเนื้อหาเกี่ยวกับพิษภัยของบุหรี่และบุหรี่ไฟฟ้าเพื่อเตรียมความพร้อมสำหรับภารกิจต่อไป",
    highlightText: "สามารถกลับมาอ่านซ้ำได้นะ!",
    imageClassName: "object-cover object-center scale-110",
  },
  {
    id: 2,
    header: "การกิจที่ 2: ถอดรหัสลับ",
    image: "/images/Level_Wordle.png",
    desc: "อ่านเนื้อหาเกี่ยวกับพิษภัยของบุหรี่และบุหรี่ไฟฟ้าเพื่อเตรียมความพร้อมสำหรับภารกิจต่อไป",
    highlightText: "สามารถกลับมาอ่านซ้ำได้นะ!",
    imageClassName: "object-cover object-[50%_75%]",
  },
  {
    id: 3,
    header: "การกิจที่ 3: วิทยาลัยไร้มลทิน",
    image: "/images/Level_School.png",
    desc: "อ่านเนื้อหาเกี่ยวกับพิษภัยของบุหรี่และบุหรี่ไฟฟ้าเพื่อเตรียมความพร้อมสำหรับภารกิจต่อไป",
    highlightText: "สามารถกลับมาอ่านซ้ำได้นะ!",
    imageClassName: "object-cover object-center scale-110",
  },
  {
    id: 4,
    header: "การกิจที่ 4: ยังไม่มีชื่อ",
    image: "/images/Level_Book.png",
    desc: "อ่านเนื้อหาเกี่ยวกับพิษภัยของบุหรี่และบุหรี่ไฟฟ้าเพื่อเตรียมความพร้อมสำหรับภารกิจต่อไป",
    highlightText: "สามารถกลับมาอ่านซ้ำได้นะ!",
    imageClassName: "object-cover object-center scale-110",
  },
  {
    id: 5,
    header: "การกิจที่ 5: ยังไม่มีชื่อ",
    image: "/images/Level_Book.png",
    desc: "อ่านเนื้อหาเกี่ยวกับพิษภัยของบุหรี่และบุหรี่ไฟฟ้าเพื่อเตรียมความพร้อมสำหรับภารกิจต่อไป",
    highlightText: "สามารถกลับมาอ่านซ้ำได้นะ!",
    imageClassName: "object-cover object-center scale-110",
  },
];
