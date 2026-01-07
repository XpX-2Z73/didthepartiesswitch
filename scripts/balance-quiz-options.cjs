const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/_data/advancedQuizQuestions.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Balanced options for all 102 questions
// Each set makes wrong answers detailed and plausible
const balancedOptions = {
  0: [ // Colfax Massacre
    'A. Between 10 and 15 men were killed during the initial armed confrontation',
    'B. Between 60 and 150 men were executed after they had already surrendered',
    'C. Only 5 to 8 militiamen died, mostly from gunfire during the battle',
    'D. Over 200 to 300 total casualties occurred throughout the entire week'
  ],
  1: [ // Hamburg Massacre
    'A. The Ku Klux Klan, operating in their typical covert nighttime raids',
    'B. The Red Shirts, operating openly as a paramilitary organization',
    'C. The White League, which was based primarily in Louisiana parishes',
    'D. The Knights of the White Camelia, originally from Alabama'
  ],
  2: [ // Opelousas
    'A. Between 20 and 30 people over the course of several violent days',
    'B. Approximately 50 to 75 victims in the initial wave of violence',
    'C. Between 200 and 300 murdered across St. Landry Parish over weeks',
    'D. Roughly 10 to 15 documented casualties in official reports only'
  ],
  3: [ // Memphis churches
    'A. About 25% were damaged or partially burned during the three days',
    'B. Approximately 50% suffered significant structural damage or loss',
    'C. Nearly 100%—every single Black church and school was destroyed',
    'D. Around 10% located only in the immediate riot area were affected'
  ],
  4: [ // New Orleans target
    'A. A Black church service celebrating the anniversary of emancipation',
    'B. A constitutional convention that was extending voting rights to Blacks',
    'C. A labor union meeting organized by Black dock workers at the port',
    'D. A Freedmen\'s Bureau school educating newly freed Black children'
  ],
  5: [ // Elaine trigger
    'A. A voting rights march organized to reach the county courthouse',
    'B. Black sharecroppers organizing a union to fight exploitation',
    'C. An interracial marriage ceremony held at a local Black church',
    'D. An attempt to integrate the local whites-only public school'
  ],
  6: [ // Tulsa blocks
    'A. Approximately 5 blocks centered on the main commercial district',
    'B. Around 15 blocks primarily in the residential neighborhoods',
    'C. Over 35 blocks of homes, businesses, churches, and schools',
    'D. Only 2 blocks where the initial violence was largely contained'
  ],
  7: [ // Rosewood
    'A. It was rebuilt over time with federal reconstruction assistance funds',
    'B. It ceased to exist entirely—the whole town was completely destroyed',
    'C. It became a state-managed memorial site and historical landmark',
    'D. It was renamed and gradually rebuilt by survivors over decades'
  ],
  8: [ // East St. Louis percentage
    'A. Roughly 10% relocated temporarily to nearby surrounding communities',
    'B. Approximately 25% of residents fled permanently to northern cities',
    'C. About 50%—fully half the Black population fled the city entirely',
    'D. Nearly 75% of families left within just the first week of violence'
  ],
  9: [ // Red Summer cities
    'A. Between 5 and 10 cities experienced violence, mainly in the Deep South',
    'B. More than 25 cities across the entire United States saw major violence',
    'C. Only 3 to 5 major cities experienced any significant racial violence',
    'D. Over 50 to 60 communities reported violent incidents that summer'
  ],
  10: [ // Convict leasing death rate
    'A. Between 5 and 10% died annually, similar to other dangerous labor',
    'B. Approximately 15 to 20% died each year from accidents and disease',
    'C. Between 30 and 45% died annually—nearly half of all prisoners yearly',
    'D. Only 1 to 3% died, as companies had incentive to keep workers alive'
  ],
  11: [ // U.S. Steel
    'A. Standard Oil, through its Southern petroleum extraction operations',
    'B. U.S. Steel, through its Tennessee Coal, Iron and Railroad subsidiary',
    'C. Ford Motor Company, at its Southern manufacturing plant facilities',
    'D. General Electric, through its power generation and mining operations'
  ],
  12: [ // Pig laws
    'A. Regulate livestock farming practices and prevent animal diseases',
    'B. Criminalize minor offenses to arrest Black people for convict labor',
    'C. Protect farm animals from theft with strict enforcement penalties',
    'D. License pork processing plants and regulate meat safety standards'
  ],
  13: [ // Peonage
    'A. Workers voluntarily chose to stay because wages were competitive and fair',
    'B. Employers charged for supplies then had workers arrested for debt fraud',
    'C. The government required work permits that restricted labor movement',
    'D. Workers signed lifetime contracts that were enforced by local courts'
  ],
  14: [ // Alabama convict leasing end
    'A. In 1865, immediately following the ratification of the 13th Amendment',
    'B. Around 1890, when Progressive reformers pushed through new state laws',
    'C. In 1928, making Alabama the last state to finally abolish the practice',
    'D. By 1945, when federal intervention finally ended all forced labor systems'
  ],
  15: [ // EJI lynching count
    'A. Approximately 500 documented lynchings occurred across the South',
    'B. Around 1,500 racial terror lynchings have been verified by researchers',
    'C. More than 4,400 documented racial terror lynchings in the South alone',
    'D. Roughly 800 confirmed cases have been documented in official records'
  ],
  16: [ // Waco Horror
    'A. He was imprisoned for 30 years in the state penitentiary without parole',
    'B. He was tortured, mutilated, and burned alive before a crowd of 15,000',
    'C. He was exiled permanently from Texas under threat of further violence',
    'D. He was given a show trial before being legally executed by the state'
  ],
  17: [ // Lynching postcards
    'A. Official warnings posted by authorities attempting to discourage violence',
    'B. Photographs of lynchings sold as souvenirs and sent through U.S. mail',
    'C. Government documentation created to record crimes for later prosecution',
    'D. NAACP awareness materials distributed to build support for anti-lynching laws'
  ],
  18: [ // Mary Turner
    'A. She was imprisoned for speaking out publicly against racial violence',
    'B. She was lynched while 8 months pregnant; her baby was cut from her body',
    'C. She fled Georgia and became a prominent civil rights activist up North',
    'D. She testified before Congress about the murder of her husband by a mob'
  ],
  19: [ // Sam Hose
    'A. His case led to the first successful federal prosecution of lynch mob leaders',
    'B. His body parts were sold as souvenirs after he was mutilated and burned',
    'C. He escaped the mob and later testified about the lynching epidemic',
    'D. His murder was photographed and used to build support for federal laws'
  ],
  20: [ // Ida B. Wells exile
    'A. She was honored by local leaders for her investigative journalism work',
    'B. Her newspaper was destroyed and she was forced to flee after death threats',
    'C. She was elected to local office after her anti-lynching campaign succeeded',
    'D. She received federal protection after documenting violence against Blacks'
  ],
  21: [ // Emmett Till killers
    'A. They were convicted of murder but served only a few years in prison',
    'B. They confessed to the murder in a paid magazine interview after acquittal',
    'C. They were never identified despite extensive FBI investigation efforts',
    'D. They fled Mississippi and were never brought to trial for the crime'
  ],
  22: [ // Grandfather clause
    'A. It required all voters to pass the same literacy tests regardless of race',
    'B. It exempted whites from voting requirements their grandfathers avoided',
    'C. It established a minimum age requirement of 21 for all voters equally',
    'D. It required property ownership that applied equally to all potential voters'
  ],
  23: [ // Poll tax cumulative
    'A. A one-time fee of $1 payable at the time of voter registration only',
    'B. An accumulating debt requiring payment of all past years to vote',
    'C. A monthly fee deducted automatically from wages by employers',
    'D. An annual tax that was waived for anyone who could prove literacy'
  ],
  24: [ // Mississippi voter registration
    'A. Black voter registration increased from 5% to 35% after the 15th Amendment',
    'B. Black registration dropped from over 90% to under 6% after new state laws',
    'C. Registration remained stable at about 50% throughout the Reconstruction era',
    'D. Black registration was never accurately recorded due to poor record keeping'
  ],
  25: [ // White primaries
    'A. Primaries where candidates competed based on their economic policy platforms',
    'B. Democratic Party primaries that excluded Black voters as "private" elections',
    'C. Republican primaries that were open to all voters regardless of their race',
    'D. Nonpartisan primaries required by federal law to be open to all citizens'
  ],
  26: [ // US v. Cruikshank
    'A. Established that the federal government must protect voting rights nationwide',
    'B. Ruled the federal government could not prosecute the Colfax murderers',
    'C. Required states to provide equal protection under their own criminal laws',
    'D. Created federal jurisdiction over all civil rights violations in the South'
  ],
  27: [ // Slaughterhouse Cases
    'A. Expanded the scope of the 14th Amendment to protect economic rights',
    'B. Narrowly interpreted the 14th Amendment, limiting federal civil rights power',
    'C. Struck down state laws that restricted the rights of freedmen in the South',
    'D. Required states to provide equal access to all public accommodations'
  ],
  28: [ // Plessy v. Ferguson
    'A. Declared that racial segregation violated the Equal Protection Clause',
    'B. Established the "separate but equal" doctrine legalizing segregation',
    'C. Required integration of all public transportation across state lines',
    'D. Ruled that private businesses could not discriminate based on race'
  ],
  29: [ // Williams v. Mississippi
    'A. Struck down voting restrictions as unconstitutional under the 15th Amendment',
    'B. Upheld Mississippi\'s voting restrictions despite their discriminatory effect',
    'C. Required Mississippi to allow Black citizens to vote without restrictions',
    'D. Created federal oversight of elections to prevent racial discrimination'
  ],
  30: [ // Giles v. Harris
    'A. Required Alabama to register Black voters who met qualification standards',
    'B. Refused to order Black voter registration, saying courts couldn\'t enforce it',
    'C. Struck down Alabama\'s voter registration requirements as unconstitutional',
    'D. Established federal monitoring of voter registration in Southern states'
  ],
  31: [ // Tuskegee duration
    'A. The study lasted 10 years before ethical concerns led to its termination',
    'B. The study continued for 40 years, withholding treatment from participants',
    'C. The study ran for only 5 years before participants were properly treated',
    'D. The study was canceled after 20 years when federal oversight increased'
  ],
  32: [ // Henrietta Lacks
    'A. She donated her cells voluntarily after being informed of their research value',
    'B. Her cells were taken without consent and used without family compensation',
    'C. She received royalties during her lifetime from the sale of her cell line',
    'D. Her family was compensated immediately after her cells proved valuable'
  ],
  33: [ // Forced sterilizations count
    'A. Approximately 5,000 people were sterilized under various state programs',
    'B. Around 20,000 individuals were affected by eugenics laws nationwide',
    'C. More than 60,000 Americans were forcibly sterilized under state laws',
    'D. Fewer than 1,000 documented cases occurred primarily in California'
  ],
  34: [ // Black land loss acres
    'A. Black farmers lost approximately 2 million acres since the early 1900s',
    'B. Black farmers lost about 5 million acres over the course of the century',
    'C. Black farmers lost roughly 12 million of 19 million acres—about 90%',
    'D. Land ownership remained relatively stable with only minimal losses'
  ],
  35: [ // Sharecropping math
    'A. Sharecroppers typically kept 75% of their harvest after paying expenses',
    'B. The debt trap ensured sharecroppers owed more each year than earned',
    'C. Sharecroppers split profits 50-50 with landowners fairly and equally',
    'D. Federal oversight ensured sharecroppers received fair market prices'
  ],
  36: [ // HOLC maps
    'A. Maps that designated fire hazard zones for insurance rate purposes',
    'B. Maps marking "hazardous" areas for investment, usually due to Black residents',
    'C. Maps identifying areas with communist political activity for surveillance',
    'D. Maps designating historic preservation districts in urban neighborhoods'
  ],
  37: [ // VA loan denials
    'A. Black veterans received GI Bill benefits at rates equal to white veterans',
    'B. Of 67,000 mortgages in NY/NJ, fewer than 100 went to non-white veterans',
    'C. About 25% of GI Bill mortgages in the Northeast went to Black veterans',
    'D. The VA ensured equal distribution of benefits regardless of race'
  ],
  38: [ // Urban renewal
    'A. Urban renewal programs built new affordable housing in Black neighborhoods',
    'B. "Negro removal" displaced Black communities to build highways and projects',
    'C. Urban renewal created integrated housing opportunities for all residents',
    'D. Federal programs preserved historic Black neighborhoods from development'
  ],
  39: [ // Contract buying estimate
    'A. Contract buying affected roughly 10% of Black homebuyers in Chicago',
    'B. Around 30% of Black families purchased homes through contract buying',
    'C. Approximately 85% of Black homebuyers in Chicago used contract buying',
    'D. Contract buying was rare, affecting fewer than 5% of Black families'
  ],
  40: [ // Sundown towns number
    'A. Approximately 500 sundown towns existed primarily in the Deep South',
    'B. Around 2,500 communities had formal or informal sundown policies',
    'C. More than 10,000 sundown towns existed across the entire country',
    'D. Fewer than 100 towns are documented as having sundown ordinances'
  ],
  41: [ // Sundown signs
    'A. "Colored Visitors Welcome During Business Hours Only" was typical',
    'B. Signs reading "N*****, Don\'t Let The Sun Set On You" were posted',
    'C. "Separate Facilities for Colored Patrons Available Nearby" was common',
    'D. "All Visitors Must Register with Local Authorities" was the norm'
  ],
  42: [ // Anna Illinois
    'A. The town name actually stood for "All Neighbors Naturally Accepted"',
    'B. "Ain\'t No N*****s Allowed" was what residents said Anna stood for',
    'C. Anna was one of the first Illinois towns to integrate successfully',
    'D. The town had a large Black population throughout its entire history'
  ],
  43: [ // Green Book
    'A. It was a guide for white tourists visiting the segregated South',
    'B. It listed safe places for Black travelers in a dangerous Jim Crow era',
    'C. It was published by the federal government to promote tourism',
    'D. It rated restaurants and hotels on their quality and amenities'
  ],
  44: [ // Confederate Constitution slavery
    'A. It allowed individual states to abolish slavery if voters approved',
    'B. It explicitly protected slavery forever and banned any limitation on it',
    'C. It was identical to the U.S. Constitution in its treatment of slavery',
    'D. It limited slavery to only agricultural work on established plantations'
  ],
  45: [ // Cornerstone Speech
    'A. States\' rights and the principle of limited federal government power',
    'B. The "great truth" that Black people are inferior and slavery is natural',
    'C. Economic independence from Northern industrial and banking interests',
    'D. Religious freedom and protection of traditional Southern church values'
  ],
  // Education Inequality
  46: [ // Prince Edward County
    'A. Schools immediately integrated following the Supreme Court\'s ruling',
    'B. The county closed ALL public schools for 5 years rather than integrate',
    'C. Only the high schools integrated while elementary schools remained separate',
    'D. Schools delayed just one year for planning before complying with the order'
  ],
  47: [ // Ruby Bridges
    'A. She was welcomed warmly by teachers and students on her first day',
    'B. Federal marshals escorted her through screaming mobs threatening her life',
    'C. The school was closed temporarily to prevent any potential violence',
    'D. She attended her first day of school completely without any incident'
  ],
  48: [ // Massive Resistance
    'A. A coordinated civil rights protest strategy used by Black activists',
    'B. Southern states\' campaign to defy Brown, including closing schools',
    'C. A voter registration drive organized by the NAACP across the South',
    'D. A legal defense fund established to fight segregation in the courts'
  ],
  49: [ // Ten years after Brown
    'A. Approximately 50% of Black children attended integrated schools',
    'B. Around 25% of Black students were in integrated school districts',
    'C. Only about 2% of Black children in the South attended integrated schools',
    'D. Nearly 75% of Black students were in fully integrated school systems'
  ],
  50: [ // Segregation academies
    'A. Training schools established to educate civil rights lawyers and activists',
    'B. Private schools created specifically to allow whites to avoid integration',
    'C. Military preparedness academies established throughout the Southern states',
    'D. Schools dedicated to teaching accurate Southern history and heritage'
  ],
  51: [ // Faubus National Guard
    'A. He welcomed the students personally and ensured their safe entry',
    'B. He called out the National Guard to physically block them from entering',
    'C. He closed the school temporarily while seeking a legal compromise',
    'D. He arranged a private meeting to negotiate a peaceful integration plan'
  ],
  // Housing Discrimination
  52: [ // HOLC redlining
    'A. Designations for fire hazard zones requiring additional insurance coverage',
    'B. Areas marked "hazardous" for lending, almost always due to Black residents',
    'C. Zones identified for communist political activity requiring federal surveillance',
    'D. Historic preservation districts protected from commercial development'
  ],
  53: [ // Restrictive covenants
    'A. Legal requirements that homeowners maintain their property to standards',
    'B. Clauses prohibiting sale to Black people and other minority groups',
    'C. Municipal zoning regulations controlling residential density and land use',
    'D. Historic preservation requirements protecting architectural character'
  ],
  54: [ // Contract buying
    'A. A fair installment plan allowing families to build equity gradually',
    'B. A predatory system with inflated prices and no equity until final payment',
    'C. A government assistance program helping families purchase their first homes',
    'D. A standard rental agreement with an option to purchase after five years'
  ],
  55: [ // Levittown
    'A. Neighbors welcomed them and helped them move into their new home',
    'B. Mobs gathered nightly, threw rocks, and burned crosses on their lawn',
    'C. The community largely ignored them and went about normal daily life',
    'D. They were asked politely to leave by community association leaders'
  ],
  56: [ // FHA manual
    'A. The manual did not address race in any of its underwriting guidelines',
    'B. It explicitly recommended covenants and warned against racial mixing',
    'C. It actively promoted integration to strengthen diverse neighborhoods',
    'D. It focused exclusively on construction quality and structural standards'
  ],
  57: [ // FHA loans percentage
    'A. Approximately 25% of FHA-insured loans went to Black families',
    'B. Around 10% of federal mortgage insurance benefited Black homebuyers',
    'C. Less than 2% of FHA loans went to Black families during this period',
    'D. About 40% of loans were distributed equitably to minority borrowers'
  ],
  // Military Discrimination
  58: [ // Port Chicago
    'A. The sailors were awarded medals for their bravery during the disaster',
    'B. 320 died in an explosion; 50 survivors were convicted of mutiny for refusing',
    'C. The survivors were transferred immediately to much safer duty assignments',
    'D. They received combat assignments after demonstrating courage under fire'
  ],
  59: [ // Isaac Woodard
    'A. He received a hero\'s welcome and was honored at a public ceremony',
    'B. Police chief Shull beat him until he was permanently blinded in both eyes',
    'C. He was offered a well-paying job immediately upon his honorable discharge',
    'D. He was given a parade through the main streets of his South Carolina town'
  ],
  60: [ // WWII veterans treatment
    'A. They were treated as heroes and received full recognition for their service',
    'B. Many were beaten or lynched, specifically targeted for wearing uniforms',
    'C. They received special recognition and priority access to all GI Bill benefits',
    'D. They were welcomed equally alongside white veterans returning from war'
  ],
  61: [ // GI Bill benefits denied
    'A. Black veterans received equal benefits—the GI Bill was administered fairly',
    'B. Home loans, business loans, and college access were systematically denied',
    'C. Only educational benefits were restricted while housing benefits were equal',
    'D. Only healthcare benefits were denied while other benefits were available'
  ],
  62: [ // Military desegregation
    'A. In 1865, immediately following the Union victory in the Civil War',
    'B. In 1948 by executive order, with full implementation during the Korean War',
    'C. In 1964 as part of the landmark Civil Rights Act signed by President Johnson',
    'D. In 1920 after Black soldiers proved their valor during World War I combat'
  ],
  // Police & Law Enforcement Origins
  63: [ // Slave patrols
    'A. British policing models brought over by colonial law enforcement officials',
    'B. Slave patrols organized to catch escapees and suppress potential rebellions',
    'C. Federal marshals appointed by Congress to maintain order in territories',
    'D. Private security companies hired by wealthy merchants to protect property'
  ],
  64: [ // COINTELPRO
    'A. A foreign intelligence program specifically targeting Soviet spy operations',
    'B. An FBI program to surveil, infiltrate, and disrupt civil rights organizations',
    'C. A congressional investigation into communist infiltration of government',
    'D. A community policing initiative designed to improve police-community relations'
  ],
  65: [ // Fred Hampton
    'A. He was arrested and given a fair trial on weapons possession charges',
    'B. He was assassinated in his bed during a pre-dawn raid coordinated with FBI',
    'C. He fled to Cuba before authorities could execute their arrest warrant',
    'D. He was elected to local political office running on a reform platform'
  ],
  66: [ // Bull Connor
    'A. He used peaceful negotiation tactics to maintain order during protests',
    'B. He ordered fire hoses and attack dogs used against children and protesters',
    'C. He relied only on legal injunctions and court orders to control crowds',
    'D. He arranged community mediation sessions between protest groups'
  ],
  67: [ // Kerner Commission
    'A. The commission concluded that outside communist agitators were responsible',
    'B. It found "white racism" was the fundamental cause of urban unrest',
    'C. The report determined that purely economic factors caused the violence',
    'D. It concluded that protests were completely unjustified and without merit'
  ],
  // Northern Complicity
  68: [ // NYC Draft Riots
    'A. There were peaceful protests against the unfair Civil War conscription laws',
    'B. White mobs lynched Black people and burned the Colored Orphan Asylum',
    'C. Organized labor strikes shut down factories throughout the entire city',
    'D. Anti-government protests focused solely on federal war policy decisions'
  ],
  69: [ // Cicero
    'A. The Black family was welcomed by their neighbors with a community reception',
    'B. A mob of 4,000 attacked and burned their apartment while police watched',
    'C. The community voted democratically to accept the family as new neighbors',
    'D. They faced only minor harassment that quickly subsided within days'
  ],
  70: [ // Boston busing
    'A. Schools integrated peacefully with strong community support and cooperation',
    'B. White mobs attacked Black students and threw rocks at school buses',
    'C. The schools integrated smoothly with minimal resistance from white parents',
    'D. Only minor protests occurred that did not disrupt the integration process'
  ],
  71: [ // Ossian Sweet
    'A. He was welcomed warmly by his new neighbors in the Detroit community',
    'B. A white mob surrounded his house; when he defended it, HE was charged',
    'C. He moved into his new home completely without any incident whatsoever',
    'D. Police provided protection and arrested members of the threatening mob'
  ],
  72: [ // Detroit 1943
    'A. The violence resulted from labor disputes at automotive factories',
    'B. Tensions over housing and jobs killed 34 people, mostly Black, many by police',
    'C. Student protests at local universities sparked isolated campus violence',
    'D. A prison uprising spread into surrounding neighborhoods temporarily'
  ],
  // Scientific Racism
  73: [ // Eugenics movement
    'A. It was a minor fringe movement rejected by mainstream scientific institutions',
    'B. It was mainstream science that led to 60,000+ sterilizations and influenced Nazis',
    'C. It was primarily an educational reform movement focused on school curricula',
    'D. It was a public health initiative promoting nutrition and disease prevention'
  ],
  74: [ // Samuel Morton skulls
    'A. His research was neutral anatomical work with no racial implications',
    'B. His rigged measurements were used to "prove" white intellectual superiority',
    'C. His medical research helped develop new treatments for head injuries',
    'D. His anthropological cataloging work was purely for museum collections'
  ],
  75: [ // IQ tests discrimination
    'A. IQ tests were never used in a discriminatory manner against any group',
    'B. Tests designed for whites were used to "prove" Black and immigrant inferiority',
    'C. The tests were only used for educational placement without racial bias',
    'D. Tests were applied equally to all groups with fair and consistent standards'
  ],
  76: [ // Carrie Buck
    'A. She won her case and forced sterilization was ruled unconstitutional',
    'B. The Supreme Court upheld her sterilization, allowing states to sterilize "unfit"',
    'C. She was released from custody and went on to live a normal private life',
    'D. Her case was dismissed on procedural grounds without a ruling on merits'
  ],
  77: [ // J. Marion Sims
    'A. He performed routine vaccinations to protect enslaved people from disease',
    'B. He performed repeated surgeries without anesthesia on the same women',
    'C. He conducted blood pressure studies to improve cardiovascular treatment',
    'D. He researched nutrition to improve the health of enslaved populations'
  ],
  // Labor Discrimination
  78: [ // New Deal exclusions
    'A. The exclusions were made for administrative convenience in rural areas',
    'B. Domestic and farm workers were excluded because Black workers dominated those jobs',
    'C. These workers had separate programs that provided equivalent protections',
    'D. They were covered under state laws that provided even better protections'
  ],
  79: [ // Brotherhood of Sleeping Car Porters
    'A. A company union that was controlled by Pullman Company management',
    'B. The first successful Black labor union, winning recognition after 12 years',
    'C. A social club for railroad workers without collective bargaining power',
    'D. A government agency that regulated working conditions on railroads'
  ],
  80: [ // Last hired, first fired
    'A. A fair seniority-based system that applied equally to workers of all races',
    'B. The pattern of hiring Black workers last and firing them first in downturns',
    'C. A union rotation system designed to distribute work hours fairly to all',
    'D. A government policy that protected all workers equally during recessions'
  ],
  81: [ // Union discrimination
    'A. Unions generally welcomed Black workers and fought for their equal rights',
    'B. Many unions explicitly barred Black members or kept them in segregated locals',
    'C. Unions always fought for Black workers\' rights alongside white members',
    'D. Only Southern unions discriminated while Northern unions were fully integrated'
  ],
  // More Massacres
  82: [ // Wilmington 1898
    'A. There was a peaceful and orderly transfer of political power after elections',
    'B. White supremacists overthrew the elected government and killed 60-300 people',
    'C. A workers\' strike led to temporary disruption of city government services',
    'D. A contested election was settled through proper legal court proceedings'
  ],
  83: [ // Springfield 1908
    'A. Labor disputes at a local factory sparked isolated incidents of violence',
    'B. A false accusation led to mob violence in Lincoln\'s hometown, spurring NAACP',
    'C. School integration protests resulted in minor property damage downtown',
    'D. Election fraud allegations led to peaceful demonstrations at the courthouse'
  ],
  84: [ // Ocoee 1920
    'A. There was record Black voter turnout that dramatically changed election results',
    'B. White mobs killed 30-60 and burned the entire Black community for voting',
    'C. The election proceeded peacefully with only isolated incidents reported',
    'D. Minor voting disputes were resolved through proper legal channels'
  ],
  85: [ // Camilla 1868
    'A. A labor dispute between workers and plantation owners turned violent',
    'B. White mobs attacked a Black Republican rally, killing 7-15 and wounding 30',
    'C. A prison uprising spread beyond the facility into the surrounding town',
    'D. A border conflict between counties resulted in several casualties'
  ],
  // More Lynching
  86: [ // Laura Nelson
    'A. She was imprisoned for speaking out publicly against racial injustice',
    'B. She was lynched from a bridge; she was raped first, photos sold as postcards',
    'C. She fled the state and became a prominent civil rights activist elsewhere',
    'D. She was acquitted of all charges after a fair trial in the county court'
  ],
  87: [ // Anti-lynching bills
    'A. Approximately 10 anti-lynching bills were introduced over the decades',
    'B. Around 50 bills were proposed before one finally passed into law',
    'C. Nearly 200 anti-lynching bills failed before one passed in 2022',
    'D. Only about 5 bills were ever seriously considered by Congress'
  ],
  88: [ // WWI veterans lynched
    'A. Black veterans were protected by their military service and status',
    'B. Many were lynched while still in uniform, targeted for serving their country',
    'C. They received special protection and recognition for their wartime service',
    'D. They faced no more danger than other Black men in the communities'
  ],
  89: [ // Legal lynching
    'A. A lynching that was formally approved by local law enforcement authorities',
    'B. A trial so flawed and mob-pressured it amounted to state-sanctioned murder',
    'C. An official pardon issued by the governor for participants in lynchings',
    'D. A court-ordered execution following a fair trial with proper due process'
  ],
  // More Voting Suppression
  90: [ // Louisiana literacy test
    'A. The tests contained basic reading comprehension questions from textbooks',
    'B. They included impossible questions like "how many bubbles in a bar of soap"',
    'C. Simple spelling tests that most literate adults could pass without difficulty',
    'D. Questions about state history that were taught in Louisiana public schools'
  ],
  91: [ // Eight-box law
    'A. A secure voting method designed to prevent ballot fraud and tampering',
    'B. A system requiring correct box placement, designed to invalidate Black votes',
    'C. A modern voting machine that automatically counted and sorted ballots',
    'D. A mail-in voting system that expanded access to rural voters'
  ],
  92: [ // Understanding clauses
    'A. Requirements that voters understand the basic instructions on their ballot',
    'B. Rules letting registrars require constitutional interpretation to their satisfaction',
    'C. English proficiency requirements that applied equally to all voter applicants',
    'D. Requirements that voters demonstrate they understood how voting machines worked'
  ],
  // More Court Decisions
  93: [ // Civil Rights Cases 1883
    'A. The court ruled that federal civil rights laws were fully constitutional',
    'B. The court ruled Congress could not prohibit private discrimination',
    'C. The court declared that segregation violated the Constitution',
    'D. The court required federal protection of all voting rights'
  ],
  94: [ // Dred Scott
    'A. Black people could become citizens through the naturalization process',
    'B. Black people "had no rights which the white man was bound to respect"',
    'C. Only free-born Black people, not formerly enslaved, could be citizens',
    'D. Individual states had the authority to grant citizenship to Black residents'
  ],
  95: [ // Corrigan v. Buckley
    'A. The court ruled that restrictive covenants violated the 14th Amendment',
    'B. The court ruled racial covenants were constitutional "private" agreements',
    'C. The court declared all housing discrimination unconstitutional',
    'D. The court ruled only state-mandated covenants were legally enforceable'
  ],
  // More Economic
  96: [ // Black land loss
    'A. Black farmers lost approximately 2 million acres from peak ownership',
    'B. Black farmers lost about 12 million of 19 million acres—roughly 90% of land',
    'C. Black farmers lost around 5 million acres over the course of the century',
    'D. Land ownership remained relatively stable with only minimal documented losses'
  ],
  97: [ // Pigford case
    'A. The case revealed only minor administrative errors in loan processing',
    'B. It revealed decades of systematic discrimination with officials using slurs',
    'C. The case found that all farmers had been treated equally by the USDA',
    'D. It showed that Black farmers had actually received preferential treatment'
  ]
};

// Apply fixes
Object.keys(balancedOptions).forEach(idx => {
  const i = parseInt(idx);
  if (data.questions[i]) {
    data.questions[i].options = balancedOptions[i];
  }
});

// Write the updated file
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('Updated', Object.keys(balancedOptions).length, 'questions with balanced options');

// Verify
const newData = require(dataPath);
let stillLonger = 0;
newData.questions.forEach((q, i) => {
  const correctIdx = q.answer.charCodeAt(0) - 65;
  const correctLen = q.options[correctIdx].length;
  const avgOtherLen = q.options
    .filter((_, idx) => idx !== correctIdx)
    .reduce((sum, opt) => sum + opt.length, 0) / 3;
  if (correctLen > avgOtherLen * 1.3) stillLonger++;
});
console.log('Questions still 30%+ longer after fix:', stillLonger, 'of', newData.questions.length);
