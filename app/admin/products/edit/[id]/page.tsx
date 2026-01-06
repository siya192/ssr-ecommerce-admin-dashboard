"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ================= SCHEMA ================= */
const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  price: z.number().positive("Price must be greater than 0"),
  quantity: z.number().int().nonnegative("Quantity cannot be negative"),
  category: z.string().min(2, "Category is required"),
});

type ProductForm = z.infer<typeof productSchema>;

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  /* 🔐 Admin protection */
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") router.push("/login");
  }, [router]);

  /* 📦 Fetch product */
  const { data, isLoading } = useSWR(
    id ? `/api/products/${id}` : null,
    fetcher
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  /* 🧠 Fill existing values */
  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("price", data.price);
      setValue("quantity", data.quantity);
      setValue("category", data.category);
    }
  }, [data, setValue]);

  /* ✏️ UPDATE PRODUCT */
  const onSubmit = async (formData: ProductForm) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    router.push("/admin/products");
  };

  const inputClass =
    "w-full border border-slate-300 rounded-lg px-4 py-2 " +
    "text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl bg-white p-8 rounded-2xl shadow-lg border">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Edit Product
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          className={inputClass}
          placeholder="Product Name"
          {...register("name")}
        />
        <p className="text-red-600 text-sm">{errors.name?.message}</p>

        <input
          type="number"
          className={inputClass}
          placeholder="Price"
          {...register("price", { valueAsNumber: true })}
        />
        <p className="text-red-600 text-sm">{errors.price?.message}</p>

        <input
          type="number"
          className={inputClass}
          placeholder="Quantity"
          {...register("quantity", { valueAsNumber: true })}
        />
        <p className="text-red-600 text-sm">{errors.quantity?.message}</p>

        <input
          className={inputClass}
          placeholder="Category"
          {...register("category")}
        />
        <p className="text-red-600 text-sm">{errors.category?.message}</p>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="w-1/3 border rounded-lg py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="w-2/3 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-semibold"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}




