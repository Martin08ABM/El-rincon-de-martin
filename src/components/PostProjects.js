import { supabase } from "../lib/supabase";

export function mountFormHandler() {
  const form = document.getElementById("project-form");
  if (!form) {
    console.error("Form with ID 'project-form' not found.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const explanation = document.getElementById("explanation").value;
    const link = document.getElementById("link").value;
    const imageFile = document.getElementById("images").files[0];

    if (!imageFile) {
      alert("Por favor, selecciona una imagen.");
      return;
    }

    // Generate a unique file path
    const filePath = `public/${Date.now()}-${imageFile.name}`;

    try {
      // 1. Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Error al subir la imagen:", uploadError);
        alert("Hubo un error al subir la imagen. Por favor, inténtalo de nuevo.");
        return;
      }

      // 2. Get the public URL of the uploaded image
      const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // 3. Insert project data into the database
      const { data, error } = await supabase
        .from("uploadProjects")
        .insert([
          { title: title, explanation: explanation, link: link, images: imageUrl },
        ]);

      if (error) {
        console.error("Error al insertar el post:", error);
        alert("Hubo un error al subir el post. Por favor, inténtalo de nuevo.");
      } else {
        alert("Post subido con éxito.");
        console.info("Post insertado:", data);
        form.reset();
      }
    } catch (err) {
      console.error("Error en la petición a Supabase:", err);
      alert("Ocurrió un error inesperado. Por favor, revisa la consola.");
    }
  });
}