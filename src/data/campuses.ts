import cityWashington from "@/assets/images/city-washington.jpg";
import cityAtlanta from "@/assets/images/city-atlanta.jpg";
import citySeattle from "@/assets/images/city-seattle.jpg";
import cityBayArea from "@/assets/images/city-bay-area.jpg";

export type CampusStatus = "Registration Open" | "Coming Soon";

export interface AgendaItem {
  /** Optional clock time, e.g. "8:30 AM". Omitted until confirmed. */
  time?: string;
  title: string;
  desc: string;
}

export interface CampusDay {
  label: string;
  subtitle: string;
  /** Optional overall window, e.g. "8:30 AM – 5:00 PM". */
  hours?: string;
  items: AgendaItem[];
}

export interface CampusVenue {
  name: string;
  address?: string;
  neighborhood?: string;
  gettingThere?: string;
  parking?: string;
  hotels?: string;
}

export interface CampusDetail {
  /** Detail page is reachable but unlinked from nav, cards and sitemap. */
  draft: boolean;
  overnight?: string;
  nearestAirport?: string;
  dressCode?: string;
  mealsIncluded?: string;
  venue?: CampusVenue;
  nonprofit?: { name?: string; description: string };
  days?: CampusDay[];
}

export interface Campus {
  slug: string;
  city: string;
  dates: string;
  status: CampusStatus;
  statusColor: string;
  text: string;
  image: string;
  campusValue: string;
  deadline?: string;
  detail?: CampusDetail;
}

export const campuses: Campus[] = [
  {
    slug: "washington-dc",
    city: "Washington, DC",
    dates: "September 24–25, 2026",
    status: "Registration Open",
    statusColor: "bg-green-600",
    text: "A campus in partnership with Nestlé USA.\u00A0",
    image: cityWashington,
    campusValue: "Washington, DC — September 24–25, 2026",
    deadline: "August 21, 2026",
    detail: {
      draft: true,
    },
  },
  {
    slug: "atlanta",
    city: "Atlanta, GA",
    dates: "October 7–8, 2026",
    status: "Registration Open",
    statusColor: "bg-green-600",
    text: "A campus in partnership with Kilpatrick Townsend.",
    image: cityAtlanta,
    campusValue: "Atlanta — October 7–8, 2026",
    deadline: "September 4, 2026",
  },
  {
    slug: "seattle",
    city: "Seattle, WA",
    dates: "October 21–22, 2026",
    status: "Registration Open",
    statusColor: "bg-green-600",
    text: "A campus in partnership with Adobe.",
    image: citySeattle,
    campusValue: "Seattle — October 21–22, 2026",
    deadline: "September 18, 2026",
  },
  {
    slug: "san-francisco-bay-area",
    city: "San Francisco Bay Area, CA",
    dates: "May 19–20, 2027",
    status: "Coming Soon",
    statusColor: "bg-mustard",
    text: "In development for the Bay Area. Express interest to be notified when registration opens.",
    image: cityBayArea,
    campusValue: "San Francisco Bay Area — May 19–20, 2027",
  },
];

export const getCampus = (slug?: string) => campuses.find((c) => c.slug === slug);
