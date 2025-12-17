'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "../hooks/useReviews";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface AddReviewDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddReviewDialog({
  productId,
  open,
  onOpenChange
}: AddReviewDialogProps) {
  const { mutate: createReview, isPending } = useCreateReview(productId);

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(productId, rating, comment);
    createReview(
      {
        productId,
        rating,
        comment,
      },
      {
        onError: (error: Error) => {
          console.error("Create review error:", error);
          toast.error(error.message || "Failed to submit review");
        },
        onSuccess: () => {
          toast.success("Review submitted successfully");
          setRating(0);
          setComment("");
          onOpenChange(false); // Đóng dialog sau khi submit thành công
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                className={`w-6 h-6 cursor-pointer ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isPending || rating === 0 || !comment.trim()}
            >
              {isPending ? <Spinner /> : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
