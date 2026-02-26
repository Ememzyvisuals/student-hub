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
