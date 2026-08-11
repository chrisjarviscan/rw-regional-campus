import cityWashington from "@/assets/images/city-washington.jpg";
import cityAtlanta from "@/assets/images/city-atlanta.jpg";
import citySeattle from "@/assets/images/city-seattle.jpg";
import cityBayArea from "@/assets/images/city-bay-area.jpg";

export type CampusStatus = "Registration Open" | "Coming Soon";

export interface AgendaItem {
  /** Optional clock time, e.g. "8:30 AM". Omitted until confirmed. */
  time?: string;
  title: string;
  desc?: string;
}

export interface CampusDay {
  label: string;
  subtitle: string;
  /** Optional overall window, e.g. "8:30 AM – 5:00 PM". */
  hours?: string;
  items: AgendaItem[];
}

export interface CampusHotel {
  name: string;
  address?: string;
  walk?: string;
}

export interface CampusVenue {
  name: string;
  address?: string;
  neighborhood?: string;
  gettingThere?: string;
  parking?: string;
  hotels?: string;
  hotelList?: CampusHotel[];
  hotelNote?: string;
}

export interface CampusDetail {
  /** Detail page is reachable but unlinked from nav, cards and sitemap. */
  draft: boolean;
  overnight?: string;
  nearestAirport?: string;
  dressCode?: string;
  /** Start/end window for each day, shown at a glance. */
  dayTimes?: { label: string; window: string }[];
  mealsIncluded?: string;
  venue?: CampusVenue;
  nonprofit?: { name?: string; url?: string; short?: string; description: string };
  /** Short "what to expect" bullets shown before the agenda. */
  whatToExpect?: { title: string; desc: string }[];
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
      draft: false,
      dayTimes: [
        { label: "Day 1", window: "8:30 AM – 5:00 PM" },
        { label: "Day 2", window: "8:30 AM – 3:30 PM" },
      ],
      overnight: "Most out-of-town participants choose to stay the night before Day 1 and the evening of Day 2 or the following day. As this is designed as a regional experience, there are no room blocks. However, there are three hotels within a 5–10 minute walk that are listed below.",
      nearestAirport:
        "Reagan National (DCA) — 10–15 minutes by car, or Blue Line direct to Rosslyn. Dulles (IAD) — 30–40 minutes by car, or Silver Line direct in 50–55 minutes.",
      mealsIncluded: "Morning coffee and refreshments, lunch on both days, all materials, and travel to and from the off-site volunteer experience. Travel and accommodation are not included.",
      dressCode:
        "Day 1: comfortable clothes you don't mind getting dirty, including closed-toe shoes required. Day 2: casual to business casual.",
      venue: {
        name: "Nestlé USA HQ",
        address: "1812 N Moore St, Arlington, VA 22209",
        neighborhood: "Rosslyn, Arlington, VA — across the river from DC",
        gettingThere:
          "Rosslyn Metro (Blue, Orange, and Silver lines) sits steps from the door at Wilson Blvd and N Moore St. Driving? Colonial Parking is at 1700 N Moore St, on the same street across from the venue, around $15 a day.",
        hotelNote:
          "Three nearby hotels shared by our host, Nestlé. There's no room block, so book directly and confirm current rates.",
        hotelList: [
          { name: "Hilton Arlington Rosslyn, The Key", address: "1900 Fort Myer Dr", walk: "5 min walk" },
          { name: "Hyatt Centric Arlington", address: "1325 Wilson Blvd", walk: "5–10 min walk" },
          { name: "Homewood Suites by Hilton", address: "1900 Quinn St", walk: "10 min walk" },
        ],
      },
      nonprofit: {
        name: "Arcadia Center for Sustainable Food & Agriculture",
        url: "https://www.arcadiafood.org/",
        short: "A hands-on afternoon at Arcadia's farm in Alexandria, VA.",
        description:
          "Arcadia is a Washington-area nonprofit working to rebuild the regional food system from the ground up. Its Mobile Markets bring locally grown produce into DC neighborhoods that have lost their grocery stores, with prices set so federal nutrition benefits go further; its Veteran Farmer Program trains former service members to run their own farms; and its education and camp programs bring children onto the land to learn where food comes from. Much of that food is grown on Arcadia's own farm, where we'll spend Day 1's afternoon.\n\nThe volunteer experience is a structured, hands-on outdoor project — work such as building a farm stand and rebuilding the farm's raised garden beds — designed, briefed, and debriefed the way you'll lead one at home. The cohort travels together by bus and returns together.",
      },
      whatToExpect: [
        {
          title: "You'll be doing, not sitting",
          desc: "Both days run as facilitated working sessions with a cohort of roughly 40 peers from up to 8 companies. Expect small groups, real scenarios from your own program, and very little lecture.",
        },
        {
          title: "Day 1 goes off-site and outdoors",
          desc: "The afternoon is spent at Arcadia's farm doing physical outdoor work. Wear clothes you don't mind getting dirty and closed-toe shoes; bring a water bottle, sunscreen, and a layer for the weather.",
        },
        {
          title: "Bring your own program",
          desc: "Day 2's peer design workshop works best when you arrive with a real challenge — an event you're planning, a group you can't reach, a case you need to make to leadership.",
        },
        {
          title: "You'll meet ambassadors from other companies",
          desc: "The cohort stays together across both days, meals included, so you're working alongside the same group of volunteer leaders the whole time. Most people leave with a set of peers outside their own company they keep comparing notes with long after the campus ends.",
        },
      ],
      days: [
        {
          label: "Day 1",
          subtitle: "FOUNDATION & IMMERSION",
          hours: "Wednesday, September 24",
          items: [
            { time: "8:30 AM", title: "Arrival and coffee", desc: "Check in, grab coffee, and connect with fellow participants before the day begins." },
            { time: "9:00 AM", title: "Welcome and community building", desc: "Meet your cohort — peers from across companies and industries — and ground the two days in what matters to your work." },
            { time: "9:45 AM", title: "What is Transformative Volunteering, and why it matters", desc: "The shift from one-off activity to experiences that change how people see their work, their company, and their community." },
            { time: "10:20 AM", title: "Break", desc: "" },
            { time: "10:35 AM", title: "Learning modules", desc: "Short, practical sessions on the building blocks of a transformative experience — sense-making, the brief, the debrief, and proximity." },
            { time: "11:55 AM", title: "Lunch, provided", desc: "" },
            { time: "12:25 PM", title: "Volunteer experience at Arcadia Farm (off-site)", desc: "A hands-on farm build project. We travel together by bus and return together." },
            { time: "4:45 PM", title: "Return and closing reflection", desc: "Head back, decompress, and close the day with a short reflection." },
            { time: "5:00 PM", title: "End of Day 1", desc: "Your evening is your own. Day 2 begins at 8:30 AM." },
          ],
        },
        {
          label: "Day 2",
          subtitle: "APPLICATION & INTEGRATION",
          hours: "Thursday, September 25",
          items: [
            { time: "8:30 AM", title: "Coffee and informal connection", desc: "Reconvene with your cohort and share what surfaced overnight." },
            { time: "9:00 AM", title: "Community debrief", desc: "Turn yesterday's experience into shared insight — name what landed, and what you're still sitting with." },
            { time: "10:00 AM", title: "Peer design workshop", desc: "Bring your own program. Work it with peers who've done this and get concrete, generous feedback." },
            { time: "11:30 AM", title: "Lunch, provided", desc: "" },
            { time: "12:15 PM", title: "From experience to leadership skills", desc: "Translate what you do as a volunteer leader into named professional competencies, and language you can take to your manager." },
            { time: "1:30 PM", title: "Tell the story and make the case", desc: "Build a short, compelling way to communicate your program's value to leadership, using both data and story." },
            { time: "2:30 PM", title: "Cohort commitments and what comes next", desc: "Name one concrete action you'll take in the next 30 days, and see how the cohort stays connected." },
            { time: "3:15 PM", title: "Certification and closing", desc: "Celebrate the work, receive your certificate of completion, and close the campus together." },
            { time: "3:30 PM", title: "Adjourn", desc: "An earlier close on travel day." },
          ],
        },
      ],
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
