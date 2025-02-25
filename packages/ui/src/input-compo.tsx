export const InputCompo = ({ 
  children,
  inputtype,
  label,
  className,
  onchange
}: { 
  children?: React.ReactNode; 
  inputtype: string; 
  label?: string; 
  className?: string; 
  onchange : Function
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && <label className="text-gray-700 font-medium">{label}</label>}
      <input 
        type={inputtype} 
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        onChange={(e:any)=>{
          onchange(e.target.value)
        }}
      />
      {children}
    </div>
  );
};
