export interface StraattaalItem {
  id: string | number;
  word: string;
  definition: string;
  isReal: boolean;
}

export const straattaalData: StraattaalItem[] = [
  // ── Real Dutch street slang ──────────────────────────
  { id: 1, word: 'Fissa', definition: 'Een feestje / party', isReal: true },
  { id: 2, word: 'Mocro', definition: 'Iemand van Marokkaanse afkomst', isReal: true },
  { id: 3, word: 'Swaffelen', definition: 'Ergens tegenaan slaan met je piemel', isReal: true },
  { id: 4, word: 'Parra', definition: 'Paranoia / gestrest zijn', isReal: true },
  { id: 5, word: 'Sjansen', definition: 'Flirten of versieren', isReal: true },
  { id: 6, word: 'Bansen', definition: 'Snel weggaan / vluchten', isReal: true },
  { id: 7, word: 'Gestoord', definition: 'Heel cool of indrukwekkend', isReal: true },
  { id: 8, word: 'Hansen', definition: 'Hangen / chillen op straat', isReal: true },
  { id: 9, word: 'Paansen', definition: 'Vertrekken / weggaan', isReal: true },
  { id: 10, word: 'Skull', definition: 'Zoveel mogelijk drinken in een keer', isReal: true },
  { id: 11, word: 'Wollah', definition: 'Ik zweer het / echt waar', isReal: true },
  { id: 12, word: 'Flex', definition: 'Opscheppen / laten zien wat je hebt', isReal: true },
  { id: 13, word: 'Doekoe', definition: 'Geld', isReal: true },
  { id: 14, word: 'Tatta', definition: 'Een typische Nederlander (kaaskop)', isReal: true },
  { id: 15, word: 'Skotoe', definition: 'Politie', isReal: true },
  { id: 16, word: 'Scotoe', definition: 'Politie (andere spelling)', isReal: true },
  { id: 17, word: 'Barki', definition: 'Honderd euro', isReal: true },
  { id: 18, word: 'Donnie', definition: 'Tien euro', isReal: true },
  { id: 19, word: 'Meijer', definition: 'Honderd euro (ouderwets/slang)', isReal: true },
  { id: 20, word: 'Lauw', definition: 'Cool of gaaf', isReal: true },
  { id: 21, word: 'Wack', definition: 'Slecht of nep', isReal: true },
  { id: 22, word: 'Kaolo', definition: 'Versterkend woord (scheldwoord)', isReal: true },
  { id: 23, word: 'Fatoe', definition: 'Een grapje', isReal: true },
  { id: 24, word: 'Drip', definition: 'Stijlvolle kleding of uitstraling', isReal: true },
  { id: 25, word: 'Clout', definition: 'Aanzien, roem of invloed', isReal: true },
  { id: 26, word: 'Kippie', definition: 'Mooi meisje', isReal: true },
  { id: 27, word: 'Patta', definition: 'Schoen of sneaker', isReal: true },
  { id: 101, word: 'Mattie', definition: 'Vriend of kameraad', isReal: true },
  { id: 102, word: 'Loesoe', definition: 'Weggaan / ik ben weg', isReal: true },
  { id: 103, word: 'Challas', definition: 'Tot ziens / doei', isReal: true },
  { id: 104, word: 'Zjnoen', definition: 'Irritatie / boosheid', isReal: true },
  { id: 105, word: 'Niffo', definition: 'Neef / vriend', isReal: true },
  { id: 106, word: 'Fatoeman', definition: 'Grappenmaker / iemand die niet serieus is', isReal: true },
  { id: 107, word: 'Osso', definition: 'Huis', isReal: true },
  { id: 108, word: 'Damsko', definition: 'Amsterdam', isReal: true },
  { id: 109, word: 'Agga', definition: 'Den Haag', isReal: true },
  { id: 110, word: 'Strijder', definition: 'Iemand die respect verdient', isReal: true },
  { id: 111, word: 'Wagyu', definition: 'Heel goed / topkwaliteit', isReal: true },
  { id: 112, word: 'Ziek', definition: 'Heel gaaf / indrukwekkend', isReal: true },
  { id: 113, word: 'G', definition: 'Gast / vriend', isReal: true },
  { id: 114, word: 'Kieren', definition: 'Vluchten / snel weggaan', isReal: true },
  { id: 115, word: 'Scennoe', definition: 'Een raar tafereel / ruzie', isReal: true },
  { id: 116, word: 'Barkie', definition: 'Honderd (euro)', isReal: true },
  { id: 117, word: 'Gappie', definition: 'Vriend / maat', isReal: true },
  { id: 118, word: 'Tjie', definition: 'Meisje', isReal: true },
  { id: 119, word: 'Pokoe', definition: 'Liedje / muzieknummer', isReal: true },
  { id: 120, word: 'Afoe', definition: 'Een halfje (bijv. van een sigaret)', isReal: true },

  // ── AI-generated fake slang ──────────────────────────
  { id: 28, word: 'Grompen', definition: 'Snel weglopen zonder reden', isReal: false },
  { id: 29, word: 'Kleppie', definition: 'Iemand die altijd te laat komt', isReal: false },
  { id: 30, word: 'Snorrelen', definition: 'Stiekem iemands eten opeten', isReal: false },
  { id: 31, word: 'Drotten', definition: 'Hard lachen om een flauwe grap', isReal: false },
  { id: 32, word: 'Pietsen', definition: 'Je fiets kwijtraken na een avond uit', isReal: false },
  { id: 33, word: 'Bliemsen', definition: 'Heel snel een bericht typen', isReal: false },
  { id: 34, word: 'Vansen', definition: 'Zonder jas naar buiten gaan in de winter', isReal: false },
  { id: 35, word: 'Knakko', definition: 'Een onhandige maar sympathieke persoon', isReal: false },
  { id: 36, word: 'Plansen', definition: 'Een plan maken maar nooit uitvoeren', isReal: false },
  { id: 37, word: 'Raffelen', definition: 'Heel snel en slordig praten', isReal: false },
  { id: 38, word: 'Tjansen', definition: 'Expres langzaam lopen om iemand te irriteren', isReal: false },
  { id: 39, word: 'Stansen', definition: 'Iets moois per ongeluk kapotmaken', isReal: false },
  { id: 40, word: 'Kroefen', definition: 'Tot laat uitslapen in het weekend', isReal: false },
  { id: 41, word: 'Slieren', definition: 'Met opzet slecht rijden om stoer te doen', isReal: false },
  { id: 42, word: 'Flokken', definition: 'Massaal naar een feestje gaan', isReal: false },
  { id: 43, word: 'Dweep', definition: 'Een saai persoon', isReal: false },
  { id: 44, word: 'Snakko', definition: 'Een hele gierige vriend', isReal: false },
  { id: 45, word: 'Ploffen', definition: 'Zomaar in slaap vallen op de bank', isReal: false },
  { id: 46, word: 'Transen', definition: 'Net doen alsof je luistert, maar wegdromen', isReal: false },
  { id: 47, word: 'Sluimen', definition: 'Iets beloven maar niet waarmaken', isReal: false },
  { id: 48, word: 'Kwats', definition: 'Nieuwe schoenen die al vies zijn', isReal: false },
  { id: 49, word: 'Smoken', definition: 'Wanneer je je eten laat aanbranden', isReal: false },
  { id: 50, word: 'Spijtsen', definition: 'Spijt hebben van iets wat je gekocht hebt', isReal: false },
  { id: 51, word: 'Zwiepen', definition: 'Snel van onderwerp veranderen in een gesprek', isReal: false },
  { id: 121, word: 'Flonzen', definition: 'Moeilijk doen om niks', isReal: false },
  { id: 122, word: 'Slampen', definition: 'Met je voeten slepen tijdens het lopen', isReal: false },
  { id: 123, word: 'Ploeken', definition: 'Onverwacht iets laten vallen', isReal: false },
  { id: 124, word: 'Blingeren', definition: 'Heel oppervlakkig praten', isReal: false },
  { id: 125, word: 'Dratsen', definition: 'In de modder stappen', isReal: false },
  { id: 126, word: 'Spoefen', definition: 'Een bericht typen maar niet versturen', isReal: false },
  { id: 127, word: 'Trakkelen', definition: 'Over je eigen woorden struikelen', isReal: false },
  { id: 128, word: 'Plonken', definition: 'Je telefoon op je gezicht laten vallen', isReal: false },
  { id: 129, word: 'Griezeltje', definition: 'Een klein koud windje', isReal: false },
  { id: 130, word: 'Zwakken', definition: 'Doen alsof je ziek bent om niet te werken', isReal: false },
  { id: 131, word: 'Brommen', definition: 'De hele tijd klagen over het weer', isReal: false },
  { id: 132, word: 'Kliepen', definition: 'Stiekem meeluisteren', isReal: false },
  { id: 133, word: 'Flurven', definition: 'Doelloos scrollen op social media', isReal: false },
  { id: 134, word: 'Smukken', definition: 'Je mond afvegen met je mouw', isReal: false },
  { id: 135, word: 'Rinzen', definition: 'Heel hard niezen', isReal: false },
  { id: 136, word: 'Kratsen', definition: 'Iets lelijks per ongeluk mooi vinden', isReal: false },
  { id: 137, word: 'Sjokken', definition: 'Te laat komen op een date', isReal: false },
  { id: 138, word: 'Wammen', definition: 'De deur per ongeluk te hard dichtgooien', isReal: false },
  { id: 139, word: 'Tjilpen', definition: 'Een heel hoog lachje hebben', isReal: false },
  { id: 140, word: 'Poffen', definition: 'Een foute grap maken die niemand snapt', isReal: false },
  { id: 141, word: 'Litty', definition: 'Erg leuk, gezellig of gaaf', isReal: true },
  { id: 142, word: 'Barkie', definition: 'Honderd (euro)', isReal: true },
  { id: 143, word: 'Doezoe', definition: 'Duizend (euro)', isReal: true },
  { id: 144, word: 'Challas', definition: 'Tot ziens, doei', isReal: true },
  { id: 145, word: 'Gappie', definition: 'Vriend', isReal: true },
  { id: 146, word: 'Kaulo', definition: 'Versterkend woord, erg of klote', isReal: true },
  { id: 147, word: 'Faya', definition: 'Erg, vervelend of jammer', isReal: true },
  { id: 148, word: 'Tatta', definition: 'Nederlander (vaak stereotiep)', isReal: true },
  { id: 149, word: 'Zwoep', definition: 'Snel wegglippen', isReal: false },
  { id: 150, word: 'Krappoe', definition: 'Een krap truitje dragen', isReal: false },
  { id: 151, word: 'Plonko', definition: 'Iemand die telkens valt', isReal: false },
  { id: 152, word: 'Flinco', definition: 'Een neppe gouden ketting', isReal: false },
  { id: 153, word: 'Moker', definition: 'Heel erg, enorm', isReal: true },
  { id: 154, word: 'Drip', definition: 'Een toffe stijl qua kleding', isReal: true },
  { id: 155, word: 'Scotoe', definition: 'De politie', isReal: true },
  { id: 156, word: 'Kloezoe', definition: 'Iets geheim houden', isReal: false },
  { id: 157, word: 'Sloef', definition: 'Verzonnen woord voor iets saais', isReal: false },
  { id: 158, word: 'Ewa', definition: 'Hoi / wat is er?', isReal: true },
  { id: 159, word: 'Drerrie', definition: 'Jongen / vriend / gast', isReal: true },
  { id: 160, word: 'Flous', definition: 'Geld', isReal: true },
  { id: 161, word: 'Habiba', definition: 'Schatje / geliefde', isReal: true },
  { id: 162, word: 'Skeer', definition: 'Blut / arm / goedkoop', isReal: true },
  { id: 163, word: 'Chawa', definition: 'Kwartje / 25 cent / 25 euro', isReal: true },
  { id: 164, word: 'Spanko', definition: 'Heel erg dronken of onder invloed', isReal: true },
  { id: 165, word: 'Tjappen', definition: 'Eten / voedsel nuttigen', isReal: true },
  { id: 166, word: 'Tjappie', definition: 'Een sukkel of rare gast', isReal: true },
  { id: 167, word: 'Wakka', definition: 'Lopen / wandelen', isReal: true },
  { id: 168, word: 'Hosselen', definition: 'Werken om geld te verdienen / handelen', isReal: true },
  { id: 169, word: 'Vato', definition: 'Gast / kerel', isReal: true },
  { id: 170, word: 'Sannie', definition: 'Dingen / spullen / drugs', isReal: true },
  { id: 171, word: 'Brizzo', definition: 'Verzonnen woord voor een erg dure fiets', isReal: false },
  { id: 172, word: 'Dlengen', definition: 'Verzonnen woord voor buiten in de regen wachten', isReal: false },
  { id: 173, word: 'Floeska', definition: 'Verzonnen woord voor een leugenaar', isReal: false },
  { id: 174, word: 'Krompie', definition: 'Verzonnen woord voor iets dat scheef staat', isReal: false },
  { id: 175, word: 'Ploeso', definition: 'Verzonnen woord voor een zacht kussen', isReal: false },
  { id: 176, word: 'Snoebie', definition: 'Verzonnen woord voor een schattig hondje', isReal: false },
  { id: 177, word: 'Tjokkel', definition: 'Verzonnen woord voor een heel klein snoepje', isReal: false },
  { id: 178, word: 'Wanko', definition: 'Verzonnen woord voor iemand die te veel slaapt', isReal: false },
  { id: 179, word: 'Zwoepie', definition: 'Verzonnen woord voor een snel voorbijrijdende scooter', isReal: false },
  { id: 180, word: 'Grolik', definition: 'Verzonnen woord voor een chagrijnig persoon', isReal: false },
  { id: 181, word: 'Agga', definition: 'Den Haag', isReal: true },
  { id: 182, word: 'Damsko', definition: 'Amsterdam', isReal: true },
  { id: 183, word: 'Roffa', definition: 'Rotterdam', isReal: true },
  { id: 184, word: 'Utca', definition: 'Utrecht', isReal: true },
  { id: 185, word: 'Wiesie', definition: 'Een klein wietje / joint', isReal: true },
  { id: 186, word: 'Fissa', definition: 'Feest / party', isReal: true },
  { id: 187, word: 'Kippie', definition: 'Meisje', isReal: true },
  { id: 188, word: 'Planga', definition: 'Zonnebril / bril', isReal: true },
  { id: 189, word: 'Toko', definition: 'Winkel / zaak', isReal: true },
  { id: 190, word: 'Torie', definition: 'Verhaal / gebeurtenis', isReal: true },
  { id: 191, word: 'Waggie', definition: 'Auto', isReal: true },
  { id: 192, word: 'Kluis', definition: 'Verzonnen woord voor een zakkenroller', isReal: false },
  { id: 193, word: 'Matoe', definition: 'Verzonnen woord voor een nep-vriend', isReal: false },
  { id: 194, word: 'Zwiep', definition: 'Verzonnen woord voor iemand die te hard rijdt', isReal: false },
  { id: 195, word: 'Trinna', definition: 'Trein', isReal: true },
  { id: 196, word: 'Winkelwaggie', definition: 'Verzonnen woord voor een winkelwagentje', isReal: false },
  { id: 197, word: 'Sloebie', definition: 'Verzonnen woord voor een gierig persoon', isReal: false },
  { id: 198, word: 'Flesko', definition: 'Verzonnen woord voor een lege fles', isReal: false },
  { id: 199, word: 'Ploentje', definition: 'Verzonnen woord voor een klein probleempje', isReal: false },
  { id: 200, word: 'Kraagie', definition: 'Verzonnen woord voor een poloshirt', isReal: false },
  { id: 201, word: 'Bansen', definition: 'Hard werken / grinden', isReal: true },
  { id: 202, word: 'Drilli', definition: 'Drill / agressief / hard', isReal: true },
  { id: 203, word: 'Faka', definition: 'Hoe gaat het? / Begroeting', isReal: true },
  { id: 204, word: 'Gappie', definition: 'Kerel / vriend', isReal: true },
  { id: 205, word: 'Habsi', definition: 'Bajes / gevangenis', isReal: true },
  { id: 206, word: 'Jalla', definition: 'Schiet op / kom op', isReal: true },
  { id: 207, word: 'Kansen', definition: 'Proberen te versieren', isReal: true },
  { id: 208, word: 'Mansen', definition: 'Verzonnen woord voor hard feesten', isReal: false },
  { id: 209, word: 'Blokko', definition: 'Verzonnen woord voor een betonblok', isReal: false },
  { id: 210, word: 'Patta', definition: 'Schoenen / sneakers', isReal: true },
  { id: 211, word: 'Ransen', definition: 'Verzonnen woord voor snel praten', isReal: false },
  { id: 212, word: 'Sjansen', definition: 'Flirten / versieren', isReal: true },
  { id: 213, word: 'Tokkie', definition: 'Asociaal persoon / proleet', isReal: true },
  { id: 214, word: 'Vansen', definition: 'Verzonnen woord voor doelloos rondlopen', isReal: false },
  { id: 215, word: 'Wappen', definition: 'Verzonnen woord voor vechten', isReal: false },
  { id: 216, word: 'Yansen', definition: 'Verzonnen woord voor zeuren', isReal: false },
  { id: 217, word: 'Zooi', definition: 'Spullen / rommel / groep mensen', isReal: true },
  { id: 218, word: 'Aight', definition: 'Oké / alright', isReal: true },
  { id: 219, word: 'Broeki', definition: 'Broer / vriend (informeel)', isReal: true },
  { id: 220, word: 'Chill', definition: 'Lekker / relaxed', isReal: true },
  { id: 221, word: 'Doekoe', definition: 'Geld', isReal: true },
  { id: 222, word: 'Eansen', definition: 'Verzonnen woord voor eten bestellen', isReal: false },
  { id: 223, word: 'Flippen', definition: 'Gek worden / door het lint gaan', isReal: true },
  { id: 224, word: 'Ghetto', definition: 'Wijk / buurt (niet per se negatief in straattaal)', isReal: true },
  { id: 225, word: 'Habibi', definition: 'Lieverd / schatje (uit het Arabisch)', isReal: true },
  { id: 226, word: 'Isse', definition: 'Verzonnen woord voor een grapje', isReal: false },
  { id: 227, word: 'Kansen', definition: 'Proberen te versieren / kans proberen', isReal: true },
  { id: 228, word: 'Mansen', definition: 'Verzonnen woord voor aankleden', isReal: false },
  { id: 229, word: 'Nepp', definition: 'Nep / niet echt', isReal: true },
  { id: 230, word: 'Plaskie', definition: 'Verzonnen woord voor een plastic tasje', isReal: false }
,
  {
    "id": "1138aba0-3558-443e-86c0-de9ca9f521eb",
    "word": "Fittie",
    "isReal": true,
    "definition": "Een ruzie of gevecht."
  },
  {
    "id": "b3af7919-7715-431a-9b31-7fd2006d91c9",
    "word": "Snats",
    "isReal": true,
    "definition": "Cocaïne of soms iets snels."
  },
  {
    "id": "f0980163-de00-42d3-900f-4d86df8de5b4",
    "word": "Ballas",
    "isReal": true,
    "definition": "Geld of grote bedragen."
  },
  {
    "id": "496cdf81-e69b-4f29-b0c4-715bd61e2c5c",
    "word": "Zjoez",
    "isReal": false,
    "definition": "AI-verzonnen: Klinkt als iets snels of een auto, maar betekent niks."
  },
  {
    "id": "a7dbb16f-2525-4b0b-9990-895fa779112c",
    "word": "Osso",
    "isReal": true,
    "definition": "Huis (Sranantongo)."
  },
  {
    "id": "d0054e67-d62a-4434-980a-30c1928271a7",
    "word": "Floes",
    "isReal": true,
    "definition": "Geld (Arabisch)."
  },
  {
    "id": "18612b3b-ddfa-496c-a422-e2f5874f9160",
    "word": "Planga",
    "isReal": true,
    "definition": "Zonnebril."
  },
  {
    "id": "7da2db2f-add6-437c-ba42-adff442b8912",
    "word": "Tantoe",
    "isReal": true,
    "definition": "Heel erg, heel veel."
  },
  {
    "id": "5adee564-8da4-4200-95ed-a3627c5fcea7",
    "word": "Moker",
    "isReal": true,
    "definition": "Heel erg (bijv. mokerhard)."
  },
  {
    "id": "8c9ed915-38bf-43fe-ab8c-eb656d3fa3c4",
    "word": "Dampoe",
    "isReal": true,
    "definition": "Stank, of iets dat zwaar tegenvalt."
  },
  {
    "id": "0688c784-1ffe-4df8-a0f1-b61a04ffcc20",
    "word": "Djoek",
    "isReal": true,
    "definition": "Steken (met een mes)."
  },
  {
    "id": "64cf9918-2371-4d0c-9bf6-3e065d12226d",
    "word": "Skooien",
    "isReal": true,
    "definition": "Bedelen om iets."
  },
  {
    "id": "61bd06c6-1341-4e3c-81f3-bc92ca1a17c5",
    "word": "Kliti",
    "isReal": false,
    "definition": "AI-verzonnen woord voor sleutel."
  },
  {
    "id": "ef7a4371-6955-4e76-9278-6c202b446f53",
    "word": "Spang",
    "isReal": true,
    "definition": "Lekker, mooi of spannend."
  },
  {
    "id": "8bac3a2c-ff92-4467-829b-12bb86840aa0",
    "word": "Bonje",
    "isReal": true,
    "definition": "Ruzie (oudere straattaal/Bargoens)."
  },
  {
    "id": "809aabfd-a1ee-4c78-984b-9c817c1ddd9b",
    "word": "Tjoeper",
    "isReal": false,
    "definition": "AI-verzonnen woord voor een dikke auto."
  },
  {
    "id": "0208fbf8-c071-4c76-a833-dc9f443feb87",
    "word": "Lauw",
    "isReal": true,
    "definition": "Cool, gek, of bizar."
  },
  {
    "id": "7376b638-7719-4deb-8137-b693b6f87865",
    "word": "Waggi",
    "isReal": true,
    "definition": "Auto."
  },
  {
    "id": "2635fbb1-4532-4967-b5f5-56fb7227496c",
    "word": "Wiggel",
    "isReal": false,
    "definition": "AI-verzonnen: een nep-versie van Waggi."
  },
  {
    "id": "e03ee438-6dde-4a1e-bfc7-20036ce1d1ff",
    "word": "Doekoe",
    "isReal": true,
    "definition": "Geld."
  },
  {
    "id": "58aaf383-7df2-4105-9a21-1daef2e7b58f",
    "word": "Pikket",
    "isReal": false,
    "definition": "AI-verzonnen: Zogenaamd een klein bedrag."
  },
  {
    "id": "76adaab6-c546-4ed5-b45b-995027630d0d",
    "word": "Skaffa",
    "isReal": true,
    "definition": "High of stoned zijn."
  },
  {
    "id": "e5f1e762-4f60-4852-8dc1-f195e8c0ca5a",
    "word": "Faya",
    "isReal": true,
    "definition": "Vuur, heet, of erg (bijv. 'dat is faya')."
  },
  {
    "id": "0065efb0-0532-484b-aba9-64a7f9b73f1b",
    "word": "Brakka",
    "isReal": true,
    "definition": "Inbraak."
  },
  {
    "id": "136105c2-c7b4-41bf-b839-36cba0f47ed5",
    "word": "Barkie",
    "isReal": true,
    "definition": "Honderd (euro)."
  },
  {
    "id": "46e8b591-6727-48fe-b054-ee0ec27b3a63",
    "word": "Donnie",
    "isReal": true,
    "definition": "Tien (euro)."
  },
  {
    "id": "ee126b1d-7ae5-478b-a355-cd82254207e9",
    "word": "Doezoe",
    "isReal": true,
    "definition": "Duizend (euro)."
  },
  {
    "id": "3dee8194-e8f6-4d50-b474-723d789fcff6",
    "word": "Tjak",
    "isReal": true,
    "definition": "Slecht spul of drugs."
  },
  {
    "id": "e7a1c66f-168e-4c5b-b0d7-258c2193ee00",
    "word": "Drerrie",
    "isReal": true,
    "definition": "Jongen, vriend, gast."
  },
  {
    "id": "c9801044-960f-4dbd-bffe-ea274a26a5f6",
    "word": "Sjapie",
    "isReal": true,
    "definition": "Dommerik of sukkel."
  },
  {
    "id": "b522fd3a-825f-4750-a0ef-81b067dd46b3",
    "word": "Patoe",
    "isReal": false,
    "definition": "AI-verzonnen: zogenaamd een grote jas."
  },
  {
    "id": "753b8117-0c6e-4fa7-b6d8-e5f013a07062",
    "word": "Gappie",
    "isReal": true,
    "definition": "Vriend."
  },
  {
    "id": "d25887b7-038f-4c4d-9d63-821eac8ce94d",
    "word": "Matttie",
    "isReal": true,
    "definition": "Vriend (Mattie)."
  },
  {
    "id": "1b53d2c8-c95d-4b0a-80f9-2f6cf2f23780",
    "word": "Hosselen",
    "isReal": true,
    "definition": "Geld verdienen (vaak op straat) of versieren."
  },
  {
    "id": "18bbe75f-c288-4690-9d45-172948d42406",
    "word": "Scotoe",
    "isReal": true,
    "definition": "Politie."
  },
  {
    "id": "7e929d1f-61d5-4390-9958-217a87f2527c",
    "word": "Woute",
    "isReal": true,
    "definition": "Politie (oude straattaal)."
  },
  {
    "id": "f8e49dd2-89ad-4611-bf90-487cf72735ae",
    "word": "Popo",
    "isReal": true,
    "definition": "Politie."
  },
  {
    "id": "6e0a7f75-ce20-4c5b-b6b3-9ab35eab5f36",
    "word": "Bami",
    "isReal": false,
    "definition": "AI-verzonnen: als scheldwoord, maar bami is gewoon eten."
  },
  {
    "id": "36de479a-734a-4fcc-8456-8ccbffef8a58",
    "word": "Skeer",
    "isReal": true,
    "definition": "Gierig of blut."
  },
  {
    "id": "2acc910d-8604-4dbc-aff5-34b87abf90be",
    "word": "Plakka",
    "isReal": false,
    "definition": "AI-verzonnen: zogenaamd een bankbiljet."
  },
  {
    "id": "5828be7b-444c-4f3b-adbd-253cecd3a3e5",
    "word": "Kek",
    "isReal": true,
    "definition": "Leuk, hip (ouderwets)."
  },
  {
    "id": "403246ac-62b8-4156-a11f-973bf93b4bd5",
    "word": "Lijp",
    "isReal": true,
    "definition": "Gek of heel vet."
  },
  {
    "id": "d884c4c9-61a4-451f-94c9-172849266710",
    "word": "Faf",
    "isReal": false,
    "definition": "AI-verzonnen: zogenaamd een saai feestje."
  },
  {
    "id": "3f1d329e-1c1a-4e6b-85a1-bf95c42fe142",
    "word": "Chillen",
    "isReal": true,
    "definition": "Ontspannen of rondhangen."
  },
  {
    "id": "fe703ce4-90ed-4410-a6af-46b92c3333fa",
    "word": "Fixen",
    "isReal": true,
    "definition": "Regelen of versieren."
  },
  {
    "id": "846a6737-7f47-441e-ba67-ca96c7e7ad16",
    "word": "Gauw",
    "isReal": false,
    "definition": "Niet echt straattaal, gewoon een Nederlands woord."
  },
  {
    "id": "e2e237f3-2cdb-48e1-9397-f2a14bde4a15",
    "word": "Poko",
    "isReal": false,
    "definition": "AI-verzonnen: klinkt als pokoe (muziek), maar fout."
  },
  {
    "id": "d4c30d62-10a3-46a7-9d9d-24846c4de808",
    "word": "Pokoe",
    "isReal": true,
    "definition": "Liedje of track."
  },
  {
    "id": "8a08c700-9267-4526-aae3-c732f46dda62",
    "word": "Illie",
    "isReal": true,
    "definition": "Illegaal of gek/vet."
  },
  {
    "id": "d63fa70b-684a-478c-b071-0ebe0baf3cc0",
    "word": "Strijder",
    "isReal": true,
    "definition": "Iemand die hard werkt of iets goeds doet."
  },
  {
    "id": "fbb710b4-eaf6-46fb-8699-2a6d9a45eba2",
    "word": "Gruwelijk",
    "isReal": true,
    "definition": "Heel erg goed of vet."
  },
  {
    "id": "b8c09227-818a-4039-801b-d93160862162",
    "word": "Bossen",
    "isReal": true,
    "definition": "Slaan, kapotmaken of opmaken (geld)."
  },
  {
    "id": "11824331-c733-4a70-bf45-cdf7d2c29078",
    "word": "Zemmerman",
    "isReal": false,
    "definition": "AI-verzonnen samenvoeging van zemmel en timmerman."
  },
  {
    "id": "83b1e7a5-cdf6-4ca6-b578-029e0d87f2fb",
    "word": "Zemmel",
    "isReal": true,
    "definition": "Scheldwoord voor homo (Arabisch)."
  },
  {
    "id": "9bb64e21-38fc-434c-a820-e5ee395eb41c",
    "word": "Niffauw",
    "isReal": true,
    "definition": "Neef of vriend."
  },
  {
    "id": "3a30096f-8617-49e3-9a48-15dca3632f13",
    "word": "Fouilleren",
    "isReal": false,
    "definition": "Dit is gewoon een officieel Nederlands woord."
  },
  {
    "id": "08143a8f-9976-453f-a01b-151271c05bad",
    "word": "Smikkelbeer",
    "isReal": false,
    "definition": "AI-verzonnen als straattaal."
  },
  {
    "id": "c367488b-add8-4272-9e63-0e723affd6a8",
    "word": "Brak",
    "isReal": true,
    "definition": "Ziek of moe na veel drinken."
  },
  {
    "id": "73d72e11-2217-485a-ab89-46a9d8ae1fa2",
    "word": "Para",
    "isReal": true,
    "definition": "Paranoïde of boos."
  },
  {
    "id": "e0f773aa-c020-4050-9269-b1df70e3c0d1",
    "word": "Kieren",
    "isReal": true,
    "definition": "Betrapt worden of falen (oud-Hollands/Bargoens)."
  },
  {
    "id": "7150cd2a-4b2b-42d9-8158-02063f2e303e",
    "word": "Wastie",
    "isReal": false,
    "definition": "AI-verzonnen: zogenaamd een wasmachine of badkamer."
  },
  {
    "id": "b0659023-c019-4920-ba96-f094262b1778",
    "word": "Pik",
    "isReal": true,
    "definition": "Vriend of gast."
  },
  {
    "id": "e16daf70-9883-4ec2-b691-de63361bbd43",
    "word": "Trek",
    "isReal": false,
    "definition": "AI-verzonnen in deze context, betekent gewoon honger."
  },
  {
    "id": "27065855-bb2c-4b3c-9731-57c2a2c21d93",
    "word": "Spijbelen",
    "isReal": false,
    "definition": "Dit is Standaardnederlands, geen slang."
  },
  {
    "id": "94852e48-cca5-4f9b-a384-f749dd05e92b",
    "word": "Zolder",
    "isReal": false,
    "definition": "Dit is gewoon het bovenste van een huis."
  },
  {
    "id": "52a47a0d-52c8-4929-96c8-fa1c2cd45f36",
    "word": "Aandacht",
    "isReal": false,
    "definition": "Dit is Standaardnederlands."
  },
  {
    "id": "88905229-0a9e-4cad-9b7d-24756a6f97b1",
    "word": "Bocht",
    "isReal": true,
    "definition": "Slechte drank (Bargoens/informeel)."
  },
  {
    "id": "78bc2955-8858-4761-a14b-279d9761ff08",
    "word": "Zopie",
    "isReal": true,
    "definition": "Ouderwets woord voor drankje."
  },
  {
    "id": "6471bc47-cea5-4782-a6c7-90b9dd897af1",
    "word": "Giechel",
    "isReal": true,
    "definition": "Gezicht (bijv. 'een klap voor je giechel')."
  },
  {
    "id": "3b46a7b0-21e0-4b13-81b5-383b604f66a4",
    "word": "Peers",
    "isReal": false,
    "definition": "AI-verzonnen: nep-woord voor ogen."
  },
  {
    "id": "4f048b1b-243f-4739-8418-1888b1bc9320",
    "word": "Dopen",
    "isReal": false,
    "definition": "AI-verzonnen: nep-straatwoord voor chillen."
  },
  {
    "id": "134527f3-bf2b-415e-ac86-1180981e6a79",
    "word": "Blaka",
    "isReal": true,
    "definition": "Zwart (Sranantongo)."
  },
  {
    "id": "cacf5954-c17c-4ea2-b7f9-2be9ec6b58a2",
    "word": "Gloeika",
    "isReal": false,
    "definition": "AI-verzonnen vuurwapen."
  },
  {
    "id": "1859b932-1dc9-44ee-80fa-90ac7bffb81c",
    "word": "Fitti",
    "isReal": true,
    "definition": "Andere spelling voor ruzie/fittie."
  }
];
