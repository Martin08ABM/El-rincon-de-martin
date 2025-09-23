import { supabase } from "../lib/supabase";

export function mountFormHandler() {
  const form = document.getElementById("blog-form");
  if (!form) {
    console.error("Form with ID 'project-form' not found.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("explanation").value;
    const name = document.getElementById("name").value;

    try {
      const { data, error } = await supabase
        .from("postsBlog")
        .insert([
          { title: title, content: content, name: name },
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