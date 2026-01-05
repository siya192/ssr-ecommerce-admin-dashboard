"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

/* ================= SCHEMA ================= */
const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  price: z.number().positive("Price must be greater than 0"),
  quantity: z.number().int().nonnegative("Quantity cannot be negative"),
  category: z.string().min(2, "Category is required"),
  image: z.string().min(1, "Image is required"),
});

type ProductForm = z.infer<typeof productSchema>;

/* ================= PAGE ================= */
export default function NewProductPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  /* ============== CLOUDINARY UPLOAD ============== */
  const uploadImage = async (file: File) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "products_upload"); // ✅ EXACT preset name

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlev9xgxp/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      setUploading(false);
      alert("❌ Image upload failed. Check preset / cloud name.");
      return;
    }

    const data = await res.json();

    setValue("image", data.secure_url, { shouldValidate: true });
    setUploadedImage(data.secure_url);
    setUploading(false);
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async (data: ProductForm) => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  
    router.push("/admin/products");
  };
  
  /* ================= STYLES ================= */
  const inputClass =
    "w-full border border-slate-300 rounded-lg px-4 py-2 " +
    "text-slate-900 bg-white placeholder:text-slate-500 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-500";

  /* ================= JSX ================= */
  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="mb-6">
        <span className="inline-block mb-2 px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full">
          Step {step} of 2
        </span>

        <h1 className="text-3xl font-bold text-slate-900">
          Add New Product
        </h1>
        <p className="text-slate-700 mt-1">
          Enter product details carefully
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ========== STEP 1 ========== */}
          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="font-medium text-slate-800">
                  Product Name
                </label>
                <input
                  className={inputClass}
                  placeholder="Eg. Ring"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="font-medium text-slate-800">
                  Price (₹)
                </label>
                <input
                  type="number"
                  className={inputClass}
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={async () => {
                  const ok = await trigger(["name", "price"]);
                  if (ok) setStep(2);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                Continue →
              </button>
            </>
          )}

          {/* ========== STEP 2 ========== */}
          {step === 2 && (
            <>
              <div className="mb-4">
                <label className="font-medium text-slate-800">
                  Quantity
                </label>
                <input
                  type="number"
                  className={inputClass}
                  {...register("quantity", { valueAsNumber: true })}
                />
                {errors.quantity && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="font-medium text-slate-800">
                  Category
                </label>
                <input
                  className={inputClass}
                  placeholder="Eg. Accessory"
                  {...register("category")}
                />
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* ===== IMAGE UPLOAD ===== */}
              <label className="block mt-4 mb-2 font-medium text-slate-800">
                Product Image
              </label>

              <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center bg-blue-50">
                <input
                  type="file"
                  accept="image/*"
                  id="imageUpload"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && uploadImage(e.target.files[0])
                  }
                />

                {!uploadedImage ? (
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <span className="text-4xl">📸</span>
                    <span className="text-slate-900 font-semibold">
                      Click to upload image
                    </span>
                    <span className="text-sm text-slate-700">
                      JPG / PNG • Max 5MB
                    </span>
                  </label>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-28 h-28 object-cover rounded-lg border"
                    />
                    <span className="text-green-600 font-semibold">
                      ✅ Uploaded successfully
                    </span>
                  </div>
                )}
              </div>

              {uploading && (
                <p className="text-blue-600 mt-2 font-medium">
                  Uploading image…
                </p>
              )}

              {errors.image && (
                <p className="text-red-600 text-sm mt-2">
                  {errors.image.message}
                </p>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-slate-300 py-2 rounded-lg text-slate-800 font-medium"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  className="w-2/3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
                >
                  Create Product
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}










