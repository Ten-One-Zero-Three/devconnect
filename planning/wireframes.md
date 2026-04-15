# Wireframes
An Lam -
Emmanuel Enenta -
Azeem Ibrahim

“What makes DevConnect different is that we don’t just store developer knowledge — we actively help users create better questions and find better answers using AI

## List of Pages

- ⭐ Feed / Home — Browse all posts
- ⭐ Single Post — View post details and comments
- ⭐ Login / Sign Up — Authentication screens
- New Post — Create a question or post
- Profile — View user's own posts

---

## Wireframe 1: Feed / Home

```
+---------------------------------+
| DevConnect              [Post +] |  ← Top Nav
+---------------------------------+
| 🔍 Search posts...               |
+---------------------------------+
| [All] [#javascript] [#sql] ...   |  ← Tag Filters
+---------------------------------+
|                                  |
| 1. How to use React hooks?       |  ← Post Card
|    UserA · 2 mins ago            |
|    [View Post]  💬 5  ▲ 12       |
+----------------------------------+
|                                  |
| 2. SQL JOIN explanation?         |
|    UserB · 10 mins ago           |
|    [View Post]  💬 2  ▲ 7        |
+----------------------------------+
|                                  |
| 3. Node.js memory leak fix?      |
|    UserC · 1 hr ago              |
|    [View Post]  💬 9  ▲ 21       |
+----------------------------------+
|                                  |
| Sort: [Newest ▾]  [Most Upvoted] |
+---------------------------------+
| [🏠 Home]  [➕ Post]  [👤 Profile]| ← Bottom Nav
+---------------------------------+
```

---

## Wireframe 2: Single Post / Comments

```
+---------------------------------+
| [← Back]            DevConnect  |  ← Top Nav
+---------------------------------+
|                                  |
| TITLE: How to use React hooks?   |
|                                  |
| I'm building a component and...  |
| [full post body text here]       |
|                                  |
| By: UserA  ·  Apr 8, 2026        |
| Tags: #react  #javascript        |
|                          ▲ 12    |  ← Upvote
+---------------------------------+
| COMMENTS (5)                     |
+---------------------------------+
| UserB: Use useState for local... |
|                        Apr 9     |
+---------------------------------+
| UserC: Check the official docs   |
|        at react.dev              |
|                        Apr 9     |
+---------------------------------+
|                                  |
| [Write a comment...            ] |
|                       [Submit]   |
+---------------------------------+
```

---

## Wireframe 3: Login / Sign Up

```
+---------------------------------+
|           DevConnect            |
|    Where developers get answers |
+---------------------------------+
|                                  |
|        [  Login  ] [  Sign Up  ] |  ← Tab Toggle
|                                  |
|  Email:  [____________________]  |
|                                  |
|  Password: [__________________]  |
|                                  |
|         [   Log In   ]           |
|                                  |
|  Don't have an account?          |
|  [Sign Up →]                     |
+---------------------------------+
```

---

## Wireframe 4: New Post

```
+---------------------------------+
| [← Back]            DevConnect  |
+---------------------------------+
|                                  |
|  Ask a Question                  |
|                                  |
|  Title:                          |
|  [________________________________]
|                                  |
|  Details:                        |
|  [________________________________]
|  [                               ]
|  [                               ]
|                                  |
|  Tags (optional):                |
|  [#javascript ×] [+ Add Tag]     |
|                                  |
|             [Post Question]      |
+---------------------------------+
```

---

## Nice to Have

### Natural Language Feed Search

Replace the basic keyword search bar with a conversational query input. Users can type questions like *"How do I fix a memory leak in Node.js?"* and get semantically matched results rather than exact keyword hits.

```
+---------------------------------+
| DevConnect              [Post +] |
+---------------------------------+
| 💬 Ask anything... e.g.          |
|    "memory leak in Node.js"      |  ← AI-powered search bar
|                        [Search]  |
+---------------------------------+
| Results for: "memory leak..."    |
+---------------------------------+
| Node.js memory leak fix?         |
|   UserC · 1 hr ago  💬 9  ▲ 21  |
+---------------------------------+
| Debugging heap in Node           |
|   UserD · 3 hrs ago  💬 4  ▲ 9  |
+---------------------------------+
```

---

### Auto-Tagging & Categorization

When a user finishes typing their post title and body, an LLM analyzes the content and suggests relevant tags automatically. The user can accept, remove, or add tags before posting.

```
+---------------------------------+
| [← Back]            DevConnect  |
+---------------------------------+
|  Ask a Question                  |
|                                  |
|  Title:                          |
|  [ How do I fix a memory leak? ] |
|                                  |
|  Details:                        |
|  [ I'm using Node.js and my...  ]|
|                                  |
|  Suggested Tags (AI):            |
|  [#node.js ×] [#debugging ×]    |  ← Auto-generated by LLM
|  [#memory ×]  [+ Add Tag]        |
|                                  |
|  ✨ Tags suggested based on your |
|     content                      |
|                                  |
|             [Post Question]      |
+---------------------------------+
```
