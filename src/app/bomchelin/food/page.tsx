import type { Metadata } from "next";

import { EditorialScaffold } from "@/components/EditorialScaffold";

export const metadata: Metadata = {
  title: "봄슐랭 맛집",
  description: "지역별 맛집을 쉽고 편하게 둘러볼 수 있는 마사지봄 봄슐랭 가이드입니다.",
  alternates: { canonical: "/bomchelin/food" },
  robots: { index: false, follow: true },
};

export default function FoodPage() {
  return <EditorialScaffold kind="food" />;
}
