import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/es'; // Para que los meses y días salgan en español

// 1. Cargamos los plugins necesarios
dayjs.extend(utc);
dayjs.extend(timezone);

// 2. Definimos tu zona horaria (Cámbiala según tu ciudad)
export const TIMEZONE = "America/Lima"; 

// 3. Configuramos dayjs por defecto
dayjs.tz.setDefault(TIMEZONE);
dayjs.locale('es');

export default dayjs;