export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject: string;
}

export interface QuestionBank {
  [level: string]: {
    [subject: string]: {
      [topic: string]: {
        [difficulty: string]: Question[];
      };
    };
  };
}

export const questionBank: QuestionBank = {
  "JSS": {
    "Mathematics": {
      "Basic Arithmetic": {
        "Easy": [
          { id: "jss-math-ba-e1", text: "What is 15 + 27?", options: ["42", "41", "43", "40"], correctAnswer: "A", explanation: "15 + 27 = 42. Add the ones (5+7=12, carry 1) then tens (1+2+1=4).", topic: "Basic Arithmetic", difficulty: "Easy", subject: "Mathematics" },
          { id: "jss-math-ba-e2", text: "Calculate 84 - 39", options: ["45", "44", "46", "43"], correctAnswer: "A", explanation: "84 - 39 = 45. Borrow from tens: 14-9=5, 7-3=4.", topic: "Basic Arithmetic", difficulty: "Easy", subject: "Mathematics" },
          { id: "jss-math-ba-e3", text: "What is 7 x 8?", options: ["54", "56", "58", "52"], correctAnswer: "B", explanation: "7 x 8 = 56. This is a multiplication table fact.", topic: "Basic Arithmetic", difficulty: "Easy", subject: "Mathematics" },
          { id: "jss-math-ba-e4", text: "Divide 72 by 9", options: ["7", "8", "9", "6"], correctAnswer: "B", explanation: "72 ÷ 9 = 8 because 9 x 8 = 72.", topic: "Basic Arithmetic", difficulty: "Easy", subject: "Mathematics" },
          { id: "jss-math-ba-e5", text: "What is 100 - 47?", options: ["53", "57", "63", "43"], correctAnswer: "A", explanation: "100 - 47 = 53. Subtract step by step.", topic: "Basic Arithmetic", difficulty: "Easy", subject: "Mathematics" }
        ],
        "Medium": [
          { id: "jss-math-ba-m1", text: "Calculate 234 x 12", options: ["2808", "2708", "2818", "2908"], correctAnswer: "A", explanation: "234 x 12 = 234 x 10 + 234 x 2 = 2340 + 468 = 2808.", topic: "Basic Arithmetic", difficulty: "Medium", subject: "Mathematics" },
          { id: "jss-math-ba-m2", text: "What is 1000 ÷ 25?", options: ["40", "45", "35", "50"], correctAnswer: "A", explanation: "1000 ÷ 25 = 40. 25 x 40 = 1000.", topic: "Basic Arithmetic", difficulty: "Medium", subject: "Mathematics" },
          { id: "jss-math-ba-m3", text: "Find the value of 156 + 289 + 455", options: ["900", "890", "910", "880"], correctAnswer: "A", explanation: "156 + 289 + 455 = 900. Add step by step.", topic: "Basic Arithmetic", difficulty: "Medium", subject: "Mathematics" }
        ],
        "Hard": [
          { id: "jss-math-ba-h1", text: "Calculate 4567 x 89", options: ["406463", "406563", "405463", "407463"], correctAnswer: "A", explanation: "4567 x 89 = 4567 x 90 - 4567 = 411030 - 4567 = 406463.", topic: "Basic Arithmetic", difficulty: "Hard", subject: "Mathematics" },
          { id: "jss-math-ba-h2", text: "What is 12345 ÷ 15?", options: ["823", "813", "833", "843"], correctAnswer: "A", explanation: "12345 ÷ 15 = 823. Use long division.", topic: "Basic Arithmetic", difficulty: "Hard", subject: "Mathematics" }
        ]
      },
      "Fractions": {
        "Easy": [
          { id: "jss-math-fr-e1", text: "What is 1/2 + 1/4?", options: ["3/4", "2/4", "1/4", "2/6"], correctAnswer: "A", explanation: "1/2 = 2/4, so 2/4 + 1/4 = 3/4.", topic: "Fractions", difficulty: "Easy", subject: "Mathematics" },
          { id: "jss-math-fr-e2", text: "Simplify 6/12", options: ["1/2", "2/3", "1/3", "3/4"], correctAnswer: "A", explanation: "6/12 = 6÷6 / 12÷6 = 1/2.", topic: "Fractions", difficulty: "Easy", subject: "Mathematics" },
          { id: "jss-math-fr-e3", text: "What is 3/5 of 20?", options: ["12", "15", "10", "8"], correctAnswer: "A", explanation: "3/5 of 20 = (3 x 20) / 5 = 60/5 = 12.", topic: "Fractions", difficulty: "Easy", subject: "Mathematics" }
        ],
        "Medium": [
          { id: "jss-math-fr-m1", text: "Calculate 2/3 + 3/4", options: ["17/12", "5/7", "5/12", "11/12"], correctAnswer: "A", explanation: "2/3 = 8/12, 3/4 = 9/12, so 8/12 + 9/12 = 17/12.", topic: "Fractions", difficulty: "Medium", subject: "Mathematics" },
          { id: "jss-math-fr-m2", text: "What is 5/6 - 1/3?", options: ["1/2", "2/3", "1/3", "4/6"], correctAnswer: "A", explanation: "1/3 = 2/6, so 5/6 - 2/6 = 3/6 = 1/2.", topic: "Fractions", difficulty: "Medium", subject: "Mathematics" }
        ],
        "Hard": [
          { id: "jss-math-fr-h1", text: "Simplify (3/4 x 2/5) ÷ (1/2)", options: ["3/5", "3/10", "6/5", "2/5"], correctAnswer: "C", explanation: "3/4 x 2/5 = 6/20 = 3/10. 3/10 ÷ 1/2 = 3/10 x 2 = 6/10 = 3/5... Actually 3/10 x 2/1 = 6/10 = 3/5. Let me recalculate: (3/4 x 2/5) = 6/20 = 3/10. Dividing by 1/2 means multiply by 2: 3/10 x 2 = 6/10 = 3/5.", topic: "Fractions", difficulty: "Hard", subject: "Mathematics" }
        ]
      },
      "Algebra": {
        "Easy": [
          { id: "jss-math-al-e1", text: "If x + 5 = 12, what is x?", options: ["7", "8", "6", "17"], correctAnswer: "A", explanation: "x + 5 = 12, so x = 12 - 5 = 7.", topic: "Algebra", difficulty: "Easy", subject: "Mathematics" },
          { id: "jss-math-al-e2", text: "Simplify 3x + 2x", options: ["5x", "6x", "5x²", "x"], correctAnswer: "A", explanation: "3x + 2x = 5x. Add the coefficients.", topic: "Algebra", difficulty: "Easy", subject: "Mathematics" },
          { id: "jss-math-al-e3", text: "If 2y = 16, what is y?", options: ["8", "32", "14", "4"], correctAnswer: "A", explanation: "2y = 16, so y = 16 ÷ 2 = 8.", topic: "Algebra", difficulty: "Easy", subject: "Mathematics" }
        ],
        "Medium": [
          { id: "jss-math-al-m1", text: "Solve for x: 3x - 7 = 14", options: ["7", "21", "3", "11"], correctAnswer: "A", explanation: "3x - 7 = 14, 3x = 21, x = 7.", topic: "Algebra", difficulty: "Medium", subject: "Mathematics" },
          { id: "jss-math-al-m2", text: "Expand (x + 3)(x + 2)", options: ["x² + 5x + 6", "x² + 6x + 5", "x² + 5x + 5", "2x + 5"], correctAnswer: "A", explanation: "Using FOIL: x² + 2x + 3x + 6 = x² + 5x + 6.", topic: "Algebra", difficulty: "Medium", subject: "Mathematics" }
        ],
        "Hard": [
          { id: "jss-math-al-h1", text: "Solve: 2(x + 3) - 3(x - 1) = 11", options: ["-2", "2", "-4", "4"], correctAnswer: "A", explanation: "2x + 6 - 3x + 3 = 11, -x + 9 = 11, -x = 2, x = -2.", topic: "Algebra", difficulty: "Hard", subject: "Mathematics" }
        ]
      }
    },
    "English": {
      "Grammar": {
        "Easy": [
          { id: "jss-eng-gr-e1", text: "Choose the correct verb: The cat ___ on the mat.", options: ["sits", "sit", "sitting", "sitted"], correctAnswer: "A", explanation: "'Sits' is the correct present tense for singular subject 'cat'.", topic: "Grammar", difficulty: "Easy", subject: "English" },
          { id: "jss-eng-gr-e2", text: "What is the plural of 'child'?", options: ["children", "childs", "childes", "child"], correctAnswer: "A", explanation: "'Child' has an irregular plural form: 'children'.", topic: "Grammar", difficulty: "Easy", subject: "English" },
          { id: "jss-eng-gr-e3", text: "Identify the noun: 'The boy ran quickly.'", options: ["boy", "ran", "quickly", "the"], correctAnswer: "A", explanation: "'Boy' is the noun - it names a person.", topic: "Grammar", difficulty: "Easy", subject: "English" }
        ],
        "Medium": [
          { id: "jss-eng-gr-m1", text: "Which sentence is grammatically correct?", options: ["She has been working since morning.", "She have been working since morning.", "She has been work since morning.", "She have been work since morning."], correctAnswer: "A", explanation: "'She has been working' is correct present perfect continuous.", topic: "Grammar", difficulty: "Medium", subject: "English" },
          { id: "jss-eng-gr-m2", text: "Choose the correct pronoun: 'Give the book to John and ___.'", options: ["me", "I", "myself", "mine"], correctAnswer: "A", explanation: "'Me' is the object pronoun needed after 'to'.", topic: "Grammar", difficulty: "Medium", subject: "English" }
        ],
        "Hard": [
          { id: "jss-eng-gr-h1", text: "Which sentence uses the subjunctive mood correctly?", options: ["I suggest that he be present.", "I suggest that he is present.", "I suggest that he being present.", "I suggest that he was present."], correctAnswer: "A", explanation: "The subjunctive mood uses 'be' after verbs like 'suggest'.", topic: "Grammar", difficulty: "Hard", subject: "English" }
        ]
      },
      "Vocabulary": {
        "Easy": [
          { id: "jss-eng-vo-e1", text: "What is the meaning of 'enormous'?", options: ["Very large", "Very small", "Very fast", "Very slow"], correctAnswer: "A", explanation: "'Enormous' means extremely large or huge.", topic: "Vocabulary", difficulty: "Easy", subject: "English" },
          { id: "jss-eng-vo-e2", text: "Choose the synonym of 'happy':", options: ["joyful", "sad", "angry", "tired"], correctAnswer: "A", explanation: "'Joyful' means the same as 'happy' - feeling pleasure.", topic: "Vocabulary", difficulty: "Easy", subject: "English" }
        ],
        "Medium": [
          { id: "jss-eng-vo-m1", text: "What is the antonym of 'diligent'?", options: ["lazy", "hardworking", "careful", "smart"], correctAnswer: "A", explanation: "'Lazy' is the opposite of 'diligent' (hardworking).", topic: "Vocabulary", difficulty: "Medium", subject: "English" }
        ],
        "Hard": [
          { id: "jss-eng-vo-h1", text: "What does 'ubiquitous' mean?", options: ["Present everywhere", "Extremely rare", "Very obvious", "Completely hidden"], correctAnswer: "A", explanation: "'Ubiquitous' means present, appearing, or found everywhere.", topic: "Vocabulary", difficulty: "Hard", subject: "English" }
        ]
      }
    },
    "Basic Science": {
      "Living Things": {
        "Easy": [
          { id: "jss-sci-lt-e1", text: "Which of these is a living thing?", options: ["Plant", "Rock", "Water", "Air"], correctAnswer: "A", explanation: "Plants are living things - they grow, reproduce, and respond to stimuli.", topic: "Living Things", difficulty: "Easy", subject: "Basic Science" },
          { id: "jss-sci-lt-e2", text: "What do plants need to make food?", options: ["Sunlight, water, and carbon dioxide", "Meat and vegetables", "Soil and rocks", "Air and sand"], correctAnswer: "A", explanation: "Plants use sunlight, water, and CO2 for photosynthesis.", topic: "Living Things", difficulty: "Easy", subject: "Basic Science" }
        ],
        "Medium": [
          { id: "jss-sci-lt-m1", text: "What is the process by which plants make their own food called?", options: ["Photosynthesis", "Respiration", "Digestion", "Excretion"], correctAnswer: "A", explanation: "Photosynthesis is the process plants use to convert light energy into food.", topic: "Living Things", difficulty: "Medium", subject: "Basic Science" }
        ],
        "Hard": [
          { id: "jss-sci-lt-h1", text: "Which organelle is responsible for photosynthesis?", options: ["Chloroplast", "Mitochondria", "Nucleus", "Ribosome"], correctAnswer: "A", explanation: "Chloroplasts contain chlorophyll and are where photosynthesis occurs.", topic: "Living Things", difficulty: "Hard", subject: "Basic Science" }
        ]
      }
    }
  },
  "SSS": {
    "Economics": {
      "Demand and Supply": {
        "Easy": [
          { id: "sss-eco-ds-e1", text: "What happens to demand when price increases?", options: ["Demand decreases", "Demand increases", "Demand stays the same", "Supply decreases"], correctAnswer: "A", explanation: "According to the law of demand, when price increases, quantity demanded decreases.", topic: "Demand and Supply", difficulty: "Easy", subject: "Economics" },
          { id: "sss-eco-ds-e2", text: "The point where demand and supply curves meet is called:", options: ["Equilibrium", "Inflation", "Deflation", "Scarcity"], correctAnswer: "A", explanation: "Equilibrium is the point where quantity demanded equals quantity supplied.", topic: "Demand and Supply", difficulty: "Easy", subject: "Economics" }
        ],
        "Medium": [
          { id: "sss-eco-ds-m1", text: "A shift in the demand curve to the right indicates:", options: ["Increase in demand", "Decrease in demand", "Increase in price", "Decrease in supply"], correctAnswer: "A", explanation: "A rightward shift means consumers want to buy more at every price level.", topic: "Demand and Supply", difficulty: "Medium", subject: "Economics" }
        ],
        "Hard": [
          { id: "sss-eco-ds-h1", text: "If demand is perfectly inelastic, the demand curve is:", options: ["Vertical", "Horizontal", "Downward sloping", "Upward sloping"], correctAnswer: "A", explanation: "Perfectly inelastic demand means quantity demanded doesn't change with price - vertical line.", topic: "Demand and Supply", difficulty: "Hard", subject: "Economics" }
        ]
      },
      "National Income": {
        "Easy": [
          { id: "sss-eco-ni-e1", text: "GDP stands for:", options: ["Gross Domestic Product", "General Domestic Product", "Gross Domestic Price", "General Domestic Price"], correctAnswer: "A", explanation: "GDP = Gross Domestic Product, the total value of goods and services produced.", topic: "National Income", difficulty: "Easy", subject: "Economics" }
        ],
        "Medium": [
          { id: "sss-eco-ni-m1", text: "Which is NOT a method of calculating national income?", options: ["Taxation method", "Income method", "Expenditure method", "Output method"], correctAnswer: "A", explanation: "The three methods are: Income, Expenditure, and Output methods.", topic: "National Income", difficulty: "Medium", subject: "Economics" }
        ],
        "Hard": [
          { id: "sss-eco-ni-h1", text: "Per capita income is calculated by:", options: ["National income ÷ Population", "National income × Population", "GDP + GNP", "Exports - Imports"], correctAnswer: "A", explanation: "Per capita income = National income divided by total population.", topic: "National Income", difficulty: "Hard", subject: "Economics" }
        ]
      }
    },
    "Government": {
      "Political Systems": {
        "Easy": [
          { id: "sss-gov-ps-e1", text: "Nigeria practices which system of government?", options: ["Federal system", "Unitary system", "Confederate system", "Monarchy"], correctAnswer: "A", explanation: "Nigeria operates a federal system with power shared between central and state governments.", topic: "Political Systems", difficulty: "Easy", subject: "Government" },
          { id: "sss-gov-ps-e2", text: "The head of the executive arm in Nigeria is:", options: ["President", "Senate President", "Chief Justice", "Speaker"], correctAnswer: "A", explanation: "The President heads the executive arm of government in Nigeria.", topic: "Political Systems", difficulty: "Easy", subject: "Government" }
        ],
        "Medium": [
          { id: "sss-gov-ps-m1", text: "How many states are in Nigeria?", options: ["36", "37", "35", "30"], correctAnswer: "A", explanation: "Nigeria has 36 states plus the Federal Capital Territory (FCT).", topic: "Political Systems", difficulty: "Medium", subject: "Government" }
        ],
        "Hard": [
          { id: "sss-gov-ps-h1", text: "The principle of separation of powers was propounded by:", options: ["Montesquieu", "John Locke", "Aristotle", "Plato"], correctAnswer: "A", explanation: "Baron de Montesquieu developed the theory of separation of powers.", topic: "Political Systems", difficulty: "Hard", subject: "Government" }
        ]
      },
      "Constitution": {
        "Easy": [
          { id: "sss-gov-co-e1", text: "Nigeria's current constitution was adopted in:", options: ["1999", "1979", "1989", "1963"], correctAnswer: "A", explanation: "The 1999 Constitution is Nigeria's current constitution.", topic: "Constitution", difficulty: "Easy", subject: "Government" }
        ],
        "Medium": [
          { id: "sss-gov-co-m1", text: "The supremacy of the constitution means:", options: ["Constitution is the highest law", "President is supreme", "Military is supreme", "Judiciary is supreme"], correctAnswer: "A", explanation: "Constitutional supremacy means the constitution overrides all other laws.", topic: "Constitution", difficulty: "Medium", subject: "Government" }
        ],
        "Hard": [
          { id: "sss-gov-co-h1", text: "Chapter 4 of the 1999 Constitution deals with:", options: ["Fundamental rights", "Executive powers", "Legislative powers", "Judicial powers"], correctAnswer: "A", explanation: "Chapter 4 contains the fundamental human rights provisions.", topic: "Constitution", difficulty: "Hard", subject: "Government" }
        ]
      }
    },
    "Literature": {
      "Poetry": {
        "Easy": [
          { id: "sss-lit-po-e1", text: "A poem of 14 lines is called:", options: ["Sonnet", "Ode", "Elegy", "Ballad"], correctAnswer: "A", explanation: "A sonnet is a 14-line poem, typically in iambic pentameter.", topic: "Poetry", difficulty: "Easy", subject: "Literature" },
          { id: "sss-lit-po-e2", text: "The repetition of consonant sounds at the beginning of words is:", options: ["Alliteration", "Assonance", "Rhyme", "Onomatopoeia"], correctAnswer: "A", explanation: "Alliteration is the repetition of initial consonant sounds.", topic: "Poetry", difficulty: "Easy", subject: "Literature" }
        ],
        "Medium": [
          { id: "sss-lit-po-m1", text: "An elegy is a poem written to:", options: ["Mourn the dead", "Praise a hero", "Celebrate love", "Tell a story"], correctAnswer: "A", explanation: "An elegy is a mournful poem, typically lamenting the dead.", topic: "Poetry", difficulty: "Medium", subject: "Literature" }
        ],
        "Hard": [
          { id: "sss-lit-po-h1", text: "Iambic pentameter consists of:", options: ["Five feet of unstressed-stressed syllables", "Four feet", "Six feet", "Three feet"], correctAnswer: "A", explanation: "Iambic pentameter has 5 iambs (da-DUM), totaling 10 syllables.", topic: "Poetry", difficulty: "Hard", subject: "Literature" }
        ]
      },
      "Prose": {
        "Easy": [
          { id: "sss-lit-pr-e1", text: "The main character in a story is called:", options: ["Protagonist", "Antagonist", "Narrator", "Author"], correctAnswer: "A", explanation: "The protagonist is the main character or hero of the story.", topic: "Prose", difficulty: "Easy", subject: "Literature" }
        ],
        "Medium": [
          { id: "sss-lit-pr-m1", text: "A story within a story is called:", options: ["Frame narrative", "Flashback", "Foreshadowing", "Subplot"], correctAnswer: "A", explanation: "Frame narrative is a story that contains another story within it.", topic: "Prose", difficulty: "Medium", subject: "Literature" }
        ],
        "Hard": [
          { id: "sss-lit-pr-h1", text: "Stream of consciousness is a narrative technique that:", options: ["Shows character's thoughts as they occur", "Tells events in order", "Uses dialogue only", "Describes settings"], correctAnswer: "A", explanation: "Stream of consciousness presents thoughts as a continuous flow.", topic: "Prose", difficulty: "Hard", subject: "Literature" }
        ]
      }
    },
    "Geography": {
      "Physical Geography": {
        "Easy": [
          { id: "sss-geo-pg-e1", text: "The layer of gases surrounding the Earth is called:", options: ["Atmosphere", "Lithosphere", "Hydrosphere", "Biosphere"], correctAnswer: "A", explanation: "The atmosphere is the layer of gases surrounding Earth.", topic: "Physical Geography", difficulty: "Easy", subject: "Geography" },
          { id: "sss-geo-pg-e2", text: "Nigeria is located in which continent?", options: ["Africa", "Asia", "Europe", "America"], correctAnswer: "A", explanation: "Nigeria is located in West Africa.", topic: "Physical Geography", difficulty: "Easy", subject: "Geography" }
        ],
        "Medium": [
          { id: "sss-geo-pg-m1", text: "The two main rivers in Nigeria are:", options: ["Niger and Benue", "Nile and Congo", "Amazon and Niger", "Niger and Zambezi"], correctAnswer: "A", explanation: "The River Niger and River Benue are Nigeria's main rivers.", topic: "Physical Geography", difficulty: "Medium", subject: "Geography" }
        ],
        "Hard": [
          { id: "sss-geo-pg-h1", text: "The highest point in Nigeria is:", options: ["Chappal Waddi", "Obudu Plateau", "Jos Plateau", "Mambilla Plateau"], correctAnswer: "A", explanation: "Chappal Waddi at 2,419m is Nigeria's highest peak.", topic: "Physical Geography", difficulty: "Hard", subject: "Geography" }
        ]
      },
      "Climate": {
        "Easy": [
          { id: "sss-geo-cl-e1", text: "Nigeria has how many main climate zones?", options: ["Two (tropical and savanna)", "One", "Three", "Four"], correctAnswer: "A", explanation: "Nigeria mainly has tropical rainforest in the south and savanna in the north.", topic: "Climate", difficulty: "Easy", subject: "Geography" }
        ],
        "Medium": [
          { id: "sss-geo-cl-m1", text: "The Harmattan wind blows from:", options: ["Sahara Desert", "Atlantic Ocean", "Indian Ocean", "Mediterranean"], correctAnswer: "A", explanation: "Harmattan is a dry, dusty wind from the Sahara Desert.", topic: "Climate", difficulty: "Medium", subject: "Geography" }
        ],
        "Hard": [
          { id: "sss-geo-cl-h1", text: "The Inter-Tropical Convergence Zone (ITCZ) is:", options: ["Where trade winds meet", "A mountain range", "An ocean current", "A type of rainfall"], correctAnswer: "A", explanation: "ITCZ is where northeast and southeast trade winds converge.", topic: "Climate", difficulty: "Hard", subject: "Geography" }
        ]
      }
    },
    "Agricultural Science": {
      "Crop Production": {
        "Easy": [
          { id: "sss-agr-cp-e1", text: "Which is a cash crop in Nigeria?", options: ["Cocoa", "Cassava", "Yam", "Maize"], correctAnswer: "A", explanation: "Cocoa is a major cash crop grown for export in Nigeria.", topic: "Crop Production", difficulty: "Easy", subject: "Agricultural Science" },
          { id: "sss-agr-cp-e2", text: "Leguminous plants help the soil by:", options: ["Fixing nitrogen", "Adding water", "Removing nutrients", "Causing erosion"], correctAnswer: "A", explanation: "Legumes have root nodules with bacteria that fix atmospheric nitrogen.", topic: "Crop Production", difficulty: "Easy", subject: "Agricultural Science" }
        ],
        "Medium": [
          { id: "sss-agr-cp-m1", text: "The practice of growing different crops on the same land in rotation is:", options: ["Crop rotation", "Mixed farming", "Monoculture", "Bush fallowing"], correctAnswer: "A", explanation: "Crop rotation involves growing different crops in sequence on the same land.", topic: "Crop Production", difficulty: "Medium", subject: "Agricultural Science" }
        ],
        "Hard": [
          { id: "sss-agr-cp-h1", text: "NPK fertilizer contains:", options: ["Nitrogen, Phosphorus, Potassium", "Nitrogen, Phosphorus, Calcium", "Nitrogen, Potassium, Calcium", "Nitrogen, Phosphorus, Magnesium"], correctAnswer: "A", explanation: "NPK stands for Nitrogen (N), Phosphorus (P), and Potassium (K).", topic: "Crop Production", difficulty: "Hard", subject: "Agricultural Science" }
        ]
      },
      "Animal Husbandry": {
        "Easy": [
          { id: "sss-agr-ah-e1", text: "Poultry refers to:", options: ["Domestic birds", "Cattle", "Fish", "Pigs"], correctAnswer: "A", explanation: "Poultry includes domestic birds like chickens, turkeys, and ducks.", topic: "Animal Husbandry", difficulty: "Easy", subject: "Agricultural Science" }
        ],
        "Medium": [
          { id: "sss-agr-ah-m1", text: "Broilers are chickens raised mainly for:", options: ["Meat", "Eggs", "Feathers", "Fighting"], correctAnswer: "A", explanation: "Broilers are bred and raised specifically for meat production.", topic: "Animal Husbandry", difficulty: "Medium", subject: "Agricultural Science" }
        ],
        "Hard": [
          { id: "sss-agr-ah-h1", text: "The gestation period of a pig is approximately:", options: ["114 days", "280 days", "150 days", "365 days"], correctAnswer: "A", explanation: "Pigs have a gestation period of about 3 months, 3 weeks, 3 days (114 days).", topic: "Animal Husbandry", difficulty: "Hard", subject: "Agricultural Science" }
        ]
      }
    },
    "Commerce": {
      "Trade": {
        "Easy": [
          { id: "sss-com-tr-e1", text: "Trade between two countries is called:", options: ["International trade", "Home trade", "Retail trade", "Wholesale trade"], correctAnswer: "A", explanation: "International trade is the exchange of goods between countries.", topic: "Trade", difficulty: "Easy", subject: "Commerce" },
          { id: "sss-com-tr-e2", text: "A person who buys goods in large quantities to sell to retailers is a:", options: ["Wholesaler", "Consumer", "Manufacturer", "Importer"], correctAnswer: "A", explanation: "Wholesalers buy in bulk and sell to retailers.", topic: "Trade", difficulty: "Easy", subject: "Commerce" }
        ],
        "Medium": [
          { id: "sss-com-tr-m1", text: "Balance of trade is the difference between:", options: ["Exports and imports", "Income and expenditure", "Assets and liabilities", "Savings and investments"], correctAnswer: "A", explanation: "Balance of trade = Value of exports - Value of imports.", topic: "Trade", difficulty: "Medium", subject: "Commerce" }
        ],
        "Hard": [
          { id: "sss-com-tr-h1", text: "Invisible trade includes:", options: ["Services like banking and tourism", "Manufactured goods", "Raw materials", "Agricultural products"], correctAnswer: "A", explanation: "Invisible trade refers to trade in services rather than physical goods.", topic: "Trade", difficulty: "Hard", subject: "Commerce" }
        ]
      },
      "Banking": {
        "Easy": [
          { id: "sss-com-ba-e1", text: "The Central Bank of Nigeria was established in:", options: ["1958", "1960", "1963", "1970"], correctAnswer: "A", explanation: "CBN was established in 1958 and began operations in 1959.", topic: "Banking", difficulty: "Easy", subject: "Commerce" }
        ],
        "Medium": [
          { id: "sss-com-ba-m1", text: "A cheque that cannot be cashed over the counter is:", options: ["Crossed cheque", "Open cheque", "Bearer cheque", "Order cheque"], correctAnswer: "A", explanation: "A crossed cheque must be deposited into a bank account.", topic: "Banking", difficulty: "Medium", subject: "Commerce" }
        ],
        "Hard": [
          { id: "sss-com-ba-h1", text: "The tool used by CBN to control money supply by buying/selling securities is:", options: ["Open market operations", "Bank rate", "Cash ratio", "Moral suasion"], correctAnswer: "A", explanation: "Open market operations involve buying/selling government securities.", topic: "Banking", difficulty: "Hard", subject: "Commerce" }
        ]
      }
    },
    "Accounting": {
      "Basic Concepts": {
        "Easy": [
          { id: "sss-acc-bc-e1", text: "The accounting equation is:", options: ["Assets = Liabilities + Capital", "Assets = Liabilities - Capital", "Assets + Liabilities = Capital", "Capital = Assets + Liabilities"], correctAnswer: "A", explanation: "Assets = Liabilities + Owner's Equity (Capital).", topic: "Basic Concepts", difficulty: "Easy", subject: "Accounting" },
          { id: "sss-acc-bc-e2", text: "A document issued when goods are returned is:", options: ["Credit note", "Debit note", "Invoice", "Receipt"], correctAnswer: "A", explanation: "A credit note is issued to acknowledge returned goods.", topic: "Basic Concepts", difficulty: "Easy", subject: "Accounting" }
        ],
        "Medium": [
          { id: "sss-acc-bc-m1", text: "The book where all transactions are first recorded is:", options: ["Journal", "Ledger", "Trial balance", "Cash book"], correctAnswer: "A", explanation: "The journal is the book of original entry.", topic: "Basic Concepts", difficulty: "Medium", subject: "Accounting" }
        ],
        "Hard": [
          { id: "sss-acc-bc-h1", text: "Depreciation is:", options: ["Reduction in asset value over time", "Increase in asset value", "Cost of buying assets", "Profit from selling assets"], correctAnswer: "A", explanation: "Depreciation allocates the cost of an asset over its useful life.", topic: "Basic Concepts", difficulty: "Hard", subject: "Accounting" }
        ]
      }
    },
    "Civic Education": {
      "Citizenship": {
        "Easy": [
          { id: "sss-civ-ci-e1", text: "A citizen is a person who:", options: ["Belongs to a country by birth or naturalization", "Visits a country", "Works in a country", "Studies in a country"], correctAnswer: "A", explanation: "Citizens have full rights and duties in their country.", topic: "Citizenship", difficulty: "Easy", subject: "Civic Education" },
          { id: "sss-civ-ci-e2", text: "Which is a duty of a Nigerian citizen?", options: ["Paying taxes", "Voting abroad", "Joining the military", "Criticizing the government"], correctAnswer: "A", explanation: "Paying taxes is a civic duty of all citizens.", topic: "Citizenship", difficulty: "Easy", subject: "Civic Education" }
        ],
        "Medium": [
          { id: "sss-civ-ci-m1", text: "The right to vote and be voted for is called:", options: ["Franchise", "Suffrage", "Democracy", "Liberty"], correctAnswer: "A", explanation: "Franchise or suffrage is the right to vote in elections.", topic: "Citizenship", difficulty: "Medium", subject: "Civic Education" }
        ],
        "Hard": [
          { id: "sss-civ-ci-h1", text: "Naturalization is the process of:", options: ["Acquiring citizenship legally", "Losing citizenship", "Dual citizenship", "Citizenship by birth"], correctAnswer: "A", explanation: "Naturalization is legally acquiring citizenship of another country.", topic: "Citizenship", difficulty: "Hard", subject: "Civic Education" }
        ]
      },
      "Human Rights": {
        "Easy": [
          { id: "sss-civ-hr-e1", text: "The right to life is a:", options: ["Fundamental right", "Privilege", "Duty", "Obligation"], correctAnswer: "A", explanation: "Right to life is a fundamental human right.", topic: "Human Rights", difficulty: "Easy", subject: "Civic Education" }
        ],
        "Medium": [
          { id: "sss-civ-hr-m1", text: "Human rights can be limited during:", options: ["State of emergency", "Elections", "Census", "Holidays"], correctAnswer: "A", explanation: "Some rights can be suspended during declared emergencies.", topic: "Human Rights", difficulty: "Medium", subject: "Civic Education" }
        ],
        "Hard": [
          { id: "sss-civ-hr-h1", text: "The UDHR was adopted in:", options: ["1948", "1945", "1960", "1999"], correctAnswer: "A", explanation: "The Universal Declaration of Human Rights was adopted in 1948.", topic: "Human Rights", difficulty: "Hard", subject: "Civic Education" }
        ]
      }
    },
    "Computer Studies": {
      "Hardware": {
        "Easy": [
          { id: "sss-ict-hw-e1", text: "The brain of the computer is:", options: ["CPU", "RAM", "Hard disk", "Monitor"], correctAnswer: "A", explanation: "The CPU (Central Processing Unit) processes all instructions.", topic: "Hardware", difficulty: "Easy", subject: "Computer Studies" },
          { id: "sss-ict-hw-e2", text: "Which is an input device?", options: ["Keyboard", "Monitor", "Printer", "Speaker"], correctAnswer: "A", explanation: "Keyboard is used to input data into the computer.", topic: "Hardware", difficulty: "Easy", subject: "Computer Studies" }
        ],
        "Medium": [
          { id: "sss-ict-hw-m1", text: "RAM stands for:", options: ["Random Access Memory", "Read Access Memory", "Random Automatic Memory", "Read Automatic Memory"], correctAnswer: "A", explanation: "RAM = Random Access Memory, the computer's working memory.", topic: "Hardware", difficulty: "Medium", subject: "Computer Studies" }
        ],
        "Hard": [
          { id: "sss-ict-hw-h1", text: "How many bytes are in a kilobyte?", options: ["1024", "1000", "100", "512"], correctAnswer: "A", explanation: "1 KB = 1024 bytes in binary computing.", topic: "Hardware", difficulty: "Hard", subject: "Computer Studies" }
        ]
      },
      "Software": {
        "Easy": [
          { id: "sss-ict-sw-e1", text: "Microsoft Word is an example of:", options: ["Application software", "System software", "Hardware", "Firmware"], correctAnswer: "A", explanation: "MS Word is application software for word processing.", topic: "Software", difficulty: "Easy", subject: "Computer Studies" }
        ],
        "Medium": [
          { id: "sss-ict-sw-m1", text: "An operating system is an example of:", options: ["System software", "Application software", "Malware", "Utility"], correctAnswer: "A", explanation: "Operating systems manage computer hardware and software resources.", topic: "Software", difficulty: "Medium", subject: "Computer Studies" }
        ],
        "Hard": [
          { id: "sss-ict-sw-h1", text: "Which programming language is used for web pages?", options: ["HTML", "Python", "Java", "C++"], correctAnswer: "A", explanation: "HTML (HyperText Markup Language) is used to create web pages.", topic: "Software", difficulty: "Hard", subject: "Computer Studies" }
        ]
      }
    },
    "Further Mathematics": {
      "Matrices": {
        "Easy": [
          { id: "sss-fma-ma-e1", text: "A matrix with equal rows and columns is called:", options: ["Square matrix", "Row matrix", "Column matrix", "Zero matrix"], correctAnswer: "A", explanation: "A square matrix has the same number of rows and columns.", topic: "Matrices", difficulty: "Easy", subject: "Further Mathematics" }
        ],
        "Medium": [
          { id: "sss-fma-ma-m1", text: "The identity matrix I when multiplied by matrix A gives:", options: ["A", "I", "0", "2A"], correctAnswer: "A", explanation: "IA = AI = A. The identity matrix is the multiplicative identity.", topic: "Matrices", difficulty: "Medium", subject: "Further Mathematics" }
        ],
        "Hard": [
          { id: "sss-fma-ma-h1", text: "If det(A) = 0, then matrix A is:", options: ["Singular", "Non-singular", "Identity", "Symmetric"], correctAnswer: "A", explanation: "A singular matrix has determinant zero and no inverse.", topic: "Matrices", difficulty: "Hard", subject: "Further Mathematics" }
        ]
      },
      "Vectors": {
        "Easy": [
          { id: "sss-fma-ve-e1", text: "A quantity with both magnitude and direction is:", options: ["Vector", "Scalar", "Matrix", "Tensor"], correctAnswer: "A", explanation: "Vectors have both magnitude (size) and direction.", topic: "Vectors", difficulty: "Easy", subject: "Further Mathematics" }
        ],
        "Medium": [
          { id: "sss-fma-ve-m1", text: "The dot product of two perpendicular vectors is:", options: ["0", "1", "-1", "Undefined"], correctAnswer: "A", explanation: "Perpendicular vectors have dot product = 0 (cos 90° = 0).", topic: "Vectors", difficulty: "Medium", subject: "Further Mathematics" }
        ],
        "Hard": [
          { id: "sss-fma-ve-h1", text: "The magnitude of vector (3, 4) is:", options: ["5", "7", "1", "12"], correctAnswer: "A", explanation: "|v| = √(3² + 4²) = √(9 + 16) = √25 = 5.", topic: "Vectors", difficulty: "Hard", subject: "Further Mathematics" }
        ]
      }
    },
    "CRS": {
      "The Bible": {
        "Easy": [
          { id: "sss-crs-bi-e1", text: "How many books are in the Bible?", options: ["66", "72", "39", "27"], correctAnswer: "A", explanation: "The Bible has 66 books: 39 Old Testament, 27 New Testament.", topic: "The Bible", difficulty: "Easy", subject: "CRS" },
          { id: "sss-crs-bi-e2", text: "Who wrote most of the Psalms?", options: ["David", "Moses", "Solomon", "Paul"], correctAnswer: "A", explanation: "King David is credited with writing most of the Psalms.", topic: "The Bible", difficulty: "Easy", subject: "CRS" }
        ],
        "Medium": [
          { id: "sss-crs-bi-m1", text: "The first five books of the Bible are called:", options: ["Pentateuch", "Gospels", "Epistles", "Prophets"], correctAnswer: "A", explanation: "Pentateuch means 'five books' - Genesis to Deuteronomy.", topic: "The Bible", difficulty: "Medium", subject: "CRS" }
        ],
        "Hard": [
          { id: "sss-crs-bi-h1", text: "The Council of Nicea was held in:", options: ["325 AD", "100 AD", "500 AD", "1000 AD"], correctAnswer: "A", explanation: "The First Council of Nicea was convened in 325 AD.", topic: "The Bible", difficulty: "Hard", subject: "CRS" }
        ]
      }
    },
    "IRS": {
      "Pillars of Islam": {
        "Easy": [
          { id: "sss-irs-pi-e1", text: "How many pillars of Islam are there?", options: ["5", "4", "6", "7"], correctAnswer: "A", explanation: "There are 5 pillars: Shahada, Salat, Zakat, Sawm, Hajj.", topic: "Pillars of Islam", difficulty: "Easy", subject: "IRS" },
          { id: "sss-irs-pi-e2", text: "The Islamic holy book is called:", options: ["Quran", "Torah", "Bible", "Vedas"], correctAnswer: "A", explanation: "The Quran is the central religious text of Islam.", topic: "Pillars of Islam", difficulty: "Easy", subject: "IRS" }
        ],
        "Medium": [
          { id: "sss-irs-pi-m1", text: "Zakat is:", options: ["Obligatory charity", "Fasting", "Prayer", "Pilgrimage"], correctAnswer: "A", explanation: "Zakat is compulsory almsgiving, one of the five pillars.", topic: "Pillars of Islam", difficulty: "Medium", subject: "IRS" }
        ],
        "Hard": [
          { id: "sss-irs-pi-h1", text: "The Islamic calendar began from:", options: ["Hijra (622 CE)", "Birth of Prophet Muhammad", "Conquest of Mecca", "Revelation of Quran"], correctAnswer: "A", explanation: "The Islamic calendar starts from the Hijra migration in 622 CE.", topic: "Pillars of Islam", difficulty: "Hard", subject: "IRS" }
        ]
      }
    },
    "French": {
      "Basic French": {
        "Easy": [
          { id: "sss-fre-bf-e1", text: "How do you say 'Hello' in French?", options: ["Bonjour", "Merci", "Au revoir", "S'il vous plaît"], correctAnswer: "A", explanation: "Bonjour means 'Hello' or 'Good day' in French.", topic: "Basic French", difficulty: "Easy", subject: "French" },
          { id: "sss-fre-bf-e2", text: "'Merci' means:", options: ["Thank you", "Please", "Sorry", "Hello"], correctAnswer: "A", explanation: "Merci is French for 'Thank you'.", topic: "Basic French", difficulty: "Easy", subject: "French" }
        ],
        "Medium": [
          { id: "sss-fre-bf-m1", text: "How do you say 'I am a student' in French?", options: ["Je suis étudiant", "Tu es étudiant", "Il est étudiant", "Nous sommes étudiants"], correctAnswer: "A", explanation: "'Je suis' means 'I am'. Étudiant means 'student'.", topic: "Basic French", difficulty: "Medium", subject: "French" }
        ],
        "Hard": [
          { id: "sss-fre-bf-h1", text: "The past tense of 'aller' (to go) with 'je' is:", options: ["Je suis allé", "J'ai allé", "Je vais", "J'allais"], correctAnswer: "A", explanation: "Aller uses être in passé composé: Je suis allé (I went).", topic: "Basic French", difficulty: "Hard", subject: "French" }
        ]
      }
    },
    "Health Education": {
      "Personal Hygiene": {
        "Easy": [
          { id: "sss-hea-ph-e1", text: "How often should you brush your teeth?", options: ["At least twice daily", "Once a week", "Once a month", "Only when dirty"], correctAnswer: "A", explanation: "Brushing twice daily prevents tooth decay and gum disease.", topic: "Personal Hygiene", difficulty: "Easy", subject: "Health Education" }
        ],
        "Medium": [
          { id: "sss-hea-ph-m1", text: "Hand washing helps prevent:", options: ["Spread of diseases", "Hair loss", "Weight gain", "Height reduction"], correctAnswer: "A", explanation: "Proper hand washing kills germs and prevents disease transmission.", topic: "Personal Hygiene", difficulty: "Medium", subject: "Health Education" }
        ],
        "Hard": [
          { id: "sss-hea-ph-h1", text: "The recommended duration for hand washing is:", options: ["20 seconds", "5 seconds", "1 minute", "10 seconds"], correctAnswer: "A", explanation: "WHO recommends washing hands for at least 20 seconds.", topic: "Personal Hygiene", difficulty: "Hard", subject: "Health Education" }
        ]
      },
      "First Aid": {
        "Easy": [
          { id: "sss-hea-fa-e1", text: "First aid is:", options: ["Immediate help before medical care", "Surgery", "Hospital treatment", "Medicine"], correctAnswer: "A", explanation: "First aid is emergency care given before professional help arrives.", topic: "First Aid", difficulty: "Easy", subject: "Health Education" }
        ],
        "Medium": [
          { id: "sss-hea-fa-m1", text: "For a minor burn, you should:", options: ["Apply cool water", "Apply butter", "Apply ice directly", "Cover with cloth"], correctAnswer: "A", explanation: "Cool running water helps reduce burn damage.", topic: "First Aid", difficulty: "Medium", subject: "Health Education" }
        ],
        "Hard": [
          { id: "sss-hea-fa-h1", text: "CPR stands for:", options: ["Cardiopulmonary Resuscitation", "Cardiac Pulse Rate", "Central Pressure Response", "Chest Pain Relief"], correctAnswer: "A", explanation: "CPR = Cardiopulmonary Resuscitation, an emergency life-saving procedure.", topic: "First Aid", difficulty: "Hard", subject: "Health Education" }
        ]
      }
    },
    "Physical Education": {
      "Sports": {
        "Easy": [
          { id: "sss-ped-sp-e1", text: "How many players are in a football team on the field?", options: ["11", "10", "12", "9"], correctAnswer: "A", explanation: "A football/soccer team has 11 players on the field.", topic: "Sports", difficulty: "Easy", subject: "Physical Education" }
        ],
        "Medium": [
          { id: "sss-ped-sp-m1", text: "The Olympic Games are held every:", options: ["4 years", "2 years", "3 years", "5 years"], correctAnswer: "A", explanation: "The Olympic Games occur every 4 years.", topic: "Sports", difficulty: "Medium", subject: "Physical Education" }
        ],
        "Hard": [
          { id: "sss-ped-sp-h1", text: "The marathon race covers a distance of:", options: ["42.195 km", "40 km", "50 km", "26 km"], correctAnswer: "A", explanation: "A marathon is 42.195 kilometers (26.2 miles).", topic: "Sports", difficulty: "Hard", subject: "Physical Education" }
        ]
      }
    },
    "Fine Arts": {
      "Art Elements": {
        "Easy": [
          { id: "sss-art-ae-e1", text: "The primary colors are:", options: ["Red, blue, yellow", "Red, green, blue", "Orange, green, purple", "Black, white, gray"], correctAnswer: "A", explanation: "Primary colors (red, blue, yellow) cannot be made by mixing other colors.", topic: "Art Elements", difficulty: "Easy", subject: "Fine Arts" }
        ],
        "Medium": [
          { id: "sss-art-ae-m1", text: "Mixing red and blue gives:", options: ["Purple", "Green", "Orange", "Brown"], correctAnswer: "A", explanation: "Red + Blue = Purple (a secondary color).", topic: "Art Elements", difficulty: "Medium", subject: "Fine Arts" }
        ],
        "Hard": [
          { id: "sss-art-ae-h1", text: "Complementary colors are:", options: ["Opposite on the color wheel", "Next to each other", "Same family", "Neutral colors"], correctAnswer: "A", explanation: "Complementary colors are opposite each other on the color wheel.", topic: "Art Elements", difficulty: "Hard", subject: "Fine Arts" }
        ]
      }
    },
    "Music": {
      "Music Theory": {
        "Easy": [
          { id: "sss-mus-mt-e1", text: "How many lines are in a musical staff?", options: ["5", "4", "6", "7"], correctAnswer: "A", explanation: "A musical staff has 5 horizontal lines.", topic: "Music Theory", difficulty: "Easy", subject: "Music" }
        ],
        "Medium": [
          { id: "sss-mus-mt-m1", text: "A whole note is equal to how many quarter notes?", options: ["4", "2", "3", "8"], correctAnswer: "A", explanation: "A whole note = 4 quarter notes in duration.", topic: "Music Theory", difficulty: "Medium", subject: "Music" }
        ],
        "Hard": [
          { id: "sss-mus-mt-h1", text: "The key signature with no sharps or flats is:", options: ["C major", "G major", "D major", "F major"], correctAnswer: "A", explanation: "C major has no sharps or flats in its key signature.", topic: "Music Theory", difficulty: "Hard", subject: "Music" }
        ]
      }
    },
    "Home Economics": {
      "Food and Nutrition": {
        "Easy": [
          { id: "sss-hec-fn-e1", text: "Proteins are also known as:", options: ["Body building foods", "Energy giving foods", "Protective foods", "Junk foods"], correctAnswer: "A", explanation: "Proteins build and repair body tissues.", topic: "Food and Nutrition", difficulty: "Easy", subject: "Home Economics" }
        ],
        "Medium": [
          { id: "sss-hec-fn-m1", text: "Which vitamin is produced when skin is exposed to sunlight?", options: ["Vitamin D", "Vitamin A", "Vitamin C", "Vitamin B"], correctAnswer: "A", explanation: "Vitamin D is synthesized when skin is exposed to UV light.", topic: "Food and Nutrition", difficulty: "Medium", subject: "Home Economics" }
        ],
        "Hard": [
          { id: "sss-hec-fn-h1", text: "Kwashiorkor is caused by deficiency of:", options: ["Protein", "Carbohydrates", "Vitamins", "Minerals"], correctAnswer: "A", explanation: "Kwashiorkor is a severe protein deficiency disease.", topic: "Food and Nutrition", difficulty: "Hard", subject: "Home Economics" }
        ]
      }
    },
    "Mathematics": {
      "Quadratic Equations": {
        "Easy": [
          { id: "sss-math-qe-e1", text: "Solve x² = 25", options: ["x = ±5", "x = 5", "x = -5", "x = 25"], correctAnswer: "A", explanation: "x² = 25 gives x = +5 or x = -5, written as x = ±5.", topic: "Quadratic Equations", difficulty: "Easy", subject: "Mathematics" },
          { id: "sss-math-qe-e2", text: "What is the standard form of a quadratic equation?", options: ["ax² + bx + c = 0", "ax + b = 0", "ax³ + bx² + cx + d = 0", "a/x + b = 0"], correctAnswer: "A", explanation: "The standard form is ax² + bx + c = 0 where a ≠ 0.", topic: "Quadratic Equations", difficulty: "Easy", subject: "Mathematics" }
        ],
        "Medium": [
          { id: "sss-math-qe-m1", text: "Solve x² - 5x + 6 = 0", options: ["x = 2 or x = 3", "x = -2 or x = -3", "x = 1 or x = 6", "x = -1 or x = -6"], correctAnswer: "A", explanation: "Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3.", topic: "Quadratic Equations", difficulty: "Medium", subject: "Mathematics" },
          { id: "sss-math-qe-m2", text: "Using the quadratic formula, solve x² + 4x + 3 = 0", options: ["x = -1 or x = -3", "x = 1 or x = 3", "x = -1 or x = 3", "x = 1 or x = -3"], correctAnswer: "A", explanation: "Using x = (-b ± √(b²-4ac))/2a: x = (-4 ± √4)/2 = (-4 ± 2)/2, giving x = -1 or -3.", topic: "Quadratic Equations", difficulty: "Medium", subject: "Mathematics" }
        ],
        "Hard": [
          { id: "sss-math-qe-h1", text: "Find the nature of roots for 2x² - 4x + 5 = 0", options: ["No real roots (complex)", "Two equal real roots", "Two distinct real roots", "One real root"], correctAnswer: "A", explanation: "Discriminant = b² - 4ac = 16 - 40 = -24 < 0, so no real roots.", topic: "Quadratic Equations", difficulty: "Hard", subject: "Mathematics" }
        ]
      },
      "Trigonometry": {
        "Easy": [
          { id: "sss-math-tr-e1", text: "What is sin 30°?", options: ["1/2", "√3/2", "1", "√2/2"], correctAnswer: "A", explanation: "sin 30° = 1/2 is a standard trigonometric value.", topic: "Trigonometry", difficulty: "Easy", subject: "Mathematics" },
          { id: "sss-math-tr-e2", text: "In a right triangle, what is the ratio sin θ?", options: ["Opposite/Hypotenuse", "Adjacent/Hypotenuse", "Opposite/Adjacent", "Hypotenuse/Opposite"], correctAnswer: "A", explanation: "SOH: Sin = Opposite over Hypotenuse.", topic: "Trigonometry", difficulty: "Easy", subject: "Mathematics" }
        ],
        "Medium": [
          { id: "sss-math-tr-m1", text: "What is cos 60°?", options: ["1/2", "√3/2", "1", "0"], correctAnswer: "A", explanation: "cos 60° = 1/2 is a standard value.", topic: "Trigonometry", difficulty: "Medium", subject: "Mathematics" },
          { id: "sss-math-tr-m2", text: "If tan θ = 1, what is θ (0° < θ < 90°)?", options: ["45°", "30°", "60°", "90°"], correctAnswer: "A", explanation: "tan 45° = 1, so θ = 45°.", topic: "Trigonometry", difficulty: "Medium", subject: "Mathematics" }
        ],
        "Hard": [
          { id: "sss-math-tr-h1", text: "Simplify: sin²θ + cos²θ", options: ["1", "0", "2", "sin θ cos θ"], correctAnswer: "A", explanation: "This is the Pythagorean identity: sin²θ + cos²θ = 1.", topic: "Trigonometry", difficulty: "Hard", subject: "Mathematics" }
        ]
      },
      "Logarithms": {
        "Easy": [
          { id: "sss-math-lo-e1", text: "What is log₁₀ 100?", options: ["2", "10", "100", "1"], correctAnswer: "A", explanation: "log₁₀ 100 = 2 because 10² = 100.", topic: "Logarithms", difficulty: "Easy", subject: "Mathematics" }
        ],
        "Medium": [
          { id: "sss-math-lo-m1", text: "Simplify log₂ 8", options: ["3", "2", "4", "8"], correctAnswer: "A", explanation: "log₂ 8 = 3 because 2³ = 8.", topic: "Logarithms", difficulty: "Medium", subject: "Mathematics" }
        ],
        "Hard": [
          { id: "sss-math-lo-h1", text: "If log x = 2, what is x?", options: ["100", "20", "10", "1000"], correctAnswer: "A", explanation: "log x = 2 means log₁₀ x = 2, so x = 10² = 100.", topic: "Logarithms", difficulty: "Hard", subject: "Mathematics" }
        ]
      }
    },
    "Physics": {
      "Motion": {
        "Easy": [
          { id: "sss-phy-mo-e1", text: "What is the SI unit of velocity?", options: ["m/s", "m/s²", "m", "s"], correctAnswer: "A", explanation: "Velocity is measured in meters per second (m/s).", topic: "Motion", difficulty: "Easy", subject: "Physics" },
          { id: "sss-phy-mo-e2", text: "What is acceleration?", options: ["Rate of change of velocity", "Rate of change of distance", "Speed in a direction", "Distance covered"], correctAnswer: "A", explanation: "Acceleration is the rate of change of velocity with time.", topic: "Motion", difficulty: "Easy", subject: "Physics" }
        ],
        "Medium": [
          { id: "sss-phy-mo-m1", text: "A car accelerates from 0 to 20 m/s in 5 seconds. What is its acceleration?", options: ["4 m/s²", "100 m/s²", "25 m/s²", "5 m/s²"], correctAnswer: "A", explanation: "a = (v-u)/t = (20-0)/5 = 4 m/s².", topic: "Motion", difficulty: "Medium", subject: "Physics" }
        ],
        "Hard": [
          { id: "sss-phy-mo-h1", text: "A ball is thrown upward with velocity 20 m/s. How high does it go? (g = 10 m/s²)", options: ["20 m", "40 m", "10 m", "200 m"], correctAnswer: "A", explanation: "Using v² = u² - 2gh at max height v=0: 0 = 400 - 20h, h = 20 m.", topic: "Motion", difficulty: "Hard", subject: "Physics" }
        ]
      },
      "Electricity": {
        "Easy": [
          { id: "sss-phy-el-e1", text: "What is the unit of electric current?", options: ["Ampere", "Volt", "Ohm", "Watt"], correctAnswer: "A", explanation: "Electric current is measured in Amperes (A).", topic: "Electricity", difficulty: "Easy", subject: "Physics" }
        ],
        "Medium": [
          { id: "sss-phy-el-m1", text: "According to Ohm's Law, V = ?", options: ["IR", "I/R", "R/I", "I+R"], correctAnswer: "A", explanation: "Ohm's Law: V = IR (Voltage = Current × Resistance).", topic: "Electricity", difficulty: "Medium", subject: "Physics" }
        ],
        "Hard": [
          { id: "sss-phy-el-h1", text: "Three 6Ω resistors are connected in parallel. What is the total resistance?", options: ["2Ω", "18Ω", "6Ω", "3Ω"], correctAnswer: "A", explanation: "1/R = 1/6 + 1/6 + 1/6 = 3/6 = 1/2, so R = 2Ω.", topic: "Electricity", difficulty: "Hard", subject: "Physics" }
        ]
      }
    },
    "Chemistry": {
      "Atomic Structure": {
        "Easy": [
          { id: "sss-che-as-e1", text: "What is the charge of a proton?", options: ["Positive", "Negative", "Neutral", "Variable"], correctAnswer: "A", explanation: "Protons have a positive charge (+1).", topic: "Atomic Structure", difficulty: "Easy", subject: "Chemistry" },
          { id: "sss-che-as-e2", text: "Where are electrons found in an atom?", options: ["In orbitals around the nucleus", "Inside the nucleus", "Between atoms", "In the protons"], correctAnswer: "A", explanation: "Electrons orbit the nucleus in energy levels or shells.", topic: "Atomic Structure", difficulty: "Easy", subject: "Chemistry" }
        ],
        "Medium": [
          { id: "sss-che-as-m1", text: "An element has atomic number 11. How many electrons does it have?", options: ["11", "23", "12", "22"], correctAnswer: "A", explanation: "Atomic number equals number of protons, which equals electrons in neutral atom.", topic: "Atomic Structure", difficulty: "Medium", subject: "Chemistry" }
        ],
        "Hard": [
          { id: "sss-che-as-h1", text: "What is the electron configuration of Chlorine (atomic number 17)?", options: ["2,8,7", "2,8,8", "2,7,8", "8,8,1"], correctAnswer: "A", explanation: "17 electrons: 2 in first shell, 8 in second, 7 in third = 2,8,7.", topic: "Atomic Structure", difficulty: "Hard", subject: "Chemistry" }
        ]
      },
      "Chemical Bonding": {
        "Easy": [
          { id: "sss-che-cb-e1", text: "What type of bond forms between metals and non-metals?", options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"], correctAnswer: "A", explanation: "Ionic bonds form when electrons transfer from metal to non-metal.", topic: "Chemical Bonding", difficulty: "Easy", subject: "Chemistry" }
        ],
        "Medium": [
          { id: "sss-che-cb-m1", text: "How many electrons are shared in a double bond?", options: ["4", "2", "1", "6"], correctAnswer: "A", explanation: "A double bond involves sharing of 4 electrons (2 pairs).", topic: "Chemical Bonding", difficulty: "Medium", subject: "Chemistry" }
        ],
        "Hard": [
          { id: "sss-che-cb-h1", text: "What is the hybridization of carbon in methane (CH₄)?", options: ["sp³", "sp²", "sp", "sp³d"], correctAnswer: "A", explanation: "Carbon in CH₄ has sp³ hybridization with tetrahedral geometry.", topic: "Chemical Bonding", difficulty: "Hard", subject: "Chemistry" }
        ]
      }
    },
    "Biology": {
      "Cell Biology": {
        "Easy": [
          { id: "sss-bio-cb-e1", text: "What is the powerhouse of the cell?", options: ["Mitochondria", "Nucleus", "Ribosome", "Golgi body"], correctAnswer: "A", explanation: "Mitochondria produce ATP through cellular respiration.", topic: "Cell Biology", difficulty: "Easy", subject: "Biology" },
          { id: "sss-bio-cb-e2", text: "Which organelle controls cell activities?", options: ["Nucleus", "Ribosome", "Cell membrane", "Cytoplasm"], correctAnswer: "A", explanation: "The nucleus contains DNA and controls cell functions.", topic: "Cell Biology", difficulty: "Easy", subject: "Biology" }
        ],
        "Medium": [
          { id: "sss-bio-cb-m1", text: "What is the function of ribosomes?", options: ["Protein synthesis", "Lipid synthesis", "ATP production", "Cell division"], correctAnswer: "A", explanation: "Ribosomes are sites of protein synthesis.", topic: "Cell Biology", difficulty: "Medium", subject: "Biology" }
        ],
        "Hard": [
          { id: "sss-bio-cb-h1", text: "Which stage of mitosis involves chromosome separation?", options: ["Anaphase", "Prophase", "Metaphase", "Telophase"], correctAnswer: "A", explanation: "During anaphase, sister chromatids separate and move to opposite poles.", topic: "Cell Biology", difficulty: "Hard", subject: "Biology" }
        ]
      },
      "Genetics": {
        "Easy": [
          { id: "sss-bio-ge-e1", text: "What does DNA stand for?", options: ["Deoxyribonucleic acid", "Diribonucleic acid", "Deoxyribose acid", "Dinucleic acid"], correctAnswer: "A", explanation: "DNA = Deoxyribonucleic Acid.", topic: "Genetics", difficulty: "Easy", subject: "Biology" }
        ],
        "Medium": [
          { id: "sss-bio-ge-m1", text: "In a Punnett square for Aa x Aa, what fraction will be homozygous?", options: ["1/2", "1/4", "3/4", "1"], correctAnswer: "A", explanation: "AA (1/4) + aa (1/4) = 1/2 homozygous.", topic: "Genetics", difficulty: "Medium", subject: "Biology" }
        ],
        "Hard": [
          { id: "sss-bio-ge-h1", text: "If a trait is X-linked recessive and the mother is a carrier, what is the probability of an affected son?", options: ["50%", "25%", "100%", "0%"], correctAnswer: "A", explanation: "XᵃX × XY gives 50% sons with Xᵃ (affected).", topic: "Genetics", difficulty: "Hard", subject: "Biology" }
        ]
      }
    }
  },
  "JAMB": {
    "Economics": {
      "Microeconomics": {
        "Easy": [
          { id: "jamb-eco-mi-e1", text: "The law of diminishing returns applies to:", options: ["Production", "Consumption only", "Distribution only", "Exchange only"], correctAnswer: "A", explanation: "The law of diminishing returns is a production concept.", topic: "Microeconomics", difficulty: "Easy", subject: "Economics" }
        ],
        "Medium": [
          { id: "jamb-eco-mi-m1", text: "Price elasticity of demand measures:", options: ["Responsiveness of quantity demanded to price change", "Total revenue", "Total cost", "Marginal utility"], correctAnswer: "A", explanation: "Elasticity measures how much quantity demanded changes with price.", topic: "Microeconomics", difficulty: "Medium", subject: "Economics" }
        ],
        "Hard": [
          { id: "jamb-eco-mi-h1", text: "In perfect competition, firms are:", options: ["Price takers", "Price makers", "Monopolists", "Oligopolists"], correctAnswer: "A", explanation: "In perfect competition, firms accept the market price.", topic: "Microeconomics", difficulty: "Hard", subject: "Economics" }
        ]
      },
      "Macroeconomics": {
        "Easy": [
          { id: "jamb-eco-ma-e1", text: "Inflation is:", options: ["General rise in price levels", "Fall in prices", "Stable prices", "Rise in production"], correctAnswer: "A", explanation: "Inflation is a sustained increase in the general price level.", topic: "Macroeconomics", difficulty: "Easy", subject: "Economics" }
        ],
        "Medium": [
          { id: "jamb-eco-ma-m1", text: "Fiscal policy involves:", options: ["Government taxation and spending", "Central bank activities", "Private sector spending", "Foreign exchange"], correctAnswer: "A", explanation: "Fiscal policy uses government spending and taxation to influence economy.", topic: "Macroeconomics", difficulty: "Medium", subject: "Economics" }
        ],
        "Hard": [
          { id: "jamb-eco-ma-h1", text: "The Phillips curve shows the relationship between:", options: ["Unemployment and inflation", "Supply and demand", "Income and consumption", "Savings and investment"], correctAnswer: "A", explanation: "Phillips curve shows inverse relationship between unemployment and inflation.", topic: "Macroeconomics", difficulty: "Hard", subject: "Economics" }
        ]
      }
    },
    "Government": {
      "Nigerian Government": {
        "Easy": [
          { id: "jamb-gov-ng-e1", text: "Nigeria gained independence in:", options: ["1960", "1963", "1959", "1970"], correctAnswer: "A", explanation: "Nigeria became independent on October 1, 1960.", topic: "Nigerian Government", difficulty: "Easy", subject: "Government" }
        ],
        "Medium": [
          { id: "jamb-gov-ng-m1", text: "The first military coup in Nigeria occurred in:", options: ["1966", "1960", "1970", "1975"], correctAnswer: "A", explanation: "The first military coup was on January 15, 1966.", topic: "Nigerian Government", difficulty: "Medium", subject: "Government" }
        ],
        "Hard": [
          { id: "jamb-gov-ng-h1", text: "The first Executive President of Nigeria was:", options: ["Shehu Shagari", "Nnamdi Azikiwe", "Tafawa Balewa", "Yakubu Gowon"], correctAnswer: "A", explanation: "Shehu Shagari was elected Executive President in 1979.", topic: "Nigerian Government", difficulty: "Hard", subject: "Government" }
        ]
      },
      "Political Theories": {
        "Easy": [
          { id: "jamb-gov-pt-e1", text: "Democracy means:", options: ["Government by the people", "Government by one person", "Government by the rich", "Government by the military"], correctAnswer: "A", explanation: "Democracy is government of, by, and for the people.", topic: "Political Theories", difficulty: "Easy", subject: "Government" }
        ],
        "Medium": [
          { id: "jamb-gov-pt-m1", text: "The social contract theory was propounded by:", options: ["Thomas Hobbes, John Locke, Rousseau", "Karl Marx", "Adam Smith", "Max Weber"], correctAnswer: "A", explanation: "Hobbes, Locke, and Rousseau developed social contract theory.", topic: "Political Theories", difficulty: "Medium", subject: "Government" }
        ],
        "Hard": [
          { id: "jamb-gov-pt-h1", text: "Communism advocates:", options: ["Collective ownership of means of production", "Private ownership", "Mixed economy", "Free market"], correctAnswer: "A", explanation: "Communism supports communal ownership of production means.", topic: "Political Theories", difficulty: "Hard", subject: "Government" }
        ]
      }
    },
    "Literature": {
      "African Literature": {
        "Easy": [
          { id: "jamb-lit-al-e1", text: "Who wrote 'Things Fall Apart'?", options: ["Chinua Achebe", "Wole Soyinka", "Ngugi wa Thiong'o", "Chimamanda Adichie"], correctAnswer: "A", explanation: "Chinua Achebe wrote Things Fall Apart in 1958.", topic: "African Literature", difficulty: "Easy", subject: "Literature" }
        ],
        "Medium": [
          { id: "jamb-lit-al-m1", text: "The protagonist in 'Things Fall Apart' is:", options: ["Okonkwo", "Obierika", "Nwoye", "Ikemefuna"], correctAnswer: "A", explanation: "Okonkwo is the main character of Things Fall Apart.", topic: "African Literature", difficulty: "Medium", subject: "Literature" }
        ],
        "Hard": [
          { id: "jamb-lit-al-h1", text: "Wole Soyinka won the Nobel Prize in:", options: ["1986", "1990", "1980", "2000"], correctAnswer: "A", explanation: "Wole Soyinka won the Nobel Prize for Literature in 1986.", topic: "African Literature", difficulty: "Hard", subject: "Literature" }
        ]
      },
      "Literary Devices": {
        "Easy": [
          { id: "jamb-lit-ld-e1", text: "A comparison using 'like' or 'as' is:", options: ["Simile", "Metaphor", "Personification", "Hyperbole"], correctAnswer: "A", explanation: "Simile compares two things using 'like' or 'as'.", topic: "Literary Devices", difficulty: "Easy", subject: "Literature" }
        ],
        "Medium": [
          { id: "jamb-lit-ld-m1", text: "Giving human qualities to non-human things is:", options: ["Personification", "Simile", "Metaphor", "Irony"], correctAnswer: "A", explanation: "Personification attributes human characteristics to non-human things.", topic: "Literary Devices", difficulty: "Medium", subject: "Literature" }
        ],
        "Hard": [
          { id: "jamb-lit-ld-h1", text: "When the opposite of what is expected happens, it is:", options: ["Irony", "Simile", "Metaphor", "Allusion"], correctAnswer: "A", explanation: "Irony involves a contrast between expectation and reality.", topic: "Literary Devices", difficulty: "Hard", subject: "Literature" }
        ]
      }
    },
    "Geography": {
      "Map Reading": {
        "Easy": [
          { id: "jamb-geo-mr-e1", text: "The scale of a map shows:", options: ["Ratio of map distance to ground distance", "Direction", "Height", "Weather"], correctAnswer: "A", explanation: "Scale shows how map distance relates to actual ground distance.", topic: "Map Reading", difficulty: "Easy", subject: "Geography" }
        ],
        "Medium": [
          { id: "jamb-geo-mr-m1", text: "Contour lines on a map represent:", options: ["Points of equal elevation", "Rivers", "Roads", "Boundaries"], correctAnswer: "A", explanation: "Contour lines connect points of the same height above sea level.", topic: "Map Reading", difficulty: "Medium", subject: "Geography" }
        ],
        "Hard": [
          { id: "jamb-geo-mr-h1", text: "When contour lines are close together, the slope is:", options: ["Steep", "Gentle", "Flat", "Valley"], correctAnswer: "A", explanation: "Close contour lines indicate rapid change in elevation - steep slope.", topic: "Map Reading", difficulty: "Hard", subject: "Geography" }
        ]
      },
      "Population": {
        "Easy": [
          { id: "jamb-geo-po-e1", text: "The most populous country in Africa is:", options: ["Nigeria", "Ethiopia", "Egypt", "South Africa"], correctAnswer: "A", explanation: "Nigeria is Africa's most populous country with over 200 million people.", topic: "Population", difficulty: "Easy", subject: "Geography" }
        ],
        "Medium": [
          { id: "jamb-geo-po-m1", text: "Population density is:", options: ["Number of people per unit area", "Total population", "Birth rate", "Death rate"], correctAnswer: "A", explanation: "Population density = Total population ÷ Total land area.", topic: "Population", difficulty: "Medium", subject: "Geography" }
        ],
        "Hard": [
          { id: "jamb-geo-po-h1", text: "The demographic transition model has how many stages?", options: ["4 or 5", "2", "3", "6"], correctAnswer: "A", explanation: "The demographic transition model typically has 4-5 stages.", topic: "Population", difficulty: "Hard", subject: "Geography" }
        ]
      }
    },
    "Agricultural Science": {
      "Soil Science": {
        "Easy": [
          { id: "jamb-agr-ss-e1", text: "The top layer of soil rich in organic matter is:", options: ["Topsoil", "Subsoil", "Bedrock", "Parent rock"], correctAnswer: "A", explanation: "Topsoil (A horizon) contains most organic matter and nutrients.", topic: "Soil Science", difficulty: "Easy", subject: "Agricultural Science" }
        ],
        "Medium": [
          { id: "jamb-agr-ss-m1", text: "Soil pH measures:", options: ["Acidity or alkalinity", "Texture", "Color", "Temperature"], correctAnswer: "A", explanation: "pH indicates whether soil is acidic, neutral, or alkaline.", topic: "Soil Science", difficulty: "Medium", subject: "Agricultural Science" }
        ],
        "Hard": [
          { id: "jamb-agr-ss-h1", text: "Clay soil has what water-holding capacity?", options: ["High", "Low", "None", "Variable"], correctAnswer: "A", explanation: "Clay particles are small with large surface area, holding more water.", topic: "Soil Science", difficulty: "Hard", subject: "Agricultural Science" }
        ]
      },
      "Farm Management": {
        "Easy": [
          { id: "jamb-agr-fm-e1", text: "A farm record that shows money received and spent is:", options: ["Cash book", "Diary", "Inventory", "Payroll"], correctAnswer: "A", explanation: "A cash book records all cash receipts and payments.", topic: "Farm Management", difficulty: "Easy", subject: "Agricultural Science" }
        ],
        "Medium": [
          { id: "jamb-agr-fm-m1", text: "Fixed costs in farming are:", options: ["Costs that don't change with output", "Variable costs", "Total costs", "Marginal costs"], correctAnswer: "A", explanation: "Fixed costs (e.g., rent, equipment) remain constant regardless of production.", topic: "Farm Management", difficulty: "Medium", subject: "Agricultural Science" }
        ],
        "Hard": [
          { id: "jamb-agr-fm-h1", text: "Agricultural extension services aim to:", options: ["Educate farmers on modern practices", "Sell farm products", "Buy farm inputs", "Tax farmers"], correctAnswer: "A", explanation: "Extension services transfer knowledge from research to farmers.", topic: "Farm Management", difficulty: "Hard", subject: "Agricultural Science" }
        ]
      }
    },
    "Commerce": {
      "Business Organization": {
        "Easy": [
          { id: "jamb-com-bo-e1", text: "A sole proprietorship is owned by:", options: ["One person", "Two people", "Government", "Shareholders"], correctAnswer: "A", explanation: "A sole proprietorship has a single owner.", topic: "Business Organization", difficulty: "Easy", subject: "Commerce" }
        ],
        "Medium": [
          { id: "jamb-com-bo-m1", text: "Limited liability means:", options: ["Owners' personal assets are protected", "Unlimited personal risk", "No risk", "Government ownership"], correctAnswer: "A", explanation: "Limited liability protects owners' personal assets from business debts.", topic: "Business Organization", difficulty: "Medium", subject: "Commerce" }
        ],
        "Hard": [
          { id: "jamb-com-bo-h1", text: "A private limited company has a maximum of how many shareholders?", options: ["50", "100", "2", "Unlimited"], correctAnswer: "A", explanation: "Private limited companies typically have 2-50 shareholders.", topic: "Business Organization", difficulty: "Hard", subject: "Commerce" }
        ]
      },
      "Insurance": {
        "Easy": [
          { id: "jamb-com-in-e1", text: "The person who takes out an insurance policy is called:", options: ["Policyholder/Insured", "Insurer", "Broker", "Agent"], correctAnswer: "A", explanation: "The insured (policyholder) is the person covered by insurance.", topic: "Insurance", difficulty: "Easy", subject: "Commerce" }
        ],
        "Medium": [
          { id: "jamb-com-in-m1", text: "The principle that prevents profit from insurance is:", options: ["Indemnity", "Subrogation", "Contribution", "Proximate cause"], correctAnswer: "A", explanation: "Indemnity ensures you're restored to pre-loss position, not better.", topic: "Insurance", difficulty: "Medium", subject: "Commerce" }
        ],
        "Hard": [
          { id: "jamb-com-in-h1", text: "Reinsurance is when:", options: ["An insurer shares risk with another insurer", "Policy is renewed", "Claim is paid", "Premium is returned"], correctAnswer: "A", explanation: "Reinsurance allows insurers to transfer some risk to other companies.", topic: "Insurance", difficulty: "Hard", subject: "Commerce" }
        ]
      }
    },
    "Accounting": {
      "Financial Statements": {
        "Easy": [
          { id: "jamb-acc-fs-e1", text: "A balance sheet shows:", options: ["Assets, liabilities, and equity", "Revenue and expenses", "Cash flows", "Budgets"], correctAnswer: "A", explanation: "The balance sheet shows financial position at a point in time.", topic: "Financial Statements", difficulty: "Easy", subject: "Accounting" }
        ],
        "Medium": [
          { id: "jamb-acc-fs-m1", text: "Net profit is calculated as:", options: ["Gross profit minus expenses", "Sales minus purchases", "Assets minus liabilities", "Revenue only"], correctAnswer: "A", explanation: "Net profit = Gross profit - Operating expenses.", topic: "Financial Statements", difficulty: "Medium", subject: "Accounting" }
        ],
        "Hard": [
          { id: "jamb-acc-fs-h1", text: "Working capital is:", options: ["Current assets minus current liabilities", "Fixed assets", "Long-term liabilities", "Retained earnings"], correctAnswer: "A", explanation: "Working capital = Current Assets - Current Liabilities.", topic: "Financial Statements", difficulty: "Hard", subject: "Accounting" }
        ]
      }
    },
    "Computer Science": {
      "Programming": {
        "Easy": [
          { id: "jamb-csc-pr-e1", text: "A step-by-step procedure to solve a problem is:", options: ["Algorithm", "Program", "Software", "Hardware"], correctAnswer: "A", explanation: "An algorithm is a logical sequence of steps to solve a problem.", topic: "Programming", difficulty: "Easy", subject: "Computer Science" }
        ],
        "Medium": [
          { id: "jamb-csc-pr-m1", text: "A flowchart uses:", options: ["Symbols to represent steps", "Only text", "Numbers only", "Colors only"], correctAnswer: "A", explanation: "Flowcharts use standardized symbols to show program flow.", topic: "Programming", difficulty: "Medium", subject: "Computer Science" }
        ],
        "Hard": [
          { id: "jamb-csc-pr-h1", text: "An infinite loop occurs when:", options: ["Loop never terminates", "Loop runs once", "No loop exists", "Program ends"], correctAnswer: "A", explanation: "An infinite loop runs forever because its condition never becomes false.", topic: "Programming", difficulty: "Hard", subject: "Computer Science" }
        ]
      },
      "Networking": {
        "Easy": [
          { id: "jamb-csc-ne-e1", text: "The internet is a:", options: ["Global network of networks", "Single computer", "Type of software", "Programming language"], correctAnswer: "A", explanation: "The internet connects millions of networks worldwide.", topic: "Networking", difficulty: "Easy", subject: "Computer Science" }
        ],
        "Medium": [
          { id: "jamb-csc-ne-m1", text: "IP stands for:", options: ["Internet Protocol", "Internal Program", "Input Process", "Integrated Platform"], correctAnswer: "A", explanation: "IP (Internet Protocol) is the communication protocol for the internet.", topic: "Networking", difficulty: "Medium", subject: "Computer Science" }
        ],
        "Hard": [
          { id: "jamb-csc-ne-h1", text: "HTTP port number is:", options: ["80", "443", "21", "25"], correctAnswer: "A", explanation: "HTTP typically uses port 80; HTTPS uses port 443.", topic: "Networking", difficulty: "Hard", subject: "Computer Science" }
        ]
      }
    },
    "Mathematics": {
      "Algebra": {
        "Easy": [
          { id: "jamb-math-al-e1", text: "Simplify: 3(2x - 5) + 4(x + 2)", options: ["10x - 7", "10x - 3", "6x - 7", "10x + 7"], correctAnswer: "A", explanation: "3(2x-5) + 4(x+2) = 6x - 15 + 4x + 8 = 10x - 7.", topic: "Algebra", difficulty: "Easy", subject: "Mathematics" },
          { id: "jamb-math-al-e2", text: "If 2ˣ = 8, find x", options: ["3", "4", "2", "8"], correctAnswer: "A", explanation: "2ˣ = 8 = 2³, so x = 3.", topic: "Algebra", difficulty: "Easy", subject: "Mathematics" },
          { id: "jamb-math-al-e3", text: "Solve: 5x - 3 = 2x + 9", options: ["4", "3", "2", "6"], correctAnswer: "A", explanation: "5x - 2x = 9 + 3, 3x = 12, x = 4.", topic: "Algebra", difficulty: "Easy", subject: "Mathematics" }
        ],
        "Medium": [
          { id: "jamb-math-al-m1", text: "Solve the simultaneous equations: x + y = 5, x - y = 1", options: ["x=3, y=2", "x=2, y=3", "x=4, y=1", "x=1, y=4"], correctAnswer: "A", explanation: "Adding: 2x = 6, x = 3. Substituting: y = 2.", topic: "Algebra", difficulty: "Medium", subject: "Mathematics" },
          { id: "jamb-math-al-m2", text: "Find the value of k if x² + kx + 9 is a perfect square", options: ["6", "9", "3", "12"], correctAnswer: "A", explanation: "For perfect square: (x+3)² = x² + 6x + 9, so k = 6.", topic: "Algebra", difficulty: "Medium", subject: "Mathematics" },
          { id: "jamb-math-al-m3", text: "Simplify: (x² - 9)/(x - 3)", options: ["x + 3", "x - 3", "x² + 3", "x - 9"], correctAnswer: "A", explanation: "(x² - 9)/(x-3) = (x+3)(x-3)/(x-3) = x + 3.", topic: "Algebra", difficulty: "Medium", subject: "Mathematics" }
        ],
        "Hard": [
          { id: "jamb-math-al-h1", text: "If α and β are roots of x² - 5x + 6 = 0, find α² + β²", options: ["13", "11", "25", "36"], correctAnswer: "A", explanation: "α + β = 5, αβ = 6. α² + β² = (α+β)² - 2αβ = 25 - 12 = 13.", topic: "Algebra", difficulty: "Hard", subject: "Mathematics" },
          { id: "jamb-math-al-h2", text: "Solve: |2x - 3| = 7", options: ["x = 5 or x = -2", "x = 5 or x = 2", "x = -5 or x = -2", "x = 5"], correctAnswer: "A", explanation: "2x - 3 = 7 gives x = 5. 2x - 3 = -7 gives x = -2.", topic: "Algebra", difficulty: "Hard", subject: "Mathematics" }
        ]
      },
      "Sequences": {
        "Easy": [
          { id: "jamb-math-se-e1", text: "Find the 10th term of the A.P.: 2, 5, 8, 11...", options: ["29", "32", "26", "35"], correctAnswer: "A", explanation: "a = 2, d = 3. T₁₀ = a + 9d = 2 + 27 = 29.", topic: "Sequences", difficulty: "Easy", subject: "Mathematics" }
        ],
        "Medium": [
          { id: "jamb-math-se-m1", text: "The sum of the first 20 terms of the A.P. 4, 7, 10... is", options: ["650", "630", "610", "670"], correctAnswer: "A", explanation: "a=4, d=3, n=20. S = n/2[2a + (n-1)d] = 10[8 + 57] = 650.", topic: "Sequences", difficulty: "Medium", subject: "Mathematics" }
        ],
        "Hard": [
          { id: "jamb-math-se-h1", text: "Find the sum to infinity of the G.P.: 8, 4, 2, 1...", options: ["16", "15", "14", "12"], correctAnswer: "A", explanation: "a = 8, r = 1/2. S∞ = a/(1-r) = 8/(1/2) = 16.", topic: "Sequences", difficulty: "Hard", subject: "Mathematics" }
        ]
      },
      "Calculus": {
        "Easy": [
          { id: "jamb-math-ca-e1", text: "Find dy/dx if y = 5x³", options: ["15x²", "5x²", "15x³", "3x²"], correctAnswer: "A", explanation: "dy/dx = 3 × 5x² = 15x².", topic: "Calculus", difficulty: "Easy", subject: "Mathematics" }
        ],
        "Medium": [
          { id: "jamb-math-ca-m1", text: "Integrate: ∫2x dx", options: ["x² + c", "2x² + c", "x + c", "2x + c"], correctAnswer: "A", explanation: "∫2x dx = 2(x²/2) + c = x² + c.", topic: "Calculus", difficulty: "Medium", subject: "Mathematics" }
        ],
        "Hard": [
          { id: "jamb-math-ca-h1", text: "Find the maximum value of f(x) = 3x - x²", options: ["9/4", "3/2", "9/2", "3"], correctAnswer: "A", explanation: "f'(x) = 3 - 2x = 0, x = 3/2. f(3/2) = 9/2 - 9/4 = 9/4.", topic: "Calculus", difficulty: "Hard", subject: "Mathematics" }
        ]
      }
    },
    "English": {
      "Comprehension": {
        "Easy": [
          { id: "jamb-eng-co-e1", text: "The word 'benevolent' is closest in meaning to:", options: ["Kind and generous", "Strict and harsh", "Wealthy and powerful", "Quiet and reserved"], correctAnswer: "A", explanation: "'Benevolent' means well-meaning, kind, and generous.", topic: "Comprehension", difficulty: "Easy", subject: "English" }
        ],
        "Medium": [
          { id: "jamb-eng-co-m1", text: "Choose the word opposite in meaning to 'ephemeral':", options: ["Permanent", "Temporary", "Brief", "Short-lived"], correctAnswer: "A", explanation: "'Ephemeral' means short-lived, so 'permanent' is opposite.", topic: "Comprehension", difficulty: "Medium", subject: "English" }
        ],
        "Hard": [
          { id: "jamb-eng-co-h1", text: "The expression 'to bite the dust' means to:", options: ["Fail or die", "Eat hurriedly", "Clean the floor", "Travel far"], correctAnswer: "A", explanation: "'Bite the dust' is an idiom meaning to fail, fall, or die.", topic: "Comprehension", difficulty: "Hard", subject: "English" }
        ]
      },
      "Oral English": {
        "Easy": [
          { id: "jamb-eng-oe-e1", text: "Which word has a different stress pattern? BEauty, HOnest, comPLETE, CLEver", options: ["complete", "beauty", "honest", "clever"], correctAnswer: "A", explanation: "'Complete' is stressed on the second syllable; others on the first.", topic: "Oral English", difficulty: "Easy", subject: "English" }
        ],
        "Medium": [
          { id: "jamb-eng-oe-m1", text: "Identify the word with /iː/ sound:", options: ["seat", "sit", "set", "sat"], correctAnswer: "A", explanation: "'Seat' has the long /iː/ vowel sound.", topic: "Oral English", difficulty: "Medium", subject: "English" }
        ],
        "Hard": [
          { id: "jamb-eng-oe-h1", text: "Which word contains a diphthong?", options: ["boy", "bed", "bid", "bud"], correctAnswer: "A", explanation: "'Boy' contains the diphthong /ɔɪ/.", topic: "Oral English", difficulty: "Hard", subject: "English" }
        ]
      }
    },
    "Physics": {
      "Mechanics": {
        "Easy": [
          { id: "jamb-phy-me-e1", text: "The SI unit of force is:", options: ["Newton", "Joule", "Watt", "Pascal"], correctAnswer: "A", explanation: "Force is measured in Newtons (N).", topic: "Mechanics", difficulty: "Easy", subject: "Physics" },
          { id: "jamb-phy-me-e2", text: "Which quantity is a vector?", options: ["Velocity", "Speed", "Mass", "Temperature"], correctAnswer: "A", explanation: "Velocity has both magnitude and direction; it's a vector.", topic: "Mechanics", difficulty: "Easy", subject: "Physics" }
        ],
        "Medium": [
          { id: "jamb-phy-me-m1", text: "A body of mass 5kg is accelerated at 2m/s². The force applied is:", options: ["10N", "2.5N", "7N", "3N"], correctAnswer: "A", explanation: "F = ma = 5 × 2 = 10N.", topic: "Mechanics", difficulty: "Medium", subject: "Physics" },
          { id: "jamb-phy-me-m2", text: "The kinetic energy of a 2kg object moving at 3m/s is:", options: ["9J", "6J", "18J", "3J"], correctAnswer: "A", explanation: "KE = ½mv² = ½ × 2 × 9 = 9J.", topic: "Mechanics", difficulty: "Medium", subject: "Physics" }
        ],
        "Hard": [
          { id: "jamb-phy-me-h1", text: "A ball is projected at 30° with velocity 20m/s. Its range is (g=10m/s²):", options: ["34.6m", "40m", "20m", "17.3m"], correctAnswer: "A", explanation: "R = u²sin2θ/g = 400×sin60°/10 = 400×0.866/10 = 34.6m.", topic: "Mechanics", difficulty: "Hard", subject: "Physics" }
        ]
      },
      "Waves": {
        "Easy": [
          { id: "jamb-phy-wa-e1", text: "Sound waves are:", options: ["Longitudinal", "Transverse", "Electromagnetic", "None of the above"], correctAnswer: "A", explanation: "Sound waves are longitudinal mechanical waves.", topic: "Waves", difficulty: "Easy", subject: "Physics" }
        ],
        "Medium": [
          { id: "jamb-phy-wa-m1", text: "The frequency of a wave with period 0.02s is:", options: ["50Hz", "0.02Hz", "20Hz", "500Hz"], correctAnswer: "A", explanation: "f = 1/T = 1/0.02 = 50Hz.", topic: "Waves", difficulty: "Medium", subject: "Physics" }
        ],
        "Hard": [
          { id: "jamb-phy-wa-h1", text: "The speed of sound in air is 340m/s. The wavelength of a 680Hz note is:", options: ["0.5m", "2m", "1m", "0.25m"], correctAnswer: "A", explanation: "λ = v/f = 340/680 = 0.5m.", topic: "Waves", difficulty: "Hard", subject: "Physics" }
        ]
      }
    },
    "Chemistry": {
      "Organic Chemistry": {
        "Easy": [
          { id: "jamb-che-oc-e1", text: "The functional group of alcohols is:", options: ["-OH", "-COOH", "-CHO", "-CO-"], correctAnswer: "A", explanation: "Alcohols contain the hydroxyl (-OH) functional group.", topic: "Organic Chemistry", difficulty: "Easy", subject: "Chemistry" }
        ],
        "Medium": [
          { id: "jamb-che-oc-m1", text: "The IUPAC name for CH₃CH₂OH is:", options: ["Ethanol", "Methanol", "Propanol", "Butanol"], correctAnswer: "A", explanation: "CH₃CH₂OH is a 2-carbon alcohol: ethanol.", topic: "Organic Chemistry", difficulty: "Medium", subject: "Chemistry" }
        ],
        "Hard": [
          { id: "jamb-che-oc-h1", text: "The product of complete combustion of ethane is:", options: ["CO₂ and H₂O", "CO and H₂O", "C and H₂O", "CO₂ and H₂"], correctAnswer: "A", explanation: "Complete combustion: C₂H₆ + 7/2O₂ → 2CO₂ + 3H₂O.", topic: "Organic Chemistry", difficulty: "Hard", subject: "Chemistry" }
        ]
      },
      "Electrochemistry": {
        "Easy": [
          { id: "jamb-che-ec-e1", text: "In electrolysis, reduction occurs at the:", options: ["Cathode", "Anode", "Electrolyte", "Salt bridge"], correctAnswer: "A", explanation: "Reduction (gain of electrons) occurs at the cathode.", topic: "Electrochemistry", difficulty: "Easy", subject: "Chemistry" }
        ],
        "Medium": [
          { id: "jamb-che-ec-m1", text: "During electrolysis of brine, chlorine is produced at the:", options: ["Anode", "Cathode", "Both electrodes", "Neither electrode"], correctAnswer: "A", explanation: "Chloride ions are oxidized to chlorine gas at the anode.", topic: "Electrochemistry", difficulty: "Medium", subject: "Chemistry" }
        ],
        "Hard": [
          { id: "jamb-che-ec-h1", text: "The charge required to deposit 1 mole of silver (Ag⁺) is:", options: ["96500C", "193000C", "48250C", "289500C"], correctAnswer: "A", explanation: "1 mole of Ag⁺ requires 1 Faraday = 96500C.", topic: "Electrochemistry", difficulty: "Hard", subject: "Chemistry" }
        ]
      }
    },
    "Biology": {
      "Ecology": {
        "Easy": [
          { id: "jamb-bio-ec-e1", text: "A group of organisms of the same species living together is called:", options: ["Population", "Community", "Ecosystem", "Biosphere"], correctAnswer: "A", explanation: "A population is a group of organisms of the same species.", topic: "Ecology", difficulty: "Easy", subject: "Biology" }
        ],
        "Medium": [
          { id: "jamb-bio-ec-m1", text: "The trophic level that contains the most energy is:", options: ["Producers", "Primary consumers", "Secondary consumers", "Decomposers"], correctAnswer: "A", explanation: "Producers capture energy from the sun; energy decreases at each level.", topic: "Ecology", difficulty: "Medium", subject: "Biology" }
        ],
        "Hard": [
          { id: "jamb-bio-ec-h1", text: "Which is NOT a biotic factor?", options: ["Temperature", "Predators", "Parasites", "Competitors"], correctAnswer: "A", explanation: "Temperature is an abiotic (non-living) factor.", topic: "Ecology", difficulty: "Hard", subject: "Biology" }
        ]
      },
      "Reproduction": {
        "Easy": [
          { id: "jamb-bio-re-e1", text: "The male reproductive cell is called:", options: ["Sperm", "Ovum", "Zygote", "Embryo"], correctAnswer: "A", explanation: "Sperm is the male gamete (reproductive cell).", topic: "Reproduction", difficulty: "Easy", subject: "Biology" }
        ],
        "Medium": [
          { id: "jamb-bio-re-m1", text: "Fertilization in humans occurs in the:", options: ["Fallopian tube", "Uterus", "Ovary", "Vagina"], correctAnswer: "A", explanation: "Fertilization typically occurs in the fallopian tube.", topic: "Reproduction", difficulty: "Medium", subject: "Biology" }
        ],
        "Hard": [
          { id: "jamb-bio-re-h1", text: "The hormone that triggers ovulation is:", options: ["LH", "FSH", "Estrogen", "Progesterone"], correctAnswer: "A", explanation: "Luteinizing hormone (LH) surge triggers ovulation.", topic: "Reproduction", difficulty: "Hard", subject: "Biology" }
        ]
      }
    }
  },
  "University": {
    "Mathematics": {
      "Linear Algebra": {
        "Easy": [
          { id: "uni-math-la-e1", text: "The determinant of a 2x2 matrix [[a,b],[c,d]] is:", options: ["ad - bc", "ad + bc", "ac - bd", "ac + bd"], correctAnswer: "A", explanation: "det = ad - bc for a 2×2 matrix.", topic: "Linear Algebra", difficulty: "Easy", subject: "Mathematics" }
        ],
        "Medium": [
          { id: "uni-math-la-m1", text: "The rank of an identity matrix of order 3 is:", options: ["3", "1", "0", "9"], correctAnswer: "A", explanation: "An identity matrix has full rank equal to its order.", topic: "Linear Algebra", difficulty: "Medium", subject: "Mathematics" }
        ],
        "Hard": [
          { id: "uni-math-la-h1", text: "If A is a 3×3 matrix with det(A) = 5, then det(2A) = ?", options: ["40", "10", "20", "80"], correctAnswer: "A", explanation: "det(kA) = k³det(A) for 3×3 matrix. det(2A) = 8×5 = 40.", topic: "Linear Algebra", difficulty: "Hard", subject: "Mathematics" }
        ]
      }
    },
    "Computer Science": {
      "Data Structures": {
        "Easy": [
          { id: "uni-cs-ds-e1", text: "A stack follows which principle?", options: ["LIFO", "FIFO", "LILO", "Random"], correctAnswer: "A", explanation: "Stack follows Last In First Out (LIFO) principle.", topic: "Data Structures", difficulty: "Easy", subject: "Computer Science" }
        ],
        "Medium": [
          { id: "uni-cs-ds-m1", text: "The time complexity of binary search is:", options: ["O(log n)", "O(n)", "O(n²)", "O(1)"], correctAnswer: "A", explanation: "Binary search divides the search space in half each time: O(log n).", topic: "Data Structures", difficulty: "Medium", subject: "Computer Science" }
        ],
        "Hard": [
          { id: "uni-cs-ds-h1", text: "The worst-case time complexity of quicksort is:", options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], correctAnswer: "A", explanation: "Quicksort's worst case (already sorted) is O(n²).", topic: "Data Structures", difficulty: "Hard", subject: "Computer Science" }
        ]
      }
    }
  }
};

export const getSubjects = (level: string): string[] => {
  return Object.keys(questionBank[level] || {});
};

export const getTopics = (level: string, subject: string): string[] => {
  return Object.keys(questionBank[level]?.[subject] || {});
};

export const getQuestions = (
  level: string,
  subject: string,
  topic?: string,
  difficulty?: string,
  count?: number
): Question[] => {
  const questions: Question[] = [];
  const subjectData = questionBank[level]?.[subject];
  
  if (!subjectData) return [];

  const topics = topic ? [topic] : Object.keys(subjectData);
  
  for (const t of topics) {
    const topicData = subjectData[t];
    if (!topicData) continue;
    
    const difficulties = difficulty ? [difficulty] : ['Easy', 'Medium', 'Hard'];
    
    for (const d of difficulties) {
      const diffQuestions = topicData[d] || [];
      questions.push(...diffQuestions);
    }
  }

  // Shuffle questions
  const shuffled = questions.sort(() => Math.random() - 0.5);
  
  return count ? shuffled.slice(0, count) : shuffled;
};

export const getAllQuestionsForMockExam = (
  level: string,
  subjects: string[],
  count: number
): Question[] => {
  const allQuestions: Question[] = [];
  
  for (const subject of subjects) {
    const questions = getQuestions(level, subject);
    allQuestions.push(...questions);
  }
  
  // Shuffle and return requested count
  return allQuestions.sort(() => Math.random() - 0.5).slice(0, count);
};

// Function to convert uploaded questions to the standard Question format
export const convertUploadedToQuestion = (uploaded: {
  id?: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  level: string;
}): Question => {
  return {
    id: `uploaded-${uploaded.id}`,
    text: uploaded.text,
    options: uploaded.options,
    correctAnswer: uploaded.correctAnswer,
    explanation: uploaded.explanation,
    topic: uploaded.topic,
    difficulty: uploaded.difficulty,
    subject: uploaded.subject
  };
};

// Async function to get all questions including uploaded ones
// This fetches from BOTH Firebase (if configured) AND IndexedDB
export const getAllQuestionsWithUploaded = async (
  level: string,
  subjects: string[],
  count: number
): Promise<Question[]> => {
  const allQuestions: Question[] = [];
  
  // Get static questions from the built-in question bank
  for (const subject of subjects) {
    const questions = getQuestions(level, subject);
    allQuestions.push(...questions);
  }
  
  // Try Firebase first, then fallback to IndexedDB
  try {
    const { isFirebaseConfigured, getAllUploadedQuestions } = await import('@/lib/firebase');
    
    if (isFirebaseConfigured()) {
      // Firebase: Get uploaded questions from Firebase (primary source)
      const uploadedQuestions = await getAllUploadedQuestions();
      const filtered = uploadedQuestions.filter(
        (q: any) => q.level === level && subjects.includes(q.subject) && q.isActive !== false
      );
      const convertedUploaded = filtered.map((q: any) => convertUploadedToQuestion({
        id: q.id,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || '',
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        level: q.level
      }));
      allQuestions.push(...convertedUploaded);
      console.log(`✅ Loaded ${convertedUploaded.length} questions from Firebase`);
    } else {
      // Fallback to IndexedDB when Firebase is not configured
      const { db } = await import('@/lib/db');
      const uploadedQuestions = await db.uploadedQuestions
        .where('level')
        .equals(level)
        .and(q => subjects.includes(q.subject) && q.isActive)
        .toArray();
      
      const convertedUploaded = uploadedQuestions.map(convertUploadedToQuestion);
      allQuestions.push(...convertedUploaded);
      console.log(`📦 Loaded ${convertedUploaded.length} questions from IndexedDB (offline mode)`);
    }
  } catch (error) {
    console.error('Error fetching uploaded questions:', error);
  }
  
  // Shuffle and return requested count
  return allQuestions.sort(() => Math.random() - 0.5).slice(0, count);
};

// Async function to get questions for practice including uploaded ones
export const getQuestionsWithUploaded = async (
  level: string,
  subject: string,
  topic?: string,
  difficulty?: string,
  count?: number
): Promise<Question[]> => {
  // Get static questions
  const staticQuestions = getQuestions(level, subject, topic, difficulty, undefined);
  
  // Get uploaded questions
  try {
    const { db } = await import('@/lib/db');
    let query = db.uploadedQuestions
      .where('level')
      .equals(level)
      .and(q => q.subject === subject && q.isActive);
    
    if (topic) {
      query = query.and(q => q.topic === topic);
    }
    if (difficulty) {
      query = query.and(q => q.difficulty === difficulty);
    }
    
    const uploadedQuestions = await query.toArray();
    const convertedUploaded = uploadedQuestions.map(convertUploadedToQuestion);
    
    const allQuestions = [...staticQuestions, ...convertedUploaded];
    const shuffled = allQuestions.sort(() => Math.random() - 0.5);
    
    return count ? shuffled.slice(0, count) : shuffled;
  } catch (error) {
    console.error('Error fetching uploaded questions:', error);
    const shuffled = staticQuestions.sort(() => Math.random() - 0.5);
    return count ? shuffled.slice(0, count) : shuffled;
  }
};
