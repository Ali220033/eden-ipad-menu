const shell = document.querySelector(".ipad-shell");
const opening = document.querySelector(".opening-screen");
const canvas = document.querySelector(".spark-canvas");
const ctx = canvas.getContext("2d", { alpha: true });
const sectionName = document.querySelector("[data-section-name]");
const sectionEyebrow = document.querySelector("[data-section-fallback] .eyebrow");
const sectionDescription = document.querySelector("[data-section-fallback] p:last-child");
const menuArt = document.querySelector("[data-menu-art]");
const menuScreen = document.querySelector(".menu-screen");
const sectionScreen = document.querySelector(".section-screen");
const sectionArt = document.querySelector("[data-section-art]");
const sectionScrollStack = document.querySelector("[data-section-scroll-stack]");
const itemHotspots = document.querySelector("[data-item-hotspots]");
const itemDetailScreen = document.querySelector(".item-detail-screen");
const itemImage = document.querySelector("[data-item-image]");
const itemKicker = document.querySelector("[data-item-kicker]");
const itemTitle = document.querySelector("[data-item-title]");
const itemDescription = document.querySelector("[data-item-description]");
const itemPrice = document.querySelector("[data-item-price]");
const itemOptionsTitle = document.querySelector("[data-item-options-title]");
const itemAddons = document.querySelector("[data-item-addons]");
const itemInstructions = document.querySelector("[data-item-instructions]");
const itemInstructionsGroup = document.querySelector(".item-instructions");
const itemActions = document.querySelector(".item-actions");
const itemQty = document.querySelector("[data-item-qty]");
const itemSelector = document.querySelector("[data-item-selector]");
const addButtons = document.querySelector("[data-add-buttons]");
const menuAddButtons = document.querySelector("[data-menu-add-buttons]");
const quickOrder = document.querySelector("[data-quick-order]");
const quickOrderImage = document.querySelector("[data-quick-order-image]");
const quickOrderKicker = document.querySelector("[data-quick-order-kicker]");
const quickOrderName = document.querySelector("[data-quick-order-name]");
const quickOrderInstructions = document.querySelector("[data-quick-order-instructions]");
const quickOrderQty = document.querySelector("[data-quick-order-qty]");
const basket = document.querySelector("[data-basket]");
const basketButton = document.querySelector(".basket-button");
const basketCount = document.querySelector("[data-basket-count]");
const basketItems = document.querySelector("[data-basket-items]");
const basketEmpty = document.querySelector("[data-basket-empty]");
const viewOrderButton = document.querySelector("[data-view-order]");
const orderReview = document.querySelector("[data-order-review]");
const orderReviewItems = document.querySelector("[data-order-review-items]");
const orderReviewEmpty = document.querySelector("[data-order-review-empty]");
const orderReviewTotal = document.querySelector("[data-order-review-total]");
const callWaiterButton = document.querySelector("[data-call-waiter]");
const callWaiterLabel = document.querySelector("[data-call-waiter-label]");
const supabaseConfig = window.EDEN_SUPABASE_CONFIG || {};
const waiterClient = window.supabase && supabaseConfig.url && supabaseConfig.key
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.key)
  : null;
const waiterTable = supabaseConfig.waiterTable || "waiter_calls";
const waiterCooldownMs = 45000;

const sectionPages = {
  "Main Course": {
    src: "assets/main-course-new-page-4k.webp",
    alt: "EDEN main course page"
  },
  Coffees: {
    src: "assets/coffees-new-page-4k.webp",
    alt: "EDEN coffees page",
    aspect: "four-three"
  },
  "Hot Teas": {
    src: "assets/hot-teas-new-page-4k.webp",
    alt: "EDEN hot teas page",
    aspect: "two-three"
  },
  "Iced Teas": {
    src: "assets/iced-teas-new-page2-4k.webp",
    alt: "EDEN iced teas page",
    aspect: "two-three"
  },
  Milkshakes: {
    src: "assets/milkshakes-new-page-4k.webp",
    alt: "EDEN milkshakes page",
    aspect: "four-three"
  },
  Lemonades: {
    src: "assets/lemonades-new-page-4k.webp",
    alt: "EDEN lemonades page",
    aspect: "two-three"
  },
  "Soft Drinks": {
    src: "assets/soft-drinks-new-page-4k.webp",
    alt: "EDEN soft drinks page",
    aspect: "four-three"
  },
  Salads: {
    src: "assets/salads-new-page-4k.webp",
    alt: "EDEN salads page"
  },
  Sides: {
    src: "assets/sides-new-page-4k.webp",
    alt: "EDEN sides page"
  },
  Appetizers: {
    src: "assets/appetizers-new-page-4k.webp",
    alt: "EDEN appetizers page"
  },
  Burgers: {
    src: "assets/burgers-new-page-4k.webp",
    alt: "EDEN burgers page"
  },
  Shawarma: {
    src: "assets/shawarma-coming-soon-4k.webp",
    alt: "EDEN shawarma coming soon page"
  },
  Specials: {
    src: "assets/specials-coming-soon-4k.webp",
    alt: "EDEN specials coming soon page"
  },
  "Heavy Blend": {
    src: "assets/heavy-blend-page-4k.webp?v=20260519-hookah-4k",
    alt: "EDEN heavy blend hookah page"
  },
  "Balanced Blend": {
    src: "assets/balanced-blend-page-4k.webp?v=20260519-hookah-4k",
    alt: "EDEN balanced blend hookah page"
  },
  "Light & Smooth Blend": {
    src: "assets/light-page-4k.webp?v=20260519-hookah-4k",
    alt: "EDEN light and smooth blend hookah page"
  },
  "Signature Mix": {
    src: "assets/signature-mix-page-4k.webp",
    pages: ["assets/signature-mix-page-4k.webp", "assets/signature-mix-page2-4k.webp"],
    alt: "EDEN signature mix hookah page",
    aspect: "two-three",
    needsBackOverlay: true
  }
};

const overlayBackSections = new Set([
  "Coffees",
  "Hot Teas",
  "Iced Teas",
  "Milkshakes",
  "Lemonades",
  "Soft Drinks",
  "Heavy Blend",
  "Balanced Blend",
  "Light & Smooth Blend",
  "Signature Mix"
]);

const menuPages = {
  food: {
    src: "assets/food-menu-page-4k.webp",
    alt: "EDEN food menu page",
    defaultSection: "Main Course"
  },
  drinks: {
    src: "assets/drinks-menu-new-page-4k.webp",
    alt: "EDEN drinks menu page",
    defaultSection: "Coffees"
  },
  hookah: {
    src: "assets/hookah-page-4k.webp",
    alt: "EDEN hookah menu page",
    defaultSection: "Hookah"
  },
  desserts: {
    src: "assets/desserts-new-page-4k.webp",
    alt: "EDEN desserts page",
    defaultSection: "Desserts",
    aspect: "four-three"
  }
};

const menuSectionNames = {
  food: ["Main Course", "Salads", "Sides", "Appetizers", "Burgers", "Shawarma"],
  drinks: ["Coffees", "Hot Teas", "Iced Teas", "Milkshakes", "Lemonades", "Soft Drinks"],
  hookah: ["Heavy Blend", "Balanced Blend", "Light & Smooth Blend", "Signature Mix"]
};

const comingSoonSections = {
  Shawarma: {
    eyebrow: "EDEN Food Menu",
    title: "Shawarma",
    description: "Coming Soon"
  },
  Specials: {
    eyebrow: "EDEN Restaurant & Lounge",
    title: "Specials",
    description: "Coming Soon"
  }
};

const itemGroups = {
  "Main Course": [
    {
      id: "rib-eye-steak",
      name: "Rib Eye Steak",
      price: "$34.99",
      image: "assets/detail-main-steak-4k.webp",
      description: "Premium rib eye steak grilled with roasted vegetables, herbs, and Eden steak jus.",
      ingredients: ["rib eye steak", "rosemary", "zucchini", "mushrooms", "peppers", "potatoes", "Eden jus"],
      hotspot: { x: 4, y: 25.8, w: 92, h: 33.8 }
    },
    {
      id: "grilled-sea-bass",
      name: "Grilled Sea Bass",
      price: "$34.99",
      image: "assets/detail-main-seabass-4k.webp",
      description: "Whole sea bass grilled with charred lemon, asparagus, greens, and cherry tomatoes.",
      ingredients: ["whole sea bass", "charred lemon", "asparagus", "greens", "cherry tomatoes", "olive oil"],
      hotspot: { x: 4, y: 61.4, w: 92, h: 33.8 }
    }
  ],
  Salads: [
    {
      id: "eden-salad",
      name: "Eden Salad",
      price: "$19.00",
      image: "assets/detail-salad-eden-4k.webp",
      description: "Shrimp, greens, feta, almonds, cherry tomatoes, herbs, and Eden balsamic glaze.",
      ingredients: ["shrimp", "mixed greens", "feta", "almonds", "cherry tomatoes", "herbs", "balsamic glaze"],
      hotspot: { x: 2.2, y: 25.2, w: 46.5, h: 27.4 }
    },
    {
      id: "salmon-splash-salad",
      name: "Salmon Splash Salad",
      price: "$16.50",
      image: "assets/detail-salad-salmon-splash-4k.webp",
      description: "Grilled salmon, feta, olives, cucumbers, tomatoes, greens, and citrus herb dressing.",
      ingredients: ["grilled salmon", "feta", "olives", "cucumber", "tomatoes", "greens", "citrus herb dressing"],
      hotspot: { x: 51.2, y: 25.2, w: 46.6, h: 27.4 }
    },
    {
      id: "caesar-salad",
      name: "Caesar Salad",
      price: "$17.50",
      image: "assets/detail-salad-caesar-4k.webp",
      description: "Grilled chicken, crisp romaine, parmesan, cherry tomatoes, croutons, and Caesar dressing.",
      ingredients: ["grilled chicken", "romaine", "parmesan", "cherry tomatoes", "croutons", "Caesar dressing"],
      hotspot: { x: 2.2, y: 53.8, w: 46.5, h: 26.8 }
    },
    {
      id: "crispy-eggplant-salad",
      name: "Crispy Eggplant Salad",
      price: "$13.50",
      image: "assets/detail-salad-eggplant-4k.webp",
      description: "Crispy eggplant, roasted peppers, fresh herbs, cheese, greens, sesame, and sweet glaze.",
      ingredients: ["crispy eggplant", "roasted peppers", "fresh herbs", "cheese", "greens", "sesame", "sweet glaze"],
      hotspot: { x: 51.2, y: 53.8, w: 46.6, h: 26.8 }
    }
  ],
  Sides: [
    {
      id: "eden-cheese-fries",
      name: "Eden Cheese Fries",
      price: "$6.99",
      image: "assets/detail-side-cheese-fries-4k.webp",
      description: "Crispy fries topped with melted cheese and served with Eden dipping sauce.",
      hotspot: { x: 2.5, y: 25.7, w: 95, h: 13.7 }
    },
    {
      id: "french-fries",
      name: "French Fries",
      price: "$5.99",
      image: "assets/detail-side-fries-4k.webp",
      description: "Classic golden french fries served crisp with house ketchup.",
      hotspot: { x: 2.5, y: 39.9, w: 95, h: 13.7 }
    },
    {
      id: "garlic-fries",
      name: "Garlic Fries",
      price: "$6.99",
      image: "assets/detail-side-garlic-fries-4k.webp",
      description: "French fries tossed with garlic, herbs, and parmesan.",
      hotspot: { x: 2.5, y: 54, w: 95, h: 13.7 }
    },
    {
      id: "grilled-vegetables",
      name: "Grilled Vegetables",
      price: "$6.50",
      image: "assets/detail-side-grilled-vegetables-4k.webp",
      description: "Seasonal vegetables grilled with herbs and olive oil.",
      hotspot: { x: 2.5, y: 68.1, w: 95, h: 13.7 }
    },
    {
      id: "rice",
      name: "Rice",
      price: "$3.99",
      image: "assets/detail-side-rice-4k.webp",
      description: "Steamed white rice finished with parsley and cracked pepper.",
      hotspot: { x: 2.5, y: 82.2, w: 95, h: 13.7 }
    }
  ],
  Appetizers: [
    {
      id: "wings-bbq-buffalo",
      name: "Wings BBQ, Blu, Buffalo",
      price: "$9.50",
      image: "assets/detail-app-wings-4k.webp",
      description: "Crispy chicken wings served with celery, carrots, slaw, and choice of BBQ, blue cheese, or buffalo sauce.",
      ingredients: ["chicken wings", "sesame", "celery", "carrots", "slaw", "BBQ sauce", "buffalo sauce"],
      hotspot: { x: 9.6, y: 4.5, w: 80.8, h: 16.4 }
    },
    {
      id: "fried-mixed-seafood",
      name: "Fried Mixed Seafood",
      price: "$19.99",
      image: "assets/detail-app-seafood-mix-4k.webp",
      description: "Assorted fried seafood platter with lemon and house dipping sauce.",
      ingredients: ["shrimp", "calamari", "fish", "lemon", "mixed greens", "house sauce"],
      hotspot: { x: 9.6, y: 21.4, w: 80.8, h: 15.8 }
    },
    {
      id: "dynamite-shrimp",
      name: "Dynamite Shrimp",
      price: "$14.50",
      image: "assets/detail-app-dynamite-shrimp-4k.webp",
      description: "Crispy shrimp tossed in spicy dynamite sauce with sesame and citrus.",
      ingredients: ["crispy shrimp", "dynamite sauce", "sesame", "lettuce", "lemon"],
      hotspot: { x: 9.6, y: 37.8, w: 80.8, h: 15.6 }
    },
    {
      id: "fried-mozzarella",
      name: "Fried Mozzarella",
      price: "$9.50",
      image: "assets/detail-app-mozzarella-4k.webp",
      description: "Golden fried mozzarella sticks served with tomato sauce.",
      ingredients: ["mozzarella", "seasoned crust", "tomato sauce", "herbs"],
      hotspot: { x: 9.6, y: 54, w: 80.8, h: 15.6 }
    },
    {
      id: "fried-calamari",
      name: "Fried Calamari",
      price: "$11.50",
      image: "assets/detail-app-calamari-4k.webp",
      description: "Crispy fried calamari rings with lemon and dipping sauces.",
      ingredients: ["calamari", "lemon", "mixed greens", "spiced breading", "dipping sauce"],
      hotspot: { x: 9.6, y: 70.1, w: 80.8, h: 15.6 }
    },
    {
      id: "chicken-nuggets",
      name: "Chicken Nuggets",
      price: "$7.99",
      image: "assets/detail-app-chicken-nuggets-4k.webp",
      description: "Crispy golden chicken nuggets with house ketchup.",
      ingredients: ["chicken", "golden crust", "ketchup", "seasoning"],
      hotspot: { x: 9.6, y: 86.2, w: 80.8, h: 11.2 }
    }
  ],
  Burgers: [
    {
      id: "eden-burger-cheese",
      name: "Eden Burger with Cheese on Top",
      price: "$16.99",
      image: "assets/detail-burger-cheese-4k.webp",
      description: "Premium beef, melted cheddar crown, fresh lettuce, tomato, onion, Eden sauce, and fries.",
      ingredients: ["beef patty", "cheddar cheese", "lettuce", "tomato", "onion", "Eden sauce", "fries"],
      hotspot: { x: 2.2, y: 26.3, w: 95.8, h: 23.6 }
    },
    {
      id: "chicken-burger",
      name: "Chicken Burger",
      price: "$14.99",
      image: "assets/detail-burger-chicken-4k.webp",
      description: "Crispy chicken, creamy slaw, toasted brioche, fries, and house ketchup.",
      ingredients: ["crispy chicken", "creamy slaw", "brioche bun", "fries", "ketchup"],
      hotspot: { x: 2.2, y: 51.4, w: 95.8, h: 22.3 }
    },
    {
      id: "eden-burger",
      name: "Eden Burger",
      price: "$14.99",
      image: "assets/detail-burger-eden-4k.webp",
      description: "Beef patty, cheddar, lettuce, tomato, red onion, signature Eden sauce, and fries.",
      ingredients: ["beef patty", "cheddar", "lettuce", "tomato", "red onion", "Eden sauce", "fries"],
      hotspot: { x: 2.2, y: 74.7, w: 95.8, h: 21.8 }
    }
  ],
  "Heavy Blend": [
    {
      id: "black-ice-storm",
      name: "Black Ice Storm",
      image: "assets/detail-hookah-heavy-black-ice-storm.webp",
      description: "A chilled dark blend with Supernova's crisp edge and Red Tea's deep body. Cold, serious, and long-lasting with a bold lounge-style finish.",
      ingredients: ["DarkSide Supernova 40%", "DarkSide Red Tea 60%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 2, y: 38.2, w: 31, h: 31.2 }
    },
    {
      id: "grape-strong",
      name: "Grape Strong",
      image: "assets/detail-hookah-heavy-grape-strong.webp",
      description: "Dark grape intensity with a cool Supernova finish; rich, saturated, and built for guests who like a powerful pull.",
      ingredients: ["DarkSide Grape Core 70%", "DarkSide Supernova 30%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 34, y: 38.2, w: 32, h: 31.2 }
    },
    {
      id: "cola-ice-heavy",
      name: "Cola Ice Heavy",
      image: "assets/detail-hookah-heavy-cola-ice-heavy.webp",
      description: "Cola sweetness over an icy dark base, giving a bold soda-style profile with a clean frozen finish.",
      ingredients: ["DarkSide Cola 70%", "DarkSide Supernova 30%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 67, y: 38.2, w: 31, h: 31.2 }
    },
    {
      id: "wild-berry-strong",
      name: "Wild Berry Strong",
      image: "assets/detail-hookah-heavy-wild-berry-strong.webp",
      description: "Wild berry depth with a dark, electric finish; fruity on the nose and heavier through the smoke.",
      ingredients: ["DarkSide Wild Berry 70%", "DarkSide Supernova 30%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 10, y: 69.8, w: 38, h: 28.2 }
    },
    {
      id: "tropical-cola",
      name: "Tropical Cola",
      image: "assets/detail-hookah-heavy-tropical-cola.webp",
      description: "Tropical brightness meets dark cola body for a bold, unusual mix with sweet lift and a dense finish.",
      ingredients: ["Must Have Space Flavor 60%", "DarkSide Cola 40%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 52, y: 69.8, w: 38, h: 28.2 }
    }
  ],
  "Balanced Blend": [
    {
      id: "blue-berry-mix",
      name: "Blue Berry Mix",
      image: "assets/detail-hookah-balanced-blue-berry-mix.webp",
      description: "A polished berry profile with blueberry sweetness, wild berry depth, and soft mint to keep the smoke fresh.",
      ingredients: ["Must Have Blueberry 50%", "DarkSide Wild Berry 30%", "Serbetli Soft Mint 20%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 2, y: 38.2, w: 31, h: 31.2 }
    },
    {
      id: "peach-tea",
      name: "Peach Tea",
      image: "assets/detail-hookah-balanced-peach-tea.webp",
      description: "Juicy peach over red tea warmth with a mint finish; smooth, aromatic, and easy to enjoy.",
      ingredients: ["Must Have Peach 50%", "DarkSide Red Tea 30%", "Serbetli Soft Mint 20%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 34, y: 38.2, w: 32, h: 31.2 }
    },
    {
      id: "citrus-balance",
      name: "Citrus Balance",
      image: "assets/detail-hookah-balanced-citrus-balance.webp",
      description: "Lemon-lime and grapefruit give this blend a crisp citrus sparkle while soft mint rounds the finish.",
      ingredients: ["Must Have Lemon Lime 50%", "Must Have Grapefruit 30%", "Serbetli Soft Mint 20%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 67, y: 38.2, w: 31, h: 31.2 }
    },
    {
      id: "mango-mix",
      name: "Mango Mix",
      image: "assets/detail-hookah-balanced-mango-mix.webp",
      description: "Mango and pineapple bring tropical sweetness, softened by mint for a balanced and sunny smoke.",
      ingredients: ["Must Have Mango 50%", "Must Have Pineapple 30%", "Serbetli Soft Mint 20%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 10, y: 69.8, w: 38, h: 28.2 }
    },
    {
      id: "strong-tea",
      name: "Strong Tea",
      image: "assets/detail-hookah-balanced-strong-tea.webp",
      description: "A tea-forward balanced blend with red tea brightness and DarkSide Core depth for a clean, refined pull.",
      ingredients: ["DarkSide Red Tea 60%", "DarkSide Core 40%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 52, y: 69.8, w: 38, h: 28.2 }
    }
  ],
  "Light & Smooth Blend": [
    {
      id: "watermelon-fresh",
      name: "Watermelon Fresh",
      image: "assets/detail-hookah-light-watermelon-fresh.webp",
      description: "Fresh watermelon with soft mint; juicy, clean, and cooling without feeling heavy.",
      ingredients: ["Serbetli Watermelon 70%", "Serbetli Soft Mint 30%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 5, y: 39.8, w: 43, h: 30.2 }
    },
    {
      id: "pink-berry",
      name: "Pink Berry",
      image: "assets/detail-hookah-light-pink-berry.webp",
      description: "Strawberry and raspberry sweetness lifted by soft mint; bright, gentle, and easy.",
      ingredients: ["Serbetli Strawberry 50%", "Serbetli Raspberry 30%", "Serbetli Soft Mint 20%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 51, y: 39.8, w: 43, h: 30.2 }
    },
    {
      id: "tropical-light",
      name: "Tropical Light",
      image: "assets/detail-hookah-light-tropical-light.webp",
      description: "Pineapple, mango, and coconut in a softer tropical blend with a creamy, refreshing finish.",
      ingredients: ["Serbetli Pineapple 50%", "Serbetli Mango 30%", "Serbetli Coconut 20%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 5, y: 70, w: 43, h: 28 }
    },
    {
      id: "citrus-fresh",
      name: "Citrus Fresh",
      image: "assets/detail-hookah-light-citrus-fresh.webp",
      description: "Lemon and lime sharpen the profile while soft mint keeps it smooth and refreshing.",
      ingredients: ["Serbetli Lemon 50%", "Serbetli Lime 30%", "Serbetli Soft Mint 20%"],
      optionsTitle: "Blend Ingredients",
      detailType: "hookah",
      hotspot: { x: 51, y: 70, w: 43, h: 28 }
    }
  ]
};

const addButtonLayouts = {
  "Main Course": [
    { name: "Rib Eye Steak", x: 91.5, y: 57.5 },
    { name: "Grilled Sea Bass", x: 41.5, y: 94.5 }
  ],
  Sides: [
    { name: "Eden Cheese Fries", x: 93.5, y: 36.5 },
    { name: "French Fries", x: 93.5, y: 50.3 },
    { name: "Garlic Fries", x: 93.5, y: 64.1 },
    { name: "Grilled Vegetables", x: 93.5, y: 77.9 },
    { name: "Rice", x: 93.5, y: 91.6 }
  ],
  Appetizers: [
    { name: "Wings BBQ, Blu, Buffalo", x: 91.5, y: 19.6 },
    { name: "Fried Mixed Seafood", x: 91.5, y: 35.2 },
    { name: "Dynamite Shrimp", x: 91.5, y: 50.7 },
    { name: "Fried Mozzarella", x: 91.5, y: 66.2 },
    { name: "Fried Calamari", x: 91.5, y: 81.7 },
    { name: "Chicken Nuggets", x: 91.5, y: 96.2 }
  ],
  Coffees: [
    { name: "Hot Coffee", x: 10.7, y: 37.4 },
    { name: "Cappuccino", x: 81.1, y: 35.1 },
    { name: "Espresso", x: 10.7, y: 70.5 },
    { name: "Latte", x: 81.1, y: 70.5 }
  ],
  "Hot Teas": [
    { name: "Green and Black Tea", x: 9.7, y: 33.5 },
    { name: "Eden Special Fruit Tea", x: 79.6, y: 45.2 },
    { name: "Moroccan Tea", x: 19.2, y: 58.4 },
    { name: "Cranberry Tangerine", x: 79.6, y: 72.4 },
    { name: "Maracuya Tea", x: 19.2, y: 86.1 }
  ],
  "Iced Teas": [
    { name: "Eden Royal Tea", x: 78, y: 37 },
    { name: "Eden Peach Garden", x: 20, y: 63 },
    { name: "Citrus Sunset", x: 80, y: 63 },
    { name: "Wild Berry Fusion", x: 20, y: 86 },
    { name: "Green Apple Breeze", x: 80, y: 86 }
  ],
  Milkshakes: [
    { name: "Strawberry Milkshake", x: 11, y: 44.5 },
    { name: "Oreo and Cookie Milkshake", x: 18, y: 80.2 },
    { name: "Chocolate Milkshake", x: 49.2, y: 80.2 },
    { name: "Vanilla Milkshake", x: 80.4, y: 80.2 }
  ],
  Lemonades: [
    { name: "Virgin Mojito", x: 50, y: 40 },
    { name: "Mango Maracuya", x: 20, y: 63 },
    { name: "Strawberry Mango Mojito", x: 80, y: 63 },
    { name: "Kiwi Lychee", x: 20, y: 86 },
    { name: "Summer Splash", x: 80, y: 86 }
  ],
  "Soft Drinks": [
    { name: "Cola", x: 76, y: 28.2 },
    { name: "Sprite", x: 88, y: 49.2 },
    { name: "Red Bull", x: 10.6, y: 62.3 },
    { name: "Saratoga Sparkling", x: 60.2, y: 77.6 },
    { name: "Saratoga Still", x: 88.2, y: 83.5 }
  ],
  Desserts: [
    { name: "Frozen Brew Treats", x: 68, y: 36 },
    { name: "Cheese Cake", x: 28, y: 78 },
    { name: "Lava Cake", x: 78, y: 78 }
  ]
};

const quickOrderHotspots = {
  Coffees: [
    { x: 2, y: 28, w: 46, h: 28 },
    { x: 52, y: 28, w: 46, h: 28 },
    { x: 2, y: 61, w: 46, h: 28 },
    { x: 52, y: 61, w: 46, h: 28 }
  ],
  "Hot Teas": [
    { x: 2, y: 14, w: 96, h: 17 },
    { x: 2, y: 31, w: 96, h: 15 },
    { x: 2, y: 47, w: 96, h: 15 },
    { x: 2, y: 63, w: 96, h: 15 },
    { x: 2, y: 79, w: 96, h: 15 }
  ],
  "Iced Teas": [
    { x: 34, y: 8, w: 63, h: 39 },
    { x: 2, y: 48, w: 47, h: 23 },
    { x: 51, y: 48, w: 47, h: 23 },
    { x: 2, y: 72, w: 47, h: 23 },
    { x: 51, y: 72, w: 47, h: 23 }
  ],
  Milkshakes: [
    { x: 4, y: 24, w: 92, h: 30 },
    { x: 3, y: 57, w: 30, h: 30 },
    { x: 35, y: 57, w: 30, h: 30 },
    { x: 67, y: 57, w: 30, h: 30 }
  ],
  Lemonades: [
    { x: 22, y: 17, w: 56, h: 36 },
    { x: 1, y: 50, w: 45, h: 22 },
    { x: 54, y: 50, w: 45, h: 22 },
    { x: 1, y: 72, w: 45, h: 25 },
    { x: 54, y: 72, w: 45, h: 25 }
  ],
  "Soft Drinks": [
    { x: 40, y: 4, w: 40, h: 48 },
    { x: 62, y: 32, w: 36, h: 32 },
    { x: 1, y: 49, w: 39, h: 39 },
    { x: 32, y: 61, w: 35, h: 35 },
    { x: 66, y: 65, w: 32, h: 31 }
  ],
  Desserts: [
    { x: 38, y: 6, w: 59, h: 45 },
    { x: 2, y: 52, w: 48, h: 42 },
    { x: 51, y: 52, w: 47, h: 42 }
  ]
};

const quickOrderSections = new Set(Object.keys(quickOrderHotspots));

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const quickOrderImages = {
  "Hot Coffee": "assets/coffee.png",
  Cappuccino: "assets/cappuccino.png",
  Espresso: "assets/espresso.png",
  Latte: "assets/latte.png",
  "Green and Black Tea": "assets/green and black teas.png",
  "Eden Special Fruit Tea": "assets/eden special fruit tea.png",
  "Moroccan Tea": "assets/Morrocan Tea.png",
  "Cranberry Tangerine": "assets/Tangerine Tea.png",
  "Maracuya Tea": "assets/Maracuya tea.png",
  "Eden Royal Tea": "assets/Eden Royal tea.png",
  "Eden Peach Garden": "assets/Eden peach garden.png",
  "Citrus Sunset": "assets/Sunset citrus.png",
  "Wild Berry Fusion": "assets/wild berry fusion.png",
  "Green Apple Breeze": "assets/green apple breeze.png",
  "Strawberry Milkshake": "assets/strawberry milkshake.png",
  "Oreo and Cookie Milkshake": "assets/oreo milkshake.png",
  "Chocolate Milkshake": "assets/Chocolate milkshake.png",
  "Vanilla Milkshake": "assets/vanilla milkshake.png",
  "Virgin Mojito": "assets/mojito.png",
  "Mango Maracuya": "assets/mango maracuya.png",
  "Strawberry Mango Mojito": "assets/strawberry mango.png",
  "Kiwi Lychee": "assets/kiwi lychee.png",
  "Summer Splash": "assets/apple cucumber.png",
  Cola: "assets/cola.png",
  Sprite: "assets/sprite.png",
  "Red Bull": "assets/Redbull.png",
  "Saratoga Sparkling": "assets/saratoga sparkling.png",
  "Saratoga Still": "assets/saratoga still.png",
  "Frozen Brew Treats": "assets/frozen fruit.png",
  "Cheese Cake": "assets/cheesecake.png",
  "Lava Cake": "assets/lava cake.png"
};

Object.entries(quickOrderHotspots).forEach(([section, hotspots]) => {
  (addButtonLayouts[section] || []).forEach((item, index) => {
    item.hotspot = hotspots[index];
    item.image = quickOrderImages[item.name] || `assets/order-thumbs/${slugify(section)}-${slugify(item.name)}.png`;
  });
});

const basketImageByName = new Map();

Object.values(itemGroups).forEach((group) => {
  group.forEach((item) => basketImageByName.set(item.name, item.image));
});

Object.values(addButtonLayouts).forEach((layout) => {
  layout.forEach((item) => {
    if (item.image) {
      basketImageByName.set(item.name, item.image);
    }
  });
});

function isMenuFallbackImage(image = "") {
  return /(?:menu-page|page-4k|coming-soon|eden-opening)/.test(image) && !image.includes("detail-") && !image.includes("order-thumbs/");
}

function resolveBasketImage(name, providedImage = "") {
  if (providedImage && !isMenuFallbackImage(providedImage)) {
    return providedImage;
  }
  const cleanName = name.split(" - ")[0];
  return basketImageByName.get(cleanName) || providedImage || "assets/eden-opening-clean-4k.webp";
}

let activeMenu = "food";
let activeSection = "";
let activeItemGroup = "";
let activeItemId = "";
let detailQty = 1;
let activeQuickOrder = null;
let activeQuickOrderQty = 1;
let basketOpen = false;
const basketLines = new Map();

let width = 1;
let height = 1;
let dpr = 1;
let sparks = [];
let lastSparkFrame = 0;
let transitionTimer = 0;
const transitionSwapDelay = 86;
const transitionDuration = 420;
const imagePreloadCache = new Map();
let navigationToken = 0;

function splitImageQuery(src = "") {
  const [path, ...queryParts] = src.split("?");
  return {
    path,
    query: queryParts.length ? `?${queryParts.join("?")}` : ""
  };
}

function optimizedImageSrc(src = "") {
  const { path, query } = splitImageQuery(src);
  if (!path.endsWith(".webp") || path.endsWith("-ipad.webp")) {
    return src;
  }
  return `${path.replace(/\.webp$/, "-ipad.webp")}${query}`;
}

function responsiveImageSet(src = "") {
  const optimized = optimizedImageSrc(src);
  if (optimized === src) {
    return "";
  }
  return `${optimized} 2048w, ${src} 4096w`;
}

function runTransition(type = "page") {
  clearTimeout(transitionTimer);
  shell.classList.remove("is-transitioning");
  shell.dataset.transition = type;
  void shell.offsetWidth;
  shell.classList.add("is-transitioning");
  transitionTimer = setTimeout(() => {
    shell.classList.remove("is-transitioning");
    delete shell.dataset.transition;
  }, transitionDuration);
}

function preloadImage(src, priority = "auto", decode = false) {
  if (!src) {
    return Promise.resolve(false);
  }

  const imageSrc = optimizedImageSrc(src);
  if (imagePreloadCache.has(imageSrc)) {
    return imagePreloadCache.get(imageSrc);
  }

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.fetchPriority = priority;
    const srcset = responsiveImageSet(src);
    if (srcset) {
      img.srcset = srcset;
      img.sizes = "100vw";
    }
    img.onload = () => {
      if (decode && img.decode) {
        img.decode().then(() => resolve(true)).catch(() => resolve(true));
        return;
      }
      resolve(true);
    };
    img.onerror = () => resolve(false);
    img.src = imageSrc;
  });
  imagePreloadCache.set(imageSrc, promise);
  return promise;
}

function warmImages(srcs, priority = "auto") {
  srcs.filter(Boolean).forEach((src) => {
    preloadImage(src, priority);
  });
}

function setImageSource(img, src, alt = "", priority = "high") {
  const imageSrc = optimizedImageSrc(src);
  const srcset = responsiveImageSet(src);
  img.decoding = "async";
  img.fetchPriority = priority;
  if (srcset) {
    img.srcset = srcset;
    img.sizes = "100vw";
  } else {
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
  }
  if (img.getAttribute("src") !== imageSrc) {
    img.src = imageSrc;
  }
  img.alt = alt;
  preloadImage(src, priority);
}

function setDecodedImage(img, src, alt = "") {
  setImageSource(img, src, alt);
  preloadImage(src, "high", true);
  if (img.decode) {
    return img.decode().catch(() => true);
  }
  if (img.complete) {
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}

function warmMenuImages() {
  const menuImages = Object.values(menuPages).map((page) => page.src);
  warmImages(menuImages, "high");
}

function sectionImageSources(name) {
  const page = sectionPages[name];
  return page ? page.pages || [page.src] : [];
}

function warmSectionsForMenu(menu) {
  const sectionImages = (menuSectionNames[menu] || []).flatMap(sectionImageSources);
  const dessertImages = menu === "desserts" ? (addButtonLayouts.Desserts || []).map((item) => item.image) : [];
  warmImages([...sectionImages, ...dessertImages], "high");
}

function updateMenuSectionLabels(menu) {
  document.querySelectorAll("[data-open-section]").forEach((button, index) => {
    const sectionNameForMenu = menuSectionNames[menu]?.[index] || button.dataset.openSection;
    button.setAttribute("aria-label", `Open ${sectionNameForMenu.toLowerCase()}`);
  });
}

function preloadSection(name) {
  warmImages(sectionImageSources(name), "high");
}

function warmDetailImages() {
  const detailImages = Object.values(itemGroups).flatMap((group) => group.map((item) => item.image));
  const orderImages = Object.values(addButtonLayouts)
    .flatMap((layout) => layout.map((item) => item.image))
    .filter(Boolean);
  warmImages([...detailImages, ...orderImages], "low");
}

function warmSourcesInBatches(sources, options = {}) {
  const { batchSize = 4, delay = 260, priority = "low" } = options;
  const uniqueSources = Array.from(new Set(sources.filter(Boolean)));
  let index = 0;

  const warmNextBatch = () => {
    const batch = uniqueSources.slice(index, index + batchSize);
    warmImages(batch, priority);
    index += batch.length;
    if (index < uniqueSources.length) {
      setTimeout(warmNextBatch, delay);
    }
  };

  warmNextBatch();
}

function warmAllMenuImages() {
  const sectionImages = Object.keys(sectionPages).flatMap(sectionImageSources);
  const menuImages = Object.values(menuPages).map((page) => page.src);
  warmSourcesInBatches(menuImages, { batchSize: 2, delay: 420, priority: "auto" });
  setTimeout(() => warmSourcesInBatches(sectionImages, { batchSize: 2, delay: 520, priority: "low" }), 3000);
}

function warmInteractiveImagesInBatches() {
  const sources = [
    ...Object.values(itemGroups).flatMap((group) => group.map((item) => item.image)),
    ...Object.values(addButtonLayouts).flatMap((layout) => layout.map((item) => item.image).filter(Boolean))
  ].filter(Boolean);
  warmSourcesInBatches(sources, { batchSize: 4, delay: 300, priority: "low" });
}

async function openMenu(category) {
  const token = ++navigationToken;
  if (category === "specials") {
    activeMenu = "food";
    shell.dataset.activeMenu = "food";
    await openSection("Specials");
    return;
  }

  activeMenu = menuPages[category] ? category : "food";
  menuScreen.classList.add("is-preparing");
  warmImages([menuPages[activeMenu].src], "high");
  setImageSource(menuArt, menuPages[activeMenu].src, menuPages[activeMenu].alt);
  if (token !== navigationToken) {
    return;
  }
  shell.dataset.menuAspect = menuPages[activeMenu].aspect || "two-three";
  shell.dataset.activeMenu = activeMenu;
  updateMenuSectionLabels(activeMenu);
  menuScreen.classList.remove("is-preparing");
  runTransition();
  warmSectionsForMenu(activeMenu);
  setTimeout(() => {
    if (token !== navigationToken) {
      return;
    }
    shell.dataset.screen = "menu";
    renderMenuAddButtons(activeMenu === "desserts" ? "Desserts" : "");
    closeQuickOrder();
    closeOrderReview();
    closeBasketPanel();
  }, transitionSwapDelay);
}

function closeMenu() {
  navigationToken += 1;
  menuScreen.classList.remove("is-preparing");
  runTransition();
  shell.dataset.screen = "opening";
  clearMenuAddButtons();
  closeQuickOrder();
  closeOrderReview();
  closeBasketPanel();
}

async function openSection(name) {
  const token = ++navigationToken;
  sectionScreen.classList.add("is-preparing");
  clearAddButtons();
  clearItemHotspots();
  sectionScrollStack.replaceChildren();
  sectionScrollStack.setAttribute("aria-hidden", "true");
  activeSection = name || menuPages[activeMenu].defaultSection;
  const comingSoon = comingSoonSections[activeSection];
  sectionName.textContent = comingSoon?.title || activeSection;
  sectionEyebrow.textContent = comingSoon?.eyebrow || "EDEN Food Menu";
  sectionDescription.textContent = comingSoon?.description || "Item page ready for dishes, descriptions, prices, photos, and add-to-order controls.";
  const page = sectionPages[name];
  const pageImages = page ? page.pages || [page.src] : [menuPages[activeMenu].src];
  warmImages(pageImages, "high");
  if (token !== navigationToken) {
    return;
  }
  sectionScreen.classList.toggle("is-coming-soon", Boolean(comingSoon));
  sectionScreen.classList.toggle("needs-back-overlay", Boolean(page?.needsBackOverlay || overlayBackSections.has(name)));
  sectionScreen.classList.remove("has-scroll");
  if (page) {
    if (page.pages?.length) {
      sectionScreen.classList.add("has-scroll");
      sectionScrollStack.setAttribute("aria-hidden", "false");
      const scrollImages = page.pages.map((src, index) => {
        const img = document.createElement("img");
        img.className = "section-scroll-art";
        setImageSource(img, src, index === 0 ? page.alt : `${page.alt} page ${index + 1}`);
        return { img, src, alt: index === 0 ? page.alt : `${page.alt} page ${index + 1}` };
      });
      scrollImages.forEach(({ img }) => sectionScrollStack.appendChild(img));
      sectionScrollStack.scrollTop = 0;
    }
    setImageSource(sectionArt, page.src, page.alt);
    if (token !== navigationToken) {
      return;
    }
    shell.dataset.sectionAspect = page.aspect || "two-three";
    sectionScreen.classList.add("has-image");
  } else {
    setImageSource(sectionArt, menuPages[activeMenu].src, "");
    if (token !== navigationToken) {
      return;
    }
    shell.dataset.sectionAspect = menuPages[activeMenu].aspect || "two-three";
    sectionScreen.classList.remove("has-image");
  }
  sectionScreen.classList.remove("is-preparing");
  runTransition();
  setTimeout(() => {
    if (token !== navigationToken) {
      return;
    }
    shell.dataset.screen = "section";
    clearAddButtons();
    renderItemHotspots(name);
    closeQuickOrder();
    closeOrderReview();
    closeBasketPanel();
  }, transitionSwapDelay);
}

function closeSection() {
  navigationToken += 1;
  sectionScreen.classList.remove("is-preparing");
  runTransition();
  shell.dataset.screen = activeSection === "Specials" ? "opening" : "menu";
  clearAddButtons();
  clearItemHotspots();
  sectionScreen.classList.remove("needs-back-overlay", "has-scroll", "is-coming-soon");
  sectionScrollStack.replaceChildren();
  sectionScrollStack.setAttribute("aria-hidden", "true");
  closeQuickOrder();
  closeOrderReview();
  closeBasketPanel();
}

function closeItemDetail() {
  navigationToken += 1;
  runTransition("detail");
  shell.dataset.screen = "section";
  closeQuickOrder();
  closeOrderReview();
  closeBasketPanel();
}

function returnToOpeningPage() {
  navigationToken += 1;
  menuScreen.classList.remove("is-preparing");
  sectionScreen.classList.remove("is-preparing", "needs-back-overlay", "has-scroll", "is-coming-soon");
  sectionScrollStack.replaceChildren();
  sectionScrollStack.setAttribute("aria-hidden", "true");
  clearMenuAddButtons();
  clearAddButtons();
  clearItemHotspots();
  closeQuickOrder();
  closeOrderReview();
  closeBasketPanel();
  runTransition();
  shell.dataset.screen = "opening";
}

async function openItemDetail(groupName, itemId) {
  const token = ++navigationToken;
  const group = itemGroups[groupName] || [];
  const item = group.find((entry) => entry.id === itemId) || group[0];
  if (!item) {
    return;
  }

  activeItemGroup = groupName;
  activeItemId = item.id;
  detailQty = 1;
  preloadImage(item.image, "high");
  if (token !== navigationToken) {
    return;
  }
  renderItemDetail(item);
  runTransition("detail");
  setTimeout(() => {
    if (token !== navigationToken) {
      return;
    }
    shell.dataset.screen = "item";
    closeBasketPanel();
  }, transitionSwapDelay);
}

function clearAddButtons() {
  addButtons.replaceChildren();
  sectionScreen.classList.remove("has-add-buttons");
}

function clearItemHotspots() {
  itemHotspots.replaceChildren();
  sectionScreen.classList.remove("has-item-hotspots");
}

function renderItemHotspots(section) {
  clearItemHotspots();
  const group = itemGroups[section] || [];
  if (group.length) {
    sectionScreen.classList.add("has-item-hotspots");
    warmImages(group.map((item) => item.image), "high");
    group.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "item-hotspot";
      button.style.left = `${item.hotspot.x}%`;
      button.style.top = `${item.hotspot.y}%`;
      button.style.width = `${item.hotspot.w}%`;
      button.style.height = `${item.hotspot.h}%`;
      button.setAttribute("aria-label", `Open ${item.name}`);
      button.addEventListener("pointerenter", () => preloadImage(item.image, "high"));
      button.addEventListener("touchstart", () => preloadImage(item.image, "high"), { passive: true });
      button.addEventListener("click", () => openItemDetail(section, item.id));
      itemHotspots.appendChild(button);
    });
    return;
  }

  if (quickOrderSections.has(section)) {
    sectionScreen.classList.add("has-item-hotspots");
    renderQuickOrderHotspots(itemHotspots, section);
  }
}

function renderQuickOrderHotspots(container, section) {
  const layout = addButtonLayouts[section] || [];
  layout.forEach((item) => {
    const hotspot = item.hotspot || { x: item.x - 8, y: item.y - 8, w: 16, h: 16 };
    const button = document.createElement("button");
    button.type = "button";
    button.className = "item-hotspot quick-order-hotspot";
    button.style.left = `${hotspot.x}%`;
    button.style.top = `${hotspot.y}%`;
    button.style.width = `${hotspot.w}%`;
    button.style.height = `${hotspot.h}%`;
    button.setAttribute("aria-label", `Order ${item.name}`);
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openQuickOrder(section, item);
    });
    container.appendChild(button);
  });
}

function clearMenuAddButtons() {
  menuAddButtons.replaceChildren();
  document.querySelector(".menu-screen").classList.remove("has-add-buttons");
}

function renderMenuAddButtons(section) {
  clearMenuAddButtons();
  if (!quickOrderSections.has(section)) {
    return;
  }
  document.querySelector(".menu-screen").classList.add("has-add-buttons");
  renderQuickOrderHotspots(menuAddButtons, section);
}

function renderAddButtons(section) {
  clearAddButtons();
}

function createAddButtons(container, layout, section) {
  layout.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "add-food-button";
    button.style.left = `${item.x}%`;
    button.style.top = `${item.y}%`;
    button.style.setProperty("--delay", `${index * 55}ms`);
    button.dataset.itemName = item.name;
    button.setAttribute("aria-label", `Add ${item.name} to basket`);
    button.textContent = "Add";
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addToBasket(item.name, resolveBasketImage(item.name, item.image));
    });
    container.appendChild(button);
  });
}

function renderItemDetail(item) {
  const group = itemGroups[activeItemGroup] || [];
  const isHookahDetail = item.detailType === "hookah";
  setImageSource(itemImage, item.image, item.name);
  itemKicker.textContent = isHookahDetail ? `EDEN Hookah - ${activeItemGroup}` : `EDEN ${activeItemGroup}`;
  itemTitle.textContent = item.name;
  itemDescription.textContent = item.description;
  itemPrice.textContent = item.price || "";
  itemPrice.hidden = isHookahDetail || !item.price;
  itemQty.textContent = detailQty;
  itemInstructions.value = "";
  itemDetailScreen.dataset.group = activeItemGroup.toLowerCase();
  itemDetailScreen.dataset.mode = isHookahDetail ? "hookah" : "order";
  itemInstructionsGroup.hidden = isHookahDetail;
  itemActions.hidden = isHookahDetail;

  itemAddons.replaceChildren();
  const ingredients = item.ingredients || [];
  itemOptionsTitle.textContent = item.optionsTitle || (ingredients.length ? "Ingredients" : "No Add Ons");
  itemAddons.closest(".item-options").hidden = !ingredients.length;
  ingredients.forEach((label) => {
    const ingredient = document.createElement("span");
    ingredient.className = "ingredient-chip";
    ingredient.textContent = label;
    itemAddons.appendChild(ingredient);
  });

  itemSelector.replaceChildren();
  group.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "selector-card";
    button.classList.toggle("is-active", entry.id === item.id);
    button.setAttribute("aria-label", `View ${entry.name}`);
    button.innerHTML = `<img src="${optimizedImageSrc(entry.image)}" alt="" loading="lazy" decoding="async"><span>${entry.name}</span>`;
    button.addEventListener("pointerenter", () => preloadImage(entry.image, "high"));
    button.addEventListener("touchstart", () => preloadImage(entry.image, "high"), { passive: true });
    button.addEventListener("click", () => openItemDetail(activeItemGroup, entry.id));
    itemSelector.appendChild(button);
  });
}

function changeDetailQty(delta) {
  detailQty = Math.max(1, Math.min(12, detailQty + delta));
  itemQty.textContent = detailQty;
}

function addCurrentDetailToBasket() {
  const group = itemGroups[activeItemGroup] || [];
  const item = group.find((entry) => entry.id === activeItemId);
  if (!item || item.detailType === "hookah") {
    return;
  }
  const note = itemInstructions.value.trim();
  const itemName = note ? `${item.name} - ${note}` : item.name;
  for (let index = 0; index < detailQty; index += 1) {
    addToBasket(itemName, item.image);
  }
}

function openQuickOrder(section, item) {
  if (!quickOrder || !item) {
    return;
  }
  const image = resolveBasketImage(item.name, item.image);
  activeQuickOrder = { section, ...item, image };
  activeQuickOrderQty = 1;
  setImageSource(quickOrderImage, image, item.name);
  quickOrderKicker.textContent = `EDEN ${section}`;
  quickOrderName.textContent = item.name;
  quickOrderInstructions.value = "";
  quickOrderQty.textContent = activeQuickOrderQty;
  quickOrder.hidden = false;
  closeBasketPanel();
  requestAnimationFrame(() => quickOrder.classList.add("is-open"));
}

function closeQuickOrder() {
  if (!quickOrder) {
    return;
  }
  quickOrder.classList.remove("is-open");
  setTimeout(() => {
    if (!quickOrder.classList.contains("is-open")) {
      quickOrder.hidden = true;
    }
  }, 220);
}

function changeQuickOrderQty(delta) {
  activeQuickOrderQty = Math.max(1, Math.min(12, activeQuickOrderQty + delta));
  quickOrderQty.textContent = activeQuickOrderQty;
}

function addCurrentQuickOrderToBasket() {
  if (!activeQuickOrder) {
    return;
  }
  const note = quickOrderInstructions.value.trim();
  const itemName = note ? `${activeQuickOrder.name} - ${note}` : activeQuickOrder.name;
  for (let index = 0; index < activeQuickOrderQty; index += 1) {
    addToBasket(itemName, activeQuickOrder.image);
  }
  closeQuickOrder();
}

function addToBasket(name, image = "") {
  const safeImage = resolveBasketImage(name, image);
  const existing = basketLines.get(name) || { count: 0, image: safeImage };
  existing.count += 1;
  if (!existing.image || isMenuFallbackImage(existing.image)) {
    existing.image = safeImage;
  }
  basketLines.set(name, existing);
  renderBasket();
  basket.classList.add("basket-pulse");
  setTimeout(() => basket.classList.remove("basket-pulse"), 420);
}

function splitOrderName(name) {
  const [title, ...noteParts] = name.split(" - ");
  return {
    title,
    note: noteParts.join(" - ")
  };
}

function serializeOrderItems() {
  return Array.from(basketLines.entries()).map(([name, line]) => {
    const { title, note } = splitOrderName(name);
    return {
      name: title,
      note,
      quantity: line.count,
      image: resolveBasketImage(title, line.image || ""),
      ordered_at: new Date().toISOString()
    };
  });
}

function summarizeOrderItems(items) {
  return items
    .map((item) => `${item.quantity}x ${item.name}${item.note ? ` (${item.note})` : ""}`)
    .join(", ")
    .slice(0, 500);
}

function getLegacyOrderPageUrl(orderItems) {
  const encodedOrder = encodeURIComponent(JSON.stringify(orderItems));
  return `${window.location.href.split("#")[0]}#eden_order=${encodedOrder}`;
}

function removeBasketLine(name) {
  basketLines.delete(name);
  renderBasket();
}

function changeBasketQuantity(name, delta) {
  const line = basketLines.get(name);
  if (!line) {
    return;
  }
  line.count += delta;
  if (line.count <= 0) {
    basketLines.delete(name);
  } else {
    basketLines.set(name, line);
  }
  renderBasket();
}

function createBasketQuantityControl(name, count, variant) {
  const control = document.createElement("div");
  const minus = document.createElement("button");
  const qty = document.createElement("b");
  const plus = document.createElement("button");
  const isReview = variant === "review";
  const controlClass = isReview ? "order-review-quantity" : "basket-item-quantity";
  const buttonClass = isReview ? "order-review-qty-button" : "basket-qty-button";
  const { title } = splitOrderName(name);

  control.className = controlClass;
  control.setAttribute("aria-label", `Quantity for ${title}`);
  minus.type = "button";
  minus.className = buttonClass;
  minus.setAttribute("aria-label", `Decrease ${title} quantity`);
  minus.textContent = "-";
  minus.addEventListener("click", (event) => {
    event.stopPropagation();
    changeBasketQuantity(name, -1);
  });

  qty.textContent = count;

  plus.type = "button";
  plus.className = buttonClass;
  plus.setAttribute("aria-label", `Increase ${title} quantity`);
  plus.textContent = "+";
  plus.addEventListener("click", (event) => {
    event.stopPropagation();
    changeBasketQuantity(name, 1);
  });

  control.append(minus, qty, plus);
  return control;
}

function renderBasket() {
  const total = Array.from(basketLines.values()).reduce((sum, line) => sum + line.count, 0);
  basketCount.textContent = total;
  basketEmpty.hidden = total > 0;
  if (viewOrderButton) {
    viewOrderButton.hidden = total === 0;
  }
  basketItems.replaceChildren();

  basketLines.forEach((line, name) => {
    const item = document.createElement("li");
    const thumb = document.createElement("img");
    const copy = document.createElement("div");
    const label = document.createElement("span");
    const qty = createBasketQuantityControl(name, line.count, "basket");
    const remove = document.createElement("button");
    const { title, note } = splitOrderName(name);
    thumb.className = "basket-item-thumb";
    thumb.src = optimizedImageSrc(line.image || "assets/eden-opening-clean-4k.webp");
    thumb.alt = "";
    copy.className = "basket-item-copy";
    label.textContent = title;
    if (note) {
      label.title = note;
    }
    remove.className = "basket-item-remove";
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${title} from basket`);
    remove.textContent = "×";
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      removeBasketLine(name);
    });
    copy.append(label);
    item.append(thumb, copy, qty, remove);
    basketItems.appendChild(item);
  });

  if (orderReview?.classList.contains("is-open")) {
    renderOrderReview();
  }
}

function closeBasketPanel() {
  basketOpen = false;
  basket.classList.remove("is-open");
}

function toggleBasketPanel() {
  basketOpen = !basketOpen;
  basket.classList.toggle("is-open", basketOpen);
}

function renderOrderReview() {
  if (!orderReviewItems || !orderReviewTotal) {
    return;
  }
  const total = Array.from(basketLines.values()).reduce((sum, line) => sum + line.count, 0);
  orderReviewItems.replaceChildren();
  orderReviewEmpty.hidden = total > 0;
  orderReviewTotal.textContent = `${total} item${total === 1 ? "" : "s"} selected`;

  basketLines.forEach((line, name) => {
    const item = document.createElement("li");
    const thumb = document.createElement("img");
    const copy = document.createElement("div");
    const title = document.createElement("span");
    const note = document.createElement("small");
    const qty = createBasketQuantityControl(name, line.count, "review");
    const remove = document.createElement("button");
    const parts = splitOrderName(name);

    thumb.src = optimizedImageSrc(line.image || "assets/eden-opening-clean-4k.webp");
    thumb.alt = "";
    title.textContent = parts.title;
    note.textContent = parts.note || "No special instructions";
    remove.type = "button";
    remove.className = "order-review-remove";
    remove.setAttribute("aria-label", `Remove ${parts.title} from order`);
    remove.textContent = "×";
    remove.addEventListener("click", () => removeBasketLine(name));

    copy.append(title, note);
    item.append(thumb, copy, qty, remove);
    orderReviewItems.appendChild(item);
  });

  if (total === 0) {
    closeOrderReview();
  }
}

function openOrderReview() {
  if (!orderReview || basketLines.size === 0) {
    return;
  }
  renderOrderReview();
  closeQuickOrder();
  closeBasketPanel();
  orderReview.hidden = false;
  requestAnimationFrame(() => orderReview.classList.add("is-open"));
}

function closeOrderReview() {
  if (!orderReview) {
    return;
  }
  orderReview.classList.remove("is-open");
  setTimeout(() => {
    if (!orderReview.classList.contains("is-open")) {
      orderReview.hidden = true;
    }
  }, 220);
}

function getCurrentTableNumber() {
  const raw = new URLSearchParams(window.location.search).get("table");
  if (!raw) {
    return null;
  }
  const table = Number.parseInt(raw, 10);
  return Number.isFinite(table) && table > 0 ? table : null;
}

function getWaiterCooldownKey(tableNumber) {
  return `eden-waiter-call-${tableNumber || "guest"}`;
}

function resetCallWaiterButton(delay = 3500) {
  setTimeout(() => {
    callWaiterButton.classList.remove("is-called");
    callWaiterLabel.textContent = "Call Waiter";
    callWaiterButton.disabled = false;
  }, delay);
}

async function callWaiter() {
  if (callWaiterButton.disabled) {
    return;
  }

  const tableNumber = getCurrentTableNumber();
  const orderItems = serializeOrderItems();
  const orderTotal = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const cooldownKey = getWaiterCooldownKey(tableNumber);
  const lastCallTime = Number(window.localStorage.getItem(cooldownKey) || 0);
  const isCoolingDown = orderTotal === 0 && Date.now() - lastCallTime < waiterCooldownMs;

  callWaiterButton.disabled = true;
  callWaiterLabel.textContent = isCoolingDown ? "Already Called" : "Calling...";

  if (isCoolingDown) {
    callWaiterButton.classList.add("is-called");
    returnToOpeningPage();
    resetCallWaiterButton();
    return;
  }

  if (!waiterClient) {
    callWaiterLabel.textContent = "Not Connected";
    callWaiterButton.disabled = false;
    return;
  }

  const payload = {
    table_number: tableNumber,
    status: "new",
    order_items: orderItems,
    order_total: orderTotal,
    order_summary: summarizeOrderItems(orderItems),
    page_url: window.location.href,
    user_agent: window.navigator.userAgent.slice(0, 250)
  };

  let { error } = await waiterClient.from(waiterTable).insert(payload);
  if (error && /order_|schema|column/i.test(error.message || "")) {
    const legacyPayload = {
      table_number: tableNumber,
      status: "new",
      page_url: getLegacyOrderPageUrl(orderItems),
      user_agent: window.navigator.userAgent.slice(0, 250)
    };
    const legacyResult = await waiterClient.from(waiterTable).insert(legacyPayload);
    error = legacyResult.error;
  }

  if (error) {
    console.error("Could not send waiter call", error);
    callWaiterLabel.textContent = /order_|schema|column/i.test(error.message || "") ? "Setup Needed" : "Try Again";
    callWaiterButton.disabled = false;
    return;
  }

  window.localStorage.setItem(cooldownKey, String(Date.now()));
  callWaiterButton.classList.add("is-called");
  callWaiterLabel.textContent = "Called";
  returnToOpeningPage();
  resetCallWaiterButton();
}

function resizeCanvas() {
  const rect = opening.getBoundingClientRect();
  dpr = Math.min(window.devicePixelRatio || 1, 3);
  width = Math.max(1, Math.floor(rect.width));
  height = Math.max(1, Math.floor(rect.height));
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createSparks();
}

function createSparks() {
  const count = Math.round(Math.min(92, Math.max(42, width / 11)));
  sparks = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.82,
    r: 0.45 + Math.random() * 1.7,
    drift: -0.12 + Math.random() * 0.24,
    speed: 0.1 + Math.random() * 0.36,
    phase: Math.random() * Math.PI * 2,
    alpha: 0.18 + Math.random() * 0.75
  }));
}

function drawSparks(time) {
  if (time - lastSparkFrame < 50) {
    setTimeout(() => requestAnimationFrame(drawSparks), 80);
    return;
  }
  lastSparkFrame = time;

  if (shell.dataset.screen !== "opening") {
    ctx.clearRect(0, 0, width, height);
    setTimeout(() => requestAnimationFrame(drawSparks), 180);
    return;
  }

  ctx.clearRect(0, 0, width, height);

  for (const spark of sparks) {
    spark.y -= spark.speed;
    spark.x += spark.drift + Math.sin(time * 0.001 + spark.phase) * 0.1;

    if (spark.y < -10) {
      spark.y = height * (0.58 + Math.random() * 0.28);
      spark.x = Math.random() * width;
    }

    const glow = 0.5 + Math.sin(time * 0.004 + spark.phase) * 0.5;
    const gradient = ctx.createRadialGradient(spark.x, spark.y, 0, spark.x, spark.y, spark.r * 7);
    gradient.addColorStop(0, `rgba(255, 240, 165, ${spark.alpha * glow})`);
    gradient.addColorStop(0.28, `rgba(239, 189, 67, ${spark.alpha * 0.5 * glow})`);
    gradient.addColorStop(1, "rgba(239, 130, 15, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, spark.r * 7, 0, Math.PI * 2);
    ctx.fill();
  }

  setTimeout(() => requestAnimationFrame(drawSparks), 80);
}

document.querySelectorAll("[data-open-menu]").forEach((button) => {
  button.addEventListener("click", () => openMenu(button.dataset.category));
  button.addEventListener("pointerenter", () => {
    const category = menuPages[button.dataset.category] ? button.dataset.category : "food";
    warmImages([menuPages[category]?.src], "high");
  });
  button.addEventListener("touchstart", () => {
    const category = menuPages[button.dataset.category] ? button.dataset.category : "food";
    warmImages([menuPages[category]?.src], "high");
  }, { passive: true });
});

basketButton.addEventListener("click", toggleBasketPanel);
viewOrderButton?.addEventListener("click", openOrderReview);
document.querySelectorAll("[data-close-order-review]").forEach((button) => {
  button.addEventListener("click", closeOrderReview);
});
callWaiterButton.addEventListener("click", callWaiter);
document.querySelector("[data-back-menu]").addEventListener("click", closeMenu);
document.querySelector("[data-back-section]").addEventListener("click", closeSection);
document.querySelector("[data-close-item]").addEventListener("click", closeItemDetail);
document.querySelector("[data-qty-minus]").addEventListener("click", () => changeDetailQty(-1));
document.querySelector("[data-qty-plus]").addEventListener("click", () => changeDetailQty(1));
document.querySelector("[data-add-detail]").addEventListener("click", addCurrentDetailToBasket);
document.querySelector("[data-close-quick-order]").addEventListener("click", closeQuickOrder);
document.querySelector("[data-quick-qty-minus]").addEventListener("click", () => changeQuickOrderQty(-1));
document.querySelector("[data-quick-qty-plus]").addEventListener("click", () => changeQuickOrderQty(1));
document.querySelector("[data-add-quick-order]").addEventListener("click", addCurrentQuickOrderToBasket);

document.querySelectorAll("[data-open-section]").forEach((button, index) => {
  const warmTarget = () => {
    const sectionNameForMenu = menuSectionNames[activeMenu]?.[index] || button.dataset.openSection;
    preloadSection(sectionNameForMenu);
  };
  button.addEventListener("pointerenter", warmTarget);
  button.addEventListener("touchstart", warmTarget, { passive: true });
  button.addEventListener("click", () => {
    const sectionNameForMenu = menuSectionNames[activeMenu]?.[index] || button.dataset.openSection;
    openSection(sectionNameForMenu);
  });
});

resizeCanvas();
requestAnimationFrame(drawSparks);

const warmWhenIdle = window.requestIdleCallback || ((callback) => setTimeout(callback, 350));
warmWhenIdle(() => {
  setTimeout(() => {
    warmAllMenuImages();
    setTimeout(warmInteractiveImagesInBatches, 6500);
  }, 5000);
});

window.addEventListener("resize", resizeCanvas, { passive: true });
window.addEventListener("orientationchange", resizeCanvas, { passive: true });
