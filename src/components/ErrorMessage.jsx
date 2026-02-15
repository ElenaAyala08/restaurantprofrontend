const ErrorMessage = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center mb-2">
       
        <h3 className="text-red-800 font-bold uppercase text-sm tracking-wide">
          Errores de validación
        </h3>
      </div>
      
      <ul className="list-disc ml-7 space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-red-700 text-sm">
            <span className="font-semibold capitalize">{error.campo}:</span> {error.mensaje}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorMessage;