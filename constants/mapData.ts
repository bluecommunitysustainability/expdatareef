import type { Poi } from '../types';

export const mapData: Record<string, Poi[]> = {
  "Orlando": [
    { 
      name: "Walt Disney World", 
      latitude: 28.3852, 
      longitude: -81.5639, 
      category: "Attraction",
      description: "An entertainment complex in Bay Lake and Lake Buena Vista, Florida, near the cities of Orlando and Kissimmee. The resort comprises four theme parks, two water parks, and numerous themed resort hotels.",
      imageUrl: "https://images.unsplash.com/photo-1596778401349-34b8d287137b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    },
    { 
      name: "Universal Orlando Resort", 
      latitude: 28.4739, 
      longitude: -81.4624, 
      category: "Attraction",
      description: "A theme park and entertainment resort complex based in Orlando, Florida. The resort features two theme parks, a water park, an on-site entertainment district, and eight Loews Hotels.",
      imageUrl: "https://images.unsplash.com/photo-1607503999404-504789d256df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    { 
      name: "Lake Eola Park", 
      latitude: 28.5438, 
      longitude: -81.3723, 
      category: "Park",
      description: "A public park located in Downtown Orlando, Florida. Lake Eola is the main feature of the park, which is famous for its fountain and the swan-shaped paddle boats.",
      imageUrl: "https://images.unsplash.com/photo-1621992496831-273a72f0c292?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
    },
    { 
      name: "Orlando Science Center", 
      latitude: 28.5714, 
      longitude: -81.3661, 
      category: "Museum",
      description: "A private science museum located in Orlando, Florida. Its purposes are to provide experience-based opportunities for learning about science and technology and to promote public understanding of science.",
      imageUrl: "https://images.unsplash.com/photo-1634655333333-548d8435d7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
    }
  ],
  "St. Petersburg": [
    { 
      name: "The Dalí Museum", 
      latitude: 27.7641, 
      longitude: -82.6322, 
      category: "Museum",
      description: "An art museum in St. Petersburg, Florida, United States, dedicated to the work of Salvador Dalí. It houses the largest collection of Dalí's works outside Europe.",
      imageUrl: "https://images.unsplash.com/photo-1681216892348-18ea55755b72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
    },
    { 
      name: "Sunken Gardens", 
      latitude: 27.7876, 
      longitude: -82.6366, 
      category: "Park",
      description: "A botanical garden in St. Petersburg, Florida. It is one of the oldest roadside tourist attractions in the United States, containing more than 50,000 tropical plants and flowers.",
      imageUrl: "https://images.unsplash.com/photo-1587351173252-d16c5b29389e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    },
    { 
      name: "Fort De Soto Park", 
      latitude: 27.6167, 
      longitude: -82.7333, 
      category: "Park",
      description: "A park on five offshore keys, or islands, at the mouth of Tampa Bay. It's known for its beaches, a historic fort, and a variety of ecosystems.",
      imageUrl: "https://images.unsplash.com/photo-1663499238122-403022137b3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
    },
    { 
      name: "St. Pete Pier", 
      latitude: 27.7711, 
      longitude: -82.6239, 
      category: "Landmark",
      description: "A landmark pleasure pier extending into Tampa Bay from downtown St. Petersburg, Florida. It features a variety of attractions, including a fishing deck, restaurants, and a marketplace.",
      imageUrl: "https://images.unsplash.com/photo-1616223235339-56963e6ee961?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80"
    }
  ],
  "Anna Maria Island": [
    { 
      name: "Bean Point Beach", 
      latitude: 27.5348, 
      longitude: -82.7401, 
      category: "Beach",
      description: "Located at the northernmost tip of Anna Maria Island, this secluded beach offers stunning views of the Gulf of Mexico and Tampa Bay.",
      imageUrl: "https://images.unsplash.com/photo-1615856499899-85800a088863?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    { 
      name: "Manatee Public Beach", 
      latitude: 27.4975, 
      longitude: -82.7132, 
      category: "Beach",
      description: "A popular and family-friendly beach with amenities like picnic tables, grills, a playground, and volleyball courts.",
      imageUrl: "https://images.unsplash.com/photo-1605634592505-50731f20c02c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
    },
    { 
      name: "Coquina Beach", 
      latitude: 27.4390, 
      longitude: -82.6845, 
      category: "Beach",
      description: "A long, beautiful stretch of sand on the southern end of the island, known for its Australian pines that provide ample shade.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723a9ce6890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    { 
      name: "Anna Maria City Pier", 
      latitude: 27.5323, 
      longitude: -82.7314, 
      category: "Landmark",
      description: "A historic pier offering fishing, dining, and breathtaking views of the Sunshine Skyway Bridge and Tampa Bay.",
      imageUrl: "https://images.unsplash.com/photo-1601131998339-93b589a80e46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80"
    }
  ],
  "New Smyrna Beach": [
    { 
      name: "Smyrna Dunes Park", 
      latitude: 29.0719, 
      longitude: -80.9234, 
      category: "Park",
      description: "A 184-acre park surrounded by water on three sides. It features over two miles of elevated boardwalks, a fishing pier, and a dog-friendly beach.",
      imageUrl: "https://images.unsplash.com/photo-1604505928873-5838a531a7b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    { 
      name: "Flagler Avenue", 
      latitude: 29.0286, 
      longitude: -80.9022, 
      category: "Shopping",
      description: "A vibrant, beachside street known for its eclectic shops, art galleries, restaurants, and lively atmosphere.",
      imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    { 
      name: "Marine Discovery Center", 
      latitude: 29.0436, 
      longitude: -80.9161, 
      category: "Museum",
      description: "An educational center offering hands-on experiences to protect and restore the Florida coastal and estuary ecosystems.",
      imageUrl: "https://images.unsplash.com/photo-1572455024445-09095c73c34a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ],
  "St. Pete Beach": [
    { 
      name: "Don CeSar Hotel", 
      latitude: 27.7119, 
      longitude: -82.7423, 
      category: "Landmark",
      description: "A historic, pink hotel known as the 'Pink Palace'. It has been a landmark of St. Pete Beach since 1928, offering luxury accommodations and fine dining.",
      imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    { 
      name: "Pass-a-Grille Beach", 
      latitude: 27.6903, 
      longitude: -82.7364, 
      category: "Beach",
      description: "A charming, laid-back beach town at the southern end of St. Pete Beach, known for its old-Florida vibe and beautiful sunsets.",
      imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    },
    { 
      name: "Upham Beach Park", 
      latitude: 27.7381, 
      longitude: -82.7503, 
      category: "Beach",
      description: "A popular beach known for its wide stretch of sand and the iconic wooden groins that help prevent beach erosion.",
      imageUrl: "https://images.unsplash.com/photo-1610894894872-83562a037414?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
    }
  ],
  "Key West": [
    { 
      name: "Mallory Square", 
      latitude: 24.5599, 
      longitude: -81.8055, 
      category: "Landmark",
      description: "A waterfront plaza famous for its nightly 'Sunset Celebration,' featuring street performers, food vendors, and stunning views of the sunset.",
      imageUrl: "https://images.unsplash.com/photo-1588692135322-d27c3a72b157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    },
    { 
      name: "Duval Street", 
      latitude: 24.5532, 
      longitude: -81.7997, 
      category: "Shopping",
      description: "The main street of Key West, running from the Gulf of Mexico to the Atlantic Ocean, famous for its bars, restaurants, and shops.",
      imageUrl: "https://images.unsplash.com/photo-1627993092651-d4190e2b9b66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    },
    { 
      name: "Southernmost Point", 
      latitude: 24.5463, 
      longitude: -81.7998, 
      category: "Landmark",
      description: "An anchored concrete buoy marking the southernmost point in the continental United States, a popular photo opportunity for visitors.",
      imageUrl: "https://images.unsplash.com/photo-1563273935-890327f2146c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    { 
      name: "Ernest Hemingway Home and Museum", 
      latitude: 24.5510, 
      longitude: -81.8005, 
      category: "Museum",
      description: "The former residence of author Ernest Hemingway, now a museum and home to many six-toed cats, descendants of Hemingway's original pet.",
      imageUrl: "https://images.unsplash.com/photo-1628239029969-650a223a23a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    }
  ],
  "Treasure Island": [
    { 
      name: "John's Pass Village & Boardwalk", 
      latitude: 27.7803, 
      longitude: -82.7751, 
      category: "Shopping",
      description: "A quaint, turn-of-the-century fishing village with over 100 merchants, offering a mix of restaurants, shops, and water activities.",
      imageUrl: "https://images.unsplash.com/photo-1592534994911-583569e21834?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80"
    },
    { 
      name: "Treasure Island Beach", 
      latitude: 27.7675, 
      longitude: -82.7695, 
      category: "Beach",
      description: "A wide, sandy beach that is perfect for sunbathing, swimming, and various water sports. It hosts the annual Sanding Ovations sand sculpting competition.",
      imageUrl: "https://images.unsplash.com/photo-1622978434636-a6331003714b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1969&q=80"
    },
    { 
      name: "Sunset Beach", 
      latitude: 27.7475, 
      longitude: -82.7601, 
      category: "Beach",
      description: "Located at the southern tip of Treasure Island, this beach is known for its bohemian vibe, beachfront bars, and spectacular sunsets over the Gulf.",
      imageUrl: "https://images.unsplash.com/photo-1542147738-40a2d593e2af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ],
};