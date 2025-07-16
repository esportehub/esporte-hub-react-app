import { Input, FormControl, FormLabel } from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';

interface DateInputProps {
  label: string;
  value: Date | string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dataMinima?: Date | string | null;
}

/* 
  Criei este DateInput personalizado para reaproveitarmos o componente, adicionarmos parametros
  Como por exemplo, o que adicionei de dataMinima, para ser usado em casos necessários
*/

function DateInput({ label, value, onChange, dataMinima = null }: DateInputProps) {
  // Converte o value para string no formato YYYY-MM-DD
  const formattedValue = value 
    ? format(value instanceof Date ? value : parseISO(value), 'yyyy-MM-dd') 
    : '';

  // Converte a data mínima para o formato YYYY-MM-DD
  const minDateFormatted = dataMinima 
    ? format(dataMinima instanceof Date ? dataMinima : parseISO(dataMinima), 'yyyy-MM-dd') 
    : '';

  return (
    <FormControl isRequired>
      <FormLabel>{label}</FormLabel>
      <Input
        type="date"
        value={formattedValue}
        onChange={onChange}
        min={minDateFormatted}
      />
    </FormControl>
  );
}

export default DateInput;