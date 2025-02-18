##  GET / 200 in 1573ms
 ⚠ ./apps/user-app/tailwind.config.js
Specified module format (EcmaScript Modules) is not matching the module format of the source code (CommonJs)
The EcmaScript module format was specified in the package.json that is affecting this source file or by using an special extension, but it looks like that CommonJs syntax is used in the source code.
Exports made by CommonJs syntax will lead to a runtime error, since the module is in EcmaScript mode. Either change the "type" field in the package.json or replace CommonJs syntax with EcmaScript import/export syntax in the source file.


 ✓ Compiled /favicon.ico in 70ms
 ⚠ ./apps/user-app/tailwind.config.js
Specified module format (EcmaScript Modules) is not matching the module format of the source code (CommonJs)
The EcmaScript module format was specified in the package.json that is affecting this source file or by using an special extension, but it looks like that CommonJs syntax is used in the source code.
Exports made by CommonJs syntax will lead to a runtime error, since the module is in EcmaScript mode. Either change the "type" field in the package.json or replace CommonJs syntax with EcmaScript import/export syntax in the source file.

### change tailwindconfig as 
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


## 