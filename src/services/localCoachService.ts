import type { Scenario, MilestoneType, Message } from '../types/mathscape';

export const PRESET_SCENARIOS: Scenario[] = [
  {
    title: "Skatepark Architect Challenge",
    topic: "Quadratic Vertex Form",
    conceptType: "quadratic",
    problemStatement: `The city council has hired you to design a new curved skateboard ramp. The starting deck must be exactly 6 meters high ($x=0$, $y=6$), and it must connect smoothly to the landing platform 10 meters away.
    
To ensure safety and excitement, the lowest point of the curve (the vertex) must occur at a horizontal distance of 6 meters, and it must sit exactly 2 meters above the ground ($y=2$ at $x=6$) to cushion the rider's impact.

Your task is to:
1. Explain the visual behavior of a quadratic curve. What features do we look for?
2. Model the trajectory using the quadratic vertex form: $y = a(x - h)^2 + k$. Determine the constants $h$ and $k$.
3. Substitute the starting conditions ($x=0$, $y=6$) to solve for the vertical stretch/steepness coefficient $a$.
4. Calculate the height of the ramp at the landing platform ($x=10$) and justify if it is safe!`,
    independentVar: { name: "Horizontal Distance", symbol: "x", unit: "meters" },
    dependentVar: { name: "Ramp Height", symbol: "y", unit: "meters" },
    mathObjective: "Find the vertex form equation: $y = \\frac{1}{9}(x - 6)^2 + 2$",
    hintSequence: [
      "💡 Think about the vertex form equation: $y = a(x - h)^2 + k$. In this equation, what do $(h, k)$ represent? How does that relate to our lowest point of 2 meters high at a distance of 6 meters?",
      "💡 Since our vertex is at $(6, 2)$, we can write our formula as $y = a(x - 6)^2 + 2$. Now, how can we use our starting deck height of 6 meters at $x = 0$ to find the value of $a$?",
      "💡 Plug in $x = 0$ and $y = 6$ into $y = a(x - 6)^2 + 2$. This gives $6 = a(0 - 6)^2 + 2$. Solve for $a$. What do you get for $(-6)^2$?",
      "💡 Great! $6 = 36a + 2 \\implies 4 = 36a$. What fraction or decimal is $a$ equivalent to? Once you have $a$, plug in $x = 10$ to find the final landing height!"
    ],
    keywords: {
      hypothesis: ["parabola", "vertex", "minimum", "symmetry", "u-shape", "curve", "lowest"],
      formula: ["y=a(x-h)^2+k", "a(x-6)^2+2", "vertex form", "(x-6)", "y=a"],
      solved: ["1/9", "0.11", "0.111", "a=1/9", "3.78", "3.77", "3.8"],
      mastered: ["stretch", "vertical shift", "steepness", "coefficient", "fraction", "parabolic"]
    },
    targetNumericAnswers: [0.111, 6, 2, 3.77]
  },
  {
    title: "Concert Ticket Pricing Optimizer",
    topic: "Linear Demand & Quadratic Profit",
    conceptType: "linear",
    problemStatement: `The high school charity band is hosting a fundraising concert in the school theater. You are the business manager!
    
Market research shows that if you set the ticket price to $10, exactly 300 students will attend. For every $1 increase in the ticket price, attendance decreases by 15 students. The theater cost is a flat $500 (fixed cost) plus a cleaning and safety fee of $2 per student who attends (variable cost).

Your task is to:
1. Construct a linear demand equation relating Attendance ($A$) to Ticket Price ($x$).
2. Write a profit function $P(x)$ in terms of ticket price $x$, knowing that $\\text{Profit} = (\\text{Price} \\cdot \\text{Attendance}) - \\text{Fixed Cost} - (\\text{Variable Fee} \\cdot \\text{Attendance})$.
3. Graph or calculate the ticket price $x$ that maximizes the charity's profit, and calculate what that maximum profit will be!`,
    independentVar: { name: "Ticket Price", symbol: "x", unit: "dollars" },
    dependentVar: { name: "Net Profit", symbol: "P(x)", unit: "dollars" },
    mathObjective: "Find the ticket price of $x = \\$16$ that maximizes profit at $P(x) = \\$2,440$.",
    hintSequence: [
      "💡 Let's start with attendance. If $x$ is the ticket price, the increase above $10 is $(x - 10)$. Since attendance drops by 15 for each dollar increase, the attendance formula is $A(x) = 300 - 15(x - 10)$. Can you simplify this linear expression?",
      "💡 Simplifying $A(x) = 300 - 15x + 150$ gives $A(x) = 450 - 15x$. Now, our profit is $\\text{Revenue} - \\text{Expenses}$. Revenue is Price $\\cdot$ Attendance: $x(450 - 15x)$. Expenses are $500 + 2(450 - 15x)$. Can you subtract them to write a quadratic profit equation?",
      "💡 Excellent! Subtracting gives $Profit = (450x - 15x^2) - 500 - (900 - 30x) = -15x^2 + 480x - 1400$. This is a downward-opening parabola. Do you remember the formula to find the vertex (maximum) of a quadratic $y = ax^2 + bx + c$? It's $x = -b / (2a)$!",
      "💡 Plug in $b = 480$ and $a = -15$ into $x = -b / (2a)$. This gives $x = -480 / (2 \\cdot -15) = -480 / -30$. What ticket price does this yield, and what is the net profit at that price?"
    ],
    keywords: {
      hypothesis: ["revenue", "attendance", "linear", "quadratic", "decrease", "maximum", "peak"],
      formula: ["450-15x", "300-15", "-15x^2", "480x", "-b/(2a)", "revenue-cost"],
      solved: ["16", "2440", "16 dollars", "$2440", "$16"],
      mastered: ["demand", "fixed cost", "variable cost", "vertex", "maximize", "optimum", "parabola"]
    },
    targetNumericAnswers: [16, 2440, 450, -15]
  },
  {
    title: "Lynx Wildlife Recovery Model",
    topic: "Exponential Growth & Carrying Capacity",
    conceptType: "exponential",
    problemStatement: `You are a conservation biologist managing a newly established nature reserve. To restore the balance of the ecosystem, you have reintroduced 20 critically endangered Canadian Lynx ($P_0 = 20$).
    
Under optimal conditions in the sanctuary, the lynx population is expected to grow at a continuous rate of 14% annually ($r = 0.14$). The mathematical model for this exponential population growth over time $t$ (in years) is $P(t) = P_0 \\cdot e^{r \\cdot t}$.

Your task is to:
1. Explain why wildlife populations grow exponentially when resources are abundant. What is the role of Euler's number '$e$'?
2. Write the specific exponential function for the population $P(t)$ with our parameters.
3. Calculate the population of the sanctuary after 5 years and 10 years.
4. Calculate exactly how many years ($t$) it will take for the lynx population to grow from 20 to a target capacity of 100. (Hint: You will need logarithms!)`,
    independentVar: { name: "Time elapsed", symbol: "t", unit: "years" },
    dependentVar: { name: "Lynx Population", symbol: "P(t)", unit: "lynxes" },
    mathObjective: "Solve $100 = 20 \\cdot e^{0.14t}$ to find $t \\approx 11.5$ years.",
    hintSequence: [
      "💡 Our formula is $P(t) = 20 \\cdot e^{0.14 \\cdot t}$. To find the population after 5 years, plug in $t = 5$. Compute $0.14 \\cdot 5$, and then find $e^{0.7}$!",
      "💡 Great! $e^{0.7} \\approx 2.01$, so $P(5) = 20 \\cdot 2.01 \\approx 40$ lynxes. Now, to solve for when the population hits 100: set up the equation $100 = 20 \\cdot e^{0.14 \\cdot t}$. What is the first step to isolate the exponential part?",
      "💡 Divide both sides by 20! That gives $5 = e^{0.14 \\cdot t}$. Now, how do we 'undo' an exponential with base $e$? What is the natural logarithm ($\\ln$) of both sides?",
      "💡 Taking the natural log gives $\\ln(5) = 0.14 \\cdot t$. Since $\\ln(5) \\approx 1.609$, solve for $t$ by dividing $1.609$ by $0.14$. What is the final estimated time?"
    ],
    keywords: {
      hypothesis: ["growth", "continuous", "reproduce", "increase", "double", "unlimited", "exponential"],
      formula: ["20*e", "20e", "ln(5)", "100=20", "e^(0.14t)"],
      solved: ["11.5", "11.49", "11.5 years", "40", "81", "ln(5)/0.14"],
      mastered: ["logarithm", "natural log", "euler", "carrying capacity", "continuous growth", "inverse"]
    },
    targetNumericAnswers: [11.5, 40, 81, 20, 0.14]
  },
  {
    title: "Eco-Friendly Bakery Supply",
    topic: "Systems of Linear Equations",
    conceptType: "system",
    problemStatement: `You run a popular zero-waste high school bakery. You bake two delicious treats: Chocolate Fudge Cupcakes and Golden Honey Oatmeal Cookies.
    
- Each batch of Chocolate Cupcakes requires 2 cups of organic flour and 1 cup of local sugar.
- Each batch of Oatmeal Cookies requires 1 cup of organic flour and 2 cups of local sugar.

For this week's harvest bake sale, you have exactly 80 cups of organic flour and 70 cups of local sugar in your pantry, and you want to use up all your ingredients exactly to eliminate waste.

Your task is to:
1. Define your variables for Chocolate Cupcakes ($x$) and Oatmeal Cookies ($y$), and write a system of two linear equations representing your flour and sugar constraints.
2. Graphically or algebraically solve the system of equations to find the exact number of batches of cupcakes ($x$) and cookies ($y$) you should bake.
3. Explain what the intersection point of these two constraint lines represents in terms of bakery resources!`,
    independentVar: { name: "Cupcake Batches", symbol: "x", unit: "batches" },
    dependentVar: { name: "Cookie Batches", symbol: "y", unit: "batches" },
    mathObjective: "Solve the system $2x + y = 80$ and $x + 2y = 70$ to find $x = 30$, $y = 20$.",
    hintSequence: [
      "💡 Let's build our equations! Flour constraint: Each batch of cupcakes ($x$) takes 2 cups, and each cookie ($y$) takes 1 cup. Together they must use exactly 80 cups. Can you write this equation?",
      "💡 Yes, $2x + y = 80$. Now, for sugar: each cupcake ($x$) takes 1 cup, and each cookie ($y$) takes 2 cups. Together they use exactly 70 cups. The equation is $x + 2y = 70$. Now you have two equations. Do you want to use substitution or elimination to solve them?",
      "💡 Let's try substitution. From the first equation, we can write $y = 80 - 2x$. Substitute this expression for $y$ into the second equation: $x + 2(80 - 2x) = 70$. Expand and solve for $x$!",
      "💡 Expanding gives $x + 160 - 4x = 70 \\implies -3x + 160 = 70 \\implies -3x = -90$. What does $x$ equal? Once you have $x$, plug it back in to find $y$!"
    ],
    keywords: {
      hypothesis: ["intersection", "limit", "constraint", "system", "simultaneous", "balance", "overlap"],
      formula: ["2x+y=80", "x+2y=70", "y=80-2x", "substitution", "elimination"],
      solved: ["30", "20", "x=30", "y=20", "30 cupcakes", "20 cookies"],
      mastered: ["independent equations", "intersection point", "elimination method", "substitution method", "constraints", "pantries"]
    },
    targetNumericAnswers: [30, 20, 80, 70]
  }
];

/**
 * Procedurally generates a math challenge scenario based on user input.
 * This guarantees that we can ALWAYS generate custom challenges on the fly!
 */
export function generateScenarioFromTopic(topicInput: string): Scenario {
  const query = topicInput.toLowerCase();
  
  // 1. Identify which template math concept matches best
  let concept: 'quadratic' | 'linear' | 'exponential' | 'system' = 'linear';
  
  if (query.includes('curve') || query.includes('ramp') || query.includes('launch') || query.includes('ball') || query.includes('jump') || query.includes('parabola') || query.includes('gravity') || query.includes('quad')) {
    concept = 'quadratic';
  } else if (query.includes('grow') || query.includes('pop') || query.includes('bacteria') || query.includes('wild') || query.includes('wolf') || query.includes('virus') || query.includes('spread') || query.includes('decay') || query.includes('invest') || query.includes('interest')) {
    concept = 'exponential';
  } else if (query.includes('bakery') || query.includes('combine') || query.includes('mix') || query.includes('ingredient') || query.includes('limit') || query.includes('resource') || query.includes('system') || query.includes('equation')) {
    concept = 'system';
  } else {
    // Random default or select based on business/pricing
    concept = query.includes('price') || query.includes('sell') || query.includes('money') || query.includes('ticket') || query.includes('revenue') ? 'linear' : 'quadratic';
  }

  // 2. Generate custom narrative details based on student's topic input
  const subject = topicInput.trim() || "School Carnival";
  const capitalSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
  
  if (concept === 'quadratic') {
    return {
      title: `The ${capitalSubject} Trajectory Design`,
      topic: "Quadratic Parabolas & Vertex Form",
      conceptType: "quadratic",
      problemStatement: `You are the lead engineering consultant for a cutting-edge high school design team working on: **${capitalSubject}**.
      
You need to model a perfect parabolic flight path. The projectile is launched from an initial starting height of 9 feet ($x=0$, $y=9$). The trajectory must reach its highest peak (the vertex of our parabola) at a horizontal distance of 4 feet, and that maximum apex height must be exactly 25 feet ($y=25$ at $x=4$).

Your task is to:
1. Formulate a quadratic vertex equation of the form $y = a(x - h)^2 + k$. Determine the vertex coordinates $(h, k)$ from our parameters.
2. Substitute the launch conditions ($x=0$, $y=9$) to solve for the stretch coefficient $a$. Is it positive or negative? Explain why.
3. Calculate the height of the projectile when it travels a horizontal distance of 8 feet. Will it land safely back at ground level or is it still in the air?`,
      independentVar: { name: "Horizontal Travel", symbol: "x", unit: "feet" },
      dependentVar: { name: "Vertical Elevation", symbol: "y", unit: "feet" },
      mathObjective: "Solve $9 = a(0-4)^2 + 25$ to find $y = -1(x - 4)^2 + 25$ (lands at $y=9$ at $x=8$).",
      hintSequence: [
        "💡 The vertex represents the peak. Our peak height is 25 feet at a distance of 4 feet. In vertex form $y = a(x - h)^2 + k$, this means $(h, k) = (4, 25)$. Can you write out the formula with these numbers?",
        "💡 Perfect! Our formula is $y = a(x - 4)^2 + 25$. Now, let's solve for $a$. We know that when it starts ($x = 0$), the height is $9$. Plug those in: $9 = a(0 - 4)^2 + 25$. How do you simplify $(0 - 4)^2$?",
        "💡 Simplifying yields $9 = 16a + 25$. Subtract 25 from both sides to get $-16 = 16a$. What does $a$ equal? Why is it negative?",
        "💡 Yes! $a = -1$, representing a downward-opening parabola. Now our complete equation is $y = -1(x - 4)^2 + 25$. Plug in $x = 8$ to find the elevation at that distance. What value do you get?"
      ],
      keywords: {
        hypothesis: ["parabola", "vertex", "maximum", "peak", "highest", "negative", "downward"],
        formula: ["y=a(x-h)^2+k", "a(x-4)^2+25", "vertex form", "-1(x-4)", "y=-1"],
        solved: ["-1", "9", "a=-1", "9 feet", "apex"],
        mastered: ["stretch", "vertical reflection", "symmetry", "projectile", "vertex", "coefficient"]
      },
      targetNumericAnswers: [-1, 25, 4, 9]
    };
  } else if (concept === 'exponential') {
    return {
      title: `The ${capitalSubject} Exponential Model`,
      topic: "Exponential Growth & Logarithms",
      conceptType: "exponential",
      problemStatement: `You are a data analyst researching: **${capitalSubject}**.
      
Your measurements show that the system starts with an initial baseline quantity of 50 units ($P_0 = 50$). Under continuous conditions, the system is growing exponentially at an annual rate of 12% ($r = 0.12$). The growth can be modeled by the equation $P(t) = P_0 \\cdot e^{r \\cdot t}$, where $t$ is in years.

Your task is to:
1. Explain what Euler's constant $e$ represents, and why exponential models grow so rapidly over time.
2. Construct the exact exponential equation for this scenario.
3. Calculate the size of the system after 10 years.
4. Calculate exactly how many years ($t$) it will take for the quantity to grow from 50 to reach 200. (Use natural logarithms to solve for time!)`,
      independentVar: { name: "Duration", symbol: "t", unit: "years" },
      dependentVar: { name: "Total Quantity", symbol: "P(t)", unit: "units" },
      mathObjective: "Solve $200 = 50 \\cdot e^{0.12t}$ to find $t \\approx 11.55$ years.",
      hintSequence: [
        "💡 The exponential equation is $P(t) = 50 \\cdot e^{0.12 \\cdot t}$. To find the quantity at 10 years, plug in $t = 10$. What is $0.12 \\cdot 10$? Then evaluate $e^{1.2}$.",
        "💡 Calculating $e^{1.2} \\approx 3.32$, so $P(10) = 50 \\cdot 3.32 = 166$ units. Now, to solve for when it hits 200: set up the equation $200 = 50 \\cdot e^{0.12 \\cdot t}$. How do we isolate the exponential term?",
        "💡 Divide by 50 to get $4 = e^{0.12 \\cdot t}$. Next, we apply the natural log ($\\ln$) to both sides to cancel out the base $e$: $\\ln(4) = 0.12 \\cdot t$. Do you have a calculator to find $\\ln(4)$?",
        "💡 Excellent! $\\ln(4) \\approx 1.3863$. So, $1.3863 = 0.12 \\cdot t$. Divide $1.3863$ by $0.12$ to get your final time $t$!"
      ],
      keywords: {
        hypothesis: ["growth", "continuous", "multiply", "unlimited", "compound", "exponential"],
        formula: ["50*e", "50e", "ln(4)", "200=50", "e^(0.12t)"],
        solved: ["11.55", "11.6", "11.55 years", "166", "166 units", "ln(4)/0.12"],
        mastered: ["natural log", "euler", "continuous growth", "inverse operations", "isolate", "logarithmic"]
      },
      targetNumericAnswers: [11.55, 166, 50, 0.12]
    };
  } else if (concept === 'system') {
    return {
      title: `The ${capitalSubject} Balance Optimizer`,
      topic: "Systems of Linear Equations",
      conceptType: "system",
      problemStatement: `You are the operations manager organizing resources for: **${capitalSubject}**.
      
To make this project a success, you must produce two distinct units: Deluxe Packs ($x$) and Standard Packs ($y$).
- Each Deluxe Pack ($x$) requires 3 hours of labor and 1 unit of high-grade material.
- Each Standard Pack ($y$) requires 1 hour of labor and 2 units of high-grade material.

You have exactly 90 hours of total labor available and 50 units of high-grade materials in inventory. To be perfectly efficient, you must expend all resources exactly.

Your task is to:
1. Define your linear equation for the Labor hours constraint.
2. Define your linear equation for the Material inventory constraint.
3. Solve this system of equations using substitution or elimination to find the optimal quantity of Deluxe Packs ($x$) and Standard Packs ($y$).`,
      independentVar: { name: "Deluxe Packs", symbol: "x", unit: "units" },
      dependentVar: { name: "Standard Packs", symbol: "y", unit: "units" },
      mathObjective: "Solve the system $3x + y = 90$ and $x + 2y = 50$ to find $x = 26$, $y = 12$.",
      hintSequence: [
        "💡 Let's look at Labor. Deluxe ($x$) takes 3 hours, Standard ($y$) takes 1 hour. Total labor is 90 hours. So, the equation is $3x + y = 90$. Can you write the material constraint equation similarly?",
        "💡 Excellent! Material constraint is $x + 2y = 50$. Now you have two equations: $3x + y = 90$ and $x + 2y = 50$. Let's solve for $y$ in the first one: $y = 90 - 3x$. Plug this into the second equation!",
        "💡 Substitution gives $x + 2(90 - 3x) = 50$. Expand this to get $x + 180 - 6x = 50$. Combine the $x$ terms. What do you get?",
        "💡 You get $-5x + 180 = 50 \\implies -5x = -130$. Solve for $x$ by dividing by $-5$. Once you have $x$, solve for $y$!"
      ],
      keywords: {
        hypothesis: ["intersection", "constraint", "system", "simultaneous", "elimination", "substitution"],
        formula: ["3x+y=90", "x+2y=50", "y=90-3x", "-5x=-130"],
        solved: ["26", "12", "x=26", "y=12", "26 deluxe", "12 standard"],
        mastered: ["independent lines", "intersection point", "elimination", "substitution", "constraints"]
      },
      targetNumericAnswers: [26, 12, 90, 50]
    };
  } else {
    // Default Linear Optimizer Template
    return {
      title: `The ${capitalSubject} Financial Venture`,
      topic: "Linear Pricing Optimization",
      conceptType: "linear",
      problemStatement: `You are launching a business plan for: **${capitalSubject}**.
      
Your fixed costs to establish operations are exactly $400. To manufacture each unit of product, it costs you $5 in materials (variable cost). If you set your selling price to $15 per unit, your market survey shows that you will sell exactly 100 units. For every $1 you increase the price, your sales drop by 5 units.

Your task is to:
1. Write a linear demand equation relating units sold ($U$) to selling price ($x$).
2. Formulate the profit equation $Profit(x) = (x \\cdot U) - 400 - (5 \\cdot U)$ in terms of $x$.
3. Calculate the ticket/unit price $x$ that yields the absolute peak net profit!`,
      independentVar: { name: "Selling Price", symbol: "x", unit: "dollars" },
      dependentVar: { name: "Total Net Profit", symbol: "P(x)", unit: "dollars" },
      mathObjective: "Optimize selling price to find $x = \\$20$ for maximum profit.",
      hintSequence: [
        "💡 The Sales Demand equation starts at 100 units at $15 price, dropping by 5 for every dollar above 15. So, $U(x) = 100 - 5(x - 15) = 100 - 5x + 75 = 175 - 5x$. Can you write the profit formula by multiplying price by demand and subtracting costs?",
        "💡 Profit is $\\text{Revenue} - \\text{Expenses} = x(175 - 5x) - 400 - 5(175 - 5x)$. Simplify this quadratic expression!",
        "💡 Expanding gives $Profit = 175x - 5x^2 - 400 - 875 + 25x = -5x^2 + 200x - 1275$. To find the vertex (peak price), use the formula $x = -b / (2a)$. What does $b$ and $a$ equal here?",
        "💡 Right! $b = 200$ and $a = -5$. So $x = -200 / (2 \\cdot -5) = -200 / -10$. What optimal selling price does this give you, and what is your profit at that price?"
      ],
      keywords: {
        hypothesis: ["revenue", "demand", "price", "profit", "quadratic", "linear", "vertex"],
        formula: ["175-5x", "-5x^2", "200x", "-b/(2a)", "x*u"],
        solved: ["20", "725", "$20", "20 dollars", "max profit"],
        mastered: ["optimal price", "marginal profit", "demand elasticity", "vertex coordinates"]
      },
      targetNumericAnswers: [20, 725, 175, -5]
    };
  }
}

/**
 * Custom Socratic Dialogue State Machine
 * Analyzes the chat logs and student inputs to construct Socratic replies in words,
 * checking equations/numbers, and unlocking milestones!
 */
export function generateLocalSocraticResponse(
  messages: Message[], 
  scenario: Scenario, 
  activeMilestones: MilestoneType[]
): { response: Message; unlockedMilestone?: MilestoneType } {
  
  // Extract all student messages to scan for progress
  const studentMessages = messages.filter(m => m.sender === 'user');
  const lastStudentText = studentMessages[studentMessages.length - 1]?.text || "";
  const normalizedText = lastStudentText.toLowerCase().replace(/\s+/g, '');
  
  // Helper to check if text contains numbers
  const extractNumbers = (text: string): number[] => {
    const matches = text.match(/\b\d+(\.\d+)?\b/g);
    return matches ? matches.map(Number) : [];
  };
  const studentNumbers = extractNumbers(lastStudentText);

  // Determine current active milestone level
  const hasActive = activeMilestones.includes('active');
  const hasHypothesis = activeMilestones.includes('hypothesis');
  const hasFormula = activeMilestones.includes('formula');
  const hasSolved = activeMilestones.includes('solved');
  const hasMastered = activeMilestones.includes('mastered');

  let nextMilestone: MilestoneType | undefined = undefined;
  let replyText = "";
  let chips: string[] = [];

  // STEP A: Evaluate milestone unlocks sequentially
  if (!hasActive) {
    nextMilestone = 'active';
    replyText = `Welcome to the **${scenario.title}**! 🚀 I'm Socrates, your Socratic math coach.
    
Here, you'll explore a real-world scenario by proposing mathematical concepts and testing your calculations. Remember, I won't just give you the answers—I'm here to ask questions and guide your reasoning!

Let's read the problem statement in the header carefully. To start our exploration: **What is your initial hypothesis about this problem?** In your own words, what do you think happens as the independent variable (${scenario.independentVar.name}) increases? How does it affect the dependent variable (${scenario.dependentVar.name})?`;
    chips = ["It will increase continuously", "It will reach a peak and go down", "I'm not sure, give me a hint!"];
  } 
  
  else if (hasActive && !hasHypothesis) {
    // Check if the student attempted a conceptual explanation
    const keywordMatches = scenario.keywords.hypothesis.some(kw => normalizedText.includes(kw));
    const wordCount = lastStudentText.split(/\s+/).length;
    
    if (keywordMatches || wordCount > 4) {
      nextMilestone = 'hypothesis';
      replyText = `Excellent initial reasoning! You've successfully formulated a **hypothesis**. 💡 You noticed the relationship between ${scenario.independentVar.name} and ${scenario.dependentVar.name}.
      
Now, to move from a description to a quantitative tool, we need to model this mathematically. 

Our target is to build an equation that models this scenario. Looking at the mathematical objective: **How can we write a formula that relates ${scenario.dependentVar.symbol} to ${scenario.independentVar.symbol}?** 

Can you express our constraint or pattern as an algebraic equation (e.g., in vertex form, exponential form, or a system of equations)?`;
      chips = ["How do I start the equation?", "Let's model the formula", "Give me a hint on variables"];
    } else {
      replyText = `That's a start, but let's dive deeper! Before writing numbers, let's describe the physical system. 
      
In the **${scenario.title}**, what happens visually to the ${scenario.dependentVar.name} when ${scenario.independentVar.name} starts growing? Can you explain the general shape or trend of the curve in words?`;
      chips = [scenario.hintSequence[0], "It forms a symmetric curve", "Give me a clue"];
    }
  } 
  
  else if (hasHypothesis && !hasFormula) {
    // Check for formula terms
    const hasFormulaKeywords = scenario.keywords.formula.some(kw => normalizedText.includes(kw.replace(/\s+/g, '')));
    const hasEquationSymbols = normalizedText.includes('=') || normalizedText.includes('x') || normalizedText.includes('y');

    if (hasFormulaKeywords || hasEquationSymbols) {
      nextMilestone = 'formula';
      replyText = `Fantastic math modeling! You've locked in the **Math Formula**! 📝 Your equation represents the mathematical DNA of this microworld.

Now that we have the algebraic blueprint, it's time to solve for the specific values to answer our real-world puzzle.

Let's do the calculations. Based on the target conditions, **what are the exact coordinates, constants, or numerical solutions that solve our challenge?** 

Take your time to write down your steps, or use the Workspace Scribble Pad on the side to double check your arithmetic. What numbers did you calculate?`;
      chips = ["Check my numbers", "What are the target coordinates?", "Can I have a hint?"];
    } else {
      replyText = `You're close to formulating the equation! Let's scaffold it. 
      
${scenario.hintSequence[1]}

What happens if you plug in the constants that we already know? Try writing out an equation starting with \`${scenario.dependentVar.symbol} = ...\``;
      chips = ["I need the formula vertex hint", "How do I plug in x=0?", "Give me the next hint"];
    }
  } 
  
  else if (hasFormula && !hasSolved) {
    // Check if the student typed the correct target numbers
    const containsTarget = scenario.targetNumericAnswers.some(ans => 
      studentNumbers.some(sNum => Math.abs(sNum - ans) < 0.05 || Math.abs((sNum - ans)/ans) < 0.05)
    );
    const solvedKeywords = scenario.keywords.solved.some(kw => normalizedText.includes(kw));

    if (containsTarget || solvedKeywords) {
      nextMilestone = 'solved';
      replyText = `Incredible math! You have **solved the problem** numerically! 🎯 Your calculations are spot on.
      
But in math, finding the numbers is only half the battle. A true mathematician must justify their solution.

For your final milestone, **Concept Master**: 
Can you explain *why* your numbers make sense in the real world? For example:
- Why does the vertical stretch/reflection coefficient need to be positive or negative?
- What does the vertex or carrying capacity represent to the designers or ecologists?
- What would happen to the system if we adjusted one of these parameters?

Explain the conceptual connection in a sentence!`;
      chips = ["It represents the limit of resources", "The negative coefficient makes it curve down", "It represents peak efficiency"];
    } else {
      replyText = `Your mathematical framework is perfect, but the calculation isn't quite aligned yet. Let's trace the arithmetic steps.
      
${scenario.hintSequence[2]}

Substitute the values carefully. What do you get when you isolate the variable? Share your intermediate calculation steps with me!`;
      chips = ["Help me with the algebra steps", "Let's recalculate together", "Show hint #3"];
    }
  } 
  
  else if (hasSolved && !hasMastered) {
    const masterKeywords = scenario.keywords.mastered.some(kw => normalizedText.includes(kw));
    const wordCount = lastStudentText.split(/\s+/).length;

    if (masterKeywords || wordCount > 8) {
      nextMilestone = 'mastered';
      replyText = `🎉 **CONGRATULATIONS! CONCEPT MASTERED!** 🎉
      
You have completely grasped the mathematical principles under the **${scenario.title}**! 

You didn't just calculate the values—you connected vertex forms, exponential rates, or linear limits directly to physical boundaries. That is true algebraic modeling.

Feel free to write notes in your **Workspace Scribble Pad** to save your discoveries. 

Whenever you are ready, type in a **new mathematical topic or real-world theme** in the top bar to generate your next microworld adventure!`;
      chips = ["Create a Basketball challenge", "Create a business optimization challenge", "Let's try exponential decay!"];
    } else {
      replyText = `A noble attempt, but let's connect the math fully to the real world! 
      
Consider the coefficient or the peak value. In terms of physical objects (like skateboard safety, band fundraising, or wolves in a forest), why is that specific value critical? Why can't it be an arbitrary number? Try to explain in one sentence!`;
      chips = ["Explain the real-world connection", "Give me a hint for mastery", "What is the physical meaning of the vertex?"];
    }
  } 
  
  else {
    // Already mastered, just conversational
    replyText = `You've already mastered this microworld! You are an absolute champ. 🏆
    
Would you like to explore another topic? Just type any math concept (e.g. 'trigonometric wave optimization', 'compound interest', or 'geometry angles') in the top bar, and I will instantly design a brand new narrative challenge for you!`;
    chips = ["Generate solar panels math", "Generate rollercoaster trajectories", "Let's explore virus spreads"];
  }

  // Create the AI Message object
  const aiMessage: Message = {
    id: `msg-${Date.now()}`,
    sender: 'ai',
    text: replyText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    chips: chips
  };

  return { response: aiMessage, unlockedMilestone: nextMilestone };
}
