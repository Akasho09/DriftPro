"use client"
export const DropDown = ({ 
  children ,
  title , 
  items , 
  className ,
  onSelect
}: { 
  children?: React.ReactNode , title : string , items : string[] , className : string , onSelect : (e:string)=>void
}) => {
  return (
    <div className={className}>
      <h1>{title}</h1>

<select className="w-full" onChange={(e)=>{
  onSelect(e.target.value)
}}>
{
items.map((e,index)=>(
  <option value={e} key={index}>{e} </option>
))}
</select>
      {children}
    </div>
  );
};
