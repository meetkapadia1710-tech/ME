"use client";

import { useRouter } from "next/navigation";
import { deleteProjectAction } from "@/app/admin/actions";
import { useState } from "react";

export default function DeleteButton({ id, type }: { id: number; type: "project" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    setLoading(true);
    const res = await deleteProjectAction(id);
    if (res?.success) {
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:underline text-sm font-medium disabled:opacity-50"
    >
      Delete
    </button>
  );
}
