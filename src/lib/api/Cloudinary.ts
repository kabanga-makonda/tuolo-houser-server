import cloudinay from "cloudinary";

cloudinay.v2.config({
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  cloud_name: process.env.CLOUDINARY_NAME,
});

export const Cloudinary = {
  upload: async (image: string): Promise<string> => {
    const res = await cloudinay.v2.uploader.upload(image, {
      folder: "TH_Assets/",
    });
    return res.secure_url;
  },
};
