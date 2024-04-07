import { NextRequest, NextResponse } from "next/server";
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req: NextRequest) => {
  const form = await req.formData();
  const images: File[] = [];

  form.forEach((item) => {
    const image = item as File;
    images.push(image);
  });

  for (let image of images) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const response: UploadApiResponse | UploadApiErrorResponse | undefined =
      await new Promise((resolve) => {
        cloudinary.uploader
          .upload_stream((error, result) => {
            if (error) {
              return resolve(error);
            }
            return resolve(result);
          })
          .end(buffer);
      });

    if (response?.http_code === 400) {
      return NextResponse.json({ error: response.message });
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Imágenes subidas correctamente",
  });
};
