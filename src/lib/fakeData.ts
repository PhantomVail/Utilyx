import { faker } from "@faker-js/faker";

export const FIRST_NAMES_MALE = [
  "James","John","Robert","Michael","David","William","Richard","Joseph","Thomas","Christopher",
  "Charles","Daniel","Matthew","Anthony","Mark","Donald","Steven","Andrew","Paul","Joshua",
  "Kenneth","Kevin","Brian","George","Timothy","Ronald","Edward","Jason","Jeffrey","Ryan",
  "Jacob","Gary","Nicholas","Eric","Jonathan","Stephen","Larry","Justin","Scott","Brandon",
  "Benjamin","Samuel","Raymond","Gregory","Frank","Alexander","Patrick","Jack","Dennis","Jerry",
  "Tyler","Aaron","Jose","Nathan","Henry","Peter","Douglas","Zachary","Kyle","Noah",
  "Ethan","Jeremy","Walter","Christian","Keith","Roger","Terry","Austin","Sean","Gerald",
  "Carl","Harold","Dylan","Arthur","Lawrence","Jordan","Jesse","Bryan","Billy","Bruce",
  "Gabriel","Joe","Logan","Albert","Willie","Alan","Eugene","Russell","Vincent","Philip",
  "Bobby","Johnny","Bradley","Roy","Ralph","Eugene","Randy","Wayne","Elijah","Juan",
  "Howard","Carlos","Louis","Russell","Craig","Harry","Oscar","Clarence","Danny","Spencer",
  "Travis","Ernest","Todd","Jesse","Curtis","Stanley","Leonard","Marcus","Theodore","Liam",
  "Mason","Lucas","Oliver","Aiden","Sebastian","Caleb","Owen","Adrian","Jaxon","Leo",
  "Wyatt","Landon","Carter","Lincoln","Hunter","Kai","Asher","Ezra","Micah","Nolan",
  "Miles","Declan","Axel","Silas","Jasper","Emmett","Finn","Chase","Maxwell","Dante"
];

export const FIRST_NAMES_FEMALE = [
  "Mary","Patricia","Jennifer","Linda","Barbara","Elizabeth","Susan","Jessica","Sarah","Karen",
  "Lisa","Nancy","Betty","Margaret","Sandra","Ashley","Dorothy","Kimberly","Emily","Donna",
  "Michelle","Carol","Amanda","Melissa","Deborah","Stephanie","Rebecca","Sharon","Laura","Cynthia",
  "Kathleen","Amy","Angela","Shirley","Anna","Brenda","Pamela","Emma","Nicole","Helen",
  "Samantha","Katherine","Christine","Debra","Rachel","Carolyn","Janet","Catherine","Maria","Heather",
  "Diane","Ruth","Julie","Olivia","Joyce","Virginia","Victoria","Kelly","Lauren","Christina",
  "Joan","Evelyn","Judith","Megan","Andrea","Cheryl","Hannah","Jacqueline","Martha","Gloria",
  "Teresa","Ann","Sara","Madison","Frances","Kathryn","Janice","Jean","Abigail","Alice",
  "Judy","Sophia","Grace","Denise","Amber","Doris","Marilyn","Danielle","Beverly","Isabella",
  "Theresa","Diana","Natalie","Brittany","Charlotte","Marie","Kayla","Alexis","Lori","Ava",
  "Mia","Harper","Ella","Aria","Scarlett","Penelope","Layla","Chloe","Riley","Zoey",
  "Nora","Lily","Eleanor","Hazel","Violet","Aurora","Savannah","Audrey","Brooklyn","Bella",
  "Claire","Skylar","Lucy","Paisley","Everly","Anna","Caroline","Nova","Genesis","Emilia",
  "Kennedy","Maya","Willow","Kinsley","Naomi","Aaliyah","Elena","Sarah","Ariana","Allison",
  "Gabriella","Alice","Madelyn","Cora","Ruby","Eva","Serenity","Autumn","Adeline","Hailey"
];

export const FIRST_NAMES = [...FIRST_NAMES_MALE, ...FIRST_NAMES_FEMALE];

export const LAST_NAMES = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez",
  "Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin",
  "Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson",
  "Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores",
  "Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts",
  "Gomez","Phillips","Evans","Turner","Diaz","Parker","Cruz","Edwards","Collins","Reyes",
  "Stewart","Morris","Morales","Murphy","Cook","Rogers","Gutierrez","Ortiz","Morgan","Cooper",
  "Peterson","Bailey","Reed","Kelly","Howard","Ramos","Kim","Cox","Ward","Richardson",
  "Watson","Brooks","Chavez","Wood","James","Bennett","Gray","Mendoza","Ruiz","Hughes",
  "Price","Alvarez","Castillo","Sanders","Patel","Myers","Long","Ross","Foster","Jimenez",
  "Powell","Jenkins","Perry","Russell","Sullivan","Bell","Coleman","Butler","Henderson","Barnes",
  "Gonzales","Fisher","Vasquez","Simmons","Graham","Murray","Ford","Castro","Stone","Hunter",
  "Boyd","Mills","Warren","Fox","Rose","Rice","Moreno","Schmidt","Patel","Ferguson",
  "Herrera","Medina","Ryan","Fernandez","Weaver","Daniels","Stephens","Grant","McGee","Hoffman",
  "Vargas","Freeman","Wells","Webb","Simpson","Stevens","Tucker","Porter","Hicks","Crawford",
  "Boyd","Mason","Perkins","Arnold","Wagner","Knight","Elliott","Duncan","Hudson","Carroll",
  "May","Burke","Olson","Palmer","Lucas","Gordon","Walsh","Dunn","Burns","Marshall",
  "Owens","Hart","Peters","Henry","Bradley","Curtis","Henderson","Cole","Ray","Hawkins",
  "Snyder","Gibson","Carpenter","Sims","Hamilton","Berry","Perkins","Dean","Holland","Park",
  "Bishop","Stephenson","Lyons","Fleming","Rhodes","Delgado","Barker","Duran","Moran","Reeves"
];

export const DOMAINS = [
  "gmail.com","outlook.com","yahoo.com","protonmail.com","fastmail.com","hey.com",
  "icloud.com","aol.com","mail.com","zoho.com","tutanota.com","gmx.com",
  "yandex.com","live.com","hotmail.com","pm.me","disroot.org","riseup.net"
];

export const STREETS = [
  "Oak","Maple","Cedar","Elm","Pine","Walnut","Birch","Willow","Ash","Cherry",
  "Hickory","Spruce","Magnolia","Cypress","Juniper","Sycamore","Poplar","Chestnut","Dogwood","Redwood",
  "Main","First","Second","Third","Park","Washington","Jefferson","Lincoln","Madison","Adams",
  "Highland","Summit","Ridge","Valley","Lake","River","Spring","Meadow","Forest","Hill",
  "Sunset","Sunrise","Ocean","Mountain","Prairie","Canyon","Creek","Brook","Vista","Harbor"
];

export const STREET_SUFFIXES = [
  "St","Ave","Blvd","Dr","Ln","Way","Ct","Pl","Rd","Cir",
  "Ter","Loop","Path","Trail","Pike","Run","Row","Pkwy","Pass","Xing"
];

export const CITIES = [
  "New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia","San Antonio","San Diego",
  "Dallas","Austin","Jacksonville","San Jose","Fort Worth","Columbus","Charlotte","Indianapolis",
  "San Francisco","Seattle","Denver","Nashville","Oklahoma City","Portland","Las Vegas","Memphis",
  "Louisville","Baltimore","Milwaukee","Albuquerque","Tucson","Fresno","Mesa","Sacramento",
  "Atlanta","Kansas City","Omaha","Colorado Springs","Raleigh","Long Beach","Virginia Beach","Miami",
  "Oakland","Minneapolis","Tampa","Tulsa","Arlington","New Orleans","Wichita","Bakersfield",
  "Cleveland","Aurora","Anaheim","Honolulu","Santa Ana","Riverside","Corpus Christi","Lexington",
  "Pittsburgh","Anchorage","Stockton","Cincinnati","Saint Paul","Toledo","Greensboro","Newark",
  "Plano","Henderson","Lincoln","Buffalo","Jersey City","Chandler","St. Petersburg","Chula Vista",
  "Norfolk","Fremont","Gilbert","Baton Rouge","Irving","Reno","Scottsdale","North Las Vegas",
  "Winston-Salem","Chesapeake","Boise","Spokane","Tacoma","San Bernardino","Modesto","Fontana",
  "Moreno Valley","Glendale","Huntington Beach","Yonkers","Des Moines","Rochester","Fayetteville",
  "Salt Lake City","Birmingham","Richmond","Lubbock","Oxnard","Madison","Grand Rapids","Laredo"
];

export const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY",
  "LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND",
  "OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

export const COUNTRIES = [
  "United States","Canada","United Kingdom","Germany","France","Australia","Japan","Brazil",
  "India","Mexico","Spain","Italy","Netherlands","Sweden","Norway","Denmark","Finland",
  "Switzerland","Austria","Belgium","Portugal","Ireland","New Zealand","Singapore","South Korea",
  "Poland","Czech Republic","Romania","Greece","Argentina","Chile","Colombia","Peru",
  "Thailand","Malaysia","Philippines","Indonesia","Vietnam","Turkey","Israel","South Africa",
  "Nigeria","Egypt","Kenya","Morocco","UAE","Saudi Arabia","Qatar","Taiwan"
];

export const COMPANIES = [
  "Acme Corp","Globex","Initech","Umbrella Corp","Aperture Science","Stark Industries","Wayne Enterprises",
  "Cyberdyne Systems","Tyrell Corp","Weyland-Yutani","Oscorp","LexCorp","Massive Dynamic","Soylent Corp",
  "Wonka Industries","Dunder Mifflin","Sterling Cooper","Pied Piper","Hooli","Vought International",
  "InGen","Dharma Initiative","Paper Street Soap","Prestige Worldwide","TechCorp","DataFlow Systems",
  "NovaTech","Quantum Dynamics","SkyNet Solutions","BlueShift Labs","RedPill Analytics","GreenField Energy",
  "CloudNine Software","ByteForge","CodeCraft","PixelPerfect","NeuralPath","CyberVault","DataMesh",
  "FlowState","GridWorks","HyperLoop Tech","InfiniteScale","JetStream","KernelSpace","LogicGate",
  "MetaWave","NetForge","OpenStack","PulsePoint","QubitTech","RuntimeError","StackOverflow Inc",
  "TeraByte","UltraViolet","VectorSpace","WarpDrive","XenonLabs","YottaByte","ZeroDay Security",
  "Alpine Tech","Basecamp Digital","Catalyst AI","DeepMind Corp","Elastic Systems","Frontier Labs",
  "HashGraph","IronClad","Keystone","Lighthouse","Meridian","Nexus","Obsidian","Prism Technologies"
];

export const INDUSTRIES = [
  "Technology","Finance","Healthcare","Education","Retail","Manufacturing","Energy","Real Estate",
  "Telecommunications","Automotive","Aerospace","Agriculture","Biotechnology","Construction",
  "Consulting","Entertainment","Environmental","Food & Beverage","Government","Insurance",
  "Legal","Logistics","Media","Mining","Pharmaceuticals","Transportation","Utilities",
  "Cybersecurity","AI & Machine Learning","Cloud Computing","FinTech","EdTech","HealthTech",
  "CleanTech","PropTech","AgriTech","LegalTech","InsurTech","MarTech","HRTech","RegTech"
];

export const JOB_TITLES = [
  "Software Engineer","Senior Developer","Tech Lead","Engineering Manager","CTO","VP of Engineering",
  "Product Manager","Product Designer","UX Researcher","Data Scientist","Data Engineer","ML Engineer",
  "DevOps Engineer","SRE","Cloud Architect","Solutions Architect","Security Engineer","QA Engineer",
  "Frontend Developer","Backend Developer","Full Stack Developer","Mobile Developer","iOS Developer",
  "Android Developer","React Developer","Node.js Developer","Python Developer","Go Developer",
  "Database Administrator","System Administrator","Network Engineer","IT Manager","Scrum Master",
  "Agile Coach","Technical Writer","Developer Advocate","Sales Engineer","Account Executive",
  "Marketing Manager","Growth Hacker","Content Strategist","Brand Manager","CFO","COO","CEO",
  "HR Manager","Recruiter","Operations Manager","Business Analyst","Project Manager","Consultant"
];

export const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
];

export const LOREM_WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do",
  "eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim",
  "ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip",
  "ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate",
  "velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat",
  "non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum",
  "at","vero","eos","accusamus","iusto","odio","dignissimos","ducimus","blanditiis","praesentium",
  "voluptatum","deleniti","atque","corrupti","quos","dolores","quas","molestias","excepturi",
  "obcaecati","cupiditate","provident","similique","mollitia","animi","perspiciatis","unde","omnis",
  "iste","natus","error","voluptatem","accusantium","doloremque","laudantium","totam","rem","aperiam"
];

export const PRODUCT_ADJECTIVES = [
  "Incredible","Awesome","Fantastic","Gorgeous","Handmade","Intelligent","Licensed","Practical",
  "Refined","Rustic","Sleek","Tasty","Unbranded","Premium","Elegant","Modern","Vintage","Classic",
  "Professional","Enterprise","Advanced","Smart","Ultra","Nano","Mega","Super","Hyper","Turbo"
];

export const PRODUCT_MATERIALS = [
  "Steel","Wooden","Concrete","Plastic","Cotton","Granite","Rubber","Metal","Soft","Fresh",
  "Frozen","Carbon","Silicon","Bamboo","Leather","Marble","Glass","Ceramic","Titanium","Bronze"
];

export const PRODUCT_NAMES = [
  "Chair","Car","Computer","Keyboard","Mouse","Bike","Shirt","Shoes","Gloves","Pants",
  "Table","Desk","Lamp","Phone","Watch","Bag","Hat","Socks","Towel","Soap",
  "Camera","Speaker","Headphones","Monitor","Tablet","Console","Controller","Cable","Charger","Case"
];

// GPS landmark coordinates for realistic data
export const GPS_LANDMARKS: { name: string; lat: number; lng: number }[] = [
  { name: "Times Square, NYC", lat: 40.7580, lng: -73.9855 },
  { name: "Eiffel Tower, Paris", lat: 48.8584, lng: 2.2945 },
  { name: "Big Ben, London", lat: 51.5007, lng: -0.1246 },
  { name: "Tokyo Tower", lat: 35.6586, lng: 139.7454 },
  { name: "Sydney Opera House", lat: -33.8568, lng: 151.2153 },
  { name: "Colosseum, Rome", lat: 41.8902, lng: 12.4922 },
  { name: "Christ the Redeemer, Rio", lat: -22.9519, lng: -43.2105 },
  { name: "Taj Mahal, Agra", lat: 27.1751, lng: 78.0421 },
  { name: "Golden Gate Bridge, SF", lat: 37.8199, lng: -122.4783 },
  { name: "Burj Khalifa, Dubai", lat: 25.1972, lng: 55.2744 },
  { name: "Machu Picchu, Peru", lat: -13.1631, lng: -72.5450 },
  { name: "Great Wall, China", lat: 40.4319, lng: 116.5704 },
  { name: "Statue of Liberty, NYC", lat: 40.6892, lng: -74.0445 },
  { name: "Kremlin, Moscow", lat: 55.7520, lng: 37.6175 },
  { name: "CN Tower, Toronto", lat: 43.6426, lng: -79.3871 },
  { name: "Sagrada Familia, Barcelona", lat: 41.4036, lng: 2.1744 },
  { name: "Petra, Jordan", lat: 30.3285, lng: 35.4444 },
  { name: "Table Mountain, Cape Town", lat: -33.9628, lng: 18.4098 },
  { name: "Angkor Wat, Cambodia", lat: 13.4125, lng: 103.8670 },
  { name: "Chichen Itza, Mexico", lat: 20.6843, lng: -88.5678 },
];

// ISP names for IP data
export const ISP_NAMES = [
  "Comcast","AT&T","Verizon","Charter","Cox","CenturyLink","Frontier","Windstream",
  "Google Fiber","Spectrum","T-Mobile","Sprint","BT","Virgin Media","Deutsche Telekom",
  "Orange","Vodafone","NTT","SoftBank","Telstra","Rogers","Bell Canada","Shaw","Telus",
  "AWS","Google Cloud","Azure","DigitalOcean","Linode","Cloudflare","Akamai","Fastly"
];

// Helper functions
export const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
export const randFloat = (min: number, max: number, dec = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(dec));
export const randBool = () => Math.random() > 0.5;
export const randDate = (yearsBack = 5) => {
  const d = new Date(Date.now() - Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000);
  return d.toISOString().split("T")[0];
};
export const randDateTime = () => new Date(Date.now() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000).toISOString();
export const randPhone = () => `+1 (${randInt(200,999)}) ${randInt(200,999)}-${randInt(1000,9999)}`;
export const randIP = () => `${randInt(1,255)}.${randInt(0,255)}.${randInt(0,255)}.${randInt(1,254)}`;
export const randIPv6 = () => Array.from({length:8}, () => randInt(0,65535).toString(16).padStart(4,"0")).join(":");
export const randMAC = () => Array.from({length:6}, () => randInt(0,255).toString(16).padStart(2,"0")).join(":");
export const randCC = () => `4${Array.from({length:15}, () => randInt(0,9)).join("")}`;
export const randSSN = () => `${randInt(100,999)}-${randInt(10,99)}-${randInt(1000,9999)}`;
export const randUUID = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
};
export const randColor = () => `#${randInt(0,16777215).toString(16).padStart(6,"0")}`;
export const randLatLng = (): [number, number] => [randFloat(-90, 90, 6), randFloat(-180, 180, 6)];
export const randParagraph = (sentences = 3) => {
  return Array.from({length: sentences}, () => {
    const len = randInt(8, 15);
    const words = Array.from({length: len}, () => pick(LOREM_WORDS));
    words[0] = words[0][0].toUpperCase() + words[0].slice(1);
    return words.join(" ") + ".";
  }).join(" ");
};

// Private IP ranges
export const randPrivateIP = () => {
  const range = pick(["10", "172", "192"]);
  if (range === "10") return `10.${randInt(0,255)}.${randInt(0,255)}.${randInt(1,254)}`;
  if (range === "172") return `172.${randInt(16,31)}.${randInt(0,255)}.${randInt(1,254)}`;
  return `192.168.${randInt(0,255)}.${randInt(1,254)}`;
};

// CIDR notation
export const randCIDR = () => `${randIP()}/${pick([8,16,24,28,30,32])}`;

export type DataType = "person" | "address" | "company" | "network" | "product" | "payment" | "event" | "gps" | "ipaddress" | "vehicle" | "crypto" | "dns";

export interface FakeRecord {
  [key: string]: string;
}

export function generateRecord(type: DataType): FakeRecord {
  switch (type) {
    case "person":
      return {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        dob: faker.date.birthdate({ min: 18, max: 80, mode: "age" }).toISOString().split("T")[0],
        ssn: `${faker.number.int({min:100,max:999})}-${faker.number.int({min:10,max:99})}-${faker.number.int({min:1000,max:9999})}`,
        job_title: faker.person.jobTitle(),
        company: faker.company.name(),
      };
    case "address":
      return {
        id: faker.string.uuid(),
        street: faker.location.streetAddress(),
        apt: faker.datatype.boolean() ? `Apt ${faker.number.int({min:1,max:999})}` : "",
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zip: faker.location.zipCode(),
        country: faker.location.country(),
        lat: faker.location.latitude().toString(),
        lng: faker.location.longitude().toString(),
      };
    case "company":
      return {
        id: faker.string.uuid(),
        name: faker.company.name(),
        industry: faker.commerce.department(),
        founded: `${faker.number.int({min:1950,max:2024})}`,
        employees: `${faker.number.int({min:5,max:100000})}`,
        revenue: `$${faker.number.int({min:1,max:999})}${faker.helpers.arrayElement(["K","M","B"])}`,
        website: faker.internet.url(),
        ceo: faker.person.fullName(),
      };
    case "network":
      return {
        id: faker.string.uuid(),
        ipv4: faker.internet.ipv4(),
        ipv6: faker.internet.ipv6(),
        mac: faker.internet.mac(),
        user_agent: faker.internet.userAgent(),
        port: `${faker.internet.port()}`,
        protocol: faker.helpers.arrayElement(["HTTP","HTTPS","FTP","SSH","SMTP","DNS","MQTT","gRPC"]),
        status_code: `${faker.helpers.arrayElement([200,201,301,302,400,401,403,404,500,502,503])}`,
      };
    case "product":
      return {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        sku: `SKU-${faker.number.int({min:10000,max:99999})}`,
        price: `$${faker.commerce.price()}`,
        currency: faker.finance.currencyCode(),
        category: faker.commerce.department(),
        in_stock: `${faker.datatype.boolean()}`,
        rating: `${faker.number.float({min:1,max:5,multipleOf:0.1})}`,
      };
    case "payment":
      return {
        transaction_id: `txn_${faker.number.int({min:100000000,max:999999999})}`,
        card_number: faker.finance.creditCardNumber(),
        card_type: faker.finance.creditCardIssuer(),
        expiry: `${faker.number.int({min:1,max:12}).toString().padStart(2,"0")}/${faker.number.int({min:25,max:30})}`,
        amount: `$${faker.finance.amount({min:1,max:9999})}`,
        currency: faker.finance.currencyCode(),
        status: faker.helpers.arrayElement(["completed","pending","failed","refunded"]),
        date: faker.date.recent({ days: 365 }).toISOString(),
      };
    case "event":
      return {
        event_id: faker.string.uuid(),
        event_type: faker.helpers.arrayElement(["page_view","click","signup","purchase","logout","error","search","scroll"]),
        user_id: faker.string.uuid(),
        timestamp: faker.date.recent({ days: 30 }).toISOString(),
        session_id: faker.string.alphanumeric(8),
        page: `/${faker.helpers.arrayElement(["home","dashboard","settings","profile","products","checkout","about","docs"])}`,
        device: faker.helpers.arrayElement(["desktop","mobile","tablet"]),
        browser: faker.helpers.arrayElement(["Chrome","Firefox","Safari","Edge"]),
      };
    case "gps": {
      const useReal = faker.datatype.boolean();
      const landmark = faker.helpers.arrayElement(GPS_LANDMARKS);
      const lat = useReal ? landmark.lat + faker.number.float({min:-0.01,max:0.01,multipleOf:0.000001}) : faker.location.latitude();
      const lng = useReal ? landmark.lng + faker.number.float({min:-0.01,max:0.01,multipleOf:0.000001}) : faker.location.longitude();
      return {
        id: faker.string.uuid(),
        latitude: `${lat}`,
        longitude: `${lng}`,
        altitude_m: `${faker.number.float({min:0,max:8848,multipleOf:0.1})}`,
        accuracy_m: `${faker.number.float({min:1,max:100,multipleOf:0.1})}`,
        speed_kmh: `${faker.number.float({min:0,max:200,multipleOf:0.1})}`,
        heading_deg: `${faker.number.float({min:0,max:360,multipleOf:0.1})}`,
        timestamp: faker.date.recent({ days: 30 }).toISOString(),
        landmark: useReal ? landmark.name : "",
        dms_lat: decimalToDMS(lat, "lat"),
        dms_lng: decimalToDMS(lng, "lng"),
        plus_code: `${faker.number.int({min:2000,max:9999})}+${faker.string.alpha({length:2,casing:"upper"})}`,
        geohash: generateGeohash(lat, lng),
      };
    }
    case "ipaddress": {
      const isV6 = faker.datatype.boolean();
      const ip = isV6 ? faker.internet.ipv6() : faker.internet.ipv4();
      const cidr = isV6 ? `${ip}/${faker.helpers.arrayElement([48,56,64,128])}` : `${ip}/${faker.helpers.arrayElement([8,16,24,28,32])}`;
      return {
        id: faker.string.uuid(),
        ip_address: ip,
        version: isV6 ? "IPv6" : "IPv4",
        cidr: cidr,
        type: faker.helpers.arrayElement(["public","private","reserved","loopback","multicast"]),
        class: isV6 ? "N/A" : faker.helpers.arrayElement(["A","B","C","D","E"]),
        isp: faker.helpers.arrayElement(ISP_NAMES),
        country: faker.location.country(),
        city: faker.location.city(),
        asn: `AS${faker.number.int({min:1000,max:99999})}`,
        reverse_dns: `${ip.replace(/[:.]/g,"-")}.${faker.helpers.arrayElement(["compute","ec2","cloud","host","server"])}.${faker.helpers.arrayElement(["amazonaws.com","googleusercontent.com","azure.com","hosting.com"])}`,
        is_vpn: `${faker.datatype.boolean()}`,
        is_proxy: `${faker.datatype.boolean()}`,
        threat_score: `${faker.number.int({min:0,max:100})}`,
      };
    }
    case "vehicle":
      return {
        id: faker.string.uuid(),
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: `${faker.number.int({min:2000,max:2026})}`,
        color: faker.vehicle.color(),
        vin: faker.vehicle.vin(),
        license_plate: `${faker.string.alpha({length:3,casing:"upper"})}-${faker.number.int({min:1000,max:9999})}`,
        fuel_type: faker.vehicle.fuel(),
        mileage_km: `${faker.number.int({min:0,max:300000})}`,
        price: `$${faker.number.int({min:5000,max:150000}).toLocaleString()}`,
      };
    case "crypto":
      return {
        id: faker.string.uuid(),
        wallet_address: `0x${faker.string.hexadecimal({length:40,casing:"lower"}).replace("0x","")}`,
        blockchain: faker.helpers.arrayElement(["Ethereum","Bitcoin","Solana","Polygon","Avalanche","Arbitrum","Optimism","Base","BNB Chain"]),
        balance: `${faker.number.float({min:0,max:1000,multipleOf:0.00000001})}`,
        token: faker.helpers.arrayElement(["ETH","BTC","SOL","MATIC","AVAX","USDC","USDT","DAI","LINK","UNI"]),
        tx_hash: `0x${faker.string.hexadecimal({length:64,casing:"lower"}).replace("0x","")}`,
        block_number: `${faker.number.int({min:1000000,max:20000000})}`,
        gas_fee: `${faker.number.float({min:0.001,max:0.5,multipleOf:0.000001})}`,
        timestamp: faker.date.recent({ days: 30 }).toISOString(),
        status: faker.helpers.arrayElement(["confirmed","pending","failed"]),
      };
    case "dns":
      return {
        id: faker.string.uuid(),
        domain: faker.internet.domainName(),
        record_type: faker.helpers.arrayElement(["A","AAAA","CNAME","MX","TXT","NS","SOA","SRV","PTR","CAA"]),
        value: faker.internet.ipv4(),
        ttl: `${faker.helpers.arrayElement([60,300,900,3600,7200,86400])}`,
        priority: `${faker.number.int({min:0,max:100})}`,
        registrar: faker.helpers.arrayElement(["GoDaddy","Namecheap","Cloudflare","Google Domains","Route 53","Hover","Gandi"]),
        expiry_date: faker.date.future({ years: 3 }).toISOString().split("T")[0],
        dnssec: `${faker.datatype.boolean()}`,
        nameservers: `ns1.${faker.helpers.arrayElement(["cloudflare","google","aws","azure","dnsimple"])}.com`,
      };
  }
}

function decimalToDMS(decimal: number, type: "lat" | "lng"): string {
  const abs = Math.abs(decimal);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = ((minFloat - min) * 60).toFixed(1);
  const dir = type === "lat" ? (decimal >= 0 ? "N" : "S") : (decimal >= 0 ? "E" : "W");
  return `${deg}°${min}'${sec}"${dir}`;
}

function generateGeohash(lat: number, lng: number): string {
  const chars = "0123456789bcdefghjkmnpqrstuvwxyz";
  let hash = "";
  let minLat = -90, maxLat = 90, minLng = -180, maxLng = 180;
  let isLng = true;
  for (let i = 0; i < 7; i++) {
    let ch = 0;
    for (let bit = 4; bit >= 0; bit--) {
      if (isLng) {
        const mid = (minLng + maxLng) / 2;
        if (lng >= mid) { ch |= (1 << bit); minLng = mid; } else { maxLng = mid; }
      } else {
        const mid = (minLat + maxLat) / 2;
        if (lat >= mid) { ch |= (1 << bit); minLat = mid; } else { maxLat = mid; }
      }
      isLng = !isLng;
    }
    hash += chars[ch];
  }
  return hash;
}
