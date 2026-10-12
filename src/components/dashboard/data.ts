export type Confidence = 'High' | 'Watch'
export interface NavItem { label: string; icon: string; href: string; active?: boolean; chevron?: boolean }
export interface NavGroup { label: string; items: NavItem[] }
export interface ContestTile { label: string; value: number; icon: string }
export interface Opportunity { id: number; name: string; confidence: Confidence; title: string; detail: string }
export interface GrowthPlay { id: number; level: 'HIGH'; before: string; name: string; after: string; confidence: number; detail: string }
export interface HubPost { category: string; when: string; title: string }
export interface Course { title: string; done: number; total: number }

export const user = { first: 'Tree', full: 'Tree Root', id: 1, rank: 'Diamond', initials: 'CH' }

export const navGroups: NavGroup[] = [
  { label: 'My Plexus', items: [
    { label: 'Dashboard', icon: 'home', href: '/dashboard', active: true },
    { label: 'Playbook', icon: 'book', href: '#' },
    { label: 'Pulse Check', icon: 'heart', href: '#' },
    { label: 'My Business', icon: 'briefcase', href: '#' },
    { label: 'GeoPulse', icon: 'globe', href: '#' },
    { label: 'Points & Rank', icon: 'award', href: '#' },
    { label: 'CRM', icon: 'users', href: '#' },
    { label: 'My Inbox', icon: 'inbox', href: '#' },
    { label: '360 Journey', icon: 'refresh', href: '#' },
    { label: 'Sharing Plexus', icon: 'share', href: '#' },
    { label: 'Genealogy', icon: 'network', href: '#' },
    { label: 'Recognition', icon: 'star', href: '#' },
    { label: 'Reports', icon: 'chart', href: '#', chevron: true },
  ]},
  { label: 'Learn Plexus', items: [
    { label: 'Plexus Live', icon: 'video', href: '#' },
    { label: 'Plexus U', icon: 'grad', href: '#' },
    { label: 'Plexus Hub', icon: 'layers', href: '#' },
    { label: 'My Account', icon: 'user', href: '#' },
  ]},
  { label: 'Admin', items: [{ label: 'Contest Admin', icon: 'trophy', href: '#' }] },
]

export const briefing = {
  before: "Your team's at 5939 points right now, and it looks like you're on track to hit around 26193 by the end of the month! Let's make sure ",
  name: 'Addison King',
  after: "'s subscription is secure; a quick check-in could make all the difference since their PV is a bit low and there's a chance they might pause or cancel. Addison is someone worth reaching out to this week, especially with their subscription possibly lapsing soon. Don't forget to keep earning points in the Rising Leaders Contest!",
}

export const contest = {
  name: 'Rising Leaders Contest', dates: 'Jul 1 – Oct 31, 2026', points: 223548, tier: 'Trailblazer', progress: 100,
  tiles: [
    { label: 'New Enrollment (100+ PV)', value: 7815, icon: 'users' },
    { label: '100+ PV Month', value: 59683, icon: 'box' },
    { label: '3 Straight 100+ PV Months', value: 63035, icon: 'calendar' },
    { label: '2 Subscription Months (100+ PV)', value: 85495, icon: 'refresh' },
    { label: 'VIP Upgrade', value: 4090, icon: 'star' },
    { label: 'Ambassador Upgrade', value: 2445, icon: 'user' },
    { label: 'Rank Advancement', value: 985, icon: 'award' },
  ] as ContestTile[],
}

export const thisMonth = { teamPoints: 5939, newEnrollments: 136, subRate: 40 }

export const kickoff = {
  eyebrow: 'August Kickoff', title: 'Build the habit, not the hustle',
  body: "One conversation a day, one cart a week, a subscription on every enrol. Watch the 12-minute kickoff, then check this month's specials and events.",
  chips: ['2 specials live', '1 events this month', 'Note from Alec Clark'],
  video: 'AUGUST Kickoff', duration: '12:04', daysLeft: 0,
}

const firsts = ['Liam','Olivia','Noah','Emma','Mason','Ava','Lucas','Mia','Ethan','Sofia','Logan','Chloe','Aiden','Grace','Caleb','Zoe','Owen','Lily','Wyatt','Nora']
const lasts = ['Bennett','Reyes','Foster','Hughes','Price','Ward','Brooks','Sanders','Perry','Long','Patterson','Jenkins','Russell','Griffin','Hayes']

const pv = (n: string): Omit<Opportunity, 'id'> => ({ name: n, confidence: 'High', title: `${n} is trending toward 100 PV qualification`,
  detail: `${n} is currently showing high-confidence signs of nearing the 100 PV qualification threshold for the upcoming period. Precise guidance can ensure they hit it cleanly.` })
const rank = (n: string): Omit<Opportunity, 'id'> => ({ name: n, confidence: 'Watch', title: `${n}: Growth opportunity ahead`,
  detail: `Our system detects a watch-level signal that ${n} is nearing a rank advancement. A quick chat could help them close the small remaining gap.` })

const seed: Omit<Opportunity, 'id'>[] = [
  { name: 'Gabriel Cox', confidence: 'High', title: 'Gabriel Cox has a high-confidence chance for 100 PV qualification',
    detail: 'Our models indicate Gabriel Cox is showing high-confidence potential to qualify with 100 PV next period. A small, targeted cart suggestion could help them reach this milestone efficiently.' },
  { name: 'Jack Kelly', confidence: 'Watch', title: 'Upcoming milestone for Jack Kelly',
    detail: "There's a watch-level indication that Jack Kelly is on track for rank advancement in the upcoming period. A focused conversation could make a difference." },
  pv('Hannah Morales'), rank('Penelope Morgan'), pv('Evelyn Morris'),
]

export const OPPORTUNITY_TOTAL = 644
export const opportunities: Opportunity[] = Array.from({ length: OPPORTUNITY_TOTAL }, (_, i) => {
  if (i < seed.length) return { id: i + 1, ...seed[i] }
  const n = `${firsts[i % firsts.length]} ${lasts[Math.floor(i / firsts.length) % lasts.length]}`
  return { id: i + 1, ...(i % 2 ? pv(n) : rank(n)) }
})

const playDetail = (n: string) => `${n}'s subscription order is coming up soon and recent patterns suggest a short check-in could help them keep it active. This is a recommendation based on recent patterns, not a guarantee.`
export const growthPlays: GrowthPlay[] = [
  ['Plan ahead for ', 'Addison King', "'s subscription renewal", 99],
  ['Check in on ', 'Natalie Morris', "'s upcoming subscription", 99],
  ['Support ', 'Skylar Johnson', ' with their next subscription', 98],
  ['Plan ahead for ', 'Ellie Smith', "'s subscription renewal", 98],
  ['Plan ahead for ', 'Luna Garcia', "'s subscription renewal", 95],
  ['Support ', 'Thomas Lopez', ' with their next subscription', 95],
].map(([before, name, after, c], i) => ({ id: i + 1, level: 'HIGH', before: before as string, name: name as string, after: after as string, confidence: c as number, detail: playDetail(name as string) }))

export const hubPosts: HubPost[] = [
  { category: 'Specials', when: 'Just now', title: 'VIP + 3' },
  { category: 'Product Launch', when: 'Just now', title: 'June Product Launch: Plexus Active+ with Adaptogens' },
  { category: 'Specials', when: 'Yesterday', title: 'Summer Slim Down Special: 25% Off Slim + Block Bundles' },
]
export const upcomingEvent = { title: 'Diamond Destination', date: 'November 12 - 14, 2026', place: 'Montage Laguna Beach, CA' }
export const courses: Course[] = [
  { title: 'Our Comp Plan', done: 3, total: 4 },
  { title: 'Building Your Business', done: 2, total: 5 },
]
