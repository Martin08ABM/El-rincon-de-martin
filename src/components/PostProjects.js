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
    const image = document.getElementById("image").files[0];

    try {
      const imageName = `${Date.now()}-${image.name}`;
      const { data: imageData, error: imageError } = await supabase.storage
        .from("projects")
        .upload(imageName, image);

      if (imageError) {
        console.error("Error al subir la imagen:", imageError);
        alert("Hubo un error al subir la imagen. Por favor, inténtalo de nuevo.");
        return;
      }

      const { data: imageUrl } = await supabase.storage
        .from("projects")
        .getPublicUrl(imageName);

      const { data, error } = await supabase
        .from("postsProject")
        .insert([
          {
            title: title,
            explanation: explanation,
            link: link,
            image: imageUrl.publicUrl,
          },
        ]);

      if (error) {
        console.error("Error al insertar el proyecto:", error);
        alert("Hubo un error al subir el proyecto. Por favor, inténtalo de nuevo.");
      } else {
        alert("Proyecto subido con éxito.");
        console.info("Proyecto insertado:", data);
        form.reset();
      }
    } catch (err) {
      console.error("Error en la petición a Supabase:", err);
      alert("Ocurrió un error inesperado. Por favor, revisa la consola.");
    }
  });
}