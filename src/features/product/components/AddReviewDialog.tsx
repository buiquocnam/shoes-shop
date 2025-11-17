'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MessageCircle, Star } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "../hooks/useReviews";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";


interface AddReviewDialogProps {
  productId: string;
}

export default function AddReviewDialog({ productId }: AddReviewDialogProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: createReview, isPending } = useCreateReview(productId);

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleOpen = () => {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(pathname || "/");
      router.push(`/login?callbackUrl=${callbackUrl}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createReview(
      {
        productId,
        rating,
        comment,
      },
      {
        onError: (error: Error) => {
          console.error("Create review error:", error);
        },
        onSuccess: () => {
          toast.success("Review submitted successfully");
          setRating(0);
          setComment("");
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={handleOpen}
          className=" gap-2 cursor-pointer border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-150 font-semibold px-5 py-2 rounded-full shadow"
        >
          <MessageCircle className="w-5 h-5" />
          Write a Review
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-center">
            Write a Review
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 cursor-pointer ${
                  i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(i + 1)}
                data-testid={`star-rating-${i + 1}`}
              />
            ))}
          </div>
          <Textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
            required
          />
          <DialogClose asChild>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? <Spinner /> : "Submit Review"}
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
