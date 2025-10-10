src/
├── shared/
│ ├── contexts/ # ✅ React contexts
│ ├── api/ # ✅ HTTP client configuration, interceptors etc.  
│ ├── lib/ # ✅ Third-party library setups
│ ├── validation/ # ✅ Form schemas (Zod, Yup)
│ ├── theme/ # ✅ Theme configuration, colors, typography
├── modules/\*/
│ ├── services/ # ✅ API calls, Business logic, Data Transformation, 3rd Party Integrations (Google Maps)
│ ├── hooks/ # ✅ React integration & TanStack Query, Expo APIs
│ ├── components/ # ✅ UI components  
│ ├── store/ # ✅ Global States for Zustand/Redux  
│ └── types/ # ✅ Type definitions
└── core/
├── providers/ # ✅ App-level wrappers (QueryClient, Modal etc.)
├── config/ # ✅ App configuration
└── constants/ # ✅ App constants
