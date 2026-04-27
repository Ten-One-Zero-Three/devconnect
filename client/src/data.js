const data = {
  "posts": [
    {
      "id": "p1",
      "title": "How to use React hooks for state management?",
      "body": "I'm building a complex component and I'm a bit confused about when to use useState vs useReducer. Any tips on performance optimization?",
      "author": "UserA",
      "timestamp": "2 mins ago",
      "tags": ["react", "javascript", "frontend"],
      "metrics": {
        "comments": 5,
        "upvotes": 12,
        "isUpvoted": true
      }
    },
    {
      "id": "p2",
      "title": "SQL JOIN explanation for beginners?",
      "body": "Can someone explain the difference between a LEFT JOIN and an INNER JOIN with a real-world example? I keep getting mixed up.",
      "author": "UserB",
      "timestamp": "10 mins ago",
      "tags": ["sql", "database", "backend"],
      "metrics": {
        "comments": 2,
        "upvotes": 7,
        "isUpvoted": false
      }
    },
    {
      "id": "p3",
      "title": "Node.js memory leak fix in production?",
      "body": "We've noticed our heap usage climbing steadily over 24 hours. We're using Express and Socket.io. Has anyone dealt with this?",
      "author": "UserC",
      "timestamp": "1 hr ago",
      "tags": ["node.js", "debugging", "backend"],
      "metrics": {
        "comments": 17,
        "upvotes": 21,
        "isUpvoted": false
      }
    }
  ],
  "comments": [
    {
      "id": "c1",
      "postId": "p1",
      "author": "UserB",
      "text": "Use useState for simple local state, and useReducer when the state logic gets complex or depends on the previous state.",
      "timestamp": "Apr 8, 2026"
    },
    {
      "id": "c2",
      "postId": "p1",
      "author": "UserC",
      "text": "Check out the official documentation at react.dev, they have a great guide on this exact topic!",
      "timestamp": "Apr 9, 2026"
    }
  ],
  "trending_tags": ["#javascript", "#sql", "#react", "#node.js", "#tailwind"],
  "ai_suggestions": ["#debugging", "#memory-leak", "#performance"]
}

export default data