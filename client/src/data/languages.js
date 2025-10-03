export const languages = [
  {
    id: 'javascript',
    title: 'JavaScript',
    desc: 'Dynamic language for the web. Great for frontends, backends (Node.js), and scripting.',
    snippetLang: 'js',
    snippet: `// Arrow functions and array methods\nconst greet = (name) => \`Hello, ${name}!\`;\nconst doubled = [1,2,3].map(n => n * 2);\nconsole.log(greet('Dev'), doubled);`,
    detail: {
      basics: [
        'Variables (let/const) & scope',
        'Functions & arrow functions',
        'Arrays, objects, destructuring',
        'Loops & array methods (map/filter/reduce)',
        'Template literals & modules (import/export)'
      ],
      intermediate: [
        'Async JS: Promises, async/await',
        'Fetch API & error handling',
        'DOM manipulation & events',
        'ES6+ features (spread, rest, optional chaining)'
      ],
      advanced: [
        'Closures & prototypes',
        'Event loop & performance',
        'Bundlers (Vite/Webpack), ESM vs CJS',
        'Design patterns & testing (Jest)'
      ],
      snippet: `// Async/Await example\nasync function load() {\n  const res = await fetch('/api');\n  if(!res.ok) throw new Error('Network');\n  const data = await res.json();\n  console.log(data);\n}`,
    },
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    desc: 'Typed superset of JavaScript that scales large codebases with safety.',
    snippetLang: 'ts',
    snippet: `type User = { id: number; name: string };\nconst add = (a: number, b: number): number => a + b;\nconst u: User = { id: 1, name: 'Ada' };`,
    detail: {
      basics: [
        'Type annotations & inference',
        'Interfaces, types, enums',
        'Generics basics',
        'Union & intersection types'
      ],
      intermediate: [
        'Type narrowing & control flow analysis',
        'Utility types (Partial, Pick, Record)',
        'Module resolution & declaration merging'
      ],
      advanced: [
        'Mapped & conditional types',
        'Generic constraints & variance',
        'Strict mode, tsconfig optimization',
        'Build pipelines & monorepos'
      ],
      snippet: `type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };\nfunction wrap<T>(data: T): ApiResponse<T> { return { ok: true, data }; }`,
    },
  },
  {
    id: 'python',
    title: 'Python',
    desc: 'High-level language popular for data science, automation, and web apps.',
    snippetLang: 'py',
    snippet: `def greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nnums = [1, 2, 3]\nprint(list(map(lambda x: x * 2, nums)))`,
    detail: {
      basics: [
        'Syntax & indentation',
        'Lists, dicts, sets, tuples',
        'Functions & comprehensions',
        'venv, pip basics'
      ],
      intermediate: [
        'OOP (classes, dunder methods)',
        'Decorators & generators',
        'File I/O, modules & packages'
      ],
      advanced: [
        'Asyncio & concurrency',
        'Typing & dataclasses',
        'Packaging, FastAPI, Pandas/Numpy'
      ],
      snippet: `from dataclasses import dataclass\n@dataclass\nclass User:\n  id: int; name: str\nprint(User(1,'Ada'))`,
    },
  },
  {
    id: 'java',
    title: 'Java',
    desc: 'Versatile, object-oriented language used in enterprise and Android development.',
    snippetLang: 'java',
    snippet: `class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java");\n  }\n}`,
    detail: {
      basics: [
        'Syntax, classes & methods',
        'Collections & exceptions',
        'Maven/Gradle basics'
      ],
      intermediate: [
        'Streams & generics',
        'Concurrency basics',
        'JDBC & JPA',
        'JUnit testing'
      ],
      advanced: [
        'JVM tuning & profiling',
        'Spring Boot & Spring Cloud',
        'Microservices & reactive programming'
      ],
      snippet: `List<String> names = Arrays.asList("Ada","Alan");\nnames.stream().filter(n -> n.startsWith("A")).forEach(System.out::println);`,
    },
  },
  {
    id: 'cpp',
    title: 'C++',
    desc: 'Performance-focused, powerful for systems, games, and high-performance apps.',
    snippetLang: 'cpp',
    snippet: `#include <iostream>\nint main(){ std::cout << "Hello C++"; return 0; }`,
    detail: {
      basics: [
        'Syntax & compilation',
        'Pointers/references & RAII',
        'STL containers & algorithms'
      ],
      intermediate: [
        'Templates & metaprogramming',
        'Smart pointers, move semantics',
        'CMake & build systems'
      ],
      advanced: [
        'Concurrency & atomics',
        'Profiling & memory models',
        'Modern C++ (C++17/20)'
      ],
      snippet: `#include <vector>\n#include <algorithm>\nstd::vector<int> v{1,2,3}; std::for_each(v.begin(), v.end(), [](int &x){x*=2;});`,
    },
  },
  {
    id: 'csharp',
    title: 'C#',
    desc: 'Modern, productive language on .NET for desktop, web, and game dev (Unity).',
    snippetLang: 'csharp',
    snippet: `using System; \nclass App { static void Main(){ Console.WriteLine("Hello C#"); } }`,
    detail: {
      basics: [
        'Types, classes & structs',
        'LINQ basics',
        'Async/await',
        'NuGet & project layout'
      ],
      intermediate: [
        'Dependency injection',
        'Configuration & logging',
        'Entity Framework Core',
        'Unit testing (xUnit/NUnit)'
      ],
      advanced: [
        'Span/Memory & performance',
        'ASP.NET Core middleware',
        'Advanced LINQ & query optimization'
      ],
      snippet: `var nums = new[]{1,2,3};\nvar doubled = nums.Select(n => n*2);`,
    },
  },
  {
    id: 'go',
    title: 'Go',
    desc: 'Fast, simple, and concurrent language ideal for backend services.',
    snippetLang: 'go',
    snippet: `package main\nimport "fmt"\nfunc main(){ fmt.Println("Hello Go") }`,
    detail: {
      basics: [
        'Syntax & go toolchain',
        'Modules & packages',
        'Slices, maps',
        'Functions, methods & interfaces'
      ],
      intermediate: [
        'Goroutines & channels',
        'Context propagation',
        'HTTP server & testing'
      ],
      advanced: [
        'Profiling & tracing',
        'Generics',
        'Concurrency patterns & tooling'
      ],
      snippet: `func worker(ch chan int){ for v := range ch { fmt.Println(v) } }`,
    },
  },
  {
    id: 'ruby',
    title: 'Ruby',
    desc: 'Expressive language powering Rails, great for web apps and scripting.',
    snippetLang: 'rb',
    snippet: `def greet(name)\n  "Hello, #{name}!"\nend\nputs greet('Ruby')`,
    detail: {
      basics: [
        'Syntax & blocks',
        'Arrays & hashes',
        'Classes & modules',
        'Gems & bundler'
      ],
      intermediate: [
        'Metaprogramming basics',
        'Rack & middleware',
        'RSpec testing',
        'Rails MVC'
      ],
      advanced: [
        'Performance & concurrency',
        'Background jobs (Sidekiq)',
        'Caching strategies'
      ],
      snippet: `class User; attr_accessor :name; end; u = User.new; u.name='Ada'`,
    },
  },
  {
    id: 'php',
    title: 'PHP',
    desc: 'Server-side language that powers a large portion of the web.',
    snippetLang: 'php',
    snippet: `<?php\necho "Hello PHP";`,
    detail: {
      basics: [
        'Syntax & arrays',
        'Functions & superglobals',
        'Composer & autoloading'
      ],
      intermediate: [
        'OOP & namespaces',
        'PDO & database access',
        'Routing & templating'
      ],
      advanced: [
        'Laravel/Symfony frameworks',
        'Testing (PHPUnit)',
        'Performance & caching'
      ],
      snippet: `<?php\n$nums=[1,2,3];$d=array_map(fn($x)=>$x*2,$nums);print_r($d);`,
    },
  },
  {
    id: 'rust',
    title: 'Rust',
    desc: 'Memory-safe systems language with great performance and reliability.',
    snippetLang: 'rs',
    snippet: `fn main(){ println!("Hello Rust"); }`,
    detail: {
      basics: [
        'Ownership & borrowing',
        'Variables, enums & structs',
        'Pattern matching'
      ],
      intermediate: [
        'Traits & generics',
        'Modules/crates',
        'Result/Option & error handling'
      ],
      advanced: [
        'Async Rust & lifetimes',
        'Unsafe Rust',
        'Performance tuning'
      ],
      snippet: `fn add(a:i32,b:i32)->i32{a+b} println!("{}", add(2,3));`,
    },
  },
];

// Additional categories
export const databases = [
  {
    id: 'mysql',
    title: 'MySQL',
    desc: 'Relational database known for reliability and performance.',
    snippetLang: 'sql',
    snippet: `-- Select users created this month
SELECT id, name FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY);`,
    detail: {
      basics: [
        'Tables, rows, columns',
        'SELECT, INSERT, UPDATE, DELETE',
        'WHERE, ORDER BY, LIMIT',
      ],
      intermediate: [
        'JOINs (INNER/LEFT/RIGHT)',
        'Indexes & EXPLAIN',
        'Transactions',
      ],
      advanced: [
        'Normalization & constraints',
        'Query optimization',
        'Replication & backups',
      ],
      snippet: `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100));`,
    },
  },
  {
    id: 'postgresql',
    title: 'PostgreSQL',
    desc: 'Powerful open-source relational database with rich features.',
    snippetLang: 'sql',
    snippet: `-- JSON query example
SELECT data->>'email' AS email FROM profiles WHERE (data->>'active')::boolean = true;`,
    detail: {
      basics: [
        'Schemas & data types',
        'Basic CRUD & filtering',
        'psql & tooling',
      ],
      intermediate: [
        'CTEs & window functions',
        'JSON/JSONB',
        'Extensions (uuid-ossp, pg_trgm)',
      ],
      advanced: [
        'Indexes & partial indexes',
        'Performance tuning',
        'Logical replication',
      ],
      snippet: `SELECT id, AVG(score) OVER (PARTITION BY exam_id) FROM submissions;`,
    },
  },
  {
    id: 'mongodb',
    title: 'MongoDB',
    desc: 'Document database for flexible schemas and rapid iteration.',
    snippetLang: 'js',
    snippet: `// Find active users
db.users.find({ active: true }, { name: 1, email: 1 });`,
    detail: {
      basics: [
        'Collections & documents',
        'CRUD operations',
        'Basic aggregation',
      ],
      intermediate: [
        'Indexes',
        'Aggregation pipelines',
        'Schema design patterns',
      ],
      advanced: [
        'Sharding & replication',
        'Performance tuning',
        'Transactions',
      ],
      snippet: `db.orders.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: '$userId', total: { $sum: '$amount' } } }]);`,
    },
  },
];

export const frameworks = [
  {
    id: 'react',
    title: 'React',
    desc: 'Component-based UI library for building interactive web apps.',
    snippetLang: 'jsx',
    snippet: `function Hello({ name }) { return <div>Hello {name}</div>; }`,
    detail: {
      basics: [
        'JSX & components',
        'Props & state',
        'Events & lists',
      ],
      intermediate: [
        'Hooks (useState/useEffect)',
        'Context & reducers',
        'Routing (react-router)',
      ],
      advanced: [
        'Performance & memoization',
        'Code-splitting',
        'SSR/SSG (Next.js)',
      ],
      snippet: `const [count,setCount]=useState(0);`,
    },
  },
  {
    id: 'angular',
    title: 'Angular',
    desc: 'Full-featured framework with TypeScript for large apps.',
    snippetLang: 'ts',
    snippet: `@Component({ selector: 'app', template: '<h1>Hello</h1>' })
export class AppComponent {}`,
    detail: {
      basics: [
        'Modules & components',
        'Templates & bindings',
        'Services & DI',
      ],
      intermediate: [
        'Routing & guards',
        'Forms (template & reactive)',
        'HTTPClient',
      ],
      advanced: [
        'NgRx state management',
        'Performance & AOT',
        'SSR (Angular Universal)',
      ],
      snippet: `constructor(private http: HttpClient) {}`,
    },
  },
  {
    id: 'vue',
    title: 'Vue',
    desc: 'Progressive framework for building user interfaces.',
    snippetLang: 'vue',
    snippet: `<template><div>{{ msg }}</div></template>
<script setup>const msg = 'Hello Vue'</script>`,
    detail: {
      basics: [
        'Reactivity & templates',
        'Components & props',
        'Computed & watchers',
      ],
      intermediate: [
        'Vue Router',
        'Pinia/Vuex',
        'Forms & validation',
      ],
      advanced: [
        'Performance & Suspense',
        'SSR (Nuxt)',
        'Testing',
      ],
      snippet: `const count = ref(0)`,
    },
  },
  {
    id: 'express',
    title: 'Express',
    desc: 'Minimalist Node.js framework for HTTP APIs and servers.',
    snippetLang: 'js',
    snippet: `const express = require('express'); const app = express();
app.get('/api', (_,res)=>res.json({ok:true}));`,
    detail: {
      basics: [
        'Routing & middlewares',
        'Request/response',
        'Static files & error handling',
      ],
      intermediate: [
        'Authentication (JWT/session)',
        'Validation & logging',
        'ORMs (Prisma/Sequelize)',
      ],
      advanced: [
        'Scaling & clustering',
        'Testing (supertest)',
        'Security best practices',
      ],
      snippet: `app.listen(4000, ()=> console.log('Server on 4000'));`,
    },
  },
];

export const palette = {
  javascript: 'from-yellow-400 to-orange-500',
  typescript: 'from-blue-400 to-indigo-500',
  python: 'from-cyan-400 to-blue-500',
  java: 'from-red-400 to-rose-500',
  cpp: 'from-sky-400 to-blue-600',
  csharp: 'from-violet-400 to-purple-600',
  go: 'from-teal-400 to-emerald-500',
  ruby: 'from-rose-400 to-pink-500',
  php: 'from-indigo-400 to-violet-500',
  rust: 'from-amber-500 to-yellow-700',
  // Databases
  mysql: 'from-amber-400 to-orange-500',
  postgresql: 'from-sky-500 to-blue-700',
  mongodb: 'from-emerald-400 to-green-600',
  // Frameworks
  react: 'from-cyan-400 to-blue-500',
  angular: 'from-red-500 to-rose-600',
  vue: 'from-emerald-400 to-teal-600',
  express: 'from-gray-400 to-gray-600',
};

// Colored drop-shadow to match each gradient palette
export const shadowPalette = {
  javascript: 'drop-shadow-[0_14px_28px_rgba(251,191,36,0.6)]', // amber-400
  typescript: 'drop-shadow-[0_14px_28px_rgba(59,130,246,0.6)]', // blue-500
  python: 'drop-shadow-[0_14px_28px_rgba(6,182,212,0.6)]', // cyan-500
  java: 'drop-shadow-[0_14px_28px_rgba(244,63,94,0.6)]', // rose-500
  cpp: 'drop-shadow-[0_14px_28px_rgba(14,165,233,0.6)]', // sky-500
  csharp: 'drop-shadow-[0_14px_28px_rgba(139,92,246,0.6)]', // violet-500
  go: 'drop-shadow-[0_14px_28px_rgba(16,185,129,0.6)]', // emerald-500
  ruby: 'drop-shadow-[0_14px_28px_rgba(244,63,94,0.6)]', // rose-500
  php: 'drop-shadow-[0_14px_28px_rgba(99,102,241,0.6)]', // indigo-500
  rust: 'drop-shadow-[0_14px_28px_rgba(245,158,11,0.6)]', // amber-500
  // Databases
  mysql: 'drop-shadow-[0_14px_28px_rgba(251,146,60,0.6)]', // orange-400
  postgresql: 'drop-shadow-[0_14px_28px_rgba(59,130,246,0.6)]', // blue-500
  mongodb: 'drop-shadow-[0_14px_28px_rgba(16,185,129,0.6)]', // emerald-500
  // Frameworks
  react: 'drop-shadow-[0_14px_28px_rgba(6,182,212,0.6)]', // cyan-500
  angular: 'drop-shadow-[0_14px_28px_rgba(244,63,94,0.6)]', // rose-500
  vue: 'drop-shadow-[0_14px_28px_rgba(16,185,129,0.6)]', // emerald-500
  express: 'drop-shadow-[0_14px_28px_rgba(107,114,128,0.6)]', // gray-500
};
