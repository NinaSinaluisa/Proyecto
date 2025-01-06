

with ada.Text_IO; use Ada.Text_IO;
with ada.numerics.discrete_random;
with Ada.Directories;
with Ada.Calendar; use Ada.Calendar;
with Ada.Calendar.Formatting;
use  Ada.Calendar.Formatting;

procedure ram is

   Fich : Ada.Text_IO.File_Type;

   -- Directorio donde se guardara el reporte
   Directorio : constant String := "C:\Users\ASUS\Downloads";

   -- Rango para la generacion de numeros random
   type randRange is new Integer range 1..100;
   package Rand_Int is new ada.numerics.discrete_random(randRange);
   use Rand_Int;

   -- Tareas con sus proridades
   task archivo is pragma Priority(20); end archivo;
   task lecturas is pragma Priority(10); end lecturas;

   -- Declaraciones
   Now : Time := Clock;
   gen : Generator;
   num : randRange;
   lim : Integer := 50;         -- Limite de lecturas
   del : Duration := 3.0;

   -- Cuerpos de las tareas

   -- Tarea para la creacion del archivo
   task body archivo is
   begin
      -- Seleccion del Directorio
      Ada.Directories.Set_Directory(Directorio);
      -- Creacion del Archivo
      Ada.Text_IO.Create(Fich, Ada.Text_IO.Out_File, "Reporte.txt");
      Ada.Text_IO.Put(Fich, "Reporte: Procentaje de Uso de la Memoria RAM - "& Image (Now));
      -- Cierre del archivo creado
      Ada.Text_IO.Close(Fich);
   end archivo;

   -- Tarea para la simulacion y almacenamiento de lecturas.
   task body lecturas is
   begin
      for I in 1..lim loop
         -- Generacion y muestra de los random generados
         reset(gen);
         num := random(gen);
         put_line("El porcentaje de uso es: " & randRange'Image(num));
         New_Line;

         -- Abrimos el archivo y vamos guardando cada lectura
         Ada.Text_IO.Open(Fich, Mode => Append_File, Name => "Reporte.txt");
         Ada.Text_IO.Put(Fich, "Porcentaje de uso: " & randRange'Image(num));

         -- Lecturas bajas (Abrimos el reporte)
         if num<=20 then
            --Ada.Text_IO.Open(Fich, Ada.Text_IO.In_File, "Reporte.txt");
            --Put("Reporte generado");
            del := 3.0;
         end if;

         -- Lecturas Medias (Aumenta la frecuencia de lecturas)
         if num>=25 and num<=75 then
            --del := del - 0.2;
            --del := del/2;
            del := 0.8;
         end if;

         -- Lecturas Altas (Alerta)
         if num >90 then
            Put_Line("!!!ALERTA DEMASIADO USO DE LA RAM!!!");
            Put_Line("!!!CIERRE LAS APLICACIONES ABIERTAS PARA LIBERAR MEMORIA!!!");
            New_Line;
            delay 4.0;
         end if;

         -- Cerramos el archivo
         Ada.Text_IO.Close(Fich);

         -- Tiempo de espera
         delay del;
      end loop;

   end lecturas;

begin
   null;
end ram;



