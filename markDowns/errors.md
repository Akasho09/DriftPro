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


##  type error in autorize 
                        return user as any /// this is a hack



## Error: [next-auth]: useSession must be wrapped in a <SessionProvider /> #7690

 wrap all the children of <body> with <NextAuthProvider> in layout.tsx.



##  <Image src={user?.image || '/default-image.png'} alt="User Image" width={100} height={100} />
 

                
## userId : Number(userId),


          
##   window.location.href = redirectUrl || "";
for redirecting to external url and reload whle page.


 ## use esbuild to run bankHook
   "build": "npx esbuild ./src/index.ts --bundle --platform=node --outfile=dist/index.js",


## avoid tyopr error in index.js webhook import repo/db/cl
"moduleResolution": "bundler",

## Fix 
          await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${session?.user?.id} FOR UPDATE`;

  sol : 
            fromNum: String(session.user.email),
            use Number  ->  amount : Number(amountt),



## Fix 
       {user?.mobile || "akash"}
           sol : 
>  .email
        


## async/await is not yet supported in Client Components, only Server Components. This error is often caused by accidentally adding 'use client' to a module that was originally written for the server.
    const [email,setemail] = useState("0");
    const [data,setData] = useState([{
        id: 1 ,
        amount: 1 ,
        fromNum: "string" ,
        toNum: "string" ,
        tTime: "Date"
    }])
    useEffect(()=>{
        getSession().then((e)=>{
            setemail(e?.user?.email || "0")
            ts().then(()=>{

            })
        })
    },[])


## render deploy errors
redirect to http://localhost:3000/api/auth/callback/credentials 