# System Architecture & Project Flow

##  High-Level Architecture (ASCII View)

```text
┌─────────────────────────────────────────────────────────────────┐
│                        Client / User Browser                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼ HTTP (Host Port 80 → 3000)
              ┌────────────────────────────────┐
              │      API Gateway (Port 3000)   │
              │  - JWT Validation              │
              │  - Role-Based Access Control   │
              │  - Proxy Routing               │
              └────────┬───────┬─────────────┬─┘
                       │       │             │
        ┌──────────────┘       │             └──────────────┐
        │                      │                            │
        ▼                      ▼                            ▼
   ┌─────────────┐     ┌──────────────┐             ┌────────────────┐
   │Auth Service │     │Librarian Svc │             │   Student LB   │
   │ (Port 4000) │     │ (Port 5001)  │             │  (Nginx :80)   │
   │             │     │              │             │                │
   │- Register   │     │- Add Books   │             │  Round-Robin   │
   │- Login      │     │- Update Books│             │  Distribution  │
   │- JWT Gen    │     │- View Admin  │             └───────┬────────┘
   └──────┬──────┘     └──────┬───────┘                     │
          │                   │                    ┌────────┴────────┐
          │                   │                    ▼                 ▼
          │                   │             ┌──────────────┐   ┌──────────────┐
          │                   │             │  Student-1   │   │  Student-2   │
          │                   │             │ (Port 5002)  │   │ (Port 5002)  │
          │                   │             │- View Books  │   │- View Books  │
          │                   │             │- Borrow Book │   │- Borrow Book │
          │                   │             │- Return Book │   │- Return Book │
          │                   │             └──────┬───────┘   └──────┬───────┘
          │                   │                    │                  │
          │                   └────────────┬───────┴──────────────────┘
          │                                │
          ▼                                ▼
    ┌─────────────────────────────────────────────────┐
    │                  MongoDB Atlas                   │
    │               (External Database)                │
    │                                                  │
    │  - person_collection  (Auth)                     │
    │  - book_collection    (Librarian + Student)      │
    └─────────────────────────────────────────────────┘
```
