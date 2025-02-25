"use client"
export const DropDown = ({ 
  children ,
  title , 
  items , 
  className ,
  onselect
}: { 
  children?: React.ReactNode , title : string , items : string[] , className : string , onselect : Function
}) => {
  return (
    <div className={className}>
      <h1>{title}</h1>

<select className="w-full" onChange={(e:any)=>{
  onselect(e.target.value)
}}>
{
items.map((e,index)=>(
  <option value={e} key={index}>{e}</option>
))}
</select>
      {children}
    </div>
  );
};
