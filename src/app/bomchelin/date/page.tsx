import type { Metadata } from "next";

import { EditorialScaffold } from "@/components/EditorialScaffold";

export const metadata: Metadata = {
  title: "데이트 코스",
  description: "이동시간, 체류시간, 예산과 우천 대안을 고려한 마사지봄 봄슐랭 데이트 코스입니다.",
  alternates: { canonical: "/bomchelin/date" },
  robots: { index: false, follow: true },
};

export default function DatePage() {
  return <EditorialScaffold kind="date" />;
}
