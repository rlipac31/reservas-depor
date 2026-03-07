"use server";

import { createField, FieldService } from "@/services/fields/service";
import { revalidatePath } from "next/cache";
//creando campo
export async function createFieldAction(data: any) {
  try {
    // const name = formData.get("name") as string;
    // const capacity = parseInt(formData.get("capacity") as string);
    // const price = parseFloat(formData.get("pricePerHour") as string);
    // const location = formData.get("location") as string;
    // const description = formData.get("description") as string;

    const name = data.name;
    const capacity = parseInt(data.capacity as string);
    const price = parseFloat(data.pricePerHour as string);
    const location = data.location;
    const description = data.description;
        

    await createField({
      name:name.toLocaleLowerCase(),
      description,
      capacity,
      price_per_hour: price,
      location,
    });
    // Refresca la lista de campos para que aparezca el nuevo
    revalidatePath("/dashboard/campos");
    return { success: true };
  } catch (error) {
    return { success:false, error: "No se pudo crear el campo. Revisa los datos." };
  }
}





export async function getFields() {
  try {
    const data = await FieldService.getAll();

      const safeFields = data.map(c => ({
      ...c,
      price_per_hour: Number(c.price_per_hour)
    }));

    return { success: true, content: safeFields, error: null };
  } catch (e) {
    return { success: false, content: [], error: "Error al cargar campos" };
  }
}

// admin
export async function getFieldsAdmin() {
  try {
    const data = await FieldService.getAllAdmin();
    return { success: true, content: data, error: null };
  } catch (e) {
    return { success: false, content: [], error: "Error al cargar campos" };
  }
}

export async function getFieldIdReservations(fieldId: string, date: string) {
  try {
    const data = await FieldService.getReservationsByDay(fieldId, date);
    return { success:true, content: data };
  } catch (e) {
    return { status: false, error: e, data: [] };
  }
}

//cambiar de stado
export async function toggleStateFieldAction(fieldId: string) {
  try {
    const data = await FieldService.ToggleStateField(fieldId);
    if(!data){
      return { success: false, content: [], error:"error el servidor"};
    }

    revalidatePath(`/dashboard/campos/admin`)
    return { success: true, content:data };
  } catch (e) {
    return { success: false, content: [], error:e};
  }
}

// buscacr campo por id
export async function getFieldIdAction(fieldId:string) {
  try {
    const data = await FieldService.getFieldId(fieldId);

    const safeFieldId = { 
      ...data,
       price_per_hour: Number(data.price_per_hour),
       created_at: data.created_at.toISOString(),
       updated_at:data.updated_at.toISOString()
      }

    return { success: true, content: safeFieldId, error: null };
  } catch (e) {
    return { success: false, content: [], error: e };
  }
}


//actualizar
export async function updateFieldAction(id: string, data: any) {
  try {
    // 1. Extraer y convertir datos
    const name = data.name;
    const capacity = parseInt(data.capacity);
    const price = parseFloat(data.price_per_hour);
    const location = data.location;
    const description =data.description;
    //const state = data.this.state.first("state") === "on"; // Checkbox de Tailwind/HTML

    // 2. Ejecutar la actualización
    await FieldService.updateField(id, {
      name,
      capacity,
      price_per_hour: price,
      location,
      description,
    //  state,
    });

    // 3. Limpiar caché para que el usuario vea el cambio
    revalidatePath("/dashboard/campos");
    revalidatePath(`/dashboard/campos/${id}`);

    return { success: true, message: "Campo actualizado correctamente" };
  } catch (error) {
    console.error("Error en Action:", error);
    return { error: "Error al intentar actualizar el campo. Intenta de nuevo." };
  }
}

// eliminar campo

// buscacr campo por id
export async function deletedFieldIdAction(fieldId:string) {
  try {
    const data = await FieldService.deletedField(fieldId);
    if(data){
      revalidatePath("/dashboard/campos/admin")
    return { success: true };

    }
  } catch (e) {
    return { success: false,  error: e };
  }
}
