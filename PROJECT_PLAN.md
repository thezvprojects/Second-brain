# Knowledge Hub — Project Plan

## Phase 0: Bare-minimum vertical slice (Angular form → Function → SQL → back to Angular)

- [ ] Create the Resource Group in the Azure Portal — *Azure resource organization: one container for everything, easy teardown*
- [ ] Provision Azure SQL Server + Database (serverless, free offer, firewall rules) — *Azure SQL: logical server vs. database, serverless tier, firewall config*
- [ ] Create the `Items` table via Query Editor/SSMS (Id, ItemType, Title, Content/Url, CreatedAt) — *T-SQL DDL, connecting to Azure SQL with a client tool*
- [ ] Scaffold the Functions project locally (isolated worker template) — *Azure Functions project structure: host.json, local.settings.json, isolated worker model*
- [ ] Implement `POST /items` HTTP trigger using Dapper + parameterized SQL — *HTTP trigger bindings, parameterized queries (SQL injection prevention)*
- [ ] Implement `GET /items` HTTP trigger — *Route/query bindings, JSON serialization, async/await*
- [ ] Provision the Function App (Consumption plan) + Storage Account in the Portal — *Why Functions require a storage account, Consumption plan basics, bundling App Insights*
- [ ] Deploy the Functions project to Azure (VS Code extension or `func azure functionapp publish`) — *Functions deployment workflow*
- [ ] Add the SQL connection string as an Application Setting; test deployed endpoints with curl/Postman — *App Settings vs. local.settings.json, connection string handling*
- [ ] Scaffold the Angular app (`ng new`) — *Angular CLI, project/module structure*
- [ ] Build an Angular form component (Reactive Forms) calling `POST /items` — *Reactive Forms, HttpClient, services/DI*
- [ ] Build an Angular list component calling `GET /items` — *HttpClient GET, `@for`/`*ngFor`, observables*
- [ ] Wire up `environment.ts`/`environment.prod.ts` for the API URL — *Angular build configurations/environments*
- [ ] Provision the Static Web App (free tier), link GitHub repo, verify auto-deploy — *Azure SWA free tier hosting + built-in GitHub Actions CI/CD*
- [ ] Configure CORS on the Function App to allow the SWA origin; verify the full round trip through the deployed SWA URL — *Functions CORS config, browser same-origin policy*

## Phase 1: Polish (auth, validation, error handling, CI/CD)

- [ ] Switch Function auth level from Anonymous → Function key; send the key from Angular — *Azure Functions authorization levels, secrets in a client-side app*
- [ ] Restrict CORS to the specific SWA origin (remove any wildcard used during Phase 0) — *Locking down CORS, browser security model*
- [ ] Add server-side validation (required fields, max length, URL format) returning 400 + error payload — *Input validation, meaningful HTTP status codes, defensive API design*
- [ ] Add Angular reactive form validators + inline error messages — *Angular `Validators`, form control status, UX for invalid input*
- [ ] Add global exception-handling middleware in the isolated worker — *Functions middleware pipeline, consistent error shapes, not leaking stack traces*
- [ ] Add an Angular `HttpInterceptor` for centralized error handling (toast/snackbar on failure) — *Angular interceptors, RxJS `catchError`*
- [ ] Add `PUT`/`DELETE` endpoints + matching Angular edit/delete UI — *Full CRUD over HTTP, RESTful routing conventions*
- [ ] Add structured logging via `ILogger`, query it in Application Insights — *Azure Monitor/Log Analytics, KQL basics, observability*
- [ ] Add automated tests: xUnit for Function handlers (mocked DB), Jasmine/Jest for Angular components — *Testing patterns, designing for testability/DI*
- [ ] Track schema changes with versioned SQL scripts (or EF Core Migrations) instead of ad-hoc Portal edits — *Database change management/reproducibility*
- [ ] Add a GitHub Actions workflow to build/deploy the Function App on push — *CI/CD pipelines, GitHub Actions YAML, Azure deployment credentials as secrets*
- [ ] Set an Application Insights daily data cap + one basic alert rule (e.g. failure rate) — *Azure Monitor alerting, cost control*
- [ ] Do a secrets-hygiene pass: confirm `local.settings.json`/environment secrets are gitignored, nothing committed — *Secrets management, basic secure-config hygiene*

## Phase 2+: AI features (not detailed yet)

- [ ] Add file upload support (Azure Blob Storage) for attaching documents to items
- [ ] Integrate Azure OpenAI/OpenAI API for automatic summarization (queue-triggered, async, to avoid blocking HTTP calls)
- [ ] Generate embeddings for semantic search (vector storage in SQL or a dedicated vector store)
- [ ] Build a search UI in Angular (keyword + semantic)
- [ ] Add AI-assisted tagging/auto-categorization
- [ ] Consider Durable Functions to orchestrate the multi-step AI pipeline (fetch → summarize → embed → store)
- [ ] Revisit auth (Entra ID / SWA Easy Auth) if the app ever becomes multi-user or shared
- [ ] Consider Key Vault + Managed Identity once more secrets exist (OpenAI key, etc.)