"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { FormEvent, useState } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ButtonLoading from "@/components/Loading/ButtonLoading/button-loading";
import Image from "next/image";
import { Trash2 } from "lucide-react";

const FormUploadImages = () => {
  const router = useRouter();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formLoading, setFormLoading] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col gap-8 items-center justify-center">
      <form
        onSubmit={async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          if (imageFiles.length === 0) {
            toast.error("Debes cargar alguna imagen");
            return;
          }

          const validFileExtensions: { [key: string]: boolean } = {
            jpg: true,
            png: true,
            jpeg: true,
            bmp: true,
            webp: true,
          };
          for (let image of imageFiles) {
            const splitString = image.name.split(".");
            if (
              !validFileExtensions[`${splitString[splitString.length - 1]}`]
            ) {
              toast.error("Extensión de archivo no válida");
              return;
            }
          }

          setFormLoading(true);

          const formData = new FormData();
          const imagesForm = imageFiles?.forEach((image, i) =>
            formData.set(`image${i + 1}`, image)
          );

          try {
            const { data } = await axios.post("/api/images/upload", formData);

            if (data.error) {
              toast.error(data.error);
            } else if (data.ok) {
              toast.success(data.message);
              router.refresh();
            }
          } catch (error) {
            toast.error("Algo salió mal, vuelve a intentarlo");
          }

          setTimeout(() => {
            setFormLoading(false);
          }, 2100);
        }}
        className="space-y-4 w-full max-w-[400px]"
      >
        <Dropzone
          onDrop={(acceptedFiles) => {
            setImageFiles([...imageFiles, ...acceptedFiles]);
          }}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <section className={`relative w-full h-40`}>
              <div
                {...getRootProps()}
                className={`w-full h-full border border-dashed flex items-center justify-center cursor-pointer hover:border-[#b89d57] hover:text-[#b89d57] ${
                  isDragActive ? "bg-zinc-800" : ""
                } transition-all duration-300`}
              >
                <input {...getInputProps()} />
                <p className="max-w-[80%] text-center text-sm">
                  Haz click o arrastra archivos aquí para subirlos
                </p>
              </div>
            </section>
          )}
        </Dropzone>

        <div>
          {formLoading ? (
            <ButtonLoading />
          ) : (
            <Button type="submit">Enviar</Button>
          )}
        </div>
      </form>

      {!!imageFiles.length && (
        <div className="flex flex-col gap-8 items-center justify-center w-full">
          <h3 className="text-xl text-center font-medium">
            Vista previa de imagenes
          </h3>

          <div className="flex flex-wrap items-center justify-center w-full gap-6 max-w-[1000px] ">
            {imageFiles.map((image) => (
              <div
                className="relative min-w-[200px] max-w-[240px]"
                key={image.name}
              >
                <div
                  className="absolute rounded-full bg-red-500 p-1.5 -top-4 -right-4 cursor-pointer hover:scale-110 transition-all duration-300"
                  onClick={() => {
                    setImageFiles(
                      imageFiles.filter((file) => file.name !== image.name)
                    );
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </div>
                <Image
                  className="w-full"
                  src={URL.createObjectURL(image)}
                  width={200}
                  height={200}
                  alt={image.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormUploadImages;
