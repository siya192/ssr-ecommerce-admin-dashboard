import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/Product";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  req: Request,
  context: Context
) {
  await connectDB();

  const { id } = await context.params;
  const body = await req.json();

  const updated = await Product.findByIdAndUpdate(
    id,
    body,
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  context: Context
) {
  await connectDB();

  const { id } = await context.params;
  await Product.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}