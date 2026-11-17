export interface MissionLevelData {
  id: number;
  header: string;
  image: string;
  desc: string;
  highlightText?: string;
  bannerImage?: string;
  imageClassName?: string;
  // Button configuration (configurable per mission)
  buttonLabel?: string;
  completedButtonLabel?: string;
  buttonIcon?: string;
  completedButtonIcon?: string;
  buttonVariant?: "yellow" | "blue" | "red" | "gray";
  completedButtonVariant?: "yellow" | "blue" | "red" | "gray";
}

export const MISSIONS_DATA: MissionLevelData[] = [
  {
    id: 0,
    header: "คู่มือเริ่มต้น: รู้ทันสารเสพติด",
    image: "/images/Level_Book.png",
    desc: "อ่านใบความรู้เพื่อเตรียมตัวให้พร้อมก่อนลุยภารกิจและรับตั๋วกิจกรรมฟรีหลังอ่าน!",
    highlightText: "สามารถกลับมาอ่านซ้ำได้นะ!",
    bannerImage: "/images/Banner_Purple.svg",
    imageClassName: "object-cover object-center scale-110",
    buttonLabel: "เปิดอ่าน",
    completedButtonLabel: "อ่านอีกครั้ง",
    buttonIcon: "/images/Hand_Icon.svg",
  },
  {
    id: 1,
    header: "การกิจที่ 1: ยังไม่มีชื่อ",
    image: "/images/Level_Book.png",
    desc: "อ่านใบความรู้เพื่อเตรียมตัวให้พร้อมก่อนลุยภารกิจและรับตั๋วกิจกรรมฟรีหลังอ่าน!",
    highlightText: "สามารถกลับมาอ่านซ้ำได้นะ!",
    imageClassName: "object-cover object-center scale-110",
    buttonLabel: "เริ่มภารกิจ",
    completedButtonLabel: "เล่นซ้ำอีกรอบ",
    buttonIcon: "/images/Hand_Icon.svg",
  },
  {
    id: 2,
    header: "การกิจที่ 2: ถอดรหัสลับ",
    image: "/images/Level_Wordle.png",
    desc: "อ่านใบความรู้เพื่อเตรียมตัวให้พร้อมก่อนลุยภารกิจและรับตั๋วกิจกรรมฟรีหลังอ่าน!",
    highlightText: "สามารถกลับมาอ่านซ้ำได้นะ!",
    imageClassName: "object-cover object-[50%_75%]",
    buttonLabel: "เริ่มถอดรหัส",
    completedButtonLabel: "เล่นซ้ำอีกรอบ",
    buttonIcon: "/images/Key_Icon.svg",
  },
  {
    id: 3,
    header: "การกิจที่ 3: วิทยาลัยไร้มลทิน",
    image: "/images/Level_School.png",
    desc: "อ่านใบความรู้เพื่อเตรียมตัวให้พร้อมก่อนลุยภารกิจและรับตั๋วกิจกรรมฟรีหลังอ่าน!",
    highlightText: "สามารถกลับมาอ่านซ้ำได้นะ!",
    imageClassName: "object-cover object-center scale-110",
    buttonLabel: "เริ่มสำรวจ",
    completedButtonLabel: "เล่นซ้ำอีกรอบ",
    buttonIcon: "/images/Hand_Icon.svg",
  },
  {
    id: 4,
    header: "การกิจที่ 4: ยังไม่มีชื่อ",
    image: "/images/Level_Book.png",
    desc: "อ่านใบความรู้เพื่อเตรียมตัวให้พร้อมก่อนลุยภารกิจและรับตั๋วกิจกรรมฟรีหลังอ่าน!",
    highlightText: "สามารถกลับมาอ่านซ้ำได้นะ!",
    imageClassName: "object-cover object-center scale-110",
    buttonLabel: "เริ่มภารกิจ",
    completedButtonLabel: "เล่นซ้ำอีกรอบ",
    buttonIcon: "/images/Hand_Icon.svg",
  },
  {
    id: 5,
    header: "การกิจที่ 5: ยังไม่มีชื่อ",
    image: "/images/Level_Book.png",
    desc: "อ่านใบความรู้เพื่อเตรียมตัวให้พร้อมก่อนลุยภารกิจและรับตั๋วกิจกรรมฟรีหลังอ่าน!",
    highlightText: "สามารถกลับมาอ่านซ้ำได้นะ!",
    imageClassName: "object-cover object-center scale-110",
    buttonLabel: "เริ่มภารกิจ",
    completedButtonLabel: "เล่นซ้ำอีกรอบ",
    buttonIcon: "/images/Hand_Icon.svg",
  },
];
