export interface DunglishItem {
  id: string | number;
  text: string;
  explanation: string;
  isRealProverb: boolean;
}

export const dunglishData: DunglishItem[] = [
  // Real Dutch proverbs literally translated
  { id: 1, text: 'Now the monkey comes out of the sleeve', explanation: 'Nu komt de aap uit de mouw — The truth is revealed', isRealProverb: true },
  { id: 2, text: 'Unfortunately peanut butter', explanation: 'Helaas pindakaas — Too bad, so sad', isRealProverb: true },
  { id: 3, text: 'To fall with your nose in the butter', explanation: 'Met je neus in de boter vallen — To be very lucky', isRealProverb: true },
  { id: 4, text: 'Make that the cat wise', explanation: 'Maak dat de kat wijs — Tell that to someone gullible', isRealProverb: true },
  { id: 5, text: 'It rains pipe stems', explanation: 'Het regent pijpenstelen — It is raining very hard', isRealProverb: true },
  { id: 6, text: 'To have a board before your head', explanation: 'Een plank voor je hoofd hebben — To be clueless', isRealProverb: true },
  { id: 7, text: 'The best helmsmen stand on shore', explanation: 'De beste stuurlui staan aan wal — Everyone\'s an expert from the sidelines', isRealProverb: true },
  { id: 8, text: 'Now comes the donkey out of the stable', explanation: 'Daar komt het aapje uit het mouwje — The hidden problem surfaces', isRealProverb: true },
  { id: 9, text: 'To walk on your toes', explanation: 'Op je tenen lopen — To tread carefully / be cautious', isRealProverb: true },
  { id: 10, text: 'He who has butter on his head should stay out of the sun', explanation: 'Wie boter op zijn hoofd heeft, moet uit de zon blijven — If you\'re guilty, don\'t draw attention', isRealProverb: true },
  { id: 11, text: 'To hit the nail on the head', explanation: 'De spijker op de kop slaan — To be exactly right', isRealProverb: true },
  { id: 12, text: 'That\'s mustard after the meal', explanation: 'Dat is mosterd na de maaltijd — That\'s too late to be useful', isRealProverb: true },
  { id: 13, text: 'Tall trees catch a lot of wind', explanation: 'Hoge bomen vangen veel wind — Important people attract criticism', isRealProverb: true },
  { id: 14, text: 'It walks in the soup', explanation: 'Het loopt in de soep — It is going completely wrong', isRealProverb: true },
  { id: 15, text: 'There is not a ball on TV', explanation: 'Er is geen bal op tv — There is absolutely nothing good on TV', isRealProverb: true },
  { id: 16, text: 'I am taking you out of the tent', explanation: 'Ik lok je uit de tent — I am provoking you to react', isRealProverb: true },
  { id: 17, text: 'That hits like a pair of tongs on a pig', explanation: 'Dat slaat als een tang op een varken — That makes absolutely no sense', isRealProverb: true },
  { id: 18, text: 'We will see which way the wind blows', explanation: 'We zien wel uit welke hoek de wind waait — We\'ll wait and see how things develop', isRealProverb: true },
  { id: 19, text: 'It\'s pouring old wives', explanation: 'Het regent oude wijven — It is raining heavily', isRealProverb: true },
  { id: 20, text: 'There is a little snake under the grass', explanation: 'Er schuilt een addertje onder het gras — There\'s a hidden catch or problem', isRealProverb: true },
  { id: 21, text: 'He fell through the basket', explanation: 'Hij viel door de mand — His true intentions were revealed', isRealProverb: true },
  { id: 22, text: 'Buying a cat in the sack', explanation: 'Een kat in de zak kopen — To buy something without inspecting it first', isRealProverb: true },
  { id: 23, text: 'To tie the cat to the bacon', explanation: 'De kat op het spek binden — To put temptation right in front of someone', isRealProverb: true },
  { id: 24, text: 'You can shake it from your belly', explanation: 'Dat kun je wel op je buik schrijven — You can forget about that', isRealProverb: true },
  { id: 25, text: 'To talk like a headless chicken', explanation: 'Praten als een kip zonder kop — To talk nonsense or act frantically', isRealProverb: true },
  { id: 101, text: 'To sit with the baked pears', explanation: 'Met de gebakken peren zitten — To be left with the consequences', isRealProverb: true },
  { id: 102, text: 'It walks out of the hand', explanation: 'Het loopt uit de hand — It is getting out of control', isRealProverb: true },
  { id: 103, text: 'He is as thick as a door', explanation: 'Hij is zo dom als het achtereind van een varken — He is very stupid (door variation)', isRealProverb: true },
  { id: 104, text: 'I shall let them smell a poopy', explanation: 'Ik zal ze een poepie laten ruiken — I will show them what I can do', isRealProverb: true },
  { id: 105, text: 'He took the legs', explanation: 'Hij nam de benen — He ran away', isRealProverb: true },
  { id: 106, text: 'It strikes like a pair of pliers on a pig', explanation: 'Het slaat als een tang op een varken — It makes no sense at all', isRealProverb: true },
  { id: 107, text: 'That is another cook\'s biscuit', explanation: 'Dat is andere koek — That is quite a different story', isRealProverb: true },
  { id: 108, text: 'We are sitting in the same boat', explanation: 'We zitten in hetzelfde schuitje — We are in the same situation', isRealProverb: true },
  { id: 109, text: 'To catch mosquitoes', explanation: 'Muggenziften — To nitpick', isRealProverb: true },
  { id: 110, text: 'To search for nails at low water', explanation: 'Spijkers op laag water zoeken — To complain about trivial details', isRealProverb: true },
  { id: 111, text: 'Make that the cat wise', explanation: 'Maak dat de kat wijs — I do not believe you', isRealProverb: true },
  { id: 112, text: 'Forward with the goat', explanation: 'Vooruit met de geit — Let\'s get moving / let\'s go', isRealProverb: true },
  { id: 113, text: 'To sweep your own street', explanation: 'Voor je eigen deur vegen — Mind your own business', isRealProverb: true },
  { id: 114, text: 'To look the cat out of the tree', explanation: 'De kat uit de boom kijken — To wait and see', isRealProverb: true },
  { id: 115, text: 'I am taking the legs', explanation: 'Ik neem de benen — I am leaving / running away', isRealProverb: true },
  { id: 116, text: 'To step out of the bed with the wrong leg', explanation: 'Met het verkeerde been uit bed stappen — To wake up in a bad mood', isRealProverb: true },
  { id: 117, text: 'To throw the cap after it', explanation: 'Er met de pet naar gooien — To do a bad job / not care', isRealProverb: true },
  { id: 118, text: 'To talk someone the ears off the head', explanation: 'Iemand de oren van het hoofd praten — To talk too much to someone', isRealProverb: true },
  { id: 119, text: 'To hit the plank completely missed', explanation: 'De plank volledig misslaan — To be completely wrong', isRealProverb: true },
  { id: 120, text: 'It costs an apple and an egg', explanation: 'Het kost een appel en een ei — It is very cheap', isRealProverb: true },

  // Made up Dunglish proverbs
  { id: 26, text: 'The tree falls next to the bicycle', explanation: 'Not a real proverb — just Dutch-sounding nonsense', isRealProverb: false },
  { id: 27, text: 'You can\'t milk a tulip in December', explanation: 'Not a real saying Dutch wisdom', isRealProverb: false },
  { id: 28, text: 'The cheese slides off the windmill', explanation: 'Not a real proverb — stereotypical Dutch words combined', isRealProverb: false },
  { id: 29, text: 'Who sleeps with wooden shoes loses his socks', explanation: 'Not a real proverb — sounds Dutch but is nonsense', isRealProverb: false },
  { id: 30, text: 'A herring in the hand is worth two in the canal', explanation: 'Not a real proverb — Dutch-themed twist on familiar English one', isRealProverb: false },
  { id: 31, text: 'The dike doesn\'t break from one raindrop', explanation: 'Not a real proverb — sounds plausible but doesn\'t exist', isRealProverb: false },
  { id: 32, text: 'Don\'t count your stroopwafels before they\'re baked', explanation: 'Not a real proverb — Dutch food + English proverb mashup', isRealProverb: false },
  { id: 33, text: 'Even the longest boat fits through the smallest bridge', explanation: 'Not a real saying wisdom', isRealProverb: false },
  { id: 34, text: 'A clean clog makes no noise on the cobblestones', explanation: 'Not a real proverb — typical Dutch imagery, zero meaning', isRealProverb: false },
  { id: 35, text: 'Two tulips don\'t make a garden', explanation: 'Not a real saying', isRealProverb: false },
  { id: 36, text: 'The windmill turns but the miller sleeps', explanation: 'Not a real proverb — plausible but invented', isRealProverb: false },
  { id: 37, text: 'He who cycles against the wind arrives sweaty', explanation: 'Not a real proverb — Dutch cycling cliché', isRealProverb: false },
  { id: 38, text: 'Don\'t trust a pigeon with a frikandel', explanation: 'Not a real proverb — completely ridiculous', isRealProverb: false },
  { id: 39, text: 'The tallest bicycle catches the first rain', explanation: 'Not a real proverb — just combining bikes and weather', isRealProverb: false },
  { id: 40, text: 'A lost gouda is still a cheese', explanation: 'Not a real saying cheese wisdom', isRealProverb: false },
  { id: 41, text: 'When the cow sings, the milk turns sour', explanation: 'Not a real proverb — absurd animal saying', isRealProverb: false },
  { id: 42, text: 'It\'s raining bitterballen', explanation: 'Not a real proverb — wishing for snacks from the sky', isRealProverb: false },
  { id: 43, text: 'If you want hagelslag, you must bake the bread', explanation: 'Not a real saying breakfast philosophy', isRealProverb: false },
  { id: 44, text: 'The ice skate only glides when it\'s frozen', explanation: 'Not a real proverb — completely obvious, not a proverb', isRealProverb: false },
  { id: 45, text: 'A flooded cellar makes the potatoes swim', explanation: 'Not a real proverb — completely made up', isRealProverb: false },
  { id: 46, text: 'Don\'t throw your mayo on the fries yet', explanation: 'Not a real saying variant', isRealProverb: false },
  { id: 47, text: 'He who walks on ice will eventually find water', explanation: 'Not a real proverb — too literal to be a proverb', isRealProverb: false },
  { id: 48, text: 'The flat country has the steepest hills', explanation: 'Not a real proverb — an oxymoron', isRealProverb: false },
  { id: 49, text: 'You can\'t build a dam with just one stone', explanation: 'Not a real saying engineering proverb', isRealProverb: false },
  { id: 50, text: 'A true Dutchman never drops his bike', explanation: 'Not a real saying stereotype', isRealProverb: false },
  { id: 121, text: 'The tallest tulip loses its petals first', explanation: 'Not a real saying flower proverb', isRealProverb: false },
  { id: 122, text: 'A wooden shoe without straw is just wood', explanation: 'Not a real saying traditional saying', isRealProverb: false },
  { id: 123, text: 'The orange lion only roars on Tuesday', explanation: 'Not a real proverb — nonsense about national symbols', isRealProverb: false },
  { id: 124, text: 'Don\'t throw cheese into the canal', explanation: 'Not a real saying practical advice', isRealProverb: false },
  { id: 125, text: 'He who eats a bitterbal must accept the burn', explanation: 'Not a real proverb — although practically true', isRealProverb: false },
  { id: 126, text: 'A windmill without wind is a sad building', explanation: 'Not a real saying deep thought', isRealProverb: false },
  { id: 127, text: 'You can\'t skate on a puddle', explanation: 'Not a real saying winter proverb', isRealProverb: false },
  { id: 128, text: 'The baker\'s son always wants stroopwafels', explanation: 'Not a real saying profession proverb', isRealProverb: false },
  { id: 129, text: 'A rainy day is good for the potatoes', explanation: 'Not a real saying agricultural wisdom', isRealProverb: false },
  { id: 130, text: 'Don\'t trust a pigeon on your bicycle seat', explanation: 'Not a real proverb — completely ridiculous', isRealProverb: false },
  { id: 131, text: 'A short dike breaks first', explanation: 'Not a real saying safety proverb', isRealProverb: false },
  { id: 132, text: 'The herring swims away from the onion', explanation: 'Not a real saying food lore', isRealProverb: false },
  { id: 133, text: 'A red bicycle rides faster', explanation: 'Not a real saying urban myth', isRealProverb: false },
  { id: 134, text: 'You can\'t squeeze milk from a tulip', explanation: 'Not a real saying flower proverb', isRealProverb: false },
  { id: 135, text: 'The longest canal has no end', explanation: 'Not a real saying geographical wisdom', isRealProverb: false },
  { id: 136, text: 'A broken clog hurts two feet', explanation: 'Not a real saying physics', isRealProverb: false },
  { id: 137, text: 'Don\'t put your mayo on my fries', explanation: 'Not a real saying selfish saying', isRealProverb: false },
  { id: 138, text: 'A flat country makes for round people', explanation: 'Not a real saying body observation', isRealProverb: false },
  { id: 139, text: 'The wind always blows from the front', explanation: 'Not a real proverb — even if it feels true when cycling', isRealProverb: false },
  { id: 140, text: 'A lost stroopwafel is a sad day', explanation: 'Not a real saying emotion', isRealProverb: false },
  { id: 141, text: 'It shall me a care be', explanation: 'Het zal mij een zorg zijn — I couldn\'t care less', isRealProverb: true },
  { id: 142, text: 'To have long toes', explanation: 'Lange tenen hebben — To be easily offended / thin-skinned', isRealProverb: true },
  { id: 143, text: 'There is nothing on the hand', explanation: 'Er is niets aan de hand — Nothing is wrong', isRealProverb: true },
  { id: 144, text: 'It is walking in the paper', explanation: 'Het loopt in de papieren — It is getting very expensive', isRealProverb: true },
  { id: 145, text: 'To stand with a mouth full of teeth', explanation: 'Met een mond vol tanden staan — To be completely speechless', isRealProverb: true },
  { id: 146, text: 'Don\'t sell the skin before the bear is shot', explanation: 'Verkoop de huid niet voor de beer geschoten is — Don\'t celebrate too early / count your chickens', isRealProverb: true },
  { id: 147, text: 'If the cow falls, the pasture laughs', explanation: 'Not a real saying', isRealProverb: false },
  { id: 148, text: 'Who burns his tongue must eat cold soup', explanation: 'Not a real proverb — completely made up', isRealProverb: false },
  { id: 149, text: 'A clean bicycle never punctures', explanation: 'Not a real proverb — cycling nonsense', isRealProverb: false },
  { id: 150, text: 'The tulip that bends does not break', explanation: 'Not a real saying philosophical saying', isRealProverb: false },
  { id: 151, text: 'Now the monkey comes out of the sleeve', explanation: 'Nu komt de aap uit de mouw — Now the truth is revealed', isRealProverb: true },
  { id: 152, text: 'We are going to put the flowers outside', explanation: 'We gaan de bloemetjes buiten zetten — We are going to paint the town red / celebrate', isRealProverb: true },
  { id: 153, text: 'To fall with the door in the house', explanation: 'Met de deur in huis vallen — To get straight to the point', isRealProverb: true },
  { id: 154, text: 'Make that the cat wise', explanation: 'Maak dat de kat wijs — Tell it to the marines / I don\'t believe you', isRealProverb: true },
  { id: 155, text: 'The bullet is through the church', explanation: 'De kogel is door de kerk — The die is cast / The decision has been made', isRealProverb: true },
  { id: 156, text: 'It walks in the soup', explanation: 'Het loopt in de soep — It\'s going completely wrong / failing', isRealProverb: true },
  { id: 157, text: 'He is a real mosquito sifter', explanation: 'Hij is een echte muggenzifter — He is a nitpicker', isRealProverb: true },
  { id: 158, text: 'To buy a cat in the bag', explanation: 'Een kat in de zak kopen — To buy a pig in a poke', isRealProverb: true },
  { id: 159, text: 'The goat is looking at the clock', explanation: 'Not a real proverb — nonsense', isRealProverb: false },
  { id: 160, text: 'A painted window does not open', explanation: 'Not a real proverb', isRealProverb: false },
  { id: 161, text: 'The cheese roll is always round', explanation: 'Not a real proverb', isRealProverb: false },
  { id: 162, text: 'It will me a sausage be', explanation: 'Het zal me een worst wezen — I couldn\'t care less', isRealProverb: true },
  { id: 163, text: 'To carry water to the sea', explanation: 'Water naar de zee dragen — Doing useless work', isRealProverb: true },
  { id: 164, text: 'To put something on the long track', explanation: 'Iets op de lange baan schuiven — To postpone something', isRealProverb: true },
  { id: 165, text: 'To stand with your back against the wall', explanation: 'Met de rug tegen de muur staan — To have no choices left', isRealProverb: true },
  { id: 166, text: 'It is a storm in a glass of water', explanation: 'Het is een storm in een glas water — Much ado about nothing', isRealProverb: true },
  { id: 167, text: 'To have the heart on the tongue', explanation: 'Het hart op de tong hebben — To speak your mind openly', isRealProverb: true },
  { id: 168, text: 'To put the dots on the i', explanation: 'De puntjes op de i zetten — To finalize the details / be precise', isRealProverb: true },
  { id: 169, text: 'To have hair on your teeth', explanation: 'Haar op je tanden hebben — To be assertive / stand up for yourself', isRealProverb: true },
  { id: 170, text: 'He has a memory like a colander', explanation: 'Hij heeft een geheugen als een vergiet — He has a very bad memory', isRealProverb: true },
  { id: 171, text: 'The wooden shoe does not fit the cat\'s paw', explanation: 'Not a real saying Dutch wisdom', isRealProverb: false },
  { id: 172, text: 'A cold pancake makes no friend', explanation: 'Not a real proverb — made up', isRealProverb: false },
  { id: 173, text: 'Who steals the bicycle bell must walk', explanation: 'Not a real saying', isRealProverb: false },
  { id: 174, text: 'A tulip in the storm remains red', explanation: 'Not a real saying', isRealProverb: false },
  { id: 175, text: 'You cannot spin a windmill with a fan', explanation: 'Not a real saying', isRealProverb: false },
  { id: 176, text: 'A dry herring does not swim', explanation: 'Not a real saying', isRealProverb: false },
  { id: 177, text: 'The cow knows the grass but not the farmer', explanation: 'Not a real saying', isRealProverb: false },
  { id: 178, text: 'A broken clog cannot be glued with cheese', explanation: 'Not a real proverb — typical Dutch words combined', isRealProverb: false },
  { id: 179, text: 'Don\'t let the mouse eat the stroopwafel', explanation: 'Not a real saying', isRealProverb: false },
  { id: 180, text: 'He who drops his fork will eat with his hands', explanation: 'Not a real saying', isRealProverb: false },
  { id: 181, text: 'He has a wooden eye', explanation: 'Hij heeft een houten oog — made up saying', isRealProverb: false },
  { id: 182, text: 'The cow catches the wind', explanation: 'De koe vangt de wind — made up saying', isRealProverb: false },
  { id: 183, text: 'Don\'t throw your bike in the canal before it\'s broken', explanation: 'Not a real proverb', isRealProverb: false },
  { id: 184, text: 'A floating cheese gathers no moss', explanation: 'Not a real proverb — mashup', isRealProverb: false },
  { id: 185, text: 'The tallest tulip gets cut first', explanation: 'Not a real proverb — but sounds poetic', isRealProverb: false },
  { id: 186, text: 'To drop with the nose in the butter', explanation: 'Met de neus in de boter vallen — To be very lucky', isRealProverb: true },
  { id: 187, text: 'To sit on black seed', explanation: 'Op zwart zaad zitten — To be completely broke', isRealProverb: true },
  { id: 188, text: 'To bind the cat to the bacon', explanation: 'De kat op het spek binden — To tempt someone', isRealProverb: true },
  { id: 189, text: 'To bite on a piece of wood', explanation: 'Op een houtje bijten — To be very poor / have nothing to eat', isRealProverb: true },
  { id: 190, text: 'The monkey comes out of the sleeve', explanation: 'De aap komt uit de mouw — The truth is revealed', isRealProverb: true },
  { id: 191, text: 'To strike the plank completely missed', explanation: 'De plank volledig misslaan — To completely miss the point', isRealProverb: true },
  { id: 192, text: 'We sit in the same little boat', explanation: 'We zitten in hetzelfde schuitje — We are in the same boat/situation', isRealProverb: true },
  { id: 193, text: 'To search for nails on low water', explanation: 'Spijkers op laag water zoeken — To nitpick', isRealProverb: true },
  { id: 194, text: 'It strikes like a pair of tongs on a pig', explanation: 'Het slaat als een tang op een varken — It makes absolutely no sense', isRealProverb: true },
  { id: 195, text: 'That is another cook\'s biscuit', explanation: 'Dat is andere koek — That\'s a different story', isRealProverb: true },
  { id: 196, text: 'A bicycle without wheels goes nowhere fast', explanation: 'Not a real proverb', isRealProverb: false },
  { id: 197, text: 'The herring is always greasier on the other side', explanation: 'Not a real proverb', isRealProverb: false },
  { id: 198, text: 'A rainy day is good for the stroopwafel', explanation: 'Not a real proverb', isRealProverb: false },
  { id: 199, text: 'The windmill does not care for the mouse', explanation: 'Not a real proverb', isRealProverb: false },
  { id: 200, text: 'Don\'t eat your bitterbal before it\'s fried', explanation: 'Not a real proverb', isRealProverb: false },
  { id: 201, text: 'To have butter on your head', explanation: 'Boter op je hoofd hebben — To be guilty of what you accuse others of', isRealProverb: true },
  { id: 202, text: 'To walk on your last legs', explanation: 'Op je laatste benen lopen — To be exhausted', isRealProverb: true },
  { id: 203, text: 'To throw with the door', explanation: 'Met de deur in huis vallen — To get straight to the point', isRealProverb: true },
  { id: 204, text: 'The carrots are done', explanation: 'De wortelen zijn gaar / Het is klaar', isRealProverb: false },
  { id: 205, text: 'He who has a long spoon eats with the devil', explanation: 'Wie met de duivel eet, moet een lange lepel gebruiken — Be careful with bad company', isRealProverb: true },
  { id: 206, text: 'To have the wind in the sails', explanation: 'De wind in de zeilen hebben — To be successful', isRealProverb: true },
  { id: 207, text: 'A wet hen lays no eggs', explanation: 'Not a real saying', isRealProverb: false },
  { id: 208, text: 'The soup is never eaten as hot as it is served', explanation: 'De soep wordt niet zo heet gegeten als ze wordt opgediend — Things are never as bad as they seem', isRealProverb: true },
  { id: 209, text: 'Better one bird in the hand than ten in the air', explanation: 'Beter één vogel in de hand dan tien in de lucht — A bird in the hand is worth two in the bush', isRealProverb: true },
  { id: 210, text: 'The cheese slides off the bread', explanation: 'Not a real saying', isRealProverb: false },
  { id: 211, text: 'To make someone a head smaller', explanation: 'Iemand een kopje kleiner maken — To behead / to humble someone', isRealProverb: true },
  { id: 212, text: 'To put salt on every snail', explanation: 'Op elke slak zout leggen — To nitpick and complain about everything', isRealProverb: true },
  { id: 213, text: 'The tulip blooms twice for the wise', explanation: 'Not a real saying', isRealProverb: false },
  { id: 214, text: 'To have a board before your head', explanation: 'Een plank voor je hoofd hebben — To be oblivious / unable to think clearly', isRealProverb: true },
  { id: 215, text: 'Even the windmill needs rest on Sunday', explanation: 'Not a real saying', isRealProverb: false },
  { id: 216, text: 'To put the flowers outside', explanation: 'De bloemetjes buiten zetten — To go out and have a good time / party', isRealProverb: true },
  { id: 217, text: 'Old cows dig deep ditches', explanation: 'Not a real saying', isRealProverb: false },
  { id: 218, text: 'To not be able to see the trees through the forest', explanation: 'Door de bomen het bos niet meer zien — To not see the big picture', isRealProverb: true },
  { id: 219, text: 'A frozen canal keeps no secrets', explanation: 'Not a real saying', isRealProverb: false },
  { id: 220, text: 'The best helmsmen stand on shore', explanation: 'De beste stuurlui staan aan wal — Everyone is a critic from the sidelines', isRealProverb: true },
  { id: 221, text: 'To send someone into the forest', explanation: 'Iemand het bos in sturen — To deceive someone', isRealProverb: true },
  { id: 222, text: 'The early cheese catches the mouse', explanation: 'Not a real proverb — mashup of sayings', isRealProverb: false },
  { id: 223, text: 'To have a little sun in your head', explanation: 'Een zonnetje in je hoofd hebben — To be slightly drunk/happy', isRealProverb: true },
  { id: 224, text: 'Two wooden shoes make a pair', explanation: 'Not a real saying', isRealProverb: false },
  { id: 225, text: 'When the calf is drowned, one fills the well', explanation: 'Als het kalf verdronken is, dempt men de put — Closing the stable door after the horse has bolted', isRealProverb: true },
  { id: 226, text: 'A Dutch clock always runs on time', explanation: 'Not a real proverb', isRealProverb: false },
  { id: 227, text: 'The flag covers the cargo', explanation: 'De vlag dekt de lading — What you see matches what you get (often sarcastic)', isRealProverb: true },
  { id: 228, text: 'The dike holds until the water rises', explanation: 'Not a real saying', isRealProverb: false },
  { id: 229, text: 'Who wants to keep peace must let the dog pass', explanation: 'Not a real proverb', isRealProverb: false },
  { id: 230, text: 'To fall with the door in the house', explanation: 'Met de deur in huis vallen — To get straight to the point', isRealProverb: true }
,
  {
    "id": "30943614-ac2a-48c1-9df8-2557d89dbdad",
    "text": "I fell with the door in the house",
    "isRealProverb": true,
    "explanation": "Met de deur in huis vallen."
  },
  {
    "id": "be3940df-da86-4477-9489-e276e9e3725f",
    "text": "We must look the cat out of the tree",
    "isRealProverb": true,
    "explanation": "De kat uit de boom kijken."
  },
  {
    "id": "f8a14d1a-5b51-4b92-a34c-034d9144f0a5",
    "text": "It rains pipe stems",
    "isRealProverb": true,
    "explanation": "Het regent pijpenstelen."
  },
  {
    "id": "e000fdc8-0dc5-403b-a68d-df8d345a5ff7",
    "text": "To participate for bacon and beans",
    "isRealProverb": true,
    "explanation": "Voor spek en bonen meedoen."
  },
  {
    "id": "079e14fd-d77b-4038-8a06-6973e7f27c97",
    "text": "I don't trust you for a meter",
    "isRealProverb": true,
    "explanation": "Ik vertrouw je voor geen meter."
  },
  {
    "id": "833ec1ab-e163-46e1-84e1-16f434f21ef5",
    "text": "That hits as a pair of tangs on a pig",
    "isRealProverb": true,
    "explanation": "Dat slaat als een tang op een varken."
  },
  {
    "id": "d2976b77-7fb4-44d8-85cf-a813513469a5",
    "text": "To have an apple to peel with someone",
    "isRealProverb": true,
    "explanation": "Een appeltje met iemand te schillen hebben."
  },
  {
    "id": "a51e289f-576d-40b6-9424-adabbc5627a7",
    "text": "To buy a cat in the sack",
    "isRealProverb": true,
    "explanation": "Een kat in de zak kopen."
  },
  {
    "id": "ca79f9ca-1ef5-4232-9957-1a64b00667fd",
    "text": "To step out of the wrong side of the bed",
    "isRealProverb": false,
    "explanation": "Dit klopt in het Engels! (Get out of the wrong side of the bed). In het Nederlands: met het verkeerde been uit bed stappen."
  },
  {
    "id": "f5a7ad26-9bf4-425f-b1cb-8f1dd9544588",
    "text": "It walks into the soup",
    "isRealProverb": true,
    "explanation": "Het loopt in de soep."
  },
  {
    "id": "b95b00ec-9b6e-4d11-90ba-c75efab3a319",
    "text": "He got a cookie of his own dough",
    "isRealProverb": true,
    "explanation": "Een koekje van eigen deeg krijgen."
  },
  {
    "id": "a178f6e7-2d54-417b-b9a8-59e413a890be",
    "text": "To fall through the basket",
    "isRealProverb": true,
    "explanation": "Door de mand vallen."
  },
  {
    "id": "d18037cc-6206-4296-a264-1c8c93f1c5b0",
    "text": "I shall let them smell a poopy",
    "isRealProverb": true,
    "explanation": "Ik zal ze een poepie laten ruiken."
  },
  {
    "id": "7bdc889b-d374-4092-a089-a733863ce71e",
    "text": "Make that the cat wise",
    "isRealProverb": true,
    "explanation": "Maak dat de kat wijs."
  },
  {
    "id": "2442a82d-619d-434d-a587-e9119f26eee6",
    "text": "To stroke someone's honey around the mouth",
    "isRealProverb": true,
    "explanation": "Iemand stroop om de mond smeren."
  },
  {
    "id": "831d648a-4a72-4804-afa6-c11ceb81afe1",
    "text": "I trust you blindly",
    "isRealProverb": false,
    "explanation": "Dit is gewoon correct Engels."
  },
  {
    "id": "1954691f-2b15-4a21-95f1-b0855d12f058",
    "text": "He fell with his nose in the butter",
    "isRealProverb": true,
    "explanation": "Met zijn neus in de boter vallen."
  },
  {
    "id": "a3d648f9-ff0d-4997-9f24-31cc75f9be39",
    "text": "To stick your neck out",
    "isRealProverb": false,
    "explanation": "Dit is correct Engels (en Nederlands)."
  },
  {
    "id": "811e1adc-7161-47e4-9e9f-2db6470b762a",
    "text": "He looks like a dog in a game of bowling",
    "isRealProverb": true,
    "explanation": "Als een hond in een kegelspel."
  },
  {
    "id": "6f870101-f52e-4386-888b-e9cedbb7b8f6",
    "text": "I am holding my heart fast",
    "isRealProverb": true,
    "explanation": "Mijn hart vasthouden."
  },
  {
    "id": "94a693cc-d631-47f7-8d8c-70565294357c",
    "text": "It's monkey out of the sleeve time",
    "isRealProverb": true,
    "explanation": "Nu komt de aap uit de mouw."
  },
  {
    "id": "6a2e43fe-c039-4cfc-aecd-74d87ba95004",
    "text": "To pull someone's leg",
    "isRealProverb": false,
    "explanation": "Dit is een typisch Engelse uitdrukking!"
  },
  {
    "id": "486bf949-2d4f-4f1f-833f-b0f4f809c823",
    "text": "To throw oil on the fire",
    "isRealProverb": true,
    "explanation": "Olie op het vuur gooien."
  },
  {
    "id": "b2bc4c56-2497-4bc7-9cde-fca1120c3319",
    "text": "He broke his wooden shoe",
    "isRealProverb": true,
    "explanation": "Mijn klomp breekt."
  },
  {
    "id": "a2d00aa0-3e9e-4112-b600-9edacbca21ef",
    "text": "I have it not on my liver",
    "isRealProverb": true,
    "explanation": "Iets niet op zijn lever hebben (niet durven zeggen)."
  },
  {
    "id": "a42074fc-4a17-4c83-bd0f-28d48ddd9be4",
    "text": "He acts like a chicken without a head",
    "isRealProverb": true,
    "explanation": "Als een kip zonder kop."
  },
  {
    "id": "4a6b49ff-ec06-4971-966a-0f5050f46466",
    "text": "That's a different biscuit",
    "isRealProverb": true,
    "explanation": "Dat is andere koek."
  },
  {
    "id": "21388295-7990-43b2-be6e-6f8a33c46ea5",
    "text": "I can tie an arrow on that",
    "isRealProverb": true,
    "explanation": "Daar kan ik geen pijl op trekken."
  },
  {
    "id": "a766a44a-a944-44b2-b41f-43a114b8e525",
    "text": "He has butter on his head",
    "isRealProverb": true,
    "explanation": "Boter op het hoofd hebben."
  },
  {
    "id": "e37b9bbf-60ae-414a-9c85-f74275183e5c",
    "text": "To put someone on the wrong foot",
    "isRealProverb": true,
    "explanation": "Iemand op het verkeerde been zetten."
  },
  {
    "id": "896117b8-1690-4d76-bf3c-7259d028c897",
    "text": "It's raining cats and dogs",
    "isRealProverb": false,
    "explanation": "Dit is een echte, zeer bekende Engelse uitdrukking voor harde regen."
  },
  {
    "id": "76fad936-7936-4cef-93f5-b254d875e531",
    "text": "He let a stitch drop",
    "isRealProverb": true,
    "explanation": "Een steek laten vallen."
  },
  {
    "id": "ccdd32d0-7782-4460-9b2c-a672a988b8ff",
    "text": "To step on someone's toes",
    "isRealProverb": false,
    "explanation": "Zowel Nederlands als Engels (To step on someone's toes)."
  },
  {
    "id": "8a32b294-b612-4aa2-be26-ccbb884574bc",
    "text": "It costs an apple and an egg",
    "isRealProverb": true,
    "explanation": "Voor een appel en een ei."
  },
  {
    "id": "b17e7ce8-2984-4274-8cc2-fa5f37c49eba",
    "text": "He sits with his hands in the hair",
    "isRealProverb": true,
    "explanation": "Met de handen in het haar zitten."
  },
  {
    "id": "6354c1f0-8771-4035-ab1e-5e6d1a90db95",
    "text": "To read between the lines",
    "isRealProverb": false,
    "explanation": "Dit is een officieel Engelse (en Nederlandse) uitdrukking."
  },
  {
    "id": "daad017e-3ad7-4de1-8baa-82998ef6ef3d",
    "text": "We'll see where the ship strands",
    "isRealProverb": true,
    "explanation": "We zien wel waar het schip strandt."
  },
  {
    "id": "2f0920ef-d279-424b-bd06-3f03451879da",
    "text": "To cut knots",
    "isRealProverb": true,
    "explanation": "Knopen doorhakken."
  },
  {
    "id": "d2dfaea9-906b-4b1f-865e-0fd572e7f1d3",
    "text": "He holds the boat off",
    "isRealProverb": true,
    "explanation": "De boot afhouden."
  },
  {
    "id": "27cebc78-a8f4-48b4-913f-1ee334765814",
    "text": "There is a little snake under the grass",
    "isRealProverb": true,
    "explanation": "Daar zit een addertje onder het gras."
  },
  {
    "id": "5fbd9aee-322a-4bbb-ba57-989e8e1db378",
    "text": "He's pulling an old cow out of the ditch",
    "isRealProverb": true,
    "explanation": "Oude koeien uit de sloot halen."
  },
  {
    "id": "5e0f730d-57e5-4cc7-8524-7c820ac08a93",
    "text": "That's not my cup of tea",
    "isRealProverb": false,
    "explanation": "Correct Engels spreekwoord voor 'dat is niet mijn ding'."
  },
  {
    "id": "24720b73-9754-428d-9f5d-fba1914280c1",
    "text": "He beat the plank totally missed",
    "isRealProverb": true,
    "explanation": "De plank volledig misslaan."
  },
  {
    "id": "832fdece-007b-49d2-87eb-d98e187ad051",
    "text": "Don't judge a book by its cover",
    "isRealProverb": false,
    "explanation": "Echt Engels spreekwoord."
  },
  {
    "id": "bc35e1bb-8027-4eea-bdd6-72ff27b1146e",
    "text": "To stand in the spotlights",
    "isRealProverb": false,
    "explanation": "Dit is correct in het Engels."
  },
  {
    "id": "603695be-e95b-44a7-b87e-7ddbc598e0fe",
    "text": "He puts the little flowers outside",
    "isRealProverb": true,
    "explanation": "De bloemetjes buitenzetten."
  },
  {
    "id": "a4e57311-fcac-453c-888a-32396a5e42cd",
    "text": "A storm in a glass of water",
    "isRealProverb": true,
    "explanation": "Een storm in een glas water."
  },
  {
    "id": "25d92f3f-7264-4e02-8705-f3e8cd434687",
    "text": "I am keeping my fingers crossed",
    "isRealProverb": false,
    "explanation": "Dit is correct Engels voor 'hopen dat het goed gaat'."
  },
  {
    "id": "32936011-2628-4155-b82a-4638172f8ae3",
    "text": "I will squeeze an eye shut",
    "isRealProverb": true,
    "explanation": "Een oogje dichtknijpen."
  },
  {
    "id": "f0598868-193d-49b5-992b-ff32b3c56430",
    "text": "To throw the towel in the ring",
    "isRealProverb": true,
    "explanation": "De handdoek in de ring gooien."
  },
  {
    "id": "835d2003-6252-479f-8ca2-9bf7aecc420b",
    "text": "The bullet is through the church",
    "isRealProverb": true,
    "explanation": "De kogel is door de kerk."
  },
  {
    "id": "406beaf3-feb3-47a6-a2f9-35ffb02548b6",
    "text": "He missed the boat",
    "isRealProverb": false,
    "explanation": "Dit is correct Engels en Nederlands."
  },
  {
    "id": "958dbc3b-01aa-4b3f-b08b-3e825f35f9c1",
    "text": "To make an elephant out of a mosquito",
    "isRealProverb": true,
    "explanation": "Van een mug een olifant maken."
  },
  {
    "id": "5913df00-c2b7-435c-8c4a-589f2e885ceb",
    "text": "He let the cheese be eaten from his bread",
    "isRealProverb": true,
    "explanation": "Zich de kaas niet van het brood laten eten."
  },
  {
    "id": "7f3f46bd-8046-44be-9fd4-a2185090ca7f",
    "text": "Spill the beans",
    "isRealProverb": false,
    "explanation": "Correct Engels spreekwoord voor 'het geheim verklappen'."
  },
  {
    "id": "b5832e44-ecef-4a67-970c-94fff8bab3ec",
    "text": "To bind the cat on the bacon",
    "isRealProverb": true,
    "explanation": "De kat op het spek binden."
  },
  {
    "id": "c061c890-adcd-4f33-8492-d5c748db7b6a",
    "text": "He takes it with a grain of salt",
    "isRealProverb": false,
    "explanation": "Dit is correct Engels (Take it with a grain of salt)."
  },
  {
    "id": "5d571cb9-db99-4a39-afb4-dbe8d41050dd",
    "text": "The drop that makes the bucket overflow",
    "isRealProverb": true,
    "explanation": "De druppel die de emmer doet overlopen."
  },
  {
    "id": "95c61925-15fc-457e-bcfc-fd0db49f8455",
    "text": "To feel like a fish in the water",
    "isRealProverb": true,
    "explanation": "Je als een vis in het water voelen."
  },
  {
    "id": "0466283e-f88e-414a-b4ea-dbbdc33587c3",
    "text": "He puts his shoes in",
    "isRealProverb": true,
    "explanation": "Zijn schoen zetten (voor Sinterklaas)."
  },
  {
    "id": "d7969e1d-b999-426c-8fc7-39aa812305c9",
    "text": "A piece of cake",
    "isRealProverb": false,
    "explanation": "Correct Engels spreekwoord voor iets dat makkelijk is."
  },
  {
    "id": "23f00238-0a87-4ca0-89c4-8783b9e5566c",
    "text": "He plays open card",
    "isRealProverb": true,
    "explanation": "Open kaart spelen."
  },
  {
    "id": "24acfbe4-0bee-4f95-8fbf-bdbe07b00954",
    "text": "To pull at the shortest end",
    "isRealProverb": true,
    "explanation": "Aan het kortste eind trekken."
  },
  {
    "id": "2ecc6881-3655-49fc-ad63-56eedf1d6f00",
    "text": "Under the weather",
    "isRealProverb": false,
    "explanation": "Correct Engels voor 'je niet lekker voelen'."
  },
  {
    "id": "a586458f-c5ec-4fbb-aa03-f5da1326904a",
    "text": "That's crying with the cap on",
    "isRealProverb": true,
    "explanation": "Huilen met de pet op."
  },
  {
    "id": "b7fa0fb9-3064-48a6-9468-ec497b06bb4d",
    "text": "To carry water to the sea",
    "isRealProverb": true,
    "explanation": "Water naar de zee dragen."
  },
  {
    "id": "59e29149-71e5-4895-a358-eaa0c9e814cc",
    "text": "Beat around the bush",
    "isRealProverb": false,
    "explanation": "Correct Engels voor 'om de hete brij heen draaien'."
  },
  {
    "id": "80410cb2-8a4d-48e8-8492-236ee2c26c43",
    "text": "I fell from my chair of laughing",
    "isRealProverb": true,
    "explanation": "Van m'n stoel vallen van het lachen."
  },
  {
    "id": "911ed2df-cb24-4717-b902-f8742e362867",
    "text": "It costs a rib from my body",
    "isRealProverb": true,
    "explanation": "Dat kost een rib uit m'n lijf."
  },
  {
    "id": "df7c8933-7a08-407f-bb73-d9bfbeed1f37",
    "text": "Break a leg",
    "isRealProverb": false,
    "explanation": "Engels voor 'succes!' (in theatertermen)."
  },
  {
    "id": "9c81ecc0-6ba4-4f43-9ba6-b966ed34a494",
    "text": "He doesn't have all his cups in the cupboard",
    "isRealProverb": true,
    "explanation": "Niet alle ze hebben op een rijtje / kopjes in de kast."
  },
  {
    "id": "f0332a18-15b5-441b-8f7b-9fbc3727fea8",
    "text": "Bite the bullet",
    "isRealProverb": false,
    "explanation": "Engels voor 'even door de zure appel heen bijten'."
  },
  {
    "id": "527c3a68-3ad4-4d28-be65-cae1183f0a08",
    "text": "To hold the strings in hands",
    "isRealProverb": true,
    "explanation": "De touwtjes in handen hebben."
  },
  {
    "id": "4ce67224-dacc-49e1-abaf-2a35e5e0b225",
    "text": "I feel me taken in the honey",
    "isRealProverb": true,
    "explanation": "In de maling genomen worden."
  },
  {
    "id": "16c856fa-b883-4ef1-b0cf-df4330f14603",
    "text": "It went from a leaky roof into the rain",
    "isRealProverb": true,
    "explanation": "Van de regen in de drup."
  }
];
