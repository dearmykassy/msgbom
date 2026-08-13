export type AreaDirectoryCard = {
  key: string;
  name: string;
  shortName: string;
  path: string;
  imageKey: string;
  availability: "active" | "development";
  scopeLabel: string;
  areaKind: "province" | "city";
};

/** Customer-facing directory: the original three regions plus eight requested cities. */
export const AREA_DIRECTORY_CARDS: ReadonlyArray<AreaDirectoryCard> = [
  {
    key: "seoul",
    name: "서울특별시",
    shortName: "서울",
    path: "/areas/seoul",
    imageKey: "seoul",
    availability: "active",
    scopeLabel: "25개 구",
    areaKind: "province",
  },
  {
    key: "incheon",
    name: "인천광역시",
    shortName: "인천",
    path: "/areas/incheon",
    imageKey: "incheon",
    availability: "active",
    scopeLabel: "11개 군·구",
    areaKind: "province",
  },
  {
    key: "gyeonggi",
    name: "경기도",
    shortName: "경기",
    path: "/areas/gyeonggi",
    imageKey: "gyeonggi",
    availability: "active",
    scopeLabel: "31개 시·군",
    areaKind: "province",
  },
  {
    key: "cheonan",
    name: "천안시",
    shortName: "천안",
    path: "/areas/cheonan",
    imageKey: "cheonan",
    availability: "active",
    scopeLabel: "2개 구 · 25개 지역",
    areaKind: "city",
  },
  {
    key: "asan",
    name: "아산시",
    shortName: "아산",
    path: "/areas/asan",
    imageKey: "asan",
    availability: "active",
    scopeLabel: "12개 지역",
    areaKind: "city",
  },
  {
    key: "daejeon",
    name: "대전광역시",
    shortName: "대전",
    path: "/areas/daejeon",
    imageKey: "daejeon",
    availability: "active",
    scopeLabel: "5개 구 · 66개 지역",
    areaKind: "province",
  },
  {
    key: "daegu",
    name: "대구광역시",
    shortName: "대구",
    path: "/areas/daegu",
    imageKey: "daegu",
    availability: "active",
    scopeLabel: "9개 군·구 · 86개 지역",
    areaKind: "province",
  },
  {
    key: "gumi",
    name: "구미시",
    shortName: "구미",
    path: "/areas/gumi",
    imageKey: "gumi",
    availability: "active",
    scopeLabel: "23개 지역",
    areaKind: "city",
  },
  {
    key: "pohang",
    name: "포항시",
    shortName: "포항",
    path: "/areas/pohang",
    imageKey: "pohang",
    availability: "active",
    scopeLabel: "2개 구 · 29개 지역",
    areaKind: "city",
  },
  {
    key: "busan",
    name: "부산광역시",
    shortName: "부산",
    path: "/areas/busan",
    imageKey: "busan",
    availability: "active",
    scopeLabel: "16개 군·구 · 105개 지역",
    areaKind: "province",
  },
  {
    key: "jeju",
    name: "제주특별자치도",
    shortName: "제주",
    path: "/areas/jeju",
    imageKey: "jeju",
    availability: "active",
    scopeLabel: "2개 행정시 · 39개 지역",
    areaKind: "province",
  },
] as const;
