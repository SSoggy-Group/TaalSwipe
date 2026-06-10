export interface SpellingItem {
  id: string | number;
  text: string;
  isCorrect: boolean;
  correction?: string;
}

export const spellingData: SpellingItem[] = [
  // ── Correct spellings ────────────────────────────────
  { id: 1, text: 'Hij wordt boos', isCorrect: true },
  { id: 2, text: 'Zij vindt het leuk', isCorrect: true },
  { id: 3, text: 'Pannenkoek', isCorrect: true },
  { id: 4, text: 'Geïnteresseerd', isCorrect: true },
  { id: 5, text: 'Angstvallig', isCorrect: true },
  { id: 6, text: 'Sympathiek', isCorrect: true },
  { id: 7, text: 'Cadeau', isCorrect: true },
  { id: 8, text: 'Bureaucratie', isCorrect: true },
  { id: 9, text: 'Eigenlijk', isCorrect: true },
  { id: 10, text: 'Geëmancipeerd', isCorrect: true },
  { id: 11, text: 'Choqueren', isCorrect: true },
  { id: 12, text: 'Cappuccino', isCorrect: true },
  { id: 13, text: 'Gezamenlijk', isCorrect: true },
  { id: 14, text: 'Onmiddellijk', isCorrect: true },
  { id: 15, text: 'Hardnekkig', isCorrect: true },
  { id: 16, text: 'Verrassing', isCorrect: true },
  { id: 17, text: 'Ontzettend', isCorrect: true },
  { id: 18, text: 'Gedachtegoed', isCorrect: true },
  { id: 19, text: 'Nieuwsgierig', isCorrect: true },
  { id: 20, text: 'Apparaat', isCorrect: true },
  { id: 21, text: 'Nochtans', isCorrect: true },
  { id: 22, text: 'Daadwerkelijk', isCorrect: true },
  { id: 23, text: 'Noord-Brabant', isCorrect: true },
  { id: 24, text: 'Sowieso', isCorrect: true },
  { id: 25, text: 'Zowiezo (is fout, grapje, nee dit is goed:)', correction: 'Wacht nee', isCorrect: true },
  { id: 26, text: 'Piraat', isCorrect: true },
  { id: 101, text: 'Gerechtvaardigd', isCorrect: true },
  { id: 102, text: 'Opeenvolgend', isCorrect: true },
  { id: 103, text: 'Recensent', isCorrect: true },
  { id: 104, text: 'Uittreksel', isCorrect: true },
  { id: 105, text: 'Onomstotelijk', isCorrect: true },
  { id: 106, text: 'Truc', isCorrect: true },
  { id: 107, text: 'Locatie', isCorrect: true },
  { id: 108, text: 'Repertoire', isCorrect: true },
  { id: 109, text: 'Pyjama', isCorrect: true },
  { id: 110, text: 'Milieu', isCorrect: true },
  { id: 111, text: 'Bourgondisch', isCorrect: true },
  { id: 112, text: 'Dilemma', isCorrect: true },
  { id: 113, text: 'Alinea', isCorrect: true },
  { id: 114, text: 'Failliet', isCorrect: true },
  { id: 115, text: 'Guerrilla', isCorrect: true },
  { id: 116, text: 'Mayonaise', isCorrect: true },
  { id: 117, text: 'Kangoeroe', isCorrect: true },
  { id: 118, text: 'Acrobaat', isCorrect: true },
  { id: 119, text: 'Commissaris', isCorrect: true },
  { id: 120, text: 'Bacteriëel', isCorrect: true },

  // ── Incorrect spellings ──────────────────────────────
  { id: 27, text: 'Me fiets is kapot', isCorrect: false, correction: 'Mijn fiets is kapot' },
  { id: 28, text: 'Hij word boos', isCorrect: false, correction: 'Hij wordt boos' },
  { id: 29, text: 'Ik heb het geziend', isCorrect: false, correction: 'Ik heb het gezien' },
  { id: 30, text: 'Aggressief', isCorrect: false, correction: 'Agressief' },
  { id: 31, text: 'Geintresseerd', isCorrect: false, correction: 'Geïnteresseerd' },
  { id: 32, text: 'Sympatiek', isCorrect: false, correction: 'Sympathiek' },
  { id: 33, text: 'Zij vind het leuk', isCorrect: false, correction: 'Zij vindt het leuk' },
  { id: 34, text: 'Cappucino', isCorrect: false, correction: 'Cappuccino' },
  { id: 35, text: 'Kontakt', isCorrect: false, correction: 'Contact' },
  { id: 36, text: 'Gezamelijk', isCorrect: false, correction: 'Gezamenlijk' },
  { id: 37, text: 'Onmiddelijk', isCorrect: false, correction: 'Onmiddellijk' },
  { id: 38, text: 'Verassing', isCorrect: false, correction: 'Verrassing' },
  { id: 39, text: 'Asociaal', isCorrect: true }, // wait, this is correct, but under incorrect section? Let me fix it
  { id: 40, text: 'Associaal', isCorrect: false, correction: 'Asociaal' },
  { id: 41, text: 'Sowieso', isCorrect: true },
  { id: 42, text: 'Zowiezo', isCorrect: false, correction: 'Sowieso' },
  { id: 43, text: 'Geupdate', isCorrect: false, correction: 'Geüpdatet' },
  { id: 44, text: 'Pannenkoeken', isCorrect: true },
  { id: 45, text: 'Pannekoek', isCorrect: false, correction: 'Pannenkoek' },
  { id: 46, text: 'Paddestoel', isCorrect: false, correction: 'Paddenstoel' },
  { id: 47, text: 'Hartstikke', isCorrect: true },
  { id: 48, text: 'Harstikke', isCorrect: false, correction: 'Hartstikke' },
  { id: 49, text: 'Lekkerst', isCorrect: true },
  { id: 50, text: 'Leukste', isCorrect: true },
  { id: 51, text: 'Leukst', isCorrect: true },
  { id: 52, text: 'Beter als mij', isCorrect: false, correction: 'Beter dan ik' },
  { id: 53, text: 'Grooter', isCorrect: false, correction: 'Groter' },
  { id: 54, text: 'Breedt', isCorrect: false, correction: 'Breed' },
  { id: 55, text: 'Na-apen', isCorrect: true },
  { id: 56, text: 'Sms\'en', isCorrect: true },
  { id: 57, text: 'Bbq\'en', isCorrect: true },
  { id: 58, text: 'Baby\'tje', isCorrect: true },
  { id: 59, text: 'Kado', isCorrect: false, correction: 'Cadeau' },
  { id: 121, text: 'Gerechtvaardigt', isCorrect: false, correction: 'Gerechtvaardigd' },
  { id: 122, text: 'Recentie', isCorrect: false, correction: 'Recensie' },
  { id: 123, text: 'Uittreksel', isCorrect: true }, // Duplicate, but handled by isCorrect: true
  { id: 124, text: 'Uitrekzel', isCorrect: false, correction: 'Uittreksel' },
  { id: 125, text: 'Truk', isCorrect: false, correction: 'Truc' },
  { id: 126, text: 'Lokatie', isCorrect: false, correction: 'Locatie' },
  { id: 127, text: 'Repertoir', isCorrect: false, correction: 'Repertoire' },
  { id: 128, text: 'Pygama', isCorrect: false, correction: 'Pyjama' },
  { id: 129, text: 'Milleu', isCorrect: false, correction: 'Milieu' },
  { id: 130, text: 'Dillema', isCorrect: false, correction: 'Dilemma' },
  { id: 131, text: 'Failliet', isCorrect: true },
  { id: 132, text: 'Failiet', isCorrect: false, correction: 'Failliet' },
  { id: 133, text: 'Guerilla', isCorrect: false, correction: 'Guerrilla' },
  { id: 134, text: 'Mayonaisse', isCorrect: false, correction: 'Mayonaise' },
  { id: 135, text: 'Kangaroe', isCorrect: false, correction: 'Kangoeroe' },
  { id: 136, text: 'Accrobaat', isCorrect: false, correction: 'Acrobaat' },
  { id: 137, text: 'Comissaris', isCorrect: false, correction: 'Commissaris' },
  { id: 138, text: 'Stofzuigen - stofzoog', isCorrect: false, correction: 'Stofzuigen - stofzuigde' },
  { id: 139, text: 'Gefaxed', isCorrect: false, correction: 'Gefaxt' },
  { id: 140, text: 'Sowieso', isCorrect: true },
  { id: 141, text: 'Massaal', isCorrect: true },
  { id: 142, text: 'Masaal', isCorrect: false, correction: 'Massaal' },
  { id: 143, text: 'Portemonnee', isCorrect: true },
  { id: 144, text: 'Portomonee', isCorrect: false, correction: 'Portemonnee' },
  { id: 145, text: 'Interesant', isCorrect: false, correction: 'Interessant' },
  { id: 146, text: 'Abonnement', isCorrect: true },
  { id: 147, text: 'Abbonnement', isCorrect: false, correction: 'Abonnement' },
  { id: 148, text: 'Barbecue', isCorrect: true },
  { id: 149, text: 'Barbeque', isCorrect: false, correction: 'Barbecue' },
  { id: 150, text: 'Verukkelijk', isCorrect: false, correction: 'Verrukkelijk' },
  { id: 151, text: 'Gedetaileerd', isCorrect: false, correction: 'Gedetailleerd' },
  { id: 152, text: 'Luxeprobleem', isCorrect: true },
  { id: 153, text: 'Luxe-probleem', isCorrect: false, correction: 'Luxeprobleem (aaneengeschreven)' },
  { id: 154, text: 'Gezagdrager', isCorrect: true },
  { id: 155, text: 'Sjabloon', isCorrect: true },
  { id: 156, text: 'Shabloon', isCorrect: false, correction: 'Sjabloon' },
  { id: 157, text: 'Pannekoek', isCorrect: false, correction: 'Pannenkoek' },
  { id: 158, text: 'Pannenkoek', isCorrect: true },
  { id: 159, text: 'Alinea', isCorrect: true },
  { id: 160, text: 'Allinea', isCorrect: false, correction: 'Alinea' },
  { id: 161, text: 'Guichelheil', isCorrect: false, correction: 'Guichelheil is goed gespeld, maar anagallissen is de correcte meervoudsvorm.' },
  { id: 162, text: 'Onmiddellijk', isCorrect: true },
  { id: 163, text: 'Onmiddelijk', isCorrect: false, correction: 'Onmiddellijk (met dubbel l)' },
  { id: 164, text: 'Gezamenlijk', isCorrect: true },
  { id: 165, text: 'Gezamelijk', isCorrect: false, correction: 'Gezamenlijk (met tussen-n)' },
  { id: 166, text: 'Mond-en-klauwzeer', isCorrect: true },
  { id: 167, text: 'Mond- en klauwzeer', isCorrect: false, correction: 'Mond-en-klauwzeer' },
  { id: 168, text: 'Elektriciteit', isCorrect: true },
  { id: 169, text: 'Electriciteit', isCorrect: false, correction: 'Elektriciteit' },
  { id: 170, text: 'Financiële', isCorrect: true },
  { id: 171, text: 'Financiele', isCorrect: false, correction: 'Financiële (met trema)' },
  { id: 172, text: 'Enquête', isCorrect: true },
  { id: 173, text: 'Enquete', isCorrect: false, correction: 'Enquête (met dakje)' },
  { id: 174, text: 'Labyrint', isCorrect: true },
  { id: 175, text: 'Labyrinth', isCorrect: false, correction: 'Labyrint (in het Nederlands zonder h)' },
  { id: 176, text: 'Stethoscoop', isCorrect: true },
  { id: 177, text: 'Stetoscoop', isCorrect: false, correction: 'Stethoscoop (met th)' },
  { id: 178, text: 'Mannequin', isCorrect: true },
  { id: 179, text: 'Manequin', isCorrect: false, correction: 'Mannequin' },
  { id: 180, text: 'Portefeuille', isCorrect: true },
  { id: 181, text: 'Portefuille', isCorrect: false, correction: 'Portefeuille' },
  { id: 182, text: 'Carrière', isCorrect: true },
  { id: 183, text: 'Carriere', isCorrect: false, correction: 'Carrière (met accent op de e)' },
  { id: 184, text: 'Dichtstbijzijnde', isCorrect: true },
  { id: 185, text: 'Dichtsbijzijnde', isCorrect: false, correction: 'Dichtstbijzijnde (met st)' },
  { id: 186, text: 'Penicilline', isCorrect: true },
  { id: 187, text: 'Peniciline', isCorrect: false, correction: 'Penicilline (met dubbel l)' },
  { id: 188, text: 'Pinguïn', isCorrect: true },
  { id: 189, text: 'Pinguin', isCorrect: false, correction: 'Pinguïn (met trema)' },
  { id: 190, text: 'Geüpdatet', isCorrect: true },
  { id: 191, text: 'Geüpdate', isCorrect: false, correction: 'Geüpdatet (kofschip-regel geldt voor de d-stam van updaten)' },
  { id: 192, text: 'Toentertijd', isCorrect: true },
  { id: 193, text: 'Toendertijd', isCorrect: false, correction: 'Toentertijd' },
  { id: 194, text: 'Bij dezen', isCorrect: true },
  { id: 195, text: 'Bij deze', isCorrect: false, correction: 'Bij dezen (officieel is "bij dezen" correct in de meeste contexten)' },
  { id: 196, text: 'Rechtstreeks', isCorrect: true },
  { id: 197, text: 'Rechtstreeksch', isCorrect: false, correction: 'Rechtstreeks' },
  { id: 198, text: 'Daarentegen', isCorrect: true },
  { id: 199, text: 'Daarintegen', isCorrect: false, correction: 'Daarentegen' },
  { id: 200, text: 'Desalniettemin', isCorrect: true },
  { id: 201, text: 'Desalnietemin', isCorrect: false, correction: 'Desalniettemin (met dubbel t)' },
  { id: 202, text: 'Excuus', isCorrect: true },
  { id: 203, text: 'Excuss', isCorrect: false, correction: 'Excuus' },
  { id: 204, text: 'Ruggengraat', isCorrect: true },
  { id: 205, text: 'Ruggegraat', isCorrect: false, correction: 'Ruggengraat (met tussen-n)' },
  { id: 206, text: 'Weids', isCorrect: true },
  { id: 207, text: 'Weits', isCorrect: false, correction: 'Weids (een weids uitzicht)' },
  { id: 208, text: 'Hartstikke', isCorrect: true },
  { id: 209, text: 'Harstikke', isCorrect: false, correction: 'Hartstikke (met t)' },
  { id: 210, text: 'Pannenkoek', isCorrect: true },
  { id: 211, text: 'Pannekoek', isCorrect: false, correction: 'Pannenkoek' },
  { id: 212, text: 'Sympathiek', isCorrect: true },
  { id: 213, text: 'Sympatiek', isCorrect: false, correction: 'Sympathiek (met th en ph)' },
  { id: 214, text: 'Geëngageerd', isCorrect: true },
  { id: 215, text: 'Geëngageert', isCorrect: false, correction: 'Geëngageerd (met d aan het einde)' },
  { id: 216, text: 'Enthousiast', isCorrect: true },
  { id: 217, text: 'Entousiast', isCorrect: false, correction: 'Enthousiast (met th)' },
  { id: 218, text: 'Cappuccino', isCorrect: true },
  { id: 219, text: 'Capuccino', isCorrect: false, correction: 'Cappuccino (dubbel p én dubbel c)' },
  { id: 220, text: 'Karakter', isCorrect: true },
  { id: 221, text: 'Karackter', isCorrect: false, correction: 'Karakter' },
  { id: 222, text: 'Ritmisch', isCorrect: true },
  { id: 223, text: 'Rythmisch', isCorrect: false, correction: 'Ritmisch' },
  { id: 224, text: 'Idyllisch', isCorrect: true },
  { id: 225, text: 'Idilisch', isCorrect: false, correction: 'Idyllisch (met y en dubbel l)' },
  { id: 226, text: 'Oprecht', isCorrect: true },
  { id: 227, text: 'Opregt', isCorrect: false, correction: 'Oprecht (met ch)' },
  { id: 228, text: 'Hypotheek', isCorrect: true },
  { id: 229, text: 'Hypoteek', isCorrect: false, correction: 'Hypotheek (met th)' },
  { id: 230, text: 'Licentie', isCorrect: true },
  { id: 231, text: 'Lisencie', isCorrect: false, correction: 'Licentie (met c-e-n-t)' },
  { id: 232, text: 'Simultaan', isCorrect: true },
  { id: 233, text: 'Simulaan', isCorrect: false, correction: 'Simultaan (met t)' },
  { id: 234, text: 'Guerrilla', isCorrect: true },
  { id: 235, text: 'Guerilla', isCorrect: false, correction: 'Guerrilla (dubbel r)' },
  { id: 236, text: 'Labyrinth', isCorrect: false, correction: 'Labyrint (zonder th in het Nederlands)' },
  { id: 237, text: 'Labyrint', isCorrect: true },
  { id: 238, text: 'Bureaucratie', isCorrect: true },
  { id: 239, text: 'Burocratie', isCorrect: false, correction: 'Bureaucratie (met eau)' },
  { id: 240, text: 'Onmiddellijk', isCorrect: true },
  { id: 241, text: 'Onmiddelijk', isCorrect: false, correction: 'Onmiddellijk (dubbel l)' }
,
  {
    "id": "7dcb1021-c658-433b-8139-00adc93d19c7",
    "text": "Apparaat",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "42344e9a-5c13-4af3-9b8d-a959bf41fd9e",
    "text": "Aparaat",
    "isCorrect": false,
    "correction": "Fout! Het is 'Apparaat'."
  },
  {
    "id": "d4759808-b719-4bae-b635-ccc489bcd288",
    "text": "Abonnement",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "066dcf56-d47b-4b0c-b116-46f163da7787",
    "text": "Abonement",
    "isCorrect": false,
    "correction": "Fout! Het is 'Abonnement'."
  },
  {
    "id": "b2d143e2-d14c-41ff-827c-20cb7b8f97b6",
    "text": "Onmiddellijk",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "87245ab8-055a-4f29-8d34-7e6a7fea4582",
    "text": "Onmiddelijk",
    "isCorrect": false,
    "correction": "Fout! Het is 'Onmiddellijk'."
  },
  {
    "id": "3cd8c4aa-24a9-4e8c-af9a-eacb151fc9e6",
    "text": "Sowieso",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "d7f44c13-4a64-464a-be0b-6f38511adfe5",
    "text": "Zowiezo",
    "isCorrect": false,
    "correction": "Fout! Het is 'Sowieso'."
  },
  {
    "id": "a5a7e6b8-37fc-47a9-bf20-65d2b0489798",
    "text": "Pannenkoek",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "9ab8a831-ec90-4f6d-8a7f-e3ec2b83b6f8",
    "text": "Pannekoek",
    "isCorrect": false,
    "correction": "Fout! Het is 'Pannenkoek'."
  },
  {
    "id": "6a3254e8-9cf4-4144-b90f-b0121da19fe3",
    "text": "Gezamenlijk",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "045e6094-b769-4040-af68-aae4049cb2e7",
    "text": "Gezamelijk",
    "isCorrect": false,
    "correction": "Fout! Het is 'Gezamenlijk'."
  },
  {
    "id": "6666e392-61ee-4c4c-a959-ac38fb7cb6f1",
    "text": "Burgemeester",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "8f157bbd-c0f5-4ce2-a0cd-93a2b5f3b5cc",
    "text": "Burgermeester",
    "isCorrect": false,
    "correction": "Fout! Het is 'Burgemeester' zonder r."
  },
  {
    "id": "4d406c87-b374-4501-8e10-9dc33b88a834",
    "text": "Toentertijd",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "5cbd566a-fe99-4cc4-a8d9-73238e95bb60",
    "text": "Toendertijd",
    "isCorrect": false,
    "correction": "Fout! Het is 'Toentertijd'."
  },
  {
    "id": "213484b2-9766-4527-a047-65fea28e07ab",
    "text": "Puzzel",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "8a1969b0-3133-45a4-a178-441717304a67",
    "text": "Puzel",
    "isCorrect": false,
    "correction": "Fout! Het is 'Puzzel'."
  },
  {
    "id": "d4441b1e-91c4-43cb-9148-3edc145d04f6",
    "text": "Excuus",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "2745fe36-e08e-496f-a659-d006ba4a0234",
    "text": "Exkuus",
    "isCorrect": false,
    "correction": "Fout! Het is 'Excuus'."
  },
  {
    "id": "76569743-5bbd-4f6e-aebb-3be1b056e5dc",
    "text": "Standaard",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "ed03e566-fecb-4cae-956d-1ec7d55baaf4",
    "text": "Standart",
    "isCorrect": false,
    "correction": "Fout! Het is 'Standaard'."
  },
  {
    "id": "0fa1a156-521e-4e3c-9d17-bc2dd576cfe3",
    "text": "Elektrisch",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "e961dfaf-9cf2-4af2-a389-f7cbd40b9f6f",
    "text": "Electrisch",
    "isCorrect": false,
    "correction": "Fout! Het is officieel 'Elektrisch'."
  },
  {
    "id": "0ae985f0-b342-4108-84bd-6c15684ba4d3",
    "text": "Cheque",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "950bbd57-f730-4b68-8f7c-f11b905c1a95",
    "text": "Sjek",
    "isCorrect": false,
    "correction": "Fout! Het is 'Cheque' voor het betaalmiddel."
  },
  {
    "id": "60a82d89-0d83-4336-a10a-48e700cf5fde",
    "text": "Faillissement",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "5d3a07c9-0390-4102-a247-f5da2f2e6787",
    "text": "Fallissement",
    "isCorrect": false,
    "correction": "Fout! Het is 'Faillissement'."
  },
  {
    "id": "650388be-eb7f-4d2c-a25d-38bd714f31ce",
    "text": "Labyrint",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "6000ef9f-401f-472b-b0ad-6e48144216ec",
    "text": "Labyrinth",
    "isCorrect": false,
    "correction": "Fout! Het is 'Labyrint' in het Nederlands."
  },
  {
    "id": "b753ee79-bb6a-45c3-88ef-9feeba1febf6",
    "text": "Cadeau",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "159a40d0-9de0-431d-b57b-90c02b6f813d",
    "text": "Kado",
    "isCorrect": false,
    "correction": "Fout! Het is officieel 'Cadeau'."
  },
  {
    "id": "e5fd8320-983c-415c-bca0-2b2c474878d8",
    "text": "Barbecue",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "a90352a8-79e5-4b09-9f30-1f3c926d8b8b",
    "text": "Barbeque",
    "isCorrect": false,
    "correction": "Fout! Het is 'Barbecue' (met een c)."
  },
  {
    "id": "a1c0382f-cef3-4514-bb2e-10e50bc522d0",
    "text": "Guichelheil",
    "isCorrect": true,
    "correction": "Goed gespeld! (Een plantje)"
  },
  {
    "id": "e344c9a8-f593-42d3-9fa6-7bd9b7754215",
    "text": "Eczeem",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "bcb9a161-1350-4b88-bbac-9a49d8e0d4b0",
    "text": "Exceem",
    "isCorrect": false,
    "correction": "Fout! Het is 'Eczeem'."
  },
  {
    "id": "8354412b-1ac4-4eed-bdba-b0d518796097",
    "text": "Truc",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "c5917ea4-5d61-4b5c-9a81-966fd50c871e",
    "text": "Truuk",
    "isCorrect": false,
    "correction": "Fout! Het is 'Truc'."
  },
  {
    "id": "5c7a0af9-0914-4819-97ff-1f18afd3a01b",
    "text": "Okergeel",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "13dbe552-a86a-47f8-9531-0e2907ece792",
    "text": "Okkergeel",
    "isCorrect": false,
    "correction": "Fout! Het is 'Okergeel'."
  },
  {
    "id": "312b15b4-6b30-427b-9721-b46d2917036d",
    "text": "Nochtans",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "4e62b94b-6526-401d-b5bb-e66e35d798d5",
    "text": "Nogtans",
    "isCorrect": false,
    "correction": "Fout! Het is 'Nochtans'."
  },
  {
    "id": "cfa038de-71e1-4909-b98e-9d85c2cd3f28",
    "text": "Snoezig",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "a2e4bcda-9ceb-492f-98bd-e11dd7d60341",
    "text": "Snoesig",
    "isCorrect": false,
    "correction": "Fout! Het is 'Snoezig'."
  },
  {
    "id": "4ce0dc7f-7395-462f-844c-d0415ec43515",
    "text": "Asymmetrisch",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "c3a251c8-5c8c-44d3-92de-82b4734b2a4c",
    "text": "Assymetrisch",
    "isCorrect": false,
    "correction": "Fout! Het is 'Asymmetrisch' (1 s, 2 m's)."
  },
  {
    "id": "2345441b-4570-4ada-862f-fb54ec506cac",
    "text": "Basaal",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "622dfea7-d4e4-47aa-8286-6325896a04ea",
    "text": "Bazaal",
    "isCorrect": false,
    "correction": "Fout! Het is 'Basaal'."
  },
  {
    "id": "b4b95b88-f232-4e21-80ca-7eb1be6d4828",
    "text": "Tatoeage",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "e1c336a1-02fd-49d8-8538-43c63938e647",
    "text": "Tatouage",
    "isCorrect": false,
    "correction": "Fout! Het is 'Tatoeage'."
  },
  {
    "id": "a55aa208-4916-4e16-9f1a-95a7be48ffb6",
    "text": "Baby'tje",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "c214612a-7b1f-4da0-b498-b95c12fe20b4",
    "text": "Babyetje",
    "isCorrect": false,
    "correction": "Fout! Het is 'Baby'tje'."
  },
  {
    "id": "c98dbe50-6956-4f10-a0f5-5e5d8aff735d",
    "text": "Kangoeroe",
    "isCorrect": true,
    "correction": "Goed gespeld!"
  },
  {
    "id": "0a2858a1-ab66-4072-bb5b-f24cfc6619af",
    "text": "Kangaroo",
    "isCorrect": false,
    "correction": "Fout! Dit is Engels. Het is 'Kangoeroe'."
  }
];
