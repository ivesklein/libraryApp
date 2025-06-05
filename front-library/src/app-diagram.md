```mermaid
graph TD
    A[App.tsx] --> B[LoginForm.tsx]
    A --> C[BookTable.tsx]
    C --> D[BookModal.tsx]
    
    %% Services
    E[api.service.ts] --> A
    E --> C
    
    %% Data Flow
    A -- "Authentication State" --> B
    A -- "Authentication State" --> C
    C -- "Book Data" --> D
    
    %% API Calls
    B -. "Login API Call" .-> E
    C -. "Book CRUD API Calls" .-> E
    
    %% Component Descriptions
    classDef component fill:#f9f,stroke:#333,stroke-width:2px
    classDef service fill:#bbf,stroke:#333,stroke-width:2px
    
    class A,B,C,D component
    class E service
    
    %% Legend
    subgraph Legend
        G[Component]:::component
        H[Service]:::service
    end
```

## Component Structure

- **App.tsx**: Main application component that manages authentication state
- **LoginForm.tsx**: Handles user login form and authentication
- **BookTable.tsx**: Displays books with pagination, sorting, and search
- **BookModal.tsx**: Modal for adding/editing book details

## Service Structure

- **api.service.ts**: Core API service handling HTTP requests, authentication, and book operations

## Data Flow

1. User logs in via LoginForm
2. Authentication token stored in api.service
3. App switches to BookTable view
4. BookTable fetches books from api.service
5. Book operations (add/edit/delete) flow through api.service