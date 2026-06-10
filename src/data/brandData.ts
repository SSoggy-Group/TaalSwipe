export interface BrandItem {
  id?: string | number;
  word: string;
  isBrand: boolean;
  explanation: string;
}

export const brandData: BrandItem[] = [
  { word: "Luxaflex", isBrand: true, explanation: "Luxaflex is een merknaam voor horizontale jaloezieën." },
  { word: "Hagelslag", isBrand: false, explanation: "Hagelslag is een soortnaam voor chocoladekorrels, bedacht door Venco (maar de naam is geen merk)." },
  { word: "Pampers", isBrand: true, explanation: "Pampers is een merk van Procter & Gamble, gebruikt als synoniem voor luiers." },
  { word: "Roltrap", isBrand: false, explanation: "Roltrap is een soortnaam voor een bewegende trap." },
  { word: "Aspirine", isBrand: true, explanation: "Aspirine is een geregistreerde merknaam van Bayer." },
  { word: "Vaseline", isBrand: true, explanation: "Vaseline is een merknaam van Unilever, gebruikt voor petroleumgelei." },
  { word: "Waxinelichtje", isBrand: true, explanation: "Waxine is een gedeponeerd merk van Verkade." },
  { word: "Bahco", isBrand: true, explanation: "Bahco is een Zweeds merk van gereedschap (moersleutels)." },
  { word: "Chocomel", isBrand: true, explanation: "Chocomel is een geregistreerde merknaam (met één l)." },
  { word: "Frisbee", isBrand: true, explanation: "Frisbee is een merknaam van Wham-O." },
  { word: "Kliko", isBrand: true, explanation: "Kliko is een merknaam van een afvalcontainer." },
  { word: "Maggi", isBrand: true, explanation: "Maggi is een merk van voedingsmiddelen van Nestlé." },
  { word: "Pincet", isBrand: false, explanation: "Pincet is een soortnaam voor een klein grijpinstrument." },
  { word: "Pingpong", isBrand: true, explanation: "Ping-Pong is oorspronkelijk een merknaam van Parker Brothers (tafeltennis)." },
  { word: "Bikini", isBrand: false, explanation: "Bikini is een soortnaam (genoemd naar het atol Bikini)." },
  { word: "Thermoskan", isBrand: true, explanation: "Thermos is een geregistreerd handelsmerk." },
  { word: "Vespa", isBrand: true, explanation: "Vespa is een merk van scooters van Piaggio." },
  { word: "Jeep", isBrand: true, explanation: "Jeep is een merknaam, geen algemene aanduiding voor terreinwagens." },
  { word: "Jacuzzi", isBrand: true, explanation: "Jacuzzi is een bedrijf dat bubbelbaden maakt." },
  { word: "Ketchup", isBrand: false, explanation: "Ketchup is een soortnaam voor een saus." },
  { word: "Maxi-Cosi", isBrand: true, explanation: "Maxi-Cosi is een merknaam voor autostoeltjes." },
  { word: "Zippo", isBrand: true, explanation: "Zippo is een merk van aanstekers." },
  { word: "Brinta", isBrand: true, explanation: "Brinta is een merknaam (Breakfast In Time)." },
  { word: "Mayonaise", isBrand: false, explanation: "Mayonaise is een soortnaam." },
  { word: "Stanleymes", isBrand: true, explanation: "Stanley is een merk van gereedschap." },
  { word: "Teflon", isBrand: true, explanation: "Teflon is een merknaam van Chemours (PTFE)." },
  { word: "Spa", isBrand: true, explanation: "Spa is een merk van bronwater, geen soortnaam voor rood/blauw water." },
  { word: "Chocolade", isBrand: false, explanation: "Chocolade is een soortnaam." },
  { word: "Kleenex", isBrand: true, explanation: "Kleenex is een merknaam voor papieren zakdoekjes." },
  { word: "Zakdoek", isBrand: false, explanation: "Zakdoek is gewoon een soortnaam." },
  { word: "Post-it", isBrand: true, explanation: "Post-it is een merk van 3M." },
  { word: "Plakbriefje", isBrand: false, explanation: "Dit is de soortnaam voor een sticky note." },
  { word: "TomTom", isBrand: true, explanation: "TomTom is een merknaam voor navigatiesystemen." },
  { word: "Navigatie", isBrand: false, explanation: "Dit is een soortnaam." },
  { word: "Hero", isBrand: true, explanation: "Hero is een Zwitsers merk van vruchtendrank en jam." },
  { word: "Appelsap", isBrand: false, explanation: "Appelsap is een soortnaam." },
  { word: "Google", isBrand: true, explanation: "Google is een geregistreerd merk, hoewel we het als werkwoord (googelen) gebruiken." },
  { word: "Zoekmachine", isBrand: false, explanation: "Zoekmachine is de algemene term." },
  { word: "Velcro", isBrand: true, explanation: "Velcro is een merk van klittenband." },
  { word: "Klittenband", isBrand: false, explanation: "Klittenband is een soortnaam." },
  { word: "Walkman", isBrand: true, explanation: "Walkman is een merk van Sony." },
  { word: "Cassetterecorder", isBrand: false, explanation: "Soortnaam voor het draagbare apparaat." },
  { word: "Nintendo", isBrand: true, explanation: "Nintendo is een merknaam." },
  { word: "Spelcomputer", isBrand: false, explanation: "Dit is de soortnaam." },
  { word: "Chupa Chups", isBrand: true, explanation: "Dit is een merk van lolly's." },
  { word: "Lolly", isBrand: false, explanation: "Lolly is een soortnaam." },
  { word: "Croc", isBrand: true, explanation: "Crocs is een schoenenmerk." },
  { word: "Klomp", isBrand: false, explanation: "Klomp is een algemene schoen." },
  { word: "Playmobil", isBrand: true, explanation: "Playmobil is een merk van speelgoed." },
  { word: "Lego", isBrand: true, explanation: "Lego is een merk van speelgoedblokjes." },
  { word: "Bouwblokje", isBrand: false, explanation: "Bouwblokje is een soortnaam." },
  { word: "Magnum", isBrand: true, explanation: "Magnum is een merk ijsje van Ola." },
  { word: "Waterijs", isBrand: false, explanation: "Waterijs is een soortnaam." },
  { word: "Photoshop", isBrand: true, explanation: "Photoshop is een beeldbewerkingsprogramma van Adobe." },
  { word: "Fotobewerker", isBrand: false, explanation: "Dit is een soortnaam." },
  { word: "Skype", isBrand: true, explanation: "Skype is een merknaam voor videobellen van Microsoft." },
  { word: "Videobellen", isBrand: false, explanation: "Videobellen is de soortnaam / werkwoord." },
  { word: "Q-tip", isBrand: true, explanation: "Q-tips is een merk van wattenstaafjes." },
  { word: "Wattenstaafje", isBrand: false, explanation: "Wattenstaafje is de algemene benaming." },
  { word: "Styrofoam", isBrand: true, explanation: "Styrofoam is een merk voor geëxtrudeerd polystyreen (piepschuim)." },
  { word: "Piepschuim", isBrand: false, explanation: "Piepschuim is een soortnaam." },
  { word: "Superlijm", isBrand: false, explanation: "Superlijm is een soortnaam." },
  { word: "Bison Kit", isBrand: true, explanation: "Bison is een lijmmerk." },
  { word: "Powerpoint", isBrand: true, explanation: "PowerPoint is een presentatieprogramma van Microsoft." },
  { word: "Presentatie", isBrand: false, explanation: "Presentatie is een soortnaam." },
  { word: "Tipp-Ex", isBrand: true, explanation: "Tipp-Ex is een merknaam voor correctievloeistof." },
  { word: "Correctievloeistof", isBrand: false, explanation: "Dit is de soortnaam." },
  { word: "Spa", isBrand: true, explanation: "Spa is een merknaam voor mineraalwater." },
  { word: "Mineraalwater", isBrand: false, explanation: "Mineraalwater is de soortnaam." },
  { word: "Aspirine", isBrand: true, explanation: "Aspirine is oorspronkelijk een merknaam van Bayer." },
  { word: "Pijnstiller", isBrand: false, explanation: "Pijnstiller is een soortnaam." },
  { word: "Lego", isBrand: true, explanation: "Lego is een merk van bouwsteentjes." },
  { word: "Bouwsteentje", isBrand: false, explanation: "Bouwsteentje is de soortnaam." },
  { word: "Barbie", isBrand: true, explanation: "Barbie is een merknaam van Mattel." },
  { word: "Aankleedpop", isBrand: false, explanation: "Aankleedpop is de soortnaam." },
  { word: "Pampers", isBrand: true, explanation: "Pampers is een merk babyluiers van Procter & Gamble." },
  { word: "Luier", isBrand: false, explanation: "Luier is een soortnaam." },
  { word: "Teflon", isBrand: true, explanation: "Teflon is een merknaam voor polytetrafluoretheen (PTFE)." },
  { word: "Anti-aanbaklaag", isBrand: false, explanation: "Anti-aanbaklaag is een soortnaam." },
  { word: "Velcro", isBrand: true, explanation: "Velcro is een merk van klittenband." },
  { word: "Klittenband", isBrand: false, explanation: "Klittenband is de soortnaam." },
  { word: "Jacuzzi", isBrand: true, explanation: "Jacuzzi is een merk van bubbelbaden." },
  { word: "Bubbelbad", isBrand: false, explanation: "Bubbelbad is de soortnaam." },
  { word: "Frisbee", isBrand: true, explanation: "Frisbee is een geregistreerd handelsmerk van Wham-O." },
  { word: "Werpschijf", isBrand: false, explanation: "Werpschijf is de soortnaam." },
  { word: "Pingpong", isBrand: true, explanation: "Ping-Pong is een merknaam voor tafeltennisproducten." },
  { word: "Tafeltennis", isBrand: false, explanation: "Tafeltennis is de sport (soortnaam)." },
  { word: "Thermos", isBrand: true, explanation: "Thermos is een merknaam van isoleerkannen." },
  { word: "Isoleerkan", isBrand: false, explanation: "Isoleerkan is de soortnaam." },
  { word: "Vaseline", isBrand: true, explanation: "Vaseline is een merknaam van Unilever." },
  { word: "Petroleumgelei", isBrand: false, explanation: "Petroleumgelei is de stofnaam/soortnaam." },
  { word: "Jeep", isBrand: true, explanation: "Jeep is een automerk." },
  { word: "Terreinwagen", isBrand: false, explanation: "Terreinwagen is de soortnaam." },
  { word: "Taser", isBrand: true, explanation: "Taser is een merk stroomstootwapen." },
  { word: "Stroomstootwapen", isBrand: false, explanation: "Stroomstootwapen is de soortnaam." },
  { word: "Polaroid", isBrand: true, explanation: "Polaroid is een cameramerk." },
  { word: "Directklaarcamera", isBrand: false, explanation: "Directklaarcamera is de soortnaam." },
  { word: "Walkman", isBrand: true, explanation: "Walkman is een merk van Sony." },
  { word: "Draagbare cassettespeler", isBrand: false, explanation: "Dit is de soortnaam." },
  { word: "Q-tips", isBrand: true, explanation: "Q-tips is een merk wattenstaafjes." },
  { word: "Dictafoon", isBrand: true, explanation: "Dictaphone is oorspronkelijk een merknaam." },
  { word: "Spraakrecorder", isBrand: false, explanation: "Spraakrecorder is de soortnaam." },
  { word: "Bubble Wrap", isBrand: true, explanation: "Bubble Wrap is een merknaam van Sealed Air." },
  { word: "Noppenfolie", isBrand: false, explanation: "Noppenfolie is de soortnaam." },
  { word: "Hoelahoep", isBrand: false, explanation: "In het Nederlands is hoelahoep een soortnaam (Hula Hoop is het merk in de VS)." },
  { word: "Popsicle", isBrand: true, explanation: "Popsicle is een merk waterijsjes." },
  { word: "Waterijsje", isBrand: false, explanation: "Waterijsje is de soortnaam." },
  { word: "Chiquita", isBrand: true, explanation: "Chiquita is een merk bananen." },
  { word: "Banaan", isBrand: false, explanation: "Banaan is een soortnaam." },
  { word: "Nintendo", isBrand: true, explanation: "Nintendo is een merk spelcomputers." },
  { word: "Spelcomputer", isBrand: false, explanation: "Spelcomputer is een soortnaam." },
  { word: "Smartphone", isBrand: false, explanation: "Smartphone is een soortnaam." },
  { word: "Laptop", isBrand: false, explanation: "Laptop is een soortnaam." },
  { word: "Yoghurt", isBrand: false, explanation: "Yoghurt is een soortnaam." },
  { word: "Appelsap", isBrand: false, explanation: "Appelsap is een soortnaam." },
  { word: "Plexiglas", isBrand: true, explanation: "Plexiglas is een merknaam voor acrylaat." },
  { word: "Acrylaat", isBrand: false, explanation: "Acrylaat is de soortnaam voor deze kunststof." },
  { word: "Memory", isBrand: true, explanation: "Memory is een geregistreerd gezelschapsspelmerk van Ravensburger." },
  { word: "Geheugenspel", isBrand: false, explanation: "Geheugenspel is een soortnaam." },
  { word: "Kevlar", isBrand: true, explanation: "Kevlar is een merknaam van DuPont voor aramidevezel." },
  { word: "Aramidevezel", isBrand: false, explanation: "Aramidevezel is de soortnaam." },
  { word: "Alcantara", isBrand: true, explanation: "Alcantara is een merknaam voor een kunststof suède-alternatief." },
  { word: "Suède", isBrand: false, explanation: "Suède is een soortnaam (leersoort)." },
  { word: "Tupperware", isBrand: true, explanation: "Tupperware is een merknaam voor kunststof bewaarbakjes." },
  { word: "Bewaarbakje", isBrand: false, explanation: "Bewaarbakje is een soortnaam." },
  { word: "Sellotape", isBrand: true, explanation: "Sellotape is een merk van plakband." },
  { word: "Plakband", isBrand: false, explanation: "Plakband is een soortnaam." },
  { word: "Dremel", isBrand: true, explanation: "Dremel is een merknaam voor roterend elektrisch gereedschap." },
  { word: "Klopboormachine", isBrand: false, explanation: "Klopboormachine is een soortnaam." },
  { word: "Ritalin", isBrand: true, explanation: "Ritalin is een merknaam voor methylfenidaat." },
  { word: "Methylfenidaat", isBrand: false, explanation: "Dit is de chemische stofnaam." },
  { word: "Paracetamol", isBrand: false, explanation: "Paracetamol is een soortnaam (de stofnaam), in tegenstelling tot Aspirine." },
  { word: "Uierzalf", isBrand: false, explanation: "Uierzalf is een soortnaam." },
  { word: "Whirlpool", isBrand: true, explanation: "Whirlpool is een merknaam van huishoudelijke apparatuur en bubbelbaden." },
  { word: "Bronwater", isBrand: false, explanation: "Bronwater is een soortnaam." },
  { word: "Coca-Cola", isBrand: true, explanation: "Coca-Cola is een merknaam." },
  { word: "Cola", isBrand: false, explanation: "Cola is een soortnaam." },
  { word: "Fanta", isBrand: true, explanation: "Fanta is een gedeponeerd merk van The Coca-Cola Company." },
  { word: "Gazeuse", isBrand: false, explanation: "Gazeuse is een traditionele soortnaam voor koolzuurhoudende limonade." },
  { word: "Cellofaan", isBrand: true, explanation: "Cellofaan is een merknaam van Innovia Films." },
  { word: "Skai", isBrand: true, explanation: "Skai is een merknaam van kunstleer." },
  { word: "Kunstleer", isBrand: false, explanation: "Kunstleer is een soortnaam." },
  { word: "Monopoly", isBrand: true, explanation: "Monopoly is een geregistreerd bordspelmerk." },
  { word: "Monopoly", isBrand: true, explanation: "Monopoly is een geregistreerd bordspelmerk." },
  { word: "Bordspel", isBrand: false, explanation: "Bordspel is een soortnaam." },
  { word: "Velux", isBrand: true, explanation: "Velux is een merk van dakramen." },
  { word: "Dakraam", isBrand: false, explanation: "Dakraam is de soortnaam." },
  { word: "Hero", isBrand: true, explanation: "Hero is een merknaam voor dranken en jam." },
  { word: "Jam", isBrand: false, explanation: "Jam is een soortnaam." },
  { word: "Ziploc", isBrand: true, explanation: "Ziploc is een merk van hersluitbare zakjes." },
  { word: "Druk-en-sluitzakje", isBrand: false, explanation: "Dit is de soortnaam." },
  { word: "Aquarium", isBrand: false, explanation: "Aquarium is een soortnaam." },
  { word: "Bison", isBrand: true, explanation: "Bison is een merknaam van lijm." },
  { word: "Lijm", isBrand: false, explanation: "Lijm is de soortnaam." },
  { word: "Lycra", isBrand: true, explanation: "Lycra is een merknaam voor elastaan." },
  { word: "Elastaan", isBrand: false, explanation: "Elastaan is de stofnaam/soortnaam." },
  { word: "Speedo", isBrand: true, explanation: "Speedo is een merk zwemkleding." },
  { word: "Zwembroek", isBrand: false, explanation: "Zwembroek is de soortnaam." },
  { word: "Thermos", isBrand: true, explanation: "Thermos is een merknaam." },
  { word: "Isoleerkan", isBrand: false, explanation: "Isoleerkan is de soortnaam." },
  { word: "Google", isBrand: true, explanation: "Google is een merk." },
  { word: "Zoekmachine", isBrand: false, explanation: "Zoekmachine is de soortnaam." },
  { word: "Band-Aid", isBrand: true, explanation: "Band-Aid is een pleistermerk." },
  { word: "Pleister", isBrand: false, explanation: "Pleister is de soortnaam." },
  { word: "Roquefort", isBrand: true, explanation: "Roquefort is een beschermde merknaam/streeknaam." },
  { word: "Blauwschimmelkaas", isBrand: false, explanation: "Blauwschimmelkaas is een soortnaam." },
  { word: "Spa", isBrand: true, explanation: "Spa is een merk van mineraalwater." },
  { word: "Mineraalwater", isBrand: false, explanation: "Mineraalwater is een soortnaam." },
  { word: "Chocomel", isBrand: true, explanation: "Chocomel is een merk chocolademelk." },
  { word: "Chocolademelk", isBrand: false, explanation: "Chocolademelk is een soortnaam." },
  { word: "Unox", isBrand: true, explanation: "Unox is een merk van soepen en rookworsten." },
  { word: "Rookworst", isBrand: false, explanation: "Rookworst is de soortnaam." },
  { word: "Calvé", isBrand: true, explanation: "Calvé is een merk van sauzen en pindakaas." },
  { word: "Pindakaas", isBrand: false, explanation: "Pindakaas is een soortnaam." },
  { word: "Campina", isBrand: true, explanation: "Campina is een zuivelmerk." },
  { word: "Yoghurt", isBrand: false, explanation: "Yoghurt is een soortnaam." },
  { word: "Douwe Egberts", isBrand: true, explanation: "Douwe Egberts is een koffiemerk." },
  { word: "Filterkoffie", isBrand: false, explanation: "Filterkoffie is een soortnaam." },
  { word: "Klompen", isBrand: false, explanation: "Klompen is een soortnaam voor houten schoenen." },
  { word: "Dr. Oetker", isBrand: true, explanation: "Dr. Oetker is een merk van bakproducten." },
  { word: "Bakpoeder", isBrand: false, explanation: "Bakpoeder is een soortnaam." },
  { word: "Hema", isBrand: true, explanation: "Hema is een merk/winkelketen." },
  { word: "Warenhuis", isBrand: false, explanation: "Warenhuis is een soortnaam." },
  { word: "Albert Heijn", isBrand: true, explanation: "Albert Heijn is een supermarktmerk." },
  { word: "Supermarkt", isBrand: false, explanation: "Supermarkt is een soortnaam." },
  { word: "Gazelle", isBrand: true, explanation: "Gazelle is een fietsmerk." },
  { word: "Stadsfiets", isBrand: false, explanation: "Stadsfiets is een soortnaam." },
  { word: "Swapfiets", isBrand: true, explanation: "Swapfiets is een merk van fietsabonnementen." },
  { word: "Leenfiets", isBrand: false, explanation: "Leenfiets is een soortnaam." },
  { word: "TomTom", isBrand: true, explanation: "TomTom is een merk navigatiesysteem." },
  { word: "Navigatie", isBrand: false, explanation: "Navigatie is een soortnaam." },
  { word: "Senseo", isBrand: true, explanation: "Senseo is een merk koffiezetapparaat." },
  { word: "Koffiepadmachine", isBrand: false, explanation: "Koffiepadmachine is de soortnaam." },
  { word: "Philips", isBrand: true, explanation: "Philips is een elektronicamerk." },
  { word: "Scheerapparaat", isBrand: false, explanation: "Scheerapparaat is de soortnaam." },
  { word: "Heineken", isBrand: true, explanation: "Heineken is een biermerk." },
  { word: "Pilsener", isBrand: false, explanation: "Pilsener is een soortnaam." },
  { word: "Grolsch", isBrand: true, explanation: "Grolsch is een biermerk." },
  { word: "Witbier", isBrand: false, explanation: "Witbier is een soortnaam." },
  { word: "Bavaria", isBrand: true, explanation: "Bavaria is een biermerk." },
  { word: "Radler", isBrand: false, explanation: "Radler is een soortnaam." },
  { word: "Zeeman", isBrand: true, explanation: "Zeeman is een textielwinkelketen." },
  { word: "Onderbroek", isBrand: false, explanation: "Onderbroek is een soortnaam." },
  { word: "Bugaboo", isBrand: true, explanation: "Bugaboo is een merk kinderwagens." },
  { word: "Kinderwagen", isBrand: false, explanation: "Kinderwagen is een soortnaam." }
,
  {
    "id": "1e2fe226-2ac1-45d1-a5ca-dad0a54a4854",
    "word": "Lidl",
    "isBrand": true,
    "explanation": "Lidl is een internationale supermarktketen."
  },
  {
    "id": "4bab5de8-7d7d-4b8e-a9e5-36164400c108",
    "word": "Appel",
    "isBrand": false,
    "explanation": "Dit is gewoon fruit, het merk heet Apple."
  },
  {
    "id": "6040ee5e-44fc-4493-8c48-78202ff4ad08",
    "word": "Gilette",
    "isBrand": false,
    "explanation": "Fout gespeld! Het echte merk is Gillette (met dubbel l)."
  },
  {
    "id": "4cebe1f5-64cb-466c-8b12-0d520029ecb1",
    "word": "Nutella",
    "isBrand": true,
    "explanation": "Nutella is de bekende hazelnootpasta van Ferrero."
  },
  {
    "id": "72c873ba-9ee4-4254-9ca8-98892b5d7a2b",
    "word": "Kleenex",
    "isBrand": true,
    "explanation": "Kleenex is een merk, ook al wordt het vaak gebruikt voor elk papieren zakdoekje."
  },
  {
    "id": "152035c5-c223-4543-8c81-5f6b37f0c772",
    "word": "Hagelslag",
    "isBrand": false,
    "explanation": "Hagelslag is de soortnaam, geen merknaam (zoals Venz of De Ruijter)."
  },
  {
    "id": "619cde11-1154-402c-bc35-8da9001b7b76",
    "word": "Bic",
    "isBrand": true,
    "explanation": "Bic is een bekend merk voor pennen en aanstekers."
  },
  {
    "id": "f146f566-7644-4850-9704-2f96818209c7",
    "word": "Pindakaas",
    "isBrand": false,
    "explanation": "Dit is de soortnaam, het merk is bijvoorbeeld Calvé."
  },
  {
    "id": "313483cb-23a2-41ad-97b7-c882610b70e7",
    "word": "Maggi",
    "isBrand": true,
    "explanation": "Maggi is een merk van soepen en smaakmakers."
  },
  {
    "id": "5f679b9b-b2a9-4d26-b8b3-2988f4e28f87",
    "word": "Vlugzout",
    "isBrand": false,
    "explanation": "Dit is een algemene term voor een sterk ruikend zout."
  },
  {
    "id": "a0662348-eaed-4457-bfdd-e4fda667bf33",
    "word": "TomTom",
    "isBrand": true,
    "explanation": "TomTom is een Nederlands merk van navigatiesystemen."
  },
  {
    "id": "5bb6353a-a65c-469c-b26f-8ab949288607",
    "word": "Spa",
    "isBrand": true,
    "explanation": "Spa is een merk mineraalwater, ook al noemt men vaak al het water zo."
  },
  {
    "id": "0f96675b-c3c4-400f-afc2-9cc318189bbc",
    "word": "Roomboter",
    "isBrand": false,
    "explanation": "Dit is de algemene term voor boter gemaakt van room."
  },
  {
    "id": "a1833367-de4d-4201-897f-9448e0dcdada",
    "word": "Chocomel",
    "isBrand": true,
    "explanation": "Chocomel is een merknaam. Chocolademelk is de soortnaam."
  },
  {
    "id": "fd4e3829-ee3a-455b-8f19-d9f06217762f",
    "word": "Fristi",
    "isBrand": true,
    "explanation": "Fristi is een merknaam voor een fruit-melkdrank."
  },
  {
    "id": "c92369a5-0b42-4bcb-a1db-79bb9690d2d4",
    "word": "Karnemelk",
    "isBrand": false,
    "explanation": "Dit is een soort zuivel, geen merk."
  },
  {
    "id": "5c92ca54-e795-45b5-99cc-271246d00614",
    "word": "Teflon",
    "isBrand": true,
    "explanation": "Teflon is eigenlijk een merknaam van Chemours."
  },
  {
    "id": "1e7a8503-5f1a-4d33-b5e6-9096bce6e5ef",
    "word": "Vaseline",
    "isBrand": true,
    "explanation": "Vaseline is een merknaam van Unilever, de stof heet petroleumgel."
  },
  {
    "id": "cfd45607-2d5e-4fe5-8089-e1ced366644a",
    "word": "Aspirine",
    "isBrand": true,
    "explanation": "Aspirine is oorspronkelijk een merknaam van Bayer."
  },
  {
    "id": "33a13d15-5bd8-4429-a4e1-4fb30839d907",
    "word": "Paracetamol",
    "isBrand": false,
    "explanation": "Dit is de generieke naam van de werkzame stof, geen merk."
  },
  {
    "id": "325ab76c-2bce-47db-9317-6c3d806e4cf7",
    "word": "Pampers",
    "isBrand": true,
    "explanation": "Pampers is een merk van Procter & Gamble."
  },
  {
    "id": "82a37c22-7049-44da-9341-e96c3005d324",
    "word": "Luier",
    "isBrand": false,
    "explanation": "Een luier is de algemene term voor dit product."
  },
  {
    "id": "e79c6086-43bc-46f3-898d-8aba779c0744",
    "word": "Maxi-Cosi",
    "isBrand": true,
    "explanation": "Maxi-Cosi is een merk, ook al wordt elk autostoeltje zo genoemd."
  },
  {
    "id": "c6365eb2-a9f0-4e2c-9f8f-826747d13c9e",
    "word": "Post-it",
    "isBrand": true,
    "explanation": "Post-it is een merk van 3M voor klevende notitieblaadjes."
  },
  {
    "id": "0e422bbd-bfaa-4cce-b64f-8fae29dd7d48",
    "word": "Plakband",
    "isBrand": false,
    "explanation": "Dit is de soortnaam, Scotch of Sellotape zijn merken."
  },
  {
    "id": "4ec7de6c-d3df-4d48-b259-94d445a4b7b2",
    "word": "Sellotape",
    "isBrand": true,
    "explanation": "Sellotape is van origine een merknaam."
  },
  {
    "id": "6e5c15b9-4dff-47f0-9bb2-bbb0f0fc0ee1",
    "word": "Roltrappen",
    "isBrand": false,
    "explanation": "Dit is de algemene term. (Ooit was Escalator wél een merk!)"
  },
  {
    "id": "398048cb-e7f9-49aa-905f-d8a10d2cde13",
    "word": "Escalator",
    "isBrand": false,
    "explanation": "Ooit een merk van Otis, maar nu zijn merkrechten verlopen en is het generiek (in het Engels)."
  },
  {
    "id": "bd1a6510-4611-4686-8184-580162bcd722",
    "word": "Kruidvat",
    "isBrand": true,
    "explanation": "Kruidvat is een bekende drogisterijketen."
  },
  {
    "id": "3f252b4b-96e0-4e91-a0ca-161df6ac4871",
    "word": "Drogist",
    "isBrand": false,
    "explanation": "Dit is de winkelsoort, geen specifiek merk."
  },
  {
    "id": "eaafc424-2516-4abe-9472-ccf751ea0010",
    "word": "Hema",
    "isBrand": true,
    "explanation": "De Hollandsche Eenheidsprijzen Maatschappij Amsterdam is zeker een merk!"
  },
  {
    "id": "0a3112f6-0f8a-4367-b91b-48ac082ec4ce",
    "word": "Rookworst",
    "isBrand": false,
    "explanation": "Dit is de soortnaam, ook al staat de Hema erom bekend."
  },
  {
    "id": "22058e7d-5f8f-4e99-9918-77c8f5430446",
    "word": "Unox",
    "isBrand": true,
    "explanation": "Unox is een bekend merk voor soep en worsten."
  },
  {
    "id": "f1eb211b-18c1-42a3-8509-d211ab9afc62",
    "word": "Bifi",
    "isBrand": true,
    "explanation": "BiFi is een bekend merk van vleessnacks."
  },
  {
    "id": "02ba3894-2f7f-4454-a21e-50119cedd8b2",
    "word": "Salami",
    "isBrand": false,
    "explanation": "Dit is een soort worst, geen merk."
  },
  {
    "id": "a122daa3-49d6-4fe7-8619-1d584fed2000",
    "word": "Dreft",
    "isBrand": true,
    "explanation": "Dreft is een populair merk afwasmiddel."
  },
  {
    "id": "4f83f239-dced-4fef-84fa-d4555f176b76",
    "word": "Afwasmiddel",
    "isBrand": false,
    "explanation": "Dit is de algemene term."
  },
  {
    "id": "25a639ca-4f97-4ccd-9bb9-95cbe1b22f67",
    "word": "Coca-Cola",
    "isBrand": true,
    "explanation": "Misschien wel het bekendste merk ter wereld."
  },
  {
    "id": "66687ab6-c9c2-48a4-a496-ceedf7a0695a",
    "word": "Cola",
    "isBrand": false,
    "explanation": "Cola is de dranksoort, geen merk."
  },
  {
    "id": "92959148-cda0-4b55-aa0c-7a7bcefab540",
    "word": "Fanta",
    "isBrand": true,
    "explanation": "Fanta is een merk van The Coca-Cola Company."
  },
  {
    "id": "705a6bc2-0c29-451b-a0e9-8e6035d1966a",
    "word": "Sinas",
    "isBrand": false,
    "explanation": "Sinas is de algemene benaming voor een sinaasappeldrank."
  },
  {
    "id": "0d53311b-ae75-4a49-88b4-5a2b408357d2",
    "word": "7UP",
    "isBrand": true,
    "explanation": "7UP is een merk van frisdrank."
  },
  {
    "id": "2263e3d4-2de9-4062-b1e1-1d5f4f4143ae",
    "word": "Sprite",
    "isBrand": true,
    "explanation": "Sprite is een frisdrankmerk van Coca-Cola."
  },
  {
    "id": "f4f3e917-ba64-43f9-91dd-68d9ba8f5335",
    "word": "Spa Rood",
    "isBrand": true,
    "explanation": "Spa is het merk. Bruiswater is de algemene term."
  },
  {
    "id": "1c614572-e10f-4d31-b7fb-037f1d443e27",
    "word": "Bruiswater",
    "isBrand": false,
    "explanation": "Dit is de algemene naam voor water met koolzuur."
  },
  {
    "id": "13f92c5a-d0e5-42b1-a315-5bb7ce95258e",
    "word": "Senseo",
    "isBrand": true,
    "explanation": "Senseo is een koffiezetapparaatmerk van Philips en Douwe Egberts."
  },
  {
    "id": "5fe7a7ef-e807-4253-9b7b-615d9c60558d",
    "word": "Koffiepad",
    "isBrand": false,
    "explanation": "Dit is de algemene term voor het koffiefiltertje."
  },
  {
    "id": "b2821ccd-cc08-4ccd-95ae-1d991b18fb8d",
    "word": "Nespresso",
    "isBrand": true,
    "explanation": "Nespresso is een merk van Nestlé."
  },
  {
    "id": "6729ea3f-cf04-494c-a633-b1d913f50833",
    "word": "Douwe Egberts",
    "isBrand": true,
    "explanation": "Een iconisch Nederlands koffiemerk."
  },
  {
    "id": "d1c7b533-bc91-46c0-a989-8fae14a386b3",
    "word": "Espresso",
    "isBrand": false,
    "explanation": "Dit is een koffiebereiding, geen merk."
  }
];
